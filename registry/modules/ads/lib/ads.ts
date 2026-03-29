export type AdPosition = 'header' | 'sidebar' | 'content' | 'footer' | 'in-article'

export type AdProvider = 'adsense' | 'adpost' | 'custom'

export interface AdConfig {
  provider: AdProvider
  clientId?: string
  slotId?: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  responsive?: boolean
}

export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''
export const ADPOST_ID = process.env.NEXT_PUBLIC_ADPOST_ID || ''
