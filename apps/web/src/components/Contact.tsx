"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    // TODO: replace with your API call
    setTimeout(() => setStatus("sent"), 800);
  }

  return (
    <section id="contact" className="relative z-10 mx-auto max-w-6xl px-4 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      />
      <header className="mb-12 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Get in touch
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/70">
          Questions, demos, partnerships tell us what you need and we will get back within 24-48 hours.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur shadow-[0_6px_40px_rgba(0,0,0,.35)]"
        >
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none"
                  required
                />
              </Field>
              <Field label="Work email">
                <input
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none"
                  required
                />
              </Field>
            </div>

            <Field label="Company">
              <input
                type="text"
                name="company"
                placeholder="Acme Inc."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none"
              />
            </Field>

            <Field label="Subject">
              <input
                type="text"
                name="subject"
                placeholder="Demo request / Pricing / Partnership"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none"
              />
            </Field>

            <Field label="Message">
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us a bit about your use case…"
                className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none"
                required
              />
            </Field>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white/50">
                By submitting, you agree to be contacted about your request.
              </p>
              <button
                type="submit"
                disabled={status !== "idle"}
                className={[
                  "inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-semibold transition",
                  status === "idle"
                    ? "border-white/15 bg-white/5 text-white hover:bg-white/10"
                    : "border-white/10 bg-white/5 text-white/60",
                ].join(" ")}
              >
                {status === "idle" && "Send"}
                {status === "sending" && "Sending…"}
                {status === "sent" && "Sent ✓"}
              </button>
            </div>
          </form>
        </motion.div>
        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] p-6 backdrop-blur shadow-[0_6px_40px_rgba(0,0,0,.35)]"
        >
          <InfoRow
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="4" y="6" width="16" height="12" rx="2" ry="2" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            }
            title="Email"
            content={
              <Link href="mailto:helpcentresupport@zero.com" className="text-white/80 hover:underline">
                helpcentresupport@zero.com
              </Link>
            }
          />
          <InfoRow
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7z" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            }
            title="Location"
            content={<span className="text-white/70">Remote • Worldwide</span>}
          />
          <InfoRow
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            title="Hours"
            content={<span className="text-white/70">Mon-Fri • 24/7 IST</span>}
          />

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <p className="text-sm text-white/80">Need enterprise support?</p>
            <p className="mt-1 text-xs text-white/60">
              We offer SLAs, custom terms, and integrations.
            </p>
            <a
              href="#pricing"
              className="mt-3 inline-flex rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
            >
              View plans
            </a>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}


function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/80">{label}</span>
      {children}
    </label>
  );
}

function InfoRow({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-white/80">{title}</div>
        <div className="text-sm">{content}</div>
      </div>
    </div>
  );
}
