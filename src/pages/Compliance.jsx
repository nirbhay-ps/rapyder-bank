import React from "react";
import PageHeader from "../components/PageHeader";
import { Tag, Stat } from "../components/ui";
import { COMPLIANCE_ITEMS } from "../lib/mockData";

const tierVariant = (t) => t === "green" ? "positive" : t === "yellow" ? "warning" : "critical";

export default function Compliance() {
  return (
    <div data-testid="page-compliance">
      <PageHeader
        eyebrow="Compliance Assistant"
        title="A flawless adherence record, by design."
        lede="Real-time RBI / FATCA / AML checks, watchlist sweeps and filings — all measured on a single compliance meter."
      />
      <div className="px-6 lg:px-10 py-9 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-4 surface-card p-7 self-start">
          <div className="cap-label">Compliance score</div>
          <div className="metric-hero text-ink-900 mt-2" style={{ fontSize: "64px" }}>100<span className="text-[28px] text-ink-500">%</span></div>
          <div className="text-[12px] text-ink-500 mt-2 leading-relaxed">A+ · 30-day rolling adherence · 0 breaches lifetime in current tier</div>
          <div className="mt-5 h-1 w-full bg-surface-muted rounded-full overflow-hidden">
            <div className="h-full bg-maroon rounded-full" style={{ width: "100%" }} />
          </div>
          <div className="grid grid-cols-2 mt-7 gap-x-6 gap-y-5">
            <Stat label="Filings done" value="42" sage />
            <Stat label="Pending" value="2" sub="non-blocking" />
            <Stat label="Sanctions hits" value="0" sage />
            <Stat label="Audit findings" value="0" sage />
          </div>
        </section>

        <section className="lg:col-span-8 surface-card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-divider cap-label">Filings & checks</div>
          <table className="h-table w-full">
            <thead><tr><th>Reference</th><th>Title</th><th>Due</th><th>Status</th></tr></thead>
            <tbody>
              {COMPLIANCE_ITEMS.map((c) => (
                <tr key={c.id}>
                  <td className="font-mono text-[12px] text-ink-500">{c.id}</td>
                  <td>{c.title}</td>
                  <td className="tnum">{c.due}</td>
                  <td><Tag variant={tierVariant(c.tier)}>{c.status}</Tag></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
