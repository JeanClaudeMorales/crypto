import { prisma } from '../lib/prisma';

export async function getOrCreateWallet(userId: string, assetSymbol: string) {
  const asset = await prisma.asset.findUnique({ where: { symbol: assetSymbol } });
  if (!asset) throw new Error('Unknown asset: ' + assetSymbol);

  const wallet = await prisma.wallet.upsert({
    where: { userId_assetId: { userId, assetId: asset.id } },
    update: {},
    create: { userId, assetId: asset.id, balance: 0 },
  });

  return { wallet, asset };
}

export async function adjustBalance(userId: string, assetSymbol: string, delta: number) {
  const { wallet, asset } = await getOrCreateWallet(userId, assetSymbol);

  const next = wallet.balance + delta;
  if (next < -1e-9) throw new Error('INSUFFICIENT_FUNDS');

  const updated = await prisma.wallet.update({
    where: { id: wallet.id },
    data: { balance: next },
  });

  return { wallet: updated, asset };
}
