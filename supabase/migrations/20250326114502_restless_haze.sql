/*
  # Update AI Cards Policies

  1. Changes
    - Remove the public read access policy
    - Add policy for users to only read their own cards

  2. Security
    - Users can now only see their own cards
    - Maintains existing create, update, and delete policies
*/

DROP POLICY "Anyone can view cards" ON ai_cards;

CREATE POLICY "Users can view their own cards"
  ON ai_cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);