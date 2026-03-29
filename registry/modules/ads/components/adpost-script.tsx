'use client'

import Script from 'next/script'
import { ADPOST_ID } from '@/lib/ads'

export function AdpostScript() {
  if (!ADPOST_ID) return null

  return (
    <Script
      id="adpost-script"
      src={`https://ads.blogger.com/pagead/show_ads.js`}
      data-adpost-id={ADPOST_ID}
      strategy="afterInteractive"
    />
  )
}
