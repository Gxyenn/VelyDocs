import { successResponse, errorResponse, optionsResponse } from "../../_lib/response.js";
import { fetchHtml, extractSection, extractListItems, extractFirstAnchor, extractHeading, extractByClass, extractJsonLd, toText, ensureAbsoluteUrl } from "../../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://kusonime.com";
const SOURCE = "Kusonime";
const ENDPOINT = "/api/kusonime/anime/:slug";

const resolveAnimeUrl = (slug: string) => {
  if (slug.startsWith("http")) return slug;
  if (slug.includes("/")) return `${BASE_URL}/${slug}`;
  return `${BASE_URL}/${slug}/`;
};

const parseAnimeDetail = async (slug: string) => {
  const html = await fetchHtml(resolveAnimeUrl(slug));
  const jsonLd = extractJsonLd(html);
  const title = toText(jsonLd?.name) || toText(extractHeading(html));
  const synopsis = toText(jsonLd?.description) || toText(extractByClass(html, "sinopsis") || "");
  const genres = (html.match(/<a[^>]*href=["'][^"']*genre[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi) ?? [])
    .map((match) => toText(match))
    .filter(Boolean);

  const downloadSection = extractSection(html, "download") || extractSection(html, "downloadlinks") || html;
  const downloads = extractListItems(downloadSection)
    .map((item) => {
      const itemHtml = item[1];
      const quality = toText(extractByClass(itemHtml, "quality") || itemHtml.match(/(\d{3,4}p)/i)?.[1]);
      const size = toText(itemHtml.match(/(\d+(?:\.\d+)?\s?(GB|MB))/i)?.[1]);
      const links = itemHtml.match(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)?.map((linkHtml) => {
        const href = linkHtml.match(/href=["']([^"']+)["']/i)?.[1];
        const label = toText(linkHtml);
        return href ? { label, url: ensureAbsoluteUrl(BASE_URL, href) } : null;
      }).filter(Boolean) ?? [];
      return links.length ? { quality: quality || null, size: size || null, links } : null;
    })
    .filter(Boolean);

  return { title, synopsis, genres, downloads };
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
    const message = error instanceof Error ? error.message : "Failed to scrape Kusonime anime";
    return errorResponse(SOURCE, ENDPOINT, message, 500);
  }
}
