# ANVIFLOW Payslip Management System - Setup Guide

## Overview

ANVIFLOW is a customized payslip management system built for **Anvictol Integrated Services Nigeria Limited**. It enables seamless payslip generation, management, and email delivery to employees.

## Customizations Applied

### 1. **Branding Changes**
- ✅ Application name changed from "PayslipFlow" to "ANVIFLOW" across all UI components
- ✅ Company logo integrated (Anvictol Integrated Services Nigeria Limited)
- ✅ Updated sidebar, header, landing page, and auth pages with ANVIFLOW branding
- ✅ Company website metadata updated in layout.tsx

### 2. **Currency Formatting**
- ✅ All currency values changed to **Nigerian Naira (₦)**
- ✅ Formatting applied in:
  - Dashboard payslips display
  - PDF payslip generation
  - Email communications to employees
- ✅ Format: ₦X,XXX.XX (using `en-NG` locale)

### 3. **Logo Integration**
- ✅ Company logo saved as `/public/anviflow-logo.jpg`
- ✅ Logo used in:
  - PDF payslips (header with circular display)
  - Email payslip notifications
  - Professional branding throughout

### 4. **Email Authentication & Delivery**
- ✅ Resend email service integration ready
- ✅ Authenticated email sending to employee addresses
- ✅ HTML email templates with company branding
- ✅ Email logging and delivery tracking
- ✅ Error handling and retry logic

### 5. **Payslip Template**
- ✅ Professional payslip PDF template matching Anvictol standards
- ✅ Includes:
  - Company logo and full name
  - Employee details (name, position, location, days worked)
  - Structured earnings breakdown
  - Structured deductions breakdown
  - Clear net pay display
  - Signature blocks for employee and employer
  - Nigerian Naira currency formatting

## Environment Variables Required

To enable full functionality, add the following environment variables to your project:

### **Email Service (Resend)**
```
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=your_verified_email@company.com
```

- **RESEND_API_KEY**: Get from https://resend.com/api-keys
- **RESEND_FROM_EMAIL**: Must be a verified domain email in your Resend account
- Example: `ANVIFLOW <support@company.com>`

### **Database (Better Auth + Neon PostgreSQL)**
```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your_generated_secret_here
```

- Generate `BETTER_AUTH_SECRET`: `openssl rand -base64 32`

### **Optional: Vercel Blob Storage**
```
BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

## Setup Instructions

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Environment Variables
Add the required variables to:
- `.env.local` (for local development)
- Vercel project settings → Vars (for production)

### 3. Initialize Database
```bash
pnpm run db:push  # or equivalent migration command
```

### 4. Run Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000`

### 5. Create Admin Account
- Go to `/sign-up`
- Create your account with email and password
- You'll be redirected to dashboard

## Features

### Employee Management
- ✅ Add employees manually
- ✅ Bulk import from Excel/CSV
- ✅ Edit employee details (position, department, bank details)
- ✅ Organize by department

### Payroll Management
- ✅ Upload payroll files (Excel/CSV)
- ✅ Auto-generate payslips for all employees
- ✅ View and download payslips as PDF
- ✅ Track email delivery status

### Payslip Generation
- ✅ Professional PDF generation
- ✅ Automatic earnings/deductions calculations
- ✅ Nigerian Naira formatting
- ✅ Secure cloud storage (Vercel Blob)

### Email Delivery
- ✅ Send payslips directly to employee emails
- ✅ Authenticated email delivery via Resend
- ✅ Email delivery tracking
- ✅ Error logging and reporting
- ✅ Track sent/pending/failed status

### Reporting
- ✅ Payroll analytics
- ✅ Email delivery reports
- ✅ Employee salary summaries
- ✅ Historical payslip tracking

## Database Schema

### Core Tables
- **users** - Admin users (Better Auth)
- **employees** - Employee records with salary info
- **payrolls** - Payroll run records
- **payslips** - Individual employee payslips
- **email_logs** - Email delivery tracking

## Security Features

- ✅ Authentication via Better Auth
- ✅ Session management
- ✅ Encrypted database (PostgreSQL)
- ✅ Private blob storage for PDFs
- ✅ Email verification
- ✅ Access control to dashboard

## Support & Troubleshooting

### Payslips not generating PDFs
- Ensure BLOB_READ_WRITE_TOKEN is set
- Check Vercel Blob storage connection

### Emails not sending
- Verify RESEND_API_KEY is correct
- Check RESEND_FROM_EMAIL is verified in Resend dashboard
- Review email logs in database for errors

### Database connection issues
- Verify DATABASE_URL is correct
- Check BETTER_AUTH_SECRET is set
- Ensure Neon PostgreSQL is accessible

## File Locations

```
/vercel/share/v0-project/
├── public/
│   └── anviflow-logo.jpg          # Company logo
├── app/
│   ├── api/payslips/
│   │   ├── send-email/route.ts    # Email sending API
│   │   └── generate-pdf/route.ts  # PDF generation API
│   └── dashboard/                 # Main application routes
├── components/dashboard/
│   ├── payslips-content.tsx       # Payslips management UI
│   ├── employees-content.tsx      # Employee management UI
│   └── sidebar.tsx                # Navigation (ANVIFLOW branding)
└── lib/
    ├── db/schema.ts               # Database schema
    └── auth.ts                    # Authentication setup
```

## Contact & Customization

For further customization or support with ANVIFLOW, contact Anvictol Integrated Services Nigeria Limited.

---

**Version**: 1.0  
**Last Updated**: June 4, 2026  
**Company**: Anvictol Integrated Services Nigeria Limited  
**System**: ANVIFLOW Payslip Management System
