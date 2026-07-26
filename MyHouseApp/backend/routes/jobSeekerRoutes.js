import { Router } from 'express';
import { pool } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const jobGiverUploadsDir = path.join(__dirname, '../uploads', 'jobgiver');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(jobGiverUploadsDir)) {
  fs.mkdirSync(jobGiverUploadsDir, { recursive: true });
}

// Helper function to convert snake_case to camelCase
const toCamelCase = (str) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

// Helper function to convert object keys from snake_case to camelCase
const convertKeysToCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[toCamelCase(key)] = obj[key];
      return result;
    }, {});
  }
  return obj;
};

// POST save job seeker form data
router.post('/jobseeker', async (req, res) => {
  try {
    console.log('Job seeker req.body:', req.body);
    const {
      fullName,
      mobileNumber,
      age,
      gender,
      aadharNumber,
      profilePicture,
      experience,
      education,
      experienceYears,
      lastWorkingShop,
      addExperience,
      canJoinImmediately,
      preferredEmploymentType,
      jobGiverJobId
    } = req.body;

    // Convert undefined to null
    const values = [
      fullName,
      mobileNumber,
      age,
      gender,
      aadharNumber !== undefined ? aadharNumber : null,
      profilePicture !== undefined ? profilePicture : null,
      experience,
      education,
      experienceYears !== undefined ? experienceYears : null,
      lastWorkingShop !== undefined ? lastWorkingShop : null,
      addExperience !== undefined ? addExperience : null,
      canJoinImmediately,
      preferredEmploymentType !== undefined ? preferredEmploymentType : null,
      jobGiverJobId !== undefined ? jobGiverJobId : null
    ];

    console.log('Inserting into jobseeker with values:', values);
    const sql = `INSERT INTO jobseeker (full_name, mobile_number, age, gender, aadhar_number, profile_picture, experience, education, experience_years, last_working_shop, add_experience, can_join_immediately, preferred_employment_type, job_giver_job_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(sql, values);
    console.log('Insert result:', result);

    res.status(201).json({ jobSeekerId: result.insertId, message: 'Job seeker data saved successfully' });
  } catch (error) {
    console.error('Error saving job seeker data:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error saving job seeker data', error: error.message });
  }
});

// Get all job listings for job seeker
router.get('/jobseeker/jobs', async (req, res) => {
  try {
    let query = `SELECT 
      jd.id,
      jd.shop_name,
      jd.shop_type,
      jd.area,
      jd.city,
      jd.created_at,
      jj.job_title,
      jj.employment_type,
      jj.age,
      jj.gender,
      jj.education,
      jj.experience_year,
      jj.experience_field,
      jj.working_time_start,
      jj.working_time_end,
      js.salary_offering
    FROM jobgiverdet jd
    LEFT JOIN jobgiverjob jj ON jd.id = jj.jobgiverdet_id
    LEFT JOIN jobgiversalary js ON jd.id = js.jobgiverdet_id`;

    const params = [];
    const conditions = [];

    const { jobTitle, area, minSalary, maxSalary, employmentType } = req.query;

    if (jobTitle) {
      conditions.push(`jj.job_title LIKE ?`);
      params.push(`%${jobTitle}%`);
    }

    if (area) {
      conditions.push(`jd.area LIKE ?`);
      params.push(`%${area}%`);
    }

    if (minSalary) {
      conditions.push(`js.salary_offering >= ?`);
      params.push(parseFloat(minSalary));
    }

    if (maxSalary) {
      conditions.push(`js.salary_offering <= ?`);
      params.push(parseFloat(maxSalary));
    }

    if (employmentType) {
      conditions.push(`jj.employment_type = ?`);
      params.push(employmentType);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY jd.id DESC`;

    const [rows] = await pool.execute(query, params);

    let filenames = [];
    try {
      filenames = fs.readdirSync(jobGiverUploadsDir);
    } catch (_) {
      filenames = [];
    }
    const origin = `${req.protocol}://${req.get('host')}`;
    const withImages = rows.map(row => {
      const id = row.id;
      const prefix = `jobgiver-${id}-`;
      const urls = filenames
        .filter(fn => fn.startsWith(prefix))
        .map(fn => `${origin}/uploads/jobgiver/${fn}`);
      const firstImage = urls.find(url => url.includes('shopPhoto1')) || urls[0] || null;
      const camelCaseRow = convertKeysToCamelCase(row);
      return { ...camelCaseRow, shopPhoto1: firstImage };
    });

    res.status(200).json(withImages);
  } catch (error) {
    console.error('Error fetching job listings:', error);
    res.status(500).json({ message: 'Error fetching job listings', error: error.message });
  }
});

// GET detailed job information
router.get('/jobseeker/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT 
        jd.id,
        jd.name,
        jd.shop_name,
        jd.shop_type,
        jd.area,
        jd.city,
        jd.landmark,
        jd.contact,
        jd.created_at,
        jj.job_title,
        jj.employment_type,
        jj.age,
        jj.gender,
        jj.education,
        jj.experience_year,
        jj.experience_field,
        jj.working_time_start,
        jj.working_time_end,
        js.salary_offering,
        js.other_skills,
        js.shop_photo1,
        js.shop_photo2,
        js.shop_photo3
      FROM jobgiverdet jd
      LEFT JOIN jobgiverjob jj ON jd.id = jj.jobgiverdet_id
      LEFT JOIN jobgiversalary js ON jd.id = js.jobgiverdet_id
      WHERE jd.id = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Job not found' });

    const job = rows[0];

    let filenames = [];
    try {
      filenames = fs.readdirSync(jobGiverUploadsDir);
    } catch (_) {
      filenames = [];
    }
    const origin = `${req.protocol}://${req.get('host')}`;
    const prefix = `jobgiver-${id}-`;
    const images = filenames
      .filter(fn => fn.startsWith(prefix))
      .map(fn => `${origin}/uploads/jobgiver/${fn}`);

    const camelCaseJob = convertKeysToCamelCase(job);
    const structuredData = {
      ...camelCaseJob,
      shopPhoto1: images.find(url => url.includes('shopPhoto1')) || null,
      shopPhoto2: images.find(url => url.includes('shopPhoto2')) || null,
      shopPhoto3: images.find(url => url.includes('shopPhoto3')) || null,
      images: images
    };

    res.status(200).json(structuredData);
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ message: 'Error fetching job details', error: error.message });
  }
});

// GET job seeker applications by mobile number
router.get('/jobseeker/applications/:mobileNumber', async (req, res) => {
  try {
    const { mobileNumber } = req.params;

    const [rows] = await pool.execute(
      `SELECT js.*, jd.shop_name, jd.shop_type, jd.area, jd.city, jsal.salary_offering, jj.working_time_start, jj.working_time_end 
       FROM jobseeker js 
       LEFT JOIN jobgiverdet jd ON js.job_giver_job_id = jd.id 
       LEFT JOIN jobgiverjob jj ON jd.id = jj.jobgiverdet_id
       LEFT JOIN jobgiversalary jsal ON jd.id = jsal.jobgiverdet_id 
       WHERE js.mobile_number = ? 
       ORDER BY js.created_at DESC`,
      [mobileNumber]
    );

    // Convert snake_case to camelCase
    const camelCaseRows = rows.map(convertKeysToCamelCase);
    res.status(200).json(camelCaseRows);
  } catch (error) {
    console.error('Error fetching job seeker applications:', error);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// POST save job seeker profile (Add My Profile form)
router.post('/jobseeker/profile', async (req, res) => {
  try {
    console.log('[jobSeekerProfile] req.body:', req.body);
    const {
      signupId,
      name,
      age,
      gender,
      education,
      experienceStatus,
      experienceYears,
      experienceField
    } = req.body;

    // Basic validation
    if (!name || !age || !gender || !education || !experienceStatus) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }
    if (experienceStatus === 'experienced') {
      if (!experienceYears || !experienceField) {
        return res.status(400).json({ message: 'Experience years and field are required for experienced.' });
      }
    }

    // Upsert: if there's a row with same signupId or same (name, age, gender, education) signature, update, else insert
    let profileId = null;
    let existingRow = null;

    if (signupId) {
      const [rows] = await pool.execute(
        'SELECT * FROM job_seeker_profiles WHERE signup_id = ? LIMIT 1',
        [signupId]
      );
      existingRow = rows[0];
    }
    if (!existingRow) {
      const [rows] = await pool.execute(
        'SELECT * FROM job_seeker_profiles WHERE name = ? AND age = ? AND gender = ? AND education = ? LIMIT 1',
        [name, age, gender, education]
      );
      existingRow = rows[0];
    }

    if (existingRow) {
      profileId = existingRow.id;
      const updateSql = `
        UPDATE job_seeker_profiles SET
          signup_id = ?,
          name = ?,
          age = ?,
          gender = ?,
          education = ?,
          experience_status = ?,
          experience_years = ?,
          experience_field = ?
        WHERE id = ?
      `;
      const updateValues = [
        signupId !== undefined ? signupId : null,
        name,
        age,
        gender,
        education,
        experienceStatus,
        experienceStatus === 'experienced' ? (experienceYears || null) : null,
        experienceStatus === 'experienced' ? (experienceField || null) : null,
        profileId
      ];
      await pool.execute(updateSql, updateValues);
      res.status(200).json({ profileId, message: 'Profile updated successfully' });
    } else {
      const insertSql = `
        INSERT INTO job_seeker_profiles (
          signup_id, name, age, gender, education, experience_status, experience_years, experience_field
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const insertValues = [
        signupId !== undefined ? signupId : null,
        name,
        age,
        gender,
        education,
        experienceStatus,
        experienceStatus === 'experienced' ? (experienceYears || null) : null,
        experienceStatus === 'experienced' ? (experienceField || null) : null
      ];
      const [result] = await pool.execute(insertSql, insertValues);
      profileId = result.insertId;
      res.status(201).json({ profileId, message: 'Profile saved successfully' });
    }
  } catch (error) {
    console.error('[jobSeekerProfile] Error saving profile:', error);
    console.error('[jobSeekerProfile] Error stack:', error.stack);
    res.status(500).json({ message: 'Error saving profile', error: error.message });
  }
});

// GET job seeker profile (by signupId, or by fallback matcher fields in query)
router.get('/jobseeker/profile', async (req, res) => {
  try {
    const { signupId, name, age, gender, education } = req.query;
    let row = null;

    if (signupId) {
      const [rows] = await pool.execute(
        'SELECT * FROM job_seeker_profiles WHERE signup_id = ? LIMIT 1',
        [signupId]
      );
      row = rows[0];
    }
    if (!row && name && age && gender && education) {
      const [rows] = await pool.execute(
        'SELECT * FROM job_seeker_profiles WHERE name = ? AND age = ? AND gender = ? AND education = ? LIMIT 1',
        [name, age, gender, education]
      );
      row = rows[0];
    }

    if (!row) {
      return res.status(200).json(null);
    }

    const profile = convertKeysToCamelCase(row);
    res.status(200).json(profile);
  } catch (error) {
    console.error('[jobSeekerProfile] Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

export default router;
