import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { AdminStatsTab } from './AdminStatsTab.js';
import { AdminServicesTab } from './AdminServicesTab.js';
import { AdminProductsTab } from './AdminProductsTab.js';
import { AdminProjectsTab } from './AdminProjectsTab.js';
import { AdminRequestsTab } from './AdminRequestsTab.js';
import { AdminReviewsTab } from './AdminReviewsTab.js';
import { AdminGalleryTab } from './AdminGalleryTab.js';
import { AdminSettingsTab } from './AdminSettingsTab.js';
import { AdminSiteImagesTab } from './AdminSiteImagesTab.js';
import {
  LayoutDashboard,
  Wrench,
  Package,
  Building,
  FileText,
  Star,
  Image,
  Images,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  onExit: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const { user, logout } = useAuth();
  const { language, t } = useLanguage();
  const { settings, logoIconUrl } = useSettings();
  const [activeTab, setActiveTab] = useState<string>('stats');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'stats', labelAr: 'لوحة المؤشرات العامة', labelEn: 'Overview', icon: LayoutDashboard },
    { id: 'services', labelAr: 'الخدمات الهندسية', labelEn: 'Services', icon: Wrench },
    { id: 'products', labelAr: 'الأجهزة والمعدات', labelEn: 'Products & Deals', icon: Package },
    { id: 'projects', labelAr: 'المشاريع المنفذة', labelEn: 'Projects', icon: Building },
    { id: 'requests', labelAr: 'طلبات العملاء والرسائل', labelEn: 'Inquiries & Tickets', icon: FileText },
    { id: 'reviews', labelAr: 'مراجعة التقييمات', labelEn: 'Reviews Moderation', icon: Star },
    { id: 'gallery', labelAr: 'معارض الأعمال السابقة للأقسام', labelEn: 'Section Galleries & Works', icon: Image },
    { id: 'site-images', labelAr: 'صور وهوية الموقع (المالك)', labelEn: 'Site Images & Logo', icon: Images },
    { id: 'settings', labelAr: 'إعدادات الشركة وقنوات الاتصال', labelEn: 'Settings & Contact', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    onExit();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-[#0B192C] text-white border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#1E3E62] text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#060E18] border border-[#C87D55] p-0.5 flex items-center justify-center overflow-hidden shadow">
              <img
                key={`admin-logo-${settings?.logoUpdatedAt || settings?.updatedAt || 'init'}`}
                src={logoIconUrl}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo-icon.svg';
                }}
                alt="AL-ARRIQI INVERCOOL"
                className="w-full h-full object-contain transition-all duration-300"
              />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tight leading-tight">
                {language === 'ar' ? 'لوحة تحكم العريقي إنفركول' : 'AL-ARRIQI INVERCOOL Admin'}
              </h1>
              <span className="text-[10px] text-slate-400 font-mono block">
                {t('لوحة الإدارة الشاملة والتحكم المباشر', 'Commercial Admin Management')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E3E62] hover:bg-[#2A5280] text-xs font-bold transition text-slate-200"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C87D55]" />
            <span>{t('عرض الموقع الرئيسي', 'View Live Site')}</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-xs font-bold transition text-white shadow"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('تسجيل الخروج', 'Logout')}</span>
          </button>
        </div>
      </header>

      {/* Main Layout (Sidebar + Content) */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Sidebar Nav */}
        <aside
          className={`w-full md:w-64 shrink-0 space-y-1 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm h-fit ${
            mobileMenuOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {t('أقسام لوحة الإدارة', 'Navigation')}
          </div>

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-start ${
                  isActive
                    ? 'bg-[#0B192C] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C87D55]' : 'text-slate-400'}`} />
                <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={onExit}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 md:hidden"
            >
              <ExternalLink className="w-4 h-4 text-[#C87D55]" />
              <span>{t('العودة للموقع الرئيسي', 'Back to website')}</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'stats' && <AdminStatsTab onSelectTab={setActiveTab} />}
          {activeTab === 'services' && <AdminServicesTab />}
          {activeTab === 'products' && <AdminProductsTab />}
          {activeTab === 'projects' && <AdminProjectsTab />}
          {activeTab === 'requests' && <AdminRequestsTab />}
          {activeTab === 'reviews' && <AdminReviewsTab />}
          {activeTab === 'gallery' && <AdminGalleryTab />}
          {activeTab === 'site-images' && <AdminSiteImagesTab />}
          {activeTab === 'settings' && <AdminSettingsTab />}
        </main>
      </div>
    </div>
  );
};
