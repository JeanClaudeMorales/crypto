export type Interval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

export type TxType = 'deposit' | 'withdraw' | 'swap' | 'buy' | 'sell';
export type TxStatus = 'pending' | 'completed' | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Market {
  id: string;
  symbol: string;      // e.g. BTCUSDT
  base: string;        // BTC
  quote: string;       // USDT
  price: number;
  change24h: number;
}

export interface Candle {
  t: number; // openTime ms
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

export interface AssetHolding {
  asset: string;       // BTC
  balance: number;
  balanceUsd: number;
  price: number;
  change24h: number;
}

export interface Transaction {
  id: string;
  type: TxType;
  asset: string;
  amount: number;
  amountUsd: number;
  status: TxStatus;
  createdAt: string;
  meta?: Record<string, any>;
}

export interface SwapQuote {
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  price: number;
  feeUsd: number;
  slippageBps: number;
}
