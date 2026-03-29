import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
}

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string }>
}

/**
 * Login page — server component.
 * Renders the client-side LoginForm and forwards the callbackUrl query param.
 */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams

  return <LoginForm callbackUrl={callbackUrl ?? '/dashboard'} />
}
