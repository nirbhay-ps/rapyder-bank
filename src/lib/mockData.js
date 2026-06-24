// Centralized mock data for the First AI Workspace prototype.
// All content here is illustrative and does not reflect real customer information.

export const ME = {
  name: "Priya Sharma", // fallback only — components should use user.display_name
  initials: "PS",
  role: "Senior Relationship Manager",
  branch: "Mumbai — Worli Sea Face",
  employeeId: "EMP-018342",
  portfolioAum: "₹ 412.6 Cr",
  activeClients: 96,
  complianceScore: 100,
  rank: 3,
  tierPoints: 12480,
  badges: ["Top Cross-Sell Q3", "Zero SLA Breach 2025", "Compliance Champion"],
};

/**
 * Returns a ME object with the logged-in user's name/initials.
 * @param {Object} user - The user object from AuthContext (display_name, first_name, last_name)
 */
export function getMeForUser(user) {
  if (!user) return ME;
  const initials = ((user.first_name?.[0] || "") + (user.last_name?.[0] || "")).toUpperCase() || "??";
  return {
    ...ME,
    name: user.display_name || ME.name,
    initials,
  };
}

export const ROLES = [
  { id: "rm", label: "Relationship Manager" },
  { id: "branch", label: "Branch Manager" },
  { id: "compliance", label: "Compliance Officer" },
  { id: "admin", label: "System Administrator" },
];

export const PRIORITY_TASKS = [
  {
    id: "T-2041", score: 94,
    title: "Renew term sheet — Anand Mehta (HNI)",
    customer: "Anand Mehta", aum: "₹ 38.4 Cr",
    rationale: "Term deposit of ₹12.0 Cr matures in 6 days. 3 outbound calls pending. Cross-sell propensity 0.81.",
    sla: "06d 14h", managersPick: true, tier: "yellow",
  },
  {
    id: "T-2042", score: 87,
    title: "KYC re-verification — Saraswati Textiles Pvt. Ltd.",
    customer: "Saraswati Textiles", aum: "₹ 22.1 Cr",
    rationale: "RBI-mandated periodic re-KYC due in 11 days. Two documents missing.",
    sla: "11d 02h", managersPick: false, tier: "red",
  },
  {
    id: "T-2043", score: 81,
    title: "Portfolio review meeting — Kavita Reddy",
    customer: "Kavita Reddy", aum: "₹ 14.6 Cr",
    rationale: "Last review > 95 days ago. Sentiment from last call: neutral-trending-negative.",
    sla: "03d 18h", managersPick: false, tier: "yellow",
  },
  {
    id: "T-2044", score: 72,
    title: "Festival greeting — Diwali block (28 clients)",
    customer: "Cohort: HNI · NRI", aum: "—",
    rationale: "Auto-personalized greetings drafted. Approve to send 2025-10-31.",
    sla: "12d", managersPick: false, tier: "green",
  },
  {
    id: "T-2045", score: 64,
    title: "Cross-sell — Home loan top-up to Ramesh Iyer",
    customer: "Ramesh Iyer", aum: "₹ 4.9 Cr",
    rationale: "Salary credit ↑ 38% YoY. CIBIL 814. Pre-approved limit ₹ 1.20 Cr.",
    sla: "—", managersPick: false, tier: "yellow",
  },
];

// SmartInbox messages — `category` ∈ Information|Action|Resolved
//                       `subcat`   ∈ actioned|missed|escalated|—
export const SMART_INBOX = [
  { id: "M-9821", from: "Anand Mehta", company: "Mehta & Co.",
    subject: "Re: Renewal options for FD ledger #44219",
    received: "08:14", tier: "yellow", category: "Action", subcat: "actioned", sentiment: "positive",
    summaryShort: "Yields ask · 18m vs 24m · Decision in 3 days",
    summary: "Client asks for indicative yield on 18-month vs 24-month with quarterly payout. Wants to compare against competitor offer he received from HDFC Wealth.",
    customerId: "C-44219",
    draft:
      "Dear Mr. Mehta,\n\nThank you for the prompt response. For your ₹12.00 Cr block, our indicative yields are 7.35% p.a. (18-month, quarterly payout) and 7.55% p.a. (24-month, quarterly payout). Both options carry premature-withdrawal penalty of 0.50%. I have attached the term sheet for your review.\n\nWarm regards,\n{{USER_NAME}}",
  },
  { id: "M-9822", from: "Compliance — Mumbai Region", company: "Internal",
    subject: "Pending: Re-KYC for Saraswati Textiles",
    received: "07:42", tier: "red", category: "Action", subcat: "escalated", sentiment: "negative",
    summaryShort: "Two docs missing · Escalated · 11 days to filing",
    summary: "Two documents missing: latest board resolution, beneficial ownership declaration. Compliance has marked this for escalation before EOD.",
    customerId: "C-71204",
    draft:
      "Marked for manual review. AI has prepared a customer-facing email requesting the missing documents — open the draft to inspect before approval.",
  },
  { id: "M-9823", from: "Kavita Reddy", company: "Reddy Holdings",
    subject: "Quarterly review — can we shift to next Tuesday?",
    received: "Yesterday", tier: "green", category: "Resolved", subcat: "actioned", sentiment: "neutral",
    summaryShort: "Reschedule · Tue 21 Oct · Confirmed",
    summary: "Reschedule request acknowledged. Calendar slot proposed: Tue 21 Oct, 11:00. Client agreed, calendar invite issued.",
    customerId: "C-30188",
    draft:
      "Dear Ms. Reddy,\n\nNoted — I have moved our review to Tuesday, 21 October at 11:00 IST. A revised calendar invite is on its way.\n\nWarm regards,\n{{USER_FIRST_NAME}}",
  },
  { id: "M-9824", from: "Ramesh Iyer", company: "Iyer Industries",
    subject: "Home loan top-up — what is the rate?",
    received: "Yesterday", tier: "yellow", category: "Action", subcat: "missed", sentiment: "positive",
    summaryShort: "Top-up rate ask · ₹1.20 Cr pre-approved · SLA missed by 3h",
    summary: "Pre-approved limit ₹1.20 Cr. Indicative ROI 8.65% floating. SLA missed by 3 hours — requires apology + rate hold offer.",
    customerId: "C-50912",
    draft:
      "Dear Mr. Iyer,\n\nApologies for the delay. Basis your salary inflows and credit profile, you are pre-approved for a top-up of up to ₹1.20 Cr at 8.65% floating, repayable over the residual tenure of your existing loan. I'll keep this offer reserved till Friday.\n\nWarm regards,\n{{USER_FIRST_NAME}}",
  },
  { id: "M-9825", from: "RBI Newsletter", company: "Information",
    subject: "Quarterly NBFC disclosure — format change effective 1 Nov",
    received: "Mon", tier: "green", category: "Information", subcat: "—", sentiment: "neutral",
    summaryShort: "Format change · 1 Nov · No client action",
    summary: "Disclosure format updated. Operations team has acknowledged. No action required from RM.",
    customerId: null,
    draft: "—",
  },
  { id: "M-9826", from: "Aarav Kapoor", company: "—",
    subject: "Birthday wishes received — thank you",
    received: "Mon", tier: "green", category: "Resolved", subcat: "actioned", sentiment: "positive",
    summaryShort: "Birthday acknowledgement · No further action",
    summary: "Customer thanked for birthday note sent on 22 Oct. Sentiment positive.",
    customerId: "C-22641",
    draft: "—",
  },
];

export const EMAIL_CATEGORIES = [
  { key: "Information", count: 14, sub: { actioned: 12, missed: 0, escalated: 0 }, tone: "neutral" },
  { key: "Action",      count: 9,  sub: { actioned: 5, missed: 2, escalated: 1 },  tone: "warning" },
  { key: "Resolved",    count: 38, sub: { actioned: 38, missed: 0, escalated: 0 }, tone: "positive" },
];

export const ALERTS = [
  { type: "Churn risk", level: "red",     text: "Kavita Reddy — engagement -42% in 60 days. Last meeting 95 days ago.", time: "06:03" },
  { type: "SLA warning", level: "yellow", text: "Anand Mehta — term sheet response window closes in 14h.", time: "07:18" },
  { type: "Festival greeting", level: "green", text: "Diwali greetings ready for 28 HNI / NRI clients. Approve to send.", time: "07:55" },
  { type: "Lifecycle event", level: "green", text: "Birthday — Aarav Kapoor turns 50 on 22 Oct. Personal note suggested.", time: "08:02" },
  { type: "Workload prediction", level: "yellow", text: "Tomorrow 11:00–14:00: 7 high-priority touchpoints overlap. Reschedule one.", time: "08:11" },
];

export const AUTONOMOUS_FEED = [
  { tier: "green", text: "Auto-acknowledged 14 routine queries (SLA < 30 min).", time: "08:42" },
  { tier: "green", text: "Reconciled 96 statement requests via Core Banking connector.", time: "08:31" },
  { tier: "yellow", text: "Drafted 4 mid-risk replies, awaiting RM approval (60s window).", time: "08:21" },
  { tier: "red", text: "Flagged 1 unusual fund transfer ₹2.40 Cr — Compliance review opened.", time: "07:48" },
  { tier: "green", text: "Synced 42 Salesforce activities to Core Banking ledger.", time: "07:30" },
];

export const CUSTOMERS = [
  { id: "C-44219", name: "Anand Mehta", segment: "HNI · Private", aum: "₹ 38.4 Cr", cibil: 826, crossSell: 0.81, churn: 0.12,
    holdings: ["Term deposits", "Mutual funds", "Demat", "Locker", "Private credit"], relationship: "Since 2011", last: "Today, 08:14" },
  { id: "C-71204", name: "Saraswati Textiles Pvt. Ltd.", segment: "Corporate · SME", aum: "₹ 22.1 Cr", cibil: 762, crossSell: 0.54, churn: 0.21,
    holdings: ["CC limit", "Term loan", "Forex", "Trade finance"], relationship: "Since 2017", last: "Yesterday" },
  { id: "C-30188", name: "Kavita Reddy", segment: "HNI · Wealth", aum: "₹ 14.6 Cr", cibil: 791, crossSell: 0.46, churn: 0.58,
    holdings: ["PMS", "Mutual funds", "Demat"], relationship: "Since 2019", last: "12 days ago" },
  { id: "C-50912", name: "Ramesh Iyer", segment: "Affluent", aum: "₹ 4.9 Cr", cibil: 814, crossSell: 0.74, churn: 0.18,
    holdings: ["Home loan", "Salary account", "MF SIP"], relationship: "Since 2014", last: "Yesterday" },
  { id: "C-22641", name: "Aarav Kapoor", segment: "HNI · NRI", aum: "₹ 9.2 Cr", cibil: 802, crossSell: 0.61, churn: 0.14,
    holdings: ["NRE FD", "Demat", "Mutual funds"], relationship: "Since 2016", last: "3 days ago" },
];

// Renewals — RM-scoped only
export const RENEWALS = [
  { customerId: "C-44219", customer: "Anand Mehta", product: "Term deposit · ₹12.0 Cr", maturity: "16 Oct 2025", month: "October", amount: "₹ 12.00 Cr", stage: "Negotiating" },
  { customerId: "C-50912", customer: "Ramesh Iyer", product: "Home loan top-up", maturity: "24 Oct 2025", month: "October", amount: "₹ 1.20 Cr", stage: "Prospecting" },
  { customerId: "C-30188", customer: "Kavita Reddy", product: "PMS mandate renewal", maturity: "06 Nov 2025", month: "November", amount: "₹ 8.40 Cr", stage: "Closing" },
  { customerId: "C-71204", customer: "Saraswati Textiles", product: "CC limit review", maturity: "18 Nov 2025", month: "November", amount: "₹ 6.00 Cr", stage: "Won" },
  { customerId: "C-22641", customer: "Aarav Kapoor", product: "NRE FD ladder", maturity: "02 Dec 2025", month: "December", amount: "₹ 3.10 Cr", stage: "Prospecting" },
  { customerId: "C-44219", customer: "Anand Mehta", product: "Demat AMC renewal", maturity: "21 Dec 2025", month: "December", amount: "—", stage: "Won" },
];

export const SALES_STAGES = ["Prospecting", "Negotiating", "Closing", "Won", "Lost"];

export const COMPLIANCE_ITEMS = [
  { id: "RBI-PFC-Q3", title: "Quarterly NBFC disclosure", due: "31 Oct 2025", status: "On track", tier: "green" },
  { id: "FATCA-2025", title: "FATCA self-certification refresh", due: "12 Nov 2025", status: "2 of 96 pending", tier: "yellow" },
  { id: "AML-PEP-Watchlist", title: "PEP & sanctions watchlist sweep", due: "Continuous", status: "0 hits today", tier: "green" },
  { id: "REKYC-CIBIL", title: "Periodic re-KYC — corporate book", due: "29 Oct 2025", status: "1 escalated", tier: "red" },
];

export const LEADERBOARD = [
  { rank: 1, name: "Vikrant Joshi", branch: "BKC", points: 13620 },
  { rank: 2, name: "Neha Bansal", branch: "Powai", points: 12940 },
  { rank: 3, name: "{{USER_NAME}}", branch: "Worli Sea Face", points: 12480, you: true },
  { rank: 4, name: "Rohit Chandra", branch: "Andheri E.", points: 12120 },
  { rank: 5, name: "Sandhya Pillai", branch: "Lower Parel", points: 11860 },
];

export const BADGES_GRID = [
  { name: "Cross-Sell Champion", desc: "≥ ₹50 Cr fresh business this quarter", earned: true },
  { name: "Zero SLA Breach", desc: "0 breaches across rolling 90 days", earned: true },
  { name: "Compliance 100", desc: "Sustained 100% compliance score", earned: true },
  { name: "Customer Whisperer", desc: "NPS ≥ 75 across portfolio", earned: false },
  { name: "Voice of Reason", desc: "Top 5% positive sentiment outcomes", earned: false },
  { name: "AI Co-Pilot", desc: "≥ 200 AI-drafted replies approved", earned: true },
];

export const LD_TRACKS = [
  { name: "Wealth structuring for Indian HNIs", progress: 72, hours: "8 / 12 hrs" },
  { name: "AML & FATCA — 2025 amendments", progress: 100, hours: "4 / 4 hrs" },
  { name: "Conversational selling for RMs", progress: 35, hours: "2.1 / 6 hrs" },
  { name: "Bond markets — yield curve dynamics", progress: 18, hours: "1.1 / 6 hrs" },
];

export const LD_ASSESSMENTS = [
  {
    id: "A-01",
    track: "AML & FATCA — 2025 amendments",
    title: "AML & FATCA Certification Quiz",
    questions: 15,
    duration: "20 min",
    status: "ready",
    score: null,
    dueDate: "30 May 2026",
  },
  {
    id: "A-02",
    track: "Wealth structuring for Indian HNIs",
    title: "HNI Wealth Structuring — Mid-module Check",
    questions: 10,
    duration: "12 min",
    status: "completed",
    score: 88,
    dueDate: "15 Apr 2026",
  },
  {
    id: "A-03",
    track: "Conversational selling for RMs",
    title: "Objection Handling Scenarios",
    questions: 8,
    duration: "15 min",
    status: "locked",
    score: null,
    dueDate: "15 Jun 2026",
  },
  {
    id: "A-04",
    track: "Bond markets — yield curve dynamics",
    title: "Yield Curve & Duration Basics",
    questions: 12,
    duration: "18 min",
    status: "locked",
    score: null,
    dueDate: "30 Jun 2026",
  },
];

export const TICKER = [
  "NIFTY 50  24,612.40  +0.42%",
  "SENSEX  80,981.12  +0.36%",
  "USD/INR  88.74  -0.12",
  "10Y G-Sec  6.78%  -2 bps",
  "GOLD ₹  74,210/10g  +0.18%",
  "BRENT  $79.40  -0.6%",
  "BANK NIFTY  53,108  +0.51%",
];

export const VOICE_CALLS = [
  { id: "VC-3401", customer: "Anand Mehta", duration: "12:04", sentiment: "positive", actions: 3, time: "Today 08:14",
    summary: ["Client compared 18m vs 24m FD yields against HDFC offer.", "Agreed to receive term sheet today.", "Wants quarterly payout option."] },
  { id: "VC-3402", customer: "Kavita Reddy", duration: "06:42", sentiment: "neutral", actions: 1, time: "Yesterday 17:20",
    summary: ["Reschedule of quarterly review confirmed.", "No portfolio changes discussed."] },
  { id: "VC-3403", customer: "Ramesh Iyer", duration: "04:09", sentiment: "positive", actions: 2, time: "Yesterday 11:55",
    summary: ["Top-up loan rate inquiry.", "Reservation of pre-approved offer until Friday."] },
  { id: "VC-3404", customer: "Saraswati Textiles", duration: "18:30", sentiment: "negative", actions: 4, time: "2 days ago",
    summary: ["Frustration over Re-KYC delays.", "Threat to move CC limit to competitor.", "Two missing documents discussed.", "Compliance escalation initiated."] },
];

export const DOCUMENTS = [
  { id: "DOC-7712", name: "Term sheet — Mehta FD ₹12.0 Cr", type: "Term sheet", status: "Drafted by AI", risk: "Low" },
  { id: "DOC-7713", name: "Re-KYC letter — Saraswati Textiles", type: "KYC", status: "Awaiting approval", risk: "High" },
  { id: "DOC-7714", name: "Portfolio summary — Kavita Reddy Q3", type: "Review", status: "Ready", risk: "Low" },
  { id: "DOC-7715", name: "Sanction letter — Iyer top-up ₹1.2 Cr", type: "Credit", status: "Drafted by AI", risk: "Medium" },
];

export const WORKFLOWS = [
  { name: "FD renewal — HNI", steps: 6, slaH: 24, active: 14 },
  { name: "Periodic Re-KYC — corporate", steps: 9, slaH: 96, active: 7 },
  { name: "Home loan top-up — pre-approved", steps: 5, slaH: 48, active: 3 },
  { name: "NRI account onboarding", steps: 11, slaH: 120, active: 2 },
];

export const PREDICTIONS = [
  { metric: "Cross-sell revenue (next 30d)", value: "₹ 4.20 Cr", delta: "+18%" },
  { metric: "Churn-at-risk AUM", value: "₹ 22.4 Cr", delta: "-6%" },
  { metric: "Workload (next 7d)", value: "118 tasks", delta: "+12%" },
  { metric: "Compliance breach probability", value: "0.6%", delta: "-0.2 pp" },
];

export const SECURITY_EVENTS = [
  { tier: "green", text: "Anomalous login blocked — Tor exit node, IST 02:11.", time: "02:11" },
  { tier: "yellow", text: "Privilege escalation request — Compliance Officer, awaiting 2-of-3 approval.", time: "Yesterday" },
  { tier: "red", text: "RED-tier action — manual transfer override of ₹2.40 Cr (audit logged).", time: "07:48" },
  { tier: "green", text: "MFA enrolment completed for 96 RMs in Mumbai region.", time: "Mon" },
];

// Settings — currently connected
export const ECOSYSTEM = [
  { name: "Outlook", category: "Communication", status: "Healthy", latency: "112 ms" },
  { name: "Salesforce CRM", category: "CRM", status: "Healthy", latency: "186 ms" },
  { name: "Core Banking", category: "Banking", status: "Healthy", latency: "94 ms" },
  { name: "CIBIL", category: "Credit Bureau", status: "Degraded", latency: "612 ms" },
  { name: "HRMS", category: "HR", status: "Healthy", latency: "201 ms" },
  { name: "Zoom / Teams", category: "Meetings", status: "Healthy", latency: "144 ms" },
  { name: "LMS", category: "Learning", status: "Healthy", latency: "228 ms" },
  { name: "Travel Desk", category: "Travel", status: "Healthy", latency: "165 ms" },
  { name: "T&E", category: "Finance", status: "Healthy", latency: "148 ms" },
  { name: "Doc Mgmt", category: "Documents", status: "Healthy", latency: "132 ms" },
  { name: "Slack", category: "Communication", status: "Healthy", latency: "108 ms" },
];

// Available connectors that can be added
export const AVAILABLE_CONNECTORS = [
  { name: "Twilio Voice", category: "Communication", desc: "Programmatic voice for outbound RM calls and IVR." },
  { name: "WhatsApp Business", category: "Messaging", desc: "Customer messaging on the WhatsApp graph API." },
  { name: "ServiceNow", category: "ITSM", desc: "Tickets, change requests, and service catalogue." },
  { name: "Workday", category: "HR", desc: "Headcount, compensation cycles, and PTO." },
  { name: "Bloomberg Terminal", category: "Markets", desc: "Live quotes, fixed-income analytics, news." },
  { name: "DocuSign", category: "Documents", desc: "E-signatures for term sheets and KYC." },
  { name: "Zerodha Kite", category: "Markets", desc: "Demat and order flow integration." },
  { name: "Snowflake", category: "Data", desc: "Warehouse for cross-system analytics." },
];

export const TRAVEL = [
  { id: "TR-501", trip: "Mumbai → Bengaluru", purpose: "Iyer Industries — Q3 review", dates: "22-23 Oct", status: "Booked", amount: "₹ 18,420" },
  { id: "TR-502", trip: "Mumbai → Dubai", purpose: "Aarav Kapoor — NRI portfolio", dates: "04-06 Nov", status: "Pending approval", amount: "₹ 84,900" },
  { id: "EX-220", trip: "Client lunch — Anand Mehta", purpose: "Term sheet discussion", dates: "Today", status: "Receipt captured", amount: "₹ 6,250" },
];

export const CELEBRATIONS = [
  { name: "Vikrant Joshi", reason: "Crossed ₹100 Cr fresh AUM this quarter", when: "Just now" },
  { name: "{{USER_NAME}} (you)", reason: "30 days at 100% compliance score", when: "Today" },
  { name: "Neha Bansal", reason: "Top 1% NPS in Mumbai region", when: "Yesterday" },
];

export const AVATAR_SESSIONS = [
  { id: "AV-101", customer: "Mehta — preliminary FD review", duration: "6:12", state: "Completed", takeaway: "Customer wants 24-month tenure with quarterly payout." },
  { id: "AV-102", customer: "Walk-in inquiry — locker availability", duration: "2:48", state: "Live", takeaway: "Awaiting RM hand-off after KYC step." },
  { id: "AV-103", customer: "Saraswati Textiles — document collection", duration: "4:30", state: "Scheduled", takeaway: "Re-KYC document checklist to be relayed." },
];

// Knowledge Hub
export const COMPANY_KNOWLEDGE = [
  { name: "FD product manual — 2025", type: "PDF", size: "2.4 MB", owner: "Product · Treasury", updated: "2025-09-12" },
  { name: "AML / KYC SOP — v8", type: "PDF", size: "3.1 MB", owner: "Compliance", updated: "2025-08-30" },
  { name: "RBI master circular — NBFC disclosures", type: "PDF", size: "1.6 MB", owner: "Regulatory", updated: "2025-10-01" },
  { name: "Wealth structuring playbook", type: "PDF", size: "5.2 MB", owner: "Private Banking", updated: "2025-07-19" },
  { name: "Brand voice & tone guide", type: "DOCX", size: "640 KB", owner: "Marketing", updated: "2025-05-04" },
  { name: "Term sheet template — HNI", type: "DOCX", size: "180 KB", owner: "Treasury", updated: "2025-09-28" },
];

export const RM_DOCS = [
  { name: "Mehta — handwritten meeting notes (scan)", type: "PDF", size: "1.2 MB", added: "Today" },
  { name: "Reddy — portfolio review prep deck", type: "PPTX", size: "4.8 MB", added: "Yesterday" },
  { name: "My script — corporate cross-sell pitch", type: "DOCX", size: "92 KB", added: "Mon" },
];

// Advisor canned responses (mock)
export const ADVISOR_OPENERS = [
  "I have your customer book and the bank's knowledge in context — what would you like to know?",
  "Ready to help. Ask about a customer, a product, a regulation, or a workflow.",
];

/**
 * Replaces {{USER_NAME}} and {{USER_FIRST_NAME}} placeholders in a string
 * with the logged-in user's actual name.
 * @param {string} text - Text containing placeholders
 * @param {Object} user - User object from AuthContext
 * @returns {string}
 */
export function personalize(text, user) {
  if (!text || !user) return text || "";
  return text
    .replace(/\{\{USER_NAME\}\}/g, user.display_name || "User")
    .replace(/\{\{USER_FIRST_NAME\}\}/g, user.first_name || user.display_name?.split(" ")[0] || "User");
}

/**
 * Returns LEADERBOARD with the logged-in user's name in the "you" slot.
 */
export function getLeaderboard(user) {
  return LEADERBOARD.map((entry) =>
    entry.you ? { ...entry, name: user?.display_name || entry.name } : entry
  );
}

/**
 * Returns CELEBRATIONS with the logged-in user's name.
 */
export function getCelebrations(user) {
  return CELEBRATIONS.map((entry) =>
    entry.name.includes("{{USER_NAME}}")
      ? { ...entry, name: entry.name.replace("{{USER_NAME}}", user?.display_name || "You") }
      : entry
  );
}

/**
 * Returns SMART_INBOX with personalized drafts.
 */
export function getSmartInbox(user) {
  return SMART_INBOX.map((msg) => ({
    ...msg,
    draft: personalize(msg.draft, user),
  }));
}

export const ADVISOR_SUGGESTIONS = [
  "Summarise Anand Mehta's last 30 days",
  "Which renewals are at risk this month?",
  "Draft a Diwali greeting for the HNI cohort",
  "What does RBI's latest NBFC circular change?",
];

// Returns a canned bot response based on the user's message (purely client-side mock).
export function advisorReply(prompt) {
  const p = (prompt || "").toLowerCase();
  if (p.includes("mehta")) {
    return "Anand Mehta — HNI · ₹38.4 Cr AUM · cross-sell propensity 0.81 · churn 0.12. Last interaction: today 08:14 about FD renewal. Next best action: send term sheet for the 24-month option with quarterly payout (your draft is in Smart Inbox). His sentiment over the last four touches is trending positive.";
  }
  if (p.includes("renewal")) {
    return "You have 3 renewals in October totalling ₹13.2 Cr — Mehta FD (Negotiating), Iyer top-up (Prospecting). November adds ₹14.4 Cr. Highest risk: Reddy PMS — engagement is down 42% in 60 days; consider an in-person review before close.";
  }
  if (p.includes("rbi") || p.includes("regulation") || p.includes("compliance")) {
    return "Recent RBI master circular changes the NBFC quarterly disclosure format effective 1 Nov. Operations has acknowledged. No RM action required, but flag to clients holding NBFC paper. Your compliance score remains 100%.";
  }
  if (p.includes("diwali") || p.includes("greeting") || p.includes("festival")) {
    return "AI has drafted personalised Diwali greetings for 28 HNI / NRI clients. Each is tailored using prior interaction tone, language preference and unmet asks. Approve in the Proactive Alerts panel to schedule send for 31 Oct, 09:00 IST.";
  }
  if (p.includes("kyc") || p.includes("saraswati")) {
    return "Saraswati Textiles re-KYC is overdue. Two documents are missing: latest board resolution and beneficial-ownership declaration. A draft email requesting them is in your Smart Inbox (RED tier — manual review). Compliance has escalated.";
  }
  return "On it. Based on your portfolio context: highest-leverage move today is the Mehta FD renewal — drafted reply ready for your nod. Want me to also schedule a follow-up call for tomorrow morning?";
}
