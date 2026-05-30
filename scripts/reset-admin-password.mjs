/**
 * Admin şifrəsini sıfırlayır.
 * İstifadə: node scripts/reset-admin-password.mjs email@example.com YeniSifre123
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const email = process.argv[2]?.trim().toLowerCase();
const password = process.argv[3];

if (!email || !password) {
  console.error('İstifadə: node scripts/reset-admin-password.mjs email@example.com YeniSifre');
  process.exit(1);
}

if (password.length < 6) {
  console.error('Şifrə ən azı 6 simvol olmalıdır');
  process.exit(1);
}

async function main() {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error('İstifadəçi tapılmadı:', email);
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, isActive: true },
  });

  console.log(`Şifrə yeniləndi: ${email} (id: ${user.id}, rol: ${user.role})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
