/*
  # Create Storage Bucket for Card Images

  1. New Storage
    - Create 'card-images' bucket for storing AI tool logos
    - Enable public access for viewing images
    - Set up RLS policies for secure uploads

  2. Security
    - Enable RLS on the bucket
    - Allow authenticated users to upload their own images
    - Allow public access for viewing images
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('card-images', 'card-images', true);

-- Set up RLS policies for the bucket
CREATE POLICY "Allow public viewing of images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'card-images');

CREATE POLICY "Allow authenticated users to upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'card-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Allow users to update their own images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'card-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Allow users to delete their own images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'card-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );