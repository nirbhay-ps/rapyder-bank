import React from "react";
import PageHeader from "../components/PageHeader";
import { Tag } from "../components/ui";
import { AUTONOMOUS_FEED } from "../lib/mockData";

const barClass = (t) => t === "green" ? "bar-positive" : t === "yellow" ? "bar-warning" : "bar-critical";

export default function Autonomous() {
  return (
    <div data-testid="page-autonomous">
      <PageHeader
        eyebrow="Autonomous Action Engine"
        title="Three tiers. One audit trail."
        lede="GREEN executes by itself. YELLOW pauses 60 seconds for your override. RED stays manual with immutable audit. Thresholds are configurable per action."
      />
      <div className="px-6 lg:px-10 py-9 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-3 grid grid-cols-1 gap-3">
          <div className="surface-card p-5 lift-card border-l-[3px] border-l-sage">
            <div className="cap-label">GREEN · Auto</div>
            <div className="metric-hero text-ink-900 mt-2">142</div>
            <div className="text-[11px] text-sage mt-2">Today · 0 reversals</div>
          </div>
          <div className="surface-card p-5 lift-card border-l-[3px] border-l-amber">
            <div className="cap-label">YELLOW · 60s</div>
            <div className="metric-hero text-ink-900 mt-2">4</div>
            <div className="text-[11px] text-ink-500 mt-2">Awaiting override window</div>
          </div>
          <div className="surface-card p-5 lift-card border-l-[3px] border-l-crit">
            <div className="cap-label">RED · Manual</div>
            <div className="metric-hero text-ink-900 mt-2">1</div>
            <div className="text-[11px] text-ink-500 mt-2">Audit logged</div>
          </div>
        </section>
        <section className="lg:col-span-9 surface-card overflow-hidden">
          {AUTONOMOUS_FEED.map((f, i) => (
            <div key={i} className="alert-row" style={{ padding: "16px 20px" }}>
              <span className={`alert-bar ${barClass(f.tier)}`} />
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] text-ink-900 leading-[1.5]">{f.text}</div>
                <div className="alert-meta mt-1">
                  {f.tier === "green" ? "GREEN · auto" : f.tier === "yellow" ? "YELLOW · 60s" : "RED · audit"} · {f.time}
                </div>
              </div>
              <button className="btn-resolve self-start">View</button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
