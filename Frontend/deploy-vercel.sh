#!/bin/bash

echo "🚀 BanglaVerse Frontend Vercel Deployment Script"
echo "================================================"

# Navigate to Frontend directory
cd Frontend

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building the project..."
npm run build

echo "🚀 Deploying to Vercel..."
echo "Make sure you run this from the Frontend directory on Vercel"
echo ""
echo "Vercel Project Settings:"
echo "Build Command: npm run build"
echo "Output Directory: dist"
echo "Install Command: npm install"
echo ""
echo "Environment Variables needed:"
echo "VITE_API_URL=https://banglaverse-backend-api.vercel.app"
echo ""

# If vercel CLI is installed, deploy
if command -v vercel &> /dev/null; then
    echo "Deploying with Vercel CLI..."
    vercel --prod
else
    echo "Install Vercel CLI to deploy: npm i -g vercel"
    echo "Then run: vercel --prod"
fi

echo "✅ Deployment script completed!"
