import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Upload, Calculator, TrendingUp, ArrowRight, Code2, ExternalLink } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

const features = [
  {
    icon: Upload,
    title: 'Upload Bills',
    desc: 'Upload your electricity, fuel, or LPG bills in JPG, PNG, or PDF format with a simple drag-and-drop interface.',
  },
  {
    icon: Calculator,
    title: 'Auto Calculate',
    desc: 'Our OCR engine reads your bills and calculates your carbon emissions using industry-standard emission factors.',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    desc: 'Visualize your carbon footprint over time with beautiful charts and get personalized tips to reduce emissions.',
  },
];

const Landing = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0d', position: 'relative', overflow: 'hidden' }}>
      <ParticleBackground />

      {/* Ambient Glow */}
      <div style={{
        position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '600px',
        background: 'radial-gradient(ellipse at center, rgba(0,230,118,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 48px',
        background: 'rgba(10,15,13,0.7)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,230,118,0.08)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 38, height: 38, borderRadius: '11px',
            background: 'linear-gradient(135deg, #00e676, #69f0ae)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0,230,118,0.4)',
          }}>
            <Leaf size={20} color="#0a0f0d" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#e8f5e9', letterSpacing: '-0.5px' }}>
            Carbon<span style={{ color: '#00e676' }}>Lens</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/login" className="btn-secondary" style={{ fontSize: '14px', padding: '9px 20px' }}>
            Sign In
          </Link>
          <Link to="/register" className="btn-primary" style={{ fontSize: '14px', padding: '9px 20px' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.25)',
            borderRadius: '100px', padding: '6px 18px', marginBottom: '32px',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e676', boxShadow: '0 0 8px #00e676' }} />
            <span style={{ fontSize: '13px', color: '#69f0ae', fontWeight: 500 }}>AI-Powered Carbon Tracking</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-2px', marginBottom: '24px',
            background: 'linear-gradient(135deg, #e8f5e9 0%, #00e676 50%, #69f0ae 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Know Your Carbon.<br />Change Your Future.
          </h1>

          <p style={{
            fontSize: '18px', color: '#a5d6a7', lineHeight: 1.7, maxWidth: '580px',
            margin: '0 auto 44px', fontWeight: 400,
          }}>
            Upload your bills. We calculate your impact. Track your emissions and take action to reduce your carbon footprint — one bill at a time.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary" style={{ fontSize: '16px', padding: '14px 32px' }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn-secondary" style={{ fontSize: '16px', padding: '14px 32px' }}>
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Hero Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            display: 'flex', justifyContent: 'center', gap: '40px',
            marginTop: '80px', flexWrap: 'wrap',
          }}
        >
          {[['10K+', 'Bills Analyzed'], ['2.4M kg', 'CO₂ Tracked'], ['95%', 'OCR Accuracy']].map(([value, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#00e676', letterSpacing: '-1px', textShadow: '0 0 20px rgba(0,230,118,0.4)' }}>{value}</div>
              <div style={{ fontSize: '13px', color: '#a5d6a7', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 100px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#e8f5e9', marginBottom: '12px' }}>
            How It <span style={{ color: '#00e676' }}>Works</span>
          </h2>
          <p style={{ color: '#a5d6a7', fontSize: '16px' }}>Three simple steps to understand and reduce your carbon footprint</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              className="glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,230,118,0.2)' }}
              style={{ padding: '36px 28px', cursor: 'default' }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(0,230,118,0.2), rgba(105,240,174,0.1))',
                border: '1px solid rgba(0,230,118,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <Icon size={26} color="#00e676" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#e8f5e9', marginBottom: '10px' }}>{title}</h3>
              <p style={{ fontSize: '14px', color: '#a5d6a7', lineHeight: 1.7 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ maxWidth: '900px', margin: '0 auto 80px', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            padding: '60px 48px', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(0,230,118,0.08), rgba(17,26,20,0.8))',
            borderColor: 'rgba(0,230,118,0.25)',
          }}
        >
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#e8f5e9', marginBottom: '12px' }}>
            Ready to track your impact?
          </h2>
          <p style={{ color: '#a5d6a7', marginBottom: '28px' }}>Join thousands of people reducing their carbon footprint today.</p>
          <Link to="/register" className="btn-primary" style={{ fontSize: '16px', padding: '14px 36px' }}>
            Start for Free <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(0,230,118,0.08)', padding: '28px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Leaf size={16} color="#00e676" />
          <span style={{ color: '#a5d6a7', fontSize: '14px' }}>CarbonLens © 2024. Built for a greener planet.</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#" style={{ color: '#a5d6a7', transition: 'color 0.2s' }}><Code2 size={18} /></a>
          <a href="#" style={{ color: '#a5d6a7', transition: 'color 0.2s' }}><ExternalLink size={18} /></a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
