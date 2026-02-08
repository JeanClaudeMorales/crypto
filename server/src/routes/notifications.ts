import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { badRequest, ok, unauthorized } from '../lib/http';
import { getUserId } from '../lib/auth';

const ReadSchema = z.object({ id: z.string().min(10) });

export async function notificationsRoutes(app: FastifyInstance) {
  app.get('/notifications', { preHandler: app.auth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return unauthorized(reply);

    const items = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return ok(reply, {
      notifications: items.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })),
    });
  });

  app.post('/notifications/read', { preHandler: app.auth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return unauthorized(reply);

    const parsed = ReadSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(reply, 'Invalid payload', parsed.error.flatten());

    await prisma.notification.updateMany({
      where: { userId, id: parsed.data.id },
      data: { isRead: true },
    });

    return ok(reply, { ok: true });
  });
}
