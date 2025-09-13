"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export default function NotFoundPage() {
  return (
    <main>
        <Navbar/>
    <div className="relative min-h-[100vh] overflow-hidden text-white">
      <BackgroundWires404 />

      <motion.section
        className="relative z-10 mx-auto max-w-6xl px-4 pt-14 pb-20 text-center"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <motion.div
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.35 }}
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-rose-400 shadow-[0_0_14px_rgba(251,113,133,0.7)]" />
          Route not found
        </motion.div>

        <motion.h1
          className="mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        >
          <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
            404
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-5 max-w-2xl text-balance text-white/70"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
        >
          The route you`re looking for doesn`t exist, was renamed, or is
          currently offline. Let`s get you back to safety.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.25 }}
        >
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center rounded-2xl px-3 py-3 text-sm font-semibold"
          >
            <span className="absolute inset-0 rounded-2xl" />
            <span className="relative rounded-2xl border border-white/20 px-6 py-3 text-white hover:bg-white/5">
              Go Home
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/5"
          >
            Open Dashboard
          </Link>
        </motion.div>

        <motion.div
          className="mx-auto mt-14 grid max-w-3xl gap-3 sm:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.35 }}
        >
          <TipCard hint="Check the URL" detail="Typos and trailing slashes can break routes." />
          <TipCard hint="Use Navbar" detail="Core pages are always linked up top." />
          <TipCard hint="Try Dashboard Tour" detail="Explore features from a known-good route." />
        </motion.div>
      </motion.section>

      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-4 pb-24"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.35 }}
      >
        <MockCard404 title="Route Debug Info">
          <KeyRow404 label="Status" value="404 Not Found" color="rose" />
          <KeyRow404 label="Session" value="Active" color="emerald" />
          <KeyRow404 label="Latency" value="12ms" color="indigo" />
          <KeyRow404 label="Next Step" value="Navigate to Home" color="amber" />
        </MockCard404>
      </motion.div>

      <footer className="relative z-10 pb-10 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Zero • Built for defenders
      </footer>
    </div>
    </main>
  );
}


function TipCard({ hint, detail }: { hint: string; detail: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4 text-left">
      <div className="text-sm font-semibold text-white/80">{hint}</div>
      <div className="mt-1 text-xs text-white/60">{detail}</div>
    </div>
  );
}

function KeyRow404({
  label,
  value,
  color = "emerald",
}: {
  label: string;
  value: string;
  color?: "emerald" | "rose" | "amber" | "indigo";
}) {
  const colorMap: Record<string, string> = {
    emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    rose: "border-rose-400/20 bg-rose-400/10 text-rose-200",
    amber: "border-amber-300/20 bg-amber-300/10 text-amber-100",
    indigo: "border-indigo-400/20 bg-indigo-400/10 text-indigo-200",
  };

  return (
    <div className="flex items-center justify-between border-b border-white/10 py-2 last:border-none">
      <span className="text-white/60">{label}</span>
      <span className={`rounded-md border px-2 py-0.5 text-xs ${colorMap[color]}`}>
        {value}
      </span>
    </div>
  );
}

function MockCard404({
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
        <span className="h-2 w-2 animate-ping rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,.6)]" />
      </div>
      {children}
    </div>
  );
}

/* ------------------------------ Background FX ------------------------------ */
/** Self-contained variant of your BackgroundWires to avoid cross-imports */
function BackgroundWires404() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(156,163,175,0.08),transparent_60%)]" />
      <svg
        className="absolute inset-x-0 top-0 h-[90vh] w-full opacity-45 sm:h-[520px] sm:opacity-[0.22] md:opacity-[0.26] lg:opacity-[0.28]"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
      >
        {[80, 160, 240, 320, 400, 480, 560, 640, 720].map((y, idx) => (
          <path
            key={idx}
            d={`M0 ${y} C 240 ${y - 40}, 520 ${y + 40}, 840 ${y} S 1280 ${y - 40}, 1440 ${y}`}
            fill="none"
            stroke="url(#grayGradient404)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}
        <defs>
          <linearGradient id="grayGradient404" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(156,163,175,0.16)" />
            <stop offset="50%" stopColor="rgba(209,213,219,0.32)" />
            <stop offset="100%" stopColor="rgba(156,163,175,0.16)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_70%)]" />
    </div>
  );
}
