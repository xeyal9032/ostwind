import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const emailByName = {
  'Xəyal Məmmədov': 'xeyal@ostwindgroup.com',
  'Farrukh Jafarov': 'farrukh@ostwindgroup.com',
  'Aysel Kərimova': 'aysel@ostwindgroup.com',
  'Murad Əliyev': 'murad@ostwindgroup.com',
};

const members = await prisma.teamMember.findMany();

for (const member of members) {
  const links =
    member.socialLinks && typeof member.socialLinks === 'object' && !Array.isArray(member.socialLinks)
      ? { ...member.socialLinks }
      : {};

  const email = emailByName[member.name] || links.email || `info@ostwindgroup.com`;

  await prisma.teamMember.update({
    where: { id: member.id },
    data: {
      socialLinks: {
        ...links,
        email,
      },
    },
  });
  console.log(`Güncellendi: ${member.name} -> ${email}`);
}

await prisma.$disconnect();
