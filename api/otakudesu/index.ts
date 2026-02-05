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
const ENDPOINT = "/api/otakudesu";

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

const parseCard = (itemHtml: string) => {
  const anchorMatch = extractFirstAnchor(itemHtml);
  const anchorTag = anchorMatch?.[0] ?? "";
  const href = anchorMatch?.[1] ?? null;
  const title = toText(
    extractHeading(itemHtml) || extractByClass(itemHtml, "judul") || extractAttr(anchorTag, "title") || anchorMatch?.[2]
  );
  const episode = toText(extractByClass(itemHtml, "episode") || extractByClass(itemHtml, "eps"));
  const type = toText(extractByClass(itemHtml, "type"));
  const score = toText(extractByClass(itemHtml, "score") || extractByClass(itemHtml, "rating"));
  const thumb = itemHtml.match(/<img[^>]*(?:data-src|src)=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;
  const thumbnail = ensureAbsoluteUrl(BASE_URL, thumb);
  const resolvedHref = ensureAbsoluteUrl(BASE_URL, href);
  const slug = resolvedHref ? resolvedHref.replace(BASE_URL, "").split("/").filter(Boolean).pop() : null;

  return {
    title,
    slug,
    thumbnail,
    episode: episode || null,
    type: type || null,
    score: score || null,
  };
};

const parseHomepage = async () => {
  const html = await fetchHtml(BASE_URL);
  const ongoingSection = extractSection(html, "venz") || html;
  const ongoingItems = extractListItems(ongoingSection);
  const ongoing = ongoingItems.map((item) => parseCard(item[1])).filter((item) => item.title);

  return ongoing;
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
    const data = await parseHomepage();
    return success(SOURCE, ENDPOINT, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Otakudesu homepage";
    return failure(SOURCE, ENDPOINT, message);
  }
}
