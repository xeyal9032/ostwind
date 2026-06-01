# Git & GitHub — versiya saxlama

## Bütün versiyalar qalır?

**Bəli.** Git hər `commit`-i saxlayır. GitHub-a push etdikdə bütün tarixçə buludda qalır:

- Köhnə commit-lərə qayıtmaq: `git log` → `git checkout <hash>`
- Müəyyən versiya etiketi: `git tag v1.0.0` → `git push origin v1.0.0`

Heç vaxt `git push --force` istifadə etməyin (xüsusən `main` üçün) — tarix silinə bilər.

---

## Avtomatik GitHub push (lokal)

Hər **commit**-dən sonra avtomatik `git push`:

```bash
# 1) Hook quraşdır (bir dəfə)
npm run git:hooks:install

# 2) Avtomatik pushu aç
npm run git:auto-push:on

# 3) Normal iş — commit edəndə push avtomatik gedir
git add .
git commit -m "feat: yeni funksiya"
```

Bağlamaq: `npm run git:auto-push:off`

> **Qeyd:** Hər fayl saxlananda avtomatik commit/push **tövsiyə olunmur** — yarımçıq və ya sınmış kod da gedə bilər. Commit = məntiqi dəyişiklik nöqtəsi.

---

## Bir əmrlə sinxron

```bash
npm run git:sync -- "Hero mobil düzəlişi"
```

Mesaj verməsəniz, tarix damğalı avtomatik mesaj istifadə olunur.

---

## GitHub Actions (CI)

`main`-ə hər push-da GitHub avtomatik `npm run build` işlədir. Bu, kodun GitHub-da saxlanmasını təmin edir; push-un özü yenə sizin (və ya hook-un) `git push` əmri ilə gedir.

---

## Versiya etiketləri (release)

Böyük mərhələlər üçün:

```bash
git tag -a v1.1.0 -m "6 dil CMS, tələbə portalı"
git push origin v1.1.0
```

GitHub → **Releases** bölməsində bütün versiyalar görünür.

---

## Admin: Yeniləmələr (production deploy)

**Xeyal → Yeniləmələr** (`/admin/xeyal/updates`)

Serverdə (cPanel) `.env` / Environment Variables:

```
DEPLOY_ENABLED=true
GITHUB_REPO=xeyal9032/ostwind
DEPLOY_BRANCH=main
```

Tələb: Application root **git clone** olmalıdır (`git pull` işləməlidir).

Düymə: **GitHub-dan yenilə və build et** → `git pull` + `npm ci` + `prisma generate` + `npm run build`  
Sonra cPanel-də **Node.js app → Restart**.

---

## `.env` və şəxsi fayllar

`.env` və `public/uploads/` repoya **daxil olmur** (`.gitignore`). Yalnız kod və konfiq nümunələri (`/.env.example`) push olunur.
