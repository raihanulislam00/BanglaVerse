#!/bin/bash

# BanglaVerse Backend Deployment Script
echo "🚀 Deploying BanglaVerse Backend to Vercel..."

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found. Please ensure it exists in the Backend directory."
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please ensure it exists in the Backend directory."
    exit 1
fi

echo "📋 Project configuration:"
echo "   - Name: banglaverse-backend-api"
echo "   - Framework: Node.js/Express"
echo "   - Main file: index.js"

# Deploy to Vercel
echo "🔄 Starting deployment..."
vercel --prod --name "banglaverse-backend-api" --yes

echo "✅ Backend deployment completed!"
echo "📝 Note: Don't forget to set environment variables in Vercel dashboard:"
echo "   - MONGODB_CONNECTION_STRING"
echo "   - GEMINI_API_KEY"
echo "   - NODE_ENV=production"
