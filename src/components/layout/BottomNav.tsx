import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart2, Wallet, List, User, Plus } from 'lucide-react';
import clsx from 'clsx';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on auth routes
  if (!location.pathname.startsWith('/app')) return null;

  const linkBase = "flex flex-col items-center justify-center gap-1 text-[11px] w-16";
  const iconBase = "w-5 h-5";
  const active = ({ isActive }: { isActive: boolean }) =>
    clsx(linkBase, isActive ? "text-white" : "text-white/50");

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50">
      <div className="mx-auto max-w-[520px] px-4">
        <div className="rounded-3xl border border-white/10 bg-bg-card/70 glass-panel shadow-card px-6 py-3 flex items-center justify-between">
          <NavLink to="/app" className={active} end>
            <Home className={iconBase} />
            <span>Home</span>
          </NavLink>

          <NavLink to="/app/markets" className={active}>
            <BarChart2 className={iconBase} />
            <span>Markets</span>
          </NavLink>

          <button
            className="w-12 h-12 rounded-2xl bg-primary shadow-[0_10px_30px_rgba(127,102,255,0.35)] flex items-center justify-center -mt-8 border border-white/10"
            onClick={() => navigate('/app/trade')}
            aria-label="Trade"
            title="Trade"
          >
            <Plus className="w-6 h-6" />
          </button>

          <NavLink to="/app/wallet" className={active}>
            <Wallet className={iconBase} />
            <span>Wallet</span>
          </NavLink>

          <NavLink to="/app/profile" className={active}>
            <User className={iconBase} />
            <span>Profile</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
