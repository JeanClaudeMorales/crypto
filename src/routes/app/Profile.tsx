import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight, Headphones, Settings as SettingsIcon, History } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { useAuth } from '../../context/auth';

export function Profile() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="pt-10 pb-28">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-white/45 text-sm mt-1">Cuenta y preferencias.</p>
        </div>
        <Chip tone="primary">User</Chip>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-primary/15 border border-primary/20 flex items-center justify-center font-bold text-xl">
            {(user?.name || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-lg font-semibold truncate">{user?.name}</div>
            <div className="text-sm text-white/55 truncate">{user?.email}</div>
          </div>
        </div>
      </Card>

      <div className="mt-4 space-y-3">
        <Link to="/app/activity">
          <Card className="p-4 hover:bg-white/5 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-white/70" />
                <div className="font-semibold">Activity</div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </div>
          </Card>
        </Link>

        <Link to="/app/settings">
          <Card className="p-4 hover:bg-white/5 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SettingsIcon className="w-5 h-5 text-white/70" />
                <div className="font-semibold">Settings</div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </div>
          </Card>
        </Link>

        <Link to="/app/support">
          <Card className="p-4 hover:bg-white/5 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Headphones className="w-5 h-5 text-white/70" />
                <div className="font-semibold">Support</div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </div>
          </Card>
        </Link>
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          onClick={() => {
            logout();
            nav('/login', { replace: true });
          }}
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
