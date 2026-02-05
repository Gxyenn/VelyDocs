import { successResponse, errorResponse, optionsResponse } from "../_lib/response.js";
import { fetchHtml, extractSection, extractListItems, extractFirstAnchor, extractByClass, toText, ensureAbsoluteUrl } from "../_lib/scrape.js";

export const config = { runtime: "edge" };

const BASE_URL = "https://winbu.tv";
const SOURCE = "Winbu";
const ENDPOINT = "/api/winbu/schedule";

const parseSchedule = async () => {
  const html = await fetchHtml(`${BASE_URL}/schedule/`);
  const schedule: Record<string, Array<{ title: string; time: string | null; slug: string | null }>> = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };

  const dayLabels = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
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
  if (req.method !== "GET") return errorResponse(SOURCE, ENDPOINT, "Method not allowed", 405);

  try {
    const data = await parseSchedule();
    return successResponse(SOURCE, ENDPOINT, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scrape Winbu schedule";
    return errorResponse(SOURCE, ENDPOINT, message, 500);
  }
}
