export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
};

export const jsonResponse = (payload: unknown, init: ResponseInit = {}) => {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...(init.headers ?? {}),
    },
  });
};

export const optionsResponse = () => new Response(null, { headers: corsHeaders });

export const errorResponse = (source: string, endpoint: string, message: string, status = 500, details?: unknown) =>
  jsonResponse(
    {
      message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
      author: "Gxyenn",
      status: false,
      source,
      endpoint,
      error: message,
      details,
    },
    { status }
  );

export const successResponse = (source: string, endpoint: string, result: unknown) =>
  jsonResponse({
    message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
    author: "Gxyenn",
    status: true,
    source,
    endpoint,
    result,
  });
