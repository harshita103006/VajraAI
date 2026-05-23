import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, ArrowRight, Lock, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AMBIENT_DOTS = Array.from({ length: 20 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 4 + 2,
  delay: Math.random() * 3,
}));

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [tab, setTab]         = useState('login');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({ name: '', email: '', apiKey: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.apiKey.trim()) { toast.error('API key is required'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    login(form.apiKey, { name: form.name || form.email?.split('@')[0] || 'Analyst', email: form.email || 'analyst@vajraai.com' });
    toast.success('Access granted');
    navigate('/dashboard');
    setLoading(false);
  };

  const handleDemo = () => {
    login('demo-key-vajra-2024', { name: 'Demo Analyst', email: 'demo@vajraai.com' });
    navigate('/dashboard');
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--base)', position: 'relative', overflow: 'hidden' }} className="noise">
      <div className="grid-bg" />

      {/* Ambient floating dots */}
      {AMBIENT_DOTS.map((d, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: `${d.x}%`, top: `${d.y}%`,
            width: d.size, height: d.size, borderRadius: '50%',
            background: 'var(--a)', opacity: 0.15,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Left panel — visible on desktop */}
      <div className="hide-sm" style={{
        flex: '0 0 420px',
        borderRight: '1px solid var(--line-0)',
        padding: '48px 44px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        background: 'var(--surface-0)', position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, background: 'var(--a)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(200,255,0,0.25)' }}>
            <Shield size={15} color="var(--base)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 15, letterSpacing: '-0.03em' }}>
              Vajra<span style={{ color: 'var(--a)' }}>AI</span>
            </div>
            <div style={{ fontSize: 9, fontFamily: 'var(--f-mono)', color: 'var(--ink-3)', letterSpacing: '0.1em' }}>THREAT INTELLIGENCE</div>
          </div>
        </div>

        <div>
          {[
            { val: '1,247', label: 'scans in last 24h', color: 'var(--a)' },
            { val: '99.1%', label: 'detection accuracy', color: 'var(--safe)' },
            { val: '<80ms', label: 'average response time', color: 'var(--high)' },
          ].map(s => (
            <div key={s.val} style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: 'var(--f-display)', fontWeight: 900, fontSize: 34, color: s.color, letterSpacing: '-0.05em', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={12} color="var(--safe)" />
          <span style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--f-mono)' }}>All systems operational</span>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
          style={{ width: '100%', maxWidth: 380 }}
        >
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 36 }}>
            <div style={{ width: 28, height: 28, background: 'var(--a)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={14} color="var(--base)" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 15, letterSpacing: '-0.03em' }}>
              Vajra<span style={{ color: 'var(--a)' }}>AI</span>
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', marginBottom: 6 }}>
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 26 }}>
            {tab === 'login' ? 'Enter your API key to access the platform' : 'Start detecting threats today'}
          </p>

          {/* Tab switcher */}
          <div style={{ display: 'flex', background: 'var(--surface-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-md)', padding: 3, marginBottom: 24, gap: 3 }}>
            {['login','signup'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '8px', borderRadius: 8, border: 'none',
                  background: tab === t ? 'var(--surface-3)' : 'transparent',
                  color: tab === t ? 'var(--ink-0)' : 'var(--ink-3)',
                  cursor: 'pointer', fontSize: 13,
                  fontFamily: 'var(--f-body)', fontWeight: tab === t ? 500 : 400,
                  transition: 'all 0.15s',
                }}
              >
                {t === 'login' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {tab === 'signup' && (
              <div style={{ marginBottom: 14 }}>
                <label className="t-label" style={{ display: 'block', marginBottom: 7 }}>Name</label>
                <input className="input" type="text" placeholder="Your name" value={form.name} onChange={set('name')} />
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <label className="t-label" style={{ display: 'block', marginBottom: 7 }}>Email</label>
              <input className="input" type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} />
            </div>
            <div style={{ marginBottom: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <label className="t-label">API Key</label>
                <span style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'var(--f-mono)' }}>Required</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  className="input input-mono"
                  type={showKey ? 'text' : 'password'}
                  placeholder="vjr_••••••••••••••••"
                  value={form.apiKey}
                  onChange={set('apiKey')}
                  style={{ paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowKey(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', display: 'flex' }}>
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? (
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12 }}>Authenticating…</span>
              ) : (
                <>{tab === 'login' ? 'Access platform' : 'Create account'} <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <div style={{ position: 'relative', textAlign: 'center', margin: '18px 0' }}>
            <div style={{ height: 1, background: 'var(--line-1)' }} />
            <span style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', background: 'var(--base)', padding: '0 10px', fontSize: 11, color: 'var(--ink-3)' }}>or</span>
          </div>

          <button onClick={handleDemo} className="btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
            Continue with demo access
          </button>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-3)', marginTop: 20, lineHeight: 1.6 }}>
            By continuing you agree to VajraAI's Terms of Service<br />and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
