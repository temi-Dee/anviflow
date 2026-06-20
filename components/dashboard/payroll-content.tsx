'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload, FileSpreadsheet, Plus, Loader2, Download, Eye, Calendar } from 'lucide-react'
import { createPayroll, bulkCreatePayslips, updatePayrollStatus } from '@/app/actions/payslip-actions'
import { toast } from 'sonner'
import { format } from 'date-fns'
import Link from 'next/link'

interface Payroll {
  id: number
  name: string
  payPeriod: string
  payDate: string
  totalEmployees: number | null
  totalAmount: string | null
  status: string | null
  fileName: string | null
  createdAt: Date | null
}

interface Employee {
  id: number
  employeeId: string
  firstName: string
  lastName: string
  email: string
  salary: string | null
}

interface ParsedPayslip {
  employeeId: string
  employeeName: string
  employeeEmail: string
  position: string
  location: string
  daysWorked: string
  bankDetails: string
  basicSalary: string
  housingAllowance: string
  transportationAllowance: string
  otherSundryAllowance: string
  leaveAllowance: string
  overtime: string
  loan: string
  pensionContribution: string
  nhf: string
  netPay: string
  // legacy computed fields
  allowances: string
  deductions: string
  tax: string
  netSalary: string
  isValid: boolean
  errors: string[]
  matchedEmployeeDbId?: number
}

export function PayrollContent({ payrolls, employees }: { payrolls: Payroll[]; employees: Employee[] }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [parsedPayslips, setParsedPayslips] = useState<ParsedPayslip[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    payPeriod: '',
    payDate: '',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const validatePayslip = useCallback((row: Record<string, unknown>): ParsedPayslip => {
    const errors: string[] = []
    
    const employeeId = String(row['Employee ID'] || row['employee_id'] || row['EmployeeID'] || '').trim()
    const employeeName = String(row['Employee Name'] || row['Name'] || '').trim()
    const position = String(row['Position'] || row['position'] || '').trim()
    const location = String(row['Location'] || row['location'] || '').trim()
    const daysWorked = String(row['Days Worked'] || row['days_worked'] || '').trim()
    const bankDetails = String(row['Bank Details'] || row['bank_details'] || '').trim()
    const basicSalary = String(row['Basic Salary'] || row['basic_salary'] || row['Salary'] || '0').trim()
    const housingAllowance = String(row['Housing Allowance'] || row['housing_allowance'] || '0').trim()
    const transportationAllowance = String(row['Transportation Allowance'] || row['transportation_allowance'] || '0').trim()
    const otherSundryAllowance = String(row['Other Sundry Allowance'] || row['other_sundry_allowance'] || '0').trim()
    const leaveAllowance = String(row['Leave Allowance'] || row['leave_allowance'] || '0').trim()
    const overtime = String(row['Overtime'] || row['overtime'] || '0').trim()
    const loan = String(row['Loan'] || row['loan'] || '0').trim()
    const pensionContribution = String(row['Pension Contribution'] || row['pension_contribution'] || '0').trim()
    const nhf = String(row['NHF'] || row['nhf'] || '0').trim()
    // Support explicit Net Pay or fall back to legacy fields
    const netPayRaw = String(row['Net Pay'] || row['net_pay'] || '').trim()
    const legacyAllowances = String(row['Allowances'] || row['allowances'] || '0').trim()
    const legacyDeductions = String(row['Deductions'] || row['deductions'] || '0').trim()
    const legacyTax = String(row['Tax'] || row['tax'] || '0').trim()
    
    // Find matching employee
    const matchedEmployee = employees.find(
      (e) => e.employeeId.toLowerCase() === employeeId.toLowerCase()
    )
    
    if (!employeeId) errors.push('Employee ID is required')
    if (!matchedEmployee) errors.push('Employee not found in system')
    
    const basic = parseFloat(basicSalary) || 0
    const housing = parseFloat(housingAllowance) || 0
    const transport = parseFloat(transportationAllowance) || 0
    const sundry = parseFloat(otherSundryAllowance) || 0
    const leave = parseFloat(leaveAllowance) || 0
    const ot = parseFloat(overtime) || 0
    const loanAmt = parseFloat(loan) || 0
    const pension = parseFloat(pensionContribution) || 0
    const nhfAmt = parseFloat(nhf) || 0
    const allow = parseFloat(legacyAllowances) || 0
    const deduct = parseFloat(legacyDeductions) || 0
    const taxAmt = parseFloat(legacyTax) || 0

    // Total earnings = basic + all allowances + overtime
    const totalEarnings = basic + housing + transport + sundry + leave + ot
    // Total deductions = loan + pension + nhf + legacy deductions + legacy tax
    const totalDeductions = loanAmt + pension + nhfAmt + deduct + taxAmt
    // Net pay: use explicit value if provided, otherwise compute
    const computedNet = totalEarnings - totalDeductions
    const netPay = netPayRaw ? (parseFloat(netPayRaw) || 0) : computedNet
    
    return {
      employeeId,
      employeeName: matchedEmployee ? `${matchedEmployee.firstName} ${matchedEmployee.lastName}` : employeeName,
      employeeEmail: matchedEmployee?.email || String(row['Email'] || ''),
      position: position || matchedEmployee?.salary ? position : '',
      location,
      daysWorked,
      bankDetails,
      basicSalary: basic.toFixed(2),
      housingAllowance: housing.toFixed(2),
      transportationAllowance: transport.toFixed(2),
      otherSundryAllowance: sundry.toFixed(2),
      leaveAllowance: leave.toFixed(2),
      overtime: ot.toFixed(2),
      loan: loanAmt.toFixed(2),
      pensionContribution: pension.toFixed(2),
      nhf: nhfAmt.toFixed(2),
      netPay: netPay.toFixed(2),
      // keep legacy fields for compatibility
      allowances: allow.toFixed(2),
      deductions: deduct.toFixed(2),
      tax: taxAmt.toFixed(2),
      netSalary: netPay.toFixed(2),
      isValid: errors.length === 0,
      errors,
      matchedEmployeeDbId: matchedEmployee?.id,
    }
  }, [employees])

  const parseFile = useCallback(async (file: File) => {
    setLoading(true)
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      
      const parsed = jsonData.map((row) => validatePayslip(row as Record<string, unknown>))
      setParsedPayslips(parsed)
      
      const validCount = parsed.filter((p) => p.isValid).length
      const invalidCount = parsed.length - validCount
      
      if (invalidCount > 0) {
        toast.warning(`${invalidCount} records have issues`)
      } else {
        toast.success(`${validCount} payslips ready to process`)
      }
    } catch (error) {
      toast.error('Failed to parse file')
      console.error('Parse error:', error)
    } finally {
      setLoading(false)
    }
  }, [validatePayslip])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setFile(file)
      parseFile(file)
    }
  }, [parseFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  })

  const handleCreatePayroll = async () => {
    if (!formData.name || !formData.payPeriod || !formData.payDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const validPayslips = parsedPayslips.filter((p) => p.isValid)
    if (validPayslips.length === 0) {
      toast.error('No valid payslips to process')
      return
    }

    setCreating(true)
    try {
      const totalAmount = validPayslips.reduce((sum, p) => sum + parseFloat(p.netSalary), 0)
      
      // Create payroll record
      const payroll = await createPayroll({
        name: formData.name,
        payPeriod: formData.payPeriod,
        payDate: formData.payDate,
        totalEmployees: validPayslips.length,
        totalAmount: totalAmount.toFixed(2),
        fileName: file?.name,
      })

      // Create payslips
      const payslipsToCreate = validPayslips.map((p) => ({
        payrollId: payroll.id,
        employeeId: p.matchedEmployeeDbId!,
        employeeName: p.employeeName,
        employeeEmail: p.employeeEmail,
        position: p.position,
        location: p.location,
        daysWorked: p.daysWorked,
        bankDetails: p.bankDetails,
        basicSalary: p.basicSalary,
        housingAllowance: p.housingAllowance,
        transportationAllowance: p.transportationAllowance,
        otherSundryAllowance: p.otherSundryAllowance,
        leaveAllowance: p.leaveAllowance,
        overtime: p.overtime,
        loan: p.loan,
        pensionContribution: p.pensionContribution,
        nhf: p.nhf,
        allowances: p.allowances,
        deductions: p.deductions,
        tax: p.tax,
        netSalary: p.netSalary,
      }))

      await bulkCreatePayslips(payslipsToCreate)
      await updatePayrollStatus(payroll.id, 'processed')

      toast.success(`Payroll created with ${validPayslips.length} payslips`)
      setIsUploadDialogOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      toast.error('Failed to create payroll')
      console.error('Create error:', error)
    } finally {
      setCreating(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', payPeriod: '', payDate: '' })
    setFile(null)
    setParsedPayslips([])
  }

  const downloadTemplate = () => {
    const template = [
      {
        'Employee ID': 'EMP001',
        'Employee Name': 'John Doe',
        'Position': 'Software Engineer',
        'Location': 'Lagos',
        'Days Worked': '22',
        'Bank Details': 'GTBank / 0123456789',
        'Basic Salary': '150000',
        'Housing Allowance': '75000',
        'Transportation Allowance': '15000',
        'Other Sundry Allowance': '10000',
        'Leave Allowance': '0',
        'Overtime': '0',
        'Loan': '0',
        'Pension Contribution': '12000',
        'NHF': '3750',
        'Net Pay': '234250',
      },
    ]
    
    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Payroll')
    XLSX.writeFile(wb, 'payroll_template.xlsx')
    toast.success('Template downloaded')
  }

  const formatCurrency = (value: string | null) => {
    if (!value) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(value))
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'processed':
        return <Badge className="bg-success/10 text-success border-success/20">Processed</Badge>
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'sent':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Sent</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const validCount = parsedPayslips.filter((p) => p.isValid).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-muted-foreground">Upload and process payroll data</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={downloadTemplate} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-white/15 text-white/70 hover:text-white hover:bg-white/8 transition-colors">
            <Download className="h-4 w-4" />
            Template
          </button>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger>
              <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                <Plus className="h-4 w-4" />
                Upload Payroll
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload Payroll Data</DialogTitle>
                <DialogDescription>
                  Upload an Excel file with payroll data for your employees
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Payroll Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., January 2024 Payroll"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payPeriod">Pay Period *</Label>
                    <Select
                      value={formData.payPeriod}
                      onValueChange={(value) => setFormData({ ...formData, payPeriod: value ?? '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payDate">Pay Date *</Label>
                    <Input
                      id="payDate"
                      type="date"
                      value={formData.payDate}
                      onChange={(e) => setFormData({ ...formData, payDate: e.target.value })}
                    />
                  </div>
                </div>

                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                  `}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-2">
                    {loading ? (
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    ) : file ? (
                      <FileSpreadsheet className="h-8 w-8 text-primary" />
                    ) : (
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    )}
                    {file ? (
                      <p className="font-medium">{file.name}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Drag and drop your payroll file here, or click to browse
                      </p>
                    )}
                  </div>
                </div>

                {parsedPayslips.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Preview ({validCount} valid of {parsedPayslips.length})</p>
                      <p className="text-sm text-muted-foreground">
                        Total: {formatCurrency(
                          parsedPayslips
                            .filter((p) => p.isValid)
                            .reduce((sum, p) => sum + parseFloat(p.netSalary), 0)
                            .toFixed(2)
                        )}
                      </p>
                    </div>
                    <div className="border rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                             <TableHead>Position</TableHead>
                             <TableHead>Location</TableHead>
                             <TableHead>Days</TableHead>
                             <TableHead className="text-right">Basic</TableHead>
                             <TableHead className="text-right">Housing</TableHead>
                             <TableHead className="text-right">Transport</TableHead>
                             <TableHead className="text-right">Pension</TableHead>
                             <TableHead className="text-right">NHF</TableHead>
                             <TableHead className="text-right">Net Pay</TableHead>
                             <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {parsedPayslips.map((payslip, index) => (
                            <TableRow key={index} className={!payslip.isValid ? 'bg-destructive/5' : ''}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{payslip.employeeName || payslip.employeeId}</p>
                                  <p className="text-xs text-muted-foreground">{payslip.employeeId}</p>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs">{payslip.position || '-'}</TableCell>
                              <TableCell className="text-xs">{payslip.location || '-'}</TableCell>
                              <TableCell className="text-xs">{payslip.daysWorked || '-'}</TableCell>
                              <TableCell className="text-right">{formatCurrency(payslip.basicSalary)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(payslip.housingAllowance)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(payslip.transportationAllowance)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(payslip.pensionContribution)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(payslip.nhf)}</TableCell>
                              <TableCell className="text-right font-medium">{formatCurrency(payslip.netPay)}</TableCell>
                              <TableCell>
                                {payslip.isValid ? (
                                  <Badge className="bg-success/10 text-success border-success/20">Valid</Badge>
                                ) : (
                                  <Badge variant="destructive" title={payslip.errors.join(', ')}>
                                    Error
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <button onClick={() => { setIsUploadDialogOpen(false); resetForm(); }} className="px-4 py-2 text-sm font-medium rounded-lg border border-white/15 text-white/70 hover:text-white hover:bg-white/8 transition-colors">Cancel</button>
                <button onClick={handleCreatePayroll} disabled={creating || validCount === 0} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                  {creating ? (<><Loader2 className="h-4 w-4 animate-spin" />Processing...</>) : (<><Upload className="h-4 w-4" />Create Payroll ({validCount})</>)}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Payroll History
            <Badge variant="secondary" className="ml-2">{payrolls.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payrolls.length === 0 ? (
            <div className="text-center py-12">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                No payroll records yet. Upload your first payroll to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Pay Period</TableHead>
                    <TableHead>Pay Date</TableHead>
                    <TableHead className="text-right">Employees</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrolls.map((payroll) => (
                    <TableRow key={payroll.id}>
                      <TableCell className="font-medium">{payroll.name}</TableCell>
                      <TableCell className="capitalize">{payroll.payPeriod}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {payroll.payDate}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{payroll.totalEmployees}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(payroll.totalAmount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {mounted && payroll.createdAt ? format(new Date(payroll.createdAt), 'MMM d, yyyy') : '-'}
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/payslips?payrollId=${payroll.id}`} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
