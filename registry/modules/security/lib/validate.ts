/**
 * Input Validation Helpers
 *
 * Thin wrappers that parse and validate incoming data using a Zod schema.
 * On failure they throw a `ValidationError` with structured per-field messages.
 *
 * Requires `zod` (^3) — install it with:
 *   npm install zod
 *   # or
 *   pnpm add zod
 *
 * @example Validate a JSON request body
 *
 *   import { z } from 'zod'
 *   import { validateBody } from '@/lib/security/validate'
 *
 *   const CreateUserSchema = z.object({
 *     email: z.string().email(),
 *     name: z.string().min(1).max(100),
 *   })
 *
 *   export async function POST(request: Request) {
 *     const body = await validateBody(request, CreateUserSchema)
 *     // body is typed as { email: string; name: string }
 *   }
 *
 * @example Validate URL path params
 *
 *   import { z } from 'zod'
 *   import { validateParams } from '@/lib/security/validate'
 *
 *   const ParamsSchema = z.object({ id: z.string().uuid() })
 *
 *   export async function GET(_req: Request, { params }: { params: { id: string } }) {
 *     const { id } = validateParams(params, ParamsSchema)
 *   }
 *
 * @example Validate URL search params
 *
 *   import { z } from 'zod'
 *   import { validateSearchParams } from '@/lib/security/validate'
 *
 *   const QuerySchema = z.object({
 *     page: z.coerce.number().int().positive().default(1),
 *     q: z.string().optional(),
 *   })
 *
 *   export async function GET(request: Request) {
 *     const { page, q } = validateSearchParams(new URL(request.url), QuerySchema)
 *   }
 */

// ---------------------------------------------------------------------------
// ValidationError
// ---------------------------------------------------------------------------

export interface FieldError {
  field: string
  message: string
}

export class ValidationError extends Error {
  /** Structured per-field error list, suitable for returning in API responses. */
  readonly errors: FieldError[]
  /** HTTP status code hint — always 422 for validation failures. */
  readonly statusCode = 422

  constructor(errors: FieldError[]) {
    const summary = errors.map((e) => `${e.field}: ${e.message}`).join(', ')
    super(`Validation failed — ${summary}`)
    this.name = 'ValidationError'
    this.errors = errors
  }

  /** Convenience: return a JSON-serialisable body for API responses. */
  toResponse() {
    return {
      error: 'Validation Error',
      errors: this.errors,
    }
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * ZodSchema-like interface.
 * We avoid importing Zod directly so this file has no hard runtime dependency.
 * Pass a real `z.ZodType<T>` and it will work correctly.
 */
interface ZodLike<T> {
  safeParse(data: unknown): ZodSafeParseResult<T>
}

type ZodSafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: ZodErrorLike }

interface ZodErrorLike {
  errors: Array<{
    path: Array<string | number>
    message: string
  }>
}

function parseZodResult<T>(result: ZodSafeParseResult<T>): T {
  if (result.success) return result.data

  const errors: FieldError[] = result.error.errors.map((e) => ({
    field: e.path.join('.') || '_root',
    message: e.message,
  }))

  throw new ValidationError(errors)
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Parse and validate the JSON body of a `Request`.
 *
 * @param request - Incoming Fetch API / Next.js request.
 * @param schema  - A Zod schema (`z.ZodType<T>`). The inferred type `T` becomes the return type.
 * @returns The validated, typed body.
 * @throws {ValidationError} If the body is not valid JSON or fails schema validation.
 */
export async function validateBody<T>(
  request: Request,
  schema: ZodLike<T>
): Promise<T> {
  let raw: unknown

  try {
    raw = await request.json()
  } catch {
    throw new ValidationError([{ field: '_root', message: 'Request body must be valid JSON' }])
  }

  return parseZodResult(schema.safeParse(raw))
}

/**
 * Validate URL path parameters (e.g. `{ id: '123' }` from dynamic route segments).
 *
 * @param params - Plain object of string params, typically from Next.js route context.
 * @param schema - A Zod schema. Use `z.coerce.*` for numeric/boolean params.
 * @returns The validated, typed params.
 * @throws {ValidationError} If any param fails schema validation.
 */
export function validateParams<T>(
  params: Record<string, string | string[]>,
  schema: ZodLike<T>
): T {
  return parseZodResult(schema.safeParse(params))
}

/**
 * Validate URL search (query) parameters.
 *
 * Converts `URLSearchParams` to a plain object before passing to the schema.
 * Multi-value params (e.g. `?tag=a&tag=b`) are represented as arrays.
 *
 * @param url    - A `URL` instance (e.g. `new URL(request.url)`).
 * @param schema - A Zod schema. Use `z.coerce.*` for numeric/boolean params.
 * @returns The validated, typed search params.
 * @throws {ValidationError} If any param fails schema validation.
 */
export function validateSearchParams<T>(url: URL, schema: ZodLike<T>): T {
  const raw: Record<string, string | string[]> = {}

  url.searchParams.forEach((value, key) => {
    const existing = raw[key]
    if (existing === undefined) {
      raw[key] = value
    } else if (Array.isArray(existing)) {
      existing.push(value)
    } else {
      raw[key] = [existing, value]
    }
  })

  return parseZodResult(schema.safeParse(raw))
}
