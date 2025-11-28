# trendCRM

Modern Instagram hesap analizi ve haftalık trend içerik takibi için CRM web paneli.

## 🚀 Özellikler

- **Instagram Hesap Analizi**: AI destekli hesap analizi ve kişiselleştirilmiş öneriler
- **Trend İçerik Takibi**: Haftalık trend videoları ve kategorilere göre filtreleme
- **Güvenli Kimlik Doğrulama**: Supabase ile güvenli giriş/kayıt sistemi
- **Modern UI/UX**: TailwindCSS ile responsive ve modern tasarım
- **n8n Entegrasyonu**: Gerçek zamanlı veri akışı için n8n workflow entegrasyonu

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Authentication**: Supabase Auth
- **Database**: Supabase (opsiyonel)
- **External API**: n8n workflows

## 📁 Proje Yapısı

```
trendcrm/
├── app/
│   ├── layout.tsx          # Ana layout
│   ├── page.tsx            # Ana sayfa
│   ├── analyze/            # Instagram analiz sayfası
│   ├── trends/             # Trend içerikler sayfası
│   ├── auth/               # Kimlik doğrulama sayfaları
│   └── api/                # API routes
├── components/             # React bileşenleri
├── lib/                    # Utility fonksiyonları
└── styles/                 # Global stiller
```

## 🚀 Kurulum

1. **Projeyi klonlayın**
   ```bash
   git clone <repository-url>
   cd trendcrm
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Environment değişkenlerini ayarlayın**
   `.env.local` dosyasını oluşturun:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   N8N_API_ANALYZE_URL=your-n8n-analyze-webhook-url
   N8N_API_TRENDS_URL=your-n8n-trends-webhook-url
   ```

4. **Supabase projesi oluşturun**
   - [Supabase](https://supabase.com) hesabı oluşturun
   - Yeni proje oluşturun
   - Authentication ayarlarını yapılandırın
   - URL ve anon key'i `.env.local` dosyasına ekleyin

5. **n8n workflow'larını ayarlayın**
   - Instagram analiz workflow'u oluşturun
   - Trend içerik workflow'u oluşturun
   - Webhook URL'lerini `.env.local` dosyasına ekleyin

6. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

7. **Tarayıcıda açın**
   [http://localhost:3000](http://localhost:3000)

## 📱 Kullanım

### Instagram Analizi
1. `/analyze` sayfasına gidin
2. Instagram kullanıcı adını girin
3. "Analiz Et" butonuna tıklayın
4. AI destekli analiz sonuçlarını görüntüleyin

### Trend İçerikler
1. `/trends` sayfasına gidin
2. Kategorilere göre filtreleme yapın
3. Popüler trend içerikleri keşfedin
4. İstatistikleri görüntüleyin

### Kimlik Doğrulama
1. `/auth/signup` ile yeni hesap oluşturun
2. `/auth/login` ile giriş yapın
3. Google ile giriş seçeneğini kullanın

## 🔧 API Endpoints

### POST /api/analyze
Instagram hesap analizi için n8n webhook'u çağırır.

**Request Body:**
```json
{
  "username": "kullaniciadi"
}
```

**Response:**
```json
{
  "username": "kullaniciadi",
  "followers": 10000,
  "engagement": "5.2%",
  "recommendation": "AI önerisi...",
  "profile_pic": "url",
  "bio": "Bio metni",
  "posts_count": 150,
  "following": 500,
  "verified": true
}
```

### POST /api/trends
Trend içerikleri için n8n webhook'u çağırır.

**Request Body:**
```json
{
  "category": "Eğlence" // opsiyonel
}
```

**Response:**
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
    "thumbnail_url": "url",
    "video_url": "url",
    "creator": "kullaniciadi",
    "created_at": "2024-01-15T10:30:00Z",
    "tags": ["tag1", "tag2"]
  }
]
```

## 🎨 Özelleştirme

### Tema Renkleri
`tailwind.config.js` dosyasında renk paletini özelleştirebilirsiniz.

### Bileşenler
`components/` dizinindeki bileşenleri ihtiyaçlarınıza göre düzenleyebilirsiniz.

### API Entegrasyonu
`lib/apiClient.ts` dosyasında n8n webhook URL'lerini güncelleyebilirsiniz.

## 🚀 Deployment

### Vercel (Önerilen)
1. Projeyi GitHub'a push edin
2. [Vercel](https://vercel.com) hesabı oluşturun
3. GitHub repository'sini bağlayın
4. Environment değişkenlerini ayarlayın
5. Deploy edin

### Diğer Platformlar
- Netlify
- Railway
- DigitalOcean App Platform

## 📝 Lisans

MIT License

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

Herhangi bir sorun yaşarsanız:
- GitHub Issues açın
- E-posta gönderin: support@trendcrm.com

---

**trendCRM** ile Instagram analizi ve trend takibini kolaylaştırın! 🚀# trendCRM
