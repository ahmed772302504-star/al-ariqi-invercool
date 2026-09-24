import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { api } from '../../services/api.js';
import {
  Wrench,
  Package,
  Building,
  Star,
  Clock,
  CheckCircle2,
  FileText,
  UserCheck,
  PhoneCall,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface AdminStatsTabProps {
  onSelectTab: (tab: string) => void;
}

export const AdminStatsTab: React.FC<AdminStatsTabProps> = ({ onSelectTab }) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">{t('جاري تحميل الإحصائيات...', 'Loading statistics...')}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome Card */}
      <div className="bg-[#0B192C] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black">
            {t('مرحباً بك في لوحة تحكم العريقي إنفركول', 'Welcome to AL-ARRIQI INVERCOOL Control Panel')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {t('إدارة شاملة لكافة محتويات الموقع، الخدمات، الأجهزة، طلبات الصيانة، وعروض الأسعار.', 'Complete management of site content, services, products, and incoming customer requests.')}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#C87D55] bg-[#1E3E62] px-3.5 py-1.5 rounded-xl border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{t('النظام متصل ونشط', 'System Online & Operational')}</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Services Count */}
        <div
          onClick={() => onSelectTab('services')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-[#C87D55] cursor-pointer transition space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t('الخدمات الهندسية', 'Engineering Services')}</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.totalServices || 17}</div>
          <span className="text-[11px] text-slate-400 block">{t('نشطة ومعروضة في الموقع', 'Active on website')}</span>
        </div>

        {/* Products Count */}
        <div
          onClick={() => onSelectTab('products')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-[#C87D55] cursor-pointer transition space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t('الأجهزة والمعدات', 'Products & Units')}</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.totalProducts || 0}</div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="text-emerald-600 font-bold">{stats?.availableProducts || 0} {t('متوفر', 'avail')}</span>
            <span>•</span>
            <span className="text-rose-600 font-bold">{stats?.soldProducts || 0} {t('مباع', 'sold')}</span>
          </div>
        </div>

        {/* Projects Count */}
        <div
          onClick={() => onSelectTab('projects')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-[#C87D55] cursor-pointer transition space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t('المشاريع المنفذة', 'Executed Projects')}</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.totalProjects || 0}</div>
          <span className="text-[11px] text-slate-400 block">{t('في كافة المحافظات اليمنية', 'Across Yemen governorates')}</span>
        </div>

        {/* Total Incoming Customer Requests */}
        <div
          onClick={() => onSelectTab('requests')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-[#C87D55] cursor-pointer transition space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{t('طلبات العملاء الإجمالية', 'Total Customer Requests')}</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {(stats?.totalMaintenanceRequests || 0) + (stats?.totalQuoteRequests || 0) + (stats?.totalTechnicianRequests || 0)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{stats?.pendingMaintenanceRequests || 0} {t('طلب صيانة قيد الانتظار', 'pending maintenance')}</span>
          </div>
        </div>
      </div>

      {/* Secondary Row: Reviews & Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests Breakdown Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C87D55]" />
            <span>{t('توزيع طلبات العملاء', 'Request Distribution')}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <span className="font-semibold text-slate-700">{t('طلبات الصيانة الميدانية', 'Maintenance Requests')}</span>
              <span className="font-mono font-bold text-slate-900">{stats?.totalMaintenanceRequests || 0}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <span className="font-semibold text-slate-700">{t('طلبات عروض الأسعار للمشاريع', 'Project Quotes')}</span>
              <span className="font-mono font-bold text-slate-900">{stats?.totalQuoteRequests || 0}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <span className="font-semibold text-slate-700">{t('حجوزات زيارة الفنيين', 'Technician Bookings')}</span>
              <span className="font-mono font-bold text-slate-900">{stats?.totalTechnicianRequests || 0}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <span className="font-semibold text-slate-700">{t('رسائل التواصل المباشر', 'Contact Messages')}</span>
              <span className="font-mono font-bold text-slate-900">{stats?.totalContactMessages || 0}</span>
            </div>
          </div>
        </div>

        {/* Reviews Moderation Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{t('مراجعة تقييمات العملاء', 'Customer Reviews')}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-800">
              <span className="font-semibold">{t('التقييمات المعتمدة والمنشورة', 'Approved Reviews')}</span>
              <span className="font-mono font-bold">{stats?.approvedReviews || 0}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 text-amber-800">
              <span className="font-semibold">{t('تقييمات قيد المراجعة والموافقة', 'Pending Approval')}</span>
              <span className="font-mono font-bold">{stats?.pendingReviews || 0}</span>
            </div>

            {stats?.pendingReviews > 0 && (
              <button
                onClick={() => onSelectTab('reviews')}
                className="w-full py-2 rounded-xl bg-[#0B192C] text-white text-xs font-bold hover:bg-[#1E3E62] transition"
              >
                {t('مراجعة التقييمات المعلقة الآن', 'Review Pending Submissions')}
              </button>
            )}
          </div>
        </div>

        {/* Quick Help & Guidelines */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs">
          <h3 className="text-sm font-bold text-slate-900">{t('إرشادات الإدارة', 'Admin Guide')}</h3>
          <p className="text-slate-600 leading-relaxed">
            {t(
              'كل تعديل تقوم به على المنتجات أو الخدمات أو المشاريع أو أرقام التواصل ينعكس فوراً ومباشرة على الموقع دون الحاجة لإعادة تشغيل أو كتابة كود.',
              'All updates to products, services, projects, or contact channels reflect instantly on the live site without rebuilding or touching code.'
            )}
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500">
            <span>{t('حفظ البيانات:', 'Database:')}</span>
            <span className="font-mono text-emerald-600 font-bold">JSON Persistent Store</span>
          </div>
        </div>
      </div>
    </div>
  );
};
