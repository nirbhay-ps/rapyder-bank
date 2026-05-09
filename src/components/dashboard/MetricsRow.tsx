import { ArrowUpRight, ArrowDownRight, Clock, Zap, TrendingUp, Shield } from 'lucide-react';

const metrics = [
  { label: 'Time Saved', value: '72 min', change: '+12%', trend: 'up' as const, icon: Clock, color: '#8b2252' },
  { label: 'Auto Actions', value: '47', change: '+8', trend: 'up' as const, icon: Zap, color: '#d4547a' },
  { label: 'Cross-sell', value: '82%', change: '+5.2%', trend: 'up' as const, icon: TrendingUp, color: '#10b981' },
  { label: 'Compliance', value: '98.5%', change: '-0.5%', trend: 'down' as const, icon: Shield, color: '#f59e0b' },
];

export const MetricsRow = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div key={m.label} className="widget-card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>{m.label}</p>
                <p style={{ fontSize: '26px', fontWeight: 700, color: '#2d2d2d', fontFamily: 'var(--font-heading)', marginTop: '4px', lineHeight: 1 }}>{m.value}</p>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${m.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon style={{ width: '20px', height: '20px', color: m.color }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
              {m.trend === 'up'
                ? <ArrowUpRight style={{ width: '13px', height: '13px', color: '#10b981' }} />
                : <ArrowDownRight style={{ width: '13px', height: '13px', color: '#ef4444' }} />
              }
              <span style={{ fontSize: '12px', fontWeight: 600, color: m.trend === 'up' ? '#10b981' : '#ef4444' }}>{m.change}</span>
              <span style={{ fontSize: '11px', color: '#aaa' }}>vs last week</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
