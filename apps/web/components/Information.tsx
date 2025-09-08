"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Filler,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Filler);

// ✅ move out to avoid useMemo dep warning
const pieColors: string[] = [
  "rgba(16,185,129,0.85)", // emerald
  "rgba(245,158,11,0.85)", // amber
  "rgba(244,63,94,0.85)",  // rose
  "rgba(99,102,241,0.85)", // indigo
  "rgba(156,163,175,0.85)",// gray
];

export default function Information() {
  const isMobile = useIsMobile();

  const [lineLabels, setLineLabels] = useState<string[]>(() => seedTimestamps(24));
  const [lineValues, setLineValues] = useState<number[]>(() => seedTrend(24, 120, 6));
  const [pieValues, setPieValues] = useState<number[]>([46, 22, 18, 9, 5]);

  useEffect(() => {
    const id = setInterval(() => {
      setLineLabels((prev) => [...prev.slice(-23), nowLabel()]);
      setLineValues((prev) => {
        const next = clamp(prev[prev.length - 1] + rand(-2, 7), 50, 600);
        return [...prev.slice(-23), next];
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setPieValues((prev) => rebalancePie(prev)), 4000);
    return () => clearInterval(id);
  }, []);

  // ✅ typed data
  const lineData: ChartData<"line"> = useMemo(
    () => ({
      labels: lineLabels,
      datasets: [
        {
          label: "Incidents (live)",
          data: lineValues,
          borderColor: "rgba(110,231,183,0.9)",
          backgroundColor: "rgba(16,185,129,0.15)",
          pointRadius: 0,
          tension: 0.35,
          fill: true,
        },
      ],
    }),
    [lineLabels, lineValues]
  );

  // ✅ typed options
  const lineOptions: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 450 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(17,24,39,0.9)",
          borderColor: "rgba(255,255,255,0.08)",
          borderWidth: 1,
          titleColor: "#fff",
          bodyColor: "rgba(255,255,255,0.85)",
          displayColors: false,
        },
      },
      layout: { padding: isMobile ? 4 : 8 },
      scales: {
        x: {
          grid: { color: "rgba(255,255,255,0.08)", display: !isMobile },
          ticks: {
            color: "rgba(255,255,255,0.6)",
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: isMobile ? 4 : 7,
            font: { size: isMobile ? 9 : 11 },
          },
        },
        y: {
          grid: { color: "rgba(255,255,255,0.08)" },
          ticks: {
            color: "rgba(255,255,255,0.6)",
            font: { size: isMobile ? 9 : 11 },
          },
        },
      },
    }),
    [isMobile]
  );

  // ✅ also typed, pieColors is static so no dep warning
  const pieData: ChartData<"doughnut"> = useMemo(
    () => ({
      labels: ["Phishing", "Identity Theft", "Payment Fraud", "Account Takeover", "Other"],
      datasets: [
        {
          data: pieValues,
          backgroundColor: pieColors,
          borderWidth: 0,
        },
      ],
    }),
    [pieValues]
  );

  const pieOptions: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: true,
      cutout: isMobile ? "58%" : "60%",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(17,24,39,0.9)",
          borderColor: "rgba(255,255,255,0.08)",
          borderWidth: 1,
          titleColor: "#fff",
          bodyColor: "rgba(255,255,255,0.85)",
        },
      },
    }),
    [isMobile]
  );

  return (
    <section id="information" className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:py-20 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" />
      <header className="mb-8 sm:mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
          Fraud & scam activity is rising fast
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-sm sm:text-base text-white/70">
          Attackers exploit people, code, and supply chains with increasingly realistic lures. Zero maps signals into a unified{" "}
          <span className="text-white/90">risk graph</span>, surfaces the most critical paths, and blocks what matters without the noise.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] sm:text-xs text-white/70">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,.6)]" />
          Live updating
        </div>
      </header>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <h3 className="mb-1 text-xs sm:text-sm font-semibold text-white/80">Incidents over time</h3>
          <p className="mb-3 sm:mb-4 text-[11px] sm:text-xs text-white/50">Live stream • last ~24 ticks</p>
          <div className={`w-full ${isMobile ? "h-32" : "h-48 sm:h-56 md:h-64 lg:h-72"}`}>
            {/* ✅ no 'any' */}
            <Line data={lineData} options={lineOptions} />
          </div>
        </Card>
        <Card>
          <h3 className="mb-1 text-xs sm:text-sm font-semibold text-white/80">Fraud by category</h3>
          <p className="mb-3 sm:mb-4 text:[11px] sm:text-xs text-white/50">Live share • adjusts over time</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className={`${isMobile ? "h-20 w-20" : "h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48"}`}>
              {/* ✅ no 'any' */}
              <Doughnut data={pieData} options={pieOptions} />
            </div>
            <Legend
              data={[
                { label: "Phishing", value: pieValues[0] },
                { label: "Identity Theft", value: pieValues[1] },
                { label: "Payment Fraud", value: pieValues[2] },
                { label: "Account Takeover", value: pieValues[3] },
                { label: "Other", value: pieValues[4] },
              ]}
              isMobile={isMobile}
            />
          </div>
        </Card>
      </div>
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 sm:p-6 shadow-[0_6px_40px_rgba(0,0,0,.35)] backdrop-blur"
    >
      {children}
    </motion.div>
  );
}

function Legend({ data, isMobile }: { data: { label: string; value: number }[]; isMobile: boolean }) {
  const cols = ["bg-emerald-400", "bg-amber-400", "bg-rose-400", "bg-indigo-400", "bg-gray-400"];
  return (
    <ul className={`text-xs sm:text-sm min-w-[9rem] ${isMobile ? "space-y-1" : "space-y-1.5 sm:space-y-2"}`}>
      {data.map((d, i) => (
        <li key={d.label} className="flex items-center gap-2">
          <span className={`inline-block ${isMobile ? "h-1.5 w-1.5" : "h-2 w-2 sm:h-2.5 sm:w-2.5"} rounded-full ${cols[i % cols.length]}`} />
          <span className="text-white/80">{d.label}</span>
          <span className="ml-auto text-white/50">{Math.round(d.value)}%</span>
        </li>
      ))}
    </ul>
  );
}

function useIsMobile(breakpoint = 640) {
  const [w, setW] = useState<number>(1024);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return w < breakpoint;
}

function nowLabel() {
  const d = new Date();
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

function seedTimestamps(n: number) {
  const arr: string[] = [];
  const now = Date.now();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now - i * 1500);
    const pad = (x: number) => (x < 10 ? `0${x}` : `${x}`);
    arr.push(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
  }
  return arr;
}

function seedTrend(n: number, start: number, avgStep: number) {
  const arr: number[] = [];
  let v = start;
  for (let i = 0; i < n; i++) {
    v = clamp(v + rand(-2, avgStep), 50, 600);
    arr.push(v);
  }
  return arr;
}

function rebalancePie(vals: number[]) {
  const next = [...vals];
  for (let k = 0; k < 2; k++) {
    const a = Math.floor(Math.random() * next.length);
    let b = Math.floor(Math.random() * next.length);
    if (a === b) b = (b + 1) % next.length;
    const delta = Math.random() * 4 - 2;
    next[a] = Math.max(2, next[a] + delta);
    next[b] = Math.max(2, next[b] - delta);
  }
  const sum = next.reduce((s, x) => s + x, 0);
  return next.map((x) => (x / sum) * 100);
}
