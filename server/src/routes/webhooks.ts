import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { binancePay } from '../lib/binance-pay.js';

export const webhooksRoutes: FastifyPluginAsync = async (app) => {
    app.post('/binance', {
        schema: {
            tags: ['Webhooks'],
            summary: 'Binance Pay Webhook Handler',
            // No security needed here, signature verification is done manually
        },
    }, async (req, reply) => {
        const headers = req.headers as any;
        const result = req.body as any;

        // 1. Verify Signature
        const signature = headers['binancepay-signature'];
        const timestamp = headers['binancepay-timestamp'];
        const nonce = headers['binancepay-nonce'];
        const bodyStr = JSON.stringify(req.body);

        if (!binancePay.verifyWebhookSignature(signature, bodyStr, timestamp, nonce)) {
            reply.code(401).send({ returnCode: 'FAIL', returnMessage: 'Invalid Signature' });
            return;
        }

        // 2. Process BizType: PAY
        if (result.bizType === 'PAY' && result.bizStatus === 'PAY_SUCCESS') {
            const { merchantTradeNo, totalFee, currency } = result.data;

            // Find deposit
            const deposit = await prisma.deposit.findUnique({
                where: { merchantTradeNo },
                include: { user: true }
            });

            if (!deposit) {
                console.error(`Deposit not found: ${merchantTradeNo}`);
                return { returnCode: 'SUCCESS', returnMessage: null }; // Ack anyway
            }

            if (deposit.status === 'COMPLETED') {
                return { returnCode: 'SUCCESS', returnMessage: null }; // Idempotency
            }

            // 3. Credit User Balance (Transaction)
            await prisma.$transaction(async (tx) => {
                // Mark deposit as completed
                await tx.deposit.update({
                    where: { id: deposit.id },
                    data: {
                        status: 'COMPLETED',
                        completedAt: new Date(),
                    },
                });

                // Find or create USDT Asset
                const asset = await tx.asset.findUnique({ where: { symbol: 'USDT' } });
                if (!asset) throw new Error('USDT Asset not found');

                // Find or create Wallet
                let wallet = await tx.wallet.findUnique({
                    where: { userId_assetId: { userId: deposit.userId, assetId: asset.id } }
                });

                if (!wallet) {
                    wallet = await tx.wallet.create({
                        data: { userId: deposit.userId, assetId: asset.id, balance: 0 }
                    });
                }

                // Increment Balance
                await tx.wallet.update({
                    where: { id: wallet.id },
                    data: { balance: { increment: Number(totalFee) } }
                });

                // Create Transaction Record
                await tx.transaction.create({
                    data: {
                        userId: deposit.userId,
                        assetId: asset.id,
                        type: 'deposit',
                        status: 'completed',
                        amount: Number(totalFee),
                        amountUsd: Number(totalFee), // Assuming 1:1 for USDT
                        txHash: result.bizIdStr, // Binance Order ID
                        meta: { binancePayId: result.data.prepayId },
                    }
                });
            });

            console.log(`Deposit credited: ${merchantTradeNo}`);
        }

        return { returnCode: 'SUCCESS', returnMessage: null };
    });
};
