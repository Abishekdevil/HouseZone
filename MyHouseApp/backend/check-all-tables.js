import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const runDiagnostic = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME || 'defaultdb',
      ssl: { rejectUnauthorized: false }
    });

    console.log('=== 🔎 DATABASE DIAGNOSTIC REPORT 🔎 ===\n');

    // First get list of all tables that actually exist
    const [allTablesResult] = await connection.execute('SHOW TABLES');
    const tableKey = Object.keys(allTablesResult[0] || {})[0] || 'Tables_in_defaultdb';
    const existingTables = allTablesResult.map(r => String(r[tableKey] || '').toLowerCase());
    console.log(`   Found ${existingTables.length} tables in database:\n   -> ${existingTables.join(', ')}\n`);

    const requiredTables = [
      'signup',
      'signup_log',
      'resowndet',
      'resownho',
      'bedroom_sizes',
      'resownpay',
      'location',
      'conditions',
      'restenant',
      'businessownerdet',
      'businessownerpro',
      'businessownerrent',
      'buitenant',
      'vehiclesowndet',
      'vehiclesdet',
      'vehtenant',
      'machinaryowndet',
      'machinarydet',
      'mactenant',
      'jobgiverdet',
      'jobgiverjob',
      'jobgiversalary',
      'jobseeker',
      'job_seeker_profiles'
    ];

    console.log('1️⃣  Checking REQUIRED TABLES:\n');

    for (const tbl of requiredTables) {
      const exists = existingTables.includes(tbl.toLowerCase());
      if (exists) {
        let rowCount = 0;
        try {
          const [countResult] = await connection.execute(`SELECT COUNT(*) as cnt FROM \`${tbl}\``);
          rowCount = countResult[0]?.cnt || 0;
        } catch (countErr) {
          rowCount = -1;
        }
        const dataEmoji = rowCount === 0 ? '🟡' : rowCount > 0 ? '🟢' : '❓';
        const rowInfo = rowCount === -1 ? '(could not count)' : `Rows: ${rowCount} ${rowCount > 0 ? '✅ HAS DATA!' : '(empty)'}`;
        console.log(`   ✅ ${tbl.padEnd(28)} ${dataEmoji} ${rowInfo}`);
      } else {
        console.log(`   ❌ ${tbl.padEnd(28)} 🔴 TABLE MISSING!`);
      }
    }

    console.log('\n2️⃣  JOB-RELATED TABLES DATA SUMMARY:\n');
    const jobTables = ['jobgiverdet', 'jobgiverjob', 'jobgiversalary', 'jobseeker', 'job_seeker_profiles'];
    for (const tbl of jobTables) {
      try {
        const hasTable = existingTables.includes(tbl.toLowerCase());
        if (!hasTable) {
          console.log(`   [${tbl}] 🔴 TABLE DOES NOT EXIST!\n`);
          continue;
        }
        const [rows] = await connection.execute(`SELECT * FROM \`${tbl}\` ORDER BY id DESC LIMIT 3`);
        console.log(`   [${tbl}] (latest up to 3 rows):`);
        if (rows.length === 0) {
          console.log('        (empty - no records yet)');
        } else {
          rows.forEach((row, idx) => {
            const preview = {};
            Object.keys(row).forEach(k => {
              const val = row[k];
              preview[k] = typeof val === 'string' && val.length > 40 ? val.slice(0, 40) + '...' : val;
            });
            console.log(`        Row ${idx + 1}:`, JSON.stringify(preview));
          });
        }
        console.log('');
      } catch (err) {
        console.log(`   [${tbl}] ERROR: ${err.message}\n`);
      }
    }

    console.log('\n=== ✅ DIAGNOSTIC COMPLETED ✅ ===');
    await connection.end();
  } catch (error) {
    console.error('\n❌ FATAL ERROR running diagnostic:', error);
    console.error(error.stack);
    process.exit(1);
  }
};

runDiagnostic();
