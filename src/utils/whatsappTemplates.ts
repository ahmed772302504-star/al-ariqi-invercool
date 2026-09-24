/**
 * AL-ARRIQI INVERCOOL - WhatsApp Dynamic Message Templates Utility
 * Generates pre-filled, highly structured WhatsApp messages for HVAC & Refrigeration service requests.
 */

export const INVERCOOL_PRIMARY_PHONE = '967770931413';
export const INVERCOOL_FORMATTED_PHONE = '770931413';

export type WhatsAppServiceType =
  | 'quote'         // Request a Quote / طلب عرض سعر
  | 'technician'    // Book a Technician / حجز فني ميداني
  | 'maintenance'   // Periodic Maintenance / صيانة وقائية
  | 'emergency'     // Critical Breakdown 24/7 / طوارئ وأعطال حرجة
  | 'product'       // Product or Spare Part Inquiry / استفسار عن منتج
  | 'consultation'  // Engineering Design Consultation / استشارة هندسية
  | 'general';      // General Direct Inquiry / استفسار عام

export type RequestUrgency = 'normal' | 'urgent' | 'emergency';

export interface WhatsAppTemplateOptions {
  type: WhatsAppServiceType;
  lang?: 'ar' | 'en';
  phoneNumber?: string;
  customerName?: string;
  phone?: string;
  city?: string;
  projectType?: string;
  equipmentType?: string;
  issueDescription?: string;
  details?: string;
  referenceNumber?: string;
  preferredTime?: string;
  urgency?: RequestUrgency;
  productName?: string;
  quantity?: number | string;
}

export interface WhatsAppPreset {
  id: WhatsAppServiceType;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  badgeAr?: string;
  badgeEn?: string;
  iconName: 'file-text' | 'wrench' | 'alert-triangle' | 'shield-check' | 'package' | 'message-square' | 'compass';
}

export const WHATSAPP_PRESETS: WhatsAppPreset[] = [
  {
    id: 'quote',
    titleAr: 'طلب عرض سعر',
    titleEn: 'Request a Quote',
    descAr: 'دراسة هندسية وتوريد تكييف مركزي وغرف تبريد',
    descEn: 'HVAC & cold storage supply & installation estimate',
    badgeAr: 'مشاريع وتوريد',
    badgeEn: 'Projects',
    iconName: 'file-text',
  },
  {
    id: 'technician',
    titleAr: 'حجز فني صيانة',
    titleEn: 'Book a Technician',
    descAr: 'زيارة ميدانية سريعة للفحص والمعاينة والإصلاح',
    descEn: 'On-site diagnostics and troubleshooting visit',
    badgeAr: 'زيارة ميدانية',
    badgeEn: 'On-site Visit',
    iconName: 'wrench',
  },
  {
    id: 'emergency',
    titleAr: 'طوارئ تبريد 24/7',
    titleEn: '24/7 Emergency',
    descAr: 'تدخل عاجل لأعطال غرف التجميد والأنظمة الحساسة',
    descEn: 'Rapid response for critical cold store failures',
    badgeAr: 'طارئ وفوري',
    badgeEn: 'Urgent',
    iconName: 'alert-triangle',
  },
  {
    id: 'maintenance',
    titleAr: 'صيانة دورية وغسيل',
    titleEn: 'Periodic Service',
    descAr: 'فحص فريون وتنظيف وتأهيل الوحدات قبل الموسم',
    descEn: 'Pre-season coil wash, gas leak check & tune-up',
    badgeAr: 'وقائية',
    badgeEn: 'Preventive',
    iconName: 'shield-check',
  },
  {
    id: 'product',
    titleAr: 'استفسار عن منتج',
    titleEn: 'Product Inquiry',
    descAr: 'مكيفات، كمبروسرات بيترز، عوازل وقطع غيار',
    descEn: 'Air conditioners, Bitzer compressors & spare parts',
    badgeAr: 'مبيعات',
    badgeEn: 'Sales',
    iconName: 'package',
  },
  {
    id: 'general',
    titleAr: 'محادثة سريعة مباشرة',
    titleEn: 'General Inquiry',
    descAr: 'تواصل مباشر مع مهندسي خدمة العملاء',
    descEn: 'Direct conversation with our support engineers',
    badgeAr: 'خدمة العملاء',
    badgeEn: 'Support',
    iconName: 'message-square',
  },
];

/**
 * Normalizes phone numbers to pure international digits suitable for wa.me URL
 */
export function formatWhatsAppPhone(phone?: string): string {
  if (!phone) return INVERCOOL_PRIMARY_PHONE;
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('967')) return cleaned;
  if (cleaned.startsWith('00967')) return cleaned.slice(2);
  if (cleaned.length === 9 && cleaned.startsWith('7')) return `967${cleaned}`;
  return cleaned || INVERCOOL_PRIMARY_PHONE;
}

/**
 * Dynamically generates a pre-filled, formatted WhatsApp text message.
 */
export function generateWhatsAppMessage(
  optionsOrType: WhatsAppTemplateOptions | WhatsAppServiceType,
  overrideLang?: 'ar' | 'en'
): string {
  const options: WhatsAppTemplateOptions =
    typeof optionsOrType === 'string' ? { type: optionsOrType } : optionsOrType;

  const lang = overrideLang || options.lang || 'ar';
  const isAr = lang === 'ar';

  switch (options.type) {
    case 'quote': {
      if (isAr) {
        const parts = [
          'السلام عليكم ورحمة الله وبركاته',
          'شركة العريقي إنفركول للتكييف والتبريد المركزي',
          '',
          '📋 *طلب عرض سعر جديد (Request a Quote)*',
          '───────────────────',
          `• *نوع المشروع:* ${options.projectType || 'تكييف مركزي / غرف تبريد وتجميد'}`,
          `• *المدينة / الموقع:* ${options.city || 'اليمن'}`,
          `• *المطلوب:* ${options.details || 'دراسة فنية، توريد وتركيب مع جدول كميات وعرض سعر'}`,
        ];
        if (options.referenceNumber) parts.push(`• *رقم المرجع:* ${options.referenceNumber}`);
        if (options.customerName) parts.push(`• *العميل / المنشأة:* ${options.customerName}`);
        if (options.phone) parts.push(`• *رقم الاتصال:* ${options.phone}`);
        parts.push(
          '───────────────────',
          'نرجو تزويدنا بالعرض الفني والمالي والمدة الزمنية المقترحة للتنفيذ. شكراً لكم.'
        );
        return parts.join('\n');
      } else {
        const parts = [
          'Hello AL-ARRIQI INVERCOOL Team,',
          '',
          '📋 *New Quote Request (Request a Quote)*',
          '───────────────────',
          `• *Project Type:* ${options.projectType || 'Central HVAC / Cold Storage System'}`,
          `• *Location / City:* ${options.city || 'Yemen'}`,
          `• *Scope & Details:* ${options.details || 'Engineering study, supply & installation proposal'}`,
        ];
        if (options.referenceNumber) parts.push(`• *Reference #:* ${options.referenceNumber}`);
        if (options.customerName) parts.push(`• *Customer / Org:* ${options.customerName}`);
        if (options.phone) parts.push(`• *Contact Phone:* ${options.phone}`);
        parts.push(
          '───────────────────',
          'Please share a technical and commercial quotation with an estimated lead time. Thank you.'
        );
        return parts.join('\n');
      }
    }

    case 'technician': {
      if (isAr) {
        const urgencyLabel =
          options.urgency === 'emergency'
            ? '🚨 طارئ جداً (حالة توقف حرج)'
            : options.urgency === 'urgent'
            ? '⚡ عاجل (اليوم)'
            : 'عادي (أقرب موعد متاح)';

        const parts = [
          'السلام عليكم ورحمة الله وبركاته',
          'مركز الصيانة والتشغيل - العريقي إنفركول',
          '',
          '🔧 *طلب حجز فني ميداني (Book a Technician)*',
          '───────────────────',
          `• *طبيعة العطل / المطلوب:* ${options.issueDescription || options.details || 'طلب زيارة فني للفحص والمعاينة الميدانية وإصلاح العطل'}`,
          `• *نوع الجهاز أو النظام:* ${options.equipmentType || 'مكيف / وحدة تبريد'}`,
          `• *درجة الاستعجال:* ${urgencyLabel}`,
          `• *موقع الزيارة / المدينة:* ${options.city || 'اليمن'}`,
        ];
        if (options.preferredTime) parts.push(`• *الموعد المفضل:* ${options.preferredTime}`);
        if (options.referenceNumber) parts.push(`• *رقم البلاغ:* ${options.referenceNumber}`);
        if (options.customerName) parts.push(`• *اسم العميل:* ${options.customerName}`);
        if (options.phone) parts.push(`• *رقم الهاتف:* ${options.phone}`);
        parts.push(
          '───────────────────',
          'يرجى تأكيد موعد وصول الفني المختص. شكراً لتعاونكم.'
        );
        return parts.join('\n');
      } else {
        const urgencyLabel =
          options.urgency === 'emergency'
            ? '🚨 Immediate Emergency'
            : options.urgency === 'urgent'
            ? '⚡ Urgent (Today)'
            : 'Standard (Earliest slot)';

        const parts = [
          'Hello AL-ARRIQI INVERCOOL Support,',
          '',
          '🔧 *Book a Field Technician (Service Visit)*',
          '───────────────────',
          `• *Issue / Request:* ${options.issueDescription || options.details || 'On-site diagnostics and system repair visit'}`,
          `• *Equipment Type:* ${options.equipmentType || 'HVAC / Cooling Unit'}`,
          `• *Priority Level:* ${urgencyLabel}`,
          `• *Location / City:* ${options.city || 'Yemen'}`,
        ];
        if (options.preferredTime) parts.push(`• *Preferred Time:* ${options.preferredTime}`);
        if (options.referenceNumber) parts.push(`• *Booking Ref #:* ${options.referenceNumber}`);
        if (options.customerName) parts.push(`• *Client:* ${options.customerName}`);
        if (options.phone) parts.push(`• *Contact Phone:* ${options.phone}`);
        parts.push(
          '───────────────────',
          'Please confirm the technician dispatch and estimated arrival time.'
        );
        return parts.join('\n');
      }
    }

    case 'emergency': {
      if (isAr) {
        const parts = [
          '🚨 *بلاغ طوارئ تبريد عاجل 24/7 (Emergency Service)*',
          '───────────────────',
          'السلام عليكم، لدينا عطل حرج يتطلب تدخلاً هندسياً فورياً:',
          `• *وصف العطل:* ${options.issueDescription || options.details || 'توقف مفاجئ في منظومة التبريد والتجميد وارتفاع خطير بدرجات الحرارة'}`,
          `• *نوع المعدة:* ${options.equipmentType || 'غرفة تبريد / شيلر / وحدة تبريد مركزية'}`,
          `• *الموقع:* ${options.city || 'اليمن'}`,
        ];
        if (options.customerName) parts.push(`• *المسؤول في الموقع:* ${options.customerName}`);
        if (options.phone) parts.push(`• *هاتف الطوارئ:* ${options.phone}`);
        parts.push(
          '───────────────────',
          'نرجو توجيه أقرب فريق طوارئ فوراً لتفادي تلف المواد المخزنة.'
        );
        return parts.join('\n');
      } else {
        const parts = [
          '🚨 *24/7 Cooling Emergency Breakdown*',
          '───────────────────',
          'Urgent breakdown requiring immediate on-site intervention:',
          `• *Issue:* ${options.issueDescription || options.details || 'Refrigeration failure & rapid temperature rise in cold room'}`,
          `• *Equipment:* ${options.equipmentType || 'Cold Storage / Chiller / Central Plant'}`,
          `• *Location:* ${options.city || 'Yemen'}`,
        ];
        if (options.customerName) parts.push(`• *On-Site Contact:* ${options.customerName}`);
        if (options.phone) parts.push(`• *Emergency Phone:* ${options.phone}`);
        parts.push(
          '───────────────────',
          'Please dispatch the nearest emergency technician immediately.'
        );
        return parts.join('\n');
      }
    }

    case 'maintenance': {
      if (isAr) {
        const parts = [
          'السلام عليكم ورحمة الله وبركاته',
          'قسم الصيانة الوقائية - العريقي إنفركول',
          '',
          '🛠️ *طلب صيانة وقائية وفحص دوري (Maintenance)*',
          '───────────────────',
          `• *الخدمة المطلوبة:* ${options.details || 'فحص شحنة الفريون، غسيل كويلات، فحص لوحات التحكم وضبط كفاءة التبريد'}`,
          `• *النظام:* ${options.equipmentType || 'مكيفات مركزية / غرف تبريد'}`,
          `• *المدينة:* ${options.city || 'اليمن'}`,
        ];
        if (options.referenceNumber) parts.push(`• *رقم الطلب:* ${options.referenceNumber}`);
        if (options.customerName) parts.push(`• *العميل:* ${options.customerName}`);
        parts.push(
          '───────────────────',
          'نرجو التكرم بجدولة زيارة الصيانة وإبلاغنا بالموعد المحدد.'
        );
        return parts.join('\n');
      } else {
        const parts = [
          'Hello AL-ARRIQI INVERCOOL Maintenance Dept,',
          '',
          '🛠️ *Preventive Maintenance Request*',
          '───────────────────',
          `• *Requested Service:* ${options.details || 'Refrigerant pressure test, coil cleaning, electrical inspection & tune-up'}`,
          `• *Equipment:* ${options.equipmentType || 'Central HVAC / Cold Storage'}`,
          `• *City:* ${options.city || 'Yemen'}`,
        ];
        if (options.referenceNumber) parts.push(`• *Request #:* ${options.referenceNumber}`);
        if (options.customerName) parts.push(`• *Client:* ${options.customerName}`);
        parts.push(
          '───────────────────',
          'Please schedule our preventive maintenance visit.'
        );
        return parts.join('\n');
      }
    }

    case 'product': {
      if (isAr) {
        const parts = [
          'السلام عليكم ورحمة الله وبركاته',
          'إدارة المبيعات - العريقي إنفركول',
          '',
          '📦 *استفسار عن منتج أو قطع غيار (Product Inquiry)*',
          '───────────────────',
          `• *المنتج المطلوب:* ${options.productName || 'مكيف / ضاغط تبريد / قطع غيار أصلية'}`,
        ];
        if (options.quantity) parts.push(`• *الكمية:* ${options.quantity}`);
        if (options.details) parts.push(`• *المواصفات المطلوبة:* ${options.details}`);
        if (options.customerName) parts.push(`• *اسم المستفسر:* ${options.customerName}`);
        parts.push(
          '───────────────────',
          'أرجو إفادتي بالسعر والضمان وموعد التوريد المتاح في اليمن.'
        );
        return parts.join('\n');
      } else {
        const parts = [
          'Hello AL-ARRIQI INVERCOOL Sales,',
          '',
          '📦 *Product / Equipment Inquiry*',
          '───────────────────',
          `• *Requested Item:* ${options.productName || 'HVAC unit / Compressor / Genuine Spare Parts'}`,
        ];
        if (options.quantity) parts.push(`• *Quantity:* ${options.quantity}`);
        if (options.details) parts.push(`• *Specifications:* ${options.details}`);
        if (options.customerName) parts.push(`• *Contact Name:* ${options.customerName}`);
        parts.push(
          '───────────────────',
          'Please provide price, warranty details, and availability in Yemen.'
        );
        return parts.join('\n');
      }
    }

    case 'consultation': {
      if (isAr) {
        return [
          'السلام عليكم ورحمة الله وبركاته',
          'المكتب الاستشاري الهندسي - العريقي إنفركول',
          '',
          '📐 *طلب استشارة وتصميم منظومة تبريد وتكييف*',
          '───────────────────',
          `• *نوع المشروع:* ${options.projectType || 'مبنى تجاري / مستودع أغذية / مصنع'}`,
          `• *الموقع:* ${options.city || 'اليمن'}`,
          `• *تفاصيل الاستشارة:* ${options.details || 'دراسة الأحمال الحرارية، واقتراح المنظومة الأنسب كفاءة واستهلاكاً للطاقة'}`,
          '───────────────────',
          'نود ترتيب موعد استشارة مع مهندسيكم المعتمدين.',
        ].join('\n');
      } else {
        return [
          'Hello AL-ARRIQI INVERCOOL Engineering Team,',
          '',
          '📐 *HVAC & Refrigeration Engineering Consultation*',
          '───────────────────',
          `• *Project Type:* ${options.projectType || 'Commercial Building / Food Warehouse / Industrial Plant'}`,
          `• *Location:* ${options.city || 'Yemen'}`,
          `• *Consultation Scope:* ${options.details || 'Thermal load calculations and energy-efficient system selection'}`,
          '───────────────────',
          'We would like to arrange a consultation session with your technical specialists.',
        ].join('\n');
      }
    }

    case 'general':
    default: {
      if (isAr) {
        return (
          `السلام عليكم ورحمة الله وبركاته\n` +
          `شركة العريقي إنفركول للتكييف والتبريد\n` +
          (options.customerName ? `أنا ${options.customerName}، ` : '') +
          `أود الاستفسار عن خدمات وحلول التكييف وغرف التبريد المتاحة لديكم في اليمن.`
        );
      } else {
        return (
          `Hello AL-ARRIQI INVERCOOL Team,\n` +
          (options.customerName ? `My name is ${options.customerName}. ` : '') +
          `I would like to inquire about your HVAC, refrigeration, and cold storage solutions in Yemen.`
        );
      }
    }
  }
}

/**
 * Dynamically builds a full WhatsApp URL (wa.me) with URL-encoded pre-filled message text.
 */
export function generateWhatsAppUrl(
  optionsOrType: WhatsAppTemplateOptions | WhatsAppServiceType,
  phoneNumber?: string,
  overrideLang?: 'ar' | 'en'
): string {
  const options: WhatsAppTemplateOptions =
    typeof optionsOrType === 'string' ? { type: optionsOrType } : optionsOrType;

  const phone = formatWhatsAppPhone(phoneNumber || options.phoneNumber);
  const message = generateWhatsAppMessage(options, overrideLang);
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

/**
 * Returns preset metadata for a given service type
 */
export function getWhatsAppPreset(type: WhatsAppServiceType): WhatsAppPreset {
  return (
    WHATSAPP_PRESETS.find((p) => p.id === type) ||
    WHATSAPP_PRESETS[WHATSAPP_PRESETS.length - 1]
  );
}
