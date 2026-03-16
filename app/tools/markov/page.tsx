"use client";
import { useState } from "react";
import ToolPage from "@/components/ToolPage";

function buildChain(text: string, order: number): Map<string, string[]> {
  const chain = new Map<string, string[]>();
  const words = text.trim().split(/\s+/);
  for (let i = 0; i < words.length - order; i++) {
    const key = words.slice(i, i + order).join(" ");
    const next = words[i + order];
    if (!chain.has(key)) chain.set(key, []);
    chain.get(key)!.push(next);
  }
  return chain;
}

function generate(
  chain: Map<string, string[]>,
  order: number,
  length: number,
): string {
  const keys = Array.from(chain.keys());
  if (keys.length === 0) return "";
  let key = keys[Math.floor(Math.random() * keys.length)];
  const result = key.split(" ");
  for (let i = 0; i < length; i++) {
    const nexts = chain.get(key);
    if (!nexts || nexts.length === 0) {
      key = keys[Math.floor(Math.random() * keys.length)];
      continue;
    }
    const next = nexts[Math.floor(Math.random() * nexts.length)];
    result.push(next);
    key = result.slice(-order).join(" ");
  }
  return result.join(" ");
}

const SAMPLES = {
  "circuit poetics": `the voltage rises through the circuit board like a river finding its delta the current flows where resistance allows it passage every component a gatekeeper every wire a path through the wilderness of electrons the capacitor holds its breath waiting for the signal to arrive the transistor opens like a door the LED blinks in the darkness a small sun born from silicon and intention the ground is everywhere and nowhere the power rail hums with potential energy waiting to become kinetic waiting to become light waiting to become sound waiting to become movement`,
  "zine manifesto": `we cut and paste therefore we are the copy machine is our printing press the scissors are our editorial voice we make because we must we distribute because we care every zine is a small revolution stapled at the center folded twice and passed hand to hand through the network of people who still believe in paper we are not waiting for permission we are not waiting for resources we are making it now with what we have on the table in the kitchen at midnight with the lamp on low`,
  "soft machine": `the body is a soft machine learning to interface with the hard world touch sensors embedded in fingertips neural networks trained on sensation the heart is a pump the lungs are bellows the brain is a pattern recognition engine running on glucose and sleep the soft machine repairs itself rewires itself grows new connections where old ones fail adapts to inputs it was never designed to receive the soft machine is always in beta always updating always finding new ways to process the signal through the noise`,
};

export default function MarkovPage() {
  const [corpus, setCorpus] = useState(SAMPLES["circuit poetics"]);
  const [order, setOrder] = useState(2);
  const [length, setLength] = useState(80);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const run = () => {
    const chain = buildChain(corpus, order);
    setOutput(generate(chain, order, length));
  };

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <ToolPage
      title="markov generator"
      description="train a markov chain on any text corpus and generate new text in that style."
      category="generative text"
    >
      {/* sample presets */}
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
          sample corpora
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.keys(SAMPLES).map((name) => (
            <button
              key={name}
              className="btn btn-ghost"
              style={{ fontSize: 11 }}
              onClick={() => setCorpus(SAMPLES[name as keyof typeof SAMPLES])}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* corpus input */}
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
          corpus — paste your text here
        </div>
        <textarea
          value={corpus}
          onChange={(e) => setCorpus(e.target.value)}
          rows={6}
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
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--ink-ghost)",
            marginTop: 4,
          }}
        >
          {corpus.trim().split(/\s+/).length} words
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
            chain order — {order}
          </div>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value))}
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
            <span>1 — chaotic</span>
            <span>4 — faithful</span>
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
            output length — {length} words
          </div>
          <input
            type="range"
            min={20}
            max={200}
            step={10}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
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
            <span>20</span>
            <span>200</span>
          </div>
        </div>
      </div>

      {/* generate button */}
      <div style={{ marginBottom: 24 }}>
        <button className="btn btn-primary" onClick={run}>
          ✦ generate
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
