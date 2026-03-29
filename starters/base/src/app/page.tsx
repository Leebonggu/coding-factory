export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <div className="max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-600">
          Production-ready starter
        </div>
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900">
          Coding Factory
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-gray-500">
          A minimal, modular Next.js 15 starter built for speed. Drop in
          registry modules, compose middleware, and ship — without the
          boilerplate.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="https://github.com"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            Get started
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            View docs
          </a>
        </div>
      </div>
    </main>
  )
}
