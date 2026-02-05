import { optionsResponse } from "../_lib/response.js";
import { validateApiKey } from "../../lib/apikey.js";
import { failure, success } from "../../lib/response.js";
import { fetchHtml, matchAll, toText } from "../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://otakudesu.cloud";
const WELCOME_MESSAGE = "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo";
const AUTHOR = "Gxyenn";
const SOURCE = "otakudesu";
const ENDPOINT = "/api/otakudesu/genres";

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

const parseGenres = async () => {
  const html = await fetchHtml(`${BASE_URL}/genre-list/`);
  const genres = matchAll(html, /<a[^>]*href=["']([^"']*genres?\/[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)
    .map((match) => {
      const href = match[1];
      const slug = href.split("/").filter(Boolean).pop() ?? null;
      const title = toText(match[2]);
      return title ? { title, slug } : null;
    })
    .filter(Boolean);

  return genres;
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
    const data = await parseGenres();
    return success(SOURCE, ENDPOINT, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Otakudesu genres";
    return failure(SOURCE, ENDPOINT, message);
  }
}
