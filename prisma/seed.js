const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  const products = [
    {
      slug: 'iphone-17-pro',
      name: 'iPhone 17 Pro',
      brand: 'Apple',
      description: 'A19 Pro chip, 6.3-inch Super Retina XDR display with ProMotion, and a pro camera system in a grade-5 titanium frame.',
      highlights: JSON.stringify(['A19 Pro chip with 6-core GPU', '48MP Fusion triple camera', '6.3" ProMotion 120Hz display', 'Titanium body, IP68']),
      rating: 4.8,
      review_count: 2412,
      variants: {
        create: [
          {
            slug: 'iphone-17-pro-silver-256', color: 'Silver', colorHex: '#d8dbde', storage: '256 GB', mrp: 139900, price: 134900, imageUrl: '/products/iphone17pro-silver.webp'
          },
          {
            slug: 'iphone-17-pro-silver-512', color: 'Silver', colorHex: '#d8dbde', storage: '512 GB', mrp: 159900, price: 154900, imageUrl: '/products/iphone17pro-silver.webp'
          },
          {
            slug: 'iphone-17-pro-blue-256', color: 'Deep Blue', colorHex: '#25415f', storage: '256 GB', mrp: 139900, price: 136900, imageUrl: '/products/iphone17_PNG42.png'
          }
        ]
      }
    },
    {
      slug: 'samsung-galaxy-s24-ultra',
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      description: 'Snapdragon 8 Gen 3 for Galaxy, built-in S Pen and a 200MP camera with Galaxy AI photo tools.',
      highlights: JSON.stringify(['200MP wide camera with 5x optical zoom', 'Snapdragon 8 Gen 3 for Galaxy', '6.8" QHD+ 120Hz AMOLED', 'Built-in S Pen']),
      rating: 4.7,
      review_count: 1890,
      variants: {
        create: [
          {
            slug: 'galaxy-s24-ultra-black-256', color: 'Titanium Black', colorHex: '#3a3a3c', storage: '256 GB', mrp: 129999, price: 109999, imageUrl: '/products/samsung24ultra-black.webp'
          },
          {
            slug: 'galaxy-s24-ultra-black-512', color: 'Titanium Black', colorHex: '#3a3a3c', storage: '512 GB', mrp: 139999, price: 119999, imageUrl: '/products/samsung24ultra-black.webp'
          },
          {
            slug: 'galaxy-s24-ultra-violet-256', color: 'Titanium Violet', colorHex: '#7c5ec7', storage: '256 GB', mrp: 129999, price: 112999, imageUrl: '/products/samsung24ultra-blue.webp'
          }
        ]
      }
    },
    {
      slug: 'oneplus-13',
      name: 'OnePlus 13',
      brand: 'OnePlus',
      description: 'Snapdragon 8 Elite, 6000mAh battery with 100W SuperVOOC charging and a Hasselblad-tuned triple camera.',
      highlights: JSON.stringify(['Snapdragon 8 Elite', '6000mAh with 100W charging', 'Hasselblad triple camera', '6.82" 2K LTPO AMOLED']),
      rating: 4.6,
      review_count: 1123,
      variants: {
        create: [
          {
            slug: 'oneplus-13-green-256', color: 'Arctic Green', colorHex: '#2f7d6b', storage: '256 GB', mrp: 69999, price: 64999, imageUrl: '/products/oneplus13-green.webp'
          },
          {
            slug: 'oneplus-13-green-512', color: 'Arctic Green', colorHex: '#2f7d6b', storage: '512 GB', mrp: 76999, price: 71999, imageUrl: '/products/oneplus13-green.webp'
          },
          {
            slug: 'oneplus-13-black-512', color: 'Midnight Ocean', colorHex: '#1b1d21', storage: '512 GB', mrp: 76999, price: 69999, imageUrl: '/products/oneplus13-ocean.webp'
          }
        ]
      }
    }
  ];

  for (const p of products) {
    const createdProduct = await prisma.product.create({
      data: p,
      include: { variants: true }
    });

    for (const v of createdProduct.variants) {
      const plans = [
        { tenureMonths: 3, interestRate: 0.00, cashbackPct: 2.0, cashbackLabel: 'Up to 2% cashback on completion', isRecommended: false },
        { tenureMonths: 6, interestRate: 0.00, cashbackPct: 1.0, cashbackLabel: 'Up to 1% cashback on completion', isRecommended: true },
        { tenureMonths: 9, interestRate: 10.50, cashbackPct: 0.0, cashbackLabel: null, isRecommended: false },
        { tenureMonths: 12, interestRate: 12.00, cashbackPct: 0.0, cashbackLabel: null, isRecommended: false },
        { tenureMonths: 24, interestRate: 13.50, cashbackPct: 0.0, cashbackLabel: null, isRecommended: false },
      ];

      for (const t of plans) {
        const monthlyAmount = Math.round((v.price * (1 + t.interestRate / 100 * t.tenureMonths / 12.0)) / t.tenureMonths);
        const cashbackAmount = t.cashbackPct > 0 ? Math.min(Math.round(v.price * t.cashbackPct / 100.0), 3000) : 0;
        
        await prisma.emiPlan.create({
          data: {
            variantId: v.id,
            tenureMonths: t.tenureMonths,
            interestRate: t.interestRate,
            monthlyAmount: monthlyAmount,
            downPayment: 0,
            cashbackAmount: cashbackAmount,
            cashbackLabel: t.cashbackLabel,
            isRecommended: t.isRecommended
          }
        });
      }
    }
  }

  console.log("Database seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
