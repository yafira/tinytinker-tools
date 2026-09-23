"use client";
import { useState, useEffect } from "react";

export default function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/yafira/tinytinker-tools")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.stargazers_count === "number")
          setStars(data.stargazers_count);
      })
      .catch(() => {});
  }, []);

  if (stars === null) return null;

  return (
    <a
      href="https://github.com/yafira/tinytinker-tools"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: "var(--ink-ghost)",
        textDecoration: "none",
        marginTop: 8,
        cursor: "pointer",
        transition: "color 0.1s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-ghost)")
      }
    >
      {"★ "}
      {stars}
      {stars === 1 ? " star on github" : " stars on github"}
    </a>
  );
}
