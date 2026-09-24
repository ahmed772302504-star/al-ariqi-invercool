import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  Service,
  Product,
  Project,
  GalleryItem,
  Review,
  MaintenanceRequest,
  QuoteRequest,
  TechnicianRequest,
  ContactMessage,
  NotificationItem,
  SiteSettings,
  FAQItem,
} from '../src/types.js';

export interface DatabaseSchema {
  services: Service[];
  products: Product[];
  projects: Project[];
  gallery: GalleryItem[];
  reviews: Review[];
  maintenanceRequests: MaintenanceRequest[];
  quoteRequests: QuoteRequest[];
  technicianRequests: TechnicianRequest[];
  contactMessages: ContactMessage[];
  notifications: NotificationItem[];
  faq: FAQItem[];
  settings: SiteSettings;
  adminUsers: Array<{
    id: string;
    username: string;
    passwordHash: string;
    salt: string;
    role: 'super_admin' | 'admin' | 'technician';
    createdAt: string;
  }>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Yemen governorates
export const YEMEN_GOVERNATES = [
  'صنعاء',
  'عدن',
  'تعز',
  'إب',
  'حضرموت',
  'الحديدة',
  'ذمار',
  'مأرب',
  'شبوة',
  'المهرة',
  'صعدة',
  'حجة',
  'لحج',
  'أبين',
  'الضالع',
  'البيضاء',
  'عمران',
  'الجوف',
  'المحويت',
  'ريمة',
  'سقطرى'
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    slug: 'ac-repair-maintenance',
    titleAr: 'صيانة وإصلاح أجهزة التكييف',
    titleEn: 'Air Conditioning Repair & Maintenance',
    shortDescAr: 'خدمات شاملة لصيانة وإصلاح جميع أنواع وحدات التكييف الإسبليت والشباك والدولابي.',
    shortDescEn: 'Comprehensive maintenance and repair for all split, window, and package AC units.',
    descAr: 'فريق هندسي متخصص في تشخيص وإصلاح كافة أعطال وحدات التكييف المنزلية والتجارية، مع فحص دورات الفريون، الكمبروسر، والدوائر الكهربائية بدقة متناهية.',
    descEn: 'Specialized engineering team for diagnosing and repairing all residential and commercial AC malfunctions, refrigerant cycles, compressors, and electrical circuits.',
    iconName: 'Wrench',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['فحص ضغط الغاز وتعبئة الفريون الأصلي', 'تنظيف الفلاتر والمبخرات بتقنية الضغط العالي', 'صيانة الكروت الإلكترونية والحساسات', 'ضمان معتمد على أعمال الصيانة'],
    featuresEn: ['Refrigerant pressure test & certified gas charging', 'High-pressure filter & evaporator cleaning', 'Electronic control board & sensor repairs', 'Warranty on maintenance work'],
    isFeatured: true,
    isActive: true,
    order: 1
  },
  {
    id: 'srv-2',
    slug: 'refrigeration-repair',
    titleAr: 'صيانة وإصلاح أنظمة التبريد',
    titleEn: 'Refrigeration Systems Repair & Maintenance',
    shortDescAr: 'صيانة وإصلاح أنظمة التبريد بمختلف أحجامها وسعاتها التشغيلية.',
    shortDescEn: 'Maintenance and repair for commercial and industrial refrigeration systems.',
    descAr: 'خدمات هندسية متكاملة لصيانة دورات التبريد والمكثفات والمبخرات وضواغط التبريد لمختلف المنشآت.',
    descEn: 'Integrated engineering services for refrigeration loops, condensers, evaporators, and refrigeration compressors.',
    iconName: 'Snowflake',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['تشخيص دقيق لكفاءة التبريد', 'إصلاح تسريبات خطوط الغاز', 'معايرة أنظمة التحكم بالحرارة', 'قطع غيار أصلية'],
    featuresEn: ['Precision cooling efficiency diagnostics', 'Gas leak detection and repair', 'Thermostat & temperature calibration', 'Genuine spare parts'],
    isFeatured: true,
    isActive: true,
    order: 2
  },
  {
    id: 'srv-3',
    slug: 'central-ac-systems',
    titleAr: 'أنظمة التكييف والتبريد المركزي',
    titleEn: 'Central HVAC & Refrigeration Systems',
    shortDescAr: 'توريد، تركيب، صيانة وتشغيل الأنظمة المركزية، ثلاجات التجميد، الـ VRF والدكت.',
    shortDescEn: 'Supply, installation, maintenance, and commissioning of Central HVAC, Freezers & VRF systems.',
    descAr: 'تنفيذ أنظمة التكييف والتبريد المركزي المتطورة للمباني الكبيرة والأبراج والمؤسسات بأعلى المعايير الهندسية مع تصميم مجاري الهواء (Ducting) وتوزيع الأحمال الحرارية وغرف التبريد بدقة.',
    descEn: 'Execution of advanced central AC and refrigeration systems for large buildings, cold warehouses, and corporations following highest engineering standards.',
    iconName: 'Building',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['حساب الأحمال الحرارية الهندسية (Cooling Load)', 'تصميم وتنفيذ دكت التكييف المعزول', 'برمجة أنظمة الـ VRF والتحكم الذكي', 'عقود تشغيل ومتابعة دورية'],
    featuresEn: ['Thermal cooling load calculation', 'Insulated duct fabrication & installation', 'VRF & smart control programming', 'Operational & periodic servicing contracts'],
    subServices: [
      {
        id: 'sub-water-freezing',
        titleAr: 'تركيب ثلاجات مركزية لتجميد وتبريد قوارير وكراتين الماء',
        titleEn: 'Central Refrigeration for Water Bottles & Cartons Freezing & Cooling',
        descAr: 'تصميم وتنفيذ ثلاجات ومستودعات تبريد وتجميد مركزية متخصصة لمصانع ومستودعات مياه الشرب الصحية لحفظ وتجميد كراتين وقوارير الماء بأعلى سرعة وكفاءة تبريد.',
        descEn: 'Engineering and installation of commercial cold rooms and blast freezers for water bottling facilities and carton cooling.',
        iconName: 'Droplets',
        badgeAr: 'تبريد وتجميد مياه',
        badgeEn: 'Water Freezing',
        featuresAr: [
          'تبريد فائق لكراتين وقوارير مياه الشرب',
          'عوازل ساندوتش بانل محكمة وموفرة للطاقة',
          'تحكم رقمي دقيق بدرجات الحرارة'
        ],
        featuresEn: [
          'High-speed cooling for bottled water cartons',
          'Heavy-duty insulated sandwich panels',
          'Precision digital temperature telemetry'
        ]
      },
      {
        id: 'sub-poultry-food',
        titleAr: 'تركيب ثلاجات مركزية لتجميد وحفظ الدجاج والمواد الغذائية',
        titleEn: 'Central Cold Storage & Blast Freezers for Poultry & Food Supplies',
        descAr: 'تنفيذ غرف التجميد العميق (Blast Freezers) وثلاجات حفظ لحوم الدواجن، الأسماك، والمواد الغذائية بدرجات حرارة تصل إلى -25°C مطابقة لأعلى المعايير الصحية.',
        descEn: 'Turnkey blast freezers and cold storage facilities for poultry, meats, fish, and perishable foods down to -25°C.',
        iconName: 'Utensils',
        badgeAr: 'لحوم ومواد غذائية',
        badgeEn: 'Poultry & Food Storage',
        featuresAr: [
          'تجميد عميق فائق حتى -25 درجة مئوية',
          'ضواغط ومبخرات صناعية عالية التحمل',
          'مطابقة تامة لاشتراطات صحة وسلامة الأغذية'
        ],
        featuresEn: [
          'Deep blast freezing down to -25°C',
          'Industrial heavy-duty compressors & coils',
          'Fully certified food-grade hygiene standards'
        ]
      }
    ],
    isFeatured: true,
    isActive: true,
    order: 3
  },
  {
    id: 'srv-water-refrigeration',
    slug: 'water-bottles-cartons-central-freezing',
    titleAr: 'تركيب ثلاجات مركزية لتجميد وتبريد قوارير وكراتين المياه',
    titleEn: 'Central Refrigeration for Water Bottles & Cartons Freezing',
    category: 'أنظمة التبريد والتجميد المركزي',
    shortDescAr: 'تصميم وبناء ثلاجات ومستودعات تبريد وتجميد مركزية متطورة لتجميد وحفظ كراتين وقوارير مياه الشرب الصحية بأعلى كفاءة وسرعة تبريد.',
    shortDescEn: 'Design and execution of industrial cold storage and blast freezers for bottled water cartons and processing plants.',
    descAr: 'حلول هندسية متكاملة لقطاع مصانع ومستودعات مياه الشرب ومراكز التوزيع، تشمل حساب الأحمال الحرارية، توريد وحدات التكثيف والمبخرات فائقة التحمل، وتجهيز غرف ساندوتش بانل عازلة لضمان تجميد وتبريد سريع لكراتين المياه بأقل استهلاك كهربائي بفضل تقنية الإنفرتر.',
    descEn: 'Comprehensive turnkey cooling systems for drinking water factories and distribution depots, engineered with heavy-duty condensing units and insulated panels.',
    iconName: 'Droplets',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['تبريد وتجميد سريع لكراتين وقوارير الماء', 'عوازل ساندوتش بانل بضغط وكثافة عالية', 'أنظمة تحكم رقمية ومراقبة درجات الحرارة عن بعد', 'كفاءة استهلاك طاقة عالية بنظام الإنفرتر'],
    featuresEn: ['Rapid cooling for bottled water packaging', 'High-density polyurethane insulated panels', 'Precision digital thermostat & remote monitoring', 'Energy-efficient inverter compressor technology'],
    isFeatured: true,
    isActive: true,
    order: 4
  },
  {
    id: 'srv-poultry-meat-coldrooms',
    slug: 'poultry-meat-cold-storage-freezers',
    titleAr: 'تركيب ثلاجات ومستودعات تجميد اللحوم والدواجن',
    titleEn: 'Poultry, Meat & Food Central Blast Freezers & Cold Storage',
    category: 'أنظمة التبريد والتجميد المركزي',
    shortDescAr: 'تنفيذ غرف ومستودعات التجميد العميق (Blast Freezers) لحفظ وتجميد الدواجن، اللحوم، والأسماك بدرجات حرارة تصل إلى -25°C.',
    shortDescEn: 'Execution of blast freezing facilities and cold warehouses for poultry, meats, and perishables down to -25°C.',
    descAr: 'متخصصون في إنشاء وتشغيل ثلاجات ومسالخ ومستودعات حفظ وتجميد الدواجن واللحوم الكبرى، مع تركيب مبخرات وضواغط تبريد صناعية فائقة التحمل، ونظم إحكام حراري تمنع البكتيريا وتطابق أعلى المعايير الصحية العالمية لسلامة الغذاء.',
    descEn: 'Specialized construction of deep blast freezers and storage hubs for poultry and meat industries meeting strict international food safety standards.',
    iconName: 'Utensils',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['تجميد عميق فائق السرعة حتى -25 مئوية', 'ضواغط ومبخرات صناعية للخدمة الشاقة', 'مطابقة لاشتراطات ومعايير سلامة الأغذية والصحة', 'أبواب تبريد محكمة لمنع الهدر الحراري'],
    featuresEn: ['Deep blast freezing down to -25°C', 'Heavy-duty industrial coils and compressors', 'Food-grade certified hygienic construction', 'Hermetic freezer doors preventing thermal loss'],
    isFeatured: true,
    isActive: true,
    order: 5
  },
  {
    id: 'srv-4',
    slug: 'central-refrigeration',
    titleAr: 'أنظمة التبريد المركزي',
    titleEn: 'Central Refrigeration Systems',
    shortDescAr: 'تنفيذ وصيانة أنظمة التبريد الكبيرة والمركزية للقطاعات الصناعية والغذائية.',
    shortDescEn: 'Implementation and maintenance of large-scale central refrigeration plants.',
    descAr: 'حلول تبريد مركزية للأنشطة الصناعية ومصانع الأغذية ومراكز التوزيع الكبرى مع أحدث وحدات التكثيف والمبادلات الحرارية.',
    descEn: 'Central refrigeration solutions for industrial plants, food processing facilities, and large logistics hubs.',
    iconName: 'Cpu',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['كفاءة طاقة استثنائية بنظام الإنفرتر', 'عزل حراري هندسي عالي الكفاءة', 'أنظمة إنذار ومراقبة درجات الحرارة عن بعد', 'دعم فني للطوارئ على مدار الساعة'],
    featuresEn: ['Inverter-driven energy efficiency', 'Engineered high-spec thermal insulation', 'Remote temperature telemetry & alarms', '24/7 emergency response'],
    isFeatured: true,
    isActive: true,
    order: 4
  },
  {
    id: 'srv-5',
    slug: 'cold-rooms',
    titleAr: 'غرف وثلاجات التبريد الكبيرة',
    titleEn: 'Cold Rooms & Large Refrigerated Storage',
    shortDescAr: 'تصميم وتركيب وصيانة غرف التبريد والتجميد وسندوتش بانل حسب متطلبات المشروع.',
    shortDescEn: 'Design, installation, and maintenance of walk-in cold rooms and blast freezers.',
    descAr: 'تصميم وتنفيذ مستودعات وغرف التبريد والتجميد التجاري والصيدلاني والغذائي باستخدام ألواح ساندوتش بانل عازلة ومعدات تبريد مطابقة للمواصفات الدولية.',
    descEn: 'Design and construction of commercial, pharmaceutical, and food cold storage rooms using certified sandwich panels and heavy-duty refrigeration units.',
    iconName: 'Layers',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['توريد وتركيب ساندوتش بانل كثافة عالية', 'أبواب تبريد محكمة ومقاومة للهدر الحراري', 'أنظمة تحكم رقمية دقيقة بالحرارة والرطوبة', 'صيانة وقائية لضمان سلامة المخزون'],
    featuresEn: ['High-density polyurethane sandwich panels', 'Airtight thermal doors', 'Precision digital thermostat & humidity controllers', 'Preventive care to protect perishable inventory'],
    isFeatured: true,
    isActive: true,
    order: 5
  },
  {
    id: 'srv-6',
    slug: 'installation-commissioning',
    titleAr: 'التركيب والتشغيل',
    titleEn: 'Installation & Commissioning',
    shortDescAr: 'تركيب وتجهيز وتشغيل أجهزة وأنظمة التكييف والتبريد بدقة هندسية.',
    shortDescEn: 'Professional engineering installation and testing of all HVAC equipment.',
    descAr: 'تثبيت وتمديد خطوط النحاس، أنابيب الصرف، التوصيلات الكهربائية، واختبار التسريب وتفريغ الهواء (Vacuum) وفق المعايير المصنعية العالمية.',
    descEn: 'Copper pipe routing, drainage installation, electrical cabling, vacuuming, and factory-standard pressure testing.',
    iconName: 'CheckCircle2',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['استخدام أنابيب نحاس أصلية ذات سماكة معتمدة', 'تفريغ الهواء وسحب الرطوبة بجهاز الفاكيوم', 'معايرة ضغوط التشغيل بدقة', 'فحص شامل قبل التسليم'],
    featuresEn: ['Certified wall-thickness copper piping', 'Deep vacuum moisture removal', 'Accurate operational pressure calibration', 'Thorough pre-commissioning handover inspection'],
    isFeatured: false,
    isActive: true,
    order: 6
  },
  {
    id: 'srv-7',
    slug: 'diagnostics-repair',
    titleAr: 'التشخيص وإصلاح الأعطال',
    titleEn: 'Diagnostics & Troubleshooting',
    shortDescAr: 'تشخيص الأعطال الكهربائية والميكانيكية وأعطال منظومات التكييف والتبريد بأحدث الأجهزة.',
    shortDescEn: 'Accurate electrical and mechanical diagnostics using advanced measurement tools.',
    descAr: 'فحص إلكتروني متقدم لتحديد أسباب توقف المكيفات، ارتفاع درجات الحرارة، الضوضاء، وتهريب الفريون مع توفير الحلول الفورية والآمنة.',
    descEn: 'Advanced electronic troubleshooting to diagnose compressor failure, high head pressure, strange noises, and refrigerant leaks.',
    iconName: 'Activity',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['أجهزة قياس إلكترونية وكواشف تسريب متطورة', 'فحص استهلاك التيار الكهربائي (Ampere)', 'كشف الأعطال المخفية بدقة', 'تقرير فني واضح للعميل'],
    featuresEn: ['Digital leak detectors and multimeters', 'Current draw & power consumption analysis', 'In-depth diagnostic trace', 'Clear, transparent technician report'],
    isFeatured: false,
    isActive: true,
    order: 7
  },
  {
    id: 'srv-8',
    slug: 'preventive-maintenance',
    titleAr: 'الصيانة الوقائية والدورية',
    titleEn: 'Preventive & Periodic Maintenance',
    shortDescAr: 'برامج صيانة دورية ووقائية مصممة لرفع كفاءة الأجهزة وإطالة عمرها التشغيلي.',
    shortDescEn: 'Tailored maintenance contracts to maximize efficiency and extend equipment lifespan.',
    descAr: 'جداول زيارات دورية تشمل الغسيل الكيميائي، فحص الضواغط، تشحيم المحركات، وفحص العوازل لتقليل استهلاك الكهرباء ومنع الأعطال المفاجئة.',
    descEn: 'Scheduled inspection visits including chemical coil cleaning, compressor checks, motor lubrication, and insulation inspection to curb power bills and downtime.',
    iconName: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['تقليل استهلاك الطاقة بنسبة تصل إلى 25%', 'منع التوقف المفاجئ في أوقات الذروة', 'عقود مرنة شهرية وربع سنوية', 'تقارير متابعة دورية'],
    featuresEn: ['Up to 25% energy consumption reduction', 'Prevention of sudden breakdowns during peak heat', 'Flexible monthly & quarterly contracts', 'Detailed log reports'],
    isFeatured: true,
    isActive: true,
    order: 8
  },
  {
    id: 'srv-9',
    slug: 'hotel-projects',
    titleAr: 'مشاريع الفنادق والضيافة',
    titleEn: 'Hotel & Hospitality Projects',
    shortDescAr: 'أنظمة HVAC والتكييف والتبريد المركزية الهادئة والمريحة للمنشآت الفندقية.',
    shortDescEn: 'Whisper-quiet, high-comfort central HVAC systems for luxury hotels.',
    descAr: 'توفير أعلى درجات الراحة والهدوء للنزلاء مع أنظمة تكييف متغيرة التدفق وموفرة للطاقة وغرف تبريد مركزية لمطابخ الفنادق.',
    descEn: 'Ensuring whisper-quiet guest comfort with VRF solutions and robust kitchen cold storage.',
    iconName: 'Hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['هدوء فائق ومستويات ضوضاء منخفضة (Ultra-quiet)', 'تحكم ذكي مستقل لكل غرفة وجناح', 'أنظمة تهوية واسترجاع حراري (ERV)', 'غرف تبريد وتجميد لمطاعم ومطابخ الفنادق'],
    featuresEn: ['Ultra-low acoustic footprint', 'Independent room & suite thermostat control', 'Energy Recovery Ventilation (ERV)', 'Commercial restaurant refrigeration units'],
    isFeatured: false,
    isActive: true,
    order: 9
  },
  {
    id: 'srv-10',
    slug: 'hospital-projects',
    titleAr: 'مشاريع المستشفيات والمراكز الصحية',
    titleEn: 'Hospital & Healthcare Facilities',
    shortDescAr: 'أنظمة التكييف والتبريد المتخصصة لغرف العمليات والعناية المركزة والمختبرات.',
    shortDescEn: 'Specialized sterile HVAC systems for operating theaters, ICUs, and laboratories.',
    descAr: 'تنفيذ أنظمة التهوية والتكييف الطبي مع فلاتر HEPA والتحكم الدقيق بالضغط الإيجابي والسلبي ونسب الرطوبة لحماية المرضى ومنع العدوى.',
    descEn: 'Specialized healthcare climate control with HEPA filtration, positive/negative pressure cascades, and strict humidity management.',
    iconName: 'Cross',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['فلاتر هيبا (HEPA Filters) بنقاوة هواء 99.97%', 'التحكم بالضغط التفاضلي لغرف العزل والعمليات', 'ثلاجات حفظ الأدوية وبنوك الدم الطبية', 'التوافق مع المعايير الصحية العالمية'],
    featuresEn: ['99.97% HEPA cleanroom filtration', 'Differential pressure cascades for sterile zones', 'Pharmaceutical & blood bank refrigeration', 'Global healthcare HVAC compliance'],
    isFeatured: false,
    isActive: true,
    order: 10
  },
  {
    id: 'srv-11',
    slug: 'corporate-facilities',
    titleAr: 'مشاريع الشركات والمنشآت',
    titleEn: 'Corporate & Institutional Facilities',
    shortDescAr: 'تنفيذ أنظمة التكييف والتبريد للمباني الإدارية، البنوك، ومقار الشركات.',
    shortDescEn: 'Climate systems tailored for corporate headquarters, banks, and office buildings.',
    descAr: 'تصميم حلول تكييف هندسية موفرة للطاقة مع توزيع متجانس للهواء وأنظمة تبريد خاصة بغرف السيرفرات ومراكز البيانات (Data Centers).',
    descEn: 'Energy-saving office HVAC with uniform air distribution and dedicated precision cooling for server rooms.',
    iconName: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['أنظمة تبريد دقيقة لغرف السيرفرات (Precision Cooling)', 'تحكم مركزي ذكي بالمبنى (BMS)', 'توزيع تدفق هواء صحي وبيئة عمل مريحة', 'كفاءة تشغيلية واستهلاك كهرباء اقتصادي'],
    featuresEn: ['Precision cooling for data and server racks', 'BMS intelligent central building automation', 'Comfortable, healthy workplace airflow', 'High energy performance ratio'],
    isFeatured: false,
    isActive: true,
    order: 11
  },
  {
    id: 'srv-12',
    slug: 'commercial-industrial',
    titleAr: 'المشاريع التجارية والصناعية',
    titleEn: 'Commercial & Industrial Projects',
    shortDescAr: 'حلول التكييف والتبريد للمصانع، المستودعات، والمجمعات التجارية الكبرى.',
    shortDescEn: 'HVAC and refrigeration solutions for manufacturing plants, warehouses, and malls.',
    descAr: 'أنظمة تشيلر وتبريد وتكييف ضخمة تلبي المتطلبات الحرارية الصعبة للمصانع والمراكز التجارية مع قدرات تحمل بيئية عالية.',
    descEn: 'Heavy-duty chillers and air handlers engineered for demanding industrial environments and shopping malls.',
    iconName: 'Factory',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['قدرات تبريد هائلة (Heavy tonnage)', 'مقاومة الظروف البيئية القاسية والرطوبة', 'تصميم وتصنيع شبكات الدكت المعزولة', 'صيانة وقائية مبرمجة لعدم توقف الإنتاج'],
    featuresEn: ['High tonnage capacity configurations', 'Harsh environment & ambient tolerance', 'Custom insulated ductwork networks', 'Scheduled servicing to eliminate production halts'],
    isFeatured: false,
    isActive: true,
    order: 12
  },
  {
    id: 'srv-13',
    slug: 'residential-projects',
    titleAr: 'المشاريع السكنية والفلل',
    titleEn: 'Residential & Villa Projects',
    shortDescAr: 'تركيب وصيانة أنظمة التكييف للمنازل، الشقق، والفلل السكنية الراقية.',
    shortDescEn: 'Residential and luxury villa air conditioning design, supply, and maintenance.',
    descAr: 'حلول تكييف أنيقة وذكية تناسب الديكور الداخلي للفلل والمنازل، مع تقنيات الإنفرتر لتوفير استهلاك الكهرباء ومنظومات تحكم عبر الهاتف.',
    descEn: 'Elegant, smart home air conditioning tailored for interior aesthetics with inverter energy savings.',
    iconName: 'Home',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['تصميم متناسق مع الديكور الهندسي الداخلي', 'أجهزة إنفرتر موفرة للطاقة بنسبة 60%', 'تحكم ذكي بالواي فاي من الهاتف', 'صوت فائق الهدوء للنوم المريح'],
    featuresEn: ['Harmonious interior architectural integration', 'Inverter technology with up to 60% power savings', 'Smart Wi-Fi smartphone control', 'Ultra-quiet acoustics for peaceful rest'],
    isFeatured: false,
    isActive: true,
    order: 13
  },
  {
    id: 'srv-14',
    slug: 'economic-ac-import',
    titleAr: 'استيراد أجهزة تكييف اقتصادية',
    titleEn: 'Imported Energy-Efficient AC Units',
    shortDescAr: 'عرض وتوفير أجهزة التكييف المستوردة الاقتصادية بنظام الإنفرتر المتطورة.',
    shortDescEn: 'Import and distribution of cutting-edge, power-efficient inverter ACs.',
    descAr: 'نوفر أجهزة تكييف حديثة موفرة للطاقة ومناسبة للعمل على أنظمة الطاقة الشمسية ومولدات الكهرباء في اليمن مع توفير الضمان والقطع.',
    descEn: 'Modern, high-efficiency inverter air conditioners optimized for solar power and generators in Yemen with local warranty.',
    iconName: 'Zap',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['متوافقة مع أنظمة الطاقة الشمسية (Solar Ready)', 'توفير فائق في استهلاك التيار الكهربائي', 'غاز تبريد صديق للبيئة (R410A / R32)', 'ضمان رسمي ودعم فني متواصل'],
    featuresEn: ['Solar energy compatible', 'Low starting current & high SEER rating', 'Eco-friendly R410A / R32 refrigerants', 'Official warranty and after-sales support'],
    isFeatured: true,
    isActive: true,
    order: 14
  },
  {
    id: 'srv-15',
    slug: 'spare-parts-sales',
    titleAr: 'بيع قطع الغيار الأصلية',
    titleEn: 'Genuine Spare Parts Sales',
    shortDescAr: 'قطع غيار أصلية ومضمونة لجميع منظومات التكييف والتبريد.',
    shortDescEn: 'Certified genuine spare parts and components for AC and refrigeration.',
    descAr: 'توفير الضواغط (Compressors)، المراوح، المكثفات، المحابس، حساسات الحرارة، والكرات الإلكترونية من مصادر موثوقة ومضمونة.',
    descEn: 'Supply of compressors, condenser fans, expansion valves, thermostats, and circuit boards from verified manufacturers.',
    iconName: 'Cog',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['قطع أصلية ومطابقة لمواصفات المصنع', 'فحص الجودة قبل التسليم للعميل', 'توفر قطع لمختلف العلامات التجارية', 'استشارات هندسية لاختيار القطعة الأنسب'],
    featuresEn: ['Certified factory-spec replacement parts', 'Pre-delivery quality testing', 'Compatibility across leading brand lines', 'Engineering guidance on part matching'],
    isFeatured: false,
    isActive: true,
    order: 15
  },
  {
    id: 'srv-16',
    slug: 'hvac-supplies-sales',
    titleAr: 'بيع مستلزمات HVAC والتبريد',
    titleEn: 'HVAC & Refrigeration Materials Supply',
    shortDescAr: 'مستلزمات، أنابيب نحاس، غاز الفريون، ومواد العزل الحراري والأدوات.',
    shortDescEn: 'Essential copper piping, refrigerant gases, insulation, and tooling supplies.',
    descAr: 'توريد أنابيب النحاس عالية الجودة، أسطوانات الفريون الأصلية، عوازل الأرمفلكس، مواد تثبيت الدكت، وأدوات الفنيين المتخصصة.',
    descEn: 'Wholesale and retail supply of copper coils, certified refrigerant cylinders, Armaflex insulation, and specialized HVAC tools.',
    iconName: 'Package',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['أنابيب نحاس بمقاسات وسماكات مختلفة', 'أسطوانات فريون نقية ومضمونة بدون شوائب', 'عوازل حرارية ومواد شريط ألومنيوم مقاومة', 'أدوات ومقاييس فنية متخصصة'],
    featuresEn: ['Multi-gauge refrigeration grade copper coils', 'High-purity virgin refrigerant canisters', 'Industrial thermal insulation foams & tapes', 'Specialist manifold gauges & vacuum pumps'],
    isFeatured: false,
    isActive: true,
    order: 16
  },
  {
    id: 'srv-17',
    slug: 'used-equipment-sales',
    titleAr: 'بيع الأجهزة والمعدات المستعملة',
    titleEn: 'Inspected Used Equipment & Systems',
    shortDescAr: 'قسم خاص بالمعدات والأجهزة المستعملة المفحوصة والمضمونة هندسياً.',
    shortDescEn: 'Engineered, inspected, and certified pre-owned cooling units and equipment.',
    descAr: 'أجهزة تكييف ومعدات تبريد مستعملة خضعت لفحص فني شامل وإعادة تأهيل هندسي لضمان كفاءتها، مع بيان حالتها بشفافية تامة.',
    descEn: 'Refurbished and certified pre-owned AC and cooling equipment rigorously tested by our engineers with honest condition reporting.',
    iconName: 'RefreshCw',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
    featuresAr: ['فحص هندسي شامل للكمبروسر والدارة الكهربائية', 'اختبار الضغط والتبريد الفعلي تحت الحمل', 'توضيح حالة المنتج وسنة الصنع بشفافية', 'أسعار اقتصادية وضمان تجريبي'],
    featuresEn: ['Comprehensive mechanical & compressor inspection', 'Operational load testing in workshop', 'Transparent reporting of condition & specs', 'Cost-effective solutions with trial warranty'],
    isFeatured: true,
    isActive: true,
    order: 17
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  companyNameAr: 'العريقي إنفركول',
  companyNameEn: 'AL-ARRIQI INVERCOOL',
  taglineAr: 'حلول متكاملة للتكييف والتبريد',
  taglineEn: 'Integrated Air Conditioning & Refrigeration Solutions',
  phone: '770931413',
  whatsapp: '770931413',
  facebookUrl: 'https://facebook.com', // Official page link editable via Admin
  email: 'info@al-arriqi-invercool.com',
  addressAr: 'الجمهورية اليمنية - نخدمكم في جميع محافظات الجمهورية',
  addressEn: 'Republic of Yemen - Serving You Across All Governorates',
  workHoursAr: 'السبت - الخميس: 8:00 صباحاً - 8:00 مساءً | طوارئ الصيانة 24/7',
  workHoursEn: 'Saturday - Thursday: 8:00 AM - 8:00 PM | 24/7 Emergency Support',
  developerName: 'م/ أحمد وليد العريقي',
  developerPhone1: '772302504',
  developerPhone2: '738603124',
  heroTitleAr: 'العريقي إنفركول',
  heroTitleEn: 'AL-ARRIQI INVERCOOL',
  heroSubtitleAr: 'حلول متكاملة للتكييف والتبريد',
  heroSubtitleEn: 'Integrated Air Conditioning & Refrigeration Solutions',
  heroDescAr: 'الريادة الهندسية في تصميم وتوريد وتركيب وصيانة أنظمة التكييف والتبريد المركزي وغرف التبريد الكبرى داخل الجمهورية اليمنية بأعلى مقاييس الجودة والاعتمادية.',
  heroDescEn: 'Engineering leadership in designing, supplying, installing, and servicing central HVAC, refrigeration systems, and large cold rooms across Yemen with highest precision and reliability.',
  aboutDescAr: 'تعتبر شركة العريقي إنفركول إحدى الشركات الهندسية المتخصصة والرائدة في مجال التكييف والتبريد وأنظمة HVAC والتبريد المركزي داخل الجمهورية اليمنية. نلتزم بأعلى المعايير الهندسية الدقيقة لتقديم حلول مبتكرة للمنشآت التجارية والصناعية والمستشفيات والفنادق والمشاريع السكنية مع التزام تام بجودة التنفيذ وخدمة ما بعد البيع في كافة المحافظات.',
  aboutDescEn: 'AL-ARRIQI INVERCOOL is a premier engineering firm specializing in air conditioning, refrigeration, HVAC systems, and central cold storage in Yemen. We deliver high-precision climate control for commercial, industrial, healthcare, hospitality, and residential projects with strict adherence to engineering standards.',
  whyUs: [
    {
      icon: 'Settings',
      titleAr: 'حلول هندسية متقدمة',
      titleEn: 'Advanced Engineering Solutions',
      descAr: 'دراسة وتصميم أنظمة التكييف والتبريد بحسابات أحمال دقيقة لضمان أعلى أداء وكفاءة.',
      descEn: 'Design and thermal sizing executed with engineering rigor for optimal performance.'
    },
    {
      icon: 'Clock',
      titleAr: 'سرعة الاستجابة والالتزام',
      titleEn: 'Fast Response & Commitment',
      descAr: 'فريق فني متأهب لتقديم الدعم السريع وخدمات الطوارئ مع الالتزام التام بالمواعيد.',
      descEn: 'Rapid dispatch and dependable adherence to installation and maintenance schedules.'
    },
    {
      icon: 'Target',
      titleAr: 'التشخيص الدقيق للأعطال',
      titleEn: 'Precision Diagnostics',
      descAr: 'أحدث أجهزة الكشف الإلكتروني لتحديد الأعطال الميكانيكية والكهربائية وحلها جذرياً.',
      descEn: 'Digital equipment to trace electrical and mechanical root causes reliably.'
    },
    {
      icon: 'Award',
      titleAr: 'جودة التنفيذ والضمان',
      titleEn: 'Quality Execution & Warranty',
      descAr: 'استخدام أجود المواد وقطع الغيار الأصلية مع ضمان معتمد على جميع الأعمال المنفذة.',
      descEn: 'Top-tier materials and original spare parts backed by dependable guarantees.'
    },
    {
      icon: 'ShieldCheck',
      titleAr: 'برامج الصيانة الوقائية',
      titleEn: 'Preventive Care Programs',
      descAr: 'عقود صيانة دورية تحمي منشأتك من التوقف المفاجئ وتقلل استهلاك الطاقة بشكل ملموس.',
      descEn: 'Periodic inspection contracts preventing downtime and curbing electric costs.'
    },
    {
      icon: 'MapPin',
      titleAr: 'تغطية جميع محافظات اليمن',
      titleEn: 'Coverage Across Yemen',
      descAr: 'خدماتنا تصل إليكم في كافة محافظات الجمهورية اليمنية بخبرة وكفاءة عالية.',
      descEn: 'Full deployment capability across all 22 governorates of Yemen.'
    }
  ],
  governatesCovered: YEMEN_GOVERNATES
};

export const INITIAL_FAQ: FAQItem[] = [
  {
    id: 'faq-1',
    questionAr: 'ما هي الخدمات الرئيسية التي تقدمها شركة العريقي إنفركول؟',
    questionEn: 'What are the main services provided by AL-ARRIQI INVERCOOL?',
    answerAr: 'نقدم حلولاً متكاملة تشمل صيانة وتركيب أجهزة التكييف بمختلف أنواعها، أنظمة التكييف المركزي وVRF، أنظمة التبريد المركزي، تصميم وبناء غرف وثلاجات التبريد الكبيرة، بيع قطع الغيار ومستلزمات HVAC، وتوريد الأجهزة الاقتصادية الموفرة للطاقة.',
    answerEn: 'We provide full-spectrum HVAC and refrigeration solutions: installation, maintenance, central VRF systems, walk-in cold rooms, industrial refrigeration, genuine spare parts, and imported high-efficiency inverter AC units.',
    category: 'عام',
    order: 1
  },
  {
    id: 'faq-2',
    questionAr: 'هل تقدمون خدمات الصيانة في جميع محافظات الجمهورية اليمنية؟',
    questionEn: 'Do you provide services across all governorates in Yemen?',
    answerAr: 'نعم، نوفر خدمات التوريد والتركيب والصيانة والمشاريع الكبيرة لجميع محافظات اليمن (صنعاء، عدن، تعز، حضرموت، إب، الحديدة، مأرب، وبقية المحافظات).',
    answerEn: 'Yes, we execute large projects, supply, and maintenance across all Yemen governorates including Sanaa, Aden, Taiz, Hadramout, Ibb, Hodeidah, Marib, and beyond.',
    category: 'التغطية',
    order: 2
  },
  {
    id: 'faq-3',
    questionAr: 'كيف يمكنني طلب خدمة أو إرسال فني متخصص؟',
    questionEn: 'How can I book a service or request a technician visit?',
    answerAr: 'يمكنك بسهولة استخدام صفحة "اطلب خدمة" أو "اطلب فنيًا" على الموقع مع رفع تفاصيل المشكلة وصور العطل، أو التواصل المباشر عبر الهاتف 770931413 أو WhatsApp بنفس الرقم.',
    answerEn: 'You can easily use the "Request Service" or "Request Technician" forms on our website with photos of the issue, or directly call or WhatsApp us on 770931413.',
    category: 'الطلبات',
    order: 3
  },
  {
    id: 'faq-4',
    questionAr: 'هل تتوفر لديكم أجهزة تكييف اقتصادية موفرة للطاقة متوافقة مع الطاقة الشمسية؟',
    questionEn: 'Do you offer energy-efficient AC units compatible with solar power?',
    answerAr: 'نعم، نوفر أجهزة تكييف حديثة مستوردة تعمل بتقنية الإنفرتر الذكية الموفرة للكهرباء بشكل كبير وتتوافق مع منظومات الطاقة الشمسية والمولدات.',
    answerEn: 'Yes, we supply modern imported inverter air conditioners engineered for exceptional power savings, fully suited for solar setups and generators.',
    category: 'المنتجات',
    order: 4
  },
  {
    id: 'faq-5',
    questionAr: 'هل تصممون وتنفذون غرف وثلاجات التبريد للمصانع والمستشفيات؟',
    questionEn: 'Do you design and install custom cold rooms for factories and hospitals?',
    answerAr: 'نعم، نتخصص في تصميم وتجهيز غرف التبريد والتجميد ذات السعات الكبيرة باستخدام أفضل ألواح الساندوتش بانل وأنظمة التحكم الرقمية المطابقة للمعايير الهندسية والصحية.',
    answerEn: 'Yes, we specialize in high-capacity walk-in cold rooms and blast freezers using certified polyurethane sandwich panels and precision digital controls.',
    category: 'المشاريع',
    order: 5
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-ac-1',
    titleAr: 'صيانة شاملة وتنظيف مبخرات مكيفات إسبليت',
    titleEn: 'Comprehensive Split AC Coil Deep Cleaning',
    category: 'صيانة وإصلاح أجهزة التكييف',
    serviceId: 'srv-1',
    serviceSlug: 'ac-repair-maintenance',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
    descriptionAr: 'تنظيف كيميائي للمبخر والمروحة الداخلية وإزالة الأتربة لرفع كفاءة التبريد وتقليل صوت التشغيل.',
    descriptionEn: 'High-pressure chemical wash of indoor evaporator coil and blower fan.',
    captionAr: 'عملية تنظيف وغسيل متطورة لوحدة إسبليت مع فحص ضغوط الفريون لضمان برودة مثالية.',
    captionEn: 'Advanced cleaning of split unit with refrigerant pressure checks.',
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'gal-ac-2',
    titleAr: 'فحص ضغط الغاز وتعبئة فريون أصلي R410A',
    titleEn: 'Refrigerant Pressure Diagnostics & R410A Refill',
    category: 'صيانة وإصلاح أجهزة التكييف',
    serviceId: 'srv-1',
    serviceSlug: 'ac-repair-maintenance',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    descriptionAr: 'استخدام أجهزة قياس الضغط الرقمية الدقيقة واكتشاف وتصليح تسريب خط السحب.',
    descriptionEn: 'Precision digital manifold gauges used to locate and braze suction line leak.',
    captionAr: 'فحص دورة التبريد بجهاز قياس رقمي وشحن غاز الفريون الأصلي بالوزن الدقيق.',
    captionEn: 'Refrigeration circuit inspection and precision weight charging.',
    order: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: 'gal-ac-3',
    titleAr: 'إصلاح لوحة التحكم الإلكترونية وفحص الحساسات',
    titleEn: 'Inverter PCB Diagnostic & Sensor Calibration',
    category: 'صيانة وإصلاح أجهزة التكييف',
    serviceId: 'srv-1',
    serviceSlug: 'ac-repair-maintenance',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
    descriptionAr: 'معالجة أكواد الأعطال في كروت المكيفات الإنفرتر واستبدال المكثفات التالفة.',
    descriptionEn: 'Repairing error codes in inverter AC boards and replacing fatigued capacitors.',
    captionAr: 'تشخيص هندسي للدوائر الكهربائية والحساسات الحرارية لإعادة الجهاز للعمل بكفاءة المصنع.',
    captionEn: 'Engineering diagnostics of electronic circuits and thermal thermistors.',
    order: 3,
    createdAt: new Date().toISOString()
  },
  {
    id: 'gal-central-1',
    titleAr: 'تركيب دكت التكييف المركزي المعزول بالألياف الزجاجية',
    titleEn: 'Central AC Insulated Galvanized Duct Installation',
    category: 'أنظمة التكييف المركزي',
    serviceId: 'srv-3',
    serviceSlug: 'central-ac-systems',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    descriptionAr: 'تصنيع وتركيب شبكات مجاري الهواء الصاج المجلفن مع العوازل الحرارية والصوتية المتطورة.',
    descriptionEn: 'Fabrication and erection of galvanized sheet metal ducting with high-spec thermal insulation.',
    captionAr: 'مشروع تكييف مركزي متكامل مع توزيع الهواء وفق الحسابات الهندسية الدقيقة لسرعة وتدفق CFM.',
    captionEn: 'Integrated central HVAC project engineered for balanced air velocity and CFM distribution.',
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'gal-cold-1',
    titleAr: 'تجهيز غرفة تبريد وحفظ وتجميد سعة 60 طن',
    titleEn: 'Installation of 60-Ton Commercial Cold Storage Room',
    category: 'غرف وثلاجات التبريد والتجميد',
    serviceId: 'srv-5',
    serviceSlug: 'cold-rooms-freezers',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    descriptionAr: 'تركيب ألواح ساندوتش بانل كثافة 42 كجم/م3 ووحدات تكثيف نصف مقفلة مع نظام إذابة الصقيع الأوتوماتيكي.',
    descriptionEn: 'Erection of 42kg/m3 PUR panels and semi-hermetic condensing units with automatic electric defrost.',
    captionAr: 'غرفة تجميد لحوم ومواد غذائية بدرجة حرارة تصل إلى -20 مئوية مع لوحة تحكم ذكية متكاملة.',
    captionEn: 'Low-temperature cold room operating at -20°C with smart digital telemetry.',
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'gal-water-1',
    titleAr: 'إنشاء مستودع وثلاجات مركزية لتجميد وتبريد قوارير وكراتين الماء',
    titleEn: 'Commercial Cold Storage for Water Cartons & Bottling Facility',
    clientName: 'مصنع مياه شملان والنقاء للمياه المعدنية',
    clientNameAr: 'مصنع مياه شملان والنقاء للمياه المعدنية',
    location: 'صنعاء',
    city: 'صنعاء',
    category: 'أنظمة التبريد والتجميد المركزي',
    serviceId: 'srv-water-refrigeration',
    serviceSlug: 'water-bottles-cartons-central-freezing',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop'
    ],
    descriptionAr: 'تنفيذ هناجر وثلاجات تبريد سريعة لكراتين وقوارير الماء، مع وحدات تكثيف إنفرتر صناعية ونظام توزيع هواء يضمن تبريد متساوٍ لكافة البالتات.',
    descriptionEn: 'Installation of rapid cooling cold storage rooms for bottled water cartons with heavy-duty inverter condensing systems.',
    captionAr: 'تبريد وتجميد فائق لكراتين وقوارير الماء مع عوازل ساندوتش بانل محكمة وتوفير استهلاك الطاقة.',
    captionEn: 'High-speed cooling for bottled water cartons with precision temperature control.',
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'gal-poultry-1',
    titleAr: 'عنبر تجميد عميق (Blast Freezer) ومستودع لحفظ الدواجن واللحوم -25°C',
    titleEn: 'Deep Blast Freezer & Cold Hub for Poultry Logistics (-25°C)',
    clientName: 'شركة مزارع البركة لإنتاج وتوزيع الدواجن المجمدة',
    clientNameAr: 'شركة مزارع البركة لإنتاج وتوزيع الدواجن المجمدة',
    location: 'إب / الحديدة',
    city: 'إب',
    category: 'أنظمة التبريد والتجميد المركزي',
    serviceId: 'srv-poultry-meat-coldrooms',
    serviceSlug: 'poultry-meat-cold-storage-freezers',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop'
    ],
    descriptionAr: 'تجهيز عنابر تجميد عميق فائق السرعة لدواجن ولحوم طازجة بدرجات حرارة تصل إلى -25 درجة مئوية مع أرضيات مقاومة للرطوبة وأبواب هيرماتيكية عازلة.',
    descriptionEn: 'Turnkey blast freezing warehouse facility for poultry and meat logistics operating continuously at -25°C.',
    captionAr: 'غرف تجميد عميق -25°C مطابقة لاشتراطات سلامة وصحة الأغذية وضمان عدم تشكل الصقيع العشوائي.',
    captionEn: 'Hygienic deep blast freezer engineered to eliminate frost accumulation.',
    order: 1,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-vrf-24',
    slug: 'vrf-system-24-ton',
    nameAr: 'نظام تكييف مركزي ذكي VRF سعة 24 طن تبريدي',
    nameEn: 'Smart Commercial VRF System 24-Ton Heavy Duty',
    category: 'تكييف مركزي',
    brand: 'LG / Midea Multi-V',
    model: 'ARUM240LTE5',
    capacity: '24 طن (288,000 BTU)',
    descAr: 'نظام تكييف مركزي متطور للمباني الإدارية والمصانع والفنادق، يوفر تحكماً مستقلاً لكل منطقة بنظام الإنفرتر وتوفير استهلاك الطاقة حتى 50%.',
    descEn: 'State-of-the-art commercial VRF system for administrative buildings, industrial facilities, and hotels with modular zone control and high energy savings.',
    specifications: {
      'الجهد الكهربائي': '380V / 3 Phase / 50Hz',
      'نوع الغاز': 'R410A صديق للبيئة',
      'الضاغط': 'Dual Inverter Scroll',
      'كفاءة الطاقة': 'SEER 21.5 عالي التوفير',
      'نظام التحكم': 'تحكم مركزي BMS + تحكم شاشات لمسية'
    },
    condition: 'new',
    status: 'available',
    showPrice: false,
    mainImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [],
    isFeatured: true,
    isImportedEconomy: false,
    warranty: 'ضمان 5 سنوات للكمبروسر وسنتان شامل الصيانة',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-coldroom-unit-15',
    slug: 'cold-room-condensing-unit-15hp',
    nameAr: 'وحدة تكثيف غرف تبريد وتجميد صناعية سعة 15 حصان',
    nameEn: 'Semi-Hermetic Industrial Cold Storage Condensing Unit 15HP',
    category: 'غرف تبريد وتجميد',
    brand: 'Bitzer / Copeland',
    model: '4TES-12Y Industrial Box',
    capacity: '15 HP (-25°C إلى +5°C)',
    descAr: 'وحدة تبريد وتجميد مركزية نصف مقفلة للمستودعات الغذائية، مصانع الألبان، ومخازن الأدوية، مصممة لتحمل بيئة العمل الشاقة في اليمن.',
    descEn: 'Heavy-duty semi-hermetic commercial refrigeration condensing unit for food processing, pharmaceutical, and cold warehouse applications.',
    specifications: {
      'نوع الضاغط': 'شبه مقفل Bitzer Semi-Hermetic',
      'نوع الغاز': 'R404A / R507',
      'الجهد': '380-420V / 3 Phase',
      'نظام الإذابة': 'Defrost كهربائي ذكي',
      'درجة الحرارة': 'تصل إلى -25 درجة مئوية'
    },
    condition: 'new',
    status: 'available',
    showPrice: false,
    mainImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [],
    isFeatured: true,
    isImportedEconomy: false,
    warranty: 'سنتان مع الصيانة الدورية',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-floor-standing-5',
    slug: 'floor-standing-inverter-5ton',
    nameAr: 'وحدة تكييف دولابي إنفرتر 5 طن للصناعات والصالات الكبرى',
    nameEn: 'Floor Standing Inverter AC 5-Ton Heavy Duty',
    category: 'تكييف مركزي',
    brand: 'Gree / Midea',
    model: 'GF-60INV-T3',
    capacity: '5 طن (60,000 BTU)',
    descAr: 'مكيف دولابي عملاق بتقنية التبريد السريع للأماكن المفتوحة والمصانع وصالات العرض، كمبروسر استوائي T3 يتحمل درجات حرارة حتى 55 مئوية.',
    descEn: 'Industrial floor standing package AC unit with tropical T3 compressor engineered for open production floors, showrooms, and mosques.',
    specifications: {
      'الضاغط': 'T3 Tropical Inverter',
      'الجهد': '380V / 3 Phase',
      'مدى تدفق الهواء': 'تدفق قوي يصل إلى 20 متراً',
      'توفير الطاقة': 'إنفرتر ذكي موفر بنسبة 40%'
    },
    condition: 'new',
    status: 'available',
    showPrice: false,
    mainImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [],
    isFeatured: true,
    isImportedEconomy: true,
    warranty: '3 سنوات للكمبروسر وسنة شامل',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-split-eco-24',
    slug: 'solar-ready-inverter-split-2ton',
    nameAr: 'مكيف سبليت جداري إنفرتر اقتصادي 2 طن - متوافق مع الطاقة الشمسية',
    nameEn: 'Solar-Ready Economy Inverter Split AC 2-Ton (24000 BTU)',
    category: 'تكييف جداري سبليت',
    brand: 'InverCool Pro',
    model: 'IC-24INV-SOLAR',
    capacity: '2 طن (24,000 BTU)',
    descAr: 'مكيف إسبليت فائق الكفاءة وتوفير الكهرباء، يعمل بتيار تشغيل منخفض جداً متوافق مع منظومات الطاقة الشمسية المنزلية والتجارية في اليمن.',
    descEn: 'High-efficiency Full DC Inverter split AC optimized for solar systems and fuel generators with ultra-low starting current.',
    specifications: {
      'التقنية': 'Full DC Inverter موفر للطاقة بنسبة 60%',
      'نوع الغاز': 'R410A صديق للبيئة',
      'الجهد': '220V - تردد 50Hz',
      'التوافق': 'متوافق تماماً مع محولات وأنظمة الطاقة الشمسية'
    },
    condition: 'new',
    status: 'available',
    showPrice: false,
    mainImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [],
    isFeatured: true,
    isImportedEconomy: true,
    warranty: 'سنتان شامل و 5 سنوات للكمبروسر',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-copeland-scroll-10',
    slug: 'copeland-scroll-compressor-10ton',
    nameAr: 'ضاغط تبريد وتكييف كوبلاند سكرول 10 طن أصلي',
    nameEn: 'Genuine Copeland Scroll Industrial Compressor 10-Ton',
    category: 'قطع غيار واكسسوارات',
    brand: 'Copeland Emerson',
    model: 'ZR125KC-TFD-522',
    capacity: '10 طن تبريدي',
    descAr: 'كمبروسر سكرول صناعي أصلي أمريكي الصنع، مخصص للأنظمة المركزية ووحدات الباكيج والشيلرات، كفاءة تبريد عالية ومقاومة فائقة للجهد.',
    descEn: 'Authentic Copeland Scroll refrigeration compressor engineered for rooftop units, split chillers, and industrial HVAC plants.',
    specifications: {
      'الجهد الكهربائي': '380-420V / 3 Phase / 50Hz',
      'الغازات المتوافقة': 'R407C / R134a / R22',
      'نوع الزيت': 'POE اصطناعي عالي النقاء',
      'الصناعة': 'Emerson Climate Technologies الأصلي'
    },
    condition: 'new',
    status: 'available',
    showPrice: false,
    mainImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [],
    isFeatured: false,
    isImportedEconomy: false,
    warranty: 'ضمان الفحص والتشغيل الأصلي',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-dixell-controller',
    slug: 'industrial-cold-room-controller-panel',
    nameAr: 'لوحة تحكم رقمية لغرف التبريد والتجميد الصناعية',
    nameEn: 'Industrial Digital Control Panel for Cold Storage & Blast Freezers',
    category: 'قطع غيار واكسسوارات',
    brand: 'Dixell / Carel',
    model: 'XL-600 Industrial Box',
    capacity: 'يدعم وحدات حتى 30 حصان',
    descAr: 'لوحة تحكم إلكترونية متكاملة مع قواطع حماية وحماية هبوط وسقوط الفازات وشاشة مزدوجة ومنبهات طوارئ لحماية المخزون.',
    descEn: 'Full industrial electric control panel with phase failure protection, digital dual display, and acoustic alarm relays.',
    specifications: {
      'الحماية': 'قاطع حراري ومغناطيسي + Phase Failure Relay',
      'نطاق القياس': '-50°C إلى +50°C بدقة 0.1°C',
      'مخارج التحكم': 'ضاغط + مراوح مبخر + سخانات إذابة + إنذار',
      'مستوى الحماية': 'IP65 مقاوم للرطوبة والغبار'
    },
    condition: 'new',
    status: 'available',
    showPrice: false,
    mainImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [],
    isFeatured: false,
    isImportedEconomy: false,
    warranty: 'سنة شاملة',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-rooftop-package-12',
    slug: 'rooftop-packaged-unit-12ton-inspected',
    nameAr: 'وحدة باكيج تكييف مركزي مدمجة 12 طن - مستوردة ومفحوصة',
    nameEn: 'Rooftop Packaged Central AC 12-Ton - Inspected Used Import',
    category: 'تكييف مركزي',
    brand: 'Carrier / Trane',
    model: '50TC-14 Commercial',
    capacity: '12 طن (144,000 BTU)',
    descAr: 'وحدة تكييف باكيج مركزي مستوردة بحالة ممتازة تم فحصها ومعايرتها هندسياً واختبار كفاءة الضواغط تحت الحمل الميداني بنسبة 98%.',
    descEn: 'Certified pre-owned commercial rooftop package unit thoroughly tested and serviced by certified engineers with proven heat performance.',
    specifications: {
      'الحالة': 'مستعمل نظيف جداً - تم الفحص والتعقيم',
      'الجهد': '380V / 3 Phase',
      'الضواغط': 'Dual Copeland Scroll بحالة المصنع',
      'الغاز': 'R410A مشحون بالكامل'
    },
    condition: 'used',
    status: 'available',
    showPrice: false,
    mainImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [],
    isFeatured: true,
    isImportedEconomy: true,
    warranty: 'ضمان فحص وتشغيل معتمد 6 أشهر',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-split-used-18',
    slug: 'split-ac-18000-inspected-used',
    nameAr: 'مكيف سبليت مستعمل نظيف 1.5 طن مفحوص ومضمون',
    nameEn: 'Inspected Pre-Owned Split AC 1.5-Ton (18,000 BTU)',
    category: 'تكييف جداري سبليت',
    brand: 'LG / Samsung',
    model: 'AS-18U Classic',
    capacity: '1.5 طن (18,000 BTU)',
    descAr: 'مكيف سبليت مستعمل تم غسيل وصيانة المبخر والمكثف كيميائياً وفحص ضغط الفريون والكمبروسر مع ضمان تشغيل وتجربة.',
    descEn: 'Inspected used split air conditioner chemically cleaned, serviced, and pressure-tested with warranty.',
    specifications: {
      'الحالة': 'مستعمل نظيف - خالي من أي عيوب تشغيلية',
      'الفريون': 'شحنة فريون كاملة جديدة',
      'الجهد': '220V',
      'الضمان': 'ضمان تجريبي لمدة 3 أشهر'
    },
    condition: 'used',
    status: 'available',
    showPrice: false,
    mainImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [],
    isFeatured: false,
    isImportedEconomy: true,
    warranty: 'ضمان تشغيل 3 أشهر',
    createdAt: new Date().toISOString()
  }
];

// In-memory cache & Mutex lock for thread-safe atomic file writing
class DatabaseManager {
  private db: DatabaseSchema | null = null;
  private isWriting = false;

  public init(): DatabaseSchema {
    if (this.db) return this.db;

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.db = JSON.parse(raw);
        // Ensure all required collections exist
        if (!this.db!.services || this.db!.services.length === 0) this.db!.services = INITIAL_SERVICES;
        if (!this.db!.settings) this.db!.settings = INITIAL_SETTINGS;
        if (!this.db!.faq) this.db!.faq = INITIAL_FAQ;
        if (!this.db!.products || this.db!.products.length === 0) this.db!.products = INITIAL_PRODUCTS;
        if (!this.db!.projects) this.db!.projects = [];
        if (!this.db!.gallery || this.db!.gallery.length === 0) {
          this.db!.gallery = INITIAL_GALLERY;
        } else {
          // If gallery exists but lacks service-linked samples, merge them
          const hasServiceLinked = this.db!.gallery.some((g) => g.serviceSlug);
          if (!hasServiceLinked) {
            this.db!.gallery = [...this.db!.gallery, ...INITIAL_GALLERY];
          }
        }
        if (!this.db!.reviews) this.db!.reviews = [];
        if (!this.db!.maintenanceRequests) this.db!.maintenanceRequests = [];
        if (!this.db!.quoteRequests) this.db!.quoteRequests = [];
        if (!this.db!.technicianRequests) this.db!.technicianRequests = [];
        if (!this.db!.contactMessages) this.db!.contactMessages = [];
        if (!this.db!.notifications) this.db!.notifications = [];
        if (!this.db!.adminUsers) this.db!.adminUsers = [];

        // Ensure srv-3 has the updated title and subServices if not populated
        const srv3 = this.db!.services?.find((s) => s.id === 'srv-3' || s.slug === 'central-ac-systems');
        if (srv3) {
          srv3.titleAr = 'أنظمة التكييف والتبريد المركزي';
          srv3.titleEn = 'Central HVAC & Refrigeration Systems';
          if (!srv3.subServices || srv3.subServices.length === 0) {
            const initialSrv3 = INITIAL_SERVICES.find((s) => s.id === 'srv-3');
            if (initialSrv3?.subServices) {
              srv3.subServices = initialSrv3.subServices;
            }
          }
        }

        // Ensure the two new specialized primary services exist
        const srvWater = INITIAL_SERVICES.find((s) => s.id === 'srv-water-refrigeration');
        if (srvWater && !this.db!.services.some((s) => s.id === 'srv-water-refrigeration' || s.slug === srvWater.slug)) {
          this.db!.services.push(srvWater);
        }

        const srvPoultry = INITIAL_SERVICES.find((s) => s.id === 'srv-poultry-meat-coldrooms');
        if (srvPoultry && !this.db!.services.some((s) => s.id === 'srv-poultry-meat-coldrooms' || s.slug === srvPoultry.slug)) {
          this.db!.services.push(srvPoultry);
        }

        // Ensure new gallery showcase works exist in gallery
        const galWater = INITIAL_GALLERY.find((g) => g.id === 'gal-water-1');
        if (galWater && !this.db!.gallery.some((g) => g.id === 'gal-water-1')) {
          this.db!.gallery.unshift(galWater);
        }

        const galPoultry = INITIAL_GALLERY.find((g) => g.id === 'gal-poultry-1');
        if (galPoultry && !this.db!.gallery.some((g) => g.id === 'gal-poultry-1')) {
          this.db!.gallery.unshift(galPoultry);
        }

        this.saveSync();
        return this.db!;
      } catch (err) {
        console.error('Error reading db.json, creating initial data:', err);
      }
    }

    // Default seed
    this.db = {
      services: INITIAL_SERVICES,
      products: INITIAL_PRODUCTS,
      projects: [],
      gallery: [],
      reviews: [],
      maintenanceRequests: [],
      quoteRequests: [],
      technicianRequests: [],
      contactMessages: [],
      notifications: [],
      faq: INITIAL_FAQ,
      settings: INITIAL_SETTINGS,
      adminUsers: []
    };

    this.saveSync();
    return this.db;
  }

  public get(): DatabaseSchema {
    if (!this.db) return this.init();
    return this.db;
  }

  public saveSync(): void {
    if (!this.db) return;
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.db, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to write db.json atomically:', err);
    }
  }
}

export const dbManager = new DatabaseManager();
