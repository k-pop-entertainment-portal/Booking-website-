import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  RotateCw,
  Radio,
  Clock3,
  Newspaper,
  ExternalLink,
  RefreshCw,
  Satellite,
  X,
  Music4,
  ImageOff,
} from "lucide-react";
import { groups, GROUP_TOTAL, type GroupEntry } from "../data/groups";
import { registryNews } from "../data/news";
import { searchWire, type WireArticle } from "../utils/liveWire";
import { useMemberPhoto } from "../hooks/useMemberPhoto";
import { neutralPhotoFor } from "../utils/memberPhotos";
import type { Cat } from "../data/matrix";

const catHue: Record<Cat, string> = {
  "Big 4 Ecosystem": "#a855f7",
  "Conglomerate Subsidiary": "#22d3ee",
  "Independent Label": "#f472b6",
  "Boutique Independent": "#34d399",
  Units: "#fbbf24",
  "Extended Registry & Legacy": "#94a3b8",
  "Soloists & Independent Artists": "#fb7185",
  "Actor & Model Agencies": "#818cf8",
};

interface GNews {
  key: string;
  title: string;
  source: string;
  cat: string;
  bornAt: number;
  url?: string;
  body?: string;
}

function ago(bornAt: number, now: number) {
  const m = Math.max(0, (now - bornAt) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${Math.floor(m)}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function parseSeen(s: string): number {
  const m = s.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);
  if (!m) return Date.now();
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
}

/* ---------- per-group live news hook ---------- */
function useGroupNews(group: GroupEntry, enabled: boolean) {
  const [wire, setWire] = useState<WireArticle[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const fetched = useRef(false);

  /* local registry stories that mention this group or its members */
  const local = useMemo<GNews[]>(() => {
    const out: GNews[] = [];
    for (const n of registryNews) {
      const hay = `${n.title} ${n.body} ${n.tags.join(" ")}`.toLowerCase();
      const hit = group.keys.some((k) => k.length > 2 && hay.includes(k));
      if (hit) {
        out.push({
          key: `r-${n.id}`,
          title: n.title,
          source: n.source,
          cat: n.cat,
          body: n.body,
          bornAt: Date.now() - n.minutes * 60000,
        });
      }
    }
    return out;
  }, [group]);

  /* live wire search — fires when the card is flipped open, refreshes every 5 min */
  useEffect(() => {
    if (!enabled) return;
    let dead = false;

    const run = async () => {
      setBusy(true);
      try {
        const arts = await searchWire(group.name);
        if (!dead) setWire(arts);
      } catch {
        if (!dead) setWire([]);
      } finally {
        if (!dead) setBusy(false);
      }
    };

    if (!fetched.current) {
      fetched.current = true;
      run();
    }
    const id = setInterval(run, 300000);
    return () => {
      dead = true;
      clearInterval(id);
    };
  }, [enabled, group.name]);

  /* keep relative times ticking + auto-refresh view every 60s */
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, [enabled]);

  const items = useMemo<GNews[]>(() => {
    const w: GNews[] = (wire ?? []).slice(0, 6).map((a) => ({
      key: `w-${a.url}`,
      title: a.title.replace(/\s+/g, " ").trim(),
      source: a.domain,
      cat: "Wire",
      bornAt: parseSeen(a.seendate),
      url: a.url,
    }));
    return [...w, ...local].sort((a, b) => b.bornAt - a.bornAt).slice(0, 8);
  }, [wire, local]);

  return { items, busy, now, hasLocal: local.length > 0 };
}

/* ---------- group flip card ---------- */
function GroupCard({ group, index }: { group: GroupEntry; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const hue = catHue[group.cat];
  const { items, busy, now, hasLocal } = useGroupNews(group, flipped);
  const photo = useMemberPhoto(group.name);

  const memberCount = group.members
    .replace(/\(.*?\)/g, "")
    .split(",")
    .filter((s) => s.trim().length > 1).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={`flip-card tap-only h-[23rem] cursor-pointer select-none ${flipped ? "is-flipped" : ""}`}
      onClick={() => setFlipped((f) => !f)}
    >
      <div className="flip-card-inner">
        {/* FRONT — real photo */}
        <div className="flip-face overflow-hidden rounded-2xl border border-line shadow-[0_24px_60px_-24px_rgba(0,0,0,0.75)]">
          <img
            key={imgFailed ? "fb" : photo.src}
            src={imgFailed ? neutralPhotoFor(group.name) : photo.src}
            alt={`${group.name} members`}
            loading="lazy"
            draggable={false}
            onError={() => setImgFailed(true)}
            className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-[900ms] hover:scale-105 ${
              photo.loading ? "scale-105 blur-sm opacity-70" : ""
            }`}
          />
          {/* cinematic grade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070a16] via-[#070a16]/25 to-transparent" />
          <div
            className="absolute inset-0 mix-blend-overlay opacity-60"
            style={{ background: `linear-gradient(150deg, ${hue}55, transparent 55%)` }}
          />
          {photo.loading && (
            <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
              <RefreshCw className="h-3 w-3 animate-spin" /> Loading photo
            </span>
          )}

          {/* top chips */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
            <span
              className="rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md"
              style={{ borderColor: `${hue}77`, backgroundColor: `${hue}38` }}
            >
              {group.company}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
              <RotateCw className="h-2.5 w-2.5" /> News
            </span>
          </div>

          {/* bottom info */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-display text-xl font-800 leading-tight text-white drop-shadow-lg">
              {group.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-white/70">
              {group.members}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/60">
                <Users className="h-3 w-3" style={{ color: hue }} />
                {memberCount > 1 ? `${memberCount} members` : "Solo / unit"}
              </span>
              <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
                style={{ background: `linear-gradient(120deg, ${hue}, ${hue}99)` }}>
                <Radio className="h-3 w-3" /> Tap for live news
              </span>
            </div>
            <div className="mt-3 h-[3px] w-14 rounded-full" style={{ background: `linear-gradient(90deg, ${hue}, transparent)` }} />
          </div>
        </div>

        {/* BACK — live news feed */}
        <div className="flip-back flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-b from-[#181431]/97 to-[#0d1020]/97 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.75)]">
          <div className="flex items-center justify-between gap-2 border-b border-white/8 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-800 text-white">{group.name}</p>
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: hue }}>
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full" style={{ background: hue }} />
                Live news feed
              </p>
            </div>
            {busy ? (
              <RefreshCw className="h-3.5 w-3.5 shrink-0 animate-spin text-sky-400" />
            ) : (
              <Satellite className="h-3.5 w-3.5 shrink-0 text-sky-400" />
            )}
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3.5 py-3">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center">
                {busy ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin text-white/30" />
                    <p className="text-[11px] text-white/45">Searching the live wire for {group.name}…</p>
                  </>
                ) : (
                  <>
                    <Music4 className="h-5 w-5 text-white/25" />
                    <p className="text-[11px] leading-relaxed text-white/45">
                      No breaking stories for {group.name} at this moment. The feed refreshes
                      automatically — check back shortly.
                    </p>
                  </>
                )}
              </div>
            ) : (
              items.map((n) => (
                <a
                  key={n.key}
                  href={n.url}
                  target={n.url ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!n.url) e.preventDefault();
                  }}
                  className="block rounded-xl border border-white/8 bg-black/25 p-2.5 transition-colors hover:border-neon-violet/50 hover:bg-black/40"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest ${
                        n.cat === "Wire"
                          ? "bg-sky-400/15 text-sky-400"
                          : "bg-neon-pink/15 text-neon-pink"
                      }`}
                    >
                      {n.cat}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] text-white/40">
                      <Clock3 className="h-2.5 w-2.5" /> {ago(n.bornAt, now)}
                    </span>
                    {n.url && <ExternalLink className="ml-auto h-3 w-3 text-white/30" />}
                  </div>
                  <p className="mt-1.5 line-clamp-3 text-[11px] font-semibold leading-snug text-white/85">
                    {n.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[9px] text-white/35">
                    <Newspaper className="h-2.5 w-2.5" /> {n.source}
                  </p>
                </a>
              ))
            )}
          </div>

          <div className="border-t border-white/8 px-4 py-2.5 text-center">
            <p className="text-[9px] uppercase tracking-widest text-white/30">
              {hasLocal ? "Portal registry + live wire" : "Live worldwide news wire"} · auto-updating
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- section ---------- */
const PAGE = 24;

export default function Groups() {
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return groups;
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(s) ||
        g.members.toLowerCase().includes(s) ||
        g.company.toLowerCase().includes(s)
    );
  }, [q]);

  const shown = filtered.slice(0, limit);

  return (
    <section id="groups" className="relative py-16 md:py-20">
      <div className="pointer-events-none absolute left-[-8rem] top-32 -z-10 h-80 w-80 rounded-full bg-neon-violet/12 blur-[90px]" />
      <div className="mx-auto max-w-[1440px] px-4">
        {/* heading */}
        <div className="mb-7 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-neon-cyan">
              Artist Registry
            </p>
            <h2 className="mt-3 font-display text-3xl font-800 leading-tight text-white md:text-5xl">
              GROUPS &amp;{" "}
              <span className="bg-gradient-to-r from-[#c084fc] via-neon-pink to-neon-cyan bg-clip-text text-transparent">
                ARTISTS
              </span>
            </h2>
            <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-muted">
              Every group card shows their photo — tap any card to flip it and read that
              artist's live news, updated automatically from worldwide K-pop channels.
            </p>
          </div>
          <span className="rounded-xl border border-neon-violet/50 bg-gradient-to-br from-neon-violet/35 to-neon-pink/30 px-3.5 py-1.5 text-xs font-800 text-[#f3e8ff]">
            {filtered.length} / {GROUP_TOTAL} artists
          </span>
        </div>

        {/* search */}
        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setLimit(PAGE);
            }}
            placeholder="Find a group, member or company — e.g. “BTS”, “Wonyoung”, “HYBE”…"
            className="w-full rounded-2xl border border-line bg-ink py-3.5 pl-11 pr-11 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-neon-violet focus:shadow-[0_0_0_3px_rgba(168,85,247,0.18)]"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-panel text-white/60 transition-colors hover:border-neon-pink/50 hover:text-white"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* grid */}
        {shown.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line py-16 text-center">
            <ImageOff className="h-8 w-8 text-white/25" />
            <p className="text-sm text-white/45">No artists match “{q}”.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shown.map((g, i) => (
                <GroupCard key={`${g.company}-${g.name}`} group={g} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}

        {limit < filtered.length && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setLimit((l) => l + PAGE)}
              className="rounded-full border border-line bg-ink px-8 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:border-neon-violet hover:shadow-lg hover:shadow-neon-violet/20"
            >
              Load more artists — {filtered.length - limit} remaining
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
