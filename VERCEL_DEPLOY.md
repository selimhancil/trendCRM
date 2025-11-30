# 🚀 Vercel Deployment Rehberi

Bu rehber, trendCRM projesini Vercel'e nasıl yayınlayacağınızı adım adım açıklar.

## 📋 İçindekiler

1. [Yöntem 1: Vercel Dashboard (Önerilen)](#yöntem-1-vercel-dashboard-önerilen)
2. [Yöntem 2: Vercel CLI](#yöntem-2-vercel-cli)
3. [Environment Variables Ayarlama](#environment-variables-ayarlama)
4. [Supabase Authentication Ayarları](#supabase-authentication-ayarları)
5. [Deployment Sonrası Kontroller](#deployment-sonrası-kontroller)

---

## Yöntem 1: Vercel Dashboard (Önerilen)

### Adım 1: Vercel Hesabı Oluşturma

1. [vercel.com](https://vercel.com) adresine gidin
2. **"Sign Up"** butonuna tıklayın
3. GitHub hesabınızla giriş yapın (önerilir)

### Adım 2: Projeyi İçe Aktarma

1. Vercel Dashboard'da **"Add New..."** > **"Project"** seçeneğine tıklayın
2. GitHub repository'nizi seçin: `selimhancil/trendCRM`
3. **"Import"** butonuna tıklayın

### Adım 3: Proje Ayarları

Vercel otomatik olarak Next.js projesini algılayacak. Ayarlar:

- **Framework Preset**: Next.js (otomatik)
- **Root Directory**: `./` (kök dizin)
- **Build Command**: `npm run build` (otomatik)
- **Output Directory**: `.next` (otomatik)
- **Install Command**: `npm install` (otomatik)

### Adım 4: Environment Variables Ekleme

**⚠️ ÖNEMLİ**: Environment variables eklemeden deploy etmeyin!

1. **"Environment Variables"** bölümüne gidin
2. Aşağıdaki değişkenleri ekleyin:

```
NEXT_PUBLIC_SUPABASE_URL=https://wixevtoezbipktscjcqe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeGV2dG9lemJpcGt0c2NqY3FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MzYxMjAsImV4cCI6MjA4MDAxMjEyMH0.mt06ISgOwsh97PsyGpEvybemFjkspacR15UzYWdQ1CQ
```

**Opsiyonel değişkenler** (ihtiyacınıza göre ekleyin):

```
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
OPENAI_API_KEY=
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=
```

3. Her değişken için **Environment** seçin:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### Adım 5: Deploy

1. **"Deploy"** butonuna tıklayın
2. Build işlemi başlayacak (2-5 dakika sürebilir)
3. Başarılı olduğunda URL'nizi alacaksınız: `https://trendcrm.vercel.app`

---

## Yöntem 2: Vercel CLI

### Adım 1: Vercel'e Login

```bash
vercel login
```

### Adım 2: Projeyi Deploy Et

```bash
# İlk deploy
vercel

# Production'a deploy
vercel --prod
```

### Adım 3: Environment Variables Ekleme

CLI ile environment variables eklemek için:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Değeri yapıştırın: https://wixevtoezbipktscjcqe.supabase.co
# Environment seçin: Production, Preview, Development

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Değeri yapıştırın: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Environment seçin: Production, Preview, Development
```

Veya Dashboard'dan ekleyebilirsiniz (daha kolay).

---

## Environment Variables Ayarlama

### Zorunlu Değişkenler

| Değişken | Değer | Açıklama |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://wixevtoezbipktscjcqe.supabase.co` | Supabase proje URL'i |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase anon key |

### Opsiyonel Değişkenler

n8n, OpenAI ve Instagram entegrasyonları için gerekli değişkenler (ihtiyacınıza göre ekleyin).

### Environment Variables Ekleme Adımları

1. Vercel Dashboard > Projeniz > **Settings** > **Environment Variables**
2. **"Add New"** butonuna tıklayın
3. Key ve Value'yu girin
4. Environment'ları seçin (Production, Preview, Development)
5. **"Save"** butonuna tıklayın

**⚠️ ÖNEMLİ**: Environment variables ekledikten sonra yeni bir deployment yapmanız gerekir!

---

## Supabase Authentication Ayarları

Production URL'inizi Supabase'e eklemeniz gerekiyor:

### Adım 1: Supabase Dashboard

1. [Supabase Dashboard](https://wixevtoezbipktscjcqe.supabase.co) > **Authentication** > **URL Configuration**
2. **"Site URL"** alanına Vercel URL'inizi ekleyin:
   ```
   https://trendcrm.vercel.app
   ```
   (veya kendi domain'iniz)

### Adım 2: Redirect URLs

**"Redirect URLs"** alanına ekleyin:

```
https://trendcrm.vercel.app/**
https://trendcrm.vercel.app/auth/callback
```

**Wildcard (`**`) kullanarak tüm alt sayfaları kapsayabilirsiniz.**

### Adım 3: Email Templates (Opsiyonel)

Email template'lerinde URL'leri güncelleyin:
- **"Confirm signup"** template'inde `{{ .SiteURL }}` kullanın
- **"Reset password"** template'inde `{{ .SiteURL }}` kullanın

---

## Deployment Sonrası Kontroller

### 1. Site Erişimi

- ✅ Ana sayfa açılıyor mu?
- ✅ URL doğru mu?

### 2. Authentication Testi

1. `/auth/signup` sayfasına gidin
2. Yeni kullanıcı oluşturun
3. Email doğrulamasını kontrol edin
4. `/auth/login` ile giriş yapın

### 3. Supabase Bağlantısı

1. `/admin` sayfasına gidin (login gerekli)
2. Settings sayfasında Supabase bağlantısını kontrol edin

### 4. Console Hataları

Tarayıcı Developer Tools > Console'da hata var mı kontrol edin.

---

## 🔄 Otomatik Deployment

Vercel, GitHub'a push yaptığınızda otomatik olarak deploy eder:

- **Main branch** → Production deployment
- **Diğer branch'ler** → Preview deployment

### Preview URL'leri

Her pull request için otomatik preview URL oluşturulur:
- `https://trendcrm-git-branch-name.vercel.app`

---

## 🌐 Custom Domain Ekleme

### Adım 1: Domain Ekleme

1. Vercel Dashboard > Projeniz > **Settings** > **Domains**
2. **"Add Domain"** butonuna tıklayın
3. Domain'inizi girin: `trendcrm.com`
4. DNS kayıtlarını ekleyin (Vercel size talimat verecek)

### Adım 2: Supabase'i Güncelleme

Custom domain ekledikten sonra Supabase'deki URL'leri güncelleyin:
- Site URL: `https://trendcrm.com`
- Redirect URLs: `https://trendcrm.com/**`

---

## 🐛 Sorun Giderme

### Build Hatası

**Problem**: Build başarısız oluyor

**Çözüm**:
1. Lokalde test edin: `npm run build`
2. Build loglarını kontrol edin
3. Environment variables'ların doğru olduğundan emin olun

### Environment Variables Çalışmıyor

**Problem**: Environment variables okunmuyor

**Çözüm**:
1. Değişkenlerin `NEXT_PUBLIC_` ile başladığından emin olun (client-side için)
2. Yeni bir deployment yapın (environment variables değişiklikleri için gerekli)
3. Vercel Dashboard'da değişkenlerin doğru olduğunu kontrol edin

### Supabase Bağlantı Hatası

**Problem**: Supabase'e bağlanamıyor

**Çözüm**:
1. Environment variables'ların doğru olduğunu kontrol edin
2. Supabase Dashboard'da Site URL ve Redirect URLs'i kontrol edin
3. Supabase projesinin aktif olduğundan emin olun

### Authentication Çalışmıyor

**Problem**: Login/Signup çalışmıyor

**Çözüm**:
1. Supabase Authentication > Settings'te Site URL'i kontrol edin
2. Redirect URLs'in doğru olduğundan emin olun
3. Email provider'ın aktif olduğunu kontrol edin

---

## 📚 Ek Kaynaklar

- [Vercel Dokümantasyonu](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Auth Dokümantasyonu](https://supabase.com/docs/guides/auth)

---

## ✅ Deployment Kontrol Listesi

- [ ] Vercel hesabı oluşturuldu
- [ ] GitHub repository bağlandı
- [ ] Environment variables eklendi
- [ ] İlk deployment yapıldı
- [ ] Supabase Site URL güncellendi
- [ ] Supabase Redirect URLs eklendi
- [ ] Site test edildi
- [ ] Authentication test edildi
- [ ] Custom domain eklendi (opsiyonel)

---

**🎉 Deployment tamamlandı! Projeniz canlıda!**

