import { NextResponse } from 'next/server';
import { listProducts } from '@/lib/catalog';

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json({
      count: products.length,
      products
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
