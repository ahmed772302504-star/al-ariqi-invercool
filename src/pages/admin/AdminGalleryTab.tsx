import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { api } from '../../services/api.js';
import { GalleryItem, Service } from '../../types.js';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  Video,
  Eye,
  Layers,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  Play,
  Building2,
  MapPin,
  Maximize2,
  Upload,
  Star,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { ImageUploader } from '../../components/common/ImageUploader.js';
import { VideoUploader } from '../../components/common/VideoUploader.js';
import { Lightbox } from '../../components/common/Lightbox.js';
import { compressImage } from '../../utils/imageOptimizer.js';

const YEMEN_CITIES = [
  'صنعاء',
  'عدن',
  'إب',
  'الحديدة',
  'تعز',
  'حضرموت',
  'ذمار',
  'مأرب',
  'عمران',
  'صعدة',
  'حجة',
  'شبوة',
  'لحج',
  'أبين',
  'المهرة'
];

export const AdminGalleryTab: React.FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilterService, setSelectedFilterService] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State (Add or Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Form Fields
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [clientName, setClientName] = useState('');
  const [location, setLocation] = useState('صنعاء');
  const [serviceId, setServiceId] = useState<string>('');
  const [category, setCategory] = useState('صيانة وإصلاح أجهزة التكييف');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [extraImageUrl, setExtraImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [captionAr, setCaptionAr] = useState('');
  const [captionEn, setCaptionEn] = useState('');
  const [order, setOrder] = useState<number>(0);

  // Studio / Device multi-image upload state for extra photos
  const extraImagesInputRef = useRef<HTMLInputElement>(null);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const [extraUploadProgress, setExtraUploadProgress] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Lightbox Preview
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getGallery('all').catch(() => []),
      api.getServices().catch(() => [])
    ])
      .then(([gal, srvs]) => {
        setItems(gal);
        setServices(srvs);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = (presetServiceId?: string) => {
    setEditingItem(null);
    setTitleAr('');
    setTitleEn('');
    setClientName('');
    setLocation('صنعاء');
    const targetService = presetServiceId
      ? services.find((s) => s.id === presetServiceId)
      : (services[0] || null);

    setServiceId(targetService ? targetService.id : '');
    setCategory(targetService ? targetService.titleAr : 'صيانة وإصلاح أجهزة التكييف');
    setMediaType('image');
    setMediaUrl('');
    setImages([]);
    setExtraImageUrl('');
    setVideoUrl('');
    setCaptionAr('');
    setCaptionEn('');
    setOrder(0);
    setUploadingExtra(false);
    setExtraUploadProgress('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setTitleAr(item.titleAr || '');
    setTitleEn(item.titleEn || '');
    setClientName(item.clientNameAr || item.clientName || '');
    setLocation(item.location || item.city || 'صنعاء');
    setServiceId(item.serviceId || '');
    setCategory(item.category || '');
    setMediaType(item.mediaType || 'image');
    setMediaUrl(item.mediaUrl || '');
    
    // Normalize images array
    const existingImages = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : (item.mediaUrl ? [item.mediaUrl] : []);
    setImages(existingImages);
    setExtraImageUrl('');
    setVideoUrl(item.videoUrl || '');
    setCaptionAr(item.captionAr || item.descriptionAr || '');
    setCaptionEn(item.captionEn || item.descriptionEn || '');
    setOrder(item.order || 0);
    setUploadingExtra(false);
    setExtraUploadProgress('');
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف العمل/المشروع: "${title}"؟`)) {
      try {
        await api.deleteGalleryItem(id);
        setItems((prev) => prev.filter((i) => i.id !== id));
      } catch (err: any) {
        alert(err.message || 'فشل حذف العنصر');
      }
    }
  };

  const handleServiceChange = (id: string) => {
    setServiceId(id);
    const matched = services.find((s) => s.id === id);
    if (matched) {
      setCategory(matched.titleAr);
    }
  };

  // Add additional image to gallery array via URL
  const handleAddExtraImage = () => {
    if (!extraImageUrl.trim()) return;
    const url = extraImageUrl.trim();
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
      if (!mediaUrl) setMediaUrl(url);
    }
    setExtraImageUrl('');
  };

  // Upload multiple extra images directly from device / studio
  const handleExtraFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);

    setUploadingExtra(true);
    setExtraUploadProgress(`جاري معالجة ${files.length} صور من الاستوديو...`);

    try {
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        setExtraUploadProgress(`جاري ضغط ورفع الصورة (${i + 1} من ${files.length})...`);
        const file = files[i];

        if (!file.type.startsWith('image/') && !file.name.match(/\.(jpg|jpeg|png|webp|svg|gif|avif)$/i)) {
          continue;
        }

        const { dataUrl } = await compressImage(file, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.82,
          format: 'image/webp'
        });

        const filename = file.name.replace(/\.[^/.]+$/, '') + '.webp';
        const res = await api.uploadMedia(dataUrl, filename);
        newUrls.push(res.url);
      }

      if (newUrls.length > 0) {
        setImages((prev) => Array.from(new Set([...prev, ...newUrls])));
        if (!mediaUrl) {
          setMediaUrl(newUrls[0]);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'تعذر معالجة أو رفع الصور الإضافية');
    } finally {
      setUploadingExtra(false);
      setExtraUploadProgress('');
      if (extraImagesInputRef.current) {
        extraImagesInputRef.current.value = '';
      }
    }
  };

  // Set an image as the primary cover photo
  const handleSetCoverImage = (url: string) => {
    setMediaUrl(url);
    setImages((prev) => [url, ...prev.filter((item) => item !== url)]);
  };

  // Remove image from gallery array
  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (updated.length > 0 && !updated.includes(mediaUrl)) {
        setMediaUrl(updated[0]);
      } else if (updated.length === 0) {
        setMediaUrl('');
      }
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const primaryUrl = mediaUrl.trim() || (images.length > 0 ? images[0] : '');

    if (!titleAr.trim() || !primaryUrl) {
      setError('يرجى كتابة عنوان العمل وتحديد صورة رئيسية أو رابط فيديو صحيح');
      return;
    }

    setSaving(true);
    setError('');

    const matchedService = services.find((s) => s.id === serviceId);

    // Ensure all attached images are captured
    let finalImages = [...images];
    if (primaryUrl && !finalImages.includes(primaryUrl)) {
      finalImages.unshift(primaryUrl);
    }

    const payload: Partial<GalleryItem> = {
      titleAr: titleAr.trim(),
      titleEn: titleEn.trim() || titleAr.trim(),
      clientName: clientName.trim(),
      clientNameAr: clientName.trim(),
      location: location.trim(),
      city: location.trim(),
      category: matchedService ? matchedService.titleAr : category,
      serviceId: serviceId || undefined,
      serviceSlug: matchedService ? matchedService.slug : undefined,
      mediaType,
      mediaUrl: primaryUrl,
      thumbnailUrl: primaryUrl,
      images: finalImages,
      videoUrl: videoUrl.trim(),
      captionAr: captionAr.trim(),
      captionEn: captionEn.trim(),
      descriptionAr: captionAr.trim(),
      descriptionEn: captionEn.trim(),
      order: Number(order) || 0
    };

    try {
      if (editingItem) {
        const updated = await api.updateGalleryItem(editingItem.id, payload);
        setItems((prev) => prev.map((i) => (i.id === editingItem.id ? updated : i)));
      } else {
        const created = await api.createGalleryItem(payload);
        setItems((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ بيانات المعرض');
    } finally {
      setSaving(false);
    }
  };

  // Filter items based on selected service tab and search
  const filteredItems = items.filter((item) => {
    const matchesService =
      selectedFilterService === 'all' ||
      item.serviceId === selectedFilterService ||
      (selectedFilterService && item.serviceSlug === selectedFilterService);

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.titleAr.toLowerCase().includes(q) ||
      (item.titleEn && item.titleEn.toLowerCase().includes(q)) ||
      (item.clientName && item.clientName.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q));

    return matchesService && matchesSearch;
  });

  const openPreview = (item: GalleryItem, idx = 0) => {
    setLightboxItem(item);
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const previewImages = lightboxItem
    ? (Array.isArray(lightboxItem.images) && lightboxItem.images.length > 0
        ? lightboxItem.images
        : [lightboxItem.mediaUrl])
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner and Quick Actions */}
      <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] text-white p-6 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نظام توثيق الأعمال والمشاريع الميدانية</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            إدارة وتوثيق معرض الأعمال والمشاريع
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            أضف عدداً غير محدود من الأعمال لكل قسم، مع إمكانية رفع معرض متعدد الصور، فيديو توثيقي، وتحديد اسم العميل والمحافظة.
          </p>
        </div>

        <button
          onClick={() => openAddModal(selectedFilterService !== 'all' ? selectedFilterService : undefined)}
          className="px-5 py-3 rounded-2xl bg-[#C87D55] hover:bg-[#B86B3E] text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة عمل / مشروع جديد</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث باسم العمل، العميل، أو المحافظة..."
              className="w-full ps-9 pe-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#C87D55]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              title="تحديث البيانات"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 ms-1 me-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>الأقسام:</span>
          </span>

          <button
            onClick={() => setSelectedFilterService('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedFilterService === 'all'
                ? 'bg-[#0B192C] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            كافة الأقسام ({items.length})
          </button>

          {services.map((srv) => {
            const count = items.filter(
              (i) => i.serviceId === srv.id || i.serviceSlug === srv.slug
            ).length;
            const isSelected = selectedFilterService === srv.id || selectedFilterService === srv.slug;

            return (
              <button
                key={srv.id}
                onClick={() => setSelectedFilterService(srv.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#C87D55] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{srv.titleAr}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/30 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 bg-white rounded-3xl border border-slate-200">
          {t('جاري تحميل وتحديث المعرض...', 'Loading gallery items...')}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-4 p-6">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-700">لا توجد أعمال مضافة لهذا القسم بعد</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            يمكنك رفع صور وفيديوهات متعددة لأعمالك السابقة في هذا القسم وتوثيقها لتظهر للعملاء في الموقع.
          </p>
          <button
            onClick={() => openAddModal(selectedFilterService !== 'all' ? selectedFilterService : undefined)}
            className="px-5 py-2.5 rounded-xl bg-[#C87D55] hover:bg-[#B86B3E] text-white text-xs font-bold shadow transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة أول عمل الآن</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const isVideo = item.mediaType === 'video';
            const matchedSrv = services.find(
              (s) => s.id === item.serviceId || s.slug === item.serviceSlug
            );
            const itemImages = Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.mediaUrl];
            const client = item.clientNameAr || item.clientName;
            const loc = item.location || item.city;

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-video sm:aspect-[4/3] bg-slate-900 overflow-hidden">
                  {isVideo ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#C87D55] text-white flex items-center justify-center mb-2 shadow">
                        <Play className="w-6 h-6 fill-current" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-300">مقطع فيديو توثيقي</span>
                    </div>
                  ) : (
                    <img
                      src={itemImages[0] || item.thumbnailUrl || item.mediaUrl}
                      alt={item.titleAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer"
                      onClick={() => openPreview(item, 0)}
                    />
                  )}

                  {/* Section Badge */}
                  <div className="absolute top-2.5 start-2.5 px-2 py-1 rounded-md bg-black/75 backdrop-blur-xs text-[#C87D55] text-[10px] font-bold flex items-center gap-1">
                    {isVideo ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    <span className="truncate max-w-[120px]">
                      {matchedSrv?.titleAr || item.category}
                    </span>
                  </div>

                  {/* Multi-Image and Video Badges */}
                  <div className="absolute top-2.5 end-2.5 flex items-center gap-1">
                    {itemImages.length > 1 && (
                      <span className="px-2 py-1 rounded-md bg-emerald-700/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                        <ImageIcon className="w-3 h-3" />
                        <span>{itemImages.length} صور</span>
                      </span>
                    )}
                    {item.videoUrl && (
                      <span className="px-1.5 py-1 rounded-md bg-rose-600 text-white text-[10px] font-bold shadow-md">
                        <Video className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Quick Preview Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                    <span className="px-3 py-1.5 rounded-xl bg-white/90 text-slate-900 text-xs font-bold flex items-center gap-1 shadow">
                      <Maximize2 className="w-3.5 h-3.5 text-[#C87D55]" />
                      <span>معاينة مكبرة</span>
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    {/* Client & Location Badges */}
                    {(client || loc) && (
                      <div className="flex items-center gap-1.5 flex-wrap text-[10px] mb-1.5">
                        {client && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                            <Building2 className="w-3 h-3 text-[#C87D55]" />
                            <span className="truncate max-w-[110px]">{client}</span>
                          </span>
                        )}
                        {loc && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-medium">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            <span>{loc}</span>
                          </span>
                        )}
                      </div>
                    )}

                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                      {item.titleAr}
                    </h4>

                    {(item.captionAr || item.descriptionAr) && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.captionAr || item.descriptionAr}
                      </p>
                    )}
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">
                      ترتيب: {item.order || 0}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-[#C87D55] hover:bg-slate-100 transition"
                        title="تعديل هذا العمل"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.titleAr)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                        title="حذف هذا العمل"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* Modal: Add or Edit Work / Project                            */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0B192C] to-[#1E3E62] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#C87D55]" />
                <h3 className="font-bold text-base">
                  {editingItem ? 'تعديل بيانات العمل / المشروع الميداني' : 'إضافة عمل وتوثيق ميداني جديد'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar text-xs sm:text-sm">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Service Category */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  القسم أو الخدمة التابع لها هذا العمل *
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] font-medium"
                >
                  <option value="">معرض عام (غير مقيد بقسم محدد)</option>
                  {services.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.titleAr} ({srv.slug})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  يمكنك إضافة أي عدد من الأعمال المنفذة تحت هذا القسم دون أي تقييد.
                </span>
              </div>

              {/* Title Ar */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان العمل أو المشروع (عربي) *</label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="مثال: تنفيذ ثلاجة مركزية لتجميد وتبريد قوارير وكراتين الماء"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                />
              </div>

              {/* English Title (optional) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  عنوان العمل (إنجليزي - اختياري)
                </label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Bottled Water Cold Storage Facility Installation"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                />
              </div>

              {/* Client Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#C87D55]" />
                    <span>اسم العميل / المنشأة (Client Name)</span>
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="مثال: مصنع مياه شملان / شركة الأغذية"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C87D55]" />
                    <span>المحافظة / المدينة (Location)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={YEMEN_CITIES.includes(location) ? location : 'أخرى'}
                      onChange={(e) => {
                        if (e.target.value !== 'أخرى') setLocation(e.target.value);
                      }}
                      className="px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] text-xs"
                    >
                      {YEMEN_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                      <option value="أخرى">مدينة أخرى...</option>
                    </select>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="أو اكتب اسم المدينة"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55]"
                    />
                  </div>
                </div>
              </div>

              {/* Caption / Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  الوصف والشرح التوضيحي للعمل (Description / Caption)
                </label>
                <textarea
                  rows={3}
                  value={captionAr}
                  onChange={(e) => setCaptionAr(e.target.value)}
                  placeholder="اكتب تفاصيل وشرحاً للمشروع: تم تركيب عوازل ساندوتش بانل، وحدات تكثيف إنفرتر، وبرمجة حساسات الحرارة الرقمية بدقة عالية."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#C87D55] leading-relaxed"
                />
              </div>

              {/* Media Type Tabs */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">نوع العرض الأساسي</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaType('image')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition ${
                      mediaType === 'image'
                        ? 'bg-[#0B192C] text-white border-[#0B192C]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>معرض صور فوتوغرافية</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition ${
                      mediaType === 'video'
                        ? 'bg-[#0B192C] text-white border-[#0B192C]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>مقطع فيديو رئيسي</span>
                  </button>
                </div>
              </div>

              {/* Primary Image or Video */}
              {mediaType === 'image' ? (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <ImageUploader
                    label="الصورة الرئيسية (غلاف العمل) *"
                    value={mediaUrl}
                    multiple={true}
                    buttonText="اختر صوراً من جهازك / الاستوديو (تحديد متعدد)"
                    onMultipleChange={(newUrls) => {
                      if (newUrls.length > 0) {
                        setMediaUrl(newUrls[0]);
                        setImages((prev) => Array.from(new Set([...newUrls, ...prev])));
                      }
                    }}
                    onChange={(url) => {
                      setMediaUrl(url);
                      if (url && !images.includes(url)) {
                        setImages((prev) => [url, ...prev.filter((x) => x !== url)]);
                      }
                    }}
                    required
                    aspectHint="يمكنك اختيار عدة صور دفعة واحدة؛ سيتم تعيين الأولى كغلاف وإضافة البقية للمعرض تلقائياً"
                  />
                </div>
              ) : (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <VideoUploader
                    label="مقطع الفيديو الرئيسي للمشروع *"
                    value={mediaUrl}
                    onChange={(url) => {
                      setMediaUrl(url);
                      setVideoUrl(url);
                    }}
                    required
                    hint="يدعم رفع فيديو مباشر من الأستوديو (MP4, WebM, MOV) أو رابط يوتيوب/فيميو"
                  />
                </div>
              )}

              {/* Multi-Image Gallery Manager */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <ImageIcon className="w-4 h-4 text-[#C87D55]" />
                    <span>معرض الصور المتعددة للعمل (Multi-Media Gallery)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                      {images.length} {images.length === 1 ? 'صورة مرفوعة' : 'صور مرفوعة'}
                    </span>
                  </div>
                </div>

                {/* Upload Extra Photos Direct from Device Button */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={uploadingExtra}
                    onClick={() => extraImagesInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] disabled:bg-slate-400 text-white font-bold text-xs transition flex items-center gap-2 shadow-xs"
                  >
                    {uploadingExtra ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C87D55]" />
                        <span>{extraUploadProgress || 'جاري رفع الصور...'}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-[#C87D55]" />
                        <span>رفع صور إضافية من الأستوديو (تحديد متعدد)</span>
                      </>
                    )}
                  </button>

                  <input
                    ref={extraImagesInputRef}
                    type="file"
                    multiple
                    accept="image/*,.svg,.webp,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => handleExtraFiles(e.target.files)}
                  />
                </div>

                {/* Attached Images Thumbnails Grid */}
                {images.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-2">
                    {images.map((img, idx) => {
                      const isCover = img === mediaUrl || (!mediaUrl && idx === 0);
                      return (
                        <div
                          key={idx}
                          className={`relative group aspect-square rounded-xl overflow-hidden border shadow-xs bg-slate-900 transition-all ${
                            isCover ? 'ring-2 ring-[#C87D55] border-[#C87D55]' : 'border-slate-200'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Cover Badge */}
                          {isCover ? (
                            <span className="absolute top-1 start-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#C87D55] text-white flex items-center gap-0.5 shadow">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>الغلاف</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(img)}
                              className="absolute bottom-1 inset-x-1 py-1 rounded bg-black/80 hover:bg-[#C87D55] text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition shadow"
                              title="تعيين هذه الصورة كغلاف رئيسي"
                            >
                              تعيين كغلاف
                            </button>
                          )}

                          {/* Delete / Cancel Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 end-1 p-1 rounded-md bg-rose-600/90 hover:bg-rose-700 text-white transition shadow"
                            title="إلغاء وحذف هذه الصورة قبل الحفظ"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 py-1">
                    لم يتم إضافة صور إضافية بعد. يمكنك اختيار صور من الأستوديو أو إدراج روابط.
                  </p>
                )}

                {/* Add Extra Image Row via URL */}
                <div className="pt-2 flex items-center gap-2 border-t border-slate-200/60">
                  <input
                    type="url"
                    value={extraImageUrl}
                    onChange={(e) => setExtraImageUrl(e.target.value)}
                    placeholder="أو ألصق رابط صورة إضافية مباشر (https://...)"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#C87D55]"
                  />
                  <button
                    type="button"
                    onClick={handleAddExtraImage}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition shrink-0 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة الرابط</span>
                  </button>
                </div>
              </div>

              {/* Video URL (Companion Video for Photo Works) */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <VideoUploader
                  label="مقطع فيديو توثيقي مصاحب للعمل (اختياري)"
                  value={videoUrl}
                  onChange={(url) => setVideoUrl(url)}
                  hint="اختياري - يمكنك رفع فيديو ميداني مباشر (MP4/WebM/MOV) أو وضع رابط YouTube"
                />
              </div>

              {/* Order index */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ترتيب الظهور (الرقم الأصغر يظهر أولاً)
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-bold"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-[#C87D55] text-white font-bold shadow-md hover:bg-[#B86B3E] transition disabled:opacity-50"
                >
                  {saving
                    ? 'جاري الحفظ...'
                    : editingItem
                    ? 'حفظ التعديلات والاستبدال'
                    : 'إضافة ونشر للقسم'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox for Fullscreen viewing */}
      {lightboxItem && (
        <Lightbox
          isOpen={lightboxOpen}
          onClose={() => {
            setLightboxOpen(false);
            setLightboxItem(null);
          }}
          images={previewImages}
          currentIndex={lightboxIndex}
          onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : previewImages.length - 1))}
          onNext={() => setLightboxIndex((prev) => (prev < previewImages.length - 1 ? prev + 1 : 0))}
          onSelectIndex={(idx) => setLightboxIndex(idx)}
          title={lightboxItem.titleAr}
          clientName={lightboxItem.clientNameAr || lightboxItem.clientName}
          location={lightboxItem.location || lightboxItem.city}
          caption={lightboxItem.captionAr || lightboxItem.descriptionAr}
          videoUrl={lightboxItem.videoUrl}
        />
      )}
    </div>
  );
};
