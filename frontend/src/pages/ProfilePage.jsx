import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Clock, Edit2, Save, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getRiskMeta, timeAgo } from '../lib/utils';
import toast from 'react-hot-toast';

const RECENT = [
  { action:'Scanned URL',        target:'http://paypa1-secure.xyz/login',   level:'CRITICAL', ts: Date.now()-120000   },
  { action:'Scanned email',      target:'Urgent: Your PayPal account…',      level:'HIGH',     ts: Date.now()-840000   },
  { action:'Scanned file',       target:'invoice_march.exe',                 level:'CRITICAL', ts: Date.now()-3600000  },
  { action:'Scanned prompt',     target:'Ignore all previous instructions…', level:'HIGH',     ts: Date.now()-10800000 },
  { action:'Scanned URL',        target:'https://bit.ly/3xAbc12',            level:'MEDIUM',   ts: Date.now()-18000000 },
];

const STATS = [
  { label:'Total scans',   val:'1,247', icon:Activity, color:'var(--a)'    },
  { label:'Threats found', val:'89',    icon:Shield,   color:'var(--crit)' },
  { label:'Member since',  val:'Jan 2024', icon:Clock, color:'var(--ink-2)' },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState({
    name:  user?.name  || 'Security Analyst',
    email: user?.email || 'analyst@vajraai.com',
    role:  'Security Analyst',
    org:   'VajraAI Platform',
  });

  const save = () => {
    setEditing(false);
    toast.success('Profile updated');
  };

  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));

  return (
    <div style={{ maxWidth:680 }}>
      {/* Hero card */}
      <motion.div
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
        style={{ background:'var(--surface-1)', border:'1px solid var(--line-1)', borderRadius:'var(--r-xl)', padding:'28px', marginBottom:14, position:'relative', overflow:'hidden' }}
      >
        {/* Ambient top-right glow */}
        <div style={{ position:'absolute', top:-50, right:-50, width:180, height:180, borderRadius:'50%', background:'var(--a)', opacity:0.05, filter:'blur(40px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:0, right:0, left:0, height:1, background:'linear-gradient(90deg, transparent, var(--a-glow), transparent)' }} />

        <div style={{ display:'flex', alignItems:'flex-start', gap:20 }}>
          {/* Avatar */}
          <div style={{
            width:68, height:68, borderRadius:16, flexShrink:0,
            background:'linear-gradient(135deg, var(--a-dim) 0%, var(--surface-3) 100%)',
            border:'1.5px solid var(--a-glow)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ fontFamily:'var(--f-display)', fontWeight:900, fontSize:26, color:'var(--a)' }}>
              {form.name[0]?.toUpperCase()}
            </span>
          </div>

          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:4 }}>
              <h2 style={{ fontFamily:'var(--f-display)', fontWeight:800, fontSize:20, letterSpacing:'-0.03em' }}>{form.name}</h2>
              <span style={{ padding:'2px 9px', borderRadius:99, background:'var(--a-dim)', border:'1px solid var(--a-glow)', fontSize:9, fontFamily:'var(--f-mono)', color:'var(--a)', letterSpacing:'0.1em' }}>ANALYST</span>
            </div>
            <p style={{ fontSize:13, color:'var(--ink-2)' }}>{form.email}</p>
            <p style={{ fontSize:11, color:'var(--ink-3)', marginTop:2, fontFamily:'var(--f-mono)' }}>{form.org}</p>
          </div>

          <button onClick={() => editing ? save() : setEditing(true)} className={editing ? 'btn-primary' : 'btn-ghost'} style={{ fontSize:12, padding:'7px 14px', flexShrink:0 }}>
            {editing ? <><Check size={13}/> Save</> : <><Edit2 size={13}/> Edit</>}
          </button>
        </div>

        {/* Stat pills */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginTop:22 }}>
          {STATS.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={{ display:'flex', alignItems:'center', gap:7, background:'var(--surface-0)', border:'1px solid var(--line-1)', borderRadius:99, padding:'6px 14px' }}>
                <Icon size={12} color={s.color}/>
                <span style={{ fontSize:11, color:'var(--ink-3)' }}>{s.label}:</span>
                <span style={{ fontSize:12, fontFamily:'var(--f-mono)', color:'var(--ink-1)', fontWeight:500 }}>{s.val}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Edit form */}
      {editing && (
        <motion.div
          initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
          exit={{ opacity:0, height:0 }}
          style={{ background:'var(--surface-1)', border:'1px solid var(--a-glow)', borderRadius:'var(--r-xl)', padding:'20px 24px', marginBottom:14, overflow:'hidden' }}
        >
          <div className="t-label" style={{ marginBottom:14 }}>Edit Profile</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[['name','Full Name'],['email','Email'],['role','Role'],['org','Organization']].map(([k,l]) => (
              <div key={k}>
                <div className="t-label" style={{ marginBottom:6 }}>{l}</div>
                <input className="input" type="text" value={form[k]} onChange={set(k)} />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent activity */}
      <div style={{ background:'var(--surface-1)', border:'1px solid var(--line-1)', borderRadius:'var(--r-xl)', overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--line-0)' }}>
          <div style={{ fontFamily:'var(--f-display)', fontWeight:600, fontSize:14, letterSpacing:'-0.01em' }}>Recent Activity</div>
          <div className="t-label" style={{ marginTop:3 }}>Last 5 scans</div>
        </div>

        {RECENT.map((a, i) => {
          const meta = getRiskMeta(a.level);
          return (
            <motion.div
              key={i}
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 20px', borderBottom: i<RECENT.length-1?'1px solid var(--line-0)':'none', cursor:'default' }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--glass-1)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >
              <div style={{ width:28, height:28, borderRadius:8, background:`${meta.color}14`, border:`1px solid ${meta.color}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Activity size={12} color={meta.color}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <span style={{ fontSize:12, color:'var(--ink-3)' }}>{a.action}: </span>
                <span style={{ fontSize:12, color:'var(--ink-1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.target}</span>
              </div>
              <span style={{ padding:'2px 8px', borderRadius:99, background:`${meta.color}14`, border:`1px solid ${meta.color}22`, fontSize:9, fontFamily:'var(--f-mono)', color:meta.color, letterSpacing:'0.07em', flexShrink:0 }}>
                {a.level}
              </span>
              <span style={{ fontSize:10, color:'var(--ink-3)', fontFamily:'var(--f-mono)', flexShrink:0, minWidth:64, textAlign:'right' }}>
                {timeAgo(new Date(a.ts).toISOString())}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
