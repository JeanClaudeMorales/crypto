import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function ResetPassword() {
  const [pass, setPass] = useState('');
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <div className="min-h-screen bg-bg-main text-white flex flex-col">
      <div className="px-6 pt-14 pb-6 text-center">
        <h1 className="text-3xl font-bold">Reset</h1>
        <p className="mt-2 text-white/45 text-sm">Demo UI. Backend real se añade si quieres flujo email/token.</p>
      </div>

      <form onSubmit={submit} className="px-6 flex-1 flex flex-col gap-4 max-w-md w-full mx-auto">
        <Input placeholder="Nueva contraseña" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />

        {done && (
          <div className="rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-white/80">
            Contraseña actualizada (demo).
          </div>
        )}

        <div className="mt-auto pb-10 space-y-3">
          <Button type="submit">Confirmar</Button>
          <Link to="/login" className="text-center text-sm text-white/55 hover:text-white">Volver al login</Link>
        </div>
      </form>
    </div>
  );
}
