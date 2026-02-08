import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { binancePay } from '../lib/binance-pay.js';

const CreateDepositSchema = z.object({
    amount: z.number().min(0.01),
});

export const depositsRoutes: FastifyPluginAsync = async (app) => {
    app.post('/create', {
        onRequest: [app.authenticate],
        schema: {
            tags: ['Deposits'],
            summary: 'Create a Binance Pay deposit order',
            security: [{ bearerAuth: [] }],
            body: CreateDepositSchema,
        },
    }, async (req, reply) => {
        const { amount } = CreateDepositSchema.parse(req.body);
        const userId = req.user.id;

        // 1. Create Deposit record in DB (Pending)
        const deposit = await prisma.deposit.create({
            data: {
                userId,
                amount,
                currency: 'USDT',
                status: 'PENDING',
                merchantTradeNo: `DEPOSIT_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            },
        });

        try {
            // 2. Call Binance Pay API
            const result = await binancePay.createOrder({
                merchantTradeNo: deposit.merchantTradeNo,
                totalFee: amount,
                productDetail: `Topup ${amount} USDT`,
                currency: 'USDT',
            });

            if (result.status === 'SUCCESS') {
                // 3. Update Deposit with external ID
                await prisma.deposit.update({
                    where: { id: deposit.id },
                    data: { externalId: result.data.prepayId },
                });

                return result.data; // checkoutUrl, deepLink, qrCodeUrl
            } else {
                throw new Error(result.errorMessage || 'Binance Pay Error');
            }
        } catch (error: any) {
            // Mark as failed if API call fails
            await prisma.deposit.update({
                where: { id: deposit.id },
                data: { status: 'FAILED' },
            });
            throw error;
        }
    });

    app.get('/history', {
        onRequest: [app.authenticate],
        schema: {
            tags: ['Deposits'],
            summary: 'Get deposit history',
            security: [{ bearerAuth: [] }],
        },
    }, async (req, reply) => {
        const userId = req.user.id;
        const deposits = await prisma.deposit.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        return deposits;
    });
};
