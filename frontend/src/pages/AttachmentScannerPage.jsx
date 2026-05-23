import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, Send } from 'lucide-react';
import { useScan } from '../hooks/useScan';
import { scanAttachment } from '../services/api';
import ScanPageShell from '../components/scan/ScanPageShell';
import { SCANNER_CONFIGS } from '../lib/constants';
import { formatBytes } from '../lib/utils';
import toast from 'react-hot-toast';

const cfg = SCANNER_CONFIGS.attachment;
const EXT_COLORS = { pdf:'#f03', doc:'#2b5cce', docx:'#2b5cce', xls:'#1d7044', xlsx:'#1d7044', zip:'var(--med)', exe:'var(--crit)', js:'var(--a)', py:'#4584b6' };

export default function AttachmentScannerPage() {
  const [file, setFile] = useState(null);
  const { status, result, error, progress, run, reset } = useScan(scanAttachment);

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length) { toast.error(rejected[0]?.errors?.[0]?.message || 'File rejected'); return; }
    if (accepted.length) { setFile(accepted[0]); if (status !== 'idle') reset(); }
  }, [status, reset]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, maxFiles: 1, maxSize: cfg.maxSizeMB * 1024 * 1024, multiple: false,
  });

  const handleScan = async () => {
    if (!file) { toast.error('Upload a file first'); return; }
    const fd = new FormData();
    fd.append('file', file);
    try { await run(fd); } catch (_) {}
  };

  const handleReset = () => { setFile(null); reset(); };
  const ext = file?.name?.split('.').pop()?.toLowerCase();
  const extColor = EXT_COLORS[ext] || 'var(--ink-2)';

  return (
    <ScanPageShell config={cfg} status={status} progress={progress} error={error} result={result} onReset={handleReset}>
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="drop"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? 'var(--a)' : 'var(--line-1)'}`,
              borderRadius: 'var(--r-xl)', padding: '52px 32px',
              textAlign: 'center', cursor: 'pointer',
              background: isDragActive ? 'var(--a-dim)' : 'var(--surface-1)',
              transition: 'all 0.2s',
            }}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={{ scale: isDragActive ? 1.1 : 1 }}
              style={{ width: 56, height: 56, margin: '0 auto 16px', borderRadius: 14, background: isDragActive ? 'var(--a-dim)' : 'var(--surface-2)', border: '1px solid var(--line-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Upload size={22} color={isDragActive ? 'var(--a)' : 'var(--ink-3)'} />
            </motion.div>
            <p style={{ fontFamily: 'var(--f-display)', fontWeight: 600, fontSize: 15, marginBottom: 7 }}>
              {isDragActive ? 'Release to upload' : 'Drop a file to scan'}
            </p>
            <p style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 18 }}>or click to browse your system</p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 6 }}>
              {cfg.allowedTypes.map(t => (
                <span key={t} style={{ padding: '2px 8px', borderRadius: 99, background: 'var(--surface-0)', border: '1px solid var(--line-1)', fontSize: 10, fontFamily: 'var(--f-mono)', color: 'var(--ink-3)' }}>{t}</span>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 12 }}>Max {cfg.maxSizeMB} MB</p>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: 'var(--surface-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-xl)', padding: '20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 11, background: 'var(--surface-2)', border: '1px solid var(--line-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <File size={20} color={extColor} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--f-mono)', display: 'flex', gap: 12 }}>
                  <span>{formatBytes(file.size)}</span>
                  <span>{file.type || 'Unknown type'}</span>
                  <span style={{ color: 'var(--safe)' }}>Ready</span>
                </div>
              </div>
              {status === 'idle' && (
                <button onClick={handleReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', padding: 4 }} onMouseEnter={e => e.currentTarget.style.color='var(--crit)'} onMouseLeave={e => e.currentTarget.style.color='var(--ink-3)'}>
                  <X size={15} />
                </button>
              )}
            </div>
            {status === 'idle' && (
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                <button onClick={handleReset} className="btn-ghost" style={{ fontSize: 12 }}>Change file</button>
                <button onClick={handleScan} className="btn-primary" style={{ fontSize: 13 }}>
                  <Send size={13} /> Analyze file
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ScanPageShell>
  );
}
