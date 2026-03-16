"use client";
import { useState } from "react";
import ToolPage from "@/components/ToolPage";

type Mode = "text" | "number";

function textToBinary(text: string): string {
  return text
    .split("")
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

function textToHex(text: string): string {
  return text
    .split("")
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase())
    .join(" ");
}

function textToOctal(text: string): string {
  return text
    .split("")
    .map((c) => c.charCodeAt(0).toString(8).padStart(3, "0"))
    .join(" ");
}

function textToDecimal(text: string): string {
  return text
    .split("")
    .map((c) => c.charCodeAt(0))
    .join(" ");
}

function numberConvert(input: string, from: Base): Record<Base, string> {
  let decimal: number;
  try {
    if (from === "decimal") decimal = parseInt(input, 10);
    else if (from === "binary") decimal = parseInt(input.replace(/\s/g, ""), 2);
    else if (from === "hex") decimal = parseInt(input.replace(/\s/g, ""), 16);
    else decimal = parseInt(input.replace(/\s/g, ""), 8);
    if (isNaN(decimal)) throw new Error();
  } catch {
    return { decimal: "—", binary: "—", hex: "—", octal: "—" };
  }
  return {
    decimal: decimal.toString(10),
    binary: decimal.toString(2),
    hex: decimal.toString(16).toUpperCase(),
    octal: decimal.toString(8),
  };
}

type Base = "decimal" | "binary" | "hex" | "octal";

const BASE_INFO: Record<
  Base,
  { label: string; placeholder: string; prefix: string }
> = {
  decimal: { label: "decimal (base 10)", placeholder: "e.g. 255", prefix: "" },
  binary: {
    label: "binary (base 2)",
    placeholder: "e.g. 11111111",
    prefix: "0b",
  },
  hex: { label: "hex (base 16)", placeholder: "e.g. FF", prefix: "0x" },
  octal: { label: "octal (base 8)", placeholder: "e.g. 377", prefix: "0o" },
};

export default function BinaryConverterPage() {
  const [mode, setMode] = useState<Mode>("text");
  const [textInput, setTextInput] = useState("hello world");
  const [numInput, setNumInput] = useState("255");
  const [fromBase, setFromBase] = useState<Base>("decimal");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  const numResults = numberConvert(numInput, fromBase);

  return (
    <ToolPage
      title="binary / hex converter"
      description="convert text or numbers between binary, hex, octal, and decimal."
      category="code & dev"
    >
      {/* mode toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        <button
          className={mode === "text" ? "btn btn-primary" : "btn btn-ghost"}
          onClick={() => setMode("text")}
        >
          text → bases
        </button>
        <button
          className={mode === "number" ? "btn btn-primary" : "btn btn-ghost"}
          onClick={() => setMode("number")}
        >
          number converter
        </button>
      </div>

      {/* text mode */}
      {mode === "text" && (
        <div>
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
              input text
            </div>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="type anything…"
              style={{ fontSize: 15 }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "binary", value: textToBinary(textInput), key: "bin" },
              { label: "hexadecimal", value: textToHex(textInput), key: "hex" },
              { label: "octal", value: textToOctal(textInput), key: "oct" },
              {
                label: "decimal (ascii)",
                value: textToDecimal(textInput),
                key: "dec",
              },
            ].map((row) => (
              <div
                key={row.key}
                style={{
                  background: "var(--card)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 8,
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--ink-ghost)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {row.label}
                  </div>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 10, padding: "2px 8px" }}
                    onClick={() => copy(row.value, row.key)}
                  >
                    {copied === row.key ? "copied ✦" : "copy"}
                  </button>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--ink-soft)",
                    wordBreak: "break-all",
                    lineHeight: 1.8,
                  }}
                >
                  {row.value || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* number mode */}
      {mode === "number" && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink-ghost)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              convert from
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              {(["decimal", "binary", "hex", "octal"] as Base[]).map((b) => (
                <button
                  key={b}
                  className={
                    fromBase === b ? "btn btn-primary" : "btn btn-ghost"
                  }
                  style={{ fontSize: 12 }}
                  onClick={() => setFromBase(b)}
                >
                  {b}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={numInput}
              onChange={(e) => setNumInput(e.target.value)}
              placeholder={BASE_INFO[fromBase].placeholder}
              style={{
                maxWidth: 320,
                fontSize: 16,
                fontFamily: "var(--font-mono)",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 10,
            }}
          >
            {(["decimal", "binary", "hex", "octal"] as Base[]).map((base) => (
              <div
                key={base}
                style={{
                  background:
                    base === fromBase ? "rgba(96,48,168,0.06)" : "var(--card)",
                  border: `1.5px solid ${base === fromBase ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 8,
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--ink-ghost)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {BASE_INFO[base].label}
                  </div>
                  {numResults[base] !== "—" && (
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 10, padding: "2px 8px" }}
                      onClick={() => copy(numResults[base], base)}
                    >
                      {copied === base ? "copied ✦" : "copy"}
                    </button>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 18,
                    fontWeight: 400,
                    color: "var(--ink)",
                    wordBreak: "break-all",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--ink-ghost)",
                      marginRight: 4,
                    }}
                  >
                    {BASE_INFO[base].prefix}
                  </span>
                  {numResults[base]}
                </div>
              </div>
            ))}
          </div>

          {/* quick reference */}
          <div style={{ marginTop: 32 }}>
            <div className="section-head" style={{ marginBottom: 12 }}>
              quick reference
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1.5px solid var(--border)" }}>
                  {["decimal", "binary", "hex", "octal"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "6px 10px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--ink-ghost)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                  (n, i) => (
                    <tr
                      key={n}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: i % 2 === 0 ? "var(--card)" : "transparent",
                      }}
                    >
                      <td
                        style={{
                          padding: "5px 10px",
                          fontFamily: "var(--font-mono)",
                          color: "var(--ink)",
                        }}
                      >
                        {n}
                      </td>
                      <td
                        style={{
                          padding: "5px 10px",
                          fontFamily: "var(--font-mono)",
                          color: "var(--ink-soft)",
                        }}
                      >
                        {n.toString(2).padStart(4, "0")}
                      </td>
                      <td
                        style={{
                          padding: "5px 10px",
                          fontFamily: "var(--font-mono)",
                          color: "var(--accent)",
                        }}
                      >
                        {n.toString(16).toUpperCase()}
                      </td>
                      <td
                        style={{
                          padding: "5px 10px",
                          fontFamily: "var(--font-mono)",
                          color: "var(--ink-soft)",
                        }}
                      >
                        {n.toString(8)}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ToolPage>
  );
}
