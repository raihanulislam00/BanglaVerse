#!/bin/bash

# BanglaVerse Vercel Deployment Script
# This script handles both frontend and backend deployment to Vercel

set -e

echo "🚀 BanglaVerse Vercel Deployment Script"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Function to deploy frontend
deploy_frontend() {
    echo -e "${BLUE}📦 Deploying Frontend to Vercel...${NC}"
    cd Frontend
    
    # Install dependencies
    echo -e "${YELLOW}📥 Installing frontend dependencies...${NC}"
    npm install
    
    # Build the project
    echo -e "${YELLOW}🔨 Building frontend...${NC}"
    npm run build
    
    # Deploy to Vercel
    echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"
    vercel --prod --yes
    
    cd ..
    echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
}

# Function to deploy backend
deploy_backend() {
    echo -e "${BLUE}🖥️  Deploying Backend to Vercel...${NC}"
    cd Backend
    
    # Install dependencies
    echo -e "${YELLOW}📥 Installing backend dependencies...${NC}"
    npm install
    
    # Deploy to Vercel
    echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"
    vercel --prod --yes
    
    cd ..
    echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
}

# Main deployment logic
echo -e "${YELLOW}What would you like to deploy?${NC}"
echo "1) Frontend only"
echo "2) Backend only"
echo "3) Both Frontend and Backend"
echo "4) Exit"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        deploy_frontend
        ;;
    2)
        deploy_backend
        ;;
    3)
        deploy_frontend
        echo ""
        deploy_backend
        ;;
    4)
        echo -e "${YELLOW}👋 Deployment cancelled${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid choice. Please run the script again.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}💡 Don't forget to:${NC}"
echo "   • Set environment variables in Vercel dashboard"
echo "   • Update API endpoints if needed"
echo "   • Test your deployed application"
echo ""
echo -e "${YELLOW}📱 Access your Vercel dashboard: https://vercel.com/dashboard${NC}"
