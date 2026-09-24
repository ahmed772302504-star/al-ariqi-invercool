import React, { useState } from 'react';
import { useApp } from '../context';
import {
  Wrench,
  Snowflake,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Building,
  Star,
  Clock,
  Layers,
  ShoppingBag,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Calculator,
  UserCheck,
  Quote,
  ThumbsUp
} from 'lucide-react';

interface HomeProps {
  setCurrentTab: (tab: string) => void;
  openQuoteModal: () => void;
  openTechModal: () => void;
}

export const HomeView: React.FC<HomeProps> = ({
  setCurrentTab,
  openQuoteModal,
  openTechModal
}) => {
  const { lang, t, services, products, projects, reviews, settings, submitReview } = useApp();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewText) return;
    const res = await submitReview({
      clientName: reviewName,
      city: reviewCity || 'صنعاء',
      rating: reviewRating,
      textAr: reviewText
    });
    if (res.success) {
      setReviewSuccess(t('شكراً لك! تم إرسال تقييمك وسيظهر بعد المراجعة.', 'Thank you! Your review was sent for moderation.'));
      setReviewName('');
      setReviewCity('');
      setReviewText('');
      setTimeout(() => {
        setReviewSuccess('');
        setReviewModalOpen(false);
      }, 2500);
    }
  };

  const phonePrimary = settings?.phonePrimary || '770931413';
  const whatsappPrimary = settings?.whatsappPrimary || '770931413';

  return (
    <div className="space-y-16 pb-16 bg-slate-50">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0B192C] text-white pt-12 pb-20 md:py-24 overflow-hidden">
        {/* Subtle background graphics */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C87D55_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C87D55]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#1E3E62]/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-right rtl:lg:text-right ltr:lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-[#E0956E] font-bold backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{t('حلول هندسية متكاملة للتكييف والتبريد وأنظمة HVAC في الجمهورية اليمنية', 'Integrated HVAC & Cold Chain Engineering Across Yemen')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                {lang === 'ar' ? (
                  <>
                    الريادة في التكييف الاقتصادي <br />
                    <span className="bg-gradient-to-r from-[#C87D55] via-[#E0956E] to-amber-200 bg-clip-text text-transparent">
                      وتبريد المنشآت والمشاريع
                    </span>
                  </>
                ) : (
                  <>
                    Pioneering Energy-Smart Cooling & <br />
                    <span className="bg-gradient-to-r from-[#C87D55] via-[#E0956E] to-amber-200 bg-clip-text text-transparent">
                      Advanced HVAC Solutions
                    </span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t(
                  'نجمع بين الخبرة الهندسية المعتمدة وأحدث تقنيات الإنفرتر الموفرة للطاقة لتوفير أقصى برودة بأقل استهلاك للكهرباء وملاءمة استثنائية لمنظومات الطاقة الشمسية والظروف المناخية في كافة محافظات اليمن.',
                  'Combining certified engineering expertise with state-of-the-art inverter technologies, delivering peak cooling performance with minimum power draw tailored for Yemeni solar & power setups.'
                )}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={openQuoteModal}
                  id="hero-quote-cta"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C87D55] to-[#A85D35] hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-xl shadow-[#C87D55]/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t('طلب دراسة هندسية وعرض سعر', 'Request Engineering Quote')}</span>
                </button>

                <button
                  onClick={openTechModal}
                  id="hero-tech-cta"
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold border border-white/20 flex items-center gap-2 transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-[#C87D55]" />
                  <span>{t('طلب زيارة فني كشف', 'Book Diagnostic Tech')}</span>
                </button>

                <button
                  onClick={() => setCurrentTab('calculator')}
                  id="hero-calc-cta"
                  className="px-4 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>{t('حاسبة سعة التكييف', 'AC Calculator')}</span>
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center lg:text-right rtl:lg:text-right ltr:lg:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">65%+</div>
                  <div className="text-[11px] text-slate-400">{t('توفير في استهلاك الكهرباء', 'Power Savings')}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#C87D55]">24/7</div>
                  <div className="text-[11px] text-slate-400">{t('استجابة طوارئ وصيانة', 'Emergency Support')}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                  <div className="text-[11px] text-slate-400">{t('قطع غيار أصلية وضمان', 'Genuine Parts')}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#C87D55]">22</div>
                  <div className="text-[11px] text-slate-400">{t('محافظة مشمولة بالخدمة', 'Covered Regions')}</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Card / Interactive Spotlight (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-br from-[#1E3E62] to-[#0B192C] p-6 border border-white/15 shadow-2xl space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C87D55] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    {t('ضمان العريقي إنفركول المعتمد', 'Certified Invercool Quality')}
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    {t('متوافق مع الطاقة الشمسية', 'Solar Ready')}
                  </span>
                </div>

                <div className="aspect-16/10 rounded-xl overflow-hidden relative shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop"
                    alt="Invercool HVAC"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 text-white text-xs">
                    <span className="font-bold block">{t('مكيفات إنفرتر ومعدات تبريد مستوردة', 'Inverter ACs & Cooling Units')}</span>
                    <span className="text-[10px] text-slate-300">{t('فحص هندسي دقيق مع التوصيل والتركيب', 'Inspected, delivered & installed')}</span>
                  </div>
                </div>

                {/* Instant Actions inside Card */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <a
                    href={`tel:${phonePrimary}`}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-[#C87D55]" />
                    <span dir="ltr">{phonePrimary}</span>
                  </a>

                  <a
                    href={`https://wa.me/967${whatsappPrimary.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t('واتساب مباشر', 'WhatsApp')}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <span className="text-xs font-bold text-[#A85D35] bg-[#C87D55]/10 px-3 py-1 rounded-full">
              {t('حلول وخدمات هندسية', 'Engineering Services')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B192C] mt-2">
              {t('خدمات التكييف والتبريد المركزي المتكاملة', 'Integrated HVAC & Refrigeration Services')}
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('services')}
            className="text-xs font-bold text-[#0B192C] hover:text-[#C87D55] flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>{t('عرض كافة الخدمات (6)', 'View All Services (6)')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.slice(0, 3).map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-[#C87D55]/60 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={srv.image}
                  alt={srv.titleAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3">
                  <span className="bg-[#0B192C]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow backdrop-blur-xs">
                    {lang === 'ar' ? srv.titleAr : srv.titleEn}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {lang === 'ar' ? srv.shortDescAr : srv.shortDescEn}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentTab('services')}
                    className="text-xs font-bold text-[#C87D55] hover:underline"
                  >
                    {t('المواصفات والطلب', 'Specs & Request')}
                  </button>
                  <button
                    onClick={openQuoteModal}
                    className="text-[11px] text-slate-500 hover:text-slate-900 font-semibold"
                  >
                    {t('طلب عرض سعر', 'Quote')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS & INVERTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              {t('مكيفات التوفير الذكية', 'Smart Inverter Units')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B192C] mt-2">
              {t('المكيفات الاقتصادية والأجهزة المتوفرة بالمخزن', 'Featured AC Units & In-Stock Equipment')}
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('products')}
            className="text-xs font-bold text-[#0B192C] hover:text-[#C87D55] flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>{t('تصفح المعرض الكامل', 'Browse Full Store')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-[#C87D55]/60 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={item.mainImage}
                  alt={item.nameAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-col gap-1">
                  {item.isImportedEconomy && (
                    <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {t('مستورد اقتصادي', 'Imported Eco')}
                    </span>
                  )}
                  <span className="bg-[#0B192C]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.capacity}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold">{item.brand}</div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
                    {lang === 'ar' ? item.nameAr : item.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {lang === 'ar' ? item.descAr : item.descEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    {item.showPrice && item.price ? (
                      <span className="text-xs font-black text-slate-900">
                        {item.price.toLocaleString()} ريال
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-[#A85D35]">
                        {t('بالطلب / العرض', 'On Request')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setCurrentTab('products')}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#C87D55] hover:text-white text-xs font-bold transition-colors"
                  >
                    {t('عرض التفاصيل', 'Details')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FAST AC SIZING CALCULATOR TEASER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0B192C] via-[#1E3E62] to-[#0B192C] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/15 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-amber-300 font-bold">
                <Calculator className="w-3.5 h-3.5" />
                <span>{t('أداة مجانية ودقيقة 100% مطابقة لطقس اليمن', '100% Free Precision AC Sizing Tool for Yemen')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">
                {t('لا تشترِ مكيفك قبل حساب السعة المناسبة لغرفتك ومحافظتك!', 'Calculate your exact AC size before buying!')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {t(
                  'تختلف سعة التبريد المطلوبة في صنعاء وذمار عن عدن والحديدة ومأرب بنسبة تصل إلى 35% نظراً لارتفاع الرطوبة والحرارة. جرب حاسبتنا الهندسية واحصل على السعة الدقيقة فوراً.',
                  'Cooling capacity needs differ significantly between highland and coastal/desert Yemeni regions. Use our calculator to discover your exact required tonnage and power savings.'
                )}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={() => setCurrentTab('calculator')}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C87D55] to-[#A85D35] hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#C87D55]/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Calculator className="w-4 h-4" />
                <span>{t('ابدأ حساب سعة التكييف الآن', 'Open AC Sizing Calculator')}</span>
              </button>

              <button
                onClick={openTechModal}
                className="w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 transition-colors text-center"
              >
                {t('أو اطلب فني للمعاينة الميدانية', 'Or Request On-site Tech')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER REVIEWS & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              {t('آراء عملائنا وشركاء النجاح', 'Client Testimonials')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B192C] mt-2">
              {t('ثقة متبادلة وتجارب حقيقية في مختلف المحافظات', 'Trusted By Homes & Businesses in Yemen')}
            </h2>
          </div>

          <button
            onClick={() => setReviewModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold transition-colors self-start sm:self-auto flex items-center gap-1.5"
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('أضف تقييمك وتجربتك', 'Write a Review')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{lang === 'ar' ? rev.textAr : rev.textEn || rev.textAr}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{rev.clientName}</span>
                  <span className="text-[11px] text-slate-500">{rev.city}</span>
                </div>
                <div className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                  {t('عميل موثق', 'Verified')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              {t('شاركنا تجربتك وتقييمك لخدمات العريقي إنفركول', 'Share your review for Invercool')}
            </h3>

            {reviewSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl text-center font-bold">
                {reviewSuccess}
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('الاسم الكريم *', 'Your Name *')}</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                    placeholder="م. محمد"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('المدينة / المحافظة', 'City / Governorate')}</label>
                  <input
                    type="text"
                    value={reviewCity}
                    onChange={(e) => setReviewCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                    placeholder="صنعاء / عدن"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('التقييم (من 5 نجوم)', 'Rating (Stars)')}</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-slate-300 hover:text-amber-400"
                      >
                        <Star className={`w-6 h-6 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('رأيك وتجربتك *', 'Your Review *')}</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900"
                    placeholder={t('اكتب تعليقك حول الخدمة وجودة التكييف...', 'Write your comments about service & cooling quality...')}
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100"
                  >
                    {t('إلغاء', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#0B192C] hover:bg-[#1E3E62]"
                  >
                    {t('إرسال التقييم', 'Submit Review')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
