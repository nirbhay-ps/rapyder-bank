import { Tag, Progress } from 'antd';
import { Plane, MapPin, Calendar, CreditCard, CheckCircle2, Receipt, Building2, Car } from 'lucide-react';

const upcomingTrips = [
  { id: 1, destination: 'Mumbai → Delhi', purpose: 'Client Meeting — Suresh Iyer', dates: 'Dec 22-23, 2024', status: 'confirmed', flight: 'AI-204 (10:30 AM)', hotel: 'Taj Palace, Delhi', budget: '₹45,000', spent: '₹32,000' },
  { id: 2, destination: 'Mumbai → Bangalore', purpose: 'Branch Review Meeting', dates: 'Jan 5-6, 2025', status: 'pending', flight: '6E-512 (8:00 AM)', hotel: 'ITC Gardenia', budget: '₹38,000', spent: '₹0' },
  { id: 3, destination: 'Mumbai → Chennai', purpose: 'Portfolio Review — 3 HNI Clients', dates: 'Jan 12-14, 2025', status: 'draft', flight: 'Not booked', hotel: 'Not booked', budget: '₹55,000', spent: '₹0' },
];

const expenses = [
  { id: 1, description: 'Flight — Mumbai to Delhi (AI-204)', amount: '₹8,450', date: 'Dec 22', category: 'Travel', status: 'approved', receipt: true },
  { id: 2, description: 'Taj Palace Delhi — 1 night', amount: '₹12,500', date: 'Dec 22', category: 'Accommodation', status: 'approved', receipt: true },
  { id: 3, description: 'Uber — Airport to Hotel', amount: '₹850', date: 'Dec 22', category: 'Transport', status: 'pending', receipt: true },
  { id: 4, description: 'Client dinner — Suresh Iyer', amount: '₹4,200', date: 'Dec 22', category: 'Meals', status: 'pending', receipt: true },
  { id: 5, description: 'Uber — Hotel to Client Office', amount: '₹650', date: 'Dec 23', category: 'Transport', status: 'submitted', receipt: false },
  { id: 6, description: 'Flight — Delhi to Mumbai (AI-207)', amount: '₹9,100', date: 'Dec 23', category: 'Travel', status: 'submitted', receipt: true },
];

const statusColors: Record<string, string> = { confirmed: 'green', pending: 'orange', draft: 'default', approved: 'green', submitted: 'blue' };
const categoryIcons: Record<string, React.ReactNode> = {
  Travel: <Plane style={{ width: '14px', height: '14px' }} />,
  Accommodation: <Building2 style={{ width: '14px', height: '14px' }} />,
  Transport: <Car style={{ width: '14px', height: '14px' }} />,
  Meals: <CreditCard style={{ width: '14px', height: '14px' }} />,
};

export const TravelPage = () => {
  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plane style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>Travel & Expense</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0' }}>One-click travel booking and expense submission.</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f0f9ff', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0284c7', fontFamily: 'var(--font-heading)' }}>3</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Upcoming Trips</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f0fdf4', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a', fontFamily: 'var(--font-heading)' }}>92%</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Policy Compliance</div>
          </div>
        </div>
      </div>

      {/* Upcoming Trips */}
      <div className="widget-card">
        <div className="widget-header">
          <Calendar style={{ width: '18px', height: '18px', color: '#0ea5e9' }} />
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Upcoming Trips</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', padding: 'var(--card-padding)' }}>
          {upcomingTrips.map((trip) => (
            <div key={trip.id} style={{ padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9', background: '#fafbfd' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin style={{ width: '16px', height: '16px', color: '#0ea5e9' }} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{trip.destination}</span>
                </div>
                <Tag color={statusColors[trip.status]} style={{ fontSize: '10px' }}>{trip.status}</Tag>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>{trip.purpose}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar style={{ width: '13px', height: '13px' }} />{trip.dates}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Plane style={{ width: '13px', height: '13px' }} />{trip.flight}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Building2 style={{ width: '13px', height: '13px' }} />{trip.hotel}</span>
              </div>
              {trip.status === 'confirmed' && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                    <span>Budget: {trip.budget}</span>
                    <span>Spent: {trip.spent}</span>
                  </div>
                  <Progress percent={71} size="small" strokeColor="#0ea5e9" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Expenses & Policy */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-[1fr_300px]">
        {/* Expense Submissions */}
        <div className="widget-card">
          <div className="widget-header">
            <Receipt style={{ width: '18px', height: '18px', color: '#64748b' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Expense Submissions</span>
            <Tag color="blue" style={{ marginLeft: 'auto', fontSize: '11px', borderRadius: '8px', padding: '1px 10px' }}>6 items</Tag>
          </div>
          <div>
            {expenses.map((exp) => (
              <div key={exp.id} style={{ padding: '12px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                  {categoryIcons[exp.category] || <CreditCard style={{ width: '14px', height: '14px' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.description}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{exp.date} • {exp.category}</div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', fontFamily: 'var(--font-heading)' }}>{exp.amount}</span>
                <Tag color={statusColors[exp.status]} style={{ fontSize: '10px' }}>{exp.status}</Tag>
                {exp.receipt && <Receipt style={{ width: '14px', height: '14px', color: '#10b981' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Policy Compliance */}
        <div className="widget-card">
          <div className="widget-header">
            <CheckCircle2 style={{ width: '18px', height: '18px', color: '#10b981' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Policy Compliance</span>
          </div>
          <div className="widget-body" style={{ textAlign: 'center' }}>
            <Progress type="dashboard" percent={92} size={100} strokeWidth={10} strokeColor={{ '0%': '#10b981', '100%': '#0ea5e9' }} format={(p) => <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{p}%</span>} />
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '12px' }}>Overall policy adherence</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>Flight booking</span>
                <Tag color="green" style={{ fontSize: '10px' }}>Compliant</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>Hotel limits</span>
                <Tag color="green" style={{ fontSize: '10px' }}>Compliant</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>Meal allowance</span>
                <Tag color="orange" style={{ fontSize: '10px' }}>Near Limit</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>Receipt uploads</span>
                <Tag color="red" style={{ fontSize: '10px' }}>1 Missing</Tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
