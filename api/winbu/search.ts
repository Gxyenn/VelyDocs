import { successResponse, errorResponse, optionsResponse } from "../_lib/response.js";
import { fetchHtml, extractSection, extractListItems, extractFirstAnchor, extractHeading, extractAttr, extractByClass, toText, ensureAbsoluteUrl } from "../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://winbu.tv";
const SOURCE = "Winbu";
const ENDPOINT = "/api/winbu/search";

const parseSearch = async (query: string) => {
  const html = await fetchHtml(`${BASE_URL}/?s=${encodeURIComponent(query)}`);
  const section = extractSection(html, "listupd") || extractSection(html, "search") || html;
  const results = extractListItems(section)
    .map((item) => {
      const itemHtml = item[1];
      const anchorMatch = extractFirstAnchor(itemHtml);
      const anchorTag = anchorMatch?.[0] ?? "";
      const href = ensureAbsoluteUrl(BASE_URL, anchorMatch?.[1]);
      const slug = href ? href.replace(BASE_URL, "").split("/").filter(Boolean).pop() : null;
      const title = toText(extractHeading(itemHtml) || extractAttr(anchorTag, "title") || anchorMatch?.[2]);
      const type = toText(extractByClass(itemHtml, "type") || extractByClass(itemHtml, "typez"));
      const status = toText(extractByClass(itemHtml, "status") || extractByClass(itemHtml, "stat"));
      return { title, slug, type: type || null, status: status || null };
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
    const data = await parseSearch(query);
    return successResponse(SOURCE, ENDPOINT, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Winbu search";
    return errorResponse(SOURCE, ENDPOINT, message, 500);
  }
}
