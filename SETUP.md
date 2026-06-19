# 🚀 ANVIFLOW Complete Setup Guide

This guide will help you set up and run ANVIFLOW locally on Windows.

## ✅ Prerequisites

Before you start, make sure you have:
- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **pnpm** - Install with `npm install -g pnpm`
- **PostgreSQL** (v12+) - [Download](https://www.postgresql.org/download/windows/)

## 🔧 Installation Steps

### Step 1: Install PostgreSQL (if not already installed)

1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer
3. **Important**: Remember the password you set for the `postgres` user
4. Select default port `5432`
5. Complete the installation
6. Verify installation by opening Command Prompt and running:
   ```bash
   psql --version
   ```

### Step 2: Create the Database

Open Command Prompt or PowerShell and run:

```bash
psql -U postgres
```

You'll be prompted for the password. Then run:

```sql
CREATE DATABASE anviflow;
\q
```

This creates a new database named `anviflow`.

### Step 3: Update Environment Variables (if needed)

The `.env.local` file is already configured with:
```
DATABASE_URL=postgresql://postgres:treasure@localhost:5432/anviflow
```

**If your PostgreSQL password is different**, update `.env.local`:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/anviflow
```

### Step 4: Run the Complete Setup

**Option A: Using PowerShell (Recommended for Windows)**

```powershell
.\setup-windows.ps1
```

If you get a permission error, run PowerShell as Administrator first, then:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup-windows.ps1
```

**Option B: Using Command Prompt**

```bash
setup-windows.bat
```

**Option C: Manual Setup**

If the scripts don't work, run these commands manually:

```bash
# Install dependencies
pnpm install

# Generate database migrations
pnpm db:generate

# Run migrations to create tables
pnpm db:migrate

# Start the development server
pnpm dev
```

## 🎯 What Should Happen

If everything works, you should see:

```
✓ Database connection successful
✓ Running migrations...
✅ Migrations completed successfully!
🎉 Starting development server...

▲ Next.js 16.2.6
- ready started server on 0.0.0.0:3000
```

Then you can open: **http://localhost:3000**

## 🐛 Troubleshooting

### "psql: command not found"
- PostgreSQL is not in your PATH
- **Solution**: Add PostgreSQL bin folder to PATH:
  - Typically: `C:\Program Files\PostgreSQL\15\bin`
  - [Instructions](https://www.postgresql.org/docs/current/install-windows.html)

### "Error: connect ECONNREFUSED 127.0.0.1:5432"
- PostgreSQL is not running
- **Solution**: Start PostgreSQL service:
  - Windows: Services → PostgreSQL → Start
  - Or run: `pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start`

### "FATAL: database 'anviflow' does not exist"
- Database wasn't created
- **Solution**: Run the database creation step again:
  ```bash
  psql -U postgres
  CREATE DATABASE anviflow;
  \q
  ```

### "FATAL: password authentication failed"
- Wrong PostgreSQL password in `.env.local`
- **Solution**: Update DATABASE_URL with correct password

### Port 3000 already in use
- Another app is using port 3000
- **Solution**: 
  - Kill the process: `npx kill-port 3000`
  - Or use a different port: `PORT=3001 pnpm dev`

### "Module not found" errors
- Dependencies not installed
- **Solution**: Run `pnpm install` again

## 🚀 Using the App

Once the server is running:

1. Open **http://localhost:3000**
2. Click **"Get Started"**
3. **Sign up** with email and password
4. You'll enter the **Dashboard**
5. Navigate to **Employees** → **Import Employees** to add employees
6. Navigate to **Payroll** to upload salary data
7. Navigate to **Payslips** to generate and send payslips

## 📝 Useful Commands

```bash
# Development server
pnpm dev

# Production build
pnpm build
pnpm start

# Database commands
pnpm db:generate     # Generate migrations from schema
pnpm db:migrate      # Run pending migrations
pnpm db:setup        # Generate + Migrate (combined)

# Linting
pnpm lint

# Complete setup (install + db setup + dev)
pnpm setup
```

## 🆘 Need Help?

Check these files:
- [Quick Start Guide](./QUICKSTART.md) - Feature overview
- [Email Setup](./EMAIL_SETUP_GUIDE.md) - For Resend email configuration
- [Theme Toggle](./THEME_TOGGLE_IMPLEMENTATION.md) - Dark mode setup

---

**Happy coding! 🎉**
