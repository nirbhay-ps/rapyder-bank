import React from "react";
import PageHeader from "../components/PageHeader";
import { Stat } from "../components/ui";
import { WORKFLOWS } from "../lib/mockData";

export default function Workflows() {
  return (
    <div data-testid="page-workflows">
      <PageHeader
        eyebrow="Workflow Orchestrator"
        title="Cross-system flows, end-to-end."
        lede="Approvals, hand-offs and SLAs orchestrated across CRM, Core Banking, KYC and document systems."
      />
      <div className="px-6 lg:px-10 py-9 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8 surface-card overflow-hidden">
          <table className="h-table w-full">
            <thead>
              <tr><th>Workflow</th><th>Steps</th><th>SLA</th><th>Active</th><th></th></tr>
            </thead>
            <tbody>
              {WORKFLOWS.map((w) => (
                <tr key={w.name}>
                  <td className="text-ink-900">{w.name}</td>
                  <td className="tnum">{w.steps}</td>
                  <td className="tnum">{w.slaH} h</td>
                  <td className="tnum">{w.active}</td>
                  <td className="text-right"><button className="btn-resolve">Open canvas</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside className="lg:col-span-4 grid gap-3">
          <div className="surface-card p-5 lift-card"><Stat label="Active workflows" value="26" sub="across 4 templates" /></div>
          <div className="surface-card p-5 lift-card"><Stat label="Avg cycle time" value="38h" sub="-12h vs 90-day avg" sage /></div>
          <div className="surface-card p-5 lift-card"><Stat label="SLA breach %" value="0.4%" sub="rolling 30 days" sage /></div>
        </aside>
      </div>
    </div>
  );
}
