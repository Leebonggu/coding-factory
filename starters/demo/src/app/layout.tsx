import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Coding Factory — Demo',
  description: '모듈 조합으로 웹 프로젝트를 빠르게 생성하는 보일러플레이트 시스템',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  )
}
