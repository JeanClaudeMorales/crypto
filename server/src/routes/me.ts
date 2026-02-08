import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { ok, unauthorized } from '../lib/http';
import { getUserId } from '../lib/auth';

export async function meRoutes(app: FastifyInstance) {
  app.get('/me', { preHandler: app.auth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return unauthorized(reply);

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
    if (!user) return unauthorized(reply);

    return ok(reply, user);
  });
}
