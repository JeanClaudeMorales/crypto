import React from 'react';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { useTransactions } from '../../hooks/queries';

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

export function Activity() {
  const txQ = useTransactions();

  return (
    <div className="pt-10 pb-28">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Activity</h1>
          <p className="text-white/45 text-sm mt-1">Historial de transacciones del usuario.</p>
        </div>
        <Chip tone="neutral">{txQ.data?.length || 0}</Chip>
      </div>

      <Card className="p-5">
        <div className="space-y-3">
          {(txQ.data || []).map(tx => (
            <div key={tx.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
              <div>
                <div className="font-semibold capitalize">{tx.type} <span className="text-white/50">·</span> {tx.asset}</div>
                <div className="text-xs text-white/45">{new Date(tx.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{tx.amount >= 0 ? '+' : ''}{fmt(tx.amount)} {tx.asset}</div>
                <div className="text-xs text-white/45">${fmt(tx.amountUsd)}</div>
                <div className="mt-1">
                  <Chip tone={tx.status === 'completed' ? 'success' : tx.status === 'failed' ? 'danger' : 'neutral'}>
                    {tx.status}
                  </Chip>
                </div>
              </div>
            </div>
          ))}

          {txQ.isLoading && <div className="text-white/50 text-sm">Cargando…</div>}
          {!txQ.isLoading && (txQ.data?.length || 0) === 0 && (
            <div className="text-white/50 text-sm">Sin movimientos todavía.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
