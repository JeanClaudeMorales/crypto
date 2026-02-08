import React, { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { CandlesChart } from '../../components/charts/Candles';
import { useCandles, useMarkets, useWatchlist, useWatchlistAdd, useWatchlistRemove } from '../../hooks/queries';

const intervals = [
  { k: '1m', label: '1m' },
  { k: '5m', label: '5m' },
  { k: '15m', label: '15m' },
  { k: '1h', label: '1H' },
  { k: '4h', label: '4H' },
  { k: '1d', label: '1D' },
] as const;

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function MarketDetail() {
  const { symbol = 'ETHUSDT' } = useParams();
  const nav = useNavigate();

  const [interval, setInterval] = useState<string>('1h');

  const marketsQ = useMarkets();
  const market = useMemo(() => (marketsQ.data || []).find(m => m.symbol === symbol), [marketsQ.data, symbol]);

  const candlesQ = useCandles(symbol, interval);

  const watchQ = useWatchlist();
  const addM = useWatchlistAdd();
  const remM = useWatchlistRemove();
  const watched = (watchQ.data || []).some(m => m.symbol === symbol);

  return (
    <div className="pt-8 pb-28">
      <div className="flex items-center justify-between mb-4">
        <button
          className="w-11 h-11 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
          onClick={() => nav(-1)}
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="text-sm text-white/45">{market?.base || symbol}</div>
          <div className="font-semibold">{market?.symbol || symbol}</div>
        </div>

        <button
          className="w-11 h-11 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
          onClick={() => watched ? remM.mutate(symbol) : addM.mutate(symbol)}
          aria-label="Watchlist"
        >
          <Star className={watched ? "w-5 h-5 text-primary fill-primary" : "w-5 h-5 text-white/60"} />
        </button>
      </div>

      <Card className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-3xl font-bold">${fmt(market?.price || 0)}</div>
            <div className={market?.change24h !== undefined && market.change24h >= 0 ? "text-success text-sm mt-1" : "text-red-400 text-sm mt-1"}>
              {market?.change24h !== undefined ? (market.change24h >= 0 ? "+" : "") + fmt(market.change24h) + "%" : "—"}
              <span className="text-white/40 ml-2">24h</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Chip tone="primary">Candles</Chip>
            <Link to="/app/trade" className="text-primary text-sm font-semibold hover:text-primary-light">Trade</Link>
          </div>
        </div>

        <div className="mt-4">
          {candlesQ.data && candlesQ.data.length > 0 ? (
            <CandlesChart candles={candlesQ.data} />
          ) : (
            <div className="h-[320px] flex items-center justify-center text-white/50">
              {candlesQ.isLoading ? "Cargando velas…" : "Sin datos de velas"}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {intervals.map(i => (
            <button
              key={i.k}
              className={i.k === interval
                ? "px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-xs"
                : "px-3 py-1.5 rounded-full bg-transparent border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-xs"}
              onClick={() => setInterval(i.k)}
            >
              {i.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="mt-4 grid md:grid-cols-2 gap-3">
        <Button onClick={() => nav('/app/trade?from=' + encodeURIComponent(market?.base || 'ETH') + '&to=USDT')}>Comprar</Button>
        <Button variant="outline" onClick={() => nav('/app/trade?from=USDT&to=' + encodeURIComponent(market?.base || 'ETH'))}>Vender</Button>
      </div>

      <div className="mt-4 text-xs text-white/40">
        Nota: si configuras el backend con provider Binance, verás velas reales. Si no, se usa generador sintético.
      </div>
    </div>
  );
}
