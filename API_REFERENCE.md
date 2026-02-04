# VelyDocs v2.0 - API Reference

Quick reference guide for all available endpoints.

---

## 🔑 Authentication

### API Key Usage
```bash
# Include API key in header
curl -H "X-API-Key: YOUR_KEY" https://api.velydocs.com/api/endpoint
```

### Rate Limits
| Tier | Requests/Min | API Key Required |
|------|-------------|------------------|
| Default | 60 | ❌ |
| Premium | 300 | ✅ |
| Unlimited | ∞ | ✅ (Special Agent) |

---

## 📡 Endpoints Overview

### Base URL
```
https://your-domain.vercel.app/api
```

### Quick Navigation
- [Winbu Endpoints](#winbu-endpoints)
- [Samehadaku Endpoints](#samehadaku-endpoints)
- [Kuramanime Endpoints](#kuramanime-endpoints)
- [Otakudesu Endpoints](#otakudesu-endpoints)

---

## 🔴 Winbu Endpoints

### 1. Get Ongoing Anime
```http
GET /api/winbu/ongoing?page=1
```

**Response:**
```json
{
  "source": "winbu",
  "status": "success",
  "count": 20,
  "data": [
    {
      "title": "One Piece",
      "poster": "https://...",
      "episode": "Episode 1090",
      "url": "https://...",
      "genre": ["Action", "Adventure"]
    }
  ],
  "pagination": {
    "current": 1,
    "next": 2,
    "prev": null,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. Get Latest Releases
```http
GET /api/winbu/latest?page=1
```

### 3. Get Anime Details
```http
GET /api/winbu/anime/:slug
```

**Example:**
```bash
curl https://api.velydocs.com/api/winbu/anime/one-piece
```

**Response:**
```json
{
  "title": "One Piece",
  "poster": "https://...",
  "synopsis": "...",
  "genre": ["Action", "Adventure"],
  "status": "Ongoing",
  "type": "TV Series",
  "episodeList": [
    {
      "title": "Episode 1090",
      "url": "https://...",
      "episode": "1090"
    }
  ]
}
```

### 4. Search Anime
```http
GET /api/winbu/search?q=naruto&page=1
```

**Example:**
```bash
curl "https://api.velydocs.com/api/winbu/search?q=naruto"
```

### 5. Get By Genre
```http
GET /api/winbu/genre/:genre?page=1
```

**Example:**
```bash
curl https://api.velydocs.com/api/winbu/genre/action?page=1
```

---

## 🔵 Samehadaku Endpoints

### 1. Get Ongoing Anime
```http
GET /api/samehadaku/ongoing?page=1
```

### 2. Get Anime Details
```http
GET /api/samehadaku/anime/:slug
```

**Response includes:**
- Title & alternative title
- Synopsis
- Episode list with release dates
- Batch download links
- Genre, status, type, score

### 3. Search Anime
```http
GET /api/samehadaku/search?q=bleach
```

### 4. Get Weekly Schedule
```http
GET /api/samehadaku/schedule
```

**Response:**
```json
{
  "schedule": {
    "Monday": [
      {
        "title": "One Piece",
        "url": "https://...",
        "time": "19:00"
      }
    ],
    "Tuesday": [...],
    ...
  }
}
```

### 5. Get By Genre
```http
GET /api/samehadaku/genre/:genre?page=1
```

### 6. Get Batch Downloads
```http
GET /api/samehadaku/batch?page=1
```

---

## 🟢 Kuramanime Endpoints

### 1. Get Ongoing Anime
```http
GET /api/kuramanime/ongoing?page=1
```

### 2. Get Latest Releases
```http
GET /api/kuramanime/latest?page=1
```

### 3. Get Anime Details
```http
GET /api/kuramanime/anime/:slug
```

**Example:**
```bash
curl https://api.velydocs.com/api/kuramanime/anime/jujutsu-kaisen
```

### 4. Search Anime
```http
GET /api/kuramanime/search?q=demon
```

### 5. Get Weekly Schedule
```http
GET /api/kuramanime/schedule
```

### 6. Get By Genre
```http
GET /api/kuramanime/genre/:genre?page=1
```

**Available Genres:**
- action, adventure, comedy, drama
- fantasy, horror, mystery, romance
- sci-fi, shounen, seinen, etc.

---

## 🟡 Otakudesu Endpoints

### 1. Get Ongoing Anime
```http
GET /api/otakudesu/ongoing?page=1
```

### 2. Get Complete Anime
```http
GET /api/otakudesu/complete?page=1
```

### 3. Get Anime Details
```http
GET /api/otakudesu/anime/:slug
```

**Response includes:**
- Complete anime information
- Episode list with dates
- Batch download links
- Studio, score, release date

### 4. Search Anime
```http
GET /api/otakudesu/search?q=attack
```

### 5. Get Weekly Schedule
```http
GET /api/otakudesu/schedule
```

### 6. Get By Genre
```http
GET /api/otakudesu/genre/:genre?page=1
```

### 7. Get Batch Downloads
```http
GET /api/otakudesu/batch?page=1
```

---

## 📊 Response Format

### Success Response
```json
{
  "source": "string",
  "status": "success",
  "count": number,
  "data": array | object,
  "pagination": {
    "current": number,
    "next": number | null,
    "prev": number | null,
    "hasNext": boolean,
    "hasPrev": boolean
  },
  "timestamp": "ISO 8601 string",
  "tier": "default" | "premium" | "unlimited"
}
```

### Error Response
```json
{
  "source": "string",
  "status": "error",
  "message": "string",
  "timestamp": "ISO 8601 string"
}
```

### Rate Limit Response (429)
```json
{
  "status": "error",
  "message": "Rate limit exceeded. Please try again later.",
  "resetAt": "ISO 8601 string"
}
```

---

## 📋 Query Parameters

### Common Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number for pagination | `?page=2` |
| `q` or `query` | string | Search query | `?q=naruto` |
| `genre` | string | Genre filter (in path) | `/genre/action` |

---

## 🔒 Rate Limit Headers

Every response includes:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 2024-02-05T10:31:00.000Z
```

### Header Descriptions

- `X-RateLimit-Limit`: Total requests allowed in window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: When the rate limit resets (ISO 8601)

---

## 💡 Usage Examples

### JavaScript/TypeScript

```javascript
// Basic fetch
const response = await fetch('https://api.velydocs.com/api/winbu/ongoing?page=1');
const data = await response.json();
console.log(data);

// With API key
const response = await fetch('https://api.velydocs.com/api/winbu/ongoing', {
  headers: {
    'X-API-Key': 'YOUR_KEY'
  }
});

// Check rate limits
const remaining = response.headers.get('X-RateLimit-Remaining');
console.log(`Remaining requests: ${remaining}`);
```

### Python

```python
import requests

# Basic request
response = requests.get('https://api.velydocs.com/api/winbu/ongoing?page=1')
data = response.json()
print(data)

# With API key
headers = {'X-API-Key': 'YOUR_KEY'}
response = requests.get('https://api.velydocs.com/api/winbu/ongoing', headers=headers)

# Check rate limits
remaining = response.headers.get('X-RateLimit-Remaining')
print(f'Remaining requests: {remaining}')
```

### PHP

```php
<?php
// Basic request
$ch = curl_init('https://api.velydocs.com/api/winbu/ongoing?page=1');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);

// With API key
$ch = curl_init('https://api.velydocs.com/api/winbu/ongoing');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-API-Key: YOUR_KEY'
]);
$response = curl_exec($ch);
curl_close($ch);
?>
```

---

## 🎯 Best Practices

### 1. Use Pagination
Always paginate large result sets:
```bash
# Good
/api/winbu/ongoing?page=1
/api/winbu/ongoing?page=2

# Avoid fetching all at once
```

### 2. Handle Rate Limits
```javascript
if (response.status === 429) {
  const resetTime = response.headers.get('X-RateLimit-Reset');
  console.log(`Rate limited. Retry after: ${resetTime}`);
}
```

### 3. Cache Responses
Client-side caching recommended (60s):
```javascript
const cache = new Map();
const CACHE_TTL = 60000; // 60 seconds

async function fetchWithCache(url) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await fetch(url).then(r => r.json());
  cache.set(url, { data, time: Date.now() });
  return data;
}
```

### 4. Error Handling
```javascript
try {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API Error:', error.message);
}
```

---

## 🚨 Common Errors

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Invalid endpoint. Use /api/:source/:type"
}
```
**Solution:** Check endpoint path format

### 404 Not Found
```json
{
  "status": "error",
  "message": "Source 'xyz' not found."
}
```
**Solution:** Verify source name (winbu, samehadaku, kuramanime, otakudesu)

### 429 Too Many Requests
```json
{
  "status": "error",
  "message": "Rate limit exceeded. Please try again later.",
  "resetAt": "2024-02-05T10:31:00.000Z"
}
```
**Solution:** Wait until reset time or use API key for higher limits

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal scraping error"
}
```
**Solution:** Source website might be down or changed structure

---

## 📞 Support

- **Documentation**: [README.md](./README.md)
- **Deployment**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md)

---

**VelyDocs v2.0** - Production Ready API  
Made with ❤️ by Gxyenn
