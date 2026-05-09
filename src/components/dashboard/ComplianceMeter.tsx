import { Progress } from 'antd';
import { Shield, CheckCircle2, AlertTriangle } from 'lucide-react';

const items = [
  { label: 'KYC Renewals', ok: false, count: '3 pending' },
  { label: 'AML Checks', ok: true, count: 'Clear' },
  { label: 'Regulatory Filings', ok: true, count: 'Up to date' },
  { label: 'Training Certs', ok: false, count: '1 expiring' },
];

export const ComplianceMeter = () => {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <Shield style={{ width: '16px', height: '16px', color: '#10b981' }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#2d2d2d', fontFamily: 'var(--font-heading)' }}>Compliance</span>
      </div>
      <div className="widget-body">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
          <Progress
            type="dashboard" percent={98.5} size={100} strokeWidth={8}
            strokeColor="#10b981"
            format={(p) => <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#2d2d2d' }}>{p}%</span>}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {item.ok ? <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10b981' }} /> : <AlertTriangle style={{ width: '15px', height: '15px', color: '#f59e0b' }} />}
              <span style={{ fontSize: '12px', color: '#555', flex: 1 }}>{item.label}</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: item.ok ? '#10b981' : '#d97706' }}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
