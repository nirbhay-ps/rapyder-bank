import React from "react";
import PageHeader from "../components/PageHeader";
import { LEADERBOARD, BADGES_GRID, getLeaderboard } from "../lib/mockData";
import { useAuth } from "../context/AuthContext";
import { Trophy } from "lucide-react";

export default function Gamification() {
  const { user } = useAuth();
  const leaderboard = getLeaderboard(user);
  return (
    <div data-testid="page-gamification">
      <PageHeader
        eyebrow="Gamification"
        title="Performance, told as story."
        lede="Points, streaks and badges that recognise the work that actually matters — earned, never gifted."
      />
      <div className="px-6 lg:px-10 py-9 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7">
          <div className="cap-label mb-3 flex items-center gap-2"><Trophy size={11} /> Mumbai · This quarter</div>
          <div className="surface-card overflow-hidden">
            {leaderboard.map((l, i) => (
              <div key={l.rank} className={`grid grid-cols-12 items-center px-6 py-4 ${i > 0 ? "border-t border-surface-divider" : ""} ${l.you ? "bg-[rgba(156,29,38,0.04)]" : ""}`}>
                <div className="col-span-1 metric tnum text-ink-900" style={{ fontSize: "22px" }}>{l.rank}</div>
                <div className="col-span-7">
                  <div className={`text-[14px] ${l.you ? "text-maroon font-medium" : "text-ink-900"}`}>{l.name}{l.you && " · You"}</div>
                  <div className="alert-meta">{l.branch}</div>
                </div>
                <div className="col-span-3 metric tnum" style={{ fontSize: "20px" }}>{l.points.toLocaleString()}</div>
                <div className="col-span-1 text-right cap-label">pts</div>
              </div>
            ))}
          </div>
        </section>
        <aside className="lg:col-span-5">
          <div className="cap-label mb-3">Badges</div>
          <div className="grid grid-cols-2 gap-3">
            {BADGES_GRID.map((b) => (
              <div key={b.name} className={`surface-card p-5 lift-card ${b.earned ? "border-maroon" : ""}`}
                   style={b.earned ? { borderColor: "#9C1D26", background: "rgba(156,29,38,0.04)" } : {}}>
                <div className={`serif text-[18px] leading-tight ${b.earned ? "text-maroon" : "text-ink-500"}`}>{b.name}</div>
                <div className="text-[11px] text-ink-500 mt-2 leading-relaxed">{b.desc}</div>
                {!b.earned && <div className="cap-label mt-3">Locked</div>}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
