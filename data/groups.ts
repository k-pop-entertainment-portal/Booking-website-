import { matrix, type Cat } from "./matrix";

export interface GroupEntry {
  name: string;
  members: string;
  company: string;
  cat: Cat;
  /** lowercase keywords used to match news stories */
  keys: string[];
}

function keywordsFor(name: string, members: string): string[] {
  const keys = new Set<string>();
  keys.add(name.toLowerCase());

  // alias helpers
  const alias: Record<string, string[]> = {
    "tomorrow x together": ["txt"],
    "(g)i-dle": ["gidle", "g i-dle", "g-idle"],
    "le sserafim": ["lesserafim"],
    "zerobaseone": ["zb1"],
    "super junior": ["suju"],
    "nct 127": ["nct"],
    "nct dream": ["nct"],
    "nct wish": ["nct"],
    "seventeen sub-units": ["seventeen"],
    "booseoksoon": ["bss", "seventeen"],
    "rosé": ["rose", "blackpink"],
    "jennie": ["blackpink"],
    "jisoo": ["blackpink"],
    "lisa": ["blackpink"],
    "g-dragon": ["gdragon", "gd", "bigbang"],
    "jung kook": ["jungkook", "bts"],
    "baekhyun": ["exo"],
    "exo-cbx": ["exo"],
    "exo-sc": ["exo"],
    "3racha": ["stray kids"],
    "wayv": ["nct"],
    "mamamoo+": ["mamamoo"],
    "got the beat": ["girls on top"],
    "girls' generation-tts": ["girls generation", "snsd"],
  };
  (alias[name.toLowerCase()] ?? []).forEach((a) => keys.add(a));

  // member names become searchable keys too
  members
    .replace(/\(.*?\)/g, " ")
    .split(/[,·.]/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 2 && s.length < 22 && !s.includes(":"))
    .slice(0, 14)
    .forEach((m) => keys.add(m));

  return [...keys];
}

export const groups: GroupEntry[] = matrix.flatMap((c) =>
  (c.groups ?? []).map((g) => ({
    name: g.n,
    members: g.m,
    company: c.name,
    cat: c.cat,
    keys: keywordsFor(g.n, g.m),
  }))
);

export const GROUP_TOTAL = groups.length;
