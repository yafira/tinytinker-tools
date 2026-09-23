"use client";
import { useState } from "react";
import Link from "next/link";
import { toolSections, type ToolTag } from "@/lib/tools";

type Tag = "all" | ToolTag;

const ALL_TAGS: Tag[] = [
  "all",
  "calc",
  "gen",
  "ref",
  "decode",
  "convert",
  "test",
  "plan",
];

export default function ToolGrid() {
  const [active, setActive] = useState<Tag>("all");

  const filtered = toolSections
    .map((section) => ({
      ...section,
      tools:
        active === "all"
          ? section.tools
          : section.tools.filter((t) => t.tag === active),
    }))
    .filter((section) => section.tools.length > 0);

  return (
    <div>
      {/* filter bar */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--ink-ghost)",
              marginRight: 4,
            }}
          >
            filter:
          </span>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActive(tag === active ? "all" : tag)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: tag === "all" ? 11 : 9,
                fontWeight: 500,
                letterSpacing: "0.08em",
                padding: tag === "all" ? "3px 10px" : "2px 8px",
                borderRadius: 4,
                border:
                  active === tag
                    ? "1.5px solid var(--border-hover)"
                    : "1.5px solid var(--border)",
                cursor: "pointer",
                transition: "all 0.12s",
                background:
                  active === tag ? "var(--card-hover)" : "transparent",
                color: active === tag ? "var(--ink)" : "var(--ink-ghost)",
              }}
              className={tag !== "all" ? `tag tag-${tag}` : ""}
            >
              {tag}
              {tag !== "all" && active === tag && (
                <span style={{ marginLeft: 4, opacity: 0.6 }}>✕</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* tool sections */}
      {filtered.map((section) => (
        <div key={section.label} style={{ marginBottom: 40 }}>
          <div className="section-head">{section.label}</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
              gap: 10,
            }}
          >
            {section.tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                style={{ textDecoration: "none" }}
              >
                <div className="tool-card" style={{ padding: "16px 18px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: "var(--ink)",
                      }}
                    >
                      {tool.label}
                    </div>
                    <span className={`tag tag-${tool.tag}`}>{tool.tag}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink-muted)" }}>
                    {tool.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* empty state */}
      {filtered.length === 0 && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--ink-ghost)",
            padding: "40px 0",
            textAlign: "center",
          }}
        >
          no tools with tag "{active}" yet ✦
        </div>
      )}
    </div>
  );
}
