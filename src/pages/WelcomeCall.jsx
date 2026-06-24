import React, { useState } from "react";
import {
  Phone, PhoneOff, Globe, MessageSquare, ArrowRightLeft, User,
  CheckCircle2, Clock, AlertTriangle, Play, Pause, Volume2,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { Tag } from "../components/ui";

// Dummy customer data for newly onboarded customers
const ONBOARDED_CUSTOMERS = [
  {
    id: "CUS-1001",
    name: "Priya Sharma",
    phone: "+91 98765 43210",
    policy: "LIFE-PREM-2024-4521",
    policyType: "Term Life Insurance",
    premium: "₹18,500/year",
    onboardedDate: "2024-11-18",
    language: "Hindi",
    status: "pending",
    sumAssured: "₹1 Cr",
  },
  {
    id: "CUS-1002",
    name: "Rajesh Kumar",
    phone: "+91 87654 32109",
    policy: "HEALTH-FAM-2024-7832",
    policyType: "Family Health Cover",
    premium: "₹24,000/year",
    onboardedDate: "2024-11-17",
    language: "English",
    status: "completed",
    sumAssured: "₹10 Lakh",
  },
  {
    id: "CUS-1003",
    name: "Anitha Devi",
    phone: "+91 76543 21098",
    policy: "MOTOR-COMP-2024-3345",
    policyType: "Comprehensive Motor",
    premium: "₹8,200/year",
    onboardedDate: "2024-11-18",
    language: "Tamil",
    status: "in-progress",
    sumAssured: "₹5 Lakh IDV",
  },
  {
    id: "CUS-1004",
    name: "Mohammed Irfan",
    phone: "+91 65432 10987",
    policy: "LIFE-ULIP-2024-9012",
    policyType: "ULIP Plan",
    premium: "₹50,000/year",
    onboardedDate: "2024-11-16",
    language: "Urdu",
    status: "escalated",
    sumAssured: "₹25 Lakh",
  },
  {
    id: "CUS-1005",
    name: "Sneha Patil",
    phone: "+91 54321 09876",
    policy: "HEALTH-IND-2024-5567",
    policyType: "Individual Health",
    premium: "₹12,000/year",
    onboardedDate: "2024-11-18",
    language: "Marathi",
    status: "pending",
    sumAssured: "₹5 Lakh",
  },
];

// Simulated conversation transcript
const SAMPLE_TRANSCRIPT = [
  { role: "bot", text: "Namaste Priya ji! Main First AI Insurance ka virtual assistant hoon. Aapka Term Life Insurance policy LIFE-PREM-2024-4521 successfully activate ho gaya hai. Kya main aapko policy details samjha sakta hoon?", time: "0:02" },
  { role: "customer", text: "Haan, please bataiye ki meri policy mein kya-kya cover hai.", time: "0:08" },
  { role: "bot", text: "Bilkul! Aapki policy mein ₹1 Crore ka life cover hai, jo 30 saal ke liye valid hai. Isme accidental death ka double benefit bhi shamil hai. Aapka annual premium ₹18,500 hai jo har saal November mein due hoga.", time: "0:12" },
  { role: "customer", text: "Agar mujhe claim karna ho toh process kya hai?", time: "0:25" },
  { role: "bot", text: "Claim process bahut simple hai. Nominee ko death certificate aur policy document ke saath hamari branch ya online portal par claim file karna hoga. Settlement 15 working days mein ho jaata hai. Kya aap koi aur sawal poochna chahti hain?", time: "0:30" },
  { role: "customer", text: "Nahi, bahut acche se samjha diya. Thank you!", time: "0:42" },
  { role: "bot", text: "Dhanyavaad Priya ji! Aapka policy document aapke registered email par bhej diya gaya hai. Koi bhi sawal ho toh 1800-XXX-XXXX par call karein. Aapka din shubh ho!", time: "0:45" },
];

const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Marathi", "Bengali", "Urdu", "Gujarati"];

const FAQ_ITEMS = [
  { q: "What is covered under my policy?", answered: 342 },
  { q: "How do I file a claim?", answered: 289 },
  { q: "When is my premium due?", answered: 456 },
  { q: "Can I add a nominee?", answered: 178 },
  { q: "What is the policy tenure?", answered: 523 },
];

const statusConfig = {
  pending: { label: "Pending", variant: "warning", icon: Clock },
  completed: { label: "Completed", variant: "positive", icon: CheckCircle2 },
  "in-progress": { label: "In Progress", variant: "brand", icon: Play },
  escalated: { label: "Escalated", variant: "critical", icon: AlertTriangle },
};

export default function WelcomeCall() {
  const [selectedCustomer, setSelectedCustomer] = useState(ONBOARDED_CUSTOMERS[0]);
  const [callActive, setCallActive] = useState(false);
  const [selectedLang, setSelectedLang] = useState(selectedCustomer.language);

  return (
    <div data-testid="welcome-call-page">
      <PageHeader
        eyebrow="Insurance AI · Welcome Call Agent"
        title="Automated Welcome Calls"
        lede="AI-powered voice assistant for onboarding new insurance customers. Explains policy details, answers FAQs, supports multiple languages, and escalates to human agents when needed."
      />

      <div className="px-6 lg:px-10 py-8 max-w-[1600px] mx-auto">
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <div className="kpi-card">
            <div className="kpi-label">Total Calls Today</div>
            <div className="kpi-value">47</div>
            <div className="kpi-sub">+12 from yesterday</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Completed</div>
            <div className="kpi-value text-sage">38</div>
            <div className="kpi-sub">80.8% success rate</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Escalated to Human</div>
            <div className="kpi-value text-amber">5</div>
            <div className="kpi-sub">10.6% escalation</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Avg Duration</div>
            <div className="kpi-value">2m 34s</div>
            <div className="kpi-sub">↓ 18s vs last week</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Languages Used</div>
            <div className="kpi-value">6</div>
            <div className="kpi-sub">Hindi dominant (62%)</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Customer Queue */}
          <section className="lg:col-span-4">
            <h2 className="section-h mb-4">New Customer Queue</h2>
            <div className="surface-card overflow-hidden">
              {ONBOARDED_CUSTOMERS.map((c) => {
                const sc = statusConfig[c.status];
                const StatusIcon = sc.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCustomer(c); setSelectedLang(c.language); }}
                    className={`w-full text-left px-4 py-3 border-b border-surface-divider hover:bg-surface-muted/60 transition-colors ${selectedCustomer.id === c.id ? "bg-maroon-tint6" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-ink-500" />
                        <span className="text-[13px] font-medium text-ink-900">{c.name}</span>
                      </div>
                      <Tag variant={sc.variant}>
                        <StatusIcon size={10} className="mr-1 inline" />{sc.label}
                      </Tag>
                    </div>
                    <div className="text-[11px] text-ink-500 mt-1">{c.policyType} · {c.language}</div>
                    <div className="text-[11px] text-ink-300 mt-0.5">Onboarded: {c.onboardedDate}</div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Call Interface */}
          <section className="lg:col-span-8 space-y-6">
            {/* Customer detail + Call controls */}
            <div className="surface-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="cap-label">Selected Customer</div>
                  <div className="serif text-[24px] text-ink-900 mt-1">{selectedCustomer.name}</div>
                  <div className="text-[13px] text-ink-500 mt-1">{selectedCustomer.phone} · {selectedCustomer.policyType}</div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-[12px] text-ink-500">Policy: <span className="font-mono text-ink-900">{selectedCustomer.policy}</span></span>
                    <span className="text-[12px] text-ink-500">Premium: <span className="font-medium text-ink-900">{selectedCustomer.premium}</span></span>
                    <span className="text-[12px] text-ink-500">Sum: <span className="font-medium text-ink-900">{selectedCustomer.sumAssured}</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Language selector */}
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-ink-500" />
                    <select
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value)}
                      className="text-[12px] bg-surface-muted border border-surface-divider rounded px-2 py-1 text-ink-900"
                    >
                      {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  {/* Call button */}
                  <button
                    onClick={() => setCallActive(!callActive)}
                    className={`flex items-center gap-2 px-4 py-2 rounded text-[13px] font-medium transition-colors ${callActive ? "bg-red-600 text-white hover:bg-red-700" : "bg-sage text-white hover:bg-sage/90"}`}
                  >
                    {callActive ? <><PhoneOff size={14} /> End Call</> : <><Phone size={14} /> Start Call</>}
                  </button>
                </div>
              </div>

              {/* Call status bar */}
              {callActive && (
                <div className="mt-4 p-3 bg-sage/10 border border-sage/20 rounded flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                  <span className="text-[12px] text-sage font-medium">Call in progress — AI speaking in {selectedLang}</span>
                  <div className="ml-auto flex items-center gap-2">
                    <Volume2 size={14} className="text-sage" />
                    <span className="text-[12px] text-ink-500 font-mono">01:23</span>
                  </div>
                </div>
              )}
            </div>

            {/* Conversation Transcript */}
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-medium text-ink-900 flex items-center gap-2">
                  <MessageSquare size={14} /> Conversation Transcript
                </h3>
                <span className="text-[11px] text-ink-500">Sample: Priya Sharma welcome call</span>
              </div>
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                {SAMPLE_TRANSCRIPT.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "bot" ? "" : "flex-row-reverse"}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === "bot" ? "bg-maroon/10 text-maroon" : "bg-surface-muted text-ink-500"}`}>
                      {msg.role === "bot" ? <Volume2 size={12} /> : <User size={12} />}
                    </div>
                    <div className={`max-w-[75%] rounded-lg px-3 py-2 ${msg.role === "bot" ? "bg-surface-muted" : "bg-maroon/5 border border-maroon/10"}`}>
                      <p className="text-[12px] text-ink-900 leading-relaxed">{msg.text}</p>
                      <span className="text-[10px] text-ink-300 mt-1 block">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom row: FAQ + Escalation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Knowledge Base FAQ */}
              <div className="surface-card p-5">
                <h3 className="text-[14px] font-medium text-ink-900 mb-3">Top FAQ — Knowledge Base</h3>
                <div className="space-y-2">
                  {FAQ_ITEMS.map((faq, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-surface-divider last:border-0">
                      <span className="text-[12px] text-ink-900">{faq.q}</span>
                      <span className="text-[11px] text-ink-500 tnum">{faq.answered} answered</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Escalation Panel */}
              <div className="surface-card p-5">
                <h3 className="text-[14px] font-medium text-ink-900 mb-3 flex items-center gap-2">
                  <ArrowRightLeft size={14} /> Human Escalation
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-amber/5 border border-amber/15 rounded">
                    <div className="text-[12px] font-medium text-amber">Mohammed Irfan — ULIP Query</div>
                    <div className="text-[11px] text-ink-500 mt-1">Customer requested detailed fund performance. AI unable to handle market-specific queries.</div>
                    <div className="text-[10px] text-ink-300 mt-1">Escalated 14 min ago · Assigned to: Deepak (Senior RM)</div>
                  </div>
                  <div className="p-3 bg-amber/5 border border-amber/15 rounded">
                    <div className="text-[12px] font-medium text-amber">Ritu Agarwal — Policy Amendment</div>
                    <div className="text-[11px] text-ink-500 mt-1">Customer wants to change nominee. Requires authentication + document upload.</div>
                    <div className="text-[10px] text-ink-300 mt-1">Escalated 28 min ago · Assigned to: Neha (Ops)</div>
                  </div>
                  <div className="p-3 bg-sage/5 border border-sage/15 rounded">
                    <div className="text-[12px] font-medium text-sage">Auto-resolved: 4 calls</div>
                    <div className="text-[11px] text-ink-500 mt-1">All FAQ-based queries handled end-to-end without human intervention.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
