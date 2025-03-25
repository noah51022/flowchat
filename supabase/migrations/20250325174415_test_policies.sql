-- Drop existing policies
DROP POLICY IF EXISTS "Users can create forms" ON forms;
DROP POLICY IF EXISTS "Forms are viewable by anyone" ON forms;
DROP POLICY IF EXISTS "Users can update their own forms" ON forms;
DROP POLICY IF EXISTS "Anyone can submit responses" ON form_responses;
DROP POLICY IF EXISTS "Form creators can view responses" ON form_responses;

-- Create new policies for testing (no auth required)
CREATE POLICY "Anyone can create forms"
  ON forms
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Forms are viewable by anyone"
  ON forms
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update forms"
  ON forms
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can submit responses"
  ON form_responses
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view responses"
  ON form_responses
  FOR SELECT
  TO public
  USING (true); 