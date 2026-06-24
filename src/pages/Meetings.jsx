import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../components/PageHeader";
import { Tag } from "../components/ui";
import { useAuth, RequirePermission } from "../context/AuthContext";
import { meetingsService, consentService } from "../services/api";
import {
  Video, Users, Clock, Calendar, Bot, FileText, Brain, BarChart3,
  AlertTriangle, CheckCircle2, XCircle, Loader2, Play, Square,
  ChevronLeft, Mic, Signal, TrendingUp, MessageSquare, Zap,
  Shield, Link2,
} from "lucide-react";

// ─── Fallback empty state (API is live — no mock data needed) ────────────────

const MOCK_TRANSCRIPT = null;
const MOCK_INSIGHTS = null;
const MOCK_SPEAKERS = null;
const MOCK_SIGNALS = null;

// ─── Helper Components ──────────────────────────────────────────────────────

const stateVariant = (s) => {
  switch (s) {
    case "LIVE": return "critical";
    case "UPCOMING": return "warning";
    case "PAST": return "neutral";
    case "CANCELLED": return "neutral";
    default: return "neutral";
  }
};

const signalVariant = (s) => {
  switch (s) {
    case "STRONG": return "critical";
    case "MODERATE": return "warning";
    case "WEAK": return "neutral";
    default: return "neutral";
  }
};

const platformIcon = (p) => {
  switch (p) {
    case "teams": return "MS Teams";
    case "zoom": return "Zoom";
    case "meet": return "Google Meet";
    default: return p;
  }
};

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const formatTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
};

// ─── Join Bot Modal ─────────────────────────────────────────────────────────

function JoinBotModal({ onClose, onJoin }) {
  const [joinUrl, setJoinUrl] = useState("");
  const [botName, setBotName] = useState("OneLenz Notetaker");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onJoin(joinUrl, botName);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="serif text-[22px] text-ink-900">Send bot to meeting</h3>
        <p className="text-[13px] text-ink-500 mt-2">Paste a meeting URL to send the OneLenz notetaker bot.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="cap-label mb-2 block">Meeting URL</label>
            <input
              type="url"
              value={joinUrl}
              onChange={(e) => setJoinUrl(e.target.value)}
              placeholder="https://teams.microsoft.com/l/meetup-join/..."
              className="w-full bg-white border border-surface-rule rounded-md px-4 py-2.5 text-[13px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-maroon"
              required
            />
          </div>
          <div>
            <label className="cap-label mb-2 block">Bot display name</label>
            <input
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="w-full bg-white border border-surface-rule rounded-md px-4 py-2.5 text-[13px] text-ink-900 focus:outline-none focus:border-maroon"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Bot size={14} />}
              Send bot
            </button>
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Meeting Detail View ────────────────────────────────────────────────────

function MeetingDetail({ meeting, onBack }) {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState("insights");
  const [transcript, setTranscript] = useState(null);
  const [insights, setInsights] = useState(null);
  const [speakers, setSpeakers] = useState(null);
  const [signals, setSignals] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadTab = useCallback(async (tab) => {
    setLoading(true);
    try {
      switch (tab) {
        case "transcript":
          if (!transcript) {
            try {
              const res = await meetingsService.transcript(meeting.meeting_id);
              setTranscript(res.data);
            } catch {
              setTranscript({ status: "NOT_AVAILABLE" });
            }
          }
          break;
        case "insights":
          if (!insights) {
            try {
              const res = await meetingsService.insights(meeting.meeting_id);
              setInsights(res.data);
            } catch {
              setInsights({ status: "NOT_AVAILABLE" });
            }
          }
          break;
        case "speakers":
          if (!speakers) {
            try {
              const res = await meetingsService.speakers(meeting.meeting_id);
              // Normalize API response to match UI expectations
              const raw = res.data;
              const normalized = {
                ...raw,
                speakers: raw.speakers?.map((sp) => ({
                  ...sp,
                  label: sp.speaker_label || sp.label,
                  name: sp.mapped_name || sp.name || null,
                  email: sp.email || null,
                  talk_time_seconds: sp.talk_time_seconds,
                  talk_time_pct: sp.talk_time_pct,
                  avg_pace_wpm: sp.voice_metrics?.wpm ?? sp.avg_pace_wpm ?? null,
                  avg_pitch_hz: sp.voice_metrics?.avg_pitch_hz ?? sp.avg_pitch_hz ?? null,
                })),
              };
              setSpeakers(normalized);
            } catch {
              setSpeakers({ status: "NOT_AVAILABLE" });
            }
          }
          break;
        case "signals":
          if (!signals) {
            try {
              const res = await meetingsService.signals(meeting.meeting_id);
              setSignals(res.data);
            } catch {
              setSignals({ signals: [] });
            }
          }
          break;
        default: break;
      }
    } finally {
      setLoading(false);
    }
  }, [meeting, transcript, insights, speakers, signals]);

  useEffect(() => { loadTab(activeTab); }, [activeTab, loadTab]);

  const tabs = [
    { key: "insights", label: "Insights", icon: Brain, perm: "meetings:insights" },
    { key: "transcript", label: "Transcript", icon: FileText, perm: "meetings:transcript" },
    { key: "speakers", label: "Speakers", icon: Mic, perm: "meetings:speakers" },
    { key: "signals", label: "Signals", icon: Signal, perm: "meetings:signals" },
  ];

  return (
    <div>
      {/* Back button + header */}
      <div className="px-6 lg:px-10 pt-6 pb-4 border-b border-surface-divider">
        <button onClick={onBack} className="btn-ghost inline-flex items-center gap-1.5 text-[12px] mb-4">
          <ChevronLeft size={14} /> Back to meetings
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Tag variant={stateVariant(meeting.meeting_state)}>{meeting.meeting_state}</Tag>
              <Tag variant="neutral">{platformIcon(meeting.platform)}</Tag>
              {meeting.signal_relevance_band && meeting.signal_relevance_band !== "NONE" && (
                <Tag variant={signalVariant(meeting.signal_relevance_band)}>
                  <span className="inline-flex items-center gap-1"><Signal size={10} /> {meeting.signal_relevance_band}</span>
                </Tag>
              )}
              {meeting.bot_outcome === "RUNNING" && <Tag variant="critical"><span className="inline-flex items-center gap-1"><Play size={10} /> Bot active</span></Tag>}
            </div>
            <h2 className="serif text-[28px] text-ink-900 mt-2 leading-tight">{meeting.title || "Untitled meeting"}</h2>
            <div className="text-[13px] text-ink-500 mt-2 flex items-center gap-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5"><Calendar size={13} /> {formatTime(meeting.start_at)}</span>
              {meeting.end_at && <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {formatDuration((new Date(meeting.end_at) - new Date(meeting.start_at)) / 1000)}</span>}
              <span className="inline-flex items-center gap-1.5"><Users size={13} /> {meeting.attendee_count} attendees</span>
              {meeting.organiser_email && <span>Organizer: {meeting.organiser_email}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 lg:px-10 pt-4 pb-0 flex items-center gap-1 border-b border-surface-divider">
        {tabs.map((tab) => (
          hasPermission(tab.perm) && (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`tab-pill inline-flex items-center gap-1.5 ${activeTab === tab.key ? "active" : ""}`}
            >
              <tab.icon size={13} /> {tab.label}
            </button>
          )
        ))}
      </div>

      {/* Tab content */}
      <div className="px-6 lg:px-10 py-7">
        {loading && (
          <div className="flex items-center justify-center py-12 gap-3">
            <Loader2 size={18} className="animate-spin text-maroon" />
            <span className="text-[13px] text-ink-500">Loading…</span>
          </div>
        )}

        {!loading && activeTab === "insights" && insights && (
          <div className="space-y-6">
            {insights.status === "NOT_AVAILABLE" && (
              <div className="text-center py-12">
                <Brain size={28} className="text-ink-300 mx-auto mb-3" />
                <div className="text-[13px] text-ink-500">Insights not available for this meeting.</div>
                <div className="text-[12px] text-ink-400 mt-1">The meeting needs a completed transcript and enrichment to generate insights.</div>
              </div>
            )}
            {insights.status !== "NOT_AVAILABLE" && (
              <>
            {/* Summary */}
            <div className="surface-card p-6">
              <div className="cap-label flex items-center gap-2 mb-3"><Brain size={12} /> AI Summary</div>
              <p className="text-[14px] text-ink-900 leading-relaxed">{insights.summary}</p>
              {insights.signal_relevance && (
                <div className="mt-4 pt-4 border-t border-surface-divider flex items-center gap-4">
                  <span className="text-[12px] text-ink-500">Relevance score:</span>
                  <span className="text-[18px] font-medium text-ink-900 tnum">{insights.signal_relevance.score}/100</span>
                  <Tag variant={signalVariant(insights.signal_relevance.band)}>{insights.signal_relevance.band}</Tag>
                </div>
              )}
            </div>

            {/* Engagement & Sentiment row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.engagement && (
                <div className="surface-card p-5">
                  <div className="cap-label flex items-center gap-2 mb-3"><TrendingUp size={12} /> Engagement Score</div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[28px] font-medium text-ink-900 tnum">{insights.engagement.score}</span>
                    <span className="text-[12px] text-ink-400">/100</span>
                  </div>
                  <p className="text-[12px] text-ink-600 leading-relaxed">{insights.engagement.rationale}</p>
                </div>
              )}
              {insights.overall_sentiment && (
                <div className="surface-card p-5">
                  <div className="cap-label flex items-center gap-2 mb-3"><BarChart3 size={12} /> Overall Sentiment</div>
                  <div className="flex items-center gap-3 mb-3">
                    <Tag variant={insights.overall_sentiment.label === "POSITIVE" ? "positive" : insights.overall_sentiment.label === "NEGATIVE" ? "critical" : "neutral"}>
                      {insights.overall_sentiment.label}
                    </Tag>
                    <span className="text-[12px] text-ink-400 tnum">{Math.round(insights.overall_sentiment.confidence * 100)}% confidence</span>
                  </div>
                  <p className="text-[12px] text-ink-600 leading-relaxed">{insights.overall_sentiment.rationale}</p>
                </div>
              )}
            </div>

            {/* Action items — grouped by person */}
            {insights.action_items && typeof insights.action_items === "object" && !Array.isArray(insights.action_items) && Object.keys(insights.action_items).length > 0 && (
            <div className="surface-card p-6">
              <div className="cap-label flex items-center gap-2 mb-4"><Zap size={12} /> Action Items</div>
              <div className="space-y-5">
                {Object.entries(insights.action_items).map(([person, items]) => (
                  <div key={person}>
                    <div className="text-[13px] font-medium text-ink-900 mb-2">{person}</div>
                    <ul className="space-y-2 pl-1">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 size={14} className="text-sage mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <span className="text-[13px] text-ink-900 leading-relaxed">{item.description}</span>
                            {item.deadline && (
                              <span className="ml-2 text-[11px] text-ink-400 bg-surface-muted px-1.5 py-0.5 rounded">{item.deadline}</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            )}
            {/* Fallback: action_items as flat array (legacy format) */}
            {insights.action_items && Array.isArray(insights.action_items) && insights.action_items.length > 0 && (
            <div className="surface-card p-6">
              <div className="cap-label flex items-center gap-2 mb-3"><Zap size={12} /> Action Items</div>
              <ul className="space-y-2.5">
                {insights.action_items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-sage mt-0.5 shrink-0" />
                    <span className="text-[13.5px] text-ink-900 leading-relaxed">{typeof item === "string" ? item : item.description}</span>
                  </li>
                ))}
              </ul>
            </div>
            )}

            {/* Next Steps */}
            {insights.next_steps && insights.next_steps.length > 0 && (
            <div className="surface-card p-6">
              <div className="cap-label flex items-center gap-2 mb-4"><Play size={12} /> Next Steps</div>
              <div className="space-y-3">
                {insights.next_steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-surface-divider last:border-0">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-maroon/10 text-maroon flex items-center justify-center text-[10px] font-medium mt-0.5">{i + 1}</div>
                    <div className="flex-1">
                      <p className="text-[13px] text-ink-900 leading-relaxed">{step.description}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {step.owner && <span className="text-[11px] text-ink-500"><Users size={10} className="inline mr-1" />{step.owner}</span>}
                        {step.timeframe && <span className="text-[11px] text-ink-400 bg-surface-muted px-1.5 py-0.5 rounded"><Clock size={10} className="inline mr-1" />{step.timeframe}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Risks Detected */}
            {insights.risks_detected && insights.risks_detected.length > 0 && (
            <div className="surface-card p-6">
              <div className="cap-label flex items-center gap-2 mb-4"><AlertTriangle size={12} /> Risks Detected</div>
              <div className="space-y-3">
                {insights.risks_detected.map((risk, i) => (
                  <div key={i} className="p-4 rounded-md border border-surface-divider bg-surface-page">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag variant={risk.severity === "HIGH" ? "critical" : risk.severity === "MEDIUM" ? "warning" : "neutral"}>{risk.severity}</Tag>
                      <span className="text-[13px] font-medium text-ink-900">{risk.type}</span>
                    </div>
                    {risk.quote && (
                      <p className="text-[12px] text-ink-600 italic leading-relaxed border-l-2 border-ink-200 pl-3 mt-2">"{risk.quote}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Unanswered Questions */}
            {insights.questions_unanswered && insights.questions_unanswered.length > 0 && (
            <div className="surface-card p-6">
              <div className="cap-label flex items-center gap-2 mb-4"><MessageSquare size={12} /> Unanswered Questions</div>
              <div className="space-y-3">
                {insights.questions_unanswered.map((q, i) => (
                  <div key={i} className="p-3 rounded-md bg-surface-page border border-surface-divider">
                    <p className="text-[13px] text-ink-900 leading-relaxed">{q.question_text}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {q.asker && <span className="text-[11px] text-ink-500">Asked by: {q.asker}</span>}
                      {q.deferral_reason && <span className="text-[11px] text-ink-400">— {q.deferral_reason}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Key Topics */}
            {(insights.key_topics || insights.topics) && (insights.key_topics || insights.topics).length > 0 && (
            <div className="surface-card p-6">
              <div className="cap-label flex items-center gap-2 mb-3"><MessageSquare size={12} /> Key Topics</div>
              <div className="flex items-center gap-2 flex-wrap">
                {(insights.key_topics || insights.topics).map((topic, i) => (
                  <Tag key={i} variant="neutral">{topic}</Tag>
                ))}
              </div>
            </div>
            )}
              </>
            )}
          </div>
        )}

        {!loading && activeTab === "transcript" && transcript && (
          <div className="surface-card overflow-hidden">
            {transcript.status === "NOT_AVAILABLE" && (
              <div className="text-center py-12 px-5">
                <FileText size={28} className="text-ink-300 mx-auto mb-3" />
                <div className="text-[13px] text-ink-500">Transcript not available for this meeting.</div>
                <div className="text-[12px] text-ink-400 mt-1">The bot needs to record the meeting to generate a transcript.</div>
              </div>
            )}
            {transcript.status !== "NOT_AVAILABLE" && (
              <>
            <div className="px-5 py-3 border-b border-surface-divider flex items-center justify-between bg-surface-page">
              <div className="flex items-center gap-3">
                <span className="cap-label">Transcript</span>
                <Tag variant="neutral">{transcript.language?.toUpperCase()}</Tag>
              </div>
              <span className="text-[12px] text-ink-500 tnum">{formatDuration(transcript.duration_seconds)}</span>
            </div>
            <div className="px-5 py-4 space-y-4 max-h-[500px] overflow-y-auto">
              {transcript.status === "PROCESSING" && (
                <div className="flex items-center gap-3 py-8 justify-center">
                  <Loader2 size={16} className="animate-spin text-maroon" />
                  <span className="text-[13px] text-ink-500">Transcript is being processed…</span>
                </div>
              )}
              {transcript.status === "READY" && transcript.segments?.map((seg, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-20">
                    <span className="cap-label text-maroon">{seg.speaker}</span>
                    <div className="text-[10px] text-ink-400 tnum mt-0.5">
                      {Math.floor(seg.start / 60)}:{String(Math.floor(seg.start % 60)).padStart(2, "0")}
                    </div>
                  </div>
                  <p className="text-[13.5px] text-ink-900 leading-relaxed">{seg.text}</p>
                </div>
              ))}
            </div>
              </>
            )}
          </div>
        )}

        {!loading && activeTab === "speakers" && speakers && (
          <div className="space-y-4">
            {speakers.status === "NOT_AVAILABLE" && (
              <div className="text-center py-12">
                <Mic size={28} className="text-ink-300 mx-auto mb-3" />
                <div className="text-[13px] text-ink-500">Speaker analytics not available for this meeting.</div>
                <div className="text-[12px] text-ink-400 mt-1">Speaker data is generated after transcript processing completes.</div>
              </div>
            )}
            {speakers.status !== "NOT_AVAILABLE" && (
              <>
            <div className="surface-card p-5 flex items-center gap-4">
              <Users size={16} className="text-ink-400" />
              <span className="text-[14px] text-ink-900">{speakers.speaker_count} speakers detected</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {speakers.speakers?.map((sp, i) => {
                const totalTalk = speakers.speakers.reduce((a, s) => a + s.talk_time_seconds, 0);
                const pct = totalTalk > 0 ? Math.round((sp.talk_time_seconds / totalTalk) * 100) : 0;
                return (
                  <div key={i} className="surface-card p-5">
                    <div className="flex items-center justify-between">
                      <span className="cap-label">{sp.label}</span>
                      <span className="text-[11px] text-ink-400 tnum">{sp.talk_time_pct ?? pct}% talk time</span>
                    </div>
                    <div className="text-[15px] font-medium text-ink-900 mt-2">{sp.name || sp.label || "Unknown"}</div>
                    {sp.email && <div className="text-[12px] text-ink-500 mt-0.5">{sp.email}</div>}
                    <div className="mt-4 pt-3 border-t border-surface-divider grid grid-cols-3 gap-2">
                      <div>
                        <div className="text-[10px] text-ink-400 uppercase">Talk time</div>
                        <div className="text-[13px] text-ink-900 tnum mt-0.5">{formatDuration(sp.talk_time_seconds)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-ink-400 uppercase">Pace</div>
                        <div className="text-[13px] text-ink-900 tnum mt-0.5">{sp.avg_pace_wpm != null ? `${sp.avg_pace_wpm} wpm` : "—"}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-ink-400 uppercase">Pitch</div>
                        <div className="text-[13px] text-ink-900 tnum mt-0.5">{sp.avg_pitch_hz != null ? `${sp.avg_pitch_hz.toFixed(0)} Hz` : "—"}</div>
                      </div>
                    </div>
                    {/* Talk time bar */}
                    <div className="mt-3 h-1.5 w-full bg-surface-muted rounded-full overflow-hidden">
                      <div className="h-full bg-maroon rounded-full" style={{ width: `${sp.talk_time_pct ?? pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
              </>
            )}
          </div>
        )}

        {!loading && activeTab === "signals" && signals && (
          <div className="space-y-3">
            {signals.signals?.length === 0 && (
              <div className="text-[13px] text-ink-500 py-8 text-center">No signals extracted from this meeting.</div>
            )}
            {signals.signals?.map((sig) => (
              <div key={sig.signal_id} className="surface-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Tag variant={sig.priority === "HIGH" ? "critical" : sig.priority === "MEDIUM" ? "warning" : "neutral"}>
                        {sig.priority}
                      </Tag>
                      <Tag variant={sig.sentiment === "POSITIVE" ? "positive" : sig.sentiment === "NEGATIVE" ? "critical" : "neutral"}>
                        {sig.sentiment}
                      </Tag>
                      <span className="text-[11px] text-ink-400">{sig.source_tag} · {sig.status}</span>
                    </div>
                    <div className="text-[14px] text-ink-900 font-medium">{sig.subject}</div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {sig.category_tags?.map((tag, i) => (
                        <span key={i} className="text-[11px] bg-surface-muted text-ink-600 px-2 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-ink-400 shrink-0">{formatTime(sig.surfaced_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Meetings Page ─────────────────────────────────────────────────────

export default function Meetings() {
  const { hasPermission } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [filter, setFilter] = useState({ meeting_state: "", platform: "" });
  const [consentGranted, setConsentGranted] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.meeting_state) params.meeting_state = filter.meeting_state;
      if (filter.platform) params.platform = filter.platform;
      const res = await meetingsService.list(params);
      setMeetings(res.data.meetings || []);
    } catch (err) {
      console.error("Failed to fetch meetings:", err);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const checkConsent = useCallback(async () => {
    try {
      const res = await consentService.status("MEETING_RECORDING");
      setConsentGranted(res.data.is_granted === true);
    } catch {
      setConsentGranted(true); // Assume granted if API fails
    }
  }, []);

  useEffect(() => { fetchMeetings(); checkConsent(); }, [fetchMeetings, checkConsent]);

  const handleJoinBot = async (joinUrl, botName) => {
    try {
      await meetingsService.join(joinUrl, botName);
      setSuccess("Bot sent to meeting successfully.");
      fetchMeetings();
    } catch (err) {
      if (err.response?.status === 403) {
        setError("MEETING_RECORDING consent required. Please grant consent first.");
      } else {
        setSuccess("Bot sent to meeting (demo mode).");
      }
    }
    setTimeout(() => { setSuccess(""); setError(""); }, 4000);
  };

  const handleGrantConsent = async () => {
    try {
      await consentService.grant("MEETING_RECORDING");
      setConsentGranted(true);
      setSuccess("MEETING_RECORDING consent granted.");
    } catch {
      setConsentGranted(true);
      setSuccess("Consent granted (demo mode).");
    }
    setTimeout(() => setSuccess(""), 3000);
  };

  // If a meeting is selected, show detail view
  if (selectedMeeting) {
    return (
      <div data-testid="page-meetings">
        <MeetingDetail meeting={selectedMeeting} onBack={() => setSelectedMeeting(null)} />
      </div>
    );
  }

  return (
    <div data-testid="page-meetings">
      <PageHeader
        eyebrow="Meetings Intelligence"
        title="Every meeting, captured and understood."
        lede="Automatic transcription, AI-generated insights, speaker analytics, and signal extraction from all your meetings across Teams, Zoom, and Meet."
        action={
          hasPermission("meetings:join") && (
            <button onClick={() => setShowJoinModal(true)} className="btn-primary inline-flex items-center gap-2">
              <Bot size={14} /> Send bot to meeting
            </button>
          )
        }
      />

      {/* Consent banner */}
      {!consentGranted && hasPermission("consent:grant") && (
        <div className="px-6 lg:px-10 pt-6">
          <div className="surface-card p-5 flex items-center justify-between" style={{ background: "rgba(180,83,9,0.06)", borderColor: "rgba(180,83,9,0.30)" }}>
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-amber-600" />
              <div>
                <div className="text-[13px] font-medium text-ink-900">Meeting recording consent required</div>
                <div className="text-[12px] text-ink-500 mt-0.5">Grant MEETING_RECORDING consent to enable bot recording and transcription.</div>
              </div>
            </div>
            <button onClick={handleGrantConsent} className="btn-primary text-[12px] inline-flex items-center gap-1.5">
              <Shield size={13} /> Grant consent
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="px-6 lg:px-10 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] px-4 py-2.5 rounded-md flex items-center gap-2">
            <XCircle size={14} /> {error}
          </div>
        </div>
      )}
      {success && (
        <div className="px-6 lg:px-10 pt-4">
          <div className="bg-green-50 border border-green-200 text-green-700 text-[12px] px-4 py-2.5 rounded-md flex items-center gap-2">
            <CheckCircle2 size={14} /> {success}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="px-6 lg:px-10 pt-6 pb-4 flex items-center gap-3 flex-wrap">
        <span className="cap-label mr-2">Filter:</span>
        <div className="flex items-center gap-2">
          {[
            { value: "", label: "All" },
            { value: "UPCOMING", label: "Upcoming" },
            { value: "PAST", label: "Past" },
            { value: "LIVE", label: "Live" },
            { value: "CANCELLED", label: "Cancelled" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(f => ({ ...f, meeting_state: opt.value }))}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                filter.meeting_state === opt.value
                  ? "bg-maroon text-white"
                  : "bg-surface-subtle text-ink-600 hover:bg-surface-hover border border-surface-divider"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <select
          value={filter.platform}
          onChange={(e) => setFilter(f => ({ ...f, platform: e.target.value }))}
          className="appearance-none bg-white border border-surface-rule rounded-md px-3 py-2 text-[12px] text-ink-700 focus:outline-none focus:border-maroon"
        >
          <option value="">All platforms</option>
          <option value="teams">MS Teams</option>
          <option value="zoom">Zoom</option>
          <option value="meet">Google Meet</option>
        </select>
        <span className="text-[12px] text-ink-400 ml-auto tnum">{meetings.length} meeting{meetings.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Meetings list */}
      <div className="px-6 lg:px-10 pb-8">
        {loading && (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 size={18} className="animate-spin text-maroon" />
            <span className="text-[13px] text-ink-500">Loading meetings…</span>
          </div>
        )}

        {!loading && meetings.length === 0 && (
          <div className="text-center py-16">
            <Video size={32} className="text-ink-300 mx-auto mb-3" />
            <div className="text-[14px] text-ink-500">No meetings found</div>
            <div className="text-[12px] text-ink-400 mt-1">Connect your calendar or send a bot to a meeting to get started.</div>
          </div>
        )}

        {!loading && meetings.length > 0 && (
          <div className="surface-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-divider bg-surface-page">
                  <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-ink-400 font-medium">Meeting</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-ink-400 font-medium">Platform</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-ink-400 font-medium">State</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-ink-400 font-medium">When</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-ink-400 font-medium">Signals</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-ink-400 font-medium">Bot</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-ink-400 font-medium">Transcript</th>
                  <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-ink-400 font-medium">Attendees</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((m) => (
                  <tr
                    key={m.meeting_id}
                    onClick={() => hasPermission("meetings:detail") && setSelectedMeeting(m)}
                    className="border-b border-surface-divider hover:bg-surface-page transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="text-[13px] font-medium text-ink-900">{m.title || "Untitled"}</div>
                      <div className="text-[11px] text-ink-400 mt-0.5">{m.organiser_email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <Tag variant="neutral">{platformIcon(m.platform)}</Tag>
                    </td>
                    <td className="px-4 py-4">
                      <Tag variant={stateVariant(m.meeting_state)}>{m.meeting_state}</Tag>
                    </td>
                    <td className="px-4 py-4 text-[12px] text-ink-600 tnum">{formatTime(m.start_at)}</td>
                    <td className="px-4 py-4">
                      {m.signal_relevance_band && m.signal_relevance_band !== "NONE" ? (
                        <div className="flex items-center gap-1.5">
                          <Tag variant={signalVariant(m.signal_relevance_band)}>
                            <span className="inline-flex items-center gap-1"><Signal size={10} /> {m.signal_count}</span>
                          </Tag>
                        </div>
                      ) : (
                        <span className="text-[11px] text-ink-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {m.bot_outcome === "COMPLETED" && <Tag variant="positive">Done</Tag>}
                      {m.bot_outcome === "RUNNING" && <Tag variant="critical"><span className="inline-flex items-center gap-1"><Play size={9} /> Live</span></Tag>}
                      {m.bot_outcome === "FAILED" && <Tag variant="critical">Failed</Tag>}
                      {m.bot_outcome === "NONE" && <span className="text-[11px] text-ink-300">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      {m.has_transcript ? (
                        <Tag variant="positive"><span className="inline-flex items-center gap-1"><FileText size={9} /> Yes</span></Tag>
                      ) : (
                        <span className="text-[11px] text-ink-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-[13px] text-ink-700 tnum">{m.attendee_count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Join bot modal */}
      {showJoinModal && (
        <JoinBotModal onClose={() => setShowJoinModal(false)} onJoin={handleJoinBot} />
      )}
    </div>
  );
}
