import { ApiError } from "./errors";

export const VALID_API_KEYS = [
  "velydocs_free_1",
  "velydocs_free_2",
  "gxyenn_public_key",
];

const getRequestApiKey = (req: Request) => {
  const xApiKey = req.headers.get("x-api-key");
  if (xApiKey) return xApiKey;

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const bearerPrefix = "Bearer ";
  if (authHeader.startsWith(bearerPrefix)) {
    return authHeader.slice(bearerPrefix.length).trim();
  }

  return authHeader.trim();
};

export function validateApiKey(req: Request) {
  const apiKey = getRequestApiKey(req);

  if (!apiKey) {
    return false;
  }

  return VALID_API_KEYS.includes(apiKey);
}

export function assertValidApiKey(req: Request) {
  if (!validateApiKey(req)) {
    throw new ApiError("AUTH_ERROR", "Invalid or missing API key", 401);
  }
}
