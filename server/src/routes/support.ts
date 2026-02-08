import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { badRequest, ok, unauthorized } from '../lib/http';
import { getUserId } from '../lib/auth';

const TicketSchema = z.object({
  subject: z.string().min(3).max(200),
  message: z.string().min(5).max(5000),
});

export async function supportRoutes(app: FastifyInstance) {
  app.post('/support/ticket', { preHandler: app.auth }, async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return unauthorized(reply);

    const parsed = TicketSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(reply, 'Invalid payload', parsed.error.flatten());

    const t = await prisma.supportTicket.create({
      data: { userId, subject: parsed.data.subject, message: parsed.data.message },
    });

    await prisma.notification.create({
      data: { userId, type: 'support', title: 'Ticket creado', body: `#${t.id.slice(-6)}: ${t.subject}` },
    });

    return ok(reply, { id: t.id });
  });
}
