import React, { useEffect, useRef, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Tag } from "../components/ui";
import { VOICE_CALLS } from "../lib/mockData";
import { Mic, Square, ListChecks, Smile, Meh, Frown, Wand2 } from "lucide-react";
import { openAdvisor } from "../components/Advisor";

const sentimentVariant = (s) => s === "positive" ? "positive" : s === "negative" ? "critical" : "neutral";
const sentIcon = (s) => s === "positive" ? <Smile size={14} /> : s === "negative" ? <Frown size={14} /> : <Meh size={14} />;

const SCRIPTED_TRANSCRIPT = [
  { who: "Customer", text: "Hi Priya, just wanted to discuss the FD options you mentioned." },
  { who: "RM", text: "Of course, Mr. Mehta. We have an 18-month at 7.35% and 24-month at 7.55%, both quarterly payout." },
  { who: "Customer", text: "What about premature withdrawal — what's the penalty?" },
  { who: "RM", text: "0.50% across both, but I can structure the larger block in two parts to give you flexibility." },
  { who: "Customer", text: "I like that. Can you send me a term sheet today?" },
  { who: "RM", text: "Yes, you'll have it before market close." },
];

export default function Voice() {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [transcriptIdx, setTranscriptIdx] = useState(0);
  const [active, setActive] = useState(VOICE_CALLS[0]);
  const intervalRef = useRef(null);
  const transcriptRef = useRef(null);

  useEffect(() => {
    if (recording) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
        setTranscriptIdx((i) => Math.min(SCRIPTED_TRANSCRIPT.length, i + 1));
      }, 1400);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [recording]);

  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [transcriptIdx]);

  const start = () => { setElapsed(0); setTranscriptIdx(0); setRecording(true); };
  const stop  = () => { setRecording(false); };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div data-testid="page-voice">
      <PageHeader
        eyebrow="Voice Intelligence · Live"
        title="Every call, transcribed and understood."
        lede="Real-time transcription, sentiment and action-item detection across desk phone, mobile and meeting platforms."
        action={<button className={`btn-primary inline-flex items-center gap-2 ${recording ? "opacity-60" : ""}`} disabled={recording} onClick={start}><Mic size={14} /> {recording ? "Recording…" : "Record live call"}</button>}
      />

      {/* Live recorder */}
      <div className="px-6 lg:px-10 pt-7" data-testid="live-recorder">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-5 surface-card p-7 flex flex-col items-center text-center">
            <div className="cap-label">Live · Recorder</div>
            <button
              onClick={recording ? stop : start}
              className={`rec-button mt-5 ${recording ? "live" : ""}`}
              data-testid="rec-button"
              aria-label={recording ? "Stop recording" : "Start recording"}
            >
              {recording ? <Square size={26} fill="#fff" /> : <Mic size={28} strokeWidth={1.5} />}
            </button>
            <div className="mt-5 metric-hero text-ink-900 tnum">{fmt(elapsed)}</div>
            <div className="alert-meta mt-1">{recording ? "Capturing audio · transcribing" : "Press to start"}</div>

            {/* Waveform */}
            <div className="mt-6 flex items-end justify-center gap-[3px] h-10">
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="wf-bar"
                  style={{
                    animationDelay: `${(i % 8) * 80}ms`,
                    animationPlayState: recording ? "running" : "paused",
                    opacity: recording ? 1 : 0.25,
                  }}
                />
              ))}
            </div>
          </section>

          <section className="lg:col-span-7 surface-card overflow-hidden flex flex-col">
            <div className="px-5 py-3 border-b border-surface-divider flex items-center justify-between">
              <div className="cap-label">Live transcript · Anand Mehta</div>
              <div className="flex items-center gap-2">
                <Tag variant="positive"><span className="inline-flex items-center gap-1"><Smile size={12} /> positive</span></Tag>
                <span className="alert-meta">3 action items detected</span>
              </div>
            </div>
            <div ref={transcriptRef} className="px-5 py-4 flex-1 overflow-y-auto space-y-3" style={{ maxHeight: 300 }}>
              {transcriptIdx === 0 && !recording && (
                <div className="text-[13px] text-ink-500">Press the record button to begin a live transcript.</div>
              )}
              {SCRIPTED_TRANSCRIPT.slice(0, transcriptIdx).map((t, i) => (
                <div key={i} className={`text-[13px] leading-[1.55] ${t.who === "RM" ? "text-ink-900" : "text-ink-700"}`}>
                  <span className={`cap-label mr-3 ${t.who === "RM" ? "text-maroon" : ""}`}>{t.who}</span>
                  {t.text}
                </div>
              ))}
            </div>

            {/* Auto summary */}
            <div className="px-5 py-4 border-t border-surface-divider bg-surface-page">
              <div className="cap-label mb-2 flex items-center gap-2"><ListChecks size={11} /> Auto-summary</div>
              <ul className="text-[12.5px] text-ink-900 space-y-1 leading-relaxed">
                <li>· Client wants 24-month FD with quarterly payout</li>
                <li>· Premature withdrawal flexibility requested</li>
                <li>· Term sheet to be sent before market close</li>
              </ul>
            </div>
          </section>
        </div>
      </div>

      {/* Recent calls */}
      <div className="px-6 lg:px-10 py-9" data-testid="recent-calls">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-px bg-maroon inline-block" />
          <h3 className="section-h">Recent calls</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 surface-card overflow-hidden">
            <table className="h-table w-full">
              <thead>
                <tr><th>Customer</th><th>Duration</th><th>Sentiment</th><th>When</th></tr>
              </thead>
              <tbody>
                {VOICE_CALLS.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setActive(c)}
                    className="cursor-pointer"
                    data-testid={`call-${c.id}`}
                  >
                    <td className="text-ink-900">{c.customer}</td>
                    <td className="tnum">{c.duration}</td>
                    <td>
                      <Tag variant={sentimentVariant(c.sentiment)}>
                        <span className="inline-flex items-center gap-1">{sentIcon(c.sentiment)} {c.sentiment}</span>
                      </Tag>
                    </td>
                    <td className="text-ink-500 text-[12px]">{c.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-7 surface-card p-7">
            <div className="cap-label">{active.id} · {active.time}</div>
            <div className="serif text-[26px] text-ink-900 leading-tight mt-2">{active.customer}</div>
            <div className="flex items-center gap-2 mt-3">
              <Tag variant={sentimentVariant(active.sentiment)}>
                <span className="inline-flex items-center gap-1">{sentIcon(active.sentiment)} {active.sentiment}</span>
              </Tag>
              <span className="text-[12px] text-ink-500 tnum">duration {active.duration}</span>
              <span className="text-[12px] text-ink-500">· {active.actions} action item{active.actions > 1 ? "s" : ""}</span>
            </div>

            <div className="cap-label mt-7 mb-2 flex items-center gap-2"><ListChecks size={11} /> Summary</div>
            <ul className="text-[13px] text-ink-900 space-y-1.5 leading-relaxed">
              {active.summary.map((s, i) => <li key={i}>· {s}</li>)}
            </ul>
            <div className="mt-6 flex gap-3">
              <button
                className="btn-primary inline-flex items-center gap-1.5"
                onClick={() => openAdvisor(
                  active.customer,
                  `Draft a follow-up email for my call with ${active.customer}. Key points: ${active.summary.join("; ")}`
                )}
              >
                <Wand2 size={13} /> Draft follow-up with AI
              </button>
              <button className="btn-ghost">Open transcript</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
