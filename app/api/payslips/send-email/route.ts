import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { payslips, payrolls, emailLogs } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { Resend } from 'resend'

// Initialize Resend (requires RESEND_API_KEY env var)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

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

// Generate email HTML
function generateEmailHTML(payslip: {
  employeeName: string
  netSalary: string | null
}, payroll: { name: string; payDate: string }) {
  const baseUrl = getBaseUrl()
  const logoUrl = `${baseUrl}/anviflow-logo.jpg`
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width: 560px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%); padding: 32px; text-align: center;">
                  <img src="${logoUrl}" alt="ANVIFLOW Logo" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 12px;" />
                  <h1 style="color: white; font-size: 20px; margin: 0 0 4px 0;">ANVICTOL INTEGRATED SERVICES</h1>
                  <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">Your Payslip is Ready</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 32px;">
                  <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                    Hello ${payslip.employeeName.split(' ')[0]},
                  </p>
                  
                  <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                    Your payslip for <strong>${payroll.name}</strong> is now available. Please find the details below:
                  </p>
                  
                  <!-- Summary Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f1f5f9; border-radius: 8px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 24px;">
                        <table width="100%">
                          <tr>
                            <td style="color: #64748b; font-size: 13px; padding-bottom: 8px;">Pay Date</td>
                            <td style="color: #1e293b; font-size: 13px; font-weight: 600; text-align: right; padding-bottom: 8px;">${payroll.payDate}</td>
                          </tr>
                          <tr>
                            <td style="color: #64748b; font-size: 13px; padding-top: 12px; border-top: 1px solid #e2e8f0;">Net Pay</td>
                            <td style="color: #16a34a; font-size: 20px; font-weight: 700; text-align: right; padding-top: 12px; border-top: 1px solid #e2e8f0;">${formatNaira(payslip.netSalary)}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 8px 0;">
                    Your detailed payslip is attached to this email. Please download and keep it for your records.
                  </p>
                  
                  <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 24px 0 0 0;">
                    If you have any questions about your payslip, please contact your HR department.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 24px; text-align: center; border-top: 1px solid #f1f5f9;">
                  <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                    This is an automated message from ANVIFLOW.<br>
                    Powered by Anvictol Integrated Services Nigeria Limited.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
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

    // Check if Resend is configured
    if (!resend) {
      return NextResponse.json({ 
        error: 'Email service not configured. Please add RESEND_API_KEY environment variable.' 
      }, { status: 500 })
    }

    const results: Array<{ payslipId: number; success: boolean; error?: string }> = []

    for (const payslipId of payslipIds) {
      try {
        // Fetch payslip
        const [payslip] = await db
          .select()
          .from(payslips)
          .where(and(eq(payslips.id, payslipId), eq(payslips.userId, user.id)))
          .limit(1)

        if (!payslip) {
          results.push({ payslipId, success: false, error: 'Payslip not found' })
          continue
        }

        // Fetch payroll
        const [payroll] = await db
          .select()
          .from(payrolls)
          .where(and(eq(payrolls.id, payslip.payrollId), eq(payrolls.userId, user.id)))
          .limit(1)

        if (!payroll) {
          results.push({ payslipId, success: false, error: 'Payroll not found' })
          continue
        }

        const emailSubject = `Your Payslip - ${payroll.name} | Anvictol Integrated Services`
        const emailHtml = generateEmailHTML(
          { employeeName: payslip.employeeName, netSalary: payslip.netSalary },
          { name: payroll.name, payDate: payroll.payDate }
        )

        // Get the from email - must be a verified domain in Resend
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'ANVIFLOW <onboarding@resend.dev>'

        // Send email via Resend
        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: payslip.employeeEmail,
          subject: emailSubject,
          html: emailHtml,
        })

        if (error) {
          // Log failed email
          await db.insert(emailLogs).values({
            userId: user.id,
            payslipId,
            recipientEmail: payslip.employeeEmail,
            subject: emailSubject,
            status: 'failed',
            errorMessage: error.message,
          })

          await db
            .update(payslips)
            .set({ emailStatus: 'failed', emailError: error.message, updatedAt: new Date() })
            .where(eq(payslips.id, payslipId))

          results.push({ payslipId, success: false, error: error.message })
          continue
        }

        // Log successful email
        await db.insert(emailLogs).values({
          userId: user.id,
          payslipId,
          recipientEmail: payslip.employeeEmail,
          subject: emailSubject,
          status: 'sent',
          sentAt: new Date(),
          resendId: data?.id,
        })

        await db
          .update(payslips)
          .set({ emailStatus: 'sent', emailSentAt: new Date(), emailError: null, updatedAt: new Date() })
          .where(eq(payslips.id, payslipId))

        results.push({ payslipId, success: true })
      } catch (error) {
        console.error(`Error sending email for payslip ${payslipId}:`, error)
        results.push({ payslipId, success: false, error: 'Send failed' })
      }
    }

    const successCount = results.filter((r) => r.success).length
    return NextResponse.json({
      message: `Sent ${successCount} of ${payslipIds.length} emails`,
      results,
    })
  } catch (error) {
    console.error('Email send error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 })
  }
}
