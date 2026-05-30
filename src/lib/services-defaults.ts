import { LOCALE_KEYS, getLocaleText, mergeLocaleRecords } from '@/lib/locale-content';

export type ServiceIconKey = 'documents' | 'visa' | 'housing' | 'language' | 'university';

export type ServiceRecord = {
  id: number;
  slug: string;
  title: Record<string, string>;
  description: Record<string, string>;
  icon: ServiceIconKey;
  createdAt: Date;
  updatedAt: Date;
};

export const DEFAULT_SERVICE_SLUGS = [
  'senedlerin-hazirlanmasi',
  'viza-desteyi',
  'yasayis-yeri-secimi',
  'dil-kurslari',
] as const;

const now = new Date();

export const DEFAULT_SERVICES: ServiceRecord[] = [
  {
    id: 1,
    slug: 'senedlerin-hazirlanmasi',
    title: {
      tr: 'Evrak Hazırlığı',
      en: 'Document Preparation',
      az: 'Sənədlərin hazırlanması',
      ru: 'Подготовка документов',
      uk: 'Підготовка документів',
      ge: 'დოკუმენტების მომზადება',
    },
    description: {
      tr: 'Seçtiğiniz üniversiteye kabul için gerekli tüm belgelerin toplanması ve eksiksiz hazırlanmasında yanınızdayız.',
      en: 'We help you collect and properly prepare all documents required for admission to your chosen university.',
      az: 'Seçilmiş universitetə qəbul üçün lazım olan bütün sənədlərin toplanması və düzgün şəkildə hazırlanmasında sizə kömək edirik.',
      ru: 'Мы поможем вам собрать и правильно оформить все документы, необходимые для поступления в выбранный университет.',
      uk: 'Ми допоможемо вам зібрати та правильно оформити всі документи, необхідні для вступу до обраного університету.',
      ge: 'დაგეხმარებით შევაგროვოთ და სწორად მოვამზადოთ ყველა დოკუმენტი, რომელიც არჩეულ უნივერსიტეტში მიღებისთვის აუცილებელია.',
      features_tr:
        'Motivasyon mektubu ve özgeçmiş hazırlığı\nTranskript ve belge tercüme koordinasyonu\nBaşvuru formlarının doldurulması ve takibi',
      features_en:
        'Motivation letter and CV preparation\nTranscript and certificate translation coordination\nApplication form completion and tracking',
      features_az:
        'Motivasiya məktubu və CV hazırlığı\nTranskript və sertifikat tərcümə koordinasiyası\nMüraciət formalarının doldurulması və izlənməsi',
      features_ru:
        'Подготовка мотивационного письма и резюме\nКоординация перевода транскриптов и сертификатов\nЗаполнение и отслеживание заявок',
      features_uk:
        'Підготовка мотиваційного листа та резюме\nКоординація перекладу транскриптів і сертифікатів\nЗаповнення та відстеження заяв',
      features_ge:
        'სამოტივაციო წერილისა და CV-ის მომზადება\nტრანსკრიპტებისა და სერთიფიკატების თარგმანის კოორდინაცია\nგანაცხადის ფორმების შევსება და მონიტორინგი',
    },
    icon: 'documents',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    slug: 'viza-desteyi',
    title: {
      tr: 'Vize Desteği',
      en: 'Visa Support',
      az: 'Viza dəstəyi',
      ru: 'Визовая поддержка',
      uk: 'Візова підтримка',
      ge: 'ვიზის მხარდაჭერა',
    },
    description: {
      tr: 'Öğrenci vizesi alma sürecinin tüm aşamalarında danışmanlık ve refakat hizmeti sunuyoruz.',
      en: 'We provide consulting and accompaniment at every stage of the student visa application process.',
      az: 'Tələbə vizasının alınması prosesində bütün mərhələlərdə məsləhət və müşayiət xidməti təqdim edirik.',
      ru: 'Мы оказываем консультационную и сопроводительную поддержку на всех этапах получения студенческой визы.',
      uk: 'Ми надаємо консультаційну та супровідну підтримку на всіх етапах отримання студентської візи.',
      ge: 'ჩვენ გთავაზობთ რჩევას და თანმხლობას სტუდენტური ვიზის მიღების პროცესის ყველა ეტაპზე.',
      features_tr:
        'Evrak kontrol listesi ve dosya incelemesi\nKonsolosluk randevu rehberliği\nMülakat hazırlığı ve prova oturumları',
      features_en:
        'Document checklist and file review\nEmbassy appointment guidance\nInterview preparation and mock sessions',
      features_az:
        'Sənəd yoxlama siyahısı və fayl nəzarəti\nSəfirlik görüşünə hazırlıq rəhbərliyi\nMüsahibə hazırlığı və sınaq sessiyaları',
      features_ru:
        'Контрольный список документов и проверка дела\nПомощь с записью в посольство\nПодготовка к собеседованию и пробные сессии',
      features_uk:
        'Контрольний список документів і перевірка справи\nДопомога з записом до посольства\nПідготовка до співбесіди та пробні сесії',
      features_ge:
        'დოკუმენტების სია და ფაილის შემოწმება\nსაელჩოს ვიზიტის მომზადება\nგასაუბრების მომზადება და საცდელი სესიები',
    },
    icon: 'visa',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    slug: 'yasayis-yeri-secimi',
    title: {
      tr: 'Konaklama Seçimi',
      en: 'Accommodation Selection',
      az: 'Yaşayış yeri seçimi',
      ru: 'Подбор жилья',
      uk: 'Підбір житла',
      ge: 'საცხოვრებლის შერჩევა',
    },
    description: {
      tr: 'Eğitim kurumunuza yakın yurt veya kiralık daire arayışında ve resmileştirmede destek sağlıyoruz.',
      en: 'We support you in finding and securing dormitory or rental housing near your institution.',
      az: 'Təhsil müəssisəsinə yaxın yataqxana və ya kirayə mənzil axtarışında və rəsmiləşdirilməsində dəstək göstəririk.',
      ru: 'Мы помогаем в поиске и оформлении общежития или аренды жилья рядом с учебным заведением.',
      uk: 'Ми допомагаємо у пошуку та оформленні гуртожитку або оренди житла поруч із навчальним закладом.',
      ge: 'სასწავლო დაწესებულების ახლოს საერთო საცხოვრებლის ან ქირის ბინის ძებნასა და რეგისტრაციაში გეხმარებით.',
      features_tr:
        'Kampüse yakın yurt ve kiralık seçenekleri\nSözleşme incelemesi ve kayıt desteği\nYerleşim ve yerel oryantasyon',
      features_en:
        'Dormitory and rental options near campus\nContract review and registration support\nMove-in coordination and local orientation',
      features_az:
        'Kampus yaxınlığında yataqxana və kirayə variantları\nMüqavilə yoxlanışı və qeydiyyat dəstəyi\nYerləşmə və yerli orientasiya',
      features_ru:
        'Общежития и аренда рядом с кампусом\nПроверка договора и помощь с регистрацией\nЗаселение и местная ориентация',
      features_uk:
        'Гуртожитки та оренда поруч із кампусом\nПеревірка договору та допомога з реєстрацією\nЗаселення та міська орієнтація',
      features_ge:
        'კამპუსის ახლოს საცხოვრებელი და ქირის ვარიანტები\nხელშეკრულების შემოწმება და რეგისტრაცია\nგადასვლა და ადგილობრივი ორიენტაცია',
    },
    icon: 'housing',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    slug: 'dil-kurslari',
    title: {
      tr: 'Dil Kursları',
      en: 'Language Courses',
      az: 'Dil kursları',
      ru: 'Языковые курсы',
      uk: 'Мовні курси',
      ge: 'ენის კურსები',
    },
    description: {
      tr: 'Yabancı dil öğrenimi ve dil sınavlarına hazırlık için eğitim programları sunuyoruz.',
      en: 'We offer training programs for learning foreign languages and preparing for language exams.',
      az: 'Xarici dilləri öyrənmək və dil imtahanlarına hazırlaşmaq üçün tədris proqramları təklif edirik.',
      ru: 'Мы предлагаем учебные программы для изучения иностранных языков и подготовки к языковым экзаменам.',
      uk: 'Ми пропонуємо навчальні програми для вивчення іноземних мов і підготовки до мовних іспитів.',
      ge: 'უცხო ენების სწავლისა და ენის გამოცდების მომზადების სასწავლო პროგრამებს გთავაზობთ.',
      features_tr:
        'Seviye tespiti ve program eşleştirmesi\nIELTS, TOEFL ve TestDaF hazırlığı\nYurt dışına çıkmadan önce dil desteği',
      features_en:
        'Level assessment and program matching\nIELTS, TOEFL and TestDaF preparation\nPre-departure language support',
      features_az:
        'Səviyyə qiymətləndirməsi və proqram uyğunlaşdırması\nIELTS, TOEFL və TestDaF hazırlığı\nXaricə çıxmazdan əvvəl dil dəstəyi',
      features_ru:
        'Оценка уровня и подбор программы\nПодготовка к IELTS, TOEFL и TestDaF\nЯзыковая поддержка до отъезда',
      features_uk:
        'Оцінка рівня та підбір програми\nПідготовка до IELTS, TOEFL і TestDaF\nМовна підтримка до виїзду',
      features_ge:
        'დონის შეფასება და პროგრამის შერჩევა\nIELTS, TOEFL და TestDaF მომზადება\nგამგზავრებამდე ენის მხარდაჭერა',
    },
    icon: 'language',
    createdAt: now,
    updatedAt: now,
  },
];

/** Başlıq və təsvir üçün — features_* açarlarını nəzərə almır */
export function getLocalizedField(record: unknown, locale: string): string {
  return getLocaleText(record, locale);
}

function parseDescriptionRaw(description: unknown): Record<string, string> {
  if (!description) return {};
  if (typeof description === 'string') {
    try {
      return JSON.parse(description) as Record<string, string>;
    } catch {
      return {};
    }
  }
  return description as Record<string, string>;
}

/** Xidmət təsviri (features_* olmadan) */
export function getServiceDescription(description: unknown, locale: string): string {
  return getLocaleText(description, locale);
}

export function getServiceFeatures(description: unknown, locale: string): string[] {
  const raw = parseDescriptionRaw(description);
  const featuresStr =
    raw[`features_${locale}`]?.trim() ||
    LOCALE_KEYS.map((key) => raw[`features_${key}`]?.trim()).find(Boolean) ||
    '';
  return featuresStr
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function mergeDescriptionRecords(
  primary: unknown,
  fallback: Record<string, string>,
): Record<string, string> {
  const mergedBody = mergeLocaleRecords(primary, fallback);
  const raw = parseDescriptionRaw(primary);
  const result: Record<string, string> = { ...mergedBody };

  for (const key of LOCALE_KEYS) {
    const featureKey = `features_${key}`;
    const fromDb = raw[featureKey]?.trim();
    const fromDefault = fallback[featureKey]?.trim();
    if (fromDb) result[featureKey] = fromDb;
    else if (fromDefault) result[featureKey] = fromDefault;
  }

  return result;
}

type DbService = {
  id: number;
  slug: string;
  title: unknown;
  description: unknown;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Xidmət siyahısı: DB boşdursa standartlar; doludursa yalnız DB (təkrarlanmadan),
 * hər xidmət bütün dillərdə şablonla tamamlanır.
 */
export function getServicesForDisplay(dbServices: DbService[]): DbService[] {
  if (dbServices.length === 0) {
    return DEFAULT_SERVICES.map((service) => ({
      id: service.id,
      slug: service.slug,
      title: service.title,
      description: service.description,
      icon: service.icon,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }));
  }

  return dbServices.map(enrichDbService);
}

/** @deprecated getServicesForDisplay istifadə edin */
export function mergeServicesWithDefaults(dbServices: DbService[]): DbService[] {
  return getServicesForDisplay(dbServices);
}

/** Köhnə slug → yeni standart məzmun */
const SLUG_ALIASES: Record<string, string> = {
  'vize-danismanligi': 'viza-desteyi',
  'konaklama-destegi': 'yasayis-yeri-secimi',
};

/** Admin/DB-də qalan köhnə xidmət slug-ları */
export const LEGACY_SERVICES: ServiceRecord[] = [
  {
    id: 101,
    slug: 'universite-basvurusu',
    title: {
      tr: 'Üniversite Başvurusu',
      en: 'University Application',
      az: 'Universitet Müraciəti',
      ru: 'Подача заявления в университет',
      uk: 'Подача заяви до університету',
      ge: 'უნივერსიტეტის განაცხადი',
    },
    description: {
      tr: 'Hayalinizdeki üniversiteye kabul edilmeniz için başvuru sürecinizi profesyonelce yönetiyoruz. Doğru bölüm seçiminden niyet mektubu yazımına kadar her detayla ilgileniyoruz.',
      en: 'We professionally manage your application process to get you accepted into your dream university. We take care of every detail from choosing the right program to writing your motivation letter.',
      az: 'Xəyalınızdakı universitetə qəbul edilməyiniz üçün müraciət prosesinizi peşəkar şəkildə idarə edirik. Doğru ixtisas seçimindən motivasiya məktubunun yazılmasına qədər hər bir məsələ ilə maraqlanırıq.',
      ru: 'Мы профессионально ведём процесс поступления в университет вашей мечты — от выбора программы до мотивационного письма.',
      uk: 'Ми професійно ведемо процес вступу до університету вашої мрії — від вибору програми до мотиваційного листа.',
      ge: 'პროფესიონალურად ვმართავთ განაცხადის პროცესს თქვენი ოცნების უნივერსიტეტში — პროგრამის შერჩევიდან მოტივაციურ წერილამდე.',
      features_tr:
        'Üniversite ve bölüm seçimi danışmanlığı\nMotivasyon mektubu ve referans desteği\nBaşvuru takvimi ve son tarih yönetimi',
      features_en:
        'University and program selection consulting\nMotivation letter and reference support\nApplication timeline and deadline management',
      features_az:
        'Universitet və ixtisas seçimi məsləhəti\nMotivasiya məktubu və referans dəstəyi\nMüraciət cədvəli və son tarixlərin idarəsi',
      features_ru:
        'Консультация по выбору университета и программы\nПомощь с мотивационным письмом и рекомендациями\nУправление сроками подачи заявок',
      features_uk:
        'Консультація з вибору університету та програми\nДопомога з мотиваційним листом і рекомендаціями\nУправління термінами подачі заяв',
      features_ge:
        'უნივერსიტეტისა და პროგრამის შერჩევის კონსultatsiis\nმოტივაციური წერილისა და რეკომენდაციების მხარდაჭერა\nგანაცხადის ვადების მართვა',
    },
    icon: 'university',
    createdAt: now,
    updatedAt: now,
  },
];

const ALL_DEFAULTS: ServiceRecord[] = [...DEFAULT_SERVICES, ...LEGACY_SERVICES];

function findDefaultTemplate(slug: string): ServiceRecord | null {
  const direct = ALL_DEFAULTS.find((service) => service.slug === slug);
  if (direct) return direct;

  const aliasSlug = SLUG_ALIASES[slug];
  if (aliasSlug) {
    return ALL_DEFAULTS.find((service) => service.slug === aliasSlug) ?? null;
  }

  return null;
}

export function findDefaultServiceBySlug(slug: string) {
  return findDefaultTemplate(slug);
}

function enrichDbService(db: DbService): DbService {
  const template = findDefaultTemplate(db.slug);
  if (!template) return db;

  return {
    ...db,
    title: mergeLocaleRecords(db.title, template.title),
    description: mergeDescriptionRecords(db.description, template.description),
    icon: db.icon?.trim() ? db.icon : template.icon,
  };
}
