import { successResponse, errorResponse, optionsResponse } from "../_lib/response.js";
import {
  fetchHtml,
  extractSection,
  extractListItems,
  extractFirstAnchor,
  extractHeading,
  extractAttr,
  toText,
  ensureAbsoluteUrl,
} from "../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://kuramanime.boo";
const SOURCE = "Kuramanime";
const ENDPOINT = "/api/kuramanime";

const parseHomepage = async () => {
  const html = await fetchHtml(BASE_URL);
  const featuredSection = extractSection(html, "featured") || extractSection(html, "highlight") || html;
  const featuredItems = extractListItems(featuredSection);
  const featured = featuredItems
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

  const latestSection = extractSection(html, "latest") || extractSection(html, "listupd") || html;
  const latestItems = extractListItems(latestSection);
  const latest = latestItems
    .map((item) => {
      const itemHtml = item[1];
      const anchorMatch = extractFirstAnchor(itemHtml);
      const anchorTag = anchorMatch?.[0] ?? "";
      const href = ensureAbsoluteUrl(BASE_URL, anchorMatch?.[1]);
      const slug = href ? href.replace(BASE_URL, "").split("/").filter(Boolean).pop() : null;
      const title = toText(extractHeading(itemHtml) || extractAttr(anchorTag, "title") || anchorMatch?.[2]);
      const time = toText(itemHtml.match(/<span[^>]*class=["'][^"']*(time|date)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[2]);
      return { title, slug, time: time || null };
    })
    .filter((item) => item.title);

  const popularSection = extractSection(html, "popular") || extractSection(html, "trending") || html;
  const popularItems = extractListItems(popularSection);
  const popular = popularItems
    .map((item) => {
      const itemHtml = item[1];
      const anchorMatch = extractFirstAnchor(itemHtml);
      const anchorTag = anchorMatch?.[0] ?? "";
      const href = ensureAbsoluteUrl(BASE_URL, anchorMatch?.[1]);
      const slug = href ? href.replace(BASE_URL, "").split("/").filter(Boolean).pop() : null;
      const title = toText(extractHeading(itemHtml) || extractAttr(anchorTag, "title") || anchorMatch?.[2]);
      const views = toText(itemHtml.match(/<span[^>]*class=["'][^"']*(views|view)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[2]);
      return { title, slug, views: views || null };
    })
    .filter((item) => item.title);

  return { featured, latest, popular };
};

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return optionsResponse();
  if (req.method !== "GET") return errorResponse(SOURCE, ENDPOINT, "Method not allowed", 405);

  try {
    const data = await parseHomepage();
    return successResponse(SOURCE, ENDPOINT, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Kuramanime homepage";
    return errorResponse(SOURCE, ENDPOINT, message, 500);
  }
}
