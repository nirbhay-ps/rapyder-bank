import { Tag, Button, Tooltip } from 'antd';
import { Mail, Send, Clock, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';

const emails = [
  { id: 1, from: 'Rajesh Kumar', subject: 'Portfolio rebalancing discussion', time: '10 min ago', priority: 'high', aiDraft: true, category: 'Action Required' },
  { id: 2, from: 'Anita Desai', subject: 'FD maturity — renewal options', time: '25 min ago', priority: 'medium', aiDraft: true, category: 'Cross-sell' },
  { id: 3, from: 'Compliance Team', subject: 'KYC renewal reminder — 3 clients', time: '1 hr ago', priority: 'high', category: 'Compliance' },
  { id: 4, from: 'Vikram Patel', subject: 'Thank you for the loan approval', time: '2 hr ago', priority: 'low', aiDraft: false, category: 'Acknowledgement' },
];

const priorityColors = { high: '#8b2252', medium: '#f59e0b', low: '#bbb' };
const categoryColors: Record<string, string> = { 'Action Required': 'red', 'Cross-sell': 'purple', 'Compliance': 'orange', 'Acknowledgement': 'green' };

export const EmailIntelligence = () => {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <Mail style={{ width: '16px', height: '16px', color: '#8b2252' }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#2d2d2d', fontFamily: 'var(--font-heading)' }}>Emails</span>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#8b2252', fontWeight: 600 }}>12 new</span>
      </div>
      <div>
        {emails.map((email) => (
          <div key={email.id} style={{ padding: '14px var(--card-padding)', borderBottom: '1px solid #f8f5f5' }} className="hover:bg-rose-50/30 transition-colors cursor-pointer group">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ marginTop: '3px', color: priorityColors[email.priority as keyof typeof priorityColors] }}>
                {email.priority === 'high' ? <AlertTriangle style={{ width: '15px', height: '15px' }} /> : email.priority === 'medium' ? <Clock style={{ width: '15px', height: '15px' }} /> : <CheckCircle2 style={{ width: '15px', height: '15px' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#2d2d2d' }}>{email.from}</span>
                  <Tag color={categoryColors[email.category]} style={{ fontSize: '10px', padding: '0 6px' }}>{email.category}</Tag>
                </div>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email.subject}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#aaa' }}>{email.time}</span>
                  {email.aiDraft && (
                    <Tooltip title="AI draft ready">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600, color: '#8b2252', background: '#fdf2f8', padding: '2px 8px', borderRadius: '5px' }}>
                        <Sparkles style={{ width: '11px', height: '11px' }} />Draft
                      </span>
                    </Tooltip>
                  )}
                </div>
              </div>
              {email.aiDraft && (
                <Button type="primary" size="small" icon={<Send style={{ width: '12px', height: '12px' }} />} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontSize: '11px', height: '28px', borderRadius: '7px' }}>
                  Review
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="widget-footer">
        <button style={{ fontSize: '12px', fontWeight: 600, color: '#8b2252', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
      </div>
    </div>
  );
}
