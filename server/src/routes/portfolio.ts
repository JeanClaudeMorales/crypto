import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { ok, unauthorized } from '../lib/http';
import { getUserId } from '../lib/auth';
import { assetUsdPrice } from '../services/prices';

export async function portfolioRoutes(app: FastifyInstance) {
  app.get('/portfolio/holdings', { preHandler: app.auth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return unauthorized(reply);

    const wallets = await prisma.wallet.findMany({
      where: { userId },
      include: { asset: true },
      orderBy: { asset: { symbol: 'asc' } },
    });

    const holdings = [];
    let totalUsd = 0;

    for (const w of wallets) {
      const p = await assetUsdPrice(w.asset.symbol);
      const balanceUsd = w.balance * p.price;
      totalUsd += balanceUsd;

      holdings.push({
        asset: w.asset.symbol,
        balance: w.balance,
        balanceUsd,
        price: p.price,
        change24h: p.change24h,
      });
    }

    return ok(reply, { holdings, totalUsd });
  });
}
