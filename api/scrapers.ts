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
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
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
  const nextBtn = $('.pagination a.next, .nav-links a.next, .pagination-item.next, a:contains("Next"), a.next.page-numbers').first();
  const prevBtn = $('.pagination a.prev, .nav-links a.prev, .pagination-item.prev, a:contains("Prev"), a.prev.page-numbers').first();
  
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

// WINBU SCRAPER - Enhanced
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
      const genres = $(el).find('.genre-info a, .genres a').map((_, g) => $(g).text().trim()).get();
      
      if (title) data.push({ 
        title, 
        url: link, 
        poster, 
        episode,
        genre: genres.length > 0 ? genres : undefined
      });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getLatest(page: number = 1): Promise<ScrapeResult> {
    const url = page > 1 ? `${this.baseUrl}/page/${page}/` : this.baseUrl;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.listupd article, .grid article').each((_, el) => {
      const title = $(el).find('.tt h2, h2.entry-title a').text().trim();
      const link = $(el).find('a').attr('href') || '';
      const poster = $(el).find('img').attr('src') || '';
      const episode = $(el).find('.epx, .bt .epx').text().trim();
      
      if (title) data.push({ title, url: link, poster, episode });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getAnimeDetail(slug: string): Promise<AnimeDetail> {
    const html = await fetchHtml(`${this.baseUrl}/anime/${slug}/`);
    const $ = cheerio.load(html);
    
    return {
      title: $('.entry-title, h1.title').text().trim(),
      poster: $('.thumb img, .infoanime img').first().attr('src') || '',
      synopsis: $('.entry-content p, .sinopsis p').first().text().trim(),
      genre: $('.genre-info a, .genres a').map((_, el) => $(el).text().trim()).get(),
      status: $('.info-content .spe:contains("Status") span').last().text().trim() || 'Unknown',
      type: $('.info-content .spe:contains("Type") span').last().text().trim() || 'Unknown',
      episodes: $('.info-content .spe:contains("Episodes") span').last().text().trim(),
      episodeList: $('.eplister ul li, .lsteps ul li').map((_, el) => ({
        title: $(el).find('a .epl-title').text().trim() || $(el).find('a').text().trim(),
        url: $(el).find('a').attr('href') || '',
        episode: $(el).find('.epl-num').text().trim() || $(el).find('.eps').text().trim(),
        releaseDate: $(el).find('.epl-date').text().trim()
      })).get()
    };
  },

  async searchAnime(query: string, page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/?s=${encodeURIComponent(query)}&page=${page}`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.listupd article, .grid article').each((_, el) => {
      const title = $(el).find('.tt h2, h2.entry-title a').text().trim();
      const link = $(el).find('a').attr('href') || '';
      const poster = $(el).find('img').attr('src') || '';
      const episode = $(el).find('.epx').text().trim();
      
      if (title) data.push({ title, url: link, poster, episode });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getByGenre(genre: string, page: number = 1): Promise<ScrapeResult> {
    const url = page > 1 
      ? `${this.baseUrl}/genre/${genre}/page/${page}/` 
      : `${this.baseUrl}/genre/${genre}/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.listupd article, .grid article').each((_, el) => {
      const title = $(el).find('.tt h2, h2.entry-title a').text().trim();
      const link = $(el).find('a').attr('href') || '';
      const poster = $(el).find('img').attr('src') || '';
      
      if (title) data.push({ title, url: link, poster });
    });

    return { data, pagination: extractPagination($, page) };
  }
};

// SAMEHADAKU SCRAPER - Enhanced
export const samehadakuScraper = {
  baseUrl: 'https://v1.samehadaku.how',

  async getOngoing(page: number = 1): Promise<ScrapeResult> {
    const url = page > 1 ? `${this.baseUrl}/page/${page}/` : this.baseUrl;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.post-show ul li, .listupd article').each((_, el) => {
      const title = $(el).find('.entry-title a, .tt h2').text().trim();
      const link = $(el).find('.entry-title a, a').first().attr('href') || '';
      const poster = $(el).find('.thumb img, img').first().attr('src') || '';
      const episode = $(el).find('.dtla span, .epx').first().text().trim();
      
      if (title) data.push({ title, poster, episode, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getAnimeDetail(slug: string): Promise<AnimeDetail> {
    const html = await fetchHtml(`${this.baseUrl}/anime/${slug}/`);
    const $ = cheerio.load(html);
    
    return {
      title: $('.entry-title, h1.title').text().trim(),
      alternativeTitle: $('.alter, .alternative-title').text().trim(),
      poster: $('.thumb img, .infoanime img').first().attr('src') || '',
      synopsis: $('.entry-content p, .sinopsis').first().text().trim() || $('.entry-content').text().trim(),
      genre: $('.genre-info a, .genres a').map((_, el) => $(el).text().trim()).get(),
      status: $('.info-content .spe span:contains("Status")').text().split(':')[1]?.trim() || 'Unknown',
      type: $('.info-content .spe span:contains("Type")').text().split(':')[1]?.trim() || 'Unknown',
      episodes: $('.info-content .spe span:contains("Episodes")').text().split(':')[1]?.trim(),
      score: $('.info-content .spe span:contains("Score")').text().split(':')[1]?.trim(),
      episodeList: $('.lsteps ul li, .eplister ul li').map((_, el) => ({
        title: $(el).find('.eps a, a').text().trim(),
        url: $(el).find('.eps a, a').attr('href') || '',
        episode: $(el).find('.eps, .epl-num').text().trim(),
        releaseDate: $(el).find('.zeebr, .epl-date').text().trim()
      })).get(),
      batchList: $('.download-eps, .batch-link').map((_, el) => ({
        title: $(el).find('a').text().trim(),
        url: $(el).find('a').attr('href') || '',
        quality: $(el).find('.quality, .res').text().trim()
      })).get()
    };
  },

  async searchAnime(query: string): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/?s=${encodeURIComponent(query)}`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.post-show ul li, .listupd article').each((_, el) => {
      const title = $(el).find('.entry-title a, .tt h2').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.thumb img, img').first().attr('src') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: { current: 1, next: null, prev: null, hasNext: false, hasPrev: false } };
  },

  async getSchedule(): Promise<any> {
    const html = await fetchHtml(`${this.baseUrl}/jadwal-rilis/`);
    const $ = cheerio.load(html);
    const schedule: any = {};

    $('.kglist321, .schedule-list').each((_, dayEl) => {
      const day = $(dayEl).find('h2, .day-name').text().trim();
      const animes = $(dayEl).find('li, .schedule-item').map((_, el) => ({
        title: $(el).find('a').text().trim(),
        url: $(el).find('a').attr('href') || '',
        time: $(el).find('.time, .release-time').text().trim()
      })).get();
      
      if (day) schedule[day] = animes;
    });

    return { schedule };
  },

  async getByGenre(genre: string, page: number = 1): Promise<ScrapeResult> {
    const url = page > 1 
      ? `${this.baseUrl}/genre/${genre}/page/${page}/` 
      : `${this.baseUrl}/genre/${genre}/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.post-show ul li, .listupd article').each((_, el) => {
      const title = $(el).find('.entry-title a, .tt h2').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.thumb img, img').first().attr('src') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getBatch(page: number = 1): Promise<ScrapeResult> {
    const url = page > 1 
      ? `${this.baseUrl}/batch/page/${page}/` 
      : `${this.baseUrl}/batch/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.post-show ul li, .listupd article').each((_, el) => {
      const title = $(el).find('.entry-title a, .tt h2').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.thumb img, img').first().attr('src') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  }
};

// KURAMANIME SCRAPER - Enhanced
export const kuramanimeScraper = {
  baseUrl: 'https://v12.kuramanime.tel',

  async getOngoing(page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/anime/ongoing?page=${page}`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.product__item, .anime-item').each((_, el) => {
      const title = $(el).find('.product__item__text h5 a, .title a').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.product__item__pic, img').first().attr('data-setbg') 
        || $(el).find('img').attr('src') || '';
      const episode = $(el).find('.ep, .episode').text().trim();
      
      if (title) data.push({ title, poster, episode, url: link });
    });

    const nextBtn = $('.product__pagination a:contains("Next"), .product__pagination a i.fa-angle-right, .pagination .next');
    
    return { 
      data, 
      pagination: {
        current: page,
        next: nextBtn.length ? page + 1 : null,
        prev: page > 1 ? page - 1 : null,
        hasNext: nextBtn.length > 0,
        hasPrev: page > 1
      }
    };
  },

  async getLatest(page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/?page=${page}`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.product__item, .anime-item').each((_, el) => {
      const title = $(el).find('.product__item__text h5 a, .title a').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.product__item__pic, img').first().attr('data-setbg') 
        || $(el).find('img').attr('src') || '';
      const episode = $(el).find('.ep, .episode').text().trim();
      
      if (title) data.push({ title, poster, episode, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getAnimeDetail(slug: string): Promise<AnimeDetail> {
    const html = await fetchHtml(`${this.baseUrl}/anime/${slug}`);
    const $ = cheerio.load(html);
    
    return {
      title: $('.anime__details__title h3, h1.title').text().trim(),
      poster: $('.anime__details__pic, .anime-image').attr('data-setbg') 
        || $('.anime__details__pic img, .anime-image img').attr('src') || '',
      synopsis: $('.anime__details__text p, .synopsis').text().trim(),
      genre: $('.anime__details__widget ul li:contains("Genre") a, .genres a')
        .map((_, el) => $(el).text().trim()).get(),
      status: $('.anime__details__widget ul li:contains("Status") span, .status').last().text().trim() || 'Unknown',
      type: $('.anime__details__widget ul li:contains("Type") a, .type').text().trim() || 'Unknown',
      episodes: $('.anime__details__widget ul li:contains("Episodes") span').last().text().trim(),
      score: $('.anime__details__widget ul li:contains("Score") span').last().text().trim(),
      studio: $('.anime__details__widget ul li:contains("Studio") a').text().trim(),
      episodeList: $('.anime__episode__item, .episode-list li').map((_, el) => ({
        title: $(el).find('a').text().trim(),
        url: $(el).find('a').attr('href') || '',
        episode: $(el).find('.episode-number, .ep').text().trim()
      })).get()
    };
  },

  async searchAnime(query: string): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/anime?search=${encodeURIComponent(query)}`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.product__item, .anime-item').each((_, el) => {
      const title = $(el).find('.product__item__text h5 a, .title a').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.product__item__pic, img').first().attr('data-setbg') 
        || $(el).find('img').attr('src') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: { current: 1, next: null, prev: null, hasNext: false, hasPrev: false } };
  },

  async getSchedule(): Promise<any> {
    const html = await fetchHtml(`${this.baseUrl}/jadwal`);
    const $ = cheerio.load(html);
    const schedule: any = {};

    $('.schedule-item, .day-schedule').each((_, dayEl) => {
      const day = $(dayEl).find('h3, .day-name').text().trim();
      const animes = $(dayEl).find('.anime-item, li').map((_, el) => ({
        title: $(el).find('a').text().trim(),
        url: $(el).find('a').attr('href') || '',
        time: $(el).find('.time').text().trim()
      })).get();
      
      if (day) schedule[day] = animes;
    });

    return { schedule };
  },

  async getByGenre(genre: string, page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/anime?genre=${genre}&page=${page}`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.product__item, .anime-item').each((_, el) => {
      const title = $(el).find('.product__item__text h5 a, .title a').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.product__item__pic, img').first().attr('data-setbg') 
        || $(el).find('img').attr('src') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  }
};

// OTAKUDESU SCRAPER - New
export const otakudesuScraper = {
  baseUrl: 'https://otakudesu.cloud',

  async getOngoing(page: number = 1): Promise<ScrapeResult> {
    const url = page > 1 ? `${this.baseUrl}/ongoing-anime/page/${page}/` : `${this.baseUrl}/ongoing-anime/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.venz ul li, .detpost').each((_, el) => {
      const title = $(el).find('.jdlflm, h2').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.thumbz img, img').attr('src') || '';
      const episode = $(el).find('.epz, .episode').text().trim();
      const updated = $(el).find('.newnime, .date').text().trim();
      
      if (title) data.push({ title, poster, episode, url: link, updated });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getComplete(page: number = 1): Promise<ScrapeResult> {
    const url = page > 1 ? `${this.baseUrl}/complete-anime/page/${page}/` : `${this.baseUrl}/complete-anime/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.venz ul li, .detpost').each((_, el) => {
      const title = $(el).find('.jdlflm, h2').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.thumbz img, img').attr('src') || '';
      const episode = $(el).find('.epz, .episode').text().trim();
      
      if (title) data.push({ title, poster, episode, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getAnimeDetail(slug: string): Promise<AnimeDetail> {
    const html = await fetchHtml(`${this.baseUrl}/anime/${slug}/`);
    const $ = cheerio.load(html);
    
    return {
      title: $('.jdlrx h1, h1.entry-title').text().trim(),
      alternativeTitle: $('.infozingle p:contains("Judul") span').text().trim(),
      poster: $('.fotoanime img, .thumb img').attr('src') || '',
      synopsis: $('.sinopc, .entry-content').text().trim(),
      genre: $('.infozingle p:contains("Genre") span a, .genre a')
        .map((_, el) => $(el).text().trim()).get(),
      status: $('.infozingle p:contains("Status") span').text().trim() || 'Unknown',
      type: $('.infozingle p:contains("Type") a, .infozingle p:contains("Tipe") a').text().trim() || 'Unknown',
      episodes: $('.infozingle p:contains("Total Episode") span').text().trim(),
      score: $('.infozingle p:contains("Skor") span').text().trim(),
      studio: $('.infozingle p:contains("Studio") a').text().trim(),
      releaseDate: $('.infozingle p:contains("Tanggal Rilis") span').text().trim(),
      episodeList: $('.episodelist ul li, .eplister ul li').map((_, el) => ({
        title: $(el).find('a').text().trim(),
        url: $(el).find('a').attr('href') || '',
        episode: $(el).find('.zeebr').text().trim(),
        releaseDate: $(el).find('.date').text().trim()
      })).get(),
      batchList: $('.download-batch li, .batch-download li').map((_, el) => ({
        title: $(el).find('a').text().trim(),
        url: $(el).find('a').attr('href') || '',
        quality: $(el).find('.quality, .reso').text().trim()
      })).get()
    };
  },

  async searchAnime(query: string): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/?s=${encodeURIComponent(query)}&post_type=anime`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.chivsrc li, .venz ul li').each((_, el) => {
      const title = $(el).find('h2 a, .jdlflm').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('img').attr('src') || '';
      const genres = $(el).find('.set a, .genre a').map((_, g) => $(g).text().trim()).get();
      
      if (title) data.push({ 
        title, 
        poster, 
        url: link,
        genre: genres.length > 0 ? genres : undefined
      });
    });

    return { data, pagination: { current: 1, next: null, prev: null, hasNext: false, hasPrev: false } };
  },

  async getSchedule(): Promise<any> {
    const html = await fetchHtml(`${this.baseUrl}/jadwal-rilis/`);
    const $ = cheerio.load(html);
    const schedule: any = {};

    $('.kglist321, .schedule-wrapper').each((_, dayEl) => {
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
    const url = page > 1 
      ? `${this.baseUrl}/genres/${genre}/page/${page}/` 
      : `${this.baseUrl}/genres/${genre}/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.venz ul li, .col-anime').each((_, el) => {
      const title = $(el).find('.jdlflm, h2').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.thumbz img, img').attr('src') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  },

  async getBatch(page: number = 1): Promise<ScrapeResult> {
    const url = page > 1 
      ? `${this.baseUrl}/batch/page/${page}/` 
      : `${this.baseUrl}/batch/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.venz ul li, .detpost').each((_, el) => {
      const title = $(el).find('.jdlflm, h2').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('.thumbz img, img').attr('src') || '';
      
      if (title) data.push({ title, poster, url: link });
    });

    return { data, pagination: extractPagination($, page) };
  }
};
