# 📸 Photobooth App

Aplikasi Photobooth modern dengan arsitektur terpisah:
- **Backend**: [Laravel 11](https://laravel.com/) (RESTful API & Sanctum)
- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [Lucide Icons](https://lucide.dev/)
- **Repository**: [rnggprmd/photobooth](https://github.com/rnggprmd/photobooth.git)

---

## 📁 Struktur Folder

```text
photobooth/
├── backend/            # Laravel API (PHP 8.3+)
│   ├── app/
│   ├── config/
│   ├── routes/
│   │   ├── api.php     # Endpoint REST API (e.g. /api/health)
│   │   └── web.php
│   └── .env            # Konfigurasi database & app
├── frontend/           # React SPA (Vite)
│   ├── src/
│   │   ├── api.ts      # Client Axios dengan base URL API
│   │   ├── App.tsx     # Studio Photobooth & Status Checker
│   │   └── main.tsx
│   └── vite.config.ts  # Config Vite + Proxy /api ke Laravel
└── README.md
```

---

## 🚀 Cara Menjalankan Project

### 1. Menjalankan Backend (Laravel)

Buka terminal di root project:

```powershell
cd backend

# Buat database 'photobooth' di MySQL Laragon (HeidiSQL / phpMyAdmin), lalu migrasi:
php artisan migrate

# Jalankan server backend:
php artisan serve
```
> Backend akan aktif di: `http://localhost:8000` (atau otomatis di Laragon virtual host jika diaktifkan).

---

### 2. Menjalankan Frontend (React Vite)

Buka tab terminal baru:

```powershell
cd frontend

# Jalankan development server:
npm run dev
```
> Frontend akan aktif di: `http://localhost:5173`

---

## 🔌 API Endpoint

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/health` | Status check koneksi backend, versi PHP, dan Laravel |

---

## 🐙 Git Workflow

Project ini telah terhubung ke remote repository GitHub:
`https://github.com/rnggprmd/photobooth.git`

Untuk push perubahan:
```powershell
git add .
git commit -m "feat: pesan commit"
git push origin main
```
