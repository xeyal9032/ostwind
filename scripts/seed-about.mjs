import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const company = {
  companyTitle: {
    tr: 'OSTWIND şirketi hakkında',
    en: 'About OSTWIND',
    az: 'OSTWIND şirkəti haqqında',
    ru: 'О компании OSTWIND',
    uk: 'Про компанію OSTWIND',
    ge: 'OSTWIND-ის შესახებ',
  },
  missionTitle: {
    tr: 'Misyonumuz',
    en: 'Our Mission',
    az: 'Missiyamız',
    ru: 'Наша миссия',
    uk: 'Наша місія',
    ge: 'ჩვენი მისია',
  },
  missionText: {
    tr: 'Öğrencilerin yurtdışında kaliteli eğitim alma hayallerini gerçekleştirmelerine yardımcı oluyoruz. Sunduğumuz geniş hizmet yelpazesiyle onları dünyanın önde gelen üniversitelerine kabul için destekliyoruz.',
    en: 'We help students realize their dream of quality education abroad. Through our wide range of services, we support their admission to leading universities worldwide.',
    az: 'Tələbələrin xaricdə keyfiyyətli təhsil almaq arzularını gerçəkləşdirməyə kömək edirik. Təqdim etdiyimiz geniş xidmət spektri vasitəsilə onları dünyanın aparıcı universitetlərinə qəbul üçün dəstəkləyirik.',
    ru: 'Мы помогаем студентам осуществить мечту о качественном образовании за рубежом. Благодаря широкому спектру услуг мы поддерживаем их поступление в ведущие университеты мира.',
    uk: 'Ми допомагаємо студентам здійснити мрію про якісну освіту за кордоном. Завдяки широкому спектру послуг ми підтримуємо їх вступ до провідних університетів світу.',
    ge: 'ვეხმარებით სტუდენტებს უცხოეთში ხარისხიანი განათლების ოცნების ასრულებაში. ჩვენი ფართო სერვისებით ვუჭერთ მხარს მსოფლიოს წამყვან უნივერსიტეტებში მიღებას.',
  },
  valuesTitle: {
    tr: 'Değerlerimiz',
    en: 'Our Values',
    az: 'Dəyərlərimiz',
    ru: 'Наши ценности',
    uk: 'Наші цінності',
    ge: 'ჩვენი ღირებულებები',
  },
  valuesText: {
    tr: 'Her öğrenciye bireysel yaklaşım, süreçlerin şeffaflığı ve sunulan hizmetlerin yüksek kalitesi temel ilkelerimizdir.',
    en: 'Individual approach to every student, transparency of processes, and high quality of services are our core principles.',
    az: 'Hər bir tələbəyə fərdi yanaşma, proseslərin şəffaflığı və göstərilən xidmətlərin yüksək keyfiyyəti bizim əsas prinsiplərimizdir.',
    ru: 'Индивидуальный подход к каждому студенту, прозрачность процессов и высокое качество услуг — наши основные принципы.',
    uk: 'Індивідуальний підхід до кожного студента, прозорість процесів і висока якість послуг — наші основні принципи.',
    ge: 'ყოველი სტუდენტის ინდივიდუალური მიდგომა, პროცესების გამჭვირვალობა და მომსახურების მაღალი ხარისხი — ჩვენი ძირითადი პრინციპებია.',
  },
  teamTitle: { tr: '', en: '', az: '', ru: '', uk: '', ge: '' },
  teamText: {
    tr: 'Uluslararası eğitim alanında deneyimli uzmanlardan oluşan ekibimiz, bilgilerini paylaşmaya ve size en uygun eğitim yolunu seçmede destek olmaya hazırdır.',
    en: 'Our team of experts in international education is ready to share their knowledge and help you choose the most suitable educational path.',
    az: 'Beynəlxalq təhsil sahəsində təcrübəyə malik mütəxəssislərdən ibarət komandamız, biliklərini paylaşmağa və sizə ən uyğun təhsil yolunu seçməkdə dəstək olmağa hazırdır.',
    ru: 'Наша команда специалистов в сфере международного образования готова поделиться знаниями и помочь вам выбрать наиболее подходящий образовательный путь.',
    uk: 'Наша команда фахівців у сфері міжнародної освіти готова поділитися знаннями та допомогти вам обрати найбільш відповідний освітній шлях.',
    ge: 'საერთაშორისო განათლების სფეროში გამოცდილი სპეციალისტების გუნდი მზადაა გაგიზიაროთ ცოდნა და დაგეხმაროთ ყველაზე შესაფერისი საგანმანათლებლო გზის არჩევაში.',
  },
};

const data = {
  storyImage:
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
  storyTitle: {
    tr: 'Hikayemiz',
    en: 'Our Story',
    az: 'Hekayəmiz',
    ru: 'Наша история',
    uk: 'Наша історія',
    ge: 'ჩვენი ისტორია',
  },
  storyText: {
    tr: '2020 yılında kurulan OstWind Group, öğrencilere yurtdışında eğitim konusunda rehberlik etmek amacıyla yola çıktı. Bugüne kadar yüzlerce öğrencinin hayallerini gerçekleştirmesine yardımcı olduk.\n\nUzman kadromuzla, kabul sürecinden vizeye, konaklamadan oryantasyona kadar her adımda öğrencilerimizin yanındayız.',
    en: 'Founded in 2020, OstWind Group set out to guide students on studying abroad. To date, we have helped hundreds of students realize their dreams.\n\nWith our expert staff, we are with our students at every step from the acceptance process to the visa, from accommodation to orientation.',
    az: '2020-ci ildə təsis edilmiş OstWind Group, tələbələrə xaricdə təhsil məsələsində bələdçilik etmək məqsədi ilə yola çıxdı. Bu günə qədər yüzlərlə tələbənin arzularını reallaşdırmağına kömək etmişik.\n\nMütəxəssis heyətimizlə qəbul prosesindən vizaya, yaşayış yerindən orientasiyaya qədər hər addımda tələbələrimizin yanındayıq.',
    ru: 'Основанная в 2020 году, OstWind Group поставила перед собой цель направлять студентов в обучении за рубежом. На сегодняшний день мы помогли сотням студентов осуществить их мечты.\n\nС нашей командой экспертов мы сопровождаем студентов на каждом этапе — от поступления до визы, от жилья до ориентации.',
    uk: 'Заснована у 2020 році, OstWind Group поставила перед собою мету направляти студентів у навчанні за кордоном. Сьогодні ми допомогли сотням студентів здійснити їхні мрії.\n\nЗ нашою командою експертів ми супроводжуємо студентів на кожному етапі — від вступу до візи, від житла до орієнтації.',
    ge: '2020 წელს დაარსებული OstWind Group-მა დაიწყო სტუდენტების სწავლის უცხოეთში მიმართულებით. დღემდე ასობით სტუდენტს დავეხმარეთ ოცნებების ასრულებაში.\n\nჩვენი ექსპერტთა გუნდით თან ვართ სტუდენტებს ყოველ ეტაპზე — მიღებიდან ვიზამდე, საცხოვრებლიდან ორიენტაციამდე.',
  },
  ...company,
};

await prisma.aboutContent.upsert({
  where: { id: 1 },
  update: data,
  create: { id: 1, ...data },
});

console.log('AboutContent seed tamam.');
await prisma.$disconnect();
