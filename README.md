# 🏥 Sistem Manajemen Inventaris Apotek

Aplikasi web untuk manajemen stok obat di Apotek Dokter AQA dan Fitria dengan 2 lokasi (Teguhan & Jogorogo).

## ✨ Fitur

- 📦 Manajemen 135+ obat
- 📊 Monitoring stok real-time dengan alert (hijau/kuning/merah)
- 📝 Transaksi IN/OUT dengan kategori
- 📈 Laporan dan analytics
- 💾 Auto-save ke Supabase database
- 🔐 Authentication dengan Supabase Auth
- 📱 Responsive design
- 📤 Import/Export data

## 🚀 Quick Deploy ke GitHub Pages

### 1️⃣ Upload ke GitHub

```bash
# Initialize git (jika belum)
git init
git add .
git commit -m "Initial commit"
git branch -M main

# GANTI dengan repository Anda
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

**ATAU gunakan script otomatis:**

```bash
chmod +x push-to-github.sh
./push-to-github.sh
```

### 2️⃣ Setup GitHub Pages

1. Buka repository di GitHub
2. **Settings** > **Pages**
3. **Source**: Pilih **GitHub Actions**

### 3️⃣ Setup Environment Variables

1. **Settings** > **Secrets and variables** > **Actions**
2. Klik **New repository secret**

**Secret 1:**
```
Name: VITE_SUPABASE_URL
Value: https://0ec90b57d6e95fcbda19832f.supabase.co
```

**Secret 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
```

### 4️⃣ Buat User

1. Buka: https://supabase.com/dashboard
2. Pilih project > **Authentication** > **Users**
3. **Add User** > **Create new user**
4. Email: `admin@apotek.com`
5. Password: `aqafitriadokter`
6. ✓ Auto Confirm User
7. **Create user**

### 5️⃣ Akses Aplikasi

```
https://USERNAME.github.io/REPO_NAME/
```

Login dengan email dan password yang dibuat. Sistem akan auto-load 135 obat!

## 📚 Dokumentasi

- 📖 **[QUICKSTART.md](QUICKSTART.md)** - Panduan 7 langkah
- 📘 **[DEPLOYMENT.md](DEPLOYMENT.md)** - Panduan deployment lengkap

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Deployment**: GitHub Pages + GitHub Actions
- **Icons**: Lucide React

## 🏗️ Database Schema

### Tables

1. **medicines** - Data obat
   - id, name, teguhan_max, jogorogo_max

2. **stock_settings** - Pengaturan & stok per lokasi
   - id, medicine_id, location, current_stock, max_stock, thresholds

3. **transactions** - Riwayat transaksi
   - id, type, location, category, date, items (jsonb)

### Security

- Row Level Security (RLS) enabled
- Authenticated users only
- Real-time subscriptions

## 🔧 Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan Supabase credentials Anda

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Update Aplikasi

Setiap kali ada perubahan:

```bash
git add .
git commit -m "Update fitur xyz"
git push
```

GitHub Actions akan otomatis re-deploy dalam 2-3 menit!

## 🐛 Troubleshooting

### Build Failed
```bash
npm install
npm run build
```

### Login Error
- Pastikan user sudah dibuat di Supabase
- Check Supabase Auth logs

### Data Tidak Muncul
- Pastikan secrets benar di GitHub
- Check browser console (F12)
- Verify Supabase RLS policies

### 404 Error
- Pastikan Pages source = GitHub Actions
- Tunggu 2-3 menit setelah deployment

## 📞 Support

Check logs di:
1. **GitHub Actions**: Tab Actions di repository
2. **Browser Console**: Tekan F12
3. **Supabase**: Dashboard > Logs

## 📄 License

Private use only - Apotek Dokter AQA dan Fitria

---

**Made with ❤️ for efficient pharmacy management**
