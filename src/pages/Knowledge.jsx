import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { Tag } from "../components/ui";
import { COMPANY_KNOWLEDGE, RM_DOCS } from "../lib/mockData";
import { UploadCloud, FileText, BookOpen, Search } from "lucide-react";

const TABS = [
  { id: "mine", label: "My documents" },
  { id: "company", label: "Company knowledge" },
];

export default function Knowledge() {
  const [tab, setTab] = useState("mine");
  const [q, setQ] = useState("");

  const docs = tab === "mine" ? RM_DOCS : COMPANY_KNOWLEDGE;
  const filtered = docs.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div data-testid="page-knowledge">
      <PageHeader
        eyebrow="Knowledge Hub"
        title="What you know, and what we know."
        lede="Drop your meeting notes, scripts, and decks here — they become context for your AI Advisor. Company manuals, SOPs and circulars sit alongside, automatically kept current."
      />
      <div className="px-6 lg:px-10 py-9 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-surface-divider pb-3" data-testid="knowledge-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`tab-pill ${tab === t.id ? "active" : ""}`}
                data-testid={`tab-${t.id}`}
              >
                {t.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 bg-white border border-surface-rule rounded-md px-3 py-1.5">
              <Search size={13} strokeWidth={1.5} className="text-ink-300" />
              <input
                type="text"
                placeholder="Search documents…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="bg-transparent outline-none text-[12.5px] text-ink-900 placeholder:text-ink-300 w-52"
              />
            </div>
          </div>

          {/* Upload zone (My documents only) */}
          {tab === "mine" && (
            <div
              className="mt-5 border border-dashed rounded-lg p-7 flex items-center gap-4"
              style={{ borderColor: "rgba(156,29,38,0.40)", background: "rgba(156,29,38,0.04)" }}
              data-testid="upload-zone"
            >
              <div className="w-10 h-10 grid place-items-center rounded-md" style={{ background: "rgba(156,29,38,0.10)", color: "#9C1D26" }}>
                <UploadCloud size={18} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="text-[14px] text-ink-900 font-medium">Drop files to upload</div>
                <div className="text-[12px] text-ink-500 mt-0.5">PDF · DOCX · PPTX · XLSX · images. Up to 50 MB. Files are private to you and indexed for the Advisor.</div>
              </div>
              <button className="btn-primary">Choose files</button>
            </div>
          )}

          {/* Doc list */}
          <div className="surface-card overflow-hidden mt-5">
            <table className="h-table w-full">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Size</th><th>{tab === "mine" ? "Added" : "Owner"}</th><th>{tab === "mine" ? "" : "Updated"}</th></tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-3">
                        <FileText size={15} strokeWidth={1.5} className="text-maroon" />
                        <span className="text-ink-900">{d.name}</span>
                      </div>
                    </td>
                    <td className="text-ink-500"><Tag variant="neutral">{d.type}</Tag></td>
                    <td className="tnum">{d.size}</td>
                    <td className="text-ink-500">{d.added || d.owner}</td>
                    <td className="tnum text-ink-500">{d.updated || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="lg:col-span-4 space-y-5">
          <div className="surface-card p-6 lift-card">
            <div className="cap-label flex items-center gap-2"><BookOpen size={11} /> What your Advisor reads</div>
            <p className="text-[13px] text-ink-900 mt-3 leading-relaxed">
              Both your private documents and the company knowledge base are referenced by the AI Advisor when you ask questions on any page. Your private uploads stay private — they are never used to answer another RM's question.
            </p>
            <ul className="text-[12px] text-ink-500 mt-3 space-y-1 leading-relaxed">
              <li>· Indexed within ~30 seconds of upload</li>
              <li>· Stored in AWS ap-south-1, AES-256 at rest</li>
              <li>· No fine-tuning on your data</li>
            </ul>
          </div>
          <div className="surface-card p-6" style={{ background: "#F2EEE9" }}>
            <div className="serif text-[20px] text-ink-900 leading-snug">Tip</div>
            <p className="text-[12.5px] text-ink-500 mt-2 leading-relaxed">
              Upload your client meeting notes within 24 hours of the meeting. The Advisor's recall on follow-ups improves materially when the source is recent and yours.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
