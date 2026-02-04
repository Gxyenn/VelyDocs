export interface AnimeData {
  title: string;
  poster: string;
  episode?: string;
  url: string;
  genre?: string[];
  updated?: string;
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
}

export type ScraperSource = 'winbu' | 'samehadaku' | 'kuramanime';
export type ScraperType = 'ongoing' | 'latest' | 'genre' | 'anime';

export interface EndpointDef {
  method: 'GET';
  path: string;
  description: string;
  params?: { name: string; type: string; required: boolean }[];
  source: ScraperSource;
  type: ScraperType;
}