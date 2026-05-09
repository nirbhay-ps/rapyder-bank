import { Tag, Progress } from 'antd';
import { Mic, Phone, Clock, TrendingUp, MessageSquare, BarChart3, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

const recentCalls = [
  { id: 1, client: 'Rajesh Kumar', duration: '18:42', date: 'Today, 11:30 AM', sentiment: 'positive', score: 92, topics: ['Portfolio review', 'Mid-cap allocation'], summary: 'Client satisfied with Q4 returns. Agreed to increase mid-cap allocation to 20%. Follow-up scheduled for next week.' },
  { id: 2, client: 'Meera Sharma', duration: '12:15', date: 'Today, 10:00 AM', sentiment: 'negative', score: 45, topics: ['Service complaint', 'Response time'], summary: 'Client frustrated with delayed response on insurance claim. Escalated to claims team. Promised resolution within 48 hours.' },
  { id: 3, client: 'Anita Desai', duration: '8:30', date: 'Yesterday, 4:15 PM', sentiment: 'positive', score: 88, topics: ['FD renewal', 'Rate comparison'], summary: 'Discussed FD renewal options. Client interested in laddering strategy. Will send comparison sheet by email.' },
  { id: 4, client: 'Vikram Patel', duration: '22:10', date: 'Yesterday, 2:00 PM', sentiment: 'neutral', score: 68, topics: ['Home loan', 'EMI restructuring'], summary: 'Client inquired about EMI restructuring options. Explained available plans. Needs time to discuss with family.' },
  { id: 5, client: 'Suresh Iyer', duration: '15:45', date: 'Yesterday, 11:00 AM', sentiment: 'positive', score: 95, topics: ['PMS performance', 'New AIF opportunity'], summary: 'Reviewed PMS performance (+22% YTD). Client very interested in new AIF opportunity. Sending detailed prospectus.' },
];

const keyTopics = [
  { topic: 'Portfolio Performance', mentions: 12, sentiment: 'positive', trend: 'up' },
  { topic: 'Service Response Time', mentions: 8, sentiment: 'negative', trend: 'up' },
  { topic: 'Cross-sell Opportunities', mentions: 7, sentiment: 'positive', trend: 'stable' },
  { topic: 'Compliance & KYC', mentions: 6, sentiment: 'neutral', trend: 'stable' },
  { topic: 'Digital Banking', mentions: 5, sentiment: 'positive', trend: 'up' },
  { topic: 'Rate Inquiries', mentions: 4, sentiment: 'neutral', trend: 'down' },
];

const sentimentIcons = { positive: ThumbsUp, negative: ThumbsDown, neutral: Minus };
const sentimentColors = { positive: '#10b981', negative: '#ef4444', neutral: '#94a3b8' };

export const VoicePage = () => {
  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #f43f5e, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mic style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>Voice Intelligence</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0' }}>Real-time call transcription and sentiment analysis.</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fff1f2', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#e11d48', fontFamily: 'var(--font-heading)' }}>23</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Calls This Week</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f0fdf4', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a', fontFamily: 'var(--font-heading)' }}>78%</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Positive Sentiment</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-[1fr_340px]">
        {/* Call Transcripts */}
        <div className="widget-card">
          <div className="widget-header">
            <Phone style={{ width: '18px', height: '18px', color: '#e11d48' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Recent Call Transcripts</span>
          </div>
          <div>
            {recentCalls.map((call) => {
              const SentimentIcon = sentimentIcons[call.sentiment as keyof typeof sentimentIcons];
              return (
                <div key={call.id} style={{ padding: '16px var(--card-padding)', borderBottom: '1px solid #f8fafc' }} className="hover:bg-rose-50/20 transition-colors cursor-pointer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: sentimentColors[call.sentiment as keyof typeof sentimentColors] + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <SentimentIcon style={{ width: '16px', height: '16px', color: sentimentColors[call.sentiment as keyof typeof sentimentColors] }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{call.client}</span>
                        <Tag color={call.sentiment === 'positive' ? 'green' : call.sentiment === 'negative' ? 'red' : 'default'} style={{ fontSize: '10px' }}>{call.sentiment}</Tag>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '3px', fontSize: '12px', color: '#94a3b8' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Clock style={{ width: '12px', height: '12px' }} />{call.duration}</span>
                        <span>{call.date}</span>
                      </div>
                    </div>
                    <Progress type="circle" percent={call.score} size={36} strokeWidth={8} strokeColor={call.score >= 80 ? '#10b981' : call.score >= 60 ? '#f59e0b' : '#ef4444'} format={(p) => <span style={{ fontSize: '10px', fontWeight: 700 }}>{p}</span>} />
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6', marginLeft: '44px' }}>{call.summary}</p>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px', marginLeft: '44px' }}>
                    {call.topics.map((t, i) => <Tag key={i} style={{ fontSize: '10px', borderRadius: '6px' }}>{t}</Tag>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
          {/* Sentiment Overview */}
          <div className="widget-card">
            <div className="widget-header">
              <BarChart3 style={{ width: '18px', height: '18px', color: '#8b5cf6' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Sentiment Analysis</span>
            </div>
            <div className="widget-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><ThumbsUp style={{ width: '13px', height: '13px' }} /> Positive</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>78%</span>
                  </div>
                  <Progress percent={78} showInfo={false} strokeColor="#10b981" />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Minus style={{ width: '13px', height: '13px' }} /> Neutral</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>14%</span>
                  </div>
                  <Progress percent={14} showInfo={false} strokeColor="#94a3b8" />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><ThumbsDown style={{ width: '13px', height: '13px' }} /> Negative</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444' }}>8%</span>
                  </div>
                  <Progress percent={8} showInfo={false} strokeColor="#ef4444" />
                </div>
              </div>
            </div>
          </div>

          {/* Key Topics */}
          <div className="widget-card">
            <div className="widget-header">
              <MessageSquare style={{ width: '18px', height: '18px', color: '#2563eb' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Key Topics</span>
            </div>
            <div>
              {keyTopics.map((topic, i) => (
                <div key={i} style={{ padding: '10px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b' }}>{topic.topic}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{topic.mentions} mentions</div>
                  </div>
                  <Tag color={topic.sentiment === 'positive' ? 'green' : topic.sentiment === 'negative' ? 'red' : 'default'} style={{ fontSize: '10px' }}>{topic.sentiment}</Tag>
                  {topic.trend === 'up' && <TrendingUp style={{ width: '14px', height: '14px', color: '#10b981' }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
