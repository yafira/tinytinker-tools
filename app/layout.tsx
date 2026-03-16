"use client";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  {
    label: "Electronics",
    items: [
      { href: "/tools/resistor", label: "Resistor decoder" },
      { href: "/tools/ohms-law", label: "Ohm's law calc" },
      { href: "/tools/wire-gauge", label: "Wire gauge ref" },
    ],
  },
  {
    label: "Generators",
    items: [{ href: "/tools/palette", label: "Color palette gen" }],
  },
  {
    label: "Print & Zine",
    items: [{ href: "/tools/zine-imposer", label: "Zine imposer" }],
  },
  {
    label: "Measurements",
    items: [{ href: "/tools/unit-converter", label: "Unit converter" }],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();

  return (
    <html lang="en">
      <head>
        <title>tinytinker.tools</title>
        <meta
          name="description"
          content="Tinkerer tools for people who make things."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙</text></svg>"
        />
      </head>
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          {/* Sidebar */}
          <aside
            style={{
              width: 200,
              flexShrink: 0,
              borderRight: "1px solid var(--border)",
              background: "var(--bg-sidebar)",
              display: "flex",
              flexDirection: "column",
              position: "sticky",
              top: 0,
              height: "100vh",
              overflowY: "auto",
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              style={{
                textDecoration: "none",
                display: "block",
                padding: "20px 16px 16px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--ink)",
                  letterSpacing: "-0.02em",
                }}
              >
                tinytinker<span style={{ color: "var(--accent)" }}>.</span>tools
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "var(--ink-faint)",
                  marginTop: 3,
                  letterSpacing: "0.12em",
                }}
              >
                handmade toolbox
              </div>
            </Link>

            {/* Nav */}
            <nav style={{ flex: 1, padding: "12px 8px" }}>
              {nav.map((section) => (
                <div key={section.label} style={{ marginBottom: 18 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      color: "var(--ink-faint)",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      padding: "0 8px",
                      marginBottom: 5,
                    }}
                  >
                    {section.label}
                  </div>
                  {section.items.map((item) => {
                    const active = path === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={active ? "nav-link-active" : ""}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "5px 8px",
                          fontSize: 11,
                          color: active ? "var(--ink)" : "var(--ink-soft)",
                          textDecoration: "none",
                          borderRadius: 6,
                          transition: "all 0.1s",
                        }}
                        onMouseEnter={(e) => {
                          if (!active)
                            (e.currentTarget as HTMLElement).style.background =
                              "var(--card-hover)";
                        }}
                        onMouseLeave={(e) => {
                          if (!active)
                            (e.currentTarget as HTMLElement).style.background =
                              "transparent";
                        }}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "var(--ink-ghost)",
                  lineHeight: 1.9,
                  letterSpacing: "0.04em",
                }}
              >
                handmade web tools.
              </div>
            </div>
          </aside>

          {/* Main */}
          <main style={{ flex: 1, minWidth: 0, background: "var(--bg)" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
