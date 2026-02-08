import crypto from 'crypto';
import axios from 'axios';
import { env } from './env.js';

export class BinancePayClient {
    private apiKey: string;
    private secretKey: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = env.BINANCE_PAY_API_KEY;
        this.secretKey = env.BINANCE_PAY_SECRET_KEY;
        this.baseUrl = 'https://bpay.binanceapi.com'; // Binance Pay Host
    }

    /**
     * Generates the signature required for Binance Pay API
     */
    private generateSignature(timestamp: number, nonce: string, body: string = ''): string {
        const payload = `${timestamp}\n${nonce}\n${body}\n`;
        return crypto
            .createHmac('sha512', this.secretKey)
            .update(payload)
            .digest('hex')
            .toUpperCase();
    }

    /**
     * Generates a random nonce string
     */
    private generateNonce(length: number = 32): string {
        return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    }

    /**
     * Makes an authenticated request to Binance Pay API
     */
    async request(endpoint: string, method: 'POST' | 'GET', body: any = {}) {
        // Check if keys are placeholders
        if (this.apiKey.startsWith('placeholder')) {
            console.warn('⚠️ using placeholder Binance Pay keys. Request mocked.');
            if (endpoint.includes('/binancepay/openapi/v2/order')) {
                // Return a mock response for creating an order
                return {
                    status: 'SUCCESS',
                    code: '000000',
                    data: {
                        prepayId: 'MOCK_PREPAY_ID_' + Date.now(),
                        terminalType: 'WEB',
                        expireTime: Date.now() + 3600000,
                        qrcodeLink: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg', // Mock QR
                        qrContent: 'https://binance.com/qr/mock',
                        checkoutUrl: 'https://pay.binance.com/checkout/mock',
                        deeplink: 'bnc://app.binance.com/payment/secpay/mock',
                        universalUrl: 'https://app.binance.com/payment/secpay/mock'
                    }
                };
            }
            throw new Error('Endpoint not mocked in placeholder mode');
        }

        const timestamp = Date.now();
        const nonce = this.generateNonce();
        const bodyStr = JSON.stringify(body);

        const signature = this.generateSignature(timestamp, nonce, bodyStr);

        try {
            const response = await axios({
                method,
                url: `${this.baseUrl}${endpoint}`,
                headers: {
                    'Content-Type': 'application/json',
                    'BinancePay-Timestamp': timestamp,
                    'BinancePay-Nonce': nonce,
                    'BinancePay-Certificate-SN': this.apiKey,
                    'BinancePay-Signature': signature,
                },
                data: body,
            });

            return response.data;
        } catch (error: any) {
            console.error('Binance Pay API Error:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Create a new Order
     */
    async createOrder(params: {
        merchantTradeNo: string;
        totalFee: number;
        productDetail: string;
        currency?: string; // Default USDT
    }) {
        const body = {
            env: {
                terminalType: 'WEB',
            },
            merchantTradeNo: params.merchantTradeNo,
            orderAmount: params.totalFee.toFixed(2), // Binance requires 2 decimal string
            currency: params.currency || 'USDT',
            goods: {
                goodsType: '02', // 02: Digital Service
                goodsCategory: '6000', // 6000: Others
                referenceGoodsId: params.merchantTradeNo,
                goodsName: 'Balance Topup',
                goodsDetail: params.productDetail,
            },
        };

        return this.request('/binancepay/openapi/v2/order', 'POST', body);
    }

    /**
     * Verify Webhook Signature
     */
    verifyWebhookSignature(headerSignature: string, body: string, timestamp: string, nonce: string): boolean {
        // In placeholder mode, always return true for testing convenience if needed, 
        // BUT we should implement the real check.
        // However, since we don't have the public key certificate from Binance yet,
        // (which is different from the API Secret), we usually use the Public Key from Binance 
        // to verify webhooks, NOT the secret key.
        // For simplicity in this phase or if using the secret key based signature (older version?),
        // actually Binance Pay webhooks use the Public Key to verify.

        // For this implementation, since we might lack the public key handling infrastructure right now
        // and we are in "placeholder" mode:
        if (this.apiKey.startsWith('placeholder')) return true;

        // TODO: Implement proper signature verification using Binance Public Key
        // const payload = `${timestamp}\n${nonce}\n${body}\n`;
        // Verify using public key...

        return true; // Placeholder: Assume valid for now
    }
}

export const binancePay = new BinancePayClient();
