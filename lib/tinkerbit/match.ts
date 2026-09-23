// ✦ tinkerbit's matching engine ✦
// a tiny scoring function, think "search engine", not "language model".
// deterministic, transparent, and entirely in the browser.

import { KNOWLEDGE, type Entry } from "./knowledge";

export type Reply = {
  text: string;
  // primary match, if there is one (used to render a tool link chip)
  match?: Entry;
  // runner-ups worth suggesting ("you might also mean…")
  alternates: Entry[];
  // when tinkerbit doesn't know: a privacy-respecting web search link
  // (opens duckduckgo in a new tab — the visitor chooses to leave,
  // nothing is sent anywhere automatically)
  searchUrl?: string;
};

// normalize words so "colours", "resistors", "converting" still match
const SYNONYMS: Record<string, string> = {
  colour: "color",
  colours: "color",
  colors: "color",
  resistors: "resistor",
  capacitors: "capacitor",
  leds: "led",
  wires: "wire",
  zines: "zine",
  timestamps: "timestamp",
  palettes: "palette",
  converting: "convert",
  converter: "convert",
  conversion: "convert",
  generator: "generate",
  generating: "generate",
  calculator: "calc",
  calculate: "calc",
  checker: "check",
  formatting: "format",
  formatter: "format",
};

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "i",
  "is",
  "it",
  "do",
  "you",
  "have",
  "can",
  "how",
  "what",
  "whats",
  "which",
  "where",
  "to",
  "for",
  "of",
  "my",
  "me",
  "in",
  "on",
  "and",
  "or",
  "there",
  "this",
  "that",
  "with",
  "want",
  "need",
  "use",
  "find",
  "get",
  "about",
  "any",
  "some",
  "tool",
  "please",
]);

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s#.-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => SYNONYMS[w] ?? w)
    .filter((w) => !STOP_WORDS.has(w));
}

function scoreEntry(entry: Entry, tokens: string[], rawQuery: string): number {
  let score = 0;

  for (const kw of entry.keywords) {
    // multi-word keyword present as a phrase in the raw query → strong signal
    if (kw.includes(" ")) {
      if (rawQuery.includes(kw)) score += 5;
      continue;
    }
    for (const t of tokens) {
      if (t === kw) score += 3;
      // partial match for longer words ("access" → "accessibility")
      else if (t.length >= 4 && (kw.startsWith(t) || t.startsWith(kw)))
        score += 1;
    }
  }

  // name & category hits
  const nameTokens = tokenize(entry.name);
  for (const t of tokens) {
    if (nameTokens.includes(t)) score += 4;
    if (entry.category.includes(t)) score += 1;
  }

  return score;
}

const FALLBACKS = [
  "hmm, that one's outside my little brain ✦ i'm a hand-written knowledge base, not an AI — but i can hand you off to a web search (opens in a new tab, nothing sent from here). or try asking about a tool: resistors, color, regex, zines…",
  "i don't know that one yet! my knowledge is hand-written, so it has edges. the search chip below will look it up on the open web — or ask me about the tools here, or suggest a new one at /request ✦",
];

const CATEGORY_HINTS: Record<string, string> = {
  electronics:
    "resistor decoder · ohm’s law · wire gauge · capacitor decoder · 555 timer · voltage divider",
  textile: "conductive thread calc · fabric & materials reference",
  color:
    "palette gen · color converter · hex namer · cheatsheet · accessibility checker",
  text: "markov generator · cut-up machine · glitch text · zine filler · ascii generator",
  code: "code identifier · binary/hex · regex tester · json formatter · timestamp converter",
  zine: "zine imposer · zine filler",
};

export function ask(question: string): Reply {
  const raw = question.toLowerCase().trim();
  const tokens = tokenize(raw);

  // bare greetings & empty questions
  if (tokens.length === 0 || /^(hi|hii+|hey|hello|yo|sup)\b/.test(raw)) {
    const about = KNOWLEDGE.find((e) => e.id === "about-tinkerbit")!;
    return { text: about.answer, match: about, alternates: [] };
  }

  // "list everything in a category" style questions
  if (/\b(all|list|every|show me)\b/.test(raw)) {
    for (const [key, hint] of Object.entries(CATEGORY_HINTS)) {
      if (raw.includes(key)) {
        return {
          text: `here’s everything in that corner of the toolkit ✦ ${hint}. ask me about any of them by name!`,
          alternates: [],
        };
      }
    }
  }

  const scored = KNOWLEDGE.map((entry) => ({
    entry,
    score: scoreEntry(entry, tokens, raw),
  }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0 || scored[0].score < 3) {
    const fallback = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    return {
      text: fallback,
      alternates: [],
      searchUrl: `https://duckduckgo.com/?q=${encodeURIComponent(question.trim())}`,
    };
  }

  const best = scored[0];
  // alternates: close-scoring, distinct entries (within 60% of the top score)
  // skip runner-ups that link to the same tool as the best match or each other
  const seen = new Set(best.entry.href ? [best.entry.href] : []);
  const alternates = scored
    .slice(1)
    .filter((s) => s.score >= best.score * 0.6)
    .map((s) => s.entry)
    .filter((e) => {
      if (!e.href) return true;
      if (seen.has(e.href)) return false;
      seen.add(e.href);
      return true;
    })
    .slice(0, 3);

  return { text: best.entry.answer, match: best.entry, alternates };
}
