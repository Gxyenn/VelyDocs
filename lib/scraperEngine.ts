import { ApiError } from "./errors";
import { fetchHtmlWithRetry, normalizeUrl } from "./http";
import { scanSource } from "./sourceScanner";
import { extractStreams } from "./streamExtractor";

export const extractRepeatingBlocks = (html: string) => {
  const blocks = html.match(/<(article|li|div)[^>]*>[\s\S]*?<\/\1>/gi) ?? [];
  const scored = new Map<string, number>();

  for (const block of blocks) {
    const classes = block.match(/class=["']([^"']+)["']/i)?.[1];
    if (!classes) continue;
    const key = classes.split(" ").slice(0, 2).join(".");
    scored.set(key, (scored.get(key) ?? 0) + 1);
  }

  const mostRepeated = Array.from(scored.entries()).sort((a, b) => b[1] - a[1])[0];
  if (!mostRepeated || mostRepeated[1] < 2) return blocks.slice(0, 30);

  const [selector] = mostRepeated;
  return blocks.filter((block) => block.includes(selector.split(".")[0])).slice(0, 30);
};

const parseCard = (block: string, baseUrl: string) => {
  const title =
    block.match(/<(h1|h2|h3)[^>]*>([\s\S]*?)<\/\1>/i)?.[2] ??
    block.match(/alt=["']([^"']+)["']/i)?.[1] ??
    "Unknown title";

  const href = block.match(/<a[^>]*href=["']([^"']+)["']/i)?.[1] ?? "";
  const image = block.match(/<img[^>]*src=["']([^"']+)["']/i)?.[1] ?? "";

  return {
    title: title.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
    url: normalizeUrl(baseUrl, href),
    image: image ? normalizeUrl(baseUrl, image) : null,
  };
};

const pickFirstExisting = (values: Array<string | undefined>) => values.find(Boolean);

export const search = async (source: string, baseUrl: string, query: string) => {
  if (!query.trim()) {
    throw new ApiError("INVALID_PARAM", "Query cannot be empty", 400);
  }

  const config = await scanSource(source, baseUrl);
  const searchUrl = config.searchPattern === "?s=" ? `${baseUrl}/?s=${encodeURIComponent(query)}` : `${baseUrl}/${config.searchPattern}/${encodeURIComponent(query)}`;
  const html = await fetchHtmlWithRetry(searchUrl);
  const cards = extractRepeatingBlocks(html).map((block) => parseCard(block, baseUrl));
  return { query, items: cards.filter((card) => card.url !== baseUrl) };
};

export const getAnime = async (source: string, baseUrl: string, slug: string) => {
  const config = await scanSource(source, baseUrl);
  const animeUrl = `${baseUrl}${config.animePattern}${slug}`;
  const html = await fetchHtmlWithRetry(animeUrl);

  const title = pickFirstExisting([
    html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1],
    html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1],
  ]);

  if (!title) {
    throw new ApiError("NOT_FOUND", "Anime not found", 404);
  }

  const synopsis = html.match(/(synopsis|sinopsis)[\s\S]{0,300}<p[^>]*>([\s\S]*?)<\/p>/i)?.[2] ?? null;
  const episodes = Array.from(html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]*(Episode|Ep)\s*\d+[^<]*)<\/a>/gi)).map((match) => ({
    title: match[2].trim(),
    url: normalizeUrl(baseUrl, match[1]),
  }));

  return {
    title: title.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
    synopsis: synopsis?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() ?? null,
    episodes,
  };
};

export const getEpisode = async (source: string, baseUrl: string, slug: string) => {
  const config = await scanSource(source, baseUrl);
  const episodeUrl = `${baseUrl}${config.episodePattern}${slug}`;
  const html = await fetchHtmlWithRetry(episodeUrl);

  const title = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]*>/g, " ").trim() ?? slug;
  const streams = extractStreams(html, baseUrl);

  if (streams.length === 0) {
    throw new ApiError("SCRAPING_ERROR", "No stream embeds detected on episode page", 422);
  }

  const detectedSource = streams.find((stream) => stream.provider !== "Unknown")?.provider ?? "Unknown";

  return {
    title,
    source: detectedSource,
    streams,
  };
};

export const getListByType = async (
  source: string,
  baseUrl: string,
  listType: "ongoing" | "completed"
) => {
  const config = await scanSource(source, baseUrl);
  const target = config.pageMap[listType] ?? baseUrl;
  const html = await fetchHtmlWithRetry(target);
  const cards = extractRepeatingBlocks(html).map((block) => parseCard(block, baseUrl));
  return { type: listType, items: cards.filter((card) => card.url !== baseUrl) };
};
