"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Doughnut, Bar, Line } from "react-chartjs-2";
import Image from "next/image";
import { Bell } from "lucide-react";
import Link from "next/link";

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

const Icon = ({
  path,
  className = "h-5 w-5",
}: {
  path: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <path d={path} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** ---------- EXPORT UTILS ---------- **/
function exportSectionToPDF(sectionId: string, filename: string) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const cloned = section.cloneNode(true) as HTMLElement;

  const origCanvases = section.querySelectorAll("canvas");
  const cloneCanvases = cloned.querySelectorAll("canvas");

  origCanvases.forEach((canvas, idx) => {
    try {
      const dataURL = (canvas as HTMLCanvasElement).toDataURL("image/png");
      const img = document.createElement("img");
      img.src = dataURL;
      img.style.width = (canvas as HTMLCanvasElement).style.width || "100%";
      img.style.height = (canvas as HTMLCanvasElement).style.height || "auto";
      const cloneCanvas = cloneCanvases[idx];
      if (cloneCanvas && cloneCanvas.parentNode) {
        cloneCanvas.parentNode.replaceChild(img, cloneCanvas);
      }
    } catch {
      // ignore
    }
  });

  const printWindow = window.open("", "_blank", "width=1024,height=768");
  if (!printWindow) return;

  const styles = `
    @page { size: A4; margin: 16mm; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial; color: #0b0b0b; background: #fff; }
    h1,h2,h3 { margin: 0 0 8px; }
    .print-wrap { width: 100%; }
    .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; background: #fff; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #f3f4f6; }
    th, td { border-bottom: 1px solid #e5e7eb; padding: 8px; text-align: left; font-size: 12px; }
    .muted { color: #6b7280; font-size: 12px; }
    img { max-width: 100%; height: auto; }
    .grid { display: grid; gap: 12px; }
    .mt-12 { margin-top: 12px; }
    .title { font-weight: 700; font-size: 18px; margin-bottom: 8px; }
    .subtitle { font-weight: 600; font-size: 14px; margin: 12px 0 6px; }
  `;

  const now = new Date();
  const printedAt = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

  const stripDarkClasses = (node: HTMLElement) => {
    node.className = node.className
      .replace(/bg-.*?(?=\s|$)/g, "")
      .replace(/text-white[^\s]*/g, "")
      .replace(/border-white[^\s]*/g, "");
    Array.from(node.children).forEach((child) =>
      stripDarkClasses(child as HTMLElement)
    );
  };
  stripDarkClasses(cloned);

  printWindow.document.open();
  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${filename.replace(/\.pdf$/i, "")}</title>
        <style>${styles}</style>
      </head>
      <body>
        <div class="print-wrap">
          <div class="muted">Exported: ${printedAt}</div>
          ${cloned.outerHTML}
        </div>
        <script>
          const waitForImages = () => {
            const imgs = Array.from(document.images || []);
            if (imgs.length === 0) { setTimeout(() => window.print(), 50); return; }
            let loaded = 0;
            imgs.forEach(img => {
              if (img.complete) { if (++loaded === imgs.length) window.print(); }
              else {
                img.addEventListener('load', () => { if (++loaded === imgs.length) window.print(); });
                img.addEventListener('error', () => { if (++loaded === imgs.length) window.print(); });
              }
            });
          };
          document.fonts && document.fonts.ready ? document.fonts.ready.then(waitForImages) : waitForImages();
          window.onafterprint = () => { window.close(); };
          document.title = ${JSON.stringify(filename.replace(/\.pdf$/i, ""))};
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

export default function Page() {
  /** ---------- DASHBOARD STATE / CHARTS ---------- **/
  const [open, setOpen] = useState(false);
  const phishingScore = 87;
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const phishingGauge = useMemo(
    () => ({
      data: {
        labels: ["Score", "Remaining"],
        datasets: [
          {
            data: [phishingScore, 100 - phishingScore],
            backgroundColor: ["#ef4444", "#1f2937"],
            borderWidth: 0,
            hoverOffset: 0,
            circumference: 240,
            rotation: 240 / 2 + 90,
            cutout: "70%",
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

  const flagsBar = {
    data: {
      labels: ["Linguistic", "Urgency", "Imperson.", "URL"],
      datasets: [
        {
          label: "Flags",
          data: [38, 55, 29, 44],
          backgroundColor: "#3b82f6",
          borderRadius: 6,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#9CA3AF" } },
        y: {
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#9CA3AF" },
          suggestedMax: 70,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  const verdictDonut = {
    data: {
      labels: ["Phishing", "Benign"],
      datasets: [
        {
          data: [64, 36],
          backgroundColor: ["#ef4444", "#3b82f6"],
          borderWidth: 0,
          cutout: "65%",
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  const vendorRiskLine = {
    data: {
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
      datasets: [
        {
          label: "Risk",
          data: [20, 32, 28, 45, 52, 49, 57, 66],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.15)",
          fill: true,
          tension: 0.35,
          pointRadius: 0,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#9CA3AF" } },
        y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#9CA3AF" } },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  const complianceScore = 72;
  const complianceGauge = {
    data: {
      labels: ["Score", "Remaining"],
      datasets: [
        {
          data: [complianceScore, 100 - complianceScore],
          backgroundColor: ["#22c55e", "#1f2937"],
          borderWidth: 0,
          hoverOffset: 0,
          circumference: 240,
          rotation: 240 / 2 + 90,
          cutout: "70%",
        },
      ],
    },
    options: {
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  const complianceTrend = {
    data: {
      labels: Array.from({ length: 9 }, (_, i) => `Week ${i + 1}`),
      datasets: [
        {
          label: "Compliance",
          data: [10, 25, 40, 35, 50, 42, 55, 53, 70],
          borderColor: "#ffffff",
          backgroundColor: "rgba(255,255,255,0.08)",
          fill: true,
          tension: 0.35,
          pointRadius: 0,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#9CA3AF" } },
        y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#9CA3AF" } },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  const severityDonut = {
    data: {
      labels: ["High", "Medium", "Low"],
      datasets: [
        {
          data: [27, 45, 28],
          backgroundColor: ["#ef4444", "#f59e0b", "#22c55e"],
          borderWidth: 0,
          cutout: "65%",
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  const incidentTrends = {
    data: {
      labels: ["02/03", "07/09", "08/15", "08/19", "08/24", "08/31", "09/17", "09/24"],
      datasets: [
        {
          label: "Created",
          data: [12, 26, 35, 29, 41, 33, 37, 49],
          borderColor: "#ffffff",
          backgroundColor: "rgba(255,255,255,0.08)",
          fill: false,
          tension: 0.35,
          pointRadius: 0,
        },
        {
          label: "Resolved",
          data: [4, 10, 22, 20, 28, 31, 29, 36],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.15)",
          fill: false,
          tension: 0.35,
          pointRadius: 0,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#9CA3AF" } },
        y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#9CA3AF" } },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  /** ---------- UI ---------- **/
  return (
    <div className="min-h-screen w-full bg-[#09080b] text-white">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/80">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4">
          <button
            onClick={() => setOpen(true)}
            className="xl:hidden -ml-1 rounded-xl p-2 hover:bg-white/5"
            aria-label="Open sidebar"
          >
            <Icon path="M4 6h16M4 12h16M4 18h16" />
          </button>
          <Link href={`/dashboard`} className="flex items-center justify-center gap-1">
            <Image
              src={`/assets/logo.png`}
              alt="logo"
              width={10000}
              height={10000}
              className="w-7 h-7 sm:w-9 sm:h-9"
            />
            <span className="text-sm md:text-lg font-semibold tracking-wide text-white/90 mr-1">
              Zero Console
            </span>
          </Link>
          <Badge color="green">Operational</Badge>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="bg-[#141417] p-2 cursor-pointer rounded-2xl hover:bg-[#1a1a1f]"
              >
                <Bell size={20} />
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-xl bg-[#060707] shadow-xl border border-white/10 z-50">
                  <div className="p-3 text-white/90 font-semibold border-b border-white/10 text-sm">
                    Notifications
                  </div>
                  <div className="divide-y divide-white/10 text-xs text-white/80">
                    <div className="p-2 hover:bg-white/5">
                      ✅ Deployment succeeded — v0.8.3 live.
                    </div>
                    <div className="p-2 hover:bg-white/5">
                      🔒 New login detected from Hyderabad.
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="ml-1 h-8 w-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/10" />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 xl:grid-cols-[240px_1fr]">
        <aside className="hidden xl:block border-r border-white/10">
          <nav className="sticky top-14 flex h-[calc(100vh-56px)] flex-col gap-2 p-3">
            {[
              {
                label: "Overview",
                link: "#overview",
                icon: (
                  <svg
                    className="h-5 w-5 text-white/60 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1.6" />
                    <rect x="14" y="3" width="7" height="7" rx="1.6" />
                    <rect x="3" y="14" width="7" height="7" rx="1.6" />
                    <rect x="14" y="14" width="7" height="7" rx="1.6" />
                  </svg>
                ),
              },
              {
                label: "Phishing",
                link: "#phishing",
                icon: (
                  <svg
                    className="h-5 w-5 text-white/60 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="7" width="14" height="10" rx="2" />
                    <path d="M3 9l7 5 7-5" />
                    <circle cx="19" cy="7" r="3" />
                    <path d="M19 5.5v2.2" />
                    <path d="M19 9.7h.01" />
                  </svg>
                ),
              },
              {
                label: "Vendors",
                link: "#vendors",
                icon: (
                  <svg
                    className="h-5 w-5 text-white/60 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" />
                    <path d="M3 8l9 5 9-5" />
                    <path d="M12 13v8" />
                  </svg>
                ),
              },
              {
                label: "Compliance",
                link: "#compliance",
                icon: (
                  <svg
                    className="h-5 w-5 text-white/60 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                ),
              },
              {
                label: "Incidents",
                link: "#incidents",
                icon: (
                  <svg
                    className="h-5 w-5 text-white/60 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3l9 16H3l9-16z" />
                    <path d="M12 9v5" />
                    <path d="M12 17h.01" />
                  </svg>
                ),
              },
            ].map((i, idx) => (
              <Link
                key={idx}
                href={i.link}
                className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 ring-1 ring-inset ring-white/10 hover:bg-white/5"
              >
                {i.icon}
                <span>{i.label}</span>
              </Link>
            ))}
            <div className="mt-auto text-xs text-white/40">
              © {new Date().getFullYear()} Zero • Built for defenders
            </div>
          </nav>
        </aside>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 xl:hidden"
              onClick={() => setOpen(false)}
            >
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
              <motion.aside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="relative h-full w-[50%] max-w-[320px] border-r border-white/10 bg-[#0e0e0f] p-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-3 flex items-center justify-between">
                  <Link href={`/dashboard`} className="flex items-center gap-1">
                    <Image
                      src={`/assets/logo.png`}
                      alt="logo"
                      width={10000}
                      height={10000}
                      className="w-8 h-8"
                    />
                    <span className="text-sm font-semibold">Zero</span>
                  </Link>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-xl p-2 hover:bg-white/5"
                  >
                    <Icon path="M6 18L18 6M6 6l12 12" />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Overview", icon: "M3 12h18M12 3v18", link: "#overview" },
                    {
                      label: "Phishing",
                      icon:
                        "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M9 12h6",
                      link: "#phishing",
                    },
                    {
                      label: "Vendors",
                      icon: "M3 7h18M3 12h18M3 17h18",
                      link: "#vendors",
                    },
                    { label: "Compliance", icon: "M5 13l4 4L19 7", link: "#compliance" },
                    {
                      label: "Incidents",
                      icon:
                        "M12 9v4m0 4h.01M5 12a7 7 0 1 0 14 0 7 7 0 0 0-14 0z",
                      link: "#incidents",
                    },
                  ].map((i, idx) => (
                    <Link
                      key={idx}
                      href={i.link}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 ring-1 ring-inset ring-white/10 hover:bg-white/5"
                    >
                      <Icon className="h-5 w-5 text-white/60" path={i.icon} />
                      <span>{i.label}</span>
                    </Link>
                  ))}
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main */}
        <main
          className="min-h-[calc(100vh-56px)] bg-[#09080b] to-transparent p-1 xl:p-3"
          id="phishing"
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Row 1: AI-Driven Phishing Detection */}
            <section
              className="rounded-2xl border border-white/10 bg-black/80 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]"
              id="overview"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">AI Phishing Detection</h2>
                <Badge color="green">Operational</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
                {/* Left: Input + Gauge */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_200px]">
                    <textarea
                      placeholder="Paste suspicious email or message"
                      className="min-h[120px] w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-sm outline-none placeholder:text-white/40"
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
                    <div className="relative h-48 rounded-xl border border-white/10 bg-black/40 p-2">
                      <Doughnut {...phishingGauge} />
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold">{phishingScore}</div>
                        <div className="text-sm text-white/70">Phishing</div>
                      </div>
                    </div>
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
                            64
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

            {/* Row 2: Supply Chain Vulnerability Mapping */}
            <section
              className="rounded-2xl border border-white/10 bg-black/80 p-4"
              id="vendors"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Supply Chain Mapping</h2>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
                    onClick={() =>
                      exportSectionToPDF("vendors", "Supply_Chain_Mapping.pdf")
                    }
                  >
                    Export
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  {/* Simple relationship map */}
                  <div className="relative h-64 rounded-xl bg-black/40">
                    {/* center */}
                    <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 ring-2 ring-emerald-500/40" />
                    <span className="absolute left-1/2 top-[calc(50%+44px)] -translate-x-1/2 text-xs text-white/80">
                      Your Organization
                    </span>
                    {/* nodes */}
                    {[
                      {
                        x: "20%",
                        y: "18%",
                        label: "Acme Corp",
                        color: "bg-red-500/20 ring-red-500/40",
                      },
                      {
                        x: "78%",
                        y: "26%",
                        label: "Tech Innovations",
                        color: "bg-amber-500/20 ring-amber-500/40",
                      },
                      {
                        x: "22%",
                        y: "74%",
                        label: "SecureSoft",
                        color: "bg-sky-500/20 ring-sky-500/40",
                      },
                      {
                        x: "82%",
                        y: "68%",
                        label: "Global Insights",
                        color: "bg-emerald-500/20 ring-emerald-500/40",
                      },
                    ].map((n, i) => (
                      <div key={i} className="absolute" style={{ left: n.x, top: n.y }}>
                        <div className={`h-10 w-10 rounded-full ring-2 ${n.color}`} />
                        <div className="mt-1 text-[11px] text-white/80">{n.label}</div>
                      </div>
                    ))}
                    {/* fake connecting lines */}
                    <div className="absolute left-[22%] top-[74%] h-[2px] w-[28%] -rotate-[22deg] bg-white/10" />
                    <div className="absolute left-[50%] top-[50%] h-[2px] w-[30%] -translate-y-1/2 bg-white/10" />
                    <div className="absolute left-[20%] top-[18%] h-[2px] w-[40%] rotate-[18deg] bg-white/10" />
                  </div>

                  {/* vendor table */}
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
                        { label: "DitaLogic", ts: "5h ago", level: "Medium", color: "amber" },
                        { label: "Tech Innovations", ts: "1d ago", level: "Med", color: "amber" },
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

            {/* Row 3: Security Posture & Compliance */}
            <section
              className="rounded-2xl border border-white/10 bg-black/80 p-4"
              id="compliance"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Security & Compliance</h2>
                <Badge color="red">Non-Compliant</Badge>
              </div>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr]">
                    <div className="relative h-44 rounded-xl border border-white/10 bg-black/40 p-2">
                      <Doughnut {...complianceGauge} />
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold">{complianceScore}</div>
                        <div className="text-xs text-white/80">
                          OVERALL SECURITY COMPLIANCE
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        ["Multi-Factor Authentication", true],
                        ["Firewall", true],
                        ["Disk Encryption", false],
                        ["Patching Updates", false],
                        ["Password Policy", false],
                        ["Device Encryption", true],
                      ].map(([label, ok], i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
                        >
                          <span className="text-white/80">{label as string}</span>
                          <span className={ok ? "text-emerald-400" : "text-red-400"}>
                            {ok ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="mb-3 text-sm font-semibold">Compliance Breakdown</p>
                  <div className="space-y-3">
                    {[
                      ["Policies", 78],
                      ["Devices", 46],
                      ["Users", 71],
                      ["Network", 33],
                    ].map(([label, v], i) => (
                      <div key={i}>
                        <div className="mb-1 flex items-center justify-between text-xs text-white/70">
                          <span>{label as string}</span>
                          <span>{v as number}%</span>
                        </div>
                        <div className="h-2 w-full rounded bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${v}%` }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ type: "spring", stiffness: 120, damping: 18 }}
                            className="h-2 rounded bg-emerald-500/80"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 h-32 rounded-xl border border-white/10 bg-black/40 p-2">
                    <Line {...complianceTrend} />
                  </div>
                </div>
              </div>
            </section>

            {/* Row 4: Incident & Response Tracker */}
            <section
              className="rounded-2xl border border-white/10 bg-black/80 p-4"
              id="incidents"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Incident Tracker</h2>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
                    onClick={() =>
                      exportSectionToPDF("incidents", "Incident_Tracker.pdf")
                    }
                  >
                    Export
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                {/* table + trend */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="grid grid-cols-3 gap-3 text-center sm:grid-cols-6">
                    {[
                      ["Total Incidents", "128"],
                      ["Open", "20"],
                      ["In Progress", "6"],
                      ["High", "38"],
                      ["Medium", "55"],
                      ["Low", "35"],
                    ].map(([k, v], i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-white/10 bg-black/40 p-2"
                      >
                        <div className="text-[11px] text-white/60">{k}</div>
                        <div className="text-xl font-semibold">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 overflow-auto rounded-xl border border-white/10">
                    <table className="w-full text-sm">
                      <thead className="bg-white/5 text-left text-white/60">
                        <tr>
                          <th className="px-3 py-2">ID</th>
                          <th className="px-3 py-2">Incident</th>
                          <th className="px-3 py-2">Severity</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2">Assigned</th>
                          <th className="px-3 py-2">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {[
                          ["INC-012", "Unauthorized Access", "High", "Open", "Alice Brown", "04/24"],
                          ["INC-017", "Phishing Attempt", "Medium", "Assigned", "John Spaith", "04/20"],
                          ["INC-010", "Data Breach", "High", "Resolved", "Jacob Eliner", "6d ago"],
                          ["INC-084", "Malware Infection", "High", "Assigned", "February Feb", "2 Feb"],
                          ["INC-088", "DDoS Attack", "Low", "Resolved", "February Apr", "4 Feb"],
                          ["INC-079", "Insider Threat", "Low", "Open", "—", "2 Apr"],
                        ].map((r, i) => (
                          <tr key={i} className="hover:bg-white/[0.03]">
                            {r.map((c, j) => (
                              <td key={j} className="px-3 py-2">
                                {c}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 h-32 rounded-xl border border-white/10 bg-black/40 p-2">
                    <Line {...incidentTrends} />
                  </div>
                </div>

                {/* right column */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="mb-2 text-sm font-semibold">Incident Severity</p>
                    <div className="relative h-40">
                      <Doughnut {...severityDonut} />
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm">
                        27% Low
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="mb-2 text-sm font-semibold">Latest Incident Updates</p>
                    <div className="space-y-2">
                      {[
                        ["INC-0128 assigned to Alice Brown", "2h ago"],
                        ["INC-0102 marked as Resolved", "6h ago"],
                        ["INC-0127 status changed to Open", "1d ago"],
                      ].map((l, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2"
                        >
                          <span className="text-sm text-white/80">{l[0]}</span>
                          <span className="text-xs text-white/50">{l[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
