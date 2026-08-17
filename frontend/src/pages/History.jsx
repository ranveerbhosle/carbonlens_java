import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Download, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const BILL_TYPES = ['All', 'ELECTRICITY', 'PETROL', 'DIESEL', 'LPG'];

const mockBills = [
  { id: 1, billType: 'Electricity', consumptionValue: 320, consumptionUnit: 'kWh', co2Emitted: 262.4, emissionLevel: 'High', billDate: '2024-03-01' },
  { id: 2, billType: 'Petrol', consumptionValue: 40, consumptionUnit: 'L', co2Emitted: 92.4, emissionLevel: 'High', billDate: '2024-03-05' },
  { id: 3, billType: 'LPG', consumptionValue: 14, consumptionUnit: 'kg', co2Emitted: 41.72, emissionLevel: 'Medium', billDate: '2024-03-10' },
  { id: 4, billType: 'Electricity', consumptionValue: 180, consumptionUnit: 'kWh', co2Emitted: 147.6, emissionLevel: 'Medium', billDate: '2024-02-01' },
  { id: 5, billType: 'Diesel', consumptionValue: 25, consumptionUnit: 'L', co2Emitted: 67.0, emissionLevel: 'Medium', billDate: '2024-02-15' },
  { id: 6, billType: 'Electricity', consumptionValue: 80, consumptionUnit: 'kWh', co2Emitted: 65.6, emissionLevel: 'Low', billDate: '2024-01-10' },
  { id: 7, billType: 'LPG', consumptionValue: 7, consumptionUnit: 'kg', co2Emitted: 20.86, emissionLevel: 'Low', billDate: '2024-01-20' },
];

const History = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    api.get('/bills/history')
      .then(res => setBills(res.data))
      .catch(() => setBills(mockBills))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bills.filter(b => {
    const typeMatch = filterType === 'All' || b.billType.toUpperCase() === filterType;
    const fromMatch = !dateFrom || new Date(b.billDate) >= new Date(dateFrom);
    const toMatch = !dateTo || new Date(b.billDate) <= new Date(dateTo);
    return typeMatch && fromMatch && toMatch;
  });

  const downloadCSV = () => {
    const header = 'Date,Type,Consumption,Unit,CO2 (kg),Level';
    const rows = filtered.map(b => `${b.billDate},${b.billType},${b.consumptionValue},${b.consumptionUnit},${b.co2Emitted},${b.emissionLevel}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'carbonlens_history.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded!');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0d' }}>
      <Navbar />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#e8f5e9', marginBottom: '4px' }}>Bill History</h1>
              <p style={{ color: '#a5d6a7', fontSize: '14px' }}>{filtered.length} records found</p>
            </div>
            <button id="download-csv-btn" onClick={downloadCSV} className="btn-secondary" style={{ fontSize: '14px', padding: '10px 20px', cursor: 'pointer' }}>
              <Download size={16} /> Export CSV
            </button>
          </div>

          {/* Filters */}
          <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={16} color="#a5d6a7" />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {BILL_TYPES.map(t => (
                <button key={t} onClick={() => setFilterType(t)} style={{
                  padding: '6px 14px', borderRadius: '20px', border: filterType === t ? '1px solid #00e676' : '1px solid rgba(0,230,118,0.15)',
                  background: filterType === t ? 'rgba(0,230,118,0.12)' : 'transparent',
                  color: filterType === t ? '#00e676' : '#a5d6a7',
                  cursor: 'pointer', fontSize: '12px', fontWeight: filterType === t ? 600 : 400, transition: 'all 0.2s',
                }}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', flexWrap: 'wrap' }}>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input-field" style={{ width: '140px', padding: '8px 12px', fontSize: '12px' }} />
              <span style={{ color: '#a5d6a7', alignSelf: 'center', fontSize: '12px' }}>to</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input-field" style={{ width: '140px', padding: '8px 12px', fontSize: '12px' }} />
            </div>
          </div>

          {/* Table */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,230,118,0.04)' }}>
                    {['Date', 'Type', 'Consumption', 'Unit', 'CO₂ Emitted', 'Level'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#a5d6a7', borderBottom: '1px solid rgba(0,230,118,0.08)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [1, 2, 3, 4, 5].map(i => (
                      <tr key={i}><td colSpan={6} style={{ padding: '14px 20px' }}><div className="skeleton" style={{ height: '20px' }} /></td></tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#a5d6a7' }}>No records match your filter.</td></tr>
                  ) : (
                    filtered.map((b, i) => (
                      <motion.tr
                        key={b.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{ borderBottom: '1px solid rgba(0,230,118,0.05)', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,230,118,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '13px 20px', fontSize: '13px', color: '#a5d6a7' }}>{b.billDate}</td>
                        <td style={{ padding: '13px 20px', fontSize: '13px', color: '#e8f5e9', fontWeight: 500 }}>{b.billType}</td>
                        <td style={{ padding: '13px 20px', fontSize: '13px', color: '#e8f5e9', fontWeight: 600 }}>{b.consumptionValue}</td>
                        <td style={{ padding: '13px 20px', fontSize: '13px', color: '#a5d6a7' }}>{b.consumptionUnit}</td>
                        <td style={{ padding: '13px 20px', fontSize: '13px', color: '#00e676', fontWeight: 700 }}>{b.co2Emitted} kg</td>
                        <td style={{ padding: '13px 20px' }}>
                          <span className={`status-${b.emissionLevel?.toLowerCase()}`}>{b.emissionLevel}</span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default History;
