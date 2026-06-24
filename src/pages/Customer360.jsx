import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { Stat, Tag } from "../components/ui";
import { CUSTOMERS, RENEWALS, SALES_STAGES, SMART_INBOX, getSmartInbox } from "../lib/mockData";
import { InlineAdvisor } from "../components/Advisor";
import { useAuth } from "../context/AuthContext";
import { Mail, ArrowUpRight, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";

const stageVariant = (s) => {
  if (s === "Won") return "positive";
  if (s === "Lost") return "critical";
  if (s === "Closing" || s === "Negotiating") return "warning";
  return "brand";
};

function RenewalGroup({ month, items, onJump }) {
  if (!items.length) return null;
  return (
    <div className="surface-card overflow-hidden">
      <div className="px-5 py-3 border-b border-surface-divider flex items-center justify-between bg-surface-page">
        <div className="cap-label flex items-center gap-2"><CalendarClock size={11} /> {month}</div>
        <div className="text-[11px] text-ink-500 tnum">{items.length} renewal{items.length > 1 ? "s" : ""}</div>
      </div>
      <table className="h-table w-full">
        <thead>
          <tr><th>Customer</th><th>Product</th><th>Maturity</th><th>Amount</th><th>Stage</th></tr>
        </thead>
        <tbody>
          {items.map((r, i) => (
            <tr
              key={i}
              className="cursor-pointer"
              onClick={() => onJump?.(r.customerId)}
              data-testid={`renewal-${r.customerId}-${i}`}
            >
              <td>{r.customer}</td>
              <td className="text-ink-500">{r.product}</td>
              <td className="tnum">{r.maturity}</td>
              <td className="tnum">{r.amount}</td>
              <td><Tag variant={stageVariant(r.stage)}>{r.stage}</Tag></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Customer360() {
  const { user } = useAuth();
  const smartInbox = getSmartInbox(user);
  const [active, setActive] = useState(CUSTOMERS[0]);

  const byMonth = RENEWALS.reduce((acc, r) => {
    (acc[r.month] = acc[r.month] || []).push(r);
    return acc;
  }, {});
  const months = ["October", "November", "December"];

  // Pivot by stage for sub-summary
  const stageCounts = SALES_STAGES.map((s) => ({
    stage: s,
    count: RENEWALS.filter((r) => r.stage === s).length,
  }));

  // Linked email threads for the active customer
  const linkedMails = smartInbox.filter((m) => m.customerId === active.id);

  const jumpToCustomer = (id) => {
    const c = CUSTOMERS.find((x) => x.id === id);
    if (c) {
      setActive(c);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div data-testid="page-customer360">
      <PageHeader
        eyebrow="Customer 360"
        title="Every relationship, in one pane."
        lede="A unified intelligence panel — financials, behaviour, sentiment and history — visible and contextual during every interaction."
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-surface-divider min-h-[calc(100vh-260px)]">
        <aside className="lg:col-span-4 border-r border-surface-divider bg-white">
          {CUSTOMERS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              className={`w-full text-left px-6 py-5 border-b border-surface-divider transition-colors hover:bg-surface-page ${active.id === c.id ? "bg-surface-page" : ""}`}
              data-testid={`customer-${c.id}`}
            >
              <div className="serif text-[20px] text-ink-900 leading-tight">{c.name}</div>
              <div className="cap-label mt-1">{c.segment}</div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-[12px] text-ink-900">
                <span><span className="text-ink-300">AUM </span>{c.aum}</span>
                <span><span className="text-ink-300">Last </span>{c.last}</span>
              </div>
            </button>
          ))}
        </aside>

        <main className="lg:col-span-8 bg-surface-page">
          <div className="px-8 lg:px-12 py-10 space-y-10">
            {/* Customer header */}
            <section>
              <div className="cap-label">{active.segment} · {active.relationship}</div>
              <h2 className="serif text-[44px] mt-2 text-ink-900 leading-none">{active.name}</h2>
              <div className="alert-meta mt-2">{active.id}</div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-7">
                <div className="surface-card p-5 lift-card"><Stat label="AUM" value={active.aum} /></div>
                <div className="surface-card p-5 lift-card"><Stat label="CIBIL" value={active.cibil} /></div>
                <div className="surface-card p-5 lift-card"><Stat label="Cross-sell" value={active.crossSell.toFixed(2)} /></div>
                <div className="surface-card p-5 lift-card"><Stat label="Churn" value={active.churn.toFixed(2)} /></div>
              </div>
            </section>

            {/* Holdings + AI insight + Embedded advisor */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="surface-card p-6">
                <div className="cap-label mb-3">Holdings</div>
                <ul className="space-y-2">
                  {active.holdings.map((h, i) => (
                    <li key={i} className="text-[13px] text-ink-900 flex items-center gap-2">
                      <span className="w-1 h-1 bg-maroon rounded-full inline-block" /> {h}
                    </li>
                  ))}
                </ul>
                <div className="cap-label mt-6 mb-3">AI insight</div>
                <p className="text-[13.5px] text-ink-900 leading-relaxed">
                  Sentiment trending positive over last 4 interactions. Customer is comparing competitor yields informally — consider a tailored 24-month structured note before week-end. Last unmet ask: locker upgrade at Worli Sea Face.
                </p>
              </div>

              {/* Embedded "Ask Anything" */}
              <InlineAdvisor customer={active.name} />
            </section>

            {/* Linked emails */}
            <section data-testid="linked-emails">
              <div className="flex items-end justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-px bg-maroon inline-block" />
                  <h3 className="section-h">Linked email threads</h3>
                </div>
                <Link to="/inbox" className="text-[12px] text-maroon font-medium inline-flex items-center gap-1 hover:underline">
                  Open Smart Inbox <ArrowUpRight size={12} />
                </Link>
              </div>
              {linkedMails.length === 0 ? (
                <div className="surface-card p-6 text-[13px] text-ink-500">No threads on file for this customer.</div>
              ) : (
                <div className="surface-card overflow-hidden">
                  {linkedMails.map((m, i) => (
                    <div key={m.id} className={`grid grid-cols-12 gap-3 px-5 py-4 ${i > 0 ? "border-t border-surface-divider" : ""}`}>
                      <div className="col-span-2 flex items-center gap-2 text-[12px] text-ink-500">
                        <Mail size={14} strokeWidth={1.5} className="text-maroon" /> {m.received}
                      </div>
                      <div className="col-span-7">
                        <div className="text-[13px] text-ink-900">{m.subject}</div>
                        <div className="text-[12px] text-ink-500 mt-1 leading-[1.5]">{m.summaryShort}</div>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <Tag variant={m.sentiment === "positive" ? "positive" : m.sentiment === "negative" ? "critical" : "neutral"}>
                          {m.sentiment}
                        </Tag>
                      </div>
                      <div className="col-span-1 text-right">
                        <Link to="/inbox" className="btn-resolve text-[11px]">Draft</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Renewals — RM book */}
            <section data-testid="renewals">
              <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-px bg-maroon inline-block" />
                  <h3 className="section-h">Renewals · your book</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stageCounts.map((s) => (
                    <Tag key={s.stage} variant={stageVariant(s.stage)}>{s.stage} · {s.count}</Tag>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {months.map((m) => <RenewalGroup key={m} month={m} items={byMonth[m] || []} onJump={jumpToCustomer} />)}
              </div>
              <div className="alert-meta mt-3">Scoped to your portfolio only · not RSM-level</div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
