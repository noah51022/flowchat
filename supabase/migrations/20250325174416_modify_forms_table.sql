-- Make user_id nullable and remove foreign key constraint for testing
ALTER TABLE forms
  ALTER COLUMN user_id DROP NOT NULL,
  DROP CONSTRAINT IF EXISTS forms_user_id_fkey;

-- Make user_id nullable in form_responses as well
ALTER TABLE form_responses
  ALTER COLUMN user_id DROP NOT NULL,
  DROP CONSTRAINT IF EXISTS form_responses_user_id_fkey; 