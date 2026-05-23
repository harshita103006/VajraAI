import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS } from '../../lib/constants';

export default function Sidebar({ collapsed, setCollapsed, mobile }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const show = !collapsed;

  const handleLogout = () => { logout(); navigate('/'); };
  const handleNavClick = () => { if (mobile) setCollapsed(true); };

  return (
    <motion.aside
      initial={false}
      animate={{ width: mobile ? 220 : (collapsed ? 52 : 220) }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'var(--surface-0)',
        borderRight: '1px solid var(--line-0)',
        height: '100vh',
        position: 'fixed', left: 0, top: 0, zIndex: 50,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Logo row */}
      <div style={{
        height: 52, display: 'flex', alignItems: 'center',
        padding: '0 10px', gap: 10, flexShrink: 0,
        borderBottom: '1px solid var(--line-0)',
      }}>
        <div style={{
          width: 30, height: 30, flexShrink: 0,
          background: 'var(--a)', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 12px rgba(200,255,0,0.3)',
        }}>
          <Shield size={15} color="#050608" strokeWidth={2.5} />
        </div>

        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              style={{ flex: 1, overflow: 'hidden' }}
            >
              <div style={{
                fontFamily: 'var(--f-display)', fontWeight: 800,
                fontSize: 15, letterSpacing: '-0.03em',
                color: 'var(--ink-0)', whiteSpace: 'nowrap',
              }}>
                Vajra<span style={{ color: 'var(--a)' }}>AI</span>
              </div>
              <div style={{ fontSize: 9, fontFamily: 'var(--f-mono)', color: 'var(--ink-3)', letterSpacing: '0.1em', marginTop: -1 }}>
                THREAT INTELLIGENCE
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!mobile && (
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{
              flexShrink: 0, width: 22, height: 22, borderRadius: 6,
              background: 'var(--glass-1)', border: '1px solid var(--line-1)',
              cursor: 'pointer', color: 'var(--ink-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--glass-1)'}
          >
            {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '6px 0' }}>
        {NAV_ITEMS.map((item, idx) => {
          if (item.divider) {
            return (
              <AnimatePresence key={`d${idx}`}>
                {show && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{
                      padding: '16px 16px 5px',
                      fontSize: 9, fontFamily: 'var(--f-mono)',
                      fontWeight: 600, letterSpacing: '0.14em',
                      color: 'var(--ink-3)',
                    }}
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            );
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              style={{ margin: '0 6px', borderRadius: 'var(--r-md)' }}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      style={{
                        position: 'absolute', left: 0, top: '50%',
                        transform: 'translateY(-50%)',
                        width: 2, height: '60%', borderRadius: 2,
                        background: item.color || 'var(--a)',
                      }}
                    />
                  )}
                  <span style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, width: 18,
                    color: isActive ? (item.color || 'var(--a)') : 'var(--ink-2)',
                    transition: 'color 0.15s',
                  }}>
                    <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                  </span>
                  <AnimatePresence>
                    {show && (
                      <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.13 }}
                        style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User row */}
      <div style={{ borderTop: '1px solid var(--line-0)', padding: '8px', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 6px', borderRadius: 'var(--r-md)',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--a-dim), var(--surface-3))',
            border: '1px solid var(--a-glow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 11, color: 'var(--a)',
          }}>
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <AnimatePresence>
            {show && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ flex: 1, minWidth: 0 }}
              >
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || 'Analyst'}
                </div>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'var(--f-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {show && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={handleLogout}
                style={{
                  flexShrink: 0, background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--ink-3)', padding: 4,
                  borderRadius: 6, display: 'flex', alignItems: 'center',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--crit)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-3)'}
              >
                <LogOut size={13} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
