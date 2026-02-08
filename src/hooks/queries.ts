import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useMarkets() {
  return useQuery({
    queryKey: ['markets'],
    queryFn: () => api.markets().then(r => r.markets),
  });
}

export function useHoldings() {
  return useQuery({
    queryKey: ['holdings'],
    queryFn: () => api.holdings(),
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => api.transactions().then(r => r.transactions),
  });
}

export function useCandles(symbol: string, interval: string) {
  return useQuery({
    queryKey: ['candles', symbol, interval],
    queryFn: () => api.candles(symbol, interval, 140).then(r => r.candles),
    enabled: !!symbol,
  });
}

export function useSwapQuote() {
  return useMutation({
    mutationFn: (payload: { fromAsset: string; toAsset: string; fromAmount: number; slippageBps?: number }) =>
      api.swapQuote(payload).then(r => r.quote),
  });
}

export function useSwap() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { fromAsset: string; toAsset: string; fromAmount: number; slippageBps?: number }) =>
      api.swap(payload),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['holdings'] }),
        qc.invalidateQueries({ queryKey: ['transactions'] }),
        qc.invalidateQueries({ queryKey: ['markets'] }),
      ]);
    },
  });
}

export function useDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { asset: string; amount: number; network?: string }) => api.deposit(payload),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['holdings'] }),
        qc.invalidateQueries({ queryKey: ['transactions'] }),
      ]);
    },
  });
}

export function useWithdraw() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { asset: string; amount: number; address: string; network?: string }) => api.withdraw(payload),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['holdings'] }),
        qc.invalidateQueries({ queryKey: ['transactions'] }),
      ]);
    },
  });
}

export function useWatchlist() {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: () => api.watchlist().then(r => r.items),
  });
}

export function useWatchlistAdd() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (symbol: string) => api.watchlistAdd(symbol),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  });
}
export function useWatchlistRemove() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (symbol: string) => api.watchlistRemove(symbol),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.notifications().then(r => r.notifications),
  });
}
export function useNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.notificationRead(id),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useSupportTicket() {
  return useMutation({
    mutationFn: (payload: { subject: string; message: string }) => api.supportTicket(payload),
  });
}
