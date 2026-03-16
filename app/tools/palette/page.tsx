"use client";
import { useState, useCallback } from "react";
import ToolPage from "@/components/ToolPage";

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

type Harmony =
  | "complementary"
  | "triadic"
  | "analogous"
  | "split-complementary"
  | "tetradic"
  | "monochromatic";

function generatePalette(
  seed: string,
  harmony: Harmony,
): Array<{ hex: string; label: string }> {
  const [h, s, l] = hexToHsl(seed);
  switch (harmony) {
    case "complementary":
      return [
        { hex: seed, label: "base" },
        { hex: hslToHex(h, s, Math.min(l + 20, 90)), label: "light" },
        { hex: hslToHex(h, s, Math.max(l - 20, 10)), label: "dark" },
        { hex: hslToHex(h + 180, s, l), label: "complement" },
        {
          hex: hslToHex(h + 180, s, Math.min(l + 20, 90)),
          label: "comp. light",
        },
      ];
    case "triadic":
      return [
        { hex: seed, label: "base" },
        { hex: hslToHex(h + 120, s, l), label: "triad 2" },
        { hex: hslToHex(h + 240, s, l), label: "triad 3" },
        { hex: hslToHex(h, s, Math.min(l + 25, 90)), label: "light" },
        { hex: hslToHex(h, s, Math.max(l - 25, 10)), label: "dark" },
      ];
    case "analogous":
      return [
        { hex: hslToHex(h - 40, s, l), label: "-40°" },
        { hex: hslToHex(h - 20, s, l), label: "-20°" },
        { hex: seed, label: "base" },
        { hex: hslToHex(h + 20, s, l), label: "+20°" },
        { hex: hslToHex(h + 40, s, l), label: "+40°" },
      ];
    case "split-complementary":
      return [
        { hex: seed, label: "base" },
        { hex: hslToHex(h + 150, s, l), label: "split 1" },
        { hex: hslToHex(h + 210, s, l), label: "split 2" },
        { hex: hslToHex(h, s, Math.min(l + 25, 90)), label: "light" },
        {
          hex: hslToHex(h + 180, s, Math.max(l - 15, 10)),
          label: "comp. dark",
        },
      ];
    case "tetradic":
      return [
        { hex: seed, label: "base" },
        { hex: hslToHex(h + 90, s, l), label: "90°" },
        { hex: hslToHex(h + 180, s, l), label: "180°" },
        { hex: hslToHex(h + 270, s, l), label: "270°" },
        {
          hex: hslToHex(h, Math.max(s - 30, 5), Math.min(l + 30, 90)),
          label: "neutral",
        },
      ];
    case "monochromatic":
      return [
        { hex: hslToHex(h, s, Math.max(l - 30, 5)), label: "darkest" },
        { hex: hslToHex(h, s, Math.max(l - 15, 10)), label: "dark" },
        { hex: seed, label: "base" },
        { hex: hslToHex(h, s, Math.min(l + 15, 90)), label: "light" },
        { hex: hslToHex(h, s, Math.min(l + 30, 95)), label: "lightest" },
      ];
  }
}

function luminance(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

const HARMONIES: { value: Harmony; label: string }[] = [
  { value: "complementary", label: "complementary" },
  { value: "triadic", label: "triadic" },
  { value: "analogous", label: "analogous" },
  { value: "split-complementary", label: "split comp." },
  { value: "tetradic", label: "tetradic" },
  { value: "monochromatic", label: "monochromatic" },
];

export default function PalettePage() {
  const [seed, setSeed] = useState("#a855c8");
  const [harmony, setHarmony] = useState<Harmony>("complementary");
  const [copied, setCopied] = useState<string | null>(null);

  const palette = generatePalette(seed, harmony);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(null), 1500);
    });
  }, []);

  const randomize = () => {
    const rand = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0");
    setSeed(`#${rand}`);
  };

  const isValidHex = /^#[0-9a-fA-F]{6}$/.test(seed);

  return (
    <ToolPage
      title="color palette generator"
      description="generate harmonious palettes from any seed color. click any swatch to copy."
      category="generators"
    >
      {/* controls */}
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "flex-end",
          marginBottom: 28,
          flexWrap: "wrap",
        }}
      >
        {/* seed color */}
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
            seed color
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="color"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              style={{
                width: 40,
                height: 36,
                padding: 2,
                border: "1.5px solid var(--border)",
                borderRadius: 6,
                cursor: "pointer",
                background: "var(--card)",
              }}
            />
            <input
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              style={{ width: 110, fontFamily: "var(--font-mono)" }}
              maxLength={7}
            />
          </div>
        </div>

        {/* harmony */}
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
            harmony
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {HARMONIES.map((h) => (
              <button
                key={h.value}
                onClick={() => setHarmony(h.value)}
                className={
                  harmony === h.value ? "btn btn-primary" : "btn btn-ghost"
                }
                style={{ fontSize: 11, padding: "5px 11px" }}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>

        {/* randomize */}
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
            random
          </div>
          <button className="btn btn-ghost" onClick={randomize}>
            ✦ randomize
          </button>
        </div>
      </div>

      {isValidHex && (
        <>
          {/* large swatches */}
          <div
            style={{
              display: "flex",
              borderRadius: 10,
              overflow: "hidden",
              marginBottom: 20,
              height: 110,
            }}
          >
            {palette.map((color) => (
              <button
                key={color.hex}
                onClick={() => copy(color.hex)}
                title={`copy ${color.hex}`}
                style={{
                  flex: 1,
                  background: color.hex,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  padding: "8px 4px",
                  transition: "flex 0.15s",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color:
                      luminance(color.hex) > 0.5
                        ? "rgba(0,0,0,0.55)"
                        : "rgba(255,255,255,0.8)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {copied === color.hex ? "copied ✦" : color.hex}
                </span>
              </button>
            ))}
          </div>

          {/* color detail cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 8,
            }}
          >
            {palette.map((color) => {
              const [h, s, l] = hexToHsl(color.hex);
              const r = parseInt(color.hex.slice(1, 3), 16);
              const g = parseInt(color.hex.slice(3, 5), 16);
              const b = parseInt(color.hex.slice(5, 7), 16);
              return (
                <div
                  key={color.hex}
                  style={{
                    background: "var(--card)",
                    border: "1.5px solid var(--border)",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ height: 36, background: color.hex }} />
                  <div style={{ padding: "10px 10px 12px" }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "var(--ink)",
                        marginBottom: 6,
                      }}
                    >
                      {color.label}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      <button
                        onClick={() => copy(color.hex)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color:
                              copied === color.hex
                                ? "var(--accent)"
                                : "var(--ink-muted)",
                          }}
                        >
                          {copied === color.hex
                            ? "copied!"
                            : color.hex.toUpperCase()}
                        </span>
                      </button>
                      <button
                        onClick={() => copy(`rgb(${r}, ${g}, ${b})`)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "var(--ink-ghost)",
                          }}
                        >
                          rgb({r},{g},{b})
                        </span>
                      </button>
                      <button
                        onClick={() => copy(`hsl(${h}, ${s}%, ${l}%)`)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "var(--ink-ghost)",
                          }}
                        >
                          hsl({h},{s}%,{l}%)
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* copy all */}
          <div style={{ marginTop: 16 }}>
            <button
              className="btn btn-ghost"
              onClick={() =>
                copy(
                  palette
                    .map((c, i) => `--color-${i + 1}: ${c.hex};`)
                    .join("\n"),
                )
              }
            >
              copy all as CSS variables
            </button>
          </div>
        </>
      )}
    </ToolPage>
  );
}
