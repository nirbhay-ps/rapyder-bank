import { Tag, Button, Tooltip } from 'antd';
import { Zap, CheckCircle2, Clock, RotateCcw, AlertCircle } from 'lucide-react';

const actions = [
  { id: 1, action: 'Auto-sent ack to Vikram Patel', tier: 'GREEN', time: '5m', system: 'Outlook', status: 'completed', undoable: true },
  { id: 2, action: 'Birthday greeting queued — Meera Shah', tier: 'YELLOW', time: '12m', system: 'CRM', status: 'pending_review', undoable: true },
  { id: 3, action: 'Expense report submitted (₹2,340)', tier: 'GREEN', time: '30m', system: 'T&E', status: 'completed', undoable: false },
  { id: 4, action: 'Compliance filing — needs approval', tier: 'RED', time: '1h', system: 'Compliance', status: 'awaiting_approval', undoable: false },
  { id: 5, action: 'Meeting notes shared with team', tier: 'GREEN', time: '2h', system: 'Teams', status: 'completed', undoable: true },
];

const tierStyle: Record<string, { bg: string; color: string }> = {
  GREEN: { bg: '#ecfdf5', color: '#047857' },
  YELLOW: { bg: '#fffbeb', color: '#92400e' },
  RED: { bg: '#fef2f2', color: '#991b1b' },
};

const statusIcon: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10b981' }} />,
  pending_review: <Clock style={{ width: '15px', height: '15px', color: '#f59e0b' }} />,
  awaiting_approval: <AlertCircle style={{ width: '15px', height: '15px', color: '#ef4444' }} />,
};

export const AutonomousActions = () => {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <Zap style={{ width: '16px', height: '16px', color: '#8b2252' }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#2d2d2d', fontFamily: 'var(--font-heading)' }}>Actions</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', background: '#ecfdf5', color: '#047857', fontWeight: 700 }}>32</span>
          <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', background: '#fffbeb', color: '#92400e', fontWeight: 700 }}>8</span>
          <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', background: '#fef2f2', color: '#991b1b', fontWeight: 700 }}>2</span>
        </div>
      </div>
      <div>
        {actions.map((a) => {
          const ts = tierStyle[a.tier];
          return (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px var(--card-padding)', borderBottom: '1px solid #f8f5f5' }} className="hover:bg-rose-50/20 transition-colors group">
              {statusIcon[a.status]}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#2d2d2d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.action}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <Tag style={{ fontSize: '9px', padding: '0 5px', background: ts.bg, color: ts.color, border: 'none', fontWeight: 700 }}>{a.tier}</Tag>
                  <span style={{ fontSize: '11px', color: '#aaa' }}>{a.system} · {a.time}</span>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ display: 'flex', gap: '4px' }}>
                {a.status === 'pending_review' && <Button size="small" type="primary" style={{ height: '26px', fontSize: '10px', borderRadius: '6px' }}>Approve</Button>}
                {a.status === 'awaiting_approval' && <Button size="small" type="primary" danger style={{ height: '26px', fontSize: '10px', borderRadius: '6px' }}>Review</Button>}
                {a.undoable && a.status === 'completed' && <Tooltip title="Undo"><Button size="small" icon={<RotateCcw style={{ width: '11px', height: '11px' }} />} style={{ height: '26px', width: '26px', borderRadius: '6px', padding: 0 }} /></Tooltip>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="widget-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', color: '#999' }}>47 today · 140+ target</span>
        <button style={{ fontSize: '12px', fontWeight: 600, color: '#8b2252', background: 'none', border: 'none', cursor: 'pointer' }}>View log →</button>
      </div>
    </div>
  );
}
