import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Check, Loader2, AlertCircle, Sparkles, FolderOpen } from 'lucide-react';
import { api } from '../../services/api.js';
import { compressImage, formatFileSize } from '../../utils/imageOptimizer.js';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  aspectHint?: string;
  placeholder?: string;
  required?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  multiple?: boolean;
  onMultipleChange?: (newUrls: string[]) => void;
  buttonText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  aspectHint = 'JPG, PNG, WebP (يتم الضغط والتحسين التلقائي)',
  placeholder = 'https://... أو اختر صورة من جهازك/الاستوديو',
  required = false,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82,
  multiple = false,
  onMultipleChange,
  buttonText
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [optimizationInfo, setOptimizationInfo] = useState<{ original: string; compressed: string; savings: string } | null>(null);

  const processSingleFile = async (file: File) => {
    if (!file.type.startsWith('image/') && !file.name?.match(/\.(jpg|jpeg|png|webp|svg|gif|avif|heic|bmp)$/i)) {
      throw new Error(`الملف "${file.name}" ليس صورة صالحة`);
    }

    const originalSize = file.size;
    const { dataUrl, sizeBytes } = await compressImage(file, {
      maxWidth,
      maxHeight,
      quality,
      format: 'image/webp'
    });

    // Extension detection
    let ext = '.webp';
    if (dataUrl.startsWith('data:image/svg+xml')) ext = '.svg';
    else if (dataUrl.startsWith('data:image/png')) ext = '.png';
    else if (dataUrl.startsWith('data:image/jpeg')) ext = '.jpg';
    else if (dataUrl.startsWith('data:image/gif')) ext = '.gif';

    const filename = file.name.replace(/\.[^/.]+$/, '') + ext;
    const res = await api.uploadMedia(dataUrl, filename);

    return {
      url: res.url,
      originalSize,
      sizeBytes
    };
  };

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setUploading(true);
    setError('');
    setOptimizationInfo(null);

    try {
      if (files.length === 1) {
        setUploadProgressText('جاري معالجة وضغط الصورة...');
        const result = await processSingleFile(files[0]);

        const savingsPercent =
          result.originalSize > result.sizeBytes
            ? Math.round(((result.originalSize - result.sizeBytes) / result.originalSize) * 100)
            : 0;

        if (savingsPercent > 0) {
          setOptimizationInfo({
            original: formatFileSize(result.originalSize),
            compressed: formatFileSize(result.sizeBytes),
            savings: `${savingsPercent}%`
          });
        }

        onChange(result.url);
        if (onMultipleChange) {
          onMultipleChange([result.url]);
        }
      } else {
        // Multiple files processing
        setUploadProgressText(`جاري معالجة وتجهيز ${files.length} صور...`);
        const uploadedUrls: string[] = [];
        let totalOriginal = 0;
        let totalCompressed = 0;

        for (let i = 0; i < files.length; i++) {
          setUploadProgressText(`جاري معالجة الصورة (${i + 1} من ${files.length})...`);
          try {
            const res = await processSingleFile(files[i]);
            uploadedUrls.push(res.url);
            totalOriginal += res.originalSize;
            totalCompressed += res.sizeBytes;
          } catch (fileErr: any) {
            console.warn(`Could not process file ${files[i].name}`, fileErr);
          }
        }

        if (uploadedUrls.length === 0) {
          throw new Error('لم يتم رفع أي صورة بنجاح، يرجى التأكد من صيغ الصور');
        }

        const overallSavings =
          totalOriginal > totalCompressed
            ? Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100)
            : 0;

        setOptimizationInfo({
          original: formatFileSize(totalOriginal),
          compressed: formatFileSize(totalCompressed),
          savings: `${overallSavings}% (${uploadedUrls.length} صور تم ضغطها)`
        });

        // Set the first as the primary image
        onChange(uploadedUrls[0]);

        // Provide all uploaded URLs to callback
        if (onMultipleChange) {
          onMultipleChange(uploadedUrls);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'تعذر معالجة أو رفع الصور، يرجى المحاولة مرة أخرى');
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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-slate-800 text-xs">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {aspectHint && <span className="text-[10px] text-slate-400">{aspectHint}</span>}
      </div>

      {/* Visual Drop Area & Preview */}
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
            {value ? (
              <>
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo-icon.png';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold pointer-events-none">
                  معاينة مباشرة
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                <ImageIcon className="w-8 h-8 mb-1" />
                <span className="text-[10px]">لا توجد صورة</span>
              </div>
            )}
          </div>

          {/* Action area: Upload button & URL input */}
          <div className="flex-1 w-full space-y-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] disabled:bg-slate-400 text-white font-bold transition flex items-center gap-2 shadow"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#C87D55]" />
                    <span>{uploadProgressText || 'جاري معالجة ورفع الصورة...'}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-[#C87D55]" />
                    <span>
                      {buttonText || (multiple ? 'اختر صوراً من جهازك / الاستوديو (تحديد متعدد)' : 'اختر صورة من جهازك / الاستوديو')}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-medium transition flex items-center gap-1.5"
              >
                <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>أو اسحبها هنا</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                multiple={multiple}
                accept="image/*,.svg,.webp,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleInputChange}
              />
            </div>

            {optimizationInfo && (
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>تم الضغط بنجاح: تم تقليص الحجم من {optimizationInfo.original} إلى {optimizationInfo.compressed} (توفير {optimizationInfo.savings})</span>
              </div>
            )}

            <p className="text-[11px] text-slate-500">
              أو قم بلصق رابط صورة مباشر إن وجد:
            </p>

            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-[#C87D55] font-mono text-[11px] text-slate-800"
            />
          </div>
        </div>

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
