"use client";

import React, { useState, useEffect } from "react";
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
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
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
  const [alerts, setAlerts] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<number[]>([]);

  useEffect(() => {
    const fetchThreatIntel = async () => {
      try {
        const res = await fetch(
          `https://otx.alienvault.com/api/v1/search/pulses?q=supplychain&limit=8`,
          {
            headers: {
              "X-OTX-API-KEY":
                "c960b1173c7e99e1c08597bf783047e9dfda7a41e97b20fe5e1c0733e227e670",
            },
          }
        );
        const data: any = await res.json();

        if (data.results) {
          // Alerts
          const parsedAlerts = data.results.map((pulse: any) => ({
            label: pulse.name,
            ts: new Date(pulse.created).toLocaleDateString(),
            company: pulse.author_name || "Unknown Vendor",
            level:
              pulse?.tags?.includes("high") ||
              pulse.name.match(/exploit|ransom|critical/i)
                ? "High"
                : "Medium",
            color:
              pulse?.tags?.includes("high") ||
              pulse.name.match(/exploit|ransom|critical/i)
                ? "red"
                : "amber",
          }));
          setAlerts(parsedAlerts);

          // Vendor metrics
          const parsedVendors = data.results.map((pulse: any, i: number) => [
            pulse.author_name || `Vendor ${i + 1}`,
            40 + Math.round(Math.random() * 60), // risk score
            Math.floor(Math.random() * 5), // breaches
            Math.floor(Math.random() * 12), // vulns
            Math.floor(Math.random() * 10), // intel count
          ]);
          setVendors(parsedVendors);

          // Trend line
          setRiskData(Array.from({ length: 8 }, () => 40 + Math.random() * 30));
        }
      } catch (err) {
        console.error("Error fetching OTX data", err);
      }
    };

    fetchThreatIntel();
  }, []);

  // Risk over time (line chart)
  const vendorRiskLine = {
    data: {
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
      datasets: [
        {
          label: "Risk",
          data: riskData,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  // Threats by severity (doughnut)
  const severityChart = {
    data: {
      labels: ["High", "Medium"],
      datasets: [
        {
          data: [
            alerts.filter((a) => a.level === "High").length,
            alerts.filter((a) => a.level === "Medium").length,
          ],
          backgroundColor: ["#ef4444", "#f59e0b"],
          borderColor: ["#ef4444", "#f59e0b"],
        },
      ],
    },
    options: {
      plugins: {
        legend: { position: "bottom" as const, labels: { color: "#fff" } },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  // Vendor risk bar chart
  const vendorRiskChart = {
    data: {
      labels: vendors.map((v) => v[0]),
      datasets: [
        {
          label: "Risk Score",
          data: vendors.map((v) => v[1]),
          backgroundColor: "#3b82f6",
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Vendor Risk Distribution",
          color: "#fff",
        },
      },
      scales: {
        x: { ticks: { color: "#fff" } },
        y: { ticks: { color: "#fff" } },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-black/80 p-4" id="vendors">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Supply Chain Threat Mapping</h2>
        <button
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
          onClick={onExport}
        >
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Vendor table */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 xl:col-span-2">
          <p className="mb-2 text-sm font-semibold text-white/80">Vendors</p>
          <div className="overflow-auto rounded-xl border border-white/10">
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
              <tbody className="divide-y divide-white/10 text-white/70">
                {vendors.map((r, i) => (
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

        {/* Severity Chart */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col">
          <p className="mb-2 text-sm font-semibold text-white/80">Threat Severity</p>
          <div className="flex-1">
            <Doughnut {...severityChart} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Alerts */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-2 text-sm font-semibold text-white/80">Recent Alerts</p>
          <div className="flex flex-col gap-2">
            {alerts.length === 0 && (
              <p className="text-xs text-white/50">No alerts yet.</p>
            )}
            {alerts.map((a, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Badge color={a.color as BadgeColor}>{a.level}</Badge>
                    <span className="text-sm text-white/80">{a.label}</span>
                  </div>
                  <span className="text-xs text-white/50">
                    Source: {a.company}
                  </span>
                </div>
                <span className="text-xs text-white/50">{a.ts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Risk Charts */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-4">
          <p className="text-sm font-semibold text-white/80">Vendor Risk Insights</p>
          <div className="h-40">
            <Line {...vendorRiskLine} />
          </div>
          <div className="h-40">
            <Bar {...vendorRiskChart} />
          </div>
        </div>
      </div>
    </section>
  );
}