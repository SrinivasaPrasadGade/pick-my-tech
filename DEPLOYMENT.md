# Deployment Guide for PickMyTech

This guide will help you deploy PickMyTech to production.

## Prerequisites

- MongoDB Atlas account (or self-hosted MongoDB)
- Node.js hosting (Heroku, Vercel, Railway, etc.)
- Domain name (optional)

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI** and login:
```bash
heroku login
```

2. **Create Heroku app**:
```bash
cd server
heroku create pickmytech-api
```

3. **Set environment variables**:
```bash
heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set CLIENT_URL=https://your-frontend-url.com
```

4. **Deploy**:
```bash
git push heroku main
```

### Option 2: Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway will automatically deploy on push

### Option 3: DigitalOcean/VPS

1. **SSH into your server**
2. **Install Node.js and MongoDB**
3. **Clone repository**
4. **Set up PM2** for process management:
```bash
npm install -g pm2
cd server
pm2 start index.js --name pickmytech-api
pm2 save
pm2 startup
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
cd client
vercel
```

3. **Set environment variables** in Vercel dashboard:
```
REACT_APP_API_URL=https://your-backend-url.com
```

### Option 2: Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `build`
4. Set environment variables in Netlify dashboard

### Option 3: GitHub Pages

1. Update `package.json` in client:
```json
{
  "homepage": "https://yourusername.github.io/pick-my-tech",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Deploy:
```bash
npm run deploy
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/pickmytech
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-url.com
NEWS_API_KEY=your_news_api_key (optional)
OPENAI_API_KEY=your_openai_key (optional, for enhanced chatbot)
```

### Frontend
Update API calls to use environment variable:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

## Database Setup

### MongoDB Atlas

1. Create cluster on MongoDB Atlas
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for production)
4. Get connection string
5. Update MONGODB_URI in environment variables

### Seed Production Data

After deployment, you may want to seed initial data:
```bash
# On your server or locally with connection string
MONGODB_URI=your_production_uri node server/scripts/seed.js
```

## CORS Configuration

Make sure your backend allows requests from your frontend domain:
```javascript
// In server/index.js
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

## SSL/HTTPS

- **Vercel/Netlify**: Automatic SSL certificates
- **Heroku**: Automatic SSL on *.herokuapp.com domains
- **Custom domain**: Configure SSL certificates (Let's Encrypt recommended)

## Monitoring

### Backend
- Use PM2 monitoring: `pm2 monit`
- Set up error tracking (Sentry, LogRocket)
- Monitor MongoDB Atlas performance

### Frontend
- Use Vercel Analytics
- Set up error tracking
- Monitor performance with Lighthouse

## Performance Optimization

1. **Enable Gzip compression** in your server
2. **Use CDN** for static assets
3. **Optimize images** before uploading
4. **Enable caching** headers
5. **Minify CSS/JS** in production builds

## Security Checklist

- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Validate all inputs
- [ ] Rate limiting on API endpoints
- [ ] MongoDB connection security
- [ ] Environment variables secured
- [ ] CORS properly configured

## Troubleshooting

### Common Issues

1. **CORS errors**: Check CLIENT_URL in backend environment
2. **Database connection**: Verify MONGODB_URI and network access
3. **Build failures**: Check Node.js version compatibility
4. **API 404**: Verify API routes and base URL configuration

### Logs

- **Heroku**: `heroku logs --tail`
- **Vercel**: Dashboard → Deployments → View Logs
- **PM2**: `pm2 logs`

## Continuous Deployment

Set up GitHub Actions or similar CI/CD:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Support

For deployment issues, check:
- Platform-specific documentation
- MongoDB Atlas documentation
- React/Node.js deployment guides

