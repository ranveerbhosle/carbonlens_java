import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Activity, Edit3, Check, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setSummary(res.data);
      } catch (err) {
        // Fallback for demo
        setSummary({ totalBills: 12, totalCo2: 248.5, emissionStatus: 'Medium' });
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0d' }}>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#e8f5e9', marginBottom: '28px' }}>Your Profile</h1>

          <div className="glass-card" style={{ padding: '32px', marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'linear-gradient(135deg, #00e676, #69f0ae)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,230,118,0.2)', marginBottom: '24px'
            }}>
              <User size={48} color="#0a0f0d" />
            </div>
            
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#e8f5e9', margin: '0 0 8px' }}>{user?.name || 'Sustainable User'}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5d6a7', marginBottom: '32px' }}>
              <Mail size={16} />
              <span style={{ fontSize: '15px' }}>{user?.email || 'user@example.com'}</span>
            </div>

            <div style={{ width: '100%', height: '1px', background: 'rgba(0,230,118,0.1)', marginBottom: '32px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', width: '100%' }}>
              
              <div style={{ background: 'rgba(0,230,118,0.05)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(0,230,118,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#a5d6a7' }}>
                  <Award size={18} />
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Lifetime Bills</span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#e8f5e9' }}>
                  {loading ? '...' : summary?.totalBills || 0}
                </div>
              </div>

              <div style={{ background: 'rgba(0,230,118,0.05)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(0,230,118,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#a5d6a7' }}>
                  <Activity size={18} />
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Global Status</span>
                </div>
                <div>
                  {loading ? '...' : (
                    <span className={`status-${summary?.emissionStatus?.toLowerCase()}`} style={{ fontSize: '15px', padding: '6px 16px' }}>
                      {summary?.emissionStatus || 'Unknown'} Level
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>

        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
