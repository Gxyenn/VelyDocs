export interface Endpoint {
  id: string;
  name: string;
  method: "GET";
  path: string;
  source: string;
  description: string;
  category: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: string;
  }[];
  exampleResponse: object;
  testPath?: string;
}

export interface Source {
  id: string;
  name: string;
  baseUrl: string;
  description: string;
  status: "active" | "maintenance" | "inactive";
  language: string;
  features: string[];
  endpoints: Endpoint[];
}

type SourceSeed = { id: string; name: string; baseUrl: string };

const sourceSeeds: SourceSeed[] = [
  { id: "oploverz", name: "Oploverz", baseUrl: "https://oploverz.top" },
  { id: "animeisme", name: "Animeisme", baseUrl: "https://animeisme.net" },
  { id: "riie", name: "RiiE", baseUrl: "https://riie.jp" },
  { id: "neonime", name: "Neonime", baseUrl: "https://neonime.com" },
  { id: "animeindo", name: "Animeindo", baseUrl: "https://animeindo.my.id" },
  { id: "anibatch", name: "Anibatch", baseUrl: "https://anibatch.me" },
  { id: "samehadaku", name: "Samehadaku", baseUrl: "https://samehadaku.email" },
  { id: "animehade", name: "Animehade", baseUrl: "https://animehade.my.id" },
  { id: "nanime", name: "Nanime", baseUrl: "https://nanime.biz" },
  { id: "otakudesu", name: "Otakudesu", baseUrl: "https://otakudesu.cloud" },
  { id: "anoboy", name: "anoBoy", baseUrl: "https://anoboy.show" },
  { id: "animeyou", name: "AnimeYou", baseUrl: "https://animeyou.net" },
  { id: "myanimeindo", name: "Myanimeindo", baseUrl: "https://myanimeindo.tv" },
  { id: "mangaku", name: "Mangaku", baseUrl: "https://mangaku.lat" },
  { id: "ruangotaku", name: "Ruangotaku", baseUrl: "https://ruangotaku.com" },
  { id: "kotakanime", name: "Kotakanime", baseUrl: "https://kotakanime.com" },
  { id: "animepos", name: "Animepos", baseUrl: "https://animepos.id" },
  { id: "lk21", name: "LK21", baseUrl: "https://lk21official.lol" },
  { id: "gomunime", name: "Gomunime", baseUrl: "https://gomunime.my.id" },
  { id: "awsubs", name: "Awsubs", baseUrl: "https://awsubs.co" },
  { id: "onnime", name: "Onnime", baseUrl: "https://onnime.com" },
  { id: "animenonton", name: "Animenonton", baseUrl: "https://animenonton.com" },
  { id: "kuramanime", name: "Kuramanime", baseUrl: "https://kuramanime.boo" },
  { id: "winbu", name: "Winbu", baseUrl: "https://winbu.tv" },
  { id: "kusonime", name: "Kusonime", baseUrl: "https://kusonime.com" },
  { id: "anixverse", name: "Anixverse", baseUrl: "https://anixverse.com" },
  { id: "anichin", name: "Anichin", baseUrl: "https://anichin.top" },
];

const makeEndpoints = (source: SourceSeed): Endpoint[] => [
  {
    id: `${source.id}-search`,
    name: "Search",
    method: "GET",
    path: `/api/${source.id}/search?q=one+piece`,
    source: source.name,
    category: "Search",
    description: `Cari judul anime pada ${source.name}.`,
    parameters: [{ name: "q", type: "string", required: true, description: "Kata kunci pencarian", example: "one piece" }],
    exampleResponse: { source: source.id, status: "success", data: { query: "one piece", items: [] } },
    testPath: `/api/${source.id}/search?q=naruto`,
  },
  {
    id: `${source.id}-anime`,
    name: "Anime Detail",
    method: "GET",
    path: `/api/${source.id}/anime/:slug`,
    source: source.name,
    category: "Detail",
    description: `Ambil detail anime dari ${source.name}.`,
    parameters: [{ name: "slug", type: "string", required: true, description: "Slug anime", example: "one-piece" }],
    exampleResponse: { source: source.id, status: "success", data: { title: "One Piece", synopsis: null, episodes: [] } },
    testPath: `/api/${source.id}/anime/one-piece`,
  },
  {
    id: `${source.id}-episode`,
    name: "Episode Stream",
    method: "GET",
    path: `/api/${source.id}/episode/:slug`,
    source: source.name,
    category: "Streaming",
    description: `Ambil stream player episode dari ${source.name}.`,
    parameters: [{ name: "slug", type: "string", required: true, description: "Slug episode", example: "one-piece-episode-1" }],
    exampleResponse: { source: source.id, status: "success", data: { title: "Episode", streams: [] } },
    testPath: `/api/${source.id}/episode/one-piece-episode-1`,
  },
  {
    id: `${source.id}-ongoing`,
    name: "Ongoing List",
    method: "GET",
    path: `/api/${source.id}/list/ongoing`,
    source: source.name,
    category: "List",
    description: `Daftar ongoing dari ${source.name}.`,
    exampleResponse: { source: source.id, status: "success", data: { type: "ongoing", items: [] } },
    testPath: `/api/${source.id}/list/ongoing`,
  },
  {
    id: `${source.id}-completed`,
    name: "Completed List",
    method: "GET",
    path: `/api/${source.id}/list/completed`,
    source: source.name,
    category: "List",
    description: `Daftar completed dari ${source.name}.`,
    exampleResponse: { source: source.id, status: "success", data: { type: "completed", items: [] } },
    testPath: `/api/${source.id}/list/completed`,
  },
];

export const sources: Source[] = sourceSeeds.map((seed) => ({
  ...seed,
  description: `Streaming source ${seed.name} dengan endpoint generik hasil scanning struktur website.`,
  status: "active",
  language: "Indonesia",
  features: ["Search", "Anime Detail", "Episode Stream", "Ongoing", "Completed"],
  endpoints: makeEndpoints(seed),
}));

export const getAllEndpoints = () => sources.flatMap((source) => source.endpoints);

export const categories = ["Search", "Detail", "Streaming", "List"];
