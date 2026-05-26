/**
 * Server-side admin queries — uses the service-role client so RLS doesn't
 * block reads on the admin index. Only import from server contexts.
 */
import { supabaseAdmin } from "@/lib/supabase";
import { Demo } from "@/lib/types";

export async function listAllDemos(): Promise<Demo[]> {
  const { data, error } = await supabaseAdmin
    .from("demos")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listAllDemos failed:", error.message);
    return [];
  }
  return (data ?? []) as Demo[];
}

export async function getDemoById(id: string): Promise<Demo | null> {
  const { data, error } = await supabaseAdmin
    .from("demos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getDemoById failed:", error.message);
    return null;
  }
  return data as Demo;
}
