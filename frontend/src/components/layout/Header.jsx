import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Menu, X, Command } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS } from '../../lib/constants';

function LiveDot() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: 7, height: 7 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'var(--safe)', boxShadow: '0 0 5px var(--safe)',
        }} />
        <div style={{
          position: 'absolute', inset: -3, borderRadius: '50%',
          border: '1px solid var(--safe)', opacity: 0.4,
          animation: 'pulse-slow 2.5s ease-in-out infinite',
        }} />
      </div>
      <span style={{ fontSize: 10, color: 'var(--safe)', fontFamily: 'var(--f-mono)', letterSpacing: '0.1em' }}>
        LIVE
      </span>
    </div>
  );
}

const PAGE_TITLES = Object.fromEntries(
  NAV_ITEMS.filter(n => n.to).map(n => [n.to, n.label])
);

export default function Header({ collapsed, setCollapsed, mobile }) {
  const { user } = useAuth();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const title = PAGE_TITLES[location.pathname] || 'VajraAI';

  return (
    <header style={{
      height: 52, borderBottom: '1px solid var(--line-0)',
      display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: 14,
      background: 'rgba(8,10,15,0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      position: 'sticky', top: 0, zIndex: 40,
    }}>
      {mobile && (
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-2)', display: 'flex', padding: 4 }}
        >
          {collapsed ? <Menu size={17} /> : <X size={17} />}
        </button>
      )}

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 10, fontFamily: 'var(--f-mono)', color: 'var(--ink-3)', letterSpacing: '0.08em' }}>
          VAJRA
        </span>
        <span style={{ color: 'var(--line-2)', fontSize: 11 }}>/</span>
        <span style={{ fontFamily: 'var(--f-display)', fontWeight: 600, fontSize: 14, color: 'var(--ink-0)', letterSpacing: '-0.01em' }}>
          {title}
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div
        className="hide-sm"
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--glass-1)', border: '1px solid var(--line-1)',
          borderRadius: 'var(--r-md)', padding: '0 10px', width: 200,
          cursor: 'text',
          transition: 'border-color 0.15s',
        }}
        onFocus={() => {}}
      >
        <Search size={12} color="var(--ink-3)" />
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: 'none', border: 'none', outline: 'none',
            color: 'var(--ink-0)', fontSize: 12, flex: 1,
            fontFamily: 'var(--f-body)', padding: '7px 0',
          }}
        />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 1,
          background: 'var(--glass-2)', border: '1px solid var(--line-1)',
          borderRadius: 4, padding: '1px 5px',
        }}>
          <Command size={8} color="var(--ink-3)" />
          <span style={{ fontSize: 9, fontFamily: 'var(--f-mono)', color: 'var(--ink-3)' }}>K</span>
        </div>
      </div>

      <LiveDot />

      <button style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--ink-3)', padding: 4, borderRadius: 6,
        display: 'flex', alignItems: 'center',
        transition: 'color 0.15s',
      }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--ink-1)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-3)'}
      >
        <Bell size={15} />
      </button>

      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, var(--a-dim), var(--surface-3))',
        border: '1px solid var(--a-glow)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 11,
        color: 'var(--a)', cursor: 'pointer',
      }}>
        {user?.name?.[0]?.toUpperCase() || 'A'}
      </div>
    </header>
  );
}
