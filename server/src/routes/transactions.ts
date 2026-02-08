import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { badRequest, ok, unauthorized } from '../lib/http';
import { getUserId } from '../lib/auth';
import { adjustBalance } from '../services/wallet';
import { assetUsdPrice } from '../services/prices';

const DepositSchema = z.object({
  asset: z.string().min(2).max(10),
  amount: z.number().positive(),
  network: z.string().max(32).optional(),
});

const WithdrawSchema = z.object({
  asset: z.string().min(2).max(10),
  amount: z.number().positive(),
  address: z.string().min(10).max(200),
  network: z.string().max(32).optional(),
});

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/transactions', { preHandler: app.auth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return unauthorized(reply);

    const txs = await prisma.transaction.findMany({
      where: { userId },
      include: { asset: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return ok(reply, {
      transactions: txs.map(tx => ({
        id: tx.id,
        type: tx.type,
        status: tx.status,
        asset: tx.asset.symbol,
        amount: tx.amount,
        amountUsd: tx.amountUsd,
        createdAt: tx.createdAt.toISOString(),
        meta: tx.meta,
      })),
    });
  });

  app.post('/transactions/deposit', { preHandler: app.auth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return unauthorized(reply);

    const parsed = DepositSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(reply, 'Invalid payload', parsed.error.flatten());

    const { asset, amount, network } = parsed.data;
    const price = await assetUsdPrice(asset);

    await adjustBalance(userId, asset, amount);

    const a = await prisma.asset.findUnique({ where: { symbol: asset } });
    if (!a) return badRequest(reply, 'Unknown asset');

    const tx = await prisma.transaction.create({
      data: {
        userId,
        assetId: a.id,
        type: 'deposit',
        status: 'completed',
        amount,
        amountUsd: amount * price.price,
        network,
      },
    });

    await prisma.notification.create({
      data: { userId, type: 'tx', title: 'Depósito recibido', body: `${amount} ${asset} acreditado.` },
    });

    return ok(reply, { id: tx.id });
  });

  app.post('/transactions/withdraw', { preHandler: app.auth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return unauthorized(reply);

    const parsed = WithdrawSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(reply, 'Invalid payload', parsed.error.flatten());

    const { asset, amount, address, network } = parsed.data;
    const price = await assetUsdPrice(asset);

    try {
      await adjustBalance(userId, asset, -amount);
    } catch (e: any) {
      if (String(e?.message || '').includes('INSUFFICIENT_FUNDS')) return badRequest(reply, 'Insufficient funds');
      return badRequest(reply, 'Could not withdraw');
    }

    const a = await prisma.asset.findUnique({ where: { symbol: asset } });
    if (!a) return badRequest(reply, 'Unknown asset');

    const tx = await prisma.transaction.create({
      data: {
        userId,
        assetId: a.id,
        type: 'withdraw',
        status: 'completed',
        amount: -amount,
        amountUsd: -amount * price.price,
        address,
        network,
      },
    });

    await prisma.notification.create({
      data: { userId, type: 'tx', title: 'Retiro procesado', body: `${amount} ${asset} enviado.` },
    });

    return ok(reply, { id: tx.id });
  });
}
