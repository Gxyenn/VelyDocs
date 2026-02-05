import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Play, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Endpoint } from "@/data/endpoints";

interface EndpointCardProps {
  endpoint: Endpoint;
}

const EndpointCard = ({ endpoint }: EndpointCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const testPath = useMemo(() => {
    let path = endpoint.testPath ?? endpoint.path;
    if (!endpoint.testPath && endpoint.parameters && endpoint.parameters.length > 0) {
      const queryParams: string[] = [];
      endpoint.parameters.forEach((param) => {
        const placeholder = `:${param.name}`;
        if (path.includes(placeholder)) {
          const value = param.example ?? (param.required ? "sample" : param.name);
          path = path.replace(placeholder, encodeURIComponent(value));
          return;
        }

        if (param.example || param.required) {
          const value = param.example ?? (param.required ? "sample" : "");
          if (value) {
            queryParams.push(`${encodeURIComponent(param.name)}=${encodeURIComponent(value)}`);
          }
        }
      });

      if (queryParams.length > 0) {
        path = `${path}${path.includes("?") ? "&" : "?"}${queryParams.join("&")}`;
      }
    }
    return path;
  }, [endpoint.parameters, endpoint.path, endpoint.testPath]);

  const testUrl = useMemo(() => {
    if (typeof window === "undefined") return testPath;
    return `${window.location.origin}${testPath}`;
  }, [testPath]);

  const handleTest = async () => {
    setIsLoading(true);
    setIsExpanded(true);
    try {
      const res = await fetch(testUrl, { method: endpoint.method });
      const text = await res.text();
      let payload: unknown = text;

      try {
        payload = JSON.parse(text);
      } catch {
        payload = {
          status: res.ok,
          statusCode: res.status,
          body: text,
        };
      }

      if (!res.ok) {
        payload = {
          status: false,
          statusCode: res.status,
          body: payload,
        };
      }

      setResponse(JSON.stringify(payload, null, 2));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch endpoint.";
      setResponse(
        JSON.stringify(
          {
            status: false,
            message,
          },
          null,
          2
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(endpoint.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyResponse = async () => {
    if (response) {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const methodColors = {
    GET: "bg-success/10 text-success border-success/20",
    POST: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const categoryColors: Record<string, string> = {
    General: "bg-muted text-muted-foreground",
    List: "bg-blue-500/10 text-blue-500",
    Search: "bg-amber-500/10 text-amber-500",
    Detail: "bg-purple-500/10 text-purple-500",
    Stream: "bg-success/10 text-success",
    Download: "bg-orange-500/10 text-orange-500",
    Schedule: "bg-pink-500/10 text-pink-500",
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-muted-foreground/30">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 items-start gap-3">
          <span
            className={`mt-0.5 rounded-md border px-2 py-1 font-mono text-xs font-bold ${methodColors[endpoint.method]}`}
          >
            {endpoint.method}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{endpoint.name}</h3>
              <span className={`rounded-full px-2 py-0.5 text-xs ${categoryColors[endpoint.category] || "bg-muted text-muted-foreground"}`}>
                {endpoint.category}
              </span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {endpoint.source}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 overflow-hidden">
              <code className="truncate font-mono text-sm text-muted-foreground">
                {endpoint.path}
              </code>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                title="Copy endpoint path"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-success" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {endpoint.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleTest}
            disabled={isLoading}
            className="gap-2"
          >
            <Play className="h-3.5 w-3.5" />
            {isLoading ? "Loading..." : "Test"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            asChild
          >
            <a href={testUrl} target="_blank" rel="noreferrer" className="gap-2 inline-flex items-center">
              <ExternalLink className="h-3.5 w-3.5" />
              Get
            </a>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border bg-muted/30">
          {endpoint.parameters && endpoint.parameters.length > 0 && (
            <div className="border-b border-border p-4">
              <h4 className="mb-3 text-sm font-semibold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Parameters
              </h4>
              <div className="space-y-2">
                {endpoint.parameters.map((param) => (
                  <div
                    key={param.name}
                    className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 rounded-lg bg-background p-3"
                  >
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-secondary px-2 py-0.5 font-mono text-sm font-medium">
                        {param.name}
                      </code>
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {param.type}
                      </span>
                      {param.required && (
                        <span className="text-xs text-destructive font-medium">required</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {param.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Response Example
              </h4>
              {response && (
                <button
                  onClick={handleCopyResponse}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </button>
              )}
            </div>
            <div className="overflow-hidden rounded-lg border border-border bg-background">
              <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
                <span className="font-mono text-xs text-muted-foreground">
                  application/json
                </span>
                <span className="flex items-center gap-1 text-xs text-success">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  200 OK
                </span>
              </div>
              <pre className="max-h-96 overflow-auto p-4 font-mono text-xs sm:text-sm">
                <code>{response || JSON.stringify(endpoint.exampleResponse, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EndpointCard;
