import { optionsResponse } from "../../_lib/response.js";
import { validateApiKey } from "../../../lib/apikey.js";
import { failure, success } from "../../../lib/response.js";
import {
  fetchHtml,
  extractSection,
  extractListItems,
  extractFirstAnchor,
  extractHeading,
  toText,
  ensureAbsoluteUrl,
} from "../../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://otakudesu.cloud";
const WELCOME_MESSAGE = "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo";
const AUTHOR = "Gxyenn";
const SOURCE = "otakudesu";
const ENDPOINT = "/api/otakudesu/episode/:slug";

const apiKeyError = () =>
  Response.json(
    {
      message: WELCOME_MESSAGE,
      author: AUTHOR,
      status: false,
      error: "Invalid or missing API key",
    },
    { status: 401 }
  );

const resolveEpisodeUrl = (slug: string) => {
  if (slug.startsWith("http")) return slug;
  if (slug.startsWith("episode/")) return `${BASE_URL}/${slug}`;
  if (slug.includes("/")) return `${BASE_URL}/${slug}`;
  return `${BASE_URL}/episode/${slug}/`;
};

const parseEpisode = async (slug: string) => {
  const html = await fetchHtml(resolveEpisodeUrl(slug));
  const title = toText(extractHeading(html));
  const episodeNumber = title.match(/(\d+(?:\.\d+)?)/)?.[1] ?? slug.match(/(\d+(?:\.\d+)?)/)?.[1] ?? null;

  const streamSection = extractSection(html, "streaming") || extractSection(html, "mirror") || html;
  const streamItems = extractListItems(streamSection);
  const stream = streamItems
    .map((item) => {
      const anchorMatch = extractFirstAnchor(item[1]);
      const href = ensureAbsoluteUrl(BASE_URL, anchorMatch?.[1]);
      const label = toText(anchorMatch?.[2] || item[1]);
      const qualityMatch = label.match(/(360p|480p|720p|1080p|1440p|2160p)/i);
      const quality = qualityMatch ? qualityMatch[1].toLowerCase() : "unknown";
      return href ? { quality, url: href } : null;
    })
    .filter(Boolean);

  const downloadSection = extractSection(html, "download") || html;
  const downloadItems = extractListItems(downloadSection);
  const downloads = downloadItems
    .map((item) => {
      const anchorMatch = extractFirstAnchor(item[1]);
      const href = ensureAbsoluteUrl(BASE_URL, anchorMatch?.[1]);
      const label = toText(anchorMatch?.[2] || item[1]);
      return href ? { provider: label || "unknown", url: href } : null;
    })
    .filter(Boolean);

  return {
    title,
    slug,
    episode_number: episodeNumber,
    stream,
    downloads,
  };
};

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return optionsResponse();
  if (req.method !== "GET") {
    return Response.json(
      {
        message: WELCOME_MESSAGE,
        author: AUTHOR,
        status: false,
        source: SOURCE,
        endpoint: ENDPOINT,
        error: "Method not allowed",
      },
      { status: 405 }
    );
  }
  if (!validateApiKey(req)) return apiKeyError();

  try {
    const slug = new URL(req.url).pathname.split("/").filter(Boolean).pop();
    if (!slug) {
      return Response.json(
        {
          message: WELCOME_MESSAGE,
          author: AUTHOR,
          status: false,
          source: SOURCE,
          endpoint: ENDPOINT,
          error: "Slug is required",
        },
        { status: 400 }
      );
    }
    const data = await parseEpisode(slug);
    return success(SOURCE, ENDPOINT, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Otakudesu episode";
    return failure(SOURCE, ENDPOINT, message);
  }
}
