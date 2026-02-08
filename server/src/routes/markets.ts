import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { badRequest, notFound, ok } from '../lib/http';
import { ensureCandles, getLatestPriceAndChange24h } from '../services/marketData';
import { listMarketsWithStats } from '../services/prices';

export async function marketsRoutes(app: FastifyInstance) {
  app.get('/markets', async (_req, reply) => {
    const markets = await listMarketsWithStats();
    return ok(reply, { markets });
  });

  app.get('/markets/:symbol', async (req, reply) => {
    const symbol = (req.params as any).symbol as string;
    const market = await prisma.market.findUnique({
      where: { symbol },
      include: { baseAsset: true, quoteAsset: true },
    });
    if (!market) return notFound(reply, 'Market not found');

    const s = await getLatestPriceAndChange24h(market.symbol);

    return ok(reply, {
      market: {
        id: market.id,
        symbol: market.symbol,
        base: market.baseAsset.symbol,
        quote: market.quoteAsset.symbol,
        price: s.price,
        change24h: s.change24h,
      },
    });
  });

  app.get('/markets/:symbol/candles', async (req, reply) => {
    const symbol = (req.params as any).symbol as string;
    const Query = z.object({
      interval: z.string().default('1h'),
      limit: z.coerce.number().min(10).max(500).default(140),
    });
    const parsed = Query.safeParse(req.query);
    if (!parsed.success) return badRequest(reply, 'Invalid query', parsed.error.flatten());

    const { interval, limit } = parsed.data;
    const candles = await ensureCandles(symbol, interval, limit);

    return ok(reply, {
      candles: candles.map(c => ({
        t: c.openTime.getTime(),
        o: c.open,
        h: c.high,
        l: c.low,
        c: c.close,
        v: c.volume,
      })),
    });
  });
}
