#!/bin/bash

echo "🚀 trendCRM Supabase Kurulum Scripti"
echo "======================================"
echo ""

# .env.local dosyası kontrolü
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local dosyası zaten mevcut."
    read -p "Üzerine yazmak istiyor musunuz? (y/n): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "❌ İşlem iptal edildi."
        exit 0
    fi
fi

echo ""
echo "📝 Supabase bilgilerinizi girin:"
echo ""

read -p "Supabase Project URL (https://xxxxx.supabase.co): " SUPABASE_URL
read -p "Supabase Anon Key: " SUPABASE_ANON_KEY

echo ""
echo "📄 .env.local dosyası oluşturuluyor..."

cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# n8n Webhook URLs (Opsiyonel)
N8N_API_ANALYZE_URL=
N8N_API_TRENDS_URL=
N8N_API_INSTAGRAM_CONTENT_URL=
N8N_API_PLANNING_SCHEDULE_URL=
N8N_API_PLANNING_CONNECT_URL=
N8N_API_PLANNING_UPLOAD_URL=
N8N_API_ANALYTICS_URL=
N8N_API_COMMENTS_URL=
N8N_API_REPORTS_URL=
N8N_API_CALENDAR_URL=
N8N_API_ACCOUNTS_URL=
N8N_API_LIBRARY_URL=

# OpenAI Configuration (Opsiyonel)
OPENAI_API_KEY=

# Instagram API (Opsiyonel)
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=
EOF

echo "✅ .env.local dosyası oluşturuldu!"
echo ""
echo "📋 Sonraki adımlar:"
echo "1. Supabase Dashboard'da SQL Editor'e gidin"
echo "2. supabase-settings-table.sql dosyasını çalıştırın"
echo "3. npm run dev ile projeyi başlatın"
echo ""
echo "📚 Detaylı rehber için SUPABASE_SETUP.md dosyasına bakın."


