import otakudesu from "./otakudesu/config.json";
import samehadaku from "./samehadaku/config.json";
import kuramanime from "./kuramanime/config.json";
import anichin from "./anichin/config.json";
import animeindo from "./animeindo/config.json";
import anixverse from "./anixverse/config.json";
import gomunime from "./gomunime/config.json";
import kusonime from "./kusonime/config.json";
import nanime from "./nanime/config.json";
import oploverz from "./oploverz/config.json";
import winbu from "./winbu/config.json";

export const SOURCE_REGISTRY = {
  otakudesu,
  samehadaku,
  kuramanime,
  anichin,
  animeindo,
  anixverse,
  gomunime,
  kusonime,
  nanime,
  oploverz,
  winbu,
} as const;

export type SourceName = keyof typeof SOURCE_REGISTRY;
