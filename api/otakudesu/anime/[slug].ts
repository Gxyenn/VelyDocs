import { optionsResponse } from "../../_lib/response.js";
import { validateApiKey } from "../../../lib/apikey.js";
import { failure, success } from "../../../lib/response.js";
import {
  fetchHtml,
  extractSection,
  extractListItems,
  extractFirstAnchor,
  extractHeading,
  extractByClass,
  extractJsonLd,
  toText,
  ensureAbsoluteUrl,
} from "../../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://otakudesu.cloud";
const WELCOME_MESSAGE = "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo";
const AUTHOR = "Gxyenn";
const SOURCE = "otakudesu";
const ENDPOINT = "/api/otakudesu/anime/:slug";

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

const parseInfoMap = (html: string) => {
  const infoSection = extractSection(html, "infozingle") || extractSection(html, "infox") || html;
  const items = infoSection.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) ?? [];
  const infoMap = new Map<string, string>();
  for (const item of items) {
    const text = toText(item);
    const [label, value] = text.split(":");
    if (label && value) infoMap.set(label.trim().toLowerCase(), value.trim());
  }
  return infoMap;
};

const parseAnimeDetail = async (slug: string) => {
  const url = slug.startsWith("http") ? slug : `${BASE_URL}/anime/${slug.replace(/^\//, "")}/`;
  const html = await fetchHtml(url);
  const jsonLd = extractJsonLd(html);

  const title =
    toText(jsonLd?.name) ||
    toText(extractHeading(html) || extractByClass(html, "infox") || "");

  const synopsis =
    toText(jsonLd?.description) ||
    toText(extractByClass(html, "sinopc") || extractByClass(html, "sinopsis"));

  const infoMap = parseInfoMap(html);

  const genres = (html.match(/<a[^>]*href=["'][^"']*genre[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi) ?? [])
    .map((match) => toText(match))
    .filter(Boolean);

  const episodeSection = extractSection(html, "episodelist") || html;
  const episodeItems = extractListItems(episodeSection);
  const episodeList = episodeItems.map((item) => {
    const itemHtml = item[1];
    const anchorMatch = extractFirstAnchor(itemHtml);
    const href = ensureAbsoluteUrl(BASE_URL, anchorMatch?.[1]);
    const episodeSlug = href ? href.replace(BASE_URL, "").split("/").filter(Boolean).pop() : null;
    const titleText = toText(anchorMatch?.[2] || extractHeading(itemHtml) || itemHtml);
    const numberMatch = titleText.match(/(\d+(?:\.\d+)?)/);
    return {
      episode_number: numberMatch?.[1] ?? null,
      title: titleText,
      slug: episodeSlug,
    };
  });

  const thumbnail =
    jsonLd?.image ||
    ensureAbsoluteUrl(BASE_URL, html.match(/<img[^>]*class=["'][^"']*thumb[^"']*["'][^>]*src=["']([^"']+)["']/i)?.[1] ?? null);

  return {
    title,
    synopsis,
    score: infoMap.get("skor") || infoMap.get("score") || null,
    studio: infoMap.get("studio") || null,
    episodes: episodeList,
    genres,
    type: infoMap.get("tipe") || null,
    status: infoMap.get("status") || null,
    episode_count: infoMap.get("episode") || infoMap.get("jumlah episode") || null,
    duration: infoMap.get("durasi") || null,
    japanese_title: infoMap.get("judul jepang") || null,
    thumbnail,
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
    const data = await parseAnimeDetail(slug);
    return success(SOURCE, ENDPOINT, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Otakudesu anime detail";
    return failure(SOURCE, ENDPOINT, message);
  }
}
