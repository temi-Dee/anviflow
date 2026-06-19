# 🚀 ANVIFLOW - Quick Start Guide

**ANVIFLOW** is a complete payslip management system for Anvictol Integrated Services Nigeria Limited with authenticated email delivery.

## 🎯 What's Included

✅ **Employee Management** - Add, import, and organize employees  
✅ **Payroll Processing** - Upload and process payroll data  
✅ **PDF Generation** - Professional Nigerian-standard payslips  
✅ **Email Authentication** - Secure, verified email delivery to employees  
✅ **Dashboard** - Real-time payroll analytics  
✅ **Reports** - Delivery tracking and salary summaries  

## ⚡ 5-Minute Setup

### 1. Install & Start
```bash
cd /vercel/share/v0-project
pnpm install
pnpm dev
```

Visit: http://localhost:3000

### 2. Create Account
- Click **"Get Started"**
- Sign up with email and password
- You'll enter the dashboard

### 3. Add Employees
- Go to **"Employees"**
- Click **"Import Employees"**
- Upload CSV with employee data
- Or add manually one by one

### 4. Upload Payroll
- Go to **"Payroll Upload"**
- Upload Excel file with salary data
- System auto-validates
- Creates payslips for all employees

### 5. Generate & Send
- Go to **"Payslips"**
- Select employees
- Click **"Generate PDFs"**
- Click **"Send Emails"**
- Payslips sent to employee emails ✅

## 🔑 Required Environment Variables

Before sending emails, set these in your Vercel project:

```
RESEND_API_KEY=re_xxxxx...           # From Resend.com
RESEND_FROM_EMAIL=noreply@company.com # Verified domain
DATABASE_URL=postgresql://...         # Your database
BETTER_AUTH_SECRET=generated_secret   # Auth secret
BLOB_READ_WRITE_TOKEN=token...       # For PDF storage
```

**[See EMAIL_SETUP_GUIDE.md for detailed instructions]**

## 📁 Key Files

| File | Purpose |
|------|---------|
| `components/dashboard/payslips-content.tsx` | Payslips UI with ₦ formatting |
| `app/api/payslips/send-email/route.ts` | Email delivery API |
| `app/api/payslips/generate-pdf/route.ts` | PDF generation |
| `public/anviflow-logo.jpg` | Company logo |
| `ANVIFLOW_SETUP.md` | Detailed setup guide |
| `EMAIL_SETUP_GUIDE.md` | Email authentication guide |
| `IMPLEMENTATION_SUMMARY.md` | Complete feature list |

## 🎨 Customizations Done

- ✅ Brand: PayslipFlow → **ANVIFLOW**
- ✅ Currency: USD → **Nigerian Naira (₦)**
- ✅ Logo: Integrated **Anvictol logo**
- ✅ Email: **Authenticated delivery via Resend**
- ✅ Template: **Nigerian payslip standard**

## 📧 Email Features

When you send payslips:
1. ✅ Professional HTML email generated
2. ✅ Company logo displayed
3. ✅ Amounts shown in ₦ (Nigerian Naira)
4. ✅ Sent from verified company email
5. ✅ Delivery tracked in dashboard
6. ✅ Errors logged automatically

**Example Email:**
```
From: ANVIFLOW <noreply@company.com>
Subject: Your Payslip - MAY 2026 | Anvictol Integrated Services

Hello Daniel,

Your payslip for May 2026 is now available.

Pay Date: May 31, 2026
Net Pay: ₦173,119.26

---
ANVIFLOW - Powered by Anvictol Integrated Services Nigeria Limited
```

## 🔐 Security

- ✅ User authentication (email + password)
- ✅ Session management
- ✅ Database encryption (PostgreSQL)
- ✅ Private PDF storage
- ✅ Verified email sending
- ✅ User data isolation

## 📊 Dashboard Features

### Payslips
- View all payslips
- Filter by payroll
- Search by employee name/email
- Bulk select and send
- Track delivery status
- Download PDFs

### Employees
- Add employees
- Import from CSV/Excel
- Edit employee details
- Manage departments
- Track salary info

### Payroll
- Upload payroll files
- Track payroll runs
- View payroll status
- See employee count

### Reports
- Email delivery analytics
- Salary summaries
- Historical records
- Success/failure rates

## 🆘 Troubleshooting

### Emails not sending?
1. Check `RESEND_API_KEY` is set in Vercel
2. Check `RESEND_FROM_EMAIL` is verified in Resend
3. Go to Payslips → check "Email" status column
4. See EMAIL_SETUP_GUIDE.md for detailed troubleshooting

### PDFs not generating?
1. Check `BLOB_READ_WRITE_TOKEN` is set
2. Check database connection is working
3. See ANVIFLOW_SETUP.md for more help

### Can't login?
1. Verify you created an account first
2. Check DATABASE_URL is correct
3. Try resetting password

### See error in dashboard?
1. Check Vercel logs: Project → Deployments → Logs
2. Check browser console for errors
3. Check database logs for SQL errors

## 📚 Documentation

- **ANVIFLOW_SETUP.md** - Complete setup and configuration
- **EMAIL_SETUP_GUIDE.md** - Email authentication setup
- **IMPLEMENTATION_SUMMARY.md** - Full feature documentation

## 🎉 You're All Set!

ANVIFLOW is ready to:
1. Manage your employees
2. Process payroll
3. Generate professional PDFs
4. Send authenticated emails
5. Track everything

**Start by adding employees, then upload payroll data!**

---

**Version**: 1.0  
**Company**: Anvictol Integrated Services Nigeria Limited  
**System**: ANVIFLOW Payslip Management System  
**Status**: ✅ Ready to Use
