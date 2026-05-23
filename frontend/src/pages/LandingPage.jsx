import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { Shield, Link2, Mail, FileSearch, Brain, BarChart3, Lock, ArrowRight, Zap, Activity } from 'lucide-react';

const FEATURES = [
  { icon: Mail,      label: 'Email Phishing',     desc: 'Multi-signal detection of social engineering, spoofing, and credential harvesting campaigns.',   color: 'var(--a)' },
  { icon: Link2,     label: 'URL Intelligence',   desc: 'Deep inspection against live threat feeds, redirect chain analysis, and domain reputation.',     color: 'var(--high)' },
  { icon: FileSearch,label: 'Attachment Shield',  desc: 'MIME validation, payload extraction, and behavioral signature matching across all file types.',  color: 'var(--med)' },
  { icon: Brain,     label: 'Prompt Injection',   desc: 'Real-time detection of jailbreaks, role overrides, and adversarial AI input manipulation.',      color: 'var(--crit)' },
  { icon: BarChart3, label: 'Threat Analytics',   desc: 'Timeline-based risk scoring, module performance metrics, and exportable intelligence reports.',  color: 'var(--low)' },
  { icon: Lock,      label: 'Privacy Masking',    desc: 'Automatic PII redaction and sensitive data obfuscation before logging or analysis.',             color: 'var(--safe)' },
];

const STATS = [
  { value: '99.1%', label: 'Detection accuracy' },
  { value: '<80ms', label: 'Median scan latency' },
  { value: '12M+',  label: 'Threats analyzed' },
  { value: 'SOC 2', label: 'Compliant' },
];

function FeatureCard({ icon: Icon, label, desc, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, ease: [0.16,1,0.3,1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      style={{
        background: 'var(--surface-1)', border: '1px solid var(--line-1)',
        borderRadius: 'var(--r-xl)', padding: '22px 20px',
        position: 'relative', overflow: 'hidden',
        cursor: 'default',
      }}
    >
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: color, opacity: 0.06, filter: 'blur(16px)' }} />
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}14`, border: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Icon size={17} color={color} strokeWidth={1.8} />
      </div>
      <div style={{ fontFamily: 'var(--f-display)', fontWeight: 600, fontSize: 14, marginBottom: 7, letterSpacing: '-0.01em' }}>{label}</div>
      <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.65 }}>{desc}</div>
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef  = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY    = useTransform(scrollYProgress, [0,1], ['0%', '20%']);
  const heroOp   = useTransform(scrollYProgress, [0,0.7], [1, 0]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--base)', fontFamily: 'var(--f-body)', overflowX: 'hidden' }} className="noise">
      {/* Ambient grid */}
      <div className="grid-bg" />

      {/* ── Nav ── */}
      <nav style={{
        display: 'flex', alignItems: 'center',
        padding: '0 40px', height: 56,
        borderBottom: '1px solid var(--line-0)',
        background: 'rgba(8,10,15,0.8)',
        backdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, background: 'var(--a)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(200,255,0,0.3)' }}>
            <Shield size={14} color="var(--base)" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 15, letterSpacing: '-0.03em' }}>
            Vajra<span style={{ color: 'var(--a)' }}>AI</span>
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/login')} className="btn-ghost" style={{ padding: '7px 16px', fontSize: 13 }}>Sign in</button>
          <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>
            Launch platform <ArrowRight size={13} />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{ maxWidth: 860, margin: '0 auto', padding: '90px 24px 70px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div style={{ y: heroY, opacity: heroOp }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'var(--a-dim)', border: '1px solid var(--a-glow)',
              borderRadius: 99, padding: '5px 14px', marginBottom: 32,
            }}>
              <Zap size={11} color="var(--a)" />
              <span style={{ fontSize: 11, color: 'var(--a)', fontFamily: 'var(--f-mono)', letterSpacing: '0.1em' }}>
                AI-POWERED THREAT INTELLIGENCE PLATFORM
              </span>
            </div>

            <h1 className="t-hero" style={{ marginBottom: 22, color: 'var(--ink-0)' }}>
              Detect every<br />
              <span style={{ color: 'var(--a)', position: 'relative' }}>
                threat vector.
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  style={{ position: 'absolute', bottom: -4, left: 0, right: 0, height: 2, background: 'var(--a)', transformOrigin: 'left', opacity: 0.4 }}
                />
              </span>
            </h1>

            <p style={{ fontSize: 16, color: 'var(--ink-2)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.75 }}>
              Enterprise-grade AI scanning for phishing, malicious URLs, file payloads, and prompt injection. Built for security teams that can't afford to be wrong.
            </p>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '12px 26px', fontSize: 14 }}>
                Open platform <ArrowRight size={14} />
              </button>
              <button onClick={() => navigate('/login')} className="btn-ghost" style={{ padding: '12px 26px', fontSize: 14 }}>
                View API docs
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16,1,0.3,1] }}
          style={{
            marginTop: 60,
            background: 'var(--surface-1)', border: '1px solid var(--line-1)',
            borderRadius: 18, overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px var(--line-1)',
          }}
        >
          {/* Browser chrome */}
          <div style={{ background: 'var(--surface-0)', borderBottom: '1px solid var(--line-0)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ flex: 1, margin: '0 12px', background: 'var(--surface-2)', borderRadius: 5, height: 20, display: 'flex', alignItems: 'center', padding: '0 10px' }}>
              <span style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'var(--f-mono)' }}>app.vajraai.com/dashboard</span>
            </div>
          </div>
          {/* Fake dashboard */}
          <div style={{ padding: 18, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {[
              { l: 'Scans today', v: '1,247', c: 'var(--a)' },
              { l: 'Threats blocked', v: '89', c: 'var(--crit)' },
              { l: 'Avg risk score', v: '23', c: 'var(--med)' },
              { l: 'Clean scans', v: '94.7%', c: 'var(--safe)' },
            ].map(s => (
              <div key={s.l} style={{ background: 'var(--surface-0)', border: '1px solid var(--line-1)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'var(--f-mono)', marginBottom: 6 }}>{s.l}</div>
                <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 20, color: s.c, letterSpacing: '-0.04em' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ borderTop: '1px solid var(--line-0)', borderBottom: '1px solid var(--line-0)', background: 'var(--surface-0)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '0 20px', borderRight: i < 3 ? '1px solid var(--line-0)' : 'none' }}>
              <div style={{ fontFamily: 'var(--f-display)', fontWeight: 900, fontSize: 26, color: 'var(--ink-0)', letterSpacing: '-0.04em', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="t-label" style={{ marginBottom: 12 }}>Detection Modules</div>
          <h2 className="t-h1" style={{ marginBottom: 12 }}>Every attack surface. One platform.</h2>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', maxWidth: 420, margin: '0 auto' }}>Six specialized AI models, unified scoring, one API.</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {FEATURES.map((f, i) => <FeatureCard key={f.label} {...f} index={i} />)}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ borderTop: '1px solid var(--line-0)', padding: '70px 24px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Activity size={28} color="var(--a)" style={{ margin: '0 auto 16px' }} />
          <h2 className="t-h1" style={{ marginBottom: 14 }}>Ready to secure your stack?</h2>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 28 }}>Free tier includes 500 scans/month. No credit card required.</p>
          <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '13px 32px', fontSize: 14 }}>
            Start scanning now <ArrowRight size={14} />
          </button>
        </motion.div>
      </section>

      <footer style={{ borderTop: '1px solid var(--line-0)', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 13, color: 'var(--ink-3)', letterSpacing: '-0.02em' }}>
          Vajra<span style={{ color: 'var(--a)' }}>AI</span>
        </span>
        <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>© 2024 VajraAI Security</span>
      </footer>
    </div>
  );
}
