import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { dbManager, YEMEN_GOVERNATES } from './database.js';
import {
  authenticateUser,
  verifySession,
  logoutSession,
  isIpRateLimited,
  recordLoginAttempt,
  hashPassword,
  generateSalt,
  Session
} from './auth.js';
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
} from '../src/types.js';

export const apiRouter = express.Router();

// Middleware: Authenticate Admin Request
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized. Please log in.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const session = verifySession(token);
  if (!session) {
    res.status(401).json({ error: 'Session expired or invalid.' });
    return;
  }
  (req as any).adminSession = session;
  next();
}

// Generate human-friendly reference numbers: e.g. MNT-94321
function generateRefNumber(prefix: string): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${num}`;
}

// ==========================================
// 1. PUBLIC ENDPOINTS
// ==========================================

// Site Settings & Contact Info
apiRouter.get('/settings', (req: Request, res: Response) => {
  const db = dbManager.get();
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(db.settings);
});

// Governates
apiRouter.get('/governates', (req: Request, res: Response) => {
  res.json(YEMEN_GOVERNATES);
});

// FAQ
apiRouter.get('/faq', (req: Request, res: Response) => {
  const db = dbManager.get();
  res.json(db.faq);
});

// Services
apiRouter.get('/services', (req: Request, res: Response) => {
  const db = dbManager.get();
  // Filter active services for public, sorted by order
  const activeServices = db.services
    .filter((s) => s.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json(activeServices);
});

apiRouter.get('/services/:idOrSlug', (req: Request, res: Response) => {
  const db = dbManager.get();
  const param = req.params.idOrSlug;
  const service = db.services.find((s) => s.id === param || s.slug === param);
  if (!service) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }
  res.json(service);
});

// Products
apiRouter.get('/products', (req: Request, res: Response) => {
  const db = dbManager.get();
  let list = [...db.products];

  const { category, condition, status, brand, search, featured, importedEconomy } = req.query;

  if (category && category !== 'all') {
    list = list.filter((p) => p.category === category);
  }
  if (condition && condition !== 'all') {
    list = list.filter((p) => p.condition === condition);
  }
  if (status && status !== 'all') {
    list = list.filter((p) => p.status === status);
  }
  if (brand) {
    list = list.filter((p) => p.brand?.toLowerCase().includes((brand as string).toLowerCase()));
  }
  if (featured === 'true') {
    list = list.filter((p) => p.isFeatured);
  }
  if (importedEconomy === 'true') {
    list = list.filter((p) => p.isImportedEconomy);
  }
  if (search) {
    const q = (search as string).toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.descAr.toLowerCase().includes(q) ||
        p.model?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

apiRouter.get('/products/:idOrSlug', (req: Request, res: Response) => {
  const db = dbManager.get();
  const param = req.params.idOrSlug;
  const product = db.products.find((p) => p.id === param || p.slug === param);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

// Projects
apiRouter.get('/projects', (req: Request, res: Response) => {
  const db = dbManager.get();
  let list = [...db.projects];
  const { governate, category, clientType, search, featured } = req.query;

  if (governate && governate !== 'all') {
    list = list.filter((p) => p.governate === governate);
  }
  if (category && category !== 'all') {
    list = list.filter((p) => p.category === category);
  }
  if (clientType && clientType !== 'all') {
    list = list.filter((p) => p.clientType === clientType);
  }
  if (featured === 'true') {
    list = list.filter((p) => p.isFeatured);
  }
  if (search) {
    const q = (search as string).toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.titleAr.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q) ||
        p.descAr.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

apiRouter.get('/projects/:idOrSlug', (req: Request, res: Response) => {
  const db = dbManager.get();
  const param = req.params.idOrSlug;
  const project = db.projects.find((p) => p.id === param || p.slug === param);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json(project);
});

// Gallery
apiRouter.get('/gallery', (req: Request, res: Response) => {
  const db = dbManager.get();
  let list = [...db.gallery];
  const { category, serviceId, serviceSlug } = req.query;
  
  if (serviceId && serviceId !== 'all') {
    list = list.filter((g) => g.serviceId === serviceId);
  } else if (serviceSlug && serviceSlug !== 'all') {
    list = list.filter((g) => g.serviceSlug === serviceSlug);
  } else if (category && category !== 'all') {
    list = list.filter((g) => g.category === category);
  }
  
  // Sort by order if available, else newest first
  list.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  res.json(list);
});

// Reviews (Public: Only Approved)
apiRouter.get('/reviews', (req: Request, res: Response) => {
  const db = dbManager.get();
  const approved = db.reviews.filter((r) => r.isApproved);
  res.json(approved);
});

// Submit Review (Customer facing)
apiRouter.post('/reviews', (req: Request, res: Response) => {
  const { clientName, city, rating, textAr, textEn, clientPhoto } = req.body;
  if (!clientName || !rating || !textAr) {
    res.status(400).json({ error: 'الاسم والتقييم والنص مطلوبة' });
    return;
  }

  const db = dbManager.get();
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    clientName: clientName.trim(),
    city: city?.trim() || 'اليمن',
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    textAr: textAr.trim(),
    textEn: textEn?.trim() || '',
    clientPhoto: clientPhoto || '',
    isApproved: false, // Moderation required
    isFeatured: false,
    createdAt: new Date().toISOString()
  };

  db.reviews.unshift(newReview);
  // Add notification
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'تقييم جديد بانتظار المراجعة',
    message: `أضاف ${newReview.clientName} تقييماً جديداً (${newReview.rating} نجوم)`,
    type: 'contact',
    linkUrl: '/admin/reviews',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  dbManager.saveSync();
  res.status(201).json({ success: true, message: 'شكراً لك، تم إرسال تقييمك وسيتم نشره بعد المراجعة' });
});

// Submit Maintenance Request
apiRouter.post('/requests/maintenance', (req: Request, res: Response) => {
  const { clientName, phone, governate, city, serviceType, equipmentType, problemDesc, priority, images } = req.body;

  if (!clientName || !phone || !governate || !problemDesc) {
    res.status(400).json({ error: 'يرجى إكمال جميع الحقول المطلوبة' });
    return;
  }

  const db = dbManager.get();
  const requestNumber = generateRefNumber('MNT');

  const newRequest: MaintenanceRequest = {
    id: `mnt-${Date.now()}`,
    requestNumber,
    clientName: clientName.trim(),
    phone: phone.trim(),
    governate: governate.trim(),
    city: city?.trim() || governate.trim(),
    serviceType: serviceType?.trim() || 'صيانة عامة',
    equipmentType: equipmentType?.trim() || 'تكييف',
    problemDesc: problemDesc.trim(),
    priority: priority || 'normal',
    images: Array.isArray(images) ? images : [],
    status: 'received',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.maintenanceRequests.unshift(newRequest);

  // Admin Notification
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: `طلب صيانة جديد #${requestNumber}`,
    message: `العميل: ${newRequest.clientName} - ${newRequest.governate} - هاتف: ${newRequest.phone}`,
    type: 'maintenance',
    linkUrl: `/admin/requests/maintenance`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  dbManager.saveSync();
  res.status(201).json({
    success: true,
    requestNumber,
    message: 'تم استلام طلبك بنجاح، وسيتم التواصل معك من قبل فريقنا الهندسي.'
  });
});

// Submit Quote Request
apiRouter.post('/requests/quote', (req: Request, res: Response) => {
  const { clientName, companyName, phone, governate, city, projectType, requiredSystem, projectDesc, projectArea, unitsCount, files, notes } = req.body;

  if (!clientName || !phone || !governate || !projectDesc) {
    res.status(400).json({ error: 'يرجى إكمال الحقول الأساسية لطلب عرض السعر' });
    return;
  }

  const db = dbManager.get();
  const requestNumber = generateRefNumber('QTE');

  const newQuote: QuoteRequest = {
    id: `qte-${Date.now()}`,
    requestNumber,
    clientName: clientName.trim(),
    companyName: companyName?.trim() || '',
    phone: phone.trim(),
    governate: governate.trim(),
    city: city?.trim() || governate.trim(),
    projectType: projectType?.trim() || 'مشروع تجاري',
    requiredSystem: requiredSystem?.trim() || 'تكييف وتبريد',
    projectDesc: projectDesc.trim(),
    projectArea: projectArea?.trim() || '',
    unitsCount: unitsCount?.trim() || '',
    files: Array.isArray(files) ? files : [],
    notes: notes?.trim() || '',
    status: 'new',
    createdAt: new Date().toISOString()
  };

  db.quoteRequests.unshift(newQuote);

  // Notification
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: `طلب عرض سعر جديد #${requestNumber}`,
    message: `طلب من: ${newQuote.clientName} (${newQuote.companyName || 'فردي'}) - ${newQuote.projectType}`,
    type: 'quote',
    linkUrl: `/admin/requests/quotes`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  dbManager.saveSync();
  res.status(201).json({
    success: true,
    requestNumber,
    message: 'تم استلام طلب عرض السعر بنجاح، وسيقوم مهندسونا بدراسته والتواصل معكم فوراً.'
  });
});

// Submit Technician Request
apiRouter.post('/requests/technician', (req: Request, res: Response) => {
  const { clientName, phone, governate, city, locationDetails, equipmentType, malfunctionType, problemDesc, images, preferredVisitTime } = req.body;

  if (!clientName || !phone || !governate || !problemDesc) {
    res.status(400).json({ error: 'يرجى ملء كافة بيانات طلب الفني' });
    return;
  }

  const db = dbManager.get();
  const requestNumber = generateRefNumber('TCH');

  const newReq: TechnicianRequest = {
    id: `tch-${Date.now()}`,
    requestNumber,
    clientName: clientName.trim(),
    phone: phone.trim(),
    governate: governate.trim(),
    city: city?.trim() || governate.trim(),
    locationDetails: locationDetails?.trim() || '',
    equipmentType: equipmentType?.trim() || 'تكييف',
    malfunctionType: malfunctionType?.trim() || 'عطل مفاجئ',
    problemDesc: problemDesc.trim(),
    images: Array.isArray(images) ? images : [],
    preferredVisitTime: preferredVisitTime?.trim() || 'في أقرب وقت ممكن',
    status: 'new',
    createdAt: new Date().toISOString()
  };

  db.technicianRequests.unshift(newReq);

  // Notification
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: `طلب زيارة فني #${requestNumber}`,
    message: `العميل: ${newReq.clientName} - ${newReq.governate} - الوقت المفضل: ${newReq.preferredVisitTime}`,
    type: 'technician',
    linkUrl: `/admin/requests/technicians`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  dbManager.saveSync();
  res.status(201).json({
    success: true,
    requestNumber,
    message: 'تم استلام طلب الفني بنجاح، وسيتم التنسيق معك لتأكيد موعد الزيارة.'
  });
});

// Contact Us Form
apiRouter.post('/contact', (req: Request, res: Response) => {
  const { name, phone, email, message } = req.body;
  if (!name || !phone || !message) {
    res.status(400).json({ error: 'الاسم، الهاتف، والرسالة حقول مطلوبة' });
    return;
  }

  const db = dbManager.get();
  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}`,
    name: name.trim(),
    phone: phone.trim(),
    email: email?.trim() || '',
    message: message.trim(),
    isRead: false,
    createdAt: new Date().toISOString()
  };

  db.contactMessages.unshift(newMessage);

  // Notification
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'رسالة تواصل جديدة',
    message: `من: ${newMessage.name} - هاتف: ${newMessage.phone}`,
    type: 'contact',
    linkUrl: `/admin/messages`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  dbManager.saveSync();
  res.status(201).json({ success: true, message: 'تم إرسال رسالتك بنجاح، شكراً لتواصلك معنا.' });
});

// ==========================================
// 2. AUTHENTICATION & ADMIN SESSION
// ==========================================

// Login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (isIpRateLimited(ip)) {
    res.status(429).json({ error: 'تم حظر المحاولات مؤقتاً بسبب تكرار الأخطاء. يرجى المحاولة بعد 15 دقيقة.' });
    return;
  }

  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'اسم المستخدم وكلمة المرور مطلوبان' });
    return;
  }

  const session = authenticateUser(username, password);
  if (!session) {
    recordLoginAttempt(ip, false);
    res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    return;
  }

  recordLoginAttempt(ip, true);
  res.json({
    success: true,
    token: session.token,
    user: {
      id: session.userId,
      username: session.username,
      role: session.role
    }
  });
});

// Verify Current Session
apiRouter.get('/auth/me', requireAdmin, (req: Request, res: Response) => {
  const session = (req as any).adminSession as Session;
  res.json({
    id: session.userId,
    username: session.username,
    role: session.role
  });
});

// Logout
apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    logoutSession(authHeader.split(' ')[1]);
  }
  res.json({ success: true });
});

// Change Password
apiRouter.put('/auth/password', requireAdmin, (req: Request, res: Response) => {
  const session = (req as any).adminSession as Session;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword || newPassword.length < 6) {
    res.status(400).json({ error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' });
    return;
  }

  const db = dbManager.get();
  const user = db.adminUsers.find((u) => u.id === session.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const oldComputed = hashPassword(oldPassword, user.salt);
  if (oldComputed !== user.passwordHash) {
    res.status(400).json({ error: 'كلمة المرور القديمة غير صحيحة' });
    return;
  }

  user.salt = generateSalt();
  user.passwordHash = hashPassword(newPassword, user.salt);
  dbManager.saveSync();

  res.json({ success: true, message: 'تم تحديث كلمة المرور بنجاح' });
});

// ==========================================
// 3. ADMIN DASHBOARD - STATS & NOTIFICATIONS
// ==========================================

apiRouter.get('/stats', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const availableProducts = db.products.filter((p) => p.status === 'available').length;
  const soldProducts = db.products.filter((p) => p.status === 'sold').length;

  const stats = {
    productsTotal: db.products.length,
    productsAvailable: availableProducts,
    productsSold: soldProducts,
    servicesTotal: db.services.length,
    projectsTotal: db.projects.length,
    galleryTotal: db.gallery.length,
    reviewsTotal: db.reviews.length,
    reviewsPending: db.reviews.filter((r) => !r.isApproved).length,
    maintenanceTotal: db.maintenanceRequests.length,
    maintenanceNew: db.maintenanceRequests.filter((r) => r.status === 'received').length,
    quotesTotal: db.quoteRequests.length,
    quotesNew: db.quoteRequests.filter((r) => r.status === 'new').length,
    techniciansTotal: db.technicianRequests.length,
    techniciansNew: db.technicianRequests.filter((r) => r.status === 'new').length,
    messagesTotal: db.contactMessages.length,
    messagesUnread: db.contactMessages.filter((m) => !m.isRead).length
  };

  res.json(stats);
});

apiRouter.get('/notifications', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  res.json(db.notifications);
});

apiRouter.put('/notifications/:id/read', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const notif = db.notifications.find((n) => n.id === req.params.id);
  if (notif) notif.isRead = true;
  dbManager.saveSync();
  res.json({ success: true });
});

apiRouter.put('/notifications/read-all', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  db.notifications.forEach((n) => (n.isRead = true));
  dbManager.saveSync();
  res.json({ success: true });
});

// ==========================================
// 4. ADMIN DASHBOARD - PRODUCTS CRUD
// ==========================================

apiRouter.post('/products', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const body = req.body;

  if (!body.nameAr || !body.category) {
    res.status(400).json({ error: 'اسم المنتج والتصنيف مطلوبان' });
    return;
  }

  const slug = (body.nameEn || body.nameAr)
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;

  const newProduct: Product = {
    id: `prd-${Date.now()}`,
    slug,
    nameAr: body.nameAr.trim(),
    nameEn: body.nameEn?.trim() || body.nameAr.trim(),
    category: body.category,
    brand: body.brand?.trim() || '',
    model: body.model?.trim() || '',
    capacity: body.capacity?.trim() || '',
    descAr: body.descAr?.trim() || '',
    descEn: body.descEn?.trim() || '',
    specifications: body.specifications || {},
    condition: body.condition || 'new',
    status: body.status || 'available',
    price: body.price !== undefined && body.price !== null ? Number(body.price) : undefined,
    showPrice: Boolean(body.showPrice),
    mainImage: body.mainImage || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop',
    additionalImages: Array.isArray(body.additionalImages) ? body.additionalImages : [],
    isFeatured: Boolean(body.isFeatured),
    isImportedEconomy: Boolean(body.isImportedEconomy),
    energyConsumption: body.energyConsumption?.trim() || '',
    warranty: body.warranty?.trim() || '',
    accessories: body.accessories?.trim() || '',
    manufacturingYear: body.manufacturingYear?.trim() || '',
    notes: body.notes?.trim() || '',
    createdAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);
  dbManager.saveSync();
  res.status(201).json(newProduct);
});

apiRouter.put('/products/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const existing = db.products[index];
  const updated: Product = {
    ...existing,
    ...req.body,
    id: existing.id,
    createdAt: existing.createdAt
  };

  db.products[index] = updated;
  dbManager.saveSync();
  res.json(updated);
});

apiRouter.delete('/products/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const beforeLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== req.params.id);
  if (db.products.length === beforeLen) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  dbManager.saveSync();
  res.json({ success: true });
});

// ==========================================
// 5. ADMIN DASHBOARD - SERVICES CRUD
// ==========================================

apiRouter.get('/admin/services', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  res.json(db.services);
});

apiRouter.post('/services', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const body = req.body;

  if (!body.titleAr) {
    res.status(400).json({ error: 'اسم الخدمة مطلوب' });
    return;
  }

  const slug = (body.titleEn || body.titleAr)
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;

  const newService: Service = {
    id: `srv-${Date.now()}`,
    slug,
    titleAr: body.titleAr.trim(),
    titleEn: body.titleEn?.trim() || body.titleAr.trim(),
    shortDescAr: body.shortDescAr?.trim() || '',
    shortDescEn: body.shortDescEn?.trim() || '',
    descAr: body.descAr?.trim() || '',
    descEn: body.descEn?.trim() || '',
    iconName: body.iconName || 'Wrench',
    image: body.image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
    featuresAr: Array.isArray(body.featuresAr) ? body.featuresAr : [],
    featuresEn: Array.isArray(body.featuresEn) ? body.featuresEn : [],
    subServices: Array.isArray(body.subServices) ? body.subServices : [],
    linkedProjects: Array.isArray(body.linkedProjects) ? body.linkedProjects : [],
    isFeatured: Boolean(body.isFeatured),
    isActive: body.isActive !== false,
    order: Number(body.order) || db.services.length + 1
  };

  db.services.push(newService);
  dbManager.saveSync();
  res.status(201).json(newService);
});

apiRouter.put('/services/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const index = db.services.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  db.services[index] = {
    ...db.services[index],
    ...req.body,
    id: db.services[index].id
  };
  dbManager.saveSync();
  res.json(db.services[index]);
});

apiRouter.delete('/services/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const beforeLen = db.services.length;
  db.services = db.services.filter((s) => s.id !== req.params.id);
  if (db.services.length === beforeLen) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }
  dbManager.saveSync();
  res.json({ success: true });
});

// ==========================================
// 6. ADMIN DASHBOARD - PROJECTS CRUD
// ==========================================

apiRouter.post('/projects', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const body = req.body;

  if (!body.titleAr || !body.governate) {
    res.status(400).json({ error: 'اسم المشروع والمحافظة مطلوبان' });
    return;
  }

  const slug = (body.titleEn || body.titleAr)
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;

  const newProject: Project = {
    id: `prj-${Date.now()}`,
    slug,
    titleAr: body.titleAr.trim(),
    titleEn: body.titleEn?.trim() || body.titleAr.trim(),
    clientName: body.clientName?.trim() || '',
    clientNameAr: body.clientNameAr?.trim() || body.clientName?.trim() || '',
    clientNameEn: body.clientNameEn?.trim() || '',
    governate: body.governate.trim(),
    city: body.city?.trim() || body.governate.trim(),
    category: body.category || 'مشاريع تكييف',
    clientType: body.clientType || 'commercial',
    descAr: body.descAr?.trim() || '',
    descEn: body.descEn?.trim() || '',
    servicesProvidedAr: Array.isArray(body.servicesProvidedAr) ? body.servicesProvidedAr : [],
    servicesProvidedEn: Array.isArray(body.servicesProvidedEn) ? body.servicesProvidedEn : [],
    executionDate: body.executionDate?.trim() || '',
    systemsUsed: body.systemsUsed?.trim() || '',
    images: Array.isArray(body.images) ? body.images : [],
    videoUrl: body.videoUrl?.trim() || '',
    linkedServices: Array.isArray(body.linkedServices) ? body.linkedServices : [],
    isFeatured: Boolean(body.isFeatured),
    createdAt: new Date().toISOString()
  };

  db.projects.unshift(newProject);
  dbManager.saveSync();
  res.status(201).json(newProject);
});

apiRouter.put('/projects/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const index = db.projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  db.projects[index] = {
    ...db.projects[index],
    ...req.body,
    id: db.projects[index].id,
    createdAt: db.projects[index].createdAt
  };
  dbManager.saveSync();
  res.json(db.projects[index]);
});

apiRouter.delete('/projects/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const beforeLen = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== req.params.id);
  if (db.projects.length === beforeLen) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  dbManager.saveSync();
  res.json({ success: true });
});

// ==========================================
// 7. ADMIN DASHBOARD - GALLERY CRUD
// ==========================================

apiRouter.post('/gallery', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const body = req.body;

  if (!body.mediaUrl || !body.titleAr) {
    res.status(400).json({ error: 'عنوان العمل أو الصورة والرابط مطلوبان' });
    return;
  }

  // Auto detect serviceSlug if serviceId is provided
  let serviceSlug = body.serviceSlug || '';
  if (body.serviceId && !serviceSlug) {
    const srv = db.services.find((s) => s.id === body.serviceId);
    if (srv) serviceSlug = srv.slug;
  }

  const newItem: GalleryItem = {
    id: `gal-${Date.now()}`,
    titleAr: body.titleAr.trim(),
    titleEn: body.titleEn?.trim() || body.titleAr.trim(),
    category: body.category || 'أعمال ومشاريع',
    serviceId: body.serviceId || undefined,
    serviceSlug: serviceSlug || undefined,
    clientName: body.clientName?.trim() || '',
    clientNameAr: body.clientNameAr?.trim() || body.clientName?.trim() || '',
    clientNameEn: body.clientNameEn?.trim() || '',
    location: body.location?.trim() || body.city?.trim() || '',
    city: body.location?.trim() || body.city?.trim() || '',
    mediaType: body.mediaType || 'image',
    mediaUrl: body.mediaUrl,
    thumbnailUrl: body.thumbnailUrl || body.mediaUrl,
    images: Array.isArray(body.images) && body.images.length > 0 ? body.images : (body.mediaUrl ? [body.mediaUrl] : []),
    videoUrl: body.videoUrl?.trim() || '',
    descriptionAr: body.descriptionAr?.trim() || '',
    descriptionEn: body.descriptionEn?.trim() || '',
    captionAr: body.captionAr?.trim() || body.descriptionAr?.trim() || '',
    captionEn: body.captionEn?.trim() || body.descriptionEn?.trim() || '',
    order: Number(body.order) || 0,
    createdAt: new Date().toISOString()
  };

  db.gallery.unshift(newItem);
  dbManager.saveSync();
  res.status(201).json(newItem);
});

apiRouter.put('/gallery/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const index = db.gallery.findIndex((g) => g.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Gallery item not found' });
    return;
  }

  const body = req.body;
  let serviceSlug = body.serviceSlug !== undefined ? body.serviceSlug : db.gallery[index].serviceSlug;
  if (body.serviceId && body.serviceId !== db.gallery[index].serviceId) {
    const srv = db.services.find((s) => s.id === body.serviceId);
    if (srv) serviceSlug = srv.slug;
  }

  db.gallery[index] = {
    ...db.gallery[index],
    ...body,
    serviceSlug,
    id: db.gallery[index].id,
    createdAt: db.gallery[index].createdAt
  };

  dbManager.saveSync();
  res.json(db.gallery[index]);
});

apiRouter.delete('/gallery/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  db.gallery = db.gallery.filter((g) => g.id !== req.params.id);
  dbManager.saveSync();
  res.json({ success: true });
});

// ==========================================
// 8. ADMIN DASHBOARD - REVIEWS MANAGEMENT
// ==========================================

apiRouter.get('/admin/reviews', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  res.json(db.reviews);
});

apiRouter.put('/admin/reviews/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const rev = db.reviews.find((r) => r.id === req.params.id);
  if (!rev) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }

  Object.assign(rev, req.body);
  dbManager.saveSync();
  res.json(rev);
});

apiRouter.delete('/admin/reviews/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  db.reviews = db.reviews.filter((r) => r.id !== req.params.id);
  dbManager.saveSync();
  res.json({ success: true });
});

// ==========================================
// 9. ADMIN DASHBOARD - REQUESTS & WORKFLOW
// ==========================================

// Maintenance Requests
apiRouter.get('/admin/requests/maintenance', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  let list = [...db.maintenanceRequests];
  const { status, governate, search } = req.query;

  if (status && status !== 'all') {
    list = list.filter((r) => r.status === status);
  }
  if (governate && governate !== 'all') {
    list = list.filter((r) => r.governate === governate);
  }
  if (search) {
    const q = (search as string).toLowerCase().trim();
    list = list.filter(
      (r) =>
        r.clientName.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.requestNumber.toLowerCase().includes(q) ||
        r.problemDesc.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

apiRouter.put('/admin/requests/maintenance/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const reqItem = db.maintenanceRequests.find((r) => r.id === req.params.id);
  if (!reqItem) {
    res.status(404).json({ error: 'Request not found' });
    return;
  }

  // Update status, notes, technician assignment, cost, spare parts, before/after images
  const {
    status,
    notes,
    technicianName,
    appointmentDate,
    cost,
    sparePartsUsed,
    beforeImages,
    afterImages,
    technicianNotes
  } = req.body;

  if (status) reqItem.status = status;
  if (notes !== undefined) reqItem.notes = notes;
  if (technicianName !== undefined) reqItem.technicianName = technicianName;
  if (appointmentDate !== undefined) reqItem.appointmentDate = appointmentDate;
  if (cost !== undefined) reqItem.cost = Number(cost);
  if (sparePartsUsed !== undefined) reqItem.sparePartsUsed = sparePartsUsed;
  if (beforeImages !== undefined) reqItem.beforeImages = beforeImages;
  if (afterImages !== undefined) reqItem.afterImages = afterImages;
  if (technicianNotes !== undefined) reqItem.technicianNotes = technicianNotes;

  reqItem.updatedAt = new Date().toISOString();
  dbManager.saveSync();
  res.json(reqItem);
});

// Quote Requests
apiRouter.get('/admin/requests/quotes', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  res.json(db.quoteRequests);
});

apiRouter.put('/admin/requests/quotes/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const q = db.quoteRequests.find((item) => item.id === req.params.id);
  if (!q) {
    res.status(404).json({ error: 'Quote request not found' });
    return;
  }

  const { status, quoteAmount, adminNotes } = req.body;
  if (status) q.status = status;
  if (quoteAmount !== undefined) q.quoteAmount = Number(quoteAmount);
  if (adminNotes !== undefined) q.adminNotes = adminNotes;

  dbManager.saveSync();
  res.json(q);
});

// Technician Requests
apiRouter.get('/admin/requests/technicians', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  res.json(db.technicianRequests);
});

apiRouter.put('/admin/requests/technicians/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const t = db.technicianRequests.find((item) => item.id === req.params.id);
  if (!t) {
    res.status(404).json({ error: 'Technician request not found' });
    return;
  }

  const { status, technicianName, adminNotes } = req.body;
  if (status) t.status = status;
  if (technicianName !== undefined) t.technicianName = technicianName;
  if (adminNotes !== undefined) t.adminNotes = adminNotes;

  dbManager.saveSync();
  res.json(t);
});

// Contact Messages
apiRouter.get('/admin/messages', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  res.json(db.contactMessages);
});

apiRouter.put('/admin/messages/:id/read', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const m = db.contactMessages.find((item) => item.id === req.params.id);
  if (m) m.isRead = true;
  dbManager.saveSync();
  res.json({ success: true });
});

apiRouter.delete('/admin/messages/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  db.contactMessages = db.contactMessages.filter((m) => m.id !== req.params.id);
  dbManager.saveSync();
  res.json({ success: true });
});

// ==========================================
// 10. ADMIN DASHBOARD - SETTINGS & CMS
// ==========================================

apiRouter.put('/settings', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const now = Date.now();
  const logoChanged =
    req.body.logoUrl !== undefined ||
    req.body.logoIconUrl !== undefined ||
    req.body.watermarkUrl !== undefined;

  // Update site settings safely
  db.settings = {
    ...db.settings,
    ...req.body,
    updatedAt: now,
    logoUpdatedAt: logoChanged ? now : (db.settings.logoUpdatedAt || now),
    // Preserve developer attribution immutable integrity
    developerName: 'م/ أحمد وليد العريقي',
    developerPhone1: '772302504',
    developerPhone2: '738603124'
  };

  dbManager.saveSync();
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json({ success: true, settings: db.settings });
});

// FAQ Management
apiRouter.post('/faq', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const { questionAr, questionEn, answerAr, answerEn, category } = req.body;
  if (!questionAr || !answerAr) {
    res.status(400).json({ error: 'السؤال والإجابة بالعربية مطلوبان' });
    return;
  }

  const newFaq: FAQItem = {
    id: `faq-${Date.now()}`,
    questionAr: questionAr.trim(),
    questionEn: questionEn?.trim() || '',
    answerAr: answerAr.trim(),
    answerEn: answerEn?.trim() || '',
    category: category || 'عام',
    order: db.faq.length + 1
  };

  db.faq.push(newFaq);
  dbManager.saveSync();
  res.status(201).json(newFaq);
});

apiRouter.put('/faq/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  const index = db.faq.findIndex((f) => f.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'FAQ not found' });
    return;
  }

  db.faq[index] = {
    ...db.faq[index],
    ...req.body,
    id: db.faq[index].id
  };
  dbManager.saveSync();
  res.json(db.faq[index]);
});

apiRouter.delete('/faq/:id', requireAdmin, (req: Request, res: Response) => {
  const db = dbManager.get();
  db.faq = db.faq.filter((f) => f.id !== req.params.id);
  dbManager.saveSync();
  res.json({ success: true });
});

// Media Upload Endpoint (handles images and direct video files cleanly)
apiRouter.post('/upload', (req: Request, res: Response) => {
  const { data, filename } = req.body;
  if (!data) {
    res.status(400).json({ error: 'No media data provided' });
    return;
  }

  // Base64 validation, data URI and URL support for images & videos
  if (
    typeof data === 'string' &&
    (data.startsWith('data:image/') ||
      data.startsWith('data:video/') ||
      data.startsWith('data:application/octet-stream') ||
      data.startsWith('http://') ||
      data.startsWith('https://') ||
      data.startsWith('/'))
  ) {
    const isVideo = data.startsWith('data:video/');
    res.json({
      success: true,
      url: data,
      filename: filename || (isVideo ? 'uploaded_video.mp4' : 'uploaded_image.webp')
    });
    return;
  }

  // If raw base64 string without data prefix
  if (typeof data === 'string' && data.length > 50) {
    const prefixed = `data:image/webp;base64,${data}`;
    res.json({
      success: true,
      url: prefixed,
      filename: filename || 'uploaded_image.webp'
    });
    return;
  }

  res.status(400).json({ error: 'صيغة الملف غير مدعومة. الصيغ المسموحة: JPG, PNG, WEBP, SVG, MP4, WebM, MOV' });
});
