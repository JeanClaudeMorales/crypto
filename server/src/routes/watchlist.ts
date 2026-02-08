import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { badRequest, ok, unauthorized } from '../lib/http';
import { getUserId } from '../lib/auth';
import { getLatestPriceAndChange24h } from '../services/marketData';

const SymSchema = z.object({ symbol: z.string().min(3).max(20) });

export async function watchlistRoutes(app: FastifyInstance) {
  app.get('/watchlist', { preHandler: app.auth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return unauthorized(reply);

    const items = await prisma.watchlistItem.findMany({
      where: { userId },
      include: { market: { include: { baseAsset: true, quoteAsset: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const out = [];
    for (const it of items) {
      const s = await getLatestPriceAndChange24h(it.market.symbol);
      out.push({
        id: it.market.id,
        symbol: it.market.symbol,
        base: it.market.baseAsset.symbol,
        quote: it.market.quoteAsset.symbol,
        price: s.price,
        change24h: s.change24h,
      });
    }

    return ok(reply, { items: out });
  });

  app.post('/watchlist/add', { preHandler: app.auth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return unauthorized(reply);

    const parsed = SymSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(reply, 'Invalid payload', parsed.error.flatten());

    const market = await prisma.market.findUnique({ where: { symbol: parsed.data.symbol } });
    if (!market) return badRequest(reply, 'Unknown market');

    await prisma.watchlistItem.upsert({
      where: { userId_marketId: { userId, marketId: market.id } },
      update: {},
      create: { userId, marketId: market.id },
    });

    return ok(reply, { ok: true });
  });

  app.post('/watchlist/remove', { preHandler: app.auth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return unauthorized(reply);

    const parsed = SymSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(reply, 'Invalid payload', parsed.error.flatten());

    const market = await prisma.market.findUnique({ where: { symbol: parsed.data.symbol } });
    if (!market) return ok(reply, { ok: true });

    await prisma.watchlistItem.deleteMany({ where: { userId, marketId: market.id } });
    return ok(reply, { ok: true });
  });
}
