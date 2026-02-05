import { normalizeUrl } from "./http";

const providerPatterns: Record<string, RegExp> = {
  doodstream: /dood\./i,
  mp4upload: /mp4upload\./i,
  streamsb: /(streamsb|sbembed|sbplay)/i,
  mixdrop: /mixdrop\./i,
};

const providerName = (url: string) => {
  for (const [provider, pattern] of Object.entries(providerPatterns)) {
    if (pattern.test(url)) return provider;
  }
  return "unknown";
};

export const extractStreams = (html: string, baseUrl: string) => {
  const streamMap = new Map<string, { provider: string; quality: string; url: string }>();

  for (const match of html.matchAll(/<iframe[^>]*src=["']([^"']+)["'][^>]*>/gi)) {
    const url = normalizeUrl(baseUrl, match[1]);
    const provider = providerName(url);
    streamMap.set(url, { provider, quality: "auto", url });
  }

  for (const match of html.matchAll(/['"](https?:\/\/[^'"\s]+(?:m3u8|mp4)[^'"\s]*)['"]/gi)) {
    const url = match[1];
    const quality = url.match(/(1080|720|480|360)p/i)?.[0] ?? "auto";
    const provider = providerName(url);
    streamMap.set(url, { provider, quality, url });
  }

  return Array.from(streamMap.values());
};
