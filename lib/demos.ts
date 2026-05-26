/**
 * Server-side data access for demos. Used by Server Components in the
 * hub pages so the initial render arrives with data already in the HTML,
 * eliminating the spinner flash and the client→API round trip.
 */
import { supabase } from "@/lib/supabase";
import { Demo } from "@/lib/types";

export async function listDemosForAudience(
  audience: "customer" | "microsoft"
): Promise<Demo[]> {
  const { data, error } = await supabase
    .from("demos")
    .select("*")
    .contains("audience", [audience])
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listDemosForAudience failed:", error.message);
    return [];
  }
  return (data ?? []) as Demo[];
}
