import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Search, Check, ChevronDown, RotateCcw, X } from "lucide-react";
import { LANGUAGES, POPULAR, DEFAULT_LANG, type Lang } from "../data/languages";

const STORE_KEY = "kwave.lang";

/** Read the language currently applied by Google Translate. */
function currentFromCookie(): string {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  if (!m) return DEFAULT_LANG;
  const parts = decodeURIComponent(m[1]).split("/");
  const to = parts[2];
  return to && to.length > 0 ? to : DEFAULT_LANG;
}

/** Clear the Google Translate cookie on every host variant. */
function clearGoogTrans() {
  const host = window.location.hostname;
  const domains = [
    "",
    host,
    `.${host}`,
    `.${host.split(".").slice(-2).join(".")}`,
  ];
  const paths = ["/", window.location.pathname];
  for (const d of domains) {
    for (const p of paths) {
      document.cookie =
        `googtrans=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=${p}` +
        (d ? `;domain=${d}` : "");
    }
  }
}

/** Find Google's hidden <select> and apply a language. */
function applyLanguage(code: string): boolean {
  const select = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
  if (!select) return false;
  select.value = code;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

export default function LanguagePicker() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>(DEFAULT_LANG);
  const [ready, setReady] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* Detect the widget and restore any previously chosen language */
  useEffect(() => {
    let tries = 0;
    const id = setInterval(() => {
      const select = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
      if (select) {
        setReady(true);
        const cookieLang = currentFromCookie();
        const saved = localStorage.getItem(STORE_KEY) ?? DEFAULT_LANG;
        const wanted = cookieLang !== DEFAULT_LANG ? cookieLang : saved;
        setActive(wanted);
        if (wanted !== DEFAULT_LANG && select.value !== wanted) applyLanguage(wanted);
        clearInterval(id);
      }
      if (++tries > 100) clearInterval(id); // ~20s
    }, 200);
    return () => clearInterval(id);
  }, []);

  /* Close on outside click / Escape */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    setTimeout(() => searchRef.current?.focus(), 60);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (code: string) => {
    setActive(code);
    localStorage.setItem(STORE_KEY, code);
    setOpen(false);
    setQuery("");

    if (code === DEFAULT_LANG) {
      // Back to the portal's default language — English
      applyLanguage(DEFAULT_LANG);
      clearGoogTrans();
      setTimeout(() => window.location.reload(), 120);
      return;
    }
    if (!applyLanguage(code)) {
      // widget not ready yet — retry briefly
      let n = 0;
      const id = setInterval(() => {
        if (applyLanguage(code) || ++n > 40) clearInterval(id);
      }, 200);
    }
  };

  const activeLang: Lang =
    LANGUAGES.find((l) => l.code === active) ?? LANGUAGES[0];

  const { popular, rest } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (l: Lang) =>
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.native.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q);

    const all = LANGUAGES.filter(match);
    if (q) return { popular: [] as Lang[], rest: all };
    return {
      popular: POPULAR.map((c) => LANGUAGES.find((l) => l.code === c)!).filter(Boolean),
      rest: all,
    };
  }, [query]);

  const Row = ({ l }: { l: Lang }) => (
    <button
      onClick={() => choose(l.code)}
      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
        active === l.code
          ? "bg-gradient-to-r from-neon-violet/25 to-neon-pink/20 text-white"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-semibold">{l.name}</span>
        <span className="block truncate text-[11px] text-white/40">{l.native}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {l.code === DEFAULT_LANG && (
          <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-emerald-400">
            Default
          </span>
        )}
        {active === l.code && <Check className="h-4 w-4 text-neon-cyan" />}
      </span>
    </button>
  );

  return (
    <div ref={boxRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="notranslate flex items-center gap-2 rounded-xl border border-line bg-panel px-3 py-2 transition-colors hover:border-neon-violet"
        translate="no"
        aria-label="Choose language"
      >
        <Globe className="h-4 w-4 shrink-0 text-neon-violet" />
        <span className="flex flex-col items-start leading-none">
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted">
            Translate
          </span>
          <span className="mt-0.5 text-xs font-semibold text-white">{activeLang.name}</span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-white/40 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="notranslate absolute right-0 top-[calc(100%+10px)] z-[80] w-[19rem] overflow-hidden rounded-2xl border border-line bg-ink shadow-2xl shadow-black/70"
            translate="no"
          >
            {/* search */}
            <div className="border-b border-line p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${LANGUAGES.length} languages…`}
                  className="w-full rounded-lg border border-line bg-panel py-2 pl-9 pr-8 text-[13px] text-white outline-none placeholder:text-white/30 focus:border-neon-violet"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    aria-label="Clear"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {!ready && (
                <p className="mt-2 text-[10px] text-amber-400/80">
                  Loading Google Translate…
                </p>
              )}
            </div>

            {/* list */}
            <div className="max-h-[22rem] overflow-y-auto p-2">
              {popular.length > 0 && (
                <>
                  <p className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">
                    Popular
                  </p>
                  {popular.map((l) => (
                    <Row key={`p-${l.code}`} l={l} />
                  ))}
                  <div className="my-2 h-px bg-line" />
                  <p className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">
                    All languages ({LANGUAGES.length})
                  </p>
                </>
              )}
              {rest.length === 0 ? (
                <p className="px-3 py-6 text-center text-xs text-white/40">
                  No language matches “{query}”.
                </p>
              ) : (
                rest.map((l) => <Row key={l.code} l={l} />)
              )}
            </div>

            {/* reset */}
            {active !== DEFAULT_LANG && (
              <div className="border-t border-line p-2">
                <button
                  onClick={() => choose(DEFAULT_LANG)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-panel py-2 text-xs font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset to English (default)
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
