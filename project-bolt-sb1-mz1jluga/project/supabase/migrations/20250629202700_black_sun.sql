/*
  # Setup Storage Bucket for Repair Requests

  1. Storage Setup
    - Create `repair-requests` bucket with proper configuration
    - Set file size limits and allowed MIME types
    - Configure public access policies

  2. Security
    - Allow public uploads for repair requests
    - Enable public read access for uploaded files
    - Add cleanup policies for file management
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'repair-requests',
  'repair-requests',
  true,
  10485760, -- 10MB limit
  ARRAY[
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    'audio/webm', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/mpeg',
    'audio/mp4', 'audio/x-m4a'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    'audio/webm', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/mpeg',
    'audio/mp4', 'audio/x-m4a'
  ];

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete own files" ON storage.objects;

-- Allow public uploads to the repair-requests bucket
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT TO public
  WITH CHECK (bucket_id = 'repair-requests');

-- Allow public read access to files in repair-requests bucket
CREATE POLICY "Allow public access" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'repair-requests');

-- Allow users to delete files (for cleanup)
CREATE POLICY "Allow delete files" ON storage.objects
  FOR DELETE TO public
  USING (bucket_id = 'repair-requests');