import React, { useRef, useState, useEffect } from 'react';
import { Video, Upload, Trash2, Loader2, AlertCircle, Play, Film, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.js';

interface VideoUploaderProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  required?: boolean;
  hint?: string;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  label,
  value,
  onChange,
  required = false,
  hint = 'صيغ MP4, WebM, MOV من الاستوديو أو رابط يوتيوب'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string; type: string } | null>(null);

  // Determine current mode: 'file' if starts with data:video or blob, otherwise if non-empty http/youtube 'url', default 'file'
  const isDirectFile = value.startsWith('data:video') || value.startsWith('blob:');
  const [mode, setMode] = useState<'file' | 'url'>(value && !isDirectFile ? 'url' : 'file');

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleVideoFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|m4v|mkv|avi)$/i)) {
      setError('يرجى اختيار مقطع فيديو بصيغة صحيحة (MP4, WebM, MOV)');
      return;
    }

    // Limit check: 60MB warning
    const MAX_SIZE = 60 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError(`حجم الفيديو (${formatBytes(file.size)}) كبير جداً. يرجى اختيار مقطع فيديو لا يتجاوز 60 ميجابايت لضمان سرعة التحميل على هواتف العملاء.`);
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress('جاري قراءة مقطع الفيديو من الجهاز...');

    try {
      const reader = new FileReader();

      const readPromise = new Promise<string>((resolve, reject) => {
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(`جاري معالجة الفيديو (${percent}%)...`);
          }
        };
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('فشلت قراءة ملف الفيديو من الجهاز'));
      });

      reader.readAsDataURL(file);
      const dataUrl = await readPromise;

      setUploadProgress('جاري حفظ وتجهيز الفيديو...');
      const res = await api.uploadMedia(dataUrl, file.name);

      setFileDetails({
        name: file.name,
        size: formatBytes(file.size),
        type: file.type || 'video/mp4'
      });

      onChange(res.url);
      setMode('file');
    } catch (err: any) {
      setError(err?.message || 'تعذر معالجة أو رفع الفيديو، يرجى المحاولة مرة أخرى');
    } finally {
      setUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setFileDetails(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isYouTube = value.includes('youtube.com') || value.includes('youtu.be');
  const isVimeo = value.includes('vimeo.com');

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-slate-800 text-xs flex items-center gap-1.5">
          <Film className="w-4 h-4 text-[#C87D55]" />
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setMode('file')}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            mode === 'file'
              ? 'bg-white text-[#0B192C] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-[#C87D55]" />
          <span>رفع فيديو من الأستوديو / الجهاز</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('url')}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            mode === 'url'
              ? 'bg-white text-[#0B192C] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5 text-[#C87D55]" />
          <span>رابط YouTube أو Vimeo</span>
        </button>
      </div>

      {/* Direct Video File Upload Mode */}
      {mode === 'file' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleVideoFile(file);
          }}
          className={`border-2 border-dashed rounded-2xl p-4 transition-all duration-200 ${
            dragOver
              ? 'border-[#C87D55] bg-[#C87D55]/5'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/70'
          }`}
        >
          {value && isDirectFile ? (
            /* Video Preview Player with Info and Delete */
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-60 flex items-center justify-center border border-slate-800 shadow-md">
                <video
                  src={value}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                >
                  متصفحك لا يدعم تشغيل هذا المقطع مباشرة.
                </video>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">
                      {fileDetails?.name || 'مقطع فيديو تم رفعه من جهازك'}
                    </p>
                    {fileDetails?.size && (
                      <p className="text-[10px] text-slate-500">
                        الحجم: {fileDetails.size} • الصيغة: {fileDetails.type}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#C87D55]" />
                    <span>تغيير الفيديو</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Upload Action Prompt */
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#C87D55] flex items-center justify-center border border-amber-200 shadow-xs">
                {uploading ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <Film className="w-7 h-7" />
                )}
              </div>

              <div>
                <p className="font-bold text-slate-800 text-sm">
                  {uploading ? uploadProgress : 'اختر مقطع فيديو من الاستوديو أو كاميرا الهاتف'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  يدعم مقاطع التوثيق الميداني بصيغ (MP4, WebM, MOV) حتى 60 ميجابايت
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] disabled:bg-slate-400 text-white font-bold text-xs transition flex items-center gap-2 shadow"
                >
                  <Upload className="w-4 h-4 text-[#C87D55]" />
                  <span>{uploading ? 'جاري الرفع والمعالجة...' : 'تحديد فيديو من الاستوديو'}</span>
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleVideoFile(file);
            }}
          />
        </div>
      )}

      {/* External URL Mode (YouTube / Vimeo / Direct Web Video) */}
      {mode === 'url' && (
        <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... أو https://youtu.be/... أو https://vimeo.com/..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-[#C87D55] font-mono text-xs text-slate-800"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              الصق رابط الفيديو من يوتيوب أو فيميو أو رابط مباشر بامتداد mp4.
            </span>
          </div>

          {/* Quick Preview for External Links */}
          {value && !isDirectFile && (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-52 flex items-center justify-center border border-slate-800">
              {isYouTube ? (
                <div className="text-center p-4 text-white text-xs space-y-2">
                  <Play className="w-8 h-8 text-rose-500 mx-auto" />
                  <p className="font-bold">رابط فيديو يوتيوب معتمد</p>
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[11px] text-amber-400 underline"
                  >
                    معاينة الفيديو في نافذة جديدة
                  </a>
                </div>
              ) : isVimeo ? (
                <div className="text-center p-4 text-white text-xs space-y-2">
                  <Play className="w-8 h-8 text-blue-400 mx-auto" />
                  <p className="font-bold">رابط فيديو Vimeo معتمد</p>
                </div>
              ) : (
                <video src={value} controls className="w-full h-full object-contain" />
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
