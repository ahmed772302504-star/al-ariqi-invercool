import { createClient } from '@supabase/supabase-js';
import { Product } from './types.js';

// Read Supabase credentials from environment or local storage configuration
const SUPABASE_URL: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  (typeof window !== 'undefined' && window.localStorage?.getItem('VITE_SUPABASE_URL')) ||
  'https://your-project.supabase.co';

const SUPABASE_ANON_KEY: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof window !== 'undefined' && window.localStorage?.getItem('VITE_SUPABASE_ANON_KEY')) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

/**
 * Checks whether Supabase is configured with real non-placeholder credentials
 */
export function isSupabaseConfigured(): boolean {
  const url =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
    (typeof window !== 'undefined' && window.localStorage?.getItem('VITE_SUPABASE_URL'));
  const key =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof window !== 'undefined' && window.localStorage?.getItem('VITE_SUPABASE_ANON_KEY'));

  return Boolean(
    url &&
    key &&
    !url.includes('your-project') &&
    !url.includes('xyzcompany') &&
    key !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy'
  );
}

/**
 * Maps a raw row from Supabase (supporting both snake_case and camelCase column formats)
 * into a typed Product object.
 */
export function mapRowToProduct(row: any): Product {
  let specs: Record<string, string> = {};
  if (typeof row.specifications === 'string') {
    try {
      specs = JSON.parse(row.specifications);
    } catch {
      specs = {};
    }
  } else if (row.specifications && typeof row.specifications === 'object') {
    specs = row.specifications;
  }

  let addImages: string[] = [];
  const rawAddImages = row.additional_images ?? row.additionalImages;
  if (Array.isArray(rawAddImages)) {
    addImages = rawAddImages;
  } else if (typeof rawAddImages === 'string') {
    try {
      const parsed = JSON.parse(rawAddImages);
      if (Array.isArray(parsed)) addImages = parsed;
    } catch {
      addImages = [rawAddImages];
    }
  }

  return {
    id: String(row.id || ''),
    slug: row.slug || `prod-${row.id || Date.now()}`,
    nameAr: row.name_ar ?? row.nameAr ?? '',
    nameEn: row.name_en ?? row.nameEn ?? '',
    category: row.category ?? 'تكييف مركزي',
    brand: row.brand ?? 'AL-ARRIQI INVERCOOL',
    model: row.model ?? '',
    capacity: row.capacity ?? '',
    descAr: row.desc_ar ?? row.descAr ?? '',
    descEn: row.desc_en ?? row.descEn ?? '',
    specifications: specs,
    condition: (row.condition as any) || 'new',
    status: (row.status as any) || 'available',
    price: row.price !== undefined && row.price !== null ? Number(row.price) : undefined,
    showPrice: Boolean(row.show_price ?? row.showPrice ?? false),
    mainImage: row.main_image ?? row.mainImage ?? '/images/products/vrf-system.jpg',
    additionalImages: addImages,
    isFeatured: Boolean(row.is_featured ?? row.isFeatured ?? false),
    isImportedEconomy: Boolean(row.is_imported_economy ?? row.isImportedEconomy ?? false),
    energyConsumption: row.energy_consumption ?? row.energyConsumption ?? '',
    warranty: row.warranty ?? '',
    accessories: row.accessories ?? '',
    manufacturingYear: row.manufacturing_year ?? row.manufacturingYear ?? '',
    notes: row.notes ?? '',
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString()
  };
}

/**
 * Prepares standard snake_case payload for Supabase insertion/update
 */
export function getSnakeCasePayload(product: Partial<Product>): Record<string, any> {
  const p: Record<string, any> = {};
  if (product.id) p.id = product.id;
  if (product.slug) p.slug = product.slug;
  if (product.nameAr !== undefined) p.name_ar = product.nameAr;
  if (product.nameEn !== undefined) p.name_en = product.nameEn;
  if (product.category !== undefined) p.category = product.category;
  if (product.brand !== undefined) p.brand = product.brand;
  if (product.model !== undefined) p.model = product.model;
  if (product.capacity !== undefined) p.capacity = product.capacity;
  if (product.descAr !== undefined) p.desc_ar = product.descAr;
  if (product.descEn !== undefined) p.desc_en = product.descEn;
  if (product.specifications !== undefined) p.specifications = product.specifications;
  if (product.condition !== undefined) p.condition = product.condition;
  if (product.status !== undefined) p.status = product.status;
  if (product.price !== undefined) p.price = product.price;
  if (product.showPrice !== undefined) p.show_price = product.showPrice;
  if (product.mainImage !== undefined) p.main_image = product.mainImage;
  if (product.additionalImages !== undefined) p.additional_images = product.additionalImages;
  if (product.isFeatured !== undefined) p.is_featured = product.isFeatured;
  if (product.isImportedEconomy !== undefined) p.is_imported_economy = product.isImportedEconomy;
  if (product.energyConsumption !== undefined) p.energy_consumption = product.energyConsumption;
  if (product.warranty !== undefined) p.warranty = product.warranty;
  if (product.accessories !== undefined) p.accessories = product.accessories;
  if (product.manufacturingYear !== undefined) p.manufacturing_year = product.manufacturingYear;
  if (product.notes !== undefined) p.notes = product.notes;
  if (product.createdAt !== undefined) p.created_at = product.createdAt;
  return p;
}

/**
 * Prepares camelCase payload in case the Supabase table was created with camelCase column names
 */
export function getCamelCasePayload(product: Partial<Product>): Record<string, any> {
  const p: Record<string, any> = {};
  if (product.id) p.id = product.id;
  if (product.slug) p.slug = product.slug;
  if (product.nameAr !== undefined) p.nameAr = product.nameAr;
  if (product.nameEn !== undefined) p.nameEn = product.nameEn;
  if (product.category !== undefined) p.category = product.category;
  if (product.brand !== undefined) p.brand = product.brand;
  if (product.model !== undefined) p.model = product.model;
  if (product.capacity !== undefined) p.capacity = product.capacity;
  if (product.descAr !== undefined) p.descAr = product.descAr;
  if (product.descEn !== undefined) p.descEn = product.descEn;
  if (product.specifications !== undefined) p.specifications = product.specifications;
  if (product.condition !== undefined) p.condition = product.condition;
  if (product.status !== undefined) p.status = product.status;
  if (product.price !== undefined) p.price = product.price;
  if (product.showPrice !== undefined) p.showPrice = product.showPrice;
  if (product.mainImage !== undefined) p.mainImage = product.mainImage;
  if (product.additionalImages !== undefined) p.additionalImages = product.additionalImages;
  if (product.isFeatured !== undefined) p.isFeatured = product.isFeatured;
  if (product.isImportedEconomy !== undefined) p.isImportedEconomy = product.isImportedEconomy;
  if (product.energyConsumption !== undefined) p.energyConsumption = product.energyConsumption;
  if (product.warranty !== undefined) p.warranty = product.warranty;
  if (product.accessories !== undefined) p.accessories = product.accessories;
  if (product.manufacturingYear !== undefined) p.manufacturingYear = product.manufacturingYear;
  if (product.notes !== undefined) p.notes = product.notes;
  if (product.createdAt !== undefined) p.createdAt = product.createdAt;
  return p;
}
