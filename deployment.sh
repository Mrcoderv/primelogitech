#!/bin/bash

# Deployment Helper Script for Prime Logic Tech
# This script generates SECRET_KEY and provides deployment configuration

set -e

echo "================================"
echo "🚀 Prime Logic Tech Deployment"
echo "================================"
echo ""

# Function to generate SECRET_KEY
generate_secret_key() {
    echo "📝 Generating Django SECRET_KEY..."
    SECRET=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())' 2>/dev/null || echo "")
    
    if [ -z "$SECRET" ]; then
        echo "⚠️  Django not found in current environment"
        echo "Install Django first: pip install django"
        return 1
    fi
    
    echo "✅ Generated SECRET_KEY:"
    echo "   $SECRET"
    echo ""
    echo "Copy this to your Render environment variables"
    echo ""
}

# Function to show deployment checklist
show_checklist() {
    echo "📋 Pre-Deployment Checklist"
    echo "================================"
    echo ""
    echo "Backend (Render):"
    echo "  [ ] Generate SECRET_KEY (run this script or use Django shell)"
    echo "  [ ] Get Render backend URL after deployment"
    echo "  [ ] Set DEBUG=False"
    echo "  [ ] Set CORS_ALLOWED_ORIGINS to Vercel URL"
    echo ""
    echo "Frontend (Vercel):"
    echo "  [ ] Get Vercel frontend URL after deployment"
    echo "  [ ] Set VITE_API_URL to Render backend URL"
    echo ""
    echo "Connect:"
    echo "  [ ] Update Render CORS_ALLOWED_ORIGINS with Vercel URL"
    echo "  [ ] Verify API calls work from frontend"
    echo ""
}

# Function to show environment variables template
show_env_template() {
    echo "🔐 Render Environment Variables Template"
    echo "================================"
    echo ""
    echo "DEBUG=False"
    echo "SECRET_KEY=<PASTE_GENERATED_KEY_HERE>"
    echo "ALLOWED_HOSTS=<backend-name>.onrender.com,localhost"
    echo "CORS_ALLOW_ALL_ORIGINS=False"
    echo "CORS_ALLOWED_ORIGINS=https://<frontend>.vercel.app,http://localhost:3000"
    echo "PORT=8000"
    echo ""
    echo "Vercel Environment Variables Template"
    echo "================================"
    echo ""
    echo "VITE_API_URL=https://<backend-name>.onrender.com"
    echo ""
}

# Main menu
echo "What would you like to do?"
echo ""
echo "1) Generate Django SECRET_KEY"
echo "2) Show pre-deployment checklist"
echo "3) Show environment variables template"
echo "4) Show all"
echo ""
read -p "Choose option (1-4): " choice

case $choice in
    1)
        generate_secret_key
        ;;
    2)
        show_checklist
        ;;
    3)
        show_env_template
        ;;
    4)
        generate_secret_key
        echo ""
        show_checklist
        echo ""
        show_env_template
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo "================================"
echo "📖 For detailed guide, see DEPLOYMENT.md"
echo "================================"
