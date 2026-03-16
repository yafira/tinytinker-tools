import Link from "next/link";

const featured = [
  {
    href: "/tools/resistor",
    label: "Resistor decoder",
    desc: "Read color bands, get resistance values & tolerances instantly.",
    category: "electronics",
  },
  {
    href: "/tools/ohms-law",
    label: "Ohm's law calc",
    desc: "Solve for V, I, R, or P — includes LED resistor calculator.",
    category: "electronics",
  },
  {
    href: "/tools/palette",
    label: "Color palette gen",
    desc: "Generate harmonious palettes from any seed color.",
    category: "generators",
  },
];

const allTools = [
  {
    section: "Electronics & Circuits",
    tools: [
      {
        href: "/tools/resistor",
        label: "Resistor decoder",
        desc: "Color band → resistance value",
      },
      {
        href: "/tools/ohms-law",
        label: "Ohm's law / LED calc",
        desc: "V, I, R, P solver + LED resistor",
      },
      {
        href: "/tools/wire-gauge",
        label: "Wire gauge reference",
        desc: "AWG ↔ mm², ampacity, resistance",
      },
    ],
  },
  {
    section: "Generators",
    tools: [
      {
        href: "/tools/palette",
        label: "Color palette gen",
        desc: "Harmonious palettes from any seed color",
      },
    ],
  },
  {
    section: "Print & Zine",
    tools: [
      {
        href: "/tools/zine-imposer",
        label: "Zine imposer",
        desc: "8-page mini-zine fold layout",
      },
    ],
  },
  {
    section: "Measurements",
    tools: [
      {
        href: "/tools/unit-converter",
        label: "Unit converter",
        desc: "Length, weight, temp, fabric, wire & more",
      },
    ],
  },
];

export default function Home() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 36px" }}>
      {/* Hero */}
      <div style={{ marginBottom: 48 }}>
        <h1
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 32,
            fontWeight: 300,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
            marginBottom: 14,
          }}
        >
          tinkerer tools
          <br />
          <span style={{ color: "var(--accent)", fontStyle: "italic" }}>
            for people who make things.
          </span>
        </h1>
        <p
          style={{
            fontSize: 12,
            color: "var(--ink-muted)",
            maxWidth: 460,
            lineHeight: 1.75,
          }}
        >
          tiny, focused utilities for makers, engineers, artists, crafters &
          tinkerers — without leaving your browser.
        </p>
      </div>

      {/* Featured */}
      <div style={{ marginBottom: 44 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>
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
              <div className="tool-card" style={{ padding: "16px 16px 14px" }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--ink)",
                    marginBottom: 5,
                  }}
                >
                  {tool.label}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--ink-muted)",
                    lineHeight: 1.6,
                  }}
                >
                  {tool.desc}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "var(--ink-ghost)",
                    marginTop: 10,
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

      {/* All tools */}
      {allTools.map((section) => (
        <div key={section.section} style={{ marginBottom: 36 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>
            {section.section}
          </div>
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
                <div className="tool-card" style={{ padding: "12px 13px" }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "var(--ink)",
                      marginBottom: 3,
                    }}
                  >
                    {tool.label}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--ink-faint)" }}>
                    {tool.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div
        style={{
          marginTop: 60,
          paddingTop: 20,
          borderTop: "1px solid var(--border)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "var(--ink-ghost)",
            letterSpacing: "0.06em",
            lineHeight: 1.8,
          }}
        >
          no logins. no ads. just tiny tinker tools.
        </p>
      </div>
    </div>
  );
}
