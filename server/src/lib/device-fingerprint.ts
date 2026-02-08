import { createHash } from 'crypto';

export interface DeviceFingerprint {
    fingerprint: string;
    name: string;
    userAgent: string;
}

/**
 * Generate a device fingerprint from request headers
 */
export function generateDeviceFingerprint(
    userAgent: string,
    ip: string,
    acceptLanguage?: string
): DeviceFingerprint {
    // Combine device-identifying information
    const fingerprintString = [
        userAgent,
        ip,
        acceptLanguage || '',
    ].join('|');

    // Create hash
    const fingerprint = createHash('sha256')
        .update(fingerprintString)
        .digest('hex');

    // Extract device name from user agent
    const name = extractDeviceName(userAgent);

    return {
        fingerprint,
        name,
        userAgent,
    };
}

/**
 * Extract a human-readable device name from user agent
 */
function extractDeviceName(userAgent: string): string {
    // Browser detection
    let browser = 'Unknown Browser';
    if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) {
        browser = 'Chrome';
    } else if (/firefox/i.test(userAgent)) {
        browser = 'Firefox';
    } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
        browser = 'Safari';
    } else if (/edg/i.test(userAgent)) {
        browser = 'Edge';
    }

    // OS detection
    let os = 'Unknown OS';
    if (/windows/i.test(userAgent)) {
        os = 'Windows';
    } else if (/mac/i.test(userAgent)) {
        os = 'macOS';
    } else if (/linux/i.test(userAgent)) {
        os = 'Linux';
    } else if (/android/i.test(userAgent)) {
        os = 'Android';
    } else if (/iphone|ipad/i.test(userAgent)) {
        os = 'iOS';
    }

    return `${browser} on ${os}`;
}

/**
 * Check if device is trusted for a user
 */
export interface DeviceVerificationResult {
    isKnown: boolean;
    isTrusted: boolean;
    requireVerification: boolean;
}
