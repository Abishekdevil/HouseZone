import express from 'express';
import cors from 'cors';
import { pool, checkConnection } from './config/database.js';
import routes from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.send('HouseZone Backend Server is Running!');
});

// Use routes with /api prefix
app.use('/api', routes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Auto-migrate: ensure job_seeker_profiles has all latest columns (idempotent, safe on every boot)
const runJobSeekerProfileAutoMigrations = async () => {
  try {
    const alters = [
      `ALTER TABLE job_seeker_profiles ADD COLUMN area VARCHAR(255) NULL AFTER experience_field`,
      `ALTER TABLE job_seeker_profiles ADD COLUMN city VARCHAR(255) NULL AFTER area`,
      `ALTER TABLE job_seeker_profiles ADD COLUMN aadhar VARCHAR(12) NULL AFTER city`,
      `ALTER TABLE job_seeker_profiles ADD COLUMN phone_number VARCHAR(15) NULL AFTER aadhar`,
      `ALTER TABLE job_seeker_profiles ADD COLUMN can_join_immediately VARCHAR(5) NULL AFTER phone_number`,
    ];
    for (const sql of alters) {
      try {
        await pool.execute(sql);
      } catch (err) {
        // Ignore "Duplicate column name" errors — the column already exists from a previous run
        if (err?.code !== 'ER_DUP_FIELDNAME') {
          console.warn('[auto-migrate] Warning for:', sql, err?.message || err?.code);
        }
      }
    }
    console.log('[auto-migrate] job_seeker_profiles columns verified.');
  } catch (topErr) {
    console.warn('[auto-migrate] Could not run job_seeker_profiles migrations:', topErr?.message);
  }
};

// Start server
// Bind to all interfaces to allow external connections
app.listen(PORT, '0.0.0.0', async() => {
  console.log(`Server running at http://localhost:${PORT}`);
  try {
    await checkConnection();
    await runJobSeekerProfileAutoMigrations();
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
});