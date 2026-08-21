/* ------------------------------------------------------------------
   Procedural photo-logo engine.
   Renders a unique, designed "photo logo" canvas image for every
   company and every group — cached as real data-URL images so every
   card always displays perfectly (no external links, nothing broken).
------------------------------------------------------------------- */

const cache = new Map<string, string>();

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const PALETTES: [string, string][] = [
  ["#a855f7", "#f472b6"],
  ["#22d3ee", "#a855f7"],
  ["#f472b6", "#fb7185"],
  ["#34d399", "#22d3ee"],
  ["#818cf8", "#22d3ee"],
  ["#fbbf24", "#f472b6"],
  ["#c084fc", "#38bdf8"],
  ["#fb7185", "#a855f7"],
];

export function initialsOf(name: string): string {
  const clean = name.replace(/[^A-Za-z0-9& ]/g, " ").replace(/\s+/g, " ").trim();
  if (!clean) return "K";
  const parts = clean.split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function grain(x: CanvasRenderingContext2D, r: () => number, w: number, h: number, n = 700) {
  for (let i = 0; i < n; i++) {
    x.fillStyle = `rgba(255,255,255,${(r() * 0.05).toFixed(3)})`;
    x.fillRect(r() * w, r() * h, 1, 1);
  }
}

function vignette(x: CanvasRenderingContext2D, w: number, h: number) {
  const g = x.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.55)");
  x.fillStyle = g;
  x.fillRect(0, 0, w, h);
}

/** 512×512 company photo logo */
export function companyLogo(name: string, accent?: string): string {
  const key = `co:${name}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const r = rng(hash(name) ^ 0x9e3779b9);
  const palette = accent
    ? [accent, PALETTES[Math.floor(r() * PALETTES.length)][1]]
    : PALETTES[Math.floor(r() * PALETTES.length)];

  const W = 512, H = 512;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const x = c.getContext("2d")!;

  // deep studio base
  const bg = x.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0b0e1c");
  bg.addColorStop(1, "#10122b");
  x.fillStyle = bg;
  x.fillRect(0, 0, W, H);

  // aurora glows
  for (let i = 0; i < 3; i++) {
    const gx = r() * W, gy = r() * H, gr = 140 + r() * 200;
    const col = i === 2 ? "#ffffff" : palette[i % 2];
    const g = x.createRadialGradient(gx, gy, 0, gx, gy, gr);
    g.addColorStop(0, `${col}${i === 2 ? "14" : "3d"}`);
    g.addColorStop(1, "transparent");
    x.fillStyle = g;
    x.fillRect(0, 0, W, H);
  }

  // orbital rings
  x.save();
  x.translate(W / 2, H / 2);
  x.rotate((r() - 0.5) * 0.6);
  for (let i = 0; i < 3; i++) {
    x.beginPath();
    x.ellipse(0, 0, 150 + i * 42, (150 + i * 42) * (0.62 + r() * 0.2), 0, 0, Math.PI * 2);
    x.strokeStyle = `${palette[i % 2]}${["2e", "22", "16"][i]}`;
    x.lineWidth = 1.4;
    x.stroke();
  }
  x.restore();

  // sparkles
  for (let i = 0; i < 26; i++) {
    const sx = r() * W, sy = r() * H, sr = r() * 1.8 + 0.4;
    x.beginPath();
    x.arc(sx, sy, sr, 0, Math.PI * 2);
    x.fillStyle = `rgba(255,255,255,${0.15 + r() * 0.45})`;
    x.fill();
  }

  // light sweep
  x.save();
  x.translate(W / 2, H / 2);
  x.rotate(-0.45 + r() * 0.3);
  const sweep = x.createLinearGradient(-W, 0, W, 0);
  sweep.addColorStop(0, "transparent");
  sweep.addColorStop(0.5, `${palette[1]}12`);
  sweep.addColorStop(1, "transparent");
  x.fillStyle = sweep;
  x.fillRect(-W, -60, W * 2, 120);
  x.restore();

  // wordmark initials
  const ini = initialsOf(name);
  const size = ini.length > 2 ? 150 : 190;
  const grad = x.createLinearGradient(W / 2 - 120, H / 2 - 90, W / 2 + 120, H / 2 + 110);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.55, palette[1] ?? "#f472b6");
  grad.addColorStop(1, palette[0]);
  x.font = `800 ${size}px Sora, Arial, sans-serif`;
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.shadowColor = palette[0];
  x.shadowBlur = 46;
  const track = size * 0.92;
  const total = track * (ini.length - 1);
  [...ini].forEach((ch, i) => {
    x.fillStyle = grad;
    x.fillText(ch, W / 2 - total / 2 + i * track, H / 2 + 8);
  });
  x.shadowBlur = 0;

  // underline accent
  x.fillStyle = grad;
  const uw = 120 + r() * 60;
  x.fillRect(W / 2 - uw / 2, H / 2 + size * 0.62, uw, 5);

  grain(x, r, W, H);
  vignette(x, W, H);

  const url = c.toDataURL("image/png");
  cache.set(key, url);
  return url;
}

/** 840×560 group "photo card" artwork */
export function groupArt(name: string, accent: string): string {
  const key = `gr:${name}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const r = rng(hash(name) ^ 0x51ed269b);
  const sec = PALETTES[Math.floor(r() * PALETTES.length)][1];

  const W = 840, H = 560;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const x = c.getContext("2d")!;

  const bg = x.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0a0d1c");
  bg.addColorStop(1, "#12142e");
  x.fillStyle = bg;
  x.fillRect(0, 0, W, H);

  // stage spot beams
  const beams = 5 + Math.floor(r() * 4);
  for (let i = 0; i < beams; i++) {
    const bx = r() * W;
    const bw = 26 + r() * 60;
    const col = i % 2 ? accent : sec;
    const g = x.createLinearGradient(bx, 0, bx, H);
    g.addColorStop(0, `${col}33`);
    g.addColorStop(1, "transparent");
    x.save();
    x.translate(bx, 0);
    x.rotate((r() - 0.5) * 0.22);
    x.fillStyle = g;
    x.fillRect(-bw / 2, -20, bw, H * 0.9);
    x.restore();
  }

  // horizon glow floor
  const floor = x.createRadialGradient(W / 2, H * 0.86, 10, W / 2, H * 0.86, W * 0.62);
  floor.addColorStop(0, `${accent}3a`);
  floor.addColorStop(1, "transparent");
  x.fillStyle = floor;
  x.fillRect(0, 0, W, H);

  // sparkles
  for (let i = 0; i < 60; i++) {
    x.beginPath();
    x.arc(r() * W, r() * H * 0.75, r() * 2 + 0.4, 0, Math.PI * 2);
    x.fillStyle = `rgba(255,255,255,${0.12 + r() * 0.5})`;
    x.fill();
  }

  // big group name (bottom center, auto-fit)
  const label = name.toUpperCase();
  let size = 84;
  x.textAlign = "center";
  x.textBaseline = "alphabetic";
  do {
    x.font = `800 ${size}px Sora, Arial, sans-serif`;
    size -= 4;
  } while (x.measureText(label).width > W - 90 && size > 26);
  const grad = x.createLinearGradient(W / 2 - 200, H - 170, W / 2 + 200, H - 40);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(1, accent);
  x.shadowColor = accent;
  x.shadowBlur = 40;
  x.fillStyle = grad;
  x.fillText(label, W / 2, H - 74);
  x.shadowBlur = 0;

  // micro caption
  x.font = "700 20px Sora, Arial, sans-serif";
  x.fillStyle = "rgba(255,255,255,0.42)";
  x.fillText("OFFICIAL PHOTO CARD · K-POP WAVE REGISTRY", W / 2, H - 34);

  // top accent chip
  x.fillStyle = `${accent}26`;
  const chipW = 190;
  x.beginPath();
  if (typeof x.roundRect === "function") {
    x.roundRect(W / 2 - chipW / 2, 30, chipW, 34, 17);
  } else {
    x.rect(W / 2 - chipW / 2, 30, chipW, 34);
  }
  x.fill();
  x.font = "800 15px Sora, Arial, sans-serif";
  x.fillStyle = "#ffffff";
  x.fillText("K·WAVE MATRIX", W / 2, 53);

  grain(x, r, W, H, 900);
  vignette(x, W, H);

  const url = c.toDataURL("image/png");
  cache.set(key, url);
  return url;
}
