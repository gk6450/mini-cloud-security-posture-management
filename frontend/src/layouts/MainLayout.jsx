import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function MainLayout({ children, loading }) {
    return (
        <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto flex flex-col">
            {/* HEADER */}
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cyber-red/20 pb-8">
                <div>
                    <h1 className="text-6xl font-black italic tracking-tighter text-white flex items-center gap-4">   
                        <ShieldCheck size={48} className="text-cyber-red" />
                        <span>MINI<span className="text-cyber-red">CSPM</span></span>
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="h-1 w-8 bg-cyber-red animate-pulse" />
                        <p className="text-[10px] font-mono text-cyber-red/70 uppercase tracking-[0.4em]">
                            Shadow_Audit_Interface_v1.0
                        </p>
                    </div>
                </div>

                {/* HEADER TOP RIGHT */}
                <div className="text-right text-[11px] font-mono text-gray-600 hidden md:block uppercase leading-relaxed">
                    Signal_Strength: Optimized<br />
                    Buffer: {loading ? 'Processing...' : 'Ready'}<br />
                    Protocol: TLS_AES_256_GCM
                </div>
            </header>

            <main className="flex-1 relative">
                {children}
            </main>

            {/* FOOTER */}
            <footer className="mt-20 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-[11px] font-mono text-gray-700 uppercase tracking-widest gap-4">
                <p>&copy; 2026 GK_CYBER_SYSTEMS</p>
                <div className="flex gap-6">
                    <span>Encrypted_Terminal</span>
                    <span className="text-cyber-red animate-pulse font-bold">● LIVE_SERVER</span>
                </div>
            </footer>
        </div>
    );
}