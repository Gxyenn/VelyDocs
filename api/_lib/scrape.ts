const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
};

const normalizeUrl = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};

const fetchWithHeaders = async (url: string) =>
  fetch(normalizeUrl(url), {
    headers: DEFAULT_HEADERS,
  });

const fetchWithFallback = async (url: string) => {
  const response = await fetchWithHeaders(url);
  if (response.ok) {
    return response.text();
  }

  const fallbackUrl = `https://r.jina.ai/http://${normalizeUrl(url)}`;
  const fallbackResponse = await fetch(fallbackUrl, {
    headers: DEFAULT_HEADERS,
  });

  if (!fallbackResponse.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return fallbackResponse.text();
};

export const fetchHtml = async (url: string) => {
  return fetchWithFallback(url);
};

export const toText = (value?: string | null) =>
  value?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() ?? "";

export const cleanNumber = (value: string) => value.replace(/[^0-9]/g, "");

export const ensureAbsoluteUrl = (base: string, href?: string | null) => {
  if (!href) return null;
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href.startsWith("//")) return `https:${href}`;
  if (href.startsWith("/")) return `${base.replace(/\/$/, "")}${href}`;
  return `${base.replace(/\/$/, "")}/${href}`;
};

export const pickFirst = <T>(...values: Array<T | null | undefined>) =>
  values.find((value) => value !== null && value !== undefined);

export const matchAll = (html: string, pattern: RegExp) => Array.from(html.matchAll(pattern));

export const extractAttr = (source: string, attr: string) => {
  const pattern = new RegExp(`${attr}=["']([^"']+)["']`, "i");
  return source.match(pattern)?.[1] ?? null;
};

export const extractJsonLd = (html: string) => {
  const matches = matchAll(html, /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const match of matches) {
    const payload = match[1]?.trim();
    if (!payload) continue;
    try {
      const parsed = JSON.parse(payload);
      if (parsed) return parsed;
    } catch {
      // ignore invalid JSON-LD
    }
  }
  return null;
};

export const extractSection = (html: string, className: string) => {
  const pattern = new RegExp(`<div[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>`, "i");
  const match = pattern.exec(html);
  if (!match || match.index === undefined) return "";

  const startIndex = match.index + match[0].length;
  let depth = 1;
  let cursor = startIndex;
  const openPattern = /<div\b[^>]*>/gi;
  const closePattern = /<\/div>/gi;

  openPattern.lastIndex = cursor;
  closePattern.lastIndex = cursor;

  while (depth > 0) {
    const nextOpen = openPattern.exec(html);
    const nextClose = closePattern.exec(html);

    if (!nextClose) {
      break;
    }

    if (nextOpen && nextOpen.index < nextClose.index) {
      depth += 1;
      cursor = nextOpen.index + nextOpen[0].length;
      continue;
    }

    depth -= 1;
    cursor = nextClose.index + nextClose[0].length;
  }

  if (depth !== 0) {
    return html.slice(startIndex);
  }

  return html.slice(startIndex, cursor - "</div>".length);
};

export const extractListItems = (html: string) => matchAll(html, /<li[^>]*>([\s\S]*?)<\/li>/gi);

export const extractAnchors = (html: string) => matchAll(html, /<a[^>]*>([\s\S]*?)<\/a>/gi);

export const extractByClass = (html: string, className: string) => {
  const pattern = new RegExp(
    `<[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`,
    "i"
  );
  return html.match(pattern)?.[1] ?? "";
};

export const extractHeading = (html: string) =>
  html.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i)?.[1] ?? "";

export const extractFirstAnchor = (html: string) =>
  html.match(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
