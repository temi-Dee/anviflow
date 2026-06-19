import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { payslips } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'

// Helper to get authenticated user
async function getAuthenticatedUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session.user
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    const { id } = await params
    const payslipId = parseInt(id, 10)

    if (isNaN(payslipId)) {
      return NextResponse.json({ error: 'Invalid payslip ID' }, { status: 400 })
    }

    // Fetch payslip and verify ownership
    const [payslip] = await db
      .select()
      .from(payslips)
      .where(and(eq(payslips.id, payslipId), eq(payslips.userId, user.id)))
      .limit(1)

    if (!payslip) {
      return NextResponse.json({ error: 'Payslip not found' }, { status: 404 })
    }

    if (!payslip.pdfUrl) {
      return NextResponse.json({ error: 'PDF not generated yet' }, { status: 404 })
    }

    // Fetch the blob content using the server-side token
    const blobResponse = await fetch(payslip.pdfUrl, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    })

    if (!blobResponse.ok) {
      console.error('Failed to fetch blob:', blobResponse.status, blobResponse.statusText)
      return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 500 })
    }

    const contentType = blobResponse.headers.get('content-type') || 'text/html'
    const content = await blobResponse.arrayBuffer()

    // Return the content with appropriate headers
    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="payslip-${payslip.employeeName.replace(/\s+/g, '-')}.html"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to download PDF' }, { status: 500 })
  }
}
