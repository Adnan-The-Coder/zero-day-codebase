"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

type UIChatMsg = { role: "user" | "assistant"; content: string };

/* ------------------------------ */
/* Local Typewriter Effect (typed) */
/* ------------------------------ */
type TypewriterProps = {
  text: string;
  speed?: number;       // ms per character
  startDelay?: number;  // initial delay before typing
  className?: string;
};

function TypewriterText({
  text,
  speed = 22,
  startDelay = 120,
  className = "",
}: TypewriterProps) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const starter = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setDone(true);
        }
      }, Math.max(10, speed));
    }, Math.max(0, startDelay));

    return () => {
      clearTimeout(starter);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={className}>
      {shown}
      <span
        aria-hidden
        className={`ml-[1px] inline-block h-[1em] w-[0.5ch] translate-y-[2px] rounded-sm bg-white/70 align-baseline ${
          done ? "opacity-0" : "animate-pulse"
        }`}
        style={{ animationDuration: "900ms" }}
      />
    </span>
  );
}

/* ===================================================================================== */
/* ADD: Minimal Markdown renderer + Markdown Typewriter (no external deps, TS friendly)  */
/* ===================================================================================== */

/** Escapes HTML before injecting converted Markdown */
function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Very small Markdown → HTML (bold, italic, code, links, headings, ul, blockquote, paragraphs) */
function markdownToHtml(md: string): string {
  // protect code blocks first (```...```)
  let safe = md.replace(/\r\n/g, "\n");
  const codeBlocks: string[] = [];
  safe = safe.replace(/```([\s\S]*?)```/g, (_m, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre class="rounded bg-black/60 p-3 text-white/90 overflow-x-auto"><code>${escapeHtml(code)}</code></pre>`);
    return `@@CODEBLOCK_${idx}@@`;
  });

  // inline code
  safe = safe.replace(/`([^`]+)`/g, (_m, code) => `<code class="rounded bg-white/10 px-1 py-0.5">${escapeHtml(code)}</code>`);

  // bold (**text**)
  safe = safe.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // italic (*text*)
  safe = safe.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");

  // links [text](url)
  safe = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, `<a href="$2" target="_blank" rel="noreferrer" class="underline decoration-white/30 underline-offset-2 hover:decoration-white">$1</a>`);

  // blockquotes
  safe = safe.replace(/^\s*>\s?(.*)$/gm, `<blockquote class="border-l-2 border-white/20 pl-3 italic opacity-90 mb-2">$1</blockquote>`);

  // headings
  safe = safe.replace(/^###\s?(.*)$/gm, `<h3 class="text-sm font-semibold mb-1">$1</h3>`);
  safe = safe.replace(/^##\s?(.*)$/gm, `<h2 class="text-base font-semibold mb-2">$1</h2>`);
  safe = safe.replace(/^#\s?(.*)$/gm, `<h1 className="text-lg font-semibold mb-2">$1</h1>`);

  // unordered lists (- item)
  // group consecutive list lines into one <ul>
  safe = safe.replace(
    /(^|\n)(-\s[^\n]+(?:\n-\s[^\n]+)*)/g,
    (_m, p1, block) => {
      const items = block
        .split("\n")
        .map((l: string) => l.trim())
        .filter(Boolean)
        .map((l: string) => l.replace(/^- /, ""))
        .map((txt: string) => `<li>${txt}</li>`)
        .join("");
      return `${p1}<ul class="list-disc pl-5 space-y-1 mb-2">${items}</ul>`;
    }
  );

  // paragraphs: turn leftover double-newline separated chunks into <p>
  safe = safe
    .split(/\n{2,}/)
    .map((chunk) => {
      const trimmed = chunk.trim();
      if (!trimmed) return "";
      // if already block element, keep as is
      if (/^<(h[1-3]|ul|pre|blockquote)/.test(trimmed)) return trimmed;
      if (/^@@CODEBLOCK_\d+@@$/.test(trimmed)) return trimmed;
      // otherwise wrap into <p>
      return `<p class="mb-2 last:mb-0">${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("");

  // restore code blocks
  safe = safe.replace(/@@CODEBLOCK_(\d+)@@/g, (_m, i) => codeBlocks[Number(i)] ?? "");

  return safe;
}

function MarkdownBlock({ text }: { text: string }) {
  const html = markdownToHtml(text);
  return <div className="prose-invert" dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Typewriter that renders Markdown progressively */
function TypewriterMarkdown({
  text,
  speed = 22,
  startDelay = 120,
  className = "",
}: TypewriterProps) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const starter = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setDone(true);
        }
      }, Math.max(10, speed));
    }, Math.max(0, startDelay));

    return () => {
      clearTimeout(starter);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return (
    <div className={className}>
      <MarkdownBlock text={shown} />
      <span
        aria-hidden
        className={`ml-[1px] inline-block h-[1em] w-[0.5ch] translate-y-[2px] rounded-sm bg-white/70 align-baseline ${
          done ? "opacity-0" : "animate-pulse"
        }`}
        style={{ animationDuration: "900ms" }}
      />
    </div>
  );
}
/* ============================== END ADDITIONS ======================================= */

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<UIChatMsg[]>([]);
  const [ctaReady, setCtaReady] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  async function handleSendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const nextMessages: UIChatMsg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");

    try {
      const res = await fetch("/api/zero-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const contentType = res.headers.get("content-type") || "";
      let answer = "";
      
      if (contentType.includes("application/json")) {
        const jsonResponse = (await res.json()) as { text?: string; message?: string };
        answer = jsonResponse?.text ?? jsonResponse?.message ?? "";
      } else {
        answer = await res.text();
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: answer || "Sorry, I couldn't find that in the docs." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Server error. Please try again." },
      ]);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSendMessage(input);
  }

  // CTA reveal timing
  useEffect(() => {
    if (!inView || messages.length === 0) return;
    messages.forEach((m, idx) => {
      if (m.role !== "assistant" || ctaReady[idx]) return;
      const chars = m.content.length;
      const estimatedMs = Math.min(400 + chars * 18, 4000);
      const t = setTimeout(
        () => setCtaReady((prev) => ({ ...prev, [idx]: true })),
        estimatedMs
      );
      // NOTE: forEach cleanup is not used; acceptable for one-shot reveal
      // If you want strict cleanup, refactor to map timeouts and clear on unmount.
    });
  }, [messages, inView, ctaReady]);

  return (
    <section
      className="relative z-10 w-full overflow-hidden px-6 py-12"
      id="about"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        backgroundPosition: "center",
      }}
    >
      <div ref={containerRef} className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl border border-white/10 bg-[#070606]/80 p-4 md:p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-3 flex items-center gap-2 text-xs md:text-sm text-white/70">
            <Sparkles className="h-4 w-4 text-white" />
            Z3RO • Ask anything about Cybersecurity.
          </div>

          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70 flex items-center gap-2">
                Try:{" "}
                <button
                  onClick={() => handleSendMessage("What is Cybersecurity?")}
                  className="rounded-md bg-white/10 px-3 py-1 text-white hover:bg-white/20 transition-colors"
                >
                  What is Cybersecurity?
                </button>
              </div>
            )}

            {messages.map((m, idx) => {
              const isAssistant = m.role === "assistant";
              return (
                <div key={idx} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[90%] md:max-w-[80%] rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                      isAssistant
                        ? "border-white/10 bg-white/[0.05] text-white/80"
                        : "border-white/10 bg-white text-black"
                    }`}
                  >
                    {/* ADD: Render assistant with Markdown typewriter; users stay plain text */}
                    {isAssistant && inView ? (
                      <TypewriterMarkdown
                        text={m.content}
                        className="text-sm md:text-base"
                        speed={22}
                        startDelay={120}
                      />
                    ) : isAssistant ? (
                      <MarkdownBlock text={m.content} />
                    ) : (
                      <span className="text-start">{m.content}</span>
                    )}

                    {isAssistant && ctaReady[idx] && (
                      <div className="mt-6 mb-1 flex flex-wrap gap-2">
                        <Link
                          href="#features"
                          className="inline-flex cursor-default items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs md:text-sm font-medium text-black hover:bg-white/90"
                        >
                          Features
                        </Link>
                        <Link
                          href="/dashboard"
                          className="inline-flex cursor-default items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-xs md:text-sm font-medium text-white hover:bg-white/5"
                        >
                          Dashboar
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={onSubmit}
            className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-2 backdrop-blur"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send message"
              className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-white/40 outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-60"
              disabled={!input.trim()}
            >
              Send <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-2 text-[11px] text-white/40">
            Answers are grounded in Z3RO docs.
          </p>
        </div>
      </div>
    </section>
  );
}
