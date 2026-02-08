import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';

export interface TwoFactorSetup {
    secret: string;
    qrCodeUrl: string;
    backupCodes: string[];
}

export interface TwoFactorVerification {
    isValid: boolean;
    usedBackupCode?: boolean;
}

/**
 * Generate a new 2FA secret and QR code for user setup
 */
export async function generateTwoFactorSecret(
    userEmail: string,
    appName: string = 'ZVE Crypto'
): Promise<TwoFactorSetup> {
    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
        name: `${appName} (${userEmail})`,
        issuer: appName,
        length: 32,
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Generate backup codes
    const backupCodes = generateBackupCodes(8);

    return {
        secret: secret.base32,
        qrCodeUrl,
        backupCodes,
    };
}

/**
 * Verify a TOTP token
 */
export function verifyTwoFactorToken(
    secret: string,
    token: string,
    window: number = 1
): boolean {
    return speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window, // Allow 1 time step before/after (30s * window)
    });
}

/**
 * Verify a backup code
 */
export async function verifyBackupCode(
    providedCode: string,
    hashedCodes: string[]
): Promise<{ isValid: boolean; matchedIndex: number }> {
    for (let i = 0; i < hashedCodes.length; i++) {
        const isMatch = await bcrypt.compare(providedCode, hashedCodes[i]);
        if (isMatch) {
            return { isValid: true, matchedIndex: i };
        }
    }
    return { isValid: false, matchedIndex: -1 };
}

/**
 * Generate backup codes
 */
function generateBackupCodes(count: number = 8): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
        // Generate 8-character alphanumeric code
        const code = randomBytes(4).toString('hex').toUpperCase();
        // Format as XXXX-XXXX
        const formatted = `${code.slice(0, 4)}-${code.slice(4)}`;
        codes.push(formatted);
    }
    return codes;
}

/**
 * Hash backup codes for storage
 */
export async function hashBackupCodes(codes: string[]): Promise<string[]> {
    const hashed = await Promise.all(
        codes.map((code) => bcrypt.hash(code, 10))
    );
    return hashed;
}
