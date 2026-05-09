import { Tag, Progress, Avatar } from 'antd';
import { Trophy, TrendingUp, Award, Crown, Flame, Zap } from 'lucide-react';

const leaderboard = [
  { rank: 1, name: 'Priya Nair', points: 2840, streak: 12, badge: 'Diamond', change: 'up', avatar: 'PN' },
  { rank: 2, name: 'Arjun Mehta', points: 2650, streak: 8, badge: 'Platinum', change: 'up', avatar: 'AM' },
  { rank: 3, name: 'Sneha Reddy', points: 2480, streak: 15, badge: 'Platinum', change: 'same', avatar: 'SR' },
  { rank: 4, name: 'Rahul Verma', points: 2310, streak: 5, badge: 'Gold', change: 'down', avatar: 'RV' },
  { rank: 5, name: 'Kavita Singh', points: 2180, streak: 9, badge: 'Gold', change: 'up', avatar: 'KS' },
  { rank: 6, name: 'Deepak Joshi', points: 2050, streak: 3, badge: 'Gold', change: 'down', avatar: 'DJ' },
  { rank: 7, name: 'Ananya Patel', points: 1920, streak: 7, badge: 'Silver', change: 'up', avatar: 'AP' },
  { rank: 8, name: 'Vikash Kumar', points: 1780, streak: 4, badge: 'Silver', change: 'same', avatar: 'VK' },
];

const badges = [
  { name: 'Client Whisperer', icon: '🎯', description: 'Maintained 95%+ client satisfaction for 30 days', earned: true, date: 'Dec 15' },
  { name: 'Speed Demon', icon: '⚡', description: 'Resolved 50 tasks in under 24 hours', earned: true, date: 'Dec 10' },
  { name: 'Cross-sell Champion', icon: '🏆', description: 'Achieved 10 successful cross-sells in a month', earned: true, date: 'Dec 5' },
  { name: 'Compliance Star', icon: '🛡️', description: '100% compliance score for 3 consecutive months', earned: true, date: 'Nov 28' },
  { name: 'Knowledge Guru', icon: '📚', description: 'Completed 20 learning modules', earned: false, progress: 85 },
  { name: 'Team Player', icon: '🤝', description: 'Helped 10 colleagues this month', earned: false, progress: 60 },
  { name: 'Early Bird', icon: '🌅', description: 'Completed all tasks before noon for 5 days', earned: false, progress: 40 },
  { name: 'Perfect Week', icon: '💎', description: 'Zero overdue tasks for an entire week', earned: false, progress: 70 },
];

const pointsHistory = [
  { date: 'Today', action: 'Completed portfolio review — Rajesh Kumar', points: '+45', category: 'Task' },
  { date: 'Today', action: 'AI draft approved and sent (3 emails)', points: '+30', category: 'Email' },
  { date: 'Yesterday', action: 'Cross-sell successful — Anita Desai MF', points: '+100', category: 'Revenue' },
  { date: 'Yesterday', action: 'KYC renewal submitted on time', points: '+25', category: 'Compliance' },
  { date: 'Dec 17', action: 'Streak bonus — 10 day streak!', points: '+50', category: 'Bonus' },
  { date: 'Dec 17', action: 'Client satisfaction survey — 5 stars', points: '+35', category: 'Satisfaction' },
  { date: 'Dec 16', action: 'Completed anti-phishing training', points: '+20', category: 'Learning' },
];

const rankColors = ['#fbbf24', '#94a3b8', '#cd7f32'];
const badgeColors: Record<string, string> = { Diamond: 'cyan', Platinum: 'purple', Gold: 'gold', Silver: 'default' };

export const GamificationPage = () => {
  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Trophy style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>Gamification Engine</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0' }}>Points, badges, leaderboard for RM performance engagement.</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fffbeb', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#d97706', fontFamily: 'var(--font-heading)' }}>2,840</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Your Points</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fef2f2', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '18px', fontWeight: 700, color: '#ef4444', fontFamily: 'var(--font-heading)' }}><Flame style={{ width: '16px', height: '16px' }} />12</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Day Streak</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f5f3ff', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#7c3aed', fontFamily: 'var(--font-heading)' }}>#1</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Your Rank</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-[1fr_380px]">
        {/* Leaderboard */}
        <div className="widget-card">
          <div className="widget-header">
            <Crown style={{ width: '18px', height: '18px', color: '#fbbf24' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Leaderboard</span>
            <Tag color="gold" style={{ marginLeft: 'auto', fontSize: '11px', borderRadius: '8px', padding: '1px 10px' }}>This Month</Tag>
          </div>
          <div>
            {leaderboard.map((player) => (
              <div key={player.rank} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px var(--card-padding)', borderBottom: '1px solid #f8fafc', background: player.rank === 1 ? '#fffbeb' : 'transparent' }} className="hover:bg-amber-50/30 transition-colors">
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: player.rank <= 3 ? rankColors[player.rank - 1] : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: player.rank <= 3 ? 'white' : '#64748b', fontFamily: 'var(--font-heading)', flexShrink: 0 }}>
                  {player.rank}
                </div>
                <Avatar style={{ background: player.rank === 1 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#e2e8f0', color: player.rank === 1 ? 'white' : '#64748b', fontFamily: 'var(--font-heading)', fontSize: '12px' }} size={36}>
                  {player.avatar}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{player.name}</span>
                    <Tag color={badgeColors[player.badge]} style={{ fontSize: '10px', padding: '0 6px' }}>{player.badge}</Tag>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{player.points.toLocaleString()} pts</span>
                    <span style={{ fontSize: '11px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '3px' }}><Flame style={{ width: '12px', height: '12px' }} />{player.streak} days</span>
                  </div>
                </div>
                {player.change === 'up' && <TrendingUp style={{ width: '16px', height: '16px', color: '#10b981' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
          {/* Badges Grid */}
          <div className="widget-card">
            <div className="widget-header">
              <Award style={{ width: '18px', height: '18px', color: '#8b5cf6' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Badges</span>
              <Tag style={{ marginLeft: 'auto', fontSize: '11px' }}>4/8 earned</Tag>
            </div>
            <div className="widget-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {badges.map((badge, i) => (
                <div key={i} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #f1f5f9', background: badge.earned ? '#fafbfd' : '#f8fafc', opacity: badge.earned ? 1 : 0.7, textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{badge.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>{badge.name}</div>
                  {badge.earned ? (
                    <div style={{ fontSize: '10px', color: '#10b981', marginTop: '4px' }}>✓ Earned {badge.date}</div>
                  ) : (
                    <Progress percent={badge.progress} size="small" strokeColor="#8b5cf6" style={{ marginTop: '6px' }} format={(p) => <span style={{ fontSize: '10px' }}>{p}%</span>} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Points History */}
          <div className="widget-card">
            <div className="widget-header">
              <Zap style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Points History</span>
            </div>
            <div>
              {pointsHistory.map((item, i) => (
                <div key={i} style={{ padding: '10px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.action}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.date}</div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-heading)' }}>{item.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
