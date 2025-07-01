#!/bin/bash

# BanglaVerse Multi-Platform Deployment Script
# This script provides options to deploy to different hosting platforms

echo "🌏 BanglaVerse Multi-Platform Deployment"
echo "========================================"

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the Frontend directory"
    exit 1
fi

echo "🎯 RECOMMENDED: Since Vercel is giving 404 errors, try these alternatives:"
echo ""
echo "Choose your deployment platform:"
echo "1. 🌐 Netlify (BEST for React SPAs - Recommended)"
echo "2. 🔥 Firebase Hosting (Google's platform)"
echo "3. ⚡ Surge.sh (Super fast and simple)"
echo "4. 🎨 Render (Free tier with custom domain)"
echo "5. 🐙 GitHub Pages (Free with GitHub repo)"
echo "6. ▲ Vercel (Try with fixed config)"
echo "7. 📦 Build only (manual deployment)"
echo ""

read -p "Enter your choice (1-7): " choice

# Clean and build
echo "🧹 Cleaning previous builds..."
rm -rf dist node_modules/.cache

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

case $choice in
    1)
        echo "🚀 Deploying to Netlify..."
        echo "📋 Manual Steps:"
        echo "   1. Go to https://app.netlify.com/"
        echo "   2. Drag and drop the 'dist' folder"
        echo "   3. Or connect your GitHub repository"
        echo "   4. Set build command: npm run build"
        echo "   5. Set publish directory: dist"
        echo ""
        echo "💡 Your dist folder is ready at: $(pwd)/dist"
        ;;
    2)
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "📥 Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        # Remove previous deployment
        rm -rf .vercel
        
        echo "🌐 Starting Vercel deployment..."
        vercel --prod
        ;;
    3)
        echo "🚀 Deploying to Firebase..."
        if ! command -v firebase &> /dev/null; then
            echo "📥 Installing Firebase CLI..."
            npm install -g firebase-tools
        fi
        
        echo "🔐 Please login to Firebase:"
        firebase login
        
        echo "⚙️ Initializing Firebase (if not done already):"
        firebase init hosting
        
        echo "🌐 Deploying to Firebase..."
        firebase deploy
        ;;
    4)
        echo "🚀 Deploying to Surge.sh..."
        if ! command -v surge &> /dev/null; then
            echo "📥 Installing Surge CLI..."
            npm install -g surge
        fi
        
        cd dist
        cp index.html 200.html  # For SPA routing
        
        echo "🌐 Deploying to Surge..."
        surge --domain banglaverse-${RANDOM}.surge.sh
        cd ..
        ;;
    5)
        echo "✅ Build completed successfully!"
        echo "📁 Built files are in: $(pwd)/dist"
        echo "🔗 You can now manually upload these files to any hosting service"
        echo ""
        echo "📋 Manual deployment options:"
        echo "   • Netlify: Drag & drop dist folder to netlify.com"
        echo "   • GitHub Pages: Copy dist contents to gh-pages branch"
        echo "   • Any web hosting: Upload dist folder contents"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📋 Don't forget to:"
echo "   ✅ Set environment variables in your hosting platform"
echo "   ✅ Configure custom domain (if needed)"
echo "   ✅ Test all routes on your deployed site"
echo "   ✅ Deploy your backend to a compatible platform"
echo ""
echo "🔗 Environment variables needed:"
echo "   VITE_API_URL=https://your-backend-url"
echo "   VITE_FIREBASE_API_KEY=your_firebase_api_key"
echo "   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com"
echo "   VITE_FIREBASE_PROJECT_ID=your_project_id"
echo "   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com"
echo "   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id"
echo "   VITE_FIREBASE_APP_ID=your_app_id"
echo "   VITE_GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key"
