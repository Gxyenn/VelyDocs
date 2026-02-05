import { optionsResponse } from "../_lib/response.js";
import { validateApiKey } from "../../lib/apikey.js";
import { failure, success } from "../../lib/response.js";
import { fetchHtml, extractSection, extractListItems, extractFirstAnchor, extractByClass, toText, ensureAbsoluteUrl } from "../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://otakudesu.cloud";
const WELCOME_MESSAGE = "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo";
const AUTHOR = "Gxyenn";
const SOURCE = "otakudesu";
const ENDPOINT = "/api/otakudesu/schedule";

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

const parseSchedule = async () => {
  const html = await fetchHtml(`${BASE_URL}/jadwal-rilis/`);
  const schedule: Record<string, Array<{ title: string; time: string | null; slug: string | null }>> = {
    senin: [],
    selasa: [],
    rabu: [],
    kamis: [],
    jumat: [],
    sabtu: [],
    minggu: [],
  };

  const dayLabels = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];
  const sections = dayLabels.map((day) => ({ day, html: extractSection(html, day) }));

  if (sections.some((section) => section.html)) {
    for (const section of sections) {
      const items = extractListItems(section.html);
      for (const item of items) {
        const anchorMatch = extractFirstAnchor(item[1]);
        const href = ensureAbsoluteUrl(BASE_URL, anchorMatch?.[1]);
        const slug = href ? href.replace(BASE_URL, "").split("/").filter(Boolean).pop() : null;
        const title = toText(anchorMatch?.[2] || item[1]);
        const time = toText(extractByClass(item[1], "time"));
        if (title) schedule[section.day].push({ title, time: time || null, slug });
      }
    }
    return schedule;
  }

  const generalSection = extractSection(html, "schedule") || html;
  const items = extractListItems(generalSection);
  for (const item of items) {
    const itemHtml = item[1];
    const day = toText(extractByClass(itemHtml, "day")).toLowerCase();
    if (!day || !schedule[day]) continue;
    const anchorMatch = extractFirstAnchor(itemHtml);
    const href = ensureAbsoluteUrl(BASE_URL, anchorMatch?.[1]);
    const slug = href ? href.replace(BASE_URL, "").split("/").filter(Boolean).pop() : null;
    const title = toText(anchorMatch?.[2] || itemHtml);
    const time = toText(extractByClass(itemHtml, "time"));
    if (title) schedule[day].push({ title, time: time || null, slug });
  }

  return schedule;
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
    const data = await parseSchedule();
    return success(SOURCE, ENDPOINT, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Otakudesu schedule";
    return failure(SOURCE, ENDPOINT, message);
  }
}
