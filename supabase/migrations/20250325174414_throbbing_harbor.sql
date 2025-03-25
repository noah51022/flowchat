/*
  # Create Forms and Responses Tables

  1. New Tables
    - `forms`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `title` (text)
      - `prompts` (jsonb array)
      - `user_id` (uuid, references auth.users)
    
    - `form_responses`
      - `id` (uuid, primary key)
      - `form_id` (uuid, references forms)
      - `created_at` (timestamp)
      - `answers` (jsonb array)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on both tables
    - Add policies for form creation and viewing
    - Add policies for response submission and viewing
*/

-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  prompts jsonb NOT NULL,
  user_id uuid REFERENCES auth.users(id)
);

-- Create form_responses table
CREATE TABLE IF NOT EXISTS form_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid REFERENCES forms(id),
  created_at timestamptz DEFAULT now(),
  answers jsonb NOT NULL,
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

-- Policies for forms
CREATE POLICY "Users can create forms"
  ON forms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Forms are viewable by anyone"
  ON forms
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update their own forms"
  ON forms
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for form_responses
CREATE POLICY "Anyone can submit responses"
  ON form_responses
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Form creators can view responses"
  ON form_responses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM forms
      WHERE forms.id = form_responses.form_id
      AND forms.user_id = auth.uid()
    )
  );