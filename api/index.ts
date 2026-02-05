import { successResponse } from "../lib/response";

export default async function handler() {
  return successResponse("velydocs", {
    message: "Dynamic scraping API",
    endpoints: [
      "/api/:source",
      "/api/:source?q=naruto",
      "/api/:source?anime=one-piece-sub-indo",
      "/api/:source?episode=one-piece-episode-1100",
      "/api/:source?list=ongoing",
      "/api/:source/search?q=naruto",
      "/api/:source/anime/:slug",
      "/api/:source/episode/:slug",
      "/api/:source/list/ongoing",
      "/api/:source/list/completed",
    ],
  });
}
