import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-black min-h-screen">
      <div className="relative pt-20 pb-20 md:pt-32 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block mb-8 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="text-xs font-bold text-white uppercase">Version 2.0 - Now Live</span>
          </div>
          
          <h1 className="text-5xl sm:text-8xl font-black text-white mb-6 uppercase">
            VelyDocs <br/> Core Engine
          </h1>
          
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-12">
            Production-ready, real-time anime scraping API with unified JSON responses. 
            Support for 4 major anime sources with 24 total endpoints.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/docs"
              className="px-10 py-4 text-sm font-black rounded-lg text-black bg-white hover:bg-zinc-200 transition-all uppercase"
            >
              Documentation →
            </Link>
            <Link
              to="/developer"
              className="px-10 py-4 text-sm font-black rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 transition-all uppercase border border-zinc-800"
            >
              Developer Hub
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-zinc-600">
            <div>4 Sources</div>
            <div>Real-time</div>
            <div>Rate Limited</div>
            <div>24 Endpoints</div>
          </div>
        </div>
      </div>

      <div className="border-y border-zinc-900 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-900">
              <h3 className="text-lg font-black text-white mb-4 uppercase">Unified Schema</h3>
              <p className="text-sm text-zinc-500">
                Consistent JSON responses across all sources for easy integration.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-900">
              <h3 className="text-lg font-black text-white mb-4 uppercase">Stateless Core</h3>
              <p className="text-sm text-zinc-500">
                No data persistence. Pure live extraction on every request.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-900">
              <h3 className="text-lg font-black text-white mb-4 uppercase">4 Major Sources</h3>
              <p className="text-sm text-zinc-500">
                Winbu, Samehadaku, Kuramanime, and Otakudesu unified in one API.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
