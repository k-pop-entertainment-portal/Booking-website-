/* ------------------------------------------------------------------
   Real member-photo resolver.
   Fetches the lead photograph of each group's actual members from
   Wikipedia / Wikimedia Commons (free-licensed press, award-show and
   stage photography). Results are cached in localStorage so the
   portal loads instantly on repeat visits.

   If a group genuinely has no available photo, the card falls back to
   a neutral K-pop event/stage photograph that shows NO artists.
------------------------------------------------------------------- */

import { wikiTitleFor } from "../data/wikiTitles";

const CACHE_KEY = "kwave.memberphotos.v1";
const CACHE_TTL = 1000 * 60 * 60 * 24 * 14; // 14 days

type CacheShape = Record<string, { url: string | null; at: number }>;

let memory: CacheShape = {};
try {
  const raw = localStorage.getItem(CACHE_KEY);
  if (raw) memory = JSON.parse(raw) as CacheShape;
} catch {
  memory = {};
}

let flushTimer: number | undefined;
function persist() {
  clearTimeout(flushTimer);
  flushTimer = window.setTimeout(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(memory));
    } catch {
      /* storage full — memory cache still works */
    }
  }, 400);
}

function fresh(name: string): { url: string | null } | undefined {
  const hit = memory[name];
  if (!hit) return undefined;
  if (Date.now() - hit.at > CACHE_TTL) return undefined;
  return hit;
}

function remember(name: string, url: string | null) {
  memory[name] = { url, at: Date.now() };
  persist();
}

/* ---------- neutral fallbacks (no artists shown) ---------- */
const PX = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`;

export const NEUTRAL_EVENT_PHOTOS: string[] = [
  PX(761543),    // stadium crowd at night
  PX(19150288),  // audience holding lights
  PX(2019327),   // defocused auditorium lights
  PX(3025096),   // arena concert crowd
  PX(22555264),  // packed indoor concert lights
  PX(10063270),  // crowd of glowing phones
  PX(12092991),  // stage spotlights + smoke
  PX(2020432),   // colored spotlights & fog
  PX(13312280),  // stage spotlight rig
  PX(7271793),   // strobe lights
  PX(19834033),  // concert lighting
  PX(38780313),  // night concert lights
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Stable neutral event photo (no artists) for a given name. */
export function neutralPhotoFor(name: string): string {
  return NEUTRAL_EVENT_PHOTOS[hash(name) % NEUTRAL_EVENT_PHOTOS.length];
}

/* ---------- Wikipedia batch lookup ---------- */
const API = "https://en.wikipedia.org/w/api.php";

async function jsonp(url: string, timeout = 10000): Promise<any> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

/** Resolve up to 50 titles in one request. Returns map: requested name -> url|null */
async function batchLookup(names: string[]): Promise<Map<string, string | null>> {
  const out = new Map<string, string | null>();
  if (names.length === 0) return out;

  // requested wiki title per registry name
  const titleOf = new Map<string, string>();
  names.forEach((n) => titleOf.set(n, wikiTitleFor(n)));

  const titles = [...new Set([...titleOf.values()])];
  const url =
    `${API}?action=query&format=json&origin=*&redirects=1` +
    `&prop=pageimages&piprop=thumbnail&pithumbsize=900&pilicense=any` +
    `&titles=${encodeURIComponent(titles.join("|"))}`;

  let data: any;
  try {
    data = await jsonp(url);
  } catch {
    names.forEach((n) => out.set(n, null));
    return out;
  }

  const q = data?.query ?? {};
  // normalise chains: requested -> normalized -> redirected -> final page title
  const alias = new Map<string, string>();
  (q.normalized ?? []).forEach((n: any) => alias.set(n.from, n.to));
  (q.redirects ?? []).forEach((r: any) => alias.set(r.from, r.to));

  const thumbByTitle = new Map<string, string>();
  Object.values(q.pages ?? {}).forEach((p: any) => {
    if (p?.title && p?.thumbnail?.source) {
      thumbByTitle.set(p.title, p.thumbnail.source as string);
    }
  });

  const resolve = (t: string): string => {
    let cur = t;
    for (let i = 0; i < 4; i++) {
      const nxt = alias.get(cur);
      if (!nxt) break;
      cur = nxt;
    }
    return cur;
  };

  names.forEach((n) => {
    const finalTitle = resolve(titleOf.get(n)!);
    out.set(n, thumbByTitle.get(finalTitle) ?? null);
  });

  return out;
}

/** Last-chance search when the direct title had no image. */
async function searchLookup(name: string): Promise<string | null> {
  const url =
    `${API}?action=query&format=json&origin=*&generator=search` +
    `&gsrsearch=${encodeURIComponent(`${name} South Korean group`)}&gsrlimit=1` +
    `&prop=pageimages&piprop=thumbnail&pithumbsize=900&pilicense=any`;
  try {
    const data = await jsonp(url, 8000);
    const pages = Object.values(data?.query?.pages ?? {}) as any[];
    const withImg = pages.find((p) => p?.thumbnail?.source);
    return withImg?.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

/* ---------- public API ---------- */

type Listener = (name: string, url: string | null) => void;
const listeners = new Set<Listener>();
const pending = new Set<string>();
let queue: string[] = [];
let scheduled = false;

export function subscribePhotos(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit(name: string, url: string | null) {
  listeners.forEach((fn) => fn(name, url));
}

async function drain() {
  scheduled = false;
  const batch = queue.slice(0, 45);
  queue = queue.slice(45);

  const found = await batchLookup(batch);

  // direct hits
  const misses: string[] = [];
  batch.forEach((n) => {
    const url = found.get(n) ?? null;
    if (url) {
      remember(n, url);
      pending.delete(n);
      emit(n, url);
    } else {
      misses.push(n);
    }
  });

  // limited-concurrency search fallback for misses
  const CONC = 4;
  for (let i = 0; i < misses.length; i += CONC) {
    const slice = misses.slice(i, i + CONC);
    await Promise.all(
      slice.map(async (n) => {
        const url = await searchLookup(n);
        remember(n, url);
        pending.delete(n);
        emit(n, url);
      })
    );
  }

  if (queue.length > 0) schedule();
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  setTimeout(drain, 120);
}

/**
 * Get a group's real member photo.
 * Returns the cached URL immediately when known; otherwise queues a
 * lookup and notifies subscribers when it resolves.
 */
export function getMemberPhoto(name: string): string | null | undefined {
  const hit = fresh(name);
  if (hit) return hit.url; // string (photo) or null (none available)
  if (!pending.has(name)) {
    pending.add(name);
    queue.push(name);
    schedule();
  }
  return undefined; // still loading
}
