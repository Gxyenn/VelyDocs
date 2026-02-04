#!/bin/bash

# VelyDocs v2.0 - Auto Deploy to GitHub Script
# Run this script to automatically push to your GitHub repository

echo "🚀 VelyDocs v2.0 - GitHub Deployment Script"
echo "==========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if git is initialized
echo -e "${BLUE}Step 1: Checking Git initialization...${NC}"
if [ ! -d .git ]; then
    echo -e "${YELLOW}Git not initialized. Initializing...${NC}"
    git init
    echo -e "${GREEN}✓ Git initialized${NC}"
else
    echo -e "${GREEN}✓ Git already initialized${NC}"
fi
echo ""

# Step 2: Configure git (if not already configured)
echo -e "${BLUE}Step 2: Configuring Git...${NC}"
if [ -z "$(git config user.name)" ]; then
    read -p "Enter your GitHub username: " username
    git config user.name "$username"
    echo -e "${GREEN}✓ Username set: $username${NC}"
else
    echo -e "${GREEN}✓ Username already set: $(git config user.name)${NC}"
fi

if [ -z "$(git config user.email)" ]; then
    read -p "Enter your GitHub email: " email
    git config user.email "$email"
    echo -e "${GREEN}✓ Email set: $email${NC}"
else
    echo -e "${GREEN}✓ Email already set: $(git config user.email)${NC}"
fi
echo ""

# Step 3: Add remote repository
echo -e "${BLUE}Step 3: Setting up remote repository...${NC}"
current_remote=$(git remote get-url origin 2>/dev/null)
if [ -z "$current_remote" ]; then
    read -p "Enter your GitHub repository URL (e.g., https://github.com/username/velydocs.git): " repo_url
    git remote add origin "$repo_url"
    echo -e "${GREEN}✓ Remote repository added: $repo_url${NC}"
else
    echo -e "${GREEN}✓ Remote already set: $current_remote${NC}"
    read -p "Do you want to change it? (y/n): " change_remote
    if [ "$change_remote" = "y" ]; then
        read -p "Enter new GitHub repository URL: " repo_url
        git remote set-url origin "$repo_url"
        echo -e "${GREEN}✓ Remote repository updated: $repo_url${NC}"
    fi
fi
echo ""

# Step 4: Add all files
echo -e "${BLUE}Step 4: Adding files to Git...${NC}"
git add .
echo -e "${GREEN}✓ All files added${NC}"
echo ""

# Step 5: Commit
echo -e "${BLUE}Step 5: Committing changes...${NC}"
git commit -m "🚀 VelyDocs v2.0 - Complete Upgrade

- Added Otakudesu source with 7 endpoints
- Enhanced Kuramanime, Winbu, Samehadaku scrapers
- Implemented API key system with 3-tier rate limiting
- Added config.json for API management
- Complete Vercel deployment configuration
- 24 total endpoints across 4 sources
- Full TypeScript coverage
- Production-ready code
- Complete documentation

Features:
✅ 4 Anime Sources (Winbu, Samehadaku, Kuramanime, Otakudesu)
✅ 24 Complete Endpoints
✅ Rate Limiting (60/300/unlimited req/min)
✅ API Authentication
✅ Vercel Ready
✅ Global CDN
✅ Error Handling
✅ Type Safety

Ready for production deployment!"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Changes committed successfully${NC}"
else
    echo -e "${RED}✗ Commit failed${NC}"
    exit 1
fi
echo ""

# Step 6: Set branch to main
echo -e "${BLUE}Step 6: Setting branch to main...${NC}"
git branch -M main
echo -e "${GREEN}✓ Branch set to main${NC}"
echo ""

# Step 7: Push to GitHub
echo -e "${BLUE}Step 7: Pushing to GitHub...${NC}"
echo -e "${YELLOW}This may ask for your GitHub credentials...${NC}"
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}✓ SUCCESS! Code pushed to GitHub!${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo -e "1. Go to https://vercel.com"
    echo -e "2. Click 'Import Project'"
    echo -e "3. Select your GitHub repository"
    echo -e "4. Click 'Deploy'"
    echo ""
    echo -e "${GREEN}Your API will be live in ~2 minutes!${NC}"
else
    echo ""
    echo -e "${RED}=========================================${NC}"
    echo -e "${RED}✗ Push failed${NC}"
    echo -e "${RED}=========================================${NC}"
    echo ""
    echo -e "${YELLOW}Common issues:${NC}"
    echo -e "1. Check your GitHub credentials"
    echo -e "2. Make sure the repository exists on GitHub"
    echo -e "3. Check if you have push access"
    echo ""
    echo -e "${YELLOW}Need to use Personal Access Token?${NC}"
    echo -e "Generate one at: https://github.com/settings/tokens"
    echo -e "Then use it as your password when prompted"
fi
