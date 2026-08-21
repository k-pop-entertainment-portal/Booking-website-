import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { tickerHeadlines } from "../data/news";

function useSeoulClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Seoul",
        }).format(new Date())
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function NewsTicker() {
  const kst = useSeoulClock();

  const items = [...tickerHeadlines, ...tickerHeadlines];

  return (
    <div className="relative z-20 border-y border-white/10 bg-ink/90 backdrop-blur-xl">
      <div className="flex items-stretch">
        {/* Live label */}
        <div className="relative z-10 flex shrink-0 items-center gap-3 bg-gradient-to-r from-neon-pink to-neon-violet px-4 py-3 md:px-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute h-2.5 w-2.5 animate-pulse-dot rounded-full bg-white" />
          </span>
          <span className="font-display text-xs font-800 uppercase tracking-[0.25em] text-white">
            Live
          </span>
          <span className="hidden font-mono text-xs tabular-nums text-white/85 sm:block">
            {kst} KST
          </span>
        </div>

        {/* Marquee */}
        <div className="relative flex flex-1 items-center overflow-hidden">
          <div className="marquee-track items-center py-3">
            {items.map((h, i) => (
              <span key={i} className="flex shrink-0 items-center gap-3 px-6">
                <Zap className="h-3.5 w-3.5 shrink-0 text-neon-cyan" fill="currentColor" />
                <span className="whitespace-nowrap text-sm font-medium text-white/75">{h}</span>
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent" />
        </div>
      </div>
    </div>
  );
}
