# Quick Start - Deploy ke GitHub Pages

## Step 1: Upload ke GitHub

```bash
# Initialize git (jika belum)
git init

# Add semua files
git add .

# Commit
git commit -m "Setup aplikasi apotek dengan Supabase"

# Set branch ke main
git branch -M main

# Link ke repository GitHub Anda (ganti USERNAME dan REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Push
git push -u origin main
```

## Step 2: Setup GitHub Pages

1. Buka repository di **GitHub.com**
2. Klik tab **Settings**
3. Klik **Pages** (di sidebar kiri)
4. Di bagian **Source**, pilih: **GitHub Actions**

## Step 3: Setup Secrets

1. Di repository, klik **Settings** > **Secrets and variables** > **Actions**
2. Klik tombol **New repository secret**

**Tambahkan Secret #1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://0ec90b57d6e95fcbda19832f.supabase.co`
- Klik **Add secret**

**Tambahkan Secret #2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw`
- Klik **Add secret**

## Step 4: Trigger Deployment

Deployment akan otomatis berjalan setelah push. Atau trigger manual:

1. Klik tab **Actions** di repository
2. Klik workflow **Deploy to GitHub Pages**
3. Klik **Run workflow** > **Run workflow**

Tunggu 2-3 menit sampai selesai (ada checkmark hijau).

## Step 5: Buat User di Supabase

1. Buka: **https://supabase.com/dashboard**
2. Login ke Supabase
3. Pilih project Anda
4. Klik **Authentication** di sidebar
5. Klik **Users** > **Add User** > **Create new user**
6. Isi form:
   - **Email**: `admin@apotek.com`
   - **Password**: `aqafitriadokter`
   - **Auto Confirm User**: ✓ (centang)
7. Klik **Create user**

## Step 6: Akses Aplikasi

URL aplikasi Anda:
```
https://USERNAME.github.io/REPO_NAME/
```

Ganti `USERNAME` dan `REPO_NAME` sesuai GitHub Anda.

**Contoh:**
- Username: `johndoe`
- Repo: `apotek-app`
- URL: `https://johndoe.github.io/apotek-app/`

## Step 7: Login

1. Buka URL aplikasi
2. Login dengan:
   - Email: `admin@apotek.com`
   - Password: `aqafitriadokter`
3. Sistem akan auto-load **135 obat**
4. Selesai!

---

## Update Aplikasi

Setiap kali Anda ubah code:

```bash
git add .
git commit -m "Update fitur"
git push
```

GitHub Actions akan otomatis re-deploy!

---

## Troubleshooting

### ❌ Build Failed di Actions
- Check tab **Actions** untuk error logs
- Pastikan secrets sudah benar

### ❌ 404 Not Found
- Pastikan GitHub Pages source = **GitHub Actions**
- Tunggu 2-3 menit setelah deployment

### ❌ Tidak Bisa Login
- Pastikan user sudah dibuat di Supabase
- Pastikan email dan password benar
- Check browser console (F12) untuk errors

### ❌ Data Tidak Muncul
- Pastikan secrets di GitHub benar
- Check Supabase dashboard apakah ada RLS policies
- Clear browser cache dan reload

---

## Contact

Jika masih ada masalah, check:
1. **GitHub Actions logs**: Tab Actions di repo
2. **Browser console**: Tekan F12 di browser
3. **Supabase logs**: Dashboard > Logs

**Selamat menggunakan!** 🎉
