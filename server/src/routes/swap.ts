import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { badRequest, ok, unauthorized } from '../lib/http';
import { getUserId } from '../lib/auth';
import { adjustBalance } from '../services/wallet';
import { assetUsdPrice } from '../services/prices';
import { getLatestPriceAndChange24h } from '../services/marketData';

const QuoteSchema = z.object({
  fromAsset: z.string().min(2).max(10),
  toAsset: z.string().min(2).max(10),
  fromAmount: z.number().positive(),
  slippageBps: z.number().int().min(0).max(500).optional(),
});

function normalizeSymbol(a: string) {
  return a.trim().toUpperCase();
}

async function resolveDirectPrice(fromAsset: string, toAsset: string) {
  // Returns price: 1 fromAsset == price toAsset (approx)
  // Prefer direct market base=from quote=to => symbol from+to
  const direct1 = await prisma.market.findUnique({ where: { symbol: fromAsset + toAsset } });
  if (direct1) {
    const p = await getLatestPriceAndChange24h(direct1.symbol);
    return { price: p.price, via: direct1.symbol, inverted: false };
  }
  const direct2 = await prisma.market.findUnique({ where: { symbol: toAsset + fromAsset } });
  if (direct2) {
    const p = await getLatestPriceAndChange24h(direct2.symbol);
    // direct2 price is fromAsset per toAsset, so invert to get toAsset per fromAsset
    return { price: 1 / p.price, via: direct2.symbol, inverted: true };
  }
  return null;
}

async function quoteSwap(fromAsset: string, toAsset: string, fromAmount: number, slippageBps = 50) {
  fromAsset = normalizeSymbol(fromAsset);
  toAsset = normalizeSymbol(toAsset);

  if (fromAsset === toAsset) throw new Error('Same asset');

  // Determine price path
  const direct = await resolveDirectPrice(fromAsset, toAsset);

  // Fee in USD (0.20%)
  const fromUsd = (await assetUsdPrice(fromAsset)).price * fromAmount;
  const feeUsd = Math.max(0, fromUsd * 0.002);

  let toAmountBeforeSlip: number;
  let price: number;
  let route: string;

  if (direct) {
    price = direct.price;
    route = direct.via;
    toAmountBeforeSlip = fromAmount * price;
  } else {
    // Route via USDT
    const mid = 'USDT';
    const p1 = await resolveDirectPrice(fromAsset, mid);
    const p2 = await resolveDirectPrice(mid, toAsset);
    if (!p1 || !p2) throw new Error('No route');

    // fromAsset -> USDT -> toAsset
    const usdt = fromAmount * p1.price;
    price = (usdt / fromAmount) * p2.price; // overall toAsset per fromAsset
    route = `${p1.via} + ${p2.via}`;
    toAmountBeforeSlip = usdt * p2.price;
  }

  // Apply fee by reducing USD value
  const toUsdBeforeSlip = fromUsd - feeUsd;
  const toUsdPrice = (await assetUsdPrice(toAsset)).price || (toUsdBeforeSlip / Math.max(toAmountBeforeSlip, 1e-9));
  const toAmountFeeAdjusted = toUsdBeforeSlip / Math.max(toUsdPrice, 1e-9);

  // Slippage reduces output amount
  const toAmount = toAmountFeeAdjusted * (1 - slippageBps / 10_000);

  return {
    fromAsset,
    toAsset,
    fromAmount,
    toAmount,
    price,
    feeUsd,
    slippageBps,
    route,
  };
}

export async function swapRoutes(app: FastifyInstance) {
  app.post('/swap/quote', { preHandler: app.auth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return unauthorized(reply);

    const parsed = QuoteSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(reply, 'Invalid payload', parsed.error.flatten());

    try {
      const q = await quoteSwap(parsed.data.fromAsset, parsed.data.toAsset, parsed.data.fromAmount, parsed.data.slippageBps ?? 50);
      return ok(reply, { quote: { ...q } });
    } catch (e: any) {
      return badRequest(reply, 'Could not quote swap', { message: String(e?.message || e) });
    }
  });

  app.post('/swap', { preHandler: app.auth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return unauthorized(reply);

    const parsed = QuoteSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(reply, 'Invalid payload', parsed.error.flatten());

    const { fromAsset, toAsset, fromAmount } = parsed.data;
    const slippageBps = parsed.data.slippageBps ?? 50;

    let q;
    try {
      q = await quoteSwap(fromAsset, toAsset, fromAmount, slippageBps);
    } catch (e: any) {
      return badRequest(reply, 'Could not execute', { message: String(e?.message || e) });
    }

    // Balance changes
    try {
      await adjustBalance(userId, q.fromAsset, -q.fromAmount);
      await adjustBalance(userId, q.toAsset, q.toAmount);
    } catch (e: any) {
      return badRequest(reply, 'Insufficient funds or invalid asset', { message: String(e?.message || e) });
    }

    const aFrom = await prisma.asset.findUnique({ where: { symbol: q.fromAsset } });
    const aTo = await prisma.asset.findUnique({ where: { symbol: q.toAsset } });
    if (!aFrom || !aTo) return badRequest(reply, 'Unknown asset');

    const order = await prisma.order.create({
      data: {
        userId,
        kind: 'swap',
        fromAssetId: aFrom.id,
        toAssetId: aTo.id,
        fromAmount: q.fromAmount,
        toAmount: q.toAmount,
        quotePrice: q.price,
        feeUsd: q.feeUsd,
        slippageBps: q.slippageBps,
      },
    });

    // transactions (2 entries)
    const fromUsd = (await assetUsdPrice(q.fromAsset)).price * q.fromAmount;
    const toUsd = (await assetUsdPrice(q.toAsset)).price * q.toAmount;

    await prisma.transaction.createMany({
      data: [
        {
          userId,
          assetId: aFrom.id,
          type: 'swap',
          status: 'completed',
          amount: -q.fromAmount,
          amountUsd: -fromUsd,
          meta: { side: 'from', orderId: order.id, toAsset: q.toAsset, route: q.route },
        },
        {
          userId,
          assetId: aTo.id,
          type: 'swap',
          status: 'completed',
          amount: q.toAmount,
          amountUsd: toUsd,
          meta: { side: 'to', orderId: order.id, fromAsset: q.fromAsset, route: q.route },
        },
      ],
    });

    await prisma.notification.create({
      data: { userId, type: 'tx', title: 'Swap completado', body: `${q.fromAmount} ${q.fromAsset} → ${q.toAmount.toFixed(6)} ${q.toAsset}` },
    });

    return ok(reply, { orderId: order.id });
  });
}
