import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="min-h-screen bg-bg-main text-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
