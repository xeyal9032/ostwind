import { generateSecret, generateURI, verify } from 'otplib';

export function generateTotpSecret() {
  return generateSecret();
}

export function getTotpUri(email: string, secret: string) {
  return generateURI({
    issuer: 'OstWind Admin',
    label: email,
    secret,
  });
}

/** Yalnız 6 rəqəmli TOTP kodu (boşluq və əlavə simvollar təmizlənir) */
export function normalizeTotpCode(raw: string | undefined | null): string {
  return String(raw ?? '').replace(/\D/g, '').slice(0, 6);
}

export async function verifyTotpToken(secret: string, token: string): Promise<boolean> {
  const code = normalizeTotpCode(token);
  if (code.length !== 6) return false;

  try {
    const result = await verify({ secret, token: code });
    return result.valid === true;
  } catch {
    return false;
  }
}
