import { Tag, Segmented, Timeline } from 'antd';
import { Sparkles, CheckCircle2, Clock, AlertTriangle, RotateCcw, Shield, Activity } from 'lucide-react';

const actionLog = [
  { id: 1, action: 'Auto-sent birthday greeting to Vikram Patel', tier: 'GREEN', system: 'CRM', time: '5 min ago', status: 'completed', undoable: true },
  { id: 2, action: 'Scheduled KYC reminder email to 3 clients', tier: 'GREEN', system: 'Email', time: '15 min ago', status: 'completed', undoable: true },
  { id: 3, action: 'Updated portfolio allocation — Rajesh Kumar', tier: 'YELLOW', system: 'Core Banking', time: '30 min ago', status: 'pending-approval', undoable: false },
  { id: 4, action: 'Initiated FD renewal process — Anita Desai', tier: 'YELLOW', system: 'Core Banking', time: '1 hr ago', status: 'completed', undoable: true },
  { id: 5, action: 'Flagged suspicious transaction — Account #4521', tier: 'RED', system: 'Fraud Detection', time: '2 hr ago', status: 'escalated', undoable: false },
  { id: 6, action: 'Auto-generated quarterly report for branch', tier: 'GREEN', system: 'Reporting', time: '3 hr ago', status: 'completed', undoable: false },
  { id: 7, action: 'Cross-system data sync — CRM to Core Banking', tier: 'GREEN', system: 'Integration', time: '4 hr ago', status: 'completed', undoable: false },
  { id: 8, action: 'Loan pre-approval initiated — Suresh Iyer', tier: 'RED', system: 'Lending', time: '5 hr ago', status: 'pending-approval', undoable: false },
  { id: 9, action: 'Meeting notes auto-synced to CRM', tier: 'GREEN', system: 'CRM', time: '6 hr ago', status: 'completed', undoable: true },
  { id: 10, action: 'Insurance claim escalation — Priority override', tier: 'RED', system: 'Insurance', time: '1 day ago', status: 'completed', undoable: false },
];

const undoHistory = [
  { action: 'Reverted: Auto-sent follow-up email to Meera Sharma', time: 'Dec 17, 3:45 PM', reason: 'Client requested no contact this week' },
  { action: 'Reverted: Calendar block for training session', time: 'Dec 16, 11:20 AM', reason: 'Conflicting client meeting' },
  { action: 'Reverted: Auto-categorized email as low priority', time: 'Dec 15, 9:15 AM', reason: 'Incorrectly classified — was urgent' },
];

const tierColors: Record<string, { bg: string; text: string; tag: string }> = {
  GREEN: { bg: '#f0fdf4', text: '#16a34a', tag: 'green' },
  YELLOW: { bg: '#fffbeb', text: '#d97706', tag: 'orange' },
  RED: { bg: '#fef2f2', text: '#dc2626', tag: 'red' },
};

const statusConfig: Record<string, { color: string; label: string }> = {
  'completed': { color: 'green', label: 'Completed' },
  'pending-approval': { color: 'orange', label: 'Pending Approval' },
  'escalated': { color: 'red', label: 'Escalated' },
};

export const ActionsPage = () => {
  const greenCount = actionLog.filter(a => a.tier === 'GREEN').length;
  const yellowCount = actionLog.filter(a => a.tier === 'YELLOW').length;
  const redCount = actionLog.filter(a => a.tier === 'RED').length;

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>Autonomous Actions</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0' }}>Cross-system action execution across integrated platforms.</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f0fdf4', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a', fontFamily: 'var(--font-heading)' }}>{greenCount}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Auto (Green)</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fffbeb', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#d97706', fontFamily: 'var(--font-heading)' }}>{yellowCount}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Confirm (Yellow)</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fef2f2', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#dc2626', fontFamily: 'var(--font-heading)' }}>{redCount}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Escalate (Red)</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-[1fr_340px]">
        {/* Action Log */}
        <div className="widget-card">
          <div className="widget-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Activity style={{ width: '18px', height: '18px', color: '#8b5cf6' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Action Log</span>
            </div>
            <Segmented options={['All', 'GREEN', 'YELLOW', 'RED']} size="small" />
          </div>
          <div>
            {actionLog.map((item) => (
              <div key={item.id} style={{ padding: '14px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '14px' }} className="hover:bg-violet-50/20 transition-colors">
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: tierColors[item.tier].bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.tier === 'GREEN' ? <CheckCircle2 style={{ width: '18px', height: '18px', color: tierColors[item.tier].text }} /> :
                   item.tier === 'YELLOW' ? <Clock style={{ width: '18px', height: '18px', color: tierColors[item.tier].text }} /> :
                   <AlertTriangle style={{ width: '18px', height: '18px', color: tierColors[item.tier].text }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.action}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <Tag color={tierColors[item.tier].tag} style={{ fontSize: '10px', padding: '0 6px' }}>{item.tier}</Tag>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.system}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>• {item.time}</span>
                  </div>
                </div>
                <Tag color={statusConfig[item.status].color} style={{ fontSize: '10px', flexShrink: 0 }}>{statusConfig[item.status].label}</Tag>
                {item.undoable && (
                  <button style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b' }}>
                    <RotateCcw style={{ width: '12px', height: '12px' }} /> Undo
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
          {/* Tier Legend */}
          <div className="widget-card">
            <div className="widget-header">
              <Shield style={{ width: '18px', height: '18px', color: '#64748b' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Action Tiers</span>
            </div>
            <div className="widget-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a' }}>🟢 GREEN — Auto-execute</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Low-risk actions executed automatically. Undoable within 30 min.</div>
              </div>
              <div style={{ padding: '12px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#d97706' }}>🟡 YELLOW — Confirm</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Medium-risk actions requiring RM confirmation before execution.</div>
              </div>
              <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626' }}>🔴 RED — Escalate</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>High-risk actions requiring manager/compliance approval.</div>
              </div>
            </div>
          </div>

          {/* Undo History */}
          <div className="widget-card">
            <div className="widget-header">
              <RotateCcw style={{ width: '18px', height: '18px', color: '#64748b' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Undo History</span>
            </div>
            <div className="widget-body">
              <Timeline items={undoHistory.map(item => ({
                color: 'gray',
                children: (
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>{item.action}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{item.time}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontStyle: 'italic' }}>Reason: {item.reason}</div>
                  </div>
                ),
              }))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
