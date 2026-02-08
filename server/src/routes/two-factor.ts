import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { generateTwoFactorSecret, verifyTwoFactorToken, hashBackupCodes, verifyBackupCode } from '../lib/two-factor.js';

// Schemas
const SetupTwoFactorSchema = z.object({});

const VerifySetupSchema = z.object({
    secret: z.string(),
    token: z.string().length(6),
});

const EnableTwoFactorSchema = z.object({
    token: z.string().length(6),
});

const DisableTwoFactorSchema = z.object({
    token: z.string().length(6),
});

const VerifyTwoFactorSchema = z.object({
    token: z.string(),
});

export const twoFactorRoutes: FastifyPluginAsync = async (app) => {
    /**
     * POST /2fa/setup
     * Generate a new 2FA secret and QR code
     */
    app.post('/2fa/setup', {
        onRequest: [app.authenticate],
        schema: {
            tags: ['2FA'],
            summary: 'Setup 2FA',
            security: [{ bearerAuth: [] }],
        },
    }, async (req, reply) => {
        const userId = req.user.id;

        // Check if user already has 2FA enabled
        const existing = await prisma.twoFactorSecret.findUnique({
            where: { userId },
        });

        if (existing && existing.isEnabled) {
            return reply.code(400).send({
                error: 'Two-factor authentication is already enabled. Disable it first to setup again.',
            });
        }

        // Generate new secret
        const { secret, qrCodeUrl, backupCodes } = await generateTwoFactorSecret(req.user.email);

        // Hash backup codes before storage
        const hashedBackupCodes = await hashBackupCodes(backupCodes);

        // Store secret (not enabled yet)
        await prisma.twoFactorSecret.upsert({
            where: { userId },
            create: {
                userId,
                secret,
                isEnabled: false,
                backupCodes: hashedBackupCodes,
            },
            update: {
                secret,
                isEnabled: false,
                backupCodes: hashedBackupCodes,
            },
        });

        return reply.send({
            qrCodeUrl,
            backupCodes, // Return plain codes ONCE, user must save them
            message: 'Scan the QR code with your authenticator app, then verify with a code to enable 2FA.',
        });
    });

    /**
     * POST /2fa/enable
     * Verify and enable 2FA
     */
    app.post('/2fa/enable', {
        onRequest: [app.authenticate],
        schema: {
            tags: ['2FA'],
            summary: 'Enable 2FA',
            security: [{ bearerAuth: [] }],
            body: EnableTwoFactorSchema,
        },
    }, async (req, reply) => {
        const { token } = EnableTwoFactorSchema.parse(req.body);
        const userId = req.user.id;

        const twoFactor = await prisma.twoFactorSecret.findUnique({
            where: { userId },
        });

        if (!twoFactor) {
            return reply.code(400).send({ error: 'Setup 2FA first.' });
        }

        if (twoFactor.isEnabled) {
            return reply.code(400).send({ error: '2FA is already enabled.' });
        }

        // Verify token
        const isValid = verifyTwoFactorToken(twoFactor.secret, token);

        if (!isValid) {
            return reply.code(400).send({ error: 'Invalid verification code.' });
        }

        // Enable 2FA
        await prisma.twoFactorSecret.update({
            where: { userId },
            data: { isEnabled: true },
        });

        return reply.send({ message: 'Two-factor authentication enabled successfully.' });
    });

    /**
     * POST /2fa/disable
     * Disable 2FA
     */
    app.post('/2fa/disable', {
        onRequest: [app.authenticate],
        schema: {
            tags: ['2FA'],
            summary: 'Disable 2FA',
            security: [{ bearerAuth: [] }],
            body: DisableTwoFactorSchema,
        },
    }, async (req, reply) => {
        const { token } = DisableTwoFactorSchema.parse(req.body);
        const userId = req.user.id;

        const twoFactor = await prisma.twoFactorSecret.findUnique({
            where: { userId },
        });

        if (!twoFactor || !twoFactor.isEnabled) {
            return reply.code(400).send({ error: '2FA is not enabled.' });
        }

        // Verify token before disabling
        const isValid = verifyTwoFactorToken(twoFactor.secret, token);

        if (!isValid) {
            return reply.code(400).send({ error: 'Invalid verification code.' });
        }

        // Disable 2FA
        await prisma.twoFactorSecret.update({
            where: { userId },
            data: { isEnabled: false },
        });

        return reply.send({ message: 'Two-factor authentication disabled.' });
    });

    /**
     * GET /2fa/status
     * Check 2FA status
     */
    app.get('/2fa/status', {
        onRequest: [app.authenticate],
        schema: {
            tags: ['2FA'],
            summary: 'Get 2FA status',
            security: [{ bearerAuth: [] }],
        },
    }, async (req, reply) => {
        const userId = req.user.id;

        const twoFactor = await prisma.twoFactorSecret.findUnique({
            where: { userId },
        });

        return reply.send({
            enabled: twoFactor?.isEnabled || false,
            setupRequired: !twoFactor,
        });
    });
};
