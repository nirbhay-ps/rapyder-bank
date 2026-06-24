import React from "react";
import { Search, Bell, Command } from "lucide-react";
import { TICKER } from "../lib/mockData";
import { useAuth } from "../context/AuthContext";

// Refined live-ticker rendering: sage for positive, deep-red for negative.
function TickerCell({ raw }) {
  // Parse: "NIFTY 50  24,612.40  +0.42%"
  const parts = raw.trim().split(/\s{2,}/);
  const sym = parts[0];
  const price = parts[1];
  const delta = parts[2] || "";
  const positive = /^\+/.test(delta) || /\+\d/.test(delta);
  const negative = /^-/.test(delta);
  return (
    <span className="ticker-item">
      <span className="sym">{sym}</span>
      <span>{price}</span>
      {delta && (
        <span className={positive ? "ticker-positive" : negative ? "ticker-negative" : ""}>
          {delta}
        </span>
      )}
    </span>
  );
}

export default function Topbar() {
  const { user } = useAuth();

  // Derive display values from logged-in user
  const displayName = user?.display_name || "User";
  const initials = user ? (user.first_name[0] + user.last_name[0]).toUpperCase() : "??";

  return (
    <div className="sticky top-0 z-20">
      {/* Live ticker */}
      <div className="ticker-bar">
        <span className="ticker-label">Live · Markets</span>
        <div className="flex-1 overflow-hidden">
          <div className="flex ticker-track whitespace-nowrap">
            {[...TICKER, ...TICKER].map((t, i) => <TickerCell key={i} raw={t} />)}
          </div>
        </div>
      </div>

      {/* Top utility bar */}
      <div className="bg-surface-page border-b border-surface-divider flex items-center gap-4 px-6 lg:px-10 py-3">
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <div className="flex items-center gap-2 bg-white border border-surface-rule rounded-md px-3 py-2 flex-1">
            <Search size={15} strokeWidth={1.5} className="text-ink-300" />
            <input
              type="text"
              placeholder="Search clients, tasks, documents…"
              className="bg-transparent outline-none text-[13px] flex-1 text-ink-900 placeholder:text-ink-300"
              data-testid="global-search"
            />
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-ink-300 border border-surface-rule rounded px-1.5 py-0.5">
              <Command size={10} /> K
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          <button
            className="relative bg-white border border-surface-rule rounded-md p-2 hover:bg-surface-muted transition-colors"
            data-testid="notifications-btn"
            aria-label="Notifications"
          >
            <Bell size={16} strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 bg-maroon text-white text-[9px] px-1 leading-3 py-0.5 rounded-full tnum">7</span>
          </button>

          <div className="flex items-center gap-3 bg-white border border-surface-rule rounded-md px-3 py-1.5" data-testid="rm-profile">
            <div className="w-7 h-7 grid place-items-center text-[11px] font-medium tracking-wider rounded-full"
                 style={{ background: "#1A0608", color: "#F5F0EE" }}>
              {initials}
            </div>
            <div className="text-right">
              <div className="text-[12px] font-medium text-ink-900 leading-none">{displayName}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
