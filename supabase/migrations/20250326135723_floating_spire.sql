/*
  # Add Image URL to AI Cards

  1. Changes
    - Add image_url column to ai_cards table
    - Make it nullable to maintain compatibility with existing cards

  2. Notes
    - Existing cards will have NULL for image_url
    - New cards can optionally include an image URL
*/

ALTER TABLE ai_cards
ADD COLUMN image_url text;