import { MetadataRoute } from 'next';
import { initialProducts } from '@/data/catalogue';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dagdielectricals.com';

  const productUrls: MetadataRoute.Sitemap = initialProducts.map((p) => ({
    url: `${baseUrl}/products/${p.slug || p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/catalog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/quotation-builder`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/rewinding-service`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/order-tracking`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];

  return [...staticUrls, ...productUrls];
}
