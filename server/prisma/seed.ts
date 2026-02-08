import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function ensureAsset(symbol: string, name: string, decimals = 8) {
  return prisma.asset.upsert({
    where: { symbol },
    update: { name, decimals },
    create: { symbol, name, decimals },
  });
}

async function ensureMarket(symbol: string, baseSymbol: string, quoteSymbol: string, provider = process.env.MARKET_DATA_PROVIDER || 'synthetic') {
  const base = await prisma.asset.findUnique({ where: { symbol: baseSymbol } });
  const quote = await prisma.asset.findUnique({ where: { symbol: quoteSymbol } });
  if (!base || !quote) throw new Error('Missing assets for market ' + symbol);

  return prisma.market.upsert({
    where: { symbol },
    update: { provider },
    create: { symbol, baseAssetId: base.id, quoteAssetId: quote.id, provider },
  });
}

async function ensureUser(email: string, name: string, password: string) {
  const hash = await bcrypt.hash(password, 10);
  return prisma.user.upsert({
    where: { email },
    update: { name, passwordHash: hash },
    create: { email, name, passwordHash: hash },
  });
}

async function ensureWallet(userId: string, assetSymbol: string, balance: number) {
  const asset = await prisma.asset.findUnique({ where: { symbol: assetSymbol } });
  if (!asset) throw new Error('Missing asset ' + assetSymbol);
  return prisma.wallet.upsert({
    where: { userId_assetId: { userId, assetId: asset.id } },
    update: { balance },
    create: { userId, assetId: asset.id, balance },
  });
}

async function main() {
  // Roles/permissions minimal
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', description: 'Full access' },
  });
  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user', description: 'Standard user' },
  });

  // Assets
  await ensureAsset('USDT', 'Tether', 6);
  await ensureAsset('USDC', 'USD Coin', 6);
  await ensureAsset('BTC', 'Bitcoin', 8);
  await ensureAsset('ETH', 'Ethereum', 8);
  await ensureAsset('SOL', 'Solana', 8);
  await ensureAsset('LINK', 'Chainlink', 8);

  // Markets
  await ensureMarket('BTCUSDT', 'BTC', 'USDT');
  await ensureMarket('ETHUSDT', 'ETH', 'USDT');
  await ensureMarket('SOLUSDT', 'SOL', 'USDT');
  await ensureMarket('LINKUSDT', 'LINK', 'USDT');
  await ensureMarket('BTCUSDC', 'BTC', 'USDC');
  await ensureMarket('ETHUSDC', 'ETH', 'USDC');

  // Users
  const demo = await ensureUser('demo@zve.app', 'Demo User', 'demo1234');
  const demo2 = await ensureUser('demo2@zve.app', 'Demo User 2', 'demo1234');

  // User roles
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: demo.id, roleId: adminRole.id } },
    update: {},
    create: { userId: demo.id, roleId: adminRole.id },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: demo.id, roleId: userRole.id } },
    update: {},
    create: { userId: demo.id, roleId: userRole.id },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: demo2.id, roleId: userRole.id } },
    update: {},
    create: { userId: demo2.id, roleId: userRole.id },
  });

  // Wallets with starter balances
  await ensureWallet(demo.id, 'USDT', 500);
  await ensureWallet(demo.id, 'BTC', 0.02);
  await ensureWallet(demo.id, 'ETH', 0.4);
  await ensureWallet(demo.id, 'SOL', 15);
  await ensureWallet(demo.id, 'LINK', 120);

  await ensureWallet(demo2.id, 'USDT', 150);
  await ensureWallet(demo2.id, 'ETH', 0.1);

  // Notifications
  await prisma.notification.createMany({
    data: [
      { userId: demo.id, title: 'Bienvenido a ZVE', body: 'Demo lista. Configura provider=binance si quieres datos reales.', type: 'info' },
      { userId: demo.id, title: 'Tip', body: 'Prueba Swap en /app/trade y revisa Activity.', type: 'tip' },
    ],
    skipDuplicates: true,
  });

  console.log('Seed OK');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
