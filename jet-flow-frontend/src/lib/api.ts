import { supabase } from "@/lib/supabaseClient";

export async function getUserApplications() {
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("Error getting user:", userError);
    return [];
  }

  // Fetch applications for this user
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("client_id", user.id);

  if (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
  return data;
}