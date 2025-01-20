import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if(!url || !key) {
  throw new Error("Please add supabase url and key.")
}

export const supabase = createClient(url, key);
