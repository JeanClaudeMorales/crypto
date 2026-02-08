import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/auth';

export function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('Demo User');
  const [email, setEmail] = useState('demo2@zve.app');
  const [password, setPassword] = useState('demo1234');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      nav('/app', { replace: true });
    } catch {
      setErr('No se pudo crear la cuenta (correo ya existe o servidor no disponible).');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-main text-white flex flex-col">
      <div className="px-6 pt-14 pb-6">
        <h1 className="text-3xl font-bold text-center">Crear cuenta</h1>
        <p className="mt-2 text-center text-white/45 text-sm">Regístrate y comienza.</p>
      </div>

      <form onSubmit={onSubmit} className="px-6 flex-1 flex flex-col gap-4 max-w-md w-full mx-auto">
        <Input placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          placeholder="Contraseña"
          type={show ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          right={
            <button type="button" onClick={() => setShow(!show)} className="p-1 rounded-lg hover:bg-white/5">
              {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />

        <p className="text-[11px] text-white/40 leading-relaxed">
          Al registrarte aceptas Términos y Política de Privacidad. Esto es una demo técnica (no custodia fondos).
        </p>

        {err && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">{err}</div>}

        <div className="mt-auto pb-10 space-y-3">
          <Button disabled={busy} type="submit">{busy ? 'Creando…' : 'Crear cuenta'}</Button>
          <div className="text-center text-sm text-white/55">
            ¿Ya tienes cuenta? <Link to="/login" className="text-primary font-semibold">Inicia sesión</Link>
          </div>
          <Button variant="ghost" type="button" onClick={() => nav('/welcome')}>Volver</Button>
        </div>
      </form>
    </div>
  );
}
