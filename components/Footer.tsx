import { Mail, ShieldCheck, MapPin, Heart, Music4 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-[#0a0c18]/80">
      <div className="mx-auto max-w-[1440px] px-4 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <a href="#top" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-neon-violet to-neon-pink font-display text-lg font-800 text-white shadow-[0_10px_30px_-10px_rgba(168,85,247,0.8)]">
                K
              </span>
              <span>
                <span className="block font-display text-base font-800 text-white">
                  K-Pop Wave Entertainment Portal
                </span>
                <span className="mt-0.5 block text-[11px] text-muted">
                  2026 Matrix Network — Entertainment Industry Management
                </span>
              </span>
            </a>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-white/40">
              The registry reference gateway for South Korean entertainment networks — directory
              cards, group rosters and the official request channel in one place.
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-white/55">
            <a
              href="mailto:support.kpop.wave.portal897@gmail.com"
              className="flex items-center gap-2.5 transition-colors hover:text-neon-pink"
            >
              <Mail className="h-4 w-4 text-neon-violet" />
              support.kpop.wave.portal897@gmail.com
            </a>
            <p className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-neon-cyan" />
              Wire: <strong className="text-neon-violet">@k-pop-wave-support-team</strong>
            </p>
            <p className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-emerald-400" />
              Seoul, South Korea · Live chat available 24/7 via the widget
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 text-[11px] text-white/30 md:flex-row md:items-center">
          <p>© 2026 K-Pop Wave Entertainment Portal. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <Music4 className="h-3.5 w-3.5 text-neon-pink" />
            All artist names, photos and marks belong to their respective agencies — registry for
            reference only, made with
            <Heart className="h-3 w-3 text-neon-pink" fill="currentColor" />
            for fans.
          </p>
        </div>
      </div>
    </footer>
  );
}
