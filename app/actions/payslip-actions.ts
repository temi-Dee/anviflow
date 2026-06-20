'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { employees, payrolls, payslips, emailLogs } from '@/lib/db/schema'
import { and, desc, eq, sql, count } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// ===================== EMPLOYEES =====================

export async function getEmployees() {
  const userId = await getUserId()
  return db
    .select()
    .from(employees)
    .where(eq(employees.userId, userId))
    .orderBy(desc(employees.createdAt))
}

export async function getEmployee(id: number) {
  const userId = await getUserId()
  const result = await db
    .select()
    .from(employees)
    .where(and(eq(employees.id, id), eq(employees.userId, userId)))
    .limit(1)
  return result[0] || null
}

export async function createEmployee(data: {
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
}) {
  const userId = await getUserId()
  await db.insert(employees).values({
    userId,
    employeeId: data.employeeId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone || null,
    department: data.department || null,
    position: data.position || null,
    salary: data.salary || null,
    bankName: data.bankName || null,
    bankAccount: data.bankAccount || null,
    taxId: data.taxId || null,
    hireDate: data.hireDate || null,
  })
  revalidatePath('/dashboard/employees')
}

export async function updateEmployee(id: number, data: {
  employeeId?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  department?: string
  position?: string
  salary?: string
  bankName?: string
  bankAccount?: string
  taxId?: string
  hireDate?: string
  status?: string
}) {
  const userId = await getUserId()
  await db
    .update(employees)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(employees.id, id), eq(employees.userId, userId)))
  revalidatePath('/dashboard/employees')
}

export async function deleteEmployee(id: number) {
  const userId = await getUserId()
  await db.delete(employees).where(and(eq(employees.id, id), eq(employees.userId, userId)))
  revalidatePath('/dashboard/employees')
}

export async function bulkCreateEmployees(employeeList: Array<{
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
}>) {
  const userId = await getUserId()
  const values = employeeList.map(emp => ({
    userId,
    employeeId: emp.employeeId,
    firstName: emp.firstName,
    lastName: emp.lastName,
    email: emp.email,
    phone: emp.phone || null,
    department: emp.department || null,
    position: emp.position || null,
    salary: emp.salary || null,
    bankName: emp.bankName || null,
    bankAccount: emp.bankAccount || null,
    taxId: emp.taxId || null,
    hireDate: emp.hireDate || null,
  }))
  await db.insert(employees).values(values)
  revalidatePath('/dashboard/employees')
}

// ===================== PAYROLLS =====================

export async function getPayrolls() {
  const userId = await getUserId()
  return db
    .select()
    .from(payrolls)
    .where(eq(payrolls.userId, userId))
    .orderBy(desc(payrolls.createdAt))
}

export async function getPayroll(id: number) {
  const userId = await getUserId()
  const result = await db
    .select()
    .from(payrolls)
    .where(and(eq(payrolls.id, id), eq(payrolls.userId, userId)))
    .limit(1)
  return result[0] || null
}

export async function createPayroll(data: {
  name: string
  payPeriod: string
  payDate: string
  totalEmployees?: number
  totalAmount?: string
  fileName?: string
  fileUrl?: string
}) {
  const userId = await getUserId()
  const result = await db.insert(payrolls).values({
    userId,
    name: data.name,
    payPeriod: data.payPeriod,
    payDate: data.payDate,
    totalEmployees: data.totalEmployees || 0,
    totalAmount: data.totalAmount || '0',
    fileName: data.fileName || null,
    fileUrl: data.fileUrl || null,
    status: 'draft',
  }).returning({ id: payrolls.id })
  revalidatePath('/dashboard/payroll')
  return result[0]
}

export async function updatePayrollStatus(id: number, status: string) {
  const userId = await getUserId()
  await db
    .update(payrolls)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(payrolls.id, id), eq(payrolls.userId, userId)))
  revalidatePath('/dashboard/payroll')
}

// ===================== PAYSLIPS =====================

export async function getPayslips(payrollId?: number) {
  const userId = await getUserId()
  if (payrollId) {
    return db
      .select()
      .from(payslips)
      .where(and(eq(payslips.userId, userId), eq(payslips.payrollId, payrollId)))
      .orderBy(desc(payslips.createdAt))
  }
  return db
    .select()
    .from(payslips)
    .where(eq(payslips.userId, userId))
    .orderBy(desc(payslips.createdAt))
}

export async function getPayslip(id: number) {
  const userId = await getUserId()
  const result = await db
    .select()
    .from(payslips)
    .where(and(eq(payslips.id, id), eq(payslips.userId, userId)))
    .limit(1)
  return result[0] || null
}

export async function createPayslip(data: {
  payrollId: number
  employeeId: number
  employeeName: string
  employeeEmail: string
  position?: string
  location?: string
  daysWorked?: string
  bankDetails?: string
  basicSalary: string
  housingAllowance?: string
  transportationAllowance?: string
  otherSundryAllowance?: string
  leaveAllowance?: string
  overtime?: string
  loan?: string
  pensionContribution?: string
  nhf?: string
  allowances?: string
  deductions?: string
  tax?: string
  netSalary: string
}) {
  const userId = await getUserId()
  await db.insert(payslips).values({
    userId,
    payrollId: data.payrollId,
    employeeId: data.employeeId,
    employeeName: data.employeeName,
    employeeEmail: data.employeeEmail,
    position: data.position || null,
    location: data.location || null,
    daysWorked: data.daysWorked || null,
    bankDetails: data.bankDetails || null,
    basicSalary: data.basicSalary,
    housingAllowance: data.housingAllowance || '0',
    transportationAllowance: data.transportationAllowance || '0',
    otherSundryAllowance: data.otherSundryAllowance || '0',
    leaveAllowance: data.leaveAllowance || '0',
    overtime: data.overtime || '0',
    loan: data.loan || '0',
    pensionContribution: data.pensionContribution || '0',
    nhf: data.nhf || '0',
    allowances: data.allowances || '0',
    deductions: data.deductions || '0',
    tax: data.tax || '0',
    netSalary: data.netSalary,
    emailStatus: 'pending',
  })
  revalidatePath('/dashboard/payslips')
}

export async function bulkCreatePayslips(payslipsList: Array<{
  payrollId: number
  employeeId: number
  employeeName: string
  employeeEmail: string
  position?: string
  location?: string
  daysWorked?: string
  bankDetails?: string
  basicSalary: string
  housingAllowance?: string
  transportationAllowance?: string
  otherSundryAllowance?: string
  leaveAllowance?: string
  overtime?: string
  loan?: string
  pensionContribution?: string
  nhf?: string
  allowances?: string
  deductions?: string
  tax?: string
  netSalary: string
}>) {
  const userId = await getUserId()
  const values = payslipsList.map(p => ({
    userId,
    payrollId: p.payrollId,
    employeeId: p.employeeId,
    employeeName: p.employeeName,
    employeeEmail: p.employeeEmail,
    position: p.position || null,
    location: p.location || null,
    daysWorked: p.daysWorked || null,
    bankDetails: p.bankDetails || null,
    basicSalary: p.basicSalary,
    housingAllowance: p.housingAllowance || '0',
    transportationAllowance: p.transportationAllowance || '0',
    otherSundryAllowance: p.otherSundryAllowance || '0',
    leaveAllowance: p.leaveAllowance || '0',
    overtime: p.overtime || '0',
    loan: p.loan || '0',
    pensionContribution: p.pensionContribution || '0',
    nhf: p.nhf || '0',
    allowances: p.allowances || '0',
    deductions: p.deductions || '0',
    tax: p.tax || '0',
    netSalary: p.netSalary,
    emailStatus: 'pending',
  }))
  await db.insert(payslips).values(values)
  revalidatePath('/dashboard/payslips')
}

export async function updatePayslipPdf(id: number, pdfUrl: string) {
  const userId = await getUserId()
  await db
    .update(payslips)
    .set({ pdfUrl, pdfGeneratedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(payslips.id, id), eq(payslips.userId, userId)))
  revalidatePath('/dashboard/payslips')
}

export async function updatePayslipEmailStatus(id: number, status: string, error?: string) {
  const userId = await getUserId()
  await db
    .update(payslips)
    .set({
      emailStatus: status,
      emailSentAt: status === 'sent' ? new Date() : null,
      emailError: error || null,
      updatedAt: new Date(),
    })
    .where(and(eq(payslips.id, id), eq(payslips.userId, userId)))
  revalidatePath('/dashboard/payslips')
}

// ===================== EMAIL LOGS =====================

export async function getEmailLogs(payslipId?: number) {
  const userId = await getUserId()
  if (payslipId) {
    return db
      .select()
      .from(emailLogs)
      .where(and(eq(emailLogs.userId, userId), eq(emailLogs.payslipId, payslipId)))
      .orderBy(desc(emailLogs.createdAt))
  }
  return db
    .select()
    .from(emailLogs)
    .where(eq(emailLogs.userId, userId))
    .orderBy(desc(emailLogs.createdAt))
}

export async function createEmailLog(data: {
  payslipId: number
  recipientEmail: string
  subject: string
  status: string
  resendId?: string
  errorMessage?: string
}) {
  const userId = await getUserId()
  await db.insert(emailLogs).values({
    userId,
    payslipId: data.payslipId,
    recipientEmail: data.recipientEmail,
    subject: data.subject,
    status: data.status,
    sentAt: data.status === 'sent' ? new Date() : null,
    resendId: data.resendId || null,
    errorMessage: data.errorMessage || null,
  })
  revalidatePath('/dashboard/reports')
}

// ===================== DASHBOARD STATS =====================

export async function getDashboardStats() {
  const userId = await getUserId()
  
  const [employeeCount] = await db
    .select({ count: count() })
    .from(employees)
    .where(eq(employees.userId, userId))
  
  const [payrollCount] = await db
    .select({ count: count() })
    .from(payrolls)
    .where(eq(payrolls.userId, userId))
  
  const [payslipCount] = await db
    .select({ count: count() })
    .from(payslips)
    .where(eq(payslips.userId, userId))
  
  const [sentCount] = await db
    .select({ count: count() })
    .from(payslips)
    .where(and(eq(payslips.userId, userId), eq(payslips.emailStatus, 'sent')))
  
  const [pendingCount] = await db
    .select({ count: count() })
    .from(payslips)
    .where(and(eq(payslips.userId, userId), eq(payslips.emailStatus, 'pending')))
  
  const [failedCount] = await db
    .select({ count: count() })
    .from(payslips)
    .where(and(eq(payslips.userId, userId), eq(payslips.emailStatus, 'failed')))
  
  const recentPayslips = await db
    .select()
    .from(payslips)
    .where(eq(payslips.userId, userId))
    .orderBy(desc(payslips.createdAt))
    .limit(5)
  
  return {
    totalEmployees: employeeCount.count,
    totalPayrolls: payrollCount.count,
    totalPayslips: payslipCount.count,
    emailsSent: sentCount.count,
    emailsPending: pendingCount.count,
    emailsFailed: failedCount.count,
    recentPayslips,
  }
}
