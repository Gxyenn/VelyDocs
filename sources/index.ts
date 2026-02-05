import oploverz from './oploverz/config.json';
import animeisme from './animeisme/config.json';
import riie from './riie/config.json';
import neonime from './neonime/config.json';
import animeindo from './animeindo/config.json';
import anibatch from './anibatch/config.json';
import samehadaku from './samehadaku/config.json';
import animehade from './animehade/config.json';
import nanime from './nanime/config.json';
import otakudesu from './otakudesu/config.json';
import anoboy from './anoboy/config.json';
import animeyou from './animeyou/config.json';
import myanimeindo from './myanimeindo/config.json';
import mangaku from './mangaku/config.json';
import ruangotaku from './ruangotaku/config.json';
import kotakanime from './kotakanime/config.json';
import animepos from './animepos/config.json';
import lk21 from './lk21/config.json';
import gomunime from './gomunime/config.json';
import awsubs from './awsubs/config.json';
import onnime from './onnime/config.json';
import animenonton from './animenonton/config.json';
import kuramanime from './kuramanime/config.json';
import winbu from './winbu/config.json';
import kusonime from './kusonime/config.json';
import anixverse from './anixverse/config.json';
import anichin from './anichin/config.json';

export const SOURCE_REGISTRY = {
  oploverz,
  animeisme,
  riie,
  neonime,
  animeindo,
  anibatch,
  samehadaku,
  animehade,
  nanime,
  otakudesu,
  anoboy,
  animeyou,
  myanimeindo,
  mangaku,
  ruangotaku,
  kotakanime,
  animepos,
  lk21,
  gomunime,
  awsubs,
  onnime,
  animenonton,
  kuramanime,
  winbu,
  kusonime,
  anixverse,
  anichin,
} as const;

export type SourceName = keyof typeof SOURCE_REGISTRY;
