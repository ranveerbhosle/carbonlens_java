import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, LayoutDashboard, Upload, History, Lightbulb, LogOut, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/upload', icon: Upload, label: 'Upload Bill' },
  { path: '/history', icon: History, label: 'History' },
  { path: '/tips', icon: Lightbulb, label: 'Tips' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'rgba(10,15,13,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(0,230,118,0.1)',
      position: 'sticky', top: 0, zIndex: 100,
      padding: '0 24px',
      height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <div style={{
          width: 36, height: 36, background: 'linear-gradient(135deg, #00e676, #69f0ae)',
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px rgba(0,230,118,0.4)',
        }}>
          <Leaf size={20} color="#0a0f0d" />
        </div>
        <span style={{ fontWeight: 800, fontSize: '18px', color: '#e8f5e9', letterSpacing: '-0.5px' }}>
          Carbon<span style={{ color: '#00e676' }}>Lens</span>
        </span>
      </Link>

      {/* Desktop Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden-mobile">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '10px', textDecoration: 'none',
              fontSize: '13px', fontWeight: 500,
              color: active ? '#00e676' : '#a5d6a7',
              background: active ? 'rgba(0,230,118,0.1)' : 'transparent',
              border: active ? '1px solid rgba(0,230,118,0.2)' : '1px solid transparent',
              transition: 'all 0.2s ease',
            }}>
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </div>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link to="/profile" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(0,230,118,0.07)', border: '1px solid rgba(0,230,118,0.15)',
          borderRadius: '10px', padding: '6px 12px', textDecoration: 'none',
          transition: 'all 0.2s ease', cursor: 'pointer'
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,230,118,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,230,118,0.07)'}
        >
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00e676, #69f0ae)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={14} color="#0a0f0d" />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#e8f5e9' }}>
            {user?.name || 'User'}
          </span>
        </Link>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 14px', borderRadius: '10px',
          background: 'rgba(255,109,0,0.08)', border: '1px solid rgba(255,109,0,0.2)',
          color: '#ff6d00', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
          transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,109,0,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,109,0,0.08)'}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
