import { successResponse, errorResponse, optionsResponse } from "../_lib/response.js";
import { fetchHtml, extractSection, extractListItems, extractFirstAnchor, extractHeading, extractAttr, extractByClass, toText, ensureAbsoluteUrl } from "../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://kuramanime.boo";
const SOURCE = "Kuramanime";
const ENDPOINT = "/api/kuramanime/search";

const parseSearch = async (query: string, type?: string | null, status?: string | null) => {
  const url = new URL(`${BASE_URL}/?s=${encodeURIComponent(query)}`);
  if (type) url.searchParams.set("type", type);
  if (status) url.searchParams.set("status", status);

  const html = await fetchHtml(url.toString());
  const section = extractSection(html, "listupd") || extractSection(html, "search") || html;
  const items = extractListItems(section);
  const results = items
    .map((item) => {
      const itemHtml = item[1];
      const anchorMatch = extractFirstAnchor(itemHtml);
      const anchorTag = anchorMatch?.[0] ?? "";
      const href = ensureAbsoluteUrl(BASE_URL, anchorMatch?.[1]);
      const slug = href ? href.replace(BASE_URL, "").split("/").filter(Boolean).pop() : null;
      const title = toText(extractHeading(itemHtml) || extractAttr(anchorTag, "title") || anchorMatch?.[2]);
      const itemType = toText(extractByClass(itemHtml, "type") || extractByClass(itemHtml, "typez"));
      const itemStatus = toText(extractByClass(itemHtml, "status") || extractByClass(itemHtml, "stat"));
      const score = toText(extractByClass(itemHtml, "score") || extractByClass(itemHtml, "rating"));
      return { title, slug, type: itemType || null, status: itemStatus || null, score: score || null };
    })
    .filter((item) => item.title);
  return { query, results };
};

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return optionsResponse();
  if (req.method !== "GET") return errorResponse(SOURCE, ENDPOINT, "Method not allowed", 405);

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("q");
    if (!query) return errorResponse(SOURCE, ENDPOINT, "Query parameter 'q' is required", 400);
    const type = url.searchParams.get("type");
    const status = url.searchParams.get("status");
    const data = await parseSearch(query, type, status);
    return successResponse(SOURCE, ENDPOINT, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Kuramanime search";
    return errorResponse(SOURCE, ENDPOINT, message, 500);
  }
}
