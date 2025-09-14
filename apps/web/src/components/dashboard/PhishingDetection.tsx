"use client";

import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

type BadgeColor = "red" | "amber" | "green" | "blue" | "neutral";

const Badge = ({
  children,
  color = "neutral",
}: {
  children: React.ReactNode;
  color?: BadgeColor;
}) => {
  const map: Record<BadgeColor, string> = {
    red: "bg-red-500/15 text-red-400 ring-1 ring-red-500/30",
    amber: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
    green: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
    blue: "bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30",
    neutral: "bg-white/5 text-white/70 ring-1 ring-white/10",
  };
  return (
    <span
      className={`hidden md:inline px-1 py-0.25 rounded-md text-[10px] font-medium cursor-pointer mt-1 ${map[color]}`}
    >
      {children}
    </span>
  );
};

interface PhishingDetectionProps {
  phishingScore?: number;
}

export default function PhishingDetection({
  phishingScore = 87,
}: PhishingDetectionProps) {
  // Gauge chart
  const phishingGauge = useMemo(
    () => ({
      data: {
        labels: ["Phishing Score", "Remaining"],
        datasets: [
          {
            data: [phishingScore, 100 - phishingScore],
            backgroundColor: ["#ef4444", "#1f2937"],
            borderWidth: 0,
            circumference: 240,
            rotation: 240 / 2 + 90,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        responsive: true,
        maintainAspectRatio: false,
      },
    }),
    [phishingScore]
  );

  // Flags bar chart
  const flagsBar = {
    data: {
      labels: ["Linguistic", "Urgency", "Impersonation", "URL"],
      datasets: [
        {
          label: "Flags",
          data: [85, 72, 68, 91],
          backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6"],
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: "#aaa" }, grid: { display: false } },
        y: { ticks: { color: "#aaa" }, grid: { color: "#333" } },
      },
    },
  };

  // Verdict chart
  const verdictDonut = {
    data: {
      labels: ["Phishing", "Benign"],
      datasets: [
        {
          data: [64, 36],
          backgroundColor: ["#ef4444", "#10b981"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  return (
    <section
      className="rounded-2xl border border-white/10 bg-black/80 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]"
      id="overview"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">AI Phishing Detection</h2>
        <Badge color="green">Operational</Badge>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
        {/* Left: Input + Charts */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_200px]">
            <textarea
              placeholder="Paste suspicious email or message"
              className="min-h-[120px] w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-sm outline-none placeholder:text-white/40"
            />
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2 text-sm outline-none placeholder:text-white/40"
                  placeholder="Add suspicious URL"
                />
                <button className="rounded-xl border border-white/10 px-3 py-2 text-sm hover:bg-white/10">
                  +
                </button>
              </div>
              <button className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
                Run Analysis
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Gauge */}
            <div className="relative h-48 rounded-xl border border-white/10 bg-black/40 p-2">
              <Doughnut {...phishingGauge} />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold">{phishingScore}</div>
                <div className="text-sm text-white/70">Phishing</div>
              </div>
            </div>

            {/* Flags + Verdict */}
            <div className="grid grid-cols-1 gap-4">
              <div className="h-28 rounded-xl border border-white/10 bg-black/40 p-3">
                <p className="mb-1 text-xs text-white/60">Flags by Type</p>
                <div className="h-[72px]">
                  <Bar {...flagsBar} />
                </div>
              </div>

              <div className="h-28 rounded-xl border border-white/10 bg-black/40 p-3">
                <p className="mb-1 text-xs text-white/60">Verdict Distribution</p>
                <div className="relative h-[72px]">
                  <Doughnut {...verdictDonut} />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm">
                    64%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: URL table */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 text-sm font-semibold text-white/80">Flagged URLs</p>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-white/60">
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-3">URL</th>
                  <th className="py-2 pr-3">Issue</th>
                  <th className="py-2">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  {
                    url: "hxtp://exarnple.com/login",
                    issue: "Impersonation",
                    risk: "High",
                    color: "red",
                  },
                  {
                    url: "hxxps://secure.example.net/",
                    issue: "Deceptive Link",
                    risk: "Medium",
                    color: "amber",
                  },
                  {
                    url: "hxxp://billing.exarnple.co",
                    issue: "Typosquatting",
                    risk: "High",
                    color: "red",
                  },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-white/[0.03]">
                    <td className="py-2 pr-3 text-white/80">{r.url}</td>
                    <td className="py-2 pr-3 text-white/70">{r.issue}</td>
                    <td className="py-2">
                      <Badge color={r.color as BadgeColor}>{r.risk}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
