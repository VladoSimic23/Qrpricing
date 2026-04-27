# SEO Setup Guide za QR Cjenik

## ✅ Šta je već implementirano

### 1. **Dinamički Sitemap**

- `app/sitemap.ts` - Automatski generiše sitemap.xml sa svim rutama
- Dostupan na: `https://www.digitalcjenik.com/sitemap.xml`

### 2. **Robots.txt**

- `app/robots.ts` - Kontroliše pristup crawlers-ima
- Dostupan na: `https://www.digitalcjenik.com/robots.txt`

### 3. **Comprehensive Metadata**

- `lib/seo.ts` - Centralizovana SEO konfiguracija sa keywords
- Root metadata u `app/layout.tsx` sa Open Graph i Twitter Card tagovima
- Per-page metadata za:
  - Home page (`app/page.tsx`)
  - Menu stranice (`app/menu/[slug]/page.tsx`)
  - Sign-in (`app/sign-in/layout.tsx`)
  - Sign-up (`app/sign-up/layout.tsx`)
  - Dashboard (`app/dashboard/layout.tsx`)
  - Studio (`app/studio/layout.tsx`)

### 4. **Structured Data (JSON-LD)**

- Organization schema - Informacije o kompaniji
- Website schema - Website metapodaci
- FAQ schema - Česta pitanja

### 5. **Open Graph & Twitter Cards**

- Svi society media tagovi za preglede linkova
- Prilagođene slike za razne veličine

### 6. **Multilingual Support**

- Alternate language links za `hr` i `en`
- `hreflang` tagovi za Google

---

## 🔧 Trebalo bi da uradi:

### 1. **Google Search Console**

```
1. Idi na https://search.google.com/search-console/
2. Dodaj svojstvo: https://www.digitalcjenik.com
3. Verifikuj preko DNS ili HTML tag-a
4. Pošalji sitemap: https://www.digitalcjenik.com/sitemap.xml
5. Prati performance u reportima
```

### 2. **Google Analytics 4**

```
1. Kreiraj GA4 property na https://analytics.google.com/
2. Dodaj Measurement ID u app/layout.tsx
3. Odmentiraj Google Analytics Script
4. Prati konverzije i user journey
```

### 3. **Favicon i Apple Touch Icon**

```
1. Kreiraj favicon.ico i apple-touch-icon.png
2. Stavi u public/ folder
3. Tagovi su već u app/layout.tsx
```

### 4. **OG Images**

```
1. Kreiraj og-image.png (1200x630px)
2. Kreiraj og-image-square.png (800x800px)
3. Stavi u public/ folder
4. Koristiće se za social media previews
```

### 5. **Structured Data za Products/Services** (Opciono)

```typescript
// Za ako kasnije dodaš e-commerce ili pricing
{
  "@type": "Service",
  "name": "Digitalni Meni",
  "description": "...",
  "provider": {
    "@type": "Organization",
    "name": "QR Cjenik"
  },
  "areaServed": ["BA", "HR", "RS"]
}
```

### 6. **Performance Monitoring**

```
1. PageSpeed Insights: https://pagespeed.web.dev/
2. GTmetrix: https://gtmetrix.com/
3. Lighthouse (Built-in u Chrome DevTools)
```

### 7. **Sitemap za Menu stranice** (Napredni)

```typescript
// U app/menu/sitemap.ts dodaj sve javne menije
// Trebat će query Sanity baze za sve aktivne tenants
```

### 8. **Pretraživanje na siteu** (Opciono)

```
Dodaj custom search handler u app/api/search/
```

---

## 📊 Keywords po Strannici

### Home Page

- digitalni meni
- QR meni
- meni za restoran
- meni za kafić
- digitalni cjenik
- sistem za menije

### Menu Pages (Dynamic)

- [Naziv Restorana] meni
- meni za [naziv]
- QR kod meni
- digitalni cjenik [naziv]

### Sign-up

- besplatna proba
- registracija
- otvoriti račun
- QR cjenik

---

## 🚀 Deployment Checklist

- [ ] Google Search Console verifikovan
- [ ] Google Analytics postavljen
- [ ] Favicon i Apple Touch Icon u public/
- [ ] OG slike u public/ (1200x630 i 800x800)
- [ ] SSL certifikat aktivan (HTTPS)
- [ ] Robots.txt dostupan
- [ ] Sitemap dostupan
- [ ] Meta tagovi provjereni
- [ ] Mobile responsiveness testiran
- [ ] Page speed testiran (>80 score)

---

## 🔍 QA Checklist

```bash
# Provjeri da li se tagovi rendiraju ispravno
curl https://www.digitalcjenik.com -s | grep "<title>"
curl https://www.digitalcjenik.com -s | grep "og:image"

# Provjeri sitemap
curl https://www.digitalcjenik.com/sitemap.xml

# Provjeri robots.txt
curl https://www.digitalcjenik.com/robots.txt
```

---

## 📧 Kontakt za SEO Optimizaciju

Za dodatnu optimizaciju, razmotri:

1. **Link building** - Dogadi se da linkaju do tebe
2. **Content marketing** - Napiši blog o digitalnim menijima
3. **Local SEO** - Registruj se na Google Business Profile
4. **Reviews** - Prikupi pozitivne recenzije

---

## ⚡ Brzina Optimizacija

Već implementirano:

- Next.js Image optimizacija
- Font preloading
- Preconnect za Google Fonts
- Lazy loading komponenti

Trebalo bi dodatno:

- Image compression (WebP)
- CDN setup
- Static export gdje je moguće
- Cache headers konfiguracija

---

## 📝 Monitoring

Provjeri regularly:

- Google Search Console - Indexing status
- Google Analytics - Traffic, konverzije
- Lighthouse scores - Performance
- Core Web Vitals - LCP, FID, CLS
