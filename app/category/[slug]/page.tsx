import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories } from '@/data/catalogue';
import { getProducts } from '@/lib/db';
import { CategoryHubView } from '@/views/CategoryHubView';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug || c.id === slug);

  if (!category) {
    return {
      title: 'Category Not Found | DAGDI Electricals',
    };
  }

  return {
    title: `${category.name} | DAGDI Electricals & Power Controls`,
    description: `${category.description} Authorized stockist in Beawar, Rajasthan with 100% GST ITC.`,
    openGraph: {
      title: `${category.name} — Industrial Supplies`,
      description: category.description,
    },
  };
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug || c.id === slug);

  if (!category) {
    notFound();
  }

  const allProducts = await getProducts();
  const categoryProducts = allProducts.filter((p) => p.category === category.id || p.category === category.slug);

  return <CategoryHubView category={category} initialProducts={categoryProducts} />;
}
