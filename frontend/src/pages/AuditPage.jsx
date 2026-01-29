import React from 'react';
import { motion } from 'framer-motion';
import DashboardStats from '../components/DashboardStats';
import AssetTable from '../components/AssetTable';

export default function AuditPage({ results, onInspect, onTerminate }) {
  const highRiskCount = results.resources.filter(r => r.risk === 'High').length;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <DashboardStats total={results.total} highRisk={highRiskCount} />
      
      <AssetTable 
        resources={results.resources} 
        onInspect={onInspect} 
        onTerminate={onTerminate} 
      />
      
      <div className="flex justify-center mt-12">
        <button 
          onClick={onTerminate} 
          className="text-[12px] font-mono text-gray-700 hover:text-cyber-red transition-all flex items-center gap-2 uppercase tracking-widest cursor-pointer border-b border-transparent hover:border-cyber-red pb-1"
        >
          [ Terminate_Current_Session ]
        </button>
      </div>
    </motion.div>
  );
}