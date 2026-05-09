import { Tag, Progress } from 'antd';
import { BarChart3, TrendingUp, PieChart, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const portfolioHealth = [
  { segment: 'Ultra HNI', aum: '₹45.2 Cr', clients: 8, growth: '+12.4%', health: 94, trend: 'up' },
  { segment: 'HNI', aum: '₹28.6 Cr', clients: 15, growth: '+8.7%', health: 82, trend: 'up' },
  { segment: 'Affluent', aum: '₹12.8 Cr', clients: 32, growth: '+5.2%', health: 76, trend: 'up' },
  { segment: 'Mass Affluent', aum: '₹4.5 Cr', clients: 45, growth: '-1.3%', health: 65, trend: 'down' },
];

const revenueForecast = [
  { month: 'Oct 2024', actual: 12.4, forecast: 12.0 },
  { month: 'Nov 2024', actual: 13.8, forecast: 13.2 },
  { month: 'Dec 2024', actual: 15.2, forecast: 14.5 },
  { month: 'Jan 2025', actual: null, forecast: 16.1 },
  { month: 'Feb 2025', actual: null, forecast: 17.3 },
  { month: 'Mar 2025', actual: null, forecast: 19.0 },
];

const teamMetrics = [
  { metric: 'Client Retention Rate', value: '96.2%', target: '95%', status: 'above', change: '+1.2%' },
  { metric: 'Cross-sell Ratio', value: '2.8', target: '3.0', status: 'below', change: '+0.3' },
  { metric: 'Avg Response Time', value: '2.4 hrs', target: '4 hrs', status: 'above', change: '-0.8 hrs' },
  { metric: 'NPS Score', value: '72', target: '70', status: 'above', change: '+5' },
  { metric: 'Revenue per Client', value: '₹4.2L', target: '₹4.5L', status: 'below', change: '+₹0.3L' },
  { metric: 'Task Completion Rate', value: '89%', target: '85%', status: 'above', change: '+4%' },
];

const kpiCards = [
  { title: 'Total AUM', value: '₹91.1 Cr', change: '+8.2%', trend: 'up', color: '#2563eb', bg: '#eff6ff' },
  { title: 'Revenue MTD', value: '₹15.2 L', change: '+12.4%', trend: 'up', color: '#16a34a', bg: '#f0fdf4' },
  { title: 'Active Clients', value: '100', change: '+3', trend: 'up', color: '#7c3aed', bg: '#f5f3ff' },
  { title: 'Churn Risk', value: '4.2%', change: '-0.8%', trend: 'down', color: '#f59e0b', bg: '#fffbeb' },
];

export const AnalyticsPage = () => {
  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BarChart3 style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>Predictive Analytics</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0' }}>Business forecasting and performance insights.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {kpiCards.map((kpi, i) => (
          <div key={i} className="widget-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{kpi.title}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>{kpi.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
              {kpi.trend === 'up' ? <ArrowUpRight style={{ width: '14px', height: '14px', color: '#10b981' }} /> : <ArrowDownRight style={{ width: '14px', height: '14px', color: '#f59e0b' }} />}
              <span style={{ fontSize: '12px', fontWeight: 600, color: kpi.trend === 'up' ? '#10b981' : '#f59e0b' }}>{kpi.change}</span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Health & Revenue Forecast */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-2">
        {/* Portfolio Health */}
        <div className="widget-card">
          <div className="widget-header">
            <PieChart style={{ width: '18px', height: '18px', color: '#2563eb' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Portfolio Health by Segment</span>
          </div>
          <div>
            {portfolioHealth.map((seg, i) => (
              <div key={i} style={{ padding: '14px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{seg.segment}</span>
                    <Tag color={seg.trend === 'up' ? 'green' : 'red'} style={{ fontSize: '10px' }}>{seg.growth}</Tag>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '12px', color: '#64748b' }}>
                    <span>AUM: {seg.aum}</span>
                    <span>•</span>
                    <span>{seg.clients} clients</span>
                  </div>
                </div>
                <Progress type="circle" percent={seg.health} size={40} strokeWidth={8} strokeColor={seg.health >= 90 ? '#10b981' : seg.health >= 70 ? '#3b82f6' : '#f59e0b'} format={(p) => <span style={{ fontSize: '10px', fontWeight: 700 }}>{p}</span>} />
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Forecast */}
        <div className="widget-card">
          <div className="widget-header">
            <TrendingUp style={{ width: '18px', height: '18px', color: '#10b981' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Revenue Forecast (₹ Lakhs)</span>
          </div>
          <div className="widget-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {revenueForecast.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', width: '80px', flexShrink: 0 }}>{item.month.split(' ')[0]}</span>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.actual && (
                      <div style={{ height: '8px', borderRadius: '4px', background: '#3b82f6', width: `${(item.actual / 20) * 100}%`, minWidth: '20px' }} />
                    )}
                    <div style={{ height: '8px', borderRadius: '4px', background: item.actual ? '#e2e8f0' : '#dbeafe', border: item.actual ? 'none' : '1px dashed #93c5fd', width: `${(item.forecast / 20) * 100}%`, minWidth: '20px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '12px', width: '100px', justifyContent: 'flex-end' }}>
                    {item.actual && <span style={{ fontWeight: 600, color: '#2563eb' }}>₹{item.actual}L</span>}
                    <span style={{ color: item.actual ? '#94a3b8' : '#2563eb', fontWeight: item.actual ? 400 : 600 }}>₹{item.forecast}L</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '11px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '12px', height: '4px', borderRadius: '2px', background: '#3b82f6' }} /> Actual</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '12px', height: '4px', borderRadius: '2px', background: '#dbeafe', border: '1px dashed #93c5fd' }} /> Forecast</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Metrics */}
      <div className="widget-card">
        <div className="widget-header">
          <Activity style={{ width: '18px', height: '18px', color: '#7c3aed' }} />
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Team Performance Metrics</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', padding: 'var(--card-padding)' }}>
          {teamMetrics.map((m, i) => (
            <div key={i} style={{ padding: '16px', borderRadius: '10px', border: '1px solid #f1f5f9', background: '#fafbfd' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>{m.metric}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>{m.value}</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>/ {m.target}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                <Tag color={m.status === 'above' ? 'green' : 'orange'} style={{ fontSize: '10px' }}>{m.status === 'above' ? '✓ Above Target' : '↗ Below Target'}</Tag>
                <span style={{ fontSize: '11px', color: m.status === 'above' ? '#10b981' : '#f59e0b' }}>{m.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
