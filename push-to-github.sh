#!/bin/bash

echo "=========================================="
echo "Script Push ke GitHub"
echo "=========================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    git branch -M main
fi

# Show current status
echo "📋 Current status:"
git status --short

echo ""
echo "✅ Staging all files..."
git add .

echo ""
echo "💾 Creating commit..."
git commit -m "Setup aplikasi apotek dengan Supabase - ready for GitHub Pages deployment"

echo ""
echo "=========================================="
echo "⚠️  LANGKAH SELANJUTNYA:"
echo "=========================================="
echo ""
echo "1. Buat repository baru di GitHub:"
echo "   https://github.com/new"
echo ""
echo "2. Setelah repository dibuat, jalankan:"
echo ""
echo "   git remote add origin https://github.com/USERNAME/REPO_NAME.git"
echo "   git push -u origin main"
echo ""
echo "   Ganti USERNAME dan REPO_NAME dengan milik Anda!"
echo ""
echo "3. Lalu setup GitHub Pages:"
echo "   - Buka: Settings > Pages"
echo "   - Source: GitHub Actions"
echo ""
echo "4. Setup Secrets:"
echo "   - Settings > Secrets and variables > Actions"
echo "   - New repository secret:"
echo ""
echo "   Name: VITE_SUPABASE_URL"
echo "   Value: https://0ec90b57d6e95fcbda19832f.supabase.co"
echo ""
echo "   Name: VITE_SUPABASE_ANON_KEY"
echo "   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw"
echo ""
echo "5. Baca QUICKSTART.md untuk panduan lengkap!"
echo ""
echo "=========================================="
