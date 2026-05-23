import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Link2, Mail, FileSearch, Brain, AlertTriangle, Activity, Database, ArrowRight, BarChart3, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/dashboard/StatCard';
import RiskBadge from '../components/ui/RiskBadge';
import { formatDate, timeAgo } from '../lib/utils';
import { getThreatLogs, getThreatStats } from '../services/api';
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery';
import { MOCK_AREA_DATA, MOCK_MODULE_DATA, MOCK_THREAT_LOGS, MOCK_STATS } from '../lib/constants';

const ChartTip = ({ active, payload, label }) => {
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

const QUICK = [
  { label: 'URL Scanner',      icon: Link2,       to: '/scan/url',        color: 'var(--high)',  desc: 'Analyze a suspicious link' },
  { label: 'Email Scanner',    icon: Mail,        to: '/scan/email',      color: 'var(--a)',     desc: 'Check for phishing' },
  { label: 'Scan File',        icon: FileSearch,  to: '/scan/attachment', color: 'var(--med)',   desc: 'Inspect an attachment' },
  { label: 'Prompt Injection', icon: Brain,       to: '/scan/prompt',     color: 'var(--crit)',  desc: 'Detect AI manipulation' },
];

export default function DashboardPage() {
  const navigate  = useNavigate();
  const isMobile  = useIsMobile();
  const isTablet  = useIsTablet();
  const [logs,    setLogs]    = useState(MOCK_THREAT_LOGS.slice(0,8));
  const [stats,   setStats]   = useState(null);

  useEffect(() => {
    Promise.all([getThreatLogs(), getThreatStats()])
      .then(([l, s]) => { if (Array.isArray(l) && l.length) setLogs(l.slice(0,8)); setStats(s); })
      .catch(() => {});
  }, []);

  const statCols  = isMobile ? '1fr 1fr' : 'repeat(4,1fr)';
  const chartCols = isTablet ? '1fr' : '1fr 280px';
  const botCols   = isTablet ? '1fr' : '1fr 300px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: statCols, gap: 12 }}>
        <StatCard label="Scans Today"      value={MOCK_STATS.scansToday}          trend="up"   trendVal={MOCK_STATS.scansTrend}    sub="vs yesterday"  icon={Activity}      color="var(--a)"    index={0} />
        <StatCard label="Threats Blocked"  value={MOCK_STATS.threatsBlocked}      trend="down" trendVal={MOCK_STATS.threatsTrend}  sub="last 24h"      icon={AlertTriangle} color="var(--crit)" index={1} />
        <StatCard label="Avg Risk Score"   value={MOCK_STATS.avgRiskScore}                                                          sub="of 100"        icon={Shield}        color="var(--med)"  index={2} />
        <StatCard label="Bad Domains (DB)" value={stats?.total_malicious_domains ?? MOCK_STATS.badDomains}                          icon={Database}     color="var(--high)"  index={3} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: chartCols, gap: 14 }}>
        {/* Area */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-xl)', padding: '20px 20px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: 'var(--f-display)', fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>Scan Activity</div>
              <div className="t-label" style={{ marginTop: 3 }}>Last 24 hours</div>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              {[['var(--a)','Scans'],['var(--crit)','Threats']].map(([c,l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 16, height: 2, background: c, borderRadius: 1 }} />
                  <span style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'var(--f-mono)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={MOCK_AREA_DATA} margin={{ top: 0, right: 0, left: -22, bottom: 0 }}>
              <defs>
                {[['gS','var(--a)'],['gT','var(--crit)']].map(([id,c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={c} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: 'var(--ink-3)', fontFamily: 'var(--f-mono)' }} axisLine={false} tickLine={false} />
              <YAxis                tick={{ fontSize: 10, fill: 'var(--ink-3)', fontFamily: 'var(--f-mono)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="s" name="Scans"   stroke="var(--a)"    strokeWidth={1.5} fill="url(#gS)" dot={false} />
              <Area type="monotone" dataKey="th" name="Threats" stroke="var(--crit)" strokeWidth={1.5} fill="url(#gT)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        {!isTablet && (
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-xl)', padding: '20px' }}>
            <div style={{ fontFamily: 'var(--f-display)', fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em', marginBottom: 2 }}>By Module</div>
            <div className="t-label" style={{ marginBottom: 14 }}>Threat distribution</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={MOCK_MODULE_DATA} cx="50%" cy="50%" innerRadius={42} outerRadius={64} paddingAngle={3} dataKey="value" stroke="none">
                    {MOCK_MODULE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            {MOCK_MODULE_DATA.map(m => (
              <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: m.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--ink-2)', flex: 1 }}>{m.name}</span>
                <div style={{ width: 60, height: 3, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${m.value}%`, height: '100%', background: m.color }} />
                </div>
                <span style={{ fontSize: 11, fontFamily: 'var(--f-mono)', color: 'var(--ink-1)', width: 28, textAlign: 'right' }}>{m.value}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: botCols, gap: 14 }}>
        {/* Threat log */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--line-0)' }}>
            <div style={{ fontFamily: 'var(--f-display)', fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>Recent Threats</div>
            <button onClick={() => navigate('/logs')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--a)', fontFamily: 'var(--f-body)' }}>
              View all <ArrowRight size={12} />
            </button>
          </div>
          {logs.map((log, i) => (
            <motion.div
              key={log.id || i}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderBottom: i < logs.length - 1 ? '1px solid var(--line-0)' : 'none', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <RiskBadge level={log.risk_level} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: 'var(--ink-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.threat_type}</div>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 1, fontFamily: 'var(--f-mono)' }}>{log.module?.toUpperCase()}</div>
              </div>
              <span style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'var(--f-mono)', whiteSpace: 'nowrap' }}>{timeAgo(log.created_at)}</span>
            </motion.div>
          ))}
        </div>

        {/* Quick scan */}
        {!isMobile && (
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-xl)', padding: '16px' }}>
            <div style={{ fontFamily: 'var(--f-display)', fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em', marginBottom: 14 }}>Quick Scan</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {QUICK.map(a => {
                const Icon = a.icon;
                return (
                  <motion.button
                    key={a.to}
                    onClick={() => navigate(a.to)}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.15 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 12px', borderRadius: 'var(--r-md)', background: 'var(--surface-0)', border: '1px solid var(--line-1)', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--line-2)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line-1)'}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `${a.color}14`, border: `1px solid ${a.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color={a.color} strokeWidth={1.8} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-0)' }}>{a.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>{a.desc}</div>
                    </div>
                    <ArrowRight size={12} color="var(--ink-3)" />
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
