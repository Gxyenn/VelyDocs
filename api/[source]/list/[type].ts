import { assertValidApiKey } from "@lib/apikey";
import { ApiError } from "@lib/errors";
import { errorResponse, optionsResponse, successResponse } from "@lib/response";
import { getListByType } from "@lib/scraperEngine";
import { SOURCE_REGISTRY } from "@sources/index";

export default async function handler(request: Request, { params }: { params: { source: string; type: string } }) {
  if (request.method === "OPTIONS") return optionsResponse();

  try {
    assertValidApiKey(request);
    const source = SOURCE_REGISTRY[params.source as keyof typeof SOURCE_REGISTRY];
    if (!source) throw new ApiError("NOT_FOUND", "Source not found", 404);

    if (params.type !== "ongoing" && params.type !== "completed") {
      throw new ApiError("INVALID_PARAM", "List type must be ongoing or completed", 400);
    }

    const result = await getListByType(params.source, source.baseUrl, params.type);
    return successResponse(params.source, result);
  } catch (error) {
    return errorResponse(error);
  }
}