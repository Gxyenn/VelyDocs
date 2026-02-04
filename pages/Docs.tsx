import React, { useState } from 'react';
import { Play, Copy, Check, Loader2, AlertTriangle, ChevronRight, Code } from 'lucide-react';
import { EndpointDef, ApiResponse } from '../types';

const BASE_API_URL = '/api'; 

const ENDPOINTS: EndpointDef[] = [
  {
    method: 'GET',
    path: '/winbu/ongoing?page=1',
    description: 'Get ongoing anime releases with pagination support (use ?page=n)',
    source: 'winbu',
    type: 'ongoing',
  },
  {
    method: 'GET',
    path: '/samehadaku/ongoing?page=1',
    description: 'Get ongoing anime from Samehadaku with pagination support',
    source: 'samehadaku',
    type: 'ongoing',
  },
  {
    method: 'GET',
    path: '/kuramanime/ongoing?page=1',
    description: 'Get ongoing anime from Kuramanime with pagination support',
    source: 'kuramanime',
    type: 'ongoing',
  },
  {
    method: 'GET',
    path: '/samehadaku/anime/one-piece',
    description: 'Get full details and episode list for a specific anime slug',
    source: 'samehadaku',
    type: 'anime',
  }
];

const Docs: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(`${BASE_API_URL}${selectedEndpoint.path}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || "Request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fullUrl = `${window.location.origin}${BASE_API_URL}${selectedEndpoint.path}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Endpoints */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 pl-1">
              API Resources
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {ENDPOINTS.map((endpoint) => (
                <button
                  key={endpoint.path}
                  onClick={() => {
                    setSelectedEndpoint(endpoint);
                    setResponse(null);
                    setError(null);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono transition-all border ${
                    selectedEndpoint.path === endpoint.path
                      ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/50 shadow-lg shadow-indigo-500/5'
                      : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="font-bold text-emerald-500">GET</span>
                      {endpoint.source}
                    </span>
                    <ChevronRight className={`w-3 h-3 transition-transform ${selectedEndpoint.path === endpoint.path ? 'rotate-90' : ''}`} />
                  </div>
                  <div className="mt-1 opacity-60 overflow-hidden truncate">
                    {endpoint.path.split('?')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Doc Content */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            {/* Header Content */}
            <div className="p-6 md:p-8 bg-slate-900/30 border-b border-slate-800">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded-lg text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">
                  Active Endpoint
                </span>
                <h2 className="text-lg md:text-xl font-mono text-white tracking-tighter break-all">
                  {BASE_API_URL}{selectedEndpoint.path}
                </h2>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                {selectedEndpoint.description}
              </p>
            </div>

            {/* Test Playground */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                   <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Response</h3>
                </div>
                <button
                  onClick={handleTest}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-black rounded-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 uppercase tracking-widest"
                >
                  {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                  Execute Test
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800 font-mono text-xs group">
                  <span className="truncate flex-1 text-slate-400">
                    <span className="text-indigo-500/50">curl</span> {fullUrl}
                  </span>
                  <button onClick={() => copyToClipboard(fullUrl)} className="p-2 text-slate-500 hover:text-indigo-400 transition-colors">
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative w-full min-h-[300px] md:min-h-[400px] bg-slate-950 rounded-2xl border border-slate-800 p-6 overflow-auto font-mono text-[12px] md:text-[13px] leading-relaxed custom-scrollbar">
                    {isLoading ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/50 backdrop-blur-sm z-10 text-indigo-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scraping Source...</span>
                      </div>
                    ) : response ? (
                      <pre className="text-indigo-300"><code>{JSON.stringify(response, null, 2)}</code></pre>
                    ) : error ? (
                      <div className="flex flex-col items-center justify-center h-full text-rose-400 gap-3">
                        <AlertTriangle className="w-8 h-8 opacity-50" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-700">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Output Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pagination Card Info */}
          <div className="p-6 rounded-2xl bg-indigo-900/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start gap-4">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Pagination Support</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Metadata <code className="text-indigo-300 font-bold">pagination</code> sekarang dikembalikan secara otomatis untuk setiap daftar anime. 
                Gunakan parameter <code className="text-indigo-300 font-bold">?page=X</code> untuk navigasi halaman berikutnya/sebelumnya dengan data yang divalidasi langsung dari sumber.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CopyIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
  </svg>
);

export default Docs;