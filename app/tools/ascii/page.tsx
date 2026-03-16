"use client";
import { useState, useRef, useEffect } from "react";
import ToolPage from "@/components/ToolPage";

// --- figlet-style big text fonts ---
const FONTS: Record<string, Record<string, string[]>> = {
  block: {
    A: ["  ██  ", "  ██  ", " █  █ ", " ████ ", "█    █"],
    B: ["████  ", "█   █ ", "████  ", "█   █ ", "████  "],
    C: [" ████ ", "█     ", "█     ", "█     ", " ████ "],
    D: ["████  ", "█   █ ", "█   █ ", "█   █ ", "████  "],
    E: ["█████", "█    ", "████ ", "█    ", "█████"],
    F: ["█████", "█    ", "████ ", "█    ", "█    "],
    G: [" ████ ", "█     ", "█  ███", "█   █ ", " ████ "],
    H: ["█   █", "█   █", "█████", "█   █", "█   █"],
    I: ["███", "  █", "  █", "  █", "███"],
    J: ["  ███", "    █", "    █", "█   █", " ███ "],
    K: ["█   █", "█  █ ", "███  ", "█  █ ", "█   █"],
    L: ["█    ", "█    ", "█    ", "█    ", "█████"],
    M: ["█   █", "██ ██", "█ █ █", "█   █", "█   █"],
    N: ["█   █", "██  █", "█ █ █", "█  ██", "█   █"],
    O: [" ███ ", "█   █", "█   █", "█   █", " ███ "],
    P: ["████ ", "█   █", "████ ", "█    ", "█    "],
    Q: [" ███ ", "█   █", "█   █", "█  ██", " ████"],
    R: ["████ ", "█   █", "████ ", "█  █ ", "█   █"],
    S: [" ████", "█    ", " ███ ", "    █", "████ "],
    T: ["█████", "  █  ", "  █  ", "  █  ", "  █  "],
    U: ["█   █", "█   █", "█   █", "█   █", " ███ "],
    V: ["█   █", "█   █", " █ █ ", " █ █ ", "  █  "],
    W: ["█   █", "█   █", "█ █ █", "██ ██", "█   █"],
    X: ["█   █", " █ █ ", "  █  ", " █ █ ", "█   █"],
    Y: ["█   █", " █ █ ", "  █  ", "  █  ", "  █  "],
    Z: ["█████", "   █ ", "  █  ", " █   ", "█████"],
    " ": ["  ", "  ", "  ", "  ", "  "],
    "0": [" ███ ", "█   █", "█   █", "█   █", " ███ "],
    "1": ["  █  ", " ██  ", "  █  ", "  █  ", "█████"],
    "2": [" ███ ", "█   █", "   █ ", "  █  ", "█████"],
    "3": ["████ ", "    █", "████ ", "    █", "████ "],
    "4": ["█   █", "█   █", "█████", "    █", "    █"],
    "5": ["█████", "█    ", "████ ", "    █", "████ "],
    "6": [" ███ ", "█    ", "████ ", "█   █", " ███ "],
    "7": ["█████", "    █", "   █ ", "  █  ", "  █  "],
    "8": [" ███ ", "█   █", " ███ ", "█   █", " ███ "],
    "9": [" ███ ", "█   █", " ████", "    █", " ███ "],
    "!": ["█", "█", "█", " ", "█"],
    "?": [" ███ ", "█   █", "   █ ", "  █  ", "  █  "],
    ".": [" ", " ", " ", " ", "█"],
    ",": [" ", " ", " ", " █", " █"],
    ":": [" ", "█", " ", "█", " "],
  },
  thin: {
    A: ["  /\\  ", " /  \\ ", "/----\\", " /  \\ ", ""],
    B: ["|--\\ ", "|  | ", "|--/ ", "|  \\ ", "|--/ "],
    C: [" /--", "|   ", "|   ", "|   ", " \\--"],
    D: ["|--\\ ", "|   |", "|   |", "|   |", "|--/ "],
    E: ["|---", "|---", "|   ", "|---", ""],
    F: ["|---", "|-- ", "|   ", "|   ", ""],
    G: [" /--", "|   ", "|  -", "|   ", " \\--"],
    H: ["|   |", "|   |", "|---|", "|   |", "|   |"],
    I: ["---", " | ", " | ", " | ", "---"],
    J: ["  --", "   |", "   |", "|  |", " --"],
    K: ["|  /", "|/ ", "|\\ ", "|  \\", "|   \\"],
    L: ["|   ", "|   ", "|   ", "|   ", "|---"],
    M: ["|\\  /|", "| \\/ |", "|    |", "|    |", "|    |"],
    N: ["|\\ |", "| \\|", "| /|", "|/ |", "|  |"],
    O: [" -- ", "| o |", "|   |", "| o |", " -- "],
    P: ["|-- ", "| / ", "|-- ", "|   ", "|   "],
    Q: [" -- ", "| o |", "|   |", "| o\\ ", " --/ "],
    R: ["|-- ", "| / ", "|-- ", "|  \\", "|   \\"],
    S: [" ---", "|    ", " -- ", "    |", "--- "],
    T: ["---", " | ", " | ", " | ", " | "],
    U: ["|   |", "|   |", "|   |", "|   |", " --- "],
    V: ["\\   /", "\\  / ", " \\/ ", " \\/ ", "  V "],
    W: ["|   |", "|   |", "| | |", "|\\ /|", "|   |"],
    X: ["\\  /", "\\/ ", "/ \\", "   \\", "    \\"],
    Y: ["\\  /", "\\/ ", " | ", " | ", " | "],
    Z: ["----", "  / ", " /  ", "/   ", "----"],
    " ": ["  ", "  ", "  ", "  ", "  "],
    "0": [" 0 ", "0 0", "0 0", "0 0", " 0 "],
    "1": [" 1", "11", " 1", " 1", "111"],
    "2": ["-2-", "  2", " 2-", "2  ", "222"],
    "3": ["33 ", "  3", "33 ", "  3", "33 "],
    "4": ["4 4", "4 4", "444", "  4", "  4"],
    "5": ["555", "5  ", "55 ", "  5", "55 "],
    "6": [" 6 ", "6  ", "66 ", "6 6", " 6 "],
    "7": ["777", "  7", " 7 ", " 7 ", " 7 "],
    "8": [" 8 ", "8 8", " 8 ", "8 8", " 8 "],
    "9": [" 9 ", "9 9", " 99", "  9", " 9 "],
    "!": ["!", "!", "!", "", "!"],
    "?": ["-?-", "  ?", "?? ", "   ", "?  "],
    ".": ["", "", " ", " ", "."],
    ",": ["", "", "  ", " ,", ", "],
    ":": [":", " ", ":", "", " "],
  },
};

function renderBigText(text: string, font: keyof typeof FONTS): string {
  const f = FONTS[font];
  const upper = text.toUpperCase();
  const rows = 5;
  const lines: string[] = Array(rows).fill("");
  for (const char of upper) {
    const glyph = f[char] || f[" "] || Array(rows).fill("  ");
    for (let r = 0; r < rows; r++) {
      lines[r] += (glyph[r] || "  ") + " ";
    }
  }
  return lines.join("\n");
}

// --- image to ascii ---
const ASCII_CHARS = ["@", "#", "S", "%", "?", "*", "+", ";", ":", " "];
const ASCII_CHARS_DETAILED = [
  "$",
  "@",
  "B",
  "%",
  "8",
  "&",
  "W",
  "M",
  "#",
  "*",
  "o",
  "a",
  "h",
  "k",
  "b",
  "d",
  "p",
  "q",
  "w",
  "m",
  "Z",
  "O",
  "0",
  "Q",
  "L",
  "C",
  "J",
  "U",
  "Y",
  "X",
  "z",
  "c",
  "v",
  "u",
  "n",
  "x",
  "r",
  "j",
  "f",
  "t",
  "/",
  "\\",
  "|",
  "(",
  ")",
  "1",
  "{",
  "}",
  "[",
  "]",
  "?",
  "-",
  "_",
  "+",
  "~",
  "<",
  ">",
  "i",
  "!",
  "l",
  "I",
  ";",
  ":",
  ",",
  '"',
  "^",
  "`",
  "'",
  ".",
  " ",
];

function imageToAscii(
  canvas: HTMLCanvasElement,
  width: number,
  detailed: boolean,
): string {
  const ctx = canvas.getContext("2d")!;
  const chars = detailed ? ASCII_CHARS_DETAILED : ASCII_CHARS;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const charWidth = Math.floor(canvas.width / width);
  const charHeight = Math.floor(charWidth * 2);
  const rows = Math.floor(canvas.height / charHeight);
  let result = "";
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < width; col++) {
      let total = 0,
        count = 0;
      for (let dy = 0; dy < charHeight; dy++) {
        for (let dx = 0; dx < charWidth; dx++) {
          const px =
            ((row * charHeight + dy) * canvas.width + (col * charWidth + dx)) *
            4;
          if (px < data.length) {
            const r = data[px],
              g = data[px + 1],
              b = data[px + 2];
            total += 0.299 * r + 0.587 * g + 0.114 * b;
            count++;
          }
        }
      }
      const brightness = count > 0 ? total / count : 0;
      const idx = Math.floor((brightness / 255) * (chars.length - 1));
      result += chars[chars.length - 1 - idx];
    }
    result += "\n";
  }
  return result;
}

// --- pattern generator ---
type Pattern =
  | "box"
  | "wave"
  | "grid"
  | "zigzag"
  | "dots"
  | "cross"
  | "diamond"
  | "checkerboard";

function generatePattern(
  type: Pattern,
  width: number,
  height: number,
  char1: string,
  char2: string,
): string {
  const lines: string[] = [];
  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++) {
      switch (type) {
        case "box":
          line +=
            y === 0 || y === height - 1
              ? char1
              : x === 0 || x === width - 1
                ? char1
                : char2;
          break;
        case "wave":
          line += Math.sin((x + y * 0.5) * 0.5) > 0 ? char1 : char2;
          break;
        case "grid":
          line += x % 4 === 0 || y % 2 === 0 ? char1 : char2;
          break;
        case "zigzag":
          line += (x + y) % 4 < 2 ? char1 : char2;
          break;
        case "dots":
          line += x % 3 === 0 && y % 2 === 0 ? char1 : char2;
          break;
        case "cross":
          line += x % 6 === 3 || y % 3 === 1 ? char1 : char2;
          break;
        case "diamond":
          line +=
            Math.abs(x - Math.floor(width / 2)) +
              Math.abs(y - Math.floor(height / 2)) ===
            Math.floor(Math.min(width, height) / 3)
              ? char1
              : char2;
          break;
        case "checkerboard":
          line += (x + y) % 2 === 0 ? char1 : char2;
          break;
      }
    }
    lines.push(line);
  }
  return lines.join("\n");
}

type Tab = "bigtext" | "image" | "pattern";

export default function AsciiPage() {
  const [tab, setTab] = useState<Tab>("bigtext");

  // big text state
  const [bigInput, setBigInput] = useState("tinytinker");
  const [bigFont, setBigFont] = useState<keyof typeof FONTS>("block");
  const [bigOutput, setBigOutput] = useState("");

  // image state
  const [imgOutput, setImgOutput] = useState("");
  const [imgWidth, setImgWidth] = useState(60);
  const [detailed, setDetailed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // pattern state
  const [patternType, setPatternType] = useState<Pattern>("box");
  const [patWidth, setPatWidth] = useState(40);
  const [patHeight, setPatHeight] = useState(12);
  const [char1, setChar1] = useState("█");
  const [char2, setChar2] = useState("░");
  const [patOutput, setPatOutput] = useState("");

  // copied state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (bigInput) setBigOutput(renderBigText(bigInput, bigFont));
  }, [bigInput, bigFont]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const scale = img.width / img.height;
      canvas.width = 400;
      canvas.height = Math.floor(400 / scale);
      canvas
        .getContext("2d")!
        .drawImage(img, 0, 0, canvas.width, canvas.height);
      setImgOutput(imageToAscii(canvas, imgWidth, detailed));
    };
    img.src = URL.createObjectURL(file);
  };

  const runPattern = () =>
    setPatOutput(
      generatePattern(patternType, patWidth, patHeight, char1, char2),
    );

  const currentOutput =
    tab === "bigtext" ? bigOutput : tab === "image" ? imgOutput : patOutput;

  const copy = () => {
    navigator.clipboard.writeText(currentOutput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <ToolPage
      title="ascii generator"
      description="big text, image to ascii, and pattern generator — all in one place."
      category="generative text"
    >
      {/* tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {(["bigtext", "image", "pattern"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? "btn btn-primary" : "btn btn-ghost"}
            style={{ fontSize: 11 }}
          >
            {t === "bigtext"
              ? "big text"
              : t === "image"
                ? "image → ascii"
                : "patterns"}
          </button>
        ))}
      </div>

      {/* big text tab */}
      {tab === "bigtext" && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--ink-ghost)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              text
            </div>
            <input
              type="text"
              value={bigInput}
              onChange={(e) => setBigInput(e.target.value)}
              placeholder="type something…"
              maxLength={12}
              style={{ fontSize: 14, maxWidth: 360 }}
            />
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--ink-ghost)",
                marginTop: 4,
              }}
            >
              max 12 characters
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--ink-ghost)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              font style
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {(Object.keys(FONTS) as (keyof typeof FONTS)[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setBigFont(f)}
                  className={
                    bigFont === f ? "btn btn-primary" : "btn btn-ghost"
                  }
                  style={{ fontSize: 11 }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* image tab */}
      {tab === "image" && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--ink-ghost)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              upload image
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <button
              className="btn btn-ghost"
              onClick={() => fileRef.current?.click()}
            >
              ✦ choose image
            </button>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16,
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
                  marginBottom: 8,
                }}
              >
                width — {imgWidth} chars
              </div>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={imgWidth}
                onChange={(e) => setImgWidth(parseInt(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-ghost)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                detail level
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className={!detailed ? "btn btn-primary" : "btn btn-ghost"}
                  style={{ fontSize: 11 }}
                  onClick={() => setDetailed(false)}
                >
                  simple
                </button>
                <button
                  className={detailed ? "btn btn-primary" : "btn btn-ghost"}
                  style={{ fontSize: 11 }}
                  onClick={() => setDetailed(true)}
                >
                  detailed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* pattern tab */}
      {tab === "pattern" && (
        <div>
          <div style={{ marginBottom: 16 }}>
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
              pattern type
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(
                [
                  "box",
                  "wave",
                  "grid",
                  "zigzag",
                  "dots",
                  "cross",
                  "diamond",
                  "checkerboard",
                ] as Pattern[]
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setPatternType(p)}
                  className={
                    patternType === p ? "btn btn-primary" : "btn btn-ghost"
                  }
                  style={{ fontSize: 11 }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: 12,
              marginBottom: 16,
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
                  marginBottom: 6,
                }}
              >
                width — {patWidth}
              </div>
              <input
                type="range"
                min={10}
                max={80}
                step={2}
                value={patWidth}
                onChange={(e) => setPatWidth(parseInt(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-ghost)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                height — {patHeight}
              </div>
              <input
                type="range"
                min={4}
                max={30}
                step={1}
                value={patHeight}
                onChange={(e) => setPatHeight(parseInt(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-ghost)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                char 1
              </div>
              <input
                type="text"
                value={char1}
                onChange={(e) => setChar1(e.target.value.slice(0, 1) || "█")}
                maxLength={1}
                style={{ width: 60, textAlign: "center", fontSize: 16 }}
              />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-ghost)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                char 2
              </div>
              <input
                type="text"
                value={char2}
                onChange={(e) => setChar2(e.target.value.slice(0, 1) || "░")}
                maxLength={1}
                style={{ width: 60, textAlign: "center", fontSize: 16 }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <button className="btn btn-primary" onClick={runPattern}>
              ✦ generate pattern
            </button>
          </div>
        </div>
      )}

      {/* output */}
      {currentOutput && (
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-ghost)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>output</span>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 10, padding: "3px 10px" }}
              onClick={copy}
            >
              {copied ? "copied ✦" : "copy"}
            </button>
          </div>
          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              padding: "16px 18px",
              fontFamily: "var(--font-mono)",
              fontSize: tab === "image" ? 6 : tab === "bigtext" ? 11 : 13,
              color: "var(--ink-soft)",
              lineHeight: tab === "image" ? 1.1 : 1.4,
              whiteSpace: "pre",
              overflowX: "auto",
            }}
          >
            {currentOutput}
          </div>
        </div>
      )}
    </ToolPage>
  );
}
