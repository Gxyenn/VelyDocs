export interface Endpoint {
  id: string;
  name: string;
  method: "GET" | "POST";
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
    message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
    author: "Gxyenn",
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

export const sources: Source[] = [
  {
    id: "otakudesu",
    name: "Otakudesu",
    baseUrl: "https://otakudesu.cloud",
    description: "Situs streaming dan download anime subtitle Indonesia terlengkap",
    status: "active",
    language: "Indonesia",
    features: ["Streaming", "Download", "Subtitle Indonesia", "Ongoing", "Completed"],
    endpoints: [
      {
        id: "otakudesu-home",
        name: "Homepage",
        method: "GET",
        path: "/api/otakudesu",
        source: "Otakudesu",
        category: "General",
        description: "Mendapatkan data homepage termasuk anime ongoing dan completed terbaru",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/otakudesu",
          status: true,
          source: "Otakudesu",
          result: {
            ongoing: [
              { title: "One Piece", episode: "1100", slug: "one-piece-sub-indo", thumbnail: "https://...", updated: "2024-01-15" },
              { title: "Jujutsu Kaisen Season 2", episode: "23", slug: "jujutsu-kaisen-s2-sub-indo", thumbnail: "https://...", updated: "2024-01-14" },
            ],
            completed: [
              { title: "Demon Slayer: Kimetsu no Yaiba S3", slug: "kimetsu-no-yaiba-s3" },
            ],
          },
        },
      },
      {
        id: "otakudesu-ongoing",
        name: "Ongoing List",
        method: "GET",
        path: "/api/otakudesu/ongoing",
        source: "Otakudesu",
        category: "List",
        description: "Mendapatkan daftar semua anime yang sedang ongoing",
        parameters: [
          { name: "page", type: "number", required: false, description: "Nomor halaman (default: 1)", example: "1" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/otakudesu/ongoing",
          status: true,
          source: "Otakudesu",
          result: [
            { title: "One Piece", slug: "one-piece-sub-indo", episode: "1100", day: "Minggu" },
            { title: "Boruto: Naruto Next Generations", slug: "boruto-sub-indo", episode: "293", day: "Minggu" },
          ],
          meta: {
            page: 1,
            total: 15,
          },
        },
      },
      {
        id: "otakudesu-completed",
        name: "Completed List",
        method: "GET",
        path: "/api/otakudesu/completed",
        source: "Otakudesu",
        category: "List",
        description: "Mendapatkan daftar anime yang sudah tamat",
        parameters: [
          { name: "page", type: "number", required: false, description: "Nomor halaman (default: 1)", example: "1" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/otakudesu/completed",
          status: true,
          source: "Otakudesu",
          result: [
            { title: "Attack on Titan Final Season", slug: "shingeki-no-kyojin-final", episodes: "16", score: "9.1" },
          ],
          meta: {
            page: 1,
            total: 100,
          },
        },
      },
      {
        id: "otakudesu-search",
        name: "Search Anime",
        method: "GET",
        path: "/api/otakudesu/search",
        source: "Otakudesu",
        category: "Search",
        description: "Mencari anime berdasarkan judul",
        parameters: [
          { name: "q", type: "string", required: true, description: "Kata kunci pencarian", example: "one piece" },
          { name: "page", type: "number", required: false, description: "Nomor halaman (default: 1)", example: "1" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/otakudesu/search",
          status: true,
          source: "Otakudesu",
          result: [
            { title: "One Piece", slug: "one-piece-sub-indo", genres: ["Action", "Adventure", "Comedy"], status: "Ongoing", score: "9.0" },
            { title: "One Piece Film: Red", slug: "one-piece-film-red", genres: ["Action", "Fantasy"], status: "Movie", score: "8.5" },
          ],
          meta: {
            page: 1,
            total: 20,
            query: "one piece",
          },
        },
      },
      {
        id: "otakudesu-detail",
        name: "Anime Detail",
        method: "GET",
        path: "/api/otakudesu/anime/:slug",
        source: "Otakudesu",
        category: "Detail",
        description: "Mendapatkan detail lengkap anime termasuk sinopsis, genre, dan daftar episode",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug/ID anime", example: "one-piece-sub-indo" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/otakudesu/anime/:slug",
          status: true,
          source: "Otakudesu",
          result: {
            title: "One Piece",
            japaneseTitle: "ワンピース",
            synopsis: "Monkey D. Luffy adalah seorang pemuda yang bercita-cita menjadi Raja Bajak Laut...",
            genres: ["Action", "Adventure", "Comedy", "Fantasy", "Shounen"],
            status: "Ongoing",
            type: "TV",
            episodes: "1100",
            duration: "24 min per ep",
            studio: "Toei Animation",
            score: "9.0",
            thumbnail: "https://...",
            episodeList: [
              { number: 1100, title: "Episode 1100", slug: "one-piece-episode-1100" },
              { number: 1099, title: "Episode 1099", slug: "one-piece-episode-1099" },
            ],
          },
        },
      },
      {
        id: "otakudesu-episode",
        name: "Episode Stream",
        method: "GET",
        path: "/api/otakudesu/episode/:slug",
        source: "Otakudesu",
        category: "Stream",
        description: "Mendapatkan link streaming dan download untuk episode tertentu",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug episode", example: "one-piece-episode-1100" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/otakudesu/episode/:slug",
          status: true,
          source: "Otakudesu",
          result: {
            title: "One Piece Episode 1100",
            streams: [
              { server: "Streamtape", url: "https://..." },
              { server: "Doodstream", url: "https://..." },
              { server: "MP4Upload", url: "https://..." },
            ],
            downloads: [
              { label: "360p - 50MB", url: "https://..." },
              { label: "480p - 90MB", url: "https://..." },
              { label: "720p - 150MB", url: "https://..." },
            ],
            prev: "one-piece-episode-1099",
            next: null,
          },
        },
      },
      {
        id: "otakudesu-watch",
        name: "Watch Sources",
        method: "GET",
        path: "/api/otakudesu/watch/:slug",
        source: "Otakudesu",
        category: "Stream",
        description: "Mendapatkan sumber video dari halaman episode",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug episode", example: "one-piece-episode-1100" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/otakudesu/watch/:slug",
          status: true,
          source: "Otakudesu",
          result: [
            { url: "https://..." },
            { url: "https://..." },
          ],
        },
      },
      {
        id: "otakudesu-genre",
        name: "Genre List",
        method: "GET",
        path: "/api/otakudesu/genres",
        source: "Otakudesu",
        category: "List",
        description: "Mendapatkan daftar semua genre yang tersedia",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/otakudesu/genres",
          status: true,
          source: "Otakudesu",
          result: {
            genres: ["Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Harem", "Horror", "Isekai", "Mecha", "Music", "Mystery", "Psychological", "Romance", "School", "Sci-Fi", "Shoujo", "Shounen", "Slice of Life", "Sports", "Supernatural", "Thriller"],
          },
        },
      },
      {
        id: "otakudesu-genre-anime",
        name: "Anime by Genre",
        method: "GET",
        path: "/api/otakudesu/genre/:genre",
        source: "Otakudesu",
        category: "List",
        description: "Mendapatkan daftar anime berdasarkan genre",
        parameters: [
          { name: "genre", type: "string", required: true, description: "Nama genre (lowercase)", example: "action" },
          { name: "page", type: "number", required: false, description: "Nomor halaman" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/otakudesu/genre/:genre",
          status: true,
          source: "Otakudesu",
          result: [
            { title: "One Piece", slug: "one-piece-sub-indo", status: "Ongoing" },
            { title: "Naruto Shippuden", slug: "naruto-shippuden-sub-indo", status: "Completed" },
          ],
          meta: {
            page: 1,
            total: null,
            genre: "action",
          },
        },
      },
      {
        id: "otakudesu-schedule",
        name: "Jadwal Rilis",
        method: "GET",
        path: "/api/otakudesu/schedule",
        source: "Otakudesu",
        category: "Schedule",
        description: "Mendapatkan jadwal rilis anime mingguan",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/otakudesu/schedule",
          status: true,
          source: "Otakudesu",
          result: {
            senin: [{ title: "Spy x Family S2", time: "22:00", slug: "spy-x-family-s2" }],
            selasa: [{ title: "Frieren", time: "23:00", slug: "frieren-sub-indo" }],
            rabu: [],
            kamis: [{ title: "Jujutsu Kaisen S2", time: "00:00", slug: "jujutsu-kaisen-s2" }],
            jumat: [],
            sabtu: [{ title: "Dr. Stone S3", time: "22:30", slug: "dr-stone-s3" }],
            minggu: [{ title: "One Piece", time: "09:30", slug: "one-piece-sub-indo" }],
          },
        },
      },
    ],
  },
  {
    id: "samehadaku",
    name: "Samehadaku",
    baseUrl: "https://samehadaku.email",
    description: "Situs download dan streaming anime subtitle Indonesia populer",
    status: "active",
    language: "Indonesia",
    features: ["Streaming", "Download", "Batch Download", "Subtitle Indonesia"],
    endpoints: [
      {
        id: "samehadaku-home",
        name: "Homepage",
        method: "GET",
        path: "/api/samehadaku",
        source: "Samehadaku",
        category: "General",
        description: "Mendapatkan data homepage Samehadaku",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/samehadaku",
          status: true,
          source: "Samehadaku",
          result: {
            latest: [
              { title: "One Piece Episode 1100", slug: "one-piece-episode-1100", thumbnail: "https://..." },
            ],
            popular: [
              { title: "Jujutsu Kaisen", slug: "jujutsu-kaisen", views: "1.5M" },
            ],
          },
        },
      },
      {
        id: "samehadaku-search",
        name: "Search",
        method: "GET",
        path: "/api/samehadaku/search",
        source: "Samehadaku",
        category: "Search",
        description: "Mencari anime di Samehadaku",
        parameters: [
          { name: "q", type: "string", required: true, description: "Kata kunci pencarian" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/samehadaku/search",
          status: true,
          source: "Samehadaku",
          result: {
            query: "naruto",
            results: [
              { title: "Naruto Shippuden", slug: "naruto-shippuden", type: "TV", status: "Completed" },
              { title: "Naruto", slug: "naruto", type: "TV", status: "Completed" },
            ],
          },
        },
      },
      {
        id: "samehadaku-anime",
        name: "Anime Detail",
        method: "GET",
        path: "/api/samehadaku/anime/:slug",
        source: "Samehadaku",
        category: "Detail",
        description: "Mendapatkan detail anime dari Samehadaku",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug anime" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/samehadaku/anime/:slug",
          status: true,
          source: "Samehadaku",
          result: {
            title: "Naruto Shippuden",
            synopsis: "Naruto Shippuden adalah kelanjutan dari serial Naruto...",
            genres: ["Action", "Adventure", "Martial Arts", "Shounen"],
            episodes: "500",
            status: "Completed",
            score: "8.7",
          },
        },
      },
      {
        id: "samehadaku-episode",
        name: "Episode Detail",
        method: "GET",
        path: "/api/samehadaku/episode/:slug",
        source: "Samehadaku",
        category: "Stream",
        description: "Mendapatkan link streaming dan download episode",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug episode" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/samehadaku/episode/:slug",
          status: true,
          source: "Samehadaku",
          result: {
            title: "Naruto Shippuden Episode 500",
            streams: [
              { server: "Streamtape", url: "https://..." },
              { server: "Mirror", url: "https://..." },
            ],
            downloads: [
              { label: "480p - MKV", url: "https://..." },
              { label: "720p - MKV", url: "https://..." },
            ],
          },
        },
      },
      {
        id: "samehadaku-batch",
        name: "Batch Download",
        method: "GET",
        path: "/api/samehadaku/batch/:slug",
        source: "Samehadaku",
        category: "Download",
        description: "Mendapatkan link batch download untuk anime lengkap",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug anime" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/samehadaku/batch/:slug",
          status: true,
          source: "Samehadaku",
          result: {
            title: "Demon Slayer: Kimetsu no Yaiba",
            batches: [
              { label: "480p - 2.5GB (1-26)", url: "https://..." },
              { label: "720p - 5GB (1-26)", url: "https://..." },
              { label: "1080p - 10GB (1-26)", url: "https://..." },
            ],
          },
        },
      },
    ],
  },
  {
    id: "kuramanime",
    name: "Kuramanime",
    baseUrl: "https://kuramanime.boo",
    description: "Streaming anime dengan banyak pilihan server dan kualitas",
    status: "active",
    language: "Indonesia",
    features: ["Streaming", "Multi-Server", "HD Quality", "Subtitle Indonesia"],
    endpoints: [
      {
        id: "kuramanime-home",
        name: "Homepage",
        method: "GET",
        path: "/api/kuramanime",
        source: "Kuramanime",
        category: "General",
        description: "Mendapatkan data homepage Kuramanime",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/kuramanime",
          status: true,
          source: "Kuramanime",
          result: {
            featured: [
              { title: "Solo Leveling", slug: "solo-leveling", thumbnail: "https://..." },
            ],
            latest: [
              { title: "One Piece Episode 1100", slug: "one-piece-1100", time: "2 hours ago" },
            ],
            popular: [
              { title: "Jujutsu Kaisen", views: "500K", slug: "jujutsu-kaisen" },
            ],
          },
        },
      },
      {
        id: "kuramanime-schedule",
        name: "Jadwal Rilis",
        method: "GET",
        path: "/api/kuramanime/schedule",
        source: "Kuramanime",
        category: "Schedule",
        description: "Mendapatkan jadwal rilis anime mingguan",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/kuramanime/schedule",
          status: true,
          source: "Kuramanime",
          result: {
            monday: [{ title: "Spy x Family", time: "22:00", slug: "spy-x-family" }],
            tuesday: [{ title: "Frieren", time: "23:00", slug: "frieren-sub-indo" }],
            wednesday: [],
            thursday: [{ title: "Jujutsu Kaisen", time: "00:00", slug: "jujutsu-kaisen" }],
            friday: [{ title: "Oshi no Ko", time: "23:00", slug: "oshi-no-ko" }],
            saturday: [{ title: "Dr. Stone", time: "22:30", slug: "dr-stone" }],
            sunday: [{ title: "One Piece", time: "09:30", slug: "one-piece" }],
          },
        },
      },
      {
        id: "kuramanime-search",
        name: "Search",
        method: "GET",
        path: "/api/kuramanime/search",
        source: "Kuramanime",
        category: "Search",
        description: "Mencari anime di Kuramanime",
        parameters: [
          { name: "q", type: "string", required: true, description: "Kata kunci pencarian" },
          { name: "type", type: "string", required: false, description: "Filter: TV, Movie, OVA, ONA, Special" },
          { name: "status", type: "string", required: false, description: "Filter: ongoing, completed" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/kuramanime/search",
          status: true,
          source: "Kuramanime",
          result: {
            results: [
              { title: "Solo Leveling", slug: "solo-leveling", type: "TV", status: "Ongoing", score: "8.9" },
            ],
          },
        },
      },
      {
        id: "kuramanime-anime",
        name: "Anime Detail",
        method: "GET",
        path: "/api/kuramanime/anime/:slug",
        source: "Kuramanime",
        category: "Detail",
        description: "Mendapatkan detail anime",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug anime" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/kuramanime/anime/:slug",
          status: true,
          source: "Kuramanime",
          result: {
            title: "Solo Leveling",
            japaneseTitle: "俺だけレベルアップな件",
            synopsis: "Sung Jin-Woo adalah hunter rank-E terlemah...",
            genres: ["Action", "Adventure", "Fantasy"],
            type: "TV",
            episodes: "12",
            status: "Ongoing",
            studio: "A-1 Pictures",
            score: "8.9",
            episodeList: [
              { number: 12, title: "Arise", slug: "solo-leveling-12" },
            ],
          },
        },
      },
      {
        id: "kuramanime-episode",
        name: "Episode Stream",
        method: "GET",
        path: "/api/kuramanime/episode/:slug",
        source: "Kuramanime",
        category: "Stream",
        description: "Mendapatkan link streaming episode",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug episode" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/kuramanime/episode/:slug",
          status: true,
          source: "Kuramanime",
          result: {
            title: "Solo Leveling Episode 12",
            servers: [
              { name: "Kuramadrive", url: "https://..." },
              { name: "Streamtape", url: "https://..." },
              { name: "Doodstream", url: "https://..." },
              { name: "Filelions", url: "https://..." },
            ],
          },
        },
      },
      {
        id: "kuramanime-genres",
        name: "Genre List",
        method: "GET",
        path: "/api/kuramanime/genres",
        source: "Kuramanime",
        category: "List",
        description: "Mendapatkan daftar genre",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/kuramanime/genres",
          status: true,
          source: "Kuramanime",
          result: {
            genres: ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Isekai", "Mecha", "Music", "Mystery", "Psychological", "Romance", "School", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"],
          },
        },
      },
    ],
  },
  {
    id: "winbu",
    name: "Winbu",
    baseUrl: "https://winbu.tv",
    description: "Streaming anime subtitle Indonesia dengan jadwal rilis",
    status: "active",
    language: "Indonesia",
    features: ["Streaming", "Schedule", "Subtitle Indonesia"],
    endpoints: [
      {
        id: "winbu-home",
        name: "Homepage",
        method: "GET",
        path: "/api/winbu",
        source: "Winbu",
        category: "General",
        description: "Mendapatkan data homepage Winbu",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/winbu",
          status: true,
          source: "Winbu",
          result: {
            latest: [
              { title: "One Piece Episode 1100", slug: "one-piece-episode-1100", thumbnail: "https://..." },
            ],
            popular: [
              { title: "Jujutsu Kaisen", slug: "jujutsu-kaisen", views: "1.2M" },
            ],
          },
        },
      },
      {
        id: "winbu-movies",
        name: "Movies",
        method: "GET",
        path: "/api/winbu/movies",
        source: "Winbu",
        category: "List",
        description: "Mendapatkan daftar movie dari halaman /movies",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/winbu/movies",
          status: true,
          source: "Winbu",
          result: [
            { title: "Sword Art Online Movie", slug: "sword-art-online-movie", thumbnail: "https://..." },
          ],
        },
      },
      {
        id: "winbu-search",
        name: "Search",
        method: "GET",
        path: "/api/winbu/search",
        source: "Winbu",
        category: "Search",
        description: "Mencari anime di Winbu",
        parameters: [
          { name: "q", type: "string", required: true, description: "Kata kunci pencarian" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/winbu/search",
          status: true,
          source: "Winbu",
          result: {
            query: "naruto",
            results: [
              { title: "Naruto Shippuden", slug: "naruto-shippuden", type: "TV", status: "Completed" },
            ],
          },
        },
      },
      {
        id: "winbu-anime",
        name: "Anime Detail",
        method: "GET",
        path: "/api/winbu/anime/:slug",
        source: "Winbu",
        category: "Detail",
        description: "Mendapatkan detail anime",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug anime" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/winbu/anime/:slug",
          status: true,
          source: "Winbu",
          result: {
            title: "One Piece",
            synopsis: "Monkey D. Luffy adalah seorang pemuda...",
            genres: ["Action", "Adventure"],
            episodes: "1100",
            status: "Ongoing",
            episodeList: [
              { number: 1100, title: "Episode 1100", slug: "one-piece-episode-1100" },
            ],
          },
        },
      },
      {
        id: "winbu-episode",
        name: "Episode Stream",
        method: "GET",
        path: "/api/winbu/episode/:slug",
        source: "Winbu",
        category: "Stream",
        description: "Mendapatkan link streaming dan download episode",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug episode" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/winbu/episode/:slug",
          status: true,
          source: "Winbu",
          result: {
            title: "One Piece Episode 1100",
            streams: [
              { server: "Streamtape", url: "https://..." },
            ],
            downloads: [
              { label: "720p - 150MB", url: "https://..." },
            ],
          },
        },
      },
      {
        id: "winbu-genres",
        name: "Genre List",
        method: "GET",
        path: "/api/winbu/genres",
        source: "Winbu",
        category: "List",
        description: "Mendapatkan daftar genre",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/winbu/genres",
          status: true,
          source: "Winbu",
          result: {
            genres: ["Action", "Adventure", "Comedy", "Drama"],
          },
        },
      },
      {
        id: "winbu-schedule",
        name: "Jadwal Rilis",
        method: "GET",
        path: "/api/winbu/schedule",
        source: "Winbu",
        category: "Schedule",
        description: "Mendapatkan jadwal rilis anime mingguan",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/winbu/schedule",
          status: true,
          source: "Winbu",
          result: {
            monday: [{ title: "Spy x Family", time: "22:00", slug: "spy-x-family" }],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [{ title: "One Piece", time: "09:30", slug: "one-piece" }],
          },
        },
      },
    ],
  },
  {
    id: "oploverz",
    name: "Oploverz",
    baseUrl: "https://oploverz.top",
    description: "Situs streaming dan download anime dengan kualitas tinggi",
    status: "active",
    language: "Indonesia",
    features: ["Streaming", "Download", "720p/1080p", "Subtitle Indonesia"],
    endpoints: [
      {
        id: "oploverz-home",
        name: "Homepage",
        method: "GET",
        path: "/api/oploverz",
        source: "Oploverz",
        category: "General",
        description: "Mendapatkan data homepage",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/oploverz",
          status: true,
          source: "Oploverz",
          result: {
            latest: [
              { title: "One Piece Episode 1100", slug: "one-piece-episode-1100", thumbnail: "https://..." },
            ],
            popular: [
              { title: "Jujutsu Kaisen", slug: "jujutsu-kaisen", views: "900K" },
            ],
          },
        },
      },
      {
        id: "oploverz-search",
        name: "Search",
        method: "GET",
        path: "/api/oploverz/search",
        source: "Oploverz",
        category: "Search",
        description: "Mencari anime",
        parameters: [
          { name: "q", type: "string", required: true, description: "Kata kunci pencarian" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/oploverz/search",
          status: true,
          source: "Oploverz",
          result: {
            query: "naruto",
            results: [
              { title: "Naruto Shippuden", slug: "naruto-shippuden", type: "TV", status: "Completed" },
            ],
          },
        },
      },
      {
        id: "oploverz-anime",
        name: "Anime Detail",
        method: "GET",
        path: "/api/oploverz/anime/:slug",
        source: "Oploverz",
        category: "Detail",
        description: "Mendapatkan detail anime",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug anime" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/oploverz/anime/:slug",
          status: true,
          source: "Oploverz",
          result: {
            title: "Naruto Shippuden",
            synopsis: "Naruto Shippuden adalah kelanjutan dari serial Naruto...",
            genres: ["Action", "Adventure"],
            episodes: "500",
            status: "Completed",
            episodeList: [
              { number: 500, title: "Episode 500", slug: "naruto-shippuden-500" },
            ],
          },
        },
      },
      {
        id: "oploverz-episode",
        name: "Episode Stream",
        method: "GET",
        path: "/api/oploverz/episode/:slug",
        source: "Oploverz",
        category: "Stream",
        description: "Mendapatkan link streaming",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug episode" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/oploverz/episode/:slug",
          status: true,
          source: "Oploverz",
          result: {
            title: "Naruto Shippuden Episode 500",
            streams: [
              { server: "Streamtape", url: "https://..." },
            ],
            downloads: [
              { label: "720p - 150MB", url: "https://..." },
            ],
          },
        },
      },
      {
        id: "oploverz-batch",
        name: "Batch Download",
        method: "GET",
        path: "/api/oploverz/batch/:slug",
        source: "Oploverz",
        category: "Download",
        description: "Mendapatkan link batch download",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug batch" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/oploverz/batch/:slug",
          status: true,
          source: "Oploverz",
          result: {
            title: "Demon Slayer: Kimetsu no Yaiba",
            batches: [
              { label: "480p - 2.5GB (1-26)", url: "https://..." },
            ],
          },
        },
      },
      {
        id: "oploverz-genres",
        name: "Genre List",
        method: "GET",
        path: "/api/oploverz/genres",
        source: "Oploverz",
        category: "List",
        description: "Mendapatkan daftar genre",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/oploverz/genres",
          status: true,
          source: "Oploverz",
          result: {
            genres: ["Action", "Adventure", "Comedy", "Drama"],
          },
        },
      },
    ],
  },
  {
    id: "kusonime",
    name: "Kusonime",
    baseUrl: "https://kusonime.com",
    description: "Situs batch download anime dengan berbagai kualitas",
    status: "active",
    language: "Indonesia",
    features: ["Batch Download", "Encode Sendiri", "Multiple Quality"],
    endpoints: [
      {
        id: "kusonime-home",
        name: "Homepage",
        method: "GET",
        path: "/api/kusonime",
        source: "Kusonime",
        category: "General",
        description: "Mendapatkan data homepage",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/kusonime",
          status: true,
          source: "Kusonime",
          result: {
            latest: [
              { title: "Solo Leveling Batch", slug: "solo-leveling-batch", thumbnail: "https://..." },
            ],
            recommended: [
              { title: "Frieren Batch", slug: "frieren-batch" },
            ],
          },
        },
      },
      {
        id: "kusonime-search",
        name: "Search",
        method: "GET",
        path: "/api/kusonime/search",
        source: "Kusonime",
        category: "Search",
        description: "Mencari anime batch",
        parameters: [
          { name: "q", type: "string", required: true, description: "Kata kunci pencarian" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/kusonime/search",
          status: true,
          source: "Kusonime",
          result: {
            query: "naruto",
            results: [
              { title: "Naruto Shippuden Batch", slug: "naruto-shippuden-batch" },
            ],
          },
        },
      },
      {
        id: "kusonime-anime",
        name: "Anime Batch",
        method: "GET",
        path: "/api/kusonime/anime/:slug",
        source: "Kusonime",
        category: "Detail",
        description: "Mendapatkan detail dan link batch download",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug anime" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/kusonime/anime/:slug",
          status: true,
          source: "Kusonime",
          result: {
            title: "Naruto Shippuden",
            synopsis: "Naruto Shippuden adalah kelanjutan dari serial Naruto...",
            downloads: [
              { quality: "480p", size: "2.5GB", links: [{ label: "Google Drive", url: "https://..." }] },
              { quality: "720p", size: "5GB", links: [{ label: "Google Drive", url: "https://..." }] },
            ],
          },
        },
      },
    ],
  },
  {
    id: "anixverse",
    name: "Anixverse",
    baseUrl: "https://anixverse.com",
    description: "Platform anime dengan fitur modern dan UI yang bagus",
    status: "active",
    language: "Indonesia",
    features: ["Streaming", "Watchlist", "Comments", "Modern UI"],
    endpoints: [
      {
        id: "anixverse-home",
        name: "Homepage",
        method: "GET",
        path: "/api/anixverse",
        source: "Anixverse",
        category: "General",
        description: "Mendapatkan data homepage",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/anixverse",
          status: true,
          source: "Anixverse",
          result: {
            trending: [
              { title: "Jujutsu Kaisen", slug: "jujutsu-kaisen" },
            ],
            latest: [
              { title: "Solo Leveling", slug: "solo-leveling", thumbnail: "https://..." },
            ],
            popular: [
              { title: "One Piece", slug: "one-piece" },
            ],
          },
        },
      },
      {
        id: "anixverse-search",
        name: "Search",
        method: "GET",
        path: "/api/anixverse/search",
        source: "Anixverse",
        category: "Search",
        description: "Mencari anime",
        parameters: [
          { name: "q", type: "string", required: true, description: "Kata kunci" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/anixverse/search",
          status: true,
          source: "Anixverse",
          result: {
            query: "naruto",
            results: [
              { title: "Naruto Shippuden", slug: "naruto-shippuden", type: "TV", status: "Completed" },
            ],
          },
        },
      },
      {
        id: "anixverse-anime",
        name: "Anime Detail",
        method: "GET",
        path: "/api/anixverse/anime/:slug",
        source: "Anixverse",
        category: "Detail",
        description: "Mendapatkan detail anime",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug anime" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/anixverse/anime/:slug",
          status: true,
          source: "Anixverse",
          result: {
            title: "Solo Leveling",
            synopsis: "Sung Jin-Woo adalah hunter rank-E terlemah...",
            genres: ["Action", "Adventure", "Fantasy"],
            episodes: "12",
            status: "Ongoing",
            episodeList: [
              { number: 12, title: "Arise", slug: "solo-leveling-12" },
            ],
          },
        },
      },
      {
        id: "anixverse-episode",
        name: "Episode Stream",
        method: "GET",
        path: "/api/anixverse/watch/:slug",
        source: "Anixverse",
        category: "Stream",
        description: "Mendapatkan link streaming",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug episode" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/anixverse/watch/:slug",
          status: true,
          source: "Anixverse",
          result: {
            title: "Solo Leveling Episode 12",
            streams: [
              { server: "Streamtape", url: "https://..." },
            ],
          },
        },
      },
      {
        id: "anixverse-genres",
        name: "Genre List",
        method: "GET",
        path: "/api/anixverse/genres",
        source: "Anixverse",
        category: "List",
        description: "Mendapatkan daftar genre",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/anixverse/genres",
          status: true,
          source: "Anixverse",
          result: {
            genres: ["Action", "Adventure", "Comedy", "Drama"],
          },
        },
      },
    ],
  },
  {
    id: "nanime",
    name: "Nanime",
    baseUrl: "https://nanime.biz",
    description: "Nonton anime subtitle Indonesia gratis",
    status: "active",
    language: "Indonesia",
    features: ["Streaming", "Multi-Server", "Subtitle Indonesia"],
    endpoints: [
      {
        id: "nanime-home",
        name: "Homepage",
        method: "GET",
        path: "/api/nanime",
        source: "Nanime",
        category: "General",
        description: "Mendapatkan data homepage",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/nanime",
          status: true,
          source: "Nanime",
          result: {
            latest: [
              { title: "One Piece Episode 1100", slug: "one-piece-episode-1100", thumbnail: "https://..." },
            ],
            trending: [
              { title: "Jujutsu Kaisen", slug: "jujutsu-kaisen" },
            ],
          },
        },
      },
      {
        id: "nanime-search",
        name: "Search",
        method: "GET",
        path: "/api/nanime/search",
        source: "Nanime",
        category: "Search",
        description: "Mencari anime",
        parameters: [
          { name: "q", type: "string", required: true, description: "Kata kunci" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/nanime/search",
          status: true,
          source: "Nanime",
          result: {
            query: "naruto",
            results: [
              { title: "Naruto Shippuden", slug: "naruto-shippuden", type: "TV", status: "Completed" },
            ],
          },
        },
      },
      {
        id: "nanime-anime",
        name: "Anime Detail",
        method: "GET",
        path: "/api/nanime/anime/:slug",
        source: "Nanime",
        category: "Detail",
        description: "Mendapatkan detail anime",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug anime" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/nanime/anime/:slug",
          status: true,
          source: "Nanime",
          result: {
            title: "Naruto Shippuden",
            synopsis: "Naruto Shippuden adalah kelanjutan dari serial Naruto...",
            genres: ["Action", "Adventure"],
            episodes: "500",
            status: "Completed",
            episodeList: [
              { number: 500, title: "Episode 500", slug: "naruto-shippuden-500" },
            ],
          },
        },
      },
      {
        id: "nanime-episode",
        name: "Episode Stream",
        method: "GET",
        path: "/api/nanime/episode/:slug",
        source: "Nanime",
        category: "Stream",
        description: "Mendapatkan link streaming",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug episode" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/nanime/episode/:slug",
          status: true,
          source: "Nanime",
          result: {
            title: "Naruto Shippuden Episode 500",
            streams: [
              { server: "Streamtape", url: "https://..." },
            ],
          },
        },
      },
      {
        id: "nanime-genres",
        name: "Genre List",
        method: "GET",
        path: "/api/nanime/genres",
        source: "Nanime",
        category: "List",
        description: "Mendapatkan daftar genre",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/nanime/genres",
          status: true,
          source: "Nanime",
          result: {
            genres: ["Action", "Adventure", "Comedy", "Drama"],
          },
        },
      },
    ],
  },
  {
    id: "gomunime",
    name: "Gomunime",
    baseUrl: "https://gomunime.my.id",
    description: "Streaming anime dengan tampilan simpel",
    status: "active",
    language: "Indonesia",
    features: ["Streaming", "Simple UI"],
    endpoints: [
      {
        id: "gomunime-home",
        name: "Homepage",
        method: "GET",
        path: "/api/gomunime",
        source: "Gomunime",
        category: "General",
        description: "Mendapatkan data homepage",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/gomunime",
          status: true,
          source: "Gomunime",
          result: {
            latest: [
              { title: "One Piece Episode 1100", slug: "one-piece-episode-1100", thumbnail: "https://..." },
            ],
          },
        },
      },
      {
        id: "gomunime-search",
        name: "Search",
        method: "GET",
        path: "/api/gomunime/search",
        source: "Gomunime",
        category: "Search",
        description: "Mencari anime",
        parameters: [
          { name: "q", type: "string", required: true, description: "Kata kunci" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/gomunime/search",
          status: true,
          source: "Gomunime",
          result: {
            query: "naruto",
            results: [
              { title: "Naruto Shippuden", slug: "naruto-shippuden" },
            ],
          },
        },
      },
      {
        id: "gomunime-anime",
        name: "Anime Detail",
        method: "GET",
        path: "/api/gomunime/anime/:slug",
        source: "Gomunime",
        category: "Detail",
        description: "Mendapatkan detail anime",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug anime" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/gomunime/anime/:slug",
          status: true,
          source: "Gomunime",
          result: {
            title: "Naruto Shippuden",
            synopsis: "Naruto Shippuden adalah kelanjutan dari serial Naruto...",
            genres: ["Action", "Adventure"],
            episodes: "500",
            status: "Completed",
            episodeList: [
              { number: 500, title: "Episode 500", slug: "naruto-shippuden-500" },
            ],
          },
        },
      },
      {
        id: "gomunime-episode",
        name: "Episode Stream",
        method: "GET",
        path: "/api/gomunime/episode/:slug",
        source: "Gomunime",
        category: "Stream",
        description: "Mendapatkan link streaming",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug episode" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/gomunime/episode/:slug",
          status: true,
          source: "Gomunime",
          result: {
            title: "Naruto Shippuden Episode 500",
            streams: [
              { server: "Streamtape", url: "https://..." },
            ],
          },
        },
      },
      {
        id: "gomunime-genres",
        name: "Genre List",
        method: "GET",
        path: "/api/gomunime/genres",
        source: "Gomunime",
        category: "List",
        description: "Mendapatkan daftar genre",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/gomunime/genres",
          status: true,
          source: "Gomunime",
          result: {
            genres: ["Action", "Adventure", "Comedy", "Drama"],
          },
        },
      },
    ],
  },
  {
    id: "animeindo",
    name: "AnimeIndo",
    baseUrl: "https://animeindo.my.id",
    description: "Streaming anime bahasa Indonesia",
    status: "active",
    language: "Indonesia",
    features: ["Streaming", "Subtitle Indonesia"],
    endpoints: [
      {
        id: "animeindo-home",
        name: "Homepage",
        method: "GET",
        path: "/api/animeindo",
        source: "AnimeIndo",
        category: "General",
        description: "Mendapatkan data homepage",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/animeindo",
          status: true,
          source: "AnimeIndo",
          result: {
            latest: [
              { title: "One Piece Episode 1100", slug: "one-piece-episode-1100", thumbnail: "https://..." },
            ],
            ongoing: [
              { title: "Jujutsu Kaisen", slug: "jujutsu-kaisen" },
            ],
          },
        },
      },
      {
        id: "animeindo-search",
        name: "Search",
        method: "GET",
        path: "/api/animeindo/search",
        source: "AnimeIndo",
        category: "Search",
        description: "Mencari anime",
        parameters: [
          { name: "q", type: "string", required: true, description: "Kata kunci" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/animeindo/search",
          status: true,
          source: "AnimeIndo",
          result: {
            query: "naruto",
            results: [
              { title: "Naruto Shippuden", slug: "naruto-shippuden" },
            ],
          },
        },
      },
      {
        id: "animeindo-anime",
        name: "Anime Detail",
        method: "GET",
        path: "/api/animeindo/anime/:slug",
        source: "AnimeIndo",
        category: "Detail",
        description: "Mendapatkan detail anime",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug anime" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/animeindo/anime/:slug",
          status: true,
          source: "AnimeIndo",
          result: {
            title: "Naruto Shippuden",
            synopsis: "Naruto Shippuden adalah kelanjutan dari serial Naruto...",
            genres: ["Action", "Adventure"],
            episodes: "500",
            status: "Completed",
            episodeList: [
              { number: 500, title: "Episode 500", slug: "naruto-shippuden-500" },
            ],
          },
        },
      },
      {
        id: "animeindo-episode",
        name: "Episode Stream",
        method: "GET",
        path: "/api/animeindo/episode/:slug",
        source: "AnimeIndo",
        category: "Stream",
        description: "Mendapatkan link streaming",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug episode" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/animeindo/episode/:slug",
          status: true,
          source: "AnimeIndo",
          result: {
            title: "Naruto Shippuden Episode 500",
            streams: [
              { server: "Streamtape", url: "https://..." },
            ],
          },
        },
      },
      {
        id: "animeindo-genres",
        name: "Genre List",
        method: "GET",
        path: "/api/animeindo/genres",
        source: "AnimeIndo",
        category: "List",
        description: "Mendapatkan daftar genre",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/animeindo/genres",
          status: true,
          source: "AnimeIndo",
          result: {
            genres: ["Action", "Adventure", "Comedy", "Drama"],
          },
        },
      },
    ],
  },
  {
    id: "anichin",
    name: "Anichin",
    baseUrl: "https://anichin.top",
    description: "Nonton donghua (anime China) subtitle Indonesia",
    status: "active",
    language: "Indonesia",
    features: ["Donghua", "Chinese Animation", "Subtitle Indonesia"],
    endpoints: [
      {
        id: "anichin-home",
        name: "Homepage",
        method: "GET",
        path: "/api/anichin",
        source: "Anichin",
        category: "General",
        description: "Mendapatkan data homepage donghua",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/anichin",
          status: true,
          source: "Anichin",
          result: {
            latest: [
              { title: "Soul Land Episode 1", slug: "soul-land-1", thumbnail: "https://..." },
            ],
            popular: [
              { title: "Battle Through the Heavens", slug: "battle-through-the-heavens" },
            ],
          },
        },
      },
      {
        id: "anichin-search",
        name: "Search Donghua",
        method: "GET",
        path: "/api/anichin/search",
        source: "Anichin",
        category: "Search",
        description: "Mencari donghua",
        parameters: [
          { name: "q", type: "string", required: true, description: "Kata kunci" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/anichin/search",
          status: true,
          source: "Anichin",
          result: {
            query: "soul land",
            results: [
              { title: "Soul Land", slug: "soul-land" },
            ],
          },
        },
      },
      {
        id: "anichin-anime",
        name: "Donghua Detail",
        method: "GET",
        path: "/api/anichin/donghua/:slug",
        source: "Anichin",
        category: "Detail",
        description: "Mendapatkan detail donghua",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug donghua" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/anichin/donghua/:slug",
          status: true,
          source: "Anichin",
          result: {
            title: "Soul Land",
            synopsis: "Tang San terlahir kembali di dunia Douluo...",
            genres: ["Action", "Adventure"],
            episodes: "26",
            status: "Ongoing",
            episodeList: [
              { number: 26, title: "Episode 26", slug: "soul-land-26" },
            ],
          },
        },
      },
      {
        id: "anichin-episode",
        name: "Episode Stream",
        method: "GET",
        path: "/api/anichin/watch/:slug",
        source: "Anichin",
        category: "Stream",
        description: "Mendapatkan link streaming donghua",
        parameters: [
          { name: "slug", type: "string", required: true, description: "Slug episode" },
        ],
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/anichin/watch/:slug",
          status: true,
          source: "Anichin",
          result: {
            title: "Soul Land Episode 26",
            streams: [
              { server: "Streamtape", url: "https://..." },
            ],
          },
        },
      },
      {
        id: "anichin-genres",
        name: "Genre List",
        method: "GET",
        path: "/api/anichin/genres",
        source: "Anichin",
        category: "List",
        description: "Mendapatkan daftar genre donghua",
        exampleResponse: {
          message: "Welcome To VelyDocs, Apikey Anime Gratis Sub Indo",
          author: "Gxyenn",
          endpoint: "/api/anichin/genres",
          status: true,
          source: "Anichin",
          result: {
            genres: ["Action", "Adventure", "Fantasy", "Martial Arts"],
          },
        },
      },
    ],
  },
];

export const getAllEndpoints = (): Endpoint[] => {
  return sources.flatMap((source) => source.endpoints);
};

export const getEndpointsBySource = (sourceId: string): Endpoint[] => {
  const source = sources.find((s) => s.id === sourceId);
  return source?.endpoints ?? [];
};

export const getEndpointsByCategory = (category: string): Endpoint[] => {
  return getAllEndpoints().filter((e) => e.category.toLowerCase() === category.toLowerCase());
};

export const categories = ["General", "List", "Search", "Detail", "Stream", "Download", "Schedule"];
