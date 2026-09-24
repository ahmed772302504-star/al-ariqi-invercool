import { SiteSettings, FAQItem } from '../types.js';

export const staticGovernates: string[] = [
  'صنعاء',
  'عدن',
  'تعز',
  'حضرموت',
  'الحديدة',
  'إب',
  'مأرب',
  'ذمار',
  'لحج',
  'أبين',
  'شبوة',
  'المهرة',
  'حجة',
  'صعدة',
  'عمران',
  'البيضاء',
  'المحويت',
  'ريمة',
  'سقطرى',
  'الجوف',
  'الضالع'
];

export const staticFAQ: FAQItem[] = [
  {
    id: 'faq-1',
    questionAr: 'ما هي خدمات التكييف والتبريد التي تقدمها العريقي إنفركول؟',
    questionEn: 'What HVAC & Refrigeration services does AL-ARRIQI INVERCOOL provide?',
    answerAr:
      'نقدم حلولاً هندسية متكاملة تشمل تصميم وتوريد وتركيب وصيانة أنظمة التكييف المركزي، وحدات VRF/VRV، غرف ومستودعات التبريد والتجميد، تصميم وتجميع طبالين ولوحات التحكم الكهربائية، صيانة الشيلرات، وتوفير قطع الغيار الأصلية.',
    answerEn:
      'We provide complete engineering solutions including central HVAC, VRF/VRV units, cold storage rooms, electrical control panel assembly, chiller maintenance, and genuine spare parts.',
    category: 'عام',
    order: 1
  },
  {
    id: 'faq-2',
    questionAr: 'هل تغطي خدماتكم جميع محافظات الجمهورية اليمنية؟',
    questionEn: 'Do your services cover all governorates across Yemen?',
    answerAr:
      'نعم، تمتلك العريقي إنفركول فرقاً هندسية متخصصة ومجهزة للانتقال وتقديم خدمات التركيب، التشغيل، والصيانة الطارئة في صنعاء، عدن، تعز، الحديدة، إب، حضرموت، مأرب، ذمار وكافة المحافظات.',
    answerEn:
      'Yes, we deploy specialized engineering crews for installation, commissioning, and emergency maintenance across Sanaa, Aden, Taiz, Hodeidah, Ibb, Hadramout, Marib, Dhamar, and all regions.',
    category: 'التغطية',
    order: 2
  },
  {
    id: 'faq-3',
    questionAr: 'ما هي مميزات طبالين ولوحات التحكم الكهربائية التي تصممونها؟',
    questionEn: 'What features do your electrical control panels provide?',
    answerAr:
      'طبالين ولوحات التحكم لدينا مصممة وفق أعلى معايير الأمان الصناعية، وتتضمن حماية كاملة للضواغط من سقوط الفازات وتذبذب التيار، أنظمة إنذار مبكر صوتي وضوئي، مكونات صناعية أصلية من شنايدر وإل جي، وتصميم منظم يسهل الصيانة الدورية.',
    answerEn:
      'Our panels feature full compressor protection against voltage spikes/phase loss, early warning alarms, genuine industrial components (Schneider/LG/ABB), and organized schematics for effortless maintenance.',
    category: 'لوحات التحكم',
    order: 3
  },
  {
    id: 'faq-4',
    questionAr: 'هل توفرون ضماناً معتمداً على الأجهزة والصيانة؟',
    questionEn: 'Do you offer certified warranty on units and maintenance?',
    answerAr:
      'نعم، نمنح ضمانات رسمية معتمدة على كافة أعمال التركيب والصيانة وتجميع اللوحات الكهربائية، بالإضافة إلى ضمان الوكيل على الأجهزة والضواغط وقطع الغيار الأصلية.',
    answerEn:
      'Yes, official certified warranties are provided on all installations, maintenance, control panels, and brand warranty on genuine compressors and units.',
    category: 'الضمان',
    order: 4
  },
  {
    id: 'faq-5',
    questionAr: 'كيف يمكنني طلب زيارة فني أو طلب عرض سعر لمشروعي؟',
    questionEn: 'How can I request a technician visit or get a project quote?',
    answerAr:
      'يمكنك إرسال طلبك مباشرة عبر الموقع من صفحة «طلب عرض سعر» أو «طلب فني»، أو عبر الاتصال الهاتفي المباشر بالمهندس على الرقم 770931413، أو محادثتنا عبر الواتساب على مدار الساعة.',
    answerEn:
      'You can submit a request directly via our quote or technician forms, call 770931413 directly, or text our 24/7 WhatsApp support.',
    category: 'الطلبات',
    order: 5
  }
];

export const staticSettings: SiteSettings = {
  companyNameAr: 'العريقي إنفركول للتكييف والتبريد',
  companyNameEn: 'AL-ARRIQI INVERCOOL HVAC & REFRIGERATION',
  brandNameAr: 'العريقي إنفركول',
  brandNameEn: 'AL-ARRIQI INVERCOOL',
  taglineAr: 'حلول متكاملة للتكييف والتبريد',
  taglineEn: 'Integrated Air Conditioning & Refrigeration Solutions',
  phone: '770931413',
  companyPhone: '770931413',
  phonePrimary: '770931413',
  phoneSecondary: '772302504',
  whatsapp: '770931413',
  whatsappPrimary: '770931413',
  facebookUrl: 'https://facebook.com',
  email: 'info@invercool-ye.com',
  addressAr: 'الجمهورية اليمنية - صنعاء - شارع الستين',
  addressEn: 'Sanaa, Yemen - Sixtieth St.',
  workHoursAr: 'السبت - الخميس: 8:00 صباحاً - 9:00 مساءً | طوارئ الصيانة: 24 ساعة',
  workHoursEn: 'Sat - Thu: 8:00 AM - 9:00 PM | Emergency HVAC: 24/7',
  developerName: 'م/ أحمد وليد العريقي',
  developerPhone1: '772302504',
  developerPhone2: '738603124',
  heroTitleAr: 'حلول التكييف والتبريد الذكية والموفرة للطاقة باليمن',
  heroTitleEn: 'Smart, Energy-Efficient HVAC & Cooling Solutions in Yemen',
  heroSubtitleAr: 'ريادة هندسية في أنظمة التكييف المركزي، غرف التبريد، والأنظمة الاقتصادية',
  heroSubtitleEn: 'Engineering Leadership in Central Air Conditioning & Cold Storage',
  heroDescAr:
    'نقدم أحدث حلول التبريد والتكييف المبتكرة للقطاعات التجارية، الصناعية، والطبية والسكنية، بأعلى معايير الكفاءة وضمان معتمد.',
  heroDescEn:
    'Delivering cutting-edge cooling and HVAC solutions for commercial, industrial, medical, and residential sectors with proven reliability.',
  aboutDescAr:
    'العريقي إنفركول هي الشركة اليمنية الرائدة في تقديم الحلول الهندسية المتكاملة في أنظمة التكييف والتبريد وتصميم وتجميع طبالين ولوحات التحكم الذكية.',
  aboutDescEn:
    'AL-ARRIQI INVERCOOL is Yemen leading engineering firm in integrated HVAC, commercial refrigeration, and smart electrical control panel assembly.',
  whyUs: [
    {
      titleAr: 'دقة هندسية وتشخيص علمي للأعطال',
      titleEn: 'Engineering Precision & Scientific Diagnostics',
      descAr: 'استخدام أجهزة قياس الضغط الرقمية وكواشف التسريب الحديثة لضمان دقة الإصلاح.',
      descEn: 'Using digital manifolds and advanced leak detectors for pinpoint repair.'
    },
    {
      titleAr: 'حلول موفرة للطاقة متوافقة مع الطاقة الشمسية',
      titleEn: 'Solar-Ready Energy Saving Systems',
      descAr: 'تكنولوجيا إنفرتر متطورة تقلل استهلاك الطاقة وتناسب تشغيل المولدات والطاقة البديلة.',
      descEn: 'Inverter technology tailored for solar setups and generator stability in Yemen.'
    },
    {
      titleAr: 'سرعة الاستجابة والجاهزية للطوارئ 24/7',
      titleEn: '24/7 Rapid Emergency Response',
      descAr: 'فرق ميدانية جاهزة لإنقاذ مخزون غرف التبريد والمستشفيات في أسرع وقت.',
      descEn: 'Dedicated field crews ready to service critical cold rooms and facilities.'
    },
    {
      titleAr: 'قطع غيار أصلية وضمان معتمد',
      titleEn: 'Genuine OEM Parts & Certified Warranty',
      descAr: 'ضواغط ومكونات أصلية من كبرى الشركات العالمية مع ضمان رسمي على القطع والتركيب.',
      descEn: 'Original compressors and parts from top global brands with certified warranty.'
    }
  ],
  governatesCovered: staticGovernates,
  logoUrl: '/logo.png',
  logoIconUrl: '/logo-icon.png',
  watermarkUrl: '/logo.png',
  aboutImageUrl: '/images/about-engineering.jpg',
  updatedAt: Date.now(),
  logoUpdatedAt: Date.now()
};
