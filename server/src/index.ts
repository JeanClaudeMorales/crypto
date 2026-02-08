import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { env } from './lib/env.js';
import { registerAuthDecorators } from './lib/auth.js';
import { getRedisClient } from './lib/redis.js';

import { authRoutes } from './routes/auth.js';
import { meRoutes } from './routes/me.js';
import { marketsRoutes } from './routes/markets.js';
import { portfolioRoutes } from './routes/portfolio.js';
import { transactionsRoutes } from './routes/transactions.js';
import { swapRoutes } from './routes/swap.js';
import { watchlistRoutes } from './routes/watchlist.js';
import { notificationsRoutes } from './routes/notifications.js';
import { supportRoutes } from './routes/support.js';
import { twoFactorRoutes } from './routes/two-factor.js';

async function build() {
  const app = Fastify({ logger: true });

  // Security: Helmet - Secure headers
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  });

  // Security: Rate Limiting with Redis
  const redis = getRedisClient();
  await app.register(rateLimit, {
    max: 100, // Max requests per time window
    timeWindow: '15 minutes',
    redis, // Use Redis for distributed rate limiting
    skipOnError: true, // Don't block requests if Redis fails
    keyGenerator: (req) => {
      // Rate limit by IP or user ID (if authenticated)
      return req.user?.id || req.ip;
    },
  });

  await app.register(cors, {
    origin: (origin, cb) => {
      const allowed = env.CORS_ORIGIN.split(',').map(s => s.trim()).filter(Boolean);
      if (!origin) return cb(null, true);
      if (allowed.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
  });

  await app.register(jwt, { secret: env.JWT_SECRET });

  registerAuthDecorators(app);

  await app.register(swagger, {
    swagger: {
      info: { title: 'ZVE Crypto API', version: '1.0.0' },
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  });

  await app.register(swaggerUi, { routePrefix: '/docs' });

  app.get('/health', async () => ({ ok: true, ts: Date.now() }));

  await app.register(authRoutes);
  await app.register(meRoutes);
  await app.register(marketsRoutes);
  await app.register(portfolioRoutes);
  await app.register(transactionsRoutes);
  await app.register(swapRoutes);
  await app.register(watchlistRoutes);
  await app.register(notificationsRoutes);
  await app.register(supportRoutes);
  await app.register(twoFactorRoutes);

  return app;
}

build()
  .then(app => app.listen({ port: env.PORT, host: '0.0.0.0' }))
  .catch(err => { console.error(err); process.exit(1); });
