import { optionsResponse } from "../_lib/response.js";
import { validateApiKey } from "../../lib/apikey.js";
import { failure, success } from "../../lib/response.js";
import {
  fetchHtml,
  extractSection,
  extractListItems,
  extractFirstAnchor,
  extractHeading,
  extractByClass,
  extractAttr,
  toText,
  ensureAbsoluteUrl,
} from "../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://otakudesu.cloud";
const WELCOME_MESSAGE = "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo";
const AUTHOR = "Gxyenn";
const SOURCE = "otakudesu";
const ENDPOINT = "/api/otakudesu/ongoing";

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

const parseOngoing = async (page: number) => {
  const url = page > 1 ? `${BASE_URL}/ongoing-anime/page/${page}/` : `${BASE_URL}/ongoing-anime/`;
  const html = await fetchHtml(url);
  const section = extractSection(html, "venz") || html;
  const items = extractListItems(section);

  const results = items
    .map((item) => {
      const itemHtml = item[1];
      const anchorMatch = extractFirstAnchor(itemHtml);
      const anchorTag = anchorMatch?.[0] ?? "";
      const href = ensureAbsoluteUrl(BASE_URL, anchorMatch?.[1]);
      const slug = href ? href.replace(BASE_URL, "").split("/").filter(Boolean).pop() : null;
      const title = toText(
        extractHeading(itemHtml) || extractAttr(anchorTag, "title") || anchorMatch?.[2]
      );
      const episode = toText(extractByClass(itemHtml, "episode") || extractByClass(itemHtml, "eps"));
      const type = toText(extractByClass(itemHtml, "type"));
      const score = toText(extractByClass(itemHtml, "score") || extractByClass(itemHtml, "rating"));
      const thumb = itemHtml.match(/<img[^>]*(?:data-src|src)=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;
      const thumbnail = ensureAbsoluteUrl(BASE_URL, thumb);
      return {
        title,
        slug,
        thumbnail,
        episode: episode || null,
        type: type || null,
        score: score || null,
      };
    })
    .filter((item) => item.title);

  const totalPages = html.match(/class=["']pagination["'][\s\S]*?\/li>/gi)?.length ?? null;
  return { page, totalPages, results };
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
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || "1");
    const currentPage = Number.isNaN(page) || page < 1 ? 1 : page;
    const data = await parseOngoing(currentPage);
    return success(SOURCE, ENDPOINT, data.results, {
      page: currentPage,
      total: data.totalPages,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Otakudesu ongoing list";
    return failure(SOURCE, ENDPOINT, message);
  }
}
