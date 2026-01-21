// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const domain = process.env.DOMAIN_WEB || 'https://therealielts.vn'
  
    return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/admin/',
      },
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/admin/'],
      },
    ],
    sitemap: `${domain}/sitemap.xml`,
  }
}
