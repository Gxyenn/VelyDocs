import { ExternalLink, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { sources } from "@/data/endpoints";

const DataSources = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 md:mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            Sumber Data
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Kami mengambil data dari {sources.length} website anime terpercaya untuk cakupan yang lengkap.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-mono text-base font-bold">
                  {source.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{source.name}</h3>
                    <span className="flex items-center gap-1 text-xs text-success">
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{source.endpoints.length} endpoints</p>
                </div>
              </div>
              <a
                href={source.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/sources">Lihat Detail Sumber</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DataSources;
