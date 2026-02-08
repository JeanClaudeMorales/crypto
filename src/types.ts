export type ScreenName = 
  | 'SPLASH'
  | 'WELCOME'
  | 'LOGIN'
  | 'REGISTER'
  | 'HOME'
  | 'ASSET_DETAIL'
  | 'SEND_AMOUNT'
  | 'SEND_METHOD'
  | 'SEND_NETWORK'
  | 'PROFILE'
  | 'ACTIVITY'
  | 'MARKETS';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  balanceUsd: number;
  price: number;
  change24h: number; // Percentage
  history: { time: string; value: number }[];
  color: string;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdraw';
  asset: string;
  amount: string;
  amountUsd: string;
  date: string;
  status: 'completed' | 'pending';
  profit?: string;
}

export interface User {
  name: string;
  email: string;
  isPro: boolean;
}