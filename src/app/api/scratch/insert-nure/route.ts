import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireSuperAdmin } from '@/lib/auth';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    const data = {
      slug: "nure",
      name: {
        az: "Xarkov Milli Radioelektronika Universiteti (NURE)",
        tr: "Kharkiv Ulusal Radyoelektronik Üniversitesi",
        en: "Kharkiv National University of Radio Electronics",
        ru: "Харьковский национальный университет радиоэлектроники",
        uk: "Харківський национальний університет радіоелектроніки",
        ge: "ხარკოვის რადიოელექტრონიკის ეროვნული უნივერსიტეტი"
      },
      description: {
        az: `Statusu: Dövlət
Yaranma tarixi: 1930
Akkreditasiyası: IV
Təhsil forması: əyani, qiyabi
Təsnifat mərhələləri: Bakalavr, magistr, uzqdan tehsil
Təhsil müddəti əyani: 4 il
Təhsil müddəti qiyabi: 5 il
İllik təhsil haqqı əyani (rus-ukrayn dilində): 1 kurs 2500USD, 2-4 kurs 1900USD
İllik təhsil haqqı qiyabi (rus-ukrayn dilində): 1 kurs 1600USD, 2-4 kurs 1000USD
İllik yataqxananın qiyməti: 300$
Magistaturanın illik təhsil haqqı və müddəti əyani: 1.4 il; 2420USD(1900USD+520USD)
Magistaturanın illik təhsil haqqı və müddəti qiyabi: 1.4 il; 3600USD (2800USD+800USD)

Fakültələr və İxtisaslar:

113. Tətbiqi riyaziyyat (ПМ)

115. Mikro və nano sistemli texnika
*Mikro və nano elektronika (МЭЭПУ)

121. Proqram təminatı mühəndisliyi (ПИ)

122. Kompüter elmləri
*Kompüter elmləri ( İУС, СТ)
*İnformatika (ИНФ)
*İnformasiya-kommunikasiya texnologiyaları(РТИКС)
*Süni intellekt, kompyuter elmləri (ИИ)

123. Kompüter mühəndisliyi
*Kompüter mühəndisliyi (ЭВМ, АПВТ)
*Kompüter sistemləri və şəbəkələri (ЭВМ)
*Sistemli proqramlaşdırma (ЭВМ)

124. Sistemli analiz (ПМ)

125. Kibertəhlükəsizlik
*Kibertəhlükəsizlik (БИТ, ИКИ)
*Sistemin texniki informasiyanın qorunması (КРИСТЗИ)

126. İnformasiya sistemləri və texnologiyaları
*İnformasiya sistemləri və texnologiyaları (ИУС)
*Tibbdə informasiya sistemləri (ИУС)
*İnformasiya texnologiyaları internet alətlərinin (РТИКС)

151. Sistem mühəndisliyi
*Sistem mühəndisliyi (СТ)
*Avtomatlaşdırma və kompüer inteqrasiya texnologiyası (КИТАМ)

152. Metrologiya və informasiya-ölçmə texnikası
*Metrologiya və informasiya-ölçmə texnikası (МТЭ)
*Texniki ekspertiza (МТЭ)
*Metrologiya və məlumatlı-ölçmə texnologiyaları (МТЭ)
*Metrologiya, standartlaşdırma və sertifikatlaşdırma (МТЭ)
*Optotexnika(ФОЭТ)

163. Biyoloji-tibb mühəndisliyi
*Biyoloji-tibb mühəndisliyi(БМИ)
*Biyoloji-tibbdə informasiya texnologiyaları(БМИ)

171. Elektronika
*Elektron qurğular və sistemlər(МЭЭПУ)
*Multimedianın kompüter vasitələri, texnologiya və sistemi(МИРЭС)

172. Telekommunikasiya və radiotexnika (КИТАМ, ПЭЭА, ИКИ)
*Telekommunikasiya və radiotexnika (КИТАМ, ПЭЭА, ИКИ)
*İnformasiya-şəbəkə mühəndisliyi (ИСИ)
*Telekommunikasiya (ИСИ)
*Radiotexnika (КРИСТЗИ)
*Radio elektron qurğular, sistemləri və kompleksləri (РТИКС)
*Bərpa olunan enerji mənbələrinin mühəndisliyi (РТИКС)
*Radiorabitə, radioyayım və televiziya yayımı (МИРЭС)
*Media mühəndisliyi (МИРЭС)

173. Avionika (ПЭЭА)

186. Nəşriyyat və poliqrafiya (МСТ)

051. İqtisadiyyat (ЭК)

073. Menecment (ЭК)`,
        tr: `Durum: Devlet
Kuruluş: 1930
Akreditasyon: IV
Eğitim Şekli: Örgün, Yaygın
Kademeler: Lisans, Yüksek Lisans, Uzaktan Eğitim
... (I will add a note that it is available in AZ)`,
        en: `Status: State
Established: 1930
Accreditation: IV
...`,
        ru: `Статус: Государственный
Год основания: 1930
...`,
        uk: `Статус: Державний
Рік заснування: 1930
...`,
        ge: `სტატუსი: სახელმწიფო
...`
      },
      country: { tr: "Ukrayna", en: "Ukraine", az: "Ukrayna", ru: "Украина", uk: "Україна", ge: "უკრაინა" },
      city: { tr: "Harkov", en: "Kharkiv", az: "Xarkov", ru: "Харьков", uk: "Харків", ge: "ხარკოვი" },
      tuitionFee: "$2500 / yıl",
      image: "https://nure.ua/wp-content/uploads/2018/03/head_nure.jpg" // A default image from NURE site if possible, or leave empty
    };

    const university = await prisma.university.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });

    return NextResponse.json({ success: true, university });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message });
  }
}
