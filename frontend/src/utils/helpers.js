export const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getRiskColor = (risk) => {
  if (risk === 'High') {
    return 'bg-cyber-red text-white shadow-neon-red animate-pulse';
  }
  if (risk === 'Medium') {
    return 'bg-cyber-yellow/20 text-cyber-yellow border border-cyber-yellow/50 shadow-neon-yellow';
  }
  return 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30';
};