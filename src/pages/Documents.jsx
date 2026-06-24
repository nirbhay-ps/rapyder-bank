import React, { useState, useCallback, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { Tag } from "../components/ui";
import { documentIntelligenceService } from "../services/api";
import { getApplications, saveApplication, updateApplicationStatus } from "../lib/applicationStore";

const EMPLOYMENT_OPTIONS = [
  { value: "FULL_TIME_EMPLOYED", label: "Full-Time Employed" },
  { value: "PART_TIME_EMPLOYED", label: "Part-Time Employed" },
  { value: "SELF_EMPLOYED", label: "Self-Employed" },
  { value: "UNEMPLOYED", label: "Unemployed" },
  { value: "RETIRED", label: "Retired" },
];

const PURPOSE_OPTIONS = ["Personal", "Home", "Education", "Vehicle", "Business", "Medical"];

const INITIAL_FORM = {
  name: "Dwanka Nath Yadav",
  email: "dwanka.yadav@gmail.com",
  phone: "+917388142727",
  dob: "1977-03-17",
  employment_status: "FULL_TIME_EMPLOYED",
  address: "Phulpur, Prayagraj",
  monthly_income: "65740",
  loan_amount: "10000",
  purpose: "Personal",
};

function FileInput({ label, name, accept, onChange, file }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="cap-label" htmlFor={name}>{label}</label>
      <div className="relative">
        <input
          id={name}
          type="file"
          accept={accept}
          onChange={(e) => onChange(name, e.target.files[0])}
          className="block w-full text-sm text-ink-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand/10 file:text-brand hover:file:bg-brand/20 file:cursor-pointer cursor-pointer"
        />
        {file && (
          <span className="text-[11px] text-sage mt-1 block truncate">
            ✓ {file.name}
          </span>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (!status) return null;
  const map = {
    APPROVED: "positive",
    REJECTED: "critical",
    PENDING: "warning",
    PROCESSING: "brand",
    IN_REVIEW: "brand",
  };
  const variant = map[status?.toUpperCase()] || "neutral";
  return <Tag variant={variant}>{status}</Tag>;
}

function SearchableDropdown({ applications, value, onChange, onSubmit, onSelect, fetching }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = React.useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = applications.filter((app) => {
    const q = search.toLowerCase();
    return (
      app.applicationId.toLowerCase().includes(q) ||
      (app.name || "").toLowerCase().includes(q)
    );
  });

  const selectedApp = applications.find((a) => a.applicationId === value);

  const handleSelect = (applicationId) => {
    onChange(applicationId);
    setSearch("");
    setOpen(false);
    onSelect(applicationId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) onSubmit(search.trim());
    else if (value) onSelect(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <div className="flex-1 flex flex-col gap-1.5 relative" ref={wrapperRef}>
        <label className="cap-label">Search or Select Application</label>
        <input
          type="text"
          value={open ? search : selectedApp ? `${selectedApp.applicationId} — ${selectedApp.name}` : search}
          onChange={(e) => {
            setSearch(e.target.value);
            onChange("");
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Type application ID or name to search…"
          className="input-field"
        />
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-ink-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-ink-400">No applications found</div>
            ) : (
              filtered.map((app) => (
                <button
                  key={app.applicationId}
                  type="button"
                  onClick={() => handleSelect(app.applicationId)}
                  className={`w-full text-left px-4 py-3 hover:bg-ink-50 transition-colors border-b border-ink-100 last:border-0 ${
                    value === app.applicationId ? "bg-brand/5" : ""
                  }`}
                >
                  <span className="font-mono text-[12px] text-ink-900 font-medium">{app.applicationId}</span>
                  <span className="text-[12px] text-ink-500 ml-2">— {app.name}</span>
                  <span className={`ml-2 text-[11px] font-medium px-1.5 py-0.5 rounded ${
                    app.status?.toUpperCase() === "APPROVED" ? "bg-green-100 text-green-700" :
                    app.status?.toUpperCase() === "REJECTED" ? "bg-red-100 text-red-700" :
                    app.status?.toUpperCase() === "PROCESSING" ? "bg-amber-100 text-amber-700" :
                    "bg-ink-100 text-ink-600"
                  }`}>{app.status || "PENDING"}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={fetching || (!value && !search.trim())}
        className="btn-primary disabled:opacity-50 h-[42px]"
      >
        {fetching ? "Fetching…" : "Check Status"}
      </button>
    </form>
  );
}

export default function Documents() {
  const [activeTab, setActiveTab] = useState("apply"); // apply | status
  const [form, setForm] = useState(INITIAL_FORM);
  const [files, setFiles] = useState({ id_doc: null, bank_statement: null, salary_slip: null, selfie: null });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingAppId, setProcessingAppId] = useState(null);
  const [decisionResult, setDecisionResult] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Status lookup
  const [appId, setAppId] = useState("");
  const [fetching, setFetching] = useState(false);
  const [appResult, setAppResult] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // Application history
  const [applications, setApplications] = useState([]);

  // Load saved applications on mount
  useEffect(() => {
    setApplications(getApplications());
  }, []);

  const handleFieldChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = useCallback((name, file) => {
    setFiles((prev) => ({ ...prev, [name]: file }));
  }, []);

  // Poll the GET endpoint until we get a final decision
  const pollForDecision = useCallback(async (applicationId) => {
    const MAX_ATTEMPTS = 30;
    const POLL_INTERVAL = 3000; // 3 seconds

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const res = await documentIntelligenceService.getApplication(applicationId);
        const data = res.data;
        const status = (data.status || "").toUpperCase();

        // Final states
        if (["APPROVED", "REJECTED", "DECLINED", "FAILED"].includes(status)) {
          setProcessing(false);
          setDecisionResult(data);
          // Update persisted record
          updateApplicationStatus(applicationId, status, {
            decision: data.decision,
            riskScore: data.riskScore,
            riskCategory: data.riskCategory,
          });
          setApplications(getApplications());
          return;
        }
      } catch (err) {
        // Ignore transient errors, keep polling
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    }

    // Timed out — show whatever we have
    setProcessing(false);
    setSubmitError("Processing is taking longer than expected. Check status manually using the Application ID.");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitResult(null);
    setDecisionResult(null);
    setProcessing(false);
    setProcessingAppId(null);
    try {
      const res = await documentIntelligenceService.submitApplication(form, files);
      const data = res.data;
      setSubmitResult(data);

      // Extract application ID from response
      const appIdFromResponse = data.applicationId || data.application_id;
      if (appIdFromResponse) {
        // Save to persistent store
        saveApplication({
          applicationId: appIdFromResponse,
          name: form.name,
          loanAmount: form.loan_amount,
          purpose: form.purpose,
          status: "PROCESSING",
          submittedAt: new Date().toISOString(),
        });
        setApplications(getApplications());

        setProcessingAppId(appIdFromResponse);
        setProcessing(true);

        // Clear form and show confirmation briefly, then switch to status tab
        setForm(INITIAL_FORM);
        setFiles({ id_doc: null, bank_statement: null, salary_slip: null, selfie: null });
        setShowConfirmation(true);
        setTimeout(() => {
          setShowConfirmation(false);
          setActiveTab("status");
        }, 2000);

        // Start polling for the decision
        pollForDecision(appIdFromResponse);
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFetchStatus = async (e) => {
    e.preventDefault();
    if (!appId.trim()) return;
    setFetching(true);
    setFetchError(null);
    setAppResult(null);
    try {
      const res = await documentIntelligenceService.getApplication(appId.trim());
      setAppResult(res.data);
    } catch (err) {
      setFetchError(err.response?.data?.message || err.message || "Failed to fetch application");
    } finally {
      setFetching(false);
    }
  };

  const handleViewApplication = async (applicationId) => {
    setAppId(applicationId);
    setFetching(true);
    setFetchError(null);
    setAppResult(null);
    try {
      const res = await documentIntelligenceService.getApplication(applicationId);
      setAppResult(res.data);
    } catch (err) {
      setFetchError(err.response?.data?.message || err.message || "Failed to fetch application");
    } finally {
      setFetching(false);
    }
  };

  return (
    <div data-testid="page-documents">
      <PageHeader
        eyebrow="Document Intelligence"
        title="Autonomous Loan Underwriting"
        lede="Submit loan applications with KYC documents for AI-powered verification, risk scoring, and instant decisioning."
      />

      {/* Tab Navigation */}
      <div className="px-6 lg:px-10 pt-6">
        <div className="flex gap-6 border-b border-ink-200">
          <button
            onClick={() => setActiveTab("apply")}
            className={`px-1 pb-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === "apply"
                ? "border-red-500 text-ink-900"
                : "border-transparent text-ink-400 hover:text-ink-600"
            }`}
          >
            New Application
          </button>
          <button
            onClick={() => setActiveTab("status")}
            className={`px-1 pb-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === "status"
                ? "border-red-500 text-ink-900"
                : "border-transparent text-ink-400 hover:text-ink-600"
            }`}
          >
            Check Status
          </button>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-8">
        {activeTab === "apply" && (
          <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            {/* Applicant Information */}
            <section className="surface-card p-6 space-y-5">
              <h3 className="text-base font-semibold text-ink-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand/10 text-brand text-xs flex items-center justify-center font-bold">1</span>
                Applicant Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="cap-label" htmlFor="name">Full Name *</label>
                  <input
                    id="name" name="name" type="text" required
                    value={form.name} onChange={handleFieldChange}
                    placeholder="e.g. John Doe"
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="cap-label" htmlFor="email">Email *</label>
                  <input
                    id="email" name="email" type="email" required
                    value={form.email} onChange={handleFieldChange}
                    placeholder="e.g. john.doe@example.com"
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="cap-label" htmlFor="phone">Phone *</label>
                  <input
                    id="phone" name="phone" type="tel" required
                    value={form.phone} onChange={handleFieldChange}
                    placeholder="e.g. +91-9876543210"
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="cap-label" htmlFor="dob">Date of Birth *</label>
                  <input
                    id="dob" name="dob" type="date" required
                    value={form.dob} onChange={handleFieldChange}
                    className="input-field"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="cap-label" htmlFor="address">Address *</label>
                  <textarea
                    id="address" name="address" required rows={2}
                    value={form.address} onChange={handleFieldChange}
                    placeholder="e.g. 123 Main Street, Apt 4B, Mumbai, Maharashtra 400001"
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Loan Details */}
            <section className="surface-card p-6 space-y-5">
              <h3 className="text-base font-semibold text-ink-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand/10 text-brand text-xs flex items-center justify-center font-bold">2</span>
                Loan &amp; Employment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="cap-label" htmlFor="employment_status">Employment Status *</label>
                  <select
                    id="employment_status" name="employment_status" required
                    value={form.employment_status} onChange={handleFieldChange}
                    className="input-field"
                  >
                    {EMPLOYMENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="cap-label" htmlFor="monthly_income">Monthly Income (₹) *</label>
                  <input
                    id="monthly_income" name="monthly_income" type="number" required min="0"
                    value={form.monthly_income} onChange={handleFieldChange}
                    placeholder="e.g. 75000"
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="cap-label" htmlFor="loan_amount">Loan Amount (₹) *</label>
                  <input
                    id="loan_amount" name="loan_amount" type="number" required min="0"
                    value={form.loan_amount} onChange={handleFieldChange}
                    placeholder="e.g. 500000"
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="cap-label" htmlFor="purpose">Purpose *</label>
                  <select
                    id="purpose" name="purpose" required
                    value={form.purpose} onChange={handleFieldChange}
                    className="input-field"
                  >
                    {PURPOSE_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Document Upload */}
            <section className="surface-card p-6 space-y-5">
              <h3 className="text-base font-semibold text-ink-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand/10 text-brand text-xs flex items-center justify-center font-bold">3</span>
                Document Upload
              </h3>
              <p className="text-sm text-ink-500">Upload KYC documents for AI-powered verification and risk assessment.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FileInput
                  label="ID Document (Aadhaar/PAN) *"
                  name="id_doc"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  file={files.id_doc}
                />
                <FileInput
                  label="Bank Statement *"
                  name="bank_statement"
                  accept=".pdf"
                  onChange={handleFileChange}
                  file={files.bank_statement}
                />
                <FileInput
                  label="Salary Slip *"
                  name="salary_slip"
                  accept=".pdf"
                  onChange={handleFileChange}
                  file={files.salary_slip}
                />
                <FileInput
                  label="Selfie Photo *"
                  name="selfie"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  file={files.selfie}
                />
              </div>
            </section>

            {/* Submit */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing…
                  </span>
                ) : (
                  "Submit Application"
                )}
              </button>
              {submitError && (
                <span className="text-sm text-red-600">{submitError}</span>
              )}
            </div>

            {/* Submission Confirmation */}
            {showConfirmation && (
              <section className="surface-card p-5 border-l-4 border-green-500 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-green-900">Application Submitted Successfully</h4>
                    <p className="text-[12px] text-green-700 mt-0.5">
                      Your application is being processed. Redirecting to status…
                    </p>
                  </div>
                </div>
              </section>
            )}
          </form>
        )}

        {activeTab === "status" && (
          <div className="max-w-4xl space-y-6">
            {/* Submission Confirmation */}
            {processing && processingAppId && (
              <section className="surface-card p-5 border-l-4 border-green-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-green-900">Application Submitted</h4>
                    <p className="text-[12px] text-green-700 mt-0.5">
                      Your application <span className="font-mono font-medium">{processingAppId}</span> has been submitted and is being processed. You can track its status below.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Lookup Form */}
            <section className="surface-card p-6">
              <h3 className="text-base font-semibold text-ink-900 mb-4">Application Status Lookup</h3>
              <SearchableDropdown
                applications={applications}
                value={appId}
                onChange={(val) => setAppId(val)}
                onSelect={(id) => handleViewApplication(id)}
                onSubmit={(id) => handleViewApplication(id)}
                fetching={fetching}
              />
              {fetchError && (
                <p className="text-sm text-red-600 mt-3">{fetchError}</p>
              )}
            </section>

            {/* Application Result */}
            {appResult && (
              <section className="surface-card p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-ink-900">Application Details</h3>
                  <StatusBadge status={appResult.status || appResult.decision} />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {appResult.applicationId && (
                    <div className="bg-ink-50 rounded-lg p-4">
                      <div className="cap-label mb-1">Application ID</div>
                      <div className="font-mono text-sm font-medium text-ink-900">{appResult.applicationId}</div>
                    </div>
                  )}
                  {appResult.riskScore !== undefined && (
                    <div className="bg-ink-50 rounded-lg p-4">
                      <div className="cap-label mb-1">Risk Score</div>
                      <div className="text-sm font-medium text-ink-900">{appResult.riskScore} <span className="text-ink-400 text-xs">({appResult.riskCategory})</span></div>
                    </div>
                  )}
                  {appResult.confidence !== undefined && (
                    <div className="bg-ink-50 rounded-lg p-4">
                      <div className="cap-label mb-1">Confidence</div>
                      <div className="text-sm font-medium text-ink-900">{(parseFloat(appResult.confidence) * 100).toFixed(0)}%</div>
                    </div>
                  )}
                  {appResult.decisionBasis && (
                    <div className="bg-ink-50 rounded-lg p-4">
                      <div className="cap-label mb-1">Decision Basis</div>
                      <div className="text-sm font-medium text-ink-900">{appResult.decisionBasis?.replace(/_/g, " ")}</div>
                    </div>
                  )}
                </div>

                {/* Applicant Info */}
                {appResult.formData && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-ink-50 rounded-lg p-4">
                      <div className="cap-label mb-1">Applicant</div>
                      <div className="text-sm font-medium text-ink-900">{appResult.formData.name}</div>
                      <div className="text-[12px] text-ink-500">{appResult.formData.email}</div>
                    </div>
                    <div className="bg-ink-50 rounded-lg p-4">
                      <div className="cap-label mb-1">Loan Details</div>
                      <div className="text-sm font-medium text-ink-900">₹{parseInt(appResult.formData.loan_amount).toLocaleString("en-IN")} — {appResult.formData.purpose}</div>
                      <div className="text-[12px] text-ink-500">Monthly income: ₹{parseInt(appResult.formData.monthly_income).toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                )}

                {/* Decision Reason */}
                {appResult.decisionReason && (
                  <div className={`border rounded-lg p-4 ${appResult.decision === "APPROVED" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <div className={`cap-label mb-2 ${appResult.decision === "APPROVED" ? "text-green-800" : "text-red-800"}`}>Decision Reasoning</div>
                    <p className={`text-[13px] leading-relaxed ${appResult.decision === "APPROVED" ? "text-green-900" : "text-red-900"}`}>{appResult.decisionReason}</p>
                  </div>
                )}

                {/* Key Concerns */}
                {appResult.keyConcerns && appResult.keyConcerns.length > 0 && (
                  <div>
                    <div className="cap-label mb-3">Analysis Findings</div>
                    <div className="space-y-2">
                      {appResult.keyConcerns.map((concern, i) => {
                        const isPositive = concern.startsWith("POSITIVE:");
                        const isMinor = concern.startsWith("MINOR:");
                        const variant = isPositive ? "text-green-700 bg-green-50" : isMinor ? "text-amber-700 bg-amber-50" : "text-ink-700 bg-ink-50";
                        return (
                          <div key={i} className={`text-[12px] px-3 py-2 rounded-md ${variant}`}>
                            {concern}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Redacted Documents */}
                {appResult.redactedDocuments && appResult.redactedDocuments.length > 0 && (
                  <div>
                    <div className="cap-label mb-3">Redacted Documents</div>
                    <div className="flex flex-wrap gap-3">
                      {appResult.redactedDocuments.map((doc, i) => (
                        <a
                          key={i}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-ink-50 hover:bg-ink-100 text-ink-700 text-[12px] px-3 py-2 rounded-md transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                          {doc.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* PII Count */}
                {appResult.piiDetectedCount && (
                  <div className="text-[12px] text-ink-500 flex items-center gap-2">
                    <svg className="w-4 h-4 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    {appResult.piiDetectedCount} PII fields detected and redacted
                  </div>
                )}

              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
