import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://pwlccqqmqptodugmjvxc.supabase.co";

const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_jIeb325OrodW07DXGitK9w_OJGSke_F";

export const supabase = createClient(supabaseUrl, supabaseKey);
