import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, ArcElement, Filler,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Zap, FileText, Activity, Star, Upload, ArrowRight } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const SkeletonCard = () => (
  <div className="skeleton" style={{ height: '110px', borderRadius: '16px' }} />
);

const SummaryCard = ({ icon: Icon, title, value, subtitle, color, delay }) => (
  <motion.div
    className="glass-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '13px', color: '#a5d6a7', fontWeight: 500 }}>{title}</span>
      <div style={{
        width: 36, height: 36, borderRadius: '10px',
        background: `rgba(${color}, 0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} color={`rgb(${color})`} />
      </div>
    </div>
    <div>
      <div style={{ fontSize: '28px', fontWeight: 800, color: '#e8f5e9', letterSpacing: '-0.5px' }}>{value}</div>
      {subtitle && <div style={{ fontSize: '12px', color: '#a5d6a7', marginTop: '4px' }}>{subtitle}</div>}
    </div>
  </motion.div>
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#a5d6a7', font: { family: 'Inter', size: 12 } } },
    tooltip: {
      backgroundColor: '#111a14',
      borderColor: 'rgba(0,230,118,0.2)',
      borderWidth: 1,
      titleColor: '#e8f5e9',
      bodyColor: '#a5d6a7',
    },
  },
  scales: {
    x: { grid: { color: 'rgba(0,230,118,0.05)' }, ticks: { color: '#a5d6a7', font: { family: 'Inter', size: 11 } } },
    y: { grid: { color: 'rgba(0,230,118,0.05)' }, ticks: { color: '#a5d6a7', font: { family: 'Inter', size: 11 } } },
  },
};

const getLevelStyle = (level) => {
  if (!level) return {};
  const l = level.toLowerCase();
  if (l === 'low') return { className: 'status-low' };
  if (l === 'medium') return { className: 'status-medium' };
  return { className: 'status-high' };
};

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [recentBills, setRecentBills] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sumRes, trendRes, breakRes, billsRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/trend'),
          api.get('/dashboard/breakdown'),
          api.get('/bills/history?limit=5'),
        ]);
        setSummary(sumRes.data);
        setTrend(trendRes.data);
        setBreakdown(breakRes.data);
        setRecentBills(billsRes.data?.slice(0, 5) || []);
      } catch (err) {
        // Use mock data for demonstration when backend is unavailable
        setSummary({ totalCo2: 248.5, totalBills: 12, emissionStatus: 'Medium', bestMonth: 'January' });
        setTrend({ labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], values: [320, 280, 260, 195, 230, 248] });
        setBreakdown({ labels: ['Electricity', 'Petrol', 'LPG'], values: [45, 35, 20] });
        setRecentBills([
          { id: 1, billType: 'Electricity', consumptionValue: 320, consumptionUnit: 'kWh', co2Emitted: 262.4, emissionLevel: 'High', billDate: '2024-03-01' },
          { id: 2, billType: 'Petrol', consumptionValue: 40, consumptionUnit: 'L', co2Emitted: 92.4, emissionLevel: 'High', billDate: '2024-03-05' },
          { id: 3, billType: 'LPG', consumptionValue: 14, consumptionUnit: 'kg', co2Emitted: 41.7, emissionLevel: 'Medium', billDate: '2024-03-10' },
          { id: 4, billType: 'Electricity', consumptionValue: 180, consumptionUnit: 'kWh', co2Emitted: 147.6, emissionLevel: 'Medium', billDate: '2024-02-01' },
          { id: 5, billType: 'Diesel', consumptionValue: 25, consumptionUnit: 'L', co2Emitted: 67, emissionLevel: 'Medium', billDate: '2024-02-15' },
        ]);
      } finally {
        setLoadingAll(false);
      }
    };
    fetchAll();
  }, []);

  const lineData = trend ? {
    labels: trend.labels,
    datasets: [{
      label: 'CO₂ Emitted (kg)',
      data: trend.values,
      borderColor: '#00e676',
      backgroundColor: 'rgba(0,230,118,0.08)',
      borderWidth: 2,
      pointBackgroundColor: '#00e676',
      pointRadius: 4,
      tension: 0.4,
      fill: true,
    }],
  } : null;

  const pieData = breakdown ? {
    labels: breakdown.labels,
    datasets: [{
      data: breakdown.values,
      backgroundColor: ['rgba(0,230,118,0.7)', 'rgba(255,109,0,0.7)', 'rgba(105,240,174,0.7)'],
      borderColor: ['#00e676', '#ff6d00', '#69f0ae'],
      borderWidth: 1,
    }],
  } : null;

  const summaryCards = summary ? [
    { icon: Activity, title: 'Total CO₂ This Month', value: `${summary.totalCo2} kg`, subtitle: 'Carbon dioxide emitted', color: '0,230,118', delay: 0.1 },
    { icon: FileText, title: 'Total Bills Uploaded', value: summary.totalBills, subtitle: 'All time uploads', color: '105,240,174', delay: 0.2 },
    { icon: Zap, title: 'Emission Status', value: summary.emissionStatus, subtitle: 'Current month level', color: summary.emissionStatus === 'Low' ? '0,230,118' : summary.emissionStatus === 'Medium' ? '255,193,7' : '255,109,0', delay: 0.3 },
    { icon: Star, title: 'Best Month', value: summary.bestMonth, subtitle: 'Your lowest emission month', color: '105,240,174', delay: 0.4 },
  ] : [];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0d' }}>
      <Navbar />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Greeting */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#e8f5e9' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span style={{ color: '#00e676' }}>{user?.name?.split(' ')[0] || 'User'}</span> 🌿
          </h1>
          <p style={{ color: '#a5d6a7', fontSize: '14px', marginTop: '4px' }}>Here's your carbon footprint summary</p>
        </motion.div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {loadingAll
            ? [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
            : summaryCards.map((card) => <SummaryCard key={card.title} {...card} />)
          }
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '28px' }}>
          {/* Line Chart */}
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ padding: '24px' }}
          >
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#e8f5e9', marginBottom: '20px' }}>
              Emission Trend — Last 6 Months
            </h2>
            <div style={{ height: '240px' }}>
              {lineData ? <Line data={lineData} options={chartOptions} /> : <div className="skeleton" style={{ height: '100%' }} />}
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{ padding: '24px' }}
          >
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#e8f5e9', marginBottom: '20px' }}>
              Breakdown by Type
            </h2>
            <div style={{ height: '240px', display: 'flex', alignItems: 'center' }}>
              {pieData ? (
                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#a5d6a7', font: { family: 'Inter', size: 11 }, padding: 12 } }, tooltip: { backgroundColor: '#111a14', borderColor: 'rgba(0,230,118,0.2)', borderWidth: 1, titleColor: '#e8f5e9', bodyColor: '#a5d6a7' } } }} />
              ) : <div className="skeleton" style={{ height: '100%', width: '100%' }} />}
            </div>
          </motion.div>
        </div>

        {/* Recent Bills Table */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          style={{ overflow: 'hidden' }}
        >
          <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,230,118,0.08)' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#e8f5e9' }}>Recent Bills</h2>
            <Link to="/history" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00e676', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(0,230,118,0.04)' }}>
                  {['Date', 'Type', 'Consumption', 'CO₂ Emitted', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#a5d6a7', borderBottom: '1px solid rgba(0,230,118,0.1)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingAll ? (
                  [1, 2, 3].map(i => (
                    <tr key={i}><td colSpan={5} style={{ padding: '16px 24px' }}><div className="skeleton" style={{ height: '20px' }} /></td></tr>
                  ))
                ) : recentBills.map((bill, i) => (
                  <tr key={bill.id || i} style={{ borderBottom: '1px solid rgba(0,230,118,0.05)', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,230,118,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 24px', fontSize: '13px', color: '#a5d6a7' }}>{bill.billDate}</td>
                    <td style={{ padding: '14px 24px', fontSize: '13px', color: '#e8f5e9', fontWeight: 500 }}>{bill.billType}</td>
                    <td style={{ padding: '14px 24px', fontSize: '13px', color: '#a5d6a7' }}>{bill.consumptionValue} {bill.consumptionUnit}</td>
                    <td style={{ padding: '14px 24px', fontSize: '13px', color: '#e8f5e9', fontWeight: 600 }}>{bill.co2Emitted} kg</td>
                    <td style={{ padding: '14px 24px' }}>
                      <span className={`status-${bill.emissionLevel?.toLowerCase()}`}>{bill.emissionLevel}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loadingAll && recentBills.length === 0 && (
              <div style={{ padding: '48px', textAlign: 'center', color: '#a5d6a7' }}>
                <Upload size={40} style={{ margin: '0 auto 12px', opacity: 0.4, display: 'block' }} />
                <p>No bills uploaded yet.</p>
                <Link to="/upload" className="btn-primary" style={{ display: 'inline-flex', marginTop: '16px', fontSize: '14px', padding: '10px 22px' }}>
                  Upload Your First Bill <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
