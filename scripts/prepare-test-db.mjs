import { readFile } from 'node:fs/promises';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  for (const file of ['db/001_independent_foundation.sql', 'db/002_private_circles.sql']) {
    const sql = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    await pool.query(sql);
    console.log(`PASS: Applied ${file}`);
  }
} finally {
  await pool.end();
}
