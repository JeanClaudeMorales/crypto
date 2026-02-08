import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.string().default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  JWT_SECRET: z.string().min(10),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  MARKET_DATA_PROVIDER: z.string().default('synthetic'),
  BINANCE_BASE_URL: z.string().default('https://api.binance.com'),
});

export const env = EnvSchema.parse(process.env);
