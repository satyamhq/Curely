import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/doctor-dashboard',
        '/doctor-dashboard/*',
        '/pharmacy-dashboard',
        '/pharmacy-dashboard/*',
        '/lab-dashboard',
        '/lab-dashboard/*',
        '/admin',
        '/admin/*',
        '/api/*',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
