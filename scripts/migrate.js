#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:treasure@localhost:5432/anviflow";

async function runMigrations() {
  try {
    console.log("🔄 Checking database connection...");

    // Test connection using pg
    const pool = new Pool({ connectionString: DATABASE_URL });
    try {
      await pool.query("SELECT 1");
      console.log("✅ Database connection successful");
    } catch (err) {
      console.error("❌ Failed to connect to database at:", DATABASE_URL);
      console.error("Error:", err.message);
      process.exit(1);
    } finally {
      await pool.end();
    }

    // Check if migrations folder exists
    const migrationsPath = path.join(__dirname, "..", "drizzle");
    if (!fs.existsSync(migrationsPath)) {
      console.log("⚠️  Migrations folder not found. Generating migrations...");
      execSync("npx drizzle-kit generate", { stdio: "inherit" });
    }

    // Run migrations using drizzle-kit
    console.log("🚀 Running migrations...");
    execSync("npx drizzle-kit migrate", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL },
    });

    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

runMigrations();
