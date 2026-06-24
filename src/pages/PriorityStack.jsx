import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { ScoreBadge, Tag, Stat } from "../components/ui";
import { PRIORITY_TASKS } from "../lib/mockData";
import { ArrowRight, Filter, Wand2, Send, X } from "lucide-react";
import { openAdvisor } from "../components/Advisor";

const tierVariant = (t) => (t === "green" ? "positive" : t === "yellow" ? "warning" : "critical");

export default function PriorityStack() {
  const [expandedId, setExpandedId] = useState(null);
  const [draftText, setDraftText] = useState("");

  const handleDraftWithAI = (task) => {
    if (expandedId === task.id) {
      setExpandedId(null);
      setDraftText("");
    } else {
      setExpandedId(task.id);
      setDraftText(
        `Task: ${task.title}\n` +
        `Task ID: ${task.id}\n` +
        `Priority Score: ${task.score}/100\n` +
        `Tier: ${task.tier === "green" ? "Auto-resolve" : task.tier === "yellow" ? "60s approval window" : "Manual review required"}\n` +
        `${task.managersPick ? "⭐ Manager's Pick\n" : ""}` +
        `\n── Customer Details ──\n` +
        `Customer: ${task.customer}\n` +
        `AUM: ${task.aum}\n` +
        `SLA Remaining: ${task.sla}\n` +
        `\n── Context & Rationale ──\n` +
        `${task.rationale}\n` +
        `\n── Request ──\n` +
        `Please draft a professional response or action plan for this priority task. Consider the SLA urgency, customer value, and the specific context above.`
      );
    }
  };

  const handleSendToAdvisor = (task) => {
    openAdvisor(task.customer, draftText);
    setExpandedId(null);
    setDraftText("");
  };

  return (
    <div data-testid="page-priority">
      <PageHeader
        eyebrow="Smart Prioritisation"
        title="Today's queue, scored and reasoned."
        lede="An AI-ranked stack of every task across emails, calls, compliance and cross-sell. Each score carries a transparent rationale; your manager can pin one as a Pick."
        action={
          <div className="flex justify-end gap-3">
            <button className="btn-ghost inline-flex items-center gap-2"><Filter size={14} /> Filter</button>
            <button className="btn-primary">Resolve next</button>
          </div>
        }
      />
      <div className="px-6 lg:px-10 py-9 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-9 space-y-3">
          {PRIORITY_TASKS.map((t) => (
            <article key={t.id} className={`priority-card flex flex-col gap-0 transition-all ${expandedId === t.id ? "ring-1 ring-maroon/20" : ""}`}>
              <div className="flex gap-4 items-start">
                <ScoreBadge score={t.score} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[15px] font-medium text-ink-900">{t.title}</h3>
                    {t.managersPick && <Tag variant="brand">Manager's Pick</Tag>}
                    <Tag variant={tierVariant(t.tier)}>
                      {t.tier === "green" ? "Auto" : t.tier === "yellow" ? "60s window" : "Manual"}
                    </Tag>
                  </div>
                  <p className="text-[13px] text-ink-500 mt-2 leading-[1.6]">{t.rationale}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="cap-label">{t.customer}</span>
                    {t.aum !== "—" && <span className="text-[11px] tnum text-ink-500">{t.aum}</span>}
                    <span className="text-[11px] tnum text-ink-500">SLA · {t.sla}</span>
                    <span className="cap-label" style={{ color: "#A8A29E" }}>{t.id}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button className="btn-resolve inline-flex items-center gap-1.5">Open <ArrowRight size={12} /></button>
                  <button
                    className={`btn-resolve inline-flex items-center gap-1.5 ${expandedId === t.id ? "!bg-maroon !text-white" : ""}`}
                    onClick={() => handleDraftWithAI(t)}
                  >
                    <Wand2 size={13} /> Draft with AI
                  </button>
                  <button className="text-[11px] text-ink-500 hover:text-ink-900 transition-colors">Defer</button>
                </div>
              </div>

              {/* Expanded AI Draft Section */}
              {expandedId === t.id && (
                <div className="mt-4 pt-4 border-t border-surface-divider">
                  <div className="flex items-center justify-between mb-3">
                    <div className="cap-label flex items-center gap-2">
                      <Wand2 size={11} className="text-maroon" /> AI Draft — Ready to send
                    </div>
                    <button
                      onClick={() => { setExpandedId(null); setDraftText(""); }}
                      className="text-ink-400 hover:text-ink-700 transition-colors p-1"
                      aria-label="Close draft"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Prepopulated context summary */}
                  <div className="bg-surface-page rounded-lg p-4 mb-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <div className="text-[10px] text-ink-400 uppercase">Customer</div>
                      <div className="text-[13px] text-ink-900 font-medium mt-0.5">{t.customer}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-ink-400 uppercase">AUM</div>
                      <div className="text-[13px] text-ink-900 font-medium mt-0.5">{t.aum}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-ink-400 uppercase">SLA</div>
                      <div className="text-[13px] text-ink-900 font-medium mt-0.5">{t.sla}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-ink-400 uppercase">Priority</div>
                      <div className="text-[13px] text-ink-900 font-medium mt-0.5">{t.score}/100</div>
                    </div>
                  </div>

                  {/* Editable draft textarea */}
                  <textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    rows={4}
                    className="w-full bg-white border border-surface-rule rounded-md px-4 py-3 text-[13px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-maroon resize-y leading-relaxed"
                  />

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => handleSendToAdvisor(t)}
                      className="btn-primary inline-flex items-center gap-1.5"
                    >
                      <Send size={13} /> Send to AI Advisor
                    </button>
                    <button
                      onClick={() => { setExpandedId(null); setDraftText(""); }}
                      className="btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>

        <aside className="lg:col-span-3 space-y-5">
          <div className="surface-card p-5">
            <div className="cap-label mb-3">How priority is scored</div>
            <ul className="text-[12px] text-ink-900 space-y-2 leading-relaxed">
              <li className="flex justify-between"><span>SLA & urgency</span><span className="tnum text-ink-500">35%</span></li>
              <li className="flex justify-between"><span>Customer value</span><span className="tnum text-ink-500">25%</span></li>
              <li className="flex justify-between"><span>Compliance weight</span><span className="tnum text-ink-500">20%</span></li>
              <li className="flex justify-between"><span>Manager's Pick</span><span className="tnum text-ink-500">15%</span></li>
              <li className="flex justify-between"><span>Sentiment & risk</span><span className="tnum text-ink-500">5%</span></li>
            </ul>
          </div>
          <div className="surface-card p-5 space-y-5">
            <Stat label="Open priorities" value="14" sub="5 surfaced today" />
            <Stat label="Resolved this week" value="38" sub="+22% vs last" sage />
            <Stat label="Avg resolution" value="46m" sub="-18% vs target" sage />
          </div>
        </aside>
      </div>
    </div>
  );
}
