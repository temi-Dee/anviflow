<<<<<<< HEAD
# 📋 ANVIFLOW - Payslip Management System

**ANVIFLOW** is a complete, production-ready payslip management system for **Anvictol Integrated Services Nigeria Limited**.

## 🎯 Key Features

✅ **Employee Management** - Add, import, and organize employees  
✅ **Payroll Processing** - Upload and process payroll data  
✅ **PDF Generation** - Professional Nigerian-standard payslips with company logo  
✅ **Email Authentication** - Secure, verified email delivery via Resend  
✅ **Dashboard** - Real-time payroll analytics and tracking  
✅ **Reports** - Email delivery tracking and salary reports  
✅ **Nigerian Naira** - All amounts formatted in ₦ (NGN)  
✅ **Company Branding** - ANVIFLOW branding throughout  

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Start Development Server**
   ```bash
   pnpm dev
   ```

3. **Open Browser**
   ```
   http://localhost:3000
   ```

4. **Create Account & Start Managing Payroll**

**[See QUICKSTART.md for detailed 5-minute setup]**

## 📚 Documentation Guide

Choose the guide that matches your needs:

### 🆕 New to ANVIFLOW?
**START HERE:** [QUICKSTART.md](./QUICKSTART.md)
- 5-minute setup guide
- Basic workflow
- Key files overview
- Quick troubleshooting

### 🔧 Setting Up the System?
**READ NEXT:** [ANVIFLOW_SETUP.md](./ANVIFLOW_SETUP.md)
- Complete installation guide
- Environment variables explained
- Database setup
- All features documented
- Troubleshooting guide

### 📧 Configuring Email Delivery?
**READ THIS:** [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md)
- Resend account creation
- API key setup
- Domain verification
- Email template examples
- Email troubleshooting
- Security best practices

### 📖 Want All Technical Details?
**REFERENCE:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- Complete feature list
- Database schema
- API endpoints
- Security features
- File structure
- Deployment checklist

### 📝 See What Changed?
**REFERENCE:** [CHANGES.md](./CHANGES.md)
- Complete changelog
- All customizations listed
- Files modified/created
- Branding changes
- Currency changes
- Logo integration

## 🏗️ Architecture Overview

```
ANVIFLOW Application
│
├── Frontend (Next.js 16)
│   ├── Landing Page (app/page.tsx)
│   ├── Auth Pages (sign-in, sign-up)
│   └── Dashboard
│       ├── Employees Management
│       ├── Payroll Management
│       ├── Payslips Management
│       └── Reports
│
├── Backend (API Routes)
│   ├── /api/payslips/send-email        [Email API]
│   ├── /api/payslips/generate-pdf      [PDF API]
│   └── /api/auth/[...all]              [Auth API]
│
├── Database (PostgreSQL via Neon)
│   ├── users (Better Auth)
│   ├── employees
│   ├── payrolls
│   ├── payslips
│   └── email_logs
│
├── Email Service (Resend)
│   └── Authenticated SMTP delivery
│
└── File Storage (Vercel Blob)
    └── PDF payslips
```

## 🔑 Environment Variables

Required to run the application:

```bash
# Email Service (for payslip delivery)
RESEND_API_KEY=re_xxxxx...
RESEND_FROM_EMAIL=noreply@company.com

# Database
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=generated_secret_here

# File Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```

**[See EMAIL_SETUP_GUIDE.md for how to get these]**

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Branding Instances | 8 (ANVIFLOW) |
| Naira Formatting | 6 (₦ NGN) |
| Documentation Files | 5 comprehensive guides |
| Logo Integration | 2 (PDF + Email) |
| API Endpoints | 3 (Email, PDF, Auth) |
| Database Tables | 8 tables |
| Components | 25+ components |
| Features | 20+ features |

## 📁 Project Structure

```
/vercel/share/v0-project/
├── README.md                    ← You are here
├── QUICKSTART.md               ← Start here for quick setup
├── ANVIFLOW_SETUP.md           ← Complete setup guide
├── EMAIL_SETUP_GUIDE.md        ← Email authentication guide
├── IMPLEMENTATION_SUMMARY.md   ← Full feature documentation
├── CHANGES.md                  ← Detailed changelog
│
├── app/
│   ├── api/
│   │   ├── payslips/
│   │   │   ├── send-email/route.ts      ✅ Email API
│   │   │   ├── generate-pdf/route.ts    ✅ PDF generation
│   │   │   └── download/[id]/route.ts
│   │   └── auth/[...all]/route.ts
│   ├── dashboard/              ← Main application routes
│   ├── sign-in/page.tsx       ✅ Updated branding
│   ├── sign-up/page.tsx       ✅ Updated branding
│   ├── page.tsx               ✅ Landing page (ANVIFLOW)
│   └── layout.tsx             ✅ Root layout
│
├── components/
│   ├── dashboard/
│   │   ├── payslips-content.tsx       ✅ Naira formatting
│   │   ├── sidebar.tsx                ✅ ANVIFLOW branding
│   │   ├── header.tsx                 ✅ ANVIFLOW branding
│   │   └── ... other components
│   └── ui/                     ← shadcn/ui components
│
├── lib/
│   ├── db/schema.ts            ← Database schema
│   ├── auth.ts                 ← Authentication
│   └── utils.ts
│
├── public/
│   ├── anviflow-logo.jpg      ✅ Company logo
│   └── ... other assets
│
└── ... configuration files
```

## ✨ Customizations Made

### ✅ Branding
- Changed "PayslipFlow" to **"ANVIFLOW"** throughout the application
- Updated all UI pages with ANVIFLOW branding
- Updated metadata and company information

### ✅ Currency
- Changed currency from **USD ($)** to **Nigerian Naira (₦)**
- Applied to:
  - Dashboard displays
  - PDF payslips
  - Email communications
  - All salary-related UI

### ✅ Logo
- Integrated **Anvictol Integrated Services Nigeria Limited** logo
- Logo appears in:
  - PDF payslips (professional circular format)
  - Email notifications
  - Company branding throughout

### ✅ Email Authentication
- **Resend** integration for authenticated email delivery
- Secure SMTP with verification
- Professional HTML email templates
- Delivery tracking and logging
- User session authentication required

### ✅ Payslip Template
- Professional **Nigerian standard** payslip design
- Includes:
  - Company logo and name
  - Employee information
  - Structured earnings section
  - Structured deductions section
  - Clear net pay display
  - Signature blocks

## 🎯 Getting Started

### For First-Time Users
1. Read [QUICKSTART.md](./QUICKSTART.md)
2. Install dependencies: `pnpm install`
3. Start dev server: `pnpm dev`
4. Create account at http://localhost:3000
5. Add employees and upload payroll

### For Developers
1. Read [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for architecture
2. Check [CHANGES.md](./CHANGES.md) for all modifications
3. Review API documentation in source files
4. Check database schema in `lib/db/schema.ts`

### For DevOps/Deployment
1. Read [ANVIFLOW_SETUP.md](./ANVIFLOW_SETUP.md) for deployment checklist
2. Read [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md) for email configuration
3. Set environment variables in Vercel
4. Deploy to Vercel

## 🔐 Security

- ✅ User authentication with Better Auth
- ✅ Session management and protection
- ✅ PostgreSQL database encryption
- ✅ Private blob storage for PDFs
- ✅ Verified email sending via Resend
- ✅ User data isolation
- ✅ API authentication required

## 📞 Support & Troubleshooting

### Common Issues

**Emails not sending?**
→ [EMAIL_SETUP_GUIDE.md - Troubleshooting](./EMAIL_SETUP_GUIDE.md#troubleshooting)

**PDFs not generating?**
→ [ANVIFLOW_SETUP.md - Troubleshooting](./ANVIFLOW_SETUP.md#support--troubleshooting)

**Setup issues?**
→ [QUICKSTART.md - Troubleshooting](./QUICKSTART.md#-troubleshooting)

**Need technical details?**
→ [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel Settings
4. Deploy

```bash
git push origin main
# → Vercel auto-deploys
```

### Set Environment Variables in Vercel

Go to: **Project Settings** → **Environment Variables**

```
RESEND_API_KEY=re_xxxxx...
RESEND_FROM_EMAIL=noreply@company.com
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your_secret
BLOB_READ_WRITE_TOKEN=token...
```

### Verify Deployment

1. Visit your Vercel URL
2. Create test account
3. Add test employee
4. Upload test payroll
5. Generate sample PDF
6. Send test email
7. Confirm delivery

## 📊 Next Steps

- [ ] Read QUICKSTART.md
- [ ] Install dependencies
- [ ] Start dev server
- [ ] Create account
- [ ] Add employees
- [ ] Upload payroll
- [ ] Generate payslips
- [ ] Configure email
- [ ] Send test email
- [ ] Deploy to Vercel
- [ ] Go live!

## 💡 Tips & Best Practices

1. **Always test email** before sending to employees
2. **Verify domain** in Resend for production
3. **Monitor delivery** stats in dashboard
4. **Keep API keys** secure and rotate regularly
5. **Backup database** regularly
6. **Check error logs** if issues occur
7. **Use version control** for all changes

## 📞 Contact

For support or customization:
- Contact: Anvictol Integrated Services Nigeria Limited
- System: ANVIFLOW Payslip Management System
- Version: 1.0

---

## 📖 Documentation Index

| Document | Purpose | Audience |
|----------|---------|----------|
| [QUICKSTART.md](./QUICKSTART.md) | 5-minute setup | Everyone |
| [ANVIFLOW_SETUP.md](./ANVIFLOW_SETUP.md) | Complete setup | Developers/DevOps |
| [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md) | Email configuration | Email admins |
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | Technical details | Developers |
| [CHANGES.md](./CHANGES.md) | What changed | Technical review |

---

**✅ ANVIFLOW is Ready to Use!**

Start with [QUICKSTART.md](./QUICKSTART.md) for a quick 5-minute setup, or dive deeper with the other guides.

**Happy payslip processing!** 🎉
=======
# anviflow
This is a web application that generate pay slip for small scale businesses. It is a light weight app
>>>>>>> afdec9ced6ebf4cbdfcc39a83ad0b274de71e21d
