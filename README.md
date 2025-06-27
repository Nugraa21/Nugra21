# info ?

| No | Klausa ISO/IEC 27001:2022 | Domain                     | Fokus Audit                           | Pertanyaan Audit                                            |
| -- | ------------------------- | -------------------------- | ------------------------------------- | ----------------------------------------------------------- |
| 1  | A.5.9                     | Keamanan Akses             | Penggunaan akun unik per staf         | Apakah setiap staf memiliki akun login masing-masing?       |
| 2  | A.5.13                    | Manajemen Password         | Kompleksitas dan pergantian password  | Seberapa sering password diubah?                            |
| 3  | A.5.20                    | Keamanan Data              | Perlindungan nomor HP pelanggan       | Apakah data pelanggan disimpan dalam bentuk terenkripsi?    |
| 4  | A.5.30                    | Keamanan Jaringan          | Pemisahan jaringan staf dan pelanggan | Apakah jaringan Wi-Fi pelanggan dipisah dari jaringan staf? |
| 5  | A.5.23                    | Logging & Monitoring       | Logging transaksi & login pengguna    | Apakah aktivitas login pengguna dicatat?                    |
| 6  | A.5.9.2                   | Inventarisasi Aset         | Dokumentasi perangkat POS & Wi-Fi     | Apakah ada dokumentasi aset seperti router dan POS?         |
| 7  | A.5.32                    | Backup                     | Backup rutin dan otomatis sistem POS  | Apakah sistem POS dibackup secara rutin dan otomatis?       |
| 8  | A.6.3                     | Awareness (Kesadaran Staf) | Pelatihan keamanan informasi          | Apakah staf sudah mendapat pelatihan keamanan informasi?    |

Bagus! Dari dokumen **"AUDIT KAFE MAIN-MAIN"**, sudah ada penjelasan soal klausa ISO, temuan, dan ruang lingkup audit. Sekarang kamu tinggal menambahkan **3 tabel penting** yang diminta dosen, yaitu:

---

### 📋 **1. Tabel Klausa ISO/IEC 27001:2022**

| No | Klausa ISO/IEC 27001:2022 | Deskripsi Singkat                  | Temuan di Cafe Main-Main                        |
| -- | ------------------------- | ---------------------------------- | ----------------------------------------------- |
| 1  | A.5.9                     | Penggunaan Akun Pengguna           | Semua staf menggunakan satu akun login bersama. |
| 2  | A.5.13                    | Pengelolaan Autentikasi (Password) | Password tidak pernah diganti sejak dipasang.   |
| 3  | A.5.20                    | Perlindungan Informasi Pelanggan   | Nomor HP pelanggan sudah dienkripsi.            |
| 4  | A.5.23                    | Logging dan Monitoring             | Transaksi tercatat, tapi login tidak dicatat.   |
| 5  | A.5.30                    | Segmentasi Jaringan                | Wi-Fi pelanggan dan staf masih satu jaringan.   |
| 6  | A.5.9.2                   | Inventarisasi Aset Informasi       | Belum ada dokumentasi perangkat.                |
| 7  | A.5.32                    | Pengelolaan Backup                 | Tidak ada sistem backup otomatis.               |
| 8  | A.6.3                     | Kesadaran Keamanan Informasi       | Belum ada pelatihan keamanan untuk staf.        |

---

### 🔍 **2. Tabel Fokus Audit**

| No | Domain               | Subdomain               | Fokus Audit                           | Temuan                                   |
| -- | -------------------- | ----------------------- | ------------------------------------- | ---------------------------------------- |
| 1  | Keamanan Akses       | Akun pengguna           | Penggunaan akun unik per staf         | Semua staf menggunakan satu akun bersama |
| 2  | Manajemen Password   | Password kasir          | Kompleksitas dan pergantian password  | Password kuat tapi tidak pernah diganti  |
| 3  | Keamanan Data        | Enkripsi data pelanggan | Perlindungan nomor HP pelanggan       | Sudah terenkripsi                        |
| 4  | Keamanan Jaringan    | Segmentasi Wi-Fi        | Pemisahan jaringan staf dan pelanggan | Masih satu jaringan                      |
| 5  | Logging & Monitoring | Audit trail             | Logging transaksi & login pengguna    | Transaksi tercatat, login belum          |
| 6  | Inventarisasi Aset   | Perangkat POS & Wi-Fi   | Dokumentasi aset informasi            | Belum terdokumentasi                     |
| 7  | Backup & Recovery    | Backup sistem POS       | Backup rutin dan otomatis             | Tidak tersedia                           |
| 8  | Awareness            | Edukasi staf            | Pelatihan keamanan informasi          | Belum dilakukan                          |

---

### ❓ **3. Tabel Pertanyaan Audit**

| No | Pertanyaan Audit                                            | Tujuan                        | Domain Terkait       |
| -- | ----------------------------------------------------------- | ----------------------------- | -------------------- |
| 1  | Apakah setiap staf memiliki akun login masing-masing?       | Menilai akuntabilitas         | Keamanan Akses       |
| 2  | Seberapa sering password diubah?                            | Evaluasi keamanan autentikasi | Manajemen Password   |
| 3  | Apakah data pelanggan disimpan dalam bentuk terenkripsi?    | Menilai keamanan data         | Keamanan Data        |
| 4  | Apakah jaringan Wi-Fi pelanggan dipisah dari jaringan staf? | Evaluasi segmentasi jaringan  | Keamanan Jaringan    |
| 5  | Apakah aktivitas login pengguna dicatat?                    | Menilai sistem logging        | Logging & Monitoring |
| 6  | Apakah ada dokumentasi aset seperti router dan POS?         | Menilai inventarisasi aset    | Inventarisasi Aset   |
| 7  | Apakah sistem POS dibackup secara rutin dan otomatis?       | Menilai kesiapan pemulihan    | Backup               |
| 8  | Apakah staf sudah mendapat pelatihan keamanan informasi?    | Menilai kesadaran staf        | Awareness            |
 
---               
                             
                                # 📋 Daftar Pertanyaan Audit ISO/IEC 27001:2022 (Format Markdown)

Berikut ini adalah contoh-contoh pertanyaan audit berdasarkan kontrol ISO/IEC 27001:2022. Format ini dapat digunakan untuk keperluan asesmen internal atau eksternal.

---

## 🛡️ A.5.9 Penggunaan Informasi
- Apakah setiap staf memiliki akun login masing-masing dan tidak saling berbagi akun?
- Apakah ada kebijakan tertulis tentang penggunaan informasi hanya untuk keperluan pekerjaan?
- Apakah sistem memonitor aktivitas pengguna untuk mendeteksi penyalahgunaan informasi?

## 🗂️ A.5.9.2 Inventaris Aset Informasi
- Apakah ada dokumentasi aset seperti router, switch, dan sistem POS?
- Apakah setiap aset memiliki penanggung jawab yang ditetapkan?
- Apakah inventaris aset diperbarui secara berkala?

## 🔐 A.5.13 Manajemen Kredensial
- Seberapa sering password pengguna diwajibkan untuk diubah?
- Apakah password disimpan dalam bentuk terenkripsi?
- Apakah terdapat kebijakan reset password yang aman?

## 🛡️ A.5.20 Perlindungan Informasi
- Apakah data pelanggan disimpan dalam bentuk terenkripsi?
- Apakah komunikasi antar sistem menggunakan protokol aman (misal HTTPS/TLS)?
- Apakah backup juga dilindungi dengan enkripsi?

## 🌐 A.5.30 Keamanan Jaringan
- Apakah jaringan Wi-Fi pelanggan dipisah dari jaringan staf?
- Apakah firewall diterapkan untuk membatasi lalu lintas jaringan?
- Apakah ada IDS/IPS yang aktif memonitor jaringan?

## 📝 A.5.23 Pencatatan Aktivitas
- Apakah aktivitas login pengguna dicatat secara otomatis?
- Apakah log mencatat percobaan akses yang gagal?
- Apakah log tidak dapat diubah oleh pengguna biasa?

## 💾 A.5.32 Backup Informasi
- Apakah sistem POS dibackup secara rutin dan otomatis?
- Apakah hasil backup diuji secara berkala?
- Apakah ada kebijakan retensi data backup?

## 👩‍🏫 A.6.3 Pelatihan & Kesadaran Keamanan Informasi
- Apakah staf sudah mendapat pelatihan keamanan informasi?
- Apakah pelatihan dilakukan secara berkala?
- Apakah pemahaman staf dievaluasi setelah pelatihan?

---

Kamu bisa menambahkan checklist ✅ atau ❌ setelah setiap pertanyaan sesuai hasil audit lapangan.

Jika kamu ingin meng-export ini ke Excel/Google Sheet atau ingin versi yang dapat diisi langsung oleh auditor, beri tahu saya!
           