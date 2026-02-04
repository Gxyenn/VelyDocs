import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Book, Code2, Menu, X, Github, Heart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: <Terminal className="w-4 h-4" /> },
    { name: 'Documentation', path: '/docs', icon: <Book className="w-4 h-4" /> },
    { name: 'Developer', path: '/developer', icon: <Code2 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold font-mono">
                V
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                VelyDocs
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-indigo-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <a
                href="https://github.com/gxyenn"
                target="_blank"
                rel="noreferrer"
                className="ml-4 p-2 text-slate-400 hover:text-white transition-colors border border-slate-800 rounded-lg hover:bg-slate-900"
              >
                <Github className="w-5 h-5" />
              </a>
            </nav>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 animate-in slide-in-from-top duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-indigo-900/20 text-indigo-400'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content with padding to prevent footer overlap */}
      <main className="flex-1 pb-20 md:pb-32">
        {children}
      </main>

      {/* Footer yang telah diperbaiki agar tidak memotong */}
      <footer className="relative border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-sm py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center gap-8">
            {/* Attribution */}
            <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold tracking-wide">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
              <span>by</span>
              <span className="text-white bg-indigo-900/30 px-2 py-0.5 rounded border border-indigo-500/30">Gxyenn</span>
            </div>
            
            {/* Legal / Disclaimer */}
            <div className="space-y-4 max-w-2xl">
              <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed font-medium">
                VelyDocs is a research and educational project focused on web intelligence. 
                All metadata and images are retrieved in real-time and remain the property of their respective owners:
                <span className="block mt-1 text-slate-200 font-bold uppercase tracking-wider">(Winbu, Samehadaku, Kuramanime)</span>.
              </p>
              
              <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[10px] font-black text-indigo-400/70 uppercase tracking-[0.2em]">
                <span>Strictly No Data Storage</span>
                <span className="hidden sm:inline text-slate-800">•</span>
                <span>Live Scrape Technology</span>
                <span className="hidden sm:inline text-slate-800">•</span>
                <span>We Do Not Store Files</span>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center gap-6 w-full max-w-xs">
               <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-800"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"></div>
               <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-800"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;