
import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Zap, ShieldCheck, ArrowRight, Github, ExternalLink, Globe, Layers, Copy } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-slate-950">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full"></div>
      <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-cyan-600/10 blur-[100px] pointer-events-none rounded-full"></div>

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-indigo-300 text-xs font-bold mb-8 shadow-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="tracking-widest uppercase">Production Ready v1.2.0</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-8 leading-tight">
            Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Anime Intelligence</span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl text-slate-400 mb-12 leading-relaxed">
            The world's most reliable anime API provider. Stop using static databases. 
            VelyDocs scrapes live data from premium sources with a unified JSON schema.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/docs"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-[0_0_25px_rgba(79,70,229,0.3)] active:scale-95"
            >
              Start Building <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/developer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-slate-800 text-base font-bold rounded-xl text-slate-300 bg-slate-900/50 hover:bg-slate-900 transition-all hover:border-slate-700"
            >
              API Reference
            </Link>
          </div>
        </div>
      </div>

      {/* Trust/Source badges */}
      <div className="max-w-7xl mx-auto px-4 pb-24 text-center">
         <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-8">Powering data from</p>
         <div className="flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <SourceBadge name="Winbu" />
            <SourceBadge name="Samehadaku" />
            <SourceBadge name="Kuramanime" />
         </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 relative">
        <div className="absolute inset-0 bg-slate-900/40 border-y border-slate-800/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-amber-400" />}
              title="Live Scraping Engine"
              description="Our high-performance backend performs real-time DOM traversal to ensure you always get the latest episodes the second they drop."
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6 text-indigo-400" />}
              title="Normalized Schema"
              description="Switch sources effortlessly. We transform messy HTML into a clean, predictable, and strictly-typed JSON structure."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-cyan-400" />}
              title="Global Availability"
              description="Deployed on edge networks to provide low-latency responses worldwide. 99.9% uptime for the most critical anime apps."
            />
          </div>
        </div>
      </div>

      {/* Code Snippet Preview */}
      <div className="py-32 max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
           <h2 className="text-3xl font-bold text-white mb-4">Integrate in Seconds</h2>
           <p className="text-slate-400">Pure JavaScript, no extra libraries required.</p>
        </div>
        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 ring-1 ring-white/5">
          <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/30 border border-rose-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50"></div>
              <span className="ml-3 text-[11px] text-slate-500 font-mono tracking-widest uppercase">fetch_updates.ts</span>
            </div>
            <button className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest">
               <Copy className="w-3 h-3" /> Copy Code
            </button>
          </div>
          <div className="p-8 overflow-x-auto bg-slate-900/50">
            <pre className="text-sm font-mono leading-relaxed">
              <code className="text-slate-300">
{`const API_KEY = process.env.VELY_KEY; // Optional
const SOURCE = 'samehadaku';

// Get the latest ongoing releases
const response = await fetch(\`https://vely.api/v1/\${SOURCE}/ongoing\`);
const { data, status } = await response.json();

if (status === 'success') {
  data.map(anime => ({
    title: anime.title,
    ep: anime.episode,
    img: anime.poster
  }));
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const SourceBadge: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex items-center gap-2 font-black text-xl text-white tracking-tighter italic">
    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
    {name}
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className="group p-8 rounded-2xl bg-slate-950 border border-slate-800/50 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5">
    <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
  </div>
);

export default Landing;
