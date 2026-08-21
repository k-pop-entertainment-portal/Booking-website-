import { motion } from "framer-motion";
import { Mail, ShieldCheck, CalendarCheck2 } from "lucide-react";
import LanguagePicker from "./LanguagePicker";

export default function Header() {
  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 border-b border-line bg-[#0a0c18]/75 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-3.5 px-4 py-4 text-center md:flex-row md:justify-between md:text-left">
          {/* Brand */}
          <a href="#top" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-neon-violet to-neon-pink font-display text-xl font-800 text-white shadow-[0_10px_30px_-10px_rgba(168,85,247,0.8)]">
              K
            </span>
            <span>
              <span className="block bg-gradient-to-r from-[#c084fc] via-neon-pink to-neon-cyan bg-clip-text font-display text-xl font-800 tracking-tight text-transparent md:text-2xl">
                K-Pop Wave Entertainment Portal
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                2026 Matrix Network — Official South Korean Entertainment Registry
              </span>
            </span>
          </a>

          {/* Translate — full official Google language catalog, English default */}
          <LanguagePicker />
        </div>
      </motion.header>

      {/* Support strip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-center gap-2.5 px-4 pt-4 md:justify-start"
      >
        <a
          href="mailto:support.kpop.wave.portal897@gmail.com"
          className="flex items-center gap-2 rounded-full border border-line bg-ink px-3.5 py-1.5 text-xs text-[#c7cbdf] transition-colors hover:border-neon-pink/50"
        >
          <Mail className="h-3.5 w-3.5 text-neon-violet" />
          <strong className="font-semibold text-white">support.kpop.wave.portal897@gmail.com</strong>
        </a>
        <span className="flex items-center gap-2 rounded-full border border-line bg-ink px-3.5 py-1.5 text-xs text-[#c7cbdf]">
          <ShieldCheck className="h-3.5 w-3.5 text-neon-cyan" />
          Wire: <strong className="font-semibold text-neon-violet">@k-pop-wave-support-team</strong>
        </span>
        <span className="flex items-center gap-2 rounded-full border border-line bg-ink px-3.5 py-1.5 text-xs text-[#c7cbdf]">
          <CalendarCheck2 className="h-3.5 w-3.5 text-emerald-400" />
          Verified as of <strong className="font-semibold text-white">July 27, 2026</strong>
        </span>
      </motion.div>
    </>
  );
}
