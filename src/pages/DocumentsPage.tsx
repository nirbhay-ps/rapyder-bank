import { Tag } from 'antd';
import { FileText, AlertCircle, Search, Eye, Sparkles } from 'lucide-react';

const documents = [
  { id: 1, name: 'Loan Agreement — Vikram Patel', type: 'Agreement', status: 'approved', date: 'Dec 18, 2024', pages: 12, aiGenerated: true },
  { id: 2, name: 'Portfolio Review Report — Q4 2024', type: 'Report', status: 'draft', date: 'Dec 17, 2024', pages: 8, aiGenerated: true },
  { id: 3, name: 'KYC Verification — Meera Sharma', type: 'KYC', status: 'pending-review', date: 'Dec 16, 2024', pages: 4, aiGenerated: false },
  { id: 4, name: 'Insurance Proposal — Suresh Iyer', type: 'Proposal', status: 'approved', date: 'Dec 15, 2024', pages: 6, aiGenerated: true },
  { id: 5, name: 'NRI Account Transfer Form', type: 'Form', status: 'pending-review', date: 'Dec 14, 2024', pages: 3, aiGenerated: false },
  { id: 6, name: 'Investment Advisory Letter — Anita Desai', type: 'Letter', status: 'draft', date: 'Dec 13, 2024', pages: 2, aiGenerated: true },
  { id: 7, name: 'Compliance Audit Report — Nov 2024', type: 'Report', status: 'approved', date: 'Dec 10, 2024', pages: 15, aiGenerated: false },
];

const aiDrafts = [
  { id: 1, title: 'Cross-sell Proposal: Mutual Fund — Anita Desai', confidence: 94, template: 'Investment Proposal', generatedAt: '2 hrs ago', status: 'ready' },
  { id: 2, title: 'Quarterly Performance Summary — Rajesh Kumar', confidence: 91, template: 'Client Report', generatedAt: '4 hrs ago', status: 'ready' },
  { id: 3, title: 'Account Closure Acknowledgement — Priya Menon', confidence: 88, template: 'Standard Letter', generatedAt: '1 day ago', status: 'needs-review' },
];

const clauseReview = [
  { id: 1, document: 'Loan Agreement — Vikram Patel', clause: 'Interest Rate Clause (Section 4.2)', risk: 'low', suggestion: 'Standard clause — no issues detected', status: 'approved' },
  { id: 2, document: 'Insurance Proposal — Suresh Iyer', clause: 'Exclusion Clause (Section 7.1)', risk: 'medium', suggestion: 'Consider adding natural disaster coverage clarification', status: 'flagged' },
  { id: 3, document: 'NRI Account Transfer Form', clause: 'Tax Liability Declaration', risk: 'high', suggestion: 'Missing DTAA reference — required for NRI accounts', status: 'flagged' },
  { id: 4, document: 'Investment Advisory Letter', clause: 'Risk Disclosure (Section 2)', risk: 'low', suggestion: 'Compliant with SEBI guidelines', status: 'approved' },
];

const statusColors: Record<string, string> = { approved: 'green', draft: 'blue', 'pending-review': 'orange', ready: 'green', 'needs-review': 'orange', flagged: 'red' };
const typeColors: Record<string, string> = { Agreement: 'blue', Report: 'purple', KYC: 'orange', Proposal: 'cyan', Form: 'default', Letter: 'green' };
const riskColors: Record<string, string> = { low: 'green', medium: 'orange', high: 'red' };

export const DocumentsPage = () => {
  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #64748b, #475569)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>Document Intelligence</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0' }}>AI-assisted document generation, review, and classification.</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f1f5f9', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#475569', fontFamily: 'var(--font-heading)' }}>7</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Documents</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f5f3ff', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#7c3aed', fontFamily: 'var(--font-heading)' }}>3</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>AI Drafts</div>
          </div>
        </div>
      </div>

      {/* Document List & AI Drafts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-[1fr_360px]">
        {/* Document List */}
        <div className="widget-card">
          <div className="widget-header">
            <Search style={{ width: '18px', height: '18px', color: '#64748b' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Document Library</span>
          </div>
          <div>
            {documents.map((doc) => (
              <div key={doc.id} style={{ padding: '14px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '12px' }} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText style={{ width: '18px', height: '18px', color: '#64748b' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</span>
                    {doc.aiGenerated && <Sparkles style={{ width: '13px', height: '13px', color: '#7c3aed', flexShrink: 0 }} />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <Tag color={typeColors[doc.type]} style={{ fontSize: '10px', padding: '0 6px' }}>{doc.type}</Tag>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{doc.pages} pages • {doc.date}</span>
                  </div>
                </div>
                <Tag color={statusColors[doc.status]} style={{ fontSize: '10px', flexShrink: 0 }}>{doc.status.replace('-', ' ')}</Tag>
                <Eye style={{ width: '16px', height: '16px', color: '#94a3b8', cursor: 'pointer' }} />
              </div>
            ))}
          </div>
        </div>

        {/* AI Drafts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
          <div className="widget-card">
            <div className="widget-header">
              <Sparkles style={{ width: '18px', height: '18px', color: '#7c3aed' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>AI-Generated Drafts</span>
            </div>
            <div className="widget-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {aiDrafts.map((draft) => (
                <div key={draft.id} style={{ padding: '14px', borderRadius: '10px', border: '1px solid #f1f5f9', background: '#fafbfd' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{draft.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <Tag style={{ fontSize: '10px' }}>{draft.template}</Tag>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{draft.generatedAt}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 600 }}>Confidence: {draft.confidence}%</span>
                    <Tag color={statusColors[draft.status]} style={{ fontSize: '10px' }}>{draft.status.replace('-', ' ')}</Tag>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clause Review Queue */}
          <div className="widget-card">
            <div className="widget-header">
              <AlertCircle style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Clause Review</span>
            </div>
            <div>
              {clauseReview.map((item) => (
                <div key={item.id} style={{ padding: '12px var(--card-padding)', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>{item.clause}</span>
                    <Tag color={riskColors[item.risk]} style={{ fontSize: '9px', padding: '0 5px' }}>{item.risk}</Tag>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{item.document}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontStyle: 'italic' }}>{item.suggestion}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
