-- Convert code column from text to integer for proper sorting
-- First, ensure all values are numeric by cleaning non-numeric characters
UPDATE crm_data 
SET code = NULLIF(REGEXP_REPLACE(code, '[^0-9]', '', 'g'), '')
WHERE code IS NOT NULL AND code != '';

-- Now alter the column type
ALTER TABLE crm_data 
ALTER COLUMN code TYPE integer USING NULLIF(code, '')::integer;