import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/prisma';
import { getNextAuthSecret } from '@/lib/auth-secret';

export const STUDENT_COOKIE_NAME = 'ostwind_student';
const COOKIE_NAME = STUDENT_COOKIE_NAME;
const MAX_AGE_SEC = 30 * 24 * 60 * 60;

export function getStudentCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: MAX_AGE_SEC,
  };
}

export type StudentSessionPayload = {
  studentId: number;
  email: string;
  exp: number;
};

function sign(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

export function createStudentToken(payload: Omit<StudentSessionPayload, 'exp'>): string {
  const secret = getNextAuthSecret();
  const full: StudentSessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SEC,
  };
  const data = Buffer.from(JSON.stringify(full)).toString('base64url');
  const sig = sign(data, secret);
  return `${data}.${sig}`;
}

export function verifyStudentToken(token: string): StudentSessionPayload | null {
  try {
    const secret = getNextAuthSecret();
    const [data, sig] = token.split('.');
    if (!data || !sig || sign(data, secret) !== sig) return null;
    const payload = JSON.parse(
      Buffer.from(data, 'base64url').toString('utf8'),
    ) as StudentSessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Route handler cavabına cookie əlavə edir (tövsiyə olunan) */
export function attachStudentSessionCookie(
  response: NextResponse,
  payload: Omit<StudentSessionPayload, 'exp'>,
) {
  const token = createStudentToken(payload);
  response.cookies.set(COOKIE_NAME, token, getStudentCookieOptions());
  return response;
}

export async function setStudentSessionCookie(payload: Omit<StudentSessionPayload, 'exp'>) {
  const token = createStudentToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, getStudentCookieOptions());
}

export async function clearStudentSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getStudentSession(): Promise<{
  student: { id: number; email: string; firstName: string; lastName: string };
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyStudentToken(token);
  if (!payload) return null;

  const student = await prisma.studentUser.findUnique({
    where: { id: payload.studentId },
    select: { id: true, email: true, firstName: true, lastName: true, isActive: true },
  });

  if (!student || !student.isActive || student.email !== payload.email) return null;

  return { student };
}
