"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import GitHubStars from "@/components/GitHubStars";
import { toolSections } from "@/lib/tools";
import Tinkerbit from "@/components/tinkerbit/Tinkerbit";

export default function Shell({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // the inline script in layout.tsx sets data-theme before paint,
  // so just sync the toggle icon with it
  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light",
    );
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  const sidebarContent = (
    <>
      {/* logo */}
      <Link
        href="/"
        style={{
          textDecoration: "none",
          display: "block",
          padding: "20px 16px 16px",
          borderBottom: "1.5px solid var(--border)",
        }}
        onClick={() => setMenuOpen(false)}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 15,
            fontWeight: 500,
            color: "var(--ink)",
            letterSpacing: "-0.02em",
          }}
        >
          tinytinker<span style={{ color: "var(--accent)" }}>✦</span>tools
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-soft)",
            marginTop: 3,
            letterSpacing: "0.1em",
          }}
        >
          handmade web tools
        </div>
      </Link>

      {/* nav */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {toolSections.map((section) => (
          <div key={section.label} style={{ marginBottom: 18 }}>
            <div
              className="nav-section-label"
              style={{
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "3px 8px",
                marginBottom: 5,
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 500,
              }}
            >
              <span style={{ color: "#f59e0b", fontSize: 8 }}>✦</span>
              {section.label}
            </div>
            {section.tools.map((item) => {
              const active = path === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "nav-link-active" : ""}
                  style={{
                    display: "block",
                    padding: "5px 8px",
                    fontSize: 13,
                    color: active ? "var(--ink)" : "var(--ink-soft)",
                    textDecoration: "none",
                    borderRadius: 5,
                    transition: "all 0.1s",
                    fontWeight: active ? 500 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background =
                        "var(--nav-hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                  }}
                >
                  {item.nav ?? item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* footer */}
      <div
        style={{ padding: "12px 16px", borderTop: "1.5px solid var(--border)" }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-soft)",
            lineHeight: 2,
            letterSpacing: "0.04em",
          }}
        >
          no logins. no tracking.
          <br />
          handmade web tools.
        </div>
        <GitHubStars />
        <Link
          href="/request"
          style={{
            display: "block",
            marginTop: 8,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--accent)",
            textDecoration: "none",
            letterSpacing: "0.04em",
          }}
        >
          ✦ request a tool
        </Link>
      </div>
    </>
  );

  return (
    <>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          {/* desktop sidebar */}
          <aside
            className="sidebar-desktop"
            style={{
              width: 230,
              flexShrink: 0,
              borderRight: "1.5px solid var(--border)",
              background: "var(--bg-sidebar)",
              display: "flex",
              flexDirection: "column",
              position: "sticky",
              top: 0,
              height: "100vh",
              overflowY: "auto",
              transition: "background 0.2s, border-color 0.2s",
            }}
          >
            {sidebarContent}
          </aside>

          {/* mobile header */}
          <div
            className="mobile-header"
            style={{
              display: "none",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: 56,
              background: "var(--bg-sidebar)",
              borderBottom: "1.5px solid var(--border)",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              zIndex: 90,
              transition: "background 0.2s",
            }}
          >
            <Link href="/" style={{ textDecoration: "none" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--ink)",
                }}
              >
                tinytinker<span style={{ color: "var(--accent)" }}>✦</span>tools
              </div>
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              style={{
                background: "none",
                border: "1.5px solid var(--border)",
                borderRadius: 6,
                padding: "6px 10px",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--ink-soft)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {menuOpen ? "✕" : "☰"} menu
            </button>
          </div>

          {/* mobile menu overlay */}
          {menuOpen && (
            <div
              className="mobile-overlay"
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                zIndex: 95,
              }}
            />
          )}

          {/* mobile sidebar drawer */}
          <aside
            id="mobile-nav"
            className="sidebar-mobile"
            aria-hidden={!menuOpen}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 280,
              height: "100vh",
              background: "var(--bg-sidebar)",
              borderRight: "1.5px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              zIndex: 100,
              transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
              visibility: menuOpen ? "visible" : "hidden",
              transition: menuOpen
                ? "transform 0.25s ease"
                : "transform 0.25s ease, visibility 0s linear 0.25s",
              overflowY: "auto",
            }}
          >
            {sidebarContent}
          </aside>

          {/* main content */}
          <main
            className="main-content"
            style={{
              flex: 1,
              minWidth: 0,
              background: "var(--bg)",
              transition: "background 0.2s",
            }}
          >
            {children}
          </main>
        </div>

        {/* fixed dark mode toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={dark ? "switch to light" : "switch to dark"}
          aria-label={dark ? "switch to light mode" : "switch to dark mode"}
          style={{ position: "fixed", top: 16, right: 20, zIndex: 101 }}
        >
          {dark ? "☀︎" : "☽"}
        </button>

        <Tinkerbit />
    </>
  );
}
