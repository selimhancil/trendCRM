# 🔧 Sorun Giderme Rehberi

## Yaygın Hatalar ve Çözümleri

### 1. Build Hataları
```bash
# Build'i temizleyip tekrar deneyin
npm run build

# TypeScript hataları için
npx tsc --noEmit
```

### 2. Sayfa Bulunamadı (404)
- Route'ların doğru klasörlerde olduğundan emin olun
- `app/` klasörü altında `page.tsx` dosyası olmalı

### 3. API Hataları
- `.env.local` dosyasının doğru yapılandırıldığından emin olun
- API endpoint'lerin doğru URL'lere işaret ettiğini kontrol edin

### 4. Import Hataları
```typescript
// Yanlış
import { Component } from './component'

// Doğru
import { Component } from '@/components/Component'
```

### 5. Supabase Bağlantı Hataları
- `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` kontrol edin
- Supabase projenizin aktif olduğundan emin olun

## Hata Raporlama

Hata alıyorsanız lütfen şunları paylaşın:
1. Hangi sayfada/özellikte hata var?
2. Konsoldaki tam hata mesajı
3. Ne yaparken hata oluşuyor?
4. Ekran görüntüsü (varsa)




