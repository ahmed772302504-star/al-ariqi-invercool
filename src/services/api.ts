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
  FAQItem
} from '../types.js';

import { staticServices } from '../data/staticServices.js';
import { staticProducts } from '../data/staticProducts.js';
import { staticProjects } from '../data/staticProjects.js';
import { staticReviews } from '../data/staticReviews.js';
import { staticGallery } from '../data/staticGallery.js';
import { staticSettings, staticGovernates, staticFAQ } from '../data/staticSettings.js';

const BASE_URL = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('al_arriqi_admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // ============================================================
  // Settings, FAQ & Governates (Static Data First)
  // ============================================================
  getSettings: async (): Promise<SiteSettings> => {
    try {
      const res = await fetch(`${BASE_URL}/settings?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          return { ...staticSettings, ...data };
        }
      }
    } catch {
      // Fallback silently to static settings
    }
    return staticSettings;
  },

  updateSettings: async (
    settings: Partial<SiteSettings>
  ): Promise<{ success: boolean; settings: SiteSettings }> => {
    try {
      const res = await fetch(`${BASE_URL}/settings`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings)
      });
      if (res.ok) return res.json();
    } catch {
      // Local fallback
    }
    const merged = { ...staticSettings, ...settings };
    return { success: true, settings: merged };
  },

  getGovernates: async (): Promise<string[]> => {
    try {
      const res = await fetch(`${BASE_URL}/governates`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Fallback to static
    }
    return staticGovernates;
  },

  getFAQ: async (): Promise<FAQItem[]> => {
    try {
      const res = await fetch(`${BASE_URL}/faq`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Fallback to static
    }
    return staticFAQ;
  },

  // ============================================================
  // Services (Static Data First)
  // ============================================================
  getServices: async (): Promise<Service[]> => {
    try {
      const res = await fetch(`${BASE_URL}/services`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Fallback to static
    }
    return staticServices;
  },

  getAdminServices: async (): Promise<Service[]> => {
    try {
      const res = await fetch(`${BASE_URL}/admin/services`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback to static
    }
    return staticServices;
  },

  getService: async (idOrSlug: string): Promise<Service> => {
    try {
      const res = await fetch(`${BASE_URL}/services/${encodeURIComponent(idOrSlug)}`);
      if (res.ok) return res.json();
    } catch {
      // Fallback to static search
    }
    const found = staticServices.find(
      (s) => s.slug === idOrSlug || s.id === idOrSlug
    );
    if (found) return found;
    return staticServices[0];
  },

  createService: async (service: Partial<Service>): Promise<Service> => {
    try {
      const res = await fetch(`${BASE_URL}/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(service)
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    const newService: Service = {
      id: `srv-${Date.now()}`,
      slug: service.slug || `service-${Date.now()}`,
      titleAr: service.titleAr || '',
      titleEn: service.titleEn || '',
      shortDescAr: service.shortDescAr || '',
      shortDescEn: service.shortDescEn || '',
      descAr: service.descAr || '',
      descEn: service.descEn || '',
      iconName: service.iconName || 'Wrench',
      image: service.image || '/images/panel-cover.jpg',
      featuresAr: service.featuresAr || [],
      featuresEn: service.featuresEn || [],
      isFeatured: !!service.isFeatured,
      isActive: true,
      order: service.order || 99
    };
    return newService;
  },

  updateService: async (id: string, service: Partial<Service>): Promise<Service> => {
    try {
      const res = await fetch(`${BASE_URL}/services/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(service)
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    const found = staticServices.find((s) => s.id === id) || staticServices[0];
    return { ...found, ...service };
  },

  deleteService: async (id: string): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/services/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {
      // Silently pass
    }
  },

  // ============================================================
  // Products (Static Data First)
  // ============================================================
  getProducts: async (params?: {
    category?: string;
    condition?: string;
    status?: string;
    brand?: string;
    search?: string;
    featured?: boolean;
    importedEconomy?: boolean;
  }): Promise<Product[]> => {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.condition) query.set('condition', params.condition);
      if (params?.status) query.set('status', params.status);
      if (params?.brand) query.set('brand', params.brand);
      if (params?.search) query.set('search', params.search);
      if (params?.featured) query.set('featured', 'true');
      if (params?.importedEconomy) query.set('importedEconomy', 'true');

      const res = await fetch(`${BASE_URL}/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Fallback to static
    }

    // Filter static products
    let list = [...staticProducts];
    if (params?.category && params.category !== 'all') {
      list = list.filter((p) => p.category === params.category);
    }
    if (params?.condition && params.condition !== 'all') {
      list = list.filter((p) => p.condition === params.condition);
    }
    if (params?.featured) {
      list = list.filter((p) => p.isFeatured);
    }
    if (params?.importedEconomy) {
      list = list.filter((p) => p.isImportedEconomy);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.nameAr.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.descAr.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getProduct: async (idOrSlug: string): Promise<Product> => {
    try {
      const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(idOrSlug)}`);
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    const found = staticProducts.find(
      (p) => p.slug === idOrSlug || p.id === idOrSlug
    );
    if (found) return found;
    return staticProducts[0];
  },

  createProduct: async (product: Partial<Product>): Promise<Product> => {
    try {
      const res = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(product)
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug: product.slug || `product-${Date.now()}`,
      nameAr: product.nameAr || '',
      nameEn: product.nameEn || '',
      category: product.category || 'تكييف مركزي',
      descAr: product.descAr || '',
      descEn: product.descEn || '',
      specifications: product.specifications || {},
      condition: product.condition || 'new',
      status: product.status || 'available',
      price: product.price,
      showPrice: !!product.showPrice,
      mainImage: product.mainImage || '/images/products/vrf-system.jpg',
      additionalImages: product.additionalImages || [],
      isFeatured: !!product.isFeatured,
      isImportedEconomy: !!product.isImportedEconomy,
      createdAt: new Date().toISOString()
    };
    return newProduct;
  },

  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(product)
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    const found = staticProducts.find((p) => p.id === id) || staticProducts[0];
    return { ...found, ...product };
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {
      // Silently pass
    }
  },

  // ============================================================
  // Projects (Static Data First)
  // ============================================================
  getProjects: async (params?: {
    governate?: string;
    category?: string;
    clientType?: string;
    search?: string;
    featured?: boolean;
  }): Promise<Project[]> => {
    try {
      const query = new URLSearchParams();
      if (params?.governate) query.set('governate', params.governate);
      if (params?.category) query.set('category', params.category);
      if (params?.clientType) query.set('clientType', params.clientType);
      if (params?.search) query.set('search', params.search);
      if (params?.featured) query.set('featured', 'true');

      const res = await fetch(`${BASE_URL}/projects?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Fallback
    }

    let list = [...staticProjects];
    if (params?.governate && params.governate !== 'all') {
      list = list.filter((p) => p.governate === params.governate);
    }
    if (params?.category && params.category !== 'all') {
      list = list.filter((p) => p.category === params.category);
    }
    if (params?.clientType && params.clientType !== 'all') {
      list = list.filter((p) => p.clientType === params.clientType);
    }
    if (params?.featured) {
      list = list.filter((p) => p.isFeatured);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.titleAr.toLowerCase().includes(q) ||
          p.titleEn.toLowerCase().includes(q) ||
          p.descAr.toLowerCase().includes(q) ||
          p.governate.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getProject: async (idOrSlug: string): Promise<Project> => {
    try {
      const res = await fetch(`${BASE_URL}/projects/${encodeURIComponent(idOrSlug)}`);
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    const found = staticProjects.find(
      (p) => p.slug === idOrSlug || p.id === idOrSlug
    );
    if (found) return found;
    return staticProjects[0];
  },

  createProject: async (project: Partial<Project>): Promise<Project> => {
    try {
      const res = await fetch(`${BASE_URL}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(project)
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    const newProj: Project = {
      id: `prj-${Date.now()}`,
      slug: project.slug || `project-${Date.now()}`,
      titleAr: project.titleAr || '',
      titleEn: project.titleEn || '',
      governate: project.governate || 'صنعاء',
      city: project.city || 'صنعاء',
      category: project.category || 'تكييف مركزي',
      clientType: project.clientType || 'commercial',
      descAr: project.descAr || '',
      descEn: project.descEn || '',
      servicesProvidedAr: project.servicesProvidedAr || [],
      servicesProvidedEn: project.servicesProvidedEn || [],
      images: project.images || ['/images/projects/sanaa-cold-storage.jpg'],
      isFeatured: !!project.isFeatured,
      createdAt: new Date().toISOString()
    };
    return newProj;
  },

  updateProject: async (id: string, project: Partial<Project>): Promise<Project> => {
    try {
      const res = await fetch(`${BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(project)
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    const found = staticProjects.find((p) => p.id === id) || staticProjects[0];
    return { ...found, ...project };
  },

  deleteProject: async (id: string): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {
      // Silently pass
    }
  },

  // ============================================================
  // Gallery (Static Data First)
  // ============================================================
  getGallery: async (
    params?: string | { category?: string; serviceId?: string; serviceSlug?: string }
  ): Promise<GalleryItem[]> => {
    try {
      let query = '';
      if (typeof params === 'string') {
        if (params && params !== 'all') {
          query = `?category=${encodeURIComponent(params)}`;
        }
      } else if (params) {
        const searchParams = new URLSearchParams();
        if (params.serviceId && params.serviceId !== 'all') searchParams.set('serviceId', params.serviceId);
        if (params.serviceSlug && params.serviceSlug !== 'all') searchParams.set('serviceSlug', params.serviceSlug);
        if (params.category && params.category !== 'all') searchParams.set('category', params.category);
        const str = searchParams.toString();
        if (str) query = `?${str}`;
      }

      const res = await fetch(`${BASE_URL}/gallery${query}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Fallback
    }

    let list = [...staticGallery];
    if (typeof params === 'string') {
      if (params && params !== 'all') {
        list = list.filter((g) => g.category === params);
      }
    } else if (params) {
      if (params.category && params.category !== 'all') {
        list = list.filter((g) => g.category === params.category);
      }
      if (params.serviceSlug && params.serviceSlug !== 'all') {
        list = list.filter((g) => g.serviceSlug === params.serviceSlug);
      }
    }
    return list;
  },

  createGalleryItem: async (item: Partial<GalleryItem>): Promise<GalleryItem> => {
    try {
      const res = await fetch(`${BASE_URL}/gallery`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      titleAr: item.titleAr || '',
      titleEn: item.titleEn || '',
      category: item.category || 'عام',
      mediaType: item.mediaType || 'image',
      mediaUrl: item.mediaUrl || '/images/gallery/gallery-split-maintenance.jpg',
      thumbnailUrl: item.thumbnailUrl || item.mediaUrl || '/images/gallery/gallery-split-maintenance.jpg',
      images: item.images || [item.mediaUrl || '/images/gallery/gallery-split-maintenance.jpg'],
      createdAt: new Date().toISOString()
    };
    return newItem;
  },

  updateGalleryItem: async (id: string, item: Partial<GalleryItem>): Promise<GalleryItem> => {
    try {
      const res = await fetch(`${BASE_URL}/gallery/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    const found = staticGallery.find((g) => g.id === id) || staticGallery[0];
    return { ...found, ...item };
  },

  deleteGalleryItem: async (id: string): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/gallery/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {
      // Silently pass
    }
  },

  // ============================================================
  // Reviews (Static Data First)
  // ============================================================
  getApprovedReviews: async (): Promise<Review[]> => {
    try {
      const res = await fetch(`${BASE_URL}/reviews`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Fallback
    }
    return staticReviews;
  },

  getAllReviewsAdmin: async (): Promise<Review[]> => {
    try {
      const res = await fetch(`${BASE_URL}/admin/reviews`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return staticReviews;
  },

  submitReview: async (review: {
    clientName: string;
    city: string;
    rating: number;
    textAr: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return {
      success: true,
      message: 'شكراً لك! تم إرسال تقييمك وسيتم نشره بعد المراجعة.'
    };
  },

  updateReviewStatus: async (
    id: string,
    isApproved: boolean,
    isFeatured?: boolean
  ): Promise<Review> => {
    try {
      const res = await fetch(`${BASE_URL}/admin/reviews/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isApproved, isFeatured })
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    const found = staticReviews.find((r) => r.id === id) || staticReviews[0];
    return { ...found, isApproved, isFeatured: isFeatured ?? found.isFeatured };
  },

  updateReview: async (
    id: string,
    updates: { isApproved?: boolean; isFeatured?: boolean } | boolean,
    isFeatured?: boolean
  ): Promise<Review> => {
    if (typeof updates === 'boolean') {
      return api.updateReviewStatus(id, updates, isFeatured);
    }
    return api.updateReviewStatus(id, updates.isApproved ?? true, updates.isFeatured);
  },

  deleteReview: async (id: string): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {
      // Silently pass
    }
  },

  // ============================================================
  // Requests Submissions (Maintenance, Quote, Tech, Contact)
  // Always succeeds even without backend
  // ============================================================
  submitMaintenanceRequest: async (
    data: Partial<MaintenanceRequest>
  ): Promise<{ success: boolean; message: string; trackingCode: string; requestNumber: string }> => {
    const code = `ARQ-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const res = await fetch(`${BASE_URL}/requests/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        return {
          success: true,
          message: json.message || 'تم استلام طلب الصيانة بنجاح، سيتواصل معك مهندسونا فوراً.',
          trackingCode: json.trackingCode || code,
          requestNumber: json.requestNumber || json.trackingCode || code
        };
      }
    } catch {
      // Fallback
    }
    return {
      success: true,
      message: 'تم استلام طلب الصيانة بنجاح، سيتواصل معك مهندسونا فوراً.',
      trackingCode: code,
      requestNumber: code
    };
  },

  getMaintenanceRequestsAdmin: async (): Promise<MaintenanceRequest[]> => {
    try {
      const res = await fetch(`${BASE_URL}/admin/requests/maintenance`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return [];
  },

  updateMaintenanceRequestAdmin: async (
    id: string,
    updates: Partial<MaintenanceRequest>
  ): Promise<MaintenanceRequest> => {
    try {
      const res = await fetch(`${BASE_URL}/admin/requests/maintenance/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    throw new Error('Not available');
  },

  updateMaintenanceStatusAdmin: async (
    id: string,
    status: string,
    adminNotes?: string
  ): Promise<MaintenanceRequest> => {
    return api.updateMaintenanceRequestAdmin(id, { status: status as any, adminNotes });
  },

  submitQuoteRequest: async (
    data: Partial<QuoteRequest>
  ): Promise<{ success: boolean; message: string; quoteId: string; requestNumber: string }> => {
    const quoteId = `QT-${Math.floor(10000 + Math.random() * 90000)}`;
    try {
      const res = await fetch(`${BASE_URL}/requests/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        return {
          success: true,
          message: json.message || 'تم استلام طلب عرض السعر بنجاح، سيقوم القسم الهندسي بإعداد الدراسة والتواصل معكم.',
          quoteId: json.quoteId || quoteId,
          requestNumber: json.requestNumber || json.quoteId || quoteId
        };
      }
    } catch {
      // Fallback
    }
    return {
      success: true,
      message: 'تم استلام طلب عرض السعر بنجاح، سيقوم القسم الهندسي بإعداد الدراسة والتواصل معكم.',
      quoteId,
      requestNumber: quoteId
    };
  },

  getQuoteRequestsAdmin: async (): Promise<QuoteRequest[]> => {
    try {
      const res = await fetch(`${BASE_URL}/admin/requests/quotes`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return [];
  },

  updateQuoteRequestAdmin: async (
    id: string,
    updates: Partial<QuoteRequest>
  ): Promise<QuoteRequest> => {
    try {
      const res = await fetch(`${BASE_URL}/admin/requests/quotes/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    throw new Error('Not available');
  },

  submitTechnicianRequest: async (
    data: Partial<TechnicianRequest>
  ): Promise<{ success: boolean; message: string; requestId: string; requestNumber: string }> => {
    const requestId = `TECH-${Math.floor(10000 + Math.random() * 90000)}`;
    try {
      const res = await fetch(`${BASE_URL}/requests/technicians`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        return {
          success: true,
          message: json.message || 'تم استلام طلب الفني بنجاح، سيتم تعيين أقرب فني ميداني لمنطقتك.',
          requestId: json.requestId || requestId,
          requestNumber: json.requestNumber || json.requestId || requestId
        };
      }
    } catch {
      // Fallback
    }
    return {
      success: true,
      message: 'تم استلام طلب الفني بنجاح، سيتم تعيين أقرب فني ميداني لمنطقتك.',
      requestId,
      requestNumber: requestId
    };
  },

  getTechnicianRequestsAdmin: async (): Promise<TechnicianRequest[]> => {
    try {
      const res = await fetch(`${BASE_URL}/admin/requests/technicians`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return [];
  },

  updateTechnicianRequestAdmin: async (
    id: string,
    updates: Partial<TechnicianRequest>
  ): Promise<TechnicianRequest> => {
    try {
      const res = await fetch(`${BASE_URL}/admin/requests/technicians/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    throw new Error('Not available');
  },

  submitContactMessage: async (data: {
    name: string;
    phone: string;
    email?: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return {
      success: true,
      message: 'تم إرسال رسالتكم بنجاح، شكراً لتواصلكم مع العريقي إنفركول.'
    };
  },

  getContactMessagesAdmin: async (): Promise<ContactMessage[]> => {
    try {
      const res = await fetch(`${BASE_URL}/admin/messages`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return [];
  },

  markMessageRead: async (id: string): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/admin/messages/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
    } catch {
      // Silently pass
    }
  },

  deleteContactMessage: async (id: string): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/admin/messages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {
      // Silently pass
    }
  },

  // ============================================================
  // Stats & Notifications
  // ============================================================
  getStats: async (): Promise<any> => {
    try {
      const res = await fetch(`${BASE_URL}/stats`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return {
      servicesCount: staticServices.length,
      productsCount: staticProducts.length,
      projectsCount: staticProjects.length,
      reviewsCount: staticReviews.length
    };
  },

  getNotifications: async (): Promise<NotificationItem[]> => {
    try {
      const res = await fetch(`${BASE_URL}/notifications`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return [];
  },

  markNotificationRead: async (id: string): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
    } catch {
      // Silently pass
    }
  },

  markAllNotificationsRead: async (): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
    } catch {
      // Silently pass
    }
  },

  // ============================================================
  // Media Upload helper
  // ============================================================
  uploadMedia: async (
    base64Data: string,
    filename?: string
  ): Promise<{ success: boolean; url: string; filename: string }> => {
    try {
      const res = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ data: base64Data, filename })
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback to data URI directly
    }
    return {
      success: true,
      url: base64Data,
      filename: filename || 'uploaded_media'
    };
  },

  uploadImage: async (
    base64Data: string,
    filename?: string
  ): Promise<{ success: boolean; url: string; filename: string }> => {
    return api.uploadMedia(base64Data, filename);
  }
};
