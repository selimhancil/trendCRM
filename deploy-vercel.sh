#!/bin/bash

echo "🚀 trendCRM Vercel Deployment Script"
echo "======================================"
echo ""

# Vercel CLI kontrolü
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI bulunamadı!"
    echo "📦 Kurulum için: npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI mevcut"
echo ""

# Login kontrolü
echo "🔐 Vercel login kontrolü..."
if ! vercel whoami &> /dev/null; then
    echo "⚠️  Vercel'e login olmanız gerekiyor"
    vercel login
fi

echo ""
echo "📋 Environment Variables Kontrolü:"
echo ""

# .env.local kontrolü
if [ -f ".env.local" ]; then
    echo "✅ .env.local dosyası mevcut"
    
    # Supabase URL kontrolü
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d '=' -f2 | tr -d ' ')
        echo "✅ Supabase URL: $SUPABASE_URL"
    else
        echo "⚠️  Supabase URL bulunamadı!"
    fi
    
    # Supabase Key kontrolü
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo "✅ Supabase Anon Key mevcut"
    else
        echo "⚠️  Supabase Anon Key bulunamadı!"
    fi
else
    echo "⚠️  .env.local dosyası bulunamadı!"
    echo "📝 Önce .env.local dosyasını oluşturmanız gerekiyor"
    exit 1
fi

echo ""
echo "🌐 Deployment başlatılıyor..."
echo ""

# Production deployment
read -p "Production'a deploy etmek istiyor musunuz? (y/n): " deploy_prod

if [ "$deploy_prod" = "y" ]; then
    echo "🚀 Production deployment başlatılıyor..."
    vercel --prod
else
    echo "🚀 Preview deployment başlatılıyor..."
    vercel
fi

echo ""
echo "✅ Deployment tamamlandı!"
echo ""
echo "📋 Sonraki adımlar:"
echo "1. Vercel Dashboard'da environment variables'ları kontrol edin"
echo "2. Supabase Dashboard'da Site URL'i güncelleyin"
echo "3. Supabase Redirect URLs'e production URL'inizi ekleyin"
echo ""
echo "📚 Detaylı rehber için VERCEL_DEPLOY.md dosyasına bakın"

