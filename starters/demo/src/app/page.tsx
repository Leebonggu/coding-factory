import Link from 'next/link'

const presets = [
  {
    name: 'Landing',
    description: 'SEO + Analytics + Ads',
    modules: ['seo', 'analytics', 'ads'],
    href: '/demo/landing',
    color: 'bg-blue-500',
  },
  {
    name: 'SaaS',
    description: 'Auth + DB + Security + Analytics + SEO',
    modules: ['auth', 'db', 'security', 'analytics', 'seo'],
    href: '/demo/saas',
    color: 'bg-purple-500',
  },
  {
    name: 'E-commerce',
    description: 'Auth + DB + Security + SEO + Analytics + Ads + Payments',
    modules: ['auth', 'db', 'security', 'seo', 'analytics', 'ads', 'payments'],
    href: '/demo/ecommerce',
    color: 'bg-green-500',
  },
]

const modules = [
  { name: 'seo', description: 'Meta tags, sitemap, robots.txt, JSON-LD', icon: '🔍' },
  { name: 'analytics', description: 'GA4, GTM, event tracking, cookie consent', icon: '📊' },
  { name: 'ads', description: 'Google AdSense, Naver AdPost', icon: '📢' },
  { name: 'security', description: 'CSP, CSRF, rate limiting, input validation', icon: '🛡️' },
  { name: 'auth', description: 'NextAuth.js v5, social + credentials login', icon: '🔐' },
  { name: 'db', description: 'Prisma adapter (PostgreSQL, MySQL, SQLite)', icon: '🗄️' },
  { name: 'payments', description: 'Toss Payments / Stripe with adapter pattern', icon: '💳' },
]

export default function DemoHome() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-24">
        <div className="mb-4 inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-sm text-[var(--muted-foreground)]">
          v0.1.0
        </div>
        <h1 className="mb-6 text-center text-5xl font-bold tracking-tight sm:text-6xl">
          Coding Factory
        </h1>
        <p className="mb-12 max-w-2xl text-center text-lg text-[var(--muted-foreground)]">
          모듈 조합으로 웹 프로젝트를 빠르게 생성하는 보일러플레이트 시스템.
          CLI 한 줄로 프로젝트 생성, 필요한 모듈만 추가/제거.
        </p>

        {/* CLI example */}
        <div className="mb-16 w-full max-w-lg overflow-hidden rounded-lg border border-[var(--border)] bg-gray-950 text-gray-100">
          <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-gray-500">terminal</span>
          </div>
          <div className="p-4 font-mono text-sm">
            <p className="text-gray-400">$ pnpm create my-project</p>
            <p className="mt-2 text-green-400">? Select a preset</p>
            <p className="text-white">  ● landing</p>
            <p className="text-gray-500">  ○ saas</p>
            <p className="text-gray-500">  ○ ecommerce</p>
            <p className="text-gray-500">  ○ custom</p>
          </div>
        </div>
      </section>

      {/* Presets */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-2 text-center text-3xl font-bold">Presets</h2>
        <p className="mb-12 text-center text-[var(--muted-foreground)]">
          프로젝트 유��에 맞는 프리셋을 선택하세요
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          {presets.map((preset) => (
            <Link
              key={preset.name}
              href={preset.href}
              className="group rounded-xl border border-[var(--border)] p-6 transition-all hover:border-[var(--primary)] hover:shadow-lg"
            >
              <div className={`mb-4 h-2 w-12 rounded-full ${preset.color}`} />
              <h3 className="mb-2 text-xl font-semibold group-hover:text-[var(--primary)]">
                {preset.name}
              </h3>
              <p className="mb-4 text-sm text-[var(--muted-foreground)]">{preset.description}</p>
              <div className="flex flex-wrap gap-1">
                {preset.modules.map((mod) => (
                  <span
                    key={mod}
                    className="rounded bg-[var(--muted)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]"
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-2 text-center text-3xl font-bold">Modules</h2>
        <p className="mb-12 text-center text-[var(--muted-foreground)]">
          7개 모듈을 자유롭게 조합하세요
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <div
              key={mod.name}
              className="rounded-lg border border-[var(--border)] p-5 transition-colors hover:bg-[var(--muted)]"
            >
              <div className="mb-3 text-2xl">{mod.icon}</div>
              <h3 className="mb-1 font-semibold">{mod.name}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{mod.description}</p>
            </div>
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-[var(--primary-foreground)]">
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-8 text-center text-sm text-[var(--muted-foreground)]">
        Built with Coding Factory
      </footer>
    </main>
  )
}
