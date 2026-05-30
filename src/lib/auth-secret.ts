const DEV_FALLBACK_SECRET = 'ostwind-dev-only-not-for-production';

/** Build zamanında .env olmasa da build kırılmasın */
function isNextBuildPhase(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

/**
 * NextAuth JWT imzalama anahtarı.
 * Production çalışma zamanında NEXTAUTH_SECRET zorunlu (min. 32 karakter).
 */
export function getNextAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET?.trim();

  if (secret) {
    if (
      secret.length < 32 &&
      process.env.NODE_ENV === 'production' &&
      !isNextBuildPhase()
    ) {
      console.warn(
        '[auth] NEXTAUTH_SECRET en az 32 karakter olmalı. Güçlü bir rastgele değer kullanın.',
      );
    }
    return secret;
  }

  if (process.env.NODE_ENV === 'production' && !isNextBuildPhase()) {
    throw new Error(
      'NEXTAUTH_SECRET ortam değişkeni production için zorunludur. Örnek: openssl rand -base64 32',
    );
  }

  if (!isNextBuildPhase()) {
    console.warn(
      '[auth] NEXTAUTH_SECRET tanımlı değil; yalnızca geliştirme fallback kullanılıyor.',
    );
  }

  return DEV_FALLBACK_SECRET;
}
