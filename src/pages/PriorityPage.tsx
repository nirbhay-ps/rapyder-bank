import { Tag, Progress, Tooltip, Segmented } from 'antd';
import { Target, Star, Clock, ChevronRight, Filter, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

const tasks = [
  { id: 1, title: 'Call Rajesh Kumar — portfolio review', score: 95, reason: 'High AUM client, SLA due in 2h', type: 'Call', managerPick: true, dueIn: '2h', status: 'pending' },
  { id: 2, title: 'Submit KYC renewal — 3 clients', score: 88, reason: 'Compliance deadline approaching', type: 'Compliance', managerPick: false, dueIn: '1d', status: 'pending' },
  { id: 3, title: 'Cross-sell: Mutual fund pitch to Anita Desai', score: 82, reason: 'FD maturing, high propensity score', type: 'Cross-sell', managerPick: true, dueIn: '3d', status: 'pending' },
  { id: 4, title: 'Review AI-drafted email responses (4)', score: 75, reason: 'Pending approval queue', type: 'Email', managerPick: false, dueIn: '4h', status: 'in-progress' },
  { id: 5, title: 'Complete anti-phishing training module', score: 60, reason: 'L&D recommendation based on gap analysis', type: 'Learning', managerPick: false, dueIn: '5d', status: 'pending' },
  { id: 6, title: 'Follow up with Meera Sharma on insurance', score: 78, reason: 'Cross-sell opportunity, client showed interest', type: 'Cross-sell', managerPick: false, dueIn: '2d', status: 'pending' },
  { id: 7, title: 'Prepare quarterly report for branch review', score: 65, reason: 'Quarterly deadline next week', type: 'Report', managerPick: true, dueIn: '6d', status: 'pending' },
  { id: 8, title: 'Update CRM notes for 5 client meetings', score: 55, reason: 'Data hygiene — notes pending from this week', type: 'Admin', managerPick: false, dueIn: '1d', status: 'in-progress' },
];

const typeColors: Record<string, string> = { Call: 'blue', Compliance: 'orange', 'Cross-sell': 'purple', Email: 'cyan', Learning: 'green', Report: 'geekblue', Admin: 'default' };

export const PriorityPage = () => {
  const managerPicks = tasks.filter(t => t.managerPick);
  const alignmentScore = 87;

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Target style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>Smart Prioritization</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0' }}>AI-scored task queue amplified by manager strategic input.</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#eef2ff', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#4f46e5', fontFamily: 'var(--font-heading)' }}>{tasks.length}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Total Tasks</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fef3c7', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#d97706', fontFamily: 'var(--font-heading)' }}>{managerPicks.length}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Manager Picks</div>
          </div>
        </div>
      </div>

      {/* Alignment Score + Manager Picks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-[1fr_320px]">
        {/* Full Task Queue */}
        <div className="widget-card">
          <div className="widget-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Filter style={{ width: '16px', height: '16px', color: '#4f46e5' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Task Queue</span>
              <Tag color="purple" style={{ fontSize: '11px', borderRadius: '8px', padding: '1px 10px' }}>AI-ranked</Tag>
            </div>
            <Segmented options={['All', 'Pending', 'In Progress']} size="small" />
          </div>
          <div style={{ padding: '8px 0' }}>
            {tasks.map((task, index) => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px var(--card-padding)' }} className="hover:bg-indigo-50/30 transition-colors cursor-pointer group">
                <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#64748b', flexShrink: 0, fontFamily: 'var(--font-heading)' }} className="group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                  {index + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
                    {task.managerPick && (
                      <Tooltip title="Manager's Pick">
                        <Star style={{ width: '15px', height: '15px', color: '#fbbf24', fill: '#fbbf24', flexShrink: 0 }} />
                      </Tooltip>
                    )}
                    {task.status === 'in-progress' && <Tag color="processing" style={{ fontSize: '10px', padding: '0 6px' }}>In Progress</Tag>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                    <Tag color={typeColors[task.type]} style={{ fontSize: '10px', padding: '0 8px', borderRadius: '5px' }}>{task.type}</Tag>
                    <span style={{ fontSize: '12px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.reason}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                  <Progress type="circle" percent={task.score} size={34} strokeWidth={10} strokeColor={task.score >= 90 ? '#ef4444' : task.score >= 75 ? '#f59e0b' : '#10b981'} format={(p) => <span style={{ fontSize: '10px', fontWeight: 700 }}>{p}</span>} />
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8' }}>
                    <Clock style={{ width: '12px', height: '12px' }} />{task.dueIn}
                  </span>
                </div>
                <ChevronRight style={{ width: '16px', height: '16px', color: '#e2e8f0' }} className="group-hover:text-indigo-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
          {/* Alignment Score */}
          <div className="widget-card">
            <div className="widget-header">
              <TrendingUp style={{ width: '18px', height: '18px', color: '#10b981' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Alignment Score</span>
            </div>
            <div className="widget-body" style={{ textAlign: 'center', padding: '24px var(--card-padding)' }}>
              <Progress type="dashboard" percent={alignmentScore} size={120} strokeWidth={10} strokeColor={{ '0%': '#6366f1', '100%': '#10b981' }} format={(p) => <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{p}%</span>} />
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '12px' }}>Your task execution aligns well with manager priorities</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981' }}>
                  <CheckCircle2 style={{ width: '14px', height: '14px' }} /> 5 completed today
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#f59e0b' }}>
                  <AlertCircle style={{ width: '14px', height: '14px' }} /> 2 overdue
                </div>
              </div>
            </div>
          </div>

          {/* Manager's Picks */}
          <div className="widget-card">
            <div className="widget-header">
              <Star style={{ width: '18px', height: '18px', color: '#fbbf24', fill: '#fbbf24' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Manager's Picks</span>
            </div>
            <div className="widget-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {managerPicks.map((task) => (
                <div key={task.id} style={{ padding: '12px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fef3c7' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{task.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <Tag color={typeColors[task.type]} style={{ fontSize: '10px', padding: '0 6px' }}>{task.type}</Tag>
                    <span style={{ fontSize: '11px', color: '#92400e' }}>Due in {task.dueIn}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
