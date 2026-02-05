const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0",
];

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly type: "SOURCE_DOWN" | "SCRAPING_ERROR"
  ) {
    super(message);
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const normalizeUrl = (baseUrl: string, href: string) => {
  if (!href) return baseUrl;
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return href;
  }
};

export const fetchHtmlWithRetry = async (url: string, retries = 3, timeoutMs = 12000) => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
          Accept: "text/html,application/xhtml+xml",
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new HttpError(`Request failed with status ${response.status}`, response.status, "SOURCE_DOWN");
      }

      return await response.text();
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt < retries) {
        await delay(250 * attempt);
      }
    }
  }

  if (lastError instanceof HttpError) {
    throw lastError;
  }

  throw new HttpError("Failed to fetch source website", 503, "SOURCE_DOWN");
};
