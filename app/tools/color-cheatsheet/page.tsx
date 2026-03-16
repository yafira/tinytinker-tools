"use client";
import { useState } from "react";
import ToolPage from "@/components/ToolPage";

type Category =
  | "css named"
  | "tailwind"
  | "material"
  | "pastel"
  | "neon"
  | "earth";

const CSS_NAMED = [
  { name: "red", hex: "#FF0000" },
  { name: "crimson", hex: "#DC143C" },
  { name: "firebrick", hex: "#B22222" },
  { name: "darkred", hex: "#8B0000" },
  { name: "tomato", hex: "#FF6347" },
  { name: "coral", hex: "#FF7F50" },
  { name: "indianred", hex: "#CD5C5C" },
  { name: "lightcoral", hex: "#F08080" },
  { name: "salmon", hex: "#FA8072" },
  { name: "darksalmon", hex: "#E9967A" },
  { name: "lightsalmon", hex: "#FFA07A" },
  { name: "orangered", hex: "#FF4500" },
  { name: "orange", hex: "#FFA500" },
  { name: "darkorange", hex: "#FF8C00" },
  { name: "gold", hex: "#FFD700" },
  { name: "yellow", hex: "#FFFF00" },
  { name: "lightyellow", hex: "#FFFFE0" },
  { name: "lemonchiffon", hex: "#FFFACD" },
  { name: "lightgoldenrodyellow", hex: "#FAFAD2" },
  { name: "papayawhip", hex: "#FFEFD5" },
  { name: "moccasin", hex: "#FFE4B5" },
  { name: "peachpuff", hex: "#FFDAB9" },
  { name: "palegoldenrod", hex: "#EEE8AA" },
  { name: "khaki", hex: "#F0E68C" },
  { name: "darkkhaki", hex: "#BDB76B" },
  { name: "yellowgreen", hex: "#9ACD32" },
  { name: "greenyellow", hex: "#ADFF2F" },
  { name: "chartreuse", hex: "#7FFF00" },
  { name: "lawngreen", hex: "#7CFC00" },
  { name: "limegreen", hex: "#32CD32" },
  { name: "lime", hex: "#00FF00" },
  { name: "green", hex: "#008000" },
  { name: "darkgreen", hex: "#006400" },
  { name: "forestgreen", hex: "#228B22" },
  { name: "seagreen", hex: "#2E8B57" },
  { name: "mediumseagreen", hex: "#3CB371" },
  { name: "lightseagreen", hex: "#20B2AA" },
  { name: "mediumspringgreen", hex: "#00FA9A" },
  { name: "springgreen", hex: "#00FF7F" },
  { name: "aquamarine", hex: "#7FFFD4" },
  { name: "mediumaquamarine", hex: "#66CDAA" },
  { name: "darkseagreen", hex: "#8FBC8F" },
  { name: "palegreen", hex: "#98FB98" },
  { name: "lightgreen", hex: "#90EE90" },
  { name: "olivedrab", hex: "#6B8E23" },
  { name: "olive", hex: "#808000" },
  { name: "darkolivegreen", hex: "#556B2F" },
  { name: "teal", hex: "#008080" },
  { name: "darkcyan", hex: "#008B8B" },
  { name: "cyan", hex: "#00FFFF" },
  { name: "aqua", hex: "#00FFFF" },
  { name: "lightcyan", hex: "#E0FFFF" },
  { name: "paleturquoise", hex: "#AFEEEE" },
  { name: "turquoise", hex: "#40E0D0" },
  { name: "mediumturquoise", hex: "#48D1CC" },
  { name: "darkturquoise", hex: "#00CED1" },
  { name: "cadetblue", hex: "#5F9EA0" },
  { name: "steelblue", hex: "#4682B4" },
  { name: "lightsteelblue", hex: "#B0C4DE" },
  { name: "powderblue", hex: "#B0E0E6" },
  { name: "lightblue", hex: "#ADD8E6" },
  { name: "skyblue", hex: "#87CEEB" },
  { name: "lightskyblue", hex: "#87CEFA" },
  { name: "deepskyblue", hex: "#00BFFF" },
  { name: "dodgerblue", hex: "#1E90FF" },
  { name: "cornflowerblue", hex: "#6495ED" },
  { name: "royalblue", hex: "#4169E1" },
  { name: "blue", hex: "#0000FF" },
  { name: "mediumblue", hex: "#0000CD" },
  { name: "darkblue", hex: "#00008B" },
  { name: "navy", hex: "#000080" },
  { name: "midnightblue", hex: "#191970" },
  { name: "slateblue", hex: "#6A5ACD" },
  { name: "darkslateblue", hex: "#483D8B" },
  { name: "mediumslateblue", hex: "#7B68EE" },
  { name: "blueviolet", hex: "#8A2BE2" },
  { name: "indigo", hex: "#4B0082" },
  { name: "darkviolet", hex: "#9400D3" },
  { name: "darkorchid", hex: "#9932CC" },
  { name: "mediumpurple", hex: "#9370DB" },
  { name: "rebeccapurple", hex: "#663399" },
  { name: "purple", hex: "#800080" },
  { name: "darkmagenta", hex: "#8B008B" },
  { name: "mediumorchid", hex: "#BA55D3" },
  { name: "orchid", hex: "#DA70D6" },
  { name: "violet", hex: "#EE82EE" },
  { name: "plum", hex: "#DDA0DD" },
  { name: "thistle", hex: "#D8BFD8" },
  { name: "lavender", hex: "#E6E6FA" },
  { name: "magenta", hex: "#FF00FF" },
  { name: "fuchsia", hex: "#FF00FF" },
  { name: "hotpink", hex: "#FF69B4" },
  { name: "deeppink", hex: "#FF1493" },
  { name: "palevioletred", hex: "#DB7093" },
  { name: "mediumvioletred", hex: "#C71585" },
  { name: "pink", hex: "#FFC0CB" },
  { name: "lightpink", hex: "#FFB6C1" },
  { name: "lavenderblush", hex: "#FFF0F5" },
  { name: "mistyrose", hex: "#FFE4E1" },
  { name: "rosybrown", hex: "#BC8F8F" },
  { name: "white", hex: "#FFFFFF" },
  { name: "snow", hex: "#FFFAFA" },
  { name: "honeydew", hex: "#F0FFF0" },
  { name: "mintcream", hex: "#F5FFFA" },
  { name: "azure", hex: "#F0FFFF" },
  { name: "aliceblue", hex: "#F0F8FF" },
  { name: "ghostwhite", hex: "#F8F8FF" },
  { name: "whitesmoke", hex: "#F5F5F5" },
  { name: "seashell", hex: "#FFF5EE" },
  { name: "beige", hex: "#F5F5DC" },
  { name: "oldlace", hex: "#FDF5E6" },
  { name: "floralwhite", hex: "#FFFAF0" },
  { name: "ivory", hex: "#FFFFF0" },
  { name: "antiquewhite", hex: "#FAEBD7" },
  { name: "linen", hex: "#FAF0E6" },
  { name: "cornsilk", hex: "#FFF8DC" },
  { name: "blanchedalmond", hex: "#FFEBCD" },
  { name: "bisque", hex: "#FFE4C4" },
  { name: "navajowhite", hex: "#FFDEAD" },
  { name: "wheat", hex: "#F5DEB3" },
  { name: "gainsboro", hex: "#DCDCDC" },
  { name: "lightgray", hex: "#D3D3D3" },
  { name: "silver", hex: "#C0C0C0" },
  { name: "darkgray", hex: "#A9A9A9" },
  { name: "gray", hex: "#808080" },
  { name: "dimgray", hex: "#696969" },
  { name: "lightslategray", hex: "#778899" },
  { name: "slategray", hex: "#708090" },
  { name: "darkslategray", hex: "#2F4F4F" },
  { name: "black", hex: "#000000" },
  { name: "brown", hex: "#A52A2A" },
  { name: "saddlebrown", hex: "#8B4513" },
  { name: "sienna", hex: "#A0522D" },
  { name: "chocolate", hex: "#D2691E" },
  { name: "peru", hex: "#CD853F" },
  { name: "sandybrown", hex: "#F4A460" },
  { name: "burlywood", hex: "#DEB887" },
  { name: "tan", hex: "#D2B48C" },
  { name: "moccasin", hex: "#FFE4B5" },
  { name: "maroon", hex: "#800000" },
];

const TAILWIND = [
  { name: "slate-50", hex: "#F8FAFC" },
  { name: "slate-100", hex: "#F1F5F9" },
  { name: "slate-200", hex: "#E2E8F0" },
  { name: "slate-400", hex: "#94A3B8" },
  { name: "slate-600", hex: "#475569" },
  { name: "slate-800", hex: "#1E293B" },
  { name: "slate-950", hex: "#020617" },
  { name: "red-400", hex: "#F87171" },
  { name: "red-500", hex: "#EF4444" },
  { name: "red-600", hex: "#DC2626" },
  { name: "orange-400", hex: "#FB923C" },
  { name: "orange-500", hex: "#F97316" },
  { name: "amber-400", hex: "#FBBF24" },
  { name: "amber-500", hex: "#F59E0B" },
  { name: "yellow-400", hex: "#FACC15" },
  { name: "yellow-500", hex: "#EAB308" },
  { name: "lime-400", hex: "#A3E635" },
  { name: "lime-500", hex: "#84CC16" },
  { name: "green-400", hex: "#4ADE80" },
  { name: "green-500", hex: "#22C55E" },
  { name: "green-600", hex: "#16A34A" },
  { name: "teal-400", hex: "#2DD4BF" },
  { name: "teal-500", hex: "#14B8A6" },
  { name: "cyan-400", hex: "#22D3EE" },
  { name: "cyan-500", hex: "#06B6D4" },
  { name: "sky-400", hex: "#38BDF8" },
  { name: "sky-500", hex: "#0EA5E9" },
  { name: "blue-400", hex: "#60A5FA" },
  { name: "blue-500", hex: "#3B82F6" },
  { name: "blue-600", hex: "#2563EB" },
  { name: "indigo-400", hex: "#818CF8" },
  { name: "indigo-500", hex: "#6366F1" },
  { name: "violet-400", hex: "#A78BFA" },
  { name: "violet-500", hex: "#8B5CF6" },
  { name: "purple-400", hex: "#C084FC" },
  { name: "purple-500", hex: "#A855F7" },
  { name: "fuchsia-400", hex: "#E879F9" },
  { name: "fuchsia-500", hex: "#D946EF" },
  { name: "pink-400", hex: "#F472B6" },
  { name: "pink-500", hex: "#EC4899" },
  { name: "rose-400", hex: "#FB7185" },
  { name: "rose-500", hex: "#F43F5E" },
];

const MATERIAL = [
  { name: "red 500", hex: "#F44336" },
  { name: "red 900", hex: "#B71C1C" },
  { name: "pink 500", hex: "#E91E63" },
  { name: "purple 500", hex: "#9C27B0" },
  { name: "deep purple 500", hex: "#673AB7" },
  { name: "indigo 500", hex: "#3F51B5" },
  { name: "blue 500", hex: "#2196F3" },
  { name: "light blue 500", hex: "#03A9F4" },
  { name: "cyan 500", hex: "#00BCD4" },
  { name: "teal 500", hex: "#009688" },
  { name: "green 500", hex: "#4CAF50" },
  { name: "light green 500", hex: "#8BC34A" },
  { name: "lime 500", hex: "#CDDC39" },
  { name: "yellow 500", hex: "#FFEB3B" },
  { name: "amber 500", hex: "#FFC107" },
  { name: "orange 500", hex: "#FF9800" },
  { name: "deep orange 500", hex: "#FF5722" },
  { name: "brown 500", hex: "#795548" },
  { name: "grey 500", hex: "#9E9E9E" },
  { name: "blue grey 500", hex: "#607D8B" },
];

const PASTEL = [
  { name: "pastel pink", hex: "#FFB3C6" },
  { name: "pastel purple", hex: "#C8B8E8" },
  { name: "pastel blue", hex: "#B8D4F8" },
  { name: "pastel mint", hex: "#B8F8E8" },
  { name: "pastel yellow", hex: "#FFF3B8" },
  { name: "pastel peach", hex: "#FFD8B8" },
  { name: "pastel lavender", hex: "#E0D8F8" },
  { name: "pastel rose", hex: "#F8D8E8" },
  { name: "pastel sky", hex: "#D8EEF8" },
  { name: "pastel lime", hex: "#D8F8D8" },
  { name: "pastel coral", hex: "#F8C8B8" },
  { name: "pastel lilac", hex: "#E8C8F8" },
  { name: "pastel cream", hex: "#FFF8E8" },
  { name: "pastel sage", hex: "#C8E8C8" },
  { name: "pastel mauve", hex: "#E8C8D8" },
  { name: "pastel periwinkle", hex: "#C8C8F8" },
];

const NEON = [
  { name: "neon pink", hex: "#FF10F0" },
  { name: "neon green", hex: "#39FF14" },
  { name: "neon blue", hex: "#00DFFF" },
  { name: "neon yellow", hex: "#FFE01B" },
  { name: "neon orange", hex: "#FF6700" },
  { name: "neon purple", hex: "#BC13FE" },
  { name: "neon red", hex: "#FF3131" },
  { name: "neon cyan", hex: "#00FFF5" },
  { name: "neon lime", hex: "#CCFF00" },
  { name: "neon coral", hex: "#FF6E6E" },
  { name: "neon magenta", hex: "#FF00FF" },
  { name: "neon aqua", hex: "#00FFAB" },
];

const EARTH = [
  { name: "terracotta", hex: "#C4622D" },
  { name: "rust", hex: "#B7410E" },
  { name: "clay", hex: "#C2714F" },
  { name: "sand", hex: "#C2B280" },
  { name: "dune", hex: "#B8A88A" },
  { name: "stone", hex: "#928E85" },
  { name: "slate", hex: "#708090" },
  { name: "moss", hex: "#8A9A5B" },
  { name: "sage", hex: "#9CAF88" },
  { name: "forest", hex: "#4A7856" },
  { name: "bark", hex: "#6B4423" },
  { name: "walnut", hex: "#5C4033" },
  { name: "espresso", hex: "#3B2314" },
  { name: "mushroom", hex: "#C9B99A" },
  { name: "parchment", hex: "#F1E9D2" },
  { name: "linen", hex: "#FAF0E6" },
];

const COLLECTIONS: Record<Category, { name: string; hex: string }[]> = {
  "css named": CSS_NAMED,
  tailwind: TAILWIND,
  material: MATERIAL,
  pastel: PASTEL,
  neon: NEON,
  earth: EARTH,
};

function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export default function ColorCheatsheetPage() {
  const [category, setCategory] = useState<Category>("css named");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const colors = COLLECTIONS[category];
  const filtered = colors.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.hex.toLowerCase().includes(search.toLowerCase()),
  );

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <ToolPage
      title="color cheatsheet"
      description="browse and copy colors from css named colors, tailwind, material design, pastels, neons & earth tones."
      category="color & design"
    >
      {/* category */}
      <div style={{ marginBottom: 16 }}>
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
          collection
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(Object.keys(COLLECTIONS) as Category[]).map((cat) => (
            <button
              key={cat}
              className={category === cat ? "btn btn-primary" : "btn btn-ghost"}
              style={{ fontSize: 12 }}
              onClick={() => {
                setCategory(cat);
                setSearch("");
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* search */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="search by name or hex…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      {/* color count */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--ink-ghost)",
          marginBottom: 14,
        }}
      >
        {filtered.length} colors
        {search && ` matching "${search}"`}
      </div>

      {/* grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 8,
        }}
      >
        {filtered.map((color) => {
          const dark = luminance(color.hex) < 0.5;
          const textColor = dark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)";
          const isCopied = copied === color.hex;
          return (
            <button
              key={color.hex + color.name}
              onClick={() => copy(color.hex, color.hex)}
              style={{
                background: color.hex,
                border: "1.5px solid rgba(0,0,0,0.08)",
                borderRadius: 8,
                padding: "12px 10px",
                cursor: "pointer",
                textAlign: "left",
                transition: "transform 0.1s, box-shadow 0.1s",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 500,
                  color: textColor,
                  lineHeight: 1.3,
                }}
              >
                {isCopied ? "copied ✦" : color.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: textColor,
                  opacity: 0.7,
                }}
              >
                {color.hex}
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--ink-ghost)",
            padding: "32px 0",
            textAlign: "center",
          }}
        >
          no colors matching "{search}"
        </div>
      )}
    </ToolPage>
  );
}
