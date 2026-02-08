import { prisma } from '../lib/prisma';
import { env } from '../lib/env';
import { request as undiciRequest } from 'undici';

type Kline = [number, string, string, string, string, string, number, string, number, string, string, string];

function intervalMs(interval: string) {
  const map: Record<string, number> = {
    '1m': 60_000,
    '5m': 5 * 60_000,
    '15m': 15 * 60_000,
    '1h': 60 * 60_000,
    '4h': 4 * 60 * 60_000,
    '1d': 24 * 60 * 60_000,
  };
  return map[interval] || 60_000;
}

function seededRandom(seed: string) {
  // xorshift-ish deterministic
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = (h ^ seed.charCodeAt(i)) * 16777619;
  return () => {
    h ^= h << 13; h ^= h >> 17; h ^= h << 5;
    const v = (h >>> 0) / 0xFFFFFFFF;
    return v;
  };
}

function syntheticBasePrice(symbol: string) {
  const base = symbol.replace('USDT', '').replace('USDC', '');
  const map: Record<string, number> = { BTC: 62000, ETH: 3200, SOL: 140, LINK: 18, USDT: 1, USDC: 1 };
  return map[base] || 50;
}

export async function ensureCandles(symbol: string, interval: string, limit = 120) {
  const market = await prisma.market.findUnique({ where: { symbol } });
  if (!market) throw new Error('Unknown market');

  // If we have enough recent candles, return from DB
  const existing = await prisma.candle.findMany({
    where: { marketId: market.id, interval },
    orderBy: { openTime: 'desc' },
    take: limit,
  });

  const need = limit - existing.length;
  const ms = intervalMs(interval);

  const newest = existing[0]?.openTime?.getTime() ?? 0;
  const now = Date.now();
  const latestSlot = Math.floor(now / ms) * ms;

  const isFresh = newest >= latestSlot - (ms * 2);

  if (existing.length >= limit && isFresh) {
    return existing.reverse();
  }

  // fetch/generate missing
  if ((env.MARKET_DATA_PROVIDER || market.provider) === 'binance') {
    await fetchBinanceAndUpsert(market.id, symbol, interval, limit);
  } else {
    await generateSyntheticAndUpsert(market.id, symbol, interval, limit);
  }

  const after = await prisma.candle.findMany({
    where: { marketId: market.id, interval },
    orderBy: { openTime: 'desc' },
    take: limit,
  });

  return after.reverse();
}

async function fetchBinanceAndUpsert(marketId: string, symbol: string, interval: string, limit: number) {
  const url = new URL('/api/v3/klines', env.BINANCE_BASE_URL);
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('interval', interval);
  url.searchParams.set('limit', String(Math.min(limit, 1000)));

  const { body, statusCode } = await undiciRequest(url.toString(), { method: 'GET' });
  if (statusCode >= 400) throw new Error('Binance error ' + statusCode);

  const data = (await body.json()) as Kline[];

  for (const k of data) {
    const openTime = new Date(k[0]);
    const closeTime = new Date(k[6]);
    const open = Number(k[1]);
    const high = Number(k[2]);
    const low = Number(k[3]);
    const close = Number(k[4]);
    const volume = Number(k[5]);

    await prisma.candle.upsert({
      where: { marketId_interval_openTime: { marketId, interval, openTime } },
      update: { closeTime, open, high, low, close, volume, source: 'binance' },
      create: { marketId, interval, openTime, closeTime, open, high, low, close, volume, source: 'binance' },
    });
  }
}

async function generateSyntheticAndUpsert(marketId: string, symbol: string, interval: string, limit: number) {
  const ms = intervalMs(interval);
  const r = seededRandom(symbol + ':' + interval);
  const basePrice = syntheticBasePrice(symbol);
  const now = Date.now();
  const latestSlot = Math.floor(now / ms) * ms;

  // Start point
  let price = basePrice * (0.9 + r() * 0.25);
  const drift = (r() - 0.5) * 0.002; // slight drift
  const volBase = 1 + r() * 2;

  const candles = [];
  for (let i = limit - 1; i >= 0; i--) {
    const t = latestSlot - i * ms;
    const noise = (r() - 0.5) * 0.02;
    const move = drift + noise;
    const open = price;
    const close = Math.max(0.0001, open * (1 + move));
    const high = Math.max(open, close) * (1 + r() * 0.01);
    const low = Math.min(open, close) * (1 - r() * 0.01);
    const volume = volBase * (0.5 + r() * 2) * (symbol.startsWith('BTC') ? 100 : 1000);

    price = close;

    candles.push({
      openTime: new Date(t),
      closeTime: new Date(t + ms - 1),
      open, high, low, close, volume
    });
  }

  for (const c of candles) {
    await prisma.candle.upsert({
      where: { marketId_interval_openTime: { marketId, interval, openTime: c.openTime } },
      update: { closeTime: c.closeTime, open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume, source: 'synthetic' },
      create: { marketId, interval, openTime: c.openTime, closeTime: c.closeTime, open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume, source: 'synthetic' },
    });
  }
}

export async function getLatestPriceAndChange24h(symbol: string) {
  // Use 1h candles for 24h change; fallback 1d
  const candles = await ensureCandles(symbol, '1h', 30);
  if (candles.length < 2) {
    const d = await ensureCandles(symbol, '1d', 2);
    const last = d[d.length - 1];
    const prev = d[0];
    const price = last?.close ?? 0;
    const change = prev ? ((price - prev.open) / prev.open) * 100 : 0;
    return { price, change24h: change };
  }

  const last = candles[candles.length - 1];
  const compare = candles[Math.max(0, candles.length - 25)]; // ~24h
  const price = last.close;
  const change = compare ? ((price - compare.open) / compare.open) * 100 : 0;
  return { price, change24h: change };
}
