import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Upload, FileText, Image, X, Zap, CheckCircle, AlertTriangle, AlertCircle, Lightbulb } from 'lucide-react';

const BILL_TYPES = [
  { value: 'ELECTRICITY', label: '⚡ Electricity', unit: 'kWh' },
  { value: 'PETROL', label: '⛽ Petrol', unit: 'Liters' },
  { value: 'DIESEL', label: '🛢️ Diesel', unit: 'Liters' },
  { value: 'LPG', label: '🔥 LPG', unit: 'kg' },
];

const LevelIcon = ({ level }) => {
  if (!level) return null;
  const l = level.toLowerCase();
  if (l === 'low') return <CheckCircle size={20} color="#00e676" />;
  if (l === 'medium') return <AlertTriangle size={20} color="#ffc107" />;
  return <AlertCircle size={20} color="#ff6d00" />;
};

const UploadBill = () => {
  const [file, setFile] = useState(null);
  const [billType, setBillType] = useState('ELECTRICITY');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) {
      setFile(accepted[0]);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'], 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: () => toast.error('File rejected. Use JPG, PNG, or PDF under 10MB.'),
  });

  const handleScan = async () => {
    if (!file) { toast.error('Please select a file first'); return; }
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('billType', billType);
      const res = await api.post('/bills/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
      toast.success('Bill scanned successfully! 🌿');
    } catch (err) {
      // Mock result for demonstration
      const mockResults = {
        ELECTRICITY: { consumptionValue: 320, consumptionUnit: 'kWh', co2Emitted: 262.4, emissionLevel: 'High', tip: 'Your electricity usage is very high. Consider switching to LED bulbs, unplugging unused devices, and using appliances during off-peak hours.' },
        PETROL: { consumptionValue: 45, consumptionUnit: 'L', co2Emitted: 103.95, emissionLevel: 'High', tip: 'High fuel consumption detected. Consider carpooling, using public transport, or switching to an EV.' },
        DIESEL: { consumptionValue: 38, consumptionUnit: 'L', co2Emitted: 101.84, emissionLevel: 'High', tip: 'High fuel consumption. Consider route optimization and regular vehicle maintenance.' },
        LPG: { consumptionValue: 14, consumptionUnit: 'kg', co2Emitted: 41.72, emissionLevel: 'Medium', tip: 'Use pressure cookers to reduce cooking time and gas consumption.' },
      };
      setResult(mockResults[billType]);
      toast.success('Bill processed! (Demo mode — connect backend for real OCR)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0d' }}>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#e8f5e9', marginBottom: '6px' }}>Upload Bill</h1>
          <p style={{ color: '#a5d6a7', fontSize: '14px', marginBottom: '28px' }}>Upload your bill and we'll extract consumption data and calculate your CO₂ emissions.</p>

          {/* Bill Type Selector */}
          <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#a5d6a7', display: 'block', marginBottom: '12px' }}>Select Bill Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
              {BILL_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setBillType(value)}
                  style={{
                    padding: '12px', borderRadius: '12px', border: billType === value ? '1.5px solid #00e676' : '1px solid rgba(0,230,118,0.1)',
                    background: billType === value ? 'rgba(0,230,118,0.1)' : 'rgba(17,26,20,0.5)',
                    color: billType === value ? '#00e676' : '#a5d6a7',
                    cursor: 'pointer', fontSize: '13px', fontWeight: billType === value ? 600 : 400,
                    transition: 'all 0.2s ease', textAlign: 'center',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Zone */}
          <div className="glass-card" style={{ marginBottom: '20px' }}>
            <div
              {...getRootProps()}
              style={{
                padding: '48px 24px', textAlign: 'center', cursor: 'pointer',
                border: `2px dashed ${isDragActive ? '#00e676' : 'rgba(0,230,118,0.25)'}`,
                borderRadius: '14px', margin: '4px',
                background: isDragActive ? 'rgba(0,230,118,0.05)' : 'transparent',
                transition: 'all 0.3s ease',
              }}
            >
              <input {...getInputProps()} id="bill-file-input" />
              <div style={{
                width: 72, height: 72, borderRadius: '20px',
                background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px',
              }}>
                <Upload size={34} color="#00e676" />
              </div>
              {isDragActive
                ? <p style={{ color: '#00e676', fontWeight: 600, fontSize: '16px' }}>Drop it here!</p>
                : <>
                  <p style={{ color: '#e8f5e9', fontWeight: 600, fontSize: '16px', marginBottom: '6px' }}>Drag & drop your bill here</p>
                  <p style={{ color: '#a5d6a7', fontSize: '13px', marginBottom: '16px' }}>Supports JPG, PNG, PDF — up to 10MB</p>
                  <span className="btn-secondary" style={{ fontSize: '13px', padding: '9px 20px', display: 'inline-flex' }}>Browse File</span>
                </>
              }
            </div>

            {/* File Preview */}
            <AnimatePresence>
              {file && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ padding: '0 16px 16px' }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)',
                    borderRadius: '12px', padding: '12px 16px',
                  }}>
                    {file.type.includes('pdf') ? <FileText size={22} color="#00e676" /> : <Image size={22} color="#00e676" />}
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#e8f5e9', fontSize: '14px', fontWeight: 500, margin: 0 }}>{file.name}</p>
                      <p style={{ color: '#a5d6a7', fontSize: '12px', margin: 0 }}>{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => { setFile(null); setResult(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff6d00' }}>
                      <X size={18} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scan Button */}
          <button
            id="scan-calculate-btn"
            onClick={handleScan}
            disabled={!file || loading}
            className="btn-primary"
            style={{
              width: '100%', justifyContent: 'center', fontSize: '16px', padding: '14px',
              opacity: (!file || loading) ? 0.6 : 1, marginBottom: '24px',
            }}
          >
            {loading ? (
              <>
                <div style={{ width: 20, height: 20, border: '2.5px solid rgba(10,15,13,0.4)', borderTopColor: '#0a0f0d', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Scanning & Calculating...
              </>
            ) : (
              <><Zap size={18} /> Scan &amp; Calculate</>
            )}
          </button>

          {/* Result Card */}
          <AnimatePresence>
            {result && (
              <motion.div
                className="glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ padding: '28px', borderColor: result.emissionLevel?.toLowerCase() === 'low' ? 'rgba(0,230,118,0.3)' : result.emissionLevel?.toLowerCase() === 'medium' ? 'rgba(255,193,7,0.3)' : 'rgba(255,109,0,0.3)' }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#e8f5e9', marginBottom: '20px' }}>📊 Scan Results</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  {[
                    { label: 'Extracted Value', value: `${result.consumptionValue} ${result.consumptionUnit}` },
                    { label: 'CO₂ Emitted', value: `${result.co2Emitted} kg` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background: 'rgba(0,230,118,0.05)', borderRadius: '12px', padding: '16px' }}>
                      <p style={{ fontSize: '12px', color: '#a5d6a7', margin: '0 0 4px' }}>{label}</p>
                      <p style={{ fontSize: '22px', fontWeight: 800, color: '#e8f5e9', margin: 0 }}>{value}</p>
                    </div>
                  ))}
                  <div style={{ background: 'rgba(0,230,118,0.05)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ fontSize: '12px', color: '#a5d6a7', margin: 0 }}>Emission Level</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <LevelIcon level={result.emissionLevel} />
                      <span className={`status-${result.emissionLevel?.toLowerCase()}`} style={{ fontSize: '14px', padding: '4px 14px' }}>{result.emissionLevel}</span>
                    </div>
                  </div>
                </div>

                {result.tip && (
                  <div style={{
                    display: 'flex', gap: '12px', alignItems: 'flex-start',
                    background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.15)',
                    borderRadius: '12px', padding: '16px',
                  }}>
                    <Lightbulb size={20} color="#ffc107" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ color: '#e8f5e9', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{result.tip}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    </div>
  );
};

export default UploadBill;
