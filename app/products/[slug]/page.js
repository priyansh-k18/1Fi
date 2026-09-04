import { notFound } from 'next/navigation';
import { getProductBySlug, listProducts } from '@/lib/catalog';
import ProductClient from './ProductClient';

export async function generateMetadata({ params }) {
  // Await params if using Next.js 15
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: "Product unavailable — FundEMI",
      robots: "noindex",
    };
  }

  const title = `${product.name} on EMI — FundEMI`;
  return {
    title,
    description: product.description.slice(0, 155),
    openGraph: {
      title,
      description: product.description.slice(0, 155),
    }
  };
}

export default async function ProductPage({ params }) {
  // Await params if using Next.js 15
  const resolvedParams = await params;
  
  const [product, allProducts] = await Promise.all([
    getProductBySlug(resolvedParams.slug),
    listProducts()
  ]);

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} allProducts={allProducts} />;
}
