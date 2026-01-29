import React from 'react';
import { X, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MetadataModal({ asset, onClose }) {
  if (!asset) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="cyber-glass w-full max-w-2xl max-h-[80vh] flex flex-col relative"
        >
          <div className="p-4 border-b border-cyber-red/30 flex justify-between items-center bg-cyber-red/5">
            <h3 className="text-white font-mono flex items-center gap-2 text-[15px]">
              <Cpu size={18} className="text-cyber-red" />
              INSPECT_RESOURCE_ID: {asset.id}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-cyber-red transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto font-mono text-[13px] bg-black/50">
            <div className="mb-5 space-y-3">
              <div className="flex justify-between border-b border-cyber-gray pb-2">
                <span className="text-gray-500 uppercase">Resource Name:</span>
                <span className="text-cyber-blue font-bold">{asset.name}</span>
              </div>
              <div className="flex justify-between border-b border-cyber-gray pb-2">
                <span className="text-gray-500 uppercase">Policy Risk:</span>
                <span className={`font-bold ${
                  asset.risk === 'High' ? 'text-cyber-red' : 
                  asset.risk === 'Medium' ? 'text-cyber-yellow' : 'text-cyber-green'
                }`}>
                  {asset.risk}
                </span>
              </div>
            </div>
            
            <p className="text-cyber-red/60 mb-3 font-bold text-[11px]">// RAW_METADATA_STREAM</p>
            <pre className="text-cyber-green/80 whitespace-pre-wrap leading-relaxed bg-black/40 p-4 border border-white/5">
              {JSON.stringify(asset.metadata, null, 2)}
            </pre>
          </div>
          
          <div className="p-4 border-t border-white/5 text-[11px] text-gray-600 font-mono flex justify-between">
            <span>SECURE_DATA_ACCESS_GRANTED</span>
            <span>NO_LOCAL_STORAGE_PERSISTENCE</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}