import { prisma } from '../lib/prisma';
import { getLatestPriceAndChange24h } from './marketData';

export async function assetUsdPrice(assetSymbol: string) {
  if (assetSymbol === 'USDT' || assetSymbol === 'USDC') return { price: 1, change24h: 0, marketSymbol: assetSymbol + 'USDT' };

  // Prefer USDT market, fallback USDC
  const m1 = await prisma.market.findUnique({ where: { symbol: assetSymbol + 'USDT' } });
  const m2 = await prisma.market.findUnique({ where: { symbol: assetSymbol + 'USDC' } });
  const symbol = m1?.symbol || m2?.symbol;
  if (!symbol) return { price: 0, change24h: 0, marketSymbol: null };

  const p = await getLatestPriceAndChange24h(symbol);
  return { price: p.price, change24h: p.change24h, marketSymbol: symbol };
}

export async function listMarketsWithStats() {
  const markets = await prisma.market.findMany({
    include: { baseAsset: true, quoteAsset: true },
    orderBy: { symbol: 'asc' },
  });

  const out = [];
  for (const m of markets) {
    const s = await getLatestPriceAndChange24h(m.symbol);
    out.push({
      id: m.id,
      symbol: m.symbol,
      base: m.baseAsset.symbol,
      quote: m.quoteAsset.symbol,
      price: s.price,
      change24h: s.change24h,
    });
  }
  return out;
}
