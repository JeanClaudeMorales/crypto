import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy } from 'lucide-react';

export function AdminPortal() {
    const trc20Address = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // Example USDT TRC20 Contract (Replace with Owner's Wallet)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(trc20Address);
        alert('Dirección copiada!');
    };

    return (
        <div className="pt-10 pb-20 px-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Super Admin Portal</h1>
            <p className="text-white/45 mb-10">Gestiona las donaciones y el estado del proyecto.</p>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Donation Wallet Card */}
                <div className="bg-[#1e2026] rounded-xl border border-white/10 p-8 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 text-yellow-500">Recibir Donaciones (TRC20)</h2>

                    <div className="flex flex-col items-center space-y-6">
                        <div className="bg-white p-4 rounded-xl">
                            <QRCodeSVG value={trc20Address} size={200} />
                        </div>

                        <div className="w-full">
                            <label className="text-xs text-white/40 uppercase font-semibold">Wallet Address (USDT TRC20)</label>
                            <div className="mt-2 flex items-center gap-3 bg-black/30 p-3 rounded-lg border border-white/5">
                                <code className="text-sm flex-1 truncate text-yellow-500/90">{trc20Address}</code>
                                <button onClick={copyToClipboard} className="text-white/60 hover:text-white transition-colors">
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="w-full bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-200">
                            <p>Comparte este QR para recibir fondos de sponsors directamente a tu wallet personal para impulsar el desarrollo.</p>
                        </div>
                    </div>
                </div>

                {/* Stats / Sponsors */}
                <div className="space-y-6">
                    <div className="bg-[#1e2026] rounded-xl border border-white/10 p-6">
                        <h3 className="font-bold text-lg mb-4">Estado del Proyecto</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/60">Servidor</span>
                                <span className="text-green-400 font-bold">Online</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/60">Base de Datos</span>
                                <span className="text-green-400 font-bold">Conectado</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/60">Usuarios Registrados</span>
                                <span className="font-bold">12</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1e2026] rounded-xl border border-white/10 p-6">
                        <h3 className="font-bold text-lg mb-4">Últimos Sponsors</h3>
                        <div className="space-y-3">
                            <div className="text-center text-white/30 py-4 text-sm">
                                No hay donaciones recientes.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
