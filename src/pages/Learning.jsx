import React from "react";
import PageHeader from "../components/PageHeader";
import { Tag } from "../components/ui";
import { LD_TRACKS, LD_ASSESSMENTS } from "../lib/mockData";
import { ClipboardCheck, Lock, CheckCircle2, Clock } from "lucide-react";

const statusConfig = {
  ready:     { label: "Ready to take", variant: "warning", icon: <Clock size={13} /> },
  completed: { label: "Completed",     variant: "positive", icon: <CheckCircle2 size={13} /> },
  locked:    { label: "Locked",        variant: "neutral", icon: <Lock size={13} /> },
};

export default function Learning() {
  return (
    <div data-testid="page-learning">
      <PageHeader
        eyebrow="Learning & Development"
        title="A curriculum that knows your gaps."
        lede="Personalised tracks shaped by your role, performance signals and the regulations that affect your book."
      />

      {/* Learning Tracks */}
      <div className="px-6 lg:px-10 py-9 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {LD_TRACKS.map((t, i) => (
          <div key={i} className="surface-card p-6 lift-card">
            <div className="cap-label">Track</div>
            <div className="serif text-[22px] text-ink-900 mt-2 leading-tight">{t.name}</div>
            <div className="mt-5 h-1 w-full bg-surface-muted rounded-full overflow-hidden">
              <div className="h-full bg-maroon rounded-full" style={{ width: `${t.progress}%` }} />
            </div>
            <div className="flex items-center justify-between mt-3 text-[12px] text-ink-500">
              <span>{t.hours}</span>
              <span className="tnum">{t.progress}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Assessments */}
      <div className="px-6 lg:px-10 pb-9">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-6 h-px bg-maroon inline-block" />
          <h3 className="section-h">Assessments</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {LD_ASSESSMENTS.map((a) => {
            const cfg = statusConfig[a.status];
            return (
              <div key={a.id} className={`surface-card p-6 lift-card ${a.status === "locked" ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 grid place-items-center rounded-md" style={{ background: "rgba(156,29,38,0.08)", color: "#9C1D26" }}>
                      <ClipboardCheck size={16} strokeWidth={1.5} />
                    </div>
                    <div className="cap-label">{a.track}</div>
                  </div>
                  <Tag variant={cfg.variant}>
                    <span className="inline-flex items-center gap-1">{cfg.icon} {cfg.label}</span>
                  </Tag>
                </div>

                <div className="serif text-[18px] text-ink-900 mt-4 leading-tight">{a.title}</div>

                <div className="flex items-center gap-4 mt-4 text-[12px] text-ink-500">
                  <span>{a.questions} questions</span>
                  <span>·</span>
                  <span>{a.duration}</span>
                  <span>·</span>
                  <span>Due {a.dueDate}</span>
                </div>

                {a.status === "completed" && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-1.5 flex-1 bg-surface-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${a.score}%` }} />
                    </div>
                    <span className="text-[13px] font-medium text-ink-900 tnum">{a.score}%</span>
                  </div>
                )}

                {a.status === "ready" && (
                  <button className="btn-primary mt-5 inline-flex items-center gap-1.5">
                    <ClipboardCheck size={13} /> Start Assessment
                  </button>
                )}

                {a.status === "locked" && (
                  <div className="mt-4 text-[12px] text-ink-400 flex items-center gap-1.5">
                    <Lock size={12} /> Complete the track to unlock
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
