# Workplan Backend TiketKita untuk Tika dan Nuri

Halo Tika dan Nuri.

Dokumen ini dibuat supaya kalian bisa mulai kontribusi ke backend TiketKita dengan tenang. Kalian tidak perlu langsung paham semua isi project. Ikuti langkahnya pelan pelan, coba satu endpoint dulu, lalu lanjut ke endpoint berikutnya.

Target dokumen ini:

1. Membantu setup project di Windows sampai server jalan.
2. Menjelaskan arsitektur backend dengan bahasa sederhana.
3. Membagi tugas backend dengan jelas untuk Tika dan Nuri.
4. Memberi checklist testing dan checklist selesai.

## 1. Software yang perlu dipasang di Windows

### Wajib

1. Git
   Untuk clone project, membuat branch, commit, dan push.

2. Node.js
   Pakai versi LTS terbaru. Node.js dipakai untuk menjalankan backend.

3. pnpm
   Ini alat untuk install dependency project. Kalau belum ada, install dari PowerShell:

   ```powershell
   npm install -g pnpm
   ```

4. Docker Desktop
   Dipakai untuk menjalankan MySQL lewat `docker-compose`.

5. Visual Studio Code
   Editor untuk membaca dan mengubah kode.

### Opsional tapi membantu

1. MySQL client, misalnya DBeaver atau MySQL Workbench.
   Ini membantu melihat isi tabel database.

2. Postman atau Thunder Client.
   Ini membantu testing endpoint API. Thunder Client bisa dipasang sebagai extension VS Code.

## 2. Cek software sudah siap

Buka PowerShell, lalu jalankan:

```powershell
git --version
node --version
pnpm --version
docker --version
```

Kalau muncul nomor versi, berarti aman. Kalau `pnpm` belum dikenali, jalankan:

```powershell
npm install -g pnpm
pnpm --version
```

## 3. Setup project di Windows

### Langkah 1, clone project

Kalau project belum ada di laptop:

```powershell
git clone <URL-REPOSITORY-KALIAN>
cd ticket_kita_backend
```

Kalau project sudah ada, buka folder `ticket_kita_backend` di VS Code.

### Langkah 2, buka terminal VS Code

Di VS Code:

1. Klik menu Terminal.
2. Klik New Terminal.
3. Pastikan terminal berada di folder `ticket_kita_backend`.

### Langkah 3, install dependency

```powershell
pnpm install
```

### Langkah 4, buat file `.env`

Project butuh file `.env`. Copy dari `.env.example`:

```powershell
Copy-Item .env.example .env
```

Kalau command itu gagal, lakukan manual:

1. Klik kanan `.env.example`.
2. Pilih copy.
3. Paste di folder yang sama.
4. Rename hasil copy menjadi `.env`.

### Langkah 5, jalankan database dengan Docker

Pastikan Docker Desktop sudah terbuka, lalu jalankan:

```powershell
docker-compose up -d
```

### Langkah 6, jalankan migration

```powershell
pnpm migrate
```

Migration membuat tabel database dan seed data awal.

### Langkah 7, jalankan server

```powershell
pnpm dev
```

Biarkan terminal ini tetap berjalan. Kalau server berhasil, jangan ditutup saat testing.

## 4. Cara cek aplikasi sudah jalan

Buka browser atau Postman, lalu akses:

```text
http://localhost:3000/api/openapi.json
http://localhost:3000/api/docs
```

Kalau muncul JSON atau halaman dokumentasi API, backend sudah jalan.

Lewat PowerShell juga bisa:

```powershell
curl http://localhost:3000/api/openapi.json
```

## 5. Arsitektur backend, versi mudah

Project ini memakai alur:

```text
controller -> service -> repository
```

Artinya request akan lewat beberapa tempat, bukan semua logic ditaruh di satu file.

### Controller

Controller adalah pintu masuk request.

Tugasnya:

1. Ambil data dari URL, body, atau query.
2. Panggil service.
3. Kirim response JSON.

Contoh file:

```text
src/modules/payment-methods/paymentMethod.controller.ts
```

### Service

Service adalah tempat aturan proses.

Tugasnya:

1. Mengecek data masuk akal atau tidak.
2. Mengatur alur kerja.
3. Memberi error kalau data tidak ditemukan.
4. Panggil repository.

Contoh file:

```text
src/modules/payment-methods/paymentMethod.service.ts
```

### Repository

Repository adalah tempat query SQL.

Tugasnya:

1. Menulis query SQL.
2. Menjalankan query ke MySQL.
3. Mengembalikan hasil ke service.

Contoh file:

```text
src/modules/payment-methods/paymentMethod.repository.ts
```

### Routes

Routes adalah daftar alamat endpoint.

Contoh file:

```text
src/modules/payment-methods/paymentMethod.routes.ts
```

### Validation

Validation mengecek input dari user, misalnya field wajib, format data, atau angka minimal.

## 6. File dan folder map

```text
src/
  app.ts
  server.ts
  config/
    database.ts
  middleware/
    auth.middleware.ts
    validate.middleware.ts
    errorHandler.ts
  modules/
    auth/
    dashboard/
    events/
    tickets/
    orders/
    payments/
    promo-codes/
    payment-methods/
    categories/
    venues/
    wishlist/
  types/
    index.ts
  utils/
    response.ts
    AppError.ts
```

Yang paling sering dibuka:

1. `src/app.ts`, tempat route utama dipasang.
2. `src/modules/**/**.routes.ts`, daftar endpoint per modul.
3. `src/modules/**/**.controller.ts`, menerima request.
4. `src/modules/**/**.service.ts`, logic proses.
5. `src/modules/**/**.repository.ts`, query SQL.
6. `src/types/index.ts`, tempat tipe data project.

Route yang sudah dipasang di `src/app.ts`:

1. `/api/auth`
2. `/api/dashboard`
3. `/api/events`
4. `/api/events/:eventId/tickets`
5. `/api/orders`
6. `/api/payments`
7. `/api/promo-codes`
8. `/api/payment-methods`
9. `/api/categories`
10. `/api/venues`
11. `/api/wishlist`

## 7. Contoh alur satu endpoint

Contoh endpoint: `GET /api/payment-methods/:id`

Alurnya:

1. Di routes, tambah `router.get('/:id', controller.getById)`.
2. Di controller, ambil `req.params.id`.
3. Controller memanggil service `getById(id)`.
4. Service memanggil repository `findById(id)`.
5. Repository menjalankan SQL:

   ```sql
   SELECT * FROM payment_methods WHERE id = ?;
   ```

6. Kalau data tidak ada, service mengirim error.
7. Kalau data ada, controller mengirim response sukses.

Simbol `?` di SQL itu tempat value masuk dengan aman. Jangan gabungkan string manual untuk SQL.

## 8. Git workflow untuk pemula Windows

Selalu kerja di branch berbeda. Jangan langsung kerja di branch utama.

Sebelum mulai:

```powershell
git pull
git checkout -b nama-branch
```

Contoh branch Tika:

```powershell
git checkout -b tika/crud-endpoint-gaps
```

Contoh branch Nuri:

```powershell
git checkout -b nuri/reports-module
```

Cek perubahan:

```powershell
git status
```

Simpan pekerjaan ke commit:

```powershell
git add .
git commit -m "feat: add backend endpoint"
```

Push ke GitHub:

```powershell
git push -u origin nama-branch
```

Contoh:

```powershell
git push -u origin tika/crud-endpoint-gaps
```

Peringatan penting:

1. Tika dan Nuri harus pakai branch berbeda.
2. Jangan edit file yang tidak berhubungan dengan tugas.
3. Jalankan `git status` sebelum commit supaya tahu file apa saja yang berubah.

## 9. Workplan Tika

### Tujuan tugas Tika

Menambah endpoint detail dan hapus pada modul yang sudah ada. Ini latihan bagus untuk memahami route, controller, service, repository, dan SQL sederhana.

### Endpoint list Tika

Kerjakan berurutan:

1. `GET /api/payment-methods/:id`
2. `DELETE /api/payment-methods/:id`
3. `GET /api/promo-codes/:id`
4. `DELETE /api/promo-codes/:id`
5. `GET /api/events/:eventId/tickets/:id`
6. `DELETE /api/events/:eventId/tickets/:id`
7. Opsional jika masih ada waktu: `DELETE /api/wishlist/:eventId`

### File yang dibuat atau diubah Tika

Untuk payment methods:

1. `src/modules/payment-methods/paymentMethod.routes.ts`
2. `src/modules/payment-methods/paymentMethod.controller.ts`
3. `src/modules/payment-methods/paymentMethod.service.ts`
4. `src/modules/payment-methods/paymentMethod.repository.ts`

Untuk promo codes:

1. `src/modules/promo-codes/promoCode.routes.ts`
2. `src/modules/promo-codes/promoCode.controller.ts`
3. `src/modules/promo-codes/promoCode.service.ts`
4. `src/modules/promo-codes/promoCode.repository.ts`

Untuk tickets:

1. `src/modules/tickets/ticket.routes.ts`
2. `src/modules/tickets/ticket.controller.ts`
3. `src/modules/tickets/ticket.service.ts`
4. `src/modules/tickets/ticket.repository.ts`

Untuk wishlist opsional:

1. `src/modules/wishlist/wishlist.routes.ts`
2. `src/modules/wishlist/wishlist.controller.ts`
3. `src/modules/wishlist/wishlist.service.ts`
4. `src/modules/wishlist/wishlist.repository.ts`

### Konsep SQL yang Tika latih

Tika akan banyak memakai:

```sql
SELECT * FROM nama_tabel WHERE id = ?;
DELETE FROM nama_tabel WHERE id = ?;
UPDATE nama_tabel SET is_active = 0 WHERE id = ?;
```

Catatan penting:

1. Untuk data penting, cek pola project dulu. Kalau modul lain memakai soft delete atau nonaktifkan data, ikuti pola itu.
2. Kalau benar benar menghapus data, pastikan tidak merusak data yang masih dipakai order.
3. Selalu pakai `?` untuk parameter query.

### Urutan implementasi Tika

1. Jalankan server dan pastikan project bisa jalan.
2. Buka file route modul yang mau dikerjakan.
3. Cari endpoint mirip, misalnya `GET /` atau `PUT /:id`.
4. Tambah route baru.
5. Tambah function controller.
6. Tambah function service.
7. Tambah function repository.
8. Test endpoint di Postman atau Thunder Client.
9. Kalau berhasil, lanjut endpoint berikutnya.
10. Setelah semua selesai, jalankan build:

```powershell
pnpm build
```

### Cara testing Tika

Contoh testing `GET /api/payment-methods/:id`:

1. Ambil daftar payment methods dulu:

   ```text
   GET http://localhost:3000/api/payment-methods
   ```

2. Copy salah satu `id`.
3. Test detail:

   ```text
   GET http://localhost:3000/api/payment-methods/<ID-YANG-DICOPY>
   ```

4. Harus dapat satu data.
5. Test id palsu:

   ```text
   GET http://localhost:3000/api/payment-methods/id-yang-tidak-ada
   ```

6. Harus dapat error yang rapi, misalnya data tidak ditemukan.

Untuk endpoint admin, login sebagai admin dulu, lalu pakai token Bearer di Postman.

### Definition of done Tika

Tugas Tika dianggap selesai kalau:

1. Semua endpoint wajib sudah dipasang di routes.
2. Controller, service, repository sudah ada untuk setiap endpoint.
3. Endpoint sukses untuk data valid.
4. Endpoint memberi error rapi untuk data tidak ditemukan.
5. Tidak ada `password_hash` yang ikut response.
6. Query SQL memakai parameter `?`.
7. `pnpm build` berhasil.
8. Perubahan sudah di branch Tika sendiri.

## 10. Workplan Nuri

### Tujuan tugas Nuri

Membuat modul laporan admin bernama `reports`. Modul ini berisi endpoint yang membaca data order, event, kategori, venue, payment method, dan promo. Fokusnya bukan input data, tapi membaca data dengan SQL agregasi.

Agregasi artinya menghitung ringkasan, misalnya total penjualan, jumlah order, atau jumlah promo terpakai.

### Endpoint list Nuri

Kerjakan bertahap:

1. `GET /api/reports/sales-by-category`
2. `GET /api/reports/sales-by-venue`
3. `GET /api/reports/payment-method-stats`
4. `GET /api/reports/promo-usage`

Semua endpoint ini sebaiknya admin only.

### File yang dibuat atau diubah Nuri

Buat folder baru:

```text
src/modules/reports/
```

Buat file:

```text
src/modules/reports/report.routes.ts
src/modules/reports/report.controller.ts
src/modules/reports/report.service.ts
src/modules/reports/report.repository.ts
```

Ubah file:

```text
src/app.ts
```

Di `src/app.ts`, import route reports dan pasang:

```ts
app.use("/api/reports", reportRoutes);
```

### Konsep SQL yang Nuri latih

Nuri akan memakai pola berikut.

#### SELECT

Mengambil kolom tertentu:

```sql
SELECT id, title FROM events;
```

#### JOIN

Menggabungkan tabel:

```sql
SELECT e.title, c.name AS category_name
FROM events e
JOIN categories c ON c.id = e.category_id;
```

#### COUNT

Menghitung jumlah baris:

```sql
SELECT COUNT(*) AS total_orders
FROM orders;
```

#### SUM

Menjumlahkan angka:

```sql
SELECT SUM(total) AS total_sales
FROM orders
WHERE status = 'paid';
```

#### GROUP BY

Mengelompokkan hasil:

```sql
SELECT status, COUNT(*) AS total
FROM orders
GROUP BY status;
```

### Ide query endpoint Nuri

#### 1. Sales by category

Tujuan: melihat penjualan per kategori event.

Tabel yang dipakai:

1. `orders`
2. `order_items`
3. `ticket_types`
4. `events`
5. `categories`

Konsep query:

```sql
SELECT
  c.id AS category_id,
  c.name AS category_name,
  COUNT(DISTINCT o.id) AS total_orders,
  SUM(oi.quantity) AS tickets_sold,
  SUM(oi.subtotal) AS gross_sales
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN ticket_types tt ON tt.id = oi.ticket_type_id
JOIN events e ON e.id = tt.event_id
JOIN categories c ON c.id = e.category_id
WHERE o.status = 'paid'
GROUP BY c.id, c.name;
```

#### 2. Sales by venue

Tujuan: melihat venue mana yang paling banyak menghasilkan penjualan.

Tabel yang dipakai:

1. `orders`
2. `order_items`
3. `ticket_types`
4. `events`
5. `venues`

Query mirip sales by category, tapi group berdasarkan venue.

#### 3. Payment method stats

Tujuan: melihat metode pembayaran yang sering dipakai.

Tabel yang dipakai:

1. `payments`
2. `payment_methods`
3. `orders`

Konsep query:

```sql
SELECT
  pm.id AS payment_method_id,
  pm.name AS payment_method_name,
  pm.type,
  COUNT(p.id) AS total_payments,
  SUM(p.total) AS total_amount
FROM payments p
JOIN payment_methods pm ON pm.id = p.payment_method_id
JOIN orders o ON o.id = p.order_id
WHERE p.status = 'success'
GROUP BY pm.id, pm.name, pm.type;
```

#### 4. Promo usage

Tujuan: melihat promo yang paling sering dipakai.

Tabel yang dipakai:

1. `promo_codes`
2. `orders`

Konsep query:

```sql
SELECT
  pc.id AS promo_id,
  pc.code,
  pc.type,
  pc.value,
  COUNT(o.id) AS total_orders,
  SUM(o.discount) AS total_discount
FROM promo_codes pc
LEFT JOIN orders o ON o.promo_id = pc.id
GROUP BY pc.id, pc.code, pc.type, pc.value;
```

### Urutan implementasi Nuri

1. Jalankan project sampai server hidup.
2. Buat folder `src/modules/reports`.
3. Buat `report.repository.ts` dulu.
4. Isi satu function paling sederhana, misalnya `getSalesByCategory`.
5. Buat `report.service.ts` yang memanggil repository.
6. Buat `report.controller.ts` yang mengirim response.
7. Buat `report.routes.ts`.
8. Pasang route di `src/app.ts`.
9. Test endpoint pertama.
10. Kalau endpoint pertama berhasil, lanjut endpoint kedua.
11. Setelah semua endpoint selesai, jalankan:

```powershell
pnpm build
```

### Cara testing Nuri

Karena reports admin only, login sebagai admin dulu. Setelah mendapat token, masukkan token di Postman atau Thunder Client.

Header yang dipakai:

```text
Authorization: Bearer <TOKEN-ADMIN>
```

Test endpoint:

```text
GET http://localhost:3000/api/reports/sales-by-category
GET http://localhost:3000/api/reports/sales-by-venue
GET http://localhost:3000/api/reports/payment-method-stats
GET http://localhost:3000/api/reports/promo-usage
```

Hasil yang diharapkan:

1. Response JSON sukses.
2. Data berbentuk list.
3. Angka total tidak error walaupun data kosong.
4. User biasa tidak boleh akses jika route memakai `requireAdmin`.

### Definition of done Nuri

Tugas Nuri dianggap selesai kalau:

1. Folder `src/modules/reports` sudah ada.
2. Empat file reports sudah dibuat.
3. Route `/api/reports` sudah dipasang di `src/app.ts`.
4. Semua endpoint reports bisa diakses admin.
5. Query memakai `JOIN`, `COUNT`, `SUM`, dan `GROUP BY` sesuai kebutuhan.
6. Query memakai status yang benar, misalnya hanya order `paid` untuk sales.
7. Response tetap rapi saat data kosong.
8. `pnpm build` berhasil.
9. Perubahan sudah di branch Nuri sendiri.

## 11. Panduan testing umum

Sebelum testing endpoint, pastikan:

1. Docker jalan.
2. `pnpm dev` jalan.
3. Database sudah dimigrate.
4. Kalau endpoint butuh login, token sudah ada.

Testing minimal untuk setiap endpoint:

1. Test dengan data valid.
2. Test dengan id yang tidak ada.
3. Test tanpa token jika endpoint butuh login.
4. Test dengan token user biasa jika endpoint admin.
5. Cek response JSON punya bentuk yang rapi.

Contoh format response sukses:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Contoh format error:

```json
{
  "success": false,
  "message": "Data tidak ditemukan"
}
```

## 12. Kalau error, cek ini dulu

### Error `pnpm` tidak dikenali

Jalankan:

```powershell
npm install -g pnpm
```

Tutup terminal, buka lagi, lalu cek `pnpm --version`.

### Error database connection

Cek ini:

1. Docker Desktop sudah terbuka.
2. Container sudah jalan.
3. File `.env` sudah ada.
4. Isi `.env` sesuai database Docker.
5. Sudah menjalankan `docker-compose up -d`.

### Error tabel tidak ditemukan

Jalankan:

```powershell
pnpm migrate
```

### Error TypeScript saat build

Baca baris error paling atas dulu. Biasanya penyebabnya:

1. Nama function tidak sama antara route, controller, service, repository.
2. Import belum ditambahkan.
3. Tipe data belum sesuai.
4. Ada kurung kurawal yang kurang.

### Endpoint selalu 404

Cek ini:

1. Route sudah ditambahkan di file `.routes.ts`.
2. Kalau modul baru, route sudah dipasang di `src/app.ts`.
3. URL di Postman sudah benar.
4. Method sudah benar, misalnya GET, POST, PUT, atau DELETE.

### Endpoint admin selalu 403

Artinya token ada, tapi user bukan admin. Login memakai akun admin atau cek seed data.

### Endpoint 401

Artinya token tidak ada, salah, atau expired. Login ulang dan salin token baru.

## 13. Rencana harian yang disarankan

### Hari 1

1. Install software.
2. Clone project.
3. Setup `.env`.
4. Jalankan Docker.
5. Jalankan migration.
6. Jalankan `pnpm dev`.
7. Coba buka `/api/docs`.

### Hari 2

Tika:

1. Kerjakan `GET /api/payment-methods/:id`.
2. Test endpoint valid dan id palsu.
3. Commit kecil.

Nuri:

1. Buat folder reports.
2. Buat endpoint `sales-by-category`.
3. Test dengan admin token.
4. Commit kecil.

### Hari 3

Tika:

1. Kerjakan `DELETE /api/payment-methods/:id`.
2. Kerjakan `GET /api/promo-codes/:id`.

Nuri:

1. Kerjakan `sales-by-venue`.
2. Bandingkan query dengan `sales-by-category`.

### Hari 4

Tika:

1. Kerjakan `DELETE /api/promo-codes/:id`.
2. Kerjakan `GET /api/events/:eventId/tickets/:id`.

Nuri:

1. Kerjakan `payment-method-stats`.
2. Test saat data kosong dan saat ada data.

### Hari 5

Tika:

1. Kerjakan `DELETE /api/events/:eventId/tickets/:id`.
2. Jika sempat, kerjakan `DELETE /api/wishlist/:eventId`.

Nuri:

1. Kerjakan `promo-usage`.
2. Rapikan response.

### Hari 6

1. Tika dan Nuri jalankan `pnpm build`.
2. Test endpoint masing masing.
3. Cek `git status`.
4. Commit dan push branch.
5. Buat pull request jika diminta.

## 14. Checklist akhir Tika

Tika bisa centang manual:

1. [ ] Branch Tika sudah dibuat.
2. [ ] Project bisa jalan di Windows.
3. [ ] `GET /api/payment-methods/:id` selesai dan dites.
4. [ ] `DELETE /api/payment-methods/:id` selesai dan dites.
5. [ ] `GET /api/promo-codes/:id` selesai dan dites.
6. [ ] `DELETE /api/promo-codes/:id` selesai dan dites.
7. [ ] `GET /api/events/:eventId/tickets/:id` selesai dan dites.
8. [ ] `DELETE /api/events/:eventId/tickets/:id` selesai dan dites.
9. [ ] Opsional `DELETE /api/wishlist/:eventId` selesai dan dites.
10. [ ] Error data tidak ditemukan sudah rapi.
11. [ ] `pnpm build` berhasil.
12. [ ] Commit sudah dibuat.
13. [ ] Branch sudah dipush.

## 15. Checklist akhir Nuri

Nuri bisa centang manual:

1. [ ] Branch Nuri sudah dibuat.
2. [ ] Project bisa jalan di Windows.
3. [ ] Folder `src/modules/reports` sudah dibuat.
4. [ ] `report.routes.ts` sudah dibuat.
5. [ ] `report.controller.ts` sudah dibuat.
6. [ ] `report.service.ts` sudah dibuat.
7. [ ] `report.repository.ts` sudah dibuat.
8. [ ] `/api/reports` sudah dipasang di `src/app.ts`.
9. [ ] `GET /api/reports/sales-by-category` selesai dan dites.
10. [ ] `GET /api/reports/sales-by-venue` selesai dan dites.
11. [ ] `GET /api/reports/payment-method-stats` selesai dan dites.
12. [ ] `GET /api/reports/promo-usage` selesai dan dites.
13. [ ] Semua reports memakai admin access.
14. [ ] Query memakai SQL agregasi dengan benar.
15. [ ] Response tetap aman saat data kosong.
16. [ ] `pnpm build` berhasil.
17. [ ] Commit sudah dibuat.
18. [ ] Branch sudah dipush.

## 16. Catatan penutup

Kalau bingung, jangan langsung panik. Backend biasanya terasa sulit karena banyak file saling terhubung. Ambil satu endpoint, lalu ikuti jalur ini:

```text
routes -> controller -> service -> repository -> database
```

Kalau satu endpoint sudah berhasil, endpoint berikutnya akan terasa lebih mudah karena polanya mirip.

Yang penting:

1. Kerja di branch sendiri.
2. Test setiap endpoint setelah dibuat.
3. Commit kecil setelah fitur kecil berhasil.
4. Jangan takut membaca file yang sudah ada dan meniru polanya.
