export interface AnimeData {
  title: string;
  poster: string;
  episode?: string;
  url: string;
  genre?: string[];
  updated?: string;
  slug?: string;
  status?: string;
  score?: string;
  type?: string;
}

export interface PaginationData {
  current: number;
  next: number | null;
  prev: number | null;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse {
  source: string;
  status: 'success' | 'error';
  count?: number;
  data?: any;
  pagination?: PaginationData;
  message?: string;
  timestamp?: string;
  tier?: string;
}

export type ScraperSource = 'winbu' | 'samehadaku' | 'kuramanime' | 'otakudesu';
export type ScraperType = 'ongoing' | 'latest' | 'genre' | 'anime' | 'search' | 'schedule' | 'complete' | 'batch';

export interface EndpointDef {
  method: 'GET';
  path: string;
  description: string;
  params?: { name: string; type: string; required: boolean }[];
  source: ScraperSource;
  type: ScraperType;
}

export interface RateLimitConfig {
  requests: number;
  window: string;
  message: string;
}

export interface SpecialAgent {
  key: string;
  name: string;
  tier: 'default' | 'premium' | 'unlimited';
  active: boolean;
  createdAt: string;
}
