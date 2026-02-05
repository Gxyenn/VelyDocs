import { Database, Gauge, Code, Layers, RefreshCw, Terminal } from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Multiple Sources",
    description: "Access data from Otakudesu, Samehadaku, Kuramanime, Winbu, and more anime sites.",
  },
  {
    icon: Gauge,
    title: "Fast & Reliable",
    description: "Optimized endpoints with consistent response times and 99.9% uptime.",
  },
  {
    icon: Code,
    title: "RESTful API",
    description: "Clean, predictable URLs with JSON responses. Easy to integrate.",
  },
  {
    icon: Layers,
    title: "Unified Format",
    description: "All responses follow the same structure regardless of the data source.",
  },
  {
    icon: RefreshCw,
    title: "Auto-Sync",
    description: "Endpoints automatically sync with source websites for fresh data.",
  },
  {
    icon: Terminal,
    title: "Interactive Docs",
    description: "Test endpoints directly from the documentation without any setup.",
  },
];

const Features = () => {
  return (
    <section className="border-t border-border bg-card/50 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete API solution for anime data with developer-friendly features.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-muted-foreground/30 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
