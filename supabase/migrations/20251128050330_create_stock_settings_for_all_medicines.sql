/*
  # Create Stock Settings for All Medicines

  1. Stock Settings Creation
    - Creates stock settings for TEGUHAN location for all medicines
    - Creates stock settings for JOGOROGO location for all medicines
    - Each medicine gets 2 stock setting entries (one per location)
    - Initial stock set to 25 for all medicines
    - Yellow threshold: 40%, Red threshold: 20%
    
  2. Notes
    - Uses max_stock from medicines.teguhan_max and medicines.jogorogo_max
    - Prevents duplicates with ON CONFLICT
*/

-- Create stock settings for TEGUHAN location
INSERT INTO stock_settings (id, medicine_id, location, current_stock, max_stock, yellow_threshold, red_threshold, updated_at)
SELECT 
  gen_random_uuid(),
  m.id,
  'teguhan',
  25,
  m.teguhan_max,
  40,
  20,
  now()
FROM medicines m
WHERE NOT EXISTS (
  SELECT 1 FROM stock_settings ss 
  WHERE ss.medicine_id = m.id AND ss.location = 'teguhan'
);

-- Create stock settings for JOGOROGO location
INSERT INTO stock_settings (id, medicine_id, location, current_stock, max_stock, yellow_threshold, red_threshold, updated_at)
SELECT 
  gen_random_uuid(),
  m.id,
  'jogorogo',
  25,
  m.jogorogo_max,
  40,
  20,
  now()
FROM medicines m
WHERE NOT EXISTS (
  SELECT 1 FROM stock_settings ss 
  WHERE ss.medicine_id = m.id AND ss.location = 'jogorogo'
);
