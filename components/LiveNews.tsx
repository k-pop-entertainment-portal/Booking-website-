import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock3,
  TrendingUp,
  Newspaper,
  Search,
  X,
  Radio,
  RefreshCw,
  Satellite,
  BookOpen,
  Tag,
  ExternalLink,
  FileSearch,
} from "lucide-react";
import { registryNews, type RegistryNews } from "../data/news";
import { fetchTrendingKpop, searchWire, type WireArticle } from "../utils/liveWire";

/* ---------- unified feed item ---------- */
interface FeedItem {
  key: string;
  title: string;
  source: string;
  cat: string;
  tags: string[];
  bornAt: number; // ms epoch — relative time computed live
  body?: string;
  url?: string;
  external?: boolean;
}

const catStyles: Record<string, string> = {
  Breaking: "text-red-400 border-red-400/40 bg-red-400/10",
  Comeback: "text-neon-pink border-neon-pink/40 bg-neon-pink/10",
  Tour: "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10",
  Chart: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  Award: "text-neon-violet border-neon-violet/40 bg-neon-violet/10",
  Collab: "text-fuchsia-400 border-fuchsia-400/40 bg-fuchsia-400/10",
  "Fan Event": "text-amber-400 border-amber-400/40 bg-amber-400/10",
  Wire: "text-sky-400 border-sky-400/40 bg-sky-400/10",
};

function ago(bornAt: number, now: number) {
  const m = Math.max(0, (now - bornAt) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${Math.floor(m)} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} d ago`;
}

function parseSeen(s: string): number {
  // GDELT seendate: "YYYYMMDDTHHmmssZ"
  const m = s.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);
  if (!m) return Date.now();
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
}

function fromRegistry(n: RegistryNews): FeedItem {
  return {
    key: `reg-${n.id}`,
    title: n.title,
    source: n.source,
    cat: n.cat,
    tags: n.tags,
    body: n.body,
    bornAt: Date.now() - n.minutes * 60000,
  };
}

function fromWire(a: WireArticle): FeedItem {
  return {
    key: `wire-${a.url}`,
    title: a.title.replace(/\s+/g, " ").trim(),
    source: a.domain,
    cat: "Wire",
    tags: [],
    bornAt: parseSeen(a.seendate),
    url: a.url,
    external: true,
  };
}

function matches(item: { title: string; tags: string[]; body?: string }, q: string) {
  const hay = `${item.title} ${item.tags.join(" ")} ${item.body ?? ""}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}

/* ---------- article reader modal ---------- */
function Reader({ item, onClose }: { item: FeedItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
      <motion.article
        initial={{ opacity: 0, scale: 0.94, y: 26 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 18 }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-line bg-ink p-7 shadow-2xl shadow-black/70 md:p-9"
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${catStyles[item.cat] ?? catStyles.Wire}`}>
            {item.cat}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <Clock3 className="h-3.5 w-3.5" /> {ago(item.bornAt, Date.now())}
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-neon-violet">
            <Newspaper className="h-3.5 w-3.5" /> {item.source}
          </span>
        </div>

        <h3 className="mt-4 font-display text-xl font-800 leading-snug text-white md:text-2xl">
          {item.title}
        </h3>
        <p className="mt-4 text-sm leading-[1.9] text-white/65 md:text-[15px]">{item.body}</p>

        {item.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {item.tags.slice(0, 6).map((t) => (
              <span key={t} className="flex items-center gap-1.5 rounded-full border border-line bg-panel px-2.5 py-1 text-[11px] font-medium text-white/55">
                <Tag className="h-3 w-3 text-neon-cyan" /> {t}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-7 w-full rounded-xl border border-line bg-panel py-3 text-sm font-bold text-white transition-colors hover:border-neon-violet"
        >
          Close article
        </button>
      </motion.article>
    </motion.div>
  );
}

/* ---------- news card ---------- */
function NewsCard({ item, now, featured, fresh, onRead }: {
  item: FeedItem; now: number; featured?: boolean; fresh?: boolean; onRead: (i: FeedItem) => void;
}) {
  const open = () => {
    if (item.external && item.url) window.open(item.url, "_blank", "noopener,noreferrer");
    else onRead(item);
  };

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={open}
      className={`group relative flex cursor-pointer flex-col rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:border-neon-violet/50 ${
        fresh
          ? "border-neon-pink/50 bg-gradient-to-b from-neon-pink/10 to-[#0f1220]/90 shadow-[0_0_30px_-10px_rgba(244,114,182,0.4)]"
          : "border-line bg-gradient-to-b from-[#141829]/90 to-[#0f1220]/90"
      } ${featured ? "md:col-span-2 md:p-7" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] ${catStyles[item.cat] ?? catStyles.Wire}`}>
          {item.cat}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-muted">
          <Clock3 className="h-3 w-3" /> {ago(item.bornAt, now)}
        </span>
        {fresh && (
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-neon-pink/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-neon-pink">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-neon-pink" /> Breaking
          </span>
        )}
        {item.external && (
          <span className="ml-auto flex items-center gap-1 rounded-full bg-sky-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-sky-400">
            <Satellite className="h-3 w-3" /> Live wire
          </span>
        )}
      </div>

      <h3 className={`mt-3 font-display font-700 leading-snug text-white transition-colors group-hover:text-neon-cyan ${featured ? "text-xl md:text-2xl" : "text-[15px]"}`}>
        {item.title}
      </h3>
      {featured && item.body && (
        <p className="mt-2.5 text-sm leading-relaxed text-white/55">{item.body}</p>
      )}

      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/40">
          <Newspaper className="h-3.5 w-3.5 text-neon-violet" /> {item.source}
        </span>
        <span className="flex items-center gap-1 text-[11px] font-bold text-white/30 transition-colors group-hover:text-neon-cyan">
          {item.external ? "Read on source" : "Read more"}
          {item.external ? <ExternalLink className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
        </span>
      </div>
    </motion.article>
  );
}

/* ---------- section ---------- */
export default function LiveNews() {
  const [now, setNow] = useState(() => Date.now());
  const [feed, setFeed] = useState<FeedItem[]>(() => registryNews.slice(0, 9).map(fromRegistry));
  const [wireOn, setWireOn] = useState<"connecting" | "live" | "registry">("connecting");
  const [reading, setReading] = useState<FeedItem | null>(null);

  const [q, setQ] = useState("");
  const [wireResults, setWireResults] = useState<WireArticle[] | null>(null);
  const [wireBusy, setWireBusy] = useState(false);

  const cursor = useRef(9); // next registry story to auto-inject
  const searchSeq = useRef(0);

  /* ticking clock for relative times */
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  /* auto-update: a fresh registry story lands every 60s */
  useEffect(() => {
    const id = setInterval(() => {
      setFeed((f) => {
        const next = registryNews[cursor.current % registryNews.length];
        cursor.current += 1;
        const item = { ...fromRegistry(next), bornAt: Date.now() };
        return [item, ...f].slice(0, 12);
      });
      setNow(Date.now());
    }, 60000);
    return () => clearInterval(id);
  }, []);

  /* live wire: inject real trending k-pop articles */
  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const arts = await fetchTrendingKpop();
        if (dead || arts.length === 0) throw new Error("empty");
        setFeed((f) => {
          const existing = new Set(f.map((i) => i.key));
          const items = arts.slice(0, 6).map(fromWire).filter((i) => !existing.has(i.key));
          return [...items, ...f]
            .sort((a, b) => b.bornAt - a.bornAt)
            .slice(0, 14);
        });
        setWireOn("live");
      } catch {
        if (!dead) setWireOn("registry");
      }
    })();
    return () => { dead = true; };
  }, []);

  /* wire search (debounced, latest-wins) */
  useEffect(() => {
    if (q.trim().length < 3) {
      setWireResults(null);
      setWireBusy(false);
      return;
    }
    setWireBusy(true);
    const seq = ++searchSeq.current;
    const id = setTimeout(async () => {
      try {
        const arts = await searchWire(q.trim());
        if (searchSeq.current === seq) setWireResults(arts);
      } catch {
        if (searchSeq.current === seq) setWireResults([]);
      } finally {
        if (searchSeq.current === seq) setWireBusy(false);
      }
    }, 900);
    return () => clearTimeout(id);
  }, [q]);

  const searching = q.trim().length > 0;

  const localResults = useMemo(() => {
    if (!searching) return [];
    const poolMap = new Map<string, FeedItem>();
    [...feed, ...registryNews.map(fromRegistry)].forEach((i) => poolMap.set(i.key, i));
    return [...poolMap.values()]
      .filter((i) => matches(i, q))
      .sort((a, b) => b.bornAt - a.bornAt)
      .slice(0, 12);
  }, [q, feed, searching]);

  const wireView = useMemo(
    () => (wireResults ?? []).slice(0, 8).map(fromWire),
    [wireResults]
  );

  const hasResults = localResults.length > 0 || wireView.length > 0;
  const wireFullCount = (wireResults ?? []).length;

  return (
    <section id="news" className="relative py-16 md:py-24">
      <div className="pointer-events-none absolute right-[-10rem] top-24 -z-10 h-96 w-96 rounded-full bg-neon-pink/10 blur-[90px]" />
      <div className="mx-auto max-w-[1440px] px-4">
        {/* heading */}
        <div className="mb-8 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-neon-pink">Entertainment Wire</p>
            <h2 className="mt-3 flex flex-wrap items-center gap-3 font-display text-3xl font-800 leading-tight text-white md:text-5xl">
              LIVE <span className="bg-gradient-to-r from-[#c084fc] via-neon-pink to-neon-cyan bg-clip-text text-transparent">NEWS</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-neon-pink/40 bg-neon-pink/10 px-3.5 py-1 font-body text-[11px] font-bold uppercase tracking-[0.25em] text-neon-pink">
                <span className="h-2 w-2 animate-pulse-dot rounded-full bg-neon-pink" />
                On Air
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-2 rounded-full border border-line bg-ink px-3 py-1.5">
              <RefreshCw className="h-3.5 w-3.5 animate-spin-slower text-neon-cyan" />
              Auto-refresh every 60s
            </span>
            <span className="hidden items-center gap-2 rounded-full border border-line bg-ink px-3 py-1.5 sm:flex">
              <Radio className={`h-3.5 w-3.5 ${wireOn === "live" ? "text-emerald-400" : "text-amber-400"}`} />
              {wireOn === "live" ? "Live wire connected" : wireOn === "connecting" ? "Connecting wire…" : "Registry wire mode"}
            </span>
          </div>
        </div>

        {/* news search bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-white/35" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search news about your favorite artist — try “Jungkook”, “IVE”, “aespa”, “G-DRAGON”…"
              className="w-full rounded-2xl border border-line bg-ink py-4 pl-12 pr-12 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-neon-violet focus:shadow-[0_0_0_3px_rgba(168,85,247,0.18)]"
            />
            {searching && (
              <button
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-panel text-white/60 transition-colors hover:border-neon-pink/50 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-2 flex items-center gap-1.5 pl-1 text-[11px] text-white/35">
            <Satellite className="h-3 w-3 text-sky-400" />
            Searches the portal registry plus the live worldwide K-pop news wire in real time.
          </p>
        </div>

        {/* content */}
        {searching ? (
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-semibold text-white">
                Results for “<span className="text-neon-cyan">{q.trim()}</span>”
              </span>
              <span className="rounded-full border border-line bg-ink px-2.5 py-0.5 text-xs text-muted">
                {localResults.length + wireView.length} story{localResults.length + wireView.length === 1 ? "" : "ies"}
                {wireFullCount > 8 ? ` · ${wireFullCount} on the wire` : ""}
              </span>
              {wireBusy && (
                <span className="flex items-center gap-1.5 text-xs text-sky-400">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> checking live wire…
                </span>
              )}
            </div>

            {!hasResults && !wireBusy ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line py-16 text-center">
                <FileSearch className="h-8 w-8 text-white/25" />
                <p className="max-w-sm text-sm leading-relaxed text-white/45">
                  No news found for “{q.trim()}” right now. Check the artist name's spelling, or try
                  their group (e.g. search “BLACKPINK” instead of a solo stage name).
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {localResults.map((i, idx) => (
                  <NewsCard key={i.key} item={i} now={now} featured={idx === 0} onRead={setReading} />
                ))}
                {wireView.map((i) => (
                  <NewsCard key={i.key} item={i} now={now} onRead={setReading} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {feed.map((i, idx) => (
              <NewsCard
                key={i.key}
                item={i}
                now={now}
                featured={idx === 0}
                fresh={idx === 0 && now - i.bornAt < 90000}
                onRead={setReading}
              />
            ))}
          </motion.div>
        )}

        {/* trending tags */}
        {!searching && (
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5 rounded-2xl border border-line bg-ink px-5 py-4">
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-neon-cyan">
              <TrendingUp className="h-4 w-4" /> Trending searches
            </span>
            {["BTS", "BLACKPINK", "Jungkook", "NewJeans", "aespa", "Stray Kids", "IVE", "SEVENTEEN", "G-DRAGON"].map((t) => (
              <button
                key={t}
                onClick={() => setQ(t)}
                className="text-sm font-medium text-white/50 transition-colors hover:text-neon-pink"
              >
                #{t}
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {reading && <Reader item={reading} onClose={() => setReading(null)} />}
      </AnimatePresence>
    </section>
  );
}
