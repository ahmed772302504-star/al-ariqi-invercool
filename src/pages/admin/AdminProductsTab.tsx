import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { api } from '../../services/api.js';
import { Product } from '../../types.js';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  X,
  Eye,
  AlertCircle,
  Tag,
  Upload
} from 'lucide-react';
import { ImageUploader } from '../../components/common/ImageUploader.js';

export const AdminProductsTab: React.FC = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal / Form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadProducts = () => {
    setLoading(true);
    api.getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEdit = (p: Product) => {
    setCurrentProduct({ ...p });
    setIsEditing(true);
    setError('');
  };

  const handleCreateNew = () => {
    setCurrentProduct({
      id: '',
      slug: '',
      nameAr: '',
      nameEn: '',
      descAr: '',
      descEn: '',
      category: 'تكييف مركزي',
      condition: 'new',
      isImportedEconomy: false,
      model: '',
      brand: 'AL-ARRIQI INVERCOOL',
      capacity: '24,000 BTU (2 Ton)',
      price: 0,
      showPrice: false,
      status: 'available',
      mainImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
      additionalImages: [],
      energyConsumption: 'Inverter Eco A+++',
      warranty: 'ضمان سنة كاملة',
      manufacturingYear: '2024',
      notes: ''
    });
    setIsEditing(true);
    setError('');
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف المنتج: "${name}"؟`)) {
      try {
        await api.deleteProduct(id);
        loadProducts();
      } catch (err: any) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct?.nameAr || !currentProduct?.category) {
      setError('يرجى ملء اسم المنتج وقسمه');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (currentProduct.id) {
        await api.updateProduct(currentProduct.id, currentProduct);
      } else {
        await api.createProduct(currentProduct as any);
      }
      setIsEditing(false);
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.nameAr.toLowerCase().includes(search.toLowerCase()) ||
      (p.model && p.model.toLowerCase().includes(search.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t('إدارة أجهزة ومعدات التكييف والتبريد', 'Manage Equipment & Products')}</h2>
          <p className="text-xs text-slate-500">{t('إضافة أجهزة جديدة، تحديد المستعمل النظيف، الأجهزة الاقتصادية، وتحديث الأسعار وحالة التوفر', 'Manage new & used stock, economy deals, pricing, and availability')}</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 rounded-xl bg-[#0B192C] text-white hover:bg-[#1E3E62] text-xs font-bold transition flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-[#C87D55]" />
          <span>{t('إضافة جهاز أو قطعة جديدة', 'Add New Product')}</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('ابحث بالاسم، الموديل، الماركة...', 'Search name, model, brand...')}
            className="w-full ps-9 pe-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#C87D55]"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none"
        >
          <option value="all">كافة الأقسام</option>
          <option value="تكييف مركزي">تكييف مركزي</option>
          <option value="وحدات VRF">وحدات VRF</option>
          <option value="تكييف جداري سبليت">سبليت</option>
          <option value="تكييف دولابي">دولابي</option>
          <option value="غرف تبريد وتجميد">غرف تبريد</option>
          <option value="قطع غيار واكسسوارات">قطع غيار</option>
        </select>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">{t('جاري التحميل...', 'Loading...')}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">الصورة</th>
                  <th className="py-3 px-4 text-start">{t('اسم الجهاز / الموديل', 'Product / Model')}</th>
                  <th className="py-3 px-4 text-start">{t('القسم', 'Category')}</th>
                  <th className="py-3 px-4 text-center">{t('الحالة الفنية', 'Condition')}</th>
                  <th className="py-3 px-4 text-center">{t('السعر', 'Price')}</th>
                  <th className="py-3 px-4 text-center">{t('التوفر', 'Availability')}</th>
                  <th className="py-3 px-4 text-end">{t('الإجراءات', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-4">
                      <img src={p.mainImage} alt={p.nameAr} className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                    </td>
                    <td className="py-2.5 px-4">
                      <strong className="text-slate-900 block">{p.nameAr}</strong>
                      <span className="text-[11px] text-slate-400 font-mono">{p.brand} - {p.model}</span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {p.condition === 'used' ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          مستعمل نظيف
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          جديد كلياً
                        </span>
                      )}
                      {p.isImportedEconomy && (
                        <span className="block mt-0.5 px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[9px] font-bold">
                          مستورد اقتصادي
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-800">
                      {p.showPrice && p.price ? `${p.price.toLocaleString()} YER` : 'عند الطلب'}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {p.status === 'available' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          متوفر
                        </span>
                      ) : p.status === 'reserved' ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          محجوز
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                          تم البيع
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#0B192C] hover:text-white text-slate-700 transition"
                          title="تعديل"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.nameAr)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isEditing && currentProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {currentProduct.id ? 'تعديل بيانات الجهاز' : 'إضافة جهاز أو قطعة جديدة'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم الجهاز بالعربي *</label>
                  <input
                    type="text"
                    required
                    value={currentProduct.nameAr || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, nameAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الاسم بالإنجليزي</label>
                  <input
                    type="text"
                    value={currentProduct.nameEn || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, nameEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">القسم / الفئة</label>
                  <select
                    value={currentProduct.category || 'تكييف مركزي'}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  >
                    <option value="تكييف مركزي">تكييف مركزي</option>
                    <option value="وحدات VRF">وحدات VRF</option>
                    <option value="تكييف جداري سبليت">تكييف جداري سبليت</option>
                    <option value="غرف تبريد وتجميد">غرف تبريد وتجميد</option>
                    <option value="قطع غيار واكسسوارات">قطع غيار واكسسوارات</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الحالة الفنية للجهاز</label>
                  <select
                    value={currentProduct.condition || 'new'}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, condition: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  >
                    <option value="new">جديد بالكرتون بضمان معتمد</option>
                    <option value="used">مستعمل نظيف مفحوص هندسياً</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الماركة / الشركة المصنعة</label>
                  <input
                    type="text"
                    value={currentProduct.brand || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, brand: e.target.value })}
                    placeholder="Gree, LG, Midea, York, Daikin..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الموديل</label>
                  <input
                    type="text"
                    value={currentProduct.model || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">السعة التبريدية (BTU / طن)</label>
                  <input
                    type="text"
                    value={currentProduct.capacity || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, capacity: e.target.value })}
                    placeholder="مثال: 24,000 BTU / 2 Ton"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">حالة التوفر</label>
                  <select
                    value={currentProduct.status || 'available'}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  >
                    <option value="available">متوفر حالياً</option>
                    <option value="reserved">محجوز مؤقتاً</option>
                    <option value="sold">تم البيع (Sold Out)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">السعر (بالريال اليمني)</label>
                  <input
                    type="number"
                    value={currentProduct.price || 0}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <ImageUploader
                    label="صورة الجهاز / المنتج الرئيسية"
                    value={currentProduct.mainImage || ''}
                    onChange={(url) => setCurrentProduct({ ...currentProduct, mainImage: url })}
                    required
                    aspectHint="اختر صورة نقية للمكيف أو القطعة"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap items-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={currentProduct.isImportedEconomy || false}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, isImportedEconomy: e.target.checked })}
                    className="rounded text-[#C87D55]"
                  />
                  <span>تمييز كـ "مستورد اقتصادي عالي الجودة"</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={currentProduct.showPrice || false}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, showPrice: e.target.checked })}
                    className="rounded text-[#C87D55]"
                  />
                  <span>إظهار السعر للزوار (إلغاء التحديد يظهر: "السعر عند الطلب")</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الوصف العام والمواصفات</label>
                <textarea
                  rows={3}
                  value={currentProduct.descAr || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, descAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات الفحص والضمان</label>
                <input
                  type="text"
                  value={currentProduct.notes || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, notes: e.target.value })}
                  placeholder="تم فحص الضغط والشحنة، خالي من اللحامات الخارجية..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-[#C87D55] hover:bg-[#B86B3E] text-white font-bold shadow"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ بيانات المنتج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
