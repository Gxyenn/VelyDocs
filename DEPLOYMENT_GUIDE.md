# VelyDocs v2.0 - Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:
- [Node.js 18+](https://nodejs.org/) installed
- [Git](https://git-scm.com/) installed
- A [Vercel](https://vercel.com) account (free tier works)
- Basic knowledge of terminal/command line

---

## 🚀 Quick Deploy to Vercel

### Method 1: One-Click Deploy (Easiest)

1. Click the button below:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/velydocs)

2. Sign in to Vercel (or create an account)
3. Click "Create" to deploy
4. Wait for deployment to complete (usually 1-2 minutes)
5. Your API will be live at: `https://your-project.vercel.app`

### Method 2: Deploy from GitHub

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - VelyDocs v2.0"
   git branch -M main
   git remote add origin https://github.com/yourusername/velydocs.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"
   - Configure settings (optional):
     - **Framework Preset**: Vite
     - **Root Directory**: `./`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Click "Deploy"

3. **Wait for deployment** (1-2 minutes)

### Method 3: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy to preview:**
   ```bash
   vercel
   ```

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

---

## ⚙️ Configuration

### 1. Configure API Keys (Optional)

To enable premium/unlimited rate limits:

1. Edit `config.json` and add your special agent keys:
   ```json
   {
     "specialAgents": {
       "enabled": true,
       "keys": [
         {
           "key": "VELY_AGENT_YOUR_CUSTOM_KEY",
           "name": "Your Name",
           "tier": "unlimited",
           "active": true,
           "createdAt": "2024-02-05T00:00:00.000Z"
         }
       ]
     }
   }
   ```

2. Commit and redeploy:
   ```bash
   git add config.json
   git commit -m "Update API keys"
   git push
   ```

### 2. Environment Variables (Optional)

In Vercel Dashboard:
1. Go to your project
2. Click "Settings" → "Environment Variables"
3. Add variables:
   - `NODE_ENV` = `production`
   - `RATE_LIMIT_DEFAULT` = `60` (optional)
   - `RATE_LIMIT_PREMIUM` = `300` (optional)

### 3. Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → "Settings" → "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `api.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning (automatic)

---

## 🧪 Testing Your Deployment

### Test API Endpoints

```bash
# Replace with your Vercel URL
API_URL="https://your-project.vercel.app"

# Test ongoing endpoint
curl "$API_URL/api/winbu/ongoing?page=1"

# Test with API key
curl -H "X-API-Key: YOUR_API_KEY" "$API_URL/api/otakudesu/ongoing"

# Test search
curl "$API_URL/api/samehadaku/search?q=naruto"

# Test anime detail
curl "$API_URL/api/kuramanime/anime/jujutsu-kaisen"
```

### Expected Response

```json
{
  "source": "winbu",
  "status": "success",
  "count": 20,
  "data": [...],
  "pagination": {
    "current": 1,
    "next": 2,
    "prev": null,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-02-05T10:30:00.000Z"
}
```

---

## 📊 Monitoring & Analytics

### View Deployment Logs

1. Go to Vercel Dashboard → Your Project → "Deployments"
2. Click on any deployment
3. Click "View Function Logs" to see API logs

### Check Performance

1. Go to Vercel Dashboard → Your Project → "Analytics"
2. View:
   - Request count
   - Response times
   - Error rates
   - Geographic distribution

### Rate Limit Headers

Every API response includes rate limit information:
- `X-RateLimit-Limit`: Total requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: When the limit resets

---

## 🔧 Troubleshooting

### Issue: Deployment Failed

**Solution:**
1. Check build logs in Vercel Dashboard
2. Ensure all dependencies are in `package.json`
3. Verify `vercel.json` configuration
4. Try deploying with verbose logs:
   ```bash
   vercel --debug
   ```

### Issue: API Returns 500 Error

**Solution:**
1. Check function logs in Vercel Dashboard
2. Verify source websites are accessible
3. Test locally first:
   ```bash
   npm run dev
   ```

### Issue: Rate Limit Not Working

**Solution:**
1. Check `config.json` has correct structure
2. Verify API key format in headers:
   ```bash
   curl -H "X-API-Key: YOUR_KEY" <API_URL>
   ```
3. Check logs for rate limit messages

### Issue: CORS Errors

**Solution:**
CORS is already configured in `vercel.json` and `api/index.ts`. If still having issues:
1. Verify request includes proper headers
2. Check browser console for specific error
3. Ensure using `https://` not `http://`

---

## 🔐 Security Best Practices

### 1. Protect Your API Keys
- Never commit real API keys to GitHub
- Use environment variables for sensitive data
- Rotate keys periodically

### 2. Enable Rate Limiting
Rate limiting is enabled by default to prevent abuse:
- Default: 60 requests/minute
- Premium: 300 requests/minute (with API key)
- Unlimited: No limit (special agent keys)

### 3. Monitor Usage
- Check Vercel Analytics regularly
- Set up alerts for unusual traffic
- Review function logs for errors

---

## 📈 Scaling & Optimization

### Performance Tips

1. **Use Pagination**: Always use `?page=X` for large datasets
2. **Cache Responses**: Client-side caching recommended (60s)
3. **Batch Requests**: Group related requests when possible
4. **Use CDN**: Responses are cached at edge for 60s

### Upgrade Vercel Plan

For higher limits, consider upgrading:
- **Hobby (Free)**: 100GB bandwidth, 100 GB-hours
- **Pro ($20/mo)**: 1TB bandwidth, 1000 GB-hours
- **Enterprise**: Custom limits

---

## 🆘 Support

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/velydocs/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/velydocs/discussions)
- **Email**: support@velydocs.com

### Useful Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [VelyDocs README](./README.md)

---

## ✅ Deployment Checklist

Before going live, ensure:

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] API endpoints tested
- [ ] Rate limiting configured
- [ ] API keys added (if needed)
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
- [ ] Documentation updated
- [ ] Team notified

---

## 🎉 Success!

Your VelyDocs API is now live and ready to use!

**Next Steps:**
1. Test all endpoints
2. Share API URL with your team
3. Update documentation with your URL
4. Monitor usage and performance
5. Scale as needed

---

**Made with ❤️ by Gxyenn**  
VelyDocs v2.0 - Production Kernel
