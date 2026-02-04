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
    { name: 'Home', path: '/', icon: <Terminal className="w-3.5 h-3.5" /> },
    { name: 'Documentation', path: '/docs', icon: <Book className="w-3.5 h-3.5" /> },
    { name: 'Developer', path: '/developer', icon: <Code2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-white selection:text-black font-sans">
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="overflow-hidden rounded-md border border-zinc-800 bg-zinc-900 flex items-center justify-center p-0.5">
                <img 
                  src="https://files.catbox.moe/gmwn6y.gif" 
                  alt="VelyDocs Logo" 
                  className="h-8 sm:h-9 w-auto object-contain rounded-sm"
                />
              </div>
              <div className="flex flex-col -space-y-0.5">
                <span className="text-base sm:text-lg font-black tracking-tighter uppercase italic leading-none">
                  VelyDocs
                </span>
                <span className="text-[7px] font-bold text-zinc-600 tracking-[0.2em] uppercase hidden xs:block">v2.0 CORE ENGINE</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative py-1.5 ${
                    isActive(link.path) ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white rounded-full"></span>
                  )}
                </Link>
              ))}
              <div className="h-4 w-px bg-zinc-800 mx-1"></div>
              <a
                href="https://github.com/gxyenn"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-white transition-all p-1.5 hover:bg-zinc-900 rounded-lg"
              >
                <Github size={18} />
              </a>
            </nav>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white border border-zinc-800 rounded-lg bg-zinc-900/50"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-900 bg-black p-3 space-y-1.5 animate-in slide-in-from-top duration-200 shadow-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  isActive(link.path) 
                    ? 'bg-white text-black' 
                    : 'text-zinc-400 bg-zinc-950 border border-zinc-900'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-zinc-900 bg-black py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="p-0.5 bg-zinc-900 rounded border border-zinc-800">
                <img 
                    src="https://files.catbox.moe/gmwn6y.gif" 
                    alt="Footer Logo" 
                    className="h-6 w-auto grayscale opacity-40 hover:opacity-100 transition-opacity"
                  />
              </div>
              <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.2em]">
                VelyDocs v2.0 Production Kernel
              </p>
            </div>
            
            <div className="w-full pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-zinc-500 text-[9px] font-mono font-bold uppercase">
                <Heart className="w-3 h-3 text-white fill-white" />
                <span>© {new Date().getFullYear()} VelyDocs Core</span>
              </div>
              <div className="flex gap-6 text-[9px] font-mono text-zinc-600 font-bold uppercase">
                <span>Kernel v2.0</span>
                <span>Dev: Gxyenn</span>
              </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
