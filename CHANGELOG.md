# Changelog

All notable changes to VelyDocs will be documented in this file.

## [2.0.0] - 2024-02-05

### 🎉 Major Release - Complete Overhaul

#### Added
- **New Sources**: Added Otakudesu and enhanced Kuramanime support
- **API Authentication**: Tiered rate limiting with API key support
  - Default: 60 req/min (no key required)
  - Premium: 300 req/min (with API key)
  - Unlimited: No limit (special agent keys)
- **New Endpoints**:
  - `/api/:source/complete` - Completed anime (Otakudesu)
  - `/api/:source/search` - Search functionality for all sources
  - `/api/:source/schedule` - Weekly release schedules
  - `/api/:source/genre/:genre` - Genre filtering
  - `/api/:source/batch` - Batch download links
- **Configuration System**: `config.json` for managing API settings
  - Source enable/disable
  - Rate limit customization
  - Special agent key management
- **Rate Limit Headers**: All responses include rate limit information
- **Enhanced Error Handling**: More detailed error messages
- **TypeScript Improvements**: Full type coverage
- **Vercel Deployment**: Optimized for Vercel edge functions
- **Global CDN**: Edge caching with 60s TTL
- **Documentation**: Complete API documentation and deployment guide

#### Changed
- **Scraper Enhancement**: All scrapers rewritten with better selectors
- **Response Format**: Enhanced with more metadata fields
- **Pagination**: Improved pagination handling across all sources
- **Frontend**: Redesigned UI with better UX
- **Documentation Page**: Complete rebuild with API key input
- **Developer Page**: Enhanced with all endpoint patterns

#### Fixed
- Selector issues with Kuramanime
- Pagination bugs in various scrapers
- CORS configuration
- Error response formatting

#### Technical Improvements
- Modular scraper architecture
- Better error handling and logging
- Rate limiting implementation
- API key validation
- Response caching strategy
- Build optimization for Vercel

---

## [1.0.0] - 2024-01-01

### Initial Release

#### Added
- Basic scraping for Winbu, Samehadaku, Kuramanime
- Ongoing and latest endpoints
- Simple anime detail pages
- Basic pagination support
- Frontend documentation site
- React + TypeScript stack

#### Features
- Real-time scraping
- No database storage
- Simple REST API
- Basic error handling

---

## Upgrade Notes

### From v1.0 to v2.0

**Breaking Changes:**
- None - All v1.0 endpoints remain compatible

**New Features:**
- API authentication (optional)
- New endpoints (backward compatible)
- Enhanced error messages

**Migration Steps:**
1. Update dependencies: `npm install`
2. Review `config.json` for new settings
3. Optional: Add API keys for premium access
4. Redeploy to Vercel

**Recommended Actions:**
- Test new endpoints
- Configure rate limiting
- Set up monitoring
- Update client applications to use new features

---

## Future Roadmap

### v2.1.0 (Planned)
- [ ] WebSocket support for real-time updates
- [ ] GraphQL API alongside REST
- [ ] Database caching layer (optional)
- [ ] Admin dashboard
- [ ] Usage analytics
- [ ] More anime sources

### v2.2.0 (Planned)
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Recommendation engine
- [ ] User favorites/watchlist
- [ ] Mobile app integration

### v3.0.0 (Future)
- [ ] Machine learning recommendations
- [ ] Video streaming integration
- [ ] User authentication system
- [ ] Payment integration for premium
- [ ] Advanced analytics dashboard

---

**Versioning**: We use [Semantic Versioning](https://semver.org/)
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

**Release Cycle**: Monthly minor releases, quarterly major releases
