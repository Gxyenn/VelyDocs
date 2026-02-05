import { assertValidApiKey } from "../../lib/apikey";
import { ApiError } from "../../lib/errors";
import { errorResponse, optionsResponse, successResponse } from "../../lib/response";
import { getAnime, getEpisode, getListByType, search } from "../../lib/scraperEngine";
import { SOURCE_REGISTRY } from "../../sources";

export default async function handler(request: Request, { params }: { params: { source: string } }) {
  if (request.method === "OPTIONS") return optionsResponse();

  try {
    assertValidApiKey(request);

    const source = SOURCE_REGISTRY[params.source as keyof typeof SOURCE_REGISTRY];
    if (!source) throw new ApiError("NOT_FOUND", "Source not found", 404);

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const animeSlug = searchParams.get("anime")?.trim();
    const episodeSlug = searchParams.get("episode")?.trim();
    const listType = searchParams.get("list")?.trim();

    if (query) {
      const result = await search(params.source, source.baseUrl, query);
      return successResponse(params.source, result);
    }

    if (animeSlug) {
      const result = await getAnime(params.source, source.baseUrl, animeSlug);
      return successResponse(params.source, result);
    }

    if (episodeSlug) {
      const result = await getEpisode(params.source, source.baseUrl, episodeSlug);
      return successResponse(params.source, result);
    }

    if (listType) {
      if (listType !== "ongoing" && listType !== "completed") {
        throw new ApiError("INVALID_PARAM", "List type must be ongoing or completed", 400);
      }

      const result = await getListByType(params.source, source.baseUrl, listType);
      return successResponse(params.source, result);
    }

    const [ongoing, completed] = await Promise.all([
      getListByType(params.source, source.baseUrl, "ongoing"),
      getListByType(params.source, source.baseUrl, "completed"),
    ]);

    return successResponse(params.source, {
      message: "Gunakan query params q, anime, episode, atau list untuk endpoint tunggal ini",
      actions: {
        search: `/api/${params.source}?q=naruto`,
        anime: `/api/${params.source}?anime=one-piece-sub-indo`,
        episode: `/api/${params.source}?episode=one-piece-episode-1100`,
        list: `/api/${params.source}?list=ongoing`,
      },
      ongoing: ongoing.items,
      completed: completed.items,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
