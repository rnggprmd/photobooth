# 📸 Photobooth App

Aplikasi Photobooth modern berbasis SaaS dengan arsitektur terpisah:

- **Backend**: [Laravel 13](https://laravel.com/) — RESTful API + Sanctum Auth
- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [Lucide Icons](https://lucide.dev/)
- **Database**: MySQL 8.0
- **Repository**: [rnggprmd/photobooth](https://github.com/rnggprmd/photobooth.git)

---

## 🐳 Quick Start — Docker (Direkomendasikan)

> **Tidak perlu install PHP, Composer, Node, atau MySQL secara manual!**
> Cukup pastikan [Docker Desktop](https://www.docker.com/products/docker-desktop/) sudah terinstall dan berjalan.

### 1. Clone repository

```bash
git clone https://github.com/rnggprmd/photobooth.git
cd photobooth
```

### 2. Jalankan semua service

```bash
docker compose up -d
```

> Pertama kali build akan memakan waktu beberapa menit untuk mengunduh image dan menginstall dependencies.

### 3. Akses aplikasi

| Service | URL | Keterangan |
|---|---|---|
| 🌐 Frontend (React) | http://localhost:5173 | Aplikasi utama |
| ⚙️ Backend (Laravel) | http://localhost:8000 | REST API |
| 🗄️ phpMyAdmin | http://localhost:8080 | Database manager |

> **Login phpMyAdmin:** Server: `db`, Username: `root`, Password: _(kosong)_

### 4. Hentikan semua service

```bash
docker compose down
```

> Untuk menghapus data database juga (reset total):
> ```bash
> docker compose down -v
> ```

---

## 🔧 Perintah Docker yang Berguna

```bash
# Lihat log semua service secara realtime
docker compose logs -f

# Lihat log service tertentu
docker compose logs -f backend
docker compose logs -f frontend

# Masuk ke shell container backend (Laravel)
docker compose exec backend bash

# Jalankan artisan command
docker compose exec backend php artisan migrate:fresh --seed
docker compose exec backend php artisan tinker

# Rebuild ulang image (setelah ubah Dockerfile atau install package baru)
docker compose build --no-cache
docker compose up -d
```

---

## 📁 Struktur Folder

```text
photobooth/
├── docker-compose.yml       # Orkestrasi semua Docker service
├── backend/                 # Laravel API (PHP 8.3)
│   ├── Dockerfile           # Image builder untuk backend
│   ├── docker-entrypoint.sh # Script bootstrap (migrate, key:generate, dll)
│   ├── .env.docker          # Template .env khusus Docker
│   ├── app/
│   ├── config/
│   └── routes/
│       ├── api.php          # Endpoint REST API
│       └── web.php
└── frontend/                # React SPA (Vite)
    ├── Dockerfile           # Image builder untuk frontend
    ├── src/
    │   ├── api/             # Axios client modules
    │   ├── components/      # Reusable UI components
    │   └── pages/           # Halaman aplikasi
    └── vite.config.ts       # Config Vite + Proxy /api ke Laravel
```

---

## 💻 Menjalankan Tanpa Docker (Manual — Laragon)

Jika ingin menjalankan secara lokal tanpa Docker:

### Backend (Laravel)

```powershell
cd backend

# Buat file .env
cp .env.example .env

# Buat database 'photobooth' di MySQL (HeidiSQL/phpMyAdmin Laragon)
# Pastikan DB_HOST=127.0.0.1 di .env

php artisan key:generate
php artisan migrate
php artisan serve
```

> Backend aktif di: `http://localhost:8000`

### Frontend (React Vite)

```powershell
cd frontend
npm install
npm run dev
```

> Frontend aktif di: `http://localhost:5173`

---

## 🔌 API Endpoints Utama

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/health` | Status check backend |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/dashboard` | Data dashboard |
| `GET` | `/api/sessions` | Daftar photo sessions |
| `GET` | `/api/packages` | Daftar paket |

---

## 🐙 Git Workflow

```powershell
git add .
git commit -m "feat: pesan commit"
git push origin main
```
