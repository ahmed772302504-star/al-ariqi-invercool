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
  // Settings & Governates
  getSettings: async (): Promise<SiteSettings> => {
    const res = await fetch(`${BASE_URL}/settings?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },
  updateSettings: async (settings: Partial<SiteSettings>): Promise<{ success: boolean; settings: SiteSettings }> => {
    const res = await fetch(`${BASE_URL}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },
  getGovernates: async (): Promise<string[]> => {
    const res = await fetch(`${BASE_URL}/governates`);
    if (!res.ok) throw new Error('Failed to fetch governates');
    return res.json();
  },
  getFAQ: async (): Promise<FAQItem[]> => {
    const res = await fetch(`${BASE_URL}/faq`);
    if (!res.ok) throw new Error('Failed to fetch FAQ');
    return res.json();
  },

  // Services
  getServices: async (): Promise<Service[]> => {
    const res = await fetch(`${BASE_URL}/services`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },
  getAdminServices: async (): Promise<Service[]> => {
    const res = await fetch(`${BASE_URL}/admin/services`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },
  getService: async (idOrSlug: string): Promise<Service> => {
    const res = await fetch(`${BASE_URL}/services/${encodeURIComponent(idOrSlug)}`);
    if (!res.ok) throw new Error('Service not found');
    return res.json();
  },
  createService: async (service: Partial<Service>): Promise<Service> => {
    const res = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(service)
    });
    if (!res.ok) throw new Error('Failed to create service');
    return res.json();
  },
  updateService: async (id: string, service: Partial<Service>): Promise<Service> => {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(service)
    });
    if (!res.ok) throw new Error('Failed to update service');
    return res.json();
  },
  deleteService: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete service');
  },

  // Products
  getProducts: async (params?: {
    category?: string;
    condition?: string;
    status?: string;
    brand?: string;
    search?: string;
    featured?: boolean;
    importedEconomy?: boolean;
  }): Promise<Product[]> => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.condition) query.set('condition', params.condition);
    if (params?.status) query.set('status', params.status);
    if (params?.brand) query.set('brand', params.brand);
    if (params?.search) query.set('search', params.search);
    if (params?.featured) query.set('featured', 'true');
    if (params?.importedEconomy) query.set('importedEconomy', 'true');

    const res = await fetch(`${BASE_URL}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },
  getProduct: async (idOrSlug: string): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(idOrSlug)}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },
  createProduct: async (product: Partial<Product>): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },
  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },
  deleteProduct: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // Projects
  getProjects: async (params?: {
    governate?: string;
    category?: string;
    clientType?: string;
    search?: string;
    featured?: boolean;
  }): Promise<Project[]> => {
    const query = new URLSearchParams();
    if (params?.governate) query.set('governate', params.governate);
    if (params?.category) query.set('category', params.category);
    if (params?.clientType) query.set('clientType', params.clientType);
    if (params?.search) query.set('search', params.search);
    if (params?.featured) query.set('featured', 'true');

    const res = await fetch(`${BASE_URL}/projects?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },
  getProject: async (idOrSlug: string): Promise<Project> => {
    const res = await fetch(`${BASE_URL}/projects/${encodeURIComponent(idOrSlug)}`);
    if (!res.ok) throw new Error('Project not found');
    return res.json();
  },
  createProject: async (project: Partial<Project>): Promise<Project> => {
    const res = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(project)
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },
  updateProject: async (id: string, project: Partial<Project>): Promise<Project> => {
    const res = await fetch(`${BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(project)
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },
  deleteProject: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete project');
  },

  // Gallery
  getGallery: async (params?: string | { category?: string; serviceId?: string; serviceSlug?: string }): Promise<GalleryItem[]> => {
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
    if (!res.ok) throw new Error('Failed to fetch gallery');
    return res.json();
  },
  createGalleryItem: async (item: Partial<GalleryItem>): Promise<GalleryItem> => {
    const res = await fetch(`${BASE_URL}/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to add gallery item');
    return res.json();
  },
  updateGalleryItem: async (id: string, item: Partial<GalleryItem>): Promise<GalleryItem> => {
    const res = await fetch(`${BASE_URL}/gallery/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to update gallery item');
    return res.json();
  },
  deleteGalleryItem: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete gallery item');
  },

  // Reviews
  getApprovedReviews: async (): Promise<Review[]> => {
    const res = await fetch(`${BASE_URL}/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },
  getAllReviewsAdmin: async (): Promise<Review[]> => {
    const res = await fetch(`${BASE_URL}/admin/reviews`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch admin reviews');
    return res.json();
  },
  submitReview: async (review: Partial<Review>): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit review');
    return data;
  },
  updateReview: async (id: string, updates: Partial<Review>): Promise<Review> => {
    const res = await fetch(`${BASE_URL}/admin/reviews/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update review');
    return res.json();
  },
  deleteReview: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete review');
  },

  // Requests: Maintenance
  submitMaintenanceRequest: async (
    data: any
  ): Promise<{ success: boolean; requestNumber: string; message: string }> => {
    const res = await fetch(`${BASE_URL}/requests/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit maintenance request');
    return result;
  },
  getMaintenanceRequestsAdmin: async (params?: { status?: string; governate?: string; search?: string }): Promise<MaintenanceRequest[]> => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.governate) query.set('governate', params.governate);
    if (params?.search) query.set('search', params.search);
    const res = await fetch(`${BASE_URL}/admin/requests/maintenance?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch maintenance requests');
    return res.json();
  },
  updateMaintenanceRequestAdmin: async (id: string, updates: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> => {
    const res = await fetch(`${BASE_URL}/admin/requests/maintenance/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update maintenance request');
    return res.json();
  },

  // Requests: Quote
  submitQuoteRequest: async (
    data: any
  ): Promise<{ success: boolean; requestNumber: string; message: string }> => {
    const res = await fetch(`${BASE_URL}/requests/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit quote request');
    return result;
  },
  getQuoteRequestsAdmin: async (): Promise<QuoteRequest[]> => {
    const res = await fetch(`${BASE_URL}/admin/requests/quotes`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch quote requests');
    return res.json();
  },
  updateQuoteRequestAdmin: async (id: string, updates: Partial<QuoteRequest>): Promise<QuoteRequest> => {
    const res = await fetch(`${BASE_URL}/admin/requests/quotes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update quote request');
    return res.json();
  },

  // Requests: Technician
  submitTechnicianRequest: async (
    data: any
  ): Promise<{ success: boolean; requestNumber: string; message: string }> => {
    const res = await fetch(`${BASE_URL}/requests/technician`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit technician request');
    return result;
  },
  getTechnicianRequestsAdmin: async (): Promise<TechnicianRequest[]> => {
    const res = await fetch(`${BASE_URL}/admin/requests/technicians`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch technician requests');
    return res.json();
  },
  updateTechnicianRequestAdmin: async (id: string, updates: Partial<TechnicianRequest>): Promise<TechnicianRequest> => {
    const res = await fetch(`${BASE_URL}/admin/requests/technicians/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update technician request');
    return res.json();
  },

  // Contact
  submitContactMessage: async (data: { name: string; phone: string; email?: string; message: string }): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to send message');
    return result;
  },
  getContactMessagesAdmin: async (): Promise<ContactMessage[]> => {
    const res = await fetch(`${BASE_URL}/admin/messages`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch contact messages');
    return res.json();
  },
  markMessageRead: async (id: string): Promise<void> => {
    await fetch(`${BASE_URL}/admin/messages/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
  },
  deleteContactMessage: async (id: string): Promise<void> => {
    await fetch(`${BASE_URL}/admin/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // Stats & Notifications
  getStats: async (): Promise<any> => {
    const res = await fetch(`${BASE_URL}/stats`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },
  getNotifications: async (): Promise<NotificationItem[]> => {
    const res = await fetch(`${BASE_URL}/notifications`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },
  markNotificationRead: async (id: string): Promise<void> => {
    await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
  },
  markAllNotificationsRead: async (): Promise<void> => {
    await fetch(`${BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
  },

  // Media Upload helper (images and video files)
  uploadMedia: async (base64Data: string, filename?: string): Promise<{ success: boolean; url: string; filename: string }> => {
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ data: base64Data, filename })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'فشل رفع الملف' }));
      throw new Error(err.error || 'فشل رفع الملف');
    }
    return res.json();
  },

  // Alias for backward compatibility
  uploadImage: async (base64Data: string, filename?: string): Promise<{ success: boolean; url: string; filename: string }> => {
    return api.uploadMedia(base64Data, filename);
  }
};
