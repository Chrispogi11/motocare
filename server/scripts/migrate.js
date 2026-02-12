import pg from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf8');

async function migrate() {
  try {
    await pool.query(sql);
    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
