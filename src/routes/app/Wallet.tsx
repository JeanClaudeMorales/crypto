import React, { useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Chip } from '../../components/ui/Chip';
import { useDeposit, useHoldings, useWithdraw } from '../../hooks/queries';

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

export function Wallet() {
  const holdingsQ = useHoldings();
  const depositM = useDeposit();
  const withdrawM = useWithdraw();

  const assets = useMemo(() => (holdingsQ.data?.holdings || []).map(h => h.asset), [holdingsQ.data]);

  const [asset, setAsset] = useState('USDT');
  const [amount, setAmount] = useState('50');
  const [network, setNetwork] = useState('ERC20');
  const [address, setAddress] = useState('0x0000000000000000000000000000000000000000');
  const a = Number(amount || 0);

  async function onDeposit() {
    await depositM.mutateAsync({ asset, amount: a, network });
  }
  async function onWithdraw() {
    await withdrawM.mutateAsync({ asset, amount: a, address, network });
  }

  return (
    <div className="pt-10 pb-28">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Wallet</h1>
          <p className="text-white/45 text-sm mt-1">Balances, depósitos y retiros (demo).</p>
        </div>
        <Chip tone="primary">{(holdingsQ.data?.holdings?.length || 0)} assets</Chip>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <div className="text-white/60 text-sm">Holdings</div>
          <div className="mt-4 space-y-3">
            {(holdingsQ.data?.holdings || []).map(h => (
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
            {holdingsQ.isLoading && <div className="text-white/50 text-sm">Cargando…</div>}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm">Deposit</div>
              <Chip tone="success">Sim</Chip>
            </div>

            <div className="mt-3 space-y-3">
              <div className="flex gap-2">
                <select value={asset} onChange={(e) => setAsset(e.target.value)} className="h-12 rounded-2xl bg-bg-input/60 border border-white/10 px-3 text-sm outline-none">
                  {Array.from(new Set(['USDT','USDC','BTC','ETH','SOL','LINK', ...assets])).map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <Input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" className="flex-1" />
              </div>
              <Input placeholder="Network (ERC20/TRC20...)" value={network} onChange={(e) => setNetwork(e.target.value)} />
              <Button disabled={depositM.isPending || a <= 0} onClick={onDeposit}>
                {depositM.isPending ? 'Depositando…' : 'Depositar'}
              </Button>
              {depositM.isSuccess && <div className="text-xs text-success">Depósito registrado.</div>}
            </div>
          </Card>

          <Card className="p-5" id="withdraw">
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm">Withdraw</div>
              <Chip tone="danger">Sim</Chip>
            </div>

            <div className="mt-3 space-y-3">
              <div className="flex gap-2">
                <select value={asset} onChange={(e) => setAsset(e.target.value)} className="h-12 rounded-2xl bg-bg-input/60 border border-white/10 px-3 text-sm outline-none">
                  {Array.from(new Set(['USDT','USDC','BTC','ETH','SOL','LINK', ...assets])).map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <Input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" className="flex-1" />
              </div>
              <Input placeholder="Recipient address" value={address} onChange={(e) => setAddress(e.target.value)} />
              <Input placeholder="Network (ERC20/TRC20...)" value={network} onChange={(e) => setNetwork(e.target.value)} />

              <Button variant="outline" disabled={withdrawM.isPending || a <= 0} onClick={onWithdraw}>
                {withdrawM.isPending ? 'Retirando…' : 'Retirar'}
              </Button>
              {withdrawM.isSuccess && <div className="text-xs text-success">Retiro registrado.</div>}
              {withdrawM.isError && <div className="text-xs text-red-400">Error: balance insuficiente o backend.</div>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
