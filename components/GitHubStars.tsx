"use client";
import { useState, useEffect } from "react";

export default function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/yafira/tinytinker-tools")
      .then((res) => res.json())
      .then((data) => setStars(data.stargazers_count))
      .catch(() => {});
  }, []);

  if (stars === null) return null;

  return (
    <div
      onClick={() =>
        window.open("https://github.com/yafira/tinytinker-tools", "_blank")
      }
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
        ((e.currentTarget as HTMLDivElement).style.color = "var(--accent)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.color = "var(--ink-ghost)")
      }
    >
      {"★ "}
      {stars}
      {" stars on github"}
    </div>
  );
}
