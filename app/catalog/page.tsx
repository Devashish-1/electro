import { redirect } from 'next/navigation';
import { CatalogPage } from '@/views/CatalogPage';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category;
  if (typeof category === 'string' && category && category !== 'all') {
    redirect(`/category/${encodeURIComponent(category)}`);
  }
  return <CatalogPage />;
}
