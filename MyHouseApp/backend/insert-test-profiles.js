import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const insertTestProfile = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME || 'defaultdb',
      ssl: { rejectUnauthorized: false }
    });
    console.log('Connected, inserting test profile...');

    const testData = [
      [
        null, // signupId
        'Rajesh Kumar',
        25,
        'male',
        'ug',
        'fresher',
        null,
        null
      ],
      [
        null,
        'Priya Sharma',
        32,
        'female',
        'pg',
        'experienced',
        '4plus',
        'Sales and Marketing'
      ]
    ];

    for (const values of testData) {
      const sql = `
        INSERT INTO job_seeker_profiles (
          signup_id, name, age, gender, education, experience_status, experience_years, experience_field
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await connection.execute(sql, values);
      console.log(`Inserted profile ID: ${result.insertId} -> ${values[1]} (${values[5]})`);
    }

    // Now fetch all to confirm
    console.log('\nVerifying data:');
    const [rows] = await connection.execute('SELECT * FROM job_seeker_profiles ORDER BY id DESC LIMIT 5');
    rows.forEach(r => {
      console.log(`  ID: ${r.id} | ${r.name} | Age: ${r.age} | Status: ${r.experience_status}`);
    });

    await connection.end();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

insertTestProfile();
