import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Cpu, Zap, Activity, Box, Database, Shield } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-black min-h-screen">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1e1e21_0%,#000000_100%)] pointer-events-none opacity-50"></div>
      
      <div className="relative pt-20 pb-20 md:pt-32 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block mb-8 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Version 2.0 - Now Live</span>
          </div>
          
          <h1 className="text-5xl sm:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9] uppercase italic animate-in fade-in slide-in-from-bottom-4 duration-700">
            VELY <span className="text-zinc-800">DOCS</span> <br/> CORE <span className="text-zinc-800">ENGINE</span>
          </h1>
          
          <div className="max-w-2xl mx-auto space-y-6 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="h-1 w-20 bg-white mx-auto"></div>
            <p className="text-zinc-400 text-sm md:text-lg font-bold tracking-tight leading-relaxed px-4">
              VelyDocs v2.0 is a high-performance, stateless API kernel designed for real-time metadata extraction 
              from 4 major anime sources. Built for production ecosystems that demand zero-latency structured data.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            <Link
              to="/docs"
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-[11px] font-black rounded-xl text-black bg-white hover:bg-zinc-200 transition-all uppercase tracking-[0.2em] active:scale-95 shadow-xl"
            >
              Start Probe <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              to="/developer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 border border-zinc-800 text-[11px] font-black rounded-xl text-white bg-zinc-950 hover:bg-zinc-900 transition-all uppercase tracking-[0.2em]"
            >
              Dev Portal
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <div className="flex items-center gap-2">
              <Database size={14} className="text-white" />
              4 Sources
            </div>
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-white" />
              Real-time
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-white" />
              Rate Limited
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-zinc-900 bg-zinc-950/20 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">
                <Box size={12} /> Core Infrastructure
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                Stateless <br/> Live Processing
              </h2>
              <p className="text-zinc-500 text-sm md:text-base font-medium leading-relaxed">
                VelyDocs v2.0 bypasses traditional database latency by utilizing a native DOM-traversal kernel. 
                Every request triggers a live synchronization across distributed network nodes, 
                ensuring your application always renders the absolute latest available metadata.
              </p>
              <ul className="space-y-3 pt-4">
                <li className="flex items-center gap-3 text-[11px] font-bold text-zinc-300 uppercase tracking-tight">
                  <Zap size={14} className="text-white" /> Real-time Buffer Synchronization
                </li>
                <li className="flex items-center gap-3 text-[11px] font-bold text-zinc-300 uppercase tracking-tight">
                  <Activity size={14} className="text-white" /> Global Node Load Balancing
                </li>
                <li className="flex items-center gap-3 text-[11px] font-bold text-zinc-300 uppercase tracking-tight">
                  <Shield size={14} className="text-white" /> Tiered Rate Limiting (60-∞ req/min)
                </li>
              </ul>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="p-8 rounded-2xl bg-black border border-zinc-900 hover:border-zinc-700 transition-colors group">
                <Code2 className="mb-4 text-zinc-600 group-hover:text-white transition-colors" size={24} />
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Unified Schema</h3>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                  Payloads are strictly normalized to a single JSON specification regardless of the source network.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-black border border-zinc-900 hover:border-zinc-700 transition-colors group">
                <Cpu className="mb-4 text-zinc-600 group-hover:text-white transition-colors" size={24} />
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Stateless Core</h3>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                  No data persistence means no stale cache. Pure, live extraction on every execution cycle.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-black border border-zinc-900 hover:border-zinc-700 transition-colors group">
                <Database className="mb-4 text-zinc-600 group-hover:text-white transition-colors" size={24} />
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">4 Major Sources</h3>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                  Winbu, Samehadaku, Kuramanime, and Otakudesu unified in one powerful API.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-32 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-6 uppercase italic tracking-tighter">Ready for Integration?</h2>
          <p className="text-zinc-500 mb-10 font-bold text-sm">Experience the raw power of the VelyDocs v2.0 kernel today.</p>
          <Link
            to="/docs"
            className="inline-flex items-center justify-center px-12 py-5 text-[11px] font-black rounded-xl text-black bg-white hover:bg-zinc-200 transition-all uppercase tracking-[0.3em] shadow-2xl"
          >
            Open Documentation
          </Link>
      </div>
    </div>
  );
};

export default Landing;
