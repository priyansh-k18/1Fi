import { NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/catalog';

export async function GET(request, { params }) {
  try {
    // Await params if using Next.js 15
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    
    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ product });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
