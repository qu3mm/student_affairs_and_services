import { createClient } from "@/utils/supabase/client";

export async function logoutUser() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error.message);
    throw new Error(error.message);
  }

  return true;
}
