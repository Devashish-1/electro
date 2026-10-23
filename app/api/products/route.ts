import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/db';
import { Product } from '@/types';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');
    const sortBy = searchParams.get('sortBy') || 'featured';

    let products = await getProducts();

    if (search) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search) ||
        p.shortDesc.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.subcategory.toLowerCase().includes(search) ||
        Object.values(p.specs || {}).some(val => val.toLowerCase().includes(search))
      );
    }

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    if (brand && brand !== 'all') {
      products = products.filter(p => p.brand === brand);
    }

    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }

    if (inStock === 'true') {
      products = products.filter(p => p.inStock);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    const newProduct: Product = {
      id: body.id || `prod_${Date.now()}`,
      name: body.name,
      sku: body.sku || `DAG-${Date.now().toString().slice(-5)}`,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      brand: body.brand || 'DAGDI Controls',
      category: body.category,
      subcategory: body.subcategory || 'General',
      price: Number(body.price),
      mrp: Number(body.mrp || body.price * 1.2),
      unit: body.unit || 'Nos',
      inStock: body.inStock !== false,
      stockCount: Number(body.stockCount || 10),
      hsnCode: body.hsnCode || '8537',
      gstRate: Number(body.gstRate || 18),
      rating: 5.0,
      reviewCount: 1,
      featured: Boolean(body.featured),
      badge: body.badge,
      images: body.images?.length ? body.images : ['/images/apfc_panel.jpg'],
      shortDesc: body.shortDesc || '',
      fullDesc: body.fullDesc || '',
      specs: body.specs || {},
      applications: body.applications || ['Industrial manufacturing', 'Power distribution'],
      tierPricing: body.tierPricing || [],
      datasheetAvailable: Boolean(body.datasheetAvailable)
    };

    const saved = await addProduct(newProduct);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
