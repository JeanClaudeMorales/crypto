import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Chip } from '../../components/ui/Chip';
import { useSupportTicket } from '../../hooks/queries';

export function Support() {
  const m = useSupportTicket();
  const [subject, setSubject] = useState('Necesito ayuda');
  const [message, setMessage] = useState('Describe tu problema aquí…');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await m.mutateAsync({ subject, message });
  }

  return (
    <div className="pt-10 pb-28">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Support</h1>
          <p className="text-white/45 text-sm mt-1">Crea un ticket (demo backend).</p>
        </div>
        <Chip tone="primary">Help</Chip>
      </div>

      <Card className="p-5">
        <form onSubmit={submit} className="space-y-3">
          <Input placeholder="Asunto" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <textarea
            className="w-full min-h-[160px] rounded-2xl bg-transparent border border-white/10 p-4 text-white placeholder-white/30 outline-none focus:border-primary"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button disabled={m.isPending} type="submit">{m.isPending ? 'Enviando…' : 'Enviar ticket'}</Button>

          {m.isSuccess && (
            <div className="rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-white/80">
              Ticket creado. (Para demo se guarda en DB).
            </div>
          )}
          {m.isError && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              Error creando ticket. Revisa backend/DB.
            </div>
          )}
        </form>
      </Card>

      <div className="mt-4 text-xs text-white/40">
        Si quieres, puedo agregar: FAQ, chat en vivo, adjuntos, y SLA por prioridad.
      </div>
    </div>
  );
}
