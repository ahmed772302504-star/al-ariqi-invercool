import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { api } from '../../services/api.js';
import { Review } from '../../types.js';
import { Star, CheckCircle2, XCircle, Trash2, Plus, AlertCircle, X } from 'lucide-react';

export const AdminReviewsTab: React.FC = () => {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Add review modal
  const [isAdding, setIsAdding] = useState(false);
  const [clientName, setClientName] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState(5);
  const [textAr, setTextAr] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadReviews = () => {
    setLoading(true);
    api.getAllReviewsAdmin()
      .then(setReviews)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleApprove = async (id: string, isApproved: boolean) => {
    try {
      await api.updateReview(id, { isApproved: !isApproved });
      loadReviews();
    } catch (err: any) {
      alert(err.message || 'Failed to update review status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التقييم نهائياً؟')) {
      try {
        await api.deleteReview(id);
        loadReviews();
      } catch (err: any) {
        alert(err.message || 'Failed to delete review');
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !textAr.trim()) {
      setError('يرجى ملء الحقول المطلوبة');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await api.submitReview({
        clientName: clientName.trim(),
        city: city.trim() || 'اليمن',
        rating,
        textAr: textAr.trim()
      });
      setIsAdding(false);
      setClientName('');
      setCity('');
      setTextAr('');
      loadReviews();
    } catch (err: any) {
      setError(err.message || 'Failed to add review');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t('إدارة تقييمات وآراء العملاء', 'Manage Customer Reviews')}</h2>
          <p className="text-xs text-slate-500">{t('الموافقة على التقييمات الواردة، اعتمادها، أو إضافة تقييمات مباشرة', 'Approve customer submissions or add verified testimonials')}</p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0B192C] text-white hover:bg-[#1E3E62] text-xs font-bold transition flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-[#C87D55]" />
          <span>{t('إضافة تقييم معتمد جديد', 'Add Verified Review')}</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">{t('جاري التحميل...', 'Loading...')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`rounded-2xl border p-5 shadow-sm space-y-4 flex flex-col justify-between transition ${
                rev.isApproved ? 'bg-white border-slate-200' : 'bg-amber-50/50 border-amber-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>

                  {rev.isApproved ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      معتمد ومنشور
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold animate-pulse">
                      قيد الموافقة
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{rev.textAr}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <strong className="text-xs text-slate-900 block">{rev.clientName}</strong>
                  <span className="text-[11px] text-slate-400">{rev.city}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleApprove(rev.id, rev.isApproved)}
                    className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      rev.isApproved
                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow'
                    }`}
                    title={rev.isApproved ? 'إلغاء النشر' : 'موافقة ونشر'}
                  >
                    {rev.isApproved ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{rev.isApproved ? 'إلغاء النشر' : 'موافقة'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">إضافة تقييم عميل معتمد</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم العميل أو المنشأة *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المحافظة أو المدينة</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="صنعاء، تعز، عدن..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">التقييم (1 إلى 5 نجوم)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                >
                  <option value={5}>5 نجوم (ممتاز جداً)</option>
                  <option value={4}>4 نجوم (جيد جداً)</option>
                  <option value={3}>3 نجوم (متوسط)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نص التقييم والتجربة *</label>
                <textarea
                  rows={4}
                  required
                  value={textAr}
                  onChange={(e) => setTextAr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#C87D55] text-white font-bold shadow hover:bg-[#B86B3E]"
                >
                  {saving ? 'جاري الحفظ...' : 'نشر التقييم فوراً'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
