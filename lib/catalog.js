import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

function localProductImage(slug) {
  if (slug.includes('iphone-17-pro-silver')) return '/products/iphone17pro-silver.webp';
  if (slug.includes('iphone-17-pro-blue')) return '/products/iphone17_PNG42.png';
  if (slug.includes('galaxy-s24-ultra-black')) return '/products/samsung24ultra-black.webp';
  if (slug.includes('galaxy-s24-ultra-violet')) return '/products/samsung24ultra-blue.webp';
  if (slug.includes('oneplus-13-green')) return '/products/oneplus13-green.webp';
  if (slug.includes('oneplus-13-black')) return '/products/oneplus13-ocean.webp';
  return null;
}

export async function listProducts() {
  const products = await prisma.product.findMany({
    include: {
      variants: {
        include: {
          emiPlans: true
        }
      }
    }
  });

  return products.map(product => {
    let lowest_price = null;
    let lowest_mrp = null;
    let lowest_emi = null;
    let hero_image = null;

    product.variants.forEach(variant => {
      if (lowest_price === null || variant.price < lowest_price) {
        lowest_price = variant.price;
      }
      if (lowest_mrp === null || variant.mrp < lowest_mrp) {
        lowest_mrp = variant.mrp;
      }
      if (!hero_image) {
        hero_image = localProductImage(variant.slug) || variant.imageUrl;
      }
      variant.emiPlans.forEach(plan => {
        if (lowest_emi === null || plan.monthlyAmount < lowest_emi) {
          lowest_emi = plan.monthlyAmount;
        }
      });
    });

    return {
      ...product,
      lowest_price,
      lowest_mrp,
      lowest_emi,
      variant_count: product.variants.length,
      hero_image,
      highlights: JSON.parse(product.highlights)
    };
  });
}

export async function getProductBySlug(slug) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: {
        include: {
          emiPlans: true
        }
      }
    }
  });

  if (!product) return null;

  return {
    ...product,
    variants: product.variants.map(variant => ({
      ...variant,
      imageUrl: localProductImage(variant.slug) || variant.imageUrl
    })),
    highlights: JSON.parse(product.highlights)
  };
}
