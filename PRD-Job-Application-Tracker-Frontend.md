# Product Requirements Document (PRD) — Frontend

## Job Application Tracker (Vue 3 Single Page Application)

|                  |                                |
| ---------------- | ------------------------------ |
| **Author**       | Gana Purba Kusuma              |
| **Status**       | Ready for Frontend Development |
| **Version**      | 1.1 (Frontend)                 |
| **Last Updated** | August 2026                    |

---

## 1. Overview & Objectives

### 1.1 Goal

Membangun antarmuka pengguna berbasis Single Page Application yang modern, intuitif, dan responsif menggunakan Vue 3 (Composition API), dengan pendekatan mobile first. Aplikasi ini terhubung langsung ke RESTful API Backend Laravel yang sudah selesai dikerjakan dan siap di-deploy.

### 1.2 Target User dan Kebutuhan Portfolio

- **Personal User**: pemilik aplikasi yang mengelola lamaran kerjanya secara harian.
- **Recruiter / Portfolio Visitor**: pengunjung portfolio yang dapat mencoba aplikasi menggunakan Akun Demo (1 Click Demo Login) tanpa perlu mendaftar dari awal.

---

## 2. Tech Stack & Architecture (Frontend)

| Layer                | Teknologi / Library                      | Deskripsi                                                             |
| -------------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| **Framework**        | Vue 3 (`<script setup>` Composition API) | Standard Vue 3 modern                                                 |
| **Build Tool**       | Vite                                     | Build tool berkecepatan tinggi                                        |
| **Styling**          | Tailwind CSS                             | Utility first CSS, mendukung custom color token dan mode gelap/terang |
| **State Management** | Pinia                                    | Mengelola auth state, preferensi tema, dan cached reference data      |
| **Routing**          | Vue Router (HTML5 History)               | Client side routing dengan Navigation Guards                          |
| **HTTP Client**      | Axios                                    | Request/Response Interceptor dengan Bearer Token                      |
| **Charts**           | Chart.js dengan vue chartjs              | Visualisasi statistik breakdown dashboard                             |
| **Icons**            | Lucide Icons                             | Digunakan juga untuk ikon toggle dark/light mode                      |

---

## 3. UI/UX Design Guidelines

### 3.1 Color Palette

Aplikasi menggunakan palet warna kustom berikut sebagai identitas visual utama. **Gradasi biru dan ungu generik tidak digunakan** — seluruh aksen warna mengacu pada 4 warna ini.

| Token           | Hex       | Penggunaan                                                                   |
| --------------- | --------- | ---------------------------------------------------------------------------- |
| `primary-dark`  | `#224248` | Warna dasar utama, background mode gelap, teks pada mode terang              |
| `primary`       | `#325E6A` | Warna sekunder, sidebar/navbar, elemen struktural                            |
| `accent-teal`   | `#44A1A4` | Warna aksen utama, tombol primer, link aktif, elemen interaktif              |
| `accent-orange` | `#FF9A00` | Warna aksen kontras, badge status penting, tombol call to action, notifikasi |

Palet ini didefinisikan sebagai custom color token di `tailwind.config.js`, bukan warna Tailwind bawaan, supaya konsisten di seluruh komponen.

### 3.2 Mode Gelap dan Terang

| ID        | Requirement          | Deskripsi                                                                                                                             |
| --------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| FR-FE-0.1 | Toggle Theme         | Tombol ikon (matahari/bulan) di Navbar untuk beralih antara mode terang dan gelap                                                     |
| FR-FE-0.2 | Preferensi Tersimpan | Pilihan tema disimpan di `localStorage`, tetap aktif saat halaman di-refresh atau dibuka ulang                                        |
| FR-FE-0.3 | Deteksi Sistem       | Saat pertama kali dibuka (belum ada preferensi tersimpan), tema mengikuti pengaturan sistem operasi pengguna (`prefers-color-scheme`) |
| FR-FE-0.4 | Transisi Halus       | Perubahan antar mode disertai transisi warna yang halus, tidak berkedip                                                               |

### 3.3 Estetika Umum

- Desain bersih dengan micro animation halus: hover effect, transisi lembut, modal dengan backdrop blur.
- Badge warna status bersifat dinamis sesuai data dari API (`status.color`), tetap diselaraskan dengan palet utama di atas.
- Penulisan UI (label tombol, judul, pesan) menggunakan kalimat penuh dan jelas, menghindari pemakaian tanda pisah yang berlebihan.

### 3.4 Responsivitas: Mobile First

- Seluruh komponen dirancang dan diuji terlebih dahulu untuk layar mobile (mulai 320px), baru diperluas ke tablet dan desktop menggunakan breakpoint Tailwind (`sm`, `md`, `lg`, `xl`).
- Navigasi utama berbentuk hamburger drawer di mobile, berubah menjadi navbar horizontal penuh di layar tablet ke atas.
- Grid card menyesuaikan jumlah kolom secara otomatis: 1 kolom di mobile, 2 kolom di tablet, 3 sampai 4 kolom di desktop.
- Elemen interaktif (tombol, input, dropdown) memiliki ukuran sentuh yang nyaman untuk layar sentuh, minimal 44x44 piksel.
- Kelengkapan status komponen: loading skeleton, empty state, dan error toast notification, semua responsif di setiap ukuran layar.

---

## 4. Functional Requirements (Frontend Features)

### 4.1 Autentikasi & Session Management (`/login`, `/register`)

| ID        | Requirement           | Deskripsi                                                                                                                                  |
| --------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-FE-1.1 | Halaman Login         | Form email dan password dengan validasi error inline, serta tombol 1 Click Demo Login                                                      |
| FR-FE-1.2 | Halaman Register      | Form registrasi user baru dengan validasi konfirmasi password                                                                              |
| FR-FE-1.3 | Token Persistence     | Menyimpan token Sanctum di `localStorage` dan disinkronkan ke Pinia `authStore`                                                            |
| FR-FE-1.4 | Auth Navigation Guard | Proteksi route otomatis. User yang belum login diarahkan ke `/login`. User yang sudah login dan membuka `/login` diarahkan ke `/dashboard` |
| FR-FE-1.5 | Logout Action         | Menghapus token dari `localStorage`, mereset Pinia store, lalu redirect ke `/login`                                                        |

### 4.2 Dashboard Analytics (`/dashboard`)

| ID        | Requirement              | Deskripsi                                                                   |
| --------- | ------------------------ | --------------------------------------------------------------------------- |
| FR-FE-2.1 | Summary Cards            | Kartu indikator KPI untuk Total Applications dan Response Rate dalam persen |
| FR-FE-2.2 | Status Breakdown Chart   | Doughnut Chart menampilkan jumlah lamaran berdasarkan status                |
| FR-FE-2.3 | Platform Breakdown Chart | Bar Chart menampilkan jumlah lamaran berdasarkan platform                   |
| FR-FE-2.4 | Quick Action             | Tombol pintas Tambah Lamaran langsung dari dashboard                        |

### 4.3 Manajemen Lamaran, Tampilan Daftar (`/job-applications`)

| ID        | Requirement       | Deskripsi                                                                                                       |
| --------- | ----------------- | --------------------------------------------------------------------------------------------------------------- |
| FR-FE-3.1 | Card Layout Grid  | Seluruh lamaran ditampilkan dalam grid card modern, bukan tabel                                                 |
| FR-FE-3.2 | Card Badge & Info | Setiap card menampilkan nama perusahaan, posisi, badge warna status terkini, nama platform, dan tanggal lamaran |
| FR-FE-3.3 | Filter Bar        | Dropdown filter berdasarkan status, dropdown filter berdasarkan platform, dan input pencarian kata kunci        |
| FR-FE-3.4 | Sorting           | Opsi urutkan berdasarkan tanggal terbaru atau terlama                                                           |
| FR-FE-3.5 | Empty State       | Tampilan ilustrasi bersih saat data lamaran kosong atau hasil filter tidak ditemukan                            |

### 4.4 Detail Lamaran & Timeline Visual (`/job-applications/:id`)

| ID        | Requirement          | Deskripsi                                                                                                                               |
| --------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| FR-FE-4.1 | Detail Header & Info | Informasi lengkap perusahaan, posisi, link lowongan yang dapat diklik, dan catatan awal                                                 |
| FR-FE-4.2 | Timeline Visual      | Komponen timeline kronologis vertikal menampilkan setiap perubahan status lengkap dengan tanggal, nama status, badge warna, dan catatan |
| FR-FE-4.3 | Quick Update Status  | Tombol Update Status untuk membuka modal penambahan riwayat status baru                                                                 |
| FR-FE-4.4 | Edit & Delete Modal  | Modal konfirmasi untuk mengedit data lamaran atau menghapusnya                                                                          |

---

## 5. Component Architecture Breakdown

```text
src/
├── assets/                  Main CSS, Tailwind config dengan custom color token, images
├── components/
│   ├── common/
│   │   ├── Navbar.vue       Header navigasi, profil user, tombol logout
│   │   ├── ThemeToggle.vue  Tombol ikon untuk beralih mode gelap/terang
│   │   ├── Badge.vue        Komponen badge warna dinamis
│   │   ├── Modal.vue        Modal dialog yang dapat dipakai ulang
│   │   ├── Button.vue       Tombol primary, secondary, danger dengan status loading
│   │   ├── Skeleton.vue     Kartu loading skeleton
│   │   └── Toast.vue        Notifikasi toast
│   ├── dashboard/
│   │   ├── StatCard.vue     Kartu ringkasan KPI
│   │   ├── StatusChart.vue  Doughnut chart untuk status
│   │   └── PlatformChart.vue  Bar chart untuk platform
│   └── applications/
│       ├── JobCard.vue      Kartu lamaran individual
│       ├── FilterBar.vue    Kontrol pencarian dan filter
│       ├── Timeline.vue     Timeline vertikal riwayat status
│       ├── JobFormModal.vue Modal tambah/edit lamaran
│       └── HistoryModal.vue Modal tambah riwayat status
├── services/
│   ├── api.js               Instance Axios dengan base URL dan auth interceptor
│   ├── authService.js       Request API terkait autentikasi
│   ├── jobService.js        Request API terkait lamaran kerja
│   └── referenceService.js  Request API status dan platform
├── stores/
│   ├── authStore.js         Pinia store untuk user dan token
│   ├── jobStore.js          Pinia store untuk data lamaran dan filter
│   ├── referenceStore.js    Pinia store untuk cache status dan platform
│   └── themeStore.js        Pinia store untuk preferensi mode gelap/terang
├── router/
│   └── index.js             Definisi route dan navigation guard
└── views/
    ├── LoginView.vue
    ├── RegisterView.vue
    ├── DashboardView.vue
    ├── JobListView.vue
    ├── JobDetailView.vue
    └── NotFoundView.vue
```

---

## 6. API Integration Contract (Axios Service)

- **Base URL**: `import.meta.env.VITE_API_BASE_URL`, mengarah ke backend yang sudah selesai dikerjakan.
- **Request Interceptor**: otomatis menyisipkan `Authorization: Bearer <token>` di setiap HTTP request jika token tersedia di `localStorage`.
- **Response Interceptor**: menangkap status HTTP 401 Unauthorized, lalu otomatis menghapus token dan mengarahkan user ke `/login`.

---

## 7. Milestones & Frontend Implementation Plan

| Milestone                  | Deliverables                                                                                                                 |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| M1: Setup Project & Tema   | Inisialisasi Vite, Vue 3, Tailwind CSS dengan custom color token, Vue Router, Pinia, Axios, serta ThemeStore dan ThemeToggle |
| M2: Auth Module            | Pinia Auth Store, Login View, Register View, Navigation Guards                                                               |
| M3: Reference & List View  | Reference Store, Job List View berbentuk card, pencarian, filter, dan sorting                                                |
| M4: Form & CRUD            | JobFormModal untuk tambah dan edit, modal konfirmasi hapus                                                                   |
| M5: Detail View & Timeline | Job Detail View, Timeline visual interaktif, HistoryModal                                                                    |
| M6: Dashboard & Chart      | Dashboard Analytics, integrasi Chart.js                                                                                      |
| M7: Polish & Deployment    | Pemolesan UI, pemeriksaan responsif mobile first, verifikasi mode gelap/terang, deploy                                       |

---

## 8. Success Criteria

- [ ] UI responsif dengan pendekatan mobile first, bersih, dan konsisten memakai palet warna kustom (`#224248`, `#325E6A`, `#44A1A4`, `#FF9A00`) tanpa gradasi biru atau ungu generik.
- [ ] Toggle mode gelap dan terang berfungsi, tersimpan sebagai preferensi, dan bertransisi dengan halus.
- [ ] Tombol 1 Click Demo Login bekerja secara instan untuk kemudahan penguji atau recruiter.
- [ ] Seluruh data status terhubung ke badge warna dinamis sesuai API.
- [ ] Timeline visual riwayat status terupdate otomatis saat status baru ditambahkan.
- [ ] Grafik Chart.js tampil responsif dan akurat sesuai data API Dashboard.
- [ ] Aplikasi ter-deploy tanpa error routing pada Single Page Application.
