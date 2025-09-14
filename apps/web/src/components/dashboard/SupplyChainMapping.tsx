"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Line } from "react-chartjs-2";
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

type BadgeColor = "red" | "amber" | "green" | "neutral";

const Badge = ({
  children,
  color = "neutral",
  onRemove,
}: {
  children: React.ReactNode;
  color?: BadgeColor;
  onRemove?: () => void;
}) => {
  const colorClasses = {
    red: "bg-red-500/20 text-red-400 ring-red-500/40",
    amber: "bg-amber-500/20 text-amber-400 ring-amber-500/40",
    green: "bg-green-500/20 text-green-400 ring-green-500/40",
    neutral: "bg-white/10 text-white/70 ring-white/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses[color]}`}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 rounded-full px-1 text-white/70 hover:text-red-400"
        >
          ✕
        </button>
      )}
    </span>
  );
};

interface SupplyChainMappingProps {
  onExport?: () => void;
  userUUID: string; // user ID to send to API
}

const popularVendors = [
  "Acme Corp",
  "Global Insights",
  "Tech Innovations",
  "SecureSoft",
  "DataLogic",
  "BlueTech",
  "InnovateX",
  "CyberSafe",
  "NextGen Solutions",
  "Alpha Systems",
];

const roles = ["CEO", "CTO", "Manager", "Lead", "Analyst", "Intern"];

export default function SupplyChainMapping({ onExport, userUUID }: SupplyChainMappingProps) {
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [vendors, setVendors] = useState<string[]>([]);
  const [vendorInput, setVendorInput] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [organizationCreated, setOrganizationCreated] = useState(false);

  // Add vendor
  const addVendor = (vendor: string) => {
    if (vendor.trim() !== "" && !vendors.includes(vendor)) {
      setVendors([...vendors, vendor]);
      setVendorInput("");
    }
  };

  const removeVendor = (vendor: string) => {
    setVendors(vendors.filter((v) => v !== vendor));
  };

  // Generate organization ID
  const generateOrganizationID = () => uuidv4();

  const handleNext = async () => {
    if (!companyName.trim() || !position.trim() || !userUUID.trim()) {
      alert("Company name, role, and user ID are required!");
      return;
    }

    const organizationID = generateOrganizationID();

    try {
      const response = await fetch(
        "https://zero-day-cf-server.ghost-server.workers.dev/supplychain/organization/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_uuid: userUUID,
            organization_name: companyName,
            userRole: position,
            organizationID,
            vendors,
            details: "",
          }),
        }
      );

      const data: { success: boolean; message?: string } = await response.json();
      if (data.success) {
        setOrganizationCreated(true); // hide company name + role fields
        setShowMap(true);
      } else {
        alert(data.message || "Failed to create organization");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating the organization");
    }
  };

  // Chart placeholder
  const vendorRiskLine = {
    data: {
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
      datasets: [
        {
          label: "Risk",
          data: [45, 52, 48, 61, 55, 67, 63, 58],
          borderColor: "#fff",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#fff",
        },
      ],
    },
    options: {
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  const vendorPositions = vendors.map((v, i) => {
    const angle = (i / vendors.length) * Math.PI * 2;
    const radius = 40;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y, label: v };
  });

  return (
    <section className="rounded-2xl border border-white/10 bg-black/80 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Supply Chain Mapping</h2>
        {onExport && (
          <button
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 text-white"
            onClick={onExport}
          >
            Export
          </button>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        {!organizationCreated && (
          <div className="mb-4 flex gap-4 flex-wrap">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-white/80 mb-1">
                Company Name:
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 focus:outline-none"
                placeholder="Enter your company name"
              />
            </div>

            <div className="w-1/2 min-w-[150px]">
              <label className="block text-sm font-semibold text-white/80 mb-1">Role:</label>
              <input
                list="roles"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 focus:outline-none"
                placeholder="Select role"
              />
              <datalist id="roles">
                {roles.map((r, idx) => (
                  <option key={idx} value={r} />
                ))}
              </datalist>
            </div>
          </div>
        )}

        {/* Vendor Input */}
        <div className="mb-4 flex gap-2 flex-wrap">
          <input
            list="vendor-list"
            value={vendorInput}
            onChange={(e) => {
              setVendorInput(e.target.value);
              if (popularVendors.includes(e.target.value)) addVendor(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && addVendor(vendorInput)}
            placeholder="Select or type vendor"
            className="flex-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 focus:outline-none"
          />
          <datalist id="vendor-list">
            {popularVendors.map((v, idx) => (
              <option key={idx} value={v} />
            ))}
          </datalist>

          {!organizationCreated && (
            <button
              className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
              onClick={handleNext}
            >
              NEXT
            </button>
          )}
        </div>

        {/* Show vendors */}
        <div className="mb-4 flex flex-wrap gap-2">
          {vendors.map((v, i) => (
            <Badge key={i} color="neutral" onRemove={() => removeVendor(v)}>
              {v}
            </Badge>
          ))}
        </div>

        {/* Map */}
        {showMap && (
          <div className="relative h-64 rounded-xl bg-black/40 mb-4">
            <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 ring-2 ring-white/20 flex items-center justify-center text-xs text-white text-center">
              {companyName || "Your Company"}
            </div>

            {vendorPositions.map((v, i) => {
              const angle = Math.atan2(v.y - 50, v.x - 50);
              const dist = Math.sqrt((v.x - 50) ** 2 + (v.y - 50) ** 2);
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: `${v.x}%`, top: `${v.y}%`, transform: "translate(-50%, -50%)" }}
                >
                  <div
                    className="absolute bg-white/20"
                    style={{
                      width: `${dist}%`,
                      height: "2px",
                      top: "50%",
                      left: "50%",
                      transformOrigin: "left",
                      transform: `translate(-50%, -50%) rotate(${angle}rad)`,
                    }}
                  />
                  <div className="h-10 w-10 rounded-full ring-2 bg-white/10 ring-white/20" />
                  <div className="mt-1 text-[11px] text-white/70 text-center">{v.label}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table & Chart */}
        {showMap && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
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
                <tbody className="divide-y divide-white/10">
                  {vendors.map((vendor, i) => {
                    const risk = Math.floor(Math.random() * 100);
                    const breaches = Math.floor(Math.random() * 5);
                    const vulns = Math.floor(Math.random() * 15);
                    const intel = Math.floor(Math.random() * 10);
                    return (
                      <tr key={i} className="hover:bg-white/[0.03]">
                        <td className="px-3 py-2">{vendor}</td>
                        <td className="px-3 py-2">{risk}</td>
                        <td className="px-3 py-2">{breaches}</td>
                        <td className="px-3 py-2">{vulns}</td>
                        <td className="px-3 py-2">{intel}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-2 text-sm font-semibold text-white">Vendor Risk Over Time</p>
              <div className="h-32">
                <Line {...vendorRiskLine} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
