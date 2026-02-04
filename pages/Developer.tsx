import React from 'react';
import { Shield, Server, Clock, Code, Cpu, Key, Zap, Database } from 'lucide-react';

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
        {/* API Authentication */}
        <section>
          <h2 className="flex items-center gap-4 text-xl font-black text-white mb-12 pb-4 border-b border-zinc-900 uppercase italic tracking-tighter">
            <Key className="w-6 h-6" />
            API Authentication
          </h2>
          <div className="space-y-8">
            <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl">
              <h3 className="text-sm font-black text-white mb-4 uppercase italic tracking-tighter">Rate Limit Tiers</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-zinc-900">
                  <div>
                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Default</div>
                    <div className="text-xs text-zinc-500 font-medium">No API key required</div>
                  </div>
                  <div className="text-[10px] font-mono bg-zinc-900 text-white px-3 py-1 rounded-lg font-black">60 req/min</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-emerald-900/30">
                  <div>
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Premium</div>
                    <div className="text-xs text-zinc-500 font-medium">With valid API key</div>
                  </div>
                  <div className="text-[10px] font-mono bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-lg font-black border border-emerald-500/20">300 req/min</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-purple-900/30">
                  <div>
                    <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Unlimited</div>
                    <div className="text-xs text-zinc-500 font-medium">Special agent keys</div>
                  </div>
                  <div className="text-[10px] font-mono bg-purple-900/30 text-purple-400 px-3 py-1 rounded-lg font-black border border-purple-500/20">No Limit</div>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl">
              <h3 className="text-sm font-black text-white mb-4 uppercase italic tracking-tighter">Usage</h3>
              <div className="bg-black rounded-xl border border-zinc-900 overflow-hidden">
                <div className="px-6 py-4 bg-zinc-900/50 border-b border-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Header Authentication
                </div>
                <pre className="p-6 text-xs text-zinc-400 font-mono leading-relaxed overflow-x-auto">
{`curl -X GET "https://api.velydocs.com/api/winbu/ongoing" \\
  -H "X-API-Key: YOUR_API_KEY_HERE"`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Available Sources */}
        <section>
          <h2 className="flex items-center gap-4 text-xl font-black text-white mb-12 pb-4 border-b border-zinc-900 uppercase italic tracking-tighter">
            <Database className="w-6 h-6" />
            Available Sources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SourceCard 
              name="Winbu" 
              endpoints={['ongoing', 'latest', 'anime', 'search', 'genre']}
              baseUrl="winbu.net"
            />
            <SourceCard 
              name="Samehadaku" 
              endpoints={['ongoing', 'anime', 'search', 'schedule', 'genre', 'batch']}
              baseUrl="samehadaku.how"
            />
            <SourceCard 
              name="Kuramanime" 
              endpoints={['ongoing', 'latest', 'anime', 'search', 'schedule', 'genre']}
              baseUrl="kuramanime.tel"
            />
            <SourceCard 
              name="Otakudesu" 
              endpoints={['ongoing', 'complete', 'anime', 'search', 'schedule', 'genre', 'batch']}
              baseUrl="otakudesu.cloud"
            />
          </div>
        </section>

        {/* Rules Section */}
        <section>
          <h2 className="flex items-center gap-4 text-xl font-black text-white mb-12 pb-4 border-b border-zinc-900 uppercase italic tracking-tighter">
            <Shield className="w-6 h-6" />
            Operational Rules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <RuleItem 
              label="Response Time" 
              value="< 2s avg" 
              desc="Real-time scraping ensures sub-2-second latency across all network nodes for optimal performance." 
            />
            <RuleItem 
              label="Persistence" 
              value="None" 
              desc="VelyDocs does not store source data. Every response is generated in real-time via live parsing." 
            />
            <RuleItem 
              label="Cache Policy" 
              value="CDN 60s" 
              desc="Responses are cached at edge nodes for 60 seconds to balance freshness with performance." 
            />
            <RuleItem 
              label="Error Handling" 
              value="Graceful" 
              desc="Failed scrapes return structured error responses with detailed messages for debugging." 
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
            <TechCard
              title="Rate Limiting"
              desc="Intelligent rate limiting with tiered access ensures fair usage while protecting against abuse and overload."
            />
            <TechCard
              title="Auto Failover"
              desc="Multi-source redundancy automatically switches to alternative endpoints if primary sources become unavailable."
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

const API_BASE = 'https://api.velydocs.com/api';
const API_KEY = 'YOUR_API_KEY'; // Optional

interface VelyDocsConfig {
  apiKey?: string;
}

class VelyDocsClient {
  private config: VelyDocsConfig;

  constructor(config: VelyDocsConfig = {}) {
    this.config = config;
  }

  private async request(endpoint: string) {
    const headers = this.config.apiKey 
      ? { 'X-API-Key': this.config.apiKey }
      : {};

    const { data } = await axios.get(\`\${API_BASE}\${endpoint}\`, { 
      headers 
    });
    
    return data;
  }

  // Get ongoing anime from any source
  async getOngoing(source: 'winbu' | 'samehadaku' | 'kuramanime' | 'otakudesu', page = 1) {
    return this.request(\`/\${source}/ongoing?page=\${page}\`);
  }

  // Search anime
  async search(source: string, query: string) {
    return this.request(\`/\${source}/search?q=\${encodeURIComponent(query)}\`);
  }

  // Get anime details
  async getAnime(source: string, slug: string) {
    return this.request(\`/\${source}/anime/\${slug}\`);
  }

  // Get schedule
  async getSchedule(source: 'samehadaku' | 'kuramanime' | 'otakudesu') {
    return this.request(\`/\${source}/schedule\`);
  }
}

// Usage
const client = new VelyDocsClient({ apiKey: API_KEY });

async function main() {
  // Fetch ongoing anime
  const ongoing = await client.getOngoing('winbu', 1);
  console.log('Ongoing:', ongoing.data);

  // Search anime
  const results = await client.search('otakudesu', 'naruto');
  console.log('Search:', results.data);

  // Get details
  const anime = await client.getAnime('samehadaku', 'one-piece');
  console.log('Anime:', anime);
}

main();`}
            </pre>
          </div>
        </section>

        {/* Endpoint Patterns */}
        <section>
          <h2 className="flex items-center gap-4 text-xl font-black text-white mb-12 pb-4 border-b border-zinc-900 uppercase italic tracking-tighter">
            <Zap className="w-6 h-6" />
            Endpoint Patterns
          </h2>
          <div className="space-y-4">
            <EndpointPattern 
              pattern="/api/:source/ongoing?page=:page"
              description="List ongoing anime with pagination"
              example="/api/winbu/ongoing?page=1"
            />
            <EndpointPattern 
              pattern="/api/:source/latest?page=:page"
              description="Latest anime releases with pagination"
              example="/api/kuramanime/latest?page=2"
            />
            <EndpointPattern 
              pattern="/api/:source/anime/:slug"
              description="Detailed anime information by slug"
              example="/api/otakudesu/anime/jujutsu-kaisen"
            />
            <EndpointPattern 
              pattern="/api/:source/search?q=:query"
              description="Search anime by keyword"
              example="/api/samehadaku/search?q=demon+slayer"
            />
            <EndpointPattern 
              pattern="/api/:source/genre/:genre?page=:page"
              description="Filter anime by genre"
              example="/api/winbu/genre/action?page=1"
            />
            <EndpointPattern 
              pattern="/api/:source/schedule"
              description="Weekly anime release schedule"
              example="/api/otakudesu/schedule"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const SourceCard: React.FC<{ name: string; endpoints: string[]; baseUrl: string }> = ({ name, endpoints, baseUrl }) => (
  <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl group hover:border-white transition-all duration-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-black text-white text-sm uppercase italic tracking-tighter">{name}</h3>
      <div className="text-[8px] font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded">{baseUrl}</div>
    </div>
    <div className="flex flex-wrap gap-2">
      {endpoints.map(endpoint => (
        <span key={endpoint} className="text-[9px] font-black uppercase tracking-wider text-zinc-600 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
          {endpoint}
        </span>
      ))}
    </div>
  </div>
);

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

const EndpointPattern: React.FC<{ pattern: string; description: string; example: string }> = ({ pattern, description, example }) => (
  <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl hover:border-zinc-800 transition-colors">
    <div className="font-mono text-[11px] text-white font-black mb-2 tracking-tight">{pattern}</div>
    <div className="text-[10px] text-zinc-500 font-medium mb-3">{description}</div>
    <div className="font-mono text-[10px] text-zinc-600 bg-black px-3 py-2 rounded-lg border border-zinc-900 truncate">
      {example}
    </div>
  </div>
);

export default Developer;
