import { getRiskMeta } from '../../lib/utils';

export default function RiskBadge({ level, size = 'md', pulse = false }) {
  const meta = getRiskMeta(level);
  const sm = size === 'sm';

  return (
    <span
      className="badge"
      style={{
        padding: sm ? '2px 6px' : '3px 9px',
        fontSize: sm ? 9 : 10,
        background: meta.dim,
        border: `1px solid ${meta.color}28`,
        color: meta.color,
      }}
    >
      {pulse && (
        <span style={{
          width: sm ? 4 : 5, height: sm ? 4 : 5,
          borderRadius: '50%', background: meta.color,
          boxShadow: `0 0 6px ${meta.color}`,
          display: 'inline-block', flexShrink: 0,
          animation: pulse ? 'pulse-slow 2s ease-in-out infinite' : 'none',
        }} />
      )}
      {meta.label?.toUpperCase()}
    </span>
  );
}
