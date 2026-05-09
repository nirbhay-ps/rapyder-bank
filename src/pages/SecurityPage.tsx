import { Tag, Progress } from 'antd';
import { Lock, Shield, AlertTriangle, Eye, Clock, CheckCircle2, XCircle } from 'lucide-react';

const anomalyAlerts = [
  { id: 1, title: 'Unusual login attempt — IP 192.168.45.xx (Russia)', severity: 'critical', time: '5 min ago', status: 'active', details: 'Multiple failed login attempts from unrecognized IP. Account temporarily locked.' },
  { id: 2, title: 'Large transaction flagged — ₹48L transfer (Account #7821)', severity: 'high', time: '15 min ago', status: 'investigating', details: 'Transaction exceeds normal pattern by 340%. Requires manual verification.' },
  { id: 3, title: 'Data export anomaly — 500+ records accessed', severity: 'medium', time: '1 hr ago', status: 'resolved', details: 'Bulk data access detected. Verified as authorized quarterly report generation.' },
  { id: 4, title: 'After-hours system access — Admin portal', severity: 'low', time: '3 hr ago', status: 'resolved', details: 'System access at 11:45 PM. Verified as scheduled maintenance window.' },
  { id: 5, title: 'Phishing email detected — Targeted at RM team', severity: 'high', time: '6 hr ago', status: 'mitigated', details: 'Sophisticated phishing attempt mimicking internal compliance team. Blocked and reported.' },
];

const accessReviewLog = [
  { user: 'Priya Nair', action: 'Accessed client portfolio — Rajesh Kumar', time: 'Today, 11:30 AM', risk: 'normal', system: 'CRM' },
  { user: 'Priya Nair', action: 'Downloaded quarterly report', time: 'Today, 10:15 AM', risk: 'normal', system: 'Reporting' },
  { user: 'System (AI)', action: 'Auto-generated email draft', time: 'Today, 9:45 AM', risk: 'normal', system: 'Email' },
  { user: 'Priya Nair', action: 'Viewed sensitive KYC documents', time: 'Yesterday, 4:30 PM', risk: 'elevated', system: 'Compliance' },
  { user: 'System (AI)', action: 'Cross-system data sync initiated', time: 'Yesterday, 3:00 PM', risk: 'normal', system: 'Integration' },
  { user: 'Priya Nair', action: 'Modified client risk profile', time: 'Yesterday, 2:15 PM', risk: 'elevated', system: 'Core Banking' },
  { user: 'Admin', action: 'Permission escalation — temporary', time: 'Yesterday, 11:00 AM', risk: 'high', system: 'IAM' },
];

const threatDashboard = [
  { category: 'Phishing Attempts', count: 12, blocked: 12, trend: 'down', severity: 'high' },
  { category: 'Unauthorized Access', count: 3, blocked: 3, trend: 'stable', severity: 'critical' },
  { category: 'Data Exfiltration', count: 0, blocked: 0, trend: 'stable', severity: 'critical' },
  { category: 'Malware Detection', count: 1, blocked: 1, trend: 'down', severity: 'high' },
  { category: 'Policy Violations', count: 5, blocked: 4, trend: 'up', severity: 'medium' },
];

const severityColors: Record<string, string> = { critical: 'red', high: 'volcano', medium: 'orange', low: 'blue' };
const statusColors: Record<string, string> = { active: 'red', investigating: 'orange', resolved: 'green', mitigated: 'blue' };
const riskColors: Record<string, string> = { normal: '#10b981', elevated: '#f59e0b', high: '#ef4444' };

export const SecurityPage = () => {
  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lock style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>Security Intelligence</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0' }}>Threat detection, anomaly monitoring, access governance.</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fef2f2', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#dc2626', fontFamily: 'var(--font-heading)' }}>2</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Active Threats</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f0fdf4', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a', fontFamily: 'var(--font-heading)' }}>98.5%</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Security Score</div>
          </div>
        </div>
      </div>

      {/* Anomaly Alerts */}
      <div className="widget-card">
        <div className="widget-header">
          <AlertTriangle style={{ width: '18px', height: '18px', color: '#ef4444' }} />
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Anomaly Alerts</span>
          <Tag color="red" style={{ marginLeft: 'auto', fontSize: '11px', borderRadius: '8px', padding: '1px 10px' }}>2 active</Tag>
        </div>
        <div>
          {anomalyAlerts.map((alert) => (
            <div key={alert.id} style={{ padding: '14px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', gap: '14px' }} className="hover:bg-red-50/20 transition-colors">
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: alert.severity === 'critical' ? '#fef2f2' : alert.severity === 'high' ? '#fff7ed' : alert.severity === 'medium' ? '#fffbeb' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {alert.status === 'active' ? <XCircle style={{ width: '18px', height: '18px', color: '#ef4444' }} /> :
                 alert.status === 'investigating' ? <Eye style={{ width: '18px', height: '18px', color: '#f97316' }} /> :
                 alert.status === 'mitigated' ? <Shield style={{ width: '18px', height: '18px', color: '#3b82f6' }} /> :
                 <CheckCircle2 style={{ width: '18px', height: '18px', color: '#10b981' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{alert.title}</span>
                  <Tag color={severityColors[alert.severity]} style={{ fontSize: '10px' }}>{alert.severity}</Tag>
                  <Tag color={statusColors[alert.status]} style={{ fontSize: '10px' }}>{alert.status}</Tag>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{alert.details}</p>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><Clock style={{ width: '12px', height: '12px' }} />{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Access Review & Threat Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-[1fr_340px]">
        {/* Access Review Log */}
        <div className="widget-card">
          <div className="widget-header">
            <Eye style={{ width: '18px', height: '18px', color: '#64748b' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Access Review Log</span>
          </div>
          <div>
            {accessReviewLog.map((entry, i) => (
              <div key={i} style={{ padding: '12px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: riskColors[entry.risk], flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.action}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', fontSize: '11px', color: '#94a3b8' }}>
                    <span>{entry.user}</span>
                    <span>•</span>
                    <span>{entry.system}</span>
                    <span>•</span>
                    <span>{entry.time}</span>
                  </div>
                </div>
                {entry.risk !== 'normal' && <Tag color={entry.risk === 'high' ? 'red' : 'orange'} style={{ fontSize: '10px' }}>{entry.risk}</Tag>}
              </div>
            ))}
          </div>
        </div>

        {/* Threat Dashboard */}
        <div className="widget-card">
          <div className="widget-header">
            <Shield style={{ width: '18px', height: '18px', color: '#10b981' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Threat Dashboard</span>
          </div>
          <div className="widget-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {threatDashboard.map((threat, i) => (
              <div key={i} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #f1f5f9', background: '#fafbfd' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{threat.category}</span>
                  <Tag color={severityColors[threat.severity]} style={{ fontSize: '10px' }}>{threat.severity}</Tag>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Detected: {threat.count} | Blocked: {threat.blocked}</span>
                  <span style={{ fontSize: '11px', color: threat.trend === 'down' ? '#10b981' : threat.trend === 'up' ? '#ef4444' : '#94a3b8' }}>
                    {threat.trend === 'down' ? '↓' : threat.trend === 'up' ? '↑' : '→'} {threat.trend}
                  </span>
                </div>
                {threat.count > 0 && (
                  <Progress percent={(threat.blocked / threat.count) * 100} size="small" strokeColor="#10b981" style={{ marginTop: '6px' }} format={() => <span style={{ fontSize: '10px' }}>{Math.round((threat.blocked / threat.count) * 100)}% blocked</span>} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
