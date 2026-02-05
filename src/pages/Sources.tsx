import { ExternalLink, CheckCircle2, AlertCircle, Clock, Globe, Tv, Download } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { sources } from "@/data/endpoints";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const statusConfig = {
  active: {
    icon: CheckCircle2,
    label: "Active",
    className: "bg-success/10 text-success",
  },
  maintenance: {
    icon: Clock,
    label: "Maintenance",
    className: "bg-yellow-500/10 text-yellow-500",
  },
  inactive: {
    icon: AlertCircle,
    label: "Inactive",
    className: "bg-destructive/10 text-destructive",
  },
};

const Sources = () => {
  const totalEndpoints = sources.reduce((acc, s) => acc + s.endpoints.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="mb-4 text-3xl md:text-4xl font-bold tracking-tight">Data Sources</h1>
          <p className="max-w-2xl text-base md:text-lg text-muted-foreground">
            Vely API mengumpulkan data dari {sources.length} website anime terpercaya 
            dengan total {totalEndpoints} endpoints tersedia.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold">{sources.length}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Sumber Data</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold">{totalEndpoints}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Endpoints</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-success">{sources.filter(s => s.status === "active").length}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Active</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold">ID</div>
            <div className="text-xs md:text-sm text-muted-foreground">Language</div>
          </div>
        </div>

        {/* Sources Grid */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => {
            const status = statusConfig[source.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={source.id}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-muted-foreground/30 hover:shadow-lg"
              >
                <div className="p-5">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary font-mono text-lg font-bold transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        {source.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{source.name}</h3>
                        <a
                          href={source.baseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {source.baseUrl.replace("https://", "")}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </div>

                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{source.description}</p>

                  {/* Features */}
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {source.features.slice(0, 4).map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {feature === "Streaming" && <Tv className="h-3 w-3" />}
                        {feature === "Download" && <Download className="h-3 w-3" />}
                        {feature === "Donghua" && <Globe className="h-3 w-3" />}
                        {feature}
                      </span>
                    ))}
                    {source.features.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{source.features.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {source.endpoints.length} endpoint{source.endpoints.length > 1 ? "s" : ""}
                    </span>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/docs`} onClick={() => window.scrollTo(0, 0)}>
                        View Docs
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Endpoints Preview */}
                <div className="border-t border-border bg-muted/30 p-3">
                  <div className="flex flex-wrap gap-1.5">
                    {source.endpoints.slice(0, 4).map((endpoint) => (
                      <code
                        key={endpoint.id}
                        className="rounded bg-background px-2 py-1 font-mono text-xs text-muted-foreground"
                      >
                        {endpoint.path.split("/").pop()}
                      </code>
                    ))}
                    {source.endpoints.length > 4 && (
                      <span className="rounded bg-background px-2 py-1 text-xs text-muted-foreground">
                        +{source.endpoints.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="mt-12 rounded-xl border border-border bg-card p-6 md:p-8">
          <h2 className="mb-6 text-xl md:text-2xl font-bold">Cara Kerja API</h2>
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                1
              </div>
              <h3 className="mb-2 font-semibold">Scanning</h3>
              <p className="text-sm text-muted-foreground">
                Sistem memindai website sumber untuk mendapatkan struktur URL dan path yang tersedia.
              </p>
            </div>
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                2
              </div>
              <h3 className="mb-2 font-semibold">Extraction</h3>
              <p className="text-sm text-muted-foreground">
                Data diekstrak dan dinormalisasi ke format JSON yang konsisten.
              </p>
            </div>
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                3
              </div>
              <h3 className="mb-2 font-semibold">Caching</h3>
              <p className="text-sm text-muted-foreground">
                Data di-cache untuk performa optimal dan mengurangi beban ke sumber.
              </p>
            </div>
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                4
              </div>
              <h3 className="mb-2 font-semibold">API Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Data disajikan melalui REST API dengan rate limiting 70 req/menit.
              </p>
            </div>
          </div>
        </div>

        {/* Response Format */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6 md:p-8">
          <h2 className="mb-4 text-xl md:text-2xl font-bold">Format Response</h2>
          <p className="mb-4 text-muted-foreground">
            Semua endpoint mengembalikan response dengan format yang sama:
          </p>
          <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
              <span className="font-mono text-xs text-muted-foreground">application/json</span>
            </div>
            <pre className="overflow-auto p-4 font-mono text-xs md:text-sm">
{`{
  "message": "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
  "author": "Gxyenn",
  "endpoint": "/api/otakudesu",
  "status": true | false,
  "source": "Otakudesu" | "Samehadaku" | ...,
  "result": {
    // Response data sesuai endpoint
  },
  "meta": {
    // Metadata pagination atau query (opsional)
  }
}`}
            </pre>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sources;
