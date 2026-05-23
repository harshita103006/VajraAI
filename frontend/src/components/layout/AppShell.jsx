import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const handle = () => {
      const m = window.innerWidth < 768;
      setMobile(m);
      if (m) setCollapsed(true);
    };
    window.addEventListener('resize', handle);
    handle();
    return () => window.removeEventListener('resize', handle);
  }, []);

  const sidebarW = mobile ? 0 : (collapsed ? 52 : 220);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--base)' }} className="noise">
      {/* Ambient background */}
      <div className="grid-bg" />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobile={mobile} />

      {/* Mobile overlay */}
      {mobile && !collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCollapsed(true)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(5,6,8,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 49,
          }}
        />
      )}

      <motion.div
        animate={{ marginLeft: sidebarW }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} mobile={mobile} />
        <main style={{ flex: 1, padding: '24px 28px', maxWidth: 1440, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}
