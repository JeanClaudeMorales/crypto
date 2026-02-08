import type { FastifyReply } from 'fastify';

export function ok(reply: FastifyReply, data: any) {
  return reply.code(200).send(data);
}

export function badRequest(reply: FastifyReply, message: string, details?: any) {
  return reply.code(400).send({ error: 'BAD_REQUEST', message, details });
}

export function unauthorized(reply: FastifyReply, message = 'Unauthorized') {
  return reply.code(401).send({ error: 'UNAUTHORIZED', message });
}

export function forbidden(reply: FastifyReply, message = 'Forbidden') {
  return reply.code(403).send({ error: 'FORBIDDEN', message });
}

export function notFound(reply: FastifyReply, message = 'Not Found') {
  return reply.code(404).send({ error: 'NOT_FOUND', message });
}
