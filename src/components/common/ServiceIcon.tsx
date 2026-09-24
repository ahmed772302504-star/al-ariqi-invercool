import React from 'react';
import {
  Droplets,
  Snowflake,
  Utensils,
  Package,
  Box,
  Layers,
  Building,
  Building2,
  Wind,
  Factory,
  ShieldCheck,
  Zap,
  ThermometerSnowflake,
  Warehouse,
  Wrench,
  Truck,
  Cpu,
  Flame,
  Sparkles,
  Waves,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export interface IconOption {
  name: string;
  labelAr: string;
  labelEn: string;
  category: 'water' | 'cooling' | 'food' | 'industrial' | 'general';
}

export const AVAILABLE_SUB_SERVICE_ICONS: IconOption[] = [
  { name: 'Droplets', labelAr: 'مياه وسوائل (قوارير/كراتين)', labelEn: 'Water & Liquids (Bottles/Cartons)', category: 'water' },
  { name: 'Waves', labelAr: 'أمواج وتبريد مائي', labelEn: 'Waves & Water Chilling', category: 'water' },
  { name: 'Snowflake', labelAr: 'ثلج وتجميد فائق', labelEn: 'Snowflake & Deep Freezing', category: 'cooling' },
  { name: 'ThermometerSnowflake', labelAr: 'تبريد منخفض الحرارة (-25°C)', labelEn: 'Ultra Low Temp (-25°C)', category: 'cooling' },
  { name: 'Utensils', labelAr: 'لحوم ودواجن وأغذية', labelEn: 'Poultry, Meat & Food', category: 'food' },
  { name: 'Package', labelAr: 'كراتين وتعبئة وتوزيع', labelEn: 'Cartons & Packaging', category: 'industrial' },
  { name: 'Box', labelAr: 'صناديق ومخزون تجاري', labelEn: 'Boxes & Inventory', category: 'industrial' },
  { name: 'Layers', labelAr: 'ساندوتش بانل وعوازل', labelEn: 'Sandwich Panels & Insulation', category: 'industrial' },
  { name: 'Warehouse', labelAr: 'مستودعات وغرف مركزية', labelEn: 'Warehouses & Cold Hubs', category: 'industrial' },
  { name: 'Factory', labelAr: 'مصانع وخطوط إنتاج', labelEn: 'Factories & Industrial Lines', category: 'industrial' },
  { name: 'Building', labelAr: 'مباني وأبراج مركزية', labelEn: 'Central Commercial Buildings', category: 'industrial' },
  { name: 'Wind', labelAr: 'مجاري هواء وتكييف دكت', labelEn: 'Duct & Airflow', category: 'cooling' },
  { name: 'ShieldCheck', labelAr: 'حفظ وسلامة الأغذية', labelEn: 'Food Safety & Protection', category: 'general' },
  { name: 'Zap', labelAr: 'توفير طاقة وإنفرتر', labelEn: 'Inverter & Energy Saving', category: 'general' },
  { name: 'Cpu', labelAr: 'تحكم ذكي وأتمتة', labelEn: 'Smart Controls & Automation', category: 'general' },
  { name: 'Wrench', labelAr: 'صيانة وتجهيز هندسي', labelEn: 'Engineering Setup & Service', category: 'general' }
];

interface ServiceIconProps {
  name?: string;
  className?: string;
  defaultIcon?: React.ReactNode;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({
  name,
  className = 'w-5 h-5',
  defaultIcon
}) => {
  const iconProps = { className };

  switch (name) {
    case 'Droplets':
      return <Droplets {...iconProps} />;
    case 'Waves':
      return <Waves {...iconProps} />;
    case 'Snowflake':
      return <Snowflake {...iconProps} />;
    case 'ThermometerSnowflake':
      return <ThermometerSnowflake {...iconProps} />;
    case 'Utensils':
      return <Utensils {...iconProps} />;
    case 'Package':
      return <Package {...iconProps} />;
    case 'Box':
      return <Box {...iconProps} />;
    case 'Layers':
      return <Layers {...iconProps} />;
    case 'Warehouse':
      return <Warehouse {...iconProps} />;
    case 'Factory':
      return <Factory {...iconProps} />;
    case 'Building':
      return <Building {...iconProps} />;
    case 'Building2':
      return <Building2 {...iconProps} />;
    case 'Wind':
      return <Wind {...iconProps} />;
    case 'ShieldCheck':
      return <ShieldCheck {...iconProps} />;
    case 'Zap':
      return <Zap {...iconProps} />;
    case 'Cpu':
      return <Cpu {...iconProps} />;
    case 'Wrench':
      return <Wrench {...iconProps} />;
    case 'Truck':
      return <Truck {...iconProps} />;
    case 'Flame':
      return <Flame {...iconProps} />;
    case 'Sparkles':
      return <Sparkles {...iconProps} />;
    default:
      if (defaultIcon) return <>{defaultIcon}</>;
      return <Snowflake {...iconProps} />;
  }
};
