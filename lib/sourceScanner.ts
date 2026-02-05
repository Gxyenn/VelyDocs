import { fetchHtmlWithRetry, normalizeUrl } from "./http";

export type PageType =
  | "search"
  | "anime"
  | "episode"
  | "ongoing"
  | "completed"
  | "genre"
  | "schedule";

export type SourceConfig = {
  baseUrl: string;
  searchPattern: string;
  animePattern: string;
  episodePattern: string;
  pageMap: Partial<Record<PageType, string>>;
  listSelectors: {
    title: string;
    link: string;
    image: string;
  };
};

const configCache = new Map<string, SourceConfig>();

const detectByKeywords = (label: string): PageType | null => {
  const text = label.toLowerCase();
  if (text.includes("search") || text.includes("cari") || text.includes("?s=")) return "search";
  if (text.includes("ongoing") || text.includes("latest") || text.includes("baru")) return "ongoing";
  if (text.includes("completed") || text.includes("complete") || text.includes("tamat")) return "completed";
  if (text.includes("genre") || text.includes("category")) return "genre";
  if (text.includes("jadwal") || text.includes("schedule") || text.includes("senin")) return "schedule";
  return null;
};

const extractLinks = (html: string) => {
  const links = Array.from(
    html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)
  ).map((match) => ({ href: match[1], text: match[2].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() }));

  return links.filter((link) => link.href && !link.href.startsWith("#"));
};

const detectPostPattern = (links: string[], matcher: RegExp, fallback: string) => {
  const candidate = links.find((href) => matcher.test(href));
  if (!candidate) return fallback;

  const url = new URL(candidate, "https://placeholder.local");
  const segments = url.pathname.split("/").filter(Boolean);
  return segments.length > 1 ? `/${segments[0]}/` : fallback;
};

export const scanSource = async (sourceName: string, baseUrl: string): Promise<SourceConfig> => {
  const cached = configCache.get(sourceName);
  if (cached) return cached;

  const html = await fetchHtmlWithRetry(baseUrl);
  const links = extractLinks(html);
  const hrefs = links.map((item) => item.href);

  const pageMap: SourceConfig["pageMap"] = {};

  for (const link of links) {
    const detected = detectByKeywords(`${link.text} ${link.href}`);
    if (detected && !pageMap[detected]) {
      pageMap[detected] = normalizeUrl(baseUrl, link.href);
    }
  }

  const searchPattern = hrefs.some((href) => href.includes("?s=")) ? "?s=" : "search";
  const animePattern = detectPostPattern(hrefs, /(anime|series|donghua|tv)/i, "/anime/");
  const episodePattern = detectPostPattern(hrefs, /(episode|eps|watch)/i, "/episode/");

  const config: SourceConfig = {
    baseUrl,
    searchPattern,
    animePattern,
    episodePattern,
    pageMap,
    listSelectors: {
      title: "h1,h2,h3,.entry-title,.post-title",
      link: "a[href]",
      image: "img[src]",
    },
  };

  configCache.set(sourceName, config);
  return config;
};
