import { successResponse, errorResponse, optionsResponse } from "../../_lib/response.js";
import { fetchHtml, extractSection, extractListItems, extractFirstAnchor, extractHeading, toText, ensureAbsoluteUrl } from "../../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://oploverz.top";
const SOURCE = "Oploverz";
const ENDPOINT = "/api/oploverz/batch/:slug";

const resolveBatchUrl = (slug: string) => {
  if (slug.startsWith("http")) return slug;
  if (slug.startsWith("batch/")) return `${BASE_URL}/${slug}`;
  if (slug.includes("/")) return `${BASE_URL}/${slug}`;
  return `${BASE_URL}/batch/${slug}/`;
};

const parseBatch = async (slug: string) => {
  const html = await fetchHtml(resolveBatchUrl(slug));
  const title = toText(extractHeading(html));
  const batchSection = extractSection(html, "batchlinks") || extractSection(html, "download") || html;
  const batches = extractListItems(batchSection)
    .map((item) => {
      const anchorMatch = extractFirstAnchor(item[1]);
      const href = ensureAbsoluteUrl(BASE_URL, anchorMatch?.[1]);
      const label = toText(anchorMatch?.[2] || item[1]);
      return href ? { label, url: href } : null;
    })
    .filter(Boolean);

  return { title, batches };
};

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return optionsResponse();
  if (req.method !== "GET") return errorResponse(SOURCE, ENDPOINT, "Method not allowed", 405);

  try {
    const slug = new URL(req.url).pathname.split("/").filter(Boolean).pop();
    if (!slug) return errorResponse(SOURCE, ENDPOINT, "Slug is required", 400);
    const data = await parseBatch(slug);
    return successResponse(SOURCE, ENDPOINT, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Oploverz batch";
    return errorResponse(SOURCE, ENDPOINT, message, 500);
  }
}
