# Vercel Environment Variables Configuration Guide

## Frontend Environment Variables

Set these in your Vercel dashboard under your frontend project → Settings → Environment Variables:

### Required Variables:
```
VITE_API_BASE_URL=https://your-backend-domain.vercel.app
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Optional Variables:
```
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

## Backend Environment Variables

Set these in your Vercel dashboard under your backend project → Settings → Environment Variables:

### Required Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/banglaverse
GOOGLE_AI_API_KEY=your_google_gemini_api_key
OPENAI_API_KEY=your_openai_api_key (if using OpenAI)
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Optional Variables:
```
PORT=3000
JWT_SECRET=your_jwt_secret_key
SOCKET_IO_CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

## Deployment Steps

1. **Deploy Backend First:**
   ```bash
   cd Backend
   vercel --prod
   ```

2. **Get Backend URL:**
   - Copy the deployed backend URL from Vercel
   - Update `VITE_API_BASE_URL` in frontend environment variables

3. **Deploy Frontend:**
   ```bash
   cd Frontend
   vercel --prod
   ```

4. **Update CORS Settings:**
   - Add frontend URL to `CORS_ORIGIN` in backend environment variables

## Vercel Dashboard Configuration

### Function Settings (for Backend):
- **Region**: Auto (or choose closest to your users)
- **Node.js Version**: 18.x (default)
- **Memory**: 1024 MB (sufficient for most operations)
- **Timeout**: 30 seconds (for translation/AI operations)

### Build Settings (for Frontend):
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Custom Domains

To add custom domains:
1. Go to your project in Vercel dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Configure DNS records as instructed

## Monitoring and Debugging

### Useful Vercel Commands:
```bash
# Check deployment logs
vercel logs

# Check current deployments
vercel ls

# Redeploy without changes
vercel --prod --force

# Remove a deployment
vercel rm deployment-url
```

### Common Issues and Solutions:

1. **Build Failures:**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify environment variables are set

2. **API Connection Issues:**
   - Verify backend URL is correct in frontend env vars
   - Check CORS configuration
   - Ensure both frontend and backend are deployed

3. **Static File Issues:**
   - Check vite.config.js base path configuration
   - Verify public folder structure

## Security Recommendations

1. **Environment Variables:**
   - Never commit sensitive keys to Git
   - Use different keys for development and production
   - Regularly rotate API keys

2. **CORS Configuration:**
   - Restrict CORS to your specific domains
   - Avoid using "*" in production

3. **Rate Limiting:**
   - Implement rate limiting for API endpoints
   - Monitor usage in Vercel analytics

## Performance Optimization

1. **Frontend:**
   - Enable Vercel's automatic compression
   - Use code splitting for large applications
   - Optimize images and assets

2. **Backend:**
   - Implement caching where appropriate
   - Use database indexing
   - Monitor function execution times

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Discord**: https://vercel.com/discord
- **BanglaVerse Issues**: Report in your project repository
