import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const runDiagnostics = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME || 'defaultdb',
      ssl: { rejectUnauthorized: false }
    });

    console.log('=== DB TABLE/COLUMN DIAGNOSTIC ===\n');
    const tables = [
      'job_seeker_profiles',
      'jobgiverdet',
      'jobgiverjob',
      'jobgiversalary',
      'jobseeker'
    ];
    for (const tbl of tables) {
      console.log(`[Table: ${tbl}]`);
      try {
        const [cols] = await connection.execute(
          `SHOW COLUMNS FROM ${tbl}`
        );
        cols.forEach(col => {
          const nullable = col.Null === 'YES' ? 'NULL' : 'NOT NULL';
          console.log(`  - ${col.Field} (${col.Type}) ${nullable} ${col.Key === 'PRI' ? '[PK]' : ''}${col.Default !== null && col.Default !== undefined ? ` DEFAULT ${col.Default}` : ''}`);
        });
      } catch (err) {
        console.log(`  ERROR: ${err.message}`);
      }
      console.log('');
    }

    await connection.end();
  } catch (error) {
    console.error('Diagnostic error:', error);
    process.exit(1);
  }
};

runDiagnostics();
