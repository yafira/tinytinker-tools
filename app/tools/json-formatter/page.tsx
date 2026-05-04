"use client";
import { useState, useCallback } from "react";
import ToolPage from "@/components/ToolPage";

type IndentMode = 2 | 4 | "tab";
type ViewMode = "formatted" | "minified";

function formatJSON(
  input: string,
  indent: IndentMode,
): { result: string; error: string | null } {
  try {
    const parsed = JSON.parse(input);
    const result = JSON.stringify(
      parsed,
      null,
      indent === "tab" ? "\t" : indent,
    );
    return { result, error: null };
  } catch (e) {
    return { result: "", error: (e as Error).message };
  }
}

function minifyJSON(input: string): { result: string; error: string | null } {
  try {
    const parsed = JSON.parse(input);
    return { result: JSON.stringify(parsed), error: null };
  } catch (e) {
    return { result: "", error: (e as Error).message };
  }
}

function countKeys(input: string): number {
  try {
    const parsed = JSON.parse(input);
    let count = 0;
    const walk = (obj: unknown) => {
      if (typeof obj === "object" && obj !== null) {
        for (const key of Object.keys(obj as object)) {
          count++;
          walk((obj as Record<string, unknown>)[key]);
        }
      } else if (Array.isArray(obj)) {
        obj.forEach(walk);
      }
    };
    walk(parsed);
    return count;
  } catch {
    return 0;
  }
}

const EXAMPLES = {
  simple: `{"name":"tinytinker","version":"1.0.0","description":"a soft toolkit for curious makers","open_source":true}`,
  nested: `{"tool":{"name":"json formatter","category":"code & dev","tags":["convert","dev"],"options":{"indent":2,"minify":false}},"author":"electrocute","year":2026}`,
  array: `[{"id":1,"label":"resistor decoder","tag":"decode"},{"id":2,"label":"color palette","tag":"gen"},{"id":3,"label":"markov generator","tag":"gen"}]`,
};

export default function JsonFormatterPage() {
  const [input, setInput] = useState(EXAMPLES.simple);
  const [indent, setIndent] = useState<IndentMode>(2);
  const [view, setView] = useState<ViewMode>("formatted");
  const [copied, setCopied] = useState(false);

  const formatted = formatJSON(input, indent);
  const minified = minifyJSON(input);

  const output = view === "formatted" ? formatted : minified;
  const lineCount = output.result ? output.result.split("\n").length : 0;
  const keyCount = !output.error ? countKeys(input) : 0;
  const charCount = output.result.length;

  const copy = useCallback(() => {
    if (!output.result) return;
    navigator.clipboard.writeText(output.result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [output.result]);

  const isValid = !formatted.error;

  return (
    <ToolPage
      title="json formatter"
      description="format, validate and minify json. paste messy json and get it clean instantly."
      category="code & dev"
    >
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
          {Object.entries(EXAMPLES).map(([key, val]) => (
            <button
              key={key}
              className="btn btn-ghost"
              style={{ fontSize: 12 }}
              onClick={() => setInput(val)}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* input */}
        <div>
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
              input
            </div>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 10, padding: "2px 8px" }}
              onClick={() => setInput("")}
            >
              clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='paste your json here... {"key": "value"}'
            rows={20}
            style={{
              width: "100%",
              background: "var(--card)",
              border: `1.5px solid ${input && !isValid ? "#f87171" : "var(--border)"}`,
              borderRadius: 8,
              padding: "12px 14px",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--ink)",
              outline: "none",
              resize: "vertical",
              lineHeight: 1.7,
              transition: "border-color 0.12s",
            }}
            onFocus={(e) => {
              if (isValid || !input)
                e.target.style.borderColor = "var(--accent)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor =
                input && !isValid ? "#f87171" : "var(--border)";
            }}
          />

          {/* error */}
          {input && !isValid && (
            <div
              style={{
                marginTop: 8,
                padding: "8px 12px",
                background: "rgba(248,113,113,0.08)",
                border: "1.5px solid rgba(248,113,113,0.3)",
                borderRadius: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#f87171",
                lineHeight: 1.6,
              }}
            >
              ✦ {formatted.error}
            </div>
          )}

          {/* valid badge */}
          {input && isValid && (
            <div
              style={{
                marginTop: 8,
                padding: "6px 12px",
                background: "rgba(134,239,172,0.08)",
                border: "1.5px solid rgba(134,239,172,0.3)",
                borderRadius: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#4ade80",
                display: "inline-block",
              }}
            >
              ✦ valid json
            </div>
          )}
        </div>

        {/* output */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {/* view mode */}
              <button
                className={
                  view === "formatted" ? "btn btn-primary" : "btn btn-ghost"
                }
                style={{ fontSize: 11, padding: "3px 10px" }}
                onClick={() => setView("formatted")}
              >
                formatted
              </button>
              <button
                className={
                  view === "minified" ? "btn btn-primary" : "btn btn-ghost"
                }
                style={{ fontSize: 11, padding: "3px 10px" }}
                onClick={() => setView("minified")}
              >
                minified
              </button>
            </div>

            {/* indent mode */}
            {view === "formatted" && (
              <div style={{ display: "flex", gap: 4 }}>
                {([2, 4, "tab"] as IndentMode[]).map((i) => (
                  <button
                    key={String(i)}
                    onClick={() => setIndent(i)}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      padding: "2px 7px",
                      borderRadius: 4,
                      border: `1.5px solid ${indent === i ? "var(--accent)" : "var(--border)"}`,
                      background:
                        indent === i ? "rgba(96,48,168,0.08)" : "transparent",
                      color:
                        indent === i ? "var(--accent)" : "var(--ink-ghost)",
                      cursor: "pointer",
                    }}
                  >
                    {i === "tab" ? "tab" : `${i}sp`}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <textarea
              value={output.result}
              readOnly
              rows={20}
              placeholder="formatted output will appear here..."
              style={{
                width: "100%",
                background: "var(--card)",
                border: "1.5px solid var(--border)",
                borderRadius: 8,
                padding: "12px 14px",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--ink-soft)",
                outline: "none",
                resize: "vertical",
                lineHeight: 1.7,
              }}
            />
            {output.result && (
              <button
                onClick={copy}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  padding: "3px 8px",
                  borderRadius: 4,
                  border: "1.5px solid var(--border)",
                  background: "var(--card)",
                  color: copied ? "var(--accent)" : "var(--ink-ghost)",
                  cursor: "pointer",
                  transition: "all 0.12s",
                }}
              >
                {copied ? "copied ✦" : "copy"}
              </button>
            )}
          </div>

          {/* stats */}
          {output.result && (
            <div style={{ marginTop: 8, display: "flex", gap: 16 }}>
              {[
                { label: "lines", value: lineCount },
                { label: "keys", value: keyCount },
                { label: "chars", value: charCount },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{ display: "flex", gap: 6, alignItems: "baseline" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 16,
                      fontWeight: 300,
                      color: "var(--ink)",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "var(--ink-ghost)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* tips */}
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
          tips
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 8,
          }}
        >
          {[
            {
              tip: "paste any json",
              desc: "minified, formatted, or broken — we will tell you what's wrong",
            },
            {
              tip: "indent options",
              desc: "2 spaces is standard, 4 for readability, tab for some editors",
            },
            {
              tip: "minify for production",
              desc: "removes all whitespace to reduce file size",
            },
            {
              tip: "valid badge",
              desc: "green means your json is parseable, red means there is a syntax error",
            },
          ].map((item) => (
            <div key={item.tip}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--ink-soft)",
                  marginBottom: 2,
                }}
              >
                {item.tip}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-ghost)",
                  lineHeight: 1.6,
                }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolPage>
  );
}
