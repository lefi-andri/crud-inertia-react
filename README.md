# Katalogin

Katalogin adalah aplikasi katalog dan manajemen produk berbasis Laravel, Inertia.js, dan React. Halaman publik menyediakan katalog modern dengan pencarian, filter kategori, dan fitur **load more**, sedangkan pengguna yang memiliki izin dapat mengelola produk serta kategori melalui dashboard.

## Fitur utama

### Katalog publik

- Menampilkan produk aktif dari kategori yang aktif pada halaman `/`.
- Pencarian berdasarkan nama produk, SKU, dan deskripsi.
- Filter kategori beserta jumlah produk pada setiap kategori.
- Pagination 12 produk per permintaan dengan tombol **Muat lebih banyak**.
- Tampilan responsif untuk perangkat mobile, tablet, dan desktop.
- Placeholder visual berdasarkan kategori untuk produk yang belum memiliki gambar.

### Manajemen produk dan kategori

- CRUD produk dan kategori produk.
- Unggah gambar produk JPG, PNG, atau WebP hingga 4 MB.
- Pembuatan slug unik secara otomatis.
- Pencarian serta filter pada halaman administrasi.
- Validasi agar kategori yang masih digunakan produk tidak dapat dihapus.
- Status aktif/nonaktif dan pengelolaan stok produk.

### Autentikasi dan otorisasi

- Registrasi, login, reset kata sandi, dan verifikasi email.
- Role `admin` dengan akses penuh ke produk dan kategori.
- Role `viewer` dengan akses baca.
- Permission terpisah untuk melihat, membuat, memperbarui, dan menghapus data.

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Backend | Laravel 13, PHP 8.5 |
| Frontend | React 19, Inertia.js 2 |
| Styling | Tailwind CSS 4, shadcn/ui |
| Database | MariaDB/MySQL |
| Media | Spatie Laravel Media Library |
| Otorisasi | Spatie Laravel Permission |
| Build tool | Vite 6 |
| Testing | Pest 4 |

## Prasyarat

Pastikan perangkat sudah memiliki:

- PHP 8.5 atau lebih baru beserta ekstensi yang dibutuhkan Laravel.
- Composer.
- Node.js 20 atau lebih baru dan npm.
- MariaDB atau MySQL.
- Laravel Herd bersifat opsional, tetapi direkomendasikan untuk pengembangan di Windows atau macOS.

## Instalasi

1. Clone repository dan masuk ke direktori proyek.

   ```bash
   git clone <repository-url>
   cd crud-inertia-react
   ```

2. Instal dependency PHP dan JavaScript.

   ```bash
   composer install
   npm install
   ```

3. Salin konfigurasi environment.

   ```bash
   cp .env.example .env
   ```

   Pada PowerShell, gunakan:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Buat application key.

   ```bash
   php artisan key:generate
   ```

5. Sesuaikan koneksi database di `.env`.

   ```dotenv
   DB_CONNECTION=mariadb
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=crud_inertia_react
   DB_USERNAME=root
   DB_PASSWORD=
   ```

6. Jalankan migrasi dan seeder.

   ```bash
   php artisan migrate --seed
   ```

7. Buat symbolic link untuk gambar produk.

   ```bash
   php artisan storage:link
   ```

## Menjalankan aplikasi

Jalankan seluruh layanan pengembangan dengan satu perintah:

```bash
composer run dev
```

Perintah tersebut menjalankan server Laravel, queue worker, log viewer, dan Vite secara bersamaan.

Jika menggunakan Laravel Herd, aplikasi PHP sudah dilayani oleh Herd sehingga cukup menjalankan Vite:

```bash
npm run dev
```

Alamat aplikasi menyesuaikan `APP_URL`. Pada konfigurasi Herd proyek ini, alamat yang digunakan adalah:

```text
http://crud-inertia-react.test
```

## Data awal dan akun demo

`DatabaseSeeder` membuat:

- 10 kategori produk aktif.
- 150 produk contoh aktif atau 15 produk untuk setiap kategori.
- Role `admin` dan `viewer`.
- Seluruh permission produk dan kategori.
- Satu akun administrator untuk pengujian.

| Field | Nilai |
| --- | --- |
| Email | `test@example.com` |
| Password | `password` |
| Role | `admin` |

Seeder produk dan kategori bersifat idempoten. Seeder dapat dijalankan kembali tanpa menggandakan 150 data contoh:

```bash
php artisan db:seed --class=ProductCategorySeeder
php artisan db:seed --class=ProductSeeder
```

Untuk mengulang seluruh database dari awal pada lingkungan pengembangan:

```bash
php artisan migrate:fresh --seed
```

> Perintah `migrate:fresh` menghapus seluruh tabel beserta data yang sudah ada. Jangan gunakan pada database produksi.

## Hak akses

| Permission | Admin | Viewer |
| --- | :---: | :---: |
| `products.view` | Ya | Ya |
| `products.create` | Ya | Tidak |
| `products.update` | Ya | Tidak |
| `products.delete` | Ya | Tidak |
| `categories.view` | Ya | Ya |
| `categories.create` | Ya | Tidak |
| `categories.update` | Ya | Tidak |
| `categories.delete` | Ya | Tidak |

Pengguna baru otomatis memperoleh role `viewer` apabila role tersebut sudah tersedia di database.

## Route utama

| URL | Akses | Keterangan |
| --- | --- | --- |
| `/` | Publik | Katalog, pencarian, filter kategori, dan load more |
| `/login` | Publik | Login pengguna |
| `/register` | Publik | Registrasi pengguna baru |
| `/dashboard` | Terautentikasi | Dashboard pengguna |
| `/products` | Sesuai permission | Manajemen produk |
| `/product-categories` | Sesuai permission | Manajemen kategori |
| `/profile` | Terautentikasi | Pengaturan profil |

Daftar route lengkap dapat dilihat dengan:

```bash
php artisan route:list --except-vendor
```

## Pengujian

Jalankan seluruh test suite:

```bash
php artisan test
```

Pengujian mencakup autentikasi, profil, otorisasi, CRUD produk dan kategori, unggah gambar, katalog publik, pencarian, filter, serta konsistensi jumlah data seeder.

## Build produksi

Bangun aset frontend yang telah dioptimalkan:

```bash
npm run build
```

Untuk deployment produksi, pastikan `APP_ENV=production`, nonaktifkan debug, konfigurasi queue sesuai infrastruktur, lalu optimalkan cache Laravel:

```bash
php artisan optimize
```

## Struktur penting

```text
app/
├── Http/Controllers/StorefrontController.php   # Katalog publik
├── Http/Controllers/ProductController.php      # CRUD produk
├── Http/Controllers/ProductCategoryController.php
├── Models/Product.php
├── Models/ProductCategory.php
└── Policies/                                   # Otorisasi produk dan kategori

database/
└── seeders/
    ├── DatabaseSeeder.php
    ├── ProductCategorySeeder.php
    └── ProductSeeder.php

resources/
├── css/app.css
└── js/Pages/
    ├── Welcome.jsx                             # Halaman katalog publik
    ├── Products/                               # Halaman manajemen produk
    └── ProductCategories/                      # Halaman manajemen kategori
```

## Pemecahan masalah

### Gambar produk tidak tampil

Pastikan symbolic link storage sudah dibuat:

```bash
php artisan storage:link
```

### Perubahan permission belum terbaca

Bersihkan cache permission dan aplikasi:

```bash
php artisan permission:cache-reset
php artisan optimize:clear
```

### Tampilan frontend belum berubah

Pastikan Vite sedang berjalan selama pengembangan atau bangun ulang aset produksi:

```bash
npm run dev
# atau
npm run build
```

## Lisensi

Proyek ini menggunakan komponen open-source dari ekosistem Laravel dan React. Laravel Framework tersedia di bawah [MIT License](https://opensource.org/licenses/MIT).
