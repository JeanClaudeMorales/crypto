import React from 'react';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { useNotificationRead, useNotifications } from '../../hooks/queries';

export function Notifications() {
  const q = useNotifications();
  const read = useNotificationRead();

  return (
    <div className="pt-10 pb-28">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-white/45 text-sm mt-1">Alertas y eventos.</p>
        </div>
        <Chip tone="neutral">{q.data?.filter(n => !n.isRead).length || 0} new</Chip>
      </div>

      <div className="space-y-3">
        {(q.data || []).map(n => (
          <Card key={n.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{n.title}</div>
                <div className="text-sm text-white/55 mt-1">{n.body}</div>
                <div className="text-xs text-white/35 mt-2">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {!n.isRead ? <Chip tone="primary">NEW</Chip> : <Chip>Read</Chip>}
                {!n.isRead && (
                  <button
                    className="text-xs text-primary hover:text-primary-light"
                    onClick={() => read.mutate(n.id)}
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {q.isLoading && <div className="text-white/50 text-sm">Cargando…</div>}
        {q.isError && <div className="text-red-400 text-sm">Error cargando notificaciones.</div>}
        {!q.isLoading && (q.data?.length || 0) === 0 && (
          <Card className="p-6 text-center text-white/50">Sin notificaciones.</Card>
        )}
      </div>
    </div>
  );
}
