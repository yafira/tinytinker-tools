"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { allTools } from "@/lib/tools";

const TITLES = [
  "voltage high",
  "top of the stack",
  "hot off the bus",
  "currently running",
  "featured.exe",
  "in the queue",
  "ready to execute",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FeaturedTools() {
  const [title, setTitle] = useState("voltage high");
  const [featured, setFeatured] = useState(allTools.slice(0, 3));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTitle(TITLES[Math.floor(Math.random() * TITLES.length)]);
    setFeatured(shuffle(allTools).slice(0, 3));
    setMounted(true);
  }, []);

  return (
    <div style={{ marginBottom: 48 }}>
      <div className="section-head" style={{ marginBottom: 16 }}>
        {mounted ? title : "voltage high"}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {featured.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            style={{ textDecoration: "none" }}
          >
            <div className="feat-card" style={{ padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)" }}
                >
                  {tool.label}
                </div>
                <span className={`tag tag-${tool.tag}`}>{tool.tag}</span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--ink-muted)",
                  lineHeight: 1.6,
                }}
              >
                {tool.desc}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--ink-ghost)",
                  marginTop: 14,
                  letterSpacing: "0.08em",
                }}
              >
                {tool.category}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
