import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Check, AlertTriangle, X } from 'lucide-react';
import { copyToClipboard, formatDate } from '../lib/utils';
import toast from 'react-hot-toast';

const INITIAL = [
  { id:'k1', name:'Production API',           key:'vjr_prod_4f8a2c1e9b3d7f6a2c1e9b3d7f6a2c1e', created:'2024-01-15T10:00:00Z', lastUsed:'2024-01-22T14:31:00Z', scans:8412, active:true  },
  { id:'k2', name:'Staging Environment',       key:'vjr_stg_9b3d7f6a2c1e4f8a2c1e9b3d7f6a2c1e',  created:'2024-01-10T09:00:00Z', lastUsed:'2024-01-21T16:45:00Z', scans:1247, active:true  },
  { id:'k3', name:'Old Integration (retired)', key:'vjr_old_1e4f8a2c1e9b3d7f6a2c1e9b3d7f6a2c',  created:'2023-11-01T00:00:00Z', lastUsed:'2023-12-31T00:00:00Z', scans:24130,active:false },
];

function KeyCard({ apiKey, onDelete }) {
  const [visible,setCopied2] = useState(false);
  const [copied,  setCopied] = useState(false);

  const masked = `${apiKey.key.slice(0,10)}${'•'.repeat(18)}${apiKey.key.slice(-4)}`;

  const doCopy = async () => {
    await copyToClipboard(apiKey.key);
    setCopied(true);
    toast.success('API key copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity:0, y:6 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, height:0 }}
      layout
      style={{
        background:'var(--surface-1)', border:'1px solid var(--line-1)',
        borderRadius:'var(--r-xl)', padding:'18px 20px',
        opacity: apiKey.active ? 1 : 0.55,
        position:'relative', overflow:'hidden',
      }}
    >
      {/* Active indicator stripe */}
      <div style={{ position:'absolute', top:0, left:0, bottom:0, width:3,
        background: apiKey.active ? 'var(--a)' : 'var(--line-1)',
        borderRadius:'var(--r-xl) 0 0 var(--r-xl)',
      }} />

      <div style={{ display:'flex', alignItems:'flex-start', gap:14, paddingLeft:8 }}>
        {/* Icon */}
        <div style={{
          width:36, height:36, borderRadius:10, flexShrink:0,
          background: apiKey.active ? 'var(--a-dim)' : 'var(--surface-2)',
          border:`1px solid ${apiKey.active ? 'var(--a-glow)' : 'var(--line-1)'}`,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Key size={15} color={apiKey.active ? 'var(--a)' : 'var(--ink-3)'} strokeWidth={1.8} />
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          {/* Name + status */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <span style={{ fontWeight:600, fontSize:14 }}>{apiKey.name}</span>
            <span style={{
              padding:'1px 8px', borderRadius:99, fontSize:9,
              fontFamily:'var(--f-mono)', letterSpacing:'0.1em',
              background: apiKey.active ? 'var(--safe-dim)' : 'var(--surface-2)',
              border:`1px solid ${apiKey.active ? 'rgba(0,217,126,0.2)' : 'var(--line-1)'}`,
              color: apiKey.active ? 'var(--safe)' : 'var(--ink-3)',
            }}>
              {apiKey.active ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>

          {/* Key display */}
          <div style={{
            display:'flex', alignItems:'center', gap:8,
            background:'var(--surface-0)', border:'1px solid var(--line-1)',
            borderRadius:'var(--r-md)', padding:'7px 12px', marginBottom:10,
          }}>
            <code style={{ flex:1, fontSize:12, fontFamily:'var(--f-mono)', color:'var(--ink-2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {visible ? apiKey.key : masked}
            </code>
            <button onClick={() => setCopied2(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--ink-3)', padding:2, display:'flex', transition:'color 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--ink-1)'} onMouseLeave={e=>e.currentTarget.style.color='var(--ink-3)'}>
              {visible ? <EyeOff size={13}/> : <Eye size={13}/>}
            </button>
            <div style={{ width:1, height:14, background:'var(--line-1)' }} />
            <button onClick={doCopy} style={{ background:'none', border:'none', cursor:'pointer', padding:2, display:'flex', color: copied ? 'var(--safe)' : 'var(--ink-3)', transition:'color 0.2s' }}>
              {copied ? <Check size={13}/> : <Copy size={13}/>}
            </button>
          </div>

          {/* Meta */}
          <div style={{ display:'flex', gap:18, fontSize:11, color:'var(--ink-3)', fontFamily:'var(--f-mono)' }}>
            <span>Created {formatDate(apiKey.created)}</span>
            <span>Last used {formatDate(apiKey.lastUsed)}</span>
            <span>{apiKey.scans.toLocaleString()} scans</span>
          </div>
        </div>

        {/* Delete */}
        <button onClick={() => onDelete(apiKey.id)}
          style={{ background:'none', border:'none', cursor:'pointer', color:'var(--ink-3)', padding:4, borderRadius:6, flexShrink:0, transition:'color 0.15s' }}
          onMouseEnter={e=>e.currentTarget.style.color='var(--crit)'}
          onMouseLeave={e=>e.currentTarget.style.color='var(--ink-3)'}
        >
          <Trash2 size={14}/>
        </button>
      </div>
    </motion.div>
  );
}

export default function APIKeysPage() {
  const [keys,      setKeys]      = useState(INITIAL);
  const [creating,  setCreating]  = useState(false);
  const [name,      setName]      = useState('');
  const [freshKey,  setFreshKey]  = useState(null);

  const doCreate = () => {
    if (!name.trim()) { toast.error('Key name is required'); return; }
    const k = `vjr_${Math.random().toString(36).slice(2,10)}_${Math.random().toString(36).slice(2,34)}`;
    const entry = { id:Date.now().toString(), name, key:k, created:new Date().toISOString(), lastUsed:null, scans:0, active:true };
    setKeys(ks => [entry, ...ks]);
    setFreshKey(k);
    setName('');
    setCreating(false);
    toast.success('API key created');
  };

  const doDelete = id => { setKeys(ks => ks.filter(k => k.id !== id)); toast.success('Key deleted'); };

  return (
    <div style={{ maxWidth:740 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <div>
          <h2 style={{ fontFamily:'var(--f-display)', fontWeight:700, fontSize:18, letterSpacing:'-0.02em', marginBottom:3 }}>API Keys</h2>
          <p className="t-label">Manage authentication tokens · X-API-Key header</p>
        </div>
        <button onClick={() => setCreating(c=>!c)} className="btn-primary" style={{ fontSize:13, padding:'8px 16px' }}>
          <Plus size={14}/> Create key
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:0.22 }}
            style={{ overflow:'hidden', marginBottom:14 }}
          >
            <div style={{ background:'var(--surface-1)', border:'1px solid var(--line-1)', borderRadius:'var(--r-xl)', padding:'18px 20px' }}>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>New API key</div>
              <div style={{ display:'flex', gap:10 }}>
                <input
                  className="input"
                  type="text"
                  placeholder="e.g. Production Backend, Staging, CI/CD"
                  value={name}
                  onChange={e=>setName(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&doCreate()}
                  autoFocus
                />
                <button onClick={doCreate} className="btn-primary" style={{ padding:'0 18px', whiteSpace:'nowrap', fontSize:13 }}>Generate</button>
                <button onClick={()=>setCreating(false)} className="btn-ghost" style={{ padding:'0 12px' }}><X size={14}/></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fresh key reveal */}
      <AnimatePresence>
        {freshKey && (
          <motion.div
            initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
            style={{ background:'var(--safe-dim)', border:'1px solid rgba(0,217,126,0.25)', borderRadius:'var(--r-xl)', padding:'16px 20px', marginBottom:14 }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <Check size={14} color="var(--safe)"/>
              <span style={{ fontSize:13, color:'var(--safe)', fontWeight:600 }}>Key created — save it now, it won't be shown again</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <code style={{ flex:1, fontSize:12, fontFamily:'var(--f-mono)', color:'var(--ink-0)', wordBreak:'break-all', background:'var(--surface-0)', border:'1px solid var(--line-1)', borderRadius:'var(--r-md)', padding:'8px 12px' }}>
                {freshKey}
              </code>
              <button
                onClick={async()=>{ await copyToClipboard(freshKey); toast.success('Copied!'); setFreshKey(null); }}
                className="btn-primary"
                style={{ background:'var(--safe)', padding:'8px 14px', fontSize:12, whiteSpace:'nowrap', flexShrink:0 }}
              >
                <Copy size={12}/> Copy & dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rate limit info */}
      <div style={{ display:'flex', gap:9, padding:'11px 16px', background:'var(--surface-1)', border:'1px solid var(--line-1)', borderRadius:'var(--r-md)', marginBottom:18, alignItems:'center' }}>
        <AlertTriangle size={13} color="var(--med)"/>
        <p style={{ fontSize:12, color:'var(--ink-2)' }}>
          Each key is rate-limited to <strong style={{ color:'var(--ink-0)' }}>20 requests/minute</strong>. Pass as{' '}
          <code style={{ fontFamily:'var(--f-mono)', color:'var(--a)', fontSize:11 }}>X-API-Key: vjr_…</code> header.
        </p>
      </div>

      {/* Key list */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <AnimatePresence>
          {keys.map(k => <KeyCard key={k.id} apiKey={k} onDelete={doDelete}/>)}
        </AnimatePresence>
      </div>
    </div>
  );
}
