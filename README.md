# Project Webman 1 — Portfolio Website & CMS

Website **portfolio pribadi + CMS** milik [Mhafiznugrahaa](https://github.com/Mhafiznugrahaa), dibangun dengan arsitektur **SPA (Single Page Application) + REST API**:

- **Backend**: [webman](https://www.workerman.net/webman) — framework PHP resilent berbasis [Workerman](https://www.workerman.net), menyajikan REST API JSON (`/api/*`), panel admin server-rendered (legacy), sekaligus menjadi *host* untuk file hasil build frontend.
- **Frontend**: React 18 + Vite — SPA untuk halaman publik (beranda, portofolio, informasi, tentang) dan dashboard admin.
- **Database**: MySQL (default) / SQLite (opsional), diakses via [ThinkORM](https://github.com/top-think/think-orm).

## Cara Kerja Arsitektur

```
┌─────────────────────┐         ┌──────────────────────────────────┐
│  Frontend (React)   │  HTTP   │        Backend (webman)          │
│  frontend/          │ ──────> │  listen 0.0.0.0:8787             │
│                     │         │                                  │
│  npm run dev        │  proxy  │  /api/*        → JSON REST API   │
│   :5173             │  /api   │  /admin/*      → Admin HTML      │
│                     │  /uploads  (legacy, session)             │
│  npm run build      │         │  /* (catch-all)→ public/index.html│
│   → public/         │         │                  (SPA fallback)  │
└─────────────────────┘         └──────────────┬───────────────────┘
                                               │ ThinkORM
                                        ┌──────▼──────┐
                                        │ MySQL/SQLite│
                                        └─────────────┘
```

1. Saat development, Vite dev server (`npm run dev`) menjalankan SPA di `:5173` dan mem-proxy `/api` + `/uploads` ke webman di `:8787` (lihat `frontend/vite.config.js`).
2. Saat production, `npm run build` menulis hasil build ke folder `public/`, sehingga **cukup satu proses webman** yang menyajikan SPA + API di port yang sama (`:8787`). Semua route yang tidak cocok (catch-all) akan menyajikan `public/index.html` agar React Router bisa bekerja (SPA fallback).
3. Panel admin tersedia dalam dua mode: **SPA** (`/admin` via React) dan **server-rendered HTML legacy** (controller `app/controller/admin/*` + view `app/view/admin/*`).

## Fitur

### Publik
- **Beranda** — ringkasan portfolio, informasi terbaru, dan repository GitHub (top stars).
- **Informasi** — daftar artikel/pengumuman dengan pencarian (`q`), filter kategori (`category`), paginasi (12/halaman), dan halaman detail.
- **Portofolio** — daftar karya/proyek + halaman detail.
- **Tentang** — profil singkat + repository GitHub yang dipublikasikan.
- Dark mode, animasi/transisi halaman (Framer Motion), partikel background.

### Admin
- **Login/logout** berbasis session (`admin_id` di session webman).
- **CRUD Informasi** — judul, kategori, isi, status (published/draft), gambar.
- **CRUD Portofolio** — judul, deskripsi, gambar, URL proyek, kategori.
- **CRUD Repository** — nama, deskripsi, bahasa, URL GitHub, stars, status; plus **import massal dari JSON** (format ekspor GitHub, data diimpor sebagai `draft`).
- **Upload gambar** — JPG/JPEG/PNG/GIF/WebP, maks **2 MB**, disimpan ke `public/uploads/` dengan nama acak; file ikut terhapus dari disk saat data dihapus.
- **Proteksi akses** — middleware `AdminAuth` untuk route admin HTML; pengecekan session internal (`checkAuth()`) pada controller API admin.

## Tech Stack

| Lapisan       | Teknologi                                                                 |
| ------------- | ------------------------------------------------------------------------- |
| **Backend**   | [webman](https://www.workerman.net/webman) ^2.1 (PHP >= 8.1, Workerman)    |
| **ORM**       | [ThinkORM](https://github.com/top-think/think-orm) via `webman/think-orm`  |
| **Database**  | MySQL (`webman_info`) default / SQLite opsional                            |
| **Logging**   | Monolog ^2.0                                                              |
| **CLI**       | [webman/console](https://github.com/webman-php/console) ^2.2               |
| **Frontend**  | React 18 + [Vite](https://vitejs.dev) 6                                    |
| **Styling**   | Tailwind CSS 3 (+ Autoprefixer/PostCSS)                                    |
| **Routing FE**| react-router-dom 6                                                         |
| **Animasi**   | framer-motion, lucide-react (ikon)                                         |
| **View lama** | Raw PHP template (built-in view handler, untuk admin HTML legacy)          |

## Struktur Project

```
├── app/
│   ├── controller/
│   │   ├── HomeController.php            # Serve SPA (public/index.html) — catch-all route
│   │   ├── IndexController.php
│   │   ├── api/
│   │   │   ├── PublicController.php      # API publik: home, informasi, portofolio, tentang
│   │   │   ├── AuthController.php        # API login/check/logout (session)
│   │   │   └── AdminController.php       # API CRUD admin (info/portofolio/repository + import)
│   │   └── admin/
│   │       ├── AuthController.php        # Login/logout admin (HTML legacy)
│   │       ├── InformationController.php # CRUD informasi (HTML legacy)
│   │       ├── PortfolioController.php   # CRUD portofolio (HTML legacy)
│   │       └── RepositoryController.php  # CRUD repository (HTML legacy)
│   ├── middleware/
│   │   ├── AdminAuth.php                 # Proteksi route /admin/* (HTML)
│   │   ├── Cors.php                      # CORS untuk group /api
│   │   └── StaticFile.php
│   ├── model/
│   │   ├── Information.php               # Tabel `informations`
│   │   ├── Portfolio.php                 # Tabel `portfolios`
│   │   ├── Repository.php                # Tabel `repositories`
│   │   ├── Admin.php                     # Tabel `admins`
│   │   └── Test.php
│   ├── view/                             # Template HTML legacy (home & admin)
│   ├── process/                          # Worker Http & Monitor (hot reload)
│   ├── functions.php
│   └── exception/
├── config/                               # app, route, server (:8787), think-orm, session, dll
├── database/
│   ├── migration.sql                     # DDL tabel portfolios & repositories
│   └── information.sqlite                # File SQLite (jika pakai driver sqlite)
├── frontend/                             # === SPA REACT ===
│   ├── index.html                        # Entry Vite
│   ├── vite.config.js                    # Proxy /api & /uploads → :8787, outDir ../public
│   ├── tailwind.config.js / postcss.config.js
│   ├── package.json                      # "mhafiznugraha-portfolio"
│   └── src/
│       ├── main.jsx / App.jsx            # Definisi semua route SPA
│       ├── api.js                        # Klien fetch ke /api (public, auth, admin)
│       ├── context/AuthContext.jsx       # State login global
│       ├── lib/theme-context.jsx         # Dark mode
│       ├── components/                   # Navbar, Footer, Particles, ProtectedRoute, dll
│       └── pages/
│           ├── Beranda.jsx / Informasi.jsx / InfoDetail.jsx
│           ├── Portofolio.jsx / PortofolioDetail.jsx / Tentang.jsx
│           └── admin/                    # Login.jsx, AdminInformasi.jsx,
│                                         # AdminPortfolio.jsx, AdminRepository.jsx
├── public/                               # Output build frontend + uploads + file statis
├── runtime/                              # Log, PID, cache
├── install.php                           # Migrasi + seed database (admins, informations)
├── start.php                             # Entry point backend (php start.php start)
├── windows.bat                           # Launcher Windows
├── docker-compose.yml / Dockerfile       # PHP 8.3 cli-alpine + pdo_mysql + pcntl
└── composer.json
```

## Rute Backend

### API v1 — JSON (middleware: `Cors`)

| Method | URL                              | Fungsi                                    |
| ------ | -------------------------------- | ----------------------------------------- |
| GET    | `/api/home`                      | Data beranda (repo top 6, porto & info terbaru 3) |
| GET    | `/api/informasi?q=&category=&page=` | Daftar informasi published + paginasi  |
| GET    | `/api/info/{id}`                 | Detail informasi                          |
| GET    | `/api/portofolio`                | Semua portofolio                          |
| GET    | `/api/portofolio/{id}`           | Detail portofolio                         |
| GET    | `/api/tentang`                   | Profil + repo published                   |
| POST   | `/api/auth/login`                | Login (JSON `{username, password}`)       |
| GET    | `/api/auth/check`                | Cek status login                          |
| GET    | `/api/auth/logout`               | Logout                                    |
| GET    | `/api/admin/informasi`           | List informasi (paginasi 10, cari `q`)    |
| POST   | `/api/admin/informasi/store`     | Simpan informasi (multipart, bisa upload) |
| POST   | `/api/admin/informasi/update/{id}` | Update informasi                        |
| POST   | `/api/admin/informasi/delete/{id}` | Hapus informasi (+gambar)               |
| GET    | `/api/admin/portofolio`          | List portofolio                           |
| POST   | `/api/admin/portofolio/store`    | Simpan portofolio                         |
| POST   | `/api/admin/portofolio/update/{id}` | Update portofolio                      |
| POST   | `/api/admin/portofolio/delete/{id}` | Hapus portofolio                       |
| GET    | `/api/admin/repository`          | List repository                           |
| POST   | `/api/admin/repository/store`    | Simpan repository                         |
| POST   | `/api/admin/repository/update/{id}` | Update repository                      |
| POST   | `/api/admin/repository/delete/{id}` | Hapus repository                       |
| POST   | `/api/admin/repository/import`   | Import massal dari JSON (`{json_data}`)   |

> Semua endpoint `/api/admin/*` memeriksa session `admin_id`; tanpa login → `401 Unauthorized`.

### Admin HTML (legacy) & lainnya

| Method | URL                          | Fungsi                                  |
| ------ | ---------------------------- | --------------------------------------- |
| GET    | `/backend` atau `/admin/login` | Form login admin                      |
| POST   | `/backend` atau `/admin/login` | Proses login                          |
| GET    | `/admin/logout`              | Logout                                  |
| GET    | `/admin`                     | Dashboard informasi                     |
| GET    | `/admin/create`              | Form tambah informasi                   |
| POST   | `/admin/store`               | Simpan informasi                        |
| GET    | `/admin/edit/{id}`           | Form edit informasi                     |
| POST   | `/admin/update/{id}`         | Update informasi                        |
| POST   | `/admin/delete/{id}`         | Hapus informasi                         |
| GET/POST | `/admin/portofolio[/...]`  | CRUD portofolio (index/create/store/edit/update/delete) |
| GET/POST | `/admin/repository[/...]`  | CRUD repository + `/repository/import`  |
| GET    | `/{any}`                     | **Catch-all → serve SPA** (`public/index.html`) |

> Route `/admin/*` (selain login/logout) dilindungi middleware `AdminAuth`. Catch-all SPA **wajib berada paling bawah** `config/route.php`.

## Rute Frontend (React Router)

| Path                  | Halaman                                |
| --------------------- | -------------------------------------- |
| `/`                   | Beranda                                |
| `/informasi`          | Daftar informasi                       |
| `/info/:id`           | Detail informasi                       |
| `/portofolio`         | Daftar portofolio                      |
| `/portofolio/:id`     | Detail portofolio                      |
| `/tentang`            | Tentang + repository                   |
| `/admin/login`        | Login admin (SPA)                      |
| `/admin`              | Dashboard Informasi (protected)        |
| `/admin/portofolio`   | Kelola Portofolio (protected)          |
| `/admin/repository`   | Kelola Repository (protected)          |

## Database

Default: **MySQL** di `127.0.0.1:3306`, database `webman_info` (konfigurasi: `config/think-orm.php`). Bisa diganti ke SQLite dengan mengaktifkan koneksi `sqlite` dan set `'default' => 'sqlite'`.

| Tabel          | Kolom utama                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `admins`       | id, username (unique), password (bcrypt), created_at                         |
| `informations` | id, title, category, body, image, status (published/draft), timestamps       |
| `portfolios`   | id, title, description, image, project_url, category, timestamps             |
| `repositories` | id, name, description, language, github_url, stars, status, timestamps       |

- DDL `admins` & `informations` + seed → dibuat otomatis oleh `install.php`.
- DDL `portfolios` & `repositories` → `database/migration.sql`.
- Akun default: **admin / admin123**.

## Persyaratan

- PHP >= 8.1 (ekstensi `pdo_mysql` atau `pdo_sqlite`, direkomendasikan `event` & `pcntl`)
- Composer
- Node.js >= 18 + npm (untuk frontend)
- MySQL berjalan lokal (atau pakai SQLite)

## Instalasi & Menjalankan

### 1. Backend

```bash
# Install dependency PHP
composer install

# Setup database: buat DB + tabel admins/informations + seed
php install.php

# Buat tabel portfolios & repositories (sekali saja)
mysql -u root -p webman_info < database/migration.sql

# Jalankan development server (http://localhost:8787)
php start.php start

# Production (daemon)
php start.php start -d
```

**Windows:** double-click `windows.bat` (menjalankan `windows.php`).

### 2. Frontend (development)

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173 — proxy /api & /uploads ke :8787
```

### 3. Frontend (production)

```bash
cd frontend
npm run build      # output → ../public (disajikan langsung oleh webman)
```

Setelah build, buka `http://localhost:8787` — backend menyajikan SPA + API dalam satu port.

### 4. Docker (alternatif)

```bash
docker-compose up -d    # container docker-webman, port 8787
```

Image: `php:8.3.22-cli-alpine` + ekstensi `pdo`, `pdo_mysql`, `pcntl`, `opcache`.

## Konfigurasi Penting

| File                     | Isi                                                        |
| ------------------------ | ---------------------------------------------------------- |
| `config/think-orm.php`   | Koneksi DB (MySQL/SQLite)                                  |
| `config/route.php`       | Semua rute backend (API, admin HTML, catch-all SPA)        |
| `config/process.php`     | Listen address `http://0.0.0.0:8787`, jumlah worker, monitor hot-reload |
| `config/app.php`         | Debug, timezone `Asia/Jakarta`, path public/runtime        |
| `frontend/vite.config.js`| Proxy dev server & output build                            |

## Lisensi

MIT
