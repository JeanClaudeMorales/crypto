import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auth';

export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-bg-main flex items-center justify-center text-white/70">Cargando…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
