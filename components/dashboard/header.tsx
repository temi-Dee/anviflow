'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Upload,
  FileText,
  BarChart3,
  FileSpreadsheet,
  LogOut,
  Menu,
  X,
  Bell,
} from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
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

export function DashboardHeader({ user }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  const getPageTitle = () => {
    const current = navigation.find(
      (item) => pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
    )
    return current?.name || 'Dashboard'
  }

  const currentColor = navigation.find(
    (item) => pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
  )?.color || '#00e1ff'

  return (
    <header
      className="h-16 border-b border-white/10 flex items-center justify-between px-4 lg:px-6"
      style={{ background: 'rgba(10,15,30,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger className="lg:hidden">
            <button className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 p-0 border-white/10"
            style={{ background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(20px)' }}
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
              <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ANVIFLOW
              </span>
              <button
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      isActive ? 'text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/6'
                    )}
                    style={isActive ? { background: `${item.color}22`, borderLeft: `3px solid ${item.color}`, paddingLeft: '10px' } : {}}
                  >
                    <item.icon className="h-5 w-5 shrink-0" style={isActive ? { color: item.color } : {}} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: currentColor, boxShadow: `0 0 8px ${currentColor}` }} />
          <h1 className="text-base font-semibold text-white">{getPageTitle()}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors">
          <Bell className="h-5 w-5" />
        </button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div
              className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
            >
              {getInitials(user.name)}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border-white/15"
            style={{ background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(20px)' }}
          >
            <div className="px-2 py-2">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-white/40">{user.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
