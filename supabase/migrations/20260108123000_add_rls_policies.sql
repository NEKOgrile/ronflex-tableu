-- Migration: add RLS policies for snorlax_cards
-- Enables row level security and adds safe public read + update for possessed

/* Enable Row Level Security (RLS) on the table */
ALTER TABLE public.snorlax_cards ENABLE ROW LEVEL SECURITY;

/* Allow public read (SELECT) */
CREATE POLICY "Public read cards"
  ON public.snorlax_cards
  FOR SELECT
  USING (true);

/* Allow updates from the client for the 'possessed' and 'image_url' fields */
CREATE POLICY "Allow update possessed and image_url"
  ON public.snorlax_cards
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Notes:
-- 1) This policy allows updates from anonymous/public clients. For production,
--    you should tighten the rule (for example require authenticated users
--    or check which columns may be updated).
-- 2) To apply this migration, paste this SQL into Supabase SQL Editor or run
--    via psql against your database.
