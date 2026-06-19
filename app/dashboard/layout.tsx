import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { Toaster } from '@/components/ui/sonner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  return (
    <div className="min-h-svh flex relative" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 40%, #0e0a2e 100%)' }}>
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[30%] w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #00e1ff, transparent)' }} />
        <div className="absolute bottom-0 right-[10%] w-80 h-80 rounded-full opacity-8 blur-3xl" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      </div>
      <DashboardSidebar user={session.user} />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <DashboardHeader user={session.user} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}
