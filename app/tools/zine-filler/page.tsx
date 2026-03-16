"use client";
import { useState } from "react";
import ToolPage from "@/components/ToolPage";

type Flavor = keyof typeof WORD_BANKS;

const WORD_BANKS = {
  "circuit poetics": {
    nouns: [
      "voltage",
      "current",
      "resistance",
      "capacitor",
      "transistor",
      "oscillator",
      "frequency",
      "signal",
      "ground",
      "circuit",
      "node",
      "gate",
      "flux",
      "ohm",
      "waveform",
      "terminal",
      "cathode",
      "anode",
      "diode",
      "relay",
      "inductor",
      "trace",
      "solder",
      "breadboard",
      "microcontroller",
      "electrode",
      "sensor",
      "actuator",
      "matrix",
      "array",
    ],
    verbs: [
      "flows",
      "oscillates",
      "charges",
      "discharges",
      "switches",
      "amplifies",
      "filters",
      "modulates",
      "conducts",
      "resists",
      "grounds",
      "pulses",
      "triggers",
      "reads",
      "writes",
      "loops",
      "interrupts",
      "transmits",
      "receives",
      "encodes",
    ],
    adjectives: [
      "analog",
      "digital",
      "low-pass",
      "high-frequency",
      "conductive",
      "resistive",
      "capacitive",
      "inductive",
      "floating",
      "grounded",
      "open",
      "closed",
      "active",
      "passive",
      "saturated",
      "linear",
      "binary",
      "serial",
      "parallel",
      "embedded",
    ],
    connectors: [
      "through",
      "across",
      "between",
      "along",
      "within",
      "beyond",
      "beneath",
      "above",
      "against",
      "toward",
      "into",
      "around",
      "beside",
      "among",
      "via",
      "per",
      "sans",
      "amid",
    ],
  },
  "soft electronics": {
    nouns: [
      "thread",
      "stitch",
      "fabric",
      "circuit",
      "sensor",
      "LED",
      "conductive",
      "yarn",
      "weave",
      "pattern",
      "embroidery",
      "signal",
      "touch",
      "texture",
      "voltage",
      "current",
      "resistance",
      "flex",
      "knit",
      "wearable",
      "patch",
      "interface",
      "skin",
      "material",
      "gesture",
      "pressure",
      "capacitance",
      "body",
      "membrane",
      "filament",
    ],
    verbs: [
      "sews",
      "weaves",
      "conducts",
      "senses",
      "responds",
      "glows",
      "pulses",
      "connects",
      "bridges",
      "flows",
      "threads",
      "stitches",
      "binds",
      "wraps",
      "traces",
      "embeds",
      "activates",
      "detects",
      "transmits",
      "illuminates",
    ],
    adjectives: [
      "soft",
      "flexible",
      "washable",
      "wearable",
      "conductive",
      "resistive",
      "textile",
      "haptic",
      "tactile",
      "responsive",
      "embedded",
      "sewable",
      "knitted",
      "woven",
      "printed",
      "organic",
      "biological",
      "synthetic",
      "hybrid",
      "intimate",
    ],
    connectors: [
      "through",
      "within",
      "across",
      "between",
      "beneath",
      "against",
      "upon",
      "along",
      "around",
      "into",
      "beside",
      "among",
      "via",
      "woven into",
      "sewn through",
      "embedded in",
    ],
  },
  "zine manifesto": {
    nouns: [
      "zine",
      "copy",
      "page",
      "fold",
      "staple",
      "ink",
      "paper",
      "scissors",
      "glue",
      "image",
      "text",
      "voice",
      "hand",
      "press",
      "network",
      "archive",
      "distribution",
      "community",
      "resistance",
      "practice",
      "labor",
      "tool",
      "space",
      "body",
      "memory",
      "future",
      "archive",
      "gesture",
      "act",
      "form",
    ],
    verbs: [
      "cut",
      "paste",
      "fold",
      "staple",
      "copy",
      "distribute",
      "share",
      "make",
      "create",
      "resist",
      "refuse",
      "reclaim",
      "document",
      "archive",
      "publish",
      "circulate",
      "gather",
      "organize",
      "respond",
      "refuse",
    ],
    adjectives: [
      "handmade",
      "self-published",
      "independent",
      "local",
      "urgent",
      "collective",
      "temporary",
      "ephemeral",
      "photocopied",
      "folded",
      "stapled",
      "hand-drawn",
      "typewritten",
      "cut-and-paste",
      "underground",
      "autonomous",
      "free",
      "radical",
      "personal",
      "political",
    ],
    connectors: [
      "because",
      "therefore",
      "despite",
      "through",
      "against",
      "beyond",
      "within",
      "outside",
      "beside",
      "beneath",
      "alongside",
      "in response to",
      "in the absence of",
      "in place of",
      "instead of",
    ],
  },
  "botanical error": {
    nouns: [
      "root",
      "stem",
      "leaf",
      "petal",
      "spore",
      "mycelium",
      "chlorophyll",
      "photosynthesis",
      "cell",
      "membrane",
      "nucleus",
      "vacuole",
      "tendril",
      "rhizome",
      "canopy",
      "understory",
      "decomposition",
      "symbiosis",
      "mutation",
      "adaptation",
      "dormancy",
      "germination",
      "fruiting",
      "dispersal",
      "colonization",
      "succession",
      "nitrogen",
      "carbon",
      "oxygen",
      "water",
    ],
    verbs: [
      "grows",
      "spreads",
      "absorbs",
      "photosynthesizes",
      "decomposes",
      "germinates",
      "colonizes",
      "branches",
      "roots",
      "fruits",
      "disperses",
      "mutates",
      "adapts",
      "unfurls",
      "reaches",
      "reclaims",
      "persists",
      "returns",
      "emerges",
      "dissolves",
    ],
    adjectives: [
      "perennial",
      "deciduous",
      "invasive",
      "endemic",
      "symbiotic",
      "parasitic",
      "saprophytic",
      "mycorrhizal",
      "phototropic",
      "heliotropic",
      "dormant",
      "emergent",
      "ruderal",
      "climax",
      "pioneer",
      "ancient",
      "microscopic",
      "entangled",
      "networked",
      "subterranean",
    ],
    connectors: [
      "toward",
      "beneath",
      "through",
      "among",
      "between",
      "within",
      "alongside",
      "despite",
      "without",
      "beyond",
      "above",
      "below",
      "around",
      "across",
      "against",
      "in the shadow of",
    ],
  },
  "glitch lorem": {
    nouns: [
      "lorem",
      "ipsum",
      "dolor",
      "amet",
      "consectetur",
      "adipiscing",
      "elit",
      "sed",
      "eiusmod",
      "tempor",
      "incididunt",
      "labore",
      "dolore",
      "magna",
      "aliqua",
      "enim",
      "minim",
      "veniam",
      "quis",
      "nostrud",
      "exercitation",
      "ullamco",
      "laboris",
      "nisi",
      "aliquip",
      "commodo",
      "consequat",
      "duis",
      "aute",
      "irure",
    ],
    verbs: [
      "est",
      "sit",
      "do",
      "ut",
      "esse",
      "cillum",
      "occaecat",
      "cupidatat",
      "non",
      "proident",
      "sunt",
      "culpa",
      "qui",
      "officia",
      "deserunt",
      "mollit",
      "anim",
      "id",
      "in",
      "reprehenderit",
      "voluptate",
      "velit",
      "esse",
      "cillum",
      "dolore",
      "fugiat",
      "nulla",
      "pariatur",
      "excepteur",
      "sint",
    ],
    adjectives: [
      "occaecat",
      "cupidatat",
      "non",
      "proident",
      "sunt",
      "culpa",
      "qui",
      "officia",
      "deserunt",
      "mollit",
      "anim",
      "laborum",
      "error",
      "404",
      "null",
      "undefined",
      "NaN",
      "void",
      "false",
      "overflow",
    ],
    connectors: [
      "et",
      "vel",
      "sed",
      "nec",
      "aut",
      "ac",
      "in",
      "ad",
      "ex",
      "de",
      "ab",
      "cum",
      "pro",
      "per",
      "sub",
      "super",
      "inter",
      "ultra",
      "ante",
      "post",
    ],
  },
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSentence(
  bank: (typeof WORD_BANKS)["circuit poetics"],
): string {
  const patterns = [
    () =>
      `the ${pick(bank.adjectives)} ${pick(bank.nouns)} ${pick(bank.verbs)} ${pick(bank.connectors)} the ${pick(bank.adjectives)} ${pick(bank.nouns)}.`,
    () =>
      `${pick(bank.adjectives)} ${pick(bank.nouns)} and ${pick(bank.adjectives)} ${pick(bank.nouns)} ${pick(bank.verbs)}.`,
    () =>
      `${pick(bank.verbs)} ${pick(bank.connectors)} the ${pick(bank.nouns)}, the ${pick(bank.nouns)} ${pick(bank.verbs)}.`,
    () =>
      `a ${pick(bank.adjectives)} ${pick(bank.nouns)} ${pick(bank.verbs)} ${pick(bank.connectors)} ${pick(bank.adjectives)} ${pick(bank.nouns)}.`,
    () =>
      `the ${pick(bank.nouns)} is ${pick(bank.adjectives)}, the ${pick(bank.nouns)} is ${pick(bank.adjectives)}.`,
    () =>
      `${pick(bank.connectors)} the ${pick(bank.adjectives)} ${pick(bank.nouns)}: ${pick(bank.verbs)}, ${pick(bank.verbs)}, ${pick(bank.verbs)}.`,
  ];
  return pick(patterns)();
}

function generateParagraph(
  bank: (typeof WORD_BANKS)["circuit poetics"],
  sentences: number,
): string {
  return Array.from({ length: sentences }, () => generateSentence(bank)).join(
    " ",
  );
}

function generateText(
  flavor: Flavor,
  paragraphs: number,
  sentencesPerParagraph: number,
): string {
  const bank = WORD_BANKS[flavor];
  return Array.from({ length: paragraphs }, () =>
    generateParagraph(bank, sentencesPerParagraph),
  ).join("\n\n");
}

export default function ZineFillerPage() {
  const [flavor, setFlavor] = useState<Flavor>("circuit poetics");
  const [paragraphs, setParagraphs] = useState(3);
  const [sentences, setSentences] = useState(4);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const run = () => setOutput(generateText(flavor, paragraphs, sentences));

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <ToolPage
      title="zine filler"
      description="generate placeholder text in different flavors for zines, mockups & layouts."
      category="generative text"
    >
      {/* flavor */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--ink-ghost)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          flavor
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 6,
          }}
        >
          {(Object.keys(WORD_BANKS) as Flavor[]).map((f) => (
            <button
              key={f}
              onClick={() => setFlavor(f)}
              style={{
                padding: "10px 12px",
                background:
                  flavor === f ? "rgba(168,85,200,0.1)" : "var(--card)",
                border: `1.5px solid ${flavor === f ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.12s",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: flavor === f ? "var(--accent)" : "var(--ink-soft)",
                textAlign: "left",
                fontWeight: flavor === f ? 500 : 400,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* controls */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-ghost)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            paragraphs — {paragraphs}
          </div>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={paragraphs}
            onChange={(e) => setParagraphs(parseInt(e.target.value))}
            style={{ width: "100%" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--ink-ghost)",
              marginTop: 4,
            }}
          >
            <span>1</span>
            <span>8</span>
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-ghost)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            sentences per paragraph — {sentences}
          </div>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={sentences}
            onChange={(e) => setSentences(parseInt(e.target.value))}
            style={{ width: "100%" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--ink-ghost)",
              marginTop: 4,
            }}
          >
            <span>1</span>
            <span>8</span>
          </div>
        </div>
      </div>

      {/* generate */}
      <div style={{ marginBottom: 24 }}>
        <button className="btn btn-primary" onClick={run}>
          ✦ generate filler
        </button>
      </div>

      {/* output */}
      {output && (
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-ghost)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>output</span>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 10, padding: "3px 10px" }}
              onClick={copy}
            >
              {copied ? "copied ✦" : "copy"}
            </button>
          </div>
          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              padding: "16px 18px",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--ink-soft)",
              lineHeight: 1.9,
              whiteSpace: "pre-wrap",
            }}
          >
            {output}
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 11 }}
              onClick={run}
            >
              ✦ regenerate
            </button>
          </div>
        </div>
      )}
    </ToolPage>
  );
}
