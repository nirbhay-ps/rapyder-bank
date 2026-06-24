import React from "react";
import PageHeader from "../components/PageHeader";
import { Tag } from "../components/ui";
import { TRAVEL } from "../lib/mockData";
import { Plane } from "lucide-react";

const statusVariant = (s) => s === "Booked" ? "positive" : s === "Pending approval" ? "warning" : "neutral";

export default function Travel() {
  return (
    <div data-testid="page-travel">
      <PageHeader
        eyebrow="Travel & Expense"
        title="Booked, captured, reimbursed."
        lede="From flight booking to receipt OCR to reimbursement — a single thread, two-three hours saved per trip."
        action={<button className="btn-primary inline-flex items-center gap-2"><Plane size={14} /> New trip</button>}
      />
      <div className="px-6 lg:px-10 py-9">
        <div className="surface-card overflow-hidden">
          <table className="h-table w-full">
            <thead>
              <tr><th>Ref</th><th>Trip</th><th>Purpose</th><th>Dates</th><th>Status</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {TRAVEL.map((t) => (
                <tr key={t.id}>
                  <td className="font-mono text-[12px] text-ink-500">{t.id}</td>
                  <td>{t.trip}</td>
                  <td className="text-ink-500">{t.purpose}</td>
                  <td className="tnum">{t.dates}</td>
                  <td><Tag variant={statusVariant(t.status)}>{t.status}</Tag></td>
                  <td className="tnum">{t.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
