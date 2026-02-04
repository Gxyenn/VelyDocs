import React, { useState } from 'react';

const BASE_API_URL = '/api';

const ENDPOINTS = [
  { path: '/winbu/ongoing?page=1', desc: 'Winbu ongoing anime', source: 'winbu' },
  { path: '/winbu/latest?page=1', desc: 'Winbu latest releases', source: 'winbu' },
  { path: '/samehadaku/ongoing?page=1', desc: 'Samehadaku ongoing', source: 'samehadaku' },
  { path: '/kuramanime/ongoing?page=1', desc: 'Kuramanime ongoing', source: 'kuramanime' },
  { path: '/otakudesu/ongoing?page=1', desc: 'Otakudesu ongoing', source: 'otakudesu' },
  { path: '/otakudesu/complete?page=1', desc: 'Otakudesu completed anime', source: 'otakudesu' },
];

const Docs: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');

  const handleTest = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (apiKey) headers['X-API-Key'] = apiKey;

      const res = await fetch(`${BASE_API_URL}${selectedEndpoint.path}`, { headers });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 bg-black">
      <h1 className="text-4xl font-black text-white mb-8 uppercase">API Documentation</h1>

      {/* API Key Input */}
      <div className="mb-8 p-6 bg-zinc-950 rounded-xl border border-zinc-900">
        <h3 className="text-sm font-bold text-white mb-4 uppercase">API Key (Optional)</h3>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter API key for higher rate limits"
          className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white font-mono"
        />
        <p className="text-xs text-zinc-600 mt-2">
          Default: 60 req/min | Premium: 300 req/min | Unlimited: No limit
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-bold text-zinc-500 uppercase mb-4">Endpoints</h3>
          {ENDPOINTS.map((endpoint) => (
            <button
              key={endpoint.path}
              onClick={() => {
                setSelectedEndpoint(endpoint);
                setResponse(null);
                setError(null);
              }}
              className={`w-full text-left p-4 rounded-lg text-sm font-bold transition-all ${
                selectedEndpoint.path === endpoint.path
                  ? 'bg-white text-black'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-900'
              }`}
            >
              <div className="uppercase mb-1">{endpoint.source}</div>
              <div className="text-xs opacity-60">{endpoint.path}</div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-zinc-950 rounded-xl border border-zinc-900 overflow-hidden">
            <div className="p-6 bg-zinc-900/30 border-b border-zinc-900">
              <code className="text-sm font-mono text-zinc-400 break-all">
                {BASE_API_URL}{selectedEndpoint.path}
              </code>
              <p className="text-zinc-500 text-sm mt-2">{selectedEndpoint.desc}</p>
            </div>

            <div className="p-6 space-y-6">
              <button
                onClick={handleTest}
                disabled={isLoading}
                className="w-full px-8 py-4 bg-white hover:bg-zinc-200 disabled:opacity-50 text-black text-sm font-black rounded-lg transition-all uppercase"
              >
                {isLoading ? 'Loading...' : 'Test Endpoint'}
              </button>

              {/* Response */}
              <div className="h-96 bg-black rounded-lg border border-zinc-900 overflow-auto p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-sm text-zinc-600">Loading...</span>
                  </div>
                ) : response ? (
                  <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                ) : error ? (
                  <div className="flex items-center justify-center h-full text-red-500">
                    <span className="text-sm">{error}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-700">
                    <span className="text-sm uppercase">Awaiting Request</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
