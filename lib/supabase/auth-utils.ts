import { createClient } from "@/lib/supabase/client";

export async function isUserLoggedIn(): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}
