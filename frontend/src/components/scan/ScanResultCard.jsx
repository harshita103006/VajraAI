import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Copy, Check, Shield, AlertTriangle, Terminal, Zap } from 'lucide-react';
import RiskScoreRing from '../ui/RiskScoreRing';
import RiskBadge from '../ui/RiskBadge';
import { getRiskMeta, copyToClipboard } from '../../lib/utils';
import { getRecommendedAction } from '../../lib/constants';

function FlagRow({ flag, explanation, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, ease: [0.16,1,0.3,1] }}
      style={{ borderRadius: 'var(--r-md)', border: '1px solid var(--line-1)', overflow: 'hidden', background: 'var(--surface-0)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 14px', textAlign: 'left' }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: 'var(--med)', boxShadow: '0 0 5px var(--med)' }} />
        <span style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-1)' }}>{flag}</span>
        {explanation && (
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ color: 'var(--ink-3)', display: 'flex' }}>
            <ChevronDown size={13} />
          </motion.span>
        )}
      </button>
      <AnimatePresence>
        {open && explanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 14px 12px 30px', borderTop: '1px solid var(--line-0)' }}>
              <div style={{ display: 'flex', gap: 6, padding: '10px 12px', background: 'var(--surface-1)', borderRadius: 'var(--r-sm)', border: '1px solid var(--line-1)', marginTop: 10 }}>
                <Terminal size={11} color="var(--a)" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.65 }}>{explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ScanResultCard({ result }) {
  const [copied, setCopied] = useState(false);
  if (!result) return null;

  const { risk_score = 0, risk_level = 'SAFE', flags = [], explanations = [], metadata = {} } = result;
  const meta  = getRiskMeta(risk_level);
  const color = meta.color;
  const isSafe = risk_score < 20;
  const explMap = {};
  (explanations || []).forEach(e => { if (e?.issue) explMap[e.issue] = e.reason; });

  const handleCopy = async () => {
    await copyToClipboard(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}
      style={{ background: 'var(--surface-1)', border: `1px solid ${color}22`, borderRadius: 'var(--r-xl)', overflow: 'hidden', position: 'relative' }}
    >
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${color} 20%, ${color} 80%, transparent)`, boxShadow: `0 0 16px ${color}60` }} />
      <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: color, opacity: 0.04, filter: 'blur(40px)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, padding: '24px 24px 20px', borderBottom: '1px solid var(--line-0)' }}>
        <RiskScoreRing score={risk_score} size={90} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h3 style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em', color: 'var(--ink-0)' }}>Analysis Complete</h3>
            <RiskBadge level={risk_level} pulse />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
            {isSafe ? <Shield size={13} color="var(--safe)" style={{ marginTop: 2, flexShrink: 0 }} /> : <AlertTriangle size={13} color={color} style={{ marginTop: 2, flexShrink: 0 }} />}
            <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {isSafe ? 'No significant threats detected. Content passed all detection checks.' : `${flags.length} threat indicator${flags.length !== 1 ? 's' : ''} identified. Review findings below.`}
            </p>
          </div>
        </div>
        <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 11px', borderRadius: 'var(--r-md)', background: copied ? 'var(--safe-dim)' : 'var(--surface-0)', border: `1px solid ${copied ? 'var(--safe)' : 'var(--line-1)'}`, cursor: 'pointer', fontSize: 11, color: copied ? 'var(--safe)' : 'var(--ink-2)', fontFamily: 'var(--f-mono)', transition: 'all 0.2s', flexShrink: 0 }}>
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied' : 'JSON'}
        </button>
      </div>

      {/* Metadata */}
      {Object.keys(metadata).length > 0 && (
        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--line-0)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {Object.entries(metadata).slice(0, 10).map(([k, v]) => (
            <div key={k} style={{ padding: '3px 10px', background: 'var(--surface-0)', border: '1px solid var(--line-1)', borderRadius: 99, fontSize: 11, fontFamily: 'var(--f-mono)', display: 'flex', gap: 5 }}>
              <span style={{ color: 'var(--ink-3)' }}>{k}</span>
              <span style={{ color: 'var(--ink-1)' }}>{typeof v === 'boolean' ? (v ? 'true' : 'false') : String(v)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Flags */}
      {flags.length > 0 ? (
        <div style={{ padding: '18px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span className="t-label">Threat Indicators</span>
            <span style={{ padding: '1px 7px', borderRadius: 99, background: `${color}15`, border: `1px solid ${color}25`, fontSize: 10, fontFamily: 'var(--f-mono)', color }}>{flags.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {flags.map((flag, i) => <FlagRow key={flag} flag={flag} explanation={explMap[flag]} index={i} />)}
          </div>
        </div>
      ) : (
        <div style={{ padding: '18px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--safe-dim)', border: '1px solid rgba(0,217,126,0.2)', borderRadius: 'var(--r-md)' }}>
            <Shield size={14} color="var(--safe)" />
            <span style={{ fontSize: 13, color: 'var(--safe)' }}>No threat indicators found — content passed all checks.</span>
          </div>
        </div>
      )}

      {/* Recommended action */}
      <div style={{ padding: '0 24px 22px' }}>
        <div style={{ padding: '12px 16px', background: `${color}08`, border: `1px solid ${color}18`, borderRadius: 'var(--r-md)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Zap size={13} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div className="t-label" style={{ marginBottom: 4 }}>Recommended Action</div>
            <p style={{ fontSize: 13, color: 'var(--ink-1)', lineHeight: 1.6 }}>{getRecommendedAction(risk_score)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
