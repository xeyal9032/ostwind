/** SSS — 6 dil (tr, en, az, ru, uk, ge) */
const L = (tr, en, az, ru, uk, ge) => ({ tr, en, az, ru, uk, ge });

export const FAQ_TRANSLATIONS = [
  {
    category: 'Genel',
    question: L(
      'OstWind Group hangi ülkelerde hizmet veriyor?',
      'Which countries does OstWind Group serve?',
      'OstWind Group hansı ölkələrdə xidmət göstərir?',
      'В каких странах работает OstWind Group?',
      'У яких країнах працює OstWind Group?',
      'რომელ ქვეყნებში მუშაობს OstWind Group?'
    ),
    answer: L(
      'Türkiye, Azerbaycan, Ukrayna, Gürcistan ve birçok Avrupa ülkesinde anlaşmalı üniversitelerimiz bulunmaktadır.',
      'We have partner universities in Turkey, Azerbaijan, Ukraine, Georgia, and many European countries.',
      'Türkiyə, Azərbaycan, Ukrayna, Gürcüstan və bir çox Avropa ölkəsində tərəfdaş universitetlərimiz var.',
      'У нас есть партнёрские университеты в Турции, Азербайджане, Украине, Грузии и во многих странах Европы.',
      'У нас є партнерські університети в Туреччині, Азербайджані, Україні, Грузії та багатьох країнах Європи.',
      'ჩვენს პარტნიორ უნივერსიტეტებს თურქეთში, აზერბაიჯანში, უკრაინაში, საქართველოში და მრავალ ევროპულ ქვეყანაში გვაქვს.'
    ),
  },
  {
    category: 'Başvuru',
    question: L(
      'Başvuru süreci ne kadar sürer?',
      'How long does the application process take?',
      'Müraciət prosesi nə qədər çəkir?',
      'Сколько длится процесс подачи заявки?',
      'Скільки триває процес подання заявки?',
      'მიმღები პროცესი რამდენ ხანს გრძელდება?'
    ),
    answer: L(
      'Evrakların eksiksiz olması halinde ortalama 2-4 hafta içinde sonuç alınabilir.',
      'With complete documents, results are typically available within 2-4 weeks.',
      'Sənədlər tam olduqda adətən 2-4 həftə ərzində nəticə alına bilər.',
      'При полном комплекте документов результат обычно можно получить в течение 2–4 недель.',
      'За повного комплекту документів результат зазвичай можна отримати протягом 2–4 тижнів.',
      'სრული დოკუმენტაციის შემთხვევაში შედეგი ჩვეულებრივ 2–4 კვირაში მიიღება.'
    ),
  },
  {
    category: 'Vize',
    question: L(
      'Vize başvurusunda destek veriyor musunuz?',
      'Do you support visa applications?',
      'Viza müraciətində dəstək verirsiniz?',
      'Вы помогаете с оформлением визы?',
      'Чи допомагаєте ви з оформленням візи?',
      'ვიზის მიღებაში გეხმარებით?'
    ),
    answer: L(
      'Evet, evrak hazırlığından randevuya kadar vize sürecinde danışmanlık sunuyoruz.',
      'Yes, we provide consultancy from document preparation to appointment scheduling.',
      'Bəli, sənəd hazırlığından randevuya qədər viza prosesində məsləhət veririk.',
      'Да, мы консультируем на всех этапах: от подготовки документов до записи на приём.',
      'Так, ми консультуємо на всіх етапах: від підготовки документів до запису на прийом.',
      'დიახ, ვაწვდით კონსულტაციას დოკუმენტების მომზადებიდან ჩაწერამდე.'
    ),
  },
  {
    category: 'Ücret',
    question: L(
      'Danışmanlık ücretleri neleri kapsar?',
      'What do consultancy fees include?',
      'Məsləhət xərcləri nəyi əhatə edir?',
      'Что входит в стоимость консультации?',
      'Що входить у вартість консультації?',
      'რას მოიცავს კონსულტაციის საფასური?'
    ),
    answer: L(
      'Seçtiğiniz pakete göre başvuru, evrak ve vize desteği kapsamı değişir. Fiyatlandırma sayfamızdan detayları inceleyebilirsiniz.',
      'Coverage depends on your chosen package. See our pricing page for details.',
      'Seçdiyiniz paketə görə müraciət, sənəd və viza dəstəyi dəyişir. Qiymətləndirmə səhifəmizə baxın.',
      'Объём поддержки по заявке, документам и визе зависит от выбранного пакета. Подробности — на странице цен.',
      'Обсяг підтримки залежить від обраного пакета. Деталі — на сторінці цін.',
      'მხარდაჭერის მოცულობა არჩეულ პაკეტზეა დამოკიდებული. დეტალები — ფასების გვერდზე.'
    ),
  },
  {
    category: null,
    question: L(
      'Ücretsiz ön görüşme yapılıyor mu?',
      'Is a free initial consultation available?',
      'Pulsuz ilkin görüş keçirilir?',
      'Предоставляется ли бесплатная первичная консультация?',
      'Чи надається безкоштовна первинна консультація?',
      'გაქვთ თუ არა უფასო საწყისი კონსულტაცია?'
    ),
    answer: L(
      'Evet, başvuru formunu doldurarak ücretsiz ön değerlendirme talep edebilirsiniz.',
      'Yes, fill out the application form to request a free initial assessment.',
      'Bəli, müraciət formasını dolduraraq pulsuz ilkin qiymətləndirmə tələb edə bilərsiniz.',
      'Да, заполните форму заявки, чтобы получить бесплатную первичную оценку.',
      'Так, заповніть форму заявки, щоб отримати безкоштовну первинну оцінку.',
      'დიახ, შეავსეთ განაცხადის ფორმა უფასო საწყისი შეფასებისთვის.'
    ),
  },
  {
    category: 'Konsultasiya',
    question: L(
      'Konsültasyona nasıl başvurabilirim?',
      'How can I book a consultation?',
      'Konsultasiyaya necə yazılmaq olar?',
      'Как записаться на консультацию?',
      'Як записатися на консультацію?',
      'როგორ ჩავწერო კონსულტაციაზე?'
    ),
    answer: L(
      'Sitedeki formu doldurun, bizi arayın veya WhatsApp/Telegram üzerinden yazın. Danışmanlarımız kısa sürede sizinle iletişime geçecektir.',
      'Fill out the form on our website, call us, or message us via WhatsApp/Telegram. Our advisors will contact you shortly.',
      'Saytdakı formanı doldurun, bizə zəng edin və ya WhatsApp/Telegram vasitəsilə yazın. Müşavirlərimiz qısa müddət ərzində sizinlə əlaqə saxlayacaqlar.',
      'Заполните форму на сайте, позвоните нам или напишите в WhatsApp/Telegram. Наши консультанты свяжутся с вами в ближайшее время.',
      'Заповніть форму на сайті, зателефонуйте або напишіть у WhatsApp/Telegram. Наші консультанти зв’яжуться з вами найближчим часом.',
      'შეავსეთ ფორმა საიტზე, დაგვირეკეთ ან მოგვწერეთ WhatsApp/Telegram-ზე. ჩვენი მრჩევლები მალე დაგიკავშირდებიან.'
    ),
  },
  {
    category: 'Ücret',
    question: L(
      'Hizmetlerinizin fiyatı ne kadar?',
      'How much do your services cost?',
      'Xidmətlərinizin qiyməti nə qədərdir?',
      'Сколько стоят ваши услуги?',
      'Скільки коштують ваші послуги?',
      'რა ღირს თქვენი სერვისები?'
    ),
    answer: L(
      'Hizmet ücretleri seçilen pakete bağlıdır. Temel danışmanlık ücretsiz sunulur. Detaylı bilgiyi bireysel başvuru sırasında alabilirsiniz.',
      'Service fees depend on the package you choose. Basic consultation is provided free of charge. You can get detailed information during a personal inquiry.',
      'Xidmətlərin qiyməti seçilmiş paketdən asılıdır. Əsas konsultasiya pulsuz təqdim olunur. Ətraflı məlumatı şəxsi müraciət zamanı əldə edə bilərsiniz.',
      'Стоимость зависит от выбранного пакета. Базовая консультация бесплатна. Подробности — при личном обращении.',
      'Вартість залежить від обраного пакета. Базова консультація безкоштовна. Деталі — під час особистого звернення.',
      'ღირებულება არჩეულ პაკეტზეა დამოკიდებული. საწყისი კონსულტაცია უფასოა. დეტალები — პირადი მიმართვისას.'
    ),
  },
  {
    category: 'Ofis',
    question: L(
      'Ofisiniz nerede?',
      'Where is your office located?',
      'Ofisiniz harada yerləşir?',
      'Где находится ваш офис?',
      'Де знаходиться ваш офіс?',
      'სად მდებარეობს თქვენი ოფისი?'
    ),
    answer: L(
      'Ana ofisimiz Bakü şehri, Əhməd Cəmil caddesi 92 adresinde, Elmlər metrosunun yakınında bulunmaktadır. Tam adres ve yol tarifini "İletişim" bölümünde bulabilirsiniz.',
      'Our main office is at 92 Ahmad Jamil Street, Baku, near Elmlar metro station. You can find the exact address and directions in the Contact section.',
      'Baş ofisimiz Bakı şəhəri, Əhməd Cəmil küçəsi 92 ünvanında, Elmlər metrosunun yaxınlığında yerləşir. Dəqiq ünvan və yol sxemini "Əlaqə" bölməsində tapa bilərsiniz.',
      'Главный офис: г. Баку, ул. Ахмед Джамил, 92, рядом со станцией метро «Эльмлар». Точный адрес и схему проезда смотрите в разделе «Контакты».',
      'Головний офіс: м. Баку, вул. Ахмед Джаміл, 92, біля станції метро «Ельмлар». Точну адресу дивіться в розділі «Контакти».',
      'მთავარი ოფისი: ბაქო, აჰმედ ჯამილის ქ. 92, «ელმლარ» მეტროსთან. ზუსტ მისამართს გვერდზე «კონტაქტი» იპოვით.'
    ),
  },
];
