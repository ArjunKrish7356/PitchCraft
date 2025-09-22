// Create and export Supabase client for the browser using NEXT_PUBLIC env vars
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";

// Warn in dev if env vars are missing to help debugging
if (!supabaseUrl || !supabaseKey) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_KEY. " +
        "Ensure .env.local contains NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY and restart the dev server."
    );
  }
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
