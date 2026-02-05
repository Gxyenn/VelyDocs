import React from 'react';

const Developer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 bg-black min-h-screen">
      <h1 className="text-5xl font-black text-white mb-6 uppercase">Developer Hub</h1>
      <p className="text-zinc-500 mb-12 text-lg">Technical specifications and integration guide</p>

      <div className="space-y-16">
        {/* API Authentication */}
        <section>
          <h2 className="text-2xl font-black text-white mb-8 uppercase">API Authentication</h2>
          <div className="space-y-6">
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4 uppercase">Rate Limit Tiers</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-black rounded-lg">
                  <div>
                    <div className="text-sm font-bold text-zinc-400 uppercase">Default</div>
                    <div className="text-xs text-zinc-600">No API key</div>
                  </div>
                  <div className="text-sm font-mono bg-zinc-900 text-white px-3 py-1 rounded">60 req/min</div>
                </div>
                <div className="flex justify-between items-center p-4 bg-black rounded-lg border border-emerald-900/30">
                  <div>
                    <div className="text-sm font-bold text-emerald-400 uppercase">Premium</div>
                    <div className="text-xs text-zinc-600">With API key</div>
                  </div>
                  <div className="text-sm font-mono bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded">300 req/min</div>
                </div>
                <div className="flex justify-between items-center p-4 bg-black rounded-lg border border-purple-900/30">
                  <div>
                    <div className="text-sm font-bold text-purple-400 uppercase">Unlimited</div>
                    <div className="text-xs text-zinc-600">Special agent keys</div>
                  </div>
                  <div className="text-sm font-mono bg-purple-900/30 text-purple-400 px-3 py-1 rounded">No Limit</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Available Sources */}
        <section>
          <h2 className="text-2xl font-black text-white mb-8 uppercase">Available Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl">
              <h3 className="font-bold text-white mb-2 uppercase">Winbu</h3>
              <p className="text-sm text-zinc-500 mb-4">7 endpoints</p>
              <div className="flex flex-wrap gap-2">
                {['index', 'anime', 'episode', 'search', 'genres', 'schedule', 'movies'].map(e => (
                  <span key={e} className="text-xs font-mono bg-zinc-900 text-zinc-400 px-2 py-1 rounded">{e}</span>
                ))}
              </div>
            </div>
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl">
              <h3 className="font-bold text-white mb-2 uppercase">Samehadaku</h3>
              <p className="text-sm text-zinc-500 mb-4">5 endpoints</p>
              <div className="flex flex-wrap gap-2">
                {['index', 'anime', 'episode', 'search', 'batch'].map(e => (
                  <span key={e} className="text-xs font-mono bg-zinc-900 text-zinc-400 px-2 py-1 rounded">{e}</span>
                ))}
              </div>
            </div>
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl">
              <h3 className="font-bold text-white mb-2 uppercase">Kuramanime</h3>
              <p className="text-sm text-zinc-500 mb-4">6 endpoints</p>
              <div className="flex flex-wrap gap-2">
                {['index', 'anime', 'episode', 'search', 'schedule', 'genres'].map(e => (
                  <span key={e} className="text-xs font-mono bg-zinc-900 text-zinc-400 px-2 py-1 rounded">{e}</span>
                ))}
              </div>
            </div>
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl">
              <h3 className="font-bold text-white mb-2 uppercase">Otakudesu</h3>
              <p className="text-sm text-zinc-500 mb-4">9 endpoints</p>
              <div className="flex flex-wrap gap-2">
                {['index', 'ongoing', 'completed', 'schedule', 'genres', 'genre', 'anime', 'episode', 'watch'].map(e => (
                  <span key={e} className="text-xs font-mono bg-zinc-900 text-zinc-400 px-2 py-1 rounded">{e}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Integration Example */}
        <section>
          <h2 className="text-2xl font-black text-white mb-8 uppercase">Integration</h2>
          <div className="bg-zinc-950 rounded-xl border border-zinc-900 overflow-hidden">
            <div className="px-6 py-4 bg-zinc-900/50 border-b border-zinc-900">
              <span className="text-xs font-bold uppercase text-zinc-500">TypeScript Example</span>
            </div>
            <pre className="p-6 overflow-x-auto text-sm text-zinc-400 font-mono">
{`const API_BASE = 'https://velydocs.vercel.app/api';
const API_KEY = 'YOUR_API_KEY'; // Required for otakudesu endpoints

async function getList(source, page = 1) {
  const headers = {};
  if (API_KEY) headers['X-API-Key'] = API_KEY;
  
  const res = await fetch(
    \`\${API_BASE}/\${source}?page=\${page}\`, 
    { headers }
  );
  
  return await res.json();
}

// Usage
const data = await getList('winbu', 1);
console.log(data);`}
            </pre>
          </div>
        </section>


        {/* Curl Examples */}
        <section>
          <h2 className="text-2xl font-black text-white mb-8 uppercase">Quick cURL</h2>
          <div className="space-y-4">
            <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg">
              <div className="text-xs text-zinc-500 mb-2 uppercase">Base Endpoint</div>
              <code className="block text-sm font-mono text-zinc-300 break-all">curl "https://velydocs.vercel.app/api/winbu"</code>
            </div>
            <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg">
              <div className="text-xs text-zinc-500 mb-2 uppercase">Search Endpoint</div>
              <code className="block text-sm font-mono text-zinc-300 break-all">curl "https://velydocs.vercel.app/api/animeindo/search?q=naruto"</code>
            </div>
            <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg">
              <div className="text-xs text-zinc-500 mb-2 uppercase">Otakudesu with API Key</div>
              <code className="block text-sm font-mono text-zinc-300 break-all">curl -H "X-API-Key: velydocs_free_1" "https://velydocs.vercel.app/api/otakudesu/ongoing?page=1"</code>
            </div>
          </div>
        </section>

        {/* Endpoint Patterns */}
        <section>
          <h2 className="text-2xl font-black text-white mb-8 uppercase">Endpoint Patterns</h2>
          <div className="space-y-4">
            {[
              { pattern: '/api/:source', desc: 'Homepage/latest list untuk source terkait' },
              { pattern: '/api/:source/search?q=:query', desc: 'Search anime' },
              { pattern: '/api/:source/anime/:slug', desc: 'Get anime details' },
              { pattern: '/api/:source/episode/:slug', desc: 'Get episode details / stream list' },
              { pattern: '/api/:source/genres', desc: 'List available genres' },
              { pattern: '/api/otakudesu/completed?page=:page', desc: 'List completed anime (otakudesu)' },
              { pattern: '/api/winbu/movies', desc: 'List movie releases (winbu)' },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg">
                <div className="font-mono text-sm text-white mb-2">{item.pattern}</div>
                <div className="text-xs text-zinc-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Developer;
