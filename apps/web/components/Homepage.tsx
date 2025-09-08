"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import Pricing from "./Pricing";
import Contact from "./Contact";

export default function HomePage() {
  return (
    <main className="relative min-h-[140vh] overflow-hidden text-white">
      <BackgroundWires />
      <motion.section
        className="relative z-10 mx-auto max-w-6xl px-4 pt-40 pb-20 text-center"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <motion.h1
          className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        >
          Proactive Shielding{" "} for your digital future.
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-3xl text-balance text-base text-white/70 sm:text-lg"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
        >
          Build a complete risk graph of your software estate to pinpoint and
          fix critical issues across people and supply chain without the
          noise.
        </motion.p>
        <motion.div
          className="mt-10 flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.25 }}
        >
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center rounded-2xl px-3 py-3 text-sm font-semibold"
          >
            <span className="absolute inset-0 rounded-2xl" />
            <span className="relative rounded-2xl border border-white/20 px-6 py-3 text-white">
              Explore
            </span>
          </Link>
          <Link
            href="/"
            className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/5"
          >
            Dashboard Tour
          </Link>
        </motion.div>
        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.35 }}
        >
          <div className="rounded-full border border-white/10 px-4 py-1 gap-1 flex items-center justify-center text-xs text-white/50">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
            Private Beta • Enterprise-ready
          </div>
        </motion.div>
      </motion.section>
      <section id="features" className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="order-2 md:order-1"
          >
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-start">
              AI Driven Phishing Detection
            </h2>
            <p className="mt-3 text-white/70">
              Go beyond traditional filters by analyzing content, links, and
              screenshots to spot hyper-realistic deception and brand
              impersonation.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/80">
              <li className="rounded-xl border border-white/10 bg-white/5 p-4">
                <strong>Email & Message Analysis.</strong> Detect linguistic
                anomalies, urgency cues, and impersonation patterns.
              </li>
              <li className="rounded-xl border border-white/10 bg-white/5 p-4">
                <strong>Visual Site Checks.</strong> Screenshot/URL analysis
                catches look-alike domains and spoofed assets.
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="order-1 md:order-2"
          >
            <MockCard title="Phishing Verdict">
              <KeyRow label="Linguistic anomalies" value="Detected" />
              <KeyRow label="Impersonation risk" value="High (Exec look-alike)" />
              <KeyRow label="Urgency language" value="Present" />
              <KeyRow label="URL trust" value="Low — recent domain" />
            </MockCard>
          </motion.div>
        </div>
      </section>
      <section id="supply-chain" className="relative z-10 mx-auto max-w-6xl px-4 pb-28 pt-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <MockGraph />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Supply Chain Mapping
            </h2>
            <p className="mt-3 text-white/70">
              Real-time view of third party risk with scores, graph view, and
              proactive alerts.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/80">
              <li className="rounded-xl border border-white/10 bg-white/5 p-4">
                <strong>Vendor Risk Dashboard.</strong> Dynamic scores from
                breach history, CVEs, and threat intel overlays.
              </li>
              <li className="rounded-xl border border-white/10 bg-white/5 p-4">
                <strong>Interactive Map.</strong> Nodes sized/colored by risk
                for instant hotspots.
              </li>
              <li className="rounded-xl border border-white/10 bg-white/5 p-4">
                <strong>Automated Alerts.</strong> Get notified on major score
                changes or new vulnerabilities.
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      <Pricing />
      <Contact />

      <footer className="relative z-10 py-10 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Zero • Built for defenders
      </footer>
    </main>
  );
}

function KeyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 py-2 last:border-none">
      <span className="text-white/60">{label}</span>
      <span className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-emerald-200">
        {value}
      </span>
    </div>
  );
}

function MockCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] p-5 shadow-[0_6px_40px_rgba(0,0,0,.35)] backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-white/80">{title}</span>
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shadow-[0_0_12px_rgba(16,185,129,.6)]" />
      </div>
      {children}
    </div>
  );
}

function MockGraph() {
  const nodes: { x: string; y: string; risk: "High" | "Medium" | "Low" }[] = [
    { x: "12%", y: "25%", risk: "High" },
    { x: "82%", y: "28%", risk: "Low" },
    { x: "22%", y: "74%", risk: "Medium" },
    { x: "74%", y: "66%", risk: "High" },
  ];

  return (
    <div className="relative h-72 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-4 shadow-[0_6px_40px_rgba(0,0,0,.4)]">
      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-gradient-to-b from-white/20 to-white/5 shadow-[0_0_40px_rgba(255,255,255,0.08)]">
        <div className="absolute inset-0 rounded-full border border-white/10 animate-pulse" />
      </div>
      {nodes.map((n, idx) => (
        <div
          key={idx}
          className="absolute transition-transform duration-300 hover:scale-110"
          style={{ left: n.x, top: n.y }}
          title={`Risk: ${n.risk}`}
        >
          <div
            className={[
              "h-12 w-12 rounded-full border backdrop-blur-sm shadow-lg",
              n.risk === "High"
                ? "border-rose-400/40 bg-rose-400/15 shadow-[0_0_30px_rgba(244,63,94,.35)] animate-pulse"
                : n.risk === "Medium"
                ? "border-amber-300/40 bg-amber-300/12 shadow-[0_0_24px_rgba(252,211,77,.25)]"
                : "border-emerald-300/40 bg-emerald-300/12 shadow-[0_0_24px_rgba(110,231,183,.25)]",
            ].join(" ")}
          />
        </div>
      ))}
      <svg
        className="pointer-events-none absolute inset-0"
        viewBox="0 0 600 280"
        fill="none"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(99,102,241,0.2)" />
            <stop offset="50%" stopColor="rgba(45,212,191,0.35)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0.2)" />
          </linearGradient>
        </defs>

        <path
          d="M300 140 C 220 120, 120 110, 60 70"
          stroke="url(#lineGrad)"
          strokeWidth="1.4"
        />
        <path
          d="M300 140 C 420 120, 520 110, 560 85"
          stroke="url(#lineGrad)"
          strokeWidth="1.4"
        />
        <path
          d="M300 140 C 210 180, 120 210, 60 220"
          stroke="url(#lineGrad)"
          strokeWidth="1.4"
        />
        <path
          d="M300 140 C 420 180, 520 210, 560 200"
          stroke="url(#lineGrad)"
          strokeWidth="1.4"
        />
      </svg>
    </div>
  );
}

function BackgroundWires() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(156,163,175,0.08),transparent_60%)]" />
      <svg
        className="absolute inset-x-0 top-0 h-[90vh] sm:h-[520px] w-full opacity-45 sm:opacity-[0.22]"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
      >
        {[80, 160, 240, 320, 400, 480, 560, 640, 720].map((y, idx) => (
          <path
            key={idx}
            d={`M0 ${y} C 240 ${y - 40}, 520 ${y + 40}, 840 ${y} S 1280 ${y - 40}, 1440 ${y}`}
            fill="none"
            stroke="url(#grayGradient)"
            strokeWidth="1.2"
          />
        ))}
        <defs>
          <linearGradient id="grayGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(156,163,175,0.16)" /> {/* gray-400 */}
            <stop offset="50%" stopColor="rgba(209,213,219,0.32)" /> {/* gray-300 */}
            <stop offset="100%" stopColor="rgba(156,163,175,0.16)" /> {/* gray-400 */}
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
