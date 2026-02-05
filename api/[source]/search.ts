import { assertValidApiKey } from "@lib/apikey";
import { ApiError } from "@lib/errors";
import { errorResponse, optionsResponse, successResponse } from "@lib/response";
import { search } from "@lib/scraperEngine";
import { SOURCE_REGISTRY } from "@sources/index";

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