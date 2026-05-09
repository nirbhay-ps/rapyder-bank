import { Tag, Progress, Tooltip } from 'antd';
import { Target, Star, Clock } from 'lucide-react';

const tasks = [
  { id: 1, title: 'Call Rajesh Kumar — portfolio review', score: 95, type: 'Call', managerPick: true, dueIn: '2h' },
  { id: 2, title: 'Submit KYC renewal — 3 clients', score: 88, type: 'Compliance', dueIn: '1d' },
  { id: 3, title: 'Cross-sell: MF pitch to Anita Desai', score: 82, type: 'Cross-sell', dueIn: '3d' },
  { id: 4, title: 'Review AI-drafted emails (4)', score: 75, type: 'Email', dueIn: '4h' },
  { id: 5, title: 'Anti-phishing training module', score: 60, type: 'Learning', dueIn: '5d' },
];

const typeColors: Record<string, string> = { Call: 'blue', Compliance: 'orange', 'Cross-sell': 'purple', Email: 'cyan', Learning: 'green' };

export const PriorityStack = () => {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <Target style={{ width: '16px', height: '16px', color: '#8b2252' }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#2d2d2d', fontFamily: 'var(--font-heading)' }}>Priority</span>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#999', background: '#f5f0f0', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>AI-ranked</span>
      </div>
      <div>
        {tasks.map((task, i) => (
          <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px var(--card-padding)', borderBottom: '1px solid #f8f5f5' }} className="hover:bg-rose-50/20 transition-colors cursor-pointer group">
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', width: '18px', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>{i + 1}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#2d2d2d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
                {task.managerPick && <Tooltip title="Manager's Pick"><Star style={{ width: '13px', height: '13px', color: '#f59e0b', fill: '#f59e0b', flexShrink: 0 }} /></Tooltip>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <Tag color={typeColors[task.type]} style={{ fontSize: '10px', padding: '0 5px' }}>{task.type}</Tag>
                <span style={{ fontSize: '11px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '3px' }}><Clock style={{ width: '11px', height: '11px' }} />{task.dueIn}</span>
              </div>
            </div>
            <Progress type="circle" percent={task.score} size={30} strokeWidth={10} strokeColor={task.score >= 90 ? '#8b2252' : task.score >= 75 ? '#f59e0b' : '#10b981'} format={(p) => <span style={{ fontSize: '9px', fontWeight: 700 }}>{p}</span>} />
          </div>
        ))}
      </div>
    </div>
  );
}
