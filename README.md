# The Bebes — Menu & Pre-Order Mandiri

Website katalog menu dan formulir pre-order mandiri untuk UMKM **Pizza & Bolen Jumbo The Bebes** (Jl. Poros Moncongloe, Maros), terintegrasi dengan pemesanan langsung ke WhatsApp.

Proyek ini dikembangkan sebagai prototipe solusi praktikum mata kuliah Kewirausahaan (Minggu 11) untuk Ibu H.

---

## Fitur Utama

- **Katalog Produk & Cek Ketersediaan**: Menampilkan menu Bolen Cokelat Keju Jumbo, Bolen Original, dan Pizza Homemade Spesial beserta tautan langsung untuk menanyakan ketersediaan stok hari ini ke WhatsApp pemilik.
- **Formulir Mandiri & Slot Pengantaran COD**: Pembeli dapat memilih ambil di gerai atau diantar COD ke Perumahan Findaria Mas 2 (FM2) dengan slot jam teratur (16.00 WITA dan 17.15 WITA).
- **Alamat Khusus COD**: Kolom alamat blok/no. rumah otomatis muncul dan wajib diisi ketika metode Antar COD dipilih.
- **Pilihan Pembayaran & Informasi Pecahan Uang**: Pilihan pembayaran Tunai atau QRIS statis, lengkap dengan pilihan pecahan uang yang dibawa agar penjual dapat menyiapkan kembalian tanpa proses kalkulator kasir yang rumit.
- **Integrasi Click-to-WhatsApp**: Menghasilkan pesan terstruktur `#ORDER-BEBES` yang langsung dikirimkan ke WhatsApp pemilik.

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
├── app.js                   # Logika interaksi dan integrasi WhatsApp
├── vercel.json              # Konfigurasi deployment dan header keamanan Vercel
├── package.json             # Metadata proyek
├── .gitignore               # Berkas pengabaian Git
└── README.md                # Dokumentasi proyek
```

---

## Panduan Push ke GitHub & Vercel

```bash
git add .
git commit -m "refactor: sesuaikan fitur prototipe minggu 11 sesuai panduan tugas"
git push origin main
```

Setelah di-push ke GitHub, Vercel akan otomatis melakukan build ulang dan menerapkan pembaruan ke link domain publik Anda dalam beberapa detik.
