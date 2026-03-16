"use client";
import { useState, useCallback } from "react";
import ToolPage from "@/components/ToolPage";

// --- color name database ---
// mapped to nearest named color using euclidean distance in RGB space

const COLOR_NAMES: [number, number, number, string][] = [
  [255, 0, 0, "pure red"],
  [220, 20, 60, "crimson"],
  [178, 34, 34, "firebrick"],
  [139, 0, 0, "dark red"],
  [255, 99, 71, "tomato"],
  [255, 69, 0, "red-orange"],
  [255, 140, 0, "dark orange"],
  [255, 165, 0, "orange"],
  [255, 215, 0, "gold"],
  [255, 255, 0, "pure yellow"],
  [255, 250, 205, "lemon chiffon"],
  [240, 230, 140, "khaki"],
  [189, 183, 107, "dark khaki"],
  [128, 128, 0, "olive"],
  [154, 205, 50, "yellow-green"],
  [173, 255, 47, "green-yellow"],
  [0, 255, 0, "pure green"],
  [0, 128, 0, "green"],
  [0, 100, 0, "dark green"],
  [34, 139, 34, "forest green"],
  [50, 205, 50, "lime green"],
  [144, 238, 144, "light green"],
  [0, 255, 127, "spring green"],
  [0, 250, 154, "medium spring green"],
  [46, 139, 87, "sea green"],
  [60, 179, 113, "medium sea green"],
  [32, 178, 170, "light sea green"],
  [0, 128, 128, "teal"],
  [0, 139, 139, "dark cyan"],
  [0, 255, 255, "cyan"],
  [224, 255, 255, "light cyan"],
  [175, 238, 238, "pale turquoise"],
  [64, 224, 208, "turquoise"],
  [72, 209, 204, "medium turquoise"],
  [0, 206, 209, "dark turquoise"],
  [95, 158, 160, "cadet blue"],
  [70, 130, 180, "steel blue"],
  [100, 149, 237, "cornflower blue"],
  [30, 144, 255, "dodger blue"],
  [0, 191, 255, "deep sky blue"],
  [135, 206, 235, "sky blue"],
  [135, 206, 250, "light sky blue"],
  [0, 0, 255, "pure blue"],
  [0, 0, 205, "medium blue"],
  [0, 0, 139, "dark blue"],
  [0, 0, 128, "navy"],
  [25, 25, 112, "midnight blue"],
  [65, 105, 225, "royal blue"],
  [106, 90, 205, "slate blue"],
  [72, 61, 139, "dark slate blue"],
  [123, 104, 238, "medium slate blue"],
  [147, 112, 219, "medium purple"],
  [138, 43, 226, "blue-violet"],
  [148, 0, 211, "dark violet"],
  [153, 50, 204, "dark orchid"],
  [186, 85, 211, "medium orchid"],
  [168, 85, 200, "amethyst"],
  [128, 0, 128, "purple"],
  [139, 0, 139, "dark magenta"],
  [255, 0, 255, "magenta"],
  [238, 130, 238, "violet"],
  [221, 160, 221, "plum"],
  [216, 191, 216, "thistle"],
  [255, 20, 147, "deep pink"],
  [255, 105, 180, "hot pink"],
  [255, 182, 193, "light pink"],
  [255, 192, 203, "pink"],
  [219, 112, 147, "pale violet red"],
  [199, 21, 133, "medium violet red"],
  [255, 127, 80, "coral"],
  [240, 128, 128, "light coral"],
  [250, 128, 114, "salmon"],
  [233, 150, 122, "dark salmon"],
  [255, 160, 122, "light salmon"],
  [210, 105, 30, "chocolate"],
  [205, 133, 63, "peru"],
  [244, 164, 96, "sandy brown"],
  [222, 184, 135, "burlywood"],
  [210, 180, 140, "tan"],
  [188, 143, 143, "rosy brown"],
  [139, 69, 19, "saddle brown"],
  [160, 82, 45, "sienna"],
  [165, 42, 42, "brown"],
  [128, 0, 0, "maroon"],
  [255, 248, 220, "cornsilk"],
  [255, 235, 205, "blanched almond"],
  [255, 228, 196, "bisque"],
  [255, 222, 173, "navajo white"],
  [245, 222, 179, "wheat"],
  [255, 245, 238, "seashell"],
  [250, 240, 230, "linen"],
  [253, 245, 230, "old lace"],
  [255, 228, 225, "misty rose"],
  [255, 240, 245, "lavender blush"],
  [255, 255, 240, "ivory"],
  [255, 250, 250, "snow"],
  [248, 248, 255, "ghost white"],
  [240, 248, 255, "alice blue"],
  [230, 230, 250, "lavender"],
  [216, 191, 216, "thistle"],
  [245, 245, 245, "white smoke"],
  [255, 255, 255, "white"],
  [0, 0, 0, "black"],
  [105, 105, 105, "dim gray"],
  [128, 128, 128, "gray"],
  [169, 169, 169, "dark gray"],
  [192, 192, 192, "silver"],
  [211, 211, 211, "light gray"],
  [220, 220, 220, "gainsboro"],
  [245, 245, 220, "beige"],
  [240, 255, 240, "honeydew"],
  [240, 255, 255, "azure"],
  [245, 255, 250, "mint cream"],
  [253, 245, 230, "floral white"],
  [250, 235, 215, "antique white"],
  [255, 239, 213, "papaya whip"],
  [255, 228, 181, "moccasin"],
  [255, 218, 185, "peach puff"],
  [255, 250, 240, "floral white"],
  [47, 79, 79, "dark slate gray"],
  [112, 128, 144, "slate gray"],
  [119, 136, 153, "light slate gray"],
  [176, 196, 222, "light steel blue"],
  [173, 216, 230, "light blue"],
  [176, 224, 230, "powder blue"],
  [143, 188, 143, "dark sea green"],
  [85, 107, 47, "dark olive green"],
  [107, 142, 35, "olive drab"],
  [124, 252, 0, "lawn green"],
  [127, 255, 0, "chartreuse"],
  [127, 255, 212, "aquamarine"],
  [102, 205, 170, "medium aquamarine"],
];

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function colorDistance(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number,
): number {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function getNearestName(
  r: number,
  g: number,
  b: number,
): { name: string; distance: number; exact: boolean } {
  let nearest = COLOR_NAMES[0];
  let minDist = Infinity;
  for (const color of COLOR_NAMES) {
    const d = colorDistance(r, g, b, color[0], color[1], color[2]);
    if (d < minDist) {
      minDist = d;
      nearest = color;
    }
  }
  return {
    name: nearest[3],
    distance: Math.round(minDist),
    exact: minDist < 1,
  };
}

function getPoetricName(r: number, g: number, b: number): string {
  const [h, s, l] = (() => {
    let rn = r / 255,
      gn = g / 255,
      bn = b / 255;
    const max = Math.max(rn, gn, bn),
      min = Math.min(rn, gn, bn);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      else if (max === gn) h = ((bn - rn) / d + 2) / 6;
      else h = ((rn - gn) / d + 4) / 6;
    }
    return [h * 360, s * 100, l * 100];
  })();

  // brightness descriptors
  const bright =
    l > 85 ? "pale" : l > 65 ? "soft" : l > 45 ? "" : l > 25 ? "deep" : "dark";

  // saturation descriptors
  const sat =
    s < 10
      ? "muted"
      : s < 30
        ? "dusty"
        : s < 60
          ? ""
          : s < 80
            ? "vivid"
            : "electric";

  // hue names
  let hue = "";
  if (s < 8)
    hue = l > 85 ? "cloud" : l > 60 ? "stone" : l > 30 ? "slate" : "void";
  else if (h < 15 || h >= 345) hue = "red";
  else if (h < 30) hue = "vermillion";
  else if (h < 45) hue = "amber";
  else if (h < 65) hue = "gold";
  else if (h < 80) hue = "chartreuse";
  else if (h < 150) hue = "green";
  else if (h < 175) hue = "seafoam";
  else if (h < 195) hue = "teal";
  else if (h < 220) hue = "sky";
  else if (h < 255) hue = "blue";
  else if (h < 275) hue = "indigo";
  else if (h < 300) hue = "violet";
  else if (h < 320) hue = "orchid";
  else if (h < 335) hue = "rose";
  else hue = "blush";

  const parts = [bright, sat, hue].filter(Boolean);
  return parts.join(" ");
}

const SWATCHES = [
  "#FF6B6B",
  "#FF8E53",
  "#FFC75F",
  "#A8E063",
  "#56CCF2",
  "#6B8CFF",
  "#A855C8",
  "#F687B3",
  "#C8B8E8",
  "#2D1F3D",
  "#FFFFFF",
  "#888888",
];

export default function HexNamePage() {
  const [hex, setHex] = useState("#A855C8");
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = hexToRgb(hex);
  const valid = rgb !== null;

  const copy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  }, []);

  const nearest = valid && rgb ? getNearestName(...rgb) : null;
  const poetic = valid && rgb ? getPoetricName(...rgb) : null;

  return (
    <ToolPage
      title="hex color namer"
      description="give any hex color a human-readable name — nearest CSS name and a poetic description."
      category="color & design"
    >
      {/* swatches */}
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
          quick pick
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SWATCHES.map((s) => (
            <button
              key={s}
              onClick={() => setHex(s)}
              style={{
                width: 28,
                height: 28,
                background: s,
                border:
                  hex.toUpperCase() === s
                    ? "2px solid var(--accent)"
                    : "1.5px solid var(--border)",
                borderRadius: 6,
                cursor: "pointer",
                transition: "transform 0.1s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          ))}
          <input
            type="color"
            value={valid ? hex : "#a855c8"}
            onChange={(e) => setHex(e.target.value.toUpperCase())}
            style={{
              width: 28,
              height: 28,
              padding: 2,
              border: "1.5px solid var(--border)",
              borderRadius: 6,
              cursor: "pointer",
            }}
          />
        </div>
      </div>

      {/* input */}
      <div style={{ marginBottom: 32 }}>
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
          hex color
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            type="text"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            placeholder="#A855C8"
            style={{
              maxWidth: 180,
              fontSize: 16,
              fontFamily: "var(--font-mono)",
            }}
          />
          {valid && rgb && (
            <div
              style={{
                width: 52,
                height: 52,
                background: hex,
                borderRadius: 10,
                border: "1.5px solid var(--border)",
                flexShrink: 0,
              }}
            />
          )}
        </div>
        {!valid && hex.trim() && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--accent)",
              marginTop: 6,
            }}
          >
            ✦ enter a valid hex color like #A855C8 or #fff
          </div>
        )}
      </div>

      {/* results */}
      {valid && rgb && nearest && poetic && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* poetic name */}
          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--accent)",
              borderRadius: 10,
              padding: "20px 22px",
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                background: hex,
                borderRadius: 10,
                border: "1.5px solid var(--border)",
                flexShrink: 0,
              }}
            />
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
                poetic name
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 26,
                  fontWeight: 300,
                  color: "var(--ink)",
                  marginBottom: 4,
                }}
              >
                {poetic}
              </div>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 11, padding: "3px 10px" }}
                onClick={() => copy(poetic, "poetic")}
              >
                {copied === "poetic" ? "copied ✦" : "copy"}
              </button>
            </div>
          </div>

          {/* nearest css name */}
          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 10,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
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
                nearest css color name
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 20,
                  fontWeight: 400,
                  color: "var(--ink)",
                }}
              >
                {nearest.name}
                {nearest.exact && (
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--accent)",
                      marginLeft: 10,
                    }}
                  >
                    exact match
                  </span>
                )}
              </div>
              {!nearest.exact && (
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--ink-ghost)",
                    marginTop: 4,
                  }}
                >
                  distance: {nearest.distance} — not an exact css name
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: `rgb(${COLOR_NAMES.find(
                    (c) => c[3] === nearest.name,
                  )
                    ?.slice(0, 3)
                    .join(",")})`,
                  borderRadius: 6,
                  border: "1.5px solid var(--border)",
                }}
              />
              <button
                className="btn btn-ghost"
                style={{ fontSize: 11 }}
                onClick={() => copy(nearest.name, "css")}
              >
                {copied === "css" ? "copied ✦" : "copy"}
              </button>
            </div>
          </div>

          {/* rgb breakdown */}
          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 10,
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink-ghost)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              rgb breakdown
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
              }}
            >
              {[
                { label: "red", value: rgb[0], color: "#ff6b6b" },
                { label: "green", value: rgb[1], color: "#a8e063" },
                { label: "blue", value: rgb[2], color: "#6b8cff" },
              ].map((ch) => (
                <div key={ch.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "var(--ink-ghost)",
                      marginBottom: 6,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {ch.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 20,
                      fontWeight: 400,
                      color: "var(--ink)",
                      marginBottom: 6,
                    }}
                  >
                    {ch.value}
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "var(--border)",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(ch.value / 255) * 100}%`,
                        height: "100%",
                        background: ch.color,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolPage>
  );
}
