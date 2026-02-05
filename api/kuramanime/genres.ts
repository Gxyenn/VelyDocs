import { successResponse, errorResponse, optionsResponse } from "../_lib/response.js";
import { fetchHtml, matchAll, toText } from "../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://kuramanime.boo";
const SOURCE = "Kuramanime";
const ENDPOINT = "/api/kuramanime/genres";

const parseGenres = async () => {
  const html = await fetchHtml(`${BASE_URL}/genres/`);
  const genres = matchAll(html, /<a[^>]*href=["'][^"']*genres?\/[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi)
    .map((match) => toText(match[1]))
    .filter(Boolean);

  return { genres };
};

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return optionsResponse();
  if (req.method !== "GET") return errorResponse(SOURCE, ENDPOINT, "Method not allowed", 405);

  try {
    const data = await parseGenres();
    return successResponse(SOURCE, ENDPOINT, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Kuramanime genres";
    return errorResponse(SOURCE, ENDPOINT, message, 500);
  }
}
