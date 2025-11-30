# 🚀 Supabase Sıfırdan Kurulum Rehberi

Bu rehber, trendCRM projesini Supabase'e sıfırdan nasıl yükleyeceğinizi adım adım açıklar.

## 📋 İçindekiler

1. [Supabase Projesi Oluşturma](#1-supabase-projesi-oluşturma)
2. [Database Schema Kurulumu](#2-database-schema-kurulumu)
3. [Environment Variables Ayarlama](#3-environment-variables-ayarlama)
4. [Authentication Yapılandırması](#4-authentication-yapılandırması)
5. [Test ve Doğrulama](#5-test-ve-doğrulama)

---

## 1. Supabase Projesi Oluşturma

### Adım 1.1: Supabase Hesabı Oluşturma

1. [Supabase.com](https://supabase.com) adresine gidin
2. **"Start your project"** veya **"Sign up"** butonuna tıklayın
3. GitHub, Google veya e-posta ile hesap oluşturun

### Adım 1.2: Yeni Proje Oluşturma

1. Dashboard'da **"New Project"** butonuna tıklayın
2. Proje bilgilerini doldurun:
   - **Name**: `trendCRM` (veya istediğiniz isim)
   - **Database Password**: Güçlü bir şifre belirleyin (SAKLAYIN!)
   - **Region**: Size en yakın bölgeyi seçin (örn: `West US`, `Europe West`)
3. **"Create new project"** butonuna tıklayın
4. Proje oluşturulmasını bekleyin (2-3 dakika sürebilir)

### Adım 1.3: Proje Bilgilerini Alma

1. Proje oluşturulduktan sonra, sol menüden **"Settings"** (⚙️) seçeneğine tıklayın
2. **"API"** sekmesine gidin
3. Şu bilgileri kopyalayın ve bir yere kaydedin:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: (Gizli tutun, sadece backend için)

---

## 2. Database Schema Kurulumu

### Yöntem 1: SQL Editor ile (Önerilen)

1. Supabase Dashboard'da sol menüden **"SQL Editor"** seçeneğine tıklayın
2. **"New query"** butonuna tıklayın
3. `supabase-settings-table.sql` dosyasının içeriğini kopyalayın
4. SQL Editor'e yapıştırın
5. **"Run"** butonuna tıklayın (veya `Cmd+Enter` / `Ctrl+Enter`)
6. Başarılı mesajını görmelisiniz: ✅ "Success. No rows returned"

### Yöntem 2: Supabase CLI ile

Eğer Supabase CLI kuruluysa:

```bash
# Supabase'e login olun
supabase login

# Projeyi link edin
supabase link --project-ref your-project-ref

# Migration dosyasını çalıştırın
supabase db push
```

---

## 3. Environment Variables Ayarlama

### Adım 3.1: .env.local Dosyası Oluşturma

Proje kök dizininde `.env.local` dosyası oluşturun:

```bash
# Terminal'de proje dizininde:
touch .env.local
```

### Adım 3.2: Environment Variables Ekleme

`.env.local` dosyasına aşağıdaki bilgileri ekleyin (Supabase Dashboard'dan aldığınız değerlerle):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# n8n Webhook URLs (Opsiyonel - sonra ekleyebilirsiniz)
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
```

**⚠️ ÖNEMLİ**: `.env.local` dosyasını `.gitignore`'a ekleyin (zaten ekli olmalı)

---

## 4. Authentication Yapılandırması

### Adım 4.1: Authentication Ayarları

1. Supabase Dashboard'da **"Authentication"** > **"Settings"** seçeneğine gidin
2. **"Site URL"** alanını güncelleyin:
   - Geliştirme için: `http://localhost:3000`
   - Production için: `https://yourdomain.com`
3. **"Redirect URLs"** alanına ekleyin:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/**
   ```

### Adım 4.2: Email Provider Ayarları (Opsiyonel)

1. **"Authentication"** > **"Providers"** seçeneğine gidin
2. **"Email"** provider'ını etkinleştirin
3. Email template'lerini özelleştirebilirsiniz

### Adım 4.3: Google OAuth (Opsiyonel)

1. **"Authentication"** > **"Providers"** > **"Google"** seçeneğine gidin
2. Google Cloud Console'dan Client ID ve Secret alın
3. Supabase'e ekleyin

---

## 5. Test ve Doğrulama

### Adım 5.1: Projeyi Başlatma

```bash
# Bağımlılıkları yükleyin (eğer yapmadıysanız)
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

### Adım 5.2: Database Bağlantısını Test Etme

1. Tarayıcıda `http://localhost:3000` adresine gidin
2. `/admin` sayfasına gidin
3. Settings sayfasında Supabase bağlantısını kontrol edin

### Adım 5.3: Authentication Testi

1. `/auth/signup` sayfasına gidin
2. Yeni bir kullanıcı oluşturun
3. Email doğrulamasını kontrol edin (eğer etkinse)
4. `/auth/login` ile giriş yapın

### Adım 5.4: Database Tablosunu Kontrol Etme

1. Supabase Dashboard'da **"Table Editor"** seçeneğine gidin
2. `settings` tablosunun oluşturulduğunu kontrol edin
3. `system_settings` kaydının var olduğunu kontrol edin

---

## 🔧 Sorun Giderme

### Problem: "Invalid API key" hatası

**Çözüm**: 
- `.env.local` dosyasındaki `NEXT_PUBLIC_SUPABASE_ANON_KEY` değerini kontrol edin
- Supabase Dashboard'dan yeni key kopyalayın
- Sunucuyu yeniden başlatın (`npm run dev`)

### Problem: "Row Level Security policy violation" hatası

**Çözüm**:
- Supabase Dashboard'da **"Authentication"** > **"Policies"** seçeneğine gidin
- `settings` tablosu için policy'leri kontrol edin
- Admin email'inizi policy'ye ekleyin

### Problem: Database bağlantısı çalışmıyor

**Çözüm**:
- Supabase Dashboard'da **"Settings"** > **"Database"** seçeneğine gidin
- Connection string'i kontrol edin
- Firewall ayarlarını kontrol edin

---

## 📚 Ek Kaynaklar

- [Supabase Dokümantasyonu](https://supabase.com/docs)
- [Next.js + Supabase Rehberi](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth Dokümantasyonu](https://supabase.com/docs/guides/auth)

---

## ✅ Kurulum Kontrol Listesi

- [ ] Supabase hesabı oluşturuldu
- [ ] Yeni proje oluşturuldu
- [ ] Project URL ve API key'ler alındı
- [ ] `supabase-settings-table.sql` dosyası çalıştırıldı
- [ ] `.env.local` dosyası oluşturuldu ve dolduruldu
- [ ] Authentication ayarları yapılandırıldı
- [ ] Proje başarıyla çalıştırıldı
- [ ] Database bağlantısı test edildi
- [ ] Authentication test edildi

---

**🎉 Tebrikler! Supabase kurulumu tamamlandı!**

