/**
 * Static Data for Electrical Control & Alarm Panels Division (الطبالين واللوحات الكهربائية)
 * Integrated as static data for robust rendering in preview and production (e.g. Vercel).
 */

export interface PanelFeature {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  badge?: string;
}

export interface PanelSpec {
  labelAr: string;
  labelEn: string;
  valAr: string;
  valEn: string;
}

export interface ElectricalPanelsSectionData {
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descAr: string;
  descEn: string;
  coverImage: string;
  features: PanelFeature[];
  specs: PanelSpec[];
  applicationsAr: string[];
  applicationsEn: string[];
  calloutAr: string;
  calloutEn: string;
}

export const electricalPanelsData: ElectricalPanelsSectionData = {
  titleAr: 'تصميم وتجميع لوحات التحكم والإنذار الكهربائية (الطبالين)',
  titleEn: 'Design & Assembly of Electrical Control & Alarm Panels',
  subtitleAr: 'قسم الهندسة الكهربائية والتحكم الآلي لأنظمة التبريد والتكييف المركزي',
  subtitleEn: 'Electrical Engineering & Automated Control Division for HVAC & Cold Storage',
  descAr:
    'نقوم بتصميم وتجميع طبالين ولوحات التحكم الكهربائية لغرف ومستودعات التبريد والتكييف المركزي وفق أعلى معايير الأمان وحماية الضواغط والأنظمة من تذبذب التيار والأعطال.',
  descEn:
    'We design and assemble electrical control and alarm panels for cold storage rooms, warehouses, and central HVAC systems in accordance with the highest safety standards, protecting compressors and systems from voltage fluctuations and electrical faults.',
  coverImage: '/images/panel-cover.jpg',
  features: [
    {
      id: 'compressor-protection',
      titleAr: 'حماية كاملة للضواغط',
      titleEn: 'Full Compressor Protection',
      descAr:
        'حماية إلكترونية وهندسية فائقة ضد ارتفاع أو انخفاض الجهد، تتابع وسقوط الفازات (Phase Failure)، وارتفاع درجات حرارة ملفات الكمبروسر والتحميل الزائد (Overload).',
      descEn:
        'Comprehensive electronic safeguards against under/over voltage, phase loss/reverse, compressor winding thermal overload, and short circuits.',
      icon: 'ShieldCheck',
      badge: 'أمان 100%'
    },
    {
      id: 'early-warning',
      titleAr: 'أنظمة إنذار مبكر',
      titleEn: 'Early Warning Alarm Systems',
      descAr:
        'مؤشرات ضوئية عالية الوضوح وسارينات إنذار صوتية تنبه الفنيين فور حدوث أي انحراف حراري أو هبوط في ضغط وسيط التبريد لحماية البضائع والمخزون.',
      descEn:
        'High-visibility visual indicators and acoustic alarms that notify operators instantly of temperature shifts or pressure drops, preserving cargo.',
      icon: 'AlertTriangle',
      badge: 'تنبيه لحظي'
    },
    {
      id: 'high-quality-components',
      titleAr: 'استخدام مكونات عالية الجودة',
      titleEn: 'High-Quality Industrial Components',
      descAr:
        'اعتماد قواطع، موصلات (كونتاكتورات)، ومرحلات أصلية من كبرى الشركات العالمية (Schneider Electric، LG/LS، ABB) لتحمل أصعب ظروف التشغيل ودرجات الحرارة.',
      descEn:
        'Equipped with genuine industrial circuit breakers, contactors, and relays from top brands (Schneider Electric, LG/LS, ABB) engineered for heavy-duty operation.',
      icon: 'Cpu',
      badge: 'ماركات عالمية'
    },
    {
      id: 'organized-layout',
      titleAr: 'تصميم منظم يسهل الصيانة الدورية',
      titleEn: 'Organized Layout for Easy Maintenance',
      descAr:
        'ترقيم دقيق لكافة الأسلاك والأطراف (Terminal Blocks)، مسارات تنظيم داخل قنوات كابلات عازلة، مع مخطط كهربي ملصق داخل اللوحة لتسهيل الفحص السريع.',
      descEn:
        'Meticulous ferrule wire numbering, insulated cable trunking, and laminated schematics inside every enclosure for effortless routine maintenance.',
      icon: 'LayoutGrid',
      badge: 'هندسة متقنة'
    }
  ],
  specs: [
    {
      labelAr: 'نوع العزل والحماية',
      labelEn: 'Enclosure Protection',
      valAr: 'صناديق معدنية IP65 مقاومة للرطوبة والغبار والصدأ',
      valEn: 'Heavy-duty IP65 metal enclosure (dust & moisture resistant)'
    },
    {
      labelAr: 'وحدات التحكم الحراري',
      labelEn: 'Temperature Controllers',
      valAr: 'أجهزة رقمية متطورة (Dixell / Carel / Eliwell) للتحكم الدقيق',
      valEn: 'Digital controllers (Dixell / Carel / Eliwell) with LED displays'
    },
    {
      labelAr: 'التحكم بإذابة الصقيع',
      labelEn: 'Defrost Management',
      valAr: 'مؤقتات إلكترونية ومرحلات تحكم بسخانات التبخير ومراوح الهواء',
      valEn: 'Smart electronic defrost cycles for evaporators and fan delays'
    },
    {
      labelAr: 'التوافق الكهربائي',
      labelEn: 'Electrical Compatibility',
      valAr: 'أنظمة 380V/220V - 3Phase و Single Phase متوافقة مع المولدات والطاقة الشمسية',
      valEn: '380V/220V 3-Phase & Single-Phase compatible with grid, gen & solar'
    }
  ],
  applicationsAr: [
    'غرف ومستودعات التبريد والتجميد الغذائي والدوائي',
    'منظومات التكييف المركزي ووحدات مناولة الهواء (AHU / Chiller)',
    'ثلاجات حفظ اللحوم والدواجن ومصانع الألبان',
    'محطات التبريد التجاري للمولات والهايبر ماركت'
  ],
  applicationsEn: [
    'Cold stores and freezer warehouses for food and pharma',
    'Central HVAC systems, chillers, and Air Handling Units (AHU)',
    'Meat, poultry, and dairy preservation refrigeration rooms',
    'Commercial refrigeration racks for supermarkets and logistics'
  ],
  calloutAr:
    'نمنح ضماناً شاملاً على اللوحات مع اختبار حمل كامل وتشغيل تجريبي قبل التسليم، مع إمكانية تصنيع لوحات مخصصة حسب قدرة الكمبروسرات وأحمال المنشأة.',
  calloutEn:
    'Full warranty with comprehensive load-testing and pre-commissioning verification, customized to your compressor capacities and facility electrical infrastructure.'
};
