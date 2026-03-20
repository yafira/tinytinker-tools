"use client";
import { useState } from "react";
import ToolPage from "@/components/ToolPage";

type Mode = "astable" | "monostable";

function astable(r1: number, r2: number, c: number) {
  const f = 1.44 / ((r1 + 2 * r2) * c);
  const tHigh = 0.693 * (r1 + r2) * c;
  const tLow = 0.693 * r2 * c;
  const period = tHigh + tLow;
  const duty = ((r1 + r2) / (r1 + 2 * r2)) * 100;
  return { f, tHigh, tLow, period, duty };
}

function monostable(r: number, c: number) {
  const t = 1.1 * r * c;
  return { t };
}

function fmtTime(s: number): string {
  if (s >= 1) return `${+s.toPrecision(4)} s`;
  if (s >= 0.001) return `${+(s * 1000).toPrecision(4)} ms`;
  if (s >= 0.000001) return `${+(s * 1_000_000).toPrecision(4)} µs`;
  return `${+(s * 1_000_000_000).toPrecision(4)} ns`;
}

function fmtFreq(hz: number): string {
  if (hz >= 1_000_000) return `${+(hz / 1_000_000).toPrecision(4)} MHz`;
  if (hz >= 1_000) return `${+(hz / 1_000).toPrecision(4)} kHz`;
  return `${+hz.toPrecision(4)} Hz`;
}

function parseWithUnit(val: string, unit: string): number {
  const n = parseFloat(val);
  if (isNaN(n)) return NaN;
  if (unit === "kΩ") return n * 1_000;
  if (unit === "MΩ") return n * 1_000_000;
  if (unit === "µF") return n * 1e-6;
  if (unit === "nF") return n * 1e-9;
  if (unit === "pF") return n * 1e-12;
  return n;
}

const R_UNITS = ["Ω", "kΩ", "MΩ"];
const C_UNITS = ["µF", "nF", "pF"];

function UnitInput({
  label,
  value,
  unit,
  units,
  onValue,
  onUnit,
}: {
  label: string;
  value: string;
  unit: string;
  units: string[];
  onValue: (v: string) => void;
  onUnit: (u: string) => void;
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--ink-ghost)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          type="number"
          value={value}
          onChange={(e) => onValue(e.target.value)}
          placeholder="value"
          style={{ flex: 1 }}
        />
        <select
          value={unit}
          onChange={(e) => onUnit(e.target.value)}
          style={{ width: 72 }}
        >
          {units.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
      </div>
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
        padding: "10px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
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
          fontSize: 20,
          fontWeight: 300,
          color: "var(--ink)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function Timer555Page() {
  const [mode, setMode] = useState<Mode>("astable");

  const [r1, setR1] = useState("10");
  const [r1Unit, setR1Unit] = useState("kΩ");
  const [r2, setR2] = useState("10");
  const [r2Unit, setR2Unit] = useState("kΩ");
  const [c, setC] = useState("100");
  const [cUnit, setCUnit] = useState("nF");

  const [rm, setRm] = useState("100");
  const [rmUnit, setRmUnit] = useState("kΩ");
  const [cm, setCm] = useState("10");
  const [cmUnit, setCmUnit] = useState("µF");

  const r1v = parseWithUnit(r1, r1Unit);
  const r2v = parseWithUnit(r2, r2Unit);
  const cv = parseWithUnit(c, cUnit);
  const rmv = parseWithUnit(rm, rmUnit);
  const cmv = parseWithUnit(cm, cmUnit);

  const aResult =
    !isNaN(r1v) && !isNaN(r2v) && !isNaN(cv) && r1v > 0 && r2v > 0 && cv > 0
      ? astable(r1v, r2v, cv)
      : null;

  const mResult =
    !isNaN(rmv) && !isNaN(cmv) && rmv > 0 && cmv > 0
      ? monostable(rmv, cmv)
      : null;

  return (
    <ToolPage
      title="555 timer calculator"
      description="calculate frequency, duty cycle and timing for 555 timer circuits in astable and monostable modes."
      category="electronics"
    >
      {/* mode toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        <button
          className={mode === "astable" ? "btn btn-primary" : "btn btn-ghost"}
          onClick={() => setMode("astable")}
        >
          astable
        </button>
        <button
          className={
            mode === "monostable" ? "btn btn-primary" : "btn btn-ghost"
          }
          onClick={() => setMode("monostable")}
        >
          monostable
        </button>
      </div>

      {/* astable mode */}
      {mode === "astable" && (
        <div>
          <p
            style={{
              fontSize: 13,
              color: "var(--ink-muted)",
              marginBottom: 24,
              lineHeight: 1.7,
            }}
          >
            astable mode generates a continuous square wave. frequency and duty
            cycle are set by R1, R2 and C.
          </p>

          {/* circuit diagram */}
          <div style={{ marginBottom: 28 }}>
            <svg
              viewBox="0 0 520 200"
              width="100%"
              style={{ maxWidth: 520, display: "block" }}
            >
              {/* VCC label + line down */}
              <text
                x="60"
                y="14"
                fontFamily="var(--font-mono)"
                fontSize="11"
                fill="var(--ink-ghost)"
                textAnchor="middle"
              >
                VCC
              </text>
              <line
                x1="60"
                y1="18"
                x2="60"
                y2="35"
                stroke="var(--ink-faint)"
                strokeWidth="1.5"
              />

              {/* R1 */}
              <rect
                x="46"
                y="35"
                width="28"
                height="36"
                rx="3"
                fill="var(--card)"
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
              <text
                x="60"
                y="57"
                fontFamily="var(--font-mono)"
                fontSize="11"
                fill="var(--accent)"
                textAnchor="middle"
              >
                R1
              </text>
              <line
                x1="60"
                y1="71"
                x2="60"
                y2="88"
                stroke="var(--ink-faint)"
                strokeWidth="1.5"
              />

              {/* junction dot R1/R2/pin7 */}
              <circle cx="60" cy="88" r="3" fill="var(--ink-faint)" />

              {/* R2 */}
              <rect
                x="46"
                y="88"
                width="28"
                height="36"
                rx="3"
                fill="var(--card)"
                stroke="var(--accent-soft)"
                strokeWidth="1.5"
              />
              <text
                x="60"
                y="110"
                fontFamily="var(--font-mono)"
                fontSize="11"
                fill="var(--accent-soft)"
                textAnchor="middle"
              >
                R2
              </text>
              <line
                x1="60"
                y1="124"
                x2="60"
                y2="142"
                stroke="var(--ink-faint)"
                strokeWidth="1.5"
              />

              {/* junction dot R2/pin2/pin6/C */}
              <circle cx="60" cy="142" r="3" fill="var(--ink-faint)" />

              {/* C */}
              <rect
                x="46"
                y="142"
                width="28"
                height="30"
                rx="3"
                fill="var(--card)"
                stroke="#56CCF2"
                strokeWidth="1.5"
              />
              <text
                x="60"
                y="161"
                fontFamily="var(--font-mono)"
                fontSize="11"
                fill="#56CCF2"
                textAnchor="middle"
              >
                C
              </text>
              <line
                x1="60"
                y1="172"
                x2="60"
                y2="188"
                stroke="var(--ink-faint)"
                strokeWidth="1.5"
              />

              {/* GND symbol */}
              <line
                x1="48"
                y1="188"
                x2="72"
                y2="188"
                stroke="var(--ink-faint)"
                strokeWidth="2"
              />
              <line
                x1="52"
                y1="192"
                x2="68"
                y2="192"
                stroke="var(--ink-faint)"
                strokeWidth="1.5"
              />
              <line
                x1="56"
                y1="196"
                x2="64"
                y2="196"
                stroke="var(--ink-faint)"
                strokeWidth="1"
              />

              {/* pin 7 — from R1/R2 junction to 555 */}
              <line
                x1="60"
                y1="88"
                x2="240"
                y2="88"
                stroke="var(--ink-faint)"
                strokeWidth="1.5"
              />
              <text
                x="130"
                y="80"
                fontFamily="var(--font-mono)"
                fontSize="9"
                fill="var(--ink-ghost)"
              >
                pin 7 (discharge)
              </text>

              {/* pin 2/6 — from R2/C junction to 555 */}
              <line
                x1="60"
                y1="142"
                x2="120"
                y2="142"
                stroke="var(--ink-faint)"
                strokeWidth="1.5"
              />
              <line
                x1="120"
                y1="142"
                x2="120"
                y2="120"
                stroke="var(--ink-faint)"
                strokeWidth="1.5"
              />
              <line
                x1="120"
                y1="120"
                x2="240"
                y2="120"
                stroke="var(--ink-faint)"
                strokeWidth="1.5"
              />
              <text
                x="130"
                y="138"
                fontFamily="var(--font-mono)"
                fontSize="9"
                fill="var(--ink-ghost)"
              >
                pin 2/6
              </text>

              {/* 555 IC box */}
              <rect
                x="240"
                y="60"
                width="120"
                height="110"
                rx="6"
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth="1.5"
              />
              <text
                x="300"
                y="118"
                fontFamily="var(--font-mono)"
                fontSize="16"
                fill="var(--ink)"
                textAnchor="middle"
                fontWeight="500"
              >
                555
              </text>

              {/* pin labels inside 555 */}
              <text
                x="248"
                y="94"
                fontFamily="var(--font-mono)"
                fontSize="8"
                fill="var(--ink-ghost)"
              >
                7
              </text>
              <text
                x="248"
                y="124"
                fontFamily="var(--font-mono)"
                fontSize="8"
                fill="var(--ink-ghost)"
              >
                2/6
              </text>
              <text
                x="248"
                y="154"
                fontFamily="var(--font-mono)"
                fontSize="8"
                fill="var(--ink-ghost)"
              >
                1
              </text>
              <text
                x="344"
                y="104"
                fontFamily="var(--font-mono)"
                fontSize="8"
                fill="var(--ink-ghost)"
              >
                3
              </text>
              <text
                x="344"
                y="74"
                fontFamily="var(--font-mono)"
                fontSize="8"
                fill="var(--ink-ghost)"
              >
                8
              </text>

              {/* VCC to pin 8 — dashed */}
              <line
                x1="60"
                y1="18"
                x2="300"
                y2="18"
                stroke="var(--ink-faint)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <line
                x1="300"
                y1="18"
                x2="300"
                y2="60"
                stroke="var(--ink-faint)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text
                x="310"
                y="40"
                fontFamily="var(--font-mono)"
                fontSize="9"
                fill="var(--ink-ghost)"
              >
                pin 8 (VCC)
              </text>

              {/* GND to pin 1 — dashed */}
              <line
                x1="60"
                y1="188"
                x2="270"
                y2="188"
                stroke="var(--ink-faint)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <line
                x1="270"
                y1="188"
                x2="270"
                y2="170"
                stroke="var(--ink-faint)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text
                x="275"
                y="185"
                fontFamily="var(--font-mono)"
                fontSize="9"
                fill="var(--ink-ghost)"
              >
                pin 1 (GND)
              </text>

              {/* output pin 3 */}
              <line
                x1="360"
                y1="100"
                x2="430"
                y2="100"
                stroke="var(--ink-faint)"
                strokeWidth="1.5"
              />
              <text
                x="434"
                y="104"
                fontFamily="var(--font-mono)"
                fontSize="11"
                fill="var(--ink-ghost)"
              >
                output
              </text>
            </svg>
          </div>

          {/* inputs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
              marginBottom: 24,
            }}
          >
            <UnitInput
              label="R1"
              value={r1}
              unit={r1Unit}
              units={R_UNITS}
              onValue={setR1}
              onUnit={setR1Unit}
            />
            <UnitInput
              label="R2"
              value={r2}
              unit={r2Unit}
              units={R_UNITS}
              onValue={setR2}
              onUnit={setR2Unit}
            />
            <UnitInput
              label="C"
              value={c}
              unit={cUnit}
              units={C_UNITS}
              onValue={setC}
              onUnit={setCUnit}
            />
          </div>

          {/* results */}
          {aResult && (
            <div className="result-box">
              <ResultRow label="frequency" value={fmtFreq(aResult.f)} />
              <ResultRow label="period" value={fmtTime(aResult.period)} />
              <ResultRow
                label="duty cycle"
                value={`${+aResult.duty.toFixed(2)}%`}
              />
              <ResultRow label="time high" value={fmtTime(aResult.tHigh)} />
              <ResultRow label="time low" value={fmtTime(aResult.tLow)} />
            </div>
          )}

          {/* duty cycle bar */}
          {aResult && (
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-ghost)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                duty cycle
              </div>
              <div
                style={{
                  height: 12,
                  background: "var(--border)",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${aResult.duty}%`,
                    height: "100%",
                    background: "var(--accent)",
                    borderRadius: 6,
                    transition: "width 0.3s",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-ghost)",
                  marginTop: 4,
                }}
              >
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* monostable mode */}
      {mode === "monostable" && (
        <div>
          <p
            style={{
              fontSize: 13,
              color: "var(--ink-muted)",
              marginBottom: 24,
              lineHeight: 1.7,
            }}
          >
            monostable mode produces a single pulse when triggered. pulse width
            is set by R and C. formula: t = 1.1 × R × C
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginBottom: 24,
            }}
          >
            <UnitInput
              label="R"
              value={rm}
              unit={rmUnit}
              units={R_UNITS}
              onValue={setRm}
              onUnit={setRmUnit}
            />
            <UnitInput
              label="C"
              value={cm}
              unit={cmUnit}
              units={C_UNITS}
              onValue={setCm}
              onUnit={setCmUnit}
            />
          </div>

          {mResult && (
            <div className="result-box">
              <ResultRow label="pulse width" value={fmtTime(mResult.t)} />
            </div>
          )}
        </div>
      )}

      {/* pin reference */}
      <div
        style={{
          marginTop: 32,
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
          pin reference
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 6,
          }}
        >
          {[
            { pin: "1", label: "GND" },
            { pin: "2", label: "trigger" },
            { pin: "3", label: "output" },
            { pin: "4", label: "reset (active low)" },
            { pin: "5", label: "control voltage" },
            { pin: "6", label: "threshold" },
            { pin: "7", label: "discharge" },
            { pin: "8", label: "VCC" },
          ].map((p) => (
            <div
              key={p.pin}
              style={{ display: "flex", gap: 10, alignItems: "center" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--accent)",
                  background: "rgba(96,48,168,0.08)",
                  padding: "1px 7px",
                  borderRadius: 3,
                  minWidth: 24,
                  textAlign: "center",
                }}
              >
                {p.pin}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--ink-soft)",
                }}
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ToolPage>
  );
}
