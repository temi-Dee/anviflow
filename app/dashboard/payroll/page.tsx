import { getPayrolls, getEmployees } from '@/app/actions/payslip-actions'
import { PayrollContent } from '@/components/dashboard/payroll-content'

export default async function PayrollPage() {
  const [payrolls, employees] = await Promise.all([getPayrolls(), getEmployees()])
  return <PayrollContent payrolls={payrolls} employees={employees} />
}
