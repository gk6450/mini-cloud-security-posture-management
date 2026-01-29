import React, { useState, useMemo } from 'react';
import { ShieldCheck, Terminal, Filter, Search, ArrowUpDown, Power, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRiskColor } from '../utils/helpers';

export default function AssetTable({ resources, onInspect, onTerminate }) {
  const [filterRisk, setFilterRisk] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle Sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedData = useMemo(() => {
    let data = [...resources];

    // 1. Filter by Risk
    if (filterRisk) {
      data = data.filter(r => r.risk === 'High');
    }

    // 2. Filter by Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      data = data.filter(r => 
        r.name?.toLowerCase().includes(lowerQuery) ||
        r.id?.toLowerCase().includes(lowerQuery) ||
        r.type?.toLowerCase().includes(lowerQuery) ||
        r.status?.toLowerCase().includes(lowerQuery)
      );
    }

    // 3. Sort
    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [resources, filterRisk, searchQuery, sortConfig]);

  return (
    <div className="cyber-glass relative overflow-hidden group">
      <div className="scan-line opacity-20" />
      
      {/* Table Toolbar */}
      <div className="p-4 flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-white/5 bg-black/40 gap-4">
        <div className="flex items-center gap-4 w-full xl:w-auto">
          <h4 className="text-[11px] font-mono text-gray-500 uppercase tracking-[0.2em] whitespace-nowrap">
            Live_Resource_Matrix
          </h4>
          
          <div className="relative flex-1 xl:w-64">
             <Search className="absolute left-3 top-2 text-gray-600" size={14} />
             <input 
               type="text" 
               placeholder="SEARCH_IDENTIFIER..." 
               className="bg-black/50 border border-gray-800 text-white text-[11px] py-1.5 pl-9 pr-4 w-full focus:border-cyber-blue focus:outline-none font-mono uppercase"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
          <button 
            onClick={() => setFilterRisk(!filterRisk)}
            className={`text-[11px] font-bold px-4 py-1.5 border flex items-center gap-2 transition-all cursor-pointer ${
              filterRisk ? 'bg-cyber-red border-cyber-red text-white shadow-neon-red' : 'border-gray-700 text-gray-500 hover:border-gray-500'
            }`}
          >
            <Filter size={12} /> {filterRisk ? 'CRITICAL_ONLY' : 'ALL_RESOURCES'}
          </button>
          
          <button 
            onClick={onTerminate}
            className="text-[11px] font-bold px-4 py-1.5 border border-cyber-red/50 text-cyber-red hover:bg-cyber-red hover:text-white transition-all flex items-center gap-2 cursor-pointer"
          >
            <Power size={12} /> TERMINATE
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="text-[12px] font-mono text-cyber-blue/60 border-b border-white/5 uppercase select-none">
              {[
                { label: 'Classification', key: 'type' },
                { label: 'Identifier', key: 'name' },
                { label: 'Status', key: 'status' },
                { label: 'Security_Status', key: 'compliance' },
                { label: 'Risk_Weight', key: 'risk' },
                { label: 'Diagnostics', key: null }
              ].map((h, i) => (
                <th key={i} className="p-6 font-normal cursor-pointer hover:text-cyber-blue transition-colors" onClick={() => h.key && handleSort(h.key)}>
                  <div className="flex items-center gap-2">
                    {h.label}
                    {h.key && <ArrowUpDown size={10} className="opacity-50" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[13px]">
            {processedData.map((r, idx) => (
              <motion.tr 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
                key={r.id} className="hover:bg-cyber-red/5 transition-colors group/row"
              >
                <td className="p-6"><span className="text-cyber-blue/80 font-bold">[{r.type}]</span></td>
                <td className="p-6 text-white uppercase tracking-tighter truncate max-w-[200px]" title={r.name}>{r.name}</td>
                
                {/* STATUS COLUMN */}
                <td className="p-6">
                  {r.type === 'EC2' && r.status ? (
                    <span className={`flex items-center gap-2 ${r.status.toLowerCase() === 'running' ? 'text-cyber-green' : 'text-gray-500'}`}>
                       <span className={`w-2 h-2 rounded-full ${r.status.toLowerCase() === 'running' ? 'bg-cyber-green animate-pulse' : 'bg-gray-600'}`} />
                       {r.status}
                    </span>
                  ) : (
                    <span className="text-gray-700">-</span>
                  )}
                </td>

                <td className="p-6">
                  <div className={`flex items-center gap-2 ${r.compliance === 'Pass' ? 'text-cyber-green' : 'text-cyber-red'}`}>
                    {r.compliance === 'Pass' ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
                    {r.compliance}
                  </div>
                </td>
                <td className="p-6">
                  <span className={`px-2 py-1 text-[11px] font-bold ${getRiskColor(r.risk)}`}>
                    {r.risk}
                  </span>
                </td>
                <td className="p-6">
                  <button onClick={() => onInspect(r)} className="flex items-center gap-2 text-gray-500 hover:text-cyber-blue transition-colors cursor-pointer">
                    <Terminal size={14} /> SCAN_LOGS
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}