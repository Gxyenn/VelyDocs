const DEFAULT_VALID_API_KEYS = [
  "velydocs_free_1",
  "velydocs_free_2",
  "gxyenn_public_key",
];

const parseEnvApiKeys = () => {
  const raw = process.env.VELYDOCS_API_KEYS;
  if (!raw) return [];

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const getApiKeyFromRequest = (req: Request) => {
  try {
    const url = new URL(req.url);
    const queryKey =
      url.searchParams.get("apikey") ||
      url.searchParams.get("api_key") ||
      url.searchParams.get("key");

    if (queryKey) return queryKey.trim();
  } catch {
    // Ignore malformed URL and continue with no key.
  }

  return null;
};

export const VALID_API_KEYS = DEFAULT_VALID_API_KEYS;

export function validateApiKey(req: Request) {
  if (process.env.VELYDOCS_DISABLE_API_KEY_CHECK === "true") return true;

  const apiKey = getApiKeyFromRequest(req);
  if (!apiKey) return false;

  const allowedKeys = new Set([...DEFAULT_VALID_API_KEYS, ...parseEnvApiKeys()]);
  return allowedKeys.has(apiKey);
}
