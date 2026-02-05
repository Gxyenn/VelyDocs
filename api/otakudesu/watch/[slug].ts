import { optionsResponse } from "../../_lib/response.js";
import { validateApiKey } from "../../../lib/apikey.js";
import { failure, success } from "../../../lib/response.js";
import { ensureAbsoluteUrl, fetchHtml, matchAll } from "../../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://otakudesu.cloud";
const WELCOME_MESSAGE = "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo";
const AUTHOR = "Gxyenn";
const SOURCE = "otakudesu";
const ENDPOINT = "/api/otakudesu/watch/:slug";

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

const parseWatchSources = async (slug: string) => {
  const html = await fetchHtml(resolveEpisodeUrl(slug));
  const iframeSources = matchAll(html, /<iframe[^>]*src=["']([^"']+)["']/gi).map((match) => match[1]);
  const videoSources = matchAll(html, /<source[^>]*src=["']([^"']+)["']/gi).map((match) => match[1]);
  const sources = [...iframeSources, ...videoSources]
    .map((src) => ensureAbsoluteUrl(BASE_URL, src))
    .filter(Boolean)
    .map((url) => ({ url }));

  return sources;
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
    const data = await parseWatchSources(slug);
    return success(SOURCE, ENDPOINT, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Otakudesu watch sources";
    return failure(SOURCE, ENDPOINT, message);
  }
}
