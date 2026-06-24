import React from "react";

// Shared UI primitives — aligned to BFSI Command Center design system.

export const Stat = ({ label, value, sub, hero = false, sage = false, className = "" }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <div className="cap-label">{label}</div>
    <div className={hero ? "metric-hero text-ink-900 mt-1" : "metric text-ink-900 mt-1"}>{value}</div>
    {sub && <div className={`text-[11px] mt-1 ${sage ? "text-sage" : "text-ink-500"}`}>{sub}</div>}
  </div>
);

export const Tag = ({ variant = "brand", children, className = "" }) => {
  const map = {
    critical: "tag tag-critical",
    warning:  "tag tag-warning",
    positive: "tag tag-positive",
    brand:    "tag tag-brand",
    neutral:  "tag tag-neutral",
  };
  return <span className={`${map[variant]} ${className}`}>{children}</span>;
};

// Tier pill — maps the GREEN/YELLOW/RED business tiers onto our filled-pill system.
export const TierPill = ({ tier = "green", label, className = "" }) => {
  const variant = tier === "green" ? "positive" : tier === "yellow" ? "warning" : "critical";
  const text = label || ({ green: "GREEN · AUTO", yellow: "YELLOW · 60s", red: "RED · MANUAL" })[tier];
  return <Tag variant={variant} className={className}>{text}</Tag>;
};

export const ScoreBadge = ({ score }) => (
  <div className="score-badge tnum" aria-label={`Priority score ${score}`}>{score}</div>
);

export const Divider = ({ className = "" }) => <div className={`hr-rule ${className}`} />;

// Editorial section eyebrow — maroon hairline + uppercase label.
export const Eyebrow = ({ children, className = "" }) => (
  <div className={`flex items-center gap-3 cap-label ${className}`}>
    <span className="w-6 h-px bg-maroon inline-block" />
    {children}
  </div>
);
