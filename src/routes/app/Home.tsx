import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { Button } from '../../components/ui/Button';
import { useHoldings, useMarkets } from '../../hooks/queries';

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function Home() {
  const nav = useNavigate();
  const holdingsQ = useHoldings();
  const marketsQ = useMarkets();

  const total = holdingsQ.data?.totalUsd ?? 0;
  const markets = marketsQ.data ?? [];
  const eth = markets.find(m => m.symbol === 'ETHUSDT') || markets[0];

  return (
    <div className="pt-10 pb-28">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-white/45 text-sm">Total Balance</p>
          <div className="flex items-end gap-2">
            <h1 className="text-4xl font-bold">${fmt(total)}</h1>
            <Chip tone="primary">Demo</Chip>
          </div>
        </div>

        <button
          className="relative p-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
          onClick={() => nav('/app/notifications')}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-bg-main" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="p-4 hover:bg-white/5 transition cursor-pointer" onClick={() => nav('/app/wallet') as any}>
          <div className="text-white/60 text-xs">Deposit</div>
          <div className="mt-2 inline-flex w-10 h-10 rounded-2xl bg-success/10 border border-success/20 items-center justify-center">
            <ArrowDownLeft className="w-5 h-5 text-success" />
          </div>
        </Card>
        <Card className="p-4 hover:bg-white/5 transition cursor-pointer" onClick={() => nav('/app/wallet#withdraw') as any}>
          <div className="text-white/60 text-xs">Withdraw</div>
          <div className="mt-2 inline-flex w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-red-400" />
          </div>
        </Card>
        <Card className="p-4 hover:bg-white/5 transition cursor-pointer" onClick={() => nav('/app/trade') as any}>
          <div className="text-white/60 text-xs">Swap</div>
          <div className="mt-2 inline-flex w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center">
            <RefreshCw className="w-5 h-5 text-primary" />
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/60 text-sm">Your Assets</div>
              <div className="text-white/35 text-xs mt-1">Holdings por usuario</div>
            </div>
            <Link to="/app/wallet" className="text-primary text-sm font-semibold hover:text-primary-light">Ver</Link>
          </div>

          <div className="mt-4 space-y-3">
            {(holdingsQ.data?.holdings || []).slice(0, 5).map(h => (
              <div key={h.asset} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold">
                    {h.asset.slice(0,1)}
                  </div>
                  <div>
                    <div className="font-semibold">{h.asset}</div>
                    <div className="text-xs text-white/45">{fmt(h.balance)} · ${fmt(h.balanceUsd)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/80">${fmt(h.price)}</div>
                  <div className={h.change24h >= 0 ? "text-success text-xs" : "text-red-400 text-xs"}>
                    {h.change24h >= 0 ? "+" : ""}{fmt(h.change24h)}%
                  </div>
                </div>
              </div>
            ))}

            {!holdingsQ.isLoading && (holdingsQ.data?.holdings?.length ?? 0) === 0 && (
              <div className="text-white/50 text-sm">Sin holdings todavía. Haz un depósito o swap.</div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-white/60 text-sm">Quick Market</div>
          <div className="mt-1 text-2xl font-semibold">{eth?.symbol || '—'}</div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4">
            <div className="text-white/60 text-sm">Price</div>
            <div className="text-3xl font-bold mt-1">${fmt(eth?.price || 0)}</div>
            <div className={eth?.change24h >= 0 ? "text-success text-sm mt-2" : "text-red-400 text-sm mt-2"}>
              {eth?.change24h >= 0 ? "+" : ""}{fmt(eth?.change24h || 0)}% (24h)
            </div>
            <Button className="mt-4" onClick={() => nav(`/app/markets/${encodeURIComponent(eth?.symbol || 'ETHUSDT')}`)}>
              Abrir gráfico
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="p-5 bg-gradient-to-br from-primary/15 to-blue/10 border-primary/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-white font-semibold">Refer and Get $30 USD</div>
              <div className="text-white/55 text-sm mt-1">Card demo visual (no rewards reales).</div>
            </div>
            <Button fullWidth={false} className="h-10 px-4" onClick={() => nav('/app/support')}>
              Refer Now
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
