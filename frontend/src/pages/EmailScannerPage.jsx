import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronDown } from 'lucide-react';
import { useScan } from '../hooks/useScan';
import { scanEmail } from '../services/api';
import ScanPageShell from '../components/scan/ScanPageShell';
import { SCANNER_CONFIGS } from '../lib/constants';
import toast from 'react-hot-toast';

const cfg = SCANNER_CONFIGS.email;

export default function EmailScannerPage() {
  const [subject, setSubject] = useState('');
  const [body, setBody]       = useState('');
  const [showEx, setShowEx]   = useState(false);
  const { status, result, error, progress, run, reset } = useScan(scanEmail);

  const handleScan = async (e) => {
    e?.preventDefault();
    if (!subject.trim() || !body.trim()) { toast.error('Subject and body are both required'); return; }
    try { await run(subject, body); } catch (_) {}
  };

  const handleReset = () => { setSubject(''); setBody(''); reset(); };

  return (
    <ScanPageShell config={cfg} status={status} progress={progress} error={error} result={result} onReset={handleReset}>
      <div style={{ background: 'var(--surface-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-xl)', padding: '20px' }}>
        {/* Example selector */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
          <button
            onClick={() => setShowEx(s => !s)}
            className="btn-ghost"
            style={{ fontSize: 11, padding: '5px 12px' }}
          >
            Load example <ChevronDown size={11} style={{ transform: showEx ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        <AnimatePresence>
          {showEx && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden', marginBottom: 14 }}
            >
              <div style={{ display: 'flex', gap: 8, paddingBottom: 14, borderBottom: '1px solid var(--line-0)' }}>
                {cfg.examples.map(ex => (
                  <button
                    key={ex.label}
                    onClick={() => { setSubject(ex.subject); setBody(ex.body); setShowEx(false); reset(); }}
                    className="btn-ghost"
                    style={{ fontSize: 12, padding: '5px 12px' }}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleScan} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div className="t-label" style={{ marginBottom: 7 }}>Subject Line</div>
            <input className="input" type="text" placeholder="Email subject…" value={subject} onChange={e => { setSubject(e.target.value); if (status !== 'idle') reset(); }} />
          </div>
          <div>
            <div className="t-label" style={{ marginBottom: 7 }}>Email Body</div>
            <textarea
              className="input"
              placeholder="Paste the full email body here…"
              value={body}
              onChange={e => { setBody(e.target.value); if (status !== 'idle') reset(); }}
              rows={7}
              style={{ resize: 'vertical', minHeight: 140, lineHeight: 1.6 }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            {(subject || body) && (
              <button type="button" onClick={handleReset} className="btn-ghost" style={{ padding: '9px 16px', fontSize: 13 }}>Clear</button>
            )}
            <button type="submit" className="btn-primary" style={{ padding: '9px 22px', fontSize: 13 }}>
              <Send size={13} /> Analyze Email
            </button>
          </div>
        </form>
      </div>
    </ScanPageShell>
  );
}
