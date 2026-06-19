import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, ArrowRight, CheckCircle, Shield, Zap, Users } from 'lucide-react'

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/dashboard')

  return (
    <main className="min-h-svh relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 25%, #0a1628 50%, #0e0a2e 75%, #0a0f1e 100%)' }}>
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #00e1ff, transparent)' }} />
        <div className="absolute top-[20%] right-[-5%] w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute bottom-[10%] left-[20%] w-72 h-72 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #059669, transparent)' }} />
        <div className="absolute bottom-[-5%] right-[10%] w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
      </div>

      {/* Single Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-md" style={{ background: 'rgba(10,15,30,0.6)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/anviflow-logo.jpg" alt="ANVIFLOW" width={40} height={40} className="rounded-lg object-cover ring-2 ring-cyan-400/40" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">ANVIFLOW</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors rounded-xl hover:bg-white/8"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 shadow-lg shadow-cyan-500/25"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-cyan-400/30"
            style={{ background: 'rgba(0,225,255,0.1)', color: '#00e1ff' }}
          >
            <Zap className="h-4 w-4" />
            Streamline your payroll
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-balance mb-6 leading-tight">
            <span className="text-white">Effortless Payslip</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Generation & Delivery
            </span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
            Upload your payroll data, generate professional PDF payslips, and deliver them securely to your employees via email — all in one seamless workflow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 h-12 px-8 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 shadow-xl shadow-cyan-500/30"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center h-12 px-8 text-sm font-semibold text-white/80 rounded-xl border border-white/20 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Everything you need for payroll management</h2>
            <p className="text-white/50 max-w-2xl mx-auto">Simplify your payroll process with our comprehensive suite of tools</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Employee Management', description: 'Add, edit, and organize your employee records. Import employees in bulk from Excel files.', color: '#00e1ff' },
              { icon: FileText, title: 'Payroll Upload', description: 'Upload payroll data from Excel or CSV. Automatic validation and error detection.', color: '#7c3aed' },
              { icon: CheckCircle, title: 'PDF Generation', description: 'Generate professional, branded payslip PDFs for each employee automatically.', color: '#059669' },
              { icon: Zap, title: 'Email Delivery', description: 'Send payslips directly to employee inboxes with one click. Track delivery status.', color: '#f59e0b' },
              { icon: Shield, title: 'Secure & Private', description: 'Bank-level security. Your data is encrypted and stored safely in the cloud.', color: '#ef4444' },
              { icon: Users, title: 'Detailed Reports', description: 'Track email delivery rates, failed sends, and overall payroll analytics.', color: '#ec4899' },
            ].map((feature, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border border-white/10 hover:border-white/25 transition-all duration-300 hover:scale-[1.02]"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}
              >
                <div className="h-11 w-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${feature.color}22`, border: `1px solid ${feature.color}44` }}>
                  <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6">
        <div
          className="max-w-2xl mx-auto text-center rounded-2xl p-12 border border-white/10"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to streamline your payroll?</h2>
          <p className="text-white/50 mb-8">Join businesses across Nigeria that trust ANVIFLOW for their payroll operations.</p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 h-12 px-8 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 shadow-xl shadow-cyan-500/30"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
          >
            Get Started for Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/anviflow-logo.jpg" alt="ANVIFLOW" width={32} height={32} className="rounded-md object-cover" />
            <span className="font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">ANVIFLOW</span>
          </div>
          <p className="text-sm text-white/40">© 2024 Anvictol Integrated Services Nigeria Limited</p>
        </div>
      </footer>
    </main>
  )
}
