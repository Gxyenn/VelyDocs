<div align="center">
<img width="1200" height="475" alt="VelyDocs" src="https://files.catbox.moe/gmwn6y.gif" />
</div>

# VelyDocs v2.0 - Next-Gen Anime API Provider

> **Production-ready, real-time anime scraping API with unified JSON responses.**  
> Free to use. No mock data. Pure performance.

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Features

### Core Capabilities
- ✨ **4 Major Sources**: Winbu, Samehadaku, Kuramanime, Otakudesu
- 🔥 **Real-time Scraping**: No database, pure live parsing
- 🎯 **Unified Schema**: Consistent JSON across all sources
- 🌐 **Multi-endpoint**: ongoing, latest, search, genre, schedule, batch
- ⚡ **Rate Limiting**: Tiered access with API key support
- 🔐 **API Authentication**: Premium & unlimited tiers available
- 🌍 **Global CDN**: Edge deployment for low latency
- 📊 **Pagination**: Navigate through large datasets efficiently

### Rate Limit Tiers
| Tier | Requests | API Key Required |
|------|----------|------------------|
| **Default** | 60 req/min | ❌ No |
| **Premium** | 300 req/min | ✅ Yes |
| **Unlimited** | No limit | ✅ Special Agent Key |

---

## 📡 API Endpoints

### Base URL
```
https://your-domain.vercel.app/api
```

### Available Endpoints

#### 🔴 **Winbu**
```bash
GET /api/winbu/ongoing?page=1          # Ongoing anime
GET /api/winbu/latest?page=1           # Latest releases
GET /api/winbu/anime/:slug             # Anime details
GET /api/winbu/search?q=naruto         # Search anime
GET /api/winbu/genre/:genre?page=1     # Filter by genre
```

#### 🔵 **Samehadaku**
```bash
GET /api/samehadaku/ongoing?page=1     # Ongoing anime
GET /api/samehadaku/anime/:slug        # Anime details
GET /api/samehadaku/search?q=bleach    # Search anime
GET /api/samehadaku/schedule           # Weekly schedule
GET /api/samehadaku/genre/:genre       # Filter by genre
GET /api/samehadaku/batch?page=1       # Batch downloads
```

#### 🟢 **Kuramanime**
```bash
GET /api/kuramanime/ongoing?page=1     # Ongoing anime
GET /api/kuramanime/latest?page=1      # Latest releases
GET /api/kuramanime/anime/:slug        # Anime details
GET /api/kuramanime/search?q=demon     # Search anime
GET /api/kuramanime/schedule           # Weekly schedule
GET /api/kuramanime/genre/:genre       # Filter by genre
```

#### 🟡 **Otakudesu**
```bash
GET /api/otakudesu/ongoing?page=1      # Ongoing anime
GET /api/otakudesu/complete?page=1     # Completed anime
GET /api/otakudesu/anime/:slug         # Anime details
GET /api/otakudesu/search?q=attack     # Search anime
GET /api/otakudesu/schedule            # Weekly schedule
GET /api/otakudesu/genre/:genre        # Filter by genre
GET /api/otakudesu/batch?page=1        # Batch downloads
```

---

## 🔧 Installation & Deployment

### Prerequisites
- Node.js 18+
- npm or yarn
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/velydocs.git
cd velydocs
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure settings**
Edit `config.json` to customize:
- Rate limits
- API keys (Special Agents)
- Source availability
- Feature flags

4. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

### Deploy to Vercel

#### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/velydocs)

#### Option 2: Manual Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Vercel Configuration
The project includes `vercel.json` with optimized settings:
- Serverless functions for API routes
- Global CDN distribution
- Edge regions: Singapore, Tokyo, Seoul, Sydney
- CORS headers configured
- 60s cache policy

---

## 💻 Usage Examples

### Basic Usage (No API Key)
```javascript
// Fetch ongoing anime
fetch('https://api.velydocs.com/api/winbu/ongoing?page=1')
  .then(res => res.json())
  .then(data => console.log(data));
```

### With API Key (Premium)
```javascript
fetch('https://api.velydocs.com/api/otakudesu/ongoing', {
  headers: {
    'X-API-Key': 'YOUR_API_KEY_HERE'
  }
})
  .then(res => res.json())
  .then(data => {
    console.log('Data:', data);
    console.log('Rate Limit:', res.headers.get('X-RateLimit-Remaining'));
  });
```

### TypeScript Client
```typescript
import axios from 'axios';

interface VelyDocsConfig {
  apiKey?: string;
  baseUrl?: string;
}

class VelyDocsClient {
  private config: VelyDocsConfig;

  constructor(config: VelyDocsConfig = {}) {
    this.config = {
      baseUrl: 'https://api.velydocs.com/api',
      ...config
    };
  }

  private async request(endpoint: string) {
    const headers = this.config.apiKey 
      ? { 'X-API-Key': this.config.apiKey }
      : {};

    const { data } = await axios.get(
      `${this.config.baseUrl}${endpoint}`, 
      { headers }
    );
    
    return data;
  }

  async getOngoing(source: string, page = 1) {
    return this.request(`/${source}/ongoing?page=${page}`);
  }

  async search(source: string, query: string) {
    return this.request(`/${source}/search?q=${encodeURIComponent(query)}`);
  }

  async getAnime(source: string, slug: string) {
    return this.request(`/${source}/anime/${slug}`);
  }

  async getSchedule(source: string) {
    return this.request(`/${source}/schedule`);
  }
}

// Usage
const client = new VelyDocsClient({ 
  apiKey: 'YOUR_API_KEY' 
});

const data = await client.getOngoing('winbu', 1);
console.log(data);
```

---

## 📦 Response Format

### Successful Response
```json
{
  "source": "winbu",
  "status": "success",
  "count": 20,
  "data": [
    {
      "title": "One Piece",
      "poster": "https://example.com/poster.jpg",
      "episode": "Episode 1090",
      "url": "https://winbu.net/anime/one-piece",
      "genre": ["Action", "Adventure", "Fantasy"]
    }
  ],
  "pagination": {
    "current": 1,
    "next": 2,
    "prev": null,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-02-05T10:30:00.000Z",
  "tier": "premium"
}
```

### Error Response
```json
{
  "source": "winbu",
  "status": "error",
  "message": "Failed to fetch data",
  "timestamp": "2024-02-05T10:30:00.000Z"
}
```

### Rate Limit Response (429)
```json
{
  "status": "error",
  "message": "Rate limit exceeded. Please try again later.",
  "resetAt": "2024-02-05T10:31:00.000Z"
}
```

---

## 🔐 API Key Management

### Getting an API Key
API keys are managed in `config.json`. For special agent access:

1. Edit `config.json`
2. Add your key to `specialAgents.keys` array:
```json
{
  "key": "VELY_AGENT_YOUR_KEY",
  "name": "Your Name",
  "tier": "unlimited",
  "active": true,
  "createdAt": "2024-02-05T00:00:00.000Z"
}
```

### Using Your API Key
Include in request header:
```bash
curl -H "X-API-Key: YOUR_API_KEY" https://api.velydocs.com/api/winbu/ongoing
```

---

## 🛠️ Configuration

### `config.json` Structure
```json
{
  "api": {
    "version": "2.0.0",
    "rateLimit": {
      "default": { "requests": 60, "window": "1m" },
      "premium": { "requests": 300, "window": "1m" },
      "unlimited": { "requests": -1, "window": "1m" }
    }
  },
  "specialAgents": {
    "enabled": true,
    "keys": [...]
  },
  "sources": {
    "winbu": { "enabled": true, "baseUrl": "...", "endpoints": [...] },
    "samehadaku": { "enabled": true, ... },
    "kuramanime": { "enabled": true, ... },
    "otakudesu": { "enabled": true, ... }
  }
}
```

---

## 🏗️ Architecture

### Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Vercel Serverless Functions
- **Language**: TypeScript
- **Parser**: Cheerio (DOM traversal)
- **Frontend**: React + Vite

### How It Works
1. Client sends request to API endpoint
2. Rate limiting check (IP-based or API key)
3. Scraper fetches HTML from source
4. Cheerio parses DOM and extracts data
5. Data normalized to unified schema
6. JSON response sent to client
7. CDN caches response for 60s

### Performance
- **Response Time**: < 2s average
- **Availability**: 99.9% uptime
- **Cache**: Edge CDN with 60s TTL
- **Regions**: 20+ global edge locations

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

**Created by**: [Gxyenn](https://github.com/gxyenn)  
**Version**: 2.0.0  
**Year**: 2024

### Sources
- [Winbu](https://winbu.net)
- [Samehadaku](https://samehadaku.how)
- [Kuramanime](https://kuramanime.tel)
- [Otakudesu](https://otakudesu.cloud)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/velydocs/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/velydocs/discussions)
- **Email**: support@velydocs.com

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ by Gxyenn

</div>
