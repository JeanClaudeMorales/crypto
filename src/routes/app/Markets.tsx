import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Chip } from '../../components/ui/Chip';
import { useMarkets, useWatchlist, useWatchlistAdd, useWatchlistRemove } from '../../hooks/queries';

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function Markets() {
  const [q, setQ] = useState('');
  const marketsQ = useMarkets();
  const watchQ = useWatchlist();
  const addM = useWatchlistAdd();
  const remM = useWatchlistRemove();

  const watchSet = useMemo(() => new Set((watchQ.data || []).map(m => m.symbol)), [watchQ.data]);

  const list = useMemo(() => {
    const m = marketsQ.data || [];
    const qq = q.trim().toUpperCase();
    if (!qq) return m;
    return m.filter(x => x.symbol.includes(qq) || x.base.includes(qq) || x.quote.includes(qq));
  }, [marketsQ.data, q]);

  return (
    <div className="pt-10 pb-28">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Markets</h1>
          <p className="text-white/45 text-sm mt-1">Precios y variación 24h (demo con provider). </p>
        </div>
        <Link to="/app/watchlist" className="text-primary text-sm font-semibold hover:text-primary-light">Watchlist</Link>
      </div>

      <Input
        placeholder="Buscar (BTC, ETHUSDT...)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        right={<Search className="w-5 h-5" />}
        wrapperClassName="mb-4"
      />

      <div className="space-y-3">
        {list.map(m => {
          const watched = watchSet.has(m.symbol);
          return (
            <Card key={m.symbol} className="p-4 hover:bg-white/5 transition">
              <div className="flex items-center justify-between">
                <Link to={`/app/markets/${encodeURIComponent(m.symbol)}`} className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold shrink-0">
                    {m.base.slice(0,1)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{m.base} / {m.quote}</div>
                    <div className="text-xs text-white/45">{m.symbol}</div>
                  </div>
                </Link>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold">${fmt(m.price)}</div>
                    <div className={m.change24h >= 0 ? "text-success text-xs" : "text-red-400 text-xs"}>
                      {m.change24h >= 0 ? "+" : ""}{fmt(m.change24h)}%
                    </div>
                  </div>

                  <button
                    className="w-10 h-10 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
                    onClick={() => watched ? remM.mutate(m.symbol) : addM.mutate(m.symbol)}
                    aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
                    title={watched ? "Remove" : "Add"}
                  >
                    <Star className={watched ? "w-5 h-5 text-primary fill-primary" : "w-5 h-5 text-white/60"} />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}

        {marketsQ.isLoading && <div className="text-white/50 text-sm">Cargando markets…</div>}
        {marketsQ.isError && <div className="text-red-400 text-sm">Error cargando markets. Asegúrate de levantar el backend.</div>}
        {!marketsQ.isLoading && list.length === 0 && (
          <div className="text-white/50 text-sm">Sin resultados.</div>
        )}
      </div>

      <div className="mt-6">
        <Chip>Tip: corre el backend (server) y Postgres para datos reales.</Chip>
      </div>
    </div>
  );
}
