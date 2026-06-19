'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? 'Something went wrong')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main
      className="min-h-svh flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 30%, #0e0a2e 70%, #0a0f1e 100%)' }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-96 h-96 rounded-full opacity-25 blur-3xl" style={{ background: 'radial-gradient(circle, #00e1ff, transparent)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute top-[40%] right-[20%] w-64 h-64 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #059669, transparent)' }} />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Image src="/anviflow-logo.jpg" alt="ANVIFLOW" width={48} height={48} className="rounded-xl object-cover ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/20" />
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            ANVIFLOW
          </span>
        </div>

        {/* Glass Card */}
        <div
          className="rounded-2xl p-8 border border-white/15 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-white/50 text-sm">
              {isSignUp ? 'Start managing your payroll in minutes' : 'Sign in to continue to ANVIFLOW'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-white/80 text-sm font-medium">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="h-11 bg-white/8 border-white/15 text-white placeholder:text-white/30 focus:border-cyan-400/60 focus:ring-cyan-400/20 rounded-xl"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-white/80 text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-11 bg-white/8 border-white/15 text-white placeholder:text-white/30 focus:border-cyan-400/60 focus:ring-cyan-400/20 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-white/80 text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isSignUp ? 'Create a strong password' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  className="h-11 bg-white/8 border-white/15 text-white placeholder:text-white/30 focus:border-cyan-400/60 focus:ring-cyan-400/20 rounded-xl pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="text-sm p-3 rounded-xl border"
                style={{ background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.3)', color: '#fca5a5' }}
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-1 rounded-xl font-semibold text-white border-0 shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 8px 32px rgba(6,182,212,0.3)' }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-white/40 text-center mt-6">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <Link
              href={isSignUp ? '/sign-in' : '/sign-up'}
              className="text-cyan-400 font-medium hover:text-cyan-300 hover:underline underline-offset-4 transition-colors"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </Link>
          </p>
        </div>

        <p className="text-xs text-white/25 text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </main>
  )
}
