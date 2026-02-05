import { assertValidApiKey } from "../../lib/apikey.js";
import { ApiError } from "../../lib/errors.js";
import { errorResponse, optionsResponse, successResponse } from "../../lib/response.js";
import { search } from "../../lib/scraperEngine.js";
import { SOURCE_REGISTRY } from "../../sources/index.js";

export default async function handler(request: Request, { params }: { params: { source: string } }) {
  if (request.method === "OPTIONS") return optionsResponse();

  try {
    assertValidApiKey(request);
    const source = SOURCE_REGISTRY[params.source as keyof typeof SOURCE_REGISTRY];
    if (!source) throw new ApiError("NOT_FOUND", "Source not found", 404);

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "";

    const result = await search(params.source, source.baseUrl, query);
    return successResponse(params.source, result);
  } catch (error) {
    return errorResponse(error);
  }
}
