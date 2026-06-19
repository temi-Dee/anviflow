import { getEmployees } from '@/app/actions/payslip-actions'
import { EmployeesContent } from '@/components/dashboard/employees-content'

export default async function EmployeesPage() {
  const employees = await getEmployees()
  return <EmployeesContent employees={employees} />
}
