import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { api } from '../services/api.js';
import { Review } from '../types.js';
import { staticReviews } from '../data/staticReviews.js';
import { Star, MessageSquarePlus, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>(staticReviews);
  const [loading, setLoading] = useState(false);

  // Form state
  const [clientName, setClientName] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState(5);
  const [textAr, setTextAr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.getApprovedReviews()
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!clientName.trim() || !textAr.trim()) {
      setErrorMsg(t('يرجى كتابة اسمك ونص التقييم', 'Please provide your name and review text'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitReview({
        clientName: clientName.trim(),
        city: city.trim() || 'اليمن',
        rating,
        textAr: textAr.trim(),
      });
      setSuccessMsg(res.message);
      setClientName('');
      setCity('');
      setTextAr('');
      setRating(5);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-[#0B192C] text-white p-8 sm:p-12 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3E62] text-[#C87D55] text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-[#C87D55]" />
            <span>{t('تقييمات وآراء العملاء', 'Client Reviews & Ratings')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            {t('ثقة عملائنا في الجمهورية اليمنية', 'Customer Trust Across Yemen')}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t(
              'شهادات وآراء حقيقية من عملائنا في المنشآت التجارية والصناعية والمنازل حول سرعة الاستجابة وجودة الصيانة الهندية.',
              'Genuine feedback from our valued clients in commercial towers, cold stores, and homes regarding our HVAC maintenance and installation.'
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Reviews List (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C87D55]"></span>
            <span>{t('آراء العملاء المنشورة', 'Published Reviews')} ({reviews.length})</span>
          </h2>

          {loading ? (
            <div className="text-center py-16 text-slate-500">{t('جاري التحميل...', 'Loading...')}</div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              {t('لا توجد تقييمات منشورة بعد، كن أول من يضيف تقييماً!', 'No reviews yet. Be the first to share your experience!')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                        {t('موثق', 'Verified')}
                      </span>
                    </div>

                    <p className="text-slate-700 text-sm leading-relaxed italic">
                      "{language === 'ar' ? rev.textAr : rev.textEn || rev.textAr}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-slate-900 block">{rev.clientName}</strong>
                      <span className="text-slate-400">{rev.city}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Submit Review Form (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg space-y-5 sticky top-28">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#C87D55] text-xs font-bold">
                <MessageSquarePlus className="w-4 h-4" />
                <span>{t('شاركنا رأيك', 'Add Your Review')}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {t('أضف تقييمك وتجربتك معنا', 'Rate Our Service')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('يتم مراجعة التقييم ونشره خلال فترة وجيزة.', 'Reviews are approved by our team before public display.')}
              </p>
            </div>

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('الاسم الكريم *', 'Your Name *')}</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder={t('مثال: م. فهد / شركة...', 'e.g. Eng. Fahad')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('المحافظة / المدينة', 'Governorate / City')}</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={t('مثال: صنعاء، تعز، عدن...', 'e.g. Sanaa, Taiz, Aden')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('التقييم بالنجوم *', 'Rating *')}</label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRating(num)}
                      className="p-1 hover:scale-125 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${num <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('نص التجربة والتقييم *', 'Review Comment *')}</label>
                <textarea
                  required
                  rows={4}
                  value={textAr}
                  onChange={(e) => setTextAr(e.target.value)}
                  placeholder={t('اكتب تفاصيل تجربتك مع فريق العريقي إنفركول...', 'Write your experience with AL-ARRIQI INVERCOOL...')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#C87D55] hover:bg-[#B86B3E] disabled:bg-slate-300 text-white font-bold text-sm shadow transition"
              >
                {submitting ? t('جاري الإرسال...', 'Submitting...') : t('إرسال التقييم', 'Submit Review')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
