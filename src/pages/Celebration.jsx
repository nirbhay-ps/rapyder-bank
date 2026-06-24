import React, { useState, useRef, useCallback, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { CELEBRATIONS, getCelebrations } from "../lib/mockData";
import { useAuth } from "../context/AuthContext";
import {
  PartyPopper,
  Video,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  RotateCcw,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { videoGenerationService } from "../services/api";

// ─── Supported Triggers (auto-expanded into cinematic prompts by the API) ────
const TRIGGER_OPTIONS = [
  { label: "Deal Closed", value: "deal closed", icon: "🤝" },
  { label: "Birthday", value: "birthday", icon: "🎂" },
  { label: "Work Anniversary", value: "work anniversary", icon: "🎉" },
  { label: "Promotion", value: "promotion", icon: "🚀" },
  { label: "Product Launch", value: "product launch", icon: "🎯" },
  { label: "Team Win", value: "team win", icon: "🏆" },
  { label: "Target Hit", value: "target hit", icon: "📈" },
];

// ─── Status Helpers ──────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  idle: { color: "text-ink-500", icon: Video, label: "Ready" },
  uploading: { color: "text-amber-600", icon: Loader2, label: "Submitting..." },
  processing: { color: "text-blue-600", icon: Loader2, label: "Generating video..." },
  completed: { color: "text-emerald-600", icon: CheckCircle2, label: "Video ready!" },
  failed: { color: "text-red-600", icon: AlertCircle, label: "Generation failed" },
};

export default function Celebration() {
  const { user } = useAuth();
  const celebrations = getCelebrations(user);
  // ─── Tab State ───────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("sent");

  // ─── Form State ──────────────────────────────────────────────────────────
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [prompt, setPrompt] = useState("deal closed");
  const [overlayText, setOverlayText] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState(0);
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);

  // ─── Job State ───────────────────────────────────────────────────────────
  const [status, setStatus] = useState("idle"); // idle | uploading | processing | completed | failed
  const [jobId, setJobId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [pollCount, setPollCount] = useState(0);

  const fileInputRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // ─── Cleanup polling on unmount ──────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // ─── File Handling ───────────────────────────────────────────────────────
  const handleLogoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Trigger Selection ─────────────────────────────────────────────────
  const handleTriggerSelect = (idx) => {
    setSelectedTrigger(idx);
    setPrompt(TRIGGER_OPTIONS[idx].value);
    setUseCustomPrompt(false);
  };

  // ─── Poll for Status ─────────────────────────────────────────────────────
  const startPolling = useCallback((id) => {
    setPollCount(0);
    pollIntervalRef.current = setInterval(async () => {
      try {
        const { data } = await videoGenerationService.getStatus(id);
        setPollCount((c) => c + 1);

        if (data.status === "completed" || data.video_url || data.output_url) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          setStatus("completed");
          setVideoUrl(data.video_url || data.output_url || data.url);
        } else if (data.status === "failed" || data.error) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          setStatus("failed");
          setErrorMsg(data.error || "Video generation failed. Please try again.");
        }
        // else still processing — keep polling
      } catch (err) {
        // Don't stop polling on transient errors, but cap at 60 attempts (~5 min)
        setPollCount((c) => {
          if (c >= 60) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
            setStatus("failed");
            setErrorMsg("Timed out waiting for video. Please check back later.");
          }
          return c + 1;
        });
      }
    }, 5000); // Poll every 5 seconds
  }, []);

  // ─── Submit ──────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStatus("uploading");
    setErrorMsg("");
    setVideoUrl(null);
    setJobId(null);

    try {
      const { data } = await videoGenerationService.generate({
        logo,
        prompt: prompt.trim(),
        overlay_text: overlayText.trim(),
      });

      const id = data.job_id || data.jobId || data.id;
      if (id) {
        setJobId(id);
        setStatus("processing");
        startPolling(id);
      } else if (data.video_url || data.output_url) {
        // Immediate response (unlikely but handle it)
        setStatus("completed");
        setVideoUrl(data.video_url || data.output_url);
      } else {
        setStatus("failed");
        setErrorMsg("Unexpected response from server.");
      }
    } catch (err) {
      setStatus("failed");
      setErrorMsg(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to submit video generation request."
      );
    }
  };

  // ─── Reset ───────────────────────────────────────────────────────────────
  const handleReset = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setStatus("idle");
    setJobId(null);
    setVideoUrl(null);
    setErrorMsg("");
    setPollCount(0);
  };

  const StatusIcon = STATUS_CONFIG[status].icon;
  const isGenerating = status === "uploading" || status === "processing";

  return (
    <div data-testid="page-celebration">
      <PageHeader
        eyebrow="Celebration Engine"
        title="Recognition, delivered with cinematic flair."
        lede="Generate AI-powered celebration videos for milestones, deal closures, and team achievements — personalized with your brand and message."
      />

      {/* Tab Navigation */}
      <div className="px-6 lg:px-10 pt-6">
        <div className="flex gap-6 border-b border-surface-divider">
          <button
            onClick={() => setActiveTab("sent")}
            className={`px-1 pb-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === "sent"
                ? "border-maroon text-ink-900"
                : "border-transparent text-ink-400 hover:text-ink-600"
            }`}
          >
            Sent
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className={`px-1 pb-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === "received"
                ? "border-maroon text-ink-900"
                : "border-transparent text-ink-400 hover:text-ink-600"
            }`}
          >
            Received
          </button>
        </div>
      </div>

      {activeTab === "received" && (
        <div className="px-6 lg:px-10 py-9">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Work Anniversary", from: "HR Team", date: "8 May 2026", url: "https://demo.rapyder.com/work.mp4" },
              { title: "Happy Birthday!", from: "Team Lead", date: "22 Apr 2026", url: "https://demo.rapyder.com/Birthday.mp4" },
              { title: "Deal Closed", from: "Sales Head", date: "10 Apr 2026", url: "https://demo.rapyder.com/Deal.mp4" },
            ].map((v, i) => (
              <div key={i} className="surface-card overflow-hidden lift-card">
                <div className="aspect-video bg-black relative">
                  <video
                    src={v.url}
                    controls
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <PartyPopper size={14} className="text-maroon" />
                    <span className="cap-label">{v.title}</span>
                  </div>
                  <div className="text-[13px] text-ink-700 mt-1">From: <span className="font-medium text-ink-900">{v.from}</span></div>
                  <div className="text-[12px] text-ink-400 mt-1">{v.date}</div>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost inline-flex items-center gap-1.5 mt-4 text-[12px]"
                  >
                    <Download size={13} /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "sent" && (
      <div className="px-6 lg:px-10 py-9 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ─── Left: Video Generator Form ─────────────────────────────────── */}
        <section className="lg:col-span-7 space-y-6">
          {/* Status Banner */}
          {status !== "idle" && (
            <div
              className={`surface-card px-5 py-4 flex items-center gap-3 ${
                status === "completed"
                  ? "border-l-4 border-emerald-500"
                  : status === "failed"
                  ? "border-l-4 border-red-500"
                  : "border-l-4 border-blue-500"
              }`}
            >
              <StatusIcon
                size={20}
                className={`${STATUS_CONFIG[status].color} ${isGenerating ? "animate-spin" : ""}`}
              />
              <div className="flex-1">
                <span className={`text-sm font-medium ${STATUS_CONFIG[status].color}`}>
                  {STATUS_CONFIG[status].label}
                </span>
                {status === "processing" && (
                  <span className="text-xs text-ink-500 ml-2">
                    (polling {pollCount}× — this may take a few minutes)
                  </span>
                )}
                {jobId && (
                  <div className="text-xs text-ink-400 mt-0.5 font-mono">Job: {jobId}</div>
                )}
                {errorMsg && <div className="text-xs text-red-600 mt-1">{errorMsg}</div>}
              </div>
              {(status === "completed" || status === "failed") && (
                <button onClick={handleReset} className="btn-ghost flex items-center gap-1.5 text-xs">
                  <RotateCcw size={14} /> New Video
                </button>
              )}
            </div>
          )}

          {/* Video Result */}
          {status === "completed" && videoUrl && (
            <div className="surface-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="serif text-lg text-ink-900">Your Celebration Video</h3>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-1.5 text-xs"
                >
                  <Download size={14} /> Download
                </a>
              </div>
              <video
                src={videoUrl}
                controls
                className="w-full rounded-lg bg-black aspect-video"
                poster=""
              />
            </div>
          )}

          {/* Form Card */}
          <div className="surface-card p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-maroon" />
              <h3 className="serif text-lg text-ink-900">Generate Celebration Video</h3>
            </div>

            {/* Trigger Selector */}
            <div>
              <label className="cap-label mb-2 block">Celebration Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {TRIGGER_OPTIONS.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTriggerSelect(idx)}
                    disabled={isGenerating}
                    className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left flex items-center gap-2 ${
                      !useCustomPrompt && selectedTrigger === idx
                        ? "bg-maroon text-white ring-2 ring-maroon/30"
                        : "bg-surface-subtle text-ink-700 hover:bg-surface-hover border border-surface-divider"
                    }`}
                  >
                    <span className="text-base">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt Toggle */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomPrompt}
                  onChange={(e) => {
                    setUseCustomPrompt(e.target.checked);
                    if (!e.target.checked) {
                      setPrompt(TRIGGER_OPTIONS[selectedTrigger].value);
                    }
                  }}
                  disabled={isGenerating}
                  className="rounded border-surface-divider text-maroon focus:ring-maroon"
                />
                <span className="text-sm text-ink-700">Use custom prompt instead</span>
              </label>
              {useCustomPrompt && (
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-surface-divider bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon resize-y disabled:opacity-50"
                  placeholder="Write a custom prompt (short triggers like 'deal closed' are auto-expanded, or pass full text)..."
                />
              )}
              {!useCustomPrompt && (
                <div className="mt-2 text-xs text-ink-500 bg-surface-subtle rounded-lg px-3 py-2">
                  Using trigger: <span className="font-medium text-ink-700">"{prompt}"</span> — the API auto-expands this into a rich cinematic prompt
                </div>
              )}
            </div>

            {/* Overlay Text */}
            <div>
              <label className="cap-label mb-2 block">Overlay Text <span className="text-ink-400 font-normal">(message on the video)</span></label>
              <textarea
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
                disabled={isGenerating}
                rows={2}
                className="w-full rounded-lg border border-surface-divider bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon resize-y disabled:opacity-50"
                placeholder='e.g. "₹25 Cr Deal Closed!\nWell done, Arjun"'
              />
              <div className="text-xs text-ink-400 mt-1">
                Use \n for line breaks in the overlay
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="cap-label mb-2 block">Brand Logo <span className="text-ink-400 font-normal">(optional)</span></label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-16 h-16 object-contain rounded-lg border border-surface-divider bg-white p-1"
                    />
                    <button
                      onClick={clearLogo}
                      disabled={isGenerating}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isGenerating}
                    className="w-16 h-16 rounded-lg border-2 border-dashed border-surface-divider flex flex-col items-center justify-center text-ink-400 hover:border-maroon hover:text-maroon transition-colors disabled:opacity-50"
                  >
                    <ImageIcon size={20} />
                    <span className="text-[10px] mt-0.5">Upload</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoSelect}
                  className="hidden"
                />
                <div className="text-xs text-ink-500">
                  PNG or JPG — overlaid on the generated video
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {status === "uploading" ? "Submitting..." : "Generating..."}
                </>
              ) : (
                <>
                  <Video size={16} />
                  Generate Celebration Video
                </>
              )}
            </button>
          </div>
        </section>

        {/* ─── Right: Recent Celebrations + Quick Generate ────────────────── */}
        <aside className="lg:col-span-5 space-y-6">
          {/* Quick Celebration Cards */}
          <div className="surface-card overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-divider">
              <h3 className="cap-label">Recent Milestones</h3>
            </div>
            {celebrations.map((c, i) => (
              <div
                key={i}
                className={`flex gap-4 px-6 py-5 ${i > 0 ? "border-t border-surface-divider" : ""}`}
              >
                <div
                  className="w-10 h-10 grid place-items-center rounded-full shrink-0"
                  style={{ background: "rgba(156,29,38,0.08)", color: "#9C1D26" }}
                >
                  <PartyPopper size={18} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="serif text-[17px] text-ink-900 leading-tight">{c.name}</div>
                  <div className="text-[13px] text-ink-700 mt-1">{c.reason}</div>
                  <div className="alert-meta mt-2">{c.when}</div>
                </div>
                <button
                  className="btn-ghost self-start text-xs shrink-0"
                  onClick={() => {
                    setOverlayText(`${c.reason}\nCongratulations, ${c.name}!`);
                    setSelectedTrigger(0);
                    setPrompt("deal closed");
                    setUseCustomPrompt(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Video size={14} className="mr-1 inline" />
                  Create Video
                </button>
              </div>
            ))}
          </div>

          {/* AI Note Preview */}
          <div className="surface-card p-7" style={{ background: "#F2EEE9" }}>
            <div className="cap-label">How it works</div>
            <div className="mt-4 space-y-3">
              <Step num={1} text="Pick a celebration type (deal closed, birthday, etc.)" />
              <Step num={2} text="Add overlay text with the achievement message" />
              <Step num={3} text="Optionally upload your brand logo" />
              <Step num={4} text="Generate — AI expands the trigger into a cinematic video" />
              <Step num={5} text="Download and share with the team or client" />
            </div>
            <div className="mt-5 p-4 rounded-lg bg-white/60">
              <div className="text-xs text-ink-500 font-medium mb-1">Typical generation time</div>
              <div className="serif text-lg text-ink-900">2 – 5 minutes</div>
              <div className="text-xs text-ink-500 mt-1">
                Video is generated using AI and rendered in cinematic 4K quality
              </div>
            </div>
          </div>
        </aside>
      </div>
      )}
    </div>
  );
}

// ─── Step Component ──────────────────────────────────────────────────────────
function Step({ num, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-maroon text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        {num}
      </div>
      <span className="text-sm text-ink-700">{text}</span>
    </div>
  );
}
