#!/bin/bash

# BanglaVerse Deployment Health Check Script
# This script verifies that your deployment is working correctly

set -e

echo "🔍 BanglaVerse Deployment Health Check"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default URLs (update these with your actual deployment URLs)
FRONTEND_URL="${1:-https://banglaverse.vercel.app}"
BACKEND_URL="${2:-https://banglaverse-backend-api.vercel.app}"

echo -e "${BLUE}Frontend URL: ${FRONTEND_URL}${NC}"
echo -e "${BLUE}Backend URL: ${BACKEND_URL}${NC}"
echo ""

# Function to check HTTP status
check_url() {
    local url=$1
    local name=$2
    local expected_status=${3:-200}
    
    echo -ne "${YELLOW}Checking ${name}... ${NC}"
    
    # Use curl with timeout and follow redirects
    status_code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 30 "$url" || echo "000")
    
    if [[ "$status_code" == "$expected_status" ]]; then
        echo -e "${GREEN}✅ OK (${status_code})${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED (${status_code})${NC}"
        return 1
    fi
}

# Function to check API endpoint
check_api() {
    local url=$1
    local endpoint=$2
    local name=$3
    
    echo -ne "${YELLOW}Checking ${name}... ${NC}"
    
    response=$(curl -s -L --max-time 30 "${url}${endpoint}" || echo "ERROR")
    
    if [[ "$response" == "ERROR" ]]; then
        echo -e "${RED}❌ CONNECTION FAILED${NC}"
        return 1
    elif echo "$response" | grep -q "error\|Error\|ERROR"; then
        echo -e "${RED}❌ API ERROR${NC}"
        echo -e "${YELLOW}Response: ${response}${NC}"
        return 1
    else
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    fi
}

# Function to check JSON response
check_json_api() {
    local url=$1
    local endpoint=$2
    local name=$3
    local expected_field=${4:-"status"}
    
    echo -ne "${YELLOW}Checking ${name}... ${NC}"
    
    response=$(curl -s -L --max-time 30 "${url}${endpoint}" || echo '{"error": "connection_failed"}')
    
    if echo "$response" | jq -e ".${expected_field}" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        if echo "$response" | jq -e '.status == "healthy"' > /dev/null 2>&1; then
            echo -e "${GREEN}   Status: Healthy${NC}"
        fi
        return 0
    else
        echo -e "${RED}❌ INVALID RESPONSE${NC}"
        echo -e "${YELLOW}Response: ${response}${NC}"
        return 1
    fi
}

# Start health checks
echo -e "${BLUE}🔍 Starting health checks...${NC}"
echo ""

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ curl is required but not installed. Please install curl and try again.${NC}"
    exit 1
fi

# Check if jq is available for JSON parsing
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq not found. Installing for better JSON parsing...${NC}"
    if command -v brew &> /dev/null; then
        brew install jq
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y jq
    else
        echo -e "${YELLOW}⚠️  Please install jq manually for better health checks${NC}"
    fi
fi

# Frontend checks
echo -e "${BLUE}🖥️  Frontend Health Checks${NC}"
echo "------------------------"

frontend_ok=true
check_url "$FRONTEND_URL" "Frontend homepage" 200 || frontend_ok=false
check_url "$FRONTEND_URL/home/chat" "Chat page" 200 || frontend_ok=false
check_url "$FRONTEND_URL/home/translate" "Translator page" 200 || frontend_ok=false

echo ""

# Backend checks
echo -e "${BLUE}🖥️  Backend Health Checks${NC}"
echo "-----------------------"

backend_ok=true
if command -v jq &> /dev/null; then
    check_json_api "$BACKEND_URL" "/" "Backend root endpoint" "message" || backend_ok=false
    check_json_api "$BACKEND_URL" "/health" "Health check endpoint" "status" || backend_ok=false
else
    check_api "$BACKEND_URL" "/" "Backend root endpoint" || backend_ok=false
    check_api "$BACKEND_URL" "/health" "Health check endpoint" || backend_ok=false
fi

check_url "$BACKEND_URL/api-docs" "API documentation" 200 || backend_ok=false

echo ""

# API endpoint checks
echo -e "${BLUE}🔌 API Endpoint Checks${NC}"
echo "--------------------"

api_ok=true
check_api "$BACKEND_URL" "/api/users" "Users API" || api_ok=false
check_api "$BACKEND_URL" "/api/documents" "Documents API" || api_ok=false

echo ""

# Overall status
echo -e "${BLUE}📊 Overall Status${NC}"
echo "================"

if $frontend_ok && $backend_ok && $api_ok; then
    echo -e "${GREEN}🎉 All checks passed! Your deployment is healthy.${NC}"
    exit_code=0
else
    echo -e "${RED}❌ Some checks failed. Please review the issues above.${NC}"
    
    if ! $frontend_ok; then
        echo -e "${YELLOW}   • Frontend issues detected${NC}"
    fi
    
    if ! $backend_ok; then
        echo -e "${YELLOW}   • Backend issues detected${NC}"
    fi
    
    if ! $api_ok; then
        echo -e "${YELLOW}   • API issues detected${NC}"
    fi
    
    exit_code=1
fi

echo ""
echo -e "${BLUE}💡 Troubleshooting Tips:${NC}"
echo "• Check environment variables in your hosting dashboard"
echo "• Verify domain configuration and DNS settings"
echo "• Review deployment logs for errors"
echo "• Ensure database connections are working"
echo "• Check CORS settings for cross-origin requests"

echo ""
echo -e "${YELLOW}📞 Need help? Check the DEPLOYMENT_GUIDE.md or VERCEL_CONFIG.md${NC}"

exit $exit_code
