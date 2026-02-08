import React from 'react';
import { Link } from 'react-router-dom';
import { StarOff } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useWatchlist, useWatchlistRemove } from '../../hooks/queries';

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function Watchlist() {
  const q = useWatchlist();
  const rem = useWatchlistRemove();

  return (
    <div className="pt-10 pb-28">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Watchlist</h1>
          <p className="text-white/45 text-sm mt-1">Tus pares favoritos.</p>
        </div>
        <Link to="/app/markets" className="text-primary text-sm font-semibold hover:text-primary-light">Markets</Link>
      </div>

      <div className="space-y-3">
        {(q.data || []).map(m => (
          <Card key={m.symbol} className="p-4">
            <div className="flex items-center justify-between">
              <Link to={`/app/markets/${encodeURIComponent(m.symbol)}`} className="min-w-0">
                <div className="font-semibold">{m.base} / {m.quote}</div>
                <div className="text-xs text-white/45">{m.symbol}</div>
              </Link>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-semibold">${fmt(m.price)}</div>
                  <div className={m.change24h >= 0 ? "text-success text-xs" : "text-red-400 text-xs"}>
                    {m.change24h >= 0 ? "+" : ""}{fmt(m.change24h)}%
                  </div>
                </div>
                <Button
                  fullWidth={false}
                  variant="outline"
                  className="h-10 px-3"
                  onClick={() => rem.mutate(m.symbol)}
                >
                  <StarOff className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {q.isLoading && <div className="text-white/50 text-sm">Cargando…</div>}
        {!q.isLoading && (q.data?.length || 0) === 0 && (
          <Card className="p-6 text-center">
            <div className="text-white/60">Vacío.</div>
            <div className="text-white/40 text-sm mt-1">Agrega favoritos desde Markets.</div>
            <div className="mt-4">
              <Link to="/app/markets">
                <Button>Ir a Markets</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
