import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabasePublishableKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

let supabaseBrowserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createClient(
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