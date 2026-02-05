import { successResponse, errorResponse, optionsResponse } from "../../_lib/response.js";
import { fetchHtml, extractSection, extractListItems, extractFirstAnchor, extractHeading, toText, ensureAbsoluteUrl } from "../../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://nanime.biz";
const SOURCE = "Nanime";
const ENDPOINT = "/api/nanime/episode/:slug";

const resolveEpisodeUrl = (slug: string) => {
  if (slug.startsWith("http")) return slug;
  if (slug.includes("/")) return `${BASE_URL}/${slug}`;
  return `${BASE_URL}/${slug}/`;
};

const parseEpisode = async (slug: string) => {
  const html = await fetchHtml(resolveEpisodeUrl(slug));
  const title = toText(extractHeading(html));
  const streamSection = extractSection(html, "mirror") || extractSection(html, "streaming") || extractSection(html, "server") || html;
  const streams = extractListItems(streamSection)
    .map((item) => {
      const anchorMatch = extractFirstAnchor(item[1]);
      const href = ensureAbsoluteUrl(BASE_URL, anchorMatch?.[1]);
      const server = toText(anchorMatch?.[2] || item[1]);
      return href && server ? { server, url: href } : null;
    })
    .filter(Boolean);

  return { title, streams };
};

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return optionsResponse();
  if (req.method !== "GET") return errorResponse(SOURCE, ENDPOINT, "Method not allowed", 405);

  try {
    const slug = new URL(req.url).pathname.split("/").filter(Boolean).pop();
    if (!slug) return errorResponse(SOURCE, ENDPOINT, "Slug is required", 400);
    const data = await parseEpisode(slug);
    return successResponse(SOURCE, ENDPOINT, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Nanime episode";
    return errorResponse(SOURCE, ENDPOINT, message, 500);
  }
}
