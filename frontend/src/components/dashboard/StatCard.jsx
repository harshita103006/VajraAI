import { motion } from 'framer-motion';

export default function StatCard({ label, value, trend, trendVal, sub, icon: Icon, color, index = 0 }) {
  const isUp = trend === 'up';
  const isDown = trend === 'down';
  const trendColor = isUp ? 'var(--safe)' : isDown ? 'var(--crit)' : 'var(--ink-2)';
  const trendBg    = isUp ? 'var(--safe-dim)' : isDown ? 'var(--crit-dim)' : 'transparent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: [0.16,1,0.3,1] }}
      style={{
        background: 'var(--surface-1)', border: '1px solid var(--line-1)',
        borderRadius: 'var(--r-lg)', padding: '18px 20px',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Corner glow */}
      {color && (
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 100, height: 100, borderRadius: '50%',
          background: color, opacity: 0.06,
          filter: 'blur(20px)', pointerEvents: 'none',
        }} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span className="t-label">{label}</span>
        {Icon && (
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: color ? `${color}15` : 'var(--glass-1)',
            border: `1px solid ${color ? color + '20' : 'var(--line-1)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={14} color={color || 'var(--ink-2)'} strokeWidth={1.8} />
          </div>
        )}
      </div>

      <div className="t-data" style={{ color: color || 'var(--ink-0)', marginBottom: 8 }}>
        {value}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {trendVal && (
          <span style={{
            padding: '2px 7px', borderRadius: 99,
            background: trendBg, fontSize: 10,
            fontFamily: 'var(--f-mono)', color: trendColor,
          }}>
            {isUp ? '↑' : isDown ? '↓' : ''} {trendVal}
          </span>
        )}
        {sub && <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{sub}</span>}
      </div>
    </motion.div>
  );
}
