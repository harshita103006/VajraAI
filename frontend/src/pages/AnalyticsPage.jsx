import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, AlertTriangle, TrendingUp, Shield, Download } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import { getThreatStats } from '../services/api';
import { MOCK_WEEKLY, MOCK_MODULE_DATA, MOCK_STATS } from '../lib/constants';
import toast from 'react-hot-toast';

const HOURLY = Array.from({ length: 24 }, (_, h) => ({
  h: `${h.toString().padStart(2,'0')}`,
  s: Math.max(4, Math.floor(18 + Math.sin((h-10) / 3) * 14 + Math.random() * 12)),
}));

const RISK_DIST = [
  { name: 'Critical', value: 8,  color: 'var(--crit)' },
  { name: 'High',     value: 18, color: 'var(--high)' },
  { name: 'Medium',   value: 31, color: 'var(--med)'  },
  { name: 'Low',      value: 24, color: 'var(--low)'  },
  { name: 'Safe',     value: 19, color: 'var(--safe)' },
];

const MODULE_BREAKDOWN = [
  { m: 'Email',      s: 421, th: 89 },
  { m: 'URL',        s: 387, th: 62 },
  { m: 'Attachment', s: 213, th: 31 },
  { m: 'Prompt',     s: 167, th: 47 },
];

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--surface-3)', border: '1px solid var(--line-2)', borderRadius: 10, padding: '10px 14px', fontFamily: 'var(--f-mono)', fontSize: 11, boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
      <div style={{ color: 'var(--ink-3)', marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: 'flex', gap: 10, marginBottom: 2 }}>
          <span style={{ color: p.color }}>{p.name}:</span>
          <span style={{ color: 'var(--ink-0)' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const Panel = ({ title, sub, children, style = {} }) => (
  <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-xl)', padding: '20px 20px 16px', ...style }}>
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--f-display)', fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>{title}</div>
      {sub && <div className="t-label" style={{ marginTop: 3 }}>{sub}</div>}
    </div>
    {children}
  </div>
);

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  useEffect(() => { getThreatStats().then(setStats).catch(() => {}); }, []);

  const totalScans   = MOCK_WEEKLY.reduce((a, d) => a + d.s, 0);
  const totalThreats = MOCK_WEEKLY.reduce((a, d) => a + d.th, 0);
  const detRate      = ((totalThreats / totalScans) * 100).toFixed(1);

  const exportData = () => {
    const csv = ['Day,Scans,Threats', ...MOCK_WEEKLY.map(d => `${d.day},${d.s},${d.th}`)].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    Object.assign(document.createElement('a'), { href: url, download: 'vajra-analytics.csv' }).click();
    toast.success('Exported analytics');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', marginBottom: 2 }}>Threat Analytics</h2>
          <p className="t-label">7-day intelligence summary</p>
        </div>
        <button onClick={exportData} className="btn-ghost" style={{ fontSize: 12, padding: '7px 14px' }}>
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <StatCard label="Total Scans (7d)"  value={totalScans.toLocaleString()} trend="up"   trendVal="+8.3%"  icon={BarChart3}     color="var(--a)"    index={0} />
        <StatCard label="Threats Detected"  value={totalThreats}                trend="down" trendVal="-12%"   icon={AlertTriangle} color="var(--crit)" index={1} />
        <StatCard label="Detection Rate"    value={`${detRate}%`}                                                icon={TrendingUp}    color="var(--high)" index={2} />
        <StatCard label="Bad Domains in DB" value={stats?.total_malicious_domains ?? '342'}                     icon={Shield}        color="var(--med)"  index={3} />
      </div>

      {/* Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
        <Panel title="Scan Volume vs Threats" sub="Last 7 days">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_WEEKLY} barGap={4} barCategoryGap="35%">
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--ink-3)', fontFamily: 'var(--f-mono)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--ink-3)', fontFamily: 'var(--f-mono)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="s"  name="Scans"   fill="var(--a)"    radius={[3,3,0,0]} opacity={0.5} />
              <Bar dataKey="th" name="Threats" fill="var(--crit)" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Risk Distribution" sub="By severity level">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie data={RISK_DIST} cx="50%" cy="50%" innerRadius={46} outerRadius={68} paddingAngle={3} dataKey="value" stroke="none">
                  {RISK_DIST.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          {RISK_DIST.map(r => (
            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: r.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--ink-2)', flex: 1 }}>{r.name}</span>
              <div style={{ width: 56, height: 3, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${r.value}%`, height: '100%', background: r.color }} />
              </div>
              <span style={{ fontSize: 10, fontFamily: 'var(--f-mono)', color: 'var(--ink-3)', width: 30, textAlign: 'right' }}>{r.value}%</span>
            </div>
          ))}
        </Panel>
      </div>

      {/* Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Panel title="Hourly Activity" sub="Today's scan volume by hour">
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={HOURLY} margin={{ top: 0, right: 0, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--a)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--a)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="h" tick={{ fontSize: 9, fill: 'var(--ink-3)', fontFamily: 'var(--f-mono)' }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--ink-3)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="s" name="Scans" stroke="var(--a)" strokeWidth={1.5} fill="url(#hGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Module Performance" sub="Scans and threat detection by scanner">
          <ResponsiveContainer width="100%" height={150}>
            <BarChart layout="vertical" data={MODULE_BREAKDOWN} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 9, fill: 'var(--ink-3)', fontFamily: 'var(--f-mono)' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="m" tick={{ fontSize: 11, fill: 'var(--ink-2)', fontFamily: 'var(--f-mono)' }} axisLine={false} tickLine={false} width={74} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="s"  name="Scans"   fill="var(--a)"    radius={[0,3,3,0]} opacity={0.5} />
              <Bar dataKey="th" name="Threats" fill="var(--crit)" radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}
