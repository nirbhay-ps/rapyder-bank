import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { Tag } from "../components/ui";
import { ECOSYSTEM, AVAILABLE_CONNECTORS } from "../lib/mockData";
import { Plug, Plus, Search } from "lucide-react";

export default function Settings() {
  const [q, setQ] = useState("");
  const filteredAvailable = AVAILABLE_CONNECTORS.filter(
    (c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.category.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div data-testid="page-settings">
      <PageHeader
        eyebrow="Settings · Connectors"
        title="The systems behind your single pane."
        lede="A hub-and-spoke fabric of connectors that keeps Outlook, Salesforce, Core Banking, CIBIL and others in lock-step. Add new sources here."
      />
      <div className="px-6 lg:px-10 py-9 space-y-12">
        {/* Currently connected */}
        <section data-testid="connectors-current">
          <div className="flex items-end justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="w-6 h-px bg-maroon inline-block" />
              <h2 className="section-h">Currently connected</h2>
            </div>
            <span className="alert-meta">{ECOSYSTEM.length} connectors · 1 degraded</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ECOSYSTEM.map((c) => (
              <div key={c.name} className="surface-card p-5 lift-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="serif text-[20px] text-ink-900 leading-tight">{c.name}</div>
                    <div className="cap-label mt-1">{c.category} · connector</div>
                  </div>
                  <Tag variant={c.status === "Healthy" ? "positive" : "warning"}>{c.status}</Tag>
                </div>
                <div className="mt-4 pt-4 border-t border-surface-divider flex items-center justify-between">
                  <span className="alert-meta">avg latency {c.latency}</span>
                  <button className="text-[11px] text-maroon font-medium hover:underline">Configure</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Available */}
        <section data-testid="connectors-available">
          <div className="flex items-end justify-between mb-5 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="w-6 h-px bg-maroon inline-block" />
              <h2 className="section-h">Available connectors</h2>
            </div>
            <div className="flex items-center gap-2 bg-white border border-surface-rule rounded-md px-3 py-2">
              <Search size={14} strokeWidth={1.5} className="text-ink-300" />
              <input
                type="text"
                placeholder="Search connectors…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="bg-transparent outline-none text-[12.5px] text-ink-900 placeholder:text-ink-300 w-56"
                data-testid="connector-search"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAvailable.map((c) => (
              <div key={c.name} className="surface-card p-5 lift-card flex flex-col">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 grid place-items-center rounded-md" style={{ background: "rgba(156,29,38,0.08)", color: "#9C1D26" }}>
                    <Plug size={16} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="serif text-[18px] text-ink-900 leading-tight">{c.name}</div>
                    <div className="cap-label mt-1">{c.category}</div>
                  </div>
                </div>
                <p className="text-[12.5px] text-ink-500 mt-3 leading-[1.55] flex-1">{c.desc}</p>
                <button className="btn-ghost mt-4 inline-flex items-center justify-center gap-1.5 self-start">
                  <Plus size={13} /> Connect
                </button>
              </div>
            ))}
          </div>
          {filteredAvailable.length === 0 && (
            <div className="text-[13px] text-ink-500 mt-4">No connectors match "{q}".</div>
          )}
        </section>
      </div>
    </div>
  );
}
