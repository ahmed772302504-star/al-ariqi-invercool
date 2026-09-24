import React from 'react';
import { useLanguage } from '../context/LanguageContext.js';
import { ShieldCheck, FileCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface LegalProps {
  navigate: (route: string) => void;
}

export const PrivacyPolicyPage: React.FC<LegalProps> = ({ navigate }) => {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <button
        onClick={() => navigate('home')}
        className="text-xs font-bold text-slate-500 hover:text-[#C87D55] flex items-center gap-1"
      >
        {language === 'ar' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
        <span>{t('العودة للرئيسية', 'Back to Home')}</span>
      </button>

      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="w-10 h-10 rounded-xl bg-[#0B192C] text-[#C87D55] flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {t('سياسة الخصوصية وسرية البيانات', 'Privacy Policy & Data Protection')}
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          {t('شركة العريقي إنفركول - الجمهورية اليمنية', 'AL-ARRIQI INVERCOOL - Republic of Yemen')}
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. جمع واستخدام البيانات</h2>
          <p>
            تلتزم شركة <strong>العريقي إنفركول</strong> بالحفاظ على سرية وخصوصية كافة بيانات العملاء وأصحاب المشاريع والشركات المسجلة عبر الموقع الإلكتروني أو التطبيق. تُستخدم البيانات المجمعة (مثل الاسم، رقم الهاتف، المحافظة، ومواصفات المشروع أو بلاغ العطل) فقط لغرض تقديم خدمات المعاينة، دراسات الأحمال الهندسية، الصيانة، وتزويد العملاء بعروض الأسعار الرسمية.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. أمن المعاملات والاتصال</h2>
          <p>
            لا نقوم ببيع أو مشاركة أو تأجير أي من بيانات الاتصال الخاصة بعملائنا مع أي جهة خارجية أو شركات إعلانية. تتم كافة المراسلات عبر القنوات الرسمية المعتمدة لشركة العريقي إنفركول على الهاتف والواتساب <strong>(770931413)</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. تواصل ومتابعة الخصوصية</h2>
          <p>
            لأي استفسارات بخصوص سريّة بيانات مشاريعكم أو لحذف بيانات طلبات الصيانة السابقة، يمكنكم التواصل مع الإدارة الفنية مباشرة.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<LegalProps> = ({ navigate }) => {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <button
        onClick={() => navigate('home')}
        className="text-xs font-bold text-slate-500 hover:text-[#C87D55] flex items-center gap-1"
      >
        {language === 'ar' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
        <span>{t('العودة للرئيسية', 'Back to Home')}</span>
      </button>

      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="w-10 h-10 rounded-xl bg-[#0B192C] text-[#C87D55] flex items-center justify-center">
          <FileCheck className="w-5 h-5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {t('الشروط والأحكام والضمانات الهندسية', 'Terms, Conditions & Engineering Warranties')}
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          {t('شركة العريقي إنفركول لأنظمة التكييف والتبريد المركزي', 'AL-ARRIQI INVERCOOL')}
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. نطاق الأعمال والمواصفات</h2>
          <p>
            تخضع كافة أعمال التوريد والتركيب والصيانة المقدمة من شركة العريقي إنفركول للأصول الهندسية القياسية ومعايير الجمعية الأمريكية لمهندسي التبريد والتدفئة وتكييف الهواء (ASHRAE)، وحسب المواصفات المحددة في عقود التنفيذ أو عروض الأسعار المعتمدة.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. سياسة الضمان المعتمد</h2>
          <p>
            تمنح شركة العريقي إنفركول ضماناً كتابياً معتمداً على كافة الأجهزة الجديدة، وكذلك ضماناً تشغيلياً على أعمال الصيانة وقطع الغيار الأصلية المركبة من قبل مهندسي وفنيي الشركة، شريطة الالتزام بتعليمات التشغيل والصيانة الدورية المقررة وتجنب تذبذب التيار غير المنتظم.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. طلبات الطوارئ والمواعيد</h2>
          <p>
            تخضع مواعيد الاستجابة لزيارات الفنيين بحسب الأولوية المحددة بالطلب والمنطقة الجغرافية داخل محافظات الجمهورية اليمنية، مع إعطاء الأولوية القصوى لحالات غرف تبريد الأدوية والمخازن الغذائية الحيوية.
          </p>
        </section>
      </div>
    </div>
  );
};
