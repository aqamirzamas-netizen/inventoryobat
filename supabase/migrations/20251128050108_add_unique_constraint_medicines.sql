/*
  # Add unique constraint to medicines name

  1. Changes
    - Add unique constraint on medicines.name column to prevent duplicates
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'medicines_name_key'
  ) THEN
    ALTER TABLE medicines ADD CONSTRAINT medicines_name_key UNIQUE (name);
  END IF;
END $$;
