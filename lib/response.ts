import { ApiError } from "./errors";
import { HttpError } from "./http";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
};

const meta = {
  message: "Welcome to Vely docs, Apikey Streaming Anime Free And Sub indo.",
  Author: "Gxyenn",
};

export const optionsResponse = () => new Response(null, { headers: corsHeaders });

export const successResponse = (source: string, data: unknown) =>
  new Response(
    JSON.stringify({
      VelyDocsData: meta,
      status: true,
      source,
      data,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );

export const errorResponse = (error: unknown) => {
  const payload =
    error instanceof ApiError
      ? { status: false, error_type: error.type, message: error.message }
      : error instanceof HttpError
      ? { status: false, error_type: error.type, message: error.message }
      : { status: false, error_type: "SCRAPING_ERROR", message: "Unexpected scraping failure" };

  const status =
    error instanceof ApiError ? error.status : error instanceof HttpError ? error.status : 500;

  return new Response(JSON.stringify({ VelyDocsData: meta, ...payload }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
};
