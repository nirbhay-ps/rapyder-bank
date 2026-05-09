import { Tag, Button, Tooltip, Tabs, Badge } from 'antd';
import { Mail, Send, Clock, AlertTriangle, CheckCircle2, Sparkles, Inbox, Archive, Star, Paperclip } from 'lucide-react';

const emails = [
  { id: 1, from: 'Rajesh Kumar', subject: 'Portfolio rebalancing discussion', preview: 'Hi Priya, I wanted to discuss the quarterly rebalancing of my equity portfolio...', time: '10 min ago', priority: 'high', aiDraft: true, category: 'Action Required', hasAttachment: false },
  { id: 2, from: 'Anita Desai', subject: 'FD maturity — renewal options', preview: 'My fixed deposit is maturing next week. What are the current rates for renewal?', time: '25 min ago', priority: 'medium', aiDraft: true, category: 'Cross-sell', hasAttachment: false },
  { id: 3, from: 'Compliance Team', subject: 'KYC renewal reminder — 3 clients', preview: 'The following clients have KYC expiring within 30 days and require immediate attention...', time: '1 hr ago', priority: 'high', aiDraft: false, category: 'Compliance', hasAttachment: true },
  { id: 4, from: 'Vikram Patel', subject: 'Thank you for the loan approval', preview: 'Dear Priya, thank you for expediting the home loan approval process...', time: '2 hr ago', priority: 'low', aiDraft: false, category: 'Acknowledgement', hasAttachment: false },
  { id: 5, from: 'Meera Sharma', subject: 'Insurance policy renewal query', preview: 'I received a notification about my term insurance renewal. Could you share the updated premium...', time: '3 hr ago', priority: 'medium', aiDraft: true, category: 'Cross-sell', hasAttachment: true },
  { id: 6, from: 'Suresh Iyer', subject: 'NRI account transfer request', preview: 'I am relocating back to India and would like to convert my NRE account to a resident savings...', time: '4 hr ago', priority: 'high', aiDraft: true, category: 'Action Required', hasAttachment: true },
  { id: 7, from: 'Branch Manager', subject: 'Weekly performance review meeting', preview: 'Please find attached the agenda for this Friday\'s performance review meeting...', time: '5 hr ago', priority: 'low', aiDraft: false, category: 'Internal', hasAttachment: true },
];

const priorityColors = { high: '#ef4444', medium: '#f59e0b', low: '#94a3b8' };
const categoryColors: Record<string, string> = { 'Action Required': 'red', 'Cross-sell': 'purple', 'Compliance': 'orange', 'Acknowledgement': 'green', 'Internal': 'blue' };

const draftPreview = {
  to: 'Rajesh Kumar',
  subject: 'Re: Portfolio rebalancing discussion',
  body: `Dear Rajesh,

Thank you for reaching out regarding your portfolio rebalancing. Based on your current allocation and market conditions, I recommend the following adjustments:

• Increase mid-cap equity allocation from 15% to 20%
• Reduce long-term debt from 30% to 25%
• Maintain large-cap equity at 45%
• Add 10% allocation to international funds

I've attached a detailed analysis report. Shall we schedule a call this week to discuss further?

Best regards,
Priya`,
};

export const EmailPage = () => {
  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mail style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>Email Intelligence</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0' }}>AI reads, classifies, and drafts contextual replies from CRM + Core Banking context.</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#eff6ff', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#2563eb', fontFamily: 'var(--font-heading)' }}>12</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Unread</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f0fdf4', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a', fontFamily: 'var(--font-heading)' }}>8</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>AI Drafted</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fefce8', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#ca8a04', fontFamily: 'var(--font-heading)' }}>3</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Pending</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-[1fr_400px]">
        {/* Inbox */}
        <div className="widget-card">
          <div className="widget-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Inbox style={{ width: '18px', height: '18px', color: '#2563eb' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Smart Inbox</span>
            </div>
            <Tabs size="small" defaultActiveKey="all" items={[
              { key: 'all', label: <Badge count={12} size="small" offset={[8, 0]}>All</Badge> },
              { key: 'action', label: 'Action Required' },
              { key: 'ai', label: 'AI Drafted' },
            ]} style={{ marginBottom: '-18px' }} />
          </div>
          <div>
            {emails.map((email) => (
              <div key={email.id} style={{ padding: '16px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', gap: '14px', alignItems: 'flex-start' }} className="hover:bg-blue-50/30 transition-colors cursor-pointer group">
                <div style={{ marginTop: '4px', color: priorityColors[email.priority as keyof typeof priorityColors] }}>
                  {email.priority === 'high' ? <AlertTriangle style={{ width: '18px', height: '18px' }} /> : email.priority === 'medium' ? <Clock style={{ width: '18px', height: '18px' }} /> : <CheckCircle2 style={{ width: '18px', height: '18px' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{email.from}</span>
                    <Tag color={categoryColors[email.category]} style={{ fontSize: '10px', padding: '0 8px', borderRadius: '5px' }}>{email.category}</Tag>
                    {email.hasAttachment && <Paperclip style={{ width: '13px', height: '13px', color: '#94a3b8' }} />}
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#475569', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email.subject}</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email.preview}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{email.time}</span>
                    {email.aiDraft && (
                      <Tooltip title="AI draft ready for review">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: '#7c3aed', background: '#f5f3ff', padding: '3px 10px', borderRadius: '8px', border: '1px solid #ede9fe' }}>
                          <Sparkles style={{ width: '13px', height: '13px' }} />AI Draft Ready
                        </span>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <Star style={{ width: '16px', height: '16px', color: '#e2e8f0', flexShrink: 0, marginTop: '4px' }} className="group-hover:text-amber-400" />
              </div>
            ))}
          </div>
          <div className="widget-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>View all emails →</button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button size="small" icon={<Archive style={{ width: '14px', height: '14px' }} />} style={{ borderRadius: '8px', fontSize: '12px' }}>Archive Read</Button>
            </div>
          </div>
        </div>

        {/* AI Draft Panel */}
        <div className="widget-card">
          <div className="widget-header">
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles style={{ width: '16px', height: '16px', color: '#7c3aed' }} />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>AI Draft Preview</span>
          </div>
          <div className="widget-body">
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>To: {draftPreview.to}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{draftPreview.subject}</div>
            </div>
            <div style={{ background: '#fafbfd', borderRadius: '10px', padding: '16px', border: '1px solid #f1f5f9', fontSize: '13px', color: '#475569', lineHeight: '1.7', whiteSpace: 'pre-wrap', maxHeight: '360px', overflow: 'auto' }}>
              {draftPreview.body}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <Button type="primary" icon={<Send style={{ width: '14px', height: '14px' }} />} style={{ borderRadius: '8px', flex: 1 }}>Send</Button>
              <Button style={{ borderRadius: '8px', flex: 1 }}>Edit Draft</Button>
            </div>
            <div style={{ marginTop: '12px', padding: '10px', background: '#eff6ff', borderRadius: '8px', fontSize: '12px', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles style={{ width: '14px', height: '14px' }} />
              AI confidence: 94% — Based on CRM history and client preferences
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
