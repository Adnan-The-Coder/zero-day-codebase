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
  Filler,
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
  Filler
);

type BadgeColor = "red" | "amber" | "green" | "blue" | "neutral" | "purple";

const Badge = ({
  children,
  color = "neutral",
  size = "sm"
}: {
  children: React.ReactNode;
  color?: BadgeColor;
  size?: "xs" | "sm" | "md";
}) => {
  const colorClasses = {
    red: "bg-red-500/20 text-red-300 ring-red-500/30",
    amber: "bg-amber-500/20 text-amber-300 ring-amber-500/30",
    green: "bg-green-500/20 text-green-300 ring-green-500/30",
    blue: "bg-blue-500/20 text-blue-300 ring-blue-500/30",
    purple: "bg-purple-500/20 text-purple-300 ring-purple-500/30",
    neutral: "bg-white/10 text-white/70 ring-white/20",
  };

  const sizeClasses = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm"
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ring-1 ring-inset ${colorClasses[color]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
};

const ThreatIcon = ({ type }: { type: string }) => {
  const icons = {
    malware: "",
    phishing: "",
    ransomware: "",
    vulnerability: "",
    data_breach: "",
    supply_chain: "",
    apt: "",
    default: ""
  };
  
  return <span className="text-lg">{icons[type as keyof typeof icons] || icons.default}</span>;
};

interface SupplyChainMappingProps {
  onExport?: () => void;
}

export default function SupplyChainMapping({ onExport }: SupplyChainMappingProps) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<number[]>([]);
  const [threatsByCompany, setThreatsByCompany] = useState<any[]>([]);
  const [threatCategories, setThreatCategories] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateRealisticData = () => {
      // Realistic vendor data with actual company patterns
      const realVendors = [
        { name: "Microsoft Corp", sector: "Cloud Services", employees: "221K", revenue: "$211B" },
        { name: "Amazon Web Services", sector: "Cloud Infrastructure", employees: "1.54M", revenue: "$514B" },
        { name: "Salesforce", sector: "CRM Software", employees: "73K", revenue: "$31B" },
        { name: "VMware Inc", sector: "Virtualization", employees: "38K", revenue: "$13B" },
        { name: "Cisco Systems", sector: "Networking", employees: "84K", revenue: "$57B" },
        { name: "Oracle Corporation", sector: "Database Software", employees: "164K", revenue: "$50B" },
        { name: "IBM Security", sector: "Security Services", employees: "282K", revenue: "$60B" },
        { name: "Adobe Inc", sector: "Creative Software", employees: "28K", revenue: "$19B" }
      ];

      // Generate realistic threat data
      const threatTypes = ["malware", "phishing", "ransomware", "vulnerability", "data_breach", "supply_chain", "apt"];
      const severityLevels = ["Critical", "High", "Medium", "Low"];
      
      const generatedAlerts = Array.from({ length: 12 }, (_, i) => {
        const vendor = realVendors[Math.floor(Math.random() * realVendors.length)];
        const threatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
        const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
        
        return {
          id: i,
          company: vendor.name,
          sector: vendor.sector,
          threatType,
          severity,
          description: generateThreatDescription(threatType, vendor.name),
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          riskScore: Math.floor(Math.random() * 40) + 60,
          affectedSystems: Math.floor(Math.random() * 50) + 1,
          color: getSeverityColor(severity)
        };
      });

      // Generate vendor risk data
      const vendorData = realVendors.map((vendor, i) => ({
        name: vendor.name,
        sector: vendor.sector,
        riskScore: Math.floor(Math.random() * 30) + 40,
        breaches: Math.floor(Math.random() * 5),
        vulnerabilities: Math.floor(Math.random() * 15) + 3,
        intelReports: Math.floor(Math.random() * 25) + 5,
        lastIncident: Math.floor(Math.random() * 180),
        compliance: Math.floor(Math.random() * 20) + 80,
        employees: vendor.employees,
        revenue: vendor.revenue
      }));

      // Generate threat category distribution
      const categoryData = {
        labels: ["Malware", "Phishing", "Ransomware", "Vulnerabilities", "Data Breaches", "Supply Chain", "APT"],
        datasets: [{
          data: [23, 18, 12, 28, 8, 7, 4],
          backgroundColor: [
            "#ef4444", "#f59e0b", "#8b5cf6", "#06b6d4", 
            "#10b981", "#f97316", "#ec4899"
          ],
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1
        }]
      };

      // Generate company threat mapping
      const companyThreats = realVendors.slice(0, 6).map(vendor => ({
        company: vendor.name,
        sector: vendor.sector,
        threats: Math.floor(Math.random() * 20) + 5,
        criticalThreats: Math.floor(Math.random() * 5),
        riskTrend: Array.from({ length: 7 }, () => Math.floor(Math.random() * 30) + 40)
      }));

      setAlerts(generatedAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setVendors(vendorData);
      setThreatsByCompany(companyThreats);
      setThreatCategories(categoryData);
      setRiskData(Array.from({ length: 30 }, (_, i) => 45 + Math.sin(i * 0.2) * 15 + Math.random() * 10));
      setLoading(false);
    };

    generateRealisticData();
  }, []);

  const generateThreatDescription = (type: string, company: string) => {
    const descriptions = {
      malware: `Suspicious malware activity detected in ${company} infrastructure`,
      phishing: `Phishing campaign targeting ${company} employees identified`,
      ransomware: `Ransomware indicators found in ${company} network traffic`,
      vulnerability: `Critical vulnerability discovered in ${company} systems`,
      data_breach: `Potential data exposure incident at ${company}`,
      supply_chain: `Supply chain compromise affecting ${company} services`,
      apt: `Advanced Persistent Threat activity linked to ${company}`
    };
    return descriptions[type as keyof typeof descriptions] || `Security incident at ${company}`;
  };

  const getSeverityColor = (severity: string): BadgeColor => {
    const colors = {
      "Critical": "red",
      "High": "amber",
      "Medium": "blue",
      "Low": "green"
    };
    return colors[severity as keyof typeof colors] as BadgeColor || "neutral";
  };

  const riskTrendChart = {
    data: {
      labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      datasets: [{
        label: "Average Risk Score",
        data: riskData,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1
        }
      },
      scales: {
        x: { 
          display: true,
          grid: { color: "rgba(255, 255, 255, 0.1)" },
          ticks: { color: "rgba(255, 255, 255, 0.6)", maxTicksLimit: 7 }
        },
        y: { 
          display: true,
          grid: { color: "rgba(255, 255, 255, 0.1)" },
          ticks: { color: "rgba(255, 255, 255, 0.6)" }
        }
      }
    }
  };

  const threatDistributionChart = {
    data: threatCategories,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: { color: "rgba(255, 255, 255, 0.8)", padding: 15 }
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#fff",
          bodyColor: "#fff"
        }
      }
    }
  };

  const companyThreatChart = {
    data: {
      labels: threatsByCompany.map(c => c.company.split(' ')[0]),
      datasets: [{
        label: "Total Threats",
        data: threatsByCompany.map(c => c.threats),
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "#ef4444",
        borderWidth: 1
      }, {
        label: "Critical Threats",
        data: threatsByCompany.map(c => c.criticalThreats),
        backgroundColor: "rgba(245, 158, 11, 0.6)",
        borderColor: "#f59e0b",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "rgba(255, 255, 255, 0.8)" }
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#fff",
          bodyColor: "#fff"
        }
      },
      scales: {
        x: { 
          grid: { color: "rgba(255, 255, 255, 0.1)" },
          ticks: { color: "rgba(255, 255, 255, 0.6)" }
        },
        y: { 
          grid: { color: "rgba(255, 255, 255, 0.1)" },
          ticks: { color: "rgba(255, 255, 255, 0.6)" }
        }
      }
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-white/10 bg-black/80 p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-black/80 p-4 lg:p-6" id="vendors">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Supply Chain Threat Intelligence</h2>
          <p className="text-white/60 mt-1">Real-time monitoring of vendor security posture and threat landscape</p>
        </div>
        <div className="flex gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{alerts.length}</div>
            <div className="text-xs text-white/60">Active Alerts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{vendors.length}</div>
            <div className="text-xs text-white/60">Vendors</div>
          </div>
          <button
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
            onClick={onExport}
          >
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-white/10 bg-gradient-to-r from-red-500/10 to-red-600/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Critical Threats</p>
              <p className="text-2xl font-bold text-red-400">{alerts.filter(a => a.severity === "Critical").length}</p>
            </div>
            <div className="text-2xl">🚨</div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-gradient-to-r from-amber-500/10 to-amber-600/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">High Risk Vendors</p>
              <p className="text-2xl font-bold text-amber-400">{vendors.filter(v => v.riskScore > 70).length}</p>
            </div>
            <div className="text-2xl">⚠️</div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-gradient-to-r from-blue-500/10 to-blue-600/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Avg Risk Score</p>
              <p className="text-2xl font-bold text-blue-400">{Math.round(vendors.reduce((acc, v) => acc + v.riskScore, 0) / vendors.length)}</p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-gradient-to-r from-green-500/10 to-green-600/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Compliance Rate</p>
              <p className="text-2xl font-bold text-green-400">{Math.round(vendors.reduce((acc, v) => acc + v.compliance, 0) / vendors.length)}%</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Vendor Table & Risk Trend */}
        <div className="xl:col-span-2 space-y-6">
          {/* Enhanced Vendor Table */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Vendor Risk Assessment</h3>
              <Badge color="blue" size="sm">{vendors.length} Vendors</Badge>
            </div>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-left text-white/60">
                  <tr>
                    <th className="px-3 py-3 rounded-tl-lg">Vendor</th>
                    <th className="px-3 py-3">Sector</th>
                    <th className="px-3 py-3">Risk Score</th>
                    <th className="px-3 py-3">Breaches</th>
                    <th className="px-3 py-3">Vulns</th>
                    <th className="px-3 py-3">Intel</th>
                    <th className="px-3 py-3">Compliance</th>
                    <th className="px-3 py-3 rounded-tr-lg">Last Incident</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {vendors.map((vendor, i) => (
                    <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-3 py-3">
                        <div>
                          <div className="font-medium text-white">{vendor.name}</div>
                          <div className="text-xs text-white/60">{vendor.employees} employees</div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <Badge color="neutral" size="xs">{vendor.sector}</Badge>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${vendor.riskScore > 70 ? 'text-red-400' : vendor.riskScore > 50 ? 'text-amber-400' : 'text-green-400'}`}>
                            {vendor.riskScore}
                          </span>
                          <div className="w-12 h-2 bg-white/10 rounded-full">
                            <div 
                              className={`h-full rounded-full ${vendor.riskScore > 70 ? 'bg-red-500' : vendor.riskScore > 50 ? 'bg-amber-500' : 'bg-green-500'}`}
                              style={{ width: `${vendor.riskScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">{vendor.breaches}</td>
                      <td className="px-3 py-3 text-center">{vendor.vulnerabilities}</td>
                      <td className="px-3 py-3 text-center">{vendor.intelReports}</td>
                      <td className="px-3 py-3">
                        <span className={`font-medium ${vendor.compliance > 90 ? 'text-green-400' : vendor.compliance > 80 ? 'text-amber-400' : 'text-red-400'}`}>
                          {vendor.compliance}%
                        </span>
                      </td>
                      <td className="px-3 py-3 text-white/60">{vendor.lastIncident}d ago</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Trend Chart */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-lg font-semibold mb-4">Supply Chain Risk Trend (30 Days)</h3>
            <div className="h-64">
              <Line {...riskTrendChart} />
            </div>
          </div>

          {/* Company Threat Mapping */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-lg font-semibold mb-4">Threats by Company</h3>
            <div className="h-64">
              <Bar {...companyThreatChart} />
            </div>
          </div>
        </div>

        {/* Right Column - Alerts & Analytics */}
        <div className="space-y-6">
          {/* Real-time Alerts */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Live Threat Alerts</h3>
              <Badge color="red" size="sm">Live</Badge>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.slice(0, 8).map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-xl border border-white/10 bg-black/40 p-3 hover:bg-black/60 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <ThreatIcon type={alert.threatType} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge color={alert.color} size="xs">{alert.severity}</Badge>
                        <Badge color="neutral" size="xs">{alert.threatType.toUpperCase()}</Badge>
                      </div>
                      <p className="text-sm text-white/80 mb-2">{alert.description}</p>
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>{alert.company}</span>
                        <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="text-white/60">Risk Score: <span className="text-red-400 font-medium">{alert.riskScore}</span></span>
                        <span className="text-white/60">Affected: <span className="text-amber-400 font-medium">{alert.affectedSystems}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Threat Distribution */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-lg font-semibold mb-4">Threat Category Distribution</h3>
            <div className="h-64">
              <Doughnut {...threatDistributionChart} />
            </div>
          </div>

          {/* Top Risk Companies */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-lg font-semibold mb-4">High Risk Vendors</h3>
            <div className="space-y-3">
              {vendors
                .sort((a, b) => b.riskScore - a.riskScore)
                .slice(0, 5)
                .map((vendor, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/40">
                    <div>
                      <div className="font-medium text-white">{vendor.name}</div>
                      <div className="text-xs text-white/60">{vendor.sector}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${vendor.riskScore > 70 ? 'text-red-400' : 'text-amber-400'}`}>
                        {vendor.riskScore}
                      </div>
                      <div className="text-xs text-white/60">Risk Score</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}