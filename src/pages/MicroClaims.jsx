import React, { useState } from "react";
import {
  FileText, CheckCircle2, XCircle, Clock, AlertTriangle, Package,
  ArrowRight, RotateCcw, Truck, ShieldCheck, Filter, Search,
  FileWarning, Building2, Activity,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { Tag } from "../components/ui";

// Dummy claims data
const CLAIMS = [
  {
    id: "CLM-2024-5001",
    claimant: "Arjun Reddy",
    policyNo: "MOT-2024-3421",
    policyType: "Motor Comprehensive",
    claimType: "Accident Damage",
    claimAmount: "₹1,85,000",
    filedDate: "2024-11-15",
    status: "vendor-assessment",
    stage: 4,
    partner: "CarDekho Insurance",
    vendor: "AutoFix Garage, Hyderabad",
    documents: {
      claimForm: { status: "verified", file: "claim_form_signed.pdf" },
      fir: { status: "verified", file: "fir_copy.pdf" },
      drivingLicense: { status: "verified", file: "dl_arjun.pdf" },
      rcBook: { status: "verified", file: "rc_ts09ab1234.pdf" },
      photos: { status: "verified", file: "damage_photos_6.zip" },
      surveyReport: { status: "pending", file: null },
    },
    eligibility: { passed: true, reason: "Policy active, premium paid, claim within coverage" },
    timeline: [
      { stage: "Received", date: "Nov 15, 10:30 AM", done: true },
      { stage: "Docs Validated", date: "Nov 15, 10:45 AM", done: true },
      { stage: "Eligibility Check", date: "Nov 15, 11:02 AM", done: true },
      { stage: "Vendor Assigned", date: "Nov 15, 02:15 PM", done: true },
      { stage: "Assessment", date: "In Progress", done: false },
      { stage: "Settlement", date: "Pending", done: false },
    ],
    exceptions: [],
  },
  {
    id: "CLM-2024-5002",
    claimant: "Meera Krishnan",
    policyNo: "HLT-2024-8812",
    policyType: "Health Individual",
    claimType: "Hospitalization",
    claimAmount: "₹3,42,000",
    filedDate: "2024-11-16",
    status: "settled",
    stage: 6,
    partner: "PolicyBazaar",
    vendor: "Apollo Hospitals, Chennai",
    documents: {
      claimForm: { status: "verified", file: "claim_form_meera.pdf" },
      hospitalBills: { status: "verified", file: "apollo_bills.pdf" },
      dischargeSummary: { status: "verified", file: "discharge_summary.pdf" },
      prescriptions: { status: "verified", file: "prescriptions.pdf" },
      idProof: { status: "verified", file: "aadhaar_meera.pdf" },
      preAuth: { status: "verified", file: "pre_auth_letter.pdf" },
    },
    eligibility: { passed: true, reason: "Pre-auth approved, within sum insured limit" },
    timeline: [
      { stage: "Received", date: "Nov 16, 09:00 AM", done: true },
      { stage: "Docs Validated", date: "Nov 16, 09:12 AM", done: true },
      { stage: "Eligibility Check", date: "Nov 16, 09:15 AM", done: true },
      { stage: "Vendor Confirmed", date: "Nov 16, 09:30 AM", done: true },
      { stage: "Assessment Done", date: "Nov 16, 02:00 PM", done: true },
      { stage: "Settled — ₹3,42,000", date: "Nov 17, 11:00 AM", done: true },
    ],
    exceptions: [],
  },
  {
    id: "CLM-2024-5003",
    claimant: "Sanjay Gupta",
    policyNo: "LIFE-2023-4455",
    policyType: "Term Life",
    claimType: "Death Benefit",
    claimAmount: "₹75,00,000",
    filedDate: "2024-11-14",
    status: "exception",
    stage: 3,
    partner: "Direct — Branch Walk-in",
    vendor: "Internal Investigation",
    documents: {
      claimForm: { status: "verified", file: "nominee_claim.pdf" },
      deathCertificate: { status: "verified", file: "death_cert.pdf" },
      fir: { status: "flagged", file: "fir_copy.pdf" },
      policyDocument: { status: "verified", file: "policy_doc.pdf" },
      nomineeId: { status: "verified", file: "nominee_aadhaar.pdf" },
      hospitalRecords: { status: "missing", file: null },
    },
    eligibility: { passed: false, reason: "Claim filed within 2-year contestability period. Investigation required." },
    timeline: [
      { stage: "Received", date: "Nov 14, 03:00 PM", done: true },
      { stage: "Docs Validated", date: "Nov 14, 03:30 PM", done: true },
      { stage: "Eligibility Check", date: "Nov 14, 04:00 PM — FLAGGED", done: true },
      { stage: "Investigation", date: "Assigned", done: false },
      { stage: "Decision", date: "Pending", done: false },
      { stage: "Settlement", date: "Pending", done: false },
    ],
    exceptions: [
      "Claim filed within 2-year contestability window",
      "Hospital records not submitted — requested from hospital",
      "FIR suggests non-natural death — investigation mandated",
    ],
  },
  {
    id: "CLM-2024-5004",
    claimant: "Fatima Begum",
    policyNo: "MOT-2024-6678",
    policyType: "Two-Wheeler",
    claimType: "Theft",
    claimAmount: "₹62,000",
    filedDate: "2024-11-17",
    status: "docs-pending",
    stage: 1,
    partner: "Bajaj Alliance",
    vendor: "Pending Assignment",
    documents: {
      claimForm: { status: "verified", file: "claim_theft.pdf" },
      fir: { status: "verified", file: "fir_theft.pdf" },
      rcBook: { status: "missing", file: null },
      keys: { status: "missing", file: null },
      nonTraceReport: { status: "missing", file: null },
      idProof: { status: "verified", file: "aadhaar_fatima.pdf" },
    },
    eligibility: { passed: null, reason: "Cannot assess — critical documents missing" },
    timeline: [
      { stage: "Received", date: "Nov 17, 11:00 AM", done: true },
      { stage: "Docs Validated", date: "INCOMPLETE — 3 missing", done: false },
      { stage: "Eligibility Check", date: "Blocked", done: false },
      { stage: "Vendor Assignment", date: "Blocked", done: false },
      { stage: "Assessment", date: "Blocked", done: false },
      { stage: "Settlement", date: "Blocked", done: false },
    ],
    exceptions: ["RC Book not submitted", "Original keys + spare not deposited", "Non-traceable certificate from police pending"],
  },
  {
    id: "CLM-2024-5005",
    claimant: "Rohan Patil",
    policyNo: "HLT-2024-2234",
    policyType: "Family Floater",
    claimType: "OPD Reimbursement",
    claimAmount: "₹8,500",
    filedDate: "2024-11-18",
    status: "auto-approved",
    stage: 6,
    partner: "PhonePe Insurance",
    vendor: "Not Required (Micro Claim)",
    documents: {
      claimForm: { status: "verified", file: "opd_claim.pdf" },
      prescription: { status: "verified", file: "prescription_dr_shah.pdf" },
      bills: { status: "verified", file: "pharmacy_bill.pdf" },
      idProof: { status: "verified", file: "aadhaar_rohan.pdf" },
    },
    eligibility: { passed: true, reason: "Amount under ₹10,000 micro-claim threshold. Auto-approval eligible." },
    timeline: [
      { stage: "Received", date: "Nov 18, 08:00 AM", done: true },
      { stage: "Docs Validated", date: "Nov 18, 08:01 AM", done: true },
      { stage: "Eligibility Check", date: "Nov 18, 08:01 AM", done: true },
      { stage: "Auto-Approved", date: "Nov 18, 08:02 AM", done: true },
      { stage: "Payment Initiated", date: "Nov 18, 08:05 AM", done: true },
      { stage: "Settled — ₹8,500", date: "Nov 18, 10:30 AM", done: true },
    ],
    exceptions: [],
  },
];

const statusConfig = {
  "auto-approved": { label: "Auto-Approved", variant: "positive", icon: CheckCircle2 },
  settled: { label: "Settled", variant: "positive", icon: CheckCircle2 },
  "vendor-assessment": { label: "Vendor Assessment", variant: "brand", icon: Truck },
  "docs-pending": { label: "Docs Pending", variant: "warning", icon: FileWarning },
  exception: { label: "Exception", variant: "critical", icon: AlertTriangle },
};

export default function MicroClaims() {
  const [selectedClaim, setSelectedClaim] = useState(CLAIMS[0]);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredClaims = filterStatus === "all"
    ? CLAIMS
    : CLAIMS.filter((c) => c.status === filterStatus);

  const docStats = Object.values(selectedClaim.documents);
  const verifiedCount = docStats.filter((d) => d.status === "verified").length;
  const totalDocs = docStats.length;

  return (
    <div data-testid="micro-claims-page">
      <PageHeader
        eyebrow="Insurance AI · Claims Processing"
        title="Micro Claims Automation"
        lede="End-to-end claims processing: document intake, validation, eligibility checks, vendor handoff, and exception management — all AI-driven for speed and accuracy."
      />

      <div className="px-6 lg:px-10 py-8 max-w-[1600px] mx-auto">
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <div className="kpi-card">
            <div className="kpi-label">Claims This Week</div>
            <div className="kpi-value">89</div>
            <div className="kpi-sub">Across all channels</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Auto-Approved</div>
            <div className="kpi-value text-sage">34</div>
            <div className="kpi-sub">38.2% straight-through</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Avg Settlement</div>
            <div className="kpi-value">1.8 days</div>
            <div className="kpi-sub">↓ 67% vs manual</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Exceptions</div>
            <div className="kpi-value text-red-600">7</div>
            <div className="kpi-sub">Under investigation</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Total Settled Value</div>
            <div className="kpi-value">₹1.2 Cr</div>
            <div className="kpi-sub">This month</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Claims List */}
          <section className="lg:col-span-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-h">Claims Pipeline</h2>
              <div className="flex items-center gap-2">
                <Filter size={12} className="text-ink-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-[11px] bg-surface-muted border border-surface-divider rounded px-2 py-1 text-ink-900"
                >
                  <option value="all">All</option>
                  <option value="auto-approved">Auto-Approved</option>
                  <option value="settled">Settled</option>
                  <option value="vendor-assessment">Vendor Assessment</option>
                  <option value="docs-pending">Docs Pending</option>
                  <option value="exception">Exception</option>
                </select>
              </div>
            </div>
            <div className="surface-card overflow-hidden">
              {filteredClaims.map((claim) => {
                const sc = statusConfig[claim.status];
                const StatusIcon = sc.icon;
                return (
                  <button
                    key={claim.id}
                    onClick={() => setSelectedClaim(claim)}
                    className={`w-full text-left px-4 py-3 border-b border-surface-divider hover:bg-surface-muted/60 transition-colors ${selectedClaim.id === claim.id ? "bg-maroon-tint6" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-ink-900">{claim.claimant}</span>
                      <Tag variant={sc.variant}>
                        <StatusIcon size={10} className="mr-1 inline" />{sc.label}
                      </Tag>
                    </div>
                    <div className="text-[11px] text-ink-500 mt-1">{claim.claimType} · {claim.policyType}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[12px] font-medium text-ink-900 tnum">{claim.claimAmount}</span>
                      <span className="text-[10px] text-ink-300">{claim.filedDate}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Claim Detail */}
          <section className="lg:col-span-8 space-y-6">
            {/* Claim Header */}
            <div className="surface-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="cap-label">{selectedClaim.id}</div>
                  <div className="serif text-[24px] text-ink-900 mt-1">{selectedClaim.claimant}</div>
                  <div className="text-[13px] text-ink-500 mt-1">{selectedClaim.claimType} · {selectedClaim.policyType}</div>
                </div>
                <div className="text-right">
                  <div className="text-[24px] font-semibold text-ink-900 tnum">{selectedClaim.claimAmount}</div>
                  <Tag variant={statusConfig[selectedClaim.status].variant}>
                    {statusConfig[selectedClaim.status].label}
                  </Tag>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-5 border-t border-surface-divider">
                <div>
                  <div className="cap-label">Policy</div>
                  <div className="text-[12px] text-ink-900 mt-1 font-mono">{selectedClaim.policyNo}</div>
                </div>
                <div>
                  <div className="cap-label">Partner</div>
                  <div className="text-[12px] text-ink-900 mt-1">{selectedClaim.partner}</div>
                </div>
                <div>
                  <div className="cap-label">Vendor</div>
                  <div className="text-[12px] text-ink-900 mt-1">{selectedClaim.vendor}</div>
                </div>
                <div>
                  <div className="cap-label">Filed</div>
                  <div className="text-[12px] text-ink-900 mt-1">{selectedClaim.filedDate}</div>
                </div>
              </div>
            </div>

            {/* Processing Timeline */}
            <div className="surface-card p-6">
              <h3 className="text-[14px] font-medium text-ink-900 flex items-center gap-2 mb-5">
                <Activity size={14} /> Processing Pipeline
              </h3>
              <div className="flex items-center justify-between">
                {selectedClaim.timeline.map((step, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 relative">
                    {i > 0 && (
                      <div className={`absolute top-3 right-1/2 w-full h-0.5 -translate-y-1/2 ${selectedClaim.timeline[i - 1].done ? "bg-sage" : "bg-surface-divider"}`} style={{ left: "-50%" }} />
                    )}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${step.done ? "bg-sage text-white" : "bg-surface-muted text-ink-300 border border-surface-divider"}`}>
                      {step.done ? <CheckCircle2 size={12} /> : <Clock size={10} />}
                    </div>
                    <div className="text-[10px] text-ink-900 mt-2 text-center font-medium">{step.stage}</div>
                    <div className="text-[9px] text-ink-300 mt-0.5 text-center">{step.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents + Eligibility */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Document Completeness */}
              <div className="surface-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[14px] font-medium text-ink-900 flex items-center gap-2">
                    <FileText size={14} /> Documents ({verifiedCount}/{totalDocs})
                  </h3>
                  <span className={`text-[11px] font-medium ${verifiedCount === totalDocs ? "text-sage" : "text-amber"}`}>
                    {verifiedCount === totalDocs ? "Complete" : `${totalDocs - verifiedCount} pending`}
                  </span>
                </div>
                <div className="space-y-2">
                  {Object.entries(selectedClaim.documents).map(([doc, info]) => (
                    <div key={doc} className="flex items-center justify-between py-1.5 border-b border-surface-divider last:border-0">
                      <span className="text-[12px] text-ink-900 capitalize">{doc.replace(/([A-Z])/g, " $1").trim()}</span>
                      {info.status === "verified" ? (
                        <span className="flex items-center gap-1 text-[10px] text-sage"><CheckCircle2 size={11} /> Verified</span>
                      ) : info.status === "flagged" ? (
                        <span className="flex items-center gap-1 text-[10px] text-amber"><AlertTriangle size={11} /> Flagged</span>
                      ) : info.status === "pending" ? (
                        <span className="flex items-center gap-1 text-[10px] text-ink-500"><Clock size={11} /> Pending</span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-red-600"><XCircle size={11} /> Missing</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility Check */}
              <div className="surface-card p-5">
                <h3 className="text-[14px] font-medium text-ink-900 flex items-center gap-2 mb-3">
                  <ShieldCheck size={14} /> Policy Eligibility
                </h3>
                <div className={`p-4 rounded border ${selectedClaim.eligibility.passed === true ? "bg-sage/5 border-sage/20" : selectedClaim.eligibility.passed === false ? "bg-red-50 border-red-200" : "bg-amber/5 border-amber/20"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedClaim.eligibility.passed === true ? (
                      <><CheckCircle2 size={14} className="text-sage" /><span className="text-[12px] font-medium text-sage">Eligible</span></>
                    ) : selectedClaim.eligibility.passed === false ? (
                      <><XCircle size={14} className="text-red-600" /><span className="text-[12px] font-medium text-red-600">Flagged</span></>
                    ) : (
                      <><AlertTriangle size={14} className="text-amber" /><span className="text-[12px] font-medium text-amber">Cannot Assess</span></>
                    )}
                  </div>
                  <div className="text-[11px] text-ink-500 leading-relaxed">{selectedClaim.eligibility.reason}</div>
                </div>

                {/* Exceptions */}
                {selectedClaim.exceptions.length > 0 && (
                  <div className="mt-4">
                    <div className="cap-label mb-2 text-red-600">Exceptions ({selectedClaim.exceptions.length})</div>
                    <div className="space-y-2">
                      {selectedClaim.exceptions.map((ex, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 bg-red-50 rounded">
                          <AlertTriangle size={11} className="text-red-600 mt-0.5 shrink-0" />
                          <span className="text-[11px] text-red-700">{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              {selectedClaim.status === "docs-pending" && (
                <button className="btn-primary flex items-center gap-2">
                  <RotateCcw size={14} /> Send Document Reminder
                </button>
              )}
              {selectedClaim.status === "vendor-assessment" && (
                <button className="btn-primary flex items-center gap-2">
                  <Truck size={14} /> Check Vendor Status
                </button>
              )}
              {selectedClaim.status === "exception" && (
                <button className="btn-primary flex items-center gap-2">
                  <ArrowRight size={14} /> Assign Investigator
                </button>
              )}
              {(selectedClaim.status === "settled" || selectedClaim.status === "auto-approved") && (
                <div className="text-[12px] text-sage italic flex items-center gap-2">
                  <CheckCircle2 size={14} /> Claim settled successfully
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
