'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BarChart3,
  Users,
  FileText,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface Stats {
  totalEmployees: number
  totalPayrolls: number
  totalPayslips: number
  emailsSent: number
  emailsPending: number
  emailsFailed: number
}

interface EmailLog {
  id: number
  payslipId: number
  recipientEmail: string
  subject: string | null
  status: string | null
  sentAt: Date | null
  openedAt: Date | null
  errorMessage: string | null
  resendId: string | null
  createdAt: Date | null
}

export function ReportsContent({
  stats,
  emailLogs,
}: {
  stats: Stats
  emailLogs: EmailLog[]
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-success/10 text-success border-success/20">Sent</Badge>
      case 'pending':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'opened':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Opened</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const overviewCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      title: 'Payroll Batches',
      value: stats.totalPayrolls,
      icon: BarChart3,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      title: 'Payslips Generated',
      value: stats.totalPayslips,
      icon: FileText,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      title: 'Emails Sent',
      value: stats.emailsSent,
      icon: Mail,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
  ]

  const deliveryStats = [
    {
      label: 'Sent',
      value: stats.emailsSent,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
      percentage: stats.totalPayslips > 0 
        ? Math.round((stats.emailsSent / stats.totalPayslips) * 100) 
        : 0,
    },
    {
      label: 'Pending',
      value: stats.emailsPending,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      percentage: stats.totalPayslips > 0 
        ? Math.round((stats.emailsPending / stats.totalPayslips) * 100) 
        : 0,
    },
    {
      label: 'Failed',
      value: stats.emailsFailed,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      percentage: stats.totalPayslips > 0 
        ? Math.round((stats.emailsFailed / stats.totalPayslips) * 100) 
        : 0,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground">Track your payroll performance and email delivery status</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold">{card.value}</p>
                </div>
                <div className={`p-3 ${card.bgColor} rounded-lg`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="delivery" className="space-y-4">
        <TabsList>
          <TabsTrigger value="delivery">Email Delivery</TabsTrigger>
          <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="delivery" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Delivery Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Delivery Status
                </CardTitle>
                <CardDescription>
                  Email delivery breakdown by status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {deliveryStats.map((stat) => (
                  <div key={stat.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                          <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                        <span className="font-medium">{stat.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{stat.value}</span>
                        <Badge variant="outline">{stat.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stat.bgColor} transition-all duration-500`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quick Summary
                </CardTitle>
                <CardDescription>
                  Key metrics at a glance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">
                      {stats.totalPayslips > 0
                        ? Math.round((stats.emailsSent / stats.totalPayslips) * 100)
                        : 0}%
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Failure Rate</p>
                    <p className="text-2xl font-bold">
                      {stats.totalPayslips > 0
                        ? Math.round((stats.emailsFailed / stats.totalPayslips) * 100)
                        : 0}%
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Avg per Payroll</p>
                    <p className="text-2xl font-bold">
                      {stats.totalPayrolls > 0
                        ? Math.round(stats.totalPayslips / stats.totalPayrolls)
                        : 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Pending Action</p>
                    <p className="text-2xl font-bold">{stats.emailsPending}</p>
                  </div>
                </div>

                {stats.emailsFailed > 0 && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm font-medium text-destructive">
                      {stats.emailsFailed} email(s) failed to deliver
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Check the delivery logs for details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Delivery Logs
              </CardTitle>
              <CardDescription>
                Detailed log of all email deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emailLogs.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    No email logs yet. Send payslips to see delivery logs here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sent At</TableHead>
                        <TableHead>Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emailLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.recipientEmail}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {log.subject || '-'}
                          </TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                          <TableCell>
                            {mounted ? (
                              log.sentAt
                                ? format(new Date(log.sentAt), 'MMM d, yyyy HH:mm')
                                : log.createdAt
                                  ? formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })
                                  : '-'
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            {log.errorMessage ? (
                              <span className="text-sm text-destructive" title={log.errorMessage}>
                                {log.errorMessage.substring(0, 50)}
                                {log.errorMessage.length > 50 && '...'}
                              </span>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
