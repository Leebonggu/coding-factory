import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new account to get started',
}

interface RegisterPageProps {
  searchParams: Promise<{ callbackUrl?: string }>
}

/**
 * Register page — server component.
 * Renders the client-side SignupForm and forwards the callbackUrl query param.
 */
export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { callbackUrl } = await searchParams

  return <SignupForm callbackUrl={callbackUrl ?? '/dashboard'} />
}
