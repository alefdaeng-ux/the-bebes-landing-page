# The Bebes — Katalog & Pre-Order Mandiri

Website katalog menu, kalkulator kasir, dan formulir pre-order mandiri untuk UMKM **Pizza & Bolen Jumbo The Bebes** (Jl. Poros Moncongloe, Maros), terintegrasi dengan pemesanan langsung ke WhatsApp.

Proyek ini dikembangkan sebagai prototipe solusi praktikum mata kuliah Kewirausahaan (Minggu 11) oleh Aril Pratama (NIM: 47124088, Kelas 3D TKJ).

---

## Fitur Utama

- **Katalog Produk & Info Panggang**: Menampilkan menu Bolen Cokelat Keju Jumbo, Bolen Original, dan Pizza Homemade Spesial beserta jadwal panggangan sore hangat.
- **Formulir Mandiri & Slot Pengantaran COD**: Pembeli dapat memilih ambil di gerai atau diantar COD ke Perumahan Findaria Mas 2 (FM2) dengan slot jam teratur (16.00 dan 17.00 WITA).
- **Kalkulator Kasir & Uang Kembalian Otomatis**: Menghitung total belanja secara real-time dan nominal uang kembalian yang perlu disiapkan oleh kasir/penjual.
- **Integrasi Click-to-WhatsApp**: Menghasilkan pesan terstruktur `#ORDER-BEBES (PRE-ORDER WEB)` yang langsung dikirimkan ke nomor WhatsApp pengelola.
- **Log Pesanan Lokal**: Riwayat pesanan tersimpan di memori browser lokal untuk memudahkan pencatatan tanpa ketergantungan pada server backend yang rumit.

---

## Struktur Berkas

```
the_bebes/
├── assets/                  # Foto produk asli dan dokumentasi etalase
│   ├── bolen_crop.jpg
│   ├── bolen_tiktok.jpg
│   ├── pizza_spesial.jpg
│   └── gerai_the_bebes.jpg
├── index.html               # Halaman utama landing page (HTML5)
├── styles.css               # Desain visual responsif (warm neutrals)
├── app.js                   # Logika kalkulator, interaksi, dan integrasi WhatsApp
├── vercel.json              # Konfigurasi deployment dan header keamanan Vercel
├── package.json             # Metadata proyek dan skrip lokal
├── .gitignore               # Berkas pengabaian Git
└── README.md                # Dokumentasi proyek
```

---

## Panduan Deployment ke Vercel via GitHub

### Langkah 1: Inisialisasi Git Lokal

Buka terminal (PowerShell atau Command Prompt) di dalam folder proyek ini:

```bash
git init
git add .
git commit -m "feat: inisialisasi landing page the bebes minggu 11"
```

### Langkah 2: Buat Repository Baru di GitHub

1. Masuk ke akun GitHub Anda di https://github.com
2. Klik tombol **New** untuk membuat repository baru.
3. Beri nama repository, misalnya `the-bebes-landing-page`.
4. Biarkan repository dalam status **Public** atau **Private**, jangan centang opsi "Add a README file" (karena sudah ada).
5. Klik **Create repository**.

### Langkah 3: Hubungkan dan Push ke GitHub

Jalankan perintah berikut di terminal komputer Anda (ganti URL dengan URL repository GitHub Anda):

```bash
git branch -M main
git remote add origin https://github.com/USERNAME/the-bebes-landing-page.git
git push -u origin main
```

### Langkah 4: Hubungkan ke Vercel

1. Buka dashboard Vercel di https://vercel.com dan masuk dengan akun GitHub Anda.
2. Klik tombol **Add New...** lalu pilih **Project**.
3. Di daftar repository GitHub Anda, pilih `the-bebes-landing-page` lalu klik **Import**.
4. Pada bagian pengaturan proyek:
   - **Framework Preset**: Pilih `Other` (atau biarkan default terdeteksi otomatis).
   - **Root Directory**: `./` (biarkan default).
   - **Build and Output Settings**: Tidak perlu diubah karena proyek berupa berkas statis murni.
5. Klik **Deploy**.
6. Dalam beberapa detik, website Anda akan aktif dan memiliki domain gratis dari Vercel (contoh: `https://the-bebes-landing-page.vercel.app`).

---

## Konfigurasi Nomor WhatsApp

Nomor WhatsApp tujuan pemesanan diatur pada berkas `app.js`:

```javascript
const STORE_CONFIG = {
  whatsappNumber: '6285299999644', // Format internasional tanpa simbol + atau 0 di depan
  storeName: 'Pizza & Bolen Jumbo The Bebes',
  location: 'Jl. Poros Moncongloe, Maros'
};
```
