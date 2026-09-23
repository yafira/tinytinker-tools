"use client";

// ✦ tinkerbit ✦, the resident companion of tinytinker.tools
// not an AI. no network calls. no storage. conversation lives in React
// state only and evaporates on refresh, by design.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ask, type Reply } from "@/lib/tinkerbit/match";
import "./Tinkerbit.css";

type Message = {
  role: "you" | "tinkerbit";
  text: string;
  reply?: Reply;
};

const STARTERS = [
  "what resistor do i need for an LED?",
  "help me pick colors",
  "what is velostat?",
  "how do i fold a zine?",
];

export default function Tinkerbit() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "tinkerbit",
      text: "hi! i’m tinkerbit ✦ ask me which tool to use, or small questions about electronics, color, text & zines. (i’m not an AI — nothing you type is saved or sent anywhere.)",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function send(question?: string) {
    const q = (question ?? input).trim();
    if (!q) return;
    const reply = ask(q);
    setMessages((prev) => [
      ...prev,
      { role: "you", text: q },
      { role: "tinkerbit", text: reply.text, reply },
    ]);
    setInput("");
    inputRef.current?.focus();
  }

  function clearChat() {
    setMessages([
      {
        role: "tinkerbit",
        text: "fresh page ✦ what would you like to know?",
      },
    ]);
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <>
      <div
        className={`tb-drawer ${open ? "tb-drawer--open" : ""}`}
        role="dialog"
        aria-label="tinkerbit — tool companion"
        aria-hidden={!open}
      >
        <header className="tb-header">
          <span className="tb-title">
            <span className="tb-star-glyph">✦</span> tinkerbit
          </span>
          <span className="tb-subtitle">
            not an AI · nothing leaves your browser
          </span>
          <div className="tb-header-actions">
            {messages.length > 1 && (
              <button
                className="tb-clear"
                onClick={clearChat}
                aria-label="clear conversation and start over"
                title="clear conversation"
              >
                ↺ clear
              </button>
            )}
            <button
              className="tb-close"
              onClick={() => setOpen(false)}
              aria-label="close tinkerbit"
            >
              ×
            </button>
          </div>
        </header>

        <div className="tb-messages" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`tb-msg tb-msg--${m.role}`}>
              <span className="tb-msg-author">
                {m.role === "you" ? "you" : "✦ tinkerbit"}
              </span>
              <p className="tb-msg-text">{m.text}</p>

              {m.reply?.searchUrl && (
                <a
                  href={m.reply.searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tb-chip tb-chip--go"
                >
                  search the web for this ↗
                </a>
              )}

              {m.reply?.match?.href && (
                <Link href={m.reply.match.href} className="tb-chip tb-chip--go">
                  open {m.reply.match.name} →
                </Link>
              )}

              {m.reply && m.reply.alternates.length > 0 && (
                <div className="tb-alternates">
                  <span className="tb-alternates-label">maybe you meant:</span>
                  {m.reply.alternates.map((alt) =>
                    alt.href ? (
                      <Link key={alt.id} href={alt.href} className="tb-chip">
                        {alt.name}
                      </Link>
                    ) : (
                      <button
                        key={alt.id}
                        className="tb-chip"
                        onClick={() => send(alt.name)}
                      >
                        {alt.name}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          ))}

          {messages.length === 1 && (
            <div className="tb-starters">
              {STARTERS.map((s) => (
                <button key={s} className="tb-chip" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.length > 1 && (
            <div className="tb-nudge" aria-hidden="true">
              ask another, or ↺ to start fresh
            </div>
          )}
        </div>

        <div className="tb-inputrow">
          <input
            ref={inputRef}
            className="tb-input"
            value={input}
            placeholder="ask about a tool…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            aria-label="ask tinkerbit a question"
          />
          <button className="tb-send" onClick={() => send()}>
            ask
          </button>
        </div>
      </div>

      <button
        className="tb-fab"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={
          open ? "close tinkerbit" : "open tinkerbit, the tool companion"
        }
      >
        <span aria-hidden="true" className="tb-star-glyph">
          ✦
        </span>
        <span className="tb-fab-label">ask tinkerbit</span>
      </button>
    </>
  );
}
