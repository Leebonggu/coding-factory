import Link from 'next/link'

const products = [
  { name: 'Basic Plan', price: '₩29,000/mo', desc: 'For individuals', features: ['5 projects', 'All modules', 'Email support'] },
  { name: 'Pro Plan', price: '₩79,000/mo', desc: 'For teams', features: ['Unlimited projects', 'Priority support', 'Custom themes'] },
  { name: 'Enterprise', price: 'Contact us', desc: 'For organizations', features: ['White-label', 'Dedicated support', 'Custom modules'] },
]

export default function EcommerceDemo() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <nav className="border-b border-[var(--border)] px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            ← Back
          </Link>
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">E-commerce Preset</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 text-center">
        <h1 className="mb-4 text-4xl font-bold">E-commerce with Payments</h1>
        <p className="mx-auto max-w-xl text-[var(--muted-foreground)]">
          Full-stack e-commerce ready: authentication, database, security, SEO, analytics, ads,
          and payment gateway integration out of the box.
        </p>
      </section>

      {/* Pricing Cards (demonstrate payment flow) */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <h2 className="mb-8 text-center text-2xl font-bold">Pricing Example</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {products.map((product, i) => (
            <div
              key={product.name}
              className={`rounded-xl border p-6 ${
                i === 1
                  ? 'border-[var(--primary)] shadow-lg ring-1 ring-[var(--primary)]'
                  : 'border-[var(--border)]'
              }`}
            >
              {i === 1 && (
                <div className="mb-3 inline-block rounded-full bg-[var(--primary)] px-3 py-0.5 text-xs font-medium text-[var(--primary-foreground)]">
                  Popular
                </div>
              )}
              <h3 className="text-xl font-bold">{product.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{product.desc}</p>
              <p className="mt-4 text-3xl font-bold">{product.price}</p>
              <ul className="mt-4 space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full rounded-lg bg-[var(--primary)] py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary)]/90">
                {product.price === 'Contact us' ? 'Contact Sales' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Flow */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold">Payment Integration</h2>
        <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-gray-950 p-6 font-mono text-sm text-gray-100">
          <p className="text-gray-400">{'// Use PaymentButton anywhere in your app'}</p>
          <p className="mt-2 text-blue-300">{'import { PaymentButton } from'} <span className="text-green-300">{'"@/components/payments/payment-button"'}</span></p>
          <p className="mt-4 text-gray-300">{'<PaymentButton'}</p>
          <p className="text-gray-300">{'  orderId="order-123"'}</p>
          <p className="text-gray-300">{'  amount={29000}'}</p>
          <p className="text-gray-300">{'  orderName="Pro Plan"'}</p>
          <p className="text-gray-300">{'>'}</p>
          <p className="text-gray-300">{'  Subscribe Now'}</p>
          <p className="text-gray-300">{'</PaymentButton>'}</p>
          <p className="mt-4 text-gray-400">{'// Supports Toss Payments (KR) and Stripe (Global)'}</p>
          <p className="text-gray-400">{'// Switch with PAYMENT_PROVIDER=toss|stripe'}</p>
        </div>
      </section>

      {/* All 7 Modules */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold">All 7 Modules Included</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { name: 'Auth', desc: 'Social + credentials login with NextAuth.js v5' },
            { name: 'Database', desc: 'Prisma ORM with PostgreSQL' },
            { name: 'Security', desc: 'CSP, CSRF, rate limiting, Zod validation' },
            { name: 'SEO', desc: 'Meta tags, sitemap, structured data' },
            { name: 'Analytics', desc: 'GA4, GTM, event tracking' },
            { name: 'Ads', desc: 'AdSense, AdPost ad placement' },
            { name: 'Payments', desc: 'Toss / Stripe unified adapter' },
          ].map((mod) => (
            <div key={mod.name} className="flex items-start gap-3 rounded-lg border border-[var(--border)] p-4">
              <span className="mt-0.5 text-green-500">✓</span>
              <div>
                <h3 className="font-semibold">{mod.name}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{mod.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
