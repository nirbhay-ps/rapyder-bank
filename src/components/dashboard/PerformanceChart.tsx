import { Segmented } from 'antd';
import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DataPoint { [key: string]: string | number; actions: number; emails: number; crossSell: number; timeSaved: number; }

const weeklyData: DataPoint[] = [
  { day: 'Mon', actions: 28, emails: 15, crossSell: 3, timeSaved: 65 },
  { day: 'Tue', actions: 35, emails: 18, crossSell: 5, timeSaved: 72 },
  { day: 'Wed', actions: 42, emails: 22, crossSell: 4, timeSaved: 80 },
  { day: 'Thu', actions: 38, emails: 20, crossSell: 6, timeSaved: 75 },
  { day: 'Fri', actions: 47, emails: 25, crossSell: 7, timeSaved: 88 },
  { day: 'Sat', actions: 12, emails: 5, crossSell: 1, timeSaved: 30 },
  { day: 'Sun', actions: 5, emails: 2, crossSell: 0, timeSaved: 15 },
];

const monthlyData: DataPoint[] = [
  { week: 'W1', actions: 145, emails: 82, crossSell: 12, timeSaved: 320 },
  { week: 'W2', actions: 168, emails: 95, crossSell: 18, timeSaved: 380 },
  { week: 'W3', actions: 192, emails: 105, crossSell: 22, timeSaved: 420 },
  { week: 'W4', actions: 207, emails: 112, crossSell: 26, timeSaved: 445 },
];

export const PerformanceChart = () => {
  const [period, setPeriod] = useState<string>('Week');
  const data = period === 'Week' ? weeklyData : monthlyData;
  const xKey = period === 'Week' ? 'day' : 'week';

  return (
    <div className="widget-card">
      <div className="widget-header">
        <BarChart3 style={{ width: '16px', height: '16px', color: '#8b2252' }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#2d2d2d', fontFamily: 'var(--font-heading)' }}>Analytics</span>
        <div style={{ marginLeft: 'auto' }}>
          <Segmented size="small" options={['Week', 'Month']} value={period} onChange={(v) => setPeriod(v as string)} />
        </div>
      </div>
      <div className="widget-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#888', fontWeight: 500, marginBottom: '14px' }}>Time saved & actions</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b2252" stopOpacity={0.08} /><stop offset="95%" stopColor="#8b2252" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d4547a" stopOpacity={0.08} /><stop offset="95%" stopColor="#d4547a" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eded" />
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #ebe5e5', fontSize: 12 }} />
                <Area type="monotone" dataKey="timeSaved" stroke="#8b2252" strokeWidth={2} fill="url(#gA)" name="Time (min)" />
                <Area type="monotone" dataKey="actions" stroke="#d4547a" strokeWidth={2} fill="url(#gT)" name="Actions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#888', fontWeight: 500, marginBottom: '14px' }}>Emails & cross-sell</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eded" />
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #ebe5e5', fontSize: 12 }} />
                <Bar dataKey="emails" fill="#8b2252" radius={[4, 4, 0, 0]} name="Emails" />
                <Bar dataKey="crossSell" fill="#d4547a" radius={[4, 4, 0, 0]} name="Cross-sell" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
