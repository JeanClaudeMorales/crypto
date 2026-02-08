import type { AssetHolding, Market, Candle, Transaction, SwapQuote, User } from '../types/domain';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('zve_access') || '';
}
function setTokens(access: string, refresh?: string) {
  localStorage.setItem('zve_access', access);
  if (refresh) localStorage.setItem('zve_refresh', refresh);
}
function clearTokens() {
  localStorage.removeItem('zve_access');
  localStorage.removeItem('zve_refresh');
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');

  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (res.status === 401) {
    // Try refresh once
    const refresh = localStorage.getItem('zve_refresh');
    if (refresh) {
      const r = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (r.ok) {
        const json = await r.json();
        setTokens(json.accessToken, json.refreshToken);
        // retry
        const retryHeaders = new Headers(init.headers || {});
        retryHeaders.set('Content-Type', 'application/json');
        retryHeaders.set('Authorization', `Bearer ${json.accessToken}`);
        const retry = await fetch(`${API_BASE}${path}`, { ...init, headers: retryHeaders });
        if (!retry.ok) throw new Error(await retry.text());
        return await retry.json();
      }
    }
    clearTokens();
    throw new Error('UNAUTHORIZED');
  }

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export const api = {
  tokens: { set: setTokens, clear: clearTokens, get: getToken },

  async register(payload: { name: string; email: string; password: string }) {
    const r = await request<{ accessToken: string; refreshToken: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setTokens(r.accessToken, r.refreshToken);
    return r.user;
  },

  async login(payload: { email: string; password: string }) {
    const r = await request<{ accessToken: string; refreshToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setTokens(r.accessToken, r.refreshToken);
    return r.user;
  },

  async me() {
    return request<User>('/me');
  },

  async markets() {
    return request<{ markets: Market[] }>('/markets');
  },

  async market(symbol: string) {
    return request<{ market: Market }>('/markets/' + encodeURIComponent(symbol));
  },

  async candles(symbol: string, interval: string, limit = 120) {
    const qs = new URLSearchParams({ interval, limit: String(limit) });
    return request<{ candles: Candle[] }>(`/markets/${encodeURIComponent(symbol)}/candles?${qs.toString()}`);
  },

  async holdings() {
    return request<{ holdings: AssetHolding[]; totalUsd: number }>('/portfolio/holdings');
  },

  async transactions() {
    return request<{ transactions: Transaction[] }>('/transactions');
  },

  async deposit(payload: { asset: string; amount: number; network?: string }) {
    return request('/transactions/deposit', { method: 'POST', body: JSON.stringify(payload) });
  },

  async withdraw(payload: { asset: string; amount: number; address: string; network?: string }) {
    return request('/transactions/withdraw', { method: 'POST', body: JSON.stringify(payload) });
  },

  async swapQuote(payload: { fromAsset: string; toAsset: string; fromAmount: number; slippageBps?: number }) {
    return request<{ quote: SwapQuote }>('/swap/quote', { method: 'POST', body: JSON.stringify(payload) });
  },

  async swap(payload: { fromAsset: string; toAsset: string; fromAmount: number; slippageBps?: number }) {
    return request('/swap', { method: 'POST', body: JSON.stringify(payload) });
  },

  async watchlist() {
    return request<{ items: Market[] }>('/watchlist');
  },
  async watchlistAdd(symbol: string) {
    return request('/watchlist/add', { method: 'POST', body: JSON.stringify({ symbol }) });
  },
  async watchlistRemove(symbol: string) {
    return request('/watchlist/remove', { method: 'POST', body: JSON.stringify({ symbol }) });
  },

  async notifications() {
    return request<{ notifications: { id: string; title: string; body: string; isRead: boolean; createdAt: string }[] }>('/notifications');
  },
  async notificationRead(id: string) {
    return request('/notifications/mark-read', { method: 'POST', body: JSON.stringify({ id }) });
  },

  async supportTicket(payload: { subject: string; message: string }) {
    return request('/support/ticket', { method: 'POST', body: JSON.stringify(payload) });
  },
};
