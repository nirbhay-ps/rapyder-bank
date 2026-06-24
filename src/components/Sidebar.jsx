import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid, Mail, Sparkles, BotMessageSquare, ListChecks, Trophy,
  PartyPopper, Cog, Plane, UserSquare2, ShieldCheck, GraduationCap,
  Mic, FileText, Workflow, LineChart, Lock, BookOpenCheck, Settings as SettingsIcon, Wand2,
  Video, LogOut, Phone, MailCheck, FileCheck, ClipboardCheck,
} from "lucide-react";
import { openAdvisor } from "./Advisor";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/", label: "Workspace", icon: LayoutGrid, group: "Overview" },
  { advisor: true, label: "AI Advisor", icon: Wand2 },
  { to: "/knowledge", label: "Knowledge Hub", icon: BookOpenCheck },

  { to: "/priority", label: "Smart Prioritisation", icon: ListChecks, group: "Intelligence" },
  { to: "/inbox", label: "Email Intelligence", icon: Mail, live: true },
  { to: "/meetings", label: "Meetings Intelligence", icon: Video, live: true },
  { to: "/proactive", label: "Proactive Intelligence", icon: Sparkles },
  { to: "/avatar", label: "Employee.AI Avatar", icon: BotMessageSquare },
  { to: "/autonomous", label: "Autonomous Actions", icon: Cog },
  { to: "/voice", label: "Voice Intelligence", icon: Mic },
  { to: "/documents", label: "Document Intelligence", icon: FileText, live: true },
  { to: "/workflows", label: "Workflow Orchestrator", icon: Workflow },
  { to: "/analytics", label: "Predictive Analytics", icon: LineChart },

  { to: "/customer360", label: "Customer 360", icon: UserSquare2, group: "Relationships" },
  { to: "/compliance", label: "Compliance Assistant", icon: ShieldCheck },
  { to: "/security", label: "Security Intelligence", icon: Lock },

  { to: "/gamification", label: "Gamification", icon: Trophy, group: "People" },
  { to: "/celebration", label: "Celebration Engine", icon: PartyPopper, live: true },
  { to: "/learning", label: "Learning & Development", icon: GraduationCap },
  { to: "/travel", label: "Travel & Expense", icon: Plane },

  { to: "/welcome-call", label: "Welcome Call Agent", icon: Phone, group: "Insurance AI", isNew: true },
  { to: "/email-automation", label: "Email Automation", icon: MailCheck, isNew: true },
  { to: "/auto-underwriting", label: "Auto Underwriting", icon: FileCheck, isNew: true },
  { to: "/micro-claims", label: "Micro Claims", icon: ClipboardCheck, isNew: true },

  { to: "/settings", label: "Settings", icon: SettingsIcon, group: "System" },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  return (
    <aside
      className="hidden lg:flex flex-col w-[300px] shrink-0 sidebar-shell h-screen sticky top-0"
      data-testid="app-sidebar"
    >
      {/* Brand */}
      <div className="px-4 pt-5 pb-4 border-b border-[rgba(156,29,38,0.25)]">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 grid place-items-center serif text-2xl leading-none"
            style={{ background: "#9C1D26", color: "#FFFFFF" }}
            aria-hidden
          >
            ƒ
          </div>
          <div>
            <div className="serif text-[18px] leading-none text-dark-textPri">First AI</div>
            <div className="text-[9px] tracking-[0.18em] uppercase text-dark-textMuted mt-1.5">
              Workspace · BFSI
            </div>
          </div>
        </div>
        <div className="mt-4 text-[12px] text-dark-textSec leading-snug">{user?.display_name}</div>
        <div className="text-[11px] text-dark-textMuted mt-0.5">{user?.role}</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2" data-testid="primary-nav">
        {NAV.map((item, idx) => {
          const Icon = item.icon;
          const showGroup = !!item.group;
          const key = item.to || `advisor-${idx}`;
          return (
            <React.Fragment key={key}>
              {showGroup && (
                <div className={`nav-section-label ${idx === 0 ? "pt-2" : ""}`}>{item.group}</div>
              )}
              {item.advisor ? (
                <button
                  onClick={() => openAdvisor()}
                  className="nav-item"
                  data-testid="nav-advisor"
                  type="button"
                >
                  <Icon size={15} strokeWidth={1.5} />
                  <span className="flex-1">{item.label}</span>
                  <span className="text-[9px] uppercase tracking-[0.18em] text-dark-textMuted">⌘K</span>
                </button>
              ) : (
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                  data-testid={`nav-${item.to.replace("/", "") || "home"}`}
                >
                  <Icon size={15} strokeWidth={1.5} />
                  <span className="flex-1">{item.label}</span>
                  {item.live && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-900/20 text-emerald-400 text-[9px] font-semibold uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  )}
                  {item.isNew && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-violet-900/20 text-violet-400 text-[9px] font-semibold uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                      New
                    </span>
                  )}
                </NavLink>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-[rgba(156,29,38,0.25)]">
        {user && (
          <div className="text-[11px] text-dark-textMuted mb-2 px-2 truncate">
            {user.display_name} · <span className="uppercase font-medium">{user.role}</span>
          </div>
        )}
        <button
          onClick={logout}
          className="nav-item w-full text-left hover:!bg-[rgba(156,29,38,0.15)]"
          data-testid="nav-logout"
        >
          <LogOut size={15} strokeWidth={1.5} />
          <span className="flex-1">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
