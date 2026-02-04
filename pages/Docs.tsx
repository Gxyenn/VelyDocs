import React, { useState } from 'react';
import { Play, Copy, Check, Loader2, AlertTriangle, Terminal, Globe, List, Info, Zap, Key } from 'lucide-react';
import { EndpointDef, ApiResponse } from '../types';

const BASE_API_URL = '/api'; 

const ENDPOINTS: EndpointDef[] = [
  // WINBU
  { method: 'GET', path: '/winbu/ongoing?page=1', description: 'Latest ongoing releases via Winbu Core Node.', source: 'winbu', type: 'ongoing' },
  { method: 'GET', path: '/winbu/latest?page=1', description: 'Recent update stream from the decentralized Winbu network.', source: 'winbu', type: 'latest' },
  { method: 'GET', path: '/winbu/anime/one-piece', description: 'Deep metadata analysis using a unique anime slug.', source: 'winbu', type: 'anime' },
  { method: 'GET', path: '/winbu/search?q=naruto&page=1', description: 'Search anime across Winbu database.', source: 'winbu', type: 'search' },
  { method: 'GET', path: '/winbu/genre/action?page=1', description: 'Filter anime by genre in Winbu network.', source: 'winbu', type: 'genre' },
  
  // SAMEHADAKU
  { method: 'GET', path: '/samehadaku/ongoing?page=1', description: 'Series stream from the Samehadaku infrastructure.', source: 'samehadaku', type: 'ongoing' },
  { method: 'GET', path: '/samehadaku/anime/one-piece', description: 'Detailed anime information from Samehadaku.', source: 'samehadaku', type: 'anime' },
  { method: 'GET', path: '/samehadaku/search?q=bleach', description: 'Search anime in Samehadaku database.', source: 'samehadaku', type: 'search' },
  { method: 'GET', path: '/samehadaku/schedule', description: 'Weekly release schedule from Samehadaku.', source: 'samehadaku', type: 'schedule' },
  { method: 'GET', path: '/samehadaku/genre/action?page=1', description: 'Browse anime by genre in Samehadaku.', source: 'samehadaku', type: 'genre' },
  { method: 'GET', path: '/samehadaku/batch?page=1', description: 'Complete batch downloads from Samehadaku.', source: 'samehadaku', type: 'batch' },
  
  // KURAMANIME
  { method: 'GET', path: '/kuramanime/ongoing?page=1', description: 'Stream ongoing content from the Kuramanime node.', source: 'kuramanime', type: 'ongoing' },
  { method: 'GET', path: '/kuramanime/latest?page=1', description: 'Latest releases from Kuramanime network.', source: 'kuramanime', type: 'latest' },
  { method: 'GET', path: '/kuramanime/anime/jujutsu-kaisen', description: 'Anime details from Kuramanime database.', source: 'kuramanime', type: 'anime' },
  { method: 'GET', path: '/kuramanime/search?q=demon', description: 'Search functionality in Kuramanime.', source: 'kuramanime', type: 'search' },
  { method: 'GET', path: '/kuramanime/schedule', description: 'Release schedule from Kuramanime.', source: 'kuramanime', type: 'schedule' },
  { method: 'GET', path: '/kuramanime/genre/shounen?page=1', description: 'Genre-based filtering in Kuramanime.', source: 'kuramanime', type: 'genre' },
  
  // OTAKUDESU
  { method: 'GET', path: '/otakudesu/ongoing?page=1', description: 'Ongoing anime from Otakudesu network.', source: 'otakudesu', type: 'ongoing' },
  { method: 'GET', path: '/otakudesu/complete?page=1', description: 'Completed anime series from Otakudesu.', source: 'otakudesu', type: 'complete' },
  { method: 'GET', path: '/otakudesu/anime/one-piece', description: 'Comprehensive anime data from Otakudesu.', source: 'otakudesu', type: 'anime' },
  { method: 'GET', path: '/otakudesu/search?q=attack', description: 'Search across Otakudesu collection.', source: 'otakudesu', type: 'search' },
  { method: 'GET', path: '/otakudesu/schedule', description: 'Weekly anime schedule from Otakudesu.', source: 'otakudesu', type: 'schedule' },
  { method: 'GET', path: '/otakudesu/genre/fantasy?page=1', description: 'Genre exploration in Otakudesu.', source: 'otakudesu', type: 'genre' },
  { method: 'GET', path: '/otakudesu/batch?page=1', description: 'Batch download links from Otakudesu.', source: 'otakudesu', type: 'batch' },
];

const Docs: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (apiKey) {
        headers['X-API-Key'] = apiKey;
      }

      const res = await fetch(`${BASE_API_URL}${selectedEndpoint.path}`, { headers });
      
      // Get rate limit headers
      const rateLimitRemaining = res.headers.get('X-RateLimit-Remaining');
      const rateLimitReset = res.headers.get('X-RateLimit-Reset');
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      
      // Add rate limit info to response
      if (rateLimitRemaining) {
        data.rateLimit = {
          remaining: parseInt(rateLimitRemaining),
          reset: rateLimitReset
        };
      }
      
      setResponse(data);
    } catch (err: any) {
      setError(err.message || "Target node unreachable.");
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

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'ongoing': return 'text-emerald-400 bg-emerald-400/5 border-emerald-500/20';
      case 'latest': return 'text-blue-400 bg-blue-400/5 border-blue-500/20';
      case 'anime': return 'text-amber-400 bg-amber-400/5 border-amber-500/20';
      case 'search': return 'text-purple-400 bg-purple-400/5 border-purple-500/20';
      case 'schedule': return 'text-cyan-400 bg-cyan-400/5 border-cyan-500/20';
      case 'genre': return 'text-pink-400 bg-pink-400/5 border-pink-500/20';
      case 'complete': return 'text-green-400 bg-green-400/5 border-green-500/20';
      case 'batch': return 'text-orange-400 bg-orange-400/5 border-orange-500/20';
      default: return 'text-zinc-500 bg-zinc-500/5 border-zinc-500/20';
    }
  };

  const groupedEndpoints = ENDPOINTS.reduce((acc, endpoint) => {
    if (!acc[endpoint.source]) acc[endpoint.source] = [];
    acc[endpoint.source].push(endpoint);
    return acc;
  }, {} as Record<string, EndpointDef[]>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 bg-black">
      {/* API Key Section */}
      <div className="mb-8 p-6 bg-zinc-950 rounded-2xl border border-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Key size={20} className="text-zinc-500" />
            <h3 className="text-[11px] font-black text-white uppercase tracking-widest">API Authentication</h3>
          </div>
          <button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            {showApiKeyInput ? 'Hide' : 'Show'}
          </button>
        </div>
        
        {showApiKeyInput && (
          <div className="space-y-3">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key (optional)"
              className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white text-sm font-mono focus:border-white focus:outline-none transition-colors"
            />
            <p className="text-[10px] text-zinc-600 font-medium">
              Optional: Use API key for higher rate limits. Default: 60 req/min | Premium: 300 req/min | Unlimited: No limit
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-8 pl-1 flex items-center gap-2">
              <Globe size={14} /> Registry Nodes
            </h3>
            
            <div className="space-y-6">
              {Object.entries(groupedEndpoints).map(([source, endpoints]) => (
                <div key={source} className="space-y-3">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] px-1 italic">
                    {source}_network
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {endpoints.map((endpoint) => (
                      <button
                        key={endpoint.path}
                        onClick={() => {
                          setSelectedEndpoint(endpoint);
                          setResponse(null);
                          setError(null);
                        }}
                        className={`w-full text-left p-4 rounded-xl text-[10px] font-black transition-all border ${
                          selectedEndpoint.path === endpoint.path
                            ? 'bg-white text-black border-white shadow-xl scale-[1.01]'
                            : 'bg-zinc-950 text-zinc-500 hover:text-white border-zinc-900 hover:border-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="uppercase tracking-widest truncate">{endpoint.type}</span>
                          <div className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border shrink-0 ${
                            selectedEndpoint.path === endpoint.path ? 'bg-black text-white border-black' : getTypeStyle(endpoint.type)
                          }`}>
                            GET
                          </div>
                        </div>
                        <div className={`text-[9px] font-mono tracking-tighter truncate opacity-40 ${selectedEndpoint.path === endpoint.path ? 'text-black opacity-60' : ''}`}>
                          {endpoint.path}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Console Workspace */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#080808] rounded-3xl border border-zinc-900 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-6 md:p-10 bg-zinc-900/30 border-b border-zinc-900">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest ${getTypeStyle(selectedEndpoint.type)}`}>
                  {selectedEndpoint.type}
                </span>
                <div className="flex-1 min-w-[150px]">
                   <code className="text-[10px] font-mono text-zinc-400 bg-black/50 px-3 py-2 rounded-lg border border-zinc-800 block truncate">
                    {BASE_API_URL}{selectedEndpoint.path}
                  </code>
                </div>
              </div>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-bold italic opacity-80">
                {selectedEndpoint.description}
              </p>
            </div>

            {/* Actions */}
            <div className="p-6 md:p-10 space-y-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                   <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">Console Output</h3>
                </div>
                <button
                  onClick={handleTest}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-4 bg-white hover:bg-zinc-200 disabled:opacity-50 text-black text-[10px] font-black rounded-xl transition-all uppercase tracking-[0.2em] active:scale-95 shadow-xl"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} className="fill-current" />}
                  Execute Probe
                </button>
              </div>

              {/* cURL */}
              <div className="flex items-center gap-3 p-4 bg-black rounded-xl border border-zinc-900 font-mono text-[10px] relative overflow-hidden group">
                <span className="truncate flex-1 text-zinc-500 font-bold">
                  <span className="text-white font-black">$ cURL</span> -X GET {apiKey && '-H "X-API-Key: ***"'} "{fullUrl}"
                </span>
                <button onClick={() => copyToClipboard(fullUrl)} className="shrink-0 p-2 text-zinc-400 hover:text-white transition-all bg-zinc-900 rounded-lg border border-zinc-800">
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Response Block */}
              <div className="relative">
                <div className="w-full h-[400px] md:h-[550px] bg-[#020202] rounded-2xl border border-zinc-900 overflow-hidden relative shadow-inner">
                  <div className="absolute inset-0 overflow-auto p-6 md:p-8 font-mono text-[12px] leading-relaxed text-zinc-300">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center h-full gap-4">
                        <Loader2 size={32} className="animate-spin opacity-30" />
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing...</span>
                      </div>
                    ) : response ? (
                      <pre className="whitespace-pre-wrap break-all md:break-normal"><code>{JSON.stringify(response, null, 2)}</code></pre>
                    ) : error ? (
                      <div className="flex flex-col items-center justify-center h-full text-zinc-700 gap-6">
                        <AlertTriangle size={32} className="opacity-20 text-rose-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-center">{error}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-zinc-900 space-y-4 py-20 select-none">
                        <Terminal size={48} className="opacity-5" />
                        <span className="text-[9px] font-black uppercase tracking-[0.8em] opacity-20">Node Standby</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-8 rounded-2xl bg-zinc-950/50 border border-zinc-900 flex items-start gap-4">
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white shrink-0">
                <List size={18} />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1 italic">Stream Paging</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-bold tracking-tight">
                  Extend with <code className="text-white px-1">?page=X</code> to fetch deeper node records.
                </p>
              </div>
            </div>
            <div className="p-8 rounded-2xl bg-zinc-950/50 border border-zinc-900 flex items-start gap-4">
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white shrink-0">
                <Zap size={18} />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1 italic">Vely Core</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-bold tracking-tight">
                  Normalized JSON spec for 100% production compatibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
