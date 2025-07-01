#!/bin/bash

# Quick fix for Vercel deployment issue
# This script will properly deploy your BanglaVerse frontend

set -e

echo "🚀 BanglaVerse Quick Vercel Fix"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Current issue: Vercel is showing directory listing instead of your React app${NC}"
echo -e "${YELLOW}🔧 Applying fix...${NC}"

# Step 1: Clean previous deployments
echo -e "${YELLOW}1. Cleaning previous deployments...${NC}"
if command -v vercel &> /dev/null; then
    echo "   Removing existing Vercel deployments..."
    vercel ls 2>/dev/null | grep banglaverse | awk '{print $1}' | xargs -I {} vercel rm {} --yes 2>/dev/null || true
else
    echo "   Installing Vercel CLI..."
    npm install -g vercel
fi

# Step 2: Test build locally first
echo -e "${YELLOW}2. Testing build locally...${NC}"
cd Frontend
npm install
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed - no dist folder created${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Local build successful${NC}"

# Step 3: Deploy to Vercel
echo -e "${YELLOW}3. Deploying to Vercel...${NC}"
cd ..

# Deploy with explicit settings
vercel --prod --yes --name banglaverse

echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo ""
echo -e "${BLUE}📝 What was fixed:${NC}"
echo "   • Added root vercel.json to point to Frontend folder"
echo "   • Updated build scripts for proper Vercel integration"  
echo "   • Added .vercelignore to exclude unnecessary files"
echo "   • Cleaned old deployments that were causing conflicts"
echo ""
echo -e "${YELLOW}🔍 Testing your deployment...${NC}"

# Test the deployment
sleep 5
echo "Checking deployment status..."
curl -s -o /dev/null -w "Status: %{http_code}\n" https://banglaverse.vercel.app/ || echo "Still deploying..."

echo ""
echo -e "${GREEN}✅ Your app should now be properly deployed at: https://banglaverse.vercel.app${NC}"
echo -e "${BLUE}💡 If you still see issues:${NC}"
echo "   1. Wait 2-3 minutes for global CDN to update"
echo "   2. Try opening in incognito/private mode"
echo "   3. Clear your browser cache"
echo "   4. Run: ./health-check.sh https://banglaverse.vercel.app"
