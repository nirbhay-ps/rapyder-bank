import { Tag, Progress, Timeline } from 'antd';
import { Shield, Calendar, CheckCircle2, Clock, FileText, Users, AlertCircle } from 'lucide-react';

const filingStatus = [
  { id: 1, filing: 'Monthly Transaction Report (MTR)', deadline: 'Dec 31, 2024', status: 'submitted', progress: 100 },
  { id: 2, filing: 'KYC Batch Renewal — Q4', deadline: 'Dec 28, 2024', status: 'in-progress', progress: 67 },
  { id: 3, filing: 'Anti-Money Laundering (AML) Report', deadline: 'Jan 5, 2025', status: 'not-started', progress: 0 },
  { id: 4, filing: 'Customer Due Diligence (CDD) Update', deadline: 'Jan 10, 2025', status: 'in-progress', progress: 40 },
  { id: 5, filing: 'Suspicious Transaction Report (STR)', deadline: 'Jan 15, 2025', status: 'not-started', progress: 0 },
  { id: 6, filing: 'Quarterly Compliance Audit', deadline: 'Jan 20, 2025', status: 'not-started', progress: 0 },
];

const kycTracker = [
  { client: 'Rajesh Kumar', type: 'Full KYC', expiry: 'Jan 15, 2025', status: 'valid', documents: 'Complete', riskLevel: 'Low' },
  { client: 'Anita Desai', type: 'Full KYC', expiry: 'Dec 28, 2024', status: 'expiring', documents: 'Complete', riskLevel: 'Low' },
  { client: 'Meera Sharma', type: 'Re-KYC', expiry: 'Dec 25, 2024', status: 'expired', documents: 'Pending Aadhaar', riskLevel: 'Medium' },
  { client: 'Vikram Patel', type: 'Full KYC', expiry: 'Mar 10, 2025', status: 'valid', documents: 'Complete', riskLevel: 'Low' },
  { client: 'Suresh Iyer', type: 'Enhanced DD', expiry: 'Feb 1, 2025', status: 'valid', documents: 'Complete', riskLevel: 'High' },
  { client: 'Amit Gupta', type: 'Re-KYC', expiry: 'Dec 30, 2024', status: 'expiring', documents: 'Pending PAN', riskLevel: 'Medium' },
  { client: 'Kavita Reddy', type: 'Full KYC', expiry: 'Apr 15, 2025', status: 'valid', documents: 'Complete', riskLevel: 'Low' },
];

const calendarEvents = [
  { date: 'Dec 25', event: 'KYC Expiry — Meera Sharma', type: 'deadline', urgent: true },
  { date: 'Dec 28', event: 'KYC Batch Renewal Deadline', type: 'deadline', urgent: true },
  { date: 'Dec 31', event: 'MTR Submission (Completed)', type: 'filing', urgent: false },
  { date: 'Jan 5', event: 'AML Report Due', type: 'filing', urgent: false },
  { date: 'Jan 10', event: 'CDD Update Deadline', type: 'filing', urgent: false },
  { date: 'Jan 15', event: 'STR Filing Deadline', type: 'filing', urgent: false },
  { date: 'Jan 20', event: 'Quarterly Compliance Audit', type: 'audit', urgent: false },
];

const statusColors: Record<string, string> = { submitted: 'green', 'in-progress': 'blue', 'not-started': 'default', valid: 'green', expiring: 'orange', expired: 'red' };
const riskColors: Record<string, string> = { Low: 'green', Medium: 'orange', High: 'red' };

export const CompliancePage = () => {
  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>Compliance Assistant</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0' }}>Real-time regulatory checks and filing assistance.</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f0fdf4', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a', fontFamily: 'var(--font-heading)' }}>94%</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Compliance Score</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fef2f2', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#dc2626', fontFamily: 'var(--font-heading)' }}>2</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Urgent Items</div>
          </div>
        </div>
      </div>

      {/* Filing Status & Calendar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-[1fr_320px]">
        {/* Filing Status */}
        <div className="widget-card">
          <div className="widget-header">
            <FileText style={{ width: '18px', height: '18px', color: '#10b981' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Filing Status</span>
          </div>
          <div>
            {filingStatus.map((filing) => (
              <div key={filing.id} style={{ padding: '14px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: filing.status === 'submitted' ? '#f0fdf4' : filing.status === 'in-progress' ? '#eff6ff' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {filing.status === 'submitted' ? <CheckCircle2 style={{ width: '16px', height: '16px', color: '#16a34a' }} /> :
                   filing.status === 'in-progress' ? <Clock style={{ width: '16px', height: '16px', color: '#2563eb' }} /> :
                   <AlertCircle style={{ width: '16px', height: '16px', color: '#94a3b8' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{filing.filing}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Deadline: {filing.deadline}</span>
                    <Tag color={statusColors[filing.status]} style={{ fontSize: '10px', padding: '0 6px' }}>{filing.status.replace('-', ' ')}</Tag>
                  </div>
                </div>
                <div style={{ width: '80px', flexShrink: 0 }}>
                  <Progress percent={filing.progress} size="small" strokeColor={filing.progress === 100 ? '#10b981' : '#3b82f6'} format={(p) => <span style={{ fontSize: '11px' }}>{p}%</span>} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Calendar */}
        <div className="widget-card">
          <div className="widget-header">
            <Calendar style={{ width: '18px', height: '18px', color: '#7c3aed' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Compliance Calendar</span>
          </div>
          <div className="widget-body">
            <Timeline items={calendarEvents.map(e => ({
              color: e.urgent ? 'red' : e.type === 'filing' ? 'blue' : 'green',
              children: (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>{e.date}</div>
                  <div style={{ fontSize: '13px', color: '#1e293b', marginTop: '2px' }}>{e.event}</div>
                  {e.urgent && <Tag color="red" style={{ fontSize: '10px', marginTop: '4px' }}>Urgent</Tag>}
                </div>
              ),
            }))} />
          </div>
        </div>
      </div>

      {/* KYC Tracker */}
      <div className="widget-card">
        <div className="widget-header">
          <Users style={{ width: '18px', height: '18px', color: '#2563eb' }} />
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>KYC Tracker</span>
          <Tag color="blue" style={{ marginLeft: 'auto', fontSize: '11px', borderRadius: '8px', padding: '1px 10px' }}>{kycTracker.length} clients</Tag>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ textAlign: 'left', padding: '12px var(--card-padding)', color: '#64748b', fontWeight: 600, fontSize: '12px' }}>Client</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#64748b', fontWeight: 600, fontSize: '12px' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#64748b', fontWeight: 600, fontSize: '12px' }}>Expiry</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', color: '#64748b', fontWeight: 600, fontSize: '12px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#64748b', fontWeight: 600, fontSize: '12px' }}>Documents</th>
                <th style={{ textAlign: 'center', padding: '12px var(--card-padding)', color: '#64748b', fontWeight: 600, fontSize: '12px' }}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {kycTracker.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }} className="hover:bg-emerald-50/30">
                  <td style={{ padding: '12px var(--card-padding)', fontWeight: 600, color: '#1e293b' }}>{row.client}</td>
                  <td style={{ padding: '12px 8px', color: '#64748b' }}>{row.type}</td>
                  <td style={{ padding: '12px 8px', color: '#64748b' }}>{row.expiry}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}><Tag color={statusColors[row.status]} style={{ fontSize: '10px' }}>{row.status}</Tag></td>
                  <td style={{ padding: '12px 8px', color: row.documents === 'Complete' ? '#16a34a' : '#d97706', fontSize: '12px' }}>{row.documents}</td>
                  <td style={{ padding: '12px var(--card-padding)', textAlign: 'center' }}><Tag color={riskColors[row.riskLevel]} style={{ fontSize: '10px' }}>{row.riskLevel}</Tag></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
