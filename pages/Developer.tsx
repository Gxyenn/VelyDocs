import React from 'react';
import { Shield, Server, Clock, Code } from 'lucide-react';

const Developer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Developer Resources</h1>
        <p className="text-slate-400">Everything you need to know about integrating VelyDocs.</p>
      </div>

      <div className="space-y-12">
        {/* Section 1 */}
        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-6 pb-2 border-b border-slate-800">
            <Shield className="w-5 h-5 text-indigo-400" />
            Usage Policy
          </h2>
          <div className="prose prose-invert max-w-none text-slate-300">
            <p>
              VelyDocs is a free-to-use API, but resources are shared. To ensure stability for everyone:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <span className="text-white font-medium">Rate Limiting:</span> Please limit requests to 
                <code className="bg-slate-800 px-1 py-0.5 rounded mx-1 text-sm">60 requests/minute</code> per IP.
              </li>
              <li>
                <span className="text-white font-medium">Caching:</span> We implement a 5-minute server-side cache. 
                Frequent polling of the same endpoint will receive cached data.
              </li>
              <li>
                <span className="text-white font-medium">Attribution:</span> Not required, but appreciated.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-6 pb-2 border-b border-slate-800">
            <Server className="w-5 h-5 text-cyan-400" />
            Tech Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <Code className="w-4 h-4" /> Backend
              </h3>
              <p className="text-sm text-slate-400">
                Node.js running on Vercel Serverless Functions. Scrapers use <code>cheerio</code> for 
                high-performance HTML parsing without the overhead of a headless browser.
              </p>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Latency
              </h3>
              <p className="text-sm text-slate-400">
                Average response time is 200-800ms depending on the target source's response time.
                Cached responses are served in &lt;50ms.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-6 pb-2 border-b border-slate-800">
            <Code className="w-5 h-5 text-purple-400" />
            Integration Example
          </h2>
          <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-500">
              Typescript
            </div>
            <pre className="p-4 overflow-x-auto text-sm text-slate-300 font-mono">
{`interface Anime {
  title: string;
  episode: string;
  url: string;
}

async function getUpdates() {
  try {
    const res = await fetch('https://velydocs.vercel.app/api/winbu/ongoing');
    const json = await res.json();
    
    if (json.status === 'success') {
      return json.data as Anime[];
    }
  } catch (error) {
    console.error('API Error:', error);
  }
  return [];
}`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Developer;