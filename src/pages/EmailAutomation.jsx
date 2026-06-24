import React, { useState, useCallback } from "react";
import {
  Mail, Send, Bot, ArrowRightLeft, Tag as TagIcon, Clock,
  CheckCircle2, AlertTriangle, RotateCcw, FileText, User, Sparkles,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { Tag } from "../components/ui";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

// Dummy incoming emails from Salesforce
const INCOMING_EMAILS = [
  {
    id: "EM-4001",
    from: "suresh.menon@gmail.com",
    customerName: "Suresh Menon",
    subject: "Claim status for accident case - Policy #MOT-2024-8834",
    body: "Dear Sir/Madam, I had filed a claim for my car accident that happened on 5th November. My policy number is MOT-2024-8834. It has been 10 days and I haven't received any update. Please let me know the current status of my claim. Regards, Suresh Menon",
    received: "10 min ago",
    category: "query",
    intent: "Claim Status Inquiry",
    sentiment: "frustrated",
    priority: "high",
    hasAttachment: false,
    customerHistory: { totalPolicies: 2, claimsCount: 1, tenure: "3 years", tier: "Gold" },
  },
  {
    id: "EM-4002",
    from: "lakshmi.r@outlook.com",
    customerName: "Lakshmi Raghavan",
    subject: "Request to change address in my health policy",
    body: "Hi, I have recently shifted to a new address. My policy number is HLT-2024-1122. Kindly update my address to: 42, 3rd Cross, Jayanagar, Bangalore - 560041. I have attached my Aadhaar card for verification. Thank you.",
    received: "25 min ago",
    category: "request",
    intent: "Address Change",
    sentiment: "neutral",
    priority: "medium",
    hasAttachment: true,
    customerHistory: { totalPolicies: 1, claimsCount: 0, tenure: "1 year", tier: "Silver" },
  },
  {
    id: "EM-4003",
    from: "amit.joshi@corporate.co",
    customerName: "Amit Joshi",
    subject: "Group policy renewal for 250 employees",
    body: "Dear Team, Our group health insurance policy (GRP-2023-5500) is due for renewal next month. We would like to discuss revised terms for 250 employees. Can someone from your corporate team connect with us this week? Best, Amit Joshi, HR Director",
    received: "1 hour ago",
    category: "request",
    intent: "Policy Renewal — Corporate",
    sentiment: "neutral",
    priority: "high",
    hasAttachment: false,
    customerHistory: { totalPolicies: 1, claimsCount: 12, tenure: "5 years", tier: "Platinum" },
  },
  {
    id: "EM-4004",
    from: "neeta.bhat@yahoo.com",
    customerName: "Neeta Bhat",
    subject: "Unhappy with claim rejection - VERY URGENT",
    body: "This is unacceptable! My claim CL-2024-9981 was rejected without proper explanation. I have been paying premiums for 4 years. I need a callback from your manager immediately or I will escalate to IRDAI. This is my third email regarding this matter.",
    received: "2 hours ago",
    category: "complaint",
    intent: "Claim Rejection Dispute",
    sentiment: "angry",
    priority: "critical",
    hasAttachment: true,
    customerHistory: { totalPolicies: 3, claimsCount: 4, tenure: "4 years", tier: "Gold" },
  },
  {
    id: "EM-4005",
    from: "rahul.dev@gmail.com",
    customerName: "Rahul Dev",
    subject: "How to add my wife as nominee?",
    body: "Hello, I purchased a term plan last month (TERM-2024-3321). I want to add my wife as the nominee. What documents are needed and how can I do this online? Thanks, Rahul",
    received: "3 hours ago",
    category: "query",
    intent: "Nominee Addition Inquiry",
    sentiment: "neutral",
    priority: "low",
    hasAttachment: false,
    customerHistory: { totalPolicies: 1, claimsCount: 0, tenure: "1 month", tier: "Bronze" },
  },
];

// Pre-generated AI responses (fallback if Gemini not available)
const FALLBACK_RESPONSES = {
  "EM-4001": "Dear Mr. Menon,\n\nThank you for reaching out regarding your claim (Policy: MOT-2024-8834). I understand your concern about the delay.\n\nYour claim is currently in the assessment stage. Our surveyor completed the vehicle inspection on November 12th, and the report is under review. You should receive a settlement decision within the next 3 working days.\n\nFor real-time tracking, you can check the status on our app under 'My Claims'.\n\nApologies for the delay, and thank you for your patience.\n\nBest regards,\nFirst AI Insurance Support",
  "EM-4002": "Dear Ms. Raghavan,\n\nThank you for informing us about your address change. We have received your request for policy HLT-2024-1122.\n\nWe have verified your Aadhaar document. Your address has been updated to:\n42, 3rd Cross, Jayanagar, Bangalore - 560041\n\nThe updated policy document will be sent to your registered email within 24 hours.\n\nBest regards,\nFirst AI Insurance Support",
  "EM-4005": "Dear Mr. Dev,\n\nThank you for your query regarding nominee addition for policy TERM-2024-3321.\n\nTo add your wife as a nominee, you'll need:\n1. Nominee's Aadhaar/PAN card copy\n2. Marriage certificate\n3. Signed nominee change form (available on our portal)\n\nYou can complete this online through: My Account → Policy → Manage Nominee.\n\nThe update takes 2-3 working days after document verification.\n\nBest regards,\nFirst AI Insurance Support",
};

const sentimentColor = (s) => {
  switch (s) {
    case "angry": return "critical";
    case "frustrated": return "warning";
    default: return "neutral";
  }
};

const priorityColor = (p) => {
  switch (p) {
    case "critical": return "critical";
    case "high": return "warning";
    case "medium": return "brand";
    default: return "neutral";
  }
};

export default function EmailAutomation() {
  const [selectedEmail, setSelectedEmail] = useState(INCOMING_EMAILS[0]);
  const [aiResponse, setAiResponse] = useState("");
  const [generating, setGenerating] = useState(false);
  const [routingDecision, setRoutingDecision] = useState(null);

  const generateResponse = useCallback(async () => {
    setGenerating(true);
    setAiResponse("");
    setRoutingDecision(null);

    // Determine routing
    const routing = selectedEmail.category === "complaint" || selectedEmail.priority === "critical"
      ? { team: "Escalation Desk", reason: "Complaint + High sentiment negativity", auto: false }
      : selectedEmail.intent.includes("Corporate")
        ? { team: "Corporate Relations", reason: "Enterprise client renewal", auto: false }
        : { team: "Auto-Response", reason: "Standard query — AI can handle", auto: true };

    setRoutingDecision(routing);

    const prompt = `You are a professional insurance customer support AI. Generate a helpful, empathetic response to this customer email.

Customer: ${selectedEmail.customerName}
Subject: ${selectedEmail.subject}
Email Body: ${selectedEmail.body}
Customer Tier: ${selectedEmail.customerHistory.tier}
Intent Classified As: ${selectedEmail.intent}
Sentiment: ${selectedEmail.sentiment}

Guidelines:
- Be professional and empathetic
- Address their specific concern
- Provide actionable next steps
- Keep it concise (under 150 words)
- Sign off as "First AI Insurance Support"`;

    // --- OpenRouter GPT-4 (active) ---
    if (OPENROUTER_API_KEY && OPENROUTER_API_KEY !== "YOUR_OPENROUTER_API_KEY_HERE") {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "First AI Insurance",
          },
          body: JSON.stringify({
            model: "openai/gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.choices?.[0]?.message?.content;
          if (text) {
            setAiResponse(text);
            setGenerating(false);
            return;
          }
        } else {
          console.warn(`OpenRouter API error: ${res.status}`);
        }
      } catch (err) {
        console.warn("OpenRouter API call failed:", err.message);
      }
    }

    // --- Gemini API (kept intact but inactive — uncomment to use) ---
    /*
    if (GEMINI_API_KEY && GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE") {
      const maxRetries = 3;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": GEMINI_API_KEY,
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
              }),
            }
          );

          if (res.ok) {
            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              setAiResponse(text);
              setGenerating(false);
              return;
            }
          } else if (res.status === 429) {
            const delay = Math.pow(2, attempt + 1) * 1000;
            console.warn(`Gemini 429 rate limited. Retrying in ${delay / 1000}s (attempt ${attempt + 1}/${maxRetries})...`);
            await new Promise((r) => setTimeout(r, delay));
            continue;
          } else {
            console.warn(`Gemini API error: ${res.status}`);
            break;
          }
        } catch (err) {
          console.warn("Gemini API call failed:", err.message);
          break;
        }
      }
    }
    */

    // Fallback to pre-generated responses
    setTimeout(() => {
      setAiResponse(
        FALLBACK_RESPONSES[selectedEmail.id] ||
        `Dear ${selectedEmail.customerName},\n\nThank you for reaching out. We have received your email regarding "${selectedEmail.intent}". Our team is reviewing your request and will get back to you within 24 hours.\n\nBest regards,\nFirst AI Insurance Support`
      );
      setGenerating(false);
    }, 1500);
  }, [selectedEmail]);

  return (
    <div data-testid="email-automation-page">
      <PageHeader
        eyebrow="Insurance AI · Email Automation"
        title="Smart Email Processing"
        lede="AI reads customer emails, classifies intent, generates responses for common issues, and routes complex requests to relevant teams. Powered by Gemini."
      />

      <div className="px-6 lg:px-10 py-8 max-w-[1600px] mx-auto">
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <div className="kpi-card">
            <div className="kpi-label">Emails Today</div>
            <div className="kpi-value">156</div>
            <div className="kpi-sub">Via Salesforce connector</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Auto-Responded</div>
            <div className="kpi-value text-sage">112</div>
            <div className="kpi-sub">71.8% automation rate</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Routed to Teams</div>
            <div className="kpi-value text-amber">31</div>
            <div className="kpi-sub">19.9% manual routing</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Avg Response Time</div>
            <div className="kpi-value">&lt; 2 min</div>
            <div className="kpi-sub">↓ 94% vs manual</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">CSAT Score</div>
            <div className="kpi-value">4.6/5</div>
            <div className="kpi-sub">↑ 0.3 since AI launch</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Email List */}
          <section className="lg:col-span-4">
            <h2 className="section-h mb-4">Incoming Email Queue</h2>
            <div className="surface-card overflow-hidden">
              {INCOMING_EMAILS.map((email) => (
                <button
                  key={email.id}
                  onClick={() => { setSelectedEmail(email); setAiResponse(""); setRoutingDecision(null); }}
                  className={`w-full text-left px-4 py-3 border-b border-surface-divider hover:bg-surface-muted/60 transition-colors ${selectedEmail.id === email.id ? "bg-maroon-tint6" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-ink-900 truncate max-w-[180px]">{email.customerName}</span>
                    <Tag variant={priorityColor(email.priority)}>{email.priority}</Tag>
                  </div>
                  <div className="text-[12px] text-ink-900 mt-1 truncate">{email.subject}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Tag variant={sentimentColor(email.sentiment)}>{email.sentiment}</Tag>
                    <span className="text-[10px] text-ink-300">{email.received}</span>
                    {email.hasAttachment && <FileText size={10} className="text-ink-500" />}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Email Detail + AI Response */}
          <section className="lg:col-span-8 space-y-6">
            {/* Email Content */}
            <div className="surface-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-muted rounded-full flex items-center justify-center">
                      <User size={14} className="text-ink-500" />
                    </div>
                    <div>
                      <div className="text-[14px] font-medium text-ink-900">{selectedEmail.customerName}</div>
                      <div className="text-[11px] text-ink-500">{selectedEmail.from} · {selectedEmail.received}</div>
                    </div>
                  </div>
                  <div className="text-[14px] text-ink-900 font-medium mt-3">{selectedEmail.subject}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Tag variant={priorityColor(selectedEmail.priority)}>{selectedEmail.priority}</Tag>
                  <Tag variant="brand">{selectedEmail.category}</Tag>
                </div>
              </div>

              <div className="mt-4 p-4 bg-surface-muted/50 rounded text-[13px] text-ink-900 leading-relaxed whitespace-pre-wrap">
                {selectedEmail.body}
              </div>

              {/* AI Classification */}
              <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-surface-divider">
                <div>
                  <div className="cap-label">Intent</div>
                  <div className="text-[12px] text-ink-900 mt-1 font-medium">{selectedEmail.intent}</div>
                </div>
                <div>
                  <div className="cap-label">Sentiment</div>
                  <div className="text-[12px] text-ink-900 mt-1 capitalize">{selectedEmail.sentiment}</div>
                </div>
                <div>
                  <div className="cap-label">Customer Tier</div>
                  <div className="text-[12px] text-ink-900 mt-1">{selectedEmail.customerHistory.tier} · {selectedEmail.customerHistory.tenure}</div>
                </div>
                <div>
                  <div className="cap-label">Policies / Claims</div>
                  <div className="text-[12px] text-ink-900 mt-1">{selectedEmail.customerHistory.totalPolicies} policies · {selectedEmail.customerHistory.claimsCount} claims</div>
                </div>
              </div>
            </div>

            {/* AI Response Generator */}
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-medium text-ink-900 flex items-center gap-2">
                  <Sparkles size={14} className="text-maroon" /> AI Generated Response
                </h3>
                <button
                  onClick={generateResponse}
                  disabled={generating}
                  className="btn-primary flex items-center gap-2 text-[12px]"
                >
                  {generating ? <><RotateCcw size={12} className="animate-spin" /> Generating...</> : <><Bot size={12} /> Generate Response</>}
                </button>
              </div>

              {aiResponse ? (
                <div className="space-y-4">
                  <div className="p-4 bg-surface-muted/50 rounded text-[13px] text-ink-900 leading-relaxed whitespace-pre-wrap border-l-2 border-maroon">
                    {aiResponse}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="btn-primary flex items-center gap-2 text-[12px]">
                      <Send size={12} /> Send Response
                    </button>
                    <button onClick={generateResponse} className="btn-ghost flex items-center gap-2 text-[12px]">
                      <RotateCcw size={12} /> Regenerate
                    </button>
                  </div>
                </div>
              ) : !generating ? (
                <div className="p-8 text-center text-[13px] text-ink-500 bg-surface-muted/30 rounded">
                  Click "Generate Response" to have AI draft a reply for this email
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center gap-2 text-[13px] text-ink-500">
                    <RotateCcw size={14} className="animate-spin text-maroon" />
                    Analyzing email and generating response...
                  </div>
                </div>
              )}
            </div>

            {/* Routing Decision */}
            {routingDecision && (
              <div className="surface-card p-5">
                <h3 className="text-[14px] font-medium text-ink-900 flex items-center gap-2 mb-3">
                  <ArrowRightLeft size={14} /> Routing Decision
                </h3>
                <div className={`p-3 rounded border ${routingDecision.auto ? "bg-sage/5 border-sage/20" : "bg-amber/5 border-amber/20"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-[13px] font-medium ${routingDecision.auto ? "text-sage" : "text-amber"}`}>
                        Route to: {routingDecision.team}
                      </div>
                      <div className="text-[11px] text-ink-500 mt-1">{routingDecision.reason}</div>
                    </div>
                    <Tag variant={routingDecision.auto ? "positive" : "warning"}>
                      {routingDecision.auto ? "Auto" : "Manual Review"}
                    </Tag>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
