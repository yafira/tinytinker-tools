"use client";
import { useState } from "react";
import ToolPage from "@/components/ToolPage";

const layout = {
  steps: [
    "print both sides (duplex) or print front, flip on long edge, print back.",
    "fold the sheet in half horizontally (landscape → portrait).",
    "fold in half again (top to bottom).",
    "cut along the center fold of the top half only.",
    "open the sheet, refold on the short edge, and push the ends together to form the zine.",
  ],
  front: [
    { page: 8, rotate: true, label: "p.8 (back cover)" },
    { page: 1, rotate: false, label: "p.1 (front cover)" },
    { page: 2, rotate: false, label: "p.2" },
    { page: 7, rotate: true, label: "p.7" },
  ],
  back: [
    { page: 6, rotate: true, label: "p.6" },
    { page: 3, rotate: false, label: "p.3" },
    { page: 4, rotate: false, label: "p.4" },
    { page: 5, rotate: true, label: "p.5" },
  ],
};

const paperInfo: Record<string, { dims: string; result: string }> = {
  A4: { dims: "210 × 297 mm", result: "zine pages: 105 × 74 mm" },
  letter: { dims: "8.5 × 11 in", result: "zine pages: 4.25 × 2.75 in" },
  A3: { dims: "297 × 420 mm", result: "zine pages: 148 × 105 mm (A6 size)" },
};

function ZineGrid({
  panels,
  side,
}: {
  panels: typeof layout.front;
  side: string;
}) {
  const W = 420,
    H = 140,
    cellW = W / 4;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{
        maxWidth: W,
        display: "block",
        borderRadius: 8,
        border: "1.5px solid var(--border)",
      }}
    >
      <rect x="0" y="0" width={W} height={H} fill="var(--card)" rx="6" />
      {panels.map((cell, i) => {
        const x = i * cellW;
        const isCover = cell.page === 1 || cell.page === 8;
        const fill = isCover
          ? "rgba(168,85,200,0.08)"
          : i % 2 === 0
            ? "rgba(168,85,200,0.03)"
            : "transparent";
        return (
          <g key={i}>
            <rect x={x} y={0} width={cellW} height={H} fill={fill} />
            <text
              x={x + cellW / 2}
              y={H / 2 - 12}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isCover ? "#a855c8" : "var(--ink)"}
              fontSize={isCover ? "22" : "20"}
              fontFamily="var(--font-mono)"
              fontWeight="300"
              transform={
                cell.rotate ? `rotate(180, ${x + cellW / 2}, ${H / 2})` : ""
              }
            >
              {cell.page}
            </text>
            <text
              x={x + cellW / 2}
              y={H / 2 + 14}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isCover ? "#c084d4" : "var(--ink-ghost)"}
              fontSize="9"
              fontFamily="var(--font-mono)"
              transform={
                cell.rotate ? `rotate(180, ${x + cellW / 2}, ${H / 2})` : ""
              }
            >
              {cell.label}
            </text>
          </g>
        );
      })}
      {/* dividers */}
      {[1, 2, 3].map((i) => (
        <line
          key={i}
          x1={cellW * i}
          y1={0}
          x2={cellW * i}
          y2={H}
          stroke="var(--border)"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
      ))}
      {/* cut line on front */}
      {side === "front" && (
        <>
          <line
            x1={cellW * 2}
            y1={0}
            x2={cellW * 2}
            y2={H / 2}
            stroke="#a855c8"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
          <text
            x={cellW * 2 + 4}
            y={H / 4}
            fill="#a855c8"
            fontSize="8"
            fontFamily="var(--font-mono)"
          >
            cut
          </text>
        </>
      )}
    </svg>
  );
}

export default function ZineImposerPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [paperSize, setPaperSize] = useState("A4");

  return (
    <ToolPage
      title="zine imposer"
      description="layout guide for printing and folding an 8-page mini-zine from a single sheet of paper."
      category="print & zine"
    >
      {/* paper size */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 28,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--ink-ghost)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          paper size
        </span>
        {["A4", "letter", "A3"].map((p) => (
          <button
            key={p}
            onClick={() => setPaperSize(p)}
            className={paperSize === p ? "btn btn-primary" : "btn btn-ghost"}
            style={{ fontSize: 11, padding: "5px 14px" }}
          >
            {p}
          </button>
        ))}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-muted)",
          }}
        >
          {paperInfo[paperSize].dims} → {paperInfo[paperSize].result}
        </span>
      </div>

      {/* print layout */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
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
              side a — front
            </div>
            <ZineGrid panels={layout.front} side="front" />
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
              side b — back (flip on long edge)
            </div>
            <ZineGrid panels={layout.back} side="back" />
          </div>
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 11,
            color: "var(--ink-ghost)",
            fontFamily: "var(--font-mono)",
          }}
        >
          purple dashed line = cut here (center of top half only). rotated cells
          print upside down by design.
        </div>
      </div>

      {/* page order */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--ink-ghost)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          page order — reading sequence
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
            <div
              key={p}
              style={{
                flex: 1,
                background:
                  p === 1 || p === 8 ? "rgba(168,85,200,0.1)" : "var(--card)",
                border: `1.5px solid ${p === 1 || p === 8 ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 6,
                padding: "10px 6px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  fontWeight: 300,
                  color: p === 1 || p === 8 ? "var(--accent)" : "var(--ink)",
                }}
              >
                {p}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "var(--ink-ghost)",
                  marginTop: 2,
                }}
              >
                {p === 1 ? "cover" : p === 8 ? "back" : `p.${p}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* folding steps */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--ink-ghost)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          folding steps
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {layout.steps.map((step, i) => (
            <div
              key={i}
              onClick={() => setCurrentStep(i)}
              style={{
                display: "flex",
                gap: 14,
                padding: "12px 14px",
                background:
                  currentStep === i ? "rgba(168,85,200,0.08)" : "var(--card)",
                border: `1.5px solid ${currentStep === i ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.12s",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background:
                    currentStep === i ? "var(--accent)" : "var(--border)",
                  color: currentStep === i ? "white" : "var(--ink-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--ink-soft)",
                  lineHeight: 1.6,
                  paddingTop: 2,
                }}
              >
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* tips */}
      <div
        style={{
          padding: "14px 16px",
          background: "var(--card)",
          border: "1.5px solid var(--border)",
          borderRadius: 8,
        }}
      >
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
          tips
        </div>
        <ul
          style={{
            fontSize: 12,
            color: "var(--ink-muted)",
            lineHeight: 2,
            paddingLeft: 18,
          }}
        >
          <li>
            use 80gsm paper for easy folding; 120gsm for a more substantial
            feel.
          </li>
          <li>
            score fold lines with a bone folder or butter knife + ruler for
            crisp edges.
          </li>
          <li>
            print at 100% scale — disable "fit to page" in your print settings.
          </li>
          <li>leave 5mm margins on all sides for bleed/trim.</li>
        </ul>
      </div>
    </ToolPage>
  );
}
