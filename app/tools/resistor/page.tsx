"use client";
import { useState } from "react";
import ToolPage from "@/components/ToolPage";

const COLORS = [
  { name: "black", hex: "#1a1917", digit: 0, multiplier: 1, tolerance: null },
  { name: "brown", hex: "#7B3F00", digit: 1, multiplier: 10, tolerance: "±1%" },
  { name: "red", hex: "#C0392B", digit: 2, multiplier: 100, tolerance: "±2%" },
  {
    name: "orange",
    hex: "#E67E22",
    digit: 3,
    multiplier: 1000,
    tolerance: null,
  },
  {
    name: "yellow",
    hex: "#F4D03F",
    digit: 4,
    multiplier: 10000,
    tolerance: null,
  },
  {
    name: "green",
    hex: "#27AE60",
    digit: 5,
    multiplier: 100000,
    tolerance: "±0.5%",
  },
  {
    name: "blue",
    hex: "#2980B9",
    digit: 6,
    multiplier: 1000000,
    tolerance: "±0.25%",
  },
  {
    name: "violet",
    hex: "#8E44AD",
    digit: 7,
    multiplier: 10000000,
    tolerance: "±0.1%",
  },
  {
    name: "grey",
    hex: "#7F8C8D",
    digit: 8,
    multiplier: null,
    tolerance: "±0.05%",
  },
  {
    name: "white",
    hex: "#ECE9E4",
    digit: 9,
    multiplier: null,
    tolerance: null,
  },
  {
    name: "gold",
    hex: "#D4AC0D",
    digit: null,
    multiplier: 0.1,
    tolerance: "±5%",
  },
  {
    name: "silver",
    hex: "#AAB7B8",
    digit: null,
    multiplier: 0.01,
    tolerance: "±10%",
  },
];

const DIGIT_COLORS = COLORS.filter((c) => c.digit !== null);
const MULTIPLIER_COLORS = COLORS.filter((c) => c.multiplier !== null);
const TOLERANCE_COLORS = COLORS.filter((c) => c.tolerance !== null);

function formatOhms(ohms: number): string {
  if (ohms >= 1_000_000) return `${+(ohms / 1_000_000).toPrecision(4)} MΩ`;
  if (ohms >= 1_000) return `${+(ohms / 1_000).toPrecision(4)} kΩ`;
  return `${+ohms.toPrecision(4)} Ω`;
}

type BandCount = 4 | 5;

export default function ResistorPage() {
  const [bands, setBands] = useState<BandCount>(4);
  const [b1, setB1] = useState("brown");
  const [b2, setB2] = useState("black");
  const [b3, setB3] = useState("red");
  const [b4, setB4] = useState("gold");
  const [b5, setB5] = useState("brown");

  const getColor = (name: string) => COLORS.find((c) => c.name === name)!;

  let resistance = 0;
  let tolerance = "";
  if (bands === 4) {
    const c1 = getColor(b1),
      c2 = getColor(b2),
      mult = getColor(b3),
      tol = getColor(b4);
    resistance = (c1.digit! * 10 + c2.digit!) * (mult.multiplier ?? 1);
    tolerance = tol.tolerance ?? "";
  } else {
    const c1 = getColor(b1),
      c2 = getColor(b2),
      c3 = getColor(b3),
      mult = getColor(b4),
      tol = getColor(b5);
    resistance =
      (c1.digit! * 100 + c2.digit! * 10 + c3.digit!) * (mult.multiplier ?? 1);
    tolerance = tol.tolerance ?? "";
  }

  const tolNum = tolerance ? parseFloat(tolerance) : null;
  const minR = tolNum !== null ? resistance * (1 - tolNum / 100) : null;
  const maxR = tolNum !== null ? resistance * (1 + tolNum / 100) : null;

  const bandConfig =
    bands === 4
      ? [
          { label: "band 1", colors: DIGIT_COLORS, value: b1, set: setB1 },
          { label: "band 2", colors: DIGIT_COLORS, value: b2, set: setB2 },
          {
            label: "multiplier",
            colors: MULTIPLIER_COLORS,
            value: b3,
            set: setB3,
          },
          {
            label: "tolerance",
            colors: TOLERANCE_COLORS,
            value: b4,
            set: setB4,
          },
        ]
      : [
          { label: "band 1", colors: DIGIT_COLORS, value: b1, set: setB1 },
          { label: "band 2", colors: DIGIT_COLORS, value: b2, set: setB2 },
          { label: "band 3", colors: DIGIT_COLORS, value: b3, set: setB3 },
          {
            label: "multiplier",
            colors: MULTIPLIER_COLORS,
            value: b4,
            set: setB4,
          },
          {
            label: "tolerance",
            colors: TOLERANCE_COLORS,
            value: b5,
            set: setB5,
          },
        ];

  const activeBands =
    bands === 4
      ? [getColor(b1), getColor(b2), getColor(b3), getColor(b4)]
      : [getColor(b1), getColor(b2), getColor(b3), getColor(b4), getColor(b5)];

  return (
    <ToolPage
      title="resistor decoder"
      description="select color bands to decode resistance value, multiplier, and tolerance."
      category="electronics"
    >
      {/* band count toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {([4, 5] as BandCount[]).map((n) => (
          <button
            key={n}
            className={bands === n ? "btn btn-primary" : "btn btn-ghost"}
            onClick={() => setBands(n)}
          >
            {n}-band
          </button>
        ))}
      </div>

      {/* visual resistor */}
      <div style={{ marginBottom: 28 }}>
        <svg
          viewBox="0 0 440 90"
          width="100%"
          style={{ maxWidth: 440, display: "block" }}
        >
          <line
            x1="0"
            y1="45"
            x2="80"
            y2="45"
            stroke="var(--ink-faint)"
            strokeWidth="2"
          />
          <line
            x1="360"
            y1="45"
            x2="440"
            y2="45"
            stroke="var(--ink-faint)"
            strokeWidth="2"
          />
          <rect
            x="80"
            y="22"
            width="280"
            height="46"
            rx="8"
            fill="#f5e6c8"
            stroke="#d4c4a0"
            strokeWidth="1.5"
          />
          {activeBands.map((band, i) => {
            const total = activeBands.length;
            const spacing = 240 / (total + 1);
            const x = 100 + spacing * (i + 1) - 8;
            const isLast = i === total - 1;
            return (
              <rect
                key={i}
                x={isLast ? x + 12 : x}
                y="22"
                width="16"
                height="46"
                fill={band.hex}
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="0.5"
              />
            );
          })}
          <rect x="80" y="22" width="12" height="46" rx="4" fill="#d4c4a0" />
          <rect x="348" y="22" width="12" height="46" rx="4" fill="#d4c4a0" />
        </svg>
      </div>

      {/* band selectors */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${bands}, 1fr)`,
          gap: 10,
          marginBottom: 28,
        }}
      >
        {bandConfig.map((band) => {
          const active = getColor(band.value);
          return (
            <div key={band.label}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-ghost)",
                  letterSpacing: "0.1em",
                  marginBottom: 5,
                  textTransform: "uppercase",
                }}
              >
                {band.label}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--card)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 6,
                  padding: "5px 8px",
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: active.hex,
                    border: "1px solid rgba(0,0,0,0.15)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}
                >
                  {active.name}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {band.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => band.set(c.name)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 6px",
                      borderRadius: 4,
                      border:
                        band.value === c.name
                          ? "1.5px solid var(--accent)"
                          : "1.5px solid transparent",
                      background:
                        band.value === c.name
                          ? "var(--card-hover)"
                          : "transparent",
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 2,
                        background: c.hex,
                        border: "1px solid rgba(0,0,0,0.12)",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                      {c.name}
                    </span>
                    {c.digit !== null && (
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          color: "var(--ink-ghost)",
                          marginLeft: "auto",
                        }}
                      >
                        {c.digit}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* result */}
      <div className="result-box">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--ink-ghost)",
                letterSpacing: "0.1em",
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              resistance
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 28,
                fontWeight: 300,
                color: "var(--ink)",
              }}
            >
              {formatOhms(resistance)}
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--ink-ghost)",
                letterSpacing: "0.1em",
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              tolerance
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 28,
                fontWeight: 300,
                color: "var(--ink)",
              }}
            >
              {tolerance || "—"}
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--ink-ghost)",
                letterSpacing: "0.1em",
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              range
            </div>
            {minR !== null && maxR !== null ? (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--ink-soft)",
                  lineHeight: 1.8,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {formatOhms(minR)}
                <br />
                to {formatOhms(maxR)}
              </div>
            ) : (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 28,
                  fontWeight: 300,
                  color: "var(--ink-ghost)",
                }}
              >
                —
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
