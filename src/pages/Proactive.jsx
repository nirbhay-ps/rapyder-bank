import React from "react";
import PageHeader from "../components/PageHeader";
import { ALERTS } from "../lib/mockData";
import { Sparkles, Wand2 } from "lucide-react";
import { openAdvisor } from "../components/Advisor";

const FORECASTS = [
  { window: "Next 24h", text: "Workload manageable. Two HNI follow-ups suggested at 10:00 and 15:30." },
  { window: "Next 7d",  text: "Three SLAs at risk on the corporate book. Proactive nudges queued." },
  { window: "Next 30d", text: "5 birthday/anniversary touches. 12 portfolio reviews due. Festival cohort: Diwali (28)." },
];

const barClass = (lvl) =>
  lvl === "red" ? "bar-critical" : lvl === "yellow" ? "bar-warning" : "bar-positive";

export default function Proactive() {
  return (
    <div data-testid="page-proactive">
      <PageHeader
        eyebrow="Proactive Intelligence"
        title="Anticipates before it asks."
        lede="Lifecycle events, festivals, sentiment shifts and workload spikes — surfaced before they cost you a relationship or a slipped SLA."
      />
      <div className="px-6 lg:px-10 py-9 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7 surface-card overflow-hidden">
          {ALERTS.map((a, i) => (
            <div key={i} className="alert-row" style={{ padding: "16px 20px" }}>
              <span className={`alert-bar ${barClass(a.level)}`} />
              <div className="flex-1">
                <div className="alert-meta">{a.type}</div>
                <div className="text-[14px] text-ink-900 mt-1 leading-[1.55]">{a.text}</div>
                <div className="alert-meta mt-1">{a.time}</div>
              </div>
              <button
                className="btn-resolve self-start inline-flex items-center gap-1.5"
                onClick={() => openAdvisor(
                  a.type,
                  `Draft a response for: ${a.text}`
                )}
              >
                <Wand2 size={13} /> Draft with AI
              </button>
            </div>
          ))}
        </section>

        <aside className="lg:col-span-5 space-y-5">
          {FORECASTS.map((f, i) => (
            <div key={i} className="surface-card p-6 lift-card">
              <div className="cap-label flex items-center gap-2"><Sparkles size={11} /> {f.window}</div>
              <p className="text-[14px] text-ink-900 mt-3 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
