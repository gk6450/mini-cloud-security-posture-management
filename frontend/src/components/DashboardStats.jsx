import React from 'react';
import { LayoutGrid, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardStats({ total, highRisk }) {
  const cards = [
    { label: 'TOTAL_ASSETS', val: total, color: 'cyber-blue', Icon: LayoutGrid },
    { label: 'CRITICAL_RISK', val: highRisk, color: 'cyber-red', Icon: AlertTriangle, pulse: highRisk > 0 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {cards.map((card, i) => (
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: i * 0.1 }}
          key={card.label} 
          className={`cyber-glass p-8 border-l-4 border-l-${card.color} relative overflow-hidden`}
        >
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className={`text-xs font-mono text-${card.color} uppercase tracking-widest font-bold`}>
                {card.label}
              </p>
              <h3 className="text-5xl font-black text-white mt-2 leading-none">{card.val}</h3>
            </div>
            <card.Icon className={`text-${card.color}/20 ${card.pulse ? 'animate-pulse' : ''}`} size={48} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}