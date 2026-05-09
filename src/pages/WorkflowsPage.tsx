import { Tag, Progress } from 'antd';
import { GitBranch, Play, Pause, CheckCircle2, Clock, RotateCcw } from 'lucide-react';

const activeWorkflows = [
  { id: 1, name: 'Client Onboarding — Priya Menon', status: 'active', progress: 65, steps: 8, completedSteps: 5, currentStep: 'Document Verification', startedAt: 'Dec 16', assignee: 'Priya Nair', priority: 'high' },
  { id: 2, name: 'Loan Approval — Vikram Patel', status: 'active', progress: 40, steps: 10, completedSteps: 4, currentStep: 'Credit Assessment', startedAt: 'Dec 14', assignee: 'Priya Nair', priority: 'medium' },
  { id: 3, name: 'KYC Renewal Batch — Q4', status: 'paused', progress: 33, steps: 6, completedSteps: 2, currentStep: 'Awaiting Client Documents', startedAt: 'Dec 10', assignee: 'System', priority: 'high' },
  { id: 4, name: 'Insurance Claim — Meera Sharma', status: 'active', progress: 80, steps: 5, completedSteps: 4, currentStep: 'Final Approval', startedAt: 'Dec 8', assignee: 'Claims Team', priority: 'medium' },
  { id: 5, name: 'Account Closure — Amit Gupta', status: 'completed', progress: 100, steps: 6, completedSteps: 6, currentStep: 'Completed', startedAt: 'Dec 5', assignee: 'Priya Nair', priority: 'low' },
];

const approvalQueue = [
  { id: 1, request: 'Loan disbursement — ₹25L (Vikram Patel)', requester: 'Credit Team', submitted: '2 hrs ago', urgency: 'high', type: 'Financial' },
  { id: 2, request: 'KYC extension — 5 days (Meera Sharma)', requester: 'Compliance', submitted: '4 hrs ago', urgency: 'medium', type: 'Compliance' },
  { id: 3, request: 'Portfolio rebalancing — Rajesh Kumar', requester: 'AI System', submitted: '6 hrs ago', urgency: 'low', type: 'Investment' },
  { id: 4, request: 'Travel approval — Delhi trip (Dec 22-23)', requester: 'Self', submitted: '1 day ago', urgency: 'medium', type: 'Admin' },
  { id: 5, request: 'Client meeting override — Suresh Iyer', requester: 'AI Avatar', submitted: '1 day ago', urgency: 'low', type: 'Meeting' },
];

const processStatus = [
  { process: 'CRM → Core Banking Sync', status: 'healthy', lastRun: '5 min ago', successRate: 99.2 },
  { process: 'Email Classification Pipeline', status: 'healthy', lastRun: '2 min ago', successRate: 97.8 },
  { process: 'KYC Document OCR', status: 'degraded', lastRun: '15 min ago', successRate: 92.1 },
  { process: 'Compliance Report Generator', status: 'healthy', lastRun: '1 hr ago', successRate: 100 },
  { process: 'Client Risk Scoring', status: 'healthy', lastRun: '30 min ago', successRate: 98.5 },
];

const statusColors: Record<string, string> = { active: 'blue', paused: 'orange', completed: 'green' };
const urgencyColors: Record<string, string> = { high: 'red', medium: 'orange', low: 'default' };
const healthColors: Record<string, string> = { healthy: '#10b981', degraded: '#f59e0b', down: '#ef4444' };

export const WorkflowsPage = () => {
  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GitBranch style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>Workflow Orchestrator</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0' }}>Cross-system process automation and approval routing.</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fff7ed', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#ea580c', fontFamily: 'var(--font-heading)' }}>4</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Active Flows</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fef3c7', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#d97706', fontFamily: 'var(--font-heading)' }}>5</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Pending Approvals</div>
          </div>
        </div>
      </div>

      {/* Active Workflows */}
      <div className="widget-card">
        <div className="widget-header">
          <Play style={{ width: '18px', height: '18px', color: '#f97316' }} />
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Active Workflows</span>
        </div>
        <div>
          {activeWorkflows.map((wf) => (
            <div key={wf.id} style={{ padding: '16px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '14px' }} className="hover:bg-orange-50/20 transition-colors">
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: wf.status === 'active' ? '#eff6ff' : wf.status === 'paused' ? '#fffbeb' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {wf.status === 'active' ? <Play style={{ width: '16px', height: '16px', color: '#2563eb' }} /> :
                 wf.status === 'paused' ? <Pause style={{ width: '16px', height: '16px', color: '#d97706' }} /> :
                 <CheckCircle2 style={{ width: '16px', height: '16px', color: '#16a34a' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{wf.name}</span>
                  <Tag color={statusColors[wf.status]} style={{ fontSize: '10px' }}>{wf.status}</Tag>
                  <Tag color={urgencyColors[wf.priority]} style={{ fontSize: '10px' }}>{wf.priority}</Tag>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', fontSize: '12px', color: '#64748b' }}>
                  <span>Step {wf.completedSteps}/{wf.steps}: {wf.currentStep}</span>
                </div>
              </div>
              <div style={{ width: '100px', flexShrink: 0 }}>
                <Progress percent={wf.progress} size="small" strokeColor={wf.status === 'completed' ? '#10b981' : '#f97316'} format={(p) => <span style={{ fontSize: '11px' }}>{p}%</span>} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval Queue & Process Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-[1fr_340px]">
        {/* Approval Queue */}
        <div className="widget-card">
          <div className="widget-header">
            <Clock style={{ width: '18px', height: '18px', color: '#d97706' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Approval Queue</span>
            <Tag color="orange" style={{ marginLeft: 'auto', fontSize: '11px', borderRadius: '8px', padding: '1px 10px' }}>5 pending</Tag>
          </div>
          <div>
            {approvalQueue.map((item) => (
              <div key={item.id} style={{ padding: '14px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '12px' }} className="hover:bg-amber-50/20 transition-colors cursor-pointer">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{item.request}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>From: {item.requester}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>• {item.submitted}</span>
                  </div>
                </div>
                <Tag color={urgencyColors[item.urgency]} style={{ fontSize: '10px' }}>{item.urgency}</Tag>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                  <button style={{ background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Status */}
        <div className="widget-card">
          <div className="widget-header">
            <RotateCcw style={{ width: '18px', height: '18px', color: '#64748b' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Process Health</span>
          </div>
          <div className="widget-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {processStatus.map((proc, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: healthColors[proc.status], flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proc.process}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Last: {proc.lastRun}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: healthColors[proc.status] }}>{proc.successRate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
