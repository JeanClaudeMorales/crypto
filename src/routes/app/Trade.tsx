import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDownUp } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Chip } from '../../components/ui/Chip';
import { useHoldings, useSwap, useSwapQuote } from '../../hooks/queries';

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

export function Trade() {
  const [sp, setSp] = useSearchParams();
  const holdingsQ = useHoldings();
  const quoteM = useSwapQuote();
  const swapM = useSwap();

  const assets = useMemo(() => (holdingsQ.data?.holdings || []).map(h => h.asset), [holdingsQ.data]);

  const [from, setFrom] = useState(sp.get('from') || 'USDT');
  const [to, setTo] = useState(sp.get('to') || 'ETH');
  const [amount, setAmount] = useState('10');
  const [slippageBps, setSlippageBps] = useState(50); // 0.50%

  useEffect(() => {
    setSp(prev => {
      prev.set('from', from);
      prev.set('to', to);
      return prev;
    }, { replace: true });
  }, [from, to, setSp]);

  const fromHolding = holdingsQ.data?.holdings?.find(h => h.asset === from);
  const toHolding = holdingsQ.data?.holdings?.find(h => h.asset === to);

  const fromAmount = Number(amount || 0);

  const canQuote = from && to && from !== to && fromAmount > 0;

  useEffect(() => {
    if (!canQuote) return;
    const t = setTimeout(() => {
      quoteM.mutate({ fromAsset: from, toAsset: to, fromAmount, slippageBps });
    }, 250);
    return () => clearTimeout(t);
  }, [from, to, fromAmount, slippageBps]); // eslint-disable-line

  const quote = quoteM.data;

  function flip() {
    setFrom(to);
    setTo(from);
    setTimeout(() => quoteM.reset(), 0);
  }

  async function execute() {
    if (!canQuote) return;
    await swapM.mutateAsync({ fromAsset: from, toAsset: to, fromAmount, slippageBps });
  }

  return (
    <div className="pt-10 pb-28">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Swap</h1>
          <p className="text-white/45 text-sm mt-1">Intercambia activos a precio de mercado (demo).</p>
        </div>
        <Chip tone="primary">{(slippageBps/100).toFixed(2)}% slip</Chip>
      </div>

      <Card className="p-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-white/55 text-sm mb-2">From</div>
            <div className="flex gap-2">
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="h-12 rounded-2xl bg-bg-input/60 border border-white/10 px-3 text-sm outline-none"
              >
                {Array.from(new Set(['USDT', 'USDC', ...assets])).map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <Input
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                className="flex-1"
              />
            </div>
            <div className="mt-2 text-xs text-white/40">
              Balance: {fmt(fromHolding?.balance || 0)} {from}
            </div>
          </div>

          <div className="relative">
            <div className="text-white/55 text-sm mb-2">To</div>
            <div className="flex gap-2">
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-12 rounded-2xl bg-bg-input/60 border border-white/10 px-3 text-sm outline-none"
              >
                {Array.from(new Set(['ETH', 'BTC', 'SOL', 'LINK', ...assets])).filter(a => a !== from).map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <Input
                placeholder="—"
                value={quote ? fmt(quote.toAmount) : ''}
                readOnly
                className="flex-1"
              />
            </div>
            <div className="mt-2 text-xs text-white/40">
              Balance: {fmt(toHolding?.balance || 0)} {to}
            </div>

            <button
              className="absolute -left-5 top-9 w-10 h-10 rounded-2xl border border-white/10 bg-bg-card/80 hover:bg-white/10 transition flex items-center justify-center"
              onClick={flip}
              aria-label="Flip"
              title="Flip"
            >
              <ArrowDownUp className="w-5 h-5 text-white/80" />
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {[25, 50, 100].map(v => (
            <button
              key={v}
              onClick={() => setSlippageBps(v)}
              className={v === slippageBps ? "px-3 py-1.5 rounded-full bg-primary/15 border border-primary/20 text-primary text-xs"
                : "px-3 py-1.5 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-xs"}
            >
              {(v/100).toFixed(2)}%
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white/60">Rate</div>
            <div className="text-white">{quote ? `1 ${from} ≈ ${fmt(quote.price)} ${to}` : '—'}</div>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <div className="text-white/60">Fee</div>
            <div className="text-white">{quote ? `$${fmt(quote.feeUsd)}` : '—'}</div>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <div className="text-white/60">Slippage</div>
            <div className="text-white">{(slippageBps/100).toFixed(2)}%</div>
          </div>
        </div>

        {swapM.isSuccess && (
          <div className="mt-4 rounded-2xl border border-success/20 bg-success/10 p-4 text-sm text-white/80">
            Swap ejecutado. Revisa Wallet / Activity.
          </div>
        )}
        {swapM.isError && (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            No se pudo ejecutar. Verifica balances / backend.
          </div>
        )}

        <div className="mt-5">
          <Button disabled={!canQuote || swapM.isPending} onClick={execute}>
            {swapM.isPending ? 'Procesando…' : 'Confirmar Swap'}
          </Button>
        </div>
      </Card>

      <div className="mt-4 text-xs text-white/40">
        Esto es un “simulador” para UI + arquitectura. Para trading real hay que integrar un exchange + custodia + compliance.
      </div>
    </div>
  );
}
