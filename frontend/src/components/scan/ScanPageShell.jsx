import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, AlertCircle } from 'lucide-react';
import ScanProgress from './ScanProgress';
import ScanResultCard from './ScanResultCard';

/**
 * Shared wrapper for all scanner pages.
 * Handles: scanning state, progress bar, error state, result card, reset button.
 */
export default function ScanPageShell({ config, status, progress, error, result, onReset, children }) {
  const Icon  = config.icon;
  const color = config.color;

  return (
    <div style={{ maxWidth: 740, margin: '0 auto' }}>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 26 }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 11, flexShrink: 0,
          background: `${color}14`, border: `1px solid ${color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={color} strokeWidth={1.8} />
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', marginBottom: 4 }}>
            {config.label}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, maxWidth: 560 }}>
            {config.description}
          </p>
        </div>
      </motion.div>

      {/* Input panel */}
      <AnimatePresence mode="wait">
        {status !== 'done' && status !== 'scanning' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16,1,0.3,1] }}
          >
            {children}
          </motion.div>
        )}

        {status === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ScanProgress progress={progress} />
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div style={{
              background: 'var(--crit-dim)', border: '1px solid rgba(255,0,51,0.2)',
              borderRadius: 'var(--r-xl)', padding: '20px 22px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <AlertCircle size={16} color="var(--crit)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--crit)', marginBottom: 4, fontSize: 14 }}>Scan failed</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{error}</div>
                </div>
              </div>
              <button onClick={onReset} className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12, flexShrink: 0 }}>
                <RotateCcw size={13} /> Retry
              </button>
            </div>
          </motion.div>
        )}

        {status === 'done' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button onClick={onReset} className="btn-ghost" style={{ fontSize: 12, padding: '6px 14px' }}>
                <RotateCcw size={13} /> New scan
              </button>
            </div>
            <ScanResultCard result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
