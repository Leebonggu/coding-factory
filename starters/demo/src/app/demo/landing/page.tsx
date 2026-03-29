import Link from 'next/link'

export default function LandingDemo() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <nav className="border-b border-[var(--border)] px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            ← Back
          </Link>
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Landing Preset</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center px-6 py-24">
        <h1 className="mb-6 text-center text-5xl font-bold tracking-tight">
          Your Product, <span className="text-[var(--primary)]">Supercharged</span>
        </h1>
        <p className="mb-8 max-w-xl text-center text-lg text-[var(--muted-foreground)]">
          A beautiful landing page with built-in SEO optimization, analytics tracking,
          and ad placement — all configured automatically.
        </p>
        <div className="flex gap-3">
          <button className="rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-medium text-[var(--primary-foreground)]">
            Get Started
          </button>
          <button className="rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-medium">
            Learn More
          </button>
        </div>
      </section>

      {/* Included Modules */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold">What&apos;s Included</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <ModuleCard
            title="SEO Module"
            features={['Next.js Metadata API', 'Auto sitemap.xml', 'robots.txt', 'JSON-LD Structured Data', 'Naver/Daum portal meta']}
          />
          <ModuleCard
            title="Analytics Module"
            features={['GA4 integration', 'GTM container', 'Event tracking utils', 'Cookie consent banner']}
          />
          <ModuleCard
            title="Ads Module"
            features={['Google AdSense', 'Naver AdPost', '<AdSlot /> component', 'Ad-block detection']}
          />
        </div>
      </section>

      {/* Code Example */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold">One Command</h2>
        <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-gray-950 p-6 font-mono text-sm text-gray-100">
          <p className="text-gray-400"># Generate a landing page project</p>
          <p className="mt-1">pnpm create my-landing</p>
          <p className="mt-4 text-gray-400"># Modules are already configured:</p>
          <p className="mt-1 text-green-400">✓ SEO — meta tags, sitemap, structured data</p>
          <p className="text-green-400">✓ Analytics — GA4, GTM, event tracking</p>
          <p className="text-green-400">✓ Ads — AdSense, AdPost slots</p>
        </div>
      </section>
    </main>
  )
}

function ModuleCard({ title, features }: { title: string; features: string[] }) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-5">
      <h3 className="mb-3 font-semibold">{title}</h3>
      <ul className="space-y-1">
        {features.map((f) => (
          <li key={f} className="text-sm text-[var(--muted-foreground)]">• {f}</li>
        ))}
      </ul>
    </div>
  )
}
