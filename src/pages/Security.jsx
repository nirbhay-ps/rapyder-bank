import React from "react";
import PageHeader from "../components/PageHeader";
import { Tag } from "../components/ui";
import { SECURITY_EVENTS } from "../lib/mockData";

const barClass = (t) => t === "green" ? "bar-positive" : t === "yellow" ? "bar-warning" : "bar-critical";
const tagVariant = (t) => t === "green" ? "positive" : t === "yellow" ? "warning" : "critical";

export default function Security() {
  return (
    <div data-testid="page-security">
      <PageHeader
        eyebrow="Security Intelligence"
        title="Quiet vigilance, audit-grade."
        lede="Threat detection, anomaly monitoring and access governance — every RED-tier action carries an immutable trail."
      />
      <div className="px-6 lg:px-10 py-9">
        <div className="surface-card overflow-hidden">
          {SECURITY_EVENTS.map((e, i) => (
            <div key={i} className="alert-row" style={{ padding: "16px 20px" }}>
              <span className={`alert-bar ${barClass(e.tier)}`} />
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] text-ink-900 leading-[1.5]">{e.text}</div>
                <div className="alert-meta mt-1">{e.time}</div>
              </div>
              <Tag variant={tagVariant(e.tier)}>
                {e.tier === "green" ? "OK" : e.tier === "yellow" ? "WATCH" : "AUDIT"}
              </Tag>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
