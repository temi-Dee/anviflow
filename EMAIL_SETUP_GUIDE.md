# ANVIFLOW Email Authentication Setup Guide

## 🎯 Overview

ANVIFLOW uses **Resend** for authenticated email delivery of payslips to employees. This guide walks you through the complete setup.

## ✅ Email Features

- **Authenticated SMTP**: Secure, verified email delivery
- **Professional Templates**: HTML emails with company branding
- **Delivery Tracking**: Monitor sent/pending/failed emails
- **Error Logging**: Detailed error messages for troubleshooting
- **Batch Sending**: Send to multiple employees at once
- **Security**: Encrypted connections, user authentication required

## 📋 Prerequisites

- Resend account (free tier available)
- Domain to verify (can use custom domain or Resend sandbox)
- Vercel project with ANVIFLOW deployed

## 🚀 Step-by-Step Setup

### Step 1: Create Resend Account

1. Go to [Resend.com](https://resend.com)
2. Click "Sign Up"
3. Create account with email and password
4. Verify email address
5. You'll be in the Resend dashboard

### Step 2: Get API Key

1. In Resend dashboard, click **"API Keys"** (left sidebar)
2. Click **"Create API Key"**
3. Name: `ANVIFLOW` or `anviflow-payslip`
4. Copy the key (starts with `re_`)
5. **Store this securely** - you'll need it soon

```
Example: re_ABC123XYZ...
```

### Step 3: Verify Email/Domain

#### Option A: Using Resend Sandbox (Easiest - for testing)

1. In Resend dashboard, go to **"Domains"**
2. You'll see `onboarding@resend.dev` already available
3. You can use this immediately for testing
4. Emails can be sent to any address with this sender

#### Option B: Verify Your Domain (Production)

If you have your own domain:

1. Go to **"Domains"** in Resend
2. Click **"Add Domain"**
3. Enter your domain (e.g., `company.com`)
4. You'll get DNS records to add:
   ```
   DKIM Record
   SPF Record
   DMARC Record
   ```
5. Copy these records to your domain's DNS provider
6. Wait for verification (5-30 minutes)
7. Once verified, use: `ANVIFLOW <noreply@company.com>`

### Step 4: Add Environment Variables to Vercel

1. Go to your **Vercel project** → **Settings** → **Environment Variables**
2. Add these variables:

```
RESEND_API_KEY=re_ABC123XYZ...
RESEND_FROM_EMAIL=ANVIFLOW <onboarding@resend.dev>
```

Or for production with custom domain:

```
RESEND_API_KEY=re_ABC123XYZ...
RESEND_FROM_EMAIL=ANVIFLOW <noreply@company.com>
```

3. Click **"Save"**
4. Redeploy your project

### Step 5: Test Email Sending

#### Via Dashboard

1. Log in to ANVIFLOW
2. Go to **Dashboard** → **Payslips**
3. Select a payslip
4. Click **"Send Emails"** button
5. Confirm in dialog
6. Check email delivery status

#### Via API (cURL)

```bash
curl -X POST http://localhost:3000/api/payslips/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "payslipIds": [1, 2, 3]
  }'
```

Expected response:
```json
{
  "message": "Sent 3 of 3 emails",
  "results": [
    { "payslipId": 1, "success": true },
    { "payslipId": 2, "success": true },
    { "payslipId": 3, "success": true }
  ]
}
```

## 📧 Email Template

Employees will receive emails like this:

```
From: ANVIFLOW <noreply@company.com>
Subject: Your Payslip - MAY 2026 | Anvictol Integrated Services

Hello Daniel,

Your payslip for May 2026 is now available. Please find the details below:

Pay Date: May 31, 2026
Net Pay: ₦173,119.26

Your detailed payslip is attached to this email. Please download and 
keep it for your records.

If you have any questions about your payslip, please contact your HR 
department.

---

This is an automated message from ANVIFLOW.
Powered by Anvictol Integrated Services Nigeria Limited.
```

## 🔍 Monitoring & Troubleshooting

### Check Email Logs

The system automatically logs all email sending attempts:

```sql
SELECT * FROM email_logs 
WHERE status = 'sent' 
ORDER BY created_at DESC 
LIMIT 10;
```

### View Email Status in Dashboard

1. Go to **Dashboard** → **Payslips**
2. Look at the **"Email"** column
3. Status values:
   - 🟢 **Sent**: Email delivered successfully
   - 🟡 **Pending**: Email queued for sending
   - 🔴 **Failed**: Email delivery failed

### Common Issues & Solutions

#### ❌ Error: "Email service not configured"

**Solution:**
1. Check RESEND_API_KEY is set in Vercel
2. Verify value starts with `re_`
3. Go to Resend dashboard → API Keys
4. Confirm key is still active

#### ❌ Error: "Invalid from address"

**Solution:**
1. Check RESEND_FROM_EMAIL matches verified domain
2. If using custom domain, verify it's been verified in Resend
3. For testing, use: `onboarding@resend.dev`
4. Wait 5-30 minutes for domain verification

#### ❌ Error: "Invalid recipient"

**Solution:**
1. Check employee email address is valid
2. Verify email is not bouncing
3. Go to employee record and confirm email

#### ❌ Email never arrives

**Solution:**
1. Check email_logs table for errors
2. Check spam folder (emails might be marked as spam)
3. Verify Resend API key is active
4. Try resending the email

### Debug Mode

To enable detailed logging:

1. Edit `app/api/payslips/send-email/route.ts`
2. Add console logs around email sending
3. Check Vercel logs: **Vercel Dashboard** → **Deployments** → **Function Logs**

## 📊 Email Delivery Workflow

```
Admin Selects Payslips
         ↓
User Clicks "Send Emails"
         ↓
API Validates User Session
         ↓
Fetch Payslip & Employee Data
         ↓
Generate Professional Email HTML
         ↓
Send via Resend SMTP
         ↓
Log Email Result in Database
         ↓
Update Payslip Status (sent/failed)
         ↓
Return Success/Error Response
         ↓
Dashboard Shows Updated Status
```

## 💡 Best Practices

### ✅ Do's
- Use a verified domain in production
- Monitor email delivery regularly
- Set up DKIM/SPF/DMARC for best delivery
- Test with a small batch first
- Keep API key secure
- Use BCC for privacy if sending to multiple recipients
- Monitor bounce rates

### ❌ Don'ts
- Don't share API keys publicly
- Don't spam employees with test emails
- Don't use invalid email addresses
- Don't change sender address frequently
- Don't ignore bounced emails
- Don't send without testing first

## 🔐 Security Notes

- API keys are stored securely in Vercel environment
- Never commit API keys to git
- Use separate API keys for dev and production
- Rotate API keys periodically
- Monitor Resend dashboard for unauthorized use

## 📞 Support

### Resend Documentation
- [Resend Docs](https://resend.com/docs)
- [API Reference](https://resend.com/docs/api-reference/emails/send)
- [HTML Email Template Guide](https://resend.com/docs/templates)

### ANVIFLOW Support
- Check database logs: `email_logs` table
- Review API responses for error details
- Check Vercel function logs
- Contact Anvictol Integrated Services Nigeria Limited

## ✅ Setup Checklist

- [ ] Created Resend account
- [ ] Generated API key
- [ ] Verified email/domain in Resend
- [ ] Added RESEND_API_KEY to Vercel
- [ ] Added RESEND_FROM_EMAIL to Vercel
- [ ] Redeployed project
- [ ] Tested email sending
- [ ] Confirmed emails arrive in inbox
- [ ] Set up monitoring/logging
- [ ] Ready for production

## 🎉 You're Ready!

Once you've completed all steps, ANVIFLOW can securely send payslips to all your employees with:

✅ Professional HTML templates
✅ Company branding
✅ Nigerian Naira formatting
✅ Delivery tracking
✅ Error logging
✅ Secure authentication

---

**Version**: 1.0  
**Last Updated**: June 4, 2026  
**System**: ANVIFLOW Payslip Management System
