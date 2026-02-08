import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Splash() {
  const nav = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => nav('/welcome', { replace: true }), 1800);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <div className="min-h-screen bg-bg-main relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1c35] via-bg-main to-bg-main" />
      <div className="relative text-center">
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full border border-white/10 animate-spin-slow">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-[0_0_12px_rgba(127,102,255,0.8)]" />
          </div>
          <div className="absolute w-56 h-56 rounded-full border border-white/5 animate-reverse-spin">
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-success rounded-full shadow-[0_0_12px_rgba(4,159,108,0.8)]" />
          </div>
          <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
        </div>

        <h1 className="text-5xl font-bold tracking-widest text-white">ZVE</h1>
        <p className="mt-4 text-[10px] font-bold tracking-[0.4em] text-white/70 uppercase animate-pulse">
          Estableciendo conexión
        </p>

        <div className="mt-12 flex justify-center gap-8 text-[10px] text-white/30 font-mono tracking-widest uppercase">
          <span>SYS.OK</span>
          <span>ENC: AES-256</span>
          <span>LAT: 40ms</span>
        </div>
      </div>
    </div>
  );
}
