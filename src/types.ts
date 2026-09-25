export type Language = 'ar' | 'en';

export interface SubService {
  id: string;
  titleAr: string;
  titleEn?: string;
  descAr?: string;
  descEn?: string;
  iconName?: string;
  badgeAr?: string;
  badgeEn?: string;
  featuresAr?: string[];
  featuresEn?: string[];
}

export interface Service {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  shortDescAr: string;
  shortDescEn: string;
  descAr: string;
  descEn: string;
  contentAr?: string;
  contentEn?: string;
  category?: string;
  icon?: string;
  iconName: string;
  image: string;
  videoUrl?: string;
  featuresAr: string[];
  featuresEn: string[];
  benefitsAr?: string[];
  benefitsEn?: string[];
  linkedProjects?: string[];
  subServices?: SubService[];
  isFeatured: boolean;
  isActive: boolean;
  order: number;
}

export type ProductCondition = 'new' | 'used' | 'used_clean';
export type ProductStatus = 'available' | 'reserved' | 'sold' | 'out_of_stock';

export interface Product {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  category: string;
  brand?: string;
  model?: string;
  capacity?: string;
  descAr: string;
  descEn: string;
  specifications: Record<string, string>;
  condition: ProductCondition;
  status: ProductStatus;
  price?: number;
  showPrice: boolean;
  mainImage: string;
  additionalImages: string[];
  isFeatured: boolean;
  isImportedEconomy: boolean;
  energyConsumption?: string;
  warranty?: string;
  accessories?: string;
  manufacturingYear?: string;
  notes?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  clientName?: string;
  clientNameAr?: string;
  clientNameEn?: string;
  governate: string;
  city: string;
  category: string;
  clientType: 'hospital' | 'hotel' | 'company' | 'commercial' | 'industrial' | 'residential' | 'other';
  descAr: string;
  descEn: string;
  servicesProvidedAr: string[];
  servicesProvidedEn: string[];
  executionDate?: string;
  systemsUsed?: string;
  images: string[];
  videoUrl?: string;
  linkedServices?: string[];
  isFeatured: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  titleAr: string;
  titleEn: string;
  category: string;
  serviceId?: string;       // المعرف الخاص بالقسم / الخدمة التابعة له
  serviceSlug?: string;     // رابط الخدمة مثل ac-repair-maintenance
  clientName?: string;      // اسم العميل / المنشأة
  clientNameAr?: string;
  clientNameEn?: string;
  location?: string;        // المحافظة / المدينة (مثل: صنعاء، إب، الحديدة، عدن)
  city?: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  images?: string[];        // معرض صور متعدد لنفس العمل (Multi-image portfolio)
  videoUrl?: string;        // مقطع فيديو مرفق للعمل (YouTube أو رابط مباشر)
  descriptionAr?: string;
  descriptionEn?: string;
  captionAr?: string;       // نص توضيحي / وصف مصاحب للعمل المعروض
  captionEn?: string;
  order?: number;
  createdAt: string;
}

export interface Review {
  id: string;
  clientName: string;
  city: string;
  rating: number; // 1-5
  textAr: string;
  textEn?: string;
  clientPhoto?: string;
  videoUrl?: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export type MaintenanceStatus =
  | 'received'             // تم استلام الطلب
  | 'under_review'          // قيد المراجعة
  | 'appointment_scheduled' // تم تحديد الموعد
  | 'technician_assigned'   // تم تعيين الفني
  | 'in_progress'           // جاري التنفيذ
  | 'completed'             // مكتمل
  | 'cancelled';            // ملغي

export interface MaintenanceRequest {
  id: string;
  requestNumber: string;
  clientName: string;
  phone: string;
  governate: string;
  city: string;
  serviceType: string;
  equipmentType: string;
  problemDesc: string;
  priority: 'normal' | 'urgent' | 'emergency';
  images: string[];
  videoUrl?: string;
  status: MaintenanceStatus;
  notes?: string;
  adminNotes?: string;
  technicianName?: string;
  appointmentDate?: string;
  cost?: number;
  sparePartsUsed?: string;
  beforeImages?: string[];
  afterImages?: string[];
  technicianNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteRequest {
  id: string;
  requestNumber: string;
  clientName: string;
  companyName?: string;
  phone: string;
  governate: string;
  city: string;
  projectType: string;
  requiredSystem: string;
  projectDesc: string;
  projectArea?: string;
  unitsCount?: string;
  files?: string[];
  notes?: string;
  status: 'new' | 'reviewed' | 'quoted' | 'closed';
  quoteAmount?: number;
  adminNotes?: string;
  createdAt: string;
}

export interface TechnicianRequest {
  id: string;
  requestNumber: string;
  clientName: string;
  phone: string;
  governate: string;
  city: string;
  locationDetails?: string;
  equipmentType: string;
  malfunctionType: string;
  problemDesc: string;
  images: string[];
  preferredVisitTime: string;
  status: 'new' | 'assigned' | 'completed' | 'cancelled';
  technicianName?: string;
  adminNotes?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'maintenance' | 'quote' | 'technician' | 'contact';
  linkUrl: string;
  isRead: boolean;
  createdAt: string;
}

export interface SiteSettings {
  companyNameAr: string;
  companyNameEn: string;
  brandNameAr?: string;
  brandNameEn?: string;
  companyPhone?: string;
  taglineAr: string;
  taglineEn: string;
  phone: string;
  whatsapp: string;
  phonePrimary?: string;
  phoneSecondary?: string;
  whatsappPrimary?: string;
  developerNameAr?: string;
  facebookUrl: string;
  email: string;
  addressAr: string;
  addressEn: string;
  workHoursAr: string;
  workHoursEn: string;
  developerName: string;
  developerPhone1: string;
  developerPhone2: string;
  heroTitleAr: string;
  heroTitleEn: string;
  heroSubtitleAr: string;
  heroSubtitleEn: string;
  heroDescAr: string;
  heroDescEn: string;
  aboutDescAr: string;
  aboutDescEn: string;
  whyUs: Array<{
    icon: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
  }>;
  governatesCovered: string[];
  logoUrl?: string;
  logoIconUrl?: string;
  watermarkUrl?: string;
  heroBannerUrl?: string;
  aboutImageUrl?: string;
  updatedAt?: number;
  logoUpdatedAt?: number;
  // Section Interface Images
  hvacSectionImageUrl?: string; // صورة واجهة خدمات التكييف والتثليج المركزي
  commercialAircoolImageUrl?: string; // صورة واجهة التكييف المركزي والمباني
  coldRoomsImageUrl?: string; // صورة واجهة غرف ومخازن التبريد الكبرى
  maintenanceSectionImageUrl?: string; // صورة واجهة ورش الصيانة والتشخيص
  emergencySupportImageUrl?: string; // صورة واجهة الدعم الفني والطوارئ
  productsCatalogImageUrl?: string; // صورة واجهة كتالوج المنتجات
}

export interface FAQItem {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  category: string;
  order: number;
}
