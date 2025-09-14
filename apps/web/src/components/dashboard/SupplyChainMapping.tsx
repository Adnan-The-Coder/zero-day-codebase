"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  userUUID: string;
}

interface Organization {
  id?: number;
  user_uuid: string;
  organization_name: string;
  userRole: string;
  organizationID: string;
  vendors: string[] | null;
  details: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE_URL = 'https://zero-day-cf-server.ghost-server.workers.dev';

const API_ENDPOINTS = {
  createOrganization: `${API_BASE_URL}/supplychain/organization/create`,
  updateOrganization: `${API_BASE_URL}/supplychain/organization/update`,
  getUserOrganizations: `${API_BASE_URL}/supplychain/organization/user`,
  getOrganization: `${API_BASE_URL}/supplychain/organization/get`,
  deleteOrganization: `${API_BASE_URL}/supplychain/organization/delete`,
  updateVendors: `${API_BASE_URL}/supplychain/vendors/update`,
  deleteVendors: `${API_BASE_URL}/supplychain/vendors/delete`,
  getOrganizationVendors: `${API_BASE_URL}/supplychain/vendors/get`,
};

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
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Organization state
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  
  // Form state
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [vendors, setVendors] = useState<string[]>([]);
  const [vendorInput, setVendorInput] = useState("");
  const [showMap, setShowMap] = useState(false);

  // API utility functions
  const makeApiCall = useCallback(async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API call failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }, []);

  // Fetch user organizations
  const fetchUserOrganizations = useCallback(async () => {
    if (!userUUID?.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await makeApiCall(`${API_ENDPOINTS.getUserOrganizations}?user_uuid=${encodeURIComponent(userUUID)}`);
      
      const orgs = data.data || [];
      setOrganizations(orgs);

      if (orgs.length === 0) {
        setIsFirstTimeUser(true);
        setShowMap(false);
      } else {
        setIsFirstTimeUser(false);
        const firstOrg = orgs[0];
        setCurrentOrganization(firstOrg);
        setCompanyName(firstOrg.organization_name);
        setPosition(firstOrg.userRole);
        setVendors(firstOrg.vendors || []);
        setShowMap(true);
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      setError(error instanceof Error ? error.message : 'Failed to load organizations');
      setIsFirstTimeUser(true);
    } finally {
      setLoading(false);
    }
  }, [userUUID, makeApiCall]);

  // Create new organization
  const createOrganization = useCallback(async () => {
    if (!companyName.trim() || !position.trim() || !userUUID.trim()) {
      throw new Error('Company name, role, and user ID are required');
    }

    const organizationID = uuidv4();
    
    const payload = {
      user_uuid: userUUID,
      organization_name: companyName.trim(),
      userRole: position.trim(),
      organizationID,
      vendors: vendors.length > 0 ? vendors : [],
      details: "",
    };

    const data = await makeApiCall(API_ENDPOINTS.createOrganization, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const newOrg: Organization = {
      ...payload,
      vendors: payload.vendors,
      details: payload.details,
    };

    setCurrentOrganization(newOrg);
    setOrganizations([newOrg]);
    setIsFirstTimeUser(false);
    setShowMap(true);

    return data;
  }, [companyName, position, userUUID, vendors, makeApiCall]);

  // Update vendors for current organization
  const updateOrganizationVendors = useCallback(async (newVendors: string[]) => {
    if (!currentOrganization?.organizationID) return;

    try {
      await makeApiCall(API_ENDPOINTS.updateVendors, {
        method: 'POST',
        body: JSON.stringify({
          user_uuid: userUUID,
          organizationID: currentOrganization.organizationID,
          vendors: newVendors,
        }),
      });

      // Update local state
      const updatedOrg = { ...currentOrganization, vendors: newVendors };
      setCurrentOrganization(updatedOrg);
      setOrganizations(orgs => 
        orgs.map(org => 
          org.organizationID === currentOrganization.organizationID ? updatedOrg : org
        )
      );
    } catch (error) {
      console.error('Failed to update vendors:', error);
      throw error;
    }
  }, [currentOrganization, userUUID, makeApiCall]);

  // Load data on mount
  useEffect(() => {
    if (userUUID?.trim()) {
      fetchUserOrganizations();
    }
  }, [userUUID, fetchUserOrganizations]);

  // Vendor management functions
  const addVendor = useCallback(async (vendor: string) => {
    if (!vendor.trim() || vendors.includes(vendor)) return;

    const newVendors = [...vendors, vendor];
    setVendors(newVendors);
    setVendorInput("");

    // If organization exists, update vendors on server
    if (currentOrganization && !isFirstTimeUser) {
      try {
        await updateOrganizationVendors(newVendors);
      } catch (error) {
        // Revert on error
        setVendors(vendors);
        setError(error instanceof Error ? error.message : 'Failed to add vendor');
      }
    }
  }, [vendors, currentOrganization, isFirstTimeUser, updateOrganizationVendors]);

  const removeVendor = useCallback(async (vendorToRemove: string) => {
    const newVendors = vendors.filter(v => v !== vendorToRemove);
    setVendors(newVendors);

    // If organization exists, update vendors on server
    if (currentOrganization && !isFirstTimeUser) {
      try {
        await updateOrganizationVendors(newVendors);
      } catch (error) {
        // Revert on error
        setVendors(vendors);
        setError(error instanceof Error ? error.message : 'Failed to remove vendor');
      }
    }
  }, [vendors, currentOrganization, isFirstTimeUser, updateOrganizationVendors]);

  // Handle next/create organization
  const handleNext = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isFirstTimeUser) {
        await createOrganization();
      } else {
        setShowMap(true);
      }
    } catch (error) {
      console.error('Failed to create/load organization:', error);
      setError(error instanceof Error ? error.message : 'Failed to process organization');
    } finally {
      setLoading(false);
    }
  }, [isFirstTimeUser, createOrganization]);

  // Chart configuration
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

  // Vendor positions for map visualization
  const vendorPositions = vendors.map((v, i) => {
    const angle = (i / vendors.length) * Math.PI * 2;
    const radius = 40;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y, label: v };
  });

  if (loading) {
    return (
      <section className="rounded-2xl border border-white/10 bg-black/80 p-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-white">Loading...</div>
        </div>
      </section>
    );
  }

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
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/20 border border-red-500/40 p-3 text-red-400 text-sm">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <div className="flex gap-2">
                {error.includes('session') && (
                  <button
                    onClick={checkUserSession}
                    className="text-xs bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded"
                    disabled={isLoading}
                  >
                    Retry
                  </button>
                )}
                <button
                  onClick={() => setError(null)}
                  className="text-red-300 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Organization Info Display */}
        {currentOrganization && !isFirstTimeUser && (
          <div className="mb-4 rounded-lg bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">{currentOrganization.organization_name}</h3>
                <p className="text-white/60 text-sm">Role: {currentOrganization.userRole}</p>
              </div>
              <Badge color="green">Active Organization</Badge>
            </div>
          </div>
        )}

        {/* Company Setup Form - only for first time users or editing */}
        {isFirstTimeUser && (
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
                disabled={loading}
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
                disabled={loading}
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
              if (popularVendors.includes(e.target.value)) {
                addVendor(e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && vendorInput.trim()) {
                addVendor(vendorInput);
              }
            }}
            placeholder="Select or type vendor name"
            className="flex-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 focus:outline-none"
            disabled={loading}
          />
          <datalist id="vendor-list">
            {popularVendors.map((v, idx) => (
              <option key={idx} value={v} />
            ))}
          </datalist>

          <button
            onClick={() => vendorInput.trim() && addVendor(vendorInput)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || !vendorInput.trim()}
          >
            Add
          </button>

          {isFirstTimeUser && (
            <button
              className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
              onClick={handleNext}
              disabled={loading || !companyName.trim() || !position.trim()}
            >
              {loading ? 'Creating...' : 'CREATE ORGANIZATION'}
            </button>
          )}

          {!isFirstTimeUser && !showMap && (
            <button
              className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
              onClick={handleNext}
              disabled={loading}
            >
              Show Map
            </button>
          )}
        </div>

        {/* Vendor Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {vendors.map((v, i) => (
            <Badge key={i} color="neutral" onRemove={() => removeVendor(v)}>
              {v}
            </Badge>
          ))}
          {vendors.length === 0 && (
            <p className="text-white/40 text-sm">No vendors added yet</p>
          )}
        </div>

        {/* Supply Chain Map */}
        {showMap && vendors.length > 0 && (
          <div className="relative h-64 rounded-xl bg-black/40 mb-4">
            <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 ring-2 ring-white/20 flex items-center justify-center text-xs text-white text-center p-1">
              {companyName || currentOrganization?.organization_name || "Your Company"}
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
                  <div className="mt-1 text-[11px] text-white/70 text-center max-w-[60px] truncate">{v.label}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Data Table and Chart */}
        {showMap && vendors.length > 0 && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-auto rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-left text-white/60">
                  <tr>
                    <th className="px-3 py-2">Vendor</th>
                    <th className="px-3 py-2">Risk Score</th>
                    <th className="px-3 py-2">Breaches</th>
                    <th className="px-3 py-2">Vulnerabilities</th>
                    <th className="px-3 py-2">Threat Intel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {vendors.map((vendor, i) => {
                    const risk = Math.floor(Math.random() * 100);
                    const breaches = Math.floor(Math.random() * 5);
                    const vulns = Math.floor(Math.random() * 15);
                    const intel = Math.floor(Math.random() * 10);
                    const riskColor = risk > 70 ? 'text-red-400' : risk > 40 ? 'text-amber-400' : 'text-green-400';
                    
                    return (
                      <tr key={i} className="hover:bg-white/[0.03] text-white">
                        <td className="px-3 py-2 font-medium">{vendor}</td>
                        <td className={`px-3 py-2 ${riskColor}`}>{risk}</td>
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

        {/* Empty State */}
        {showMap && vendors.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/60 mb-2">No vendors in your supply chain yet</p>
            <p className="text-white/40 text-sm">Add vendors above to visualize your supply chain</p>
          </div>
        )}
      </div>
    </section>
  );
}