# 🔗 n8n ve AI Entegrasyon Kurulum Rehberi

Bu rehber, trendCRM'i n8n workflow'ları ve yapay zeka servisleri ile nasıl entegre edeceğinizi adım adım açıklar.

## 📋 İçindekiler

1. [Ortam Değişkenleri Kurulumu](#ortam-değişkenleri)
2. [n8n Kurulumu ve Yapılandırması](#n8n-kurulumu)
3. [OpenAI API Kurulumu](#openai-api-kurulumu)
4. [Webhook Entegrasyonu](#webhook-entegrasyonu)
5. [Test ve Doğrulama](#test-ve-dogrulama)

## ⚙️ Ortam Değişkenleri

`.env.local` dosyasını oluşturun ve aşağıdaki değişkenleri ekleyin:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# n8n Webhook URLs
N8N_API_ANALYZE_URL=https://your-n8n-instance.com/webhook/trendcrm-analyze
N8N_API_TRENDS_URL=https://your-n8n-instance.com/webhook/trendcrm-trends
N8N_API_INSTAGRAM_CONTENT_URL=https://your-n8n-instance.com/webhook/trendcrm-instagram-content
N8N_API_PLANNING_SCHEDULE_URL=https://your-n8n-instance.com/webhook/trendcrm-planning-schedule
N8N_API_PLANNING_CONNECT_URL=https://your-n8n-instance.com/webhook/trendcrm-planning-connect
N8N_API_PLANNING_UPLOAD_URL=https://your-n8n-instance.com/webhook/trendcrm-upload

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-...

# Instagram API (Opsiyonel)
INSTAGRAM_ACCESS_TOKEN=your-instagram-access-token
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret

# n8n Authentication (Opsiyonel)
N8N_API_KEY=your-n8n-api-key
N8N_BASE_URL=https://your-n8n-instance.com
```

## 🚀 n8n Kurulumu

### Seçenek 1: n8n Cloud

1. [n8n.cloud](https://n8n.cloud) üzerinden hesap oluşturun
2. Yeni workspace oluşturun
3. Workflow'ları içe aktarın (aşağıdaki bölüme bakın)

### Seçenek 2: Self-Hosted n8n

#### Docker ile Kurulum

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=your-password \
  n8nio/n8n
```

#### npm ile Kurulum

```bash
npm install n8n -g
n8n start
```

n8n'e erişin: `http://localhost:5678`

## 🔧 n8n Workflow Yapılandırması

### 1. Instagram Analiz Workflow

**Webhook Path**: `trendcrm-analyze`

**Beklenen Input**:
```json
{
  "action": "analyze_instagram",
  "username": "kullaniciadi",
  "sector": "E-ticaret",
  "goal": "Satış artırmak"
}
```

**Örnek Workflow Yapısı**:
1. Webhook node (POST)
2. Instagram API node (hesap bilgileri çek)
3. AI Analysis node (OpenAI ile analiz)
4. Response node (JSON döndür)

### 2. Trend İçerik Workflow

**Webhook Path**: `trendcrm-trends`

**Beklenen Input**:
```json
{
  "action": "get_trending_content",
  "category": "E-ticaret"
}
```

### 3. Instagram İçerik Workflow

**Webhook Path**: `trendcrm-instagram-content`

**Beklenen Input**:
```json
{
  "action": "get_instagram_content",
  "sector": "E-ticaret"
}
```

### 4. Planlama Workflow'ları

- **Connect**: `trendcrm-planning-connect`
- **Schedule**: `trendcrm-planning-schedule`
- **Upload**: `trendcrm-upload`

## 🤖 OpenAI API Kurulumu

1. [OpenAI Platform](https://platform.openai.com) üzerinden hesap oluşturun
2. API Keys bölümüne gidin
3. Yeni API key oluşturun
4. `.env.local` dosyasına ekleyin: `OPENAI_API_KEY=sk-proj-...`

### Kullanılan AI Modelleri

- **GPT-4o-mini**: Trend analizi ve içerik önerileri için (varsayılan)
- Model değiştirmek için `aiService.analyzeTrends()` fonksiyonunda `model` parametresini kullanın

## 🔗 Webhook URL'lerini Alma

1. n8n'de workflow'unuzu açın
2. Webhook node'una tıklayın
3. **Webhook URL**'ini kopyalayın
4. `.env.local` dosyasına yapıştırın

## 🧪 Test ve Doğrulama

### 1. n8n Webhook Testleri

Admin panelinden (`/admin/test-api`) webhook'ları test edebilirsiniz.

### 2. AI Servis Testi

```bash
# API'yi test et
curl -X POST http://localhost:3000/api/ai-trends \
  -H "Content-Type: application/json" \
  -d '{"sector": "E-ticaret", "question": "Video trendleri neler?"}'
```

### 3. Sağlık Kontrolü

Tüm webhook'ların durumunu kontrol etmek için:

```typescript
import { n8nClient } from "@/lib/n8nClient";

const healthStatus = await n8nClient.checkAllWebhooks();
console.log(healthStatus);
```

## 🔒 Güvenlik

### Webhook Güvenliği

1. **n8n Basic Auth**: Production'da mutlaka aktif edin
2. **HTTPS**: Tüm webhook URL'leri HTTPS kullanmalı
3. **API Keys**: Hassas bilgileri environment variable'larda saklayın

### Best Practices

- Environment variable'ları `.gitignore`'a ekleyin
- Production'da farklı n8n instance'ları kullanın
- Rate limiting ekleyin
- Webhook loglarını izleyin

## 📊 Monitoring

### n8n Logları

n8n execution loglarını izleyerek workflow'ların çalışıp çalışmadığını kontrol edin.

### Error Handling

- Tüm webhook çağrıları retry mekanizması ile gelir
- Hata durumunda fallback veriler kullanılır
- Console'da detaylı error logları görüntülenir

## 🚀 Production Deployment

### Environment Variables

Production'da tüm environment variable'ları platform ayarlarınızdan ekleyin:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Docker**: `.env` dosyası veya docker-compose.yml

### n8n Production

```yaml
# docker-compose.yml örneği
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - WEBHOOK_URL=https://your-domain.com/webhook/
    volumes:
      - n8n_data:/home/node/.n8n
```

## 🐛 Sorun Giderme

### Webhook Çalışmıyor

1. n8n instance'ının çalıştığını kontrol edin
2. URL'lerin doğru olduğunu kontrol edin
3. Firewall ayarlarını kontrol edin
4. n8n loglarını inceleyin

### AI API Hatası

1. OpenAI API anahtarının geçerli olduğunu kontrol edin
2. API quota'sını kontrol edin
3. Model adının doğru olduğunu kontrol edin

### Connection Timeout

- n8n timeout süresini artırın (varsayılan: 30 saniye)
- Workflow'larınızın optimize edildiğinden emin olun

## 📞 Destek

- [n8n Dokümantasyonu](https://docs.n8n.io)
- [OpenAI API Dokümantasyonu](https://platform.openai.com/docs)
- GitHub Issues: Proje repository'sinde sorun bildirin

---

**trendCRM + n8n + AI** ile güçlü otomasyonlar oluşturun! 🚀




