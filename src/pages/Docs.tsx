import { useState, useMemo } from "react";
import { Search, Filter, Grid3X3, List, ChevronDown } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EndpointCard from "@/components/docs/EndpointCard";
import { sources, getAllEndpoints, categories } from "@/data/endpoints";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Docs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const allEndpoints = useMemo(() => getAllEndpoints(), []);
  
  const filteredEndpoints = useMemo(() => {
    return allEndpoints.filter((endpoint) => {
      const matchesSearch =
        endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.source.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSource = selectedSource
        ? sources.find(s => s.id === selectedSource)?.name === endpoint.source
        : true;

      const matchesCategory = selectedCategory
        ? endpoint.category === selectedCategory
        : true;
      
      return matchesSearch && matchesSource && matchesCategory;
    });
  }, [allEndpoints, searchQuery, selectedSource, selectedCategory]);

  // Group endpoints by source
  const groupedEndpoints = useMemo(() => {
    const groups: Record<string, typeof filteredEndpoints> = {};
    filteredEndpoints.forEach(endpoint => {
      if (!groups[endpoint.source]) {
        groups[endpoint.source] = [];
      }
      groups[endpoint.source].push(endpoint);
    });
    return groups;
  }, [filteredEndpoints]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="mb-4 text-3xl md:text-4xl font-bold tracking-tight">API Documentation</h1>
          <p className="max-w-2xl text-base md:text-lg text-muted-foreground">
            {allEndpoints.length} endpoints tersedia dari {sources.length} sumber anime. 
            Test langsung tanpa harus setup apapun.
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 md:mb-8 rounded-xl border border-border bg-card p-4 md:p-6">
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div>
              <span className="text-xs md:text-sm text-muted-foreground">Base URL</span>
              <code className="mt-1 block font-mono text-xs md:text-sm">/api/{"{source}"}/{"{endpoint}"}</code>
            </div>
            <div className="hidden md:block h-10 w-px bg-border" />
            <div>
              <span className="text-xs md:text-sm text-muted-foreground">Rate Limit</span>
              <p className="mt-1 font-mono text-xs md:text-sm font-medium">70 req / menit</p>
            </div>
            <div className="hidden md:block h-10 w-px bg-border" />
            <div>
              <span className="text-xs md:text-sm text-muted-foreground">Format</span>
              <p className="mt-1 font-mono text-xs md:text-sm">JSON</p>
            </div>
            <div className="hidden md:block h-10 w-px bg-border" />
            <div>
              <span className="text-xs md:text-sm text-muted-foreground">Author</span>
              <p className="mt-1 font-mono text-xs md:text-sm font-medium">Gxyenn</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari endpoint, path, atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 sm:w-auto"
            >
              <Filter className="h-4 w-4" />
              Filter
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {showFilters && (
            <div className="space-y-3 p-4 rounded-lg border border-border bg-card animate-fade-in">
              <div>
                <span className="text-sm font-medium mb-2 block">Sumber Data</span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedSource === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSource(null)}
                  >
                    Semua
                  </Button>
                  {sources.map((source) => (
                    <Button
                      key={source.id}
                      variant={selectedSource === source.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSource(source.id)}
                    >
                      {source.name}
                      <span className="ml-1 text-xs opacity-60">({source.endpoints.length})</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm font-medium mb-2 block">Kategori</span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Semua
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Endpoints List - Grouped by Source */}
        {Object.keys(groupedEndpoints).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedEndpoints).map(([sourceName, endpoints]) => (
              <div key={sourceName}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground">
                    {sourceName.charAt(0)}
                  </div>
                  <h2 className="text-lg font-semibold">{sourceName}</h2>
                  <span className="text-sm text-muted-foreground">
                    {endpoints.length} endpoint{endpoints.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-3">
                  {endpoints.map((endpoint) => (
                    <EndpointCard key={endpoint.id} endpoint={endpoint} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Filter className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Tidak ada endpoint ditemukan</h3>
            <p className="text-muted-foreground">
              Coba ubah kata kunci pencarian atau filter.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Statistik API</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl md:text-3xl font-bold">{allEndpoints.length}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Total Endpoints</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl md:text-3xl font-bold">{sources.length}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Sumber Data</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl md:text-3xl font-bold">70</div>
              <div className="text-xs md:text-sm text-muted-foreground">Req/Menit</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl md:text-3xl font-bold">JSON</div>
              <div className="text-xs md:text-sm text-muted-foreground">Format</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl md:text-3xl font-bold text-success">Active</div>
              <div className="text-xs md:text-sm text-muted-foreground">Status</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Docs;
