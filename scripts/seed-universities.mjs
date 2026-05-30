import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const universities = [
  // --- KHARKOV (Harkov) ÜNİVERSİTELERİ ---
  {
    slug: 'kharkiv-national-medical-university',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tuitionFee: '$4,200 - $4,800 / yıl',
    name: {
      en: 'Kharkiv National Medical University (KhNMU)',
      tr: 'Harkov Ulusal Tıp Üniversitesi',
      az: 'Xarkov Milli Tibb Universiteti',
      uk: 'Харківський національний медичний університет',
      ru: 'Харьковский национальный медицинский университет',
      ge: 'ხარკოვის ეროვნული სამედიცინო უნივერსიტეტი'
    },
    country: { en: 'Ukraine', tr: 'Ukrayna', az: 'Ukrayna', uk: 'Україна', ru: 'Украина', ge: 'უკრაინა' },
    city: { en: 'Kharkiv', tr: 'Harkov', az: 'Xarkov', uk: 'Харків', ru: 'Харьков', ge: 'ხარკოვი' },
    description: {
      en: 'One of the oldest and leading medical universities in Ukraine, offering top-tier education in Medicine, Dentistry, and Nursing for international students. Recognized by WHO.',
      tr: 'Ukrayna\'nın en eski ve köklü tıp üniversitelerinden biridir. Uluslararası öğrenciler için Tıp ve Diş Hekimliği alanlarında eğitim sunar.',
      az: 'Ukraynanın ən qədim və aparıcı tibb universitetlərindən biridir. Beynəlxalq tələbələr üçün yüksək səviyyəli təhsil təklif edir.',
      uk: 'Один з найстаріших та провідних медичних університетів України, що пропонує першокласну освіту з медицини для іноземних студентів.',
      ru: 'Один из старейших и ведущих медицинских университетов Украины для иностранных студентов.',
      ge: 'ერთ-ერთი უძველესი და წამყვანი სამედიცინო უნივერსიტეტი უკრაინაში.'
    }
  },
  {
    slug: 'karazin-kharkiv-national-university',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tuitionFee: '$2,500 - $4,500 / yıl',
    name: {
      en: 'V. N. Karazin Kharkiv National University',
      tr: 'V. N. Karazin Harkov Ulusal Üniversitesi',
      az: 'V. N. Karazin Xarkov Milli Universiteti',
      uk: 'Харківський національний університет імені В. Н. Каразіна',
      ru: 'Харьковский национальный университет имени В. Н. Каразина',
      ge: 'ვ. ნ. კარაზინის ხარკოვის ეროვნული უნივერსიტეტი'
    },
    country: { en: 'Ukraine', tr: 'Ukrayna', az: 'Ukrayna', uk: 'Україна', ru: 'Украина', ge: 'უკრაინა' },
    city: { en: 'Kharkiv', tr: 'Harkov', az: 'Xarkov', uk: 'Харків', ru: 'Харьков', ge: 'ხარკოვი' },
    description: {
      en: 'A major university in Ukraine and one of the oldest in Eastern Europe. Offers a wide range of programs including Medicine, Engineering, Business, and Humanities.',
      tr: 'Ukrayna\'nın en büyük ve Doğu Avrupa\'nın en eski üniversitelerinden biridir. Çok çeşitli programlar sunar.',
      az: 'Ukraynanın əsas və Şərqi Avropanın ən qədim universitetlərindən biridir.',
      uk: 'Один з найбільших університетів України та найстаріших у Східній Європі.',
      ru: 'Один из крупнейших университетов Украины и старейших в Восточной Европе.',
      ge: 'ერთ-ერთი უძველესი უნივერსიტეტი აღმოსავლეთ ევროპაში.'
    }
  },
  {
    slug: 'kharkiv-national-university-of-radio-electronics',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tuitionFee: '$2,200 - $3,000 / yıl',
    name: {
      en: 'Kharkiv National University of Radio Electronics (NURE)',
      tr: 'Harkov Ulusal Radyo Elektronik Üniversitesi (NURE)',
      az: 'Xarkov Milli Radioelektronika Universiteti (NURE)',
      uk: 'Харківський національний університет радіоелектроніки (ХНУРЕ)',
      ru: 'Харьковский национальный университет радиоэлектроники (ХНУРЭ)',
      ge: 'ხარკოვის ეროვნული რადიოელექტრონიკის უნივერსიტეტი'
    },
    country: { en: 'Ukraine', tr: 'Ukrayna', az: 'Ukrayna', uk: 'Україна', ru: 'Украина', ge: 'უკრაინა' },
    city: { en: 'Kharkiv', tr: 'Harkov', az: 'Xarkov', uk: 'Харків', ru: 'Харьков', ge: 'ხარკოვი' },
    description: {
      en: 'One of the most prominent universities in Ukraine for IT, Computer Science, and Electronics.',
      tr: 'Bilişim Teknolojileri (IT), Bilgisayar Bilimleri ve Elektronik alanında Ukrayna\'nın en seçkin üniversitesidir.',
      az: 'İT, Kompüter Elmləri və Elektronika üzrə Ukraynanın ən görkəmli universitetlərindən biridir.',
      uk: 'Один з найвідоміших університетів України в галузі ІТ, комп\'ютерних наук та електроніки.',
      ru: 'Один из самых известных университетов Украины в области ИТ и электроники.',
      ge: 'საინფორმაციო ტექნოლოგიების ერთ-ერთი წამყვანი უნივერსიტეტი უკრაინაში.'
    }
  },
  {
    slug: 'kharkiv-aviation-institute',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tuitionFee: '$2,500 - $3,200 / yıl',
    name: {
      en: 'National Aerospace University (KhAI)',
      tr: 'Harkov Havacılık Enstitüsü (KhAI)',
      az: 'Xarkov Milli Aerokosmik Universiteti (KhAI)',
      uk: 'Національний аерокосмічний університет ім. М. Є. Жуковського «ХАІ»',
      ru: 'Национальный аэрокосмический университет им. Н. Е. Жуковского «ХАИ»',
      ge: 'ეროვნული აეროკოსმოსური უნივერსიტეტი (KhAI)'
    },
    country: { en: 'Ukraine', tr: 'Ukrayna', az: 'Ukrayna', uk: 'Україна', ru: 'Украина', ge: 'უკრაინა' },
    city: { en: 'Kharkiv', tr: 'Harkov', az: 'Xarkov', uk: 'Харків', ru: 'Харьков', ge: 'ხარკოვი' },
    description: {
      en: 'The leading educational institution in Ukraine for aviation and space engineering.',
      tr: 'Havacılık ve uzay mühendisliği alanında Ukrayna\'nın lider eğitim kurumudur.',
      az: 'Aviasiya və kosmik mühəndislik sahəsində Ukraynanın aparıcı təhsil müəssisəsidir.',
      uk: 'Провідний навчальний заклад України з авіаційної та космічної інженерії.',
      ru: 'Ведущее учебное заведение Украины в области авиационной и космической инженерии.',
      ge: 'წამყვანი საგანმანათლებლო დაწესებულება საავიაციო და კოსმოსურ ინჟინერიაში.'
    }
  },

  // --- TERNOPIL ÜNİVERSİTELERİ ---
  {
    slug: 'ternopil-national-medical-university',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tuitionFee: '$4,000 - $4,600 / yıl',
    name: {
      en: 'Ternopil National Medical University (TNMU)',
      tr: 'Ternopil Ulusal Tıp Üniversitesi (TNMU)',
      az: 'Ternopil Milli Tibb Universiteti',
      uk: 'Тернопільський національний медичний університет',
      ru: 'Тернопольский национальный медицинский университет',
      ge: 'ტერნოპილის ეროვნული სამედიცინო უნივერსიტეტი'
    },
    country: { en: 'Ukraine', tr: 'Ukrayna', az: 'Ukrayna', uk: 'Україна', ru: 'Украина', ge: 'უკრაინა' },
    city: { en: 'Ternopil', tr: 'Ternopil', az: 'Ternopil', uk: 'Тернопіль', ru: 'Тернополь', ge: 'ტერნოპილი' },
    description: {
      en: 'Highly popular among international students, offering excellent medical, dental and pharmacy programs in English.',
      tr: 'Uluslararası öğrenciler arasında çok popüler olan üniversite; İngilizce Tıp, Diş Hekimliği ve Eczacılık programları sunar.',
      az: 'Xarici tələbələr arasında çox məşhurdur, yüksək keyfiyyətli tibb və əczaçılıq proqramları təklif edir.',
      uk: 'Надзвичайно популярний серед іноземних студентів, пропонує відмінні медичні програми англійською мовою.',
      ru: 'Очень популярен среди иностранных студентов, предлагает отличные медицинские программы.',
      ge: 'პოპულარული უცხოელ სტუდენტებში, სთავაზობს შესანიშნავ სამედიცინო პროგრამებს.'
    }
  },
  {
    slug: 'west-ukrainian-national-university',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tuitionFee: '$1,800 - $2,500 / yıl',
    name: {
      en: 'West Ukrainian National University (WUNU)',
      tr: 'Batı Ukrayna Ulusal Üniversitesi (WUNU)',
      az: 'Qərbi Ukrayna Milli Universiteti',
      uk: 'Західноукраїнський національний університет',
      ru: 'Западноукраинский национальный университет',
      ge: 'დასავლეთ უკრაინის ეროვნული უნივერსიტეტი'
    },
    country: { en: 'Ukraine', tr: 'Ukrayna', az: 'Ukrayna', uk: 'Україна', ru: 'Украина', ge: 'უკრაინა' },
    city: { en: 'Ternopil', tr: 'Ternopil', az: 'Ternopil', uk: 'Тернопіль', ru: 'Тернополь', ge: 'ტერნოპილი' },
    description: {
      en: 'A leading higher education institution in Economics, Business, Law, and International Relations.',
      tr: 'Ekonomi, İşletme, Hukuk ve Uluslararası İlişkiler alanlarında lider bir yükseköğretim kurumudur.',
      az: 'İqtisadiyyat, Biznes və Hüquq sahələrində aparıcı ali təhsil müəssisəsidir.',
      uk: 'Провідний заклад вищої освіти в галузі економіки, бізнесу, права та міжнародних відносин.',
      ru: 'Ведущее высшее учебное заведение в области экономики и бизнеса.',
      ge: 'წამყვანი უმაღლესი სასწავლებელი ეკონომიკისა და ბიზნესის სფეროში.'
    }
  },
  {
    slug: 'ternopil-ivan-puluj-national-technical-university',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tuitionFee: '$2,000 - $2,800 / yıl',
    name: {
      en: 'Ternopil Ivan Puluj National Technical University',
      tr: 'Ternopil Ivan Puluj Ulusal Teknik Üniversitesi',
      az: 'Ternopil İvan Puluy Milli Texniki Universiteti',
      uk: 'Тернопільський національний технічний університет імені Івана Пулюя',
      ru: 'Тернопольский национальный технический университет имени Ивана Пулюя',
      ge: 'ტერნოპილის ივან პულუის ეროვნული ტექნიკური უნივერსიტეტი'
    },
    country: { en: 'Ukraine', tr: 'Ukrayna', az: 'Ukrayna', uk: 'Україна', ru: 'Украина', ge: 'უკრაინა' },
    city: { en: 'Ternopil', tr: 'Ternopil', az: 'Ternopil', uk: 'Тернопіль', ru: 'Тернополь', ge: 'ტერნოპილი' },
    description: {
      en: 'Specialized in mechanical engineering, computer science, and technical programs with a strong practical approach.',
      tr: 'Makine mühendisliği, bilgisayar bilimleri ve teknik programlarda uzmanlaşmış, uygulamalı eğitime önem veren bir kurumdur.',
      az: 'Maşınqayırma, kompüter elmləri və texniki proqramlar üzrə ixtisaslaşmışdır.',
      uk: 'Спеціалізується на машинобудуванні, комп\'ютерних науках та технічних програмах з сильним практичним підходом.',
      ru: 'Специализируется на машиностроении и компьютерных науках.',
      ge: 'სპეციალიზირებულია მექანიკურ ინჟინერიასა და კომპიუტერულ მეცნიერებებში.'
    }
  },

  // --- KİEV (Kyiv) ÜNİVERSİTELERİ ---
  {
    slug: 'kpi-kyiv-polytechnic-institute',
    image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tuitionFee: '$2,800 - $3,500 / yıl',
    name: {
      en: 'Igor Sikorsky Kyiv Polytechnic Institute (KPI)',
      tr: 'Igor Sikorsky Kiev Politeknik Enstitüsü (KPI)',
      az: 'İqor Sikorski Kiyev Politexnik İnstitutu (KPI)',
      uk: 'КПІ ім. Ігоря Сікорського',
      ru: 'КПИ им. Игоря Сикорского',
      ge: 'კიევის პოლიტექნიკური ინსტიტუტი'
    },
    country: { en: 'Ukraine', tr: 'Ukrayna', az: 'Ukrayna', uk: 'Україна', ru: 'Украина', ge: 'უკრაინა' },
    city: { en: 'Kyiv', tr: 'Kiev', az: 'Kiyev', uk: 'Київ', ru: 'Киев', ge: 'კიევი' },
    description: {
      en: 'The largest and most prestigious technical university in Ukraine. Famous for IT, Aviation, Engineering, and Computer Science programs.',
      tr: 'Ukrayna\'nın en büyük ve en prestijli teknik üniversitesidir. BT, Havacılık ve Mühendislik programlarıyla ünlüdür.',
      az: 'Ukraynanın ən böyük və ən prestijli texniki universitetidir.',
      uk: 'Найбільший та найпрестижніший технічний університет України.',
      ru: 'Крупнейший и самый престижный технический университет Украины.',
      ge: 'ყველაზე დიდი და პრესტიჟული ტექნიკური უნივერსიტეტი უკრაინაში.'
    }
  }
];

async function main() {
  console.log('Eski üniversite verileri temizleniyor...');
  await prisma.university.deleteMany();
  
  console.log('Yeni üniversiteler (Harkov & Ternopil odaklı) ekleniyor...');
  for (const uni of universities) {
    const created = await prisma.university.create({
      data: uni
    });
    console.log(`✅ Eklendi: ${created.slug}`);
  }
  console.log('🎉 Tohumlama (seed) işlemi tamamlandı!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
