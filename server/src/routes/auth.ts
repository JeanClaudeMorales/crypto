import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

import { prisma } from '../lib/prisma';
import { env } from '../lib/env';
import { badRequest, ok, unauthorized } from '../lib/http';
import { randomToken, sha256 } from '../lib/crypto';

const RegisterSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(190),
  password: z.string().min(6).max(200),
});

const LoginSchema = z.object({
  email: z.string().email().max(190),
  password: z.string().min(1),
});

const RefreshSchema = z.object({
  refreshToken: z.string().min(10),
});

async function issueTokens(app: FastifyInstance, user: { id: string; email: string }) {
  const accessToken = await app.jwt.sign({ sub: user.id, email: user.email }, { expiresIn: '15m' });

  const refreshToken = randomToken(32);
  const tokenHash = sha256(refreshToken);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60_000);

  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });

  return { accessToken, refreshToken };
}

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (req, reply) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(reply, 'Invalid payload', parsed.error.flatten());

    const { name, email, password } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return badRequest(reply, 'Email already exists');

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, email: true, name: true },
    });

    // Create default wallets
    const usdt = await prisma.asset.findUnique({ where: { symbol: 'USDT' } });
    if (usdt) {
      await prisma.wallet.upsert({
        where: { userId_assetId: { userId: user.id, assetId: usdt.id } },
        update: {},
        create: { userId: user.id, assetId: usdt.id, balance: 0 },
      });
    }

    await prisma.notification.create({
      data: { userId: user.id, type: 'info', title: 'Bienvenido', body: 'Cuenta creada. Esto es demo no-custodia.' },
    });

    const tokens = await issueTokens(app, user);

    return ok(reply, { ...tokens, user });
  });

  app.post('/auth/login', async (req, reply) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(reply, 'Invalid payload', parsed.error.flatten());

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return unauthorized(reply, 'Invalid credentials');

    const okPass = await bcrypt.compare(password, user.passwordHash);
    if (!okPass) return unauthorized(reply, 'Invalid credentials');

    const tokens = await issueTokens(app, user);

    return ok(reply, {
      ...tokens,
      user: { id: user.id, email: user.email, name: user.name },
    });
  });

  app.post('/auth/refresh', async (req, reply) => {
    const parsed = RefreshSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(reply, 'Invalid payload', parsed.error.flatten());

    const { refreshToken } = parsed.data;
    const tokenHash = sha256(refreshToken);

    const token = await prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!token) return unauthorized(reply, 'Invalid refresh token');
    if (token.revokedAt) return unauthorized(reply, 'Refresh token revoked');
    if (token.expiresAt.getTime() < Date.now()) return unauthorized(reply, 'Refresh token expired');

    // Rotate: revoke old, create new
    await prisma.refreshToken.update({
      where: { id: token.id },
      data: { revokedAt: new Date() },
    });

    const user = await prisma.user.findUnique({ where: { id: token.userId }, select: { id: true, email: true, name: true } });
    if (!user) return unauthorized(reply, 'Invalid token owner');

    const tokens = await issueTokens(app, user);

    return ok(reply, { ...tokens, user });
  });
}
