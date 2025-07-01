# 🚀 BanglaVerse Deployment Guide

## Quick Solutions for 404 Errors on Vercel

If you're getting 404 errors on Vercel, **try these alternative hosting platforms** that are more reliable for React Single Page Applications:

## 🏆 Recommended Hosting Platforms

### 1. 🌐 Netlify (HIGHLY RECOMMENDED)
**Why Netlify is best for React SPAs:**
- Automatic SPA routing handling
- Free SSL and CDN
- Easy GitHub integration
- Excellent build performance

**Deployment Options:**

#### Option A: Drag & Drop (Easiest)
1. Build your project: `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag and drop your `dist` folder
4. Your app will be live instantly!

#### Option B: GitHub Integration
1. Push your code to GitHub
2. Go to https://app.netlify.com/
3. Click "New site from Git"
4. Connect your GitHub repo
5. Set build command: `npm run build`
6. Set publish directory: `dist`
7. Deploy!

#### Option C: CLI Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from your Frontend directory
npm run build
netlify deploy --prod --dir=dist
```

### 2. 🔥 Firebase Hosting
**Great Google platform with generous free tier:**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your Frontend directory
firebase init hosting
# Choose your Firebase project
# Set public directory: dist
# Configure as SPA: Yes
# Overwrite index.html: No

# Build and deploy
npm run build
firebase deploy
```

### 3. ⚡ Surge.sh
**Super simple and fast:**

```bash
# Install Surge CLI
npm install -g surge

# Build and deploy
npm run build
surge dist banglaverse.surge.sh
```

### 4. 🎨 Render
**Free tier with custom domain:**

1. Go to https://render.com
2. Click "New" → "Static Site"
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Deploy!

### 5. 🐙 GitHub Pages
**Free hosting with GitHub:**

```bash
# Install gh-pages
npm install -g gh-pages

# Deploy to GitHub Pages
npm run build
gh-pages -d dist
```

Then enable GitHub Pages in your repository settings.

## 🔧 Environment Variables Setup

**IMPORTANT:** After deploying, set these environment variables in your hosting platform:

- `VITE_API_URL`: Your backend API URL
- `VITE_FIREBASE_API_KEY`: Your Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID

### How to set environment variables:

#### Netlify:
1. Go to Site settings → Environment variables
2. Add your variables with `VITE_` prefix

#### Firebase:
```bash
firebase functions:config:set app.api_url="your-api-url"
```

#### Render:
1. Go to your service → Environment
2. Add your environment variables

## 🛠️ Troubleshooting Common Issues

### Issue: 404 on page refresh
**Solution:** Your hosting platform needs SPA routing configuration.

- **Netlify:** Add `_redirects` file (already included)
- **Vercel:** Update `vercel.json` (already included)
- **Firebase:** Update `firebase.json` (already included)

### Issue: API calls failing
**Solution:** 
1. Check your `VITE_API_URL` environment variable
2. Ensure your backend is deployed and accessible
3. Check CORS settings in your backend

### Issue: Build fails
**Solution:**
1. Clear cache: `rm -rf node_modules/.cache`
2. Reinstall: `npm install`
3. Try building locally: `npm run build`

## 🚀 Automated Deployment

Use the provided scripts:

```bash
# Make scripts executable
chmod +x deploy.sh multi-deploy.sh

# Deploy to specific platform
./multi-deploy.sh

# Follow the interactive prompts
```

## 📱 Backend Deployment

For your backend (Node.js/Express), consider these platforms:

### Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Render
1. Connect your GitHub repo
2. Set build command: `npm install`
3. Set start command: `npm start`

### Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create banglaverse-api

# Deploy
git push heroku main
```

## 🎯 Step-by-Step: Complete Deployment

1. **Build Frontend:**
   ```bash
   cd Frontend
   npm run build
   ```

2. **Deploy Frontend to Netlify** (Recommended):
   - Go to https://app.netlify.com/drop
   - Drag and drop `dist` folder
   - Note your app URL

3. **Deploy Backend to Railway:**
   ```bash
   cd Backend
   railway login
   railway link
   railway up
   ```

4. **Update Environment Variables:**
   - Set `VITE_API_URL` to your Railway backend URL
   - Redeploy frontend with updated environment

5. **Test Your App:**
   - Visit your Netlify URL
   - Test all features (translation, chat, documents)

## 💡 Pro Tips

1. **Always test locally first:** `npm run build && npm run preview`
2. **Check build size:** Large builds may cause deployment issues
3. **Monitor your hosting limits:** Most free tiers have bandwidth limits
4. **Use CDN:** Netlify and Firebase provide automatic CDN
5. **Custom domains:** Available on all platforms (some free, some paid)

## 🆘 If Nothing Works

If you're still having issues:

1. **Try Netlify drag & drop** - it almost always works
2. **Check browser console** for error messages
3. **Test API endpoints** directly (use Postman or curl)
4. **Clear browser cache** and try incognito mode
5. **Contact hosting support** - they're usually helpful

## 📞 Get Help

- **Netlify Support:** https://answers.netlify.com/
- **Firebase Support:** https://firebase.google.com/support
- **Surge Support:** https://surge.sh/help
- **Render Support:** https://render.com/docs

---

**Remember:** Vercel can be tricky with React SPAs. Netlify is almost always the most reliable choice for React applications.
