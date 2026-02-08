import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={value
        ? "w-12 h-7 rounded-full bg-primary/70 border border-primary/30 relative transition"
        : "w-12 h-7 rounded-full bg-white/10 border border-white/10 relative transition"}
      aria-label="toggle"
    >
      <span className={value
        ? "absolute top-0.5 left-6 w-6 h-6 rounded-full bg-white shadow transition"
        : "absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white/70 shadow transition"} />
    </button>
  );
}

export function Settings() {
  const [biometric, setBiometric] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="pt-10 pb-28">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-white/45 text-sm mt-1">Preferencias de app (demo).</p>
        </div>
        <Chip tone="neutral">UI</Chip>
      </div>

      <div className="space-y-3">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Biometría</div>
              <div className="text-sm text-white/45 mt-1">Requiere TouchID/FaceID (simulado).</div>
            </div>
            <Toggle value={biometric} onChange={setBiometric} />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Price alerts</div>
              <div className="text-sm text-white/45 mt-1">Notifica cuando el precio cruce un nivel.</div>
            </div>
            <Toggle value={priceAlerts} onChange={setPriceAlerts} />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Dark mode</div>
              <div className="text-sm text-white/45 mt-1">UI oscura siempre activa en este tema.</div>
            </div>
            <Toggle value={darkMode} onChange={setDarkMode} />
          </div>
        </Card>
      </div>

      <div className="mt-6 text-xs text-white/40">
        Nota: para settings persistentes, guarda en DB o localStorage. Aquí es demo.
      </div>
    </div>
  );
}
