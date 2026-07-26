-- Migration: Fix job tables field/type mismatches
-- 1. jobgiversalary.salary_offering was DECIMAL -> must be VARCHAR to accept "Work based", "<=10k", "10k-20k", ">20k"
-- 2. jobgiverjob needs working_timings column (for full-time/part-time notes)
-- 3. Note: jobgiverdet column stays as "name" but backend route accepts either "name" OR "ownerName" from frontend

ALTER TABLE jobgiversalary 
MODIFY COLUMN salary_offering VARCHAR(100) NOT NULL;

ALTER TABLE jobgiverjob 
ADD COLUMN IF NOT EXISTS working_timings VARCHAR(255) AFTER working_time_end;
