@echo off
REM ANVIFLOW Windows Development Setup Script
REM Run this file from the project directory

echo.
echo =====================================
echo ANVIFLOW Development Environment Setup
echo =====================================
echo.

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js not found. Install from https://nodejs.org/
  pause
  exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo  ✓ Node.js: %%i

REM Check pnpm
echo Checking pnpm...
pnpm --version >nul 2>&1
if errorlevel 1 (
  echo ERROR: pnpm not found. Install with: npm install -g pnpm
  pause
  exit /b 1
)
for /f "tokens=*" %%i in ('pnpm --version') do echo  ✓ pnpm: %%i

REM Check PostgreSQL
echo Checking PostgreSQL...
psql --version >nul 2>&1
if errorlevel 1 (
  echo WARNING: PostgreSQL not found or not in PATH
  echo Download from: https://www.postgresql.org/download/windows/
  echo Then ensure psql is in your PATH
  echo.
  set /p CONTINUE="Continue anyway? (y/n): "
  if /i not "%CONTINUE%"=="y" exit /b 1
) else (
  for /f "tokens=*" %%i in ('psql --version') do echo  ✓ %%i
)

REM Install dependencies
echo.
echo Installing dependencies...
call pnpm install

REM Setup database
echo.
echo Setting up database...
call pnpm db:setup

REM Start dev server
echo.
echo =====================================
echo STARTING DEVELOPMENT SERVER
echo =====================================
echo.
echo ✅ App will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call pnpm dev
pause
