import React, { useState } from 'react';
import { ShieldAlert, Zap, Globe, Lock, Key, Eye, EyeOff } from 'lucide-react';

export default function ConnectionManager({ onScan, loading }) {
  const [formData, setFormData] = useState({
    access_key_id: '',
    secret_access_key: '',
    region: 'us-east-1',
    mode: 'mock'
  });
  
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="max-w-xl mx-auto cyber-glass p-8 rounded-none border-t-4 border-t-cyber-red relative overflow-hidden">
      <div className="scan-line" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
            <ShieldAlert className="text-cyber-red" size={28} />
            UPLINK_INITIALIZED
          </h2>
          <p className="text-[10px] font-mono text-cyber-red/70 uppercase">Secure AWS API Tunnel</p>
        </div>
        
        <div className="flex bg-black p-1 border border-cyber-gray">
          {['mock', 'real'].map((m) => (
            <button
              key={m}
              onClick={() => setFormData({ ...formData, mode: m })}
              className={`px-3 py-1 text-[10px] uppercase font-bold transition-all ${
                formData.mode === m ? 'bg-cyber-red text-white' : 'text-gray-600'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onScan(formData); }} className="space-y-6 relative z-10">
        <div className="space-y-4">
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input
              type="text"
              placeholder="AWS_ACCESS_KEY_ID"
              className="cyber-input w-full pl-10"
              value={formData.access_key_id}
              onChange={(e) => setFormData({ ...formData, access_key_id: e.target.value })}
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input
              type={showSecret ? "text" : "password"}
              placeholder="AWS_SECRET_ACCESS_KEY"
              className="cyber-input w-full pl-10 pr-10"
              value={formData.secret_access_key}
              onChange={(e) => setFormData({ ...formData, secret_access_key: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors cursor-pointer"
            >
              {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input
              type="text"
              placeholder="TARGET_REGION"
              className="cyber-input w-full pl-10"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              required
            />
          </div>
        </div>

        <button disabled={loading} className="cyber-btn-primary w-full group">
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? 'EXECUTING_DEEP_SCAN...' : 'START_SYSTEM_AUDIT'}
            <Zap size={18} className={loading ? 'animate-pulse' : ''} />
          </span>
        </button>
      </form>
    </div>
  );
}