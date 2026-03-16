"use client";
import { useState } from "react";
import ToolPage from "@/components/ToolPage";

type Mode = "words" | "sentences" | "lines" | "phrases";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cutup(text: string, mode: Mode, mix?: string): string {
  let chunksA = split(text, mode);
  let chunksB = mix ? split(mix, mode) : [];
  let combined = mix ? interleave(chunksA, chunksB) : chunksA;
  return shuffle(combined).join(
    mode === "words" ? " " : mode === "lines" ? "\n" : " ",
  );
}

function split(text: string, mode: Mode): string[] {
  switch (mode) {
    case "words":
      return text.trim().split(/\s+/).filter(Boolean);
    case "sentences":
      return text
        .trim()
        .split(/(?<=[.!?])\s+/)
        .filter(Boolean);
    case "lines":
      return text.trim().split(/\n+/).filter(Boolean);
    case "phrases":
      return text
        .trim()
        .split(/[,;:—–]\s*/)
        .filter(Boolean);
  }
}

function interleave(a: string[], b: string[]): string[] {
  const result: string[] = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    if (i < a.length) result.push(a[i]);
    if (i < b.length) result.push(b[i]);
  }
  return result;
}

const SAMPLES = {
  burroughs: `You are a receiver. The word is now a virus. Language is a virus from outer space. Cut the word lines. Shift the reality studio. Rub out the word. You are here to learn the space age. Time is a human affliction. We are not from this planet. The ticket that exploded. The soft machine. Nova express. Cut and rearrange. Nothing is true. Everything is permitted.`,
  "circuit noise": `Voltage drop across the terminals. Current seeking ground. The transistor opens its gate. Resistance is measured in ohms. Signal travels at the speed of light. Noise floor rising. Capacitor holds the charge. The inductor resists change. Ground is everywhere. Power is potential. The circuit is complete. Electrons flow through copper veins. Silicon dreams in binary. The oscillator hums.`,
  "soft manifesto": `We make things because we must. The tools are already in our hands. Cut along the dotted line. Fold here. Staple twice. Pass it on. Nothing needs permission. The copy machine is our printing press. Every zine is a small revolution. We are not waiting. We are making. Right now. With what we have. On the table. In the kitchen. At midnight.`,
};

export default function CutupPage() {
  const [textA, setTextA] = useState(SAMPLES["burroughs"]);
  const [textB, setTextB] = useState("");
  const [mode, setMode] = useState<Mode>("sentences");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [showMix, setShowMix] = useState(false);

  const run = () => setOutput(cutup(textA, mode, showMix ? textB : undefined));

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <ToolPage
      title="cut-up machine"
      description="burroughs-style text cut-up. paste text, choose a cut mode, and reassemble randomly."
      category="generative text"
    >
      {/* presets */}
      <div style={{ marginBottom: 20 }}>
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
          sample texts
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.keys(SAMPLES).map((name) => (
            <button
              key={name}
              className="btn btn-ghost"
              style={{ fontSize: 11 }}
              onClick={() => setTextA(SAMPLES[name as keyof typeof SAMPLES])}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* text input a */}
      <div style={{ marginBottom: 16 }}>
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
          text {showMix ? "a" : "— paste here"}
        </div>
        <textarea
          value={textA}
          onChange={(e) => setTextA(e.target.value)}
          rows={5}
          style={{
            width: "100%",
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            borderRadius: 8,
            padding: "10px 12px",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--ink)",
            outline: "none",
            resize: "vertical",
            lineHeight: 1.7,
            transition: "border-color 0.12s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* mix toggle */}
      <div style={{ marginBottom: 20 }}>
        <button
          className={showMix ? "btn btn-primary" : "btn btn-ghost"}
          style={{ fontSize: 11 }}
          onClick={() => setShowMix(!showMix)}
        >
          {showMix ? "✦ mixing two texts" : "+ mix with second text"}
        </button>
      </div>

      {/* text input b */}
      {showMix && (
        <div style={{ marginBottom: 20 }}>
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
            text b
          </div>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            rows={5}
            placeholder="paste a second text to interleave with text a…"
            style={{
              width: "100%",
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              padding: "10px 12px",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--ink)",
              outline: "none",
              resize: "vertical",
              lineHeight: 1.7,
              transition: "border-color 0.12s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
      )}

      {/* cut mode */}
      <div style={{ marginBottom: 20 }}>
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
          cut by
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["words", "sentences", "lines", "phrases"] as Mode[]).map((m) => (
            <button
              key={m}
              className={mode === m ? "btn btn-primary" : "btn btn-ghost"}
              style={{ fontSize: 11 }}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* generate */}
      <div style={{ marginBottom: 24 }}>
        <button className="btn btn-primary" onClick={run}>
          ✦ cut it up
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
          <div style={{ marginTop: 8 }}>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 11 }}
              onClick={run}
            >
              ✦ cut again
            </button>
          </div>
        </div>
      )}
    </ToolPage>
  );
}
