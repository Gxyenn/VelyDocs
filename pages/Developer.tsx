import React from 'react';
import { Shield, Server, Clock, Code, Cpu } from 'lucide-react';

const Developer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 bg-black min-h-screen">
      <div className="mb-24 text-center">
        <div className="inline-block p-4 bg-zinc-900 rounded-3xl border border-zinc-800 mb-8">
          <Cpu className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-6xl font-black text-white mb-6 uppercase italic tracking-tighter">Developer Hub</h1>
        <div className="h-1.5 w-16 bg-white mx-auto mb-8"></div>
        <p className="text-zinc-600 font-mono text-[11px] tracking-[0.5em] uppercase font-black">Core Specifications & Policy</p>
      </div>

      <div className="space-y-24">
        {/* Rules Section */}
        <section>
          <h2 className="flex items-center gap-4 text-xl font-black text-white mb-12 pb-4 border-b border-zinc-900 uppercase italic tracking-tighter">
            <Shield className="w-6 h-6" />
            Operational Rules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <RuleItem 
              label="Rate Limits" 
              value="60 req/min" 
              desc="Traffic bursts are permitted. Sustained heavy volume triggers automatic IP cooling periods." 
            />
            <RuleItem 
              label="Persistence" 
              value="None" 
              desc="VelyDocs does not store source data. Every response is generated in real-time via live parsing." 
            />
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className="flex items-center gap-4 text-xl font-black text-white mb-12 pb-4 border-b border-zinc-900 uppercase italic tracking-tighter">
            <Server className="w-6 h-6" />
            Infrastructure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TechCard
              title="Native Parsing Core"
              desc="Our kernel uses high-speed HTML traversal algorithms to map unstructured DOM elements into unified JSON objects."
            />
            <TechCard
              title="Edge Distribution"
              desc="Compute nodes are deployed across 20+ global regions to minimize Round Trip Time (RTT) between source and client."
            />
          </div>
        </section>

        {/* Integration Example */}
        <section>
          <h2 className="flex items-center gap-4 text-xl font-black text-white mb-12 pb-4 border-b border-zinc-900 uppercase italic tracking-tighter">
            <Code className="w-6 h-6" />
            Integration
          </h2>
          <div className="bg-zinc-950 rounded-[2rem] border border-zinc-900 overflow-hidden shadow-2xl">
            <div className="px-8 py-5 bg-zinc-900/50 border-b border-zinc-900 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
              Typescript Implementation
            </div>
            <pre className="p-10 overflow-x-auto text-xs text-zinc-400 font-mono leading-relaxed bg-black selection:bg-zinc-800">
{`import axios from 'axios';

const PROBE_URL = 'https://api.velydocs.com/api/winbu/ongoing';

async function syncNode() {
  const { data } = await axios.get(PROBE_URL, {
    params: { page: 1 }
  });

  if (data.status === 'success') {
    return data.data; // Array<AnimeMetadata>
  }
}`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
};

const RuleItem: React.FC<{ label: string; value: string; desc: string }> = ({ label, value, desc }) => (
  <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl group hover:border-white transition-all duration-500">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">{label}</span>
      <span className="text-[10px] font-mono bg-white text-black px-3 py-1 rounded-lg font-black">{value}</span>
    </div>
    <p className="text-xs text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">{desc}</p>
  </div>
);

const TechCard: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="p-10 bg-zinc-950 border border-zinc-900 rounded-3xl">
    <h3 className="font-black text-white mb-4 text-sm uppercase italic tracking-tighter">{title}</h3>
    <p className="text-xs text-zinc-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default Developer;