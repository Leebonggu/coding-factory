'use client'

import Script from 'next/script'
import { ADSENSE_CLIENT_ID } from '@/lib/ads'

export function AdsenseScript() {
  if (!ADSENSE_CLIENT_ID) return null

  return (
    <Script
      id="adsense-script"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}
