'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Upload,
  BarChart3,
  FileSpreadsheet,
  FileText,
  LogOut,
} from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'

interface SidebarProps {
  user: {
    id: string
    name: string
    email: string
  }
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: '#00e1ff' },
  { name: 'Employees', href: '/dashboard/employees', icon: Users, color: '#7c3aed' },
  { name: 'Import Employees', href: '/dashboard/employees/import', icon: Upload, color: '#059669' },
  { name: 'Payroll Upload', href: '/dashboard/payroll', icon: FileSpreadsheet, color: '#f59e0b' },
  { name: 'Payslips', href: '/dashboard/payslips', icon: FileText, color: '#ec4899' },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3, color: '#3b82f6' },
]

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  const initials = user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <aside
      className="hidden lg:flex w-64 flex-col border-r border-white/10"
      style={{ background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-white/10">
        <Image src="/anviflow-logo.jpg" alt="ANVIFLOW" width={36} height={36} className="rounded-lg object-cover ring-2 ring-cyan-400/40" />
        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          ANVIFLOW
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/6'
              )}
              style={isActive ? {
                background: `linear-gradient(135deg, ${item.color}22, ${item.color}11)`,
                borderLeft: `3px solid ${item.color}`,
                paddingLeft: '10px',
              } : {}}
            >
              <item.icon className="h-5 w-5 shrink-0" style={isActive ? { color: item.color } : {}} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-4">
        <Separator className="mb-4 bg-white/10" />
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-white/40 truncate">{user.email}</p>
          </div>
        </div>
        <button
          className="w-full flex items-center justify-start px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/8 rounded-xl transition-colors"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
