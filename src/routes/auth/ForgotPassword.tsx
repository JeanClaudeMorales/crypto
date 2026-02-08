import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-bg-main text-white flex flex-col">
      <div className="px-6 pt-14 pb-6 text-center">
        <h1 className="text-3xl font-bold">Recuperar contraseña</h1>
        <p className="mt-2 text-white/45 text-sm">En producción esto envía un email. Aquí es demo.</p>
      </div>

      <form onSubmit={submit} className="px-6 flex-1 flex flex-col gap-4 max-w-md w-full mx-auto">
        <Input placeholder="Correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        {sent && (
          <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-white/80">
            Listo. Si el correo existe, te llegará un link de reseteo.
            <div className="mt-2">
              <Link to="/reset" className="text-primary font-semibold">Ir a pantalla Reset (demo)</Link>
            </div>
          </div>
        )}

        <div className="mt-auto pb-10 space-y-3">
          <Button type="submit">Enviar</Button>
          <Link to="/login" className="text-center text-sm text-white/55 hover:text-white">Volver al login</Link>
        </div>
      </form>
    </div>
  );
}
