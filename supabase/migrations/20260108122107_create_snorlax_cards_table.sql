/*
  # Snorlax Card Collection Database

  1. New Tables
    - `snorlax_cards`
      - `id` (uuid, primary key) - Unique identifier for each card
      - `possessed` (boolean) - Whether the card is possessed or not
      - `image_url` (text) - URL to the card image
      - `name` (text) - Name of the card
      - `set` (text) - Set/Extension name
      - `number` (text) - Card number
      - `release_date` (text) - Release date
      - `rarity` (text) - Rarity level
      - `type` (text) - Card type (Holo/Reverse/etc)
      - `language` (text) - Language (EN/JP/etc)
      - `principal` (text) - Whether it's a principal Snorlax card
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `snorlax_cards` table
    - Add public read policy for all cards
    - Add public write policy for managing cards

  3. Notes
    - This is a simple collection tracker without authentication
    - All users can view and manage all cards
*/

CREATE TABLE IF NOT EXISTS snorlax_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  possessed boolean DEFAULT false,
  image_url text DEFAULT '',
  name text NOT NULL,
  set text NOT NULL,
  number text NOT NULL,
  release_date text DEFAULT '',
  rarity text DEFAULT '',
  type text DEFAULT '',
  language text DEFAULT 'EN',
  principal text DEFAULT 'Oui',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE snorlax_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view snorlax cards"
  ON snorlax_cards
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert snorlax cards"
  ON snorlax_cards
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update snorlax cards"
  ON snorlax_cards
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete snorlax cards"
  ON snorlax_cards
  FOR DELETE
  TO anon, authenticated
  USING (true);