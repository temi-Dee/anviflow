import { getDashboardStats, getEmailLogs } from '@/app/actions/payslip-actions'
import { ReportsContent } from '@/components/dashboard/reports-content'

export default async function ReportsPage() {
  const [stats, emailLogs] = await Promise.all([
    getDashboardStats(),
    getEmailLogs(),
  ])
  return <ReportsContent stats={stats} emailLogs={emailLogs} />
}
