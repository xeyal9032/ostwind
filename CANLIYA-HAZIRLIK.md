# OstWind — Canlıya Alma Rehberi (cPanel)

Bu rehber, projeyi **cPanel üzerinde Node.js** ile yayına almak için adım adım yapılacakları listeler.

> **Önemli:** Bu site statik HTML değildir. Sadece FTP ile dosya atmak yetmez — **“Setup Node.js App”** (Node.js uygulaması) şarttır.

---

## Genel bakış

| Aşama | Nerede | Ne yapılır |
|-------|--------|------------|
| 1 | Bilgisayarınız | Build, kontrol, dosya hazırlığı |
| 2 | cPanel | Node.js uygulaması oluşturma |
| 3 | cPanel | Ortam değişkenleri (`.env` yükleme **yok**) |
| 4 | FTP / Dosya Yöneticisi | Proje dosyalarını yükleme |
| 5 | cPanel / SSH | `npm install`, Prisma, uygulamayı başlatma |
| 6 | Tarayıcı | Site + admin + SMTP testi |

**Tahmini süre:** İlk kez 30–60 dakika (hosting ayarlarına göre değişir).

---

## Aşama 1 — Bilgisayarınızda (yüklemeden önce)

Proje klasöründe (`ostwind`) sırayla:

```bash
npm install
npm run build
node scripts/pre-deploy-check.mjs
node scripts/db-stats.mjs
```

### Kontrol listesi

- [ ] `npm run build` hatasız bitti (`.next` klasörü oluştu)
- [ ] `pre-deploy-check` tüm satırlarda ✓ (localhost uyarısı normal)
- [ ] `.env` dosyası **FTP ile yüklenmeyecek** — sadece local geliştirme için
- [ ] `.env` içindeki `NEXTAUTH_SECRET` güçlü (en az 32 karakter, placeholder değil)
- [ ] Admin şifrenizi biliyorsunuz (unuttuysanız: `node scripts/reset-admin-password.mjs EMAIL yeniSifre`)

### Local `.env` (şu an)

| Değişken | Local değer | Canlıda |
|----------|-------------|---------|
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://sizin-domain.com` |
| `NEXTAUTH_SECRET` | Local anahtarınız | Aynı veya yeni üretilmiş (sunucuda sabit kalmalı) |
| `DATABASE_URL` | Mevcut MySQL | Aynı remote DB veya cPanel MySQL |

---

## Aşama 2 — cPanel: Node.js uygulaması

1. cPanel → **Setup Node.js App** (veya “Node.js Selector”)
2. **Create Application**
3. Ayarlar (hosting paneline göre isimler değişebilir):
   - **Node.js sürümü:** 20.x veya 22.x (LTS)
   - **Application mode:** Production
   - **Application root:** `ostwind` (veya sitenizin alt klasörü)
   - **Application URL:** Ana domain veya alt domain
   - **Application startup file:** `node_modules/next/dist/bin/next` veya panelin önerdiği `server.js` — çoğu panelde **Start script:** `npm start` yeterli
4. Kaydedin; panel size bir **port** ve **komut** verecek (`npm start` → `next start`)

> Panel “Document Root” ile “Application Root”u karıştırmayın. Tüm proje dosyaları **Application Root** içinde olmalı.

---

## Aşama 3 — Ortam değişkenleri (cPanel UI)

**`.env` dosyasını sunucuya yüklemeyin.** Güvenlik için değişkenleri cPanel → Node.js App → **Environment Variables** bölümüne tek tek girin.

| Değişken | Zorunlu | Canlıda ne yazılır |
|----------|---------|-------------------|
| `DATABASE_URL` | Evet | `mysql://kullanici:sifre@host:3306/veritabani` — remote veya cPanel MySQL |
| `NEXTAUTH_SECRET` | Evet | En az 32 karakter rastgele (local ile **aynı** tutabilirsiniz; değiştirirseniz tüm oturumlar düşer) |
| `NEXTAUTH_URL` | Evet | `https://www.sizin-domain.com` — **sonunda `/` olmasın**, `http` değil `https` |
| `NODE_ENV` | Önerilir | `production` |
| `DEEPL_API_KEY` | Hayır | Admin çeviri özelliği için; boş bırakılabilir |

### `NEXTAUTH_SECRET` üretmek (PowerShell)

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

veya Git Bash / WSL:

```bash
openssl rand -base64 32
```

---

## Aşama 4 — Sunucuya yüklenecek dosyalar

FTP veya Dosya Yöneticisi ile **Application Root** içine:

### Mutlaka yükle

```
package.json
package-lock.json
next.config.ts
prisma/
  schema.prisma
public/
.next/          ← bilgisayarınızda build sonrası oluşur
```

### İsteğe bağlı (sunucuda build yapacaksanız)

Sunucuda `npm run build` çalıştırabiliyorsanız `.next` yüklemek zorunda değilsiniz — ama çoğu shared hosting’de **local build + `.next` yükleme** daha kolaydır.

### Yüklemeyin

```
node_modules/     ← sunucuda npm install ile oluşur
.env              ← gizli; sadece cPanel env kullanın
.git/
```

### `src/` klasörü

Sunucuda **tekrar build** yapacaksanız `src/` ve `tsconfig.json` da gerekir. Sadece hazır `.next` + `npm start` kullanacaksanız bazı hostlarda `src` şart olmayabilir; yine de **tam kaynak kodu yüklemek** sorun çıkarmaz ve ileride güncelleme kolaylaştırır.

Önerilen tam paket:

```
package.json, package-lock.json, next.config.ts
prisma/, public/, .next/
src/, messages/, tsconfig.json
scripts/          ← bakım scriptleri için
```

---

## Aşama 5 — Sunucuda komutlar

cPanel Node.js panelinde **“Run NPM Install”** varsa önce onu kullanın. Yoksa SSH / terminal:

```bash
cd /home/kullanici/ostwind   # Application Root yolunuz

npm install --omit=dev
npx prisma generate
npx prisma db push
```

> **Not:** Veritabanı zaten dolu ve şema güncelse `db push` sadece eksik kolonları ekler. İlk kurulumda şema boşsa bu adım tabloları oluşturur.

### Klasör izni

```bash
chmod 775 public/uploads
```

Medya yükleme ve admin upload için `public/uploads` **yazılabilir** olmalı.

### Uygulamayı başlat

cPanel Node.js → **Restart** / **Start**  
Start komutu genelde: `npm start` → `next start -p PORT`

---

## Aşama 6 — Canlıda test (sırayla)

| # | Test | Beklenen |
|---|------|----------|
| 1 | `https://domain.com` | Ana sayfa açılır |
| 2 | `https://domain.com/tr` (veya `/az`, `/en` …) | Dil yönlendirmesi çalışır |
| 3 | `/blog` | Yayında yazılar görünür |
| 4 | `/admin/login` | Giriş sayfası |
| 5 | Admin → Dashboard | CMS modülleri |
| 6 | Xeyal → **E-posta** → SMTP test | Test maili gelir |
| 7 | İletişim formu / başvuru | Kayıt DB’ye düşer (Xeyal bildirimler) |

### Hızlı komutlar (local)

```bash
npm run build
node scripts/pre-deploy-check.mjs
node scripts/db-stats.mjs
node scripts/reset-admin-password.mjs admin@example.com YeniSifre123
```

---

## E-posta (SMTP)

Bildirimler ve mesaj yanıtları **veritabanındaki** SMTP ayarlarını kullanır (Xeyal paneli).

1. Canlıda `/admin/login` → super admin ile giriş
2. **Xeyal** → **E-posta**
3. SMTP bilgilerini girin (hosting mail veya Gmail uygulama şifresi vb.)
4. **Test gönder** — gelen kutusunu kontrol edin

Local’de test ettiyseniz canlıda **yeniden test** şart; firewall ve domain farkı olabilir.

---

## Sık karşılaşılan sorunlar

| Belirti | Olası çözüm |
|---------|-------------|
| Admin girişi hemen düşüyor | `NEXTAUTH_URL` tam domain ile eşleşmeli (`https` + www/non-www tutarlılığı) |
| 500 / Veritabanı hatası | `DATABASE_URL` — uzaktan MySQL’e cPanel IP izni (Remote MySQL) |
| Görseller yüklenmiyor | `public/uploads` izni 775 |
| Build sunucuda patlıyor | Local’de `npm run build`, `.next` klasörünü FTP ile yükle |
| Blog boş | Admin’de yazıların **Yayında** olduğundan emin olun |
| E-posta gitmiyor | Xeyal SMTP test; port 587/465, TLS ayarları |

---

## Canlıya çıktıktan sonra (isteğe bağlı)

- [ ] Blog kategorileri ekle (şu an 0 kategori — site çalışır, filtre boş kalır)
- [ ] Okunmamış başvuru ve mesajları admin’den yanıtla
- [ ] Google Search Console / sitemap (Xeyal SEO ayarları)
- [ ] SSL sertifikası aktif (`https` zorunlu)
- [ ] `.env` ve şifreleri **asla** Git’e commit etmeyin

---

## Özet: Sizin yapacağınız 6 adım

1. **Local:** `npm run build` + `node scripts/pre-deploy-check.mjs`
2. **cPanel:** Node.js uygulaması oluştur
3. **cPanel:** `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL=https://...` gir
4. **FTP:** `package.json`, `prisma`, `public`, `.next` (+ isteğe `src`) yükle
5. **Sunucu:** `npm install`, `prisma generate`, `db push`, `uploads` izni, **Restart**
6. **Test:** Site, admin girişi, Xeyal SMTP

Local kod ve build hazırsa **1. adım tamam**; canlıya geçiş **2–6. adımlar** hosting panelinde yapılır.

---

*Son güncelleme: proje build ve güvenlik kontrolleri tamamlandıktan sonra hazırlanmıştır.*
