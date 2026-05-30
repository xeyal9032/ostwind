import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { prisma } from '@/prisma';
import { isAdminRole } from '@/lib/admin-roles';
import { touchAdminPresence } from '@/lib/admin-presence';
import { normalizeTotpCode, verifyTotpToken } from '@/lib/admin-2fa';
import { createAdminSession } from '@/lib/admin-sessions';
import { logAudit, getRequestMeta } from '@/lib/audit-log';
import { getNextAuthSecret } from '@/lib/auth-secret';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim().toLowerCase() },
        });

        if (!user || !isAdminRole(user.role) || !user.isActive) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        if (user.totpEnabled && user.totpSecret) {
          const otp = normalizeTotpCode(credentials.otp);
          if (!otp) {
            throw new Error('2FA_REQUIRED');
          }
          if (!(await verifyTotpToken(user.totpSecret, otp))) {
            throw new Error('INVALID_2FA_CODE');
          }
        }

        const meta = req ? getRequestMeta(req) : { ip: null, userAgent: null };

        await touchAdminPresence(user.id);

        let adminSessionId: string | undefined;
        try {
          const adminSession = await createAdminSession({
            userId: user.id,
            ip: meta.ip,
            userAgent: meta.userAgent,
          });
          adminSessionId = adminSession.id;
        } catch {
          // Sessiya cədvəli xətası girişi bloklamasın
        }

        await logAudit({
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          action: 'LOGIN',
          entity: 'auth',
          summary: 'Panele giriş',
          ip: meta.ip,
          userAgent: meta.userAgent,
        }).catch(() => {});

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          adminSessionId,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.adminSessionId = user.adminSessionId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      session.adminSessionId = token.adminSessionId as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: getNextAuthSecret(),
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
