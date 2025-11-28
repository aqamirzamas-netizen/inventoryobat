# Panduan Deploy ke GitHub Pages

## Persiapan

### 1. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit with Supabase integration"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

Ganti `USERNAME` dan `REPO_NAME` dengan username GitHub dan nama repository Anda.

### 2. Setup GitHub Pages

1. Buka repository di GitHub
2. Klik **Settings** > **Pages**
3. Di **Source**, pilih **GitHub Actions**

### 3. Setup Secrets

GitHub Actions memerlukan environment variables. Setup secrets:

1. Di repository, klik **Settings** > **Secrets and variables** > **Actions**
2. Klik **New repository secret**
3. Tambahkan 2 secrets berikut:

**Secret 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://0ec90b57d6e95fcbda19832f.supabase.co`

**Secret 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw`

## Deploy

### Automatic Deployment (Recommended)

Setiap kali Anda push ke branch `main`, GitHub Actions akan otomatis:
1. Build aplikasi
2. Deploy ke GitHub Pages

```bash
git add .
git commit -m "Update aplikasi"
git push
```

Tunggu 2-3 menit, aplikasi akan live di:
```
https://USERNAME.github.io/REPO_NAME/
```

### Manual Deployment

Atau gunakan gh-pages:

```bash
npm install -g gh-pages
npm run deploy
```

## Cara Membuat User

Karena menggunakan Supabase Auth, buat user via Supabase Dashboard:

1. Buka: https://supabase.com/dashboard
2. Pilih project Anda
3. Klik **Authentication** > **Users**
4. Klik **Add User** > **Create new user**
5. Masukkan:
   - Email: `admin@apotek.com`
   - Password: `aqafitriadokter`
6. Klik **Create user**

## Testing

Setelah deploy:

1. Buka URL GitHub Pages Anda
2. Login dengan email dan password yang dibuat
3. Sistem akan auto-load 135 obat
4. Dashboard siap digunakan

## Troubleshooting

### Build Error
```bash
npm install
npm run build
```

### Secrets Tidak Terbaca
Pastikan nama secrets EXACT:
- `VITE_SUPABASE_URL` (bukan `SUPABASE_URL`)
- `VITE_SUPABASE_ANON_KEY` (bukan `SUPABASE_ANON_KEY`)

### 404 Error
Pastikan GitHub Pages source sudah diset ke **GitHub Actions** di Settings > Pages.

### Database Empty
Login dengan user yang valid, sistem akan auto-initialize 135 obat.

## Features

- Auto deployment via GitHub Actions
- Supabase database & auth
- Real-time data sync
- 135 obat pre-loaded
- Responsive design
- Import/Export data
- Stock management
- Transaction history

## Support

Jika ada masalah, check:
1. GitHub Actions logs (tab Actions di repo)
2. Browser console untuk errors
3. Supabase logs di dashboard
