import React from "react";
import PageHeader from "../components/PageHeader";
import { Tag } from "../components/ui";
import { AVATAR_SESSIONS } from "../lib/mockData";
import { BotMessageSquare, Mic, Calendar, Headphones } from "lucide-react";

const stateVariant = (s) => (s === "Live" ? "positive" : s === "Scheduled" ? "warning" : "neutral");

export default function Avatar() {
  return (
    <div data-testid="page-avatar">
      <PageHeader
        eyebrow="Employee.AI Avatar"
        title="Your presence, when you can't be."
        lede="A trained avatar represents you in routine meetings — up to four parallel sessions — and hands off to you the moment judgement is required."
        action={<button className="btn-primary">Train avatar voice</button>}
      />
      <div className="px-6 lg:px-10 py-9 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8">
          <div className="cap-label mb-3 flex items-center gap-2"><BotMessageSquare size={11} /> Live & recent sessions</div>
          <div className="surface-card overflow-hidden">
            {AVATAR_SESSIONS.map((s, i) => (
              <div key={s.id} className={`grid grid-cols-12 gap-4 px-5 py-5 ${i > 0 ? "border-t border-surface-divider" : ""}`}>
                <div className="col-span-2"><Tag variant={stateVariant(s.state)}>{s.state}</Tag></div>
                <div className="col-span-7">
                  <div className="text-[14px] text-ink-900">{s.customer}</div>
                  <div className="text-[12px] text-ink-500 mt-1 leading-[1.55]">{s.takeaway}</div>
                </div>
                <div className="col-span-2"><div className="cap-label">Duration</div><div className="text-[12px] tnum text-ink-900 mt-0.5">{s.duration}</div></div>
                <div className="col-span-1 text-right"><button className="btn-resolve">Open</button></div>
              </div>
            ))}
          </div>
        </section>
        <aside className="lg:col-span-4 space-y-5">
          <div className="surface-card p-6">
            <div className="cap-label">Capabilities</div>
            <ul className="text-[13px] text-ink-900 mt-3 space-y-2.5 leading-relaxed">
              <li className="flex items-center gap-2.5"><Headphones size={14} strokeWidth={1.5} /> Joins Zoom / Teams in your stead</li>
              <li className="flex items-center gap-2.5"><Mic size={14} strokeWidth={1.5} /> Speaks in your trained voice</li>
              <li className="flex items-center gap-2.5"><Calendar size={14} strokeWidth={1.5} /> Books, reschedules, hands off</li>
              <li className="flex items-center gap-2.5"><BotMessageSquare size={14} strokeWidth={1.5} /> Up to 4 parallel sessions</li>
            </ul>
          </div>
          <div className="surface-card p-6 lift-card" style={{ background: "#F2EEE9" }}>
            <div className="serif text-[22px] text-ink-900 leading-snug">Used in 12 meetings this week</div>
            <p className="text-[12px] text-ink-500 mt-2 leading-relaxed">Reclaimed 6h 40m of your time. Two RED hand-offs returned to you.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
