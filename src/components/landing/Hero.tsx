import { ArrowRight, Zap, Shield, Globe, Database, Code2, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { sources, getAllEndpoints } from "@/data/endpoints";

const Hero = () => {
  const totalEndpoints = getAllEndpoints().length;

  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 md:mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse-soft" />
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">{totalEndpoints} endpoints</span> dari {sources.length} sumber
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mb-4 md:mb-6 text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="block">Vely API</span>
            <span className="block bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
              Dokumentasi
            </span>
          </h1>

          <p className="mx-auto mb-8 md:mb-10 max-w-2xl text-base md:text-lg text-muted-foreground">
            REST API lengkap untuk data anime dari berbagai sumber. 
            Otakudesu, Samehadaku, Kuramanime, dan {sources.length - 3} sumber lainnya dalam satu API.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="group w-full sm:w-auto">
              <Link to="/docs" className="flex items-center gap-2">
                Lihat Dokumentasi
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/sources">Lihat Sumber</Link>
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <div className="flex items-center gap-2 rounded-full bg-card border border-border px-3 md:px-4 py-2 text-xs md:text-sm shadow-sm">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span>Fast Response</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-card border border-border px-3 md:px-4 py-2 text-xs md:text-sm shadow-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Rate Limited</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-card border border-border px-3 md:px-4 py-2 text-xs md:text-sm shadow-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>{sources.length} Sources</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-card border border-border px-3 md:px-4 py-2 text-xs md:text-sm shadow-sm">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span>JSON Format</span>
            </div>
          </div>
        </div>

        {/* Code Preview */}
        <div className="mx-auto mt-12 md:mt-20 max-w-3xl animate-fade-in">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-destructive/50" />
              <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
              <div className="h-3 w-3 rounded-full bg-success/50" />
              <span className="ml-4 font-mono text-xs text-muted-foreground">
                Response Example
              </span>
            </div>
            <pre className="overflow-x-auto p-4 md:p-6 font-mono text-xs md:text-sm">
              <code className="text-foreground">
{`{
  "message": "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
  "author": "Gxyenn",
  "endpoint": "/api/otakudesu/episode/one-piece-episode-1100",
  "status": true,
  "source": "Otakudesu",
  "result": {
    "title": "One Piece Episode 1100",
    "episode": 1100,
    "streams": [
      { "server": "Streamtape", "quality": "720p" },
      { "server": "Doodstream", "quality": "720p" }
    ],
    "downloads": [
      { "quality": "360p", "size": "50MB" },
      { "quality": "720p", "size": "150MB" }
    ]
  }
}`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
