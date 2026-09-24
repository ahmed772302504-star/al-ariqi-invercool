import React, { useState } from 'react';
import { useApp } from '../context';
import {
  Calculator,
  Snowflake,
  Sun,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
  Layers,
  Thermometer,
  Zap,
  HelpCircle
} from 'lucide-react';

interface CalculatorProps {
  openQuoteModal: () => void;
  setCurrentTab: (tab: string) => void;
}

export const CalculatorView: React.FC<CalculatorProps> = ({
  openQuoteModal,
  setCurrentTab
}) => {
  const { lang, t, governates } = useApp();

  // Inputs
  const [length, setLength] = useState<number>(5);
  const [width, setWidth] = useState<number>(4);
  const [height, setHeight] = useState<number>(3.0);
  const [governate, setGovernate] = useState<string>('صنعاء');
  const [insulation, setInsulation] = useState<string>('normal'); // poor, normal, excellent
  const [sunExposure, setSunExposure] = useState<string>('medium'); // low, medium, high
  const [occupants, setOccupants] = useState<number>(3);
  const [appliancesHeat, setAppliancesHeat] = useState<string>('low'); // low, medium, high (kitchen/computers)

  // Calculations
  // Yemen climatic multiplier:
  // Sana'a & Dhamar (High altitude, moderate summer): ~250 - 300 BTU/m3
  // Aden, Hodeidah, Mukalla, Marib (Extreme coastal/desert humidity and heat): ~350 - 450 BTU/m3
  const isExtremeClimate = ['عدن', 'الحديدة', 'مأرب', 'حضرموت', 'سقطرى', 'المهرة', 'شبوة', 'أبين', 'لحج'].includes(governate);

  const area = Math.round(length * width * 10) / 10;
  const volume = Math.round(length * width * height * 10) / 10;

  // Base BTU per cubic meter
  let baseBtuPerM3 = isExtremeClimate ? 340 : 260;

  // Modifiers
  if (insulation === 'poor') baseBtuPerM3 *= 1.2;
  if (insulation === 'excellent') baseBtuPerM3 *= 0.88;

  if (sunExposure === 'high') baseBtuPerM3 *= 1.18;
  if (sunExposure === 'low') baseBtuPerM3 *= 0.92;

  let calculatedBTU = volume * baseBtuPerM3;

  // Add occupants (approx 600 BTU per extra person over 2)
  if (occupants > 2) {
    calculatedBTU += (occupants - 2) * 600;
  }

  // Electrical appliances
  if (appliancesHeat === 'medium') calculatedBTU += 1500;
  if (appliancesHeat === 'high') calculatedBTU += 3500;

  // Convert to Tons of Refrigeration (1 TR = 12,000 BTU/hr)
  const exactTons = calculatedBTU / 12000;
  const roundedTons = Math.round(exactTons * 10) / 10;

  // Recommended commercial size step
  let recommendedSize = '1.5 طن (18,000 وحدة)';
  let recommendedBTU = 18000;
  let estimatedEnergyKwh = '0.9 - 1.2 ك.و/ساعة (إنفرتر اقتصادي)';

  if (exactTons <= 1.1) {
    recommendedSize = '1 طن (12,000 وحدة)';
    recommendedBTU = 12000;
    estimatedEnergyKwh = '0.6 - 0.9 ك.و/ساعة (إنفرتر اقتصادي)';
  } else if (exactTons <= 1.7) {
    recommendedSize = '1.5 طن (18,000 وحدة)';
    recommendedBTU = 18000;
    estimatedEnergyKwh = '0.9 - 1.3 ك.و/ساعة (إنفرتر اقتصادي)';
  } else if (exactTons <= 2.3) {
    recommendedSize = '2 طن (24,000 وحدة)';
    recommendedBTU = 24000;
    estimatedEnergyKwh = '1.2 - 1.8 ك.و/ساعة (إنفرتر اقتصادي)';
  } else if (exactTons <= 2.8) {
    recommendedSize = '2.5 طن (30,000 وحدة)';
    recommendedBTU = 30000;
    estimatedEnergyKwh = '1.6 - 2.2 ك.و/ساعة (إنفرتر اقتصادي)';
  } else if (exactTons <= 3.4) {
    recommendedSize = '3 طن (36,000 وحدة)';
    recommendedBTU = 36000;
    estimatedEnergyKwh = '2.0 - 2.7 ك.و/ساعة';
  } else {
    const multiUnits = Math.ceil(exactTons / 2);
    recommendedSize = `${roundedTons} طن (${Math.round(calculatedBTU).toLocaleString()} وحدة) - ينصح بنظام متعدد VRF أو ${multiUnits} وحدات`;
    recommendedBTU = Math.round(calculatedBTU);
    estimatedEnergyKwh = 'يحدد بعد دراسة المخطط الهندسي';
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C87D55]/10 border border-[#C87D55]/30 text-xs font-bold text-[#A85D35]">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t('معادلة هندسية مطابقة لبيئة ومناخ المحافظات اليمنية', 'Yemeni Climate-Accredited HVAC Calculation')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B192C]">
            {t('حاسبة سعة التكييف والأحمال الحرارية', 'AC Tonnage & Thermal Load Calculator')}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t(
              'احسب السعة التبريدية المثالية (طن تبريد / BTU) بدقة بالغة وفقاً لأبعاد الغرفة والمحافظة اليمنية وطبيعة العزل وشدة التعرض لأشعة الشمس لتجنب استهلاك الكهرباء الزائد أو ضعف التبريد.',
              'Calculate the ideal AC cooling capacity (Tons / BTU) tailored to your room dimensions, Yemeni region climate, insulation and sun exposure.'
            )}
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
            <h2 className="text-base font-bold text-[#0B192C] flex items-center gap-2 pb-3 border-b border-slate-100">
              <Layers className="w-4 h-4 text-[#C87D55]" />
              <span>{t('1. أبعاد المكان والبيئة المناخية', '1. Dimensions & Environmental Data')}</span>
            </h2>

            {/* Room Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('الطول (متر)', 'Length (m)')}: <span className="text-[#C87D55] font-extrabold">{length} م</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="0.5"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value))}
                  className="w-full accent-[#C87D55]"
                />
                <input
                  type="number"
                  min="2"
                  max="30"
                  step="0.5"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value) || 2)}
                  className="mt-2 w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('العرض (متر)', 'Width (m)')}: <span className="text-[#C87D55] font-extrabold">{width} م</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="0.5"
                  value={width}
                  onChange={(e) => setWidth(parseFloat(e.target.value))}
                  className="w-full accent-[#C87D55]"
                />
                <input
                  type="number"
                  min="2"
                  max="30"
                  step="0.5"
                  value={width}
                  onChange={(e) => setWidth(parseFloat(e.target.value) || 2)}
                  className="mt-2 w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('الارتفاع (متر)', 'Height (m)')}: <span className="text-[#C87D55] font-extrabold">{height} م</span>
                </label>
                <input
                  type="range"
                  min="2.4"
                  max="7"
                  step="0.2"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value))}
                  className="w-full accent-[#C87D55]"
                />
                <input
                  type="number"
                  min="2"
                  max="10"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 2.4)}
                  className="mt-2 w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-800"
                />
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-around text-center text-xs">
              <div>
                <span className="text-slate-500 block">{t('المساحة الكلية', 'Total Area')}</span>
                <span className="font-bold text-slate-800">{area} م²</span>
              </div>
              <div className="border-r border-slate-300"></div>
              <div>
                <span className="text-slate-500 block">{t('الحجم الهوائي', 'Air Volume')}</span>
                <span className="font-bold text-slate-800">{volume} م³</span>
              </div>
            </div>

            {/* Region / Governate Factor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('المحافظة ومناخ المنطقة في اليمن', 'Governate & Regional Climate')}
              </label>
              <select
                value={governate}
                onChange={(e) => setGovernate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#C87D55]"
              >
                {governates.map((g) => (
                  <option key={g} value={g}>
                    {g} {['عدن', 'الحديدة', 'مأرب', 'حضرموت'].includes(g) ? `(${t('حرارة ورطوبة مرتفعة +30% سعة', 'High heat & humidity')})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Secondary Factors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('جودة العزل والأسقف', 'Insulation & Ceiling')}
                </label>
                <select
                  value={insulation}
                  onChange={(e) => setInsulation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                >
                  <option value="normal">{t('عزل متوسط (بناء حجري/بلوك معتاد)', 'Average Insulation')}</option>
                  <option value="poor">{t('عزل ضعيف / زنك / شمس مباشرة بالسقف', 'Poor / Corrugated Iron Roof')}</option>
                  <option value="excellent">{t('عزل ممتاز (صوف صخري / طابق وسطي)', 'Excellent / Insulated Middle Floor')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('التعرض لأشعة الشمس والنوافذ', 'Sun Exposure & Windows')}
                </label>
                <select
                  value={sunExposure}
                  onChange={(e) => setSunExposure(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                >
                  <option value="medium">{t('متوسط (واجهة عادية مع ستائر)', 'Medium (Standard Windows)')}</option>
                  <option value="high">{t('شديد (واجهة غربية/زجاج واسع مشمس)', 'High (Direct Sun / Large Glass)')}</option>
                  <option value="low">{t('منخفض (مظلل / لا نوافذ للشمس)', 'Low (Shaded / Northern Exposure)')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('متوسط عدد الأشخاص المتواجدين', 'Average Occupants Count')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={occupants}
                  onChange={(e) => setOccupants(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('الأجهزة والحرارة الإضافية', 'Appliance Heat Sources')}
                </label>
                <select
                  value={appliancesHeat}
                  onChange={(e) => setAppliancesHeat(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                >
                  <option value="low">{t('منخفضة (غرفة نوم / صالة معتادة)', 'Low (Bedroom / Standard Living)')}</option>
                  <option value="medium">{t('متوسطة (أجهزة كمبيوتر / شاشات / صالون)', 'Medium (Computers, TVs, Salon)')}</option>
                  <option value="high">{t('مرتفعة (مطبخ، سيرفرات، مطعم، إضاءة كثيفة)', 'High (Kitchen, Servers, Restaurant)')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Result Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0B192C] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C87D55]/20 rounded-full blur-2xl"></div>

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold text-[#C87D55] uppercase tracking-wider flex items-center gap-1.5">
                  <Snowflake className="w-4 h-4 animate-spin" />
                  {t('السعة التبريدية الموصى بها هندسياً', 'Recommended Cooling Output')}
                </span>
                <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-slate-300">
                  {governate}
                </span>
              </div>

              {/* Main Result Number */}
              <div className="my-6 text-center space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {recommendedSize}
                </div>
                <div className="text-xs font-mono text-[#C87D55] font-semibold">
                  {Math.round(calculatedBTU).toLocaleString()} BTU / hr (≈ {roundedTons} {t('طن تبريد', 'TR')})
                </div>
              </div>

              {/* Specific Engineering Breakdown */}
              <div className="space-y-3 text-xs bg-[#060E18] p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-slate-300">
                  <span>{t('معدل استهلاك الكهرباء المقدر:', 'Estimated Power Draw:')}</span>
                  <span className="font-bold text-emerald-400">{estimatedEnergyKwh}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>{t('نوع النظام المفضل:', 'Ideal System Type:')}</span>
                  <span className="font-bold text-white">
                    {exactTons <= 2.5 ? t('سبليت إنفرتر اقتصادي', 'Inverter Split') : t('سبليت دكت كونسيلد / VRF', 'Ducted Split / VRF')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>{t('معامل المناخ اليمني:', 'Regional Yemeni Climate Factor:')}</span>
                  <span className="font-bold text-[#C87D55]">
                    {isExtremeClimate ? t('مناخ ساحلي / حار (+35%)', 'Coastal / Hot (+35%)') : t('مناخ جبلي معتدل صيفاً', 'Highland Moderate')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-2.5">
                <button
                  onClick={openQuoteModal}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#C87D55] to-[#A85D35] hover:brightness-110 shadow-lg shadow-[#C87D55]/30 flex items-center justify-center gap-2 transition-transform transform active:scale-95"
                >
                  <span>{t('طلب عرض سعر للمكيف المناسب مع التركيب', 'Get Official Quote & Installation')}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>

                <button
                  onClick={() => setCurrentTab('products')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{t('تصفح الأجهزة والمكيفات المتوفرة في المخزن', 'Browse In-Stock AC Units')}</span>
                </button>
              </div>
            </div>

            {/* Note & Advice Box */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <Info className="w-4 h-4 shrink-0 text-amber-700" />
                <span>{t('نصيحة هندسية من العريقي إنفركول:', 'Engineering Advice:')}</span>
              </div>
              <p className="leading-relaxed text-[11px] text-amber-800">
                {t(
                  'اختيار سعة أقل من المطلوب يسبب عمل الكمبروسر بشكل مستمر دون توقف، مما يضاعف استهلاك الكهرباء ويقصر عمر الجهاز، بينما السعة الزائدة جداً تؤدي لبرودة سريعة مع رطوبة عالية داخل الغرفة. احرص دائماً على الحجم المناسب تماماً.',
                  'Undersizing causes the compressor to run continuously, wasting power and shortening lifespan. Oversizing leads to rapid temperature drops without proper dehumidification. Accurate sizing is essential.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
