import { ApiError } from "./errors";

const validApiKeys = (process.env.VELYDOCS_API_KEYS ?? "velydocs_free_1")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const extractBearer = (authorization?: string | null) => {
  if (!authorization) return null;
  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token.trim();
};

export const assertValidApiKey = (request: Request) => {
  const apiKey =
    request.headers.get("x-api-key") ?? extractBearer(request.headers.get("authorization"));

  if (!apiKey || !validApiKeys.includes(apiKey)) {
    throw new ApiError("AUTH_ERROR", "Invalid or missing API key", 401);
  }
};
