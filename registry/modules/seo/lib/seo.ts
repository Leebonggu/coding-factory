import type { Metadata } from 'next'

interface SeoProps {
  title: string
  description: string
  url?: string
  image?: string
  type?: 'website' | 'article' | 'product'
  keywords?: string[]
  noIndex?: boolean
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export function generateSeoMetadata({
  title,
  description,
  url,
  image,
  type = 'website',
  keywords = [],
  noIndex = false,
}: SeoProps): Metadata {
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL
  const ogImage = image || `${SITE_URL}/og-image.png`

  return {
    title,
    description,
    keywords,
    ...(noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      title,
      description,
      url: fullUrl,
      type,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      siteName: title,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: fullUrl,
    },
    other: {
      // Naver Webmaster
      'naver-site-verification': process.env.NAVER_SITE_VERIFICATION || '',
      // Daum/Kakao
      'daumsa': process.env.DAUM_SITE_VERIFICATION || '',
    },
  }
}
