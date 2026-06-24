import React from "react";
import PageHeader from "../components/PageHeader";
import { Stat } from "../components/ui";
import { PREDICTIONS } from "../lib/mockData";

export default function Analytics() {
  return (
    <div data-testid="page-analytics">
      <PageHeader
        eyebrow="Predictive Analytics"
        title="Where the book is heading."
        lede="Forward-looking projections on revenue, churn, workload and risk — refreshed nightly, governed by Bedrock guardrails."
      />
      <div className="px-6 lg:px-10 py-9">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PREDICTIONS.map((p, i) => (
            <div key={i} className="surface-card p-5 lift-card">
              <Stat label={p.metric} value={p.value} sub={`Δ ${p.delta} vs prior period`} sage={!p.delta.startsWith("-") || p.delta.includes("pp")} />
            </div>
          ))}
        </div>

        <section className="mt-8 surface-card p-7">
          <div className="cap-label">30-day cross-sell forecast</div>
          <h3 className="serif text-[28px] mt-2 text-ink-900 leading-tight">₹ 4.20 Cr expected · ₹ 3.55 Cr conservative</h3>
          <div className="mt-6 h-44 relative">
            <svg viewBox="0 0 600 160" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9C1D26" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#9C1D26" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,120 C60,100 100,90 160,80 S260,60 320,55 S440,40 600,30 L600,160 L0,160 Z" fill="url(#g)" />
              <path d="M0,120 C60,100 100,90 160,80 S260,60 320,55 S440,40 600,30" fill="none" stroke="#9C1D26" strokeWidth="1.5" />
              <line x1="0" y1="159" x2="600" y2="159" stroke="#EDE8E3" />
            </svg>
          </div>
          <div className="grid grid-cols-3 mt-2 alert-meta">
            <span>Day 1</span><span className="text-center">Day 15</span><span className="text-right">Day 30</span>
          </div>
        </section>
      </div>
    </div>
  );
}
