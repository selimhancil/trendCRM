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
   https://trend-crm.vercel.app/

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

## 📸 Uygulama İçi Görseller
<img width="1680" height="986" alt="Ekran Resmi 2025-11-30 19 49 20" src="https://github.com/user-attachments/assets/bc446367-5d5c-44a4-827b-3de72a1847de" />
<img width="1680" height="986" alt="Ekran Resmi 2025-11-30 19 49 13" src="https://github.com/user-attachments/assets/a38334fd-f85c-4f9b-9380-0d8a4d1d889f" />
<img width="1680" height="986" alt="Ekran Resmi 2025-11-30 19 49 05" src="https://github.com/user-attachments/assets/e268585b-ee91-4fec-bcc7-63d970be81a6" />
<img width="1680" height="986" alt="Ekran Resmi 2025-11-30 19 49 57" src="https://github.com/user-attachments/assets/efad7490-2d2a-4e52-9558-7eef1424dcf9" />
<img width="1680" height="986" alt="Ekran Resmi 2025-11-30 19 49 45" src="https://github.com/user-attachments/assets/04fbb83f-a81f-438b-941b-edad5ef08afd" />
<img width="1680" height="986" alt="Ekran Resmi 2025-11-30 19 49 36" src="https://github.com/user-attachments/assets/7d8881ba-720e-4342-8ddf-2d62c08670a8" />
<img width="1680" height="986" alt="Ekran Resmi 2025-11-30 19 49 26" src="https://github.com/user-attachments/assets/2100fcb9-3b04-4cce-9fbb-fea13081a0d6" />



### Ana Sayfa (Dashboard)
Ana sayfa, kullanıcıları Instagram Analizi ve Trend İçerikler özelliklerine yönlendiren modern bir arayüz sunar. AI destekli analizler ve gerçek zamanlı trend verileri ile sosyal medya stratejinizi güçlendirin.

**Özellikler:**
- Instagram Analizi kartı ile hesap analizi başlatma
- Trend İçerikler kartı ile sektörel trend keşfi
- Modern ve kullanıcı dostu tasarım

### Instagram Analizi Sayfası
AI destekli Instagram hesap analizi sayfası. Kullanıcı adı, sektör ve hedef bilgilerini girerek kişiselleştirilmiş strateji önerileri alabilirsiniz.

**Özellikler:**
- Instagram kullanıcı adı girişi
- Sektör seçimi (E-ticaret, Teknoloji, Moda, Yemek, vb.)
- Instagram'da amaçlanan hedef belirleme
- AI destekli analiz ve öneriler

### Trend İçerikler Sayfası
Sektörünüze özel AI destekli trend analizi ve içerik önerileri. Instagram'daki en popüler içerikleri gerçek zamanlı keşfedin.

**Özellikler:**
- Sektör bazlı trend analizi
- Özel soru sorma imkanı
- Örnek sorular ile hızlı başlangıç
- AI ile trend analizi yapma

### Performans Dashboard
Hesabınızın detaylı performans analizi. Takipçi büyümesi, etkileşim oranı, toplam beğeni ve gönderi sayısı gibi temel metrikleri görüntüleyin.

**Özellikler:**
- Takipçi sayısı ve büyüme oranı
- Etkileşim oranı analizi
- Toplam beğeni istatistikleri
- Gönderi sayısı takibi
- Takipçi büyümesi grafiği
- Etkileşim trendi grafiği
- En iyi performans gösteren gönderiler

### Kampanya Yönetimi
Organik ve reklam kampanyalarınızı yönetin. Toplam bütçe, harcanan tutar, erişim ve etkileşim metriklerini takip edin.

**Özellikler:**
- Toplam bütçe ve harcama takibi
- Toplam erişim ve ortalama etkileşim oranı
- Organik ve reklam kampanyaları filtreleme
- Kampanya detayları (erişim, görüntülenme, CTR, CPC)
- Dönüşüm ve ROI metrikleri
- AI kampanya önerisi
- Yeni kampanya oluşturma

### Raporlar Sayfası
Haftalık, aylık veya özel tarih aralığında rapor oluşturun ve dışa aktarın.

**Özellikler:**
- Haftalık rapor (Son 7 gün)
- Aylık rapor (Son 30 gün)
- Özel tarih aralığı seçimi
- PDF formatında dışa aktarma (Yazdırma için ideal)
- Excel formatında dışa aktarma (Analiz için ideal)
- Rapor şablonlarını görüntüleme

### White-Label Ayarları
Platformunuzu markanıza özel hale getirin. Şirket adı, logo, favicon, renkler ve özel domain ayarlarını yapın.

**Özellikler:**
- Şirket adı özelleştirme
- Logo yükleme
- Favicon yükleme
- Birincil ve ikincil renk seçimi
- Özel domain ayarlama (Müşteriler için alt domain)
- Canlı önizleme

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
- E-posta gönderin: selimhancil@gmail.com

---

**trendCRM** ile Instagram analizi ve trend takibini kolaylaştırın! 🚀# trendCRM
