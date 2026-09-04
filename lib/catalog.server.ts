import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** Server-side publishable (anon) client — public catalog reads only. */
export function getPublicSupabase() {
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ??
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const url =
    process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"] ?? import.meta.env.VITE_SUPABASE_URL;
  if (!key || !url) {
    throw new Error(
      "Supabase configuration is missing. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.",
    );
  }
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

const PRODUCT_FIELDS =
  "id, slug, name, brand, category, description, highlights, rating, review_count";
const VARIANT_FIELDS =
  "id, slug, color, color_hex, storage, mrp, price, image_url, in_stock, product_id";
const PLAN_FIELDS =
  "id, variant_id, tenure_months, interest_rate, monthly_amount, down_payment, cashback_amount, cashback_label, is_recommended";

function localProductImage(slug: string) {
  if (slug.includes("iphone-17-pro-silver")) return "/products/iphone17pro-silver.webp";
  if (slug.includes("iphone-17-pro-blue")) return "/products/iphone17_PNG42.png";
  if (slug.includes("galaxy-s24-ultra-black")) return "/products/samsung24ultra-black.webp";
  if (slug.includes("galaxy-s24-ultra-violet")) return "/products/samsung24ultra-blue.webp";
  if (slug.includes("oneplus-13-green")) return "/products/oneplus13-green.webp";
  if (slug.includes("oneplus-13-black")) return "/products/oneplus13-ocean.webp";
  return null;
}

function useLocalProductImage<T extends { slug: string; image_url: string }>(variant: T) {
  return { ...variant, image_url: localProductImage(variant.slug) ?? variant.image_url };
}

export async function fetchProductList() {
  const supabase = getPublicSupabase();
  const { data: products, error } = await supabase
    .from("products")
    .select(`${PRODUCT_FIELDS}, product_variants(${VARIANT_FIELDS}, emi_plans(${PLAN_FIELDS}))`)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);

  return (products ?? []).map((product) => {
    const variants = [...(product.product_variants ?? [])]
      .map(useLocalProductImage)
      .sort((a, b) => a.price - b.price);
    const plans = variants.flatMap((v) => v.emi_plans ?? []);
    const lowestEmi = plans.length ? Math.min(...plans.map((p) => p.monthly_amount)) : null;
    return {
      ...product,
      product_variants: variants,
      lowest_price: variants[0]?.price ?? null,
      lowest_mrp: variants[0]?.mrp ?? null,
      hero_image: variants[0]?.image_url ?? null,
      lowest_emi: lowestEmi,
      variant_count: variants.length,
    };
  });
}

export async function fetchProductBySlug(slug: string) {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(`${PRODUCT_FIELDS}, product_variants(${VARIANT_FIELDS}, emi_plans(${PLAN_FIELDS}))`)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const variants = [...(data.product_variants ?? [])]
    .map(useLocalProductImage)
    .sort((a, b) => a.price - b.price)
    .map((variant) => ({
      ...variant,
      emi_plans: [...(variant.emi_plans ?? [])].sort(
        (a, b) => a.tenure_months - b.tenure_months,
      ),
    }));

  return { ...data, product_variants: variants };
}
