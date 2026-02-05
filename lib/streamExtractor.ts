import { normalizeUrl } from "./http";

const providerPatterns = [
  { key: "Doodstream", pattern: /dood\./i },
  { key: "MP4Upload", pattern: /mp4upload\./i },
  { key: "StreamSB", pattern: /(streamsb|sbembed|sbplay)/i },
  { key: "MixDrop", pattern: /mixdrop\./i },
] as const;

const providerName = (url: string) => {
  for (const provider of providerPatterns) {
    if (provider.pattern.test(url)) return provider.key;
  }
  return "Unknown";
};

export const extractStreams = (html: string, baseUrl: string) => {
  const streamMap = new Map<string, { provider: string; quality: string; url: string }>();

  for (const match of html.matchAll(/<iframe[^>]*src=["']([^"']+)["'][^>]*>/gi)) {
    const url = normalizeUrl(baseUrl, match[1]);
    streamMap.set(url, { provider: providerName(url), quality: "auto", url });
  }

  for (const match of html.matchAll(/["'](https?:\/\/[^"'\s]+(?:m3u8|mp4)[^"'\s]*)["']/gi)) {
    const url = match[1];
    const quality = url.match(/(2160|1440|1080|720|480|360)p/i)?.[0] ?? "auto";
    streamMap.set(url, { provider: providerName(url), quality, url });
  }

  return Array.from(streamMap.values());
};
