/*
  # Create workout tracking tables

  1. New Tables
    - `workouts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `exercise` (text)
      - `weight` (numeric)
      - `sets` (integer)
      - `reps` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `workouts` table
    - Add policies for authenticated users to:
      - Read their own workouts
      - Create new workouts
*/

CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  exercise text NOT NULL,
  weight numeric NOT NULL,
  sets integer NOT NULL,
  reps integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own workouts"
  ON workouts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts"
  ON workouts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);