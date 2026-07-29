import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabasePublishableKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

let supabaseBrowserClient: SupabaseClient<Database> | null = null;

export function getSupabaseBrowserClient() {
  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createClient<Database>(
      supabaseUrl,
      supabasePublishableKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      },
    );
  }

  return supabaseBrowserClient;
}