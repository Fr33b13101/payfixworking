/*
  # Add INSERT policy for repair requests

  1. Security Changes
    - Add policy to allow anonymous users to insert repair requests
    - This enables the public repair form to work properly
    - Users can submit repair requests without authentication

  2. Policy Details
    - Target: INSERT operations on repair_requests table
    - Role: anon (anonymous users)
    - Condition: true (allows all anonymous inserts)
*/

-- Create policy to allow anonymous users to insert repair requests
CREATE POLICY "Enable insert access for anonymous users"
  ON repair_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);