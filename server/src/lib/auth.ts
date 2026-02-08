import type { FastifyInstance, FastifyRequest } from 'fastify';
import { unauthorized } from './http';

export type JwtPayload = { sub: string; email: string };

export async function requireAuth(req: FastifyRequest, reply: any) {
  try {
    await req.jwtVerify<JwtPayload>();
  } catch {
    return unauthorized(reply);
  }
}

export function getUserId(req: FastifyRequest) {
  // @ts-expect-error fastify-jwt decoration
  return (req.user as any)?.sub as string | undefined;
}

export function registerAuthDecorators(app: FastifyInstance) {
  app.decorate('auth', requireAuth);
  app.decorate('authenticate', requireAuth); // Alias for routes expecting authenticate
}

declare module 'fastify' {
  interface FastifyInstance {
    auth: typeof requireAuth;
    authenticate: typeof requireAuth;
  }
}
