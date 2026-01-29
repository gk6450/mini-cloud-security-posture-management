// src/App.jsx
import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Imports
import { runScan } from './api/client';
import { simulateDelay } from './utils/helpers';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import AuditPage from './pages/AuditPage';
import MetadataModal from './components/MetadataModal';

export default function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const handleScan = async (creds) => {
    setLoading(true);
    try {
      if (creds.mode === 'mock') {
        // 2 Second delay as requested
        await simulateDelay(2000); 
      }
      
      const data = await runScan(creds);
      setResults(data);
      toast.success('DECRYPTION_SUCCESSFUL: SYSTEM_SYNCED');
    } catch (err) {
      toast.error(err.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  const handleTerminate = () => {
    setResults(null);
    setSelectedAsset(null);
  };

  return (
    <MainLayout loading={loading}>
      <Toaster 
        toastOptions={{ 
          style: { 
            background: '#0a0a0a', 
            color: '#ff003c', 
            border: '1px solid #ff003c',
            fontFamily: 'monospace',
            fontSize: '12px'
          } 
        }} 
      />

      <AnimatePresence mode="wait">
        {!results && !loading ? (
          <LoginPage key="login" onScan={handleScan} loading={loading} />
        ) : loading ? (
          <div key="loader" className="py-32 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-2 border-cyber-red/20 rounded-full" />
              <div className="absolute inset-0 w-20 h-20 border-2 border-cyber-red border-t-transparent animate-spin rounded-full shadow-neon-red" />
            </div>
            <p className="font-mono text-cyber-red animate-pulse tracking-[0.3em] text-xs uppercase">
              ESTABLISHING_UPLINK...
            </p>
          </div>
        ) : (
          <AuditPage 
            key="dashboard"
            results={results} 
            onInspect={setSelectedAsset} 
            onTerminate={handleTerminate} 
          />
        )}
      </AnimatePresence>

      <MetadataModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
    </MainLayout>
  );
}