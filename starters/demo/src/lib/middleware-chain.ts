import { NextResponse, NextFetchEvent } from 'next/server'
import type { NextRequest, NextMiddleware } from 'next/server'

type MiddlewareFactory = (next: NextMiddleware) => NextMiddleware

export function chain(middlewares: MiddlewareFactory[]) {
  return function handler(request: NextRequest, event: NextFetchEvent) {
    let next: NextMiddleware = () => NextResponse.next()
    for (let i = middlewares.length - 1; i >= 0; i--) {
      next = middlewares[i](next)
    }
    return next(request, event)
  }
}
