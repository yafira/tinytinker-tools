"use client";
import { useId, useState } from "react";
import ToolPage from "@/components/ToolPage";

type Solve = "Vout" | "R1" | "R2" | "Vin";

const R_UNITS = ["Ω", "kΩ", "MΩ"];
const R_MULT: Record<string, number> = { Ω: 1, kΩ: 1_000, MΩ: 1_000_000 };

// E24 series, the common 5% resistor values
const E24 = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9,
  4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
];

const PRESETS = [
  {
    label: "5V → 3.3V logic",
    vin: "5",
    vout: "3.3",
    r1: ["1", "kΩ"],
    r2: ["2", "kΩ"],
  },
  {
    label: "12V → 5V adc",
    vin: "12",
    vout: "5",
    r1: ["14", "kΩ"],
    r2: ["10", "kΩ"],
  },
  {
    label: "lipo battery monitor",
    vin: "4.2",
    vout: "2.1",
    r1: ["100", "kΩ"],
    r2: ["100", "kΩ"],
  },
  {
    label: "velostat / fsr sensor",
    vin: "3.3",
    vout: "1.65",
    r1: ["10", "kΩ"],
    r2: ["10", "kΩ"],
  },
];

function toOhms(val: string, unit: string) {
  const n = parseFloat(val);
  return isNaN(n) ? NaN : n * R_MULT[unit];
}

function valid(n: number) {
  return isFinite(n) && n > 0;
}

function fmtOhms(r: number) {
  if (!valid(r)) return "—";
  if (r >= 1_000_000) return `${+(r / 1_000_000).toPrecision(4)} MΩ`;
  if (r >= 1_000) return `${+(r / 1_000).toPrecision(4)} kΩ`;
  return `${+r.toPrecision(4)} Ω`;
}

function fmtVolts(v: number) {
  if (!isFinite(v) || v <= 0) return "—";
  if (v < 1) return `${+(v * 1000).toPrecision(4)} mV`;
  return `${+v.toPrecision(4)} V`;
}

function fmtAmps(a: number) {
  if (!valid(a)) return "—";
  if (a >= 1) return `${+a.toPrecision(3)} A`;
  if (a >= 0.001) return `${+(a * 1000).toPrecision(3)} mA`;
  return `${+(a * 1_000_000).toPrecision(3)} µA`;
}

function fmtWatts(w: number) {
  if (!valid(w)) return "—";
  if (w >= 1) return `${+w.toPrecision(3)} W`;
  if (w >= 0.001) return `${+(w * 1000).toPrecision(3)} mW`;
  return `${+(w * 1_000_000).toPrecision(3)} µW`;
}

// nearest E24 value to any resistance
function nearestE24(r: number) {
  const decade = Math.pow(10, Math.floor(Math.log10(r)));
  const candidates = [...E24.map((v) => v * decade), 10 * decade];
  return candidates.reduce((best, c) =>
    Math.abs(c - r) < Math.abs(best - r) ? c : best,
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  color: "var(--ink-ghost)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: 6,
  display: "block",
};

function Field({
  label,
  value,
  onValue,
  unit,
  onUnit,
  disabled,
  hint,
}: {
  label: string;
  value: string;
  onValue: (v: string) => void;
  unit?: string;
  onUnit?: (u: string) => void;
  disabled?: boolean;
  hint?: string;
}) {
  const id = useId();
  return (
    <div style={{ opacity: disabled ? 0.45 : 1 }}>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          id={id}
          type="number"
          min="0"
          step="any"
          value={disabled ? "" : value}
          onChange={(e) => onValue(e.target.value)}
          placeholder={disabled ? "solving…" : "value"}
          disabled={disabled}
          style={{ flex: 1, minWidth: 0 }}
        />
        {unit && onUnit && (
          <select
            value={unit}
            onChange={(e) => onUnit(e.target.value)}
            disabled={disabled}
            aria-label={`${label} unit`}
            style={{ width: 72, flexShrink: 0 }}
          >
            {R_UNITS.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        )}
      </div>
      {hint && (
        <div style={{ fontSize: 10, color: "var(--ink-ghost)", marginTop: 4 }}>
          {hint}
        </div>
      )}
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 12,
        padding: "8px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--ink-ghost)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 14,
          color: "var(--ink)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// schematic: Vin on top, R1, tap for Vout, R2, ground
function Schematic({ solving }: { solving: Solve }) {
  const hot = (k: Solve) => (solving === k ? "var(--accent)" : "var(--ink-faint)");
  const txt = (k: Solve) => (solving === k ? "var(--accent)" : "var(--ink-muted)");
  const zig = (y: number) =>
    `M60 ${y} l0 6 l-10 4 l20 8 l-20 8 l20 8 l-20 8 l10 4 l0 6`;

  return (
    <svg
      viewBox="0 0 170 250"
      width="150"
      role="img"
      aria-label={`voltage divider schematic, solving for ${solving}`}
      style={{ display: "block", flexShrink: 0 }}
    >
      {/* vin terminal */}
      <circle cx="60" cy="14" r="4" fill="none" stroke={hot("Vin")} strokeWidth="1.5" />
      <text x="72" y="18" fontSize="12" fill={txt("Vin")} fontFamily="var(--font-mono)">
        Vin
      </text>
      <line x1="60" y1="18" x2="60" y2="40" stroke="var(--ink-faint)" strokeWidth="1.5" />

      {/* r1 */}
      <path d={zig(40)} fill="none" stroke={hot("R1")} strokeWidth="1.5" strokeLinejoin="round" />
      <text x="80" y="76" fontSize="12" fill={txt("R1")} fontFamily="var(--font-mono)">
        R1
      </text>

      {/* middle node and vout tap */}
      <line x1="60" y1="92" x2="60" y2="140" stroke="var(--ink-faint)" strokeWidth="1.5" />
      <circle cx="60" cy="116" r="3" fill="var(--ink-faint)" />
      <line x1="60" y1="116" x2="120" y2="116" stroke={hot("Vout")} strokeWidth="1.5" />
      <circle cx="124" cy="116" r="4" fill="none" stroke={hot("Vout")} strokeWidth="1.5" />
      <text x="112" y="104" fontSize="12" fill={txt("Vout")} fontFamily="var(--font-mono)">
        Vout
      </text>

      {/* r2 */}
      <path d={zig(140)} fill="none" stroke={hot("R2")} strokeWidth="1.5" strokeLinejoin="round" />
      <text x="80" y="176" fontSize="12" fill={txt("R2")} fontFamily="var(--font-mono)">
        R2
      </text>

      {/* ground */}
      <line x1="60" y1="192" x2="60" y2="214" stroke="var(--ink-faint)" strokeWidth="1.5" />
      <line x1="44" y1="214" x2="76" y2="214" stroke="var(--ink-faint)" strokeWidth="1.5" />
      <line x1="50" y1="220" x2="70" y2="220" stroke="var(--ink-faint)" strokeWidth="1.5" />
      <line x1="56" y1="226" x2="64" y2="226" stroke="var(--ink-faint)" strokeWidth="1.5" />
    </svg>
  );
}

export default function VoltageDividerPage() {
  const [solving, setSolving] = useState<Solve>("Vout");
  const [vin, setVin] = useState("5");
  const [vout, setVout] = useState("3.3");
  const [r1, setR1] = useState("1");
  const [r1Unit, setR1Unit] = useState("kΩ");
  const [r2, setR2] = useState("2");
  const [r2Unit, setR2Unit] = useState("kΩ");
  const [rl, setRl] = useState("");
  const [rlUnit, setRlUnit] = useState("kΩ");

  const inVin = parseFloat(vin);
  const inVout = parseFloat(vout);
  const inR1 = toOhms(r1, r1Unit);
  const inR2 = toOhms(r2, r2Unit);
  const load = toOhms(rl, rlUnit);

  // solve the unknown, everything else comes from inputs
  let Vin = inVin,
    Vout = inVout,
    R1 = inR1,
    R2 = inR2;
  let error = "";

  if (solving === "Vout") {
    Vout = (Vin * R2) / (R1 + R2);
  } else if (solving === "Vin") {
    Vin = (Vout * (R1 + R2)) / R2;
  } else if (valid(Vin) && valid(Vout) && Vout >= Vin) {
    error = "Vout has to be lower than Vin. a divider can only step voltage down.";
  } else if (solving === "R1") {
    R1 = (R2 * (Vin - Vout)) / Vout;
  } else if (solving === "R2") {
    R2 = (R1 * Vout) / (Vin - Vout);
  }

  const ok = !error && valid(Vin) && valid(Vout) && valid(R1) && valid(R2);

  const current = ok ? Vin / (R1 + R2) : NaN;
  const p1 = current * current * R1;
  const p2 = current * current * R2;
  const ratio = ok ? R2 / (R1 + R2) : NaN;

  // loaded output: R2 in parallel with the load
  const r2Loaded = valid(load) ? (R2 * load) / (R2 + load) : NaN;
  const voutLoaded = ok && valid(load) ? (Vin * r2Loaded) / (R1 + r2Loaded) : NaN;
  const sag = ok && valid(load) ? ((Vout - voutLoaded) / Vout) * 100 : NaN;

  // when solving for a resistor, suggest the nearest real part
  const solvedR = solving === "R1" ? R1 : solving === "R2" ? R2 : NaN;
  const standardR = ok && valid(solvedR) ? nearestE24(solvedR) : NaN;
  const voutWithStandard =
    solving === "R1"
      ? (Vin * R2) / (standardR + R2)
      : solving === "R2"
        ? (Vin * standardR) / (R1 + standardR)
        : NaN;

  const resultValue = {
    Vout: fmtVolts(Vout),
    Vin: fmtVolts(Vin),
    R1: fmtOhms(R1),
    R2: fmtOhms(R2),
  }[solving];

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setVin(p.vin);
    setVout(p.vout);
    setR1(p.r1[0]);
    setR1Unit(p.r1[1]);
    setR2(p.r2[0]);
    setR2Unit(p.r2[1]);
  };

  return (
    <ToolPage
      title="voltage divider"
      description="two resistors in series split a voltage. solve for Vout, R1, R2, or Vin, and check what happens when something is connected to the output."
      category="electronics"
    >
      {/* solve for */}
      <div style={{ marginBottom: 24 }}>
        <span style={{ ...labelStyle, marginBottom: 12 }}>solve for</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(["Vout", "R1", "R2", "Vin"] as Solve[]).map((s) => (
            <button
              key={s}
              onClick={() => setSolving(s)}
              className={solving === s ? "btn btn-primary" : "btn btn-ghost"}
              aria-pressed={solving === s}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* schematic + inputs */}
      <div
        style={{
          display: "flex",
          gap: 28,
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <Schematic solving={solving} />
        <div
          style={{
            flex: 1,
            minWidth: 240,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 14,
          }}
        >
          <Field
            label="Vin (V)"
            value={vin}
            onValue={setVin}
            disabled={solving === "Vin"}
          />
          <Field
            label="Vout (V)"
            value={vout}
            onValue={setVout}
            disabled={solving === "Vout"}
          />
          <Field
            label="R1 (top)"
            value={r1}
            onValue={setR1}
            unit={r1Unit}
            onUnit={setR1Unit}
            disabled={solving === "R1"}
          />
          <Field
            label="R2 (bottom)"
            value={r2}
            onValue={setR2}
            unit={r2Unit}
            onUnit={setR2Unit}
            disabled={solving === "R2"}
            hint={
              solving !== "R2"
                ? "for a sensor (velostat, fsr, ldr), this is the sensor"
                : undefined
            }
          />
        </div>
      </div>

      {/* presets */}
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <span style={{ ...labelStyle, marginBottom: 0, marginRight: 4 }}>
          try
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className="btn btn-ghost"
            style={{ fontSize: 11, padding: "4px 10px" }}
            onClick={() => applyPreset(p)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* result */}
      <div className="result-box" style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          <div>
            <span style={labelStyle}>{solving}</span>
            <div
              aria-live="polite"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 36,
                fontWeight: 300,
                color: error ? "var(--ink-ghost)" : "var(--ink)",
                lineHeight: 1.2,
              }}
            >
              {ok ? resultValue : "—"}
            </div>
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--ink-ghost)",
              lineHeight: 2,
              textAlign: "right",
            }}
          >
            Vout = Vin × R2 / (R1 + R2)
          </div>
        </div>

        {error && (
          <p style={{ fontSize: 12, color: "var(--accent)", margin: "0 0 8px" }}>
            {error}
          </p>
        )}

        {ok && valid(standardR) && (
          <p
            style={{
              fontSize: 12,
              color: "var(--ink-muted)",
              margin: "0 0 8px",
              lineHeight: 1.7,
            }}
          >
            nearest standard (E24) value is{" "}
            <strong style={{ color: "var(--ink)", fontWeight: 500 }}>
              {fmtOhms(standardR)}
            </strong>
            , which gives Vout ≈ {fmtVolts(voutWithStandard)}
          </p>
        )}

        {ok && (
          <div>
            <ResultRow label="ratio (Vout / Vin)" value={ratio.toFixed(3)} />
            <ResultRow label="divider current" value={fmtAmps(current)} />
            <ResultRow label="power in R1" value={fmtWatts(p1)} />
            <ResultRow label="power in R2" value={fmtWatts(p2)} />
          </div>
        )}
      </div>

      {/* load check */}
      <div
        style={{ borderTop: "1.5px solid var(--border)", margin: "32px 0 24px" }}
      />
      <span style={{ ...labelStyle, marginBottom: 12 }}>load check</span>
      <p
        style={{
          fontSize: 12,
          color: "var(--ink-muted)",
          marginBottom: 16,
          lineHeight: 1.7,
        }}
      >
        anything connected to Vout sits in parallel with R2 and pulls the
        voltage down. enter the input resistance of whatever you are driving
        (a microcontroller adc pin is usually 10kΩ or more).
      </p>
      <div style={{ maxWidth: 260, marginBottom: 16 }}>
        <Field
          label="load resistance"
          value={rl}
          onValue={setRl}
          unit={rlUnit}
          onUnit={setRlUnit}
        />
      </div>
      {ok && valid(load) && (
        <div className="result-box">
          <ResultRow label="Vout with load" value={fmtVolts(voutLoaded)} />
          <ResultRow label="drop from unloaded" value={`${sag.toFixed(1)}%`} />
          <p
            style={{
              fontSize: 12,
              color: "var(--ink-muted)",
              margin: "10px 0 0",
              lineHeight: 1.7,
            }}
          >
            {sag < 1
              ? "barely affected. the load is much bigger than R2."
              : sag < 10
                ? "noticeable sag. smaller divider resistors will hold the voltage better, at the cost of more current."
                : "big sag. make R1 and R2 smaller, or buffer the output with an op-amp."}
          </p>
        </div>
      )}
    </ToolPage>
  );
}
