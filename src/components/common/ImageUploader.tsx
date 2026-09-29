import React, { useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  X,
  RefreshCw,
  Trash2,
  Layers,
  Check
} from 'lucide-react';
import { uploadToImgBB } from '../../utils/cloudImageUploader.js';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  aspectHint?: string;
  placeholder?: string;
  required?: boolean;
  multiple?: boolean;
  onMultipleChange?: (newUrls: string[]) => void;
  buttonText?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

const PRESET_ASSETS = [
  { name: 'وحدات تكييف VRF مركزية', url: '/images/products/vrf-system.jpg', cat: 'تكييف' },
  { name: 'وحدات تكثيف غرف التبريد والتجميد', url: '/images/products/coldroom-condensing.jpg', cat: 'تبريد' },
  { name: 'مكيفات إسبليت إنفرتر موفرة للطاقة', url: '/images/products/split-eco-inverter.jpg', cat: 'تكييف' },
  { name: 'مكيفات دولابي للمساجد والصالات', url: '/images/products/floor-standing-ac.jpg', cat: 'تكييف' },
  { name: 'ضواغط ومكونات تبريد أصلية', url: '/images/products/copeland-compressor.jpg', cat: 'قطع غيار' },
  { name: 'شيلرات ومبردات مياه صناعية', url: '/images/gallery/gallery-chiller-service.jpg', cat: 'صيانة' },
  { name: 'مستودعات وغرف تبريد الخضار', url: '/images/projects/sanaa-cold-storage.jpg', cat: 'مشاريع' },
  { name: 'ثلاجات ومسالخ الدواجن واللحوم', url: '/images/projects/ibb-poultry-freezer.jpg', cat: 'مشاريع' },
  { name: 'أنظمة تبريد خطوط ومصانع المياه', url: '/images/projects/dhamar-water-freezing.jpg', cat: 'مشاريع' },
  { name: 'لوحات وطبالين التحكم الكهربائية', url: '/images/panel-cover.jpg', cat: 'طبالين' },
  { name: 'تمديدات وتصنيع مجاري الهواء ودكت', url: '/images/gallery/gallery-duct-installation.jpg', cat: 'تهوية' },
  { name: 'صيانة وفحص دورات الفريون', url: '/images/gallery/gallery-split-maintenance.jpg', cat: 'صيانة' }
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  aspectHint,
  required = false,
  multiple = false,
  onMultipleChange,
  buttonText
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const processSingleFile = async (file: File): Promise<string> => {
    // Basic safety check for clearly invalid non-media files
    if (file.name && file.name.match(/\.(pdf|doc|docx|zip|rar|exe|apk)$/i)) {
      throw new Error(`الملف "${file.name}" ليس صورة صالحة.`);
    }

    setUploadProgressText('جاري الرفع المباشر إلى السحابة...');
    const result = await uploadToImgBB(file, file.name);
    return result.url;
  };

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setUploading(true);
    setError('');
    setSuccessNotice(false);

    try {
      if (files.length === 1) {
        setUploadProgressText('جاري رفع الصورة إلى ImgBB...');
        const cloudUrl = await processSingleFile(files[0]);
        onChange(cloudUrl);
        if (onMultipleChange) {
          onMultipleChange([cloudUrl]);
        }
        setSuccessNotice(true);
        setTimeout(() => setSuccessNotice(false), 3000);
      } else {
        setUploadProgressText(`جاري رفع ${files.length} صور إلى السحابة...`);
        const uploadedUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          setUploadProgressText(`جاري رفع الصورة (${i + 1} من ${files.length})...`);
          try {
            const url = await processSingleFile(files[i]);
            uploadedUrls.push(url);
          } catch (fileErr) {
            console.warn(`Could not upload ${files[i].name}`, fileErr);
          }
        }

        if (uploadedUrls.length === 0) {
          throw new Error('لم يتم رفع أي صورة بنجاح. يرجى التأكد من اتصال الإنترنت.');
        }

        onChange(uploadedUrls[0]);
        if (onMultipleChange) {
          onMultipleChange(uploadedUrls);
        }
        setSuccessNotice(true);
        setTimeout(() => setSuccessNotice(false), 3000);
      }
    } catch (err: any) {
      setError(err?.message || 'فشل في رفع الصورة، يرجى المحاولة مرة أخرى.');
    } finally {
      setUploading(false);
      setUploadProgressText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    if (onMultipleChange) {
      onMultipleChange([]);
    }
    setError('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-slate-800 text-xs">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {aspectHint && <span className="text-[10px] text-slate-400">{aspectHint}</span>}
      </div>

      {/* Main Upload / Card Container */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-200 ${
          dragOver
            ? 'border-[#C87D55] bg-[#C87D55]/5'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/70'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Current Preview or Icon */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center shrink-0 shadow-inner relative group">
            {uploading ? (
              <div className="absolute inset-0 bg-[#0B192C]/90 backdrop-blur-xs flex flex-col items-center justify-center text-white z-10 p-2 text-center">
                <Loader2 className="w-7 h-7 animate-spin text-[#C87D55] mb-1.5" />
                <span className="text-[10px] font-bold text-amber-300 leading-tight">جاري الرفع...</span>
                <span className="text-[8px] text-slate-300 mt-0.5">سحابة ImgBB</span>
              </div>
            ) : value ? (
              <>
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo-icon.png';
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  title="حذف الصورة"
                  className="absolute top-1 end-1 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                <ImageIcon className="w-8 h-8 mb-1" />
                <span className="text-[10px]">لا توجد صورة</span>
              </div>
            )}
          </div>

          {/* Action Buttons & Clean Controls */}
          <div className="flex-1 w-full space-y-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] disabled:bg-slate-400 text-white font-bold transition flex items-center gap-2 shadow"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#C87D55]" />
                    <span>{uploadProgressText || 'جاري الرفع إلى السحابة...'}</span>
                  </>
                ) : value ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-[#C87D55]" />
                    <span>إستبدال الصورة 🔄</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-[#C87D55]" />
                    <span>
                      {buttonText || (multiple ? 'رفع صور من الاستوديو (ImgBB)' : 'رفع صورة من الاستوديو (ImgBB)')}
                    </span>
                  </>
                )}
              </button>

              {value && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={uploading}
                  className="px-3 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold transition flex items-center gap-1.5"
                  title="حذف هذه الصورة نهائياً"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span>حذف الصورة</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition flex items-center gap-1.5"
                title="مكتبة الصور الهندسية الجاهزة"
              >
                <Layers className="w-3.5 h-3.5 text-[#C87D55]" />
                <span>الصور الجاهزة 🖼️</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                multiple={multiple}
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
              />
            </div>

            {/* Dedicated Permanent Cloud URL (ImgBB) input */}
            <div className="space-y-1 pt-1.5 border-t border-slate-200/80">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>رابط سحابي دائم (ImgBB / Cloud URL)</span>
                </span>
                {value && (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold shrink-0 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    {value.includes('ibb.co') ? 'رابط ImgBB معتمد' : 'رابط سحابي نشط'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={value || ''}
                  onChange={(e) => {
                    const trimmed = e.target.value.trim();
                    onChange(trimmed);
                    if (onMultipleChange) {
                      onMultipleChange(trimmed ? [trimmed] : []);
                    }
                  }}
                  placeholder="الصق الرابط السحابي الدائم هنا (https://i.ibb.co/...)"
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-[#C87D55] focus:ring-1 focus:ring-[#C87D55] font-mono text-[11px] text-slate-800 placeholder:font-sans placeholder:text-slate-400 shadow-2xs"
                />
                {value && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    title="مسح الرابط والصورة"
                    className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <span className="text-[10px] text-slate-400 block">
                عند لصق أو رفع رابط سحابي (ImgBB)، يتم اعتماده فورياً وتجاهل أي صورة قديمة.
              </span>
            </div>

            {successNotice && (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-fadeIn">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>تم اعتماد الرابط السحابي بنجاح!</span>
              </div>
            )}
          </div>
        </div>

        {/* Preset Selector Dropdown / Grid */}
        {showPresets && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                مكتبة صور المعدات والأنظمة الهندسية (روابط سريعة ومباشرة):
              </span>
              <button
                type="button"
                onClick={() => setShowPresets(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {PRESET_ASSETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onChange(preset.url);
                    setShowPresets(false);
                  }}
                  className={`group relative rounded-xl border p-1 bg-white cursor-pointer hover:border-[#C87D55] hover:shadow-md transition text-center ${
                    value === preset.url ? 'border-2 border-[#C87D55] ring-2 ring-[#C87D55]/20' : 'border-slate-200'
                  }`}
                >
                  <div className="h-16 rounded-lg bg-slate-100 overflow-hidden mb-1">
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 block truncate" title={preset.name}>
                    {preset.name}
                  </span>
                  <span className="text-[9px] text-[#C87D55] block">
                    {preset.cat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
