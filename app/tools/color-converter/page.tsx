"use client";
import { useState, useCallback } from "react";
import ToolPage from "@/components/ToolPage";

// --- conversion functions ---

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(v).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
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

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255),
  ];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (max !== min) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  // linear srgb
  const lin = (c: number) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const rl = lin(r),
    gl = lin(g),
    bl = lin(b);
  // to oklab
  const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;
  const l_ = Math.cbrt(l),
    m_ = Math.cbrt(m),
    s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const C = Math.sqrt(a * a + b2 * b2);
  const H = ((Math.atan2(b2, a) * 180) / Math.PI + 360) % 360;
  return [+L.toFixed(4), +C.toFixed(4), +H.toFixed(1)];
}

function rgbToCmyk(
  r: number,
  g: number,
  b: number,
): [number, number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return [0, 0, 0, 100];
  return [
    Math.round(((1 - r - k) / (1 - k)) * 100),
    Math.round(((1 - g - k) / (1 - k)) * 100),
    Math.round(((1 - b - k) / (1 - k)) * 100),
    Math.round(k * 100),
  ];
}

function luminance(r: number, g: number, b: number): number {
  const lin = (c: number) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

type InputFormat = "hex" | "rgb" | "hsl";

function parseInput(
  value: string,
  format: InputFormat,
): [number, number, number] | null {
  if (format === "hex") return hexToRgb(value);
  if (format === "rgb") {
    const m = value.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    if (!m) return null;
    return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  }
  if (format === "hsl") {
    const m = value.match(/(\d+)[,\s]+(\d+)%?[,\s]+(\d+)%?/);
    if (!m) return null;
    return hslToRgb(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
  }
  return null;
}

const SWATCHES = [
  "#FF6B6B",
  "#FF8E53",
  "#FFC75F",
  "#F9F871",
  "#A8E063",
  "#56CCF2",
  "#6B8CFF",
  "#A855C8",
  "#F687B3",
  "#FFFFFF",
  "#888888",
  "#1A1917",
];

export default function ColorConverterPage() {
  const [inputFormat, setInputFormat] = useState<InputFormat>("hex");
  const [inputValue, setInputValue] = useState("#A855C8");
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = parseInput(inputValue, inputFormat);
  const valid = rgb !== null;

  const copy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  }, []);

  let results: { label: string; value: string; key: string }[] = [];

  if (valid && rgb) {
    const [r, g, b] = rgb;
    const [h, s, l] = rgbToHsl(r, g, b);
    const [hv, sv, v] = rgbToHsv(r, g, b);
    const [lch_l, lch_c, lch_h] = rgbToOklch(r, g, b);
    const [c, m, y, k] = rgbToCmyk(r, g, b);
    const lum = luminance(r, g, b);

    results = [
      { label: "hex", value: rgbToHex(r, g, b), key: "hex" },
      { label: "rgb", value: `rgb(${r}, ${g}, ${b})`, key: "rgb" },
      { label: "hsl", value: `hsl(${h}, ${s}%, ${l}%)`, key: "hsl" },
      { label: "hsv", value: `hsv(${hv}, ${sv}%, ${v}%)`, key: "hsv" },
      {
        label: "oklch",
        value: `oklch(${lch_l} ${lch_c} ${lch_h})`,
        key: "oklch",
      },
      { label: "cmyk", value: `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`, key: "cmyk" },
      {
        label: "css var",
        value: `--color: ${rgbToHex(r, g, b)};`,
        key: "cssvar",
      },
      { label: "luminance", value: `${(lum * 100).toFixed(2)}%`, key: "lum" },
    ];
  }

  return (
    <ToolPage
      title="color converter"
      description="convert any color between hex, rgb, hsl, hsv, oklch, and cmyk."
      category="color & design"
    >
      {/* swatches */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-ghost)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          quick pick
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SWATCHES.map((hex) => (
            <button
              key={hex}
              onClick={() => {
                setInputFormat("hex");
                setInputValue(hex);
              }}
              style={{
                width: 28,
                height: 28,
                background: hex,
                border:
                  inputValue.toUpperCase() === hex
                    ? "2px solid var(--accent)"
                    : "1.5px solid var(--border)",
                borderRadius: 6,
                cursor: "pointer",
                transition: "transform 0.1s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          ))}
          <input
            type="color"
            value={valid && rgb ? rgbToHex(...rgb) : "#a855c8"}
            onChange={(e) => {
              setInputFormat("hex");
              setInputValue(e.target.value.toUpperCase());
            }}
            style={{
              width: 28,
              height: 28,
              padding: 2,
              border: "1.5px solid var(--border)",
              borderRadius: 6,
              cursor: "pointer",
            }}
          />
        </div>
      </div>

      {/* input */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-ghost)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          input format
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {(["hex", "rgb", "hsl"] as InputFormat[]).map((f) => (
            <button
              key={f}
              className={
                inputFormat === f ? "btn btn-primary" : "btn btn-ghost"
              }
              style={{ fontSize: 12 }}
              onClick={() => setInputFormat(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              inputFormat === "hex"
                ? "#A855C8"
                : inputFormat === "rgb"
                  ? "168, 85, 200"
                  : "280, 60%, 56%"
            }
            style={{
              maxWidth: 280,
              fontSize: 15,
              fontFamily: "var(--font-mono)",
            }}
          />
          {valid && rgb && (
            <div
              style={{
                width: 44,
                height: 44,
                background: rgbToHex(...rgb),
                borderRadius: 8,
                border: "1.5px solid var(--border)",
                flexShrink: 0,
              }}
            />
          )}
        </div>
        {!valid && inputValue.trim() && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--accent)",
              marginTop: 6,
            }}
          >
            ✦ couldn't parse color — try #hex, r,g,b, or h,s%,l%
          </div>
        )}
      </div>

      {/* results */}
      {valid && rgb && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 8,
          }}
        >
          {results.map((r) => (
            <div
              key={r.key}
              onClick={() => copy(r.value, r.key)}
              style={{
                background: "var(--card)",
                border: "1.5px solid var(--border)",
                borderRadius: 8,
                padding: "12px 14px",
                cursor: "pointer",
                transition: "all 0.12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border-hover)";
                (e.currentTarget as HTMLElement).style.background =
                  "var(--card-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border)";
                (e.currentTarget as HTMLElement).style.background =
                  "var(--card)";
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-ghost)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 5,
                }}
              >
                {r.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: copied === r.key ? "var(--accent)" : "var(--ink)",
                  wordBreak: "break-all",
                }}
              >
                {copied === r.key ? "copied ✦" : r.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolPage>
  );
}
