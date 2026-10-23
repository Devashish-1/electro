import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductByIdOrSlug } from '@/lib/db';
import { ProductDetailPage } from '@/views/ProductDetailPage';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductByIdOrSlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | DAGDI Electricals',
    };
  }

  return {
    title: `${product.name} | DAGDI Electricals & Power Controls`,
    description: `${product.shortDesc} - Authorized brand: ${product.brand}. In stock at Beawar with 100% GST ITC.`,
    openGraph: {
      title: `${product.name} — ${product.brand}`,
      description: product.shortDesc,
      images: product.images?.length ? [product.images[0]] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = await getProductByIdOrSlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailPage initialProduct={product} />;
}
