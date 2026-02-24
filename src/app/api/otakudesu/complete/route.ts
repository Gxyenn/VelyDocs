import { NextRequest } from 'next/server';
import { fetchHtml, OtakudesuScraper } from '@/lib/scraper';
import { createApiResponse, createErrorResponse } from '@/lib/api-response';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    
    const url = page === '1'
      ? `${OtakudesuScraper.baseUrl}/complete-anime/`
      : `${OtakudesuScraper.baseUrl}/complete-anime/page/${page}/`;
    
    const html = await fetchHtml(url);
    
    if (!html) {
      return createErrorResponse(request, 'Failed to fetch complete anime data', 500);
    }
    
    const data = OtakudesuScraper.parseHome(html);
    
    // Parse pagination
    const $ = cheerio.load(html);
    const currentPage = parseInt($('.pagination .current, .page-numbers.current').text() || page);
    const hasNextPage = $('.pagination .next, .page-numbers.next').length > 0;
    const totalPages = parseInt($('.pagination .page-numbers').not('.next').not('.prev').last().text()) || 1;
    
    return createApiResponse(request, 'complete', {
      status: 'success',
      source: 'otakudesu',
      baseUrl: OtakudesuScraper.baseUrl,
      pagination: {
        totalPages,
        currentPage,
        nextPage: hasNextPage ? currentPage + 1 : false
      },
      total: data.complete.length,
      data: data.complete
    });
  } catch (error) {
    console.error('Otakudesu complete error:', error);
    return createErrorResponse(
      request,
      'Internal server error',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
