import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import ParticleBackground from '../components/ParticleBackground';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! 🌿`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0a0f0d', position: 'relative' }}>
      <ParticleBackground />

      {/* Left Panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '48px',
        background: 'linear-gradient(135deg, rgba(0,230,118,0.04), rgba(10,15,13,1))',
        borderRight: '1px solid rgba(0,230,118,0.08)',
        position: 'relative', zIndex: 1,
      }} className="desktop-only">
        <motion.div
          className="animate-float"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,230,118,0.15) 0%, transparent 70%)',
            border: '2px solid rgba(0,230,118,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 32px',
            boxShadow: '0 0 60px rgba(0,230,118,0.15)',
          }}>
            <Leaf size={80} color="#00e676" style={{ filter: 'drop-shadow(0 0 20px rgba(0,230,118,0.6))' }} />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#e8f5e9', marginBottom: '12px' }}>
            Welcome back to<br /><span style={{ color: '#00e676' }}>CarbonLens</span>
          </h2>
          <p style={{ color: '#a5d6a7', fontSize: '15px', maxWidth: '300px' }}>
            Track your carbon footprint and make a difference for the planet.
          </p>
        </motion.div>
      </div>

      {/* Right Panel – Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px', position: 'relative', zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: '440px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '11px',
              background: 'linear-gradient(135deg, #00e676, #69f0ae)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Leaf size={22} color="#0a0f0d" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '22px', color: '#e8f5e9' }}>
              Carbon<span style={{ color: '#00e676' }}>Lens</span>
            </span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#e8f5e9', marginBottom: '8px' }}>Sign in</h1>
          <p style={{ color: '#a5d6a7', fontSize: '14px', marginBottom: '32px' }}>
            Don't have an account? <Link to="/register" style={{ color: '#00e676', textDecoration: 'none', fontWeight: 500 }}>Create one</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#a5d6a7', display: 'block', marginBottom: '6px' }}>Email</label>
              <input
                id="login-email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p style={{ color: '#ff6d00', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#a5d6a7', display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#a5d6a7',
                }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#ff6d00', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '13px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <div style={{ width: 20, height: 20, border: '2.5px solid rgba(10,15,13,0.4)', borderTopColor: '#0a0f0d', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              ) : (
                <><LogIn size={17} /> Sign In</>
              )}
            </button>
          </form>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
