import { generateSeoMetadata } from '@/lib/seo'
import { faqSchema } from '@/lib/structured-data'
import { JsonLd } from '@/components/seo/json-ld'
import { AdSlot } from '@/components/ads/ad-slot'
import { AdBlockerDetect } from '@/components/ads/ad-blocker-detect'

export const metadata = generateSeoMetadata({
  title: 'Coding Factory — 모듈형 웹 프로젝트 생성기',
  description: 'CLI 한 줄로 Next.js 프로젝트 생성. SEO, Analytics, Ads, Auth, DB, Payments 모듈을 자유롭게 조합.',
  keywords: ['coding factory', 'boilerplate', 'next.js', 'module', 'cli'],
})

const faqs = [
  { question: 'Coding Factory란?', answer: '모듈 조합으로 웹 프로젝트를 빠르게 생성하는 보일러플레이트 시스템입니다. CLI 한 줄로 Next.js 프로젝트를 생성합니다.' },
  { question: '어떤 모듈이 있나요?', answer: 'SEO, Analytics, Ads, Security, Auth, DB, Payments 총 7개 모듈을 제공합니다.' },
  { question: '프리셋은 뭔가요?', answer: '목적에 맞게 미리 조합된 모듈 세트입니다. Landing, SaaS, E-commerce 3개 프리셋을 제공합니다.' },
  { question: '생성된 프로젝트는 독립적인가요?', answer: '네. coding-factory에 대한 런타임 의존성이 없는 순수 Next.js 앱입니다.' },
]

const modules = [
  { name: 'SEO', desc: 'Meta tags, sitemap, robots.txt, JSON-LD, 한국 포털 대응', tag: 'seo' },
  { name: 'Analytics', desc: 'GA4, GTM, event tracking, cookie consent banner', tag: 'analytics' },
  { name: 'Ads', desc: 'Google AdSense, Naver AdPost, ad-block detection', tag: 'ads' },
  { name: 'Security', desc: 'CSP, CSRF, rate limiting, Zod validation', tag: 'security' },
  { name: 'Auth', desc: 'NextAuth.js v5 — Google, Kakao, Naver + credentials', tag: 'auth' },
  { name: 'Database', desc: 'Prisma adapter — PostgreSQL, MySQL, SQLite', tag: 'db' },
  { name: 'Payments', desc: 'Toss Payments / Stripe unified adapter', tag: 'payments' },
]

const presets = [
  { name: 'Landing', modules: 'seo + analytics + ads', color: 'bg-blue-500' },
  { name: 'SaaS', modules: 'auth + db + security + analytics + seo', color: 'bg-purple-500' },
  { name: 'E-commerce', modules: 'auth + db + security + seo + analytics + ads + payments', color: 'bg-green-500' },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* JSON-LD — seo module: FAQ structured data */}
      <JsonLd data={faqSchema(faqs)} />

      {/* Hero */}
      <section className="flex flex-col items-center px-6 py-24">
        <div className="mb-4 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-600">
          Built with Coding Factory modules
        </div>
        <h1 className="mb-6 text-center text-5xl font-bold tracking-tight sm:text-6xl">
          Coding Factory
        </h1>
        <p className="mb-8 max-w-2xl text-center text-lg text-gray-500">
          모듈 조합으로 웹 프로젝트를 빠르게 생성하는 보일러플레이트 시스템.
          <br />
          CLI 한 줄로 Next.js 프로젝트 생성, 필요한 모듈만 추가/제거.
        </p>

        {/* Terminal */}
        <div className="mb-16 w-full max-w-lg overflow-hidden rounded-lg border border-gray-200 bg-gray-950 text-gray-100 shadow-xl">
          <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-gray-500">terminal</span>
          </div>
          <div className="p-4 font-mono text-sm">
            <p className="text-gray-400">$ pnpm factory init my-project</p>
            <p className="mt-2 text-green-400">? Select a preset</p>
            <p className="text-white">  ● landing — seo + analytics + ads</p>
            <p className="text-gray-500">  ○ saas — auth + db + security + analytics + seo</p>
            <p className="text-gray-500">  ○ ecommerce — all 7 modules</p>
            <p className="text-gray-500">  ○ custom — pick modules manually</p>
            <p className="mt-3 text-green-400">✓ Project created at ./my-project</p>
          </div>
        </div>
      </section>

      {/* Ad Slot — ads module: header position */}
      <div className="mx-auto max-w-5xl px-6">
        <AdSlot position="header" provider="custom" />
      </div>

      {/* Presets */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-2 text-center text-3xl font-bold">Presets</h2>
        <p className="mb-12 text-center text-gray-500">프로젝트 유형에 맞는 프리셋을 선택하세요</p>
        <div className="grid gap-6 sm:grid-cols-3">
          {presets.map((p) => (
            <div key={p.name} className="rounded-xl border border-gray-200 p-6 transition-all hover:shadow-lg">
              <div className={`mb-4 h-2 w-12 rounded-full ${p.color}`} />
              <h3 className="mb-2 text-xl font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.modules}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-2 text-center text-3xl font-bold">7 Modules</h2>
        <p className="mb-12 text-center text-gray-500">자유롭게 조합하세요. 생성 후에도 추가/제거 가능.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div key={m.name} className="rounded-lg border border-gray-200 p-5 transition-colors hover:bg-gray-50">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="font-semibold">{m.name}</h3>
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">{m.tag}</span>
              </div>
              <p className="text-sm text-gray-500">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ad Slot — ads module: in-article position */}
      <div className="mx-auto max-w-5xl px-6">
        <AdSlot position="in-article" provider="custom" />
      </div>

      {/* FAQ — with JSON-LD structured data from seo module */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-lg border border-gray-200 p-4">
              <summary className="cursor-pointer font-medium text-gray-900 group-open:mb-2">
                {faq.question}
              </summary>
              <p className="text-sm text-gray-500">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">How it works</h2>
        <div className="space-y-8">
          {[
            { step: '1', title: 'Choose a preset', desc: 'landing, saas, ecommerce, or custom' },
            { step: '2', title: 'Pick a theme', desc: 'default, corporate, or playful' },
            { step: '3', title: 'Generate', desc: 'CLI copies code into a clean Next.js project' },
            { step: '4', title: 'Customize', desc: 'Add/remove modules anytime with factory add/remove' },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ad Slot — ads module: footer position */}
      <div className="mx-auto max-w-5xl px-6">
        <AdSlot position="footer" provider="custom" />
      </div>

      {/* Ad block detector — ads module */}
      <AdBlockerDetect
        fallback={
          <div className="mx-auto max-w-5xl px-6 py-4 text-center text-sm text-gray-400">
            Ad blocker detected — ads module handles this gracefully
          </div>
        }
      />

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-8 text-center text-sm text-gray-400">
        Built with Coding Factory — SEO, Analytics, Ads modules active
      </footer>
    </main>
  )
}
