import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const email = process.argv[2]?.trim().toLowerCase() || 'xeyalcemilli9032@gmail.com';
const testPassword = process.argv[3];

async function main() {
  const u = await prisma.user.findUnique({ where: { email } });
  if (!u) {
    const all = await prisma.user.findMany({
      select: { id: true, email: true, role: true, isActive: true },
    });
    console.log('NOT_FOUND');
    console.log('All users:', all);
    return;
  }
  console.log({
    id: u.id,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    totpEnabled: u.totpEnabled,
    permissions: u.permissions,
  });
  if (testPassword) {
    const ok = await bcrypt.compare(testPassword, u.password);
    console.log('passwordMatch:', ok);
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  try {
    const s = await prisma.adminSession.create({
      data: { userId: u.id, expiresAt },
    });
    console.log('sessionCreate: ok', s.id);
    await prisma.adminSession.delete({ where: { id: s.id } });
  } catch (err) {
    console.log('sessionCreate: FAIL', err.message);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
