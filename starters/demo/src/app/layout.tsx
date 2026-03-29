import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { generateSeoMetadata } from '@/lib/seo'
import { organizationSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/seo/json-ld'
import { CookieConsent } from '@/components/analytics/cookie-consent'
import { GTM_ID, getGtmScript, getGtmNoScript } from '@/lib/gtm'
import './globals.css'

export const metadata = generateSeoMetadata({
  title: 'Coding Factory',
  description: '모듈 조합으로 웹 프로젝트를 빠르게 생성하는 보일러플레이트 시스템',
  keywords: ['boilerplate', 'next.js', 'coding factory', 'module'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* GTM — analytics module */}
        {GTM_ID && (
          <script dangerouslySetInnerHTML={{ __html: getGtmScript() }} />
        )}

        {/* JSON-LD — seo module */}
        <JsonLd
          data={organizationSchema({
            name: 'Coding Factory',
            url: 'https://coding-factory.dev',
            description: '모듈 조합으로 웹 프로젝트를 빠르게 생성하는 보일러플레이트 시스템',
          })}
        />
      </head>
      <body className="font-sans antialiased">
        {/* GTM noscript — analytics module */}
        {GTM_ID && (
          <noscript>
            <iframe src={getGtmNoScript()} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
          </noscript>
        )}

        {children}

        {/* Cookie consent banner — analytics module */}
        <CookieConsent />
      </body>
    </html>
  )
}
