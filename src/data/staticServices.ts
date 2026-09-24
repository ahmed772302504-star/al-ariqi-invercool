import { Service } from "../types.js";

export const staticServices: Service[] = [
  {
    "id": "srv-1",
    "slug": "ac-repair-maintenance",
    "titleAr": "صيانة وإصلاح أجهزة التكييف",
    "titleEn": "Air Conditioning Repair & Maintenance",
    "shortDescAr": "خدمات شاملة لصيانة وإصلاح جميع أنواع وحدات التكييف الإسبليت والشباك والدولابي.",
    "shortDescEn": "Comprehensive maintenance and repair for all split, window, and package AC units.",
    "descAr": "فريق هندسي متخصص في تشخيص وإصلاح كافة أعطال وحدات التكييف المنزلية والتجارية، مع فحص دورات الفريون، الكمبروسر، والدوائر الكهربائية بدقة متناهية.",
    "descEn": "Specialized engineering team for diagnosing and repairing all residential and commercial AC malfunctions, refrigerant cycles, compressors, and electrical circuits.",
    "iconName": "Wrench",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "فحص ضغط الغاز وتعبئة الفريون الأصلي",
      "تنظيف الفلاتر والمبخرات بتقنية الضغط العالي",
      "صيانة الكروت الإلكترونية والحساسات",
      "ضمان معتمد على أعمال الصيانة"
    ],
    "featuresEn": [
      "Refrigerant pressure test & certified gas charging",
      "High-pressure filter & evaporator cleaning",
      "Electronic control board & sensor repairs",
      "Warranty on maintenance work"
    ],
    "isFeatured": true,
    "isActive": true,
    "order": 1
  },
  {
    "id": "srv-2",
    "slug": "refrigeration-repair",
    "titleAr": "صيانة وإصلاح أنظمة التبريد",
    "titleEn": "Refrigeration Systems Repair & Maintenance",
    "shortDescAr": "صيانة وإصلاح أنظمة التبريد بمختلف أحجامها وسعاتها التشغيلية.",
    "shortDescEn": "Maintenance and repair for commercial and industrial refrigeration systems.",
    "descAr": "خدمات هندسية متكاملة لصيانة دورات التبريد والمكثفات والمبخرات وضواغط التبريد لمختلف المنشآت.",
    "descEn": "Integrated engineering services for refrigeration loops, condensers, evaporators, and refrigeration compressors.",
    "iconName": "Snowflake",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "تشخيص دقيق لكفاءة التبريد",
      "إصلاح تسريبات خطوط الغاز",
      "معايرة أنظمة التحكم بالحرارة",
      "قطع غيار أصلية"
    ],
    "featuresEn": [
      "Precision cooling efficiency diagnostics",
      "Gas leak detection and repair",
      "Thermostat & temperature calibration",
      "Genuine spare parts"
    ],
    "isFeatured": true,
    "isActive": true,
    "order": 2
  },
  {
    "id": "srv-3",
    "slug": "central-ac-systems",
    "titleAr": "أنظمة التكييف والتبريد المركزي",
    "titleEn": "Central HVAC & Refrigeration Systems",
    "shortDescAr": "توريد، تركيب، صيانة وتشغيل الأنظمة المركزية، الـ VRF والدكت.",
    "shortDescEn": "Supply, installation, maintenance, and commissioning of Central & VRF AC systems.",
    "descAr": "تنفيذ أنظمة التكييف المركزي المتطورة للمباني الكبيرة والأبراج والمؤسسات بأعلى المعايير الهندسية مع تصميم مجاري الهواء (Ducting) وتوزيع الأحمال الحرارية بدقة.",
    "descEn": "Execution of advanced central AC systems for large buildings and corporations following highest engineering standards including duct design and heat load calculation.",
    "iconName": "Building",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "حساب الأحمال الحرارية الهندسية (Cooling Load)",
      "تصميم وتنفيذ دكت التكييف المعزول",
      "برمجة أنظمة الـ VRF والتحكم الذكي",
      "عقود تشغيل ومتابعة دورية"
    ],
    "featuresEn": [
      "Thermal cooling load calculation",
      "Insulated duct fabrication & installation",
      "VRF & smart control programming",
      "Operational & periodic servicing contracts"
    ],
    "isFeatured": true,
    "isActive": true,
    "order": 3,
    "subServices": [
      {
        "id": "sub-water-freezing",
        "titleAr": "تركيب ثلاجات مركزية لتجميد وتبريد قوارير وكراتين الماء",
        "titleEn": "Central Refrigeration for Water Bottles & Cartons Freezing & Cooling",
        "descAr": "تصميم وتنفيذ ثلاجات ومستودعات تبريد وتجميد مركزية متخصصة لمصانع ومستودعات مياه الشرب الصحية لحفظ وتجميد كراتين وقوارير الماء بأعلى سرعة وكفاءة تبريد.",
        "descEn": "Engineering and installation of commercial cold rooms and blast freezers for water bottling facilities and carton cooling.",
        "iconName": "Droplets",
        "badgeAr": "تبريد وتجميد مياه",
        "badgeEn": "Water Freezing",
        "featuresAr": [
          "تبريد فائق لكراتين وقوارير مياه الشرب",
          "عوازل ساندوتش بانل محكمة وموفرة للطاقة",
          "تحكم رقمي دقيق بدرجات الحرارة"
        ],
        "featuresEn": [
          "High-speed cooling for bottled water cartons",
          "Heavy-duty insulated sandwich panels",
          "Precision digital temperature telemetry"
        ]
      },
      {
        "id": "sub-poultry-food",
        "titleAr": "تركيب ثلاجات مركزية لتجميد وحفظ الدجاج والمواد الغذائية",
        "titleEn": "Central Cold Storage & Blast Freezers for Poultry & Food Supplies",
        "descAr": "تنفيذ غرف التجميد العميق (Blast Freezers) وثلاجات حفظ لحوم الدواجن، الأسماك، والمواد الغذائية بدرجات حرارة تصل إلى -25°C مطابقة لأعلى المعايير الصحية.",
        "descEn": "Turnkey blast freezers and cold storage facilities for poultry, meats, fish, and perishable foods down to -25°C.",
        "iconName": "Utensils",
        "badgeAr": "لحوم ومواد غذائية",
        "badgeEn": "Poultry & Food Storage",
        "featuresAr": [
          "تجميد عميق فائق حتى -25 درجة مئوية",
          "ضواغط ومبخرات صناعية عالية التحمل",
          "مطابقة تامة لاشتراطات صحة وسلامة الأغذية"
        ],
        "featuresEn": [
          "Deep blast freezing down to -25°C",
          "Industrial heavy-duty compressors & coils",
          "Fully certified food-grade hygiene standards"
        ]
      }
    ]
  },
  {
    "id": "srv-4",
    "slug": "central-refrigeration",
    "titleAr": "أنظمة التبريد المركزي",
    "titleEn": "Central Refrigeration Systems",
    "shortDescAr": "تنفيذ وصيانة أنظمة التبريد الكبيرة والمركزية للقطاعات الصناعية والغذائية.",
    "shortDescEn": "Implementation and maintenance of large-scale central refrigeration plants.",
    "descAr": "حلول تبريد مركزية للأنشطة الصناعية ومصانع الأغذية ومراكز التوزيع الكبرى مع أحدث وحدات التكثيف والمبادلات الحرارية.",
    "descEn": "Central refrigeration solutions for industrial plants, food processing facilities, and large logistics hubs.",
    "iconName": "Cpu",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "كفاءة طاقة استثنائية بنظام الإنفرتر",
      "عزل حراري هندسي عالي الكفاءة",
      "أنظمة إنذار ومراقبة درجات الحرارة عن بعد",
      "دعم فني للطوارئ على مدار الساعة"
    ],
    "featuresEn": [
      "Inverter-driven energy efficiency",
      "Engineered high-spec thermal insulation",
      "Remote temperature telemetry & alarms",
      "24/7 emergency response"
    ],
    "isFeatured": true,
    "isActive": true,
    "order": 4
  },
  {
    "id": "srv-5",
    "slug": "cold-rooms",
    "titleAr": "غرف وثلاجات التبريد الكبيرة",
    "titleEn": "Cold Rooms & Large Refrigerated Storage",
    "shortDescAr": "تصميم وتركيب وصيانة غرف التبريد والتجميد وسندوتش بانل حسب متطلبات المشروع.",
    "shortDescEn": "Design, installation, and maintenance of walk-in cold rooms and blast freezers.",
    "descAr": "تصميم وتنفيذ مستودعات وغرف التبريد والتجميد التجاري والصيدلاني والغذائي باستخدام ألواح ساندوتش بانل عازلة ومعدات تبريد مطابقة للمواصفات الدولية.",
    "descEn": "Design and construction of commercial, pharmaceutical, and food cold storage rooms using certified sandwich panels and heavy-duty refrigeration units.",
    "iconName": "Layers",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "توريد وتركيب ساندوتش بانل كثافة عالية",
      "أبواب تبريد محكمة ومقاومة للهدر الحراري",
      "أنظمة تحكم رقمية دقيقة بالحرارة والرطوبة",
      "صيانة وقائية لضمان سلامة المخزون"
    ],
    "featuresEn": [
      "High-density polyurethane sandwich panels",
      "Airtight thermal doors",
      "Precision digital thermostat & humidity controllers",
      "Preventive care to protect perishable inventory"
    ],
    "isFeatured": true,
    "isActive": true,
    "order": 5
  },
  {
    "id": "srv-6",
    "slug": "installation-commissioning",
    "titleAr": "التركيب والتشغيل",
    "titleEn": "Installation & Commissioning",
    "shortDescAr": "تركيب وتجهيز وتشغيل أجهزة وأنظمة التكييف والتبريد بدقة هندسية.",
    "shortDescEn": "Professional engineering installation and testing of all HVAC equipment.",
    "descAr": "تثبيت وتمديد خطوط النحاس، أنابيب الصرف، التوصيلات الكهربائية، واختبار التسريب وتفريغ الهواء (Vacuum) وفق المعايير المصنعية العالمية.",
    "descEn": "Copper pipe routing, drainage installation, electrical cabling, vacuuming, and factory-standard pressure testing.",
    "iconName": "CheckCircle2",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "استخدام أنابيب نحاس أصلية ذات سماكة معتمدة",
      "تفريغ الهواء وسحب الرطوبة بجهاز الفاكيوم",
      "معايرة ضغوط التشغيل بدقة",
      "فحص شامل قبل التسليم"
    ],
    "featuresEn": [
      "Certified wall-thickness copper piping",
      "Deep vacuum moisture removal",
      "Accurate operational pressure calibration",
      "Thorough pre-commissioning handover inspection"
    ],
    "isFeatured": false,
    "isActive": true,
    "order": 6
  },
  {
    "id": "srv-7",
    "slug": "diagnostics-repair",
    "titleAr": "التشخيص وإصلاح الأعطال",
    "titleEn": "Diagnostics & Troubleshooting",
    "shortDescAr": "تشخيص الأعطال الكهربائية والميكانيكية وأعطال منظومات التكييف والتبريد بأحدث الأجهزة.",
    "shortDescEn": "Accurate electrical and mechanical diagnostics using advanced measurement tools.",
    "descAr": "فحص إلكتروني متقدم لتحديد أسباب توقف المكيفات، ارتفاع درجات الحرارة، الضوضاء، وتهريب الفريون مع توفير الحلول الفورية والآمنة.",
    "descEn": "Advanced electronic troubleshooting to diagnose compressor failure, high head pressure, strange noises, and refrigerant leaks.",
    "iconName": "Activity",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "أجهزة قياس إلكترونية وكواشف تسريب متطورة",
      "فحص استهلاك التيار الكهربائي (Ampere)",
      "كشف الأعطال المخفية بدقة",
      "تقرير فني واضح للعميل"
    ],
    "featuresEn": [
      "Digital leak detectors and multimeters",
      "Current draw & power consumption analysis",
      "In-depth diagnostic trace",
      "Clear, transparent technician report"
    ],
    "isFeatured": false,
    "isActive": true,
    "order": 7
  },
  {
    "id": "srv-8",
    "slug": "preventive-maintenance",
    "titleAr": "الصيانة الوقائية والدورية",
    "titleEn": "Preventive & Periodic Maintenance",
    "shortDescAr": "برامج صيانة دورية ووقائية مصممة لرفع كفاءة الأجهزة وإطالة عمرها التشغيلي.",
    "shortDescEn": "Tailored maintenance contracts to maximize efficiency and extend equipment lifespan.",
    "descAr": "جداول زيارات دورية تشمل الغسيل الكيميائي، فحص الضواغط، تشحيم المحركات، وفحص العوازل لتقليل استهلاك الكهرباء ومنع الأعطال المفاجئة.",
    "descEn": "Scheduled inspection visits including chemical coil cleaning, compressor checks, motor lubrication, and insulation inspection to curb power bills and downtime.",
    "iconName": "ShieldCheck",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "تقليل استهلاك الطاقة بنسبة تصل إلى 25%",
      "منع التوقف المفاجئ في أوقات الذروة",
      "عقود مرنة شهرية وربع سنوية",
      "تقارير متابعة دورية"
    ],
    "featuresEn": [
      "Up to 25% energy consumption reduction",
      "Prevention of sudden breakdowns during peak heat",
      "Flexible monthly & quarterly contracts",
      "Detailed log reports"
    ],
    "isFeatured": true,
    "isActive": true,
    "order": 8
  },
  {
    "id": "srv-9",
    "slug": "hotel-projects",
    "titleAr": "مشاريع الفنادق والضيافة",
    "titleEn": "Hotel & Hospitality Projects",
    "shortDescAr": "أنظمة HVAC والتكييف والتبريد المركزية الهادئة والمريحة للمنشآت الفندقية.",
    "shortDescEn": "Whisper-quiet, high-comfort central HVAC systems for luxury hotels.",
    "descAr": "توفير أعلى درجات الراحة والهدوء للنزلاء مع أنظمة تكييف متغيرة التدفق وموفرة للطاقة وغرف تبريد مركزية لمطابخ الفنادق.",
    "descEn": "Ensuring whisper-quiet guest comfort with VRF solutions and robust kitchen cold storage.",
    "iconName": "Hotel",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "هدوء فائق ومستويات ضوضاء منخفضة (Ultra-quiet)",
      "تحكم ذكي مستقل لكل غرفة وجناح",
      "أنظمة تهوية واسترجاع حراري (ERV)",
      "غرف تبريد وتجميد لمطاعم ومطابخ الفنادق"
    ],
    "featuresEn": [
      "Ultra-low acoustic footprint",
      "Independent room & suite thermostat control",
      "Energy Recovery Ventilation (ERV)",
      "Commercial restaurant refrigeration units"
    ],
    "isFeatured": false,
    "isActive": true,
    "order": 9
  },
  {
    "id": "srv-10",
    "slug": "hospital-projects",
    "titleAr": "مشاريع المستشفيات والمراكز الصحية",
    "titleEn": "Hospital & Healthcare Facilities",
    "shortDescAr": "أنظمة التكييف والتبريد المتخصصة لغرف العمليات والعناية المركزة والمختبرات.",
    "shortDescEn": "Specialized sterile HVAC systems for operating theaters, ICUs, and laboratories.",
    "descAr": "تنفيذ أنظمة التهوية والتكييف الطبي مع فلاتر HEPA والتحكم الدقيق بالضغط الإيجابي والسلبي ونسب الرطوبة لحماية المرضى ومنع العدوى.",
    "descEn": "Specialized healthcare climate control with HEPA filtration, positive/negative pressure cascades, and strict humidity management.",
    "iconName": "Cross",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "فلاتر هيبا (HEPA Filters) بنقاوة هواء 99.97%",
      "التحكم بالضغط التفاضلي لغرف العزل والعمليات",
      "ثلاجات حفظ الأدوية وبنوك الدم الطبية",
      "التوافق مع المعايير الصحية العالمية"
    ],
    "featuresEn": [
      "99.97% HEPA cleanroom filtration",
      "Differential pressure cascades for sterile zones",
      "Pharmaceutical & blood bank refrigeration",
      "Global healthcare HVAC compliance"
    ],
    "isFeatured": false,
    "isActive": true,
    "order": 10
  },
  {
    "id": "srv-11",
    "slug": "corporate-facilities",
    "titleAr": "مشاريع الشركات والمنشآت",
    "titleEn": "Corporate & Institutional Facilities",
    "shortDescAr": "تنفيذ أنظمة التكييف والتبريد للمباني الإدارية، البنوك، ومقار الشركات.",
    "shortDescEn": "Climate systems tailored for corporate headquarters, banks, and office buildings.",
    "descAr": "تصميم حلول تكييف هندسية موفرة للطاقة مع توزيع متجانس للهواء وأنظمة تبريد خاصة بغرف السيرفرات ومراكز البيانات (Data Centers).",
    "descEn": "Energy-saving office HVAC with uniform air distribution and dedicated precision cooling for server rooms.",
    "iconName": "Briefcase",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "أنظمة تبريد دقيقة لغرف السيرفرات (Precision Cooling)",
      "تحكم مركزي ذكي بالمبنى (BMS)",
      "توزيع تدفق هواء صحي وبيئة عمل مريحة",
      "كفاءة تشغيلية واستهلاك كهرباء اقتصادي"
    ],
    "featuresEn": [
      "Precision cooling for data and server racks",
      "BMS intelligent central building automation",
      "Comfortable, healthy workplace airflow",
      "High energy performance ratio"
    ],
    "isFeatured": false,
    "isActive": true,
    "order": 11
  },
  {
    "id": "srv-12",
    "slug": "commercial-industrial",
    "titleAr": "المشاريع التجارية والصناعية",
    "titleEn": "Commercial & Industrial Projects",
    "shortDescAr": "حلول التكييف والتبريد للمصانع، المستودعات، والمجمعات التجارية الكبرى.",
    "shortDescEn": "HVAC and refrigeration solutions for manufacturing plants, warehouses, and malls.",
    "descAr": "أنظمة تشيلر وتبريد وتكييف ضخمة تلبي المتطلبات الحرارية الصعبة للمصانع والمراكز التجارية مع قدرات تحمل بيئية عالية.",
    "descEn": "Heavy-duty chillers and air handlers engineered for demanding industrial environments and shopping malls.",
    "iconName": "Factory",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "قدرات تبريد هائلة (Heavy tonnage)",
      "مقاومة الظروف البيئية القاسية والرطوبة",
      "تصميم وتصنيع شبكات الدكت المعزولة",
      "صيانة وقائية مبرمجة لعدم توقف الإنتاج"
    ],
    "featuresEn": [
      "High tonnage capacity configurations",
      "Harsh environment & ambient tolerance",
      "Custom insulated ductwork networks",
      "Scheduled servicing to eliminate production halts"
    ],
    "isFeatured": false,
    "isActive": true,
    "order": 12
  },
  {
    "id": "srv-13",
    "slug": "residential-projects",
    "titleAr": "المشاريع السكنية والفلل",
    "titleEn": "Residential & Villa Projects",
    "shortDescAr": "تركيب وصيانة أنظمة التكييف للمنازل، الشقق، والفلل السكنية الراقية.",
    "shortDescEn": "Residential and luxury villa air conditioning design, supply, and maintenance.",
    "descAr": "حلول تكييف أنيقة وذكية تناسب الديكور الداخلي للفلل والمنازل، مع تقنيات الإنفرتر لتوفير استهلاك الكهرباء ومنظومات تحكم عبر الهاتف.",
    "descEn": "Elegant, smart home air conditioning tailored for interior aesthetics with inverter energy savings.",
    "iconName": "Home",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "تصميم متناسق مع الديكور الهندسي الداخلي",
      "أجهزة إنفرتر موفرة للطاقة بنسبة 60%",
      "تحكم ذكي بالواي فاي من الهاتف",
      "صوت فائق الهدوء للنوم المريح"
    ],
    "featuresEn": [
      "Harmonious interior architectural integration",
      "Inverter technology with up to 60% power savings",
      "Smart Wi-Fi smartphone control",
      "Ultra-quiet acoustics for peaceful rest"
    ],
    "isFeatured": false,
    "isActive": true,
    "order": 13
  },
  {
    "id": "srv-14",
    "slug": "economic-ac-import",
    "titleAr": "استيراد أجهزة تكييف اقتصادية",
    "titleEn": "Imported Energy-Efficient AC Units",
    "shortDescAr": "عرض وتوفير أجهزة التكييف المستوردة الاقتصادية بنظام الإنفرتر المتطورة.",
    "shortDescEn": "Import and distribution of cutting-edge, power-efficient inverter ACs.",
    "descAr": "نوفر أجهزة تكييف حديثة موفرة للطاقة ومناسبة للعمل على أنظمة الطاقة الشمسية ومولدات الكهرباء في اليمن مع توفير الضمان والقطع.",
    "descEn": "Modern, high-efficiency inverter air conditioners optimized for solar power and generators in Yemen with local warranty.",
    "iconName": "Zap",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "متوافقة مع أنظمة الطاقة الشمسية (Solar Ready)",
      "توفير فائق في استهلاك التيار الكهربائي",
      "غاز تبريد صديق للبيئة (R410A / R32)",
      "ضمان رسمي ودعم فني متواصل"
    ],
    "featuresEn": [
      "Solar energy compatible",
      "Low starting current & high SEER rating",
      "Eco-friendly R410A / R32 refrigerants",
      "Official warranty and after-sales support"
    ],
    "isFeatured": true,
    "isActive": true,
    "order": 14
  },
  {
    "id": "srv-15",
    "slug": "spare-parts-sales",
    "titleAr": "بيع قطع الغيار الأصلية",
    "titleEn": "Genuine Spare Parts Sales",
    "shortDescAr": "قطع غيار أصلية ومضمونة لجميع منظومات التكييف والتبريد.",
    "shortDescEn": "Certified genuine spare parts and components for AC and refrigeration.",
    "descAr": "توفير الضواغط (Compressors)، المراوح، المكثفات، المحابس، حساسات الحرارة، والكرات الإلكترونية من مصادر موثوقة ومضمونة.",
    "descEn": "Supply of compressors, condenser fans, expansion valves, thermostats, and circuit boards from verified manufacturers.",
    "iconName": "Cog",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "قطع أصلية ومطابقة لمواصفات المصنع",
      "فحص الجودة قبل التسليم للعميل",
      "توفر قطع لمختلف العلامات التجارية",
      "استشارات هندسية لاختيار القطعة الأنسب"
    ],
    "featuresEn": [
      "Certified factory-spec replacement parts",
      "Pre-delivery quality testing",
      "Compatibility across leading brand lines",
      "Engineering guidance on part matching"
    ],
    "isFeatured": false,
    "isActive": true,
    "order": 15
  },
  {
    "id": "srv-16",
    "slug": "hvac-supplies-sales",
    "titleAr": "بيع مستلزمات HVAC والتبريد",
    "titleEn": "HVAC & Refrigeration Materials Supply",
    "shortDescAr": "مستلزمات، أنابيب نحاس، غاز الفريون، ومواد العزل الحراري والأدوات.",
    "shortDescEn": "Essential copper piping, refrigerant gases, insulation, and tooling supplies.",
    "descAr": "توريد أنابيب النحاس عالية الجودة، أسطوانات الفريون الأصلية، عوازل الأرمفلكس، مواد تثبيت الدكت، وأدوات الفنيين المتخصصة.",
    "descEn": "Wholesale and retail supply of copper coils, certified refrigerant cylinders, Armaflex insulation, and specialized HVAC tools.",
    "iconName": "Package",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "أنابيب نحاس بمقاسات وسماكات مختلفة",
      "أسطوانات فريون نقية ومضمونة بدون شوائب",
      "عوازل حرارية ومواد شريط ألومنيوم مقاومة",
      "أدوات ومقاييس فنية متخصصة"
    ],
    "featuresEn": [
      "Multi-gauge refrigeration grade copper coils",
      "High-purity virgin refrigerant canisters",
      "Industrial thermal insulation foams & tapes",
      "Specialist manifold gauges & vacuum pumps"
    ],
    "isFeatured": false,
    "isActive": true,
    "order": 16
  },
  {
    "id": "srv-17",
    "slug": "used-equipment-sales",
    "titleAr": "بيع الأجهزة والمعدات المستعملة",
    "titleEn": "Inspected Used Equipment & Systems",
    "shortDescAr": "قسم خاص بالمعدات والأجهزة المستعملة المفحوصة والمضمونة هندسياً.",
    "shortDescEn": "Engineered, inspected, and certified pre-owned cooling units and equipment.",
    "descAr": "أجهزة تكييف ومعدات تبريد مستعملة خضعت لفحص فني شامل وإعادة تأهيل هندسي لضمان كفاءتها، مع بيان حالتها بشفافية تامة.",
    "descEn": "Refurbished and certified pre-owned AC and cooling equipment rigorously tested by our engineers with honest condition reporting.",
    "iconName": "RefreshCw",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "فحص هندسي شامل للكمبروسر والدارة الكهربائية",
      "اختبار الضغط والتبريد الفعلي تحت الحمل",
      "توضيح حالة المنتج وسنة الصنع بشفافية",
      "أسعار اقتصادية وضمان تجريبي"
    ],
    "featuresEn": [
      "Comprehensive mechanical & compressor inspection",
      "Operational load testing in workshop",
      "Transparent reporting of condition & specs",
      "Cost-effective solutions with trial warranty"
    ],
    "isFeatured": true,
    "isActive": true,
    "order": 17
  },
  {
    "id": "srv-water-refrigeration",
    "slug": "water-bottles-cartons-central-freezing",
    "titleAr": "تركيب ثلاجات مركزية لتجميد وتبريد قوارير وكراتين المياه",
    "titleEn": "Central Refrigeration for Water Bottles & Cartons Freezing",
    "category": "أنظمة التبريد والتجميد المركزي",
    "shortDescAr": "تصميم وبناء ثلاجات ومستودعات تبريد وتجميد مركزية متطورة لتجميد وحفظ كراتين وقوارير مياه الشرب الصحية بأعلى كفاءة وسرعة تبريد.",
    "shortDescEn": "Design and execution of industrial cold storage and blast freezers for bottled water cartons and processing plants.",
    "descAr": "حلول هندسية متكاملة لقطاع مصانع ومستودعات مياه الشرب ومراكز التوزيع، تشمل حساب الأحمال الحرارية، توريد وحدات التكثيف والمبخرات فائقة التحمل، وتجهيز غرف ساندوتش بانل عازلة لضمان تجميد وتبريد سريع لكراتين المياه بأقل استهلاك كهربائي بفضل تقنية الإنفرتر.",
    "descEn": "Comprehensive turnkey cooling systems for drinking water factories and distribution depots, engineered with heavy-duty condensing units and insulated panels.",
    "iconName": "Droplets",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "تبريد وتجميد سريع لكراتين وقوارير الماء",
      "عوازل ساندوتش بانل بضغط وكثافة عالية",
      "أنظمة تحكم رقمية ومراقبة درجات الحرارة عن بعد",
      "كفاءة استهلاك طاقة عالية بنظام الإنفرتر"
    ],
    "featuresEn": [
      "Rapid cooling for bottled water packaging",
      "High-density polyurethane insulated panels",
      "Precision digital thermostat & remote monitoring",
      "Energy-efficient inverter compressor technology"
    ],
    "isFeatured": true,
    "isActive": true,
    "order": 4
  },
  {
    "id": "srv-poultry-meat-coldrooms",
    "slug": "poultry-meat-cold-storage-freezers",
    "titleAr": "تركيب ثلاجات ومستودعات تجميد اللحوم والدواجن",
    "titleEn": "Poultry, Meat & Food Central Blast Freezers & Cold Storage",
    "category": "أنظمة التبريد والتجميد المركزي",
    "shortDescAr": "تنفيذ غرف ومستودعات التجميد العميق (Blast Freezers) لحفظ وتجميد الدواجن، اللحوم، والأسماك بدرجات حرارة تصل إلى -25°C.",
    "shortDescEn": "Execution of blast freezing facilities and cold warehouses for poultry, meats, and perishables down to -25°C.",
    "descAr": "متخصصون في إنشاء وتشغيل ثلاجات ومسالخ ومستودعات حفظ وتجميد الدواجن واللحوم الكبرى، مع تركيب مبخرات وضواغط تبريد صناعية فائقة التحمل، ونظم إحكام حراري تمنع البكتيريا وتطابق أعلى المعايير الصحية العالمية لسلامة الغذاء.",
    "descEn": "Specialized construction of deep blast freezers and storage hubs for poultry and meat industries meeting strict international food safety standards.",
    "iconName": "Utensils",
    "image": "/images/panel-cover.jpg",
    "featuresAr": [
      "تجميد عميق فائق السرعة حتى -25 مئوية",
      "ضواغط ومبخرات صناعية للخدمة الشاقة",
      "مطابقة لاشتراطات ومعايير سلامة الأغذية والصحة",
      "أبواب تبريد محكمة لمنع الهدر الحراري"
    ],
    "featuresEn": [
      "Deep blast freezing down to -25°C",
      "Heavy-duty industrial coils and compressors",
      "Food-grade certified hygienic construction",
      "Hermetic freezer doors preventing thermal loss"
    ],
    "isFeatured": true,
    "isActive": true,
    "order": 5
  }
];
