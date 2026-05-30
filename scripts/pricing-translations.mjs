/** Fiyatlandırma planları — 6 dil */
const L = (tr, en, az, ru, uk, ge) => ({ tr, en, az, ru, uk, ge });

export const PRICING_PLANS = [
  {
    price: '₺4.999',
    isPopular: false,
    name: L(
      'Başlangıç',
      'Starter',
      'Başlanğıc',
      'Стартовый',
      'Стартовий',
      'საწყისი'
    ),
    features: L(
      'Üniversite listesi danışmanlığı\nBaşvuru formu kontrolü\nE-posta desteği',
      'University list consultation\nApplication form review\nEmail support',
      'Universitet siyahısı məsləhəti\nMüraciət forması yoxlanışı\nE-poçt dəstəyi',
      'Консультация по списку университетов\nПроверка заявки\nПоддержка по e-mail',
      'Консультація щодо списку університетів\nПеревірка заявки\nПідтримка e-mail',
      'უნივერსიტეტების სიის კონსულტაცია\nგანაცხადის შემოწმება\nელფოსტის მხარდაჭერა'
    ),
  },
  {
    price: '₺9.999',
    isPopular: true,
    name: L(
      'Profesyonel',
      'Professional',
      'Peşəkar',
      'Профессиональный',
      'Професійний',
      'პროფესიონალური'
    ),
    features: L(
      'Tüm Başlangıç özellikleri\nVize evrak hazırlığı\nÖncelikli danışman desteği',
      'All Starter features\nVisa document preparation\nPriority advisor support',
      'Bütün Başlanğıc xüsusiyyətləri\nViza sənədlərinin hazırlanması\nPrioritet məsləhətçi dəstəyi',
      'Все возможности Стартового\nПодготовка визовых документов\nПриоритетная поддержка консультанта',
      'Усі можливості Стартового\nПідготовка візових документів\nПріоритетна підтримка консультанта',
      'საწყისი პაკეტის ყველა ფუნქცია\nვიზის დოკუმენტების მომზადება\nპრიორიტეტული მრჩევლის მხარდაჭერა'
    ),
  },
  {
    price: '₺19.999',
    isPopular: false,
    name: L('Premium', 'Premium', 'Premium', 'Премиум', 'Преміум', 'პრემიუმ'),
    features: L(
      'Tüm Profesyonel özellikleri\nKonaklama ve ulaşım rehberliği\nHavalimanı karşılama koordinasyonu',
      'All Professional features\nAccommodation and transport guidance\nAirport pickup coordination',
      'Bütün Peşəkar xüsusiyyətləri\nYaşayış və nəqliyyat rəhbərliyi\nHava limanı qarşılama koordinasiyası',
      'Все возможности Профессионального\nПомощь с жильём и транспортом\nКоординация встречи в аэропорту',
      'Усі можливості Професійного\nДопомога з житлом і транспортом\nКоординація зустрічі в аеропорту',
      'პროფესიონალური პაკეტის ყველა ფუნქცია\nსაცხოვრებლისა და ტრანსპორტის რჩევა\nაეროპორტში შეხვედრის კოორდინაცია'
    ),
  },
];
