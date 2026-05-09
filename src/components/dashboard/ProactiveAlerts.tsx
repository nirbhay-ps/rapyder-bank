import { Bell, TrendingDown, Calendar, Users, AlertTriangle } from 'lucide-react';

const alerts = [
  { id: 1, icon: TrendingDown, title: 'Churn risk', desc: 'Suresh Mehta — transactions down 40%', time: '15m', severity: 'high' },
  { id: 2, icon: Calendar, title: 'FD maturity', desc: 'Anita Desai — ₹15L, cross-sell window', time: '1h', severity: 'medium' },
  { id: 3, icon: Users, title: 'Workload spike', desc: 'Thu: 8 meetings + 3 deadlines', time: '2h', severity: 'medium' },
  { id: 4, icon: AlertTriangle, title: 'SLA breach', desc: 'Rajesh Kumar — 2h remaining', time: '30m', severity: 'high' },
];

export const ProactiveAlerts = () => {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <Bell style={{ width: '16px', height: '16px', color: '#8b2252' }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#2d2d2d', fontFamily: 'var(--font-heading)' }}>Alerts</span>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#8b2252', fontWeight: 600 }}>4</span>
      </div>
      <div style={{ padding: '12px var(--card-padding)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {alerts.map((a) => {
          const Icon = a.icon;
          const isHigh = a.severity === 'high';
          return (
            <div key={a.id} style={{ display: 'flex', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: isHigh ? '#fdf2f8' : '#fefce8', cursor: 'pointer' }} className="hover:shadow-sm transition-shadow">
              <Icon style={{ width: '15px', height: '15px', color: isHigh ? '#8b2252' : '#d97706', marginTop: '2px', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#2d2d2d' }}>{a.title}</p>
                <p style={{ fontSize: '11px', color: '#777', marginTop: '2px' }}>{a.desc}</p>
              </div>
              <span style={{ fontSize: '10px', color: '#aaa', flexShrink: 0 }}>{a.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
