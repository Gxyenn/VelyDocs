import { ApiError } from "./errors";

export function success(source: string, endpoint: string, result: any, meta = {}) {
  return Response.json({
    message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
    author: "Gxyenn",
    status: true,
    source,
    endpoint,
    result,
    meta,
  });
}

export function failure(source: string, endpoint: string, messageText: string, status = 500) {
  return Response.json(
    {
      message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
      author: "Gxyenn",
      status: false,
      source,
      endpoint,
      error: messageText,
    },
    { status }
  );
}

export function optionsResponse() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
    },
  });
}

export function successResponse(source: string, result: unknown) {
  return success(source, "api", result);
}

export function errorResponse(error: unknown, source = "unknown") {
  if (error instanceof ApiError) {
    return failure(source, "api", error.message, error.status);
  }

  return failure(source, "api", error instanceof Error ? error.message : "Internal server error", 500);
}
