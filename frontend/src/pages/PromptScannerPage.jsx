import { useState } from 'react';
import { useScan } from '../hooks/useScan';
import { scanPrompt } from '../services/api';
import ScanPageShell from '../components/scan/ScanPageShell';
import { SCANNER_CONFIGS } from '../lib/constants';
import toast from 'react-hot-toast';

const cfg = SCANNER_CONFIGS.prompt;

export default function PromptScannerPage() {
  const [prompt, setPrompt] = useState('');
  const { status, result, error, progress, run, reset } = useScan(scanPrompt);

  const handleScan = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) { toast.error('Enter a prompt to analyze'); return; }
    try { await run(prompt.trim()); } catch (_) {}
  };

  const handleReset = () => { setPrompt(''); reset(); };

  return (
    <ScanPageShell config={cfg} status={status} progress={progress} error={error} result={result} onReset={handleReset}>
      <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-xl)', padding: '20px' }}>
        {/* Warning banner */}
        <div style={{ display: 'flex', gap: 9, padding: '10px 14px', background: 'var(--crit-dim)', border: '1px solid rgba(255,0,51,0.18)', borderRadius: 'var(--r-md)', marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>
            Validate user-submitted prompts before passing to AI models. Catches jailbreaks, role overrides, system prompt extraction, and multi-stage injection chains.
          </span>
        </div>

        <form onSubmit={handleScan}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div className="t-label">Prompt to Analyze</div>
            <span style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'var(--f-mono)' }}>{prompt.length} chars</span>
          </div>

          <textarea
            className="input input-mono"
            placeholder="Paste the user-submitted prompt or LLM input here…"
            value={prompt}
            onChange={e => { setPrompt(e.target.value); if (status !== 'idle') reset(); }}
            rows={8}
            style={{ resize: 'vertical', minHeight: 160, lineHeight: 1.7 }}
          />

          {/* Example buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12, alignItems: 'center' }}>
            <span className="t-label">Examples:</span>
            {cfg.examples.map(ex => (
              <button
                key={ex.label}
                type="button"
                onClick={() => { setPrompt(ex.text); reset(); }}
                style={{ padding: '3px 10px', borderRadius: 99, background: 'var(--surface-0)', border: '1px solid var(--line-1)', cursor: 'pointer', fontSize: 11, color: 'var(--ink-2)', fontFamily: 'var(--f-mono)', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--line-2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line-1)'}
              >
                {ex.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            {prompt && <button type="button" onClick={handleReset} className="btn-ghost" style={{ fontSize: 12 }}>Clear</button>}
            <button type="submit" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 22px', borderRadius: 'var(--r-md)',
              background: 'var(--crit)', border: 'none',
              color: '#fff', fontWeight: 700, fontSize: 13,
              fontFamily: 'var(--f-display)', cursor: 'pointer',
              opacity: status === 'scanning' ? 0.6 : 1,
            }}>
              Detect injection
            </button>
          </div>
        </form>
      </div>
    </ScanPageShell>
  );
}
