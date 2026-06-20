import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { payslips, payrolls } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { put } from '@vercel/blob'
import fs from 'fs/promises'
import path from 'path'

// Helper to get authenticated user
async function getAuthenticatedUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session.user
}

// Format currency in Naira
function formatNaira(value: string | null) {
  if (!value) return '₦0.00'
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(parseFloat(value))
}

// Get base URL for assets
function getBaseUrl() {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return process.env.V0_RUNTIME_URL || 'http://localhost:3000'
}

// Generate HTML for payslip matching the Anvictol template
function generatePayslipHTML(payslip: {
  employeeName: string
  employeeEmail: string
  position?: string | null
  location?: string | null
  daysWorked?: string | null
  bankDetails?: string | null
  basicSalary: string | null
  housingAllowance?: string | null
  transportationAllowance?: string | null
  otherSundryAllowance?: string | null
  leaveAllowance?: string | null
  overtime?: string | null
  loan?: string | null
  pensionContribution?: string | null
  nhf?: string | null
  allowances?: string | null
  deductions?: string | null
  tax?: string | null
  netSalary: string | null
}, payroll: { name: string; payPeriod: string; payDate: string }, employee?: {
  position?: string | null
  department?: string | null
  bankName?: string | null
  bankAccount?: string | null
}) {
  const basicSalary = parseFloat(payslip.basicSalary || '0')
  const housing = parseFloat(payslip.housingAllowance || '0')
  const transportation = parseFloat(payslip.transportationAllowance || '0')
  const sundry = parseFloat(payslip.otherSundryAllowance || '0')
  const leave = parseFloat(payslip.leaveAllowance || '0')
  const overtime = parseFloat(payslip.overtime || '0')
  const loan = parseFloat(payslip.loan || '0')
  const pension = parseFloat(payslip.pensionContribution || '0')
  const nhf = parseFloat(payslip.nhf || '0')
  const tax = parseFloat(payslip.tax || '0')

  const totalEarnings = basicSalary + housing + transportation + sundry + leave + overtime
  const totalDeductions = loan + pension + nhf + tax
  
  const netPay = parseFloat(payslip.netSalary || '0') || (totalEarnings - totalDeductions)

  // Employee info (prefer payslip fields, fall back to employee record)
  const position = payslip.position || employee?.position || 'STAFF'
  const location = payslip.location || employee?.department || 'HEAD OFFICE'
  const daysWorked = payslip.daysWorked || '22 DAYS'
  const bankDetails = payslip.bankDetails || (employee?.bankName && employee?.bankAccount ? `${employee.bankName} / ${employee.bankAccount}` : 'N/A')
  
  const baseUrl = getBaseUrl()
  const logoUrl = `${baseUrl}/anviflow-logo.jpg`

  // Extract month and year from payroll
  const payDate = new Date(payroll.payDate)
  const monthYear = payDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
  
  // Get employee name parts
  const nameParts = payslip.employeeName.split(' ')
  const lastName = nameParts[0] || ''
  const firstName = nameParts.slice(1).join(' ') || ''

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: Arial, sans-serif; 
          color: #1a1a2e; 
          background: white; 
          padding: 20px;
          font-size: 12px;
        }
        .container { 
          max-width: 700px; 
          margin: 0 auto; 
          background: white; 
          border: 2px solid #1e3a5f;
          padding: 0;
        }
        .header { 
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px 20px;
          border-bottom: 2px solid #1e3a5f;
          background: #f8f9fa;
        }
        .logo-container {
          text-align: center;
        }
        .logo {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
        }
        .company-name {
          font-size: 18px;
          font-weight: bold;
          color: #1e3a5f;
          margin-top: 8px;
          text-align: center;
        }
        .payslip-title {
          background: #1e3a5f;
          color: white;
          text-align: center;
          padding: 10px;
          font-size: 16px;
          font-weight: bold;
          letter-spacing: 2px;
        }
        .info-section {
          padding: 15px 20px;
          border-bottom: 1px solid #ddd;
        }
        .info-row {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }
        .info-item {
          width: 50%;
          display: flex;
        }
        .info-label {
          font-weight: bold;
          color: #1e3a5f;
          min-width: 120px;
        }
        .info-value {
          color: #333;
        }
        .earnings-deductions {
          display: flex;
          border-bottom: 1px solid #ddd;
        }
        .earnings, .deductions {
          width: 50%;
          padding: 15px 20px;
        }
        .earnings {
          border-right: 1px solid #ddd;
        }
        .section-header {
          background: #1e3a5f;
          color: white;
          padding: 8px 12px;
          font-weight: bold;
          margin-bottom: 10px;
          text-transform: uppercase;
          font-size: 11px;
        }
        .item-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px dotted #ddd;
        }
        .item-row:last-child {
          border-bottom: none;
        }
        .item-label {
          color: #333;
        }
        .item-value {
          font-weight: 500;
          text-align: right;
        }
        .earnings .item-value {
          color: #16a34a;
        }
        .deductions .item-value {
          color: #dc2626;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          margin-top: 10px;
          border-top: 2px solid #1e3a5f;
          font-weight: bold;
          font-size: 13px;
        }
        .net-pay-section {
          background: #1e3a5f;
          color: white;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .net-pay-label {
          font-size: 14px;
          font-weight: bold;
        }
        .net-pay-value {
          font-size: 20px;
          font-weight: bold;
        }
        .signatures {
          padding: 30px 20px;
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
        }
        .signature-box {
          text-align: center;
          width: 40%;
        }
        .signature-line {
          border-top: 1px solid #333;
          padding-top: 8px;
          margin-top: 40px;
          font-size: 11px;
          color: #666;
        }
        .footer {
          text-align: center;
          padding: 15px;
          color: #666;
          font-size: 10px;
          border-top: 1px solid #ddd;
          background: #f8f9fa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-container">
            <img src="${logoUrl}" alt="Company Logo" class="logo" />
            <div class="company-name">ANVICTOL INTEGRATED SERVICES NIGERIA LIMITED</div>
          </div>
        </div>
        
        <div class="payslip-title">PAYSLIP</div>
        
        <div class="info-section">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">MONTH:</span>
              <span class="info-value">${monthYear}</span>
            </div>
            <div class="info-item">
              <span class="info-label">LOCATION:</span>
              <span class="info-value">${location}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">EMPLOYEE:</span>
              <span class="info-value">${lastName} ${firstName}</span>
            </div>
            <div class="info-item">
              <span class="info-label">DAYS WORKED:</span>
              <span class="info-value">${daysWorked}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">POSITION:</span>
              <span class="info-value">${position}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">BANK DETAILS:</span>
              <span class="info-value">${bankDetails}</span>
            </div>
          </div>
        </div>
        
        <div class="earnings-deductions">
          <div class="earnings">
            <div class="section-header">EARNINGS (IN)</div>
            <div class="item-row">
              <span class="item-label">Basic</span>
              <span class="item-value">${formatNaira(basicSalary.toFixed(2))}</span>
            </div>
            <div class="item-row">
              <span class="item-label">Housing Allowance</span>
              <span class="item-value">${formatNaira(housing.toFixed(2))}</span>
            </div>
            <div class="item-row">
              <span class="item-label">Transportation Allowance</span>
              <span class="item-value">${formatNaira(transportation.toFixed(2))}</span>
            </div>
            <div class="item-row">
              <span class="item-label">Other Sundry Allowances</span>
              <span class="item-value">${formatNaira(sundry.toFixed(2))}</span>
            </div>
            <div class="item-row">
              <span class="item-label">Leave Allowance</span>
              <span class="item-value">${formatNaira(leave.toFixed(2))}</span>
            </div>
            <div class="item-row">
              <span class="item-label">Overtime</span>
              <span class="item-value">${formatNaira(overtime.toFixed(2))}</span>
            </div>
            <div class="total-row">
              <span>Total Earnings</span>
              <span>${formatNaira(totalEarnings.toFixed(2))}</span>
            </div>
          </div>
          
          <div class="deductions">
            <div class="section-header">DEDUCTIONS (OUT)</div>
            <div class="item-row">
              <span class="item-label">Tax (PAYE)</span>
              <span class="item-value">${formatNaira(tax.toFixed(2))}</span>
            </div>
            <div class="item-row">
              <span class="item-label">Loan</span>
              <span class="item-value">${formatNaira(loan.toFixed(2))}</span>
            </div>
            <div class="item-row">
              <span class="item-label">Employee Pension Contribution</span>
              <span class="item-value">${formatNaira(pension.toFixed(2))}</span>
            </div>
            <div class="item-row">
              <span class="item-label">NHF</span>
              <span class="item-value">${formatNaira(nhf.toFixed(2))}</span>
            </div>
            <div class="total-row">
              <span>Total Deductions</span>
              <span>${formatNaira(totalDeductions.toFixed(2))}</span>
            </div>
          </div>
        </div>
        
        <div class="net-pay-section">
          <span class="net-pay-label">Net Pay Transferred to Bank</span>
          <span class="net-pay-value">${formatNaira(netPay.toFixed(2))}</span>
        </div>
        
        <div class="signatures">
          <div class="signature-box">
            <div class="signature-line">Employee Signature</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">Employer Signature</div>
          </div>
        </div>
        
        <div class="footer">
          This is a computer-generated payslip from ANVIFLOW. Please contact HR for any queries.
        </div>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    const { payslipIds } = await request.json()

    if (!payslipIds || !Array.isArray(payslipIds) || payslipIds.length === 0) {
      return NextResponse.json({ error: 'No payslip IDs provided' }, { status: 400 })
    }

    const results: Array<{ payslipId: number; success: boolean; pdfUrl?: string; error?: string }> = []

    for (const payslipId of payslipIds) {
      try {
        // Fetch payslip with payroll info
        const [payslip] = await db
          .select()
          .from(payslips)
          .where(and(eq(payslips.id, payslipId), eq(payslips.userId, user.id)))
          .limit(1)

        if (!payslip) {
          results.push({ payslipId, success: false, error: 'Payslip not found' })
          continue
        }

        const [payroll] = await db
          .select()
          .from(payrolls)
          .where(and(eq(payrolls.id, payslip.payrollId), eq(payrolls.userId, user.id)))
          .limit(1)

        if (!payroll) {
          results.push({ payslipId, success: false, error: 'Payroll not found' })
          continue
        }

        // Generate HTML content with the Anvictol template
        const html = generatePayslipHTML(
          {
            employeeName: payslip.employeeName,
            employeeEmail: payslip.employeeEmail,
            position: payslip.position,
            location: payslip.location,
            daysWorked: payslip.daysWorked,
            bankDetails: payslip.bankDetails,
            basicSalary: payslip.basicSalary,
            housingAllowance: payslip.housingAllowance,
            transportationAllowance: payslip.transportationAllowance,
            otherSundryAllowance: payslip.otherSundryAllowance,
            leaveAllowance: payslip.leaveAllowance,
            overtime: payslip.overtime,
            loan: payslip.loan,
            pensionContribution: payslip.pensionContribution,
            nhf: payslip.nhf,
            allowances: payslip.allowances,
            deductions: payslip.deductions,
            tax: payslip.tax,
            netSalary: payslip.netSalary,
          },
          {
            name: payroll.name,
            payPeriod: payroll.payPeriod,
            payDate: payroll.payDate,
          }
        )

        let url = ''

        if (process.env.BLOB_READ_WRITE_TOKEN) {
          // Store HTML as blob
          const blob = await put(
            `payslips/${user.id}/${payslipId}/payslip-${Date.now()}.html`,
            html,
            { access: 'private', contentType: 'text/html' }
          )
          url = blob.url
        } else {
          // Local development simulation fallback
          const filename = `payslip-${Date.now()}.html`
          const relativeDir = `/uploads/payslips/${user.id}/${payslipId}`
          const absoluteDir = path.join(process.cwd(), 'public', relativeDir)
          const absolutePath = path.join(absoluteDir, filename)
          
          await fs.mkdir(absoluteDir, { recursive: true })
          await fs.writeFile(absolutePath, html, 'utf-8')
          
          url = `${relativeDir}/${filename}`
          console.log(`[Vercel Blob Simulation] Saved HTML file locally to: ${absolutePath}`)
        }

        // Update payslip with PDF URL
        await db
          .update(payslips)
          .set({
            pdfUrl: url,
            pdfGeneratedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(and(eq(payslips.id, payslipId), eq(payslips.userId, user.id)))

        results.push({ payslipId, success: true, pdfUrl: url })
      } catch (error) {
        console.error(`Error generating PDF for payslip ${payslipId}:`, error)
        results.push({ payslipId, success: false, error: 'Generation failed' })
      }
    }

    const successCount = results.filter((r) => r.success).length
    return NextResponse.json({
      message: `Generated ${successCount} of ${payslipIds.length} PDFs`,
      results,
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to generate PDFs' }, { status: 500 })
  }
}
