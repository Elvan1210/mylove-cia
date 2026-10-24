# 💌 Website Spesial Ulang Tahun untuk Cia (Patricia) 💖

Website kejutan ulang tahun interaktif, romantis, modern, dan mobile-first yang dibuat khusus dari **Elvan** untuk **Patricia ("Cia")**.

---

## 📑 Daftar Isi
1. [Struktur Folder](#-struktur-folder)
2. [Cara Menjalankan di Komputer (Lokal)](#-cara-menjalankan-di-komputer-lokal)
3. [Cara Menambah & Mengganti Foto](#-cara-menambah--mengganti-foto)
4. [Cara Mengatur Caption Foto](#-cara-mengatur-caption-foto)
5. [Cara Mengganti Musik Latar](#-cara-mengganti-musik-latar)
6. [Cara Mengedit Teks Surat, Tanggal, & Pesan Lain](#-cara-mengedit-teks-surat-tanggal--pesan-lain)
7. [Panduan Deployment Gratis (Langkah Demi Langkah)](#-panduan-deployment-gratis-langkah-demi-langkah)
   - [Opsi 1: Netlify Drop (Paling Mudah, Tanpa Coding)](#opsi-1-netlify-drop-paling-mudah--cepat)
   - [Opsi 2: Vercel + GitHub](#opsi-2-vercel--github)
   - [Opsi 3: GitHub Pages](#opsi-3-github-pages)
8. [Cara Mengganti Nama Link Custom (mis. untuk-cia.netlify.app)](#-cara-mengganti-nama-link-custom)
9. [Tips Penting untuk Hari-H (27 Oktober)](#-tips-penting-untuk-hari-h-27-oktober)

---

## 📁 Struktur Folder

```text
MyLove/
├── foto/                      <-- Tempat menyimpan foto asli/mentah (JPG, PNG, WebP)
└── website-patricia/          <-- Folder project website (Vite + React)
    ├── dist/                  <-- Folder hasil build (yang di-upload saat deploy)
    ├── public/
    │   └── music/
    │       └── lagu-kita.mp3  <-- File musik latar (opsional)
    ├── scripts/
    │   └── prepare-photos.mjs <-- Script otomatis proses foto
    ├── src/
    │   ├── assets/
    │   │   └── photos/        <-- Foto yang sudah dioptimasi (foto-01.jpg, dst.)
    │   │       └── thumbs/    <-- Thumbnail foto untuk performa kilat di HP
    │   ├── components/        <-- Komponen (Intro, LoveMeter, Gallery, Letter, Closing, dll)
    │   ├── config.js          <-- PUSAT PENGATURAN (nama, surat, tanggal, caption)
    │   ├── App.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Cara Menjalankan di Komputer (Lokal)

Pastikan di komputermu sudah terpasang **Node.js** (versi 18 ke atas disarankan).

1. Buka terminal / PowerShell.
2. Masuk ke folder project:
   ```bash
   cd c:\MyLove\website-patricia
   ```
3. Install dependencies (hanya perlu sekali di awal):
   ```bash
   npm install
   ```
4. Jalankan server lokal:
   ```bash
   npm run dev
   ```
5. Buka link yang muncul di browser (biasanya `http://localhost:5173`).

---

## 📸 Cara Menambah & Mengganti Foto

Website ini membaca foto secara **otomatis** tanpa kamu perlu mendaftarkan file satu per satu!

1. Siapkan foto-foto momen manismu bersama Cia (format `.jpg`, `.jpeg`, `.png`, atau `.webp`).
2. Taruh file foto tersebut ke dalam folder:
   ```text
   MyLove/foto/
   ```
3. Buka terminal di folder `website-patricia` dan jalankan:
   ```bash
   npm run prepare:photos
   ```
   **Apa yang dilakukan script ini secara otomatis?**
   - Mendeteksi orientasi EXIF dan memutar foto ke orientasi yang benar (auto-rotate).
   - Mengurutkan foto secara kronologis berdasarkan tanggal pengambilan (EXIF) atau nama file.
   - Mengubah ukuran sisi terpanjang maksimal 1600px dan mengompres ke ukuran ideal (±100–300 KB) tanpa mengurangi kejernihan visual.
   - Menyimpan foto ke `src/assets/photos/foto-01.jpg`, `foto-02.jpg`, dst.
   - Membuat thumbnail cepat di `src/assets/photos/thumbs/` agar galeri terbuka instan di smartphone.
4. Buat build baru untuk menerapkan foto:
   ```bash
   npm run build
   ```

> ⚠️ **Catatan Format HEIC/HEIF:**
> Jika foto diambil dari iPhone dengan format bawaan `.heic`, konversikan terlebih dahulu ke `.jpg` di iPhone atau lewat situs online (seperti heictojpg.com), lalu letakkan di folder `MyLove/foto/`.
>
> 💡 **Jika folder `MyLove/foto/` kosong:**
> Website tidak akan rusak/crash! Galeri akan otomatis menampilkan kartu ucapan estetis dengan ornamen bunga sakura (*"Foto-foto kita akan tampil di sini 📸"*).

---

## 💬 Cara Mengatur Caption Foto

Setiap foto di galeri menampilkan bingkai ala Polaroid dengan tulisan tangan (*Dancing Script*).

1. Buka file `src/config.js`.
2. Temukan bagian `photoCaptions`:
   ```javascript
   photoCaptions: {
     "foto-01.jpg": "Pertama kali kita ketemu di kampus Tarumanagara ✨",
     "foto-02.jpg": "Senyum manis favoritku selamanya 💕",
     "foto-03.jpg": "Momen sederhana yang selalu bikin kangen 🌸",
     "foto-04.jpg": "Waktu kamu manja dan selalu minta ditemani 🥰",
   },
   ```
3. Kamu bisa mengisi atau mengubah caption untuk masing-masing foto (`foto-01.jpg`, `foto-02.jpg`, dst.).
4. **Jika foto tidak diberi caption:** Website sudah menyediakan 20 variasi caption manis secara acak/bergantian otomatis, jadi tidak akan pernah kosong atau menampilkan teks aneh!

---

## 🎵 Cara Mengganti Musik Latar

Website dilengkapi pemutar musik mengambang di pojok kanan atas berdesain vinyl berputar yang estetik.

1. Siapkan file lagu kesukaan kalian berdua dalam format MP3.
2. Beri nama file: `lagu-kita.mp3`.
3. Letakkan file tersebut di:
   ```text
   c:\MyLove\website-patricia\public\music\lagu-kita.mp3
   ```
4. Jika ingin mengatur volume awal, buka `src/config.js` dan ubah:
   ```javascript
   musicVolume: 0.5, // 0.0 (hening) sampai 1.0 (maksimal)
   ```

> 💡 **Jika belum ada file musik:**
> Website tetap berjalan normal tanpa error. Ikon musik di pojok kanan atas akan tetap rapi dan tidak akan memunculkan pesan error apapun di layar Cia.

---

## ✏️ Cara Mengedit Teks Surat, Tanggal, & Pesan Lain

Semua teks dapat diubah hanya dengan mengedit satu file saja: `src/config.js`.

- **Tanggal Jadian**:
  ```javascript
  anniversaryDate: "2026-10-01", // Format: YYYY-MM-DD
  ```
  *(Counter hari di halaman penutup akan menghitung otomatis hari kebersamaan kalian berdasarkan zona waktu Jakarta).*
- **Nama & Panggilan**:
  ```javascript
  senderName: "Elvan",
  recipientName: "Patricia",
  nickname: "Cia",
  ```
- **Teks Surat Cinta**:
  Edit isi di dalam bagian `letterText: \`...\``. Pisahkan paragraf dengan 2x enter (baris kosong). Animasi pembukaan amplop dan kemunculan teks paragraf per paragraf akan menyesuaikan secara otomatis.

---

## 🌐 Panduan Deployment Gratis (Langkah Demi Langkah)

Setelah selesai mengedit dan mengetes, compile website menjadi file siap pakai dengan perintah:
```bash
npm run build
```
File siap saji akan berada di folder `website-patricia/dist/`.

---

### OPSI 1: Netlify Drop (Paling Mudah & Cepat)
*Tidak perlu install aplikasi tambahan, selesai dalam 1 menit!*

1. Buka browser dan kunjungi: **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Login atau daftar akun Netlify gratis (bisa menggunakan akun Google / GitHub).
3. Seret (drag and drop) seluruh folder **`website-patricia/dist`** ke area kotak yang ada di layar browser Netlify Drop.
4. Tunggu beberapa detik hingga proses upload selesai.
5. Website kamu langsung online dan Netlify akan memberikan link aktif!

---

### OPSI 2: Vercel + GitHub
1. Buat repository baru di akun GitHub milikmu (misalnya `website-patricia`).
2. Di terminal folder `website-patricia`, push repository ke GitHub:
   ```bash
   git remote add origin https://github.com/USERNAME_KAMU/website-patricia.git
   git branch -M main
   git push -u origin main
   ```
3. Buka **[vercel.com](https://vercel.com)** dan login dengan GitHub.
4. Klik **"Add New"** > **"Project"**, lalu pilih repository `website-patricia`.
5. Klik **"Deploy"**. Vercel akan otomatis mendeteksi framework Vite dan menyelesaikan build dalam ~30 detik.

---

### OPSI 3: GitHub Pages
1. Pastikan project sudah di-push ke repository GitHub.
2. Pasang package `gh-pages` jika diinginkan:
   ```bash
   npm install -D gh-pages
   ```
3. Tambahkan script deploy di `package.json`:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```
4. Jalankan:
   ```bash
   npm run deploy
   ```
5. Buka pengaturan Repository di GitHub > **Settings** > **Pages**, pilih source branch `gh-pages`.

---

## 🔗 Cara Mengganti Nama Link Custom

Agar link terlihat romantis dan mudah diingat saat dikirimkan ke Cia:

### Di Netlify:
1. Masuk ke dashboard Netlify dan klik websitemu.
2. Pilih menu **"Site configuration"** (atau **"Site settings"**).
3. Klik tombol **"Change site name"**.
4. Masukkan nama pilihanmu, misalnya:
   - `untuk-cia`  → link menjadi: `https://untuk-cia.netlify.app`
   - `spesial-untuk-cia` → link menjadi: `https://spesial-untuk-cia.netlify.app`
   - `hbd-cia` → link menjadi: `https://hbd-cia.netlify.app`
5. Klik **Save**. Link baru langsung aktif!

### Di Vercel:
1. Masuk ke dashboard project di Vercel.
2. Pilih tab **Settings** > **Domains**.
3. Klik **Edit** pada domain bawaan atau tambahkan nama domain baru berakhiran `.vercel.app`.

---

## 💡 Tips Penting untuk Hari-H (27 Oktober)

1. **Uji Coba di HP Sendiri Terlebih Dahulu**:
   - Buka link deploy dari HP-mu (Safari di iOS / Chrome di Android).
   - Pastikan teks, animasi amplop, dan slider love meter berjalan mulus.
2. **Aturan Autoplay Audio di Smartphone**:
   - Browser modern di HP (terutama Safari iPhone) memblokir musik yang berputar otomatis sebelum ada sentuhan layar.
   - Website ini sudah dirancang pintar: layar pertama adalah **"Ada sesuatu spesial untuk Cia 💌"** dengan tombol **"Buka Hadiah"**. Saat Cia menekan tombol ini, musik latar otomatis mulai diputar tanpa terblokir.
3. **Kirim Tepat Waktu**:
   - Kirimkan link website tepat jam 00:00 tanggal 27 Oktober lewat WhatsApp.
   - Saat link dibagikan di WhatsApp, preview chat akan otomatis menampilkan judul *"Untuk Cia 💖"* beserta deskripsi manis yang sudah diatur dalam Open Graph tags.
4. **Easter Egg Cinta**:
   - Saat Cia menggeser slider Love Meter ke 100% dan menahannya selama 3 detik, angka persen akan meledak menjadi **"1000% 💯"** dengan semburan confetti meriah!

---

*Dibuat dengan segenap cinta untuk Patricia. Selamat Ulang Tahun, Cia! 🎂🌹*
