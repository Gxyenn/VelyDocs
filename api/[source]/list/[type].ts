import { assertValidApiKey } from "../../../lib/apikey.js";
import { ApiError } from "../../../lib/errors.js";
import { errorResponse, optionsResponse, successResponse } from "../../../lib/response.js";
import { getListByType } from "../../../lib/scraperEngine.js";
import { SOURCE_REGISTRY } from "../../../sources/index.js";

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
