import React from 'react';
import { Video, ExternalLink, Play } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title }) => {
  if (!videoUrl || !videoUrl.trim()) return null;

  const url = videoUrl.trim();

  // YouTube Helper
  const getYouTubeEmbedUrl = (u: string): string | null => {
    // Matches youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID
    const ytMatch = u.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
    }
    return null;
  };

  // Vimeo Helper
  const getVimeoEmbedUrl = (u: string): string | null => {
    const vimeoMatch = u.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return null;
  };

  const ytEmbed = getYouTubeEmbedUrl(url);
  const vimeoEmbed = getVimeoEmbedUrl(url);
  const isDirectVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.startsWith('blob:') || url.startsWith('data:video');

  return (
    <div className="space-y-3 rounded-2xl bg-slate-900 border border-slate-800 p-4 text-white overflow-hidden shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-[#C87D55]">
          <Video className="w-4 h-4" />
          <span>مقطع الفيديو التوضيحي {title ? `- ${title}` : ''}</span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
        >
          <span>فتح الرابط</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
        {ytEmbed ? (
          <iframe
            src={ytEmbed}
            title={title || 'YouTube Video'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : vimeoEmbed ? (
          <iframe
            src={vimeoEmbed}
            title={title || 'Vimeo Video'}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : isDirectVideo ? (
          <video
            src={url}
            controls
            playsInline
            className="w-full h-full object-contain"
          >
            متصفحك لا يدعم تشغيل مقطع الفيديو مباشرة.
          </video>
        ) : (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#C87D55]/20 text-[#C87D55] flex items-center justify-center mx-auto">
              <Play className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-300">
              رابط فيديو مخصص متاح للمشاهدة
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C87D55] hover:bg-[#B86B3E] text-white font-bold text-xs shadow transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>مشاهدة مقطع الفيديو الآن</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
