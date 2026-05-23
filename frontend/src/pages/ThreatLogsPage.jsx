import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import RiskBadge from '../components/ui/RiskBadge';
import { getThreatLogs } from '../services/api';
import { formatDate, timeAgo, truncate } from '../lib/utils';
import { MOCK_THREAT_LOGS } from '../lib/constants';
import toast from 'react-hot-toast';

const MODULES = ['All','email','url','attachment','prompt'];
const LEVELS  = ['All','CRITICAL','HIGH','MEDIUM','LOW','SAFE'];
const PER     = 15;

function FilterPill({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 12px', borderRadius: 99, border: 'none',
      background: active ? 'var(--surface-4)' : 'transparent',
      color: active ? 'var(--ink-0)' : 'var(--ink-3)',
      cursor: 'pointer', fontSize: 11, fontFamily: 'var(--f-mono)',
      border: active ? '1px solid var(--line-2)' : '1px solid transparent',
      transition: 'all 0.15s',
    }}>
      {label}
    </button>
  );
}

export default function ThreatLogsPage() {
  const [logs,    setLogs]   = useState(MOCK_THREAT_LOGS);
  const [loading, setLoading]= useState(false);
  const [search,  setSearch] = useState('');
  const [mod,     setMod]    = useState('All');
  const [lvl,     setLvl]    = useState('All');
  const [sort,    setSort]   = useState('desc');
  const [page,    setPage]   = useState(0);

  const reload = () => {
    setLoading(true);
    getThreatLogs()
      .then(d => { if (Array.isArray(d) && d.length) setLogs(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => {
    let r = [...logs];
    if (mod !== 'All') r = r.filter(l => l.module === mod);
    if (lvl !== 'All') r = r.filter(l => l.risk_level === lvl);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(l => l.threat_type?.toLowerCase().includes(q) || l.module?.toLowerCase().includes(q));
    }
    r.sort((a,b) => sort === 'desc' ? new Date(b.created_at) - new Date(a.created_at) : new Date(a.created_at) - new Date(b.created_at));
    return r;
  }, [logs, mod, lvl, search, sort]);

  const rows       = filtered.slice(page * PER, (page+1) * PER);
  const totalPages = Math.ceil(filtered.length / PER);

  const exportCSV = () => {
    const csv = ['Module,Threat,Level,Date', ...filtered.map(l => `${l.module},${l.threat_type},${l.risk_level},${l.created_at}`)].join('\n');
    Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv],{type:'text/csv'})), download: 'vajra-logs.csv' }).click();
    toast.success('Exported CSV');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', marginBottom: 2 }}>Threat Logs</h2>
          <p className="t-label">{filtered.length} entries</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={exportCSV} className="btn-ghost" style={{ fontSize: 12, padding: '7px 14px' }}><Download size={12} /> Export</button>
          <button onClick={reload} className="btn-ghost" style={{ fontSize: 12, padding: '7px 14px' }}>
            <RefreshCw size={12} style={loading ? { animation: 'spin 1s linear infinite' } : {}} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-xl)', padding: '12px 16px', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-0)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-md)', padding: '0 12px', flex: '1 1 180px' }}>
          <Search size={12} color="var(--ink-3)" />
          <input type="text" placeholder="Search threats…" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--ink-0)', fontSize: 12, padding: '7px 0', flex: 1, fontFamily: 'var(--f-body)' }} />
        </div>

        {/* Module filter */}
        <div style={{ display: 'flex', gap: 3 }}>
          {MODULES.map(m => <FilterPill key={m} label={m} active={mod===m} onClick={() => { setMod(m); setPage(0); }} />)}
        </div>

        <div style={{ width: 1, height: 18, background: 'var(--line-1)' }} />

        {/* Level filter */}
        <div style={{ display: 'flex', gap: 3 }}>
          {LEVELS.map(l => <FilterPill key={l} label={l} active={lvl===l} onClick={() => { setLvl(l); setPage(0); }} />)}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
        {/* Head */}
        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 110px 170px', padding: '10px 18px', borderBottom: '1px solid var(--line-1)' }}>
          <span className="t-label">Module</span>
          <span className="t-label">Threat</span>
          <span className="t-label">Risk</span>
          <button
            onClick={() => setSort(s => s==='desc'?'asc':'desc')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--f-mono)', fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-2)' }}
          >
            Date {sort==='desc' ? <ChevronDown size={10}/> : <ChevronUp size={10}/>}
          </button>
        </div>

        {rows.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>No results match your filters</div>
        ) : rows.map((log, i) => (
          <motion.div
            key={log.id || i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
            style={{ display: 'grid', gridTemplateColumns: '100px 1fr 110px 170px', padding: '10px 18px', borderBottom: i < rows.length-1 ? '1px solid var(--line-0)' : 'none', alignItems: 'center', cursor: 'default' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ink-3)', background: 'var(--surface-0)', border: '1px solid var(--line-1)', borderRadius: 5, padding: '2px 7px', display: 'inline-block' }}>
              {log.module?.toUpperCase()}
            </span>
            <span style={{ fontSize: 12.5, color: 'var(--ink-1)', paddingRight: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {truncate(log.threat_type, 55)}
            </span>
            <span><RiskBadge level={log.risk_level} size="sm" /></span>
            <span style={{ fontSize: 11, fontFamily: 'var(--f-mono)', color: 'var(--ink-3)' }}>{timeAgo(log.created_at)}</span>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
          {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => (
            <button key={i} onClick={() => setPage(i)} style={{
              width: 30, height: 30, borderRadius: 'var(--r-sm)',
              background: page===i ? 'var(--a)' : 'var(--surface-1)',
              border: `1px solid ${page===i ? 'var(--a)' : 'var(--line-1)'}`,
              color: page===i ? 'var(--base)' : 'var(--ink-2)',
              cursor: 'pointer', fontSize: 12, fontFamily: 'var(--f-mono)',
              fontWeight: page===i ? 700 : 400,
            }}>{i+1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
