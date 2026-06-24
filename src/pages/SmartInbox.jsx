import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../components/PageHeader";
import { Tag } from "../components/ui";
import { useAuth, RequirePermission } from "../context/AuthContext";
import { emailService, consentService, signalsService } from "../services/api";
import {
  Mail, Link2, Unlink, RefreshCw, CheckCircle2, XCircle, AlertTriangle,
  Clock, Shield, Loader2, MailCheck, MailX, Inbox, ArrowRight,
  Zap, Eye, CheckSquare, XSquare, ChevronRight, TrendingUp, AlertOctagon,
  Filter, Search,
} from "lucide-react";

// ─── Email Connection Status Panel ──────────────────────────────────────────

function EmailConnectionPanel({ onStatusChange }) {
  const { hasPermission } = useAuth();
  const [status, setStatus] = useState(null);
  const [consentStatus, setConsentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const [emailRes, consentRes] = await Promise.all([
        emailService.status(),
        consentService.status("EMAIL_SYNC"),
      ]);
      setStatus(emailRes.data);
      setConsentStatus(consentRes.data);
      if (onStatusChange) onStatusChange(emailRes.data, consentRes.data);
    } catch (err) {
      console.error("Failed to fetch email status:", err);
      setStatus({ status: "NOT_CONNECTED" });
      setConsentStatus({ consent_type: "EMAIL_SYNC", is_granted: false });
      if (onStatusChange) onStatusChange({ status: "NOT_CONNECTED" }, { is_granted: false });
    } finally {
      setLoading(false);
    }
  }, [onStatusChange]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const handleConnect = async () => {
    setActionLoading("connect");
    setError("");
    try {
      const res = await emailService.connect();
      if (res.data.auth_url) {
        window.open(res.data.auth_url, "_blank", "width=600,height=700");
        setSuccess("OAuth window opened. Complete the authorization in the popup, then click Refresh.");
      }
    } catch (err) {
      setError("Failed to initiate connection. Please try again.");
    } finally {
      setActionLoading("");
      setTimeout(() => { setSuccess(""); setError(""); }, 8000);
    }
  };

  const handleDisconnect = async () => {
    setActionLoading("disconnect");
    setError("");
    try {
      await emailService.disconnect();
      setStatus({ status: "NOT_CONNECTED" });
      setSuccess("Disconnected. Synced data has been retained.");
      if (onStatusChange) onStatusChange({ status: "NOT_CONNECTED" }, consentStatus);
    } catch (err) {
      setError("Failed to disconnect. Please try again.");
    } finally {
      setActionLoading("");
      setTimeout(() => { setSuccess(""); setError(""); }, 4000);
    }
  };

  const handleSync = async () => {
    if (!hasPermission("email:sync")) {
      setError("You do not have permission to trigger manual sync.");
      return;
    }
    setActionLoading("sync");
    setError("");
    try {
      await emailService.sync();
      setSuccess("Sync triggered successfully.");
      setTimeout(() => fetchStatus(), 2000);
    } catch (err) {
      if (err.response?.status === 400) {
        setError("Email not connected. Please connect Microsoft 365 first.");
      } else if (err.response?.status === 403) {
        setError("EMAIL_SYNC consent required. Please grant consent first.");
      } else {
        setError("Failed to trigger sync. Please try again.");
      }
    } finally {
      setActionLoading("");
      setTimeout(() => { setSuccess(""); setError(""); }, 4000);
    }
  };

  const handleGrantConsent = async () => {
    setActionLoading("consent");
    try {
      await consentService.grant("EMAIL_SYNC");
      const updated = { consent_type: "EMAIL_SYNC", is_granted: true, granted_at: new Date().toISOString() };
      setConsentStatus(updated);
      setSuccess("EMAIL_SYNC consent granted.");
      if (onStatusChange) onStatusChange(status, updated);
    } catch (err) {
      setError("Failed to grant consent. Please try again.");
    } finally {
      setActionLoading("");
      setTimeout(() => { setSuccess(""); setError(""); }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="surface-card p-6 flex items-center justify-center gap-3">
        <Loader2 size={18} className="animate-spin text-maroon" />
        <span className="text-[13px] text-ink-500">Loading email integration status…</span>
      </div>
    );
  }

  const isConnected = status?.status === "CONNECTED";
  const isAuthFailed = status?.status === "AUTH_FAILED";
  const isDisconnected = status?.status === "DISCONNECTED";

  return (
    <div className="surface-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-surface-divider flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 grid place-items-center rounded-md" style={{ background: isConnected ? "rgba(46,125,82,0.10)" : "rgba(156,29,38,0.08)" }}>
            {isConnected ? <MailCheck size={18} className="text-sage" /> : <MailX size={18} className="text-crit" />}
          </div>
          <div>
            <div className="text-[14px] font-medium text-ink-900">Microsoft 365 Email Integration</div>
            <div className="text-[12px] text-ink-500 mt-0.5">
              {isConnected ? `Connected as ${status.user_email}` : isAuthFailed ? "Authentication failed — reconnect required" : isDisconnected ? "Previously connected — reconnect to resume" : "Not connected"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchStatus} className="btn-ghost text-[11px] inline-flex items-center gap-1.5 px-2 py-1">
            <RefreshCw size={12} /> Refresh
          </button>
          <Tag variant={isConnected ? "positive" : isAuthFailed ? "critical" : "neutral"}>
            {status?.status || "UNKNOWN"}
          </Tag>
        </div>
      </div>

      {/* Stats (when connected) */}
      {isConnected && (
        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-5 gap-4 border-b border-surface-divider bg-surface-page">
          <div>
            <div className="cap-label">Emails synced</div>
            <div className="text-[20px] font-medium text-ink-900 tnum mt-1">{status.total_emails_synced?.toLocaleString()}</div>
          </div>
          <div>
            <div className="cap-label">Provider</div>
            <div className="text-[14px] text-ink-900 mt-1">{status.provider === "o365" ? "Microsoft 365" : status.provider || "—"}</div>
          </div>
          <div>
            <div className="cap-label">Sync frequency</div>
            <div className="text-[14px] text-ink-900 mt-1">{status.sync_frequency?.replace(/_/g, " ") || "—"}</div>
          </div>
          <div>
            <div className="cap-label">Last sync</div>
            <div className="text-[14px] text-ink-900 mt-1">
              {status.last_sync_at ? new Date(status.last_sync_at).toLocaleString() : "Never"}
            </div>
          </div>
          <div>
            <div className="cap-label">Initial sync</div>
            <div className="text-[14px] text-ink-900 mt-1 flex items-center gap-1.5">
              {status.initial_sync_complete ? (
                <><CheckCircle2 size={14} className="text-sage" /> Complete</>
              ) : (
                <><Clock size={14} className="text-amber-600" /> In progress</>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Consent status */}
      <div className="px-6 py-3 border-b border-surface-divider flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-ink-400" />
          <span className="text-[12px] text-ink-600">EMAIL_SYNC Consent:</span>
          {consentStatus?.is_granted ? (
            <Tag variant="positive">Granted</Tag>
          ) : (
            <Tag variant="warning">Not granted</Tag>
          )}
          {consentStatus?.granted_at && (
            <span className="text-[11px] text-ink-400 ml-2">
              since {new Date(consentStatus.granted_at).toLocaleDateString()}
            </span>
          )}
        </div>
        {!consentStatus?.is_granted && hasPermission("consent:grant") && (
          <button
            onClick={handleGrantConsent}
            disabled={actionLoading === "consent"}
            className="btn-ghost text-[11px] inline-flex items-center gap-1.5"
          >
            {actionLoading === "consent" ? <Loader2 size={12} className="animate-spin" /> : <Shield size={12} />}
            Grant consent
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 flex items-center gap-3 flex-wrap">
        {!isConnected && !isAuthFailed && !isDisconnected && hasPermission("email:connect") && (
          <button
            onClick={handleConnect}
            disabled={!!actionLoading}
            className="btn-primary inline-flex items-center gap-2 text-[12px]"
          >
            {actionLoading === "connect" ? <Loader2 size={14} className="animate-spin" /> : <Link2 size={14} />}
            Connect Microsoft 365
          </button>
        )}

        {isConnected && (
          <>
            <RequirePermission permission="email:sync">
              <button
                onClick={handleSync}
                disabled={!!actionLoading}
                className="btn-primary inline-flex items-center gap-2 text-[12px]"
              >
                {actionLoading === "sync" ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                Trigger sync
              </button>
            </RequirePermission>

            <RequirePermission permission="email:disconnect">
              <button
                onClick={handleDisconnect}
                disabled={!!actionLoading}
                className="btn-ghost inline-flex items-center gap-2 text-[12px] text-crit"
              >
                {actionLoading === "disconnect" ? <Loader2 size={14} className="animate-spin" /> : <Unlink size={14} />}
                Disconnect
              </button>
            </RequirePermission>
          </>
        )}

        {(isAuthFailed || isDisconnected) && hasPermission("email:connect") && (
          <button
            onClick={handleConnect}
            disabled={!!actionLoading}
            className="btn-primary inline-flex items-center gap-2 text-[12px]"
          >
            {actionLoading === "connect" ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
            Reconnect
          </button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mb-4 bg-red-50 border border-red-200 text-red-700 text-[12px] px-4 py-2.5 rounded-md flex items-center gap-2">
          <XCircle size={14} /> {error}
        </div>
      )}
      {success && (
        <div className="mx-6 mb-4 bg-green-50 border border-green-200 text-green-700 text-[12px] px-4 py-2.5 rounded-md flex items-center gap-2">
          <CheckCircle2 size={14} /> {success}
        </div>
      )}
    </div>
  );
}

// ─── Setup Steps Guide ──────────────────────────────────────────────────────

function SetupSteps({ emailStatus, consentStatus }) {
  const isConnected = emailStatus?.status === "CONNECTED";
  const consentGranted = consentStatus?.is_granted === true;
  const syncComplete = emailStatus?.initial_sync_complete === true;

  const steps = [
    {
      num: 1,
      title: "Grant EMAIL_SYNC consent",
      desc: "Allow OneLenz to scan and process your emails.",
      done: consentGranted,
    },
    {
      num: 2,
      title: "Connect Microsoft 365",
      desc: "Authorize OneLenz to access your mailbox via OAuth.",
      done: isConnected,
    },
    {
      num: 3,
      title: "Initial sync completes",
      desc: "OneLenz syncs your recent emails (runs every 15 minutes).",
      done: syncComplete,
    },
    {
      num: 4,
      title: "AI processes your inbox",
      desc: "Emails are categorized, summarized, and draft replies are generated.",
      done: false, // This would come from a future content engine API
    },
  ];

  const completedCount = steps.filter(s => s.done).length;

  return (
    <div className="surface-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="cap-label flex items-center gap-2"><ArrowRight size={12} /> Setup progress</div>
          <div className="text-[13px] text-ink-500 mt-1">{completedCount} of {steps.length} steps complete</div>
        </div>
        {/* Progress bar */}
        <div className="w-32 h-2 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-maroon rounded-full transition-all"
            style={{ width: `${(completedCount / steps.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.num} className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full grid place-items-center shrink-0 text-[11px] font-medium ${
              step.done ? "bg-green-100 text-green-700" : "bg-surface-muted text-ink-400"
            }`}>
              {step.done ? <CheckCircle2 size={14} /> : step.num}
            </div>
            <div>
              <div className={`text-[13px] font-medium ${step.done ? "text-ink-500 line-through" : "text-ink-900"}`}>
                {step.title}
              </div>
              <div className="text-[12px] text-ink-400 mt-0.5">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sync Activity Summary ──────────────────────────────────────────────────

function SyncSummary({ emailStatus }) {
  if (!emailStatus || emailStatus.status !== "CONNECTED") return null;

  return (
    <div className="surface-card p-6">
      <div className="cap-label flex items-center gap-2 mb-4"><Mail size={12} /> Sync summary</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="text-[28px] font-medium text-ink-900 tnum">
            {emailStatus.total_emails_synced?.toLocaleString() || 0}
          </div>
          <div className="text-[12px] text-ink-500 mt-1">Total emails synced</div>
        </div>
        <div>
          <div className="text-[28px] font-medium text-ink-900">
            {emailStatus.provider === "o365" ? "Microsoft 365" : emailStatus.provider || "—"}
          </div>
          <div className="text-[12px] text-ink-500 mt-1">Provider</div>
        </div>
        <div>
          <div className="text-[28px] font-medium text-ink-900">
            {emailStatus.sync_frequency?.replace(/_/g, " ") || "—"}
          </div>
          <div className="text-[12px] text-ink-500 mt-1">Sync frequency</div>
        </div>
        <div>
          <div className="text-[28px] font-medium text-ink-900 flex items-center gap-2">
            {emailStatus.initial_sync_complete ? (
              <><CheckCircle2 size={20} className="text-sage" /> Done</>
            ) : (
              <><Clock size={20} className="text-amber-600" /> Running</>
            )}
          </div>
          <div className="text-[12px] text-ink-500 mt-1">Initial sync</div>
        </div>
      </div>
      {emailStatus.last_sync_at && (
        <div className="mt-4 pt-4 border-t border-surface-divider text-[12px] text-ink-500">
          Last synced: {new Date(emailStatus.last_sync_at).toLocaleString()}
          {emailStatus.connected_at && (
            <span className="ml-4">Connected since: {new Date(emailStatus.connected_at).toLocaleDateString()}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Empty Inbox State ──────────────────────────────────────────────────────

function EmptyInboxState({ isConnected, syncComplete }) {
  if (!isConnected) {
    return (
      <div className="text-center py-16 px-6">
        <MailX size={40} className="text-ink-200 mx-auto mb-4" />
        <div className="text-[16px] font-medium text-ink-700">Connect your email to get started</div>
        <div className="text-[13px] text-ink-500 mt-2 max-w-md mx-auto">
          Connect your Microsoft 365 account above to enable email intelligence. OneLenz will sync, categorize, and draft replies for your inbox.
        </div>
      </div>
    );
  }

  if (!syncComplete) {
    return (
      <div className="text-center py-16 px-6">
        <Loader2 size={40} className="text-maroon mx-auto mb-4 animate-spin" />
        <div className="text-[16px] font-medium text-ink-700">Syncing your emails…</div>
        <div className="text-[13px] text-ink-500 mt-2 max-w-md mx-auto">
          Initial sync is in progress. This may take a few minutes depending on your mailbox size. Emails will appear here once processing is complete.
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16 px-6">
      <Inbox size={40} className="text-ink-200 mx-auto mb-4" />
      <div className="text-[16px] font-medium text-ink-700">Emails synced — AI processing pending</div>
      <div className="text-[13px] text-ink-500 mt-2 max-w-md mx-auto">
        Your emails have been synced successfully. The AI engine is processing them to generate categories, summaries, and draft replies. Check back shortly.
      </div>
    </div>
  );
}

// ─── Email Signals Panel ─────────────────────────────────────────────────────

const PRIORITY_STYLES = {
  HIGH: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  MEDIUM: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  LOW: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
};

const SENTIMENT_STYLES = {
  POSITIVE: { bg: "bg-green-50", text: "text-green-700" },
  NEUTRAL: { bg: "bg-gray-50", text: "text-gray-600" },
  NEGATIVE: { bg: "bg-red-50", text: "text-red-700" },
  URGENT: { bg: "bg-purple-50", text: "text-purple-700" },
};

const STATUS_STYLES = {
  NEW: "bg-blue-100 text-blue-700",
  VIEWED: "bg-gray-100 text-gray-600",
  ACTIONED: "bg-amber-100 text-amber-700",
  RESOLVED: "bg-green-100 text-green-700",
  IGNORED: "bg-gray-100 text-gray-400",
  RESOLUTION_SUGGESTED: "bg-purple-100 text-purple-700",
  MERGE_SUGGESTED: "bg-indigo-100 text-indigo-700",
  MISSED: "bg-red-100 text-red-700",
  ESCALATED: "bg-orange-100 text-orange-700",
};

function SignalCard({ signal, onAction, actionLoading, onClick }) {
  const priority = PRIORITY_STYLES[signal.priority] || PRIORITY_STYLES.LOW;
  const sentiment = SENTIMENT_STYLES[signal.sentiment] || SENTIMENT_STYLES.NEUTRAL;

  return (
    <div
      className={`border ${priority.border} rounded-lg p-4 ${priority.bg} transition-all hover:shadow-md cursor-pointer group`}
      onClick={() => onClick(signal)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(signal); }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_STYLES[signal.status] || "bg-gray-100 text-gray-600"}`}>
              {signal.status}
            </span>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${priority.text} ${priority.bg}`}>
              {signal.priority}
            </span>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${sentiment.text} ${sentiment.bg}`}>
              {signal.sentiment}
            </span>
            {signal.confidence_score && (
              <span className="text-[10px] text-ink-400">{signal.confidence_score}% confidence</span>
            )}
          </div>
          <div className="text-[13px] font-medium text-ink-900 truncate group-hover:text-maroon transition-colors">{signal.subject}</div>
          {signal.category_tags?.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {signal.category_tags.map((cat) => (
                <span key={cat} className="text-[10px] px-1.5 py-0.5 bg-white/60 rounded text-ink-500 border border-surface-divider">
                  {cat}
                </span>
              ))}
            </div>
          )}
          <div className="text-[11px] text-ink-400 mt-2 flex items-center gap-2">
            Surfaced {new Date(signal.surfaced_at).toLocaleString()}
            {signal.account_name && (
              <span className="text-ink-500">• {signal.account_name}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0">
          {signal.status === "NEW" && (
            <button
              onClick={(e) => { e.stopPropagation(); onAction(signal.signal_id, { action: "COMPLETE", reason: "ACTION_COMPLETED", notes: "Marked from inbox" }); }}
              disabled={actionLoading === signal.signal_id}
              className="btn-ghost text-[10px] inline-flex items-center gap-1 px-2 py-1 text-sage hover:bg-green-50"
              title="Mark complete"
            >
              {actionLoading === signal.signal_id ? <Loader2 size={10} className="animate-spin" /> : <CheckSquare size={12} />}
            </button>
          )}
          {signal.status === "NEW" && (
            <button
              onClick={(e) => { e.stopPropagation(); onAction(signal.signal_id, { action: "IGNORE", reason: "NOT_RELEVANT" }); }}
              disabled={actionLoading === signal.signal_id}
              className="btn-ghost text-[10px] inline-flex items-center gap-1 px-2 py-1 text-ink-400 hover:bg-gray-50"
              title="Ignore"
            >
              <XSquare size={12} />
            </button>
          )}
          <ChevronRight size={14} className="text-ink-300 group-hover:text-maroon transition-colors mt-1" />
        </div>
      </div>
    </div>
  );
}

// ─── Signal Detail Drawer ────────────────────────────────────────────────────

function SignalDetailDrawer({ signal, onClose, onAction, actionLoading }) {
  const [detail, setDetail] = useState(null);
  const [history, setHistory] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [activeTab, setActiveTab] = useState("detail");

  useEffect(() => {
    if (!signal) return;
    setLoadingDetail(true);
    setActiveTab("detail");

    Promise.all([
      signalsService.detail(signal.signal_id),
      signalsService.history(signal.signal_id),
    ])
      .then(([detailRes, historyRes]) => {
        setDetail(detailRes.data);
        setHistory(historyRes.data);
      })
      .catch((err) => {
        console.error("Failed to load signal detail:", err);
        // Fall back to the list-level data we already have
        setDetail(signal);
        setHistory(null);
      })
      .finally(() => setLoadingDetail(false));
  }, [signal]);

  if (!signal) return null;

  const priority = PRIORITY_STYLES[detail?.priority || signal.priority] || PRIORITY_STYLES.LOW;
  const sentiment = SENTIMENT_STYLES[detail?.sentiment || signal.sentiment] || SENTIMENT_STYLES.NEUTRAL;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-in-right">
        {/* Drawer header */}
        <div className="px-6 py-4 border-b border-surface-divider flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-8 h-8 grid place-items-center rounded-md ${priority.bg}`}>
              <Zap size={16} className={priority.text} />
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-medium text-ink-900 truncate">
                {detail?.subject || signal.subject}
              </div>
              <div className="text-[11px] text-ink-400 mt-0.5">
                Signal #{signal.signal_id}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-md text-ink-400 hover:text-ink-700 hover:bg-surface-hover transition-colors"
            aria-label="Close"
          >
            <XCircle size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-surface-divider flex gap-1 shrink-0">
          {[
            { key: "detail", label: "Details" },
            { key: "history", label: "History" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2.5 text-[12px] font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-maroon text-maroon"
                  : "border-transparent text-ink-400 hover:text-ink-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loadingDetail ? (
            <div className="flex items-center justify-center gap-3 py-16">
              <Loader2 size={18} className="animate-spin text-maroon" />
              <span className="text-[13px] text-ink-500">Loading signal details…</span>
            </div>
          ) : activeTab === "detail" ? (
            <div className="p-6 space-y-6">
              {/* Status badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center px-2 py-1 rounded text-[11px] font-medium ${STATUS_STYLES[detail?.status || signal.status]}`}>
                  {detail?.status || signal.status}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded text-[11px] font-medium ${priority.text} ${priority.bg}`}>
                  {detail?.priority || signal.priority} priority
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded text-[11px] font-medium ${sentiment.text} ${sentiment.bg}`}>
                  {detail?.sentiment || signal.sentiment}
                </span>
                {detail?.resolution_tag && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700">
                    {detail.resolution_tag}
                  </span>
                )}
              </div>

              {/* Body / email content */}
              {detail?.body && (
                <div>
                  <div className="cap-label mb-2">Email content</div>
                  <div className="bg-surface-page border border-surface-divider rounded-lg p-4 text-[13px] text-ink-700 leading-relaxed whitespace-pre-wrap">
                    {detail.body}
                  </div>
                </div>
              )}

              {/* Suggested action */}
              {detail?.suggested_action && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="cap-label text-amber-700 mb-1.5 flex items-center gap-1.5">
                    <Zap size={12} /> Suggested action
                  </div>
                  <div className="text-[13px] text-amber-900">{detail.suggested_action}</div>
                </div>
              )}

              {/* Confidence breakdown */}
              {detail?.confidence_score && (
                <div>
                  <div className="cap-label mb-2">Confidence score</div>
                  <div className="flex items-center gap-3">
                    <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-maroon rounded-full transition-all"
                        style={{ width: `${detail.confidence_score}%` }}
                      />
                    </div>
                    <span className="text-[13px] font-medium text-ink-900 tnum shrink-0">{detail.confidence_score}%</span>
                  </div>
                  {detail.confidence_breakdown && (
                    <div className="mt-2 grid grid-cols-5 gap-2">
                      {Object.entries(detail.confidence_breakdown)
                        .filter(([k]) => k !== "total")
                        .map(([key, val]) => (
                          <div key={key} className="text-center">
                            <div className="text-[11px] text-ink-400">{key}</div>
                            <div className="text-[13px] font-medium text-ink-700 tnum">{val}</div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Account info */}
              {detail?.account && (
                <div>
                  <div className="cap-label mb-2">Account</div>
                  <div className="bg-surface-page border border-surface-divider rounded-lg p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-maroon/10 grid place-items-center text-[11px] font-medium text-maroon">
                      {detail.account.account_name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-ink-900">{detail.account.account_name}</div>
                      {detail.account.account_type_tag && (
                        <div className="text-[11px] text-ink-400">{detail.account.account_type_tag}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Extracted entities */}
              {detail?.extracted_entities?.length > 0 && (
                <div>
                  <div className="cap-label mb-2">Extracted entities</div>
                  <div className="flex flex-wrap gap-2">
                    {detail.extracted_entities.map((entity, idx) => (
                      <div key={idx} className="inline-flex items-center gap-1.5 bg-surface-page border border-surface-divider rounded-md px-2.5 py-1.5">
                        <span className="text-[10px] font-medium text-ink-400 uppercase">{entity.type}</span>
                        <span className="text-[12px] text-ink-700">{entity.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Participants */}
              {detail?.participants?.length > 0 && (
                <div>
                  <div className="cap-label mb-2">Participants</div>
                  <div className="space-y-2">
                    {detail.participants.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-surface-page border border-surface-divider rounded-lg p-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 grid place-items-center text-[11px] font-medium text-blue-700">
                          {p.name?.charAt(0) || "?"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-medium text-ink-900">{p.name}</div>
                          <div className="text-[11px] text-ink-400 truncate">
                            {p.title && <span>{p.title}</span>}
                            {p.title && p.company && <span> • </span>}
                            {p.company && <span>{p.company}</span>}
                          </div>
                          {p.email && <div className="text-[11px] text-ink-400">{p.email}</div>}
                        </div>
                        {p.matched_contact && (
                          <Tag variant="positive">Matched</Tag>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {detail?.category_tags?.length > 0 && (
                <div>
                  <div className="cap-label mb-2">Categories</div>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.category_tags.map((cat) => (
                      <span key={cat} className="text-[11px] px-2 py-1 bg-surface-muted rounded-md text-ink-600 border border-surface-divider">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div>
                <div className="cap-label mb-2">Timeline</div>
                <div className="space-y-1.5 text-[12px] text-ink-500">
                  <div className="flex justify-between">
                    <span>Surfaced</span>
                    <span className="text-ink-700">{detail?.surfaced_at ? new Date(detail.surfaced_at).toLocaleString() : "—"}</span>
                  </div>
                  {detail?.first_action_at && (
                    <div className="flex justify-between">
                      <span>First action</span>
                      <span className="text-ink-700">{new Date(detail.first_action_at).toLocaleString()}</span>
                    </div>
                  )}
                  {detail?.completed_at && (
                    <div className="flex justify-between">
                      <span>Completed</span>
                      <span className="text-ink-700">{new Date(detail.completed_at).toLocaleString()}</span>
                    </div>
                  )}
                  {detail?.completion_reason && (
                    <div className="flex justify-between">
                      <span>Reason</span>
                      <span className="text-ink-700">{detail.completion_reason}</span>
                    </div>
                  )}
                  {detail?.completion_notes && (
                    <div className="flex justify-between">
                      <span>Notes</span>
                      <span className="text-ink-700">{detail.completion_notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* History tab */
            <div className="p-6">
              {history?.history?.length > 0 ? (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-3 top-3 bottom-3 w-px bg-surface-divider" />
                  <div className="space-y-4">
                    {history.history.map((entry) => (
                      <div key={entry.log_id} className="flex gap-4 relative">
                        <div className={`w-6 h-6 rounded-full grid place-items-center shrink-0 z-10 ${
                          entry.to_status === "RESOLVED" ? "bg-green-100" :
                          entry.to_status === "IGNORED" ? "bg-gray-100" :
                          entry.to_status === "NEW" ? "bg-blue-100" :
                          "bg-surface-muted"
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            entry.to_status === "RESOLVED" ? "bg-green-500" :
                            entry.to_status === "IGNORED" ? "bg-gray-400" :
                            entry.to_status === "NEW" ? "bg-blue-500" :
                            "bg-ink-300"
                          }`} />
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="text-[13px] text-ink-900 font-medium">
                            {entry.from_status ? `${entry.from_status} → ${entry.to_status}` : entry.to_status}
                          </div>
                          <div className="text-[11px] text-ink-400 mt-0.5 flex items-center gap-2">
                            <span>{entry.change_source === "SYSTEM" ? "System" : entry.changed_by_name || "User"}</span>
                            <span>•</span>
                            <span>{new Date(entry.changed_at).toLocaleString()}</span>
                          </div>
                          {entry.reason && (
                            <div className="text-[12px] text-ink-500 mt-1">Reason: {entry.reason}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-[13px] text-ink-400">
                  No history available for this signal.
                </div>
              )}

              {/* Merged signals */}
              {history?.merged_signals?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-surface-divider">
                  <div className="cap-label mb-3">Merged signals</div>
                  <div className="space-y-2">
                    {history.merged_signals.map((merged) => (
                      <div key={merged.snew_signal_id} className="bg-surface-page border border-surface-divider rounded-lg p-3">
                        <div className="text-[12px] font-medium text-ink-900">{merged.snew_subject}</div>
                        <div className="text-[11px] text-ink-500 mt-1">{merged.snew_body}</div>
                        <div className="text-[10px] text-ink-400 mt-2 flex items-center gap-3">
                          <span>Source: {merged.snew_source}</span>
                          <span>Correlation: {merged.correlation_score}%</span>
                          <span>Merged: {new Date(merged.merged_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer footer actions */}
        {!loadingDetail && activeTab === "detail" && (
          <div className="px-6 py-4 border-t border-surface-divider shrink-0 flex items-center gap-2 flex-wrap bg-white">
            {(detail?.status === "NEW" || detail?.status === "VIEWED") && (
              <>
                <button
                  onClick={() => onAction(signal.signal_id, { action: "COMPLETE", reason: "ACTION_COMPLETED", notes: "" })}
                  disabled={actionLoading === signal.signal_id}
                  className="btn-primary inline-flex items-center gap-2 text-[12px]"
                >
                  {actionLoading === signal.signal_id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Mark complete
                </button>
                <button
                  onClick={() => onAction(signal.signal_id, { action: "IGNORE", reason: "NOT_RELEVANT" })}
                  disabled={actionLoading === signal.signal_id}
                  className="btn-ghost inline-flex items-center gap-2 text-[12px] text-ink-500"
                >
                  <XSquare size={14} /> Ignore
                </button>
              </>
            )}
            {detail?.status === "RESOLUTION_SUGGESTED" && (
              <>
                <button
                  onClick={() => onAction(signal.signal_id, { action: "CONFIRM_COMPLETE" })}
                  disabled={actionLoading === signal.signal_id}
                  className="btn-primary inline-flex items-center gap-2 text-[12px]"
                >
                  <CheckCircle2 size={14} /> Confirm completion
                </button>
                <button
                  onClick={() => onAction(signal.signal_id, { action: "DISMISS" })}
                  disabled={actionLoading === signal.signal_id}
                  className="btn-ghost inline-flex items-center gap-2 text-[12px] text-ink-500"
                >
                  <XSquare size={14} /> Dismiss
                </button>
              </>
            )}
            {detail?.status === "MERGE_SUGGESTED" && (
              <>
                <button
                  onClick={() => onAction(signal.signal_id, { action: "CONFIRM_MERGE" })}
                  disabled={actionLoading === signal.signal_id}
                  className="btn-primary inline-flex items-center gap-2 text-[12px]"
                >
                  <CheckCircle2 size={14} /> Confirm merge
                </button>
                <button
                  onClick={() => onAction(signal.signal_id, { action: "DISMISS" })}
                  disabled={actionLoading === signal.signal_id}
                  className="btn-ghost inline-flex items-center gap-2 text-[12px] text-ink-500"
                >
                  <XSquare size={14} /> Dismiss
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function EmailSignalsPanel({ isConnected }) {
  const [signals, setSignals] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [filters, setFilters] = useState({
    priority: "",
    status: "",
    sentiment: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchSignals = useCallback(async () => {
    if (!isConnected) return;
    setLoading(true);
    setError("");
    try {
      const params = { source: "EMAIL", sort: "impact", page_size: 20 };
      if (filters.priority) params.priority = filters.priority;
      if (filters.status) params.status = filters.status;
      if (filters.sentiment) params.sentiment = filters.sentiment;
      if (filters.search && filters.search.length >= 3) params.search = filters.search;

      const res = await signalsService.list(params);
      setStats(res.data.stats);
      // Flatten signals from accounts
      const allSignals = (res.data.accounts || []).flatMap((acct) =>
        (acct.signals || []).map((sig) => ({ ...sig, account_name: acct.account_name, account_id: acct.account_id }))
      );
      setSignals(allSignals);
    } catch (err) {
      console.error("Failed to fetch email signals:", err);
      setError("Failed to load email signals.");
      setSignals([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [isConnected, filters]);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  const handleAction = async (signalId, actionPayload) => {
    setActionLoading(signalId);
    try {
      await signalsService.updateStatus(signalId, actionPayload);
      // Refresh signals after action
      await fetchSignals();
      // Close drawer if the actioned signal was the selected one
      if (selectedSignal?.signal_id === signalId) {
        setSelectedSignal(null);
      }
    } catch (err) {
      console.error("Signal action failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (!isConnected) return null;

  return (
    <div className="surface-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-surface-divider flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 grid place-items-center rounded-md bg-purple-50">
            <Zap size={18} className="text-purple-600" />
          </div>
          <div>
            <div className="text-[14px] font-medium text-ink-900">Email Signals</div>
            <div className="text-[12px] text-ink-500 mt-0.5">
              AI-detected signals from your synced emails
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-ghost text-[11px] inline-flex items-center gap-1.5 px-2 py-1 ${showFilters ? "bg-surface-muted" : ""}`}
          >
            <Filter size={12} /> Filters
          </button>
          <button onClick={fetchSignals} className="btn-ghost text-[11px] inline-flex items-center gap-1.5 px-2 py-1">
            <RefreshCw size={12} /> Refresh
          </button>
          {stats && (
            <Tag variant="neutral">{stats.total} total</Tag>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-6 py-3 border-b border-surface-divider bg-surface-page flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Search size={12} className="text-ink-400" />
            <input
              type="text"
              placeholder="Search signals (min 3 chars)…"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="text-[12px] bg-white border border-surface-divider rounded px-2 py-1 w-48 focus:outline-none focus:ring-1 focus:ring-maroon/30"
            />
          </div>
          <select
            value={filters.priority}
            onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
            className="text-[12px] bg-white border border-surface-divider rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-maroon/30"
          >
            <option value="">All priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="text-[12px] bg-white border border-surface-divider rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-maroon/30"
          >
            <option value="">All statuses</option>
            <option value="NEW">New</option>
            <option value="VIEWED">Viewed</option>
            <option value="ACTIONED">Actioned</option>
            <option value="RESOLVED">Resolved</option>
            <option value="IGNORED">Ignored</option>
            <option value="MISSED">Missed</option>
            <option value="ESCALATED">Escalated</option>
          </select>
          <select
            value={filters.sentiment}
            onChange={(e) => setFilters((f) => ({ ...f, sentiment: e.target.value }))}
            className="text-[12px] bg-white border border-surface-divider rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-maroon/30"
          >
            <option value="">All sentiments</option>
            <option value="POSITIVE">Positive</option>
            <option value="NEUTRAL">Neutral</option>
            <option value="NEGATIVE">Negative</option>
            <option value="URGENT">Urgent</option>
          </select>
          {(filters.priority || filters.status || filters.sentiment || filters.search) && (
            <button
              onClick={() => setFilters({ priority: "", status: "", sentiment: "", search: "" })}
              className="text-[11px] text-maroon hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Stats bar */}
      {stats && (
        <div className="px-6 py-3 border-b border-surface-divider bg-surface-page grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-ink-400" />
            <div>
              <div className="text-[16px] font-medium text-ink-900 tnum">{stats.total}</div>
              <div className="text-[10px] text-ink-400">Total signals</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertOctagon size={14} className="text-amber-500" />
            <div>
              <div className="text-[16px] font-medium text-ink-900 tnum">{stats.unactioned}</div>
              <div className="text-[10px] text-ink-400">Unactioned</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-500" />
            <div>
              <div className="text-[16px] font-medium text-ink-900 tnum">{stats.missed}</div>
              <div className="text-[10px] text-ink-400">Missed</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-blue-500" />
            <div>
              <div className="text-[16px] font-medium text-ink-900 tnum">{stats.by_status?.NEW || 0}</div>
              <div className="text-[10px] text-ink-400">New</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-500" />
            <div>
              <div className="text-[16px] font-medium text-ink-900 tnum">{stats.by_status?.RESOLVED || 0}</div>
              <div className="text-[10px] text-ink-400">Resolved</div>
            </div>
          </div>
        </div>
      )}

      {/* Signal list */}
      <div className="px-6 py-4">
        {loading && (
          <div className="flex items-center justify-center gap-3 py-8">
            <Loader2 size={18} className="animate-spin text-maroon" />
            <span className="text-[13px] text-ink-500">Loading email signals…</span>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] px-4 py-2.5 rounded-md flex items-center gap-2">
            <XCircle size={14} /> {error}
          </div>
        )}

        {!loading && !error && signals?.length === 0 && (
          <div className="text-center py-8">
            <Zap size={32} className="text-ink-200 mx-auto mb-3" />
            <div className="text-[14px] font-medium text-ink-600">No email signals yet</div>
            <div className="text-[12px] text-ink-400 mt-1">
              Signals will appear here as the AI processes your synced emails and detects actionable insights.
            </div>
          </div>
        )}

        {!loading && !error && signals?.length > 0 && (
          <div className="space-y-3">
            {signals.map((signal) => (
              <SignalCard
                key={signal.signal_id}
                signal={signal}
                onAction={handleAction}
                actionLoading={actionLoading}
                onClick={(sig) => setSelectedSignal(sig)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Signal Detail Drawer */}
      {selectedSignal && (
        <SignalDetailDrawer
          signal={selectedSignal}
          onClose={() => setSelectedSignal(null)}
          onAction={handleAction}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function SmartInbox() {
  const [emailStatus, setEmailStatus] = useState(null);
  const [consentStatus, setConsentStatus] = useState(null);

  const handleStatusChange = useCallback((email, consent) => {
    setEmailStatus(email);
    setConsentStatus(consent);
  }, []);

  const isConnected = emailStatus?.status === "CONNECTED";
  const syncComplete = emailStatus?.initial_sync_complete === true;

  return (
    <div data-testid="page-inbox">
      <PageHeader
        eyebrow="Email Intelligence"
        title="Read, reasoned, drafted — for your nod."
        lede="Connect your Microsoft 365 mailbox. OneLenz syncs your emails, categorizes them by urgency, generates AI summaries, and drafts context-aware replies."
      />

      {/* Email Integration Panel */}
      <div className="px-6 lg:px-10 pt-7">
        <EmailConnectionPanel onStatusChange={handleStatusChange} />
      </div>

      {/* Setup Steps (show when not fully set up) */}
      {(!isConnected || !syncComplete) && (
        <div className="px-6 lg:px-10 pt-6">
          <SetupSteps emailStatus={emailStatus} consentStatus={consentStatus} />
        </div>
      )}

      {/* Sync Summary (show when connected) */}
      {isConnected && (
        <div className="px-6 lg:px-10 pt-6">
          <SyncSummary emailStatus={emailStatus} />
        </div>
      )}

      {/* Email Signals (show when connected and sync complete) */}
      {isConnected && syncComplete && (
        <div className="px-6 lg:px-10 pt-6">
          <EmailSignalsPanel isConnected={isConnected} />
        </div>
      )}

      {/* Inbox content area */}
      <div className="px-6 lg:px-10 pt-6 pb-8">
        <EmptyInboxState isConnected={isConnected} syncComplete={syncComplete} />
      </div>
    </div>
  );
}
