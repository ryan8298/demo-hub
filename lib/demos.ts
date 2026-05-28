/**
 * Server-side data access for demos. Used by Server Components in the
 * hub pages and public detail pages, so the initial render arrives with
 * data already in the HTML.
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
    .order("title", { ascending: true });

  if (error) {
    console.error("listDemosForAudience failed:", error.message);
    return [];
  }
  return (data ?? []) as Demo[];
}

export async function getDemoBySlug(slug: string): Promise<Demo | null> {
  const { data, error } = await supabase
    .from("demos")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getDemoBySlug failed:", error.message);
    return null;
  }
  return (data as Demo) ?? null;
}

/**
 * Pull demos related to the given one — same industry first, then any
 * shared tag. Excludes the demo itself. Used for the "Related demos"
 * row on /demo/[slug].
 */
export async function listRelatedDemos(demo: Demo, limit = 3): Promise<Demo[]> {
  const orFilters: string[] = [];
  if (demo.industry) orFilters.push(`industry.eq.${demo.industry}`);

  let query = supabase
    .from("demos")
    .select("*")
    .neq("id", demo.id)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (orFilters.length > 0) {
    query = query.or(orFilters.join(","));
  }

  const { data, error } = await query;
  if (error) {
    console.error("listRelatedDemos failed:", error.message);
    return [];
  }
  let related = (data ?? []) as Demo[];

  // If we have tags, prefer demos that share any tag, otherwise keep the
  // industry-matched list as a fallback.
  if (demo.tags && demo.tags.length > 0) {
    const ranked = related
      .map((d) => ({
        d,
        score: (d.tags || []).filter((t) => demo.tags!.includes(t)).length,
      }))
      .sort((a, b) => b.score - a.score)
      .map(({ d }) => d);
    related = ranked;
  }

  return related;
}
