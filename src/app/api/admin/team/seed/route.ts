import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/auth';

const DEFAULT_TEAM = [
  {
    name: 'Xəyal Məmmədov',
    role: {
      tr: 'Kurucu / CEO',
      en: 'Founder / CEO',
      az: 'Təsisçi / CEO',
      ru: 'Основатель / CEO',
      uk: 'Засновник / CEO',
      ge: 'დამფუძნებელი / CEO'
    },
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'xeyal@ostwindgroup.com',
    },
  },
  {
    name: 'Aysel Kərimova',
    role: {
      tr: 'Eğitim Danışmanı',
      en: 'Education Consultant',
      az: 'Təhsil Məsləhətçisi',
      ru: 'Консультант по образованию',
      uk: 'Консультант з освіти',
      ge: 'განათლების კონსულტანტი'
    },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'aysel@ostwindgroup.com',
    }
  },
  {
    name: 'Murad Əliyev',
    role: {
      tr: 'Vize Uzmanı',
      en: 'Visa Specialist',
      az: 'Viza Mütəxəssisi',
      ru: 'Специалист по визам',
      uk: 'Спеціаліст з віз',
      ge: 'ვიზის სპეციალისტი'
    },
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'murad@ostwindgroup.com',
    }
  }
];

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    // Önce mevcutları temizleyelim (isteğe bağlı ama seed için temiz başlamak iyi olabilir)
    // await prisma.teamMember.deleteMany({});
    
    for (const member of DEFAULT_TEAM) {
      await prisma.teamMember.create({
        data: {
          name: member.name,
          role: member.role,
          image: member.image,
          socialLinks: member.socialLinks
        }
      });
    }
    return NextResponse.json({ success: true, message: 'Default team members inserted successfully!' });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ success: false, error: err.message || 'Unknown error' });
  }
}
