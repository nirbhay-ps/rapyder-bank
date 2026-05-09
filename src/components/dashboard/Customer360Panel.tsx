import { Tag, Avatar, Tabs } from 'antd';
import { Users, TrendingUp, AlertTriangle, CreditCard } from 'lucide-react';

const customer = {
  name: 'Rajesh Kumar', segment: 'HNI', relationship: '8 yrs', aum: '₹2.4 Cr',
  cibilScore: 812, churnRisk: 'Low', crossSellScore: 87, lastContact: '3 days ago',
  products: ['Savings A/C', 'FD', 'Home Loan', 'Credit Card', 'Demat'],
  opportunities: [
    { product: 'Mutual Fund SIP', propensity: 92, reason: 'FD maturing, high risk appetite' },
    { product: 'Health Insurance', propensity: 78, reason: 'No insurance, age 45+' },
  ],
  activity: [
    { action: 'Large withdrawal ₹5L', date: '2 days ago', flag: true },
    { action: 'Salary credit ₹3.2L', date: '5 days ago', flag: false },
    { action: 'FD maturity notice sent', date: '1 week ago', flag: false },
  ],
};

export const Customer360Panel = () => {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <Users style={{ width: '16px', height: '16px', color: '#8b2252' }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#2d2d2d', fontFamily: 'var(--font-heading)' }}>Customer 360</span>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />Live
        </span>
      </div>
      <div className="widget-body">
        {/* Profile row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid #f2eded' }}>
          <Avatar size={48} style={{ background: 'linear-gradient(135deg, #8b2252, #d4547a)', fontFamily: 'var(--font-heading)', fontWeight: 700, flexShrink: 0 }}>RK</Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2d2d2d', margin: 0, fontFamily: 'var(--font-heading)' }}>{customer.name}</h3>
              <Tag color="gold" style={{ fontSize: '10px', padding: '0 7px' }}>{customer.segment}</Tag>
            </div>
            <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{customer.relationship} · Last contact: {customer.lastContact}</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: '20px', fontWeight: 700, color: '#2d2d2d', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{customer.aum}</p>
            <p style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>AUM</p>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '16px 0', borderBottom: '1px solid #f2eded' }}>
          <div style={{ textAlign: 'center', padding: '12px 8px', borderRadius: '10px', background: '#fafafa' }}>
            <CreditCard style={{ width: '14px', height: '14px', color: '#8b2252', margin: '0 auto 6px' }} />
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#2d2d2d', fontFamily: 'var(--font-heading)' }}>{customer.cibilScore}</p>
            <p style={{ fontSize: '10px', color: '#888' }}>CIBIL</p>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 8px', borderRadius: '10px', background: '#fafafa' }}>
            <AlertTriangle style={{ width: '14px', height: '14px', color: '#10b981', margin: '0 auto 6px' }} />
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-heading)' }}>{customer.churnRisk}</p>
            <p style={{ fontSize: '10px', color: '#888' }}>Churn</p>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 8px', borderRadius: '10px', background: '#fafafa' }}>
            <TrendingUp style={{ width: '14px', height: '14px', color: '#8b2252', margin: '0 auto 6px' }} />
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#8b2252', fontFamily: 'var(--font-heading)' }}>{customer.crossSellScore}%</p>
            <p style={{ fontSize: '10px', color: '#888' }}>Cross-sell</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: '14px' }}>
          <Tabs items={[
            { key: 'products', label: 'Products', children: (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '4px' }}>
                {customer.products.map((p) => <span key={p} style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: '#f5f0f0', color: '#555' }}>{p}</span>)}
              </div>
            )},
            { key: 'opportunities', label: 'Opportunities', children: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
                {customer.opportunities.map((o) => (
                  <div key={o.product} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: '#fdf2f8' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#2d2d2d' }}>{o.product}</p>
                      <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{o.reason}</p>
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#8b2252', fontFamily: 'var(--font-heading)' }}>{o.propensity}%</span>
                  </div>
                ))}
              </div>
            )},
            { key: 'activity', label: 'Activity', children: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
                {customer.activity.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.flag ? '#f59e0b' : '#ddd', flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: '#555', flex: 1 }}>{a.action}</span>
                    <span style={{ fontSize: '11px', color: '#aaa' }}>{a.date}</span>
                  </div>
                ))}
              </div>
            )},
          ]} />
        </div>
      </div>
    </div>
  );
}
