/* ------------------------------------------------------------------
   Live news wire — pulls real, trending K-pop articles from the
   GDELT global news index (free, keyless, CORS-enabled). Used to
   inject genuinely live stories into the portal feed and to power
   real-time artist news search across world news channels.
------------------------------------------------------------------- */

export interface WireArticle {
  title: string;
  url: string;
  domain: string;
  seendate: string;
  language: string;
}

function endpoint(query: string, max = 25): string {
  const q = encodeURIComponent(query);
  return (
    `https://api.gdeltproject.org/api/v2/doc/doc?query=${q}` +
    `&mode=ArtList&maxrecords=${max}&format=json&timespan=7d&sort=datedesc`
  );
}

async function get(url: string): Promise<any> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`wire ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Trending K-pop stories from the last 7 days (English press). */
export async function fetchTrendingKpop(): Promise<WireArticle[]> {
  const q = '(kpop OR "k-pop") (comeback OR concert OR tour OR album OR award)';
  const data = await get(endpoint(q, 25));
  return clean(data);
}

/** Real-time wire search for a specific artist / group. */
export async function searchWire(artist: string): Promise<WireArticle[]> {
  const safe = artist.replace(/[^\p{L}\p{N} ()\-]/gu, "").trim();
  if (safe.length < 2) return [];
  const q = `"${safe}" (kpop OR "k-pop" OR korean OR idol OR comeback OR concert)`;
  const data = await get(endpoint(q, 20));
  return clean(data);
}

function clean(data: any): WireArticle[] {
  const arts = data?.articles;
  if (!Array.isArray(arts)) return [];
  const seen = new Set<string>();
  return arts
    .filter(
      (a: any) =>
        a?.title && a?.url && (a.language === "English" || !a.language)
    )
    .filter((a: any) => {
      if (seen.has(a.url)) return false;
      seen.add(a.url);
      return true;
    })
    .map((a: any) => ({
      title: String(a.title),
      url: String(a.url),
      domain: String(a.domain || "news wire"),
      seendate: String(a.seendate || ""),
      language: String(a.language || "English"),
    }));
}
