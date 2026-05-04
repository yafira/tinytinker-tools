"use client";
import { useState, useEffect } from "react";
import ToolPage from "@/components/ToolPage";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatDate(date: Date): {
  iso: string;
  utc: string;
  local: string;
  relative: string;
  date: string;
  time: string;
  unix: number;
  unixMs: number;
} {
  const unix = Math.floor(date.getTime() / 1000);
  const unixMs = date.getTime();

  const iso = date.toISOString();
  const utc = date.toUTCString();
  const local = date.toLocaleString();

  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  const abs = Math.abs(diff);
  const future = diff < 0;

  let relative = "";
  if (abs < 60) relative = `${abs} seconds ${future ? "from now" : "ago"}`;
  else if (abs < 3600)
    relative = `${Math.floor(abs / 60)} minutes ${future ? "from now" : "ago"}`;
  else if (abs < 86400)
    relative = `${Math.floor(abs / 3600)} hours ${future ? "from now" : "ago"}`;
  else if (abs < 604800)
    relative = `${Math.floor(abs / 86400)} days ${future ? "from now" : "ago"}`;
  else if (abs < 2592000)
    relative = `${Math.floor(abs / 604800)} weeks ${future ? "from now" : "ago"}`;
  else if (abs < 31536000)
    relative = `${Math.floor(abs / 2592000)} months ${future ? "from now" : "ago"}`;
  else
    relative = `${Math.floor(abs / 31536000)} years ${future ? "from now" : "ago"}`;

  const d = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
  const t = `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;

  return { iso, utc, local, relative, date: d, time: t, unix, unixMs };
}

type InputMode = "unix" | "date" | "iso" | "now";

const EXAMPLES = [
  { label: "unix epoch", value: "0", mode: "unix" as InputMode },
  { label: "y2k", value: "946684800", mode: "unix" as InputMode },
  { label: "now", value: "", mode: "now" as InputMode },
];

export default function TimestampPage() {
  const [mode, setMode] = useState<InputMode>("unix");
  const [input, setInput] = useState("1704067200");
  const [now, setNow] = useState(new Date());
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const parseInput = (): Date | null => {
    if (mode === "now") return now;
    try {
      if (mode === "unix") {
        const n = parseInt(input);
        if (isNaN(n)) return null;
        return new Date(n * 1000);
      }
      if (mode === "iso") {
        const d = new Date(input);
        return isNaN(d.getTime()) ? null : d;
      }
      if (mode === "date") {
        const d = new Date(input);
        return isNaN(d.getTime()) ? null : d;
      }
    } catch {
      return null;
    }
    return null;
  };

  const date = parseInput();
  const result = date ? formatDate(date) : null;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  const loadExample = (ex: (typeof EXAMPLES)[0]) => {
    setMode(ex.mode);
    if (ex.mode !== "now") setInput(ex.value);
  };

  return (
    <ToolPage
      title="timestamp converter"
      description="convert unix timestamps to human readable dates and back. supports iso 8601, utc, local time and relative time."
      category="code & dev"
    >
      {/* live clock */}
      <div
        style={{
          background: "var(--card)",
          border: "1.5px solid var(--border)",
          borderRadius: 8,
          padding: "12px 16px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
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
              marginBottom: 4,
            }}
          >
            current unix timestamp
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 22,
              fontWeight: 300,
              color: "var(--ink)",
            }}
          >
            {Math.floor(now.getTime() / 1000)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-ghost)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            utc
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--ink-soft)",
            }}
          >
            {now.toUTCString()}
          </div>
        </div>
      </div>

      {/* examples */}
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
          examples
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              className="btn btn-ghost"
              style={{ fontSize: 12 }}
              onClick={() => loadExample(ex)}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* mode */}
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
          input type
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(
            [
              { v: "unix", label: "unix (seconds)" },
              { v: "iso", label: "iso 8601" },
              { v: "date", label: "date string" },
              { v: "now", label: "now" },
            ] as { v: InputMode; label: string }[]
          ).map(({ v, label }) => (
            <button
              key={v}
              className={mode === v ? "btn btn-primary" : "btn btn-ghost"}
              style={{ fontSize: 12 }}
              onClick={() => setMode(v)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* input */}
      {mode !== "now" && (
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
            {mode === "unix"
              ? "unix timestamp"
              : mode === "iso"
                ? "iso 8601 string"
                : "date string"}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "unix"
                ? "e.g. 1704067200"
                : mode === "iso"
                  ? "e.g. 2024-01-01T00:00:00.000Z"
                  : "e.g. January 1, 2024"
            }
            style={{
              maxWidth: 420,
              fontSize: 15,
              fontFamily: "var(--font-mono)",
            }}
          />
          {input && !result && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#f87171",
                marginTop: 6,
              }}
            >
              ✦ could not parse this input
            </div>
          )}
        </div>
      )}

      {/* results */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            {
              label: "unix (seconds)",
              value: result.unix.toString(),
              key: "unix",
            },
            {
              label: "unix (milliseconds)",
              value: result.unixMs.toString(),
              key: "unixms",
            },
            { label: "iso 8601", value: result.iso, key: "iso" },
            { label: "utc", value: result.utc, key: "utc" },
            { label: "local", value: result.local, key: "local" },
            { label: "date (utc)", value: result.date, key: "date" },
            { label: "time (utc)", value: result.time, key: "time" },
            { label: "relative", value: result.relative, key: "relative" },
          ].map((row) => (
            <div
              key={row.key}
              onClick={() => copy(row.value, row.key)}
              style={{
                background: "var(--card)",
                border: "1.5px solid var(--border)",
                borderRadius: 8,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
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
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--ink-ghost)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 3,
                  }}
                >
                  {row.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 14,
                    color: copied === row.key ? "var(--accent)" : "var(--ink)",
                  }}
                >
                  {copied === row.key ? "copied ✦" : row.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* reference */}
      <div
        style={{
          marginTop: 28,
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
          common timestamps
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 8,
          }}
        >
          {[
            { label: "unix epoch", ts: "0" },
            { label: "y2k", ts: "946684800" },
            { label: "2024 start", ts: "1704067200" },
            { label: "2025 start", ts: "1735689600" },
            { label: "2026 start", ts: "1767225600" },
            { label: "max 32-bit", ts: "2147483647" },
          ].map((item) => (
            <div
              key={item.label}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setMode("unix");
                setInput(item.ts);
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--ink-soft)",
                  marginBottom: 2,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--accent)",
                }}
              >
                {item.ts}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolPage>
  );
}
