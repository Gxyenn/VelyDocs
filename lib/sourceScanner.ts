import { ApiError } from "./errors.js";
import { fetchHtmlWithRetry, normalizeUrl } from "./http.js";

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

type LinkInfo = { href: string; text: string };

const configCache = new Map<string, SourceConfig>();

const normalizeText = (text: string) => text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const detectByKeywords = (label: string): PageType | null => {
  const text = label.toLowerCase();
  if (text.includes("search") || text.includes("cari") || text.includes("?s=")) return "search";
  if (text.includes("ongoing") || text.includes("latest") || text.includes("baru")) return "ongoing";
  if (text.includes("completed") || text.includes("complete") || text.includes("tamat")) return "completed";
  if (text.includes("genre") || text.includes("category")) return "genre";
  if (text.includes("jadwal") || text.includes("schedule") || /(senin|selasa|rabu|kamis|jumat|sabtu|minggu)/.test(text)) return "schedule";
  return null;
};

const extractLinks = (html: string): LinkInfo[] => {
  const links = Array.from(
    html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)
  ).map((match) => ({ href: match[1], text: normalizeText(match[2]) }));

  return links.filter((link) => link.href && !link.href.startsWith("#") && !link.href.startsWith("javascript:"));
};

const classifyByPageContent = (html: string): PageType | null => {
  const body = html.toLowerCase();
  if (/<form[^>]+(search|\?s=)/i.test(body) || /[?&]s=/.test(body)) return "search";
  if (/(synopsis|sinopsis|genre|episode\s*\d+)/i.test(body)) return "anime";
  if (/(iframe|embed|player|m3u8|mp4upload|dood|streamsb|mixdrop)/i.test(body)) return "episode";
  if (/(ongoing|latest update|rilis terbaru)/i.test(body)) return "ongoing";
  if (/(completed|complete|tamat)/i.test(body)) return "completed";
  if (/(genre|category|kategori)/i.test(body)) return "genre";
  if (/(senin|selasa|rabu|kamis|jumat|sabtu|minggu|schedule|jadwal)/i.test(body)) return "schedule";
  return null;
};

const detectPostPattern = (links: string[], matcher: RegExp, fallback: string) => {
  const candidate = links.find((href) => matcher.test(href));
  if (!candidate) return fallback;

  try {
    // Gunakan dummy base jika href relative
    const url = new URL(candidate, "https://placeholder.local");
    const segments = url.pathname.split("/").filter(Boolean);
    return segments.length > 0 ? `/${segments[0]}/` : fallback;
  } catch {
    return fallback;
  }
};

const detectSearchPattern = (html: string, links: LinkInfo[]) => {
  const formAction = html.match(/<form[^>]+(?:id|class)=["'][^"']*(?:search|cari)[^"']*["'][^>]*action=["']([^"']+)["']/i)?.[1]
    ?? html.match(/<form[^>]*action=["']([^"']+)["'][^>]*>(?:[\s\S]{0,300})<input[^>]+name=["']s["']/i)?.[1];

  if (formAction) {
    if (formAction.includes("?s=")) return "?s=";
    return formAction.replace(/^\//, "").replace(/\/$/, "") || "search";
  }

  return links.some((item) => item.href.includes("?s=")) ? "?s=" : "search";
};

const detectListSelectors = (html: string) => {
  const classCount = new Map<string, number>();
  for (const block of html.matchAll(/<(article|li|div)[^>]*class=["']([^"']+)["'][^>]*>/gi)) {
    const classes = block[2].split(/\s+/).filter(Boolean).slice(0, 2);
    if (!classes.length) continue;
    const key = `.${classes.join(".")}`;
    classCount.set(key, (classCount.get(key) ?? 0) + 1);
  }

  const repeated = Array.from(classCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
  return {
    title: "h1,h2,h3,.entry-title,.post-title",
    link: repeated ? `${repeated} a[href]` : "a[href]",
    image: repeated ? `${repeated} img[src]` : "img[src]",
  };
};

const persistDetectedConfig = async (sourceName: string, config: SourceConfig) => {
  if (process.env.NODE_ENV === 'production') return;

  try {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const url = await import("node:url");

    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    const filePath = path.resolve(__dirname, `../sources/${sourceName}/config.json`);
    
    await fs.writeFile(filePath, `${JSON.stringify(config, null, 2)}\n`, "utf-8");
  } catch (error) {
    console.warn(`[Scanner] Could not persist config for ${sourceName} (File system not available).`);
  }
};

export const scanSource = async (sourceName: string, baseUrl: string): Promise<SourceConfig> => {
  const cached = configCache.get(sourceName);
  if (cached) return cached;
  const html = await fetchHtmlWithRetry(baseUrl);
  const links = extractLinks(html);
  const hrefs = links.map((item) => item.href);
  const pageMap: SourceConfig["pageMap"] = {};

  for (const link of links.slice(0, 30)) {
    const byKeyword = detectByKeywords(`${link.text} ${link.href}`);
    if (byKeyword && !pageMap[byKeyword]) {
      pageMap[byKeyword] = normalizeUrl(baseUrl, link.href);
      continue;
    }

 if (Object.keys(pageMap).length >= 7) continue;

    try {
      const candidateHtml = await fetchHtmlWithRetry(normalizeUrl(baseUrl, link.href), 1, 5000);
      const byContent = classifyByPageContent(candidateHtml);
      if (byContent && !pageMap[byContent]) {
        pageMap[byContent] = normalizeUrl(baseUrl, link.href);
      }
    } catch {
    }
  }

  const searchPattern = detectSearchPattern(html, links);
  const animePattern = detectPostPattern(hrefs, /(anime|series|donghua|tv|movie)/i, "/anime/");
  const episodePattern = detectPostPattern(hrefs, /(episode|eps|watch|nonton)/i, "/episode/");

  const config: SourceConfig = {
    baseUrl,
    searchPattern,
    animePattern,
    episodePattern,
    pageMap,
    listSelectors: detectListSelectors(html),
  };

  if (!config.searchPattern || !config.animePattern) {
    throw new ApiError("SCRAPING_ERROR", `Unable to detect essential source structure for ${sourceName}`, 422);
  }

  configCache.set(sourceName, config);
  await persistDetectedConfig(sourceName, config);
  
  return config;
};