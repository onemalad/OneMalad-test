import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/corporator-panel', '/api/'],
      },
    ],
    sitemap: 'https://onemalad.in/sitemap.xml',
  };
}
