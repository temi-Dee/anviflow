'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  FileText,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface DashboardStats {
  totalEmployees: number
  totalPayrolls: number
  totalPayslips: number
  emailsSent: number
  emailsPending: number
  emailsFailed: number
  recentPayslips: Array<{
    id: number
    employeeName: string
    employeeEmail: string
    netSalary: string | null
    emailStatus: string | null
    createdAt: Date | null
  }>
}

export function DashboardContent({ stats }: { stats: DashboardStats }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      description: 'Active employees in system',
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      title: 'Payroll Batches',
      value: stats.totalPayrolls,
      icon: FileSpreadsheet,
      description: 'Total payroll uploads',
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      title: 'Payslips Generated',
      value: stats.totalPayslips,
      icon: FileText,
      description: 'Total payslips created',
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      title: 'Emails Sent',
      value: stats.emailsSent,
      icon: Mail,
      description: 'Successfully delivered',
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
  ]

  const emailStatusCards = [
    {
      title: 'Pending',
      value: stats.emailsPending,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Sent',
      value: stats.emailsSent,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Failed',
      value: stats.emailsFailed,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ]

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-success/10 text-success border-success/20">Sent</Badge>
      case 'pending':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const formatCurrency = (value: string | null) => {
    if (!value) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(value))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your payroll summary.</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Email Delivery Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Delivery Status
            </CardTitle>
            <CardDescription>Current status of payslip emails</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emailStatusCards.map((status) => (
                <div
                  key={status.title}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${status.bgColor} p-2 rounded-lg`}>
                      <status.icon className={`h-4 w-4 ${status.color}`} />
                    </div>
                    <span className="font-medium">{status.title}</span>
                  </div>
                  <span className="text-2xl font-bold">{status.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payslips */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Payslips
            </CardTitle>
            <CardDescription>Latest generated payslips</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentPayslips.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No payslips generated yet</p>
                <p className="text-sm">Upload payroll data to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentPayslips.map((payslip) => (
                  <div
                    key={payslip.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{payslip.employeeName}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {payslip.employeeEmail}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(payslip.netSalary)}</p>
                        <p className="text-xs text-muted-foreground">
                          {mounted && payslip.createdAt
                            ? formatDistanceToNow(new Date(payslip.createdAt), { addSuffix: true })
                            : 'Recently'}
                        </p>
                      </div>
                      {getStatusBadge(payslip.emailStatus)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
