import type { VercelRequest, VercelResponse } from '@vercel/node';
import { 
  winbuScraper, 
  samehadakuScraper, 
  kuramanimeScraper, 
  otakudesuScraper 
} from './scrapers';
import config from '../config.json';

// Rate limiting in-memory store (for demo - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const getRateLimitTier = (apiKey?: string): 'default' | 'premium' | 'unlimited' => {
  if (!apiKey) return 'default';
  
  const agent = config.specialAgents.keys.find(
    (key: any) => key.key === apiKey && key.active
  );
  
  if (agent) {
    return agent.tier as 'default' | 'premium' | 'unlimited';
  }
  
  return 'default';
};

const checkRateLimit = (identifier: string, tier: 'default' | 'premium' | 'unlimited'): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} => {
  const tierConfig = config.api.rateLimit[tier];
  
  // Unlimited tier always passes
  if (tierConfig.requests === -1) {
    return { allowed: true, remaining: -1, resetTime: 0 };
  }
  
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    // New window
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return { 
      allowed: true, 
      remaining: tierConfig.requests - 1,
      resetTime: now + windowMs
    };
  }
  
  if (record.count >= tierConfig.requests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime
    };
  }
  
  // Increment count
  record.count++;
  rateLimitStore.set(identifier, record);
  
  return {
    allowed: true,
    remaining: tierConfig.requests - record.count,
    resetTime: record.resetTime
  };
};

const sendResponse = (res: VercelResponse, status: number, data: any, rateLimit?: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  
  if (rateLimit) {
    res.setHeader('X-RateLimit-Limit', rateLimit.limit.toString());
    res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
    res.setHeader('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());
  }
  
  res.status(status).json(data);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return sendResponse(res, 200, {});
  }

  let source = 'unknown';

  try {
    // Extract API key from header
    const apiKey = req.headers['x-api-key'] as string | undefined;
    const tier = getRateLimitTier(apiKey);

    // Check rate limit - safely handle req.socket being undefined in serverless
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || 'unknown';
    const identifier = apiKey || `ip:${clientIp}`;

    const rateLimitCheck = checkRateLimit(identifier, tier);

    if (!rateLimitCheck.allowed) {
      const tierConfig = config.api.rateLimit[tier];
      return sendResponse(
        res,
        429,
        {
          status: 'error',
          message: tierConfig.message,
          resetAt: new Date(rateLimitCheck.resetTime).toISOString()
        },
        {
          limit: tierConfig.requests,
          remaining: 0,
          resetTime: rateLimitCheck.resetTime
        }
      );
    }

    // Robust URL parsing
    const url = req.url || '';
    const urlObj = new URL(url, 'http://localhost');
    const pathParts = urlObj.pathname.split('/').filter(p => p !== '');
    const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
    const query = urlObj.searchParams.get('q') || urlObj.searchParams.get('query') || '';
    const genre = urlObj.searchParams.get('genre') || '';

    const apiIdx = pathParts.indexOf('api');
    if (apiIdx === -1 || pathParts.length < apiIdx + 2) {
      return sendResponse(res, 400, {
        status: 'error',
        message: 'Invalid endpoint. Use /api/:source/:type or /api/:source/:type/:param'
      });
    }

    source = pathParts[apiIdx + 1];
    const type = pathParts[apiIdx + 2];
    const param = pathParts[apiIdx + 3];

    let result: any = null;
    
    // Check if source is enabled
    const sourceConfig = (config.sources as any)[source];
    if (!sourceConfig || !sourceConfig.enabled) {
      return sendResponse(res, 404, { 
        status: 'error', 
        message: `Source '${source}' not found or disabled.` 
      });
    }
    
    switch (source) {
      case 'winbu':
        if (type === 'ongoing') result = await winbuScraper.getOngoing(page);
        else if (type === 'latest') result = await winbuScraper.getLatest(page);
        else if (type === 'anime' && param) result = await winbuScraper.getAnimeDetail(param);
        else if (type === 'search' && query) result = await winbuScraper.searchAnime(query, page);
        else if (type === 'genre' && (param || genre)) result = await winbuScraper.getByGenre(param || genre, page);
        break;

      case 'samehadaku':
        if (type === 'ongoing') result = await samehadakuScraper.getOngoing(page);
        else if (type === 'anime' && param) result = await samehadakuScraper.getAnimeDetail(param);
        else if (type === 'search' && query) result = await samehadakuScraper.searchAnime(query);
        else if (type === 'schedule') result = await samehadakuScraper.getSchedule();
        else if (type === 'genre' && (param || genre)) result = await samehadakuScraper.getByGenre(param || genre, page);
        else if (type === 'batch') result = await samehadakuScraper.getBatch(page);
        break;

      case 'kuramanime':
        if (type === 'ongoing') result = await kuramanimeScraper.getOngoing(page);
        else if (type === 'latest') result = await kuramanimeScraper.getLatest(page);
        else if (type === 'anime' && param) result = await kuramanimeScraper.getAnimeDetail(param);
        else if (type === 'search' && query) result = await kuramanimeScraper.searchAnime(query);
        else if (type === 'schedule') result = await kuramanimeScraper.getSchedule();
        else if (type === 'genre' && (param || genre)) result = await kuramanimeScraper.getByGenre(param || genre, page);
        break;

      case 'otakudesu':
        if (type === 'ongoing') result = await otakudesuScraper.getOngoing(page);
        else if (type === 'complete') result = await otakudesuScraper.getComplete(page);
        else if (type === 'anime' && param) result = await otakudesuScraper.getAnimeDetail(param);
        else if (type === 'search' && query) result = await otakudesuScraper.searchAnime(query);
        else if (type === 'schedule') result = await otakudesuScraper.getSchedule();
        else if (type === 'genre' && (param || genre)) result = await otakudesuScraper.getByGenre(param || genre, page);
        else if (type === 'batch') result = await otakudesuScraper.getBatch(page);
        break;

      default:
        return sendResponse(res, 404, { 
          status: 'error', 
          message: `Source '${source}' not found.` 
        });
    }

    if (!result) {
      throw new Error("Method not implemented or invalid parameters. Check the endpoint and required parameters.");
    }

    return sendResponse(
      res, 
      200, 
      {
        source,
        status: 'success',
        count: result.data ? result.data.length : (result.schedule ? Object.keys(result.schedule).length : 1),
        data: result.data || result.schedule || result,
        pagination: result.pagination || null,
        timestamp: new Date().toISOString(),
        tier: tier !== 'default' ? tier : undefined
      },
      {
        limit: config.api.rateLimit[tier].requests,
        remaining: rateLimitCheck.remaining,
        resetTime: rateLimitCheck.resetTime
      }
    );

  } catch (error: any) {
    console.error('Scraping error:', error);
    return sendResponse(res, 500, {
      source,
      status: 'error',
      message: error.message || 'Internal scraping error',
      timestamp: new Date().toISOString()
    });
  }
}
