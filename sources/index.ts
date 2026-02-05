export type SourceConfig = {
  baseUrl: string;
  searchPattern: string;
  animePattern: string;
  episodePattern: string;
  pageMap: {
    ongoing: string;
    completed: string;
  };
  listSelectors: {
    title: string;
    link: string;
    image: string;
  };
};

const makeConfig = (baseUrl: string): SourceConfig => ({
  baseUrl,
  searchPattern: "?s=",
  animePattern: "/anime/",
  episodePattern: "/episode/",
  pageMap: {
    ongoing: baseUrl,
    completed: baseUrl,
  },
  listSelectors: {
    title: "h1,h2,h3,.entry-title,.post-title",
    link: "a[href]",
    image: "img[src]",
  },
});

export const SOURCE_REGISTRY = {
  oploverz: makeConfig("https://oploverz.top"),
  animeisme: makeConfig("https://animeisme.net"),
  riie: makeConfig("https://riie.jp"),
  neonime: makeConfig("https://neonime.com"),
  animeindo: makeConfig("https://animeindo.my.id"),
  anibatch: makeConfig("https://anibatch.me"),
  samehadaku: makeConfig("https://samehadaku.email"),
  animehade: makeConfig("https://animehade.my.id"),
  nanime: makeConfig("https://nanime.biz"),
  otakudesu: makeConfig("https://otakudesu.cloud"),
  anoboy: makeConfig("https://anoboy.show"),
  animeyou: makeConfig("https://animeyou.net"),
  myanimeindo: makeConfig("https://myanimeindo.tv"),
  mangaku: makeConfig("https://mangaku.lat"),
  ruangotaku: makeConfig("https://ruangotaku.com"),
  kotakanime: makeConfig("https://kotakanime.com"),
  animepos: makeConfig("https://animepos.id"),
  lk21: makeConfig("https://lk21official.lol"),
  gomunime: makeConfig("https://gomunime.my.id"),
  awsubs: makeConfig("https://awsubs.co"),
  onnime: makeConfig("https://onnime.com"),
  animenonton: makeConfig("https://animenonton.com"),
  kuramanime: makeConfig("https://kuramanime.boo"),
  winbu: makeConfig("https://winbu.tv"),
  kusonime: makeConfig("https://kusonime.com"),
  anixverse: makeConfig("https://anixverse.com"),
  anichin: makeConfig("https://anichin.top"),
} as const;

export type SourceName = keyof typeof SOURCE_REGISTRY;
