#!/bin/bash

# BanglaVerse Quick Netlify Deployment
# This is the most reliable deployment method

echo "🌐 BanglaVerse Quick Netlify Deployment"
echo "======================================="

# Check if we're in the Frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the Frontend directory"
    exit 1
fi

echo "🧹 Cleaning and building..."
rm -rf dist node_modules/.cache

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "🚀 Ready for Netlify deployment!"
echo ""
echo "📋 Now follow these simple steps:"
echo ""
echo "1. 🌐 Open https://app.netlify.com/drop in your browser"
echo "2. 📁 Drag and drop your 'dist' folder from:"
echo "   $(pwd)/dist"
echo "3. ⏳ Wait for deployment (usually 30-60 seconds)"
echo "4. 🎉 Your app will be live with a random URL!"
echo "5. 🔗 You can change the URL in Site settings > Domain management"
echo ""
echo "💡 Your built files are ready in the 'dist' folder above."
echo "💡 Netlify will automatically handle SPA routing for you!"
echo ""

# Ask if user wants to open the folder
read -p "🔍 Do you want to open the dist folder now? (y/n): " open_folder

if [ "$open_folder" = "y" ] || [ "$open_folder" = "Y" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open dist/
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open dist/
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        # Windows
        explorer dist/
    fi
fi

echo ""
echo "🎯 Alternative: If you prefer CLI deployment:"
echo "   1. Install Netlify CLI: npm install -g netlify-cli"
echo "   2. Login: netlify login"
echo "   3. Deploy: netlify deploy --prod --dir=dist"
echo ""
echo "✨ Happy deploying!"
