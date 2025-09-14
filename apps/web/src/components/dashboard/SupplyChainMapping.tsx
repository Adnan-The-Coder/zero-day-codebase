"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
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
  const colorClasses = {
    red: "bg-red-500/20 text-red-400 ring-red-500/40",
    amber: "bg-amber-500/20 text-amber-400 ring-amber-500/40",
    green: "bg-green-500/20 text-green-400 ring-green-500/40",
    blue: "bg-blue-500/20 text-blue-400 ring-blue-500/40",
    neutral: "bg-white/10 text-white/70 ring-white/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses[color]}`}
    >
      {children}
    </span>
  );
};

interface SupplyChainMappingProps {
  onExport?: () => void;
}

export default function SupplyChainMapping({ onExport }: SupplyChainMappingProps) {
  const vendorRiskLine = {
    data: {
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
      datasets: [
        {
          label: "Risk",
          data: [45, 52, 48, 61, 55, 67, 63, 58],
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#ef4444",
        },
      ],
    },
    options: {
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-black/80 p-4" id="vendors">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Supply Chain Mapping</h2>
        <div className="flex items-center gap-2">
          <button
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
            onClick={onExport}
          >
            Export
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="relative h-64 rounded-xl bg-black/40">
            <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 ring-2 ring-emerald-500/40" />
            <span className="absolute left-1/2 top-[calc(50%+44px)] -translate-x-1/2 text-xs text-white/80">
              Your Organization
            </span>
            {[
              { x: "20%", y: "18%", label: "Acme Corp", color: "bg-red-500/20 ring-red-500/40" },
              { x: "78%", y: "26%", label: "Tech Innovations", color: "bg-amber-500/20 ring-amber-500/40" },
              { x: "22%", y: "74%", label: "SecureSoft", color: "bg-sky-500/20 ring-sky-500/40" },
              { x: "82%", y: "68%", label: "Global Insights", color: "bg-emerald-500/20 ring-emerald-500/40" },
            ].map((n, i) => (
              <div key={i} className="absolute" style={{ left: n.x, top: n.y }}>
                <div className={`h-10 w-10 rounded-full ring-2 ${n.color}`} />
                <div className="mt-1 text-[11px] text-white/80">{n.label}</div>
              </div>
            ))}
            <div className="absolute left-[22%] top-[74%] h-[2px] w-[28%] -rotate-[22deg] bg-white/10" />
            <div className="absolute left-[50%] top-[50%] h-[2px] w-[30%] -translate-y-1/2 bg-white/10" />
            <div className="absolute left-[20%] top-[18%] h-[2px] w-[40%] rotate-[18deg] bg-white/10" />
          </div>

          <div className="mt-4 overflow-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-white/60">
                <tr>
                  <th className="px-3 py-2">Vendor</th>
                  <th className="px-3 py-2">Risk</th>
                  <th className="px-3 py-2">Breaches</th>
                  <th className="px-3 py-2">Vulns</th>
                  <th className="px-3 py-2">Intel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  ["Acme Corp", 85, 2, 8, 4],
                  ["Global Insights", 63, 0, 8, 8],
                  ["Tech Innovations", 59, 1, 10, 10],
                  ["SecureSoft", 41, 1, 5, 6],
                  ["DataLogic", 52, 4, 8, 1],
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-white/[0.03]">
                    <td className="px-3 py-2">{r[0]}</td>
                    <td className="px-3 py-2">{r[1]}</td>
                    <td className="px-3 py-2">{r[2]}</td>
                    <td className="px-3 py-2">{r[3]}</td>
                    <td className="px-3 py-2">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-2 text-sm font-semibold">Alerts</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Acme Corp", ts: "2h ago", level: "High", color: "red" },
                { label: "DataLogic", ts: "5h ago", level: "Medium", color: "amber" },
                { label: "Tech Innovations", ts: "1d ago", level: "Medium", color: "amber" },
                { label: "Global Insights", ts: "1d ago", level: "High", color: "red" },
              ].map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Badge color={a.color as BadgeColor}>{a.level}</Badge>
                    <span className="text-sm text-white/80">{a.label}</span>
                  </div>
                  <span className="text-xs text-white/50">{a.ts}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-2 text-sm font-semibold">Vendor Risk Over Time</p>
            <div className="h-32">
              <Line {...vendorRiskLine} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
