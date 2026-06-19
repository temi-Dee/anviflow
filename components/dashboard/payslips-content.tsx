'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileText, Search, Mail, Send, Loader2, CheckCircle, Download, FileDown } from 'lucide-react'
import { toast } from 'sonner'

interface Payslip {
  id: number
  payrollId: number
  employeeId: number
  employeeName: string
  employeeEmail: string
  basicSalary: string | null
  allowances: string | null
  deductions: string | null
  tax: string | null
  netSalary: string | null
  pdfUrl: string | null
  pdfGeneratedAt: Date | null
  emailSentAt: Date | null
  emailStatus: string | null
  createdAt: Date | null
}

interface Payroll {
  id: number
  name: string
}

export function PayslipsContent({
  payslips,
  payrolls,
  currentPayrollId,
}: {
  payslips: Payslip[]
  payrolls: Payroll[]
  currentPayrollId?: number
}) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPayslips, setSelectedPayslips] = useState<number[]>([])
  const [sending, setSending] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)

  const filteredPayslips = payslips.filter(
    (p) =>
      p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.employeeEmail.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatCurrency = (value: string | null) => {
    if (!value) return '₦0.00'
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(parseFloat(value))
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-success/10 text-success border-success/20">Sent</Badge>
      case 'pending':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayslips(filteredPayslips.map((p) => p.id))
    } else {
      setSelectedPayslips([])
    }
  }

  const handleSelectPayslip = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedPayslips([...selectedPayslips, id])
    } else {
      setSelectedPayslips(selectedPayslips.filter((pid) => pid !== id))
    }
  }

  const handleGeneratePdfs = async () => {
    if (selectedPayslips.length === 0) {
      toast.error('Please select payslips to generate PDFs')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/payslips/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payslipIds: selectedPayslips }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate PDFs')
      }
      
      toast.success(data.message)
      setSelectedPayslips([])
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate PDFs')
      console.error(error)
    } finally {
      setGenerating(false)
    }
  }

  const handleSendEmails = async () => {
    if (selectedPayslips.length === 0) {
      toast.error('Please select payslips to send')
      return
    }

    setSending(true)
    try {
      const response = await fetch('/api/payslips/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payslipIds: selectedPayslips }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send emails')
      }
      
      toast.success(data.message)
      setSelectedPayslips([])
      setIsSendDialogOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send emails')
      console.error(error)
    } finally {
      setSending(false)
    }
  }

  const handlePayrollFilter = (value: string) => {
    if (value === 'all') {
      router.push('/dashboard/payslips')
    } else {
      router.push(`/dashboard/payslips?payrollId=${value}`)
    }
  }

  const pendingCount = payslips.filter((p) => p.emailStatus === 'pending').length
  const sentCount = payslips.filter((p) => p.emailStatus === 'sent').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-muted-foreground">Generate PDFs and send payslips to employees</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedPayslips.length > 0 && (
            <>
              <button onClick={handleGeneratePdfs} disabled={generating} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-white/15 text-white/70 hover:text-white hover:bg-white/8 disabled:opacity-60 transition-colors">
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                Generate PDFs ({selectedPayslips.length})
              </button>
              <button onClick={() => setIsSendDialogOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                <Send className="h-4 w-4" />
                Send Emails ({selectedPayslips.length})
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Payslips</p>
                <p className="text-2xl font-bold">{payslips.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <Mail className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold">{sentCount}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Payslip List
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={currentPayrollId?.toString() || 'all'}
                onValueChange={handlePayrollFilter}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by payroll" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payrolls</SelectItem>
                  {payrolls.map((payroll) => (
                    <SelectItem key={payroll.id} value={payroll.id.toString()}>
                      {payroll.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPayslips.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                {payslips.length === 0
                  ? 'No payslips yet. Upload payroll data to generate payslips.'
                  : 'No payslips match your search.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedPayslips.length === filteredPayslips.length && filteredPayslips.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead className="text-right">Basic</TableHead>
                    <TableHead className="text-right">Allowances</TableHead>
                    <TableHead className="text-right">Deductions</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                    <TableHead className="text-right">Net Salary</TableHead>
                    <TableHead>PDF</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayslips.map((payslip) => (
                    <TableRow key={payslip.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedPayslips.includes(payslip.id)}
                          onCheckedChange={(checked) =>
                            handleSelectPayslip(payslip.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payslip.employeeName}</p>
                          <p className="text-sm text-muted-foreground">{payslip.employeeEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(payslip.basicSalary)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(payslip.allowances)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(payslip.deductions)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(payslip.tax)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(payslip.netSalary)}
                      </TableCell>
                      <TableCell>
                        {payslip.pdfUrl ? (
                          <a href={`/api/payslips/download/${payslip.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                            <Download className="h-4 w-4" />
                          </a>
                        ) : (
                          <Badge variant="outline">Not generated</Badge>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(payslip.emailStatus)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send Confirmation Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Payslip Emails</DialogTitle>
            <DialogDescription>
              You are about to send payslip emails to {selectedPayslips.length} employee(s).
              Make sure PDFs have been generated before sending.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button onClick={() => setIsSendDialogOpen(false)} className="px-4 py-2 text-sm font-medium rounded-lg border border-white/15 text-white/70 hover:text-white hover:bg-white/8 transition-colors">Cancel</button>
            <button onClick={handleSendEmails} disabled={sending} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
              {sending ? (<><Loader2 className="h-4 w-4 animate-spin" />Sending...</>) : (<><Send className="h-4 w-4" />Send Emails</>)}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
