# Panduan Kitab Suci Tim TiketKita (Edisi Spesial Sistem Basis Data)

Halo tim! Dokumen ini adalah panduan paling lengkap (ultra-detailed) untuk memahami backend **TiketKita**. Dokumen ini dibuat khusus untuk membantu kalian menghadapi ujian atau presentasi mata kuliah **Sistem Basis Data**. Kita tidak menggunakan ORM (seperti Prisma atau Sequelize) agar kalian bisa belajar bagaimana query SQL murni bekerja dalam sebuah aplikasi nyata.

Dokumen ini akan menjelaskan setiap baris query, logika di baliknya, dan konsep database tingkat lanjut yang kita terapkan.

---

## Bagian 1: Cara Setup dan Menjalankan Project

Sebelum kita masuk ke "jeroan" SQL, pastikan aplikasi sudah menyala di laptop kalian.

### 1.1 Persiapan Software
*   **Node.js (v22+)**: Lingkungan untuk menjalankan kode TypeScript/JavaScript.
*   **pnpm**: Package manager yang jauh lebih efisien.
*   **Docker Desktop**: Wajib ada untuk menyalakan MySQL dan phpMyAdmin dengan satu perintah.

### 1.2 Langkah Running (Cepat & Mudah)
1.  **Install Dependencies**:
    ```bash
    pnpm install
    ```
2.  **Environment Setup**:
    Salin file `.env.example` menjadi `.env`. File ini berisi rahasia dapur kita (password DB, secret key, dll).
3.  **Docker Up**:
    ```bash
    docker-compose up -d
    ```
    - **MySQL (Port 3306)**: Gudang data utama kita.
    - **phpMyAdmin (Port 8080)**: Alat visual untuk kalian ngintip isi tabel. Buka `http://localhost:8080`.
4.  **Migrasi & Seed**:
    ```bash
    pnpm migrate
    ```
    Ini akan menjalankan script di folder `src/migrations/` untuk membuat tabel dan mengisi data awal agar aplikasi tidak kosong.
5.  **Jalankan Aplikasi**:
    ```bash
    pnpm dev
    ```

---

## Bagian 2: Arsitektur Kode (Layered Architecture)

Kita menggunakan pola **Controller -> Service -> Repository**. Ini adalah standar industri agar kode rapi dan mudah diuji.

1.  **Controller (Pelayan)**: Hanya bertugas menerima *Request* dan mengirim *Response*. Tidak boleh ada query SQL di sini!
2.  **Service (Koki)**: Tempat logika bisnis. Dia yang memutuskan apakah user boleh beli tiket atau tidak. Dia juga yang mengelola **Transaksi (BEGIN/COMMIT)**.
3.  **Repository (Staf Gudang)**: Ini adalah tempat berkumpulnya query SQL murni. Tugasnya hanya ambil data dari DB atau simpan ke DB.
4.  **Database (MySQL)**: Penyimpanan data permanen.

---

## Bagian 3: Struktur Database & ERD

Kita menggunakan **UUID (CHAR 36)** untuk semua ID. Kelebihannya: lebih aman (hacker tidak bisa menebak ID 1, 2, 3) dan mudah digabung jika nanti kita punya banyak server database.

### 3.1 ERD Sederhana
```text
[users] 1 --- N [orders]
[categories] 1 --- N [events]
[venues] 1 --- N [events]
[events] 1 --- N [ticket_types]
[ticket_types] 1 --- N [order_items]
[orders] 1 --- N [order_items]
[orders] 1 --- 1 [payments]
[payment_methods] 1 --- N [payments]
[promo_codes] 1 --- N [orders]
```

### 3.2 Detail Skema Database (DDL)
Bagi yang ingin tahu bagaimana tabel-tabel ini dibuat, berikut adalah perintah `CREATE TABLE` yang kita gunakan di dalam kode migrasi kita:

**Tabel Users:**
```sql
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  fullname VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  is_verified TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Tabel Events:**
```sql
CREATE TABLE events (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  category_id CHAR(36) NOT NULL,
  venue_id CHAR(36) NOT NULL,
  date_start DATETIME NOT NULL,
  date_end DATETIME NOT NULL,
  status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'draft',
  poster_url VARCHAR(500) NULL,
  created_by CHAR(36) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (venue_id) REFERENCES venues(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

**Tabel Orders:**
```sql
CREATE TABLE orders (
  id CHAR(36) PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  user_id CHAR(36) NOT NULL,
  promo_id CHAR(36) NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  discount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  admin_fee DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(12,2) NOT NULL,
  status ENUM('pending', 'waiting_payment', 'paid', 'cancelled', 'expired') DEFAULT 'pending',
  expired_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (promo_id) REFERENCES promo_codes(id)
);
```

### 3.3 Kenapa Pakai UUID (CHAR 36)?
Kita tidak menggunakan `INT AUTO_INCREMENT`. Kenapa?
1.  **Keamanan**: Jika ID user adalah `1`, orang bisa menebak ID user berikutnya adalah `2`. Dengan UUID (`550e8400-e29b-41d4-a716-446655440000`), tidak ada yang bisa menebak.
2.  **Skalabilitas**: Jika suatu saat kita menggabungkan dua database dari server yang berbeda, ID UUID dijamin tidak akan bentrok (collision).
3.  **Offline Generation**: Kita bisa membuat ID di sisi aplikasi (backend) sebelum data benar-benar dimasukkan ke database.

### 3.4 Aturan Penamaan & Konvensi
Untuk konsistensi, kita mengikuti beberapa aturan penamaan di database:
1.  **Snake Case**: Semua nama tabel dan kolom menggunakan huruf kecil dengan garis bawah (contoh: `ticket_types`, bukan `ticketTypes`).
2.  **Plural**: Nama tabel selalu jamak (contoh: `users`, `orders`).
3.  **Audit Columns**: Setiap tabel wajib memiliki `created_at` (kapan data dibuat) dan `updated_at` (kapan terakhir diubah).
4.  **Prefix ID**: Meskipun kolomnya bernama `id`, di sisi kode kita sering menyebutnya `userId` atau `orderId` agar tidak bingung.

---

## Bagian 4: Cara Kerja Migrasi (Version Control untuk DB)

Pernah kepikiran nggak, gimana caranya kita bertiga punya struktur database yang sama persis tanpa perlu kirim file `.sql` manual?
- **Migrasi**: Kita menulis struktur tabel di file TypeScript di folder `src/migrations/`.
- **Runner**: Saat kalian ketik `pnpm migrate`, script `runner.ts` akan:
  1.  Cek tabel `_migrations` di database.
  2.  Cari file migrasi mana yang belum pernah dijalankan.
  3.  Jalankan perintah SQL `CREATE TABLE` di file tersebut.
  4.  Catat nama file tersebut ke tabel `_migrations` supaya tidak dijalankan dua kali.
**Ini sangat penting** agar database kita selalu sinkron di laptop siapa pun.

---

## Bagian 5: Bedah Detail Query SQL (Per Modul)

Meskipun terlihat sederhana, ada proses database yang penting di sini.

### 4.1 Registrasi User Baru
1.  **Cek Duplikasi Email**:
    ```sql
    SELECT id FROM users WHERE email = ?;
    ```
    Jika ada hasilnya, server kirim error "Email sudah terdaftar".
2.  **Simpan Data**:
    ```sql
    INSERT INTO users (id, fullname, email, password_hash, role) 
    VALUES (?, ?, ?, ?, 'user');
    ```
    *Password di-hash dulu menggunakan library bcrypt sebelum masuk ke kolom `password_hash`.*

### 4.2 Login User
1.  **Ambil Data User**:
    ```sql
    SELECT * FROM users WHERE email = ?;
    ```
2.  **Verifikasi**: Server membandingkan password input dengan `password_hash` dari DB. Jika cocok, server memberikan token JWT.

---

## Bagian 4: Penjelasan Query SQL (Detil Per Modul)

Ini adalah bagian paling penting. Kita akan membedah query-query nyata yang ada di file repository kita.

### 4.1 Modul Events (Pencarian & Relasi)

#### A. Mengambil Daftar Event (findAll)
Query ini digunakan untuk menampilkan event di halaman depan dengan filter pencarian dan kategori.

```sql
SELECT 
    e.*, 
    c.name AS category_name, 
    v.name AS venue_name, 
    v.city AS venue_city
FROM events e
JOIN categories c ON c.id = e.category_id
JOIN venues v ON v.id = e.venue_id
WHERE e.status = 'published' 
  AND e.deleted_at IS NULL
  AND e.title LIKE '%Konser%'      -- Dihasilkan dinamis jika ada search
  AND e.category_id = 'uuid-cat'   -- Dihasilkan dinamis jika ada filter
ORDER BY e.date_start ASC
LIMIT 10 OFFSET 0;
```

**Penjelasan Clause:**
*   **SELECT e.\***: Mengambil semua kolom event.
*   **JOIN categories**: Kita butuh nama kategori (misal: "Musik"), bukan cuma ID-nya.
*   **JOIN venues**: Kita butuh info kota dan nama tempat acara.
*   **WHERE e.status = 'published'**: User biasa tidak boleh melihat event yang masih 'draft'.
*   **AND e.deleted_at IS NULL**: Ini adalah **Soft Delete**. Data tidak benar-benar dihapus, tapi hanya ditandai agar tidak muncul di query.
*   **LIMIT & OFFSET**: Untuk **Pagination**. Mencegah server lelet kalau datanya ada ribuan.

#### B. Detail Event & Tiket (findById)
Saat user mengklik salah satu event, kita butuh detail lengkap beserta tipe tiketnya.

```sql
-- Query 1: Ambil info event, kategori, dan tempat
SELECT e.*, c.name AS category_name, v.name AS venue_name, v.city AS venue_city, 
       v.address AS venue_address, v.capacity AS venue_capacity
FROM events e
JOIN categories c ON c.id = e.category_id
JOIN venues v ON v.id = e.venue_id
WHERE e.id = 'target-uuid' AND e.deleted_at IS NULL;

-- Query 2: Ambil semua tipe tiket untuk event ini
SELECT * FROM ticket_types WHERE event_id = 'target-uuid' ORDER BY price ASC;
```

#### C. Update Event (Dinamis)
Kita menggunakan query dinamis agar hanya kolom yang diubah saja yang di-update. Contoh jika hanya ganti judul:
```sql
UPDATE events SET title = 'Judul Baru' WHERE id = 'uuid' AND deleted_at IS NULL;
```

---

### 4.2 Alur Checkout (THE MASTER FLOW)

Inilah mahakarya dari sistem kita. Alur ini menggunakan **DATABASE TRANSACTION** untuk menjamin keamanan data.

#### Langkah 1: Validasi Sebelum Mulai (SELECT)
Sistem mengecek data di memori sementara:
- Apakah tiket ada? (`SELECT * FROM ticket_types WHERE id = ?`)
- Apakah event dipublikasi? (`SELECT * FROM events WHERE id = ? AND status = 'published'`)
- Apakah stok cukup? (`IF available < quantity THEN ERROR`)

#### Langkah 2: Memulai Transaksi
```sql
START TRANSACTION;
```
*Apa gunanya?* Jika komputer mati di Langkah 7, semua data di Langkah 3-6 akan dihapus otomatis oleh MySQL. Data tidak akan "nanggung".

#### Langkah 3: Insert Tabel Orders
```sql
INSERT INTO orders (id, order_number, user_id, promo_id, subtotal, discount, admin_fee, total, status, expired_at)
VALUES ('O-123', 'TK-2025-01', 'U-1', NULL, 500000, 0, 5000, 505000, 'waiting_payment', '2025-05-05 10:15:00');
```
*Data Input*: UUID order, nomor order unik, biaya-biaya, dan waktu kedaluwarsa (15 menit ke depan).

#### Langkah 4: Insert Tabel Order Items (SNAPSHOT PATTERN)
```sql
INSERT INTO order_items (id, order_id, ticket_type_id, ticket_name, ticket_price, quantity, subtotal)
VALUES ('OI-1', 'O-123', 'T-VIP', 'VIP Concert', 500000, 1, 500000);
```
**Mengapa simpan harga & nama tiket di sini?**
Ini disebut **Snapshot Pattern**. Jika besok admin mengubah harga tiket master menjadi 1 juta, riwayat belanja user ini tetap mencatat harga 500rb. Tanpa ini, laporan keuangan kita akan hancur!

#### Langkah 5: Update Stok (RACE CONDITION PROTECTION)
Ini query paling penting untuk kalian jelaskan ke dosen:
```sql
UPDATE ticket_types 
SET available = available - 1 
WHERE id = 'T-VIP' AND available >= 1;
```
**Kenapa ada `AND available >= 1`?**
Jika sisa tiket tinggal 1, dan ada 2 user yang klik "Bayar" di milidetik yang sama:
1. User A masuk, MySQL mengunci baris tiket tersebut.
2. User A sukses (stok jadi 0).
3. User B masuk, tapi karena stok sudah 0, kondisi `available >= 1` **gagal**.
4. Query User B menghasilkan `affectedRows = 0`.
5. Server mendeteksi ini dan melakukan **ROLLBACK**.
*Tanpa proteksi ini, stok tiket bisa jadi minus!*

#### Langkah 6: Insert Tabel Payments
```sql
INSERT INTO payments (id, order_id, payment_method_id, unique_code, total, status)
VALUES ('P-1', 'O-123', 'PM-BCA', 123, 505123, 'pending');
```

#### Langkah 7: Update Kuota Promo (Jika ada)
```sql
UPDATE promo_codes SET used_count = used_count + 1 WHERE id = 'VOUCHER-UUID';
```

#### Langkah 8: Selesai
```sql
COMMIT;
```

---

### 4.3 Alur Konfirmasi Pembayaran

Saat user sudah transfer dan sistem memprosesnya:

```sql
START TRANSACTION;

-- 1. Tandai sukses di tabel payment
UPDATE payments SET status = 'success', paid_at = NOW() WHERE order_id = 'O-123';

-- 2. Ubah status order menjadi 'paid'
UPDATE orders SET status = 'paid' WHERE id = 'O-123';

COMMIT;
```

---

### 4.4 Alur Pembatalan & Kedaluwarsa

Jika order dibatalkan (oleh user atau otomatis karena waktu habis), kita harus mengembalikan stok.

```sql
START TRANSACTION;

-- 1. Set status order jadi 'cancelled' atau 'expired'
UPDATE orders SET status = 'cancelled' WHERE id = 'O-123';

-- 2. Mengembalikan stok tiket menggunakan JOIN UPDATE (Efisiensi Tinggi!)
UPDATE ticket_types tt
JOIN order_items oi ON oi.ticket_type_id = tt.id
SET tt.available = tt.available + oi.quantity
WHERE oi.order_id = 'O-123';

-- 3. Mengembalikan kuota promo (jika pakai)
UPDATE promo_codes SET used_count = used_count - 1 WHERE id = 'PROMO-ID';

COMMIT;
```

### 4.4 Modul Promo Codes (Validasi SQL)
Sebelum diskon diberikan, sistem melakukan pengecekan ketat terhadap kode promo:
```sql
SELECT * FROM promo_codes 
WHERE code = 'TIKETMURAH' 
  AND is_active = 1 
  AND start_date <= CURDATE() 
  AND end_date >= CURDATE();
```
**Pengecekan Lanjutan (Logika di Service):**
1.  **Kuota**: Jika `quota` tidak NULL, maka `used_count` harus lebih kecil dari `quota`.
2.  **Minimum Purchase**: Total belanja user harus `>= min_purchase`.
3.  **Maksimum Diskon**: Jika hasil persentase diskon > `max_discount`, maka yang digunakan adalah nilai `max_discount`.

---

## Bagian 5: Modul Keranjang & Wishlist (Tabel Relasi M:N)

### 5.1 Tabel Wishlist
Tabel ini menghubungkan tabel `users` dan `events`. Ini adalah contoh relasi **Many-to-Many**.
- Satu user bisa menyimpan banyak event di wishlist.
- Satu event bisa disimpan di wishlist oleh banyak user.

**Query Tambah ke Wishlist:**
```sql
INSERT INTO wishlist (id, user_id, event_id) VALUES (?, ?, ?);
```
*Kita menggunakan UNIQUE KEY pada (user_id, event_id) agar satu user tidak bisa memasukkan event yang sama dua kali ke wishlist.*

**Query Hapus dari Wishlist:**
```sql
DELETE FROM wishlist WHERE user_id = ? AND event_id = ?;
```

**Query Lihat Wishlist Saya:**
```sql
SELECT e.*, v.name as venue_name 
FROM events e
JOIN wishlist w ON w.event_id = e.id
JOIN venues v ON v.id = e.venue_id
WHERE w.user_id = 'user-uuid-kita';
```

---

### 5.1 Apa itu Race Condition?
**Skenario**: Stok tiket sisa 1. User A dan User B klik beli barengan.
- **Tanpa Proteksi**: User A cek stok (1), User B cek stok (1). Keduanya lanjut beli. Stok jadi -1. Vendor rugi, kursi cuma satu tapi dijual ke dua orang!
- **Solusi Kita**: Menggunakan filter `AND available >= quantity` di dalam perintah `UPDATE`. MySQL menjamin operasi update itu bersifat atomik (satu per satu).

### 5.2 Pentingnya Transaction & ACID
Tanpa transaksi, jika server mati di tengah-tengah proses checkout:
- Order terbuat, tapi stok tidak berkurang.
- Stok berkurang, tapi data pembayaran tidak tersimpan.
- **Atomicity**: Menggunakan `START TRANSACTION`, memastikan "Semua Berhasil atau Semua Gagal".

### 5.3 Mencegah SQL Injection
Kita menggunakan tanda tanya (`?`) atau **Parameterized Query**.
- **Bahaya**: User memasukkan input `' OR '1'='1` di kolom login.
- **Solusi**: Nilai input user tidak pernah digabung langsung ke string query. Library database mengirim perintah SQL dan data secara terpisah. Input user dianggap sebagai data mati, bukan perintah program.

### 5.5 Snapshot Pattern (Integritas Historis)
Dalam sistem basis data, ada kalanya kita tidak ingin relasi yang terlalu ketat untuk data historis.
- **Masalah**: Jika `order_items` hanya menyimpan `ticket_type_id`, saat admin mengubah nama tiket dari "Early Bird" menjadi "Normal Price", maka semua riwayat belanja user lama ikut berubah namanya. Ini salah secara akuntansi.
- **Solusi**: Kita menduplikasi (snapshot) data `ticket_name` dan `ticket_price` ke dalam tabel `order_items` saat transaksi terjadi. Ini menjamin data masa lalu tetap utuh meskipun data master diubah.

### 5.6 Referential Integrity (Foreign Keys)
Kita sangat disiplin menggunakan Foreign Keys. Contohnya di tabel `events`:
```sql
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
```
**Apa dampaknya?** Admin tidak akan bisa menghapus kategori "Konser" jika masih ada event yang menggunakan kategori tersebut. Ini mencegah data "yatim piatu" (orphaned data) di database kita.

### 5.7 Soft Delete vs Hard Delete
- **Hard Delete**: `DELETE FROM events WHERE id = ?`. Data hilang selamanya. Bahaya jika ID tersebut sudah direferensikan oleh tabel `orders` (bisa menyebabkan error FK).
- **Soft Delete**: Kita menambahkan kolom `deleted_at`.
  - Query Hapus: `UPDATE events SET deleted_at = NOW() WHERE id = ?`.
  - Query Ambil: `SELECT * FROM events WHERE deleted_at IS NULL`.
**Keuntungan**: Kita punya audit trail, data bisa dipulihkan, dan relasi database tetap aman.

---

## Bagian 6: Analisis Performa (Indexing)

Meskipun data kita masih sedikit, kita sudah memikirkan performa:
1.  **Primary Key**: Otomatis menjadi *Clustered Index*. Pencarian berdasarkan ID sangat cepat (O(log N)).
2.  **Unique Index**: Pada kolom `email` dan `order_number` selain menjaga keunikan, juga mempercepat query pencarian user/order.
3.  **Composite Index**: Kita bisa menambahkan index pada `(status, deleted_at)` untuk mempercepat filter event yang tampil di homepage.

---

## Bagian 7: Simulasi Kegagalan (Kenapa Butuh Transaction?)

Mari kita lihat apa yang terjadi jika sistem **TIDAK** pakai transaksi:
1.  User klik beli.
2.  Server buat data di tabel `orders` (SUKSES).
3.  Server buat data di tabel `order_items` (SUKSES).
4.  Tiba-tiba koneksi database terputus atau server mati.
5.  Stok di `ticket_types` **BELUM** berkurang.
**Hasil**: User merasa sudah beli, tapi tiket tidak berkurang. Tiket yang sama bisa dijual lagi ke orang lain (**Double Selling**).

**Dengan Transaksi**:
Langkah 2 dan 3 akan otomatis dibatalkan (**Rollback**) oleh MySQL karena Langkah 5 tidak pernah selesai. Database tetap bersih dan akurat.

---

## Bagian 8: Keamanan Tingkat Lanjut

### 8.1 Password Hashing
Kita tidak menyimpan password asli. Kita menggunakan **bcrypt**.
```text
Input: "rahasia123" -> Simpan: "$2a$10$X72..."
```
Bahkan jika hacker berhasil mencuri database kita, mereka tidak bisa tahu password asli user.

### 8.2 Authorization di Level Query
Saat user ingin melihat detail order, kita tidak hanya cek ID order-nya, tapi juga ID user-nya:
```sql
SELECT * FROM orders WHERE id = ? AND user_id = ?;
```
Ini mencegah User A iseng mengganti ID di URL untuk melihat pesanan User B (**Insecure Direct Object Reference - IDOR**).

---

## Bagian 9: Contoh Data Riil (Log Perubahan)

Mari kita lihat apa yang terjadi di tabel saat ada transaksi nyata.

**Tabel `ticket_types` (Kondisi Awal):**
| id | name | price | available | max_per_order |
| :--- | :--- | :--- | :--- | :--- |
| **T-1** | VIP Coldplay | 1.000.000 | **5** | 5 |

---

**USER A MEMBELI 2 TIKET VIP:**

**Query yang Jalan (Order & Items):**
```sql
INSERT INTO orders ... VALUES ('O-101', 'TK-001', 'U-7', 2000000, 'waiting_payment');
INSERT INTO order_items ... VALUES ('OI-1', 'O-101', 'T-1', 'VIP Coldplay', 1000000, 2);
```

**Query yang Jalan (Update Stok):**
```sql
UPDATE ticket_types SET available = available - 2 WHERE id = 'T-1' AND available >= 2;
-- Result: success, affectedRows = 1
```

**Kondisi Akhir di Database:**

**Tabel `ticket_types` (Ter-update):**
| id | name | price | available |
| :--- | :--- | :--- | :--- |
| **T-1** | VIP Coldplay | 1.000.000 | **3** |

**Tabel `order_items` (Snapshot):**
| id | order_id | ticket_name | ticket_price | quantity |
| :--- | :--- | :--- | :--- | :--- |
| OI-1 | O-101 | VIP Coldplay | 1.000.000 | 2 |

---

## Bagian 10: Cara Kontribusi (Untuk Tim)

Jika kalian ingin menambahkan fitur baru (misal: "Review Event" atau "Voucher Referral"):
1.  **Repository**: Tulis query SQL mentahnya di file baru `xxx.repository.ts`. Selalu gunakan `pool.execute()` dan jangan lupa tanda tanya `?`.
2.  **Service**: Tambahkan logika bisnis di `xxx.service.ts`. Jika melibatkan lebih dari satu tabel, wajib pakai `conn.beginTransaction()`.
3.  **Controller**: Buat endpoint API agar bisa dipanggil oleh Frontend.

---

## Bagian 11: Penutup & Pesan Untuk Dosen

Dokumen ini membuktikan bahwa Kelompok 11 tidak hanya sekadar membuat aplikasi "CRUD" biasa, tapi sangat memperhatikan aspek fundamental sistem basis data:
1.  **Data Integrity**: Penggunaan PK/FK dan Constraints yang ketat.
2.  **Concurrency Control**: Penanganan Race Condition pada stok tiket.
3.  **Atomic Transactions**: Penjaminan konsistensi data pada proses Checkout & Cancel.
4.  **Security**: Proteksi SQL Injection dan Hashing Password.
5.  **Audit Trail**: Penggunaan `created_at`, `updated_at`, dan `deleted_at`.

### 11.2 Mengapa Database-First Approach?
Dosen mungkin akan bertanya: "Kenapa tidak pakai ORM (Prisma/Sequelize)?"
- **Jawabannya**: Menggunakan raw SQL memberikan kontrol penuh atas performa dan efisiensi query. Kita bisa menulis query kompleks seperti *JOIN UPDATE* (di alur cancel) yang kadang sulit dilakukan secara efisien oleh ORM. Selain itu, ini membuktikan bahwa kita benar-benar memahami teori SQL yang diajarkan di kelas Dr. Arief Kurniawan.

### 11.3 Normalisasi Database
Database kita sudah memenuhi kriteria **3NF (Third Normal Form)**:
1.  **1NF**: Tidak ada kolom yang menyimpan banyak nilai (multi-valued attributes). Semua data atomik.
2.  **2NF**: Sudah 1NF dan semua kolom non-key bergantung sepenuhnya pada Primary Key.
3.  **3NF**: Sudah 2NF dan tidak ada ketergantungan transitif. Contoh: Kolom `venue_name` tidak kita simpan di tabel `events`, tapi di tabel `venues`, agar jika nama venue ganti, kita cuma perlu update satu tempat.

---
**Semangat buat presentasinya, Tim!** 🚀
Dr. Arief Kurniawan pasti bangga melihat betapa rapinya sistem basis data kita. Jangan lupa istirahat ya! 😎
