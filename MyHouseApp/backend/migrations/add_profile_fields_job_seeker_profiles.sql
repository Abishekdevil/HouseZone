-- Add new columns to job_seeker_profiles table for Add My Profile form
ALTER TABLE job_seeker_profiles
  ADD COLUMN area VARCHAR(255) NULL AFTER experience_field,
  ADD COLUMN city VARCHAR(255) NULL AFTER area,
  ADD COLUMN aadhar VARCHAR(12) NULL AFTER city,
  ADD COLUMN phone_number VARCHAR(15) NULL AFTER aadhar,
  ADD COLUMN can_join_immediately VARCHAR(5) NULL AFTER phone_number;
