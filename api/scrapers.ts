import * as cheerio from 'cheerio';
import { PaginationData } from '../types';

export interface ScrapedAnime {
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
  studio?: string;
  releaseDate?: string;
}

export interface ScrapeResult {
  data: ScrapedAnime[];
  pagination: PaginationData;
}

export interface AnimeDetail {
  title: string;
  alternativeTitle?: string;
  poster: string;
  synopsis: string;
  genre: string[];
  status: string;
  type: string;
  episodes?: string;
  duration?: string;
  score?: string;
  studio?: string;
  releaseDate?: string;
  episodeList?: Array<{
    title: string;
    url: string;
    episode: string;
    releaseDate?: string;
  }>;
  batchList?: Array<{
    title: string;
    url: string;
    quality: string;
  }>;
}

const fetchHtml = async (url: string): Promise<string> => {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': url,
  };
  
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return await response.text();
};

const extractPagination = ($: cheerio.CheerioAPI, currentPage: number): PaginationData => {
  const nextBtn = $('.pagination a.next, .nav-links a.next').first();
  const prevBtn = $('.pagination a.prev, .nav-links a.prev').first();
  
  const hasNext = nextBtn.length > 0;
  const hasPrev = prevBtn.length > 0 || currentPage > 1;

  return {
    current: currentPage,
    next: hasNext ? currentPage + 1 : null,
    prev: hasPrev ? (currentPage > 1 ? currentPage - 1 : null) : null,
    hasNext: hasNext,
    hasPrev: hasPrev
  };
};

// WINBU SCRAPER
export const winbuScraper = {
  baseUrl: 'https://winbu.net',
  
  async getOngoing(page: number = 1): Promise<ScrapeResult> {
    const url = page > 1 ? `${this.baseUrl}/anime-ongoing/page/${page}/` : `${this.baseUrl}/anime-ongoing/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.grid article, .listupd article').each((_, el) => {
      const title = $(el).find('h2.entry-title a, .tt h2').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('img').attr('src') || '';
      const episode = $(el).find('.epx, .bt .epx').text().trim();
      
      if (title) data.push({ title, url: link, poster, episode });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getLatest(page: number = 1): Promise<ScrapeResult> {
    const url = page > 1 ? `${this.baseUrl}/page/${page}/` : this.baseUrl;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.listupd article').each((_, el) => {
      const title = $(el).find('.tt h2').text().trim();
      const link = $(el).find('a').attr('href') || '';
      const poster = $(el).find('img').attr('src') || '';
      const episode = $(el).find('.epx').text().trim();
      
      if (title) data.push({ title, url: link, poster, episode });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getAnimeDetail(slug: string): Promise<AnimeDetail> {
    const html = await fetchHtml(`${this.baseUrl}/anime/${slug}/`);
    const $ = cheerio.load(html);
    
    return {
      title: $('.entry-title').text().trim(),
      poster: $('.thumb img').first().attr('src') || '',
      synopsis: $('.entry-content p').first().text().trim(),
      genre: $('.genre-info a').map((_, el) => $(el).text().trim()).get(),
      status: $('.info-content .spe:contains("Status")').text().split(':')[1]?.trim() || 'Unknown',
      type: $('.info-content .spe:contains("Type")').text().split(':')[1]?.trim() || 'Unknown',
      episodeList: $('.eplister ul li').map((_, el) => ({
        title: $(el).find('a').text().trim(),
        url: $(el).find('a').attr('href') || '',
        episode: $(el).find('.epl-num').text().trim()
      })).get()
    };
  },

  async searchAnime(query: string, page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/?s=${encodeURIComponent(query)}`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.listupd article').each((_, el) => {
      const title = $(el).find('.tt h2').text().trim();
      const link = $(el).find('a').attr('href') || '';
      const poster = $(el).find('img').attr('src') || '';
      
      if (title) data.push({ title, url: link, poster });
    });

    return { data, pagination: { current: 1, next: null, prev: null, hasNext: false, hasPrev: false } };
  },

  async getByGenre(genre: string, page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/genre/${genre}/page/${page}/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.listupd article').each((_, el) => {
      const title = $(el).find('.tt h2').text().trim();
      const link = $(el).find('a').attr('href') || '';
      const poster = $(el).find('img').attr('src') || '';
      
      if (title) data.push({ title, url: link, poster });
    });

    return { data, pagination: extractPagination($, page) };
  }
};

// SAMEHADAKU SCRAPER  
export const samehadakuScraper = {
  baseUrl: 'https://v1.samehadaku.how',

  async getOngoing(page: number = 1): Promise<ScrapeResult> {
    const url = page > 1 ? `${this.baseUrl}/page/${page}/` : this.baseUrl;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.post-show ul li').each((_, el) => {
      const title = $(el).find('.entry-title a').text().trim();
      const link = $(el).find('.entry-title a').attr('href') || '';
      const poster = $(el).find('.thumb img').attr('src') || '';
      const episode = $(el).find('.dtla span').first().text().trim();
      
      if (title) data.push({ title, poster, episode, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getAnimeDetail(slug: string): Promise<AnimeDetail> {
    const html = await fetchHtml(`${this.baseUrl}/anime/${slug}/`);
    const $ = cheerio.load(html);
    
    return {
      title: $('.entry-title').text().trim(),
      poster: $('.thumb img').first().attr('src') || '',
      synopsis: $('.entry-content').text().trim(),
      genre: $('.genre-info a').map((_, el) => $(el).text().trim()).get(),
      status: 'Unknown',
      type: 'Unknown',
      episodeList: $('.lsteps ul li').map((_, el) => ({
        title: $(el).find('a').text().trim(),
        url: $(el).find('a').attr('href') || '',
        episode: $(el).find('.eps').text().trim()
      })).get()
    };
  },

  async searchAnime(query: string): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/?s=${encodeURIComponent(query)}`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.post-show ul li').each((_, el) => {
      const title = $(el).find('.entry-title a').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.thumb img').attr('src') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: { current: 1, next: null, prev: null, hasNext: false, hasPrev: false } };
  },

  async getSchedule(): Promise<any> {
    const html = await fetchHtml(`${this.baseUrl}/jadwal-rilis/`);
    const $ = cheerio.load(html);
    const schedule: any = {};

    $('.kglist321').each((_, dayEl) => {
      const day = $(dayEl).find('h2').text().trim();
      const animes = $(dayEl).find('li').map((_, el) => ({
        title: $(el).find('a').text().trim(),
        url: $(el).find('a').attr('href') || ''
      })).get();
      
      if (day) schedule[day] = animes;
    });

    return { schedule };
  },

  async getByGenre(genre: string, page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/genre/${genre}/page/${page}/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.post-show ul li').each((_, el) => {
      const title = $(el).find('.entry-title a').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.thumb img').attr('src') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getBatch(page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/batch/page/${page}/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.post-show ul li').each((_, el) => {
      const title = $(el).find('.entry-title a').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.thumb img').attr('src') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  }
};

// KURAMANIME SCRAPER
export const kuramanimeScraper = {
  baseUrl: 'https://v12.kuramanime.tel',

  async getOngoing(page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/anime/ongoing?page=${page}`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.product__item').each((_, el) => {
      const title = $(el).find('.product__item__text h5 a').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.product__item__pic').attr('data-setbg') || '';
      const episode = $(el).find('.ep').text().trim();
      
      if (title) data.push({ title, poster, episode, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getLatest(page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/?page=${page}`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.product__item').each((_, el) => {
      const title = $(el).find('.product__item__text h5 a').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.product__item__pic').attr('data-setbg') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getAnimeDetail(slug: string): Promise<AnimeDetail> {
    const html = await fetchHtml(`${this.baseUrl}/anime/${slug}`);
    const $ = cheerio.load(html);
    
    return {
      title: $('.anime__details__title h3').text().trim(),
      poster: $('.anime__details__pic').attr('data-setbg') || '',
      synopsis: $('.anime__details__text p').text().trim(),
      genre: $('.anime__details__widget ul li:contains("Genre") a').map((_, el) => $(el).text().trim()).get(),
      status: 'Unknown',
      type: 'Unknown'
    };
  },

  async searchAnime(query: string): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/anime?search=${encodeURIComponent(query)}`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.product__item').each((_, el) => {
      const title = $(el).find('.product__item__text h5 a').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.product__item__pic').attr('data-setbg') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: { current: 1, next: null, prev: null, hasNext: false, hasPrev: false } };
  },

  async getSchedule(): Promise<any> {
    const html = await fetchHtml(`${this.baseUrl}/jadwal`);
    const $ = cheerio.load(html);
    const schedule: any = {};

    $('.schedule-item').each((_, dayEl) => {
      const day = $(dayEl).find('h3').text().trim();
      const animes = $(dayEl).find('.anime-item').map((_, el) => ({
        title: $(el).find('a').text().trim(),
        url: $(el).find('a').attr('href') || ''
      })).get();
      
      if (day) schedule[day] = animes;
    });

    return { schedule };
  },

  async getByGenre(genre: string, page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/anime?genre=${genre}`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.product__item').each((_, el) => {
      const title = $(el).find('.product__item__text h5 a').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.product__item__pic').attr('data-setbg') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  }
};

// OTAKUDESU SCRAPER
export const otakudesuScraper = {
  baseUrl: 'https://otakudesu.cloud',

  async getOngoing(page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/ongoing-anime/page/${page}/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.venz ul li').each((_, el) => {
      const title = $(el).find('.jdlflm').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.thumbz img').attr('src') || '';
      const episode = $(el).find('.epz').text().trim();
      
      if (title) data.push({ title, poster, episode, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getComplete(page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/complete-anime/page/${page}/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.venz ul li').each((_, el) => {
      const title = $(el).find('.jdlflm').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.thumbz img').attr('src') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getAnimeDetail(slug: string): Promise<AnimeDetail> {
    const html = await fetchHtml(`${this.baseUrl}/anime/${slug}/`);
    const $ = cheerio.load(html);
    
    return {
      title: $('.jdlrx h1').text().trim(),
      poster: $('.fotoanime img').attr('src') || '',
      synopsis: $('.sinopc').text().trim(),
      genre: $('.infozingle p:contains("Genre") span a').map((_, el) => $(el).text().trim()).get(),
      status: 'Unknown',
      type: 'Unknown',
      episodeList: $('.episodelist ul li').map((_, el) => ({
        title: $(el).find('a').text().trim(),
        url: $(el).find('a').attr('href') || '',
        episode: $(el).find('.zeebr').text().trim()
      })).get()
    };
  },

  async searchAnime(query: string): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/?s=${encodeURIComponent(query)}&post_type=anime`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.chivsrc li').each((_, el) => {
      const title = $(el).find('h2 a').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('img').attr('src') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: { current: 1, next: null, prev: null, hasNext: false, hasPrev: false } };
  },

  async getSchedule(): Promise<any> {
    const html = await fetchHtml(`${this.baseUrl}/jadwal-rilis/`);
    const $ = cheerio.load(html);
    const schedule: any = {};

    $('.kglist321').each((_, dayEl) => {
      const day = $(dayEl).find('h2').text().trim();
      const animes = $(dayEl).find('li').map((_, el) => ({
        title: $(el).find('a').text().trim(),
        url: $(el).find('a').attr('href') || ''
      })).get();
      
      if (day) schedule[day] = animes;
    });

    return { schedule };
  },

  async getByGenre(genre: string, page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/genres/${genre}/page/${page}/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.venz ul li').each((_, el) => {
      const title = $(el).find('.jdlflm').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.thumbz img').attr('src') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getBatch(page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/batch/page/${page}/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.venz ul li').each((_, el) => {
      const title = $(el).find('.jdlflm').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.thumbz img').attr('src') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  }
};
