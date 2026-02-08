import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function Welcome() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-bg-main text-white flex flex-col">
      <div className="flex-1 px-6 pt-14 pb-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8 tracking-wide">ZVE</h1>

        <div className="w-40 h-40 bg-gradient-to-br from-bg-card to-bg-lighter rounded-full flex items-center justify-center mb-10 shadow-glow border border-white/5">
          <Shield size={64} className="text-primary" />
        </div>

        <h2 className="text-3xl font-bold text-center mb-4 leading-tight">
          Empieza tu viaje<br />Crypto hoy
        </h2>
        <p className="text-white/55 text-center text-sm max-w-md">
          Regístrate en minutos y desbloquea un mundo de finanzas digitales seguras, simples y transparentes.
        </p>
      </div>

      <div className="px-6 pb-10 space-y-3">
        <Button onClick={() => nav('/register')}>Continuar con Email</Button>
        <Button variant="outline" onClick={() => nav('/login')}>Iniciar sesión</Button>
        <p className="text-[10px] text-white/35 text-center mt-3">
          Al continuar aceptas nuestros Términos y Política de Privacidad.
        </p>
      </div>
    </div>
  );
}
