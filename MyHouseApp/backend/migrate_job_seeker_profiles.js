import { pool } from './config/database.js';
import 'dotenv/config';

const ALTERS = [
  `ALTER TABLE job_seeker_profiles ADD COLUMN area VARCHAR(255) NULL AFTER experience_field`,
  `ALTER TABLE job_seeker_profiles ADD COLUMN city VARCHAR(255) NULL AFTER area`,
  `ALTER TABLE job_seeker_profiles ADD COLUMN aadhar VARCHAR(12) NULL AFTER city`,
  `ALTER TABLE job_seeker_profiles ADD COLUMN phone_number VARCHAR(15) NULL AFTER aadhar`,
  `ALTER TABLE job_seeker_profiles ADD COLUMN can_join_immediately VARCHAR(5) NULL AFTER phone_number`,
];

const run = async () => {
  console.log('[migration] Connecting to MySQL...');
  try {
    await pool.execute(`SELECT 1`);
    console.log('[migration] DB connection OK');
  } catch (connErr) {
    console.error('[migration] DB connection failed:', connErr.message);
    process.exit(1);
  }

  console.log('[migration] Ensuring job_seeker_profiles columns exist...');
  let applied = 0;
  let skipped = 0;
  for (const sql of ALTERS) {
    try {
      await pool.execute(sql);
      console.log(`[migration] OK  — ${sql.split('ADD COLUMN ')[1].split(' ')[0]}`);
      applied += 1;
    } catch (err) {
      if (err?.code === 'ER_DUP_FIELDNAME') {
        console.log(`[migration] SKIP — ${sql.split('ADD COLUMN ')[1].split(' ')[0]} (already exists)`);
        skipped += 1;
      } else {
        console.error('[migration] FAILED:', sql);
        console.error('[migration] Error:', err.message);
        process.exit(1);
      }
    }
  }

  console.log(`[migration] Done. Applied: ${applied}, Skipped (already present): ${skipped}`);

  console.log('[migration] Verifying columns:');
  const [rows] = await pool.execute(`SHOW COLUMNS FROM job_seeker_profiles`);
  const cols = rows.map(r => r.Field);
  const expected = ['area', 'city', 'aadhar', 'phone_number', 'can_join_immediately'];
  for (const name of expected) {
    console.log(`  - ${name} — ${cols.includes(name) ? 'PRESENT' : 'MISSING'}`);
  }
  process.exit(0);
};

run();
