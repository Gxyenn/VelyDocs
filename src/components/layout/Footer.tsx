import { Code2 } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">Vely</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Anime API documentation powered by multiple sources. 
              Scrape, search, and access anime data with ease.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Links</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="transition-colors hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/docs" className="transition-colors hover:text-foreground">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/sources" className="transition-colors hover:text-foreground">
                  Data Sources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Developer</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="text-foreground">Gxyenn</span>
              </li>
              <li>Rate Limit: 70/min</li>
              <li>Version 1.0.0</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Vely-Docs. Built with ❤️ by Gxyenn</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
