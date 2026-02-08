import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './context/auth';
import { RequireAuth } from './components/layout/RequireAuth';
import { AppShell } from './components/layout/AppShell';

import { Splash } from './routes/onboarding/Splash';
import { Welcome } from './routes/onboarding/Welcome';
import { Login } from './routes/auth/Login';
import { Register } from './routes/auth/Register';
import { ForgotPassword } from './routes/auth/ForgotPassword';
import { ResetPassword } from './routes/auth/ResetPassword';

import { Home } from './routes/app/Home';
import { Markets } from './routes/app/Markets';
import { MarketDetail } from './routes/app/MarketDetail';
import { Trade } from './routes/app/Trade';
import { Wallet } from './routes/app/Wallet';
import { Activity } from './routes/app/Activity';
import { Watchlist } from './routes/app/Watchlist';
import { Notifications } from './routes/app/Notifications';
import { Profile } from './routes/app/Profile';
import { Settings } from './routes/app/Settings';
import { Support } from './routes/app/Support';
import { AdminPortal } from './routes/admin/AdminPortal';

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 15_000, refetchOnWindowFocus: false, retry: 1 } }
});

const router = createBrowserRouter([
  { path: '/', element: <Splash /> },
  { path: '/welcome', element: <Welcome /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot', element: <ForgotPassword /> },
  { path: '/reset', element: <ResetPassword /> },

  {
    path: '/app',
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Home /> },
          { path: 'markets', element: <Markets /> },
          { path: 'markets/:symbol', element: <MarketDetail /> },
          { path: 'trade', element: <Trade /> },
          { path: 'wallet', element: <Wallet /> },
          { path: 'activity', element: <Activity /> },
          { path: 'watchlist', element: <Watchlist /> },
          { path: 'notifications', element: <Notifications /> },
          { path: 'profile', element: <Profile /> },
          { path: 'settings', element: <Settings /> },
          { path: 'support', element: <Support /> },
          { path: 'admin', element: <AdminPortal /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
