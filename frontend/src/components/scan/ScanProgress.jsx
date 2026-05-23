import { motion } from 'framer-motion';

const STAGES = [
  { pct: 0,  label: 'Initializing scanner…' },
  { pct: 15, label: 'Parsing input structure…' },
  { pct: 35, label: 'Extracting feature vectors…' },
  { pct: 55, label: 'Running AI detection models…' },
  { pct: 72, label: 'Cross-referencing threat intel…' },
  { pct: 85, label: 'Computing hybrid risk score…' },
  { pct: 94, label: 'Generating explanations…' },
  { pct: 99, label: 'Finalizing report…' },
];

function HexGrid() {
  const hexes = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.4 }}>
      {hexes.map(i => (
        <motion.div
          key={i}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.15 }}
          style={{
            position: 'absolute',
            left: `${(i % 6) * 17 + 1}%`,
            top: `${Math.floor(i / 6) * 26 + 5}%`,
            width: 28, height: 28,
            border: '1px solid var(--a)',
            borderRadius: 4,
            transform: 'rotate(45deg)',
            opacity: 0.15,
          }}
        />
      ))}
    </div>
  );
}

export default function ScanProgress({ progress = 0 }) {
  const stageIdx = STAGES.findLastIndex(s => progress >= s.pct);
  const stage = STAGES[Math.max(0, stageIdx)];
  const chars = '01ABCDEF'.split('');
  const streamChars = Array.from({ length: 8 }, (_, i) => chars[(progress + i * 7) % chars.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--line-1)',
        borderRadius: 'var(--r-xl)',
        padding: '40px 32px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Background hex grid */}
      <HexGrid />

      {/* Top accent line */}
      <motion.div
        animate={{ scaleX: [0, 1] }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, var(--a), transparent)',
          transformOrigin: 'left',
        }}
      />

      {/* Main orb */}
      <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 28px' }}>
        {/* Outer ring */}
        <svg width={100} height={100} style={{ position: 'absolute', inset: 0 }}>
          <circle cx={50} cy={50} r={44} fill="none" stroke="var(--surface-3)" strokeWidth={2} />
          <motion.circle
            cx={50} cy={50} r={44}
            fill="none"
            stroke="var(--a)"
            strokeWidth={2}
            strokeDasharray={2 * Math.PI * 44}
            strokeDashoffset={2 * Math.PI * 44 * (1 - progress / 100)}
            strokeLinecap="round"
            style={{ rotate: -90, transformOrigin: 'center', filter: 'drop-shadow(0 0 6px var(--a))' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </svg>

        {/* Inner rotating ring */}
        <svg width={100} height={100} style={{ position: 'absolute', inset: 0, animation: 'rotate-slow 3s linear infinite' }}>
          <circle cx={50} cy={50} r={32} fill="none"
            stroke="var(--a)" strokeWidth={1}
            strokeDasharray="4 12" strokeOpacity={0.3} />
        </svg>

        {/* Core */}
        <div style={{
          position: 'absolute', inset: '22px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--a-dim) 0%, transparent 70%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              fontFamily: 'var(--f-display)', fontWeight: 900,
              fontSize: 14, color: 'var(--a)', letterSpacing: '-0.03em',
            }}
          >
            {progress}
          </motion.span>
        </div>
      </div>

      {/* Stage label */}
      <motion.p
        key={stage.label}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: 'var(--f-mono)', fontSize: 11,
          color: 'var(--ink-2)', marginBottom: 6, letterSpacing: '0.04em',
        }}
      >
        {stage.label}
      </motion.p>

      {/* Data stream */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24,
      }}>
        {streamChars.map((c, i) => (
          <motion.span
            key={`${c}-${i}-${progress}`}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: [0, 0.5, 0], y: [3, 0, -3] }}
            transition={{ duration: 0.6, delay: i * 0.07 }}
            style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--a)', fontWeight: 600 }}
          >
            {c}
          </motion.span>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'var(--surface-3)', borderRadius: 1, overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            height: '100%', borderRadius: 1,
            background: 'linear-gradient(90deg, var(--a) 0%, #e0ff80 100%)',
            boxShadow: '0 0 10px var(--a)',
          }}
        />
      </div>

      {/* Stage dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
        {STAGES.slice(1).map((s, i) => (
          <motion.div
            key={i}
            animate={{ background: progress >= s.pct ? 'var(--a)' : 'var(--surface-3)' }}
            transition={{ duration: 0.3 }}
            style={{ width: 4, height: 4, borderRadius: '50%' }}
          />
        ))}
      </div>
    </motion.div>
  );
}
