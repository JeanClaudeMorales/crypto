import { Asset, Transaction } from './types';

export const MOCK_ASSETS: Asset[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    balance: 0.54,
    balanceUsd: 61000.00,
    price: 114519.20,
    change24h: 0.83,
    color: '#F7931A',
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 110000 + Math.random() * 5000 }))
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    balance: 10.5,
    balanceUsd: 38220.00,
    price: 3654.29,
    change24h: 2.02,
    color: '#627EEA',
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 3500 + Math.random() * 200 }))
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    balance: 145.2,
    balanceUsd: 6243.60,
    price: 42.99,
    change24h: 0.84,
    color: '#14F195',
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 40 + Math.random() * 5 }))
  },
  {
    id: 'tether',
    name: 'Tether USD',
    symbol: 'USDT',
    balance: 2000.00,
    balanceUsd: 2000.00,
    price: 1.00,
    change24h: 0.01,
    color: '#26A17B',
    history: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 1 }))
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    asset: 'BTC',
    amount: '+0.045 BTC',
    amountUsd: '$12,450.00',
    date: 'Hoy, 14:30 PM',
    status: 'completed',
    profit: '+3.45%'
  },
  {
    id: '2',
    type: 'sell',
    asset: 'ETH',
    amount: '-1.25 ETH',
    amountUsd: '$2,850.50',
    date: 'Hoy, 10:15 AM',
    status: 'completed'
  },
  {
    id: '3',
    type: 'buy',
    asset: 'SOL',
    amount: '+4.5 SOL',
    amountUsd: '$540.00',
    date: 'Ayer, 18:45 PM',
    status: 'completed'
  },
  {
    id: '4',
    type: 'deposit',
    asset: 'USDT',
    amount: 'Completado',
    amountUsd: '$1,000.00',
    date: 'Ayer, 09:12 AM',
    status: 'completed'
  }
];

export const NETWORKS = [
  { id: 'trc20', name: 'TRC20 (Tron Network)', fee: '$1.00 USD', icon: 'TRX' },
  { id: 'erc20', name: 'ERC20 (Ethereum)', fee: '$10.00 USD', icon: 'ETH' },
  { id: 'bep20', name: 'BEP20 (BNB Smart Chain)', fee: '$0.50 USD', icon: 'BNB' },
  { id: 'sol', name: 'Solana', fee: '$0.10 USD', icon: 'SOL' }
];