import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Link2 } from 'lucide-react';
import { useScan } from '../hooks/useScan';
import { scanURL } from '../services/api';
import ScanPageShell from '../components/scan/ScanPageShell';
import { SCANNER_CONFIGS } from '../lib/constants';
import toast from 'react-hot-toast';

const cfg = SCANNER_CONFIGS.url;

export default function URLScannerPage() {
  const [url, setUrl] = useState('');
  const { status, result, error, progress, run, reset } = useScan(scanURL);

  const handleScan = async (e) => {
    e?.preventDefault();
    const u = url.trim();
    if (!u) { toast.error('Enter a URL to analyze'); return; }
    try { await run(u); } catch (_) {}
  };

  const handleReset = () => { setUrl(''); reset(); };

  return (
    <ScanPageShell config={cfg} status={status} progress={progress} error={error} result={result} onReset={handleReset}>
      <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-xl)', padding: '20px' }}>
        <form onSubmit={handleScan}>
          <div className="t-label" style={{ marginBottom: 8 }}>Target URL</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-0)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-md)', padding: '0 14px', transition: 'border-color 0.15s' }}
              onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--a)'}
              onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--line-1)'}
            >
              <Link2 size={13} color="var(--ink-3)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="https://suspicious-domain.com/login"
                value={url}
                onChange={e => setUrl(e.target.value)}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--ink-0)', fontSize: 13, fontFamily: 'var(--f-mono)', padding: '11px 0' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '0 20px', whiteSpace: 'nowrap', fontSize: 13 }}>
              <Send size={13} /> Analyze
            </button>
          </div>
        </form>

        {/* Examples */}
        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <span className="t-label">Try:</span>
          {cfg.examples.map(ex => (
            <button
              key={ex}
              onClick={() => { setUrl(ex); reset(); }}
              style={{ padding: '3px 10px', borderRadius: 99, background: 'var(--surface-0)', border: '1px solid var(--line-1)', cursor: 'pointer', fontSize: 11, color: 'var(--ink-2)', fontFamily: 'var(--f-mono)', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--line-2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line-1)'}
            >
              {ex.length > 34 ? ex.slice(0,34)+'…' : ex}
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={{ marginTop: 12, padding: '11px 14px', background: 'var(--surface-0)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-md)', display: 'flex', gap: 10 }}>
        <span style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.6 }}>
          Checks against threat intelligence feeds, inspects redirect chains, TLD reputation, IP-based URLs, and brand impersonation patterns.
        </span>
      </div>
    </ScanPageShell>
  );
}
