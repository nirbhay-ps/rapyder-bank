import { Tag, Progress, Button, Tooltip } from 'antd';
import { Bot, Video, Clock, Users, PhoneCall, AlertTriangle, CheckCircle2, MicOff, MonitorPlay, UserCheck, XCircle, Sparkles } from 'lucide-react';

// 4 simultaneous avatar slots
const avatarSlots = [
  {
    id: 1,
    slot: 'Avatar 1',
    meeting: 'Portfolio Review — Rajesh Kumar',
    platform: 'Zoom',
    status: 'active',
    duration: '23 min',
    confidence: 94,
    mode: 'Avatar Only',
    participants: ['Rajesh Kumar', 'Priya (Avatar)', 'Wealth Advisor'],
    currentTopic: 'Discussing Q4 equity performance',
    escalationRisk: 'low',
    sentiment: 88,
  },
  {
    id: 2,
    slot: 'Avatar 2',
    meeting: 'KYC Compliance Sync',
    platform: 'Teams',
    status: 'active',
    duration: '12 min',
    confidence: 87,
    mode: 'Avatar + Standby',
    participants: ['Compliance Team (5)', 'Priya (Avatar)'],
    currentTopic: 'Document verification for 3 clients',
    escalationRisk: 'medium',
    sentiment: 72,
  },
  {
    id: 3,
    slot: 'Avatar 3',
    meeting: 'Insurance Pitch — Vikram Patel',
    platform: 'Zoom',
    status: 'active',
    duration: '8 min',
    confidence: 91,
    mode: 'Avatar Only',
    participants: ['Vikram Patel', 'Priya (Avatar)'],
    currentTopic: 'Term insurance upgrade options',
    escalationRisk: 'low',
    sentiment: 95,
  },
  {
    id: 4,
    slot: 'Avatar 4',
    meeting: 'Branch Weekly Standup',
    platform: 'Teams',
    status: 'idle',
    duration: 'Starts in 45 min',
    confidence: 0,
    mode: 'Pending',
    participants: ['Branch Team (12)'],
    currentTopic: '—',
    escalationRisk: 'none',
    sentiment: 0,
  },
];

// Decision matrix from the deck
const decisionMatrix = [
  { scoreRange: '90–100', action: 'Must Attend in Person', mode: 'Human Present', color: '#ef4444', bg: '#fef2f2' },
  { scoreRange: '60–89', action: 'Avatar + Human on Standby', mode: 'Avatar + Standby', color: '#f59e0b', bg: '#fffbeb' },
  { scoreRange: '30–59', action: 'Full Avatar Representation', mode: 'Avatar Only', color: '#3b82f6', bg: '#eff6ff' },
  { scoreRange: '0–29', action: 'Decline with Summary', mode: 'Auto-Decline', color: '#94a3b8', bg: '#f8fafc' },
];

// Unified debrief from all avatar sessions
const unifiedDebrief = [
  {
    meeting: 'Portfolio Review — Rajesh Kumar',
    duration: '28 min',
    outcome: 'Positive',
    summary: 'Client satisfied with +18.2% Q4 returns. Agreed to increase mid-cap allocation to 20%. Wants international fund options explored.',
    actionItems: ['Send revised allocation proposal by Dec 20', 'Research 3 international fund options', 'Schedule Jan follow-up call'],
    escalations: 0,
  },
  {
    meeting: 'KYC Compliance Sync',
    duration: '18 min',
    outcome: 'Action Needed',
    summary: 'Compliance team flagged 3 pending KYC renewals. Digital KYC approved for 2 clients. Meera Sharma case needs manual intervention — escalated to RM.',
    actionItems: ['Complete Meera Sharma KYC manually', 'Verify digital KYC for Anita & Vikram', 'Submit compliance report by Friday'],
    escalations: 1,
  },
  {
    meeting: 'Insurance Pitch — Vikram Patel',
    duration: '15 min',
    outcome: 'Positive',
    summary: 'Client very interested in upgrading term insurance from ₹1Cr to ₹2Cr. Discussed critical illness rider. Ready to proceed this month.',
    actionItems: ['Send premium comparison document', 'Include critical illness rider quote', 'Process upgrade before month-end'],
    escalations: 0,
  },
];

const escalationRiskColors = { low: '#10b981', medium: '#f59e0b', high: '#ef4444', none: '#e2e8f0' };
const outcomeColors: Record<string, string> = { 'Positive': 'green', 'Action Needed': 'orange', 'Neutral': 'blue' };

export const AvatarPage = () => {
  const activeCount = avatarSlots.filter(s => s.status === 'active').length;

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>Employee.AI Multi-Avatar</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0' }}>4 simultaneous meeting avatars with real-time escalation to human.</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '10px 18px', background: '#f5f3ff', borderRadius: '12px', border: '1px solid #ede9fe' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#7c3aed', fontFamily: 'var(--font-heading)' }}>{activeCount}/4</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Avatars Active</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px 18px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#16a34a', fontFamily: 'var(--font-heading)' }}>91%</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Avg Confidence</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px 18px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#dc2626', fontFamily: 'var(--font-heading)' }}>1</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Escalation</div>
          </div>
        </div>
      </div>

      {/* 4 Avatar Slots - Live Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {avatarSlots.map((slot) => (
          <div key={slot.id} className="widget-card" style={{ border: slot.status === 'active' ? '1px solid #c4b5fd' : undefined }}>
            <div style={{ padding: '18px 20px' }}>
              {/* Slot header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: slot.status === 'active' ? '#f5f3ff' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MonitorPlay style={{ width: '14px', height: '14px', color: slot.status === 'active' ? '#7c3aed' : '#94a3b8' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-heading)' }}>{slot.slot}</span>
                </div>
                {slot.status === 'active' ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: '#16a34a', background: '#f0fdf4', padding: '4px 10px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <span className="animate-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} /> LIVE
                  </span>
                ) : (
                  <Tag style={{ fontSize: '11px', borderRadius: '6px' }}>Idle</Tag>
                )}
              </div>

              {/* Meeting info */}
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: '0 0 6px' }}>{slot.meeting}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Video style={{ width: '13px', height: '13px' }} />{slot.platform}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock style={{ width: '13px', height: '13px' }} />{slot.duration}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users style={{ width: '13px', height: '13px' }} />{slot.participants.length}</span>
              </div>

              {slot.status === 'active' && (
                <>
                  {/* Mode badge */}
                  <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag color="purple" style={{ fontSize: '11px', borderRadius: '6px', padding: '2px 10px' }}>{slot.mode}</Tag>
                    <Tooltip title="Escalation risk">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: escalationRiskColors[slot.escalationRisk as keyof typeof escalationRiskColors] }}>
                        <AlertTriangle style={{ width: '12px', height: '12px' }} />
                        {slot.escalationRisk} risk
                      </span>
                    </Tooltip>
                  </div>

                  {/* Current topic */}
                  <div style={{ marginTop: '12px', padding: '10px 12px', background: '#fafbfd', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Currently discussing</div>
                    <div style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic' }}>"{slot.currentTopic}"</div>
                  </div>

                  {/* Confidence + Sentiment */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Confidence</div>
                      <Progress percent={slot.confidence} size="small" strokeColor="#7c3aed" format={(p) => <span style={{ fontSize: '11px', fontWeight: 600 }}>{p}%</span>} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Sentiment</div>
                      <Progress percent={slot.sentiment} size="small" strokeColor={slot.sentiment >= 80 ? '#10b981' : '#f59e0b'} format={(p) => <span style={{ fontSize: '11px', fontWeight: 600 }}>{p}%</span>} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                    <Button size="small" type="primary" danger icon={<PhoneCall style={{ width: '12px', height: '12px' }} />} style={{ borderRadius: '8px', fontSize: '11px', flex: 1 }}>
                      Take Over
                    </Button>
                    <Tooltip title="Mute avatar">
                      <Button size="small" icon={<MicOff style={{ width: '12px', height: '12px' }} />} style={{ borderRadius: '8px' }} />
                    </Tooltip>
                    <Tooltip title="End session">
                      <Button size="small" icon={<XCircle style={{ width: '12px', height: '12px' }} />} style={{ borderRadius: '8px' }} />
                    </Tooltip>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Decision Matrix + Unified Debrief */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-[360px_1fr]">
        {/* Meeting Score Decision Matrix */}
        <div className="widget-card">
          <div className="widget-header">
            <UserCheck style={{ width: '18px', height: '18px', color: '#6366f1' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Decision Matrix</span>
          </div>
          <div className="widget-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Meeting importance score determines avatar mode:</p>
            {decisionMatrix.map((row) => (
              <div key={row.scoreRange} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '12px', background: row.bg, border: `1px solid ${row.color}20` }}>
                <div style={{ width: '52px', height: '36px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', color: row.color, fontFamily: 'var(--font-heading)', border: `1px solid ${row.color}30`, flexShrink: 0 }}>
                  {row.scoreRange}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{row.action}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{row.mode}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '8px', padding: '12px', background: '#fef2f2', borderRadius: '10px', fontSize: '12px', color: '#991b1b', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <AlertTriangle style={{ width: '14px', height: '14px', flexShrink: 0, marginTop: '1px' }} />
              <span>Avatar activation requires <strong>explicit consent</strong> each session per HR policy.</span>
            </div>
          </div>
        </div>

        {/* Unified Debrief */}
        <div className="widget-card">
          <div className="widget-header">
            <Sparkles style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Unified Debrief</span>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#64748b' }}>All avatar sessions consolidated</span>
          </div>
          <div className="widget-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {unifiedDebrief.map((d, i) => (
              <div key={i} style={{ padding: '18px', borderRadius: '12px', border: '1px solid #f1f5f9', background: '#fafbfd' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>{d.meeting}</span>
                  <Tag color={outcomeColors[d.outcome]} style={{ fontSize: '11px', borderRadius: '6px' }}>{d.outcome}</Tag>
                  <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: 'auto' }}>{d.duration}</span>
                  {d.escalations > 0 && (
                    <Tag color="red" style={{ fontSize: '10px', borderRadius: '6px' }}>{d.escalations} escalation</Tag>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>{d.summary}</p>
                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Action Items</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {d.actionItems.map((item, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
                        <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10b981', flexShrink: 0 }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
