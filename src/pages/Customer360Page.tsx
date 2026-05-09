import { Tag, Progress, Avatar, Input, Tabs } from 'antd';
import { Users, Search, Phone, Mail, Calendar, MapPin, Star } from 'lucide-react';

const clients = [
  { id: 1, name: 'Rajesh Kumar', aum: '₹2.4 Cr', segment: 'HNI', health: 92, lastContact: '2 days ago', products: ['Equity MF', 'FD', 'Insurance'], riskProfile: 'Aggressive', relationship: '5 years', phone: '+91 98765 43210', email: 'rajesh.kumar@email.com', location: 'Mumbai' },
  { id: 2, name: 'Anita Desai', aum: '₹1.8 Cr', segment: 'HNI', health: 78, lastContact: '5 days ago', products: ['FD', 'Bonds', 'Gold'], riskProfile: 'Moderate', relationship: '3 years', phone: '+91 98765 43211', email: 'anita.desai@email.com', location: 'Pune' },
  { id: 3, name: 'Vikram Patel', aum: '₹85 L', segment: 'Affluent', health: 85, lastContact: '1 day ago', products: ['Home Loan', 'Savings', 'MF SIP'], riskProfile: 'Moderate', relationship: '7 years', phone: '+91 98765 43212', email: 'vikram.patel@email.com', location: 'Ahmedabad' },
  { id: 4, name: 'Meera Sharma', aum: '₹1.2 Cr', segment: 'HNI', health: 65, lastContact: '12 days ago', products: ['Insurance', 'FD', 'NPS'], riskProfile: 'Conservative', relationship: '4 years', phone: '+91 98765 43213', email: 'meera.sharma@email.com', location: 'Delhi' },
  { id: 5, name: 'Suresh Iyer', aum: '₹3.1 Cr', segment: 'Ultra HNI', health: 95, lastContact: 'Today', products: ['PMS', 'AIF', 'Equity MF', 'Insurance'], riskProfile: 'Aggressive', relationship: '8 years', phone: '+91 98765 43214', email: 'suresh.iyer@email.com', location: 'Chennai' },
  { id: 6, name: 'Priya Menon', aum: '₹45 L', segment: 'Mass Affluent', health: 72, lastContact: '8 days ago', products: ['MF SIP', 'FD'], riskProfile: 'Moderate', relationship: '2 years', phone: '+91 98765 43215', email: 'priya.menon@email.com', location: 'Bangalore' },
];

const segmentColors: Record<string, string> = { 'Ultra HNI': 'gold', 'HNI': 'purple', 'Affluent': 'blue', 'Mass Affluent': 'cyan' };

const selectedClient = clients[0];

const recentInteractions = [
  { date: 'Dec 18, 2024', type: 'Call', summary: 'Discussed Q4 portfolio performance, client satisfied with returns' },
  { date: 'Dec 12, 2024', type: 'Email', summary: 'Sent quarterly portfolio statement and market outlook report' },
  { date: 'Dec 5, 2024', type: 'Meeting', summary: 'Annual review meeting — discussed 2025 investment strategy' },
  { date: 'Nov 28, 2024', type: 'SMS', summary: 'Birthday greeting sent with exclusive offer on premium credit card' },
];

export const Customer360Page = () => {
  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Users style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>Customer 360</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0' }}>Unified customer intelligence panel for RM context during interactions.</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-[340px_1fr]">
        {/* Client List */}
        <div className="widget-card">
          <div className="widget-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Client Portfolio</span>
            <Input prefix={<Search style={{ width: '14px', height: '14px', color: '#94a3b8' }} />} placeholder="Search clients..." size="small" style={{ borderRadius: '8px' }} />
          </div>
          <div>
            {clients.map((client) => (
              <div key={client.id} style={{ padding: '14px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: client.id === 1 ? '#f0fdf4' : 'transparent' }} className="hover:bg-emerald-50/50 transition-colors">
                <Avatar style={{ background: client.health >= 90 ? '#10b981' : client.health >= 70 ? '#f59e0b' : '#ef4444', fontFamily: 'var(--font-heading)', fontSize: '13px', flexShrink: 0 }} size={38}>
                  {client.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{client.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                    <Tag color={segmentColors[client.segment]} style={{ fontSize: '10px', padding: '0 6px' }}>{client.segment}</Tag>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{client.aum}</span>
                  </div>
                </div>
                <Progress type="circle" percent={client.health} size={30} strokeWidth={10} strokeColor={client.health >= 90 ? '#10b981' : client.health >= 70 ? '#f59e0b' : '#ef4444'} format={() => ''} />
              </div>
            ))}
          </div>
        </div>

        {/* Client Detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
          {/* Profile Card */}
          <div className="widget-card">
            <div className="widget-body" style={{ padding: '24px var(--card-padding)' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <Avatar style={{ background: 'linear-gradient(135deg, #10b981, #059669)', fontFamily: 'var(--font-heading)', fontSize: '20px' }} size={64}>RK</Avatar>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>{selectedClient.name}</h2>
                    <Tag color="gold">Ultra HNI</Tag>
                    <Star style={{ width: '16px', height: '16px', color: '#fbbf24', fill: '#fbbf24' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}><Phone style={{ width: '14px', height: '14px' }} />{selectedClient.phone}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}><Mail style={{ width: '14px', height: '14px' }} />{selectedClient.email}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}><MapPin style={{ width: '14px', height: '14px' }} />{selectedClient.location}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Progress type="dashboard" percent={selectedClient.health} size={80} strokeWidth={8} strokeColor={{ '0%': '#10b981', '100%': '#059669' }} format={(p) => <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{p}</span>} />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Health Score</div>
                </div>
              </div>

              {/* Key Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginTop: '20px' }}>
                <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#059669', fontFamily: 'var(--font-heading)' }}>{selectedClient.aum}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Total AUM</div>
                </div>
                <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#2563eb', fontFamily: 'var(--font-heading)' }}>{selectedClient.relationship}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Relationship</div>
                </div>
                <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#d97706', fontFamily: 'var(--font-heading)' }}>{selectedClient.riskProfile}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Risk Profile</div>
                </div>
                <div style={{ padding: '12px', background: '#f5f3ff', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#7c3aed', fontFamily: 'var(--font-heading)' }}>{selectedClient.products.length}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Products</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs: Products & Interactions */}
          <div className="widget-card">
            <div className="widget-body">
              <Tabs defaultActiveKey="interactions" items={[
                { key: 'interactions', label: 'Recent Interactions', children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentInteractions.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', background: '#fafbfd', borderRadius: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: item.type === 'Call' ? '#dbeafe' : item.type === 'Email' ? '#f0fdf4' : item.type === 'Meeting' ? '#fef3c7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {item.type === 'Call' ? <Phone style={{ width: '16px', height: '16px', color: '#2563eb' }} /> : item.type === 'Email' ? <Mail style={{ width: '16px', height: '16px', color: '#16a34a' }} /> : <Calendar style={{ width: '16px', height: '16px', color: '#d97706' }} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{item.type}</span>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{item.date}</span>
                          </div>
                          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{item.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )},
                { key: 'products', label: 'Products', children: (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedClient.products.map((p, i) => (
                      <Tag key={i} color="blue" style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '8px' }}>{p}</Tag>
                    ))}
                  </div>
                )},
              ]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
