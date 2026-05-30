/**
 * User cədvəlində rolları düzəldir və ən azı bir SUPER_ADMIN təmin edir.
 * İstifadə: node scripts/ensure-admin-users.mjs
 */
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const VALID_ROLES = ['SUPER_ADMIN', 'ADMIN'];

async function main() {
  const users = await prisma.user.findMany();
  let fixed = 0;

  for (const user of users) {
    if (!VALID_ROLES.includes(user.role)) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' },
      });
      console.log(`Rol düzəldildi: ${user.email} → ADMIN`);
      fixed++;
    }
  }

  const superCount = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
  if (superCount === 0 && users.length > 0) {
    const first = users[0];
    await prisma.user.update({
      where: { id: first.id },
      data: { role: 'SUPER_ADMIN' },
    });
    console.log(`İlk istifadəçi super admin edildi: ${first.email}`);
    fixed++;
  }

  console.log(
    fixed > 0
      ? `Tamamlandı (${fixed} dəyişiklik).`
      : 'Heç bir düzəliş lazım deyil — rollar düzgündür.',
  );
  console.log(`Cəmi istifadəçi: ${users.length}, super admin: ${superCount || (users.length ? 1 : 0)}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
