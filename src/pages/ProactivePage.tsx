import { Tag, Timeline, Progress, Avatar } from 'antd';
import { Zap, AlertTriangle, TrendingDown, Calendar, Gift, Bell, Clock, ChevronRight } from 'lucide-react';

const alerts = [
  { id: 1, type: 'churn', title: 'Churn Risk: Meera Sharma', description: 'No interaction in 12 days. AUM decreased 15% last quarter. Recommend immediate outreach.', severity: 'high', time: '2 min ago', icon: TrendingDown },
  { id: 2, type: 'opportunity', title: 'FD Maturity: Anita Desai', description: '₹45L FD maturing in 7 days. High propensity for MF cross-sell based on profile.', severity: 'medium', time: '15 min ago', icon: Calendar },
  { id: 3, type: 'event', title: 'Birthday: Vikram Patel (Tomorrow)', description: 'Premium client birthday. Suggest personalized greeting + exclusive offer.', severity: 'low', time: '1 hr ago', icon: Gift },
  { id: 4, type: 'workload', title: 'Workload Spike Predicted', description: 'Quarter-end approaching. 12 KYC renewals + 5 portfolio reviews due next week.', severity: 'medium', time: '2 hr ago', icon: AlertTriangle },
  { id: 5, type: 'opportunity', title: 'Insurance Renewal: Suresh Iyer', description: 'Term insurance renewal due in 30 days. Opportunity to upgrade coverage.', severity: 'low', time: '3 hr ago', icon: Bell },
];

const predictions = [
  { date: 'Dec 23', event: 'Quarter-end portfolio reviews (8 clients)', status: 'upcoming' },
  { date: 'Dec 25', event: 'Christmas — Festival greeting campaign', status: 'scheduled' },
  { date: 'Dec 28', event: 'KYC batch renewal deadline (3 clients)', status: 'action-needed' },
  { date: 'Jan 1', event: 'New Year — Premium client engagement', status: 'scheduled' },
  { date: 'Jan 5', event: 'Annual review meetings begin', status: 'upcoming' },
  { date: 'Jan 14', event: 'Makar Sankranti — Regional greeting', status: 'scheduled' },
];

const churnRisks = [
  { name: 'Meera Sharma', score: 78, reason: 'Low engagement, AUM decline', lastContact: '12 days', aum: '₹1.2 Cr' },
  { name: 'Priya Menon', score: 65, reason: 'Competitor offer detected', lastContact: '8 days', aum: '₹45 L' },
  { name: 'Amit Gupta', score: 52, reason: 'Service complaint unresolved', lastContact: '15 days', aum: '₹78 L' },
  { name: 'Kavita Reddy', score: 45, reason: 'Reduced transaction frequency', lastContact: '20 days', aum: '₹92 L' },
];

const severityColors = { high: '#ef4444', medium: '#f59e0b', low: '#3b82f6' };
const severityBg = { high: '#fef2f2', medium: '#fffbeb', low: '#eff6ff' };

export const ProactivePage = () => {
  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>Proactive Intelligence</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0' }}>Anticipates needs — festivals, workload spikes, customer lifecycle events.</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fef2f2', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#ef4444', fontFamily: 'var(--font-heading)' }}>4</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Churn Risks</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fffbeb', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#d97706', fontFamily: 'var(--font-heading)' }}>5</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Active Alerts</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-[1fr_360px]">
        {/* Alert Feed */}
        <div className="widget-card">
          <div className="widget-header">
            <Bell style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Alert Feed</span>
            <Tag color="orange" style={{ marginLeft: 'auto', fontSize: '11px', borderRadius: '8px', padding: '1px 10px' }}>5 active</Tag>
          </div>
          <div>
            {alerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div key={alert.id} style={{ padding: '16px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', gap: '14px' }} className="hover:bg-amber-50/30 transition-colors cursor-pointer">
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: severityBg[alert.severity as keyof typeof severityBg], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ width: '18px', height: '18px', color: severityColors[alert.severity as keyof typeof severityColors] }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{alert.title}</span>
                      <Tag color={alert.severity === 'high' ? 'red' : alert.severity === 'medium' ? 'orange' : 'blue'} style={{ fontSize: '10px', padding: '0 6px' }}>{alert.severity}</Tag>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{alert.description}</p>
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock style={{ width: '12px', height: '12px' }} />{alert.time}</span>
                  </div>
                  <ChevronRight style={{ width: '16px', height: '16px', color: '#e2e8f0', flexShrink: 0, marginTop: '4px' }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
          {/* Predictions Timeline */}
          <div className="widget-card">
            <div className="widget-header">
              <Calendar style={{ width: '18px', height: '18px', color: '#7c3aed' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Upcoming Predictions</span>
            </div>
            <div className="widget-body">
              <Timeline items={predictions.map(p => ({
                color: p.status === 'action-needed' ? 'red' : p.status === 'scheduled' ? 'green' : 'blue',
                children: (
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>{p.date}</div>
                    <div style={{ fontSize: '13px', color: '#1e293b', marginTop: '2px' }}>{p.event}</div>
                    {p.status === 'action-needed' && <Tag color="red" style={{ fontSize: '10px', marginTop: '4px' }}>Action Needed</Tag>}
                  </div>
                ),
              }))} />
            </div>
          </div>

          {/* Churn Risk List */}
          <div className="widget-card">
            <div className="widget-header">
              <TrendingDown style={{ width: '18px', height: '18px', color: '#ef4444' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Churn Risk</span>
            </div>
            <div>
              {churnRisks.map((client, i) => (
                <div key={i} style={{ padding: '12px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Avatar style={{ background: client.score >= 70 ? '#ef4444' : client.score >= 50 ? '#f59e0b' : '#94a3b8', fontSize: '11px', fontFamily: 'var(--font-heading)' }} size={32}>
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{client.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{client.reason}</div>
                  </div>
                  <Progress type="circle" percent={client.score} size={30} strokeWidth={10} strokeColor={client.score >= 70 ? '#ef4444' : client.score >= 50 ? '#f59e0b' : '#94a3b8'} format={() => ''} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
