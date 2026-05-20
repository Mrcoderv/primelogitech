#!/bin/bash

# Script to set up the Django admin panel
# Run this after migrations are applied

cd "$(dirname "$0")" || exit

# Check if .venv exists
if [ ! -d ".venv" ]; then
    echo "❌ Virtual environment not found. Creating one..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Install dependencies (just in case)
pip install -q -r requirements.txt

# Apply migrations
echo "📦 Applying migrations..."
python manage.py migrate

# Create superuser
echo ""
echo "🔐 Creating Django Admin Superuser"
echo "================================================"
echo "Follow the prompts to create your admin account."
echo "You'll use these credentials to log in to the admin panel at:"
echo "http://localhost:8000/admin/"
echo ""
python manage.py createsuperuser

echo ""
echo "✅ Setup Complete!"
echo "================================================"
echo "To start the development server, run:"
echo "  python manage.py runserver"
echo ""
echo "Then visit: http://localhost:8000/admin/"
