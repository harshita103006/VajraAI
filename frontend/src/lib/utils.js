import { RISK_LEVELS } from './constants';

export function getRiskMeta(level) {
  return RISK_LEVELS[level?.toUpperCase()] || RISK_LEVELS.SAFE;
}

export function getRiskColor(level) { return getRiskMeta(level).color; }
export function getRiskDim(level)   { return getRiskMeta(level).dim;   }
export function getRiskGlow(level)  { return getRiskMeta(level).glow;  }

export function scoreToLevel(score) {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  if (score >= 20) return 'LOW';
  return 'SAFE';
}

export function formatDate(d, compact = false) {
  if (!d) return '—';
  try {
    const dt = new Date(d);
    if (compact) return dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return dt.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return d; }
}

export function timeAgo(d) {
  if (!d) return '';
  const diff = (Date.now() - new Date(d)) / 1000;
  if (diff < 60)  return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

export function truncate(s, n = 56) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n) + '…' : s;
}

export async function copyToClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch { return false; }
}

export function formatBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b/1024).toFixed(1)} KB`;
  return `${(b/1048576).toFixed(1)} MB`;
}

export function cn(...args) {
  return args.filter(Boolean).join(' ');
}
