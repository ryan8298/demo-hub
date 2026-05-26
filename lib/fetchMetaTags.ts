import * as cheerio from "cheerio";

export interface MetaData {
  title: string;
  description: string;
  image: string;
}

const DEFAULT_META: MetaData = {
  title: "Demo",
  description: "Interactive demo",
  image: "",
};

/**
 * Fetch a URL and extract Open Graph metadata. Uses native fetch with an
 * AbortController-backed timeout — no axios.
 *
 * Some demo hosts block scrapers and will return non-OK or hang. We bail
 * out at 5s and return defaults rather than propagate the error, so the
 * admin "Auto-Fetch Image" button gracefully shows a fallback message.
 */
export async function fetchMetaTags(url: string): Promise<MetaData> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Echelix-DemoHub/1.0; +https://echelix.app)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    if (!response.ok) return DEFAULT_META;

    const html = await response.text();
    const $ = cheerio.load(html);

    return {
      title:
        $('meta[property="og:title"]').attr("content") ||
        $("title").text().trim() ||
        DEFAULT_META.title,
      description:
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        DEFAULT_META.description,
      image:
        $('meta[property="og:image"]').attr("content") ||
        $('meta[name="image"]').attr("content") ||
        DEFAULT_META.image,
    };
  } catch (err) {
    // Timeouts surface as AbortError. Network errors / DNS failures also
    // land here. Either way we silently degrade — this is best-effort.
    if (process.env.NODE_ENV !== "production") {
      console.warn("fetchMetaTags failed:", err);
    }
    return DEFAULT_META;
  } finally {
    clearTimeout(timeout);
  }
}
