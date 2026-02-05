import { successResponse, errorResponse, optionsResponse } from "../_lib/response.js";
import { fetchHtml, extractSection, extractListItems, extractFirstAnchor, extractHeading, extractAttr, toText, ensureAbsoluteUrl } from "../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://nanime.biz";
const SOURCE = "Nanime";
const ENDPOINT = "/api/nanime";

const parseHomepage = async () => {
  const html = await fetchHtml(BASE_URL);
  const latestSection = extractSection(html, "listupd") || extractSection(html, "latest") || html;
  const latest = extractListItems(latestSection)
    .map((item) => {
      const itemHtml = item[1];
      const anchorMatch = extractFirstAnchor(itemHtml);
      const anchorTag = anchorMatch?.[0] ?? "";
      const href = ensureAbsoluteUrl(BASE_URL, anchorMatch?.[1]);
      const slug = href ? href.replace(BASE_URL, "").split("/").filter(Boolean).pop() : null;
      const title = toText(extractHeading(itemHtml) || extractAttr(anchorTag, "title") || anchorMatch?.[2]);
      const thumb = itemHtml.match(/<img[^>]*(?:data-src|src)=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;
      const thumbnail = ensureAbsoluteUrl(BASE_URL, thumb);
      return { title, slug, thumbnail };
    })
    .filter((item) => item.title);

  const trendingSection = extractSection(html, "trending") || html;
  const trending = extractListItems(trendingSection)
    .map((item) => {
      const itemHtml = item[1];
      const anchorMatch = extractFirstAnchor(itemHtml);
      const anchorTag = anchorMatch?.[0] ?? "";
      const href = ensureAbsoluteUrl(BASE_URL, anchorMatch?.[1]);
      const slug = href ? href.replace(BASE_URL, "").split("/").filter(Boolean).pop() : null;
      const title = toText(extractHeading(itemHtml) || extractAttr(anchorTag, "title") || anchorMatch?.[2]);
      return { title, slug };
    })
    .filter((item) => item.title);

  return { latest, trending };
};

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return optionsResponse();
  if (req.method !== "GET") return errorResponse(SOURCE, ENDPOINT, "Method not allowed", 405);

  try {
    const data = await parseHomepage();
    return successResponse(SOURCE, ENDPOINT, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Nanime homepage";
    return errorResponse(SOURCE, ENDPOINT, message, 500);
  }
}
