import { Progress, Tooltip } from 'antd';
import { Trophy, Flame } from 'lucide-react';

const badges = [
  { name: 'Email Champion', icon: '📧', earned: true },
  { name: 'Cross-sell Pro', icon: '💎', earned: true },
  { name: 'Compliance Star', icon: '🛡️', earned: true },
  { name: 'Speed Demon', icon: '⚡', earned: false },
];

const leaderboard = [
  { name: 'Amit R.', points: 3120, rank: 1 },
  { name: 'Neha K.', points: 2950, rank: 2 },
  { name: 'Priya S.', points: 2840, rank: 3, isYou: true },
];

export const GamificationWidget = () => {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <Trophy style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#2d2d2d', fontFamily: 'var(--font-heading)' }}>Performance</span>
      </div>
      <div className="widget-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '22px', fontWeight: 700, color: '#2d2d2d', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>2,840</p>
            <p style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>points</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '14px', background: '#fff7ed', border: '1px solid #fed7aa' }}>
            <Flame style={{ width: '14px', height: '14px', color: '#f97316' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#ea580c' }}>12 days</span>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: '#666' }}>Level 7 → 8</span>
            <span style={{ fontSize: '10px', color: '#aaa' }}>160 to go</span>
          </div>
          <Progress percent={84} size="small" strokeColor="#8b2252" showInfo={false} />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {badges.map((b) => (
            <Tooltip key={b.name} title={b.name}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', background: b.earned ? '#f5f0f0' : '#fafafa', opacity: b.earned ? 1 : 0.3, cursor: b.earned ? 'pointer' : 'default' }} className={b.earned ? 'hover:scale-105 transition-transform' : ''}>
                {b.icon}
              </div>
            </Tooltip>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {leaderboard.map((p) => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 10px', borderRadius: '8px', background: p.isYou ? '#fdf2f8' : 'transparent' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: p.rank === 1 ? '#f59e0b' : '#bbb', width: '16px' }}>#{p.rank}</span>
              <span style={{ fontSize: '12px', flex: 1, fontWeight: p.isYou ? 600 : 400, color: p.isYou ? '#8b2252' : '#555' }}>{p.name}</span>
              <span style={{ fontSize: '11px', color: '#999', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{p.points.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
