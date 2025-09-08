"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const features = {
  free: [
    "AI-driven phishing checks (basic)",
    "Screenshot/URL inspection (5/day)",
    "Supply chain map (limited)",
    "Email/message analysis (core rules)",
  ],
  pro: [
    "Everything in Free",
    "Unlimited phishing & URL scans",
    "Vendor risk scores + CVE feed",
    "Automated alerts & weekly reports",
    "SSO (Google/Microsoft), role-based access",
    "API access (rate-limited)",
  ],
  enterprise: [
    "Everything in Pro",
    "Custom risk models & allowlists",
    "Audit logs & SIEM export",
    "On-prem/Private cloud options",
    "Dedicated TAM & SLA",
    "Early-access features",
  ],
};

const plans = [
  {
    name: "Free",
    tagline: "For individuals and small teams exploring the platform",
    priceMonthly: 0,
    priceYearly: 0,
    cta: "Get Started",
    highlight: false,
    features: features.free,
  },
  {
    name: "Pro",
    tagline: "For growing teams that need automation and scale",
    priceMonthly: 29,
    priceYearly: 290, 
    cta: "Upgrade to Pro",
    highlight: true,
    features: features.pro,
  },
  {
    name: "Enterprise",
    tagline: "For organizations with advanced security & compliance needs",
    priceMonthly: 0,
    priceYearly: 0,
    priceNote: "Custom",
    cta: "Contact Sales",
    highlight: false,
    features: features.enterprise,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="relative z-10 mx-auto max-w-6xl px-4 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(16,185,129,0.06),transparent_60%)]"
      />
      <header className="mb-12 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/70">
          Start free. Scale when you are ready. No surprises, just security that keeps up.
        </p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur">
          <button
            onClick={() => setYearly(false)}
            className={`rounded-xl px-4 py-2 text-sm transition ${
              yearly ? "text-white/60" : "bg-white/10 text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`rounded-xl px-4 py-2 text-sm transition ${
              yearly ? "bg-white/10 text-white" : "text-white/60"
            }`}
          >
            Yearly <span className="ml-1 text-gray-300/80">• save ~20%</span>
          </button>
        </div>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p, idx) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            className={[
              "group relative rounded-2xl border backdrop-blur p-6",
              p.highlight
                ? "border-gray-500 bg-gray-400/[0.06] shadow-[0_0_40px_rgba(16,185,129,.12)]"
                : "border-white/10 bg-white/[0.045]",
            ].join(" ")}
          >
            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p className="mt-1 text-sm text-white/70">{p.tagline}</p>
            <div className="mt-6 flex items-end gap-2">
              {p.priceNote ? (
                <span className="text-3xl font-bold">{p.priceNote}</span>
              ) : (
                <>
                  <span className="text-4xl font-bold">
                    ${yearly ? p.priceYearly : p.priceMonthly}
                  </span>
                  <span className="pb-1 text-sm text-white/60">
                    {p.name === "Free"
                      ? "/forever"
                      : yearly
                      ? "/year"
                      : "/month"}
                  </span>
                </>
              )}
            </div>
            <Link
              href={p.name === "Enterprise" ? "#contact" : "#signup"}
              className={[
                "mt-6 inline-flex w-full items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
                p.highlight
                  ? "border-gray-300/30 bg-gray-300/15 text-gray-100 hover:bg-gray-300/25"
                  : "border-white/15 bg-white/5 text-white hover:bg-white/10",
              ].join(" ")}
            >
              {p.cta}
            </Link>
            <ul className="mt-6 space-y-3 text-sm">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-white/85">
                  <CheckIcon className={p.highlight ? "text-gray-200" : "text-white/70"} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {p.name === "Free" && (
              <p className="mt-6 text-xs text-white/50">No credit card required.</p>
            )}
            {p.name === "Pro" && (
              <p className="mt-6 text-xs text-white/50">Billed {yearly ? "annually" : "monthly"}. Cancel anytime.</p>
            )}
            {p.name === "Enterprise" && (
              <p className="mt-6 text-xs text-white/50">Custom terms, volume pricing, and SLAs available.</p>
            )}
          </motion.div>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-white/50">
        Need a deeper comparison? We can map features to your compliance needs (SOC 2, ISO 27001, HIPAA) on request.
      </p>
    </section>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`mt-0.5 h-4 w-4 flex-none ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
