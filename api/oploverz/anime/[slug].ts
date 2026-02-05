import { successResponse, errorResponse, optionsResponse } from "../../_lib/response.js";
import { fetchHtml, extractSection, extractListItems, extractFirstAnchor, extractHeading, extractByClass, extractJsonLd, toText, ensureAbsoluteUrl } from "../../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://oploverz.top";
const SOURCE = "Oploverz";
const ENDPOINT = "/api/oploverz/anime/:slug";

const resolveAnimeUrl = (slug: string) => {
  if (slug.startsWith("http")) return slug;
  if (slug.startsWith("anime/")) return `${BASE_URL}/${slug}`;
  if (slug.includes("/")) return `${BASE_URL}/${slug}`;
  return `${BASE_URL}/anime/${slug}/`;
};

const parseInfoMap = (html: string) => {
  const infoSection = extractSection(html, "info") || extractSection(html, "infoanime") || html;
  const items = infoSection.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) ?? [];
  const infoMap = new Map<string, string>();
  for (const item of items) {
    const text = toText(item);
    const [label, value] = text.split(":");
    if (label && value) infoMap.set(label.trim().toLowerCase(), value.trim());
  }
  return infoMap;
};

const parseAnimeDetail = async (slug: string) => {
  const html = await fetchHtml(resolveAnimeUrl(slug));
  const jsonLd = extractJsonLd(html);
  const title = toText(jsonLd?.name) || toText(extractHeading(html));
  const synopsis = toText(jsonLd?.description) || toText(extractByClass(html, "sinopsis") || "");
  const genres = (html.match(/<a[^>]*href=["'][^"']*genre[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi) ?? [])
    .map((match) => toText(match))
    .filter(Boolean);
  const infoMap = parseInfoMap(html);

  const episodeSection = extractSection(html, "episodelist") || extractSection(html, "epslist") || html;
  const episodeList = extractListItems(episodeSection).map((item) => {
    const anchorMatch = extractFirstAnchor(item[1]);
    const href = ensureAbsoluteUrl(BASE_URL, anchorMatch?.[1]);
    const episodeSlug = href ? href.replace(BASE_URL, "").split("/").filter(Boolean).pop() : null;
    const titleText = toText(anchorMatch?.[2] || item[1]);
    const numberMatch = titleText.match(/(\d+(?:\.\d+)?)/);
    return { number: numberMatch ? Number(numberMatch[1]) : null, title: titleText, slug: episodeSlug };
  });

  const thumbnail =
    jsonLd?.image ||
    ensureAbsoluteUrl(
      BASE_URL,
      html.match(/<img[^>]*class=["'][^"']*thumb[^"']*["'][^>]*src=["']([^"']+)["']/i)?.[1] ?? null
    );

  return {
    title,
    synopsis,
    genres,
    type: infoMap.get("tipe") || null,
    episodes: infoMap.get("episode") || infoMap.get("jumlah episode") || null,
    status: infoMap.get("status") || null,
    studio: infoMap.get("studio") || null,
    score: infoMap.get("skor") || infoMap.get("score") || null,
    thumbnail,
    episodeList,
  };
};

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return optionsResponse();
  if (req.method !== "GET") return errorResponse(SOURCE, ENDPOINT, "Method not allowed", 405);

  try {
    const slug = new URL(req.url).pathname.split("/").filter(Boolean).pop();
    if (!slug) return errorResponse(SOURCE, ENDPOINT, "Slug is required", 400);
    const data = await parseAnimeDetail(slug);
    return successResponse(SOURCE, ENDPOINT, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Oploverz anime detail";
    return errorResponse(SOURCE, ENDPOINT, message, 500);
  }
}
