import React, { useState } from 'react';
import { api } from '../../lib/api';
import { QRCodeSVG } from 'qrcode.react';

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
    const [amount, setAmount] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    if (!isOpen) return null;

    const handleDeposit = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
        setLoading(true);
        try {
            const res = await api.createDeposit(Number(amount));
            setResult(res);
        } catch (error) {
            console.error(error);
            alert('Error creating deposit order');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setResult(null);
        setAmount('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#1e2026] rounded-xl border border-white/10 p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Deposit USDT</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                {!result ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Amount (USDT)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-[#2b3139] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                                placeholder="0.00"
                            />
                        </div>

                        <button
                            onClick={handleDeposit}
                            disabled={loading}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Pay with Binance'}
                        </button>
                    </div>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="bg-white p-4 rounded-lg inline-block">
                            <QRCodeSVG value={result.qrContent} size={200} />
                        </div>
                        <p className="text-sm text-gray-400">Scan via Binance App</p>

                        <div className="flex gap-3">
                            <a
                                href={result.checkoutUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 rounded-lg text-sm"
                            >
                                Open Checkout
                            </a>
                            <a
                                href={result.universalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 bg-[#2b3139] hover:bg-[#363c45] text-white font-bold py-2 rounded-lg text-sm border border-white/10"
                            >
                                Open App
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
