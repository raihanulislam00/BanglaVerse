#!/bin/bash

# BanglaVerse Deployment Script for Vercel
# This script handles the complete deployment process

echo "🚀 Starting BanglaVerse deployment process..."

# Check if we're in the Frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the Frontend directory"
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist node_modules/.cache

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "📥 Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Deploy to production
    vercel --prod
    
    echo "🎉 Deployment complete!"
    echo "📋 Next steps:"
    echo "   1. Check your Vercel dashboard for deployment status"
    echo "   2. Verify environment variables are set correctly"
    echo "   3. Test all routes on your deployed site"
    
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
