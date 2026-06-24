import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { Sparkles, X, Send, Wand2 } from "lucide-react";
import { ADVISOR_OPENERS, ADVISOR_SUGGESTIONS, advisorReply } from "../lib/mockData";

const Ctx = createContext(null);

export function AdvisorProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState(null); // e.g. "Anand Mehta"
  const [messages, setMessages] = useState([
    { who: "bot", text: ADVISOR_OPENERS[0] },
  ]);

  const [prefill, setPrefill] = useState("");

  // Listen to global event so any page (or sidebar) can open the drawer.
  useEffect(() => {
    const onOpen = (e) => {
      if (e?.detail?.context) setContext(e.detail.context);
      if (e?.detail?.prompt) {
        setPrefill(e.detail.prompt);
      }
      setOpen(true);
    };
    window.addEventListener("advisor:open", onOpen);
    return () => window.removeEventListener("advisor:open", onOpen);
  }, []);

  const send = (text) => {
    if (!text || !text.trim()) return;
    setMessages((prev) => [...prev, { who: "user", text }]);
    // Simulate latency + reply
    setTimeout(() => {
      setMessages((prev) => [...prev, { who: "bot", text: advisorReply(text) }]);
    }, 420);
  };

  const value = { open, setOpen, context, setContext, messages, send, prefill, setPrefill };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAdvisor = () => useContext(Ctx);

// Convenience: open the drawer from anywhere (used by sidebar).
export const openAdvisor = (context, prompt) => {
  window.dispatchEvent(new CustomEvent("advisor:open", { detail: { context, prompt } }));
};

export function AdvisorFab() {
  const { setOpen } = useAdvisor();
  return (
    <button
      onClick={() => setOpen(true)}
      className="advisor-fab"
      aria-label="Ask Anything — AI Advisor"
      data-testid="advisor-fab"
    >
      <Sparkles size={22} strokeWidth={1.5} />
    </button>
  );
}

export function AdvisorDrawer() {
  const { open, setOpen, context, messages, send, prefill, setPrefill } = useAdvisor();
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // When prefill changes (from opening with prepopulated data), set it into the input
  useEffect(() => {
    if (prefill) {
      setInput(prefill);
      setPrefill("");
    }
  }, [prefill, setPrefill]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  if (!open) return null;

  const submit = (e) => {
    e?.preventDefault?.();
    send(input);
    setInput("");
  };

  return (
    <>
      <div className="advisor-backdrop" onClick={() => setOpen(false)} />
      <aside className="advisor-drawer" data-testid="advisor-drawer" aria-modal="true" role="dialog">
        {/* Header */}
        <div className="px-5 py-4 border-b border-surface-divider flex items-start justify-between">
          <div>
            <div className="cap-label flex items-center gap-2"><Wand2 size={11} /> Ask Anything</div>
            <div className="serif text-[22px] text-ink-900 leading-tight mt-1">AI Advisor</div>
            {context && (
              <div className="text-[11px] text-maroon mt-1.5 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-maroon inline-block" />
                Context · {context}
              </div>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-ink-500 hover:text-ink-900 transition-colors p-1"
            aria-label="Close advisor"
            data-testid="advisor-close"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={m.who === "user" ? "msg-user" : "msg-bot"}>{m.text}</div>
          ))}
        </div>

        {/* Suggestions */}
        <div className="px-5 pb-3">
          <div className="cap-label mb-2">Suggested</div>
          <div className="flex flex-wrap gap-2">
            {ADVISOR_SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s)}
                className="text-[12px] px-3 py-1.5 rounded-full border border-[rgba(156,29,38,0.30)] text-maroon hover:bg-[rgba(156,29,38,0.06)] transition-colors"
                data-testid={`advisor-sugg-${i}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Composer */}
        <form onSubmit={submit} className="border-t border-surface-divider p-3 bg-surface-page flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a customer, a product, a rule…"
            className="flex-1 bg-white border border-surface-rule rounded-md px-3 py-2 text-[13px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-maroon"
            data-testid="advisor-input"
          />
          <button
            type="submit"
            className="btn-primary inline-flex items-center gap-1.5"
            data-testid="advisor-send"
            style={{ padding: "9px 14px" }}
          >
            <Send size={14} />
          </button>
        </form>
      </aside>
    </>
  );
}

// Inline mini-advisor used inside Customer 360. Reuses the global send pipeline.
export function InlineAdvisor({ customer }) {
  const { messages, send } = useAdvisor();
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="surface-card flex flex-col" style={{ minHeight: 360 }}>
      <div className="px-5 py-4 border-b border-surface-divider flex items-center justify-between">
        <div>
          <div className="cap-label flex items-center gap-2"><Sparkles size={11} /> Ask Anything · embedded</div>
          <div className="serif text-[18px] text-ink-900 leading-tight mt-0.5">Advisor on {customer}</div>
        </div>
        <button
          onClick={() => openAdvisor(customer)}
          className="text-[11px] text-maroon font-medium hover:underline"
        >
          Pop out →
        </button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2.5" style={{ maxHeight: 280 }}>
        {messages.slice(-4).map((m, i) => (
          <div key={i} className={m.who === "user" ? "msg-user" : "msg-bot"}>{m.text}</div>
        ))}
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); setInput(""); }}
        className="border-t border-surface-divider p-3 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${customer}…`}
          className="flex-1 bg-white border border-surface-rule rounded-md px-3 py-2 text-[13px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-maroon"
          data-testid="inline-advisor-input"
        />
        <button type="submit" className="btn-primary" style={{ padding: "9px 14px" }}><Send size={14} /></button>
      </form>
    </div>
  );
}
