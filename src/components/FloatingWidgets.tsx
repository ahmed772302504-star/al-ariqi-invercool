import React, { useState } from 'react';
import { useApp } from '../context';
import {
  Phone,
  MessageCircle,
  Wrench,
  Sparkles,
  UserCheck,
  ChevronUp,
  X
} from 'lucide-react';

interface FloatingWidgetsProps {
  openQuoteModal: () => void;
  openTechModal: () => void;
  setCurrentTab: (tab: string) => void;
}

export const FloatingWidgets: React.FC<FloatingWidgetsProps> = ({
  openQuoteModal,
  openTechModal,
  setCurrentTab
}) => {
  const { lang, t, settings } = useApp();
  const [expanded, setExpanded] = useState(false);

  const phonePrimary = settings?.phonePrimary || '770931413';
  const whatsappPrimary = settings?.whatsappPrimary || '770931413';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 z-50 flex flex-col items-end gap-3 right-6 rtl:right-auto rtl:left-6 select-none">
      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="w-10 h-10 rounded-full bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 shadow-md border border-slate-700 flex items-center justify-center transition-all hover:scale-105"
        title={t('العودة للأعلى', 'Scroll to top')}
        id="scroll-to-top-btn"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Expanded Quick Contact Menu */}
      {expanded && (
        <div className="bg-[#0B192C] text-white p-4 rounded-2xl shadow-2xl border border-slate-700 w-64 space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-[#C87D55]">
              {t('خدمة عملاء إنفركول', 'Invercool Support')}
            </span>
            <button
              onClick={() => setExpanded(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <a
            href={`tel:${phonePrimary}`}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#C87D55]/20 text-[#C87D55] flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">{t('اتصال هاتفي مباشر', 'Call Us Now')}</div>
              <div dir="ltr" className="text-slate-400 text-[11px]">{phonePrimary}</div>
            </div>
          </a>

          <a
            href={`https://wa.me/967${whatsappPrimary.replace(/\D/g, '')}?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن خدمات التكييف والتبريد في العريقي إنفركول')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-medium transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-emerald-300">{t('واتساب سريع 24/7', 'WhatsApp 24/7')}</div>
              <div className="text-slate-400 text-[11px]">{t('رد فوري من المهندس', 'Instant Reply')}</div>
            </div>
          </a>

          <button
            onClick={() => {
              openTechModal();
              setExpanded(false);
            }}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium transition-colors text-right rtl:text-right ltr:text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1E3E62] text-white flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">{t('طلب فني كشف منزلي', 'Request Technician')}</div>
              <div className="text-slate-400 text-[11px]">{t('زيارة ميدانية سريعة', 'On-site diagnosis')}</div>
            </div>
          </button>
        </div>
      )}

      {/* Main WhatsApp & Call Floating Buttons */}
      <div className="flex items-center gap-2">
        <a
          href={`https://wa.me/967${whatsappPrimary.replace(/\D/g, '')}?text=${encodeURIComponent('السلام عليكم العريقي إنفركول، أود الاستفسار عن خدماتكم')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-xl shadow-emerald-900/30 hover:shadow-emerald-900/50 hover:scale-105 transition-all duration-300 group"
          id="floating-whatsapp-btn"
        >
          <MessageCircle className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-bold hidden sm:inline-block">
            {t('واتساب 24/7', 'WhatsApp 24/7')}
          </span>
        </a>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-[#C87D55] to-[#A85D35] text-white flex items-center justify-center shadow-xl shadow-[#C87D55]/30 hover:scale-105 transition-all"
          id="floating-actions-btn"
          title={t('خيارات التواصل والخدمة', 'Contact options')}
        >
          <Phone className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
