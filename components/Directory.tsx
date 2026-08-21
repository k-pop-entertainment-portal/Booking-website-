import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RotateCw,
  X,
  Building2,
  Layers3,
  BadgeInfo,
  Eye,
  Users,
  ScanEye,
  RefreshCw,
} from "lucide-react";
import { matrix, CATEGORIES, TOTAL, type Company, type Cat } from "../data/matrix";
import { useMemberPhoto } from "../hooks/useMemberPhoto";
import { neutralPhotoFor } from "../utils/memberPhotos";

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

/* ---------- mirrored group-card preview (same design as a group card) ---------- */
function MirrorTile({ name, hue }: { name: string; hue: string }) {
  const photo = useMemberPhoto(name);
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0d1020]">
      <img
        src={failed ? neutralPhotoFor(name) : photo.src}
        alt={`${name} members`}
        loading="lazy"
        draggable={false}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover object-top transition-transform duration-[1200ms] ${
          photo.loading ? "blur-sm opacity-75" : ""
        }`}
      />
      {/* same cinematic grade the group cards use */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070a16] via-[#070a16]/20 to-transparent" />
      <div
        className="absolute inset-0 opacity-55 mix-blend-overlay"
        style={{ background: `linear-gradient(150deg, ${hue}55, transparent 55%)` }}
      />
    </div>
  );
}

/* ---------- clear group card inside the reveal modal ---------- */
function RevealedGroupCard({
  name,
  members,
  hue,
}: {
  name: string;
  members: string;
  hue: string;
}) {
  const photo = useMemberPhoto(name);
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-2xl border border-line bg-panel"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={failed ? neutralPhotoFor(name) : photo.src}
          alt={`${name} members`}
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover object-top transition-all duration-700 group-hover:scale-105 ${
            photo.loading ? "blur-sm opacity-70" : ""
          }`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
        {photo.loading && (
          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
            <RefreshCw className="h-2.5 w-2.5 animate-spin" /> Loading
          </span>
        )}
        <p className="pointer-events-none absolute bottom-2 left-3 right-3 truncate font-display text-base font-800 text-white drop-shadow-lg">
          {name}
        </p>
        <span
          className="pointer-events-none absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-md"
          style={{ backgroundColor: `${hue}55` }}
        >
          {photo.isReal ? "Members" : "Event"}
        </span>
      </div>
      <div className="p-3.5">
        <p className="text-xs leading-relaxed text-white/60">{members}</p>
      </div>
    </motion.div>
  );
}

/* ---------- reveal modal ---------- */
function CompanyModal({ company, onClose }: { company: Company; onClose: () => void }) {
  const hue = catHue[company.cat];
  const groups = company.groups ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[86vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-line bg-ink p-6 shadow-2xl shadow-black/70 md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ color: hue }}
            >
              {company.cat}
            </p>
            <h3 className="mt-1.5 font-display text-2xl font-800 text-white">{company.name}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">{company.desc}</p>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-panel text-white/70 transition-colors hover:border-neon-pink/60 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {company.note && (
          <p className="mt-4 rounded-2xl border border-line bg-panel p-4 text-sm leading-relaxed text-white/50">
            {company.note}
          </p>
        )}

        {groups.length > 0 && (
          <>
            <p className="mt-7 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-white/45">
              <Users className="h-3.5 w-3.5" style={{ color: hue }} />
              {groups.length} group{groups.length === 1 ? "" : "s"} / artist
              {groups.length === 1 ? "" : "s"} — now revealed
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((g) => (
                <RevealedGroupCard key={g.n} name={g.n} members={g.m} hue={hue} />
              ))}
            </div>
            <p className="mt-5 text-center text-[11px] text-white/30">
              Find any of these artists in the “Groups &amp; Artists” section below to flip their
              card and read their live news.
            </p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ---------- company flip card (mirrors group cards, obscured) ---------- */
function FlipCard({ company, onOpen }: { company: Company; onOpen: () => void }) {
  const [flipped, setFlipped] = useState(false);
  const hue = catHue[company.cat];
  const groups = company.groups ?? [];
  const count = groups.length;
  const kindLabel =
    company.kind === "corp"
      ? "Corporate / division"
      : company.kind === "solo"
        ? "Solo artist"
        : `${count} group${count === 1 ? "" : "s"}/artist${count === 1 ? "" : "s"}`;

  // the company card mirrors its group cards, cycling through them
  const mirrorPool = count > 0 ? groups.slice(0, 6).map((g) => g.n) : [company.name];
  const [mirrorIdx, setMirrorIdx] = useState(0);
  const mirrorName = mirrorPool[mirrorIdx % mirrorPool.length];

  useEffect(() => {
    if (mirrorPool.length < 2 || flipped) return;
    const id = setInterval(
      () => setMirrorIdx((i) => (i + 1) % mirrorPool.length),
      4200 + (company.name.length % 5) * 260 // stagger cards so they don't flip in unison
    );
    return () => clearInterval(id);
  }, [mirrorPool.length, flipped, company.name]);

  return (
    <div
      className={`flip-card h-[22rem] cursor-pointer select-none ${flipped ? "is-flipped" : ""}`}
      onClick={() => setFlipped((f) => !f)}
    >
      <div className="flip-card-inner">
        {/* FRONT — mirrors the group flip cards (photo design fully visible) */}
        <div className="flip-face overflow-hidden rounded-2xl border border-line shadow-[0_24px_60px_-24px_rgba(0,0,0,0.75)]">
          {/* rotating mirror of this company's group cards */}
          <div className="absolute inset-0">
            <AnimatePresence mode="sync">
              <motion.div
                key={mirrorName}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <MirrorTile name={mirrorName} hue={hue} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* readability veil (light — photos stay visible) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(120% 90% at 50% 0%, ${hue}22, transparent 55%), linear-gradient(to top, #070a16 10%, rgba(7,10,22,0.15) 55%, transparent 80%)`,
            }}
          />

          {/* top chips */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
            <span
              className="rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md"
              style={{ borderColor: `${hue}77`, backgroundColor: `${hue}44` }}
            >
              {company.cat}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
              <RotateCw className="h-2.5 w-2.5" /> Flip
            </span>
          </div>

          {/* which group card is being mirrored */}
          {count > 0 && (
            <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2 px-4">
              <span className="flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                <Users className="h-3 w-3" style={{ color: hue }} />
                {mirrorName}
              </span>
              {count > 1 && (
                <span className="flex gap-1">
                  {groups.slice(0, 6).map((g, i) => (
                    <span
                      key={g.n}
                      className="h-1 rounded-full transition-all duration-500"
                      style={{
                        width: i === mirrorIdx % Math.min(count, 6) ? 14 : 5,
                        background:
                          i === mirrorIdx % Math.min(count, 6) ? hue : "rgba(255,255,255,.35)",
                      }}
                    />
                  ))}
                </span>
              )}
            </div>
          )}

          {/* bottom info + reveal */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-display text-[15px] font-800 leading-snug text-white drop-shadow-lg">
              {company.name}
            </h3>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/70">
                <Layers3 className="h-3 w-3" style={{ color: hue }} />
                {kindLabel}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold text-white transition-transform duration-300 hover:scale-105"
                style={{ background: `linear-gradient(120deg, ${hue}, ${hue}99)` }}
              >
                <ScanEye className="h-3 w-3" />
                {count > 0 ? "View all" : "Profile"}
              </button>
            </div>
            <div
              className="mt-2.5 h-[3px] w-14 rounded-full"
              style={{ background: `linear-gradient(90deg, ${hue}, transparent)` }}
            />
          </div>
        </div>

        {/* BACK — roster details */}
        <div className="flip-back flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#181431]/95 to-[#0f1220]/95 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]">
          <div className="border-b border-white/8 px-4 py-3">
            <h4 className="font-display text-sm font-800 leading-tight text-white">
              {company.name}
            </h4>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: hue }}>
              {kindLabel}
            </p>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-3 text-[11px] leading-relaxed">
            {company.note ? (
              <p className="text-white/55">{company.note}</p>
            ) : (
              groups.map((g) => (
                <p key={g.n} className="text-white/55">
                  <strong className="font-semibold text-white">{g.n}</strong>: {g.m}
                </p>
              ))
            )}
          </div>

          <div className="p-4 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition-all duration-300 hover:brightness-125"
              style={{
                background: `linear-gradient(120deg, ${hue}, ${hue}a8)`,
                boxShadow: `0 8px 24px -8px ${hue}80`,
              }}
            >
              <Eye className="h-3.5 w-3.5" />
              {count > 0
                ? `Reveal ${count} group card${count === 1 ? "" : "s"} (photos)`
                : "Open label profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Directory panel ---------- */
export default function Directory() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [active, setActive] = useState<Company | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return matrix.filter((c) => {
      if (cat !== "All" && c.cat !== cat) return false;
      if (!q) return true;
      if (c.name.toLowerCase().includes(q)) return true;
      return (c.groups ?? []).some(
        (g) => g.n.toLowerCase().includes(q) || g.m.toLowerCase().includes(q)
      );
    });
  }, [query, cat]);

  return (
    <motion.section
      id="directory"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl border border-line bg-gradient-to-b from-[#141829]/90 to-[#0f1220]/90 p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] md:p-6"
    >
      {/* Title row */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-800 tracking-tight text-white">
            <Building2 className="h-5 w-5 text-neon-violet" />
            Matrix Directory Database
          </h2>
          <p className="mt-1 text-xs text-muted">
            Each company card mirrors its group cards — flip it, or tap “View all” to see every
            group photo + members
          </p>
        </div>
        <span className="whitespace-nowrap rounded-xl border border-neon-violet/50 bg-gradient-to-br from-neon-violet/35 to-neon-pink/30 px-3 py-1.5 text-xs font-800 text-[#f3e8ff]">
          {filtered.length} / {TOTAL}
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-3.5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies, groups or members…"
          className="w-full rounded-xl border border-line bg-panel py-3 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-neon-violet focus:shadow-[0_0_0_3px_rgba(168,85,247,0.18)]"
        />
      </div>

      {/* Category filter chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const isActive = cat === c;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "border-transparent bg-gradient-to-br from-neon-violet to-neon-pink text-white shadow-lg shadow-neon-violet/25"
                  : "border-line bg-panel text-[#cfd3f2] hover:-translate-y-px hover:border-neon-violet hover:text-white"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line py-16 text-center">
          <BadgeInfo className="h-8 w-8 text-white/25" />
          <p className="text-sm text-white/45">
            No registry entries match “{query}”. Try another search or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <FlipCard key={c.name} company={c} onOpen={() => setActive(c)} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {active && <CompanyModal company={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </motion.section>
  );
}
