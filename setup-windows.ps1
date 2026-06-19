# ANVIFLOW Windows Development Setup Script
# Run this as Administrator to set up PostgreSQL, create database, and start the app

Write-Host "🚀 ANVIFLOW Development Environment Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if Node/pnpm is installed
Write-Host "`n✓ Checking Node.js and pnpm..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "  ❌ Node.js not found. Install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

try {
    $pnpmVersion = pnpm --version
    Write-Host "  pnpm: $pnpmVersion" -ForegroundColor Green
}
catch {
    Write-Host "  ❌ pnpm not found. Install with: npm install -g pnpm" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
Write-Host "`n✓ Checking PostgreSQL..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version
    Write-Host "  PostgreSQL: $pgVersion" -ForegroundColor Green
}
catch {
    Write-Host "  ⚠️  PostgreSQL not found in PATH" -ForegroundColor Yellow
    Write-Host "  Download & Install: https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    Write-Host "  (Make sure 'psql' is in your PATH)" -ForegroundColor Cyan
    Write-Host "  " -ForegroundColor Cyan
    $continue = Read-Host "Continue with setup anyway? (y/n)"
    if ($continue -ne 'y') { exit 1 }
}

# Create PostgreSQL database
Write-Host "`n✓ Setting up PostgreSQL database..." -ForegroundColor Yellow
try {
    Write-Host "  Creating database 'anviflow'..." -ForegroundColor Gray
    # Note: You may need to adjust credentials based on your PostgreSQL setup
    $dbExists = psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'anviflow'" 2>$null
    if ($dbExists -eq "") {
        psql -U postgres -c "CREATE DATABASE anviflow;" 2>$null
        Write-Host "  Database 'anviflow' created" -ForegroundColor Green
    }
    else {
        Write-Host "  Database 'anviflow' already exists" -ForegroundColor Green
    }
}
catch {
    Write-Host "  ⚠️  Could not create database automatically" -ForegroundColor Yellow
    Write-Host "  You may need to run PostgreSQL and execute:" -ForegroundColor Cyan
    Write-Host "    psql -U postgres" -ForegroundColor Cyan
    Write-Host "    CREATE DATABASE anviflow;" -ForegroundColor Cyan
}

# Install dependencies
Write-Host "`n✓ Installing dependencies..." -ForegroundColor Yellow
pnpm install

# Generate and run migrations
Write-Host "`n✓ Setting up database tables..." -ForegroundColor Yellow
pnpm db:generate 2>$null
pnpm db:migrate

# Start dev server
Write-Host "`n🎉 Starting development server..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ App will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host "`nPress Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

pnpm dev
