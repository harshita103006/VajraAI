import { useEffect, useState } from 'react';
import { scoreToLevel, getRiskColor } from '../../lib/utils';

export default function RiskScoreRing({ score = 0, size = 88, strokeWidth = 5 }) {
  const [anim, setAnim] = useState(0);
  const level = scoreToLevel(score);
  const color = getRiskColor(level);
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (anim / 100) * circ;

  useEffect(() => { const t = setTimeout(() => setAnim(score), 80); return () => clearTimeout(t); }, [score]);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="var(--surface-3)" strokeWidth={strokeWidth} />
        {/* Glow layer */}
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth + 4} strokeDasharray={circ}
          strokeDashoffset={offset} strokeLinecap="round" opacity={0.08}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: `stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)` }} />
        {/* Arc */}
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeDasharray={circ}
          strokeDashoffset={offset} strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: `stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1), stroke 0.3s`, filter: `drop-shadow(0 0 4px ${color}60)` }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--f-display)', fontWeight: 900,
          fontSize: size * 0.26, color, lineHeight: 1, letterSpacing: '-0.04em',
        }}>
          {score}
        </span>
        <span style={{ fontSize: size * 0.1, color: 'var(--ink-3)', fontFamily: 'var(--f-mono)', marginTop: 1 }}>
          /100
        </span>
      </div>
    </div>
  );
}
