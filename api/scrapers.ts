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
}

export interface ScrapeResult {
  data: ScrapedAnime[];
  pagination: PaginationData;
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

export const winbuScraper = {
  baseUrl: 'https://winbu.net',
  
  async getOngoing(page: number = 1): Promise<ScrapeResult> {
    const url = page > 1 ? `${this.baseUrl}/anime-ongoing/page/${page}/` : `${this.baseUrl}/anime-ongoing/`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.grid article').each((_, el) => {
      const title = $(el).find('h2.entry-title a').text().trim() || $(el).find('h3').text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const poster = $(el).find('img').attr('src') || '';
      const episode = $(el).find('.epx').text().trim() || $(el).find('.text-sm').first().text().trim();
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
  }
};

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

  async getAnimeDetail(slug: string): Promise<any> {
    const html = await fetchHtml(`${this.baseUrl}/anime/${slug}/`);
    const $ = cheerio.load(html);
    return {
      title: $('.entry-title').text().trim(),
      poster: $('.thumb img').attr('src'),
      synopsis: $('.entry-content p').first().text().trim() || $('.entry-content').text().trim(),
      details: {
        type: $('.info-content .spe span:contains("Type")').text().split(':')[1]?.trim(),
        status: $('.info-content .spe span:contains("Status")').text().split(':')[1]?.trim(),
        episodes: $('.info-content .spe span:contains("Episodes")').text().split(':')[1]?.trim(),
      },
      episodes: $('.lsteps ul li').map((_, el) => ({
        title: $(el).find('.eps a').text().trim(),
        url: $(el).find('.eps a').attr('href')
      })).get()
    };
  }
};

export const kuramanimeScraper = {
  baseUrl: 'https://v12.kuramanime.tel',

  async getOngoing(page: number = 1): Promise<ScrapeResult> {
    const url = `${this.baseUrl}/anime/ongoing?page=${page}`;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const data: ScrapedAnime[] = [];

    $('.product__item').each((_, el) => {
      const title = $(el).find('.product__item__text h5 a').text().trim();
      const link = $(el).find('.product__item__text h5 a').attr('href') || '';
      const poster = $(el).find('.product__item__pic').attr('data-setbg') || '';
      const episode = $(el).find('.ep').text().trim();
      if (title) data.push({ title, poster, episode, url: link });
    });

    const nextBtn = $('.product__pagination a:contains("Next"), .product__pagination a i.fa-angle-right');
    
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
  }
};