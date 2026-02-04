import type { VercelRequest, VercelResponse } from '@vercel/node';
import { winbuScraper, samehadakuScraper, kuramanimeScraper } from './scrapers';

const sendResponse = (res: VercelResponse, status: number, data: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(status).json(data);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return sendResponse(res, 200, {});
  }

  const { url = '' } = req;
  const urlObj = new URL(url, `http://${req.headers.host}`);
  const pathParts = urlObj.pathname.split('/').filter(p => p !== ''); 
  const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
  
  const apiIdx = pathParts.indexOf('api');
  if (apiIdx === -1 || pathParts.length < apiIdx + 3) {
    return sendResponse(res, 400, { status: 'error', message: 'Use /api/:source/:type' });
  }

  const source = pathParts[apiIdx + 1];
  const type = pathParts[apiIdx + 2];
  const param = pathParts[apiIdx + 3];

  try {
    let result: any = null;
    
    switch (source) {
      case 'winbu':
        if (type === 'ongoing') result = await winbuScraper.getOngoing(page);
        else if (type === 'latest') result = await winbuScraper.getLatest(page);
        break;

      case 'samehadaku':
        if (type === 'ongoing') result = await samehadakuScraper.getOngoing(page);
        else if (type === 'anime' && param) result = await samehadakuScraper.getAnimeDetail(param);
        break;

      case 'kuramanime':
        if (type === 'ongoing') result = await kuramanimeScraper.getOngoing(page);
        break;

      default:
        return sendResponse(res, 404, { status: 'error', message: `Source '${source}' not found.` });
    }

    if (!result) throw new Error("Method not implemented or invalid parameters.");

    return sendResponse(res, 200, {
      source,
      status: 'success',
      count: result.data ? result.data.length : 1,
      data: result.data || result,
      pagination: result.pagination || null,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    return sendResponse(res, 500, {
      source,
      status: 'error',
      message: error.message || 'Internal scraping error',
    });
  }
}