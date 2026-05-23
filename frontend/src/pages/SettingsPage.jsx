import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Save, Check, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

/* ── Shared sub-components ────────────────────────────────── */
function Section({ title, desc, children }) {
  return (
    <div style={{ background:'var(--surface-1)', border:'1px solid var(--line-1)', borderRadius:'var(--r-xl)', overflow:'hidden', marginBottom:14 }}>
      <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--line-0)' }}>
        <div style={{ fontFamily:'var(--f-display)', fontWeight:600, fontSize:14, letterSpacing:'-0.01em' }}>{title}</div>
        {desc && <div className="t-label" style={{ marginTop:3 }}>{desc}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ label, sub, value, onChange }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, padding:'13px 20px', borderBottom:'1px solid var(--line-0)' }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:'var(--ink-3)', marginTop:2 }}>{sub}</div>}
      </div>
      <button onClick={() => onChange(!value)} style={{
        width:38, height:21, borderRadius:99, position:'relative',
        background: value ? 'var(--a)' : 'var(--surface-3)',
        border:`1px solid ${value ? 'var(--a)' : 'var(--line-2)'}`,
        cursor:'pointer', flexShrink:0, transition:'background 0.2s, border-color 0.2s',
      }}>
        <motion.div
          animate={{ x: value ? 18 : 1 }}
          transition={{ type:'spring', stiffness:600, damping:35 }}
          style={{ position:'absolute', top:1, left:0, width:17, height:17, borderRadius:'50%', background: value ? 'var(--base)' : 'var(--ink-3)' }}
        />
      </button>
    </div>
  );
}

function SelectRow({ label, sub, value, onChange, options }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, padding:'13px 20px', borderBottom:'1px solid var(--line-0)' }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:'var(--ink-3)', marginTop:2 }}>{sub}</div>}
      </div>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{
        background:'var(--surface-0)', border:'1px solid var(--line-1)',
        borderRadius:'var(--r-md)', color:'var(--ink-0)', fontSize:12,
        padding:'6px 10px', fontFamily:'var(--f-body)', outline:'none', cursor:'pointer',
        transition:'border-color 0.15s',
      }}
        onFocus={e=>e.target.style.borderColor='var(--a)'}
        onBlur={e=>e.target.style.borderColor='var(--line-1)'}
      >
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

function InputRow({ label, sub, value, onChange, mono }) {
  return (
    <div style={{ padding:'13px 20px', borderBottom:'1px solid var(--line-0)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
        <div style={{ fontSize:13 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:'var(--ink-3)' }}>{sub}</div>}
      </div>
      <input
        className={`input${mono?' input-mono':''}`}
        value={value}
        onChange={e=>onChange(e.target.value)}
      />
    </div>
  );
}

/* ── Settings data structure ─────────────────────────────── */
const DEFAULTS = {
  emailAlerts: true, slackAlerts: false,
  autoBlock: false, privacyMask: true, explainAI: true,
  logRetention:'90', rateLimit:'20',
  apiUrl:'http://localhost:8000',
  theme:'dark', timezone:'UTC',
};

export default function SettingsPage() {
  const [cfg, setCfg] = useState(() => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('vajra_settings')||'{}') }; }
    catch { return DEFAULTS; }
  });
  const [saved, setSaved] = useState(false);

  const set = k => v => setCfg(c => ({...c,[k]:v}));

  const save = () => {
    localStorage.setItem('vajra_settings', JSON.stringify(cfg));
    setSaved(true);
    toast.success('Settings saved');
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth:640 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <div>
          <h2 style={{ fontFamily:'var(--f-display)', fontWeight:700, fontSize:18, letterSpacing:'-0.02em', marginBottom:3 }}>Settings</h2>
          <p className="t-label">Platform configuration</p>
        </div>
        <button onClick={save} className="btn-primary" style={{
          background: saved ? 'var(--safe)' : 'var(--a)',
          transition:'background 0.3s', fontSize:13, padding:'8px 18px',
        }}>
          {saved ? <Check size={14}/> : <Save size={14}/>}
          {saved ? 'Saved' : 'Save changes'}
        </button>
      </div>

      <Section title="Notifications" desc="Alert delivery preferences">
        <Toggle label="Email alerts"        sub="Receive scan results via email"             value={cfg.emailAlerts}  onChange={set('emailAlerts')} />
        <Toggle label="Slack notifications" sub="Post threat flags to a Slack channel"       value={cfg.slackAlerts}  onChange={set('slackAlerts')} />
      </Section>

      <Section title="Detection Behavior" desc="Control how scans are processed">
        <Toggle label="Auto-block critical threats" sub="Flag CRITICAL scans to threat database automatically" value={cfg.autoBlock}  onChange={set('autoBlock')} />
        <Toggle label="Privacy masking"             sub="Redact PII from inputs before logging"                value={cfg.privacyMask} onChange={set('privacyMask')} />
        <Toggle label="Explainable AI"              sub="Show detailed reasoning with every threat flag"       value={cfg.explainAI}  onChange={set('explainAI')} />
        <SelectRow label="Log retention" sub="How long scan logs are stored"
          value={cfg.logRetention} onChange={set('logRetention')}
          options={[{v:'30',l:'30 days'},{v:'60',l:'60 days'},{v:'90',l:'90 days'},{v:'180',l:'6 months'},{v:'365',l:'1 year'}]}
        />
      </Section>

      <Section title="API Configuration" desc="Backend connection settings">
        <InputRow label="Backend URL" sub="FastAPI server endpoint" value={cfg.apiUrl} onChange={set('apiUrl')} mono />
        <SelectRow label="Rate limit" sub="Requests per minute per API key"
          value={cfg.rateLimit} onChange={set('rateLimit')}
          options={[{v:'10',l:'10 / min'},{v:'20',l:'20 / min'},{v:'50',l:'50 / min'},{v:'100',l:'100 / min'}]}
        />
      </Section>

      <Section title="Appearance" desc="Display preferences">
        <SelectRow label="Theme" value={cfg.theme} onChange={set('theme')}
          options={[{v:'dark',l:'Dark (recommended)'},{v:'oled',l:'OLED Black'}]}
        />
        <SelectRow label="Timezone" sub="Used for log timestamps"
          value={cfg.timezone} onChange={set('timezone')}
          options={[{v:'UTC',l:'UTC'},{v:'America/New_York',l:'EST/EDT'},{v:'America/Los_Angeles',l:'PST/PDT'},{v:'Europe/London',l:'GMT/BST'},{v:'Asia/Kolkata',l:'IST'}]}
        />
      </Section>

      {/* Danger zone */}
      <div style={{ background:'var(--crit-dim)', border:'1px solid rgba(255,0,51,0.18)', borderRadius:'var(--r-xl)', padding:'18px 20px' }}>
        <div style={{ fontFamily:'var(--f-display)', fontWeight:700, fontSize:14, color:'var(--crit)', marginBottom:12 }}>Danger Zone</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:13 }}>Clear all threat logs</div>
            <div style={{ fontSize:11, color:'var(--ink-3)', marginTop:2 }}>Permanently deletes scan history. Cannot be undone.</div>
          </div>
          <button onClick={()=>toast.error('Disabled in demo mode')} className="btn-danger" style={{ fontSize:12 }}>
            Clear logs
          </button>
        </div>
      </div>
    </div>
  );
}
