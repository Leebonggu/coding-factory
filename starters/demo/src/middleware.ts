import { chain } from '@/lib/middleware-chain'

// Modules will add their middlewares here
const middlewares: Parameters<typeof chain>[0] = []

export default chain(middlewares)

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
