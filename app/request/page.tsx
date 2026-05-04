"use client";
import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  "electronics",
  "generative text",
  "color & design",
  "print & zine",
  "measurements",
  "code & dev",
  "soft electronics",
  "other",
];

const AUDIENCES = [
  "makers",
  "artists",
  "engineers",
  "crafters",
  "tinkerers",
  "developers",
  "educators",
  "everyone",
];

export default function RequestToolPage() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [audience, setAudience] = useState<string[]>([]);
  const [refs, setRefs] = useState("");

  const toggleAudience = (a: string) => {
    setAudience((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  };

  const handleSubmit = () => {
    if (!name.trim() || !desc.trim()) return;

    const body = [
      `**what should the tool do?**`,
      desc,
      ``,
      `**category**`,
      category || "not specified",
      ``,
      `**who would use it?**`,
      audience.length > 0 ? audience.join(", ") : "not specified",
      ``,
      `**references or examples**`,
      refs || "none provided",
      ``,
      `---`,
      `*submitted via tinytinker.tools/request*`,
    ].join("\n");

    const url = new URL(
      "https://github.com/yafira/tinytinker-tools/issues/new",
    );
    url.searchParams.set("title", `[tool request] ${name}`);
    url.searchParams.set("body", body);
    url.searchParams.set("labels", "tool-request");

    window.open(url.toString(), "_blank");
  };

  const ready = name.trim() && desc.trim();

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 40px" }}>
      {/* back link */}
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--ink-ghost)",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 32,
          transition: "color 0.1s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-ghost)")}
      >
        back to tools
      </Link>

      {/* header */}
      <div style={{ marginBottom: 36 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "var(--accent)",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 500,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 16,
              height: 1,
              background: "var(--border-hover)",
            }}
          />
          contribute
        </div>
        <h1
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 36,
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
            marginBottom: 14,
          }}
        >
          request a tool
        </h1>
        <div
          style={{
            fontSize: 15,
            color: "var(--ink-muted)",
            lineHeight: 1.8,
            maxWidth: 520,
          }}
        >
          tinytinker.tools is open source and community-driven. fill out the
          form below and we will open a pre-filled github issue on your behalf.
          the community can vote on it, build it, or you can take a crack at it
          yourself. ✦
        </div>
      </div>

      {/* form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* tool name */}
        <div>
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
            tool name <span style={{ color: "var(--accent)" }}>*</span>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. morse code translator"
            style={{ fontSize: 15 }}
          />
        </div>

        {/* description */}
        <div>
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
            what should it do? <span style={{ color: "var(--accent)" }}>*</span>
          </div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="describe the tool in one or two sentences..."
            rows={3}
            style={{
              width: "100%",
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              padding: "10px 12px",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--ink)",
              outline: "none",
              resize: "vertical",
              lineHeight: 1.7,
              transition: "border-color 0.12s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {/* category */}
        <div>
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
            category
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? "" : cat)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  padding: "5px 12px",
                  borderRadius: 5,
                  border: `1.5px solid ${category === cat ? "var(--accent)" : "var(--border)"}`,
                  background:
                    category === cat ? "rgba(96,48,168,0.08)" : "transparent",
                  color: category === cat ? "var(--accent)" : "var(--ink-soft)",
                  cursor: "pointer",
                  transition: "all 0.1s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* audience */}
        <div>
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
            who would use it?
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {AUDIENCES.map((a) => (
              <button
                key={a}
                onClick={() => toggleAudience(a)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  padding: "5px 12px",
                  borderRadius: 5,
                  border: `1.5px solid ${audience.includes(a) ? "var(--accent)" : "var(--border)"}`,
                  background: audience.includes(a)
                    ? "rgba(96,48,168,0.08)"
                    : "transparent",
                  color: audience.includes(a)
                    ? "var(--accent)"
                    : "var(--ink-soft)",
                  cursor: "pointer",
                  transition: "all 0.1s",
                }}
              >
                {audience.includes(a) ? "✦ " : ""}
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* references */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--ink-ghost)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            references or examples
            <span
              style={{
                color: "var(--ink-faint)",
                textTransform: "none",
                letterSpacing: 0,
                fontSize: 10,
              }}
            >
              optional
            </span>
          </div>
          <textarea
            value={refs}
            onChange={(e) => setRefs(e.target.value)}
            placeholder="links, formulas, existing tools, anything helpful..."
            rows={2}
            style={{
              width: "100%",
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              padding: "10px 12px",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--ink)",
              outline: "none",
              resize: "vertical",
              lineHeight: 1.7,
              transition: "border-color 0.12s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {/* submit */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingTop: 8,
          }}
        >
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!ready}
            style={{
              opacity: ready ? 1 : 0.4,
              cursor: ready ? "pointer" : "not-allowed",
              fontSize: 14,
              padding: "10px 24px",
            }}
          >
            ✦ open github issue
          </button>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--ink-ghost)",
            }}
          >
            you will be taken to github to submit
          </span>
        </div>
      </div>

      {/* note */}
      <div
        style={{
          marginTop: 36,
          padding: "14px 18px",
          background: "var(--card)",
          border: "1.5px solid var(--border)",
          borderRadius: 8,
        }}
      >
        <div
          style={{ fontSize: 12, color: "var(--ink-muted)", lineHeight: 1.8 }}
        >
          {
            "note: submitting the issue requires a free github account. if you do not have one, email "
          }
          <a
            href="mailto:yafira@proton.me"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            {"yafira@proton.me"}
          </a>
        </div>
      </div>

      {/* footer */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 18,
          borderTop: "1.5px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-ghost)",
            letterSpacing: "0.06em",
            lineHeight: 2,
          }}
        >
          {"tinytinker.tools \u2014 open source \u2726 "}
          <a
            href="https://github.com/yafira/tinytinker-tools"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            {"github.com/yafira/tinytinker-tools"}
          </a>
        </div>
      </div>
    </div>
  );
}
