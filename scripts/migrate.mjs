/**
 * Run Drizzle migrations against the PostgreSQL database.
 * Called automatically during Render deployment via the build command.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required for migrations");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(pool);

console.log("Running database migrations...");
await migrate(db, { migrationsFolder: path.join(__dirname, "../drizzle") });
console.log("Migrations complete.");
await pool.end();
