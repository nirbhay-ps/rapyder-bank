import React, { useState } from "react";
import {
  FileCheck, ShieldAlert, CheckCircle2, XCircle, Clock, AlertTriangle,
  User, FileText, Activity, TrendingUp, Search, Filter, ArrowRight,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { Tag } from "../components/ui";

// Dummy underwriting applications
const APPLICATIONS = [
  {
    id: "UW-2024-001",
    applicant: "Vikram Singh",
    age: 34,
    gender: "Male",
    product: "Term Life — ₹1.5 Cr",
    premium: "₹22,400/year",
    appliedDate: "2024-11-17",
    status: "approved",
    riskScore: 18,
    riskLevel: "low",
    bmi: 23.4,
    smoker: false,
    occupation: "Software Engineer",
    income: "₹28 LPA",
    medicalHistory: "None reported",
    documents: { aadhaar: true, pan: true, medicalReport: true, incomeProof: true, photo: true },
    aiRecommendation: "APPROVE — Standard rates",
    aiRationale: "Low risk profile. BMI within range, non-smoker, no pre-existing conditions, stable income. All documents verified successfully.",
    fraudFlags: [],
  },
  {
    id: "UW-2024-002",
    applicant: "Kavitha Sundaram",
    age: 45,
    gender: "Female",
    product: "Health Cover — ₹20 Lakh",
    premium: "₹18,600/year",
    appliedDate: "2024-11-17",
    status: "under-review",
    riskScore: 52,
    riskLevel: "medium",
    bmi: 28.1,
    smoker: false,
    occupation: "Business Owner",
    income: "₹45 LPA",
    medicalHistory: "Thyroid (controlled), Family history of diabetes",
    documents: { aadhaar: true, pan: true, medicalReport: true, incomeProof: true, photo: true },
    aiRecommendation: "APPROVE — Loading 15%",
    aiRationale: "Moderate risk due to family diabetes history and elevated BMI. Thyroid well-controlled per medical report. Recommend 15% premium loading.",
    fraudFlags: [],
  },
  {
    id: "UW-2024-003",
    applicant: "Deepak Malhotra",
    age: 52,
    gender: "Male",
    product: "Term Life — ₹2 Cr",
    premium: "₹64,000/year",
    appliedDate: "2024-11-16",
    status: "flagged",
    riskScore: 78,
    riskLevel: "high",
    bmi: 31.2,
    smoker: true,
    occupation: "Construction Contractor",
    income: "₹35 LPA",
    medicalHistory: "Hypertension (medicated), High cholesterol",
    documents: { aadhaar: true, pan: true, medicalReport: true, incomeProof: false, photo: true },
    aiRecommendation: "REFER — Human review needed",
    aiRationale: "High risk: Smoker + hypertension + high BMI + hazardous occupation. Income proof pending. Recommend manual underwriter review before decision.",
    fraudFlags: ["Income proof document missing", "Declared income vs lifestyle mismatch flagged"],
  },
  {
    id: "UW-2024-004",
    applicant: "Pooja Verma",
    age: 28,
    gender: "Female",
    product: "ULIP — ₹5 Lakh/year",
    premium: "₹5,00,000/year",
    appliedDate: "2024-11-18",
    status: "approved",
    riskScore: 12,
    riskLevel: "low",
    bmi: 21.8,
    smoker: false,
    occupation: "Doctor",
    income: "₹52 LPA",
    medicalHistory: "None",
    documents: { aadhaar: true, pan: true, medicalReport: true, incomeProof: true, photo: true },
    aiRecommendation: "APPROVE — Standard rates",
    aiRationale: "Excellent risk profile. Young, healthy, non-smoker, high income, stable profession. All documents verified.",
    fraudFlags: [],
  },
  {
    id: "UW-2024-005",
    applicant: "Rajan Nair",
    age: 60,
    gender: "Male",
    product: "Health Cover — ₹10 Lakh",
    premium: "₹42,000/year",
    appliedDate: "2024-11-15",
    status: "rejected",
    riskScore: 89,
    riskLevel: "critical",
    bmi: 33.5,
    smoker: true,
    occupation: "Retired (ex-Merchant Navy)",
    income: "₹18 LPA (pension)",
    medicalHistory: "Diabetes Type 2, CABG surgery (2021), Smoker",
    documents: { aadhaar: true, pan: true, medicalReport: true, incomeProof: true, photo: true },
    aiRecommendation: "REJECT — Unacceptable risk",
    aiRationale: "Critical risk: Post-CABG, diabetic, smoker, obese, age 60. Medical history incompatible with standard or loaded coverage for this product.",
    fraudFlags: ["Previous application rejection at competitor (data from bureau)"],
  },
];

const statusConfig = {
  approved: { label: "Approved", variant: "positive", icon: CheckCircle2 },
  "under-review": { label: "Under Review", variant: "brand", icon: Clock },
  flagged: { label: "Flagged", variant: "warning", icon: AlertTriangle },
  rejected: { label: "Rejected", variant: "critical", icon: XCircle },
};

const riskColor = (level) => {
  switch (level) {
    case "low": return "text-sage";
    case "medium": return "text-amber";
    case "high": return "text-orange-500";
    case "critical": return "text-red-600";
    default: return "text-ink-500";
  }
};

const riskBg = (level) => {
  switch (level) {
    case "low": return "bg-sage";
    case "medium": return "bg-amber-500";
    case "high": return "bg-orange-500";
    case "critical": return "bg-red-600";
    default: return "bg-ink-300";
  }
};

export default function AutoUnderwriting() {
  const [selectedApp, setSelectedApp] = useState(APPLICATIONS[0]);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredApps = filterStatus === "all"
    ? APPLICATIONS
    : APPLICATIONS.filter((a) => a.status === filterStatus);

  return (
    <div data-testid="auto-underwriting-page">
      <PageHeader
        eyebrow="Insurance AI · Auto Underwriting"
        title="Intelligent Underwriting Engine"
        lede="AI validates documents, assesses risk based on medical and profile data, and recommends approval or rejection — flagging edge cases for human review."
      />

      <div className="px-6 lg:px-10 py-8 max-w-[1600px] mx-auto">
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <div className="kpi-card">
            <div className="kpi-label">Applications Today</div>
            <div className="kpi-value">23</div>
            <div className="kpi-sub">+5 from yesterday</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Auto-Approved</div>
            <div className="kpi-value text-sage">14</div>
            <div className="kpi-sub">60.8% straight-through</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Flagged for Review</div>
            <div className="kpi-value text-amber">6</div>
            <div className="kpi-sub">26.1% need human</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Auto-Rejected</div>
            <div className="kpi-value text-red-600">3</div>
            <div className="kpi-sub">13% — clear violations</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Avg Processing</div>
            <div className="kpi-value">4.2 min</div>
            <div className="kpi-sub">↓ 92% vs manual (48 min)</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Application List */}
          <section className="lg:col-span-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-h">Applications</h2>
              <div className="flex items-center gap-2">
                <Filter size={12} className="text-ink-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-[11px] bg-surface-muted border border-surface-divider rounded px-2 py-1 text-ink-900"
                >
                  <option value="all">All</option>
                  <option value="approved">Approved</option>
                  <option value="under-review">Under Review</option>
                  <option value="flagged">Flagged</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="surface-card overflow-hidden">
              {filteredApps.map((app) => {
                const sc = statusConfig[app.status];
                const StatusIcon = sc.icon;
                return (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`w-full text-left px-4 py-3 border-b border-surface-divider hover:bg-surface-muted/60 transition-colors ${selectedApp.id === app.id ? "bg-maroon-tint6" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User size={13} className="text-ink-500" />
                        <span className="text-[13px] font-medium text-ink-900">{app.applicant}</span>
                      </div>
                      <Tag variant={sc.variant}>
                        <StatusIcon size={10} className="mr-1 inline" />{sc.label}
                      </Tag>
                    </div>
                    <div className="text-[11px] text-ink-500 mt-1">{app.product}</div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-[10px] font-medium ${riskColor(app.riskLevel)}`}>Risk: {app.riskScore}/100</span>
                      <span className="text-[10px] text-ink-300">{app.appliedDate}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Application Detail */}
          <section className="lg:col-span-8 space-y-6">
            {/* Applicant Profile */}
            <div className="surface-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="cap-label">{selectedApp.id}</div>
                  <div className="serif text-[24px] text-ink-900 mt-1">{selectedApp.applicant}</div>
                  <div className="text-[13px] text-ink-500 mt-1">{selectedApp.product} · {selectedApp.premium}</div>
                </div>
                <Tag variant={statusConfig[selectedApp.status].variant}>
                  {statusConfig[selectedApp.status].label}
                </Tag>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-5 pt-5 border-t border-surface-divider">
                <div>
                  <div className="cap-label">Age / Gender</div>
                  <div className="text-[13px] text-ink-900 mt-1">{selectedApp.age} / {selectedApp.gender}</div>
                </div>
                <div>
                  <div className="cap-label">BMI</div>
                  <div className={`text-[13px] mt-1 font-medium ${selectedApp.bmi > 30 ? "text-red-600" : selectedApp.bmi > 25 ? "text-amber" : "text-sage"}`}>{selectedApp.bmi}</div>
                </div>
                <div>
                  <div className="cap-label">Smoker</div>
                  <div className={`text-[13px] mt-1 font-medium ${selectedApp.smoker ? "text-red-600" : "text-sage"}`}>{selectedApp.smoker ? "Yes" : "No"}</div>
                </div>
                <div>
                  <div className="cap-label">Occupation</div>
                  <div className="text-[13px] text-ink-900 mt-1">{selectedApp.occupation}</div>
                </div>
                <div>
                  <div className="cap-label">Income</div>
                  <div className="text-[13px] text-ink-900 mt-1">{selectedApp.income}</div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="surface-card p-6">
              <h3 className="text-[14px] font-medium text-ink-900 flex items-center gap-2 mb-4">
                <Activity size={14} /> AI Risk Assessment
              </h3>
              <div className="flex items-center gap-6 mb-4">
                <div>
                  <div className="cap-label">Risk Score</div>
                  <div className={`text-[32px] font-semibold ${riskColor(selectedApp.riskLevel)} tnum`}>{selectedApp.riskScore}</div>
                  <div className="text-[11px] text-ink-500 uppercase">{selectedApp.riskLevel} risk</div>
                </div>
                <div className="flex-1">
                  <div className="h-3 w-full bg-surface-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${riskBg(selectedApp.riskLevel)}`} style={{ width: `${selectedApp.riskScore}%` }} />
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-ink-300">
                    <span>0 — Low</span>
                    <span>50 — Medium</span>
                    <span>100 — Critical</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface-muted/50 rounded">
                <div className="cap-label mb-2">Medical History</div>
                <div className="text-[13px] text-ink-900">{selectedApp.medicalHistory || "None reported"}</div>
              </div>

              {/* AI Recommendation */}
              <div className={`mt-4 p-4 rounded border-l-3 ${selectedApp.status === "approved" ? "bg-sage/5 border-sage" : selectedApp.status === "rejected" ? "bg-red-50 border-red-600" : "bg-amber/5 border-amber"}`}>
                <div className={`text-[13px] font-semibold ${selectedApp.status === "approved" ? "text-sage" : selectedApp.status === "rejected" ? "text-red-600" : "text-amber"}`}>
                  {selectedApp.aiRecommendation}
                </div>
                <div className="text-[12px] text-ink-500 mt-2 leading-relaxed">{selectedApp.aiRationale}</div>
              </div>
            </div>

            {/* Documents + Fraud Flags */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Document Verification */}
              <div className="surface-card p-5">
                <h3 className="text-[14px] font-medium text-ink-900 mb-3 flex items-center gap-2">
                  <FileCheck size={14} /> Document Verification
                </h3>
                <div className="space-y-2">
                  {Object.entries(selectedApp.documents).map(([doc, verified]) => (
                    <div key={doc} className="flex items-center justify-between py-2 border-b border-surface-divider last:border-0">
                      <span className="text-[12px] text-ink-900 capitalize">{doc.replace(/([A-Z])/g, " $1").trim()}</span>
                      {verified ? (
                        <span className="flex items-center gap-1 text-[11px] text-sage"><CheckCircle2 size={12} /> Verified</span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-red-600"><XCircle size={12} /> Missing</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Fraud / Exception Flags */}
              <div className="surface-card p-5">
                <h3 className="text-[14px] font-medium text-ink-900 mb-3 flex items-center gap-2">
                  <ShieldAlert size={14} /> Exception & Fraud Flags
                </h3>
                {selectedApp.fraudFlags.length > 0 ? (
                  <div className="space-y-2">
                    {selectedApp.fraudFlags.map((flag, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-red-50 rounded border border-red-100">
                        <AlertTriangle size={12} className="text-red-600 mt-0.5 shrink-0" />
                        <span className="text-[12px] text-red-700">{flag}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-sage/5 rounded text-center">
                    <CheckCircle2 size={20} className="mx-auto text-sage mb-2" />
                    <div className="text-[12px] text-sage font-medium">No flags detected</div>
                    <div className="text-[11px] text-ink-500 mt-1">All checks passed</div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              {selectedApp.status === "under-review" || selectedApp.status === "flagged" ? (
                <>
                  <button className="btn-primary flex items-center gap-2">
                    <CheckCircle2 size={14} /> Approve
                  </button>
                  <button className="btn-ghost flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50">
                    <XCircle size={14} /> Reject
                  </button>
                  <button className="btn-ghost flex items-center gap-2">
                    <ArrowRight size={14} /> Request More Info
                  </button>
                </>
              ) : (
                <div className="text-[12px] text-ink-500 italic">
                  Decision finalized — {selectedApp.status === "approved" ? "Policy issued" : "Applicant notified"}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
