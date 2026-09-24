import React, { useState, useEffect } from 'react';
import { useApp } from '../context';
import { Product, ProductCondition, ProductStatus, MaintenanceRequest, QuoteRequest, TechnicianRequest, ContactMessage, Review, Service } from '../types';
import {
  Lock,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Wrench,
  FileText,
  UserCheck,
  MessageSquare,
  Star,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Search,
  Eye,
  RefreshCw,
  TrendingUp,
  Phone,
  ShieldCheck,
  Zap,
  Clock,
  X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { lang, t, adminToken, adminUser, loginAdmin, logoutAdmin, refreshData } = useApp();

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<'stats' | 'maintenance' | 'quotes' | 'technicians' | 'products' | 'messages' | 'reviews' | 'settings'>('stats');

  // Admin Data states
  const [stats, setStats] = useState<any>(null);
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceRequest[]>([]);
  const [quoteList, setQuoteList] = useState<QuoteRequest[]>([]);
  const [techList, setTechList] = useState<TechnicianRequest[]>([]);
  const [messagesList, setMessagesList] = useState<ContactMessage[]>([]);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);

  // Product Add / Edit modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState({
    nameAr: '',
    nameEn: '',
    category: 'مكيفات سبليت إنفرتر',
    brand: '',
    model: '',
    capacity: '1.5 طن (18000 BTU)',
    price: 350000,
    showPrice: true,
    condition: 'new' as ProductCondition,
    status: 'available' as ProductStatus,
    energyConsumption: '0.9 ك.و/ساعة (موفر 60%)',
    warranty: 'ضمان سنة شامل وضمان 5 سنوات للكمبروسر',
    descAr: '',
    descEn: '',
    mainImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop',
    isImportedEconomy: false,
    isFeatured: true
  });

  // Selected Maintenance Item for Status Update
  const [activeMaintenance, setActiveMaintenance] = useState<MaintenanceRequest | null>(null);
  const [mStatus, setMStatus] = useState('');
  const [mTechName, setMTechName] = useState('');
  const [mNotes, setMNotes] = useState('');
  const [mCost, setMCost] = useState<number | ''>('');

  const fetchAdminData = async () => {
    if (!adminToken) return;
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const [st, mnt, qte, tch, msg, rev, prd] = await Promise.all([
        fetch('/api/stats', { headers }).then((r) => r.json()).catch(() => null),
        fetch('/api/admin/requests/maintenance', { headers }).then((r) => r.json()).catch(() => []),
        fetch('/api/admin/requests/quotes', { headers }).then((r) => r.json()).catch(() => []),
        fetch('/api/admin/requests/technicians', { headers }).then((r) => r.json()).catch(() => []),
        fetch('/api/admin/messages', { headers }).then((r) => r.json()).catch(() => []),
        fetch('/api/admin/reviews', { headers }).then((r) => r.json()).catch(() => []),
        fetch('/api/products').then((r) => r.json()).catch(() => [])
      ]);

      if (st) setStats(st);
      if (Array.isArray(mnt)) setMaintenanceList(mnt);
      if (Array.isArray(qte)) setQuoteList(qte);
      if (Array.isArray(tch)) setTechList(tch);
      if (Array.isArray(msg)) setMessagesList(msg);
      if (Array.isArray(rev)) setReviewsList(rev);
      if (Array.isArray(prd)) setProductsList(prd);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchAdminData();
    }
  }, [adminToken, adminTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to login');

      loginAdmin(data.token, data.user);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  // Maintenance Status Update
  const updateMaintenanceStatus = async () => {
    if (!activeMaintenance || !adminToken) return;
    try {
      const res = await fetch(`/api/admin/requests/maintenance/${activeMaintenance.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: mStatus,
          technicianName: mTechName,
          notes: mNotes,
          cost: mCost === '' ? undefined : Number(mCost)
        })
      });
      if (res.ok) {
        setActiveMaintenance(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Review Approval
  const toggleReviewApproval = async (id: string, isApproved: boolean) => {
    if (!adminToken) return;
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ isApproved: !isApproved })
      });
      fetchAdminData();
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!adminToken || !window.confirm(t('هل أنت متأكد من حذف هذا المنتج؟', 'Are you sure?'))) return;
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      fetchAdminData();
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Save Product (Add / Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(prodForm)
      });

      if (res.ok) {
        setProductModalOpen(false);
        setEditingProduct(null);
        fetchAdminData();
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 1. IF NOT LOGGED IN -> DISPLAY SECURE LOGIN FORM
  if (!adminToken) {
    return (
      <div className="min-h-screen bg-[#060E18] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0B192C] rounded-2xl p-8 border border-slate-700 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1E3E62] to-[#0B192C] border-2 border-[#C87D55] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-7 h-7 text-[#C87D55]" />
            </div>
            <h2 className="text-xl font-black tracking-wide">
              {t('بوابة الإدارة والتحكم - العريقي إنفركول', 'Invercool Administration Portal')}
            </h2>
            <p className="text-xs text-slate-400">
              {t('إدارة طلبات الصيانة، عروض الأسعار، المنتجات والتقييمات', 'Manage maintenance tickets, quotes, products & reviews')}
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('اسم المستخدم', 'Username')}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#060E18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C87D55]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('كلمة المرور', 'Password')}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#060E18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C87D55]"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C87D55] to-[#A85D35] hover:brightness-110 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loginLoading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              <span>{t('تسجيل الدخول للنظام', 'Login to Dashboard')}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
            {t('النظام مؤمن ومشفر بالكامل بآلية PBKDF2 وشهادات الحماية', 'Encrypted PBKDF2 Session Security')}
          </div>
        </div>
      </div>
    );
  }

  // 2. LOGGED IN ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Admin Top Navigation */}
      <div className="bg-[#0B192C] border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#C87D55] text-white flex items-center justify-center font-black text-sm">
            IC
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">
              {t('لوحة تحكم وإدارة العريقي إنفركول', 'Invercool Management Dashboard')}
            </h1>
            <span className="text-[11px] text-slate-400">
              {t('المستخدم:', 'User:')} <strong className="text-emerald-400">{adminUser?.username}</strong> ({adminUser?.role})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
            title={t('تحديث البيانات', 'Refresh')}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('تحديث', 'Refresh')}</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold border border-rose-500/30 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('خروج', 'Logout')}</span>
          </button>
        </div>
      </div>

      {/* Admin Sub Navigation Tabs */}
      <div className="bg-[#060E18] px-6 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'stats', label: t('الإحصائيات العامة', 'Overview'), icon: LayoutDashboard },
          { id: 'maintenance', label: t('طلبات الصيانة', 'Maintenance'), count: maintenanceList.filter((m) => m.status === 'received').length, icon: Wrench },
          { id: 'quotes', label: t('عروض الأسعار', 'Quotes'), count: quoteList.filter((q) => q.status === 'new').length, icon: FileText },
          { id: 'technicians', label: t('طلبات الفنيين', 'Technicians'), count: techList.filter((t) => t.status === 'new').length, icon: UserCheck },
          { id: 'products', label: t('المنتجات والمعرض', 'Products'), icon: ShoppingBag },
          { id: 'messages', label: t('الرسائل والتواصل', 'Messages'), count: messagesList.filter((m) => !m.isRead).length, icon: MessageSquare },
          { id: 'reviews', label: t('التقييمات والمراجعات', 'Reviews'), count: reviewsList.filter((r) => !r.isApproved).length, icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`py-3 px-3.5 text-xs font-bold shrink-0 flex items-center gap-2 border-b-2 transition-all ${
                active
                  ? 'border-[#C87D55] text-white bg-white/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 text-[#C87D55]" />
              <span>{tab.label}</span>
              {Boolean(tab.count) && (
                <span className="w-5 h-5 rounded-full bg-[#C87D55] text-white text-[10px] flex items-center justify-center font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* STATS OVERVIEW */}
        {adminTab === 'stats' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#0B192C] p-5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">{t('بلاغات صيانة جديدة', 'New Maintenance')}</span>
                <div className="text-2xl font-black text-[#C87D55]">{stats.maintenanceNew}</div>
                <div className="text-[11px] text-slate-500">{stats.maintenanceTotal} إجمالي البلاغات</div>
              </div>

              <div className="bg-[#0B192C] p-5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">{t('طلبات عروض أسعار جديدة', 'New Quotes')}</span>
                <div className="text-2xl font-black text-amber-400">{stats.quotesNew}</div>
                <div className="text-[11px] text-slate-500">{stats.quotesTotal} إجمالي الطلبات</div>
              </div>

              <div className="bg-[#0B192C] p-5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">{t('أجهزة متوفرة بالمستودع', 'In-Stock Products')}</span>
                <div className="text-2xl font-black text-emerald-400">{stats.productsAvailable}</div>
                <div className="text-[11px] text-slate-500">{stats.productsTotal} إجمالي المنتجات</div>
              </div>

              <div className="bg-[#0B192C] p-5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">{t('تقييمات بانتظار الاعتماد', 'Pending Reviews')}</span>
                <div className="text-2xl font-black text-indigo-400">{stats.reviewsPending}</div>
                <div className="text-[11px] text-slate-500">{stats.reviewsTotal} إجمالي التقييمات</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#0B192C] p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#C87D55]" />
                <span>{t('إجراءات سريعة فورية', 'Quick Admin Operations')}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProdForm({
                      nameAr: '',
                      nameEn: '',
                      category: 'مكيفات سبليت إنفرتر',
                      brand: '',
                      model: '',
                      capacity: '1.5 طن',
                      price: 350000,
                      showPrice: true,
                      condition: 'new',
                      status: 'available',
                      energyConsumption: 'موفر للطاقة',
                      warranty: 'ضمان سنة',
                      descAr: '',
                      descEn: '',
                      mainImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop',
                      isImportedEconomy: false,
                      isFeatured: true
                    });
                    setProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#C87D55] text-white text-xs font-bold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('إضافة مكيف أو جهاز جديد للمعرض', 'Add New AC / Equipment')}</span>
                </button>
                <button
                  onClick={() => setAdminTab('maintenance')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold"
                >
                  {t('استعراض بلاغات الصيانة الطارئة', 'Check Emergency Repairs')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAINTENANCE TICKETS */}
        {adminTab === 'maintenance' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">{t('إدارة بلاغات الصيانة والزيارات', 'Maintenance Requests')}</h2>
            <div className="bg-[#0B192C] rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
                <thead className="bg-[#060E18] text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5"># الكود</th>
                    <th className="p-3.5">العميل</th>
                    <th className="p-3.5">المحافظة</th>
                    <th className="p-3.5">الجهاز</th>
                    <th className="p-3.5">المشكلة</th>
                    <th className="p-3.5">الحالة</th>
                    <th className="p-3.5">الفني المعين</th>
                    <th className="p-3.5">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {maintenanceList.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5">
                      <td className="p-3.5 font-mono text-[#C87D55] font-bold">{item.requestNumber}</td>
                      <td className="p-3.5 font-semibold text-white">
                        <div>{item.clientName}</div>
                        <div className="text-[11px] text-slate-400 font-mono" dir="ltr">{item.phone}</div>
                      </td>
                      <td className="p-3.5 text-slate-300">{item.governate}</td>
                      <td className="p-3.5 text-slate-300">{item.equipmentType}</td>
                      <td className="p-3.5 text-slate-300 max-w-xs truncate">{item.problemDesc}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'received' ? 'bg-amber-500/20 text-amber-300' :
                          item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300">{item.technicianName || '-'}</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => {
                            setActiveMaintenance(item);
                            setMStatus(item.status);
                            setMTechName(item.technicianName || '');
                            setMNotes(item.notes || '');
                            setMCost(item.cost || '');
                          }}
                          className="px-2.5 py-1 rounded bg-[#1E3E62] text-white hover:bg-[#C87D55] text-[11px]"
                        >
                          {t('تحديث', 'Manage')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTS MANAGEMENT */}
        {adminTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">{t('إدارة المنتجات والمكيفات', 'Manage Products')}</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProdForm({
                    nameAr: '',
                    nameEn: '',
                    category: 'مكيفات سبليت إنفرتر',
                    brand: '',
                    model: '',
                    capacity: '1.5 طن',
                    price: 350000,
                    showPrice: true,
                    condition: 'new',
                    status: 'available',
                    energyConsumption: 'موفر للطاقة',
                    warranty: 'ضمان سنة',
                    descAr: '',
                    descEn: '',
                    mainImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop',
                    isImportedEconomy: false,
                    isFeatured: true
                  });
                  setProductModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#C87D55] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{t('إضافة منتج جديد', 'Add Product')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {productsList.map((p) => (
                <div key={p.id} className="bg-[#0B192C] rounded-xl border border-slate-800 p-4 space-y-3">
                  <div className="aspect-video bg-black/40 rounded-lg overflow-hidden">
                    <img src={p.mainImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#C87D55] font-bold">{p.category}</span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{p.nameAr}</h4>
                    <p className="text-[11px] text-slate-400">{p.brand} ({p.capacity})</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="font-mono text-emerald-400">{p.price?.toLocaleString()} ريال</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setProdForm({
                            nameAr: p.nameAr,
                            nameEn: p.nameEn,
                            category: p.category,
                            brand: p.brand || '',
                            model: p.model || '',
                            capacity: p.capacity || '',
                            price: p.price || 0,
                            showPrice: p.showPrice !== false,
                            condition: p.condition || 'new',
                            status: p.status || 'available',
                            energyConsumption: p.energyConsumption || '',
                            warranty: p.warranty || '',
                            descAr: p.descAr,
                            descEn: p.descEn,
                            mainImage: p.mainImage,
                            isImportedEconomy: Boolean(p.isImportedEconomy),
                            isFeatured: Boolean(p.isFeatured)
                          });
                          setProductModalOpen(true);
                        }}
                        className="p-1 text-slate-300 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS MODERATION */}
        {adminTab === 'reviews' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">{t('مراجعة واعتماد تقييمات العملاء', 'Reviews Moderation')}</h2>
            <div className="space-y-3">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="bg-[#0B192C] p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{rev.clientName}</span>
                      <span className="text-[11px] text-slate-400">({rev.city})</span>
                      <span className="text-amber-400 text-xs">★ {rev.rating}</span>
                    </div>
                    <p className="text-xs text-slate-300 italic">"{rev.textAr}"</p>
                  </div>
                  <button
                    onClick={() => toggleReviewApproval(rev.id, rev.isApproved)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      rev.isApproved
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {rev.isApproved ? t('معتمد ومعروض', 'Approved') : t('اعتماد ونشر', 'Approve & Publish')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUOTE REQUESTS */}
        {adminTab === 'quotes' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">{t('طلبات عروض الأسعار والدراسات الهندسية', 'Quote Requests')}</h2>
            <div className="bg-[#0B192C] rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
                <thead className="bg-[#060E18] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3"># الكود</th>
                    <th className="p-3">العميل / المنشأة</th>
                    <th className="p-3">المحافظة</th>
                    <th className="p-3">نوع المشروع</th>
                    <th className="p-3">النظام المطلوب</th>
                    <th className="p-3">التفاصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {quoteList.map((q) => (
                    <tr key={q.id}>
                      <td className="p-3 font-mono text-[#C87D55]">{q.requestNumber}</td>
                      <td className="p-3 font-semibold text-white">
                        {q.clientName} {q.companyName && `(${q.companyName})`}
                        <div className="text-[11px] text-slate-400 font-mono" dir="ltr">{q.phone}</div>
                      </td>
                      <td className="p-3">{q.governate}</td>
                      <td className="p-3">{q.projectType}</td>
                      <td className="p-3">{q.requiredSystem}</td>
                      <td className="p-3 max-w-sm text-slate-300">{q.projectDesc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B192C] text-white rounded-2xl max-w-xl w-full p-6 border border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? t('تعديل بيانات المنتج', 'Edit Product') : t('إضافة منتج جديد للمعرض', 'Add Product')}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold">{t('اسم المنتج (عربي) *', 'Name (Ar) *')}</label>
                  <input
                    type="text"
                    required
                    value={prodForm.nameAr}
                    onChange={(e) => setProdForm({ ...prodForm, nameAr: e.target.value })}
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">{t('الاسم بالإنجليزية', 'Name (En)')}</label>
                  <input
                    type="text"
                    value={prodForm.nameEn}
                    onChange={(e) => setProdForm({ ...prodForm, nameEn: e.target.value })}
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">{t('الماركة / العلامة', 'Brand')}</label>
                  <input
                    type="text"
                    value={prodForm.brand}
                    onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">{t('السعة التبريدية', 'Capacity')}</label>
                  <input
                    type="text"
                    value={prodForm.capacity}
                    onChange={(e) => setProdForm({ ...prodForm, capacity: e.target.value })}
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">{t('السعر بالريال اليمني', 'Price (YER)')}</label>
                  <input
                    type="number"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">{t('التصنيف', 'Category')}</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full bg-[#060E18] border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="مكيفات سبليت إنفرتر">مكيفات سبليت إنفرتر</option>
                    <option value="غرف ومعدات تبريد">غرف ومعدات تبريد</option>
                    <option value="مكيفات صحراوية وطاقة شمسية">مكيفات صحراوية وطاقة شمسية</option>
                    <option value="قطع غيار وضواغط">قطع غيار وضواغط</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold">{t('رابط الصورة الرئيسية', 'Main Image URL')}</label>
                <input
                  type="text"
                  value={prodForm.mainImage}
                  onChange={(e) => setProdForm({ ...prodForm, mainImage: e.target.value })}
                  className="w-full bg-[#060E18] border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">{t('الوصف والمواصفات', 'Description')}</label>
                <textarea
                  rows={2}
                  value={prodForm.descAr}
                  onChange={(e) => setProdForm({ ...prodForm, descAr: e.target.value })}
                  className="w-full bg-[#060E18] border border-slate-700 rounded-lg p-2 text-white"
                ></textarea>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isImportedEconomy}
                    onChange={(e) => setProdForm({ ...prodForm, isImportedEconomy: e.target.checked })}
                    className="accent-[#C87D55]"
                  />
                  <span>{t('مستورد اقتصادي موفر', 'Imported Economy')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isFeatured}
                    onChange={(e) => setProdForm({ ...prodForm, isFeatured: e.target.checked })}
                    className="accent-[#C87D55]"
                  />
                  <span>{t('تمييز بالصفحة الرئيسية', 'Feature on Home')}</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300"
                >
                  {t('إلغاء', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#C87D55] text-white font-bold"
                >
                  {t('حفظ المنتج', 'Save Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Maintenance Update Modal */}
      {activeMaintenance && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B192C] text-white rounded-2xl max-w-md w-full p-6 border border-slate-700 space-y-4">
            <h3 className="text-base font-bold">
              {t('تحديث حالة بلاغ الصيانة', 'Update Ticket')} #{activeMaintenance.requestNumber}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block mb-1">{t('الحالة:', 'Status:')}</label>
                <select
                  value={mStatus}
                  onChange={(e) => setMStatus(e.target.value)}
                  className="w-full bg-[#060E18] border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="received">{t('مستلم بانتظار الفني', 'Received')}</option>
                  <option value="in_progress">{t('قيد الزيارة والمعاينة', 'In Progress')}</option>
                  <option value="parts_ordered">{t('بانتظار قطع الغيار', 'Parts Ordered')}</option>
                  <option value="completed">{t('تم الإنجاز بنجاح', 'Completed')}</option>
                  <option value="cancelled">{t('ملغي', 'Cancelled')}</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">{t('اسم الفني المسؤول:', 'Assigned Technician:')}</label>
                <input
                  type="text"
                  value={mTechName}
                  onChange={(e) => setMTechName(e.target.value)}
                  placeholder="م. أحمد / الفني سامي"
                  className="w-full bg-[#060E18] border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block mb-1">{t('تكلفة الإصلاح (ريال):', 'Repair Cost (YER):')}</label>
                <input
                  type="number"
                  value={mCost}
                  onChange={(e) => setMCost(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="25000"
                  className="w-full bg-[#060E18] border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block mb-1">{t('ملاحظات هندسية:', 'Technician Notes:')}</label>
                <textarea
                  rows={2}
                  value={mNotes}
                  onChange={(e) => setMNotes(e.target.value)}
                  placeholder="تم شحن الغاز وتغيير الكابستور..."
                  className="w-full bg-[#060E18] border border-slate-700 rounded-lg p-2 text-white"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMaintenance(null)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300"
                >
                  {t('إلغاء', 'Cancel')}
                </button>
                <button
                  type="button"
                  onClick={updateMaintenanceStatus}
                  className="px-5 py-2 rounded bg-[#C87D55] text-white font-bold"
                >
                  {t('تحديث التذكرة', 'Update Ticket')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
