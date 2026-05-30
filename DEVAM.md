# OstWind — Davam qeydləri (son yeniləmə: 2026-05-19)

Bu fayl növbəti iş sessiyası üçün kontekstdir.

## Layihə

- **Stack:** Next.js 16, Prisma, MySQL, NextAuth (JWT), next-intl (az/tr/en/ru/uk/ge)
- **Workspace:** `c:\Users\xeyal\Desktop\ostwind`
- **Dil:** İstifadəçiyə cavablar **Türkçe**; kod şərhləri Azərbaycan dilində ola bilər

## Admin panel — əsas modullar

| Modul | Yol |
|--------|-----|
| Dashboard | `/admin/dashboard` |
| CMS (üniversitet, xidmət, blog, əlaqə, …) | Sol menyu |
| Admin istifadəçilər (yalnız super admin) | `/admin/users` |
| Hesab / şifrə (hamı) | `/admin/account` |
| **Xeyal (super admin mərkəzi)** | `/admin/xeyal` — Dashboard-da violet **Xeyal** kartı |

## Rollar

- **SUPER_ADMIN:** Tam icazə + Xeyal + admin idarəetməsi
- **ADMIN:** CMS (icazələr `permissions` JSON ilə məhdudlaşa bilər; `null` = tam icazə)
- Giriş: yalnız `SUPER_ADMIN` və `ADMIN`; `isActive: false` → giriş yoxdur

## Xeyal bölmələri (`/admin/xeyal/...`)

1. Özet — statistikalar  
2. Audit Log — `AdminAuditLog`  
3. Bildirişler — oxunmamış başvuru/mesaj (`readAt`)  
4. Başvuru & Mesaj — filtr + CSV export  
5. Rol & İzinler — `PUT /api/admin/xeyal/users/[id]/permissions`  
6. Güvenlik — 2FA (otplib), aktiv sessiyalar (`AdminSession`)  
7. Admin Yönetimi — link `/admin/users`  
8. Ana Sayfa Metinleri — `HomePageContent` (hero override, `lib/home-content.ts`)  
9. Medya Kütüphanesi — `MediaFile` + upload qeydi  
10. SEO — post/service/university meta  
11. Çöp Kutusu — soft delete (`deletedAt`), bərpa  
12. E-posta — `EmailSettings` + `lib/admin-email.ts` (SMTP lazımdır)

## Veritabanı (Prisma) — əlavə modellər/sahələr

- `User`: `lastSeenAt`, `isActive`, `permissions`, `totpSecret`, `totpEnabled`
- `AdminAuditLog`, `AdminSession`, `HomePageContent`, `EmailSettings`, `MediaFile`
- `Application` / `Message`: `readAt`
- Bir çox entity: `deletedAt`, `metaTitle`, `metaDescription`, `ogImage`

**Komanda:** `npx prisma db push` / `npx prisma generate` (Windows-da dev server açıq olanda `EPERM` ola bilər — serveri bağlayın)

## Faydalı skriptlər

```bash
node scripts/ensure-admin-users.mjs      # rolları düzəlt
node scripts/reset-admin-password.mjs EMAIL YeniSifre
node scripts/check-user.mjs EMAIL [testSifre]
node scripts/create-admin.mjs            # ilk admin (köhnə)
node scripts/db-stats.mjs                # tablo kayıt sayıları
node scripts/pre-deploy-check.mjs        # canlıya hazırlık kontrolü
```

## Canlıya hazırlık

- `.env`: `NEXTAUTH_SECRET` + `NEXTAUTH_URL` (local) — bax `CANLIYA-HAZIRLIK.md`
- Canlıda: cPanel Environment Variables, `NEXTAUTH_URL=https://domain`

## Edilmiş işlər (xülasə)

- Əlaqə videosu, xidmətlər səhifəsi, ikonlar, dil düzəlişləri  
- Blog kateqoriyaları admin, xidmət ikonu dropdown  
- Admin CRUD, onlayn status (`lastSeenAt`, 5 dəq), şifrə dəyişmə (`/admin/account`)  
- Tam **Xeyal** paketi (yuxarıdakı 12 modul)  
- Giriş: e-posta lowercase, 2FA opsional, sessiya/audit girişi bloklamır  
- Sidebar: icazəyə görə menyu filtri (`/api/admin/me`)

## Açıq / yarım qalan (növbəti sessiya)

- [x] Bütün admin CMS API-lərdə `requirePermission(...)` (universities, services, faq, pricing, team, blog, about, contact, applications, messages)  
- [x] CMS silmə əməliyyatlarında soft delete + audit log (university, service, faq, pricing, team, category; blog əvvəldən)  
- [x] Public sorğularda `notDeleted` (üniversitet, xidmət, SSS, qiymət, ekip, blog detay)  
- [x] `/api/scratch/*` production-da bağlı; seed route-lar `requireSuperAdmin`  
- [x] E-poçt: Xeyal → E-posta səhifəsində **SMTP test et** (`POST /api/admin/xeyal/email/test`)  
- [x] `NEXTAUTH_SECRET` production-da zorunlu (`lib/auth-secret.ts`); `.env.example` əlavə edildi  
- [ ] `xeyalcemilli9032@gmail.com` — DB-də id:2, SUPER_ADMIN, aktiv; giriş uğursuzdursa **şifrə sıfırlama** (`reset-admin-password.mjs` və ya Adminlər → Düzəlt)  
- [ ] Login səhifəsində `motion.div` typo-ları təmizləndi — build yoxlanmalı

## Test URL-ləri

- Public: `/az`, `/az/services`, `/az/contact`  
- Admin: `/admin/login`, `/admin/dashboard`, `/admin/xeyal`

## Git

Commit yalnız istifadəçi istəyəndə.
