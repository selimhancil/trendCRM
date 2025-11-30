# 🔗 n8n Entegrasyon Rehberi

Bu rehber, trendCRM'i n8n workflow'larınızla nasıl entegre edeceğinizi adım adım açıklar.

## 📋 Gereksinimler

- n8n instance'ı (self-hosted veya cloud)
- Instagram API erişimi (opsiyonel)
- OpenAI API anahtarı (opsiyonel)

## 🚀 Adım 1: n8n Kurulumu

### Self-Hosted n8n
```bash
# Docker ile kurulum
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n

# npm ile kurulum
npm install n8n -g
n8n start
```

### n8n Cloud
- [n8n.cloud](https://n8n.cloud) hesabı oluşturun
- Yeni workspace oluşturun

## 🔧 Adım 2: Workflow'ları İçe Aktarın

1. n8n arayüzüne gidin (`http://localhost:5678` veya cloud URL)
2. **Import from File** seçeneğini kullanın
3. Aşağıdaki dosyaları sırayla içe aktarın:
   - `n8n-workflows/instagram-analysis.json`
   - `n8n-workflows/trend-content.json`

## ⚙️ Adım 3: Environment Değişkenlerini Ayarlayın

`.env.local` dosyasını düzenleyin:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# n8n Webhook URLs (n8n'den kopyalayın)
N8N_API_ANALYZE_URL=https://your-n8n-instance.com/webhook/trendcrm-analyze
N8N_API_TRENDS_URL=https://your-n8n-instance.com/webhook/trendcrm-trends
N8N_API_PLANNING_UPLOAD_URL=https://your-n8n-instance.com/webhook/trendcrm-upload

# Opsiyonel API Anahtarları
INSTAGRAM_ACCESS_TOKEN=your-instagram-token
OPENAI_API_KEY=your-openai-key
```

## 🔗 Adım 4: Webhook URL'lerini Alın

1. n8n'de workflow'ları açın
2. Webhook node'larına tıklayın
3. **Webhook URL**'lerini kopyalayın
4. `.env.local` dosyasına yapıştırın

## 🧪 Adım 5: Test Edin

1. trendCRM'i başlatın: `npm run dev`
2. Admin paneline gidin: `http://localhost:3000/admin`
3. **🔗 n8n API Testi** linkine tıklayın
4. Test butonlarını kullanarak entegrasyonu kontrol edin

## 📊 Instagram Analiz Workflow Detayları

### Giriş Verisi
```json
{
  "username": "kullaniciadi"
}
```

### Çıkış Verisi
```json
{
  "username": "kullaniciadi",
  "followers": 10000,
  "engagement": "5.2%",
  "recommendation": "AI önerisi...",
  "profile_pic": "https://...",
  "bio": "Bio metni",
  "posts_count": 150,
  "following": 500,
  "verified": true
}
```

## 🔥 Trend İçerik Workflow Detayları

### Giriş Verisi
```json
{
  "category": "Eğlence" // opsiyonel
}
```

### Çıkış Verisi
```json
[
  {
    "id": "1",
    "title": "Trend Başlığı",
    "description": "Açıklama",
    "category": "Eğlence",
    "views": 1000000,
    "likes": 50000,
    "shares": 10000,
    "thumbnail_url": "https://...",
    "video_url": "https://...",
    "creator": "kullaniciadi",
    "created_at": "2024-01-15T10:30:00Z",
    "tags": ["tag1", "tag2"]
  }
]
```

## 🔧 Gelişmiş Konfigürasyon

### Instagram API Entegrasyonu
1. Facebook Developer Console'da uygulama oluşturun
2. Instagram Basic Display API'yi etkinleştirin
3. Access token alın
4. n8n workflow'unda token'ı güncelleyin

### OpenAI Entegrasyonu
1. OpenAI hesabı oluşturun
2. API anahtarı alın
3. n8n'de OpenAI node'unu yapılandırın
4. Daha gelişmiş analizler için prompt'ları özelleştirin

### Gerçek Veri Kaynakları
- **TikTok API**: Trend videoları için
- **YouTube API**: Video istatistikleri için
- **Twitter API**: Sosyal medya analizi için
- **Instagram Graph API**: Detaylı hesap analizi için

## 🐛 Sorun Giderme

### Webhook Çalışmıyor
- n8n instance'ının çalıştığını kontrol edin
- URL'lerin doğru olduğunu kontrol edin
- Firewall ayarlarını kontrol edin

### API Yanıt Vermiyor
- Environment değişkenlerini kontrol edin
- n8n workflow'larının aktif olduğunu kontrol edin
- Console loglarını kontrol edin

### Veri Formatı Uyumsuz
- n8n workflow'larındaki çıkış formatını kontrol edin
- trendCRM'deki beklenen format ile karşılaştırın

## 📈 Performans Optimizasyonu

### Caching
- n8n'de cache node'ları kullanın
- Redis entegrasyonu ekleyin

### Rate Limiting
- API çağrılarında rate limiting uygulayın
- Queue sistemi kullanın

### Monitoring
- n8n execution loglarını izleyin
- Error handling ekleyin
- Alert sistemi kurun

## 📤 Dosya Yükleme (File Upload)

trendCRM, içerik planlama sayfasında görsel ve video yükleme özelliği sunar.

### Supabase Storage Kurulumu

1. Supabase Dashboard'a gidin
2. **Storage** sekmesine gidin
3. Yeni bucket oluşturun:
   - Bucket adı: `instagram-media`
   - Public bucket: ✅ **Evet** (işaretleyin)
   - File size limit: 100MB
   - Allowed MIME types: `image/*, video/*`

4. Bucket policy'yi ayarlayın (Public okuma/yazma izni)

### n8n Upload Webhook (Opsiyonel)

Eğer Supabase Storage kullanmak istemiyorsanız, n8n workflow'u ile dosyaları yönetebilirsiniz:

1. n8n'de yeni webhook workflow oluşturun
2. Webhook node'unu yapılandırın:
   - Method: POST
   - Path: `/trendcrm-upload`
3. HTTP Request node ekleyin (dosyayı depolama servisine yüklemek için)
4. Webhook URL'ini `.env.local` dosyasına ekleyin:
   ```bash
   N8N_API_PLANNING_UPLOAD_URL=https://your-n8n-instance.com/webhook/trendcrm-upload
   ```

### Desteklenen Dosya Formatları

- **Görseller**: JPG, PNG, GIF, WEBP
- **Videolar**: MP4, MOV
- **Maksimum boyut**: 100MB

### Kullanım

1. İçerik Planlama sayfasına gidin
2. "Yeni Planlama" butonuna tıklayın
3. "Görsel / Video Yükle" bölümünde:
   - Dosyayı sürükleyip bırakın veya
   - "Dosya seçin" butonuna tıklayın
4. Yüklenen dosya otomatik olarak preview gösterilir
5. Alternatif olarak URL ile de medya ekleyebilirsiniz

## 🚀 Production Deployment

### n8n Production
```bash
# Docker Compose ile
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=password
    volumes:
      - n8n_data:/home/node/.n8n
```

### Environment Variables
```bash
# Production .env.local
N8N_API_ANALYZE_URL=https://your-production-n8n.com/webhook/trendcrm-analyze
N8N_API_TRENDS_URL=https://your-production-n8n.com/webhook/trendcrm-trends
```

## 📞 Destek

Herhangi bir sorun yaşarsanız:
- GitHub Issues açın
- n8n dokümantasyonunu kontrol edin
- Community forumlarını kullanın

---

**trendCRM + n8n** ile güçlü otomasyonlar oluşturun! 🚀

