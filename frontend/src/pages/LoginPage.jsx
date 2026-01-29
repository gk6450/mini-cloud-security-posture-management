import React from 'react';
import ConnectionManager from '../components/ConnectionManager';
import { motion } from 'framer-motion';

export default function LoginPage({ onScan, loading }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <ConnectionManager onScan={onScan} loading={loading} />
    </motion.div>
  );
}