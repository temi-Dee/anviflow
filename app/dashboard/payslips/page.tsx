import { getPayslips, getPayrolls } from '@/app/actions/payslip-actions'
import { PayslipsContent } from '@/components/dashboard/payslips-content'

export default async function PayslipsPage({
  searchParams,
}: {
  searchParams: Promise<{ payrollId?: string }>
}) {
  const params = await searchParams
  const payrollId = params.payrollId ? parseInt(params.payrollId) : undefined
  const [payslips, payrolls] = await Promise.all([
    getPayslips(payrollId),
    getPayrolls(),
  ])
  return <PayslipsContent payslips={payslips} payrolls={payrolls} currentPayrollId={payrollId} />
}
