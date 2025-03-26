/*
  # Create AI Cards Schema

  1. New Tables
    - `ai_cards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `description` (text)
      - `link` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `ai_cards` table
    - Add policies for authenticated users to:
      - Read all cards
      - Create their own cards
      - Update their own cards
      - Delete their own cards
*/

CREATE TABLE ai_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  link text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_cards ENABLE ROW LEVEL SECURITY;

-- Allow users to read all cards
CREATE POLICY "Anyone can view cards"
  ON ai_cards
  FOR SELECT
  USING (true);

-- Allow authenticated users to create their own cards
CREATE POLICY "Users can create their own cards"
  ON ai_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own cards
CREATE POLICY "Users can update their own cards"
  ON ai_cards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own cards
CREATE POLICY "Users can delete their own cards"
  ON ai_cards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);