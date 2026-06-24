import React from "react";
import {
  ArrowUpRight, ArrowRight, ShieldCheck, Trophy, Mail, GraduationCap, Cog, BellDot,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TierPill, Tag, ScoreBadge } from "../components/ui";
import {
  ME, PRIORITY_TASKS, SMART_INBOX, ALERTS, AUTONOMOUS_FEED,
  COMPLIANCE_ITEMS, LEADERBOARD, LD_TRACKS, getMeForUser, getLeaderboard, getSmartInbox,
} from "../lib/mockData";
import { useAuth } from "../context/AuthContext";

const tierVariant = (t) => (t === "green" ? "positive" : t === "yellow" ? "warning" : "critical");
const tierBar = (t) => (t === "green" ? "bar-positive" : t === "yellow" ? "bar-warning" : "bar-critical");

export default function Dashboard() {
  const { user } = useAuth();
  const me = getMeForUser(user);
  const leaderboard = getLeaderboard(user);
  const smartInbox = getSmartInbox(user);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="px-6 lg:px-10 py-9 lg:py-12 max-w-[1600px] mx-auto" data-testid="rm-dashboard">
      {/* Hero — greeting + KPI grid (AUM full-width hero) */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-surface-divider">
        <div className="lg:col-span-7">
          <div className="cap-label" style={{ color: "#A8A29E", letterSpacing: "0.12em" }}>
            Workspace · {today}
          </div>
          <h1 className="greeting mt-2">
            Good morning, <span className="greeting-name">{user?.first_name || me.name.split(" ")[0]}.</span>
          </h1>
          <p className="text-ink-500 max-w-xl mt-3 text-[14px] leading-[1.6]">
            Five priorities surface today. Two need your judgement before market opens; the rest your AI co-pilot can carry — with your nod.
          </p>
          <div className="flex gap-3 mt-6">
            <Link to="/priority" className="btn-primary inline-flex items-center gap-2" data-testid="cta-open-priority">
              Open priority stack <ArrowRight size={14} strokeWidth={2} />
            </Link>
            <Link to="/inbox" className="btn-ghost inline-flex items-center gap-2" data-testid="cta-open-inbox">
              Smart inbox <Mail size={14} strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {/* Hero AUM card spans full width */}
          <div className="kpi-card col-span-2" data-testid="kpi-aum">
            <div className="kpi-label">Portfolio AUM</div>
            <div className="kpi-value-hero">{me.portfolioAum}</div>
            <div className="kpi-sub">+ 8.4% YoY · {me.activeClients} active clients</div>
          </div>
          <div className="kpi-card" data-testid="kpi-compliance">
            <div className="kpi-label">Compliance</div>
            <div className="kpi-value">{me.complianceScore}%</div>
            <div className="kpi-sub">A+ · 30-day rolling</div>
          </div>
          <div className="kpi-card" data-testid="kpi-rank">
            <div className="kpi-label">Rank · Mumbai</div>
            <div className="kpi-value">#{me.rank}</div>
            <div className="kpi-sub-muted tnum">{me.tierPoints.toLocaleString()} pts</div>
          </div>
          <div className="kpi-card col-span-2" data-testid="kpi-ai-actions">
            <div className="kpi-label">AI Actions Today</div>
            <div className="kpi-value">142</div>
            <div className="kpi-sub-muted">Green-tier auto · 4 awaiting your nod</div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
        {/* LEFT — Priority stack + Inbox preview + Customer spotlight */}
        <section className="lg:col-span-8 space-y-12">
          <div data-testid="ai-priority-stack">
            <div className="flex items-end justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="w-6 h-px bg-maroon inline-block" />
                <h2 className="section-h">What deserves your attention today</h2>
              </div>
              <Link to="/priority" className="text-[12px] text-maroon font-medium inline-flex items-center gap-1 hover:underline">
                View all <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="space-y-3">
              {PRIORITY_TASKS.map((t) => (
                <article key={t.id} className="priority-card" data-testid={`priority-${t.id}`}>
                  <div className="flex gap-4 items-start">
                    <ScoreBadge score={t.score} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[15px] font-medium text-ink-900 leading-tight">{t.title}</h3>
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
                      </div>
                    </div>
                    <button className="btn-resolve self-start whitespace-nowrap">Resolve</button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Smart Inbox preview */}
          <div data-testid="smart-inbox-preview">
            <div className="flex items-end justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="w-6 h-px bg-maroon inline-block" />
                <h2 className="section-h">Smart Inbox — drafted, ready for your nod</h2>
              </div>
              <Link to="/inbox" className="text-[12px] text-maroon font-medium inline-flex items-center gap-1 hover:underline">
                Open inbox <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="surface-card overflow-hidden">
              {smartInbox.slice(0, 3).map((m, idx) => (
                <div key={m.id} className={`grid grid-cols-12 gap-4 px-5 py-4 transition-colors hover:bg-surface-muted/60 ${idx > 0 ? "border-t border-surface-divider" : ""}`}>
                  <div className="col-span-3">
                    <div className="text-[13px] text-ink-900 font-medium">{m.from}</div>
                    <div className="text-[11px] text-ink-500">{m.company}</div>
                    <div className="timestamp mt-1">{m.received}</div>
                  </div>
                  <div className="col-span-7">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] text-ink-900">{m.subject}</span>
                      <Tag variant={tierVariant(m.tier)}>
                        {m.tier === "green" ? "Auto" : m.tier === "yellow" ? "60s" : "Manual"}
                      </Tag>
                    </div>
                    <div className="text-[12px] text-ink-500 mt-1.5 line-clamp-2 leading-[1.55]">{m.summary}</div>
                  </div>
                  <div className="col-span-2 text-right">
                    <button className="btn-resolve">Review</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer 360 spotlight */}
          <div data-testid="customer-spotlight">
            <div className="flex items-end justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="w-6 h-px bg-maroon inline-block" />
                <h2 className="section-h">Customer spotlight</h2>
              </div>
              <Link to="/customer360" className="text-[12px] text-maroon font-medium inline-flex items-center gap-1 hover:underline">
                Open Customer 360 <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="surface-card p-6">
              <div className="cap-label">HNI · Private · Since 2011</div>
              <div className="serif text-[28px] mt-1 text-ink-900 leading-tight">Anand Mehta</div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5 mt-5 pt-5 border-t border-surface-divider">
                <div>
                  <div className="cap-label">AUM</div>
                  <div className="metric mt-1">₹ 38.4 Cr</div>
                  <div className="text-[11px] text-sage mt-1">+ 8.4% YoY</div>
                </div>
                <div>
                  <div className="cap-label">CIBIL</div>
                  <div className="metric mt-1">826</div>
                  <div className="text-[11px] text-ink-500 mt-1">Stable</div>
                </div>
                <div>
                  <div className="cap-label">Cross-sell</div>
                  <div className="metric mt-1">0.81</div>
                  <div className="text-[11px] text-sage mt-1">High propensity</div>
                </div>
                <div>
                  <div className="cap-label">Churn</div>
                  <div className="metric mt-1">0.12</div>
                  <div className="text-[11px] text-sage mt-1">Low risk</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT — Side rail */}
        <aside className="lg:col-span-4 space-y-10" data-testid="dashboard-right">
          {/* Proactive alerts */}
          <div>
            <div className="cap-label mb-3 flex items-center gap-2"><BellDot size={11} /> Proactive Alerts</div>
            <div className="surface-card overflow-hidden">
              {ALERTS.map((a, i) => (
                <div key={i} className="alert-row">
                  <span className={`alert-bar ${a.level === "red" ? "bar-critical" : a.level === "yellow" ? "bar-warning" : "bar-positive"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="alert-title">{a.text}</div>
                    <div className="alert-meta">{a.type} · {a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance meter */}
          <div>
            <div className="cap-label mb-3 flex items-center gap-2"><ShieldCheck size={11} /> Compliance</div>
            <div className="surface-card p-5">
              <div className="flex items-end justify-between">
                <div>
                  <div className="metric-hero text-ink-900">100%</div>
                  <div className="text-[11px] text-ink-500 mt-2">30-day rolling adherence</div>
                </div>
                <Tag variant="positive">A+</Tag>
              </div>
              <div className="mt-4 h-1 w-full bg-surface-muted rounded-full overflow-hidden">
                <div className="h-full bg-maroon rounded-full" style={{ width: "100%" }} />
              </div>
              <div className="mt-5 space-y-3">
                {COMPLIANCE_ITEMS.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-[12px]">
                    <div>
                      <div className="text-ink-900">{c.title}</div>
                      <div className="alert-meta mt-0.5">{c.id} · {c.due}</div>
                    </div>
                    <TierPill tier={c.tier} label={c.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Autonomous actions feed */}
          <div>
            <div className="cap-label mb-3 flex items-center gap-2"><Cog size={11} /> Autonomous Actions</div>
            <div className="surface-card overflow-hidden">
              {AUTONOMOUS_FEED.map((f, i) => (
                <div key={i} className="alert-row">
                  <span className={`alert-bar ${tierBar(f.tier)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="alert-title">{f.text}</div>
                    <div className="alert-meta">{f.tier === "green" ? "GREEN · auto" : f.tier === "yellow" ? "YELLOW · 60s" : "RED · audit"} · {f.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <div className="cap-label mb-3 flex items-center gap-2"><Trophy size={11} /> Leaderboard · Mumbai</div>
            <div className="surface-card overflow-hidden">
              {leaderboard.map((l, i) => (
                <div key={l.rank} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-surface-divider" : ""} ${l.you ? "bg-[rgba(156,29,38,0.04)]" : ""}`}>
                  <div className="metric tnum w-7 text-ink-900" style={{ fontSize: "18px" }}>{l.rank}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[13px] truncate ${l.you ? "text-maroon font-medium" : "text-ink-900"}`}>
                      {l.name}{l.you && " · You"}
                    </div>
                    <div className="alert-meta">{l.branch}</div>
                  </div>
                  <div className="text-[14px] tnum text-ink-900 font-medium">{l.points.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* L&D progress */}
          <div>
            <div className="cap-label mb-3 flex items-center gap-2"><GraduationCap size={11} /> Learning</div>
            <div className="surface-card p-5 space-y-4">
              {LD_TRACKS.slice(0, 3).map((t, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-ink-900">{t.name}</span>
                    <span className="text-ink-500 tnum">{t.progress}%</span>
                  </div>
                  <div className="mt-2 h-[3px] w-full bg-surface-muted rounded-full overflow-hidden">
                    <div className="h-full bg-maroon" style={{ width: `${t.progress}%` }} />
                  </div>
                  <div className="alert-meta mt-1">{t.hours}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
