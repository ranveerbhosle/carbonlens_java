import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111a14',
            color: '#e8f5e9',
            border: '1px solid rgba(0,230,118,0.2)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#00e676', secondary: '#0a0f0d' },
          },
          error: {
            iconTheme: { primary: '#ff6d00', secondary: '#0a0f0d' },
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>
);
