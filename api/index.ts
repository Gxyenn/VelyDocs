import { successResponse } from "../lib/response";

export default async function handler() {
  return successResponse("velydocs", {
    message: "Dynamic scraping API",
    endpoints: [
      "/api/:source/search?q=naruto",
      "/api/:source/anime/:slug",
      "/api/:source/episode/:slug",
      "/api/:source/list/ongoing",
      "/api/:source/list/completed",
    ],
  });
}
