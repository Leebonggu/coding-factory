import Link from 'next/link'

export default function SaasDemo() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <nav className="border-b border-[var(--border)] px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            ← Back
          </Link>
          <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">SaaS Preset</span>
        </div>
      </nav>

      {/* Dashboard Preview */}
      <div className="flex min-h-[80vh]">
        {/* Sidebar */}
        <aside className="hidden w-60 border-r border-[var(--border)] bg-[var(--muted)] p-4 lg:block">
          <div className="mb-6 text-lg font-bold">Dashboard</div>
          <nav className="space-y-1">
            {['Overview', 'Users', 'Analytics', 'Settings'].map((item) => (
              <div
                key={item}
                className="rounded-md px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)]"
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="mb-8 text-3xl font-bold">SaaS Dashboard</h1>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Users', value: '12,847' },
              { label: 'Active Now', value: '342' },
              { label: 'Revenue', value: '$48,290' },
              { label: 'Growth', value: '+12.5%' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-[var(--border)] p-4">
                <p className="text-sm text-[var(--muted-foreground)]">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Included Modules */}
          <h2 className="mb-4 text-xl font-bold">Included Modules</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Auth', desc: 'NextAuth.js v5 — Google, Kakao, Naver + credentials login' },
              { name: 'Database', desc: 'Prisma ORM — PostgreSQL with adapter pattern' },
              { name: 'Security', desc: 'CSP headers, CSRF protection, rate limiting, Zod validation' },
              { name: 'Analytics', desc: 'GA4 + GTM event tracking with cookie consent' },
              { name: 'SEO', desc: 'Meta tags, sitemap, robots.txt, structured data' },
            ].map((mod) => (
              <div key={mod.name} className="rounded-lg border border-[var(--border)] p-4">
                <h3 className="mb-1 font-semibold">{mod.name}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
