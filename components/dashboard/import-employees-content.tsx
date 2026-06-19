'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle, Loader2, Download } from 'lucide-react'
import { bulkCreateEmployees } from '@/app/actions/payslip-actions'
import { toast } from 'sonner'

interface ParsedEmployee {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  department?: string
  position?: string
  salary?: string
  bankName?: string
  bankAccount?: string
  taxId?: string
  hireDate?: string
  isValid: boolean
  errors: string[]
}

export function ImportEmployeesContent() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedEmployee[]>([])
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)

  const validateEmployee = (row: Record<string, unknown>): ParsedEmployee => {
    const errors: string[] = []
    
    const employeeId = String(row['Employee ID'] || row['employee_id'] || row['EmployeeID'] || '').trim()
    const firstName = String(row['First Name'] || row['first_name'] || row['FirstName'] || '').trim()
    const lastName = String(row['Last Name'] || row['last_name'] || row['LastName'] || '').trim()
    const email = String(row['Email'] || row['email'] || '').trim()
    
    if (!employeeId) errors.push('Employee ID is required')
    if (!firstName) errors.push('First Name is required')
    if (!lastName) errors.push('Last Name is required')
    if (!email) errors.push('Email is required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email format')
    
    return {
      employeeId,
      firstName,
      lastName,
      email,
      phone: String(row['Phone'] || row['phone'] || '').trim() || undefined,
      department: String(row['Department'] || row['department'] || '').trim() || undefined,
      position: String(row['Position'] || row['position'] || row['Job Title'] || '').trim() || undefined,
      salary: String(row['Salary'] || row['salary'] || '').trim() || undefined,
      bankName: String(row['Bank Name'] || row['bank_name'] || row['BankName'] || '').trim() || undefined,
      bankAccount: String(row['Bank Account'] || row['bank_account'] || row['BankAccount'] || '').trim() || undefined,
      taxId: String(row['Tax ID'] || row['tax_id'] || row['TaxID'] || '').trim() || undefined,
      hireDate: String(row['Hire Date'] || row['hire_date'] || row['HireDate'] || '').trim() || undefined,
      isValid: errors.length === 0,
      errors,
    }
  }

  const parseFile = useCallback(async (file: File) => {
    setLoading(true)
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      
      const parsed = jsonData.map((row) => validateEmployee(row as Record<string, unknown>))
      setParsedData(parsed)
      
      const validCount = parsed.filter((e) => e.isValid).length
      const invalidCount = parsed.length - validCount
      
      if (invalidCount > 0) {
        toast.warning(`${invalidCount} records have validation errors`)
      } else {
        toast.success(`${validCount} records ready to import`)
      }
    } catch (error) {
      toast.error('Failed to parse file. Please check the format.')
      console.error('Parse error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

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

  const handleImport = async () => {
    const validEmployees = parsedData.filter((e) => e.isValid)
    if (validEmployees.length === 0) {
      toast.error('No valid records to import')
      return
    }

    setImporting(true)
    setImportProgress(0)

    try {
      const employeesToImport = validEmployees.map(({ isValid, errors, ...emp }) => emp)
      await bulkCreateEmployees(employeesToImport)
      setImportProgress(100)
      toast.success(`Successfully imported ${validEmployees.length} employees`)
      
      setTimeout(() => {
        router.push('/dashboard/employees')
      }, 1500)
    } catch (error) {
      toast.error('Failed to import employees')
      console.error('Import error:', error)
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const template = [
      {
        'Employee ID': 'EMP001',
        'First Name': 'John',
        'Last Name': 'Doe',
        'Email': 'john.doe@company.com',
        'Phone': '+1234567890',
        'Department': 'Engineering',
        'Position': 'Software Engineer',
        'Salary': '75000',
        'Bank Name': 'Chase Bank',
        'Bank Account': '1234567890',
        'Tax ID': '123-45-6789',
        'Hire Date': '2024-01-15',
      },
    ]
    
    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Employees')
    XLSX.writeFile(wb, 'employee_import_template.xlsx')
    toast.success('Template downloaded')
  }

  const validCount = parsedData.filter((e) => e.isValid).length
  const invalidCount = parsedData.length - validCount

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-muted-foreground">Bulk import employees from Excel or CSV file</p>
        </div>
        <button onClick={downloadTemplate} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-white/15 text-white/70 hover:text-white hover:bg-white/8 transition-colors">
          <Download className="h-4 w-4" />
          Download Template
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>
              Upload an Excel (.xlsx, .xls) or CSV file with employee data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3">
                {loading ? (
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                ) : file ? (
                  <FileSpreadsheet className="h-12 w-12 text-primary" />
                ) : (
                  <Upload className="h-12 w-12 text-muted-foreground" />
                )}
                {file ? (
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">
                      {isDragActive ? 'Drop the file here' : 'Drag and drop your file here'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (xlsx, xls, csv)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {importing && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Importing employees...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm">Total Records</span>
              <Badge variant="secondary">{parsedData.length}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm">Valid</span>
              </div>
              <Badge className="bg-success text-success-foreground">{validCount}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm">Invalid</span>
              </div>
              <Badge variant="destructive">{invalidCount}</Badge>
            </div>

            <button
              onClick={handleImport}
              disabled={validCount === 0 || importing}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-60 transition-all"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
            >
              {importing ? (<><Loader2 className="h-4 w-4 animate-spin" />Importing...</>) : (<><Upload className="h-4 w-4" />Import {validCount} Employees</>)}
            </button>
          </CardContent>
        </Card>
      </div>

      {parsedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Data</CardTitle>
            <CardDescription>
              Review the parsed data before importing
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invalidCount > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Validation Errors</AlertTitle>
                <AlertDescription>
                  {invalidCount} record(s) have validation errors and will not be imported.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Errors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.slice(0, 20).map((employee, index) => (
                    <TableRow key={index} className={!employee.isValid ? 'bg-destructive/5' : ''}>
                      <TableCell>
                        {employee.isValid ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{employee.employeeId || '-'}</TableCell>
                      <TableCell>{`${employee.firstName} ${employee.lastName}`.trim() || '-'}</TableCell>
                      <TableCell>{employee.email || '-'}</TableCell>
                      <TableCell>{employee.department || '-'}</TableCell>
                      <TableCell>{employee.position || '-'}</TableCell>
                      <TableCell>
                        {employee.errors.length > 0 && (
                          <span className="text-xs text-destructive">
                            {employee.errors.join(', ')}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {parsedData.length > 20 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Showing first 20 of {parsedData.length} records
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
