import Link from "next/link";

const featured = [
  {
    href: "/tools/resistor",
    label: "resistor decoder",
    desc: "read color bands, get resistance values & tolerances instantly.",
    category: "electronics",
  },
  {
    href: "/tools/ascii",
    label: "ascii generator",
    desc: "big text, image to ascii, and pattern generator.",
    category: "generative text",
  },
  {
    href: "/tools/accessibility",
    label: "accessibility checker",
    desc: "contrast, color blindness simulator & readable text suggester.",
    category: "color & design",
  },
];

const allTools = [
  {
    section: "electronics",
    tools: [
      {
        href: "/tools/resistor",
        label: "resistor decoder",
        desc: "color band → resistance value",
      },
      {
        href: "/tools/ohms-law",
        label: "ohm's law / LED calc",
        desc: "V, I, R, P solver + LED resistor",
      },
      {
        href: "/tools/wire-gauge",
        label: "wire gauge reference",
        desc: "AWG ↔ mm², ampacity, resistance",
      },
      {
        href: "/tools/capacitor",
        label: "capacitor decoder",
        desc: "capacitor code → value",
      },
    ],
  },
  {
    section: "generative text",
    tools: [
      {
        href: "/tools/markov",
        label: "markov generator",
        desc: "generate text from any corpus",
      },
      {
        href: "/tools/cutup",
        label: "cut-up machine",
        desc: "burroughs-style text reassembly",
      },
      {
        href: "/tools/glitch-text",
        label: "glitch text",
        desc: "zalgo, wide, morse, binary & more",
      },
      {
        href: "/tools/zine-filler",
        label: "zine filler",
        desc: "placeholder text in 5 flavors",
      },
      {
        href: "/tools/ascii",
        label: "ascii generator",
        desc: "big text, image → ascii, patterns",
      },
    ],
  },
  {
    section: "color & design",
    tools: [
      {
        href: "/tools/palette",
        label: "color palette gen",
        desc: "harmonious palettes from any seed color",
      },
      {
        href: "/tools/color-converter",
        label: "color converter",
        desc: "hex ↔ rgb ↔ hsl ↔ oklch",
      },
      {
        href: "/tools/hex-name",
        label: "hex color namer",
        desc: "give any hex a poetic name",
      },
      {
        href: "/tools/color-cheatsheet",
        label: "color cheatsheet",
        desc: "quick reference for color codes",
      },
      {
        href: "/tools/accessibility",
        label: "accessibility checker",
        desc: "contrast, color blindness & more",
      },
    ],
  },
  {
    section: "print & zine",
    tools: [
      {
        href: "/tools/zine-imposer",
        label: "zine imposer",
        desc: "8-page mini-zine fold layout",
      },
    ],
  },
  {
    section: "measurements",
    tools: [
      {
        href: "/tools/unit-converter",
        label: "unit converter",
        desc: "length, weight, temp, fabric, wire & more",
      },
    ],
  },
  {
    section: "code & dev",
    tools: [
      {
        href: "/tools/code-identifier",
        label: "code identifier",
        desc: "detect programming language from a snippet",
      },
      {
        href: "/tools/binary-converter",
        label: "binary / hex converter",
        desc: "text & numbers → binary, hex, octal",
      },
      {
        href: "/tools/regex-tester",
        label: "regex tester",
        desc: "test regex patterns live",
      },
    ],
  },
];

export default function Home() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 40px" }}>
      {/* hero */}
      <div
        style={{
          marginBottom: 48,
          display: "flex",
          alignItems: "center",
          gap: 40,
        }}
      >
        <div style={{ flex: 1 }}>
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
            tinytinker.tools
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
            a soft toolkit
            <br />
            <span
              style={{
                color: "var(--accent)",
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              for curious makers.
            </span>
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--ink-muted)",
              maxWidth: 420,
              lineHeight: 1.8,
            }}
          >
            tiny, focused utilities for makers, engineers, artists, crafters &
            tinkerers — without leaving your browser.
          </p>
        </div>

        {/* flower mascot */}
        <div style={{ flexShrink: 0 }}>
          <img
            src="/flower.png"
            alt="tinytinker flower mascot"
            className="mascot"
            style={{
              width: 200,
              height: 200,
              objectFit: "contain",
              borderRadius: "50%",
              opacity: 0.95,
              transition: "filter 0.2s",
            }}
          />
        </div>
      </div>

      {/* featured */}
      <div style={{ marginBottom: 44 }}>
        <div className="section-head" style={{ marginBottom: 14 }}>
          greatest hits
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
          }}
        >
          {featured.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              style={{ textDecoration: "none" }}
            >
              <div className="feat-card" style={{ padding: "16px" }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--ink)",
                    marginBottom: 6,
                  }}
                >
                  {tool.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
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
                    marginTop: 12,
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

      {/* all tools */}
      {allTools.map((section) => (
        <div key={section.section} style={{ marginBottom: 36 }}>
          <div className="section-head">{section.section}</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
              gap: 8,
            }}
          >
            {section.tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                style={{ textDecoration: "none" }}
              >
                <div className="tool-card" style={{ padding: "12px 14px" }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--ink)",
                      marginBottom: 3,
                    }}
                  >
                    {tool.label}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>
                    {tool.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* footer */}
      <div
        style={{
          marginTop: 60,
          paddingTop: 18,
          borderTop: "1.5px solid var(--border)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-ghost)",
            letterSpacing: "0.06em",
            lineHeight: 2,
          }}
        >
          tinytinker.tools — made with curiosity ✦<br />
          no logins. no ads. handmade web tools.
        </p>
      </div>
    </div>
  );
}
