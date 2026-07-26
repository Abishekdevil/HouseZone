import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const runFixMigration = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME || 'defaultdb',
      ssl: { rejectUnauthorized: false }
    });

    console.log('Connected to database, applying migration fixes...');

    // Fix 1: salary_offering to VARCHAR(100)
    console.log('Fixing jobgiversalary.salary_offering column type...');
    await connection.execute(`ALTER TABLE jobgiversalary MODIFY COLUMN salary_offering VARCHAR(100) NOT NULL`);
    console.log('✓ salary_offering column updated');

    // Fix 2: Add working_timings to jobgiverjob if missing
    console.log('Checking jobgiverjob.working_timings column...');
    const [cols] = await connection.execute(
      `SHOW COLUMNS FROM jobgiverjob LIKE 'working_timings'`
    );
    if (cols.length === 0) {
      await connection.execute(
        `ALTER TABLE jobgiverjob ADD COLUMN working_timings VARCHAR(255) AFTER working_time_end`
      );
      console.log('✓ working_timings column added');
    } else {
      console.log('✓ working_timings column already exists');
    }

    console.log('\nMigration completed successfully!');
    await connection.end();
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

runFixMigration();
