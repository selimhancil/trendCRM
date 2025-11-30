# 📅 Instagram İçerik Planlama Entegrasyon Rehberi

Bu rehber, trendCRM içerik planlama özelliğini Instagram ve n8n ile nasıl entegre edeceğinizi açıklar.

## 🎯 Özellikler

- **Instagram Hesap Bağlama**: Meta Business Suite benzeri hesap bağlama
- **İçerik Planlama**: Post, Reel ve Story planlama
- **Otomatik Yayınlama**: n8n ile zamanlanmış içerik yayınlama
- **Takvim Yönetimi**: Planlanmış içerikleri görüntüleme ve yönetme

## 📋 Gereksinimler

- Instagram Business veya Creator hesabı
- Instagram Graph API erişimi
- n8n instance'ı
- Meta Developer hesabı (Instagram API için)

## 🔧 Adım 1: Instagram API Kurulumu

### Meta Developer Console

1. [Meta Developers](https://developers.facebook.com/) hesabı oluşturun
2. Yeni uygulama oluşturun
3. **Instagram Graph API** ürününü ekleyin
4. OAuth Redirect URI ekleyin: `https://your-domain.com/api/planning/callback`

### Environment Variables

`.env.local` dosyasına ekleyin:

```bash
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔗 Adım 2: n8n Workflow Kurulumu

### Workflow İçe Aktarma

1. n8n'de yeni workflow oluşturun
2. `n8n-workflows/instagram-planning.json` dosyasını import edin
3. Webhook URL'lerini kopyalayın

### Environment Variables

```bash
N8N_API_PLANNING_CONNECT_URL=https://your-n8n-instance.com/webhook/trendcrm-planning-connect
N8N_API_PLANNING_SCHEDULE_URL=https://your-n8n-instance.com/webhook/trendcrm-planning-schedule
```

## 📱 Adım 3: Instagram Hesabı Bağlama

### Kullanıcı Akışı

1. `/planning` sayfasına gidin
2. "Hesap Bağla" butonuna tıklayın
3. Instagram OAuth sayfasına yönlendirilirsiniz
4. İzinleri onaylayın
5. Callback ile hesap bağlanır

### API Akışı

```
trendCRM → Instagram OAuth → Callback → n8n Webhook → Veritabanı
```

## 📅 Adım 4: İçerik Planlama

### Planlama Formu

- **Hesap Seçimi**: Bağlı hesaplardan seçim
- **İçerik Türü**: Post, Reel, Story
- **İçerik Metni**: Ana metin
- **Tarih/Saat**: Planlanan yayın zamanı
- **Hashtag'ler**: Virgülle ayrılmış
- **Medya URL**: Opsiyonel görsel/video URL

### Planlama Akışı

```
Kullanıcı Formu Doldur → API → n8n Webhook → Zamanlayıcı → Instagram API → Yayınlanır
```

## 🔄 n8n Workflow Detayları

### Connect Webhook

**Endpoint**: `POST /webhook/trendcrm-planning-connect`

**Input**:
```json
{
  "action": "connect_instagram",
  "access_token": "instagram-access-token",
  "user_id": "instagram-user-id",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**İşlem**:
- Instagram token'ı kaydet
- Kullanıcı bilgilerini al
- Veritabanına kaydet

### Schedule Webhook

**Endpoint**: `POST /webhook/trendcrm-planning-schedule`

**Input**:
```json
{
  "action": "schedule_post",
  "post": {
    "id": "post_123",
    "account": "username",
    "content": "Post içeriği",
    "scheduled_time": "2024-01-16T10:00:00Z",
    "hashtags": ["trend", "instagram"],
    "post_type": "post",
    "media_url": "https://..."
  }
}
```

**İşlem**:
- Zamanlayıcıya ekle
- Belirtilen zamanda Instagram API'ye gönder
- Yayın durumunu güncelle

## 🎨 Kullanım Senaryoları

### Senaryo 1: Haftalık İçerik Planlama

1. Pazartesi: Haftalık planı hazırlayın
2. İçerikleri oluşturun ve planlayın
3. n8n otomatik olarak yayınlar

### Senaryo 2: Anlık İçerik

1. Trend bir içerik buldunuz
2. Hemen planlayın (yakın bir tarih seçin)
3. Sistem otomatik yayınlar

### Senaryo 3: Toplu Planlama

1. Birden fazla hesap bağlayın
2. Her hesap için ayrı planlamalar yapın
3. Merkezi yönetim

## 🔐 Güvenlik

### Token Yönetimi

- Access token'lar güvenli saklanmalı
- Refresh token mekanizması kurulmalı
- Token expiry kontrolü yapılmalı

### OAuth Best Practices

- HTTPS zorunlu
- Secure redirect URI
- State parameter kullanımı
- CSRF koruması

## 🐛 Sorun Giderme

### Hesap Bağlanmıyor

- Instagram API izinlerini kontrol edin
- Redirect URI'nin doğru olduğundan emin olun
- Client ID ve Secret'ı kontrol edin

### İçerik Yayınlanmıyor

- n8n workflow'unun aktif olduğunu kontrol edin
- Instagram API token'ının geçerli olduğunu kontrol edin
- Zamanlayıcının doğru çalıştığını kontrol edin

### Webhook Çalışmıyor

- n8n instance'ının çalıştığını kontrol edin
- URL'lerin doğru olduğunu kontrol edin
- Firewall ayarlarını kontrol edin

## 📊 API Endpoints

### GET /api/planning/accounts
Bağlı Instagram hesaplarını listeler.

### POST /api/planning/connect
Instagram OAuth bağlantısını başlatır.

### GET /api/planning/callback
Instagram OAuth callback endpoint'i.

### GET /api/planning/scheduled
Planlanmış içerikleri listeler.

### POST /api/planning/schedule
Yeni içerik planlar ve n8n'e gönderir.

## 🚀 Production Deployment

### Environment Variables

```bash
INSTAGRAM_CLIENT_ID=production-client-id
INSTAGRAM_CLIENT_SECRET=production-client-secret
N8N_API_PLANNING_CONNECT_URL=https://production-n8n.com/webhook/trendcrm-planning-connect
N8N_API_PLANNING_SCHEDULE_URL=https://production-n8n.com/webhook/trendcrm-planning-schedule
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

### Veritabanı Entegrasyonu

- Bağlı hesapları Supabase'de saklayın
- Planlanmış içerikleri veritabanında tutun
- Token'ları şifrelenmiş olarak saklayın

## 📈 İleri Seviye Özellikler

### Özelleştirmeler

- Özel zamanlama kuralları
- İçerik şablonları
- Toplu içerik planlama
- Analitik entegrasyonu
- Performans takibi

## 📞 Destek

Herhangi bir sorun yaşarsanız:
- GitHub Issues açın
- n8n dokümantasyonunu kontrol edin
- Instagram Graph API dokümantasyonunu inceleyin

---

**trendCRM + Instagram + n8n** ile güçlü içerik planlama sistemi! 🚀




