# USE CASE & USE CASE SPECIFICATION
## Photobooth SaaS — On-Site & Online

---

## 1. Informasi Dokumen

| Item | Detail |
|---|---|
| Nama Produk | Photobooth SaaS |
| Dokumen | Use Case & Use Case Specification |
| Versi | 1.0 |
| Status | Draft |
| Backend | Laravel |
| Frontend | React |
| Database | MySQL |
| Arsitektur | Multi-Tenant SaaS |

---

# 2. Aktor Sistem

| Aktor | Deskripsi |
|---|---|
| Super Admin | Mengelola platform SaaS secara keseluruhan |
| Tenant Admin / Business Owner | Mengelola bisnis photobooth milik tenant |
| Operator | Menjalankan operasional photobooth pada event |
| Customer | Menggunakan photobooth dan mengambil hasil foto |
| Management | Melihat dashboard dan laporan bisnis |
| Payment Gateway | Sistem eksternal untuk proses pembayaran |
| Storage | Media/file storage untuk desain dan hasil foto |
| Camera / Browser | Perangkat/service yang menyediakan akses kamera |

---

# 3. Daftar Use Case

| ID | Use Case | Aktor Utama |
|---|---|---|
| UC-001 | Register | Tenant Admin |
| UC-002 | Login | Semua User |
| UC-003 | Logout | Semua User |
| UC-004 | Reset Password | Semua User |
| UC-005 | Mengelola Tenant | Super Admin |
| UC-006 | Mengelola Subscription Plan | Super Admin |
| UC-007 | Mengelola Business Profile | Tenant Admin |
| UC-008 | Mengelola User | Tenant Admin |
| UC-009 | Mengelola Package | Tenant Admin |
| UC-010 | Mengelola Event | Tenant Admin |
| UC-011 | Mengelola Operator | Tenant Admin |
| UC-012 | Mengelola Template / Desain | Tenant Admin |
| UC-013 | Mengatur Photo Slot | Tenant Admin |
| UC-014 | Assign Template ke Event | Tenant Admin |
| UC-015 | Assign Operator ke Event | Tenant Admin |
| UC-016 | Mengelola Subscription Tenant | Tenant Admin |
| UC-017 | Melihat Dashboard | Tenant Admin / Management |
| UC-018 | Melihat Report | Tenant Admin / Management |
| UC-019 | Memulai Photobooth | Operator / Customer |
| UC-020 | Mengakses Kamera | Customer |
| UC-021 | Capture Foto | Customer |
| UC-022 | Retake Foto | Customer |
| UC-023 | Memilih Template | Customer |
| UC-024 | Generate Final Result | System |
| UC-025 | Melihat Hasil Foto | Customer |
| UC-026 | Download Hasil Foto | Customer |
| UC-027 | Mengakses Hasil melalui QR | Customer |
| UC-028 | Mengelola Gallery | Tenant Admin |
| UC-029 | Mengelola Customer | Tenant Admin |
| UC-030 | Mengelola Transaction | Tenant Admin |
| UC-031 | Melakukan Payment | Customer / Tenant |
| UC-032 | Mengirim Notification | System |
| UC-033 | Mengelola Media | System |
| UC-034 | Menjalankan Online Photobooth | Customer |
| UC-035 | Menjalankan On-Site Photobooth | Operator |

---

# 4. Use Case Diagram

```text
                         +------------------+
                         |   Super Admin    |
                         +--------+---------+
                                  |
                    +-------------+-------------+
                    |                           |
             Manage Tenant             Manage Subscription
                    |
                    v
          +-----------------------------------+
          |        PHOTObooth SaaS            |
          |                                   |
          | Authentication                    |
          | Business Management               |
          | Event Management                  |
          | Template Management               |
          | Photobooth Session                |
          | Gallery                           |
          | Transaction                       |
          | Subscription                      |
          | Dashboard & Report                |
          +-----------------------------------+
                    ^
                    |
          +---------+----------+
          |                    |
 +--------+---------+   +------+-------+
 |   Tenant Admin   |   |  Management  |
 +------------------+   +--------------+
 | Business Profile |
 | Users            |
 | Package          |
 | Event            |
 | Operator         |
 | Template         |
 | Photo Slot       |
 | Subscription     |
 | Gallery          |
 | Transaction      |
 | Dashboard        |
 | Report           |
 +------------------+

 +------------------+       +----------------------+
 |    Operator      |       |      Customer        |
 +--------+---------+       +----------+-----------+
          |                            |
          |                            |
          +------------+---------------+
                       |
                       v
              +-------------------+
              | Photobooth Session|
              +---------+---------+
                        |
                 +------+------+
                 |             |
             On-Site        Online
                 |             |
                 +------+------+
                        |
                    Capture
                        |
                     Retake
                        |
                 Select Template
                        |
                 Generate Result
                        |
               +--------+---------+
               |                  |
            Download          QR / Share
```

---

# 5. Use Case Specification

## UC-001 — Register

**Aktor:** Tenant Admin

**Tujuan:** Membuat akun dan tenant baru.

### Pre-condition

- User belum memiliki akun.
- Sistem dapat menerima registrasi.

### Main Flow

1. User membuka halaman Register.
2. Sistem menampilkan form registrasi.
3. User mengisi nama.
4. User mengisi email.
5. User mengisi password.
6. User mengisi nama bisnis.
7. User mengirim form.
8. Sistem melakukan validasi.
9. Sistem membuat user.
10. Sistem membuat tenant.
11. Sistem memberikan role Tenant Admin.
12. Sistem mengarahkan user ke proses onboarding/dashboard.

### Alternative Flow

- Email sudah digunakan → sistem menampilkan pesan error.
- Data tidak valid → sistem meminta user memperbaiki data.
- Password tidak memenuhi aturan → sistem menampilkan validasi.

### Post-condition

Akun dan tenant berhasil dibuat.

---

# 6. UC-002 — Login

**Aktor:** Semua User

### Main Flow

1. User membuka halaman login.
2. User memasukkan email.
3. User memasukkan password.
4. Sistem memvalidasi credentials.
5. Sistem memeriksa status akun.
6. Sistem membuat authenticated session/token.
7. Sistem mengarahkan user sesuai role.

### Alternative Flow

- Credentials salah → login ditolak.
- Akun inactive → akses ditolak.
- Tenant inactive → akses tenant ditolak.

---

# 7. UC-003 — Logout

**Aktor:** Semua User

### Main Flow

1. User memilih Logout.
2. Sistem mengakhiri session/token.
3. Sistem mengarahkan user ke halaman login.

---

# 8. UC-004 — Reset Password

**Aktor:** Semua User

### Main Flow

1. User memilih Forgot Password.
2. User memasukkan email.
3. Sistem memvalidasi email.
4. Sistem mengirim reset link.
5. User membuka link.
6. User memasukkan password baru.
7. Sistem menyimpan password baru.
8. User dapat login kembali.

---

# 9. UC-005 — Mengelola Tenant

**Aktor:** Super Admin

### Tujuan

Mengelola tenant yang menggunakan platform.

### Main Flow

1. Super Admin membuka Tenant Management.
2. Sistem menampilkan daftar tenant.
3. Admin memilih tenant.
4. Admin dapat melihat detail.
5. Admin dapat mengubah status tenant.
6. Admin dapat melihat subscription tenant.
7. Sistem menyimpan perubahan.

### Post-condition

Data/status tenant diperbarui.

---

# 10. UC-006 — Mengelola Subscription Plan

**Aktor:** Super Admin

Admin dapat:

- Membuat plan.
- Mengubah plan.
- Mengaktifkan/nonaktifkan plan.
- Menentukan quota.
- Menentukan fitur plan.

Contoh:

```text
Free
├── Event: limited
├── Session: limited
├── Storage: limited
└── Template: limited

Business
├── Event: higher
├── Session: higher
├── Storage: higher
└── Template: higher
```

---

# 11. UC-007 — Mengelola Business Profile

**Aktor:** Tenant Admin

Admin dapat:

- Mengubah nama bisnis.
- Upload logo.
- Mengubah email.
- Mengubah nomor telepon.
- Mengubah alamat.
- Mengatur branding.

---

# 12. UC-008 — Mengelola User

**Aktor:** Tenant Admin

Admin dapat:

- Menambah user.
- Mengubah user.
- Menonaktifkan user.
- Menghapus user.
- Mengubah role.

Role:

- Tenant Admin.
- Operator.
- Management.

---

# 13. UC-009 — Mengelola Package

**Aktor:** Tenant Admin

### Main Flow

1. Admin membuka Package Management.
2. Memilih Add Package.
3. Mengisi nama package.
4. Mengisi deskripsi.
5. Mengisi harga.
6. Menentukan durasi.
7. Menentukan batas session.
8. Menentukan template.
9. Menyimpan package.
10. Sistem melakukan validasi.
11. Package dibuat.

---

# 14. UC-010 — Mengelola Event

**Aktor:** Tenant Admin

### Main Flow

1. Admin membuka Event Management.
2. Memilih Add Event.
3. Mengisi nama event.
4. Mengisi tanggal.
5. Mengisi waktu.
6. Mengisi lokasi.
7. Memilih package.
8. Memilih template.
9. Menentukan operator.
10. Menyimpan event.
11. Sistem membuat event dengan status Draft.

### Event Status

```text
Draft
  ↓
Scheduled
  ↓
Active
  ↓
Completed
```

Event juga dapat menjadi:

```text
Draft / Scheduled / Active
            ↓
        Cancelled
```

---

# 15. UC-011 — Mengelola Operator

**Aktor:** Tenant Admin

Admin dapat:

- Melihat operator.
- Menambahkan operator.
- Menentukan operator untuk event.
- Menghapus assignment operator.

Operator hanya dapat menjalankan event yang memiliki assignment/permission.

---

# 16. UC-012 — Mengelola Template / Desain

**Aktor:** Tenant Admin

### Tujuan

Membuat template photobooth yang digunakan untuk menghasilkan layout foto.

### Main Flow

1. Admin membuka Template Management.
2. Sistem menampilkan daftar template.
3. Admin memilih Add Template.
4. Sistem menampilkan form.
5. Admin mengupload desain.
6. Admin mengisi nama template.
7. Admin menentukan paper size.
8. Admin menentukan orientation.
9. Admin mengatur photo slot.
10. Admin melihat preview.
11. Admin menyimpan template.
12. Sistem melakukan validasi.
13. Sistem menyimpan template.

### Alternative Flow

**A. File tidak valid**

```text
Upload
 ↓
Validation
 ↓
Invalid
 ↓
Reject
 ↓
Show Error
```

**B. Data tidak lengkap**

Sistem menampilkan field yang harus dilengkapi.

**C. Upload gagal**

Sistem memberikan opsi retry.

### Post-condition

Template tersimpan dan dapat digunakan apabila berstatus Active.

---

# 17. UC-013 — Mengatur Photo Slot

**Aktor:** Tenant Admin

### Main Flow

1. Admin membuka template.
2. Admin memilih Photo Slot.
3. Admin membuat slot.
4. Admin menentukan X.
5. Admin menentukan Y.
6. Admin menentukan width.
7. Admin menentukan height.
8. Admin menentukan order.
9. Sistem menampilkan preview.
10. Admin menyimpan konfigurasi.

### Data Slot

```text
slot_id
position_x
position_y
width
height
rotation
order
crop/mask configuration
```

---

# 18. UC-014 — Assign Template ke Event

**Aktor:** Tenant Admin

### Main Flow

1. Admin membuka event.
2. Admin membuka template selection.
3. Sistem menampilkan template aktif.
4. Admin memilih satu atau beberapa template.
5. Admin menyimpan.
6. Sistem membuat assignment.

Customer kemudian hanya dapat memilih template yang tersedia pada event.

---

# 19. UC-015 — Assign Operator ke Event

**Aktor:** Tenant Admin

### Main Flow

1. Admin membuka event.
2. Admin membuka operator assignment.
3. Sistem menampilkan operator tenant.
4. Admin memilih operator.
5. Admin menyimpan.
6. Sistem membuat assignment.

---

# 20. UC-016 — Mengelola Subscription Tenant

**Aktor:** Tenant Admin

Admin dapat melihat:

- Current plan.
- Subscription status.
- Start date.
- End date.
- Billing period.
- Usage.
- Quota.

Status:

```text
Trial
Active
Past Due
Expired
Cancelled
```

---

# 21. UC-017 — Melihat Dashboard

**Aktor:** Tenant Admin / Management

Dashboard menampilkan:

- Total event.
- Active event.
- Total session.
- Total customer.
- Transaction.
- Revenue.
- Subscription.
- Quota usage.

---

# 22. UC-018 — Melihat Report

**Aktor:** Tenant Admin / Management

Report dapat menampilkan:

### Event Report

- Event.
- Date.
- Location.
- Package.
- Operator.
- Session count.

### Session Report

- Session.
- Event.
- Mode.
- Time.
- Template.
- Status.

### Transaction Report

- Transaction.
- Customer.
- Package.
- Amount.
- Payment status.

---

# 23. UC-019 — Memulai Photobooth

**Aktor:** Operator / Customer

### Pre-condition

- Event aktif untuk on-site.
- Online link masih aktif untuk online.
- Template tersedia.
- Camera tersedia.

### Main Flow

1. User membuka photobooth.
2. Sistem menampilkan halaman start.
3. User memilih Start.
4. Sistem meminta camera permission.
5. User memberikan permission.
6. Sistem menampilkan camera preview.
7. User memulai session.
8. Sistem menjalankan countdown.
9. Sistem masuk ke proses capture.

---

# 24. UC-020 — Mengakses Kamera

**Aktor:** Customer

### Main Flow

1. Browser meminta camera permission.
2. Customer memberikan izin.
3. Sistem mendapatkan camera stream.
4. Sistem menampilkan preview.
5. Camera siap digunakan.

### Alternative Flow

Jika permission ditolak:

```text
Permission Denied
       ↓
Show Explanation
       ↓
Retry Permission
```

Jika camera tidak tersedia:

```text
Camera Unavailable
       ↓
Show Error
       ↓
Retry / Exit
```

---

# 25. UC-021 — Capture Foto

**Aktor:** Customer

### Main Flow

1. Sistem menampilkan preview.
2. Sistem menjalankan countdown.
3. Countdown selesai.
4. Sistem mengambil foto.
5. Sistem menyimpan capture.
6. Sistem menampilkan hasil sementara.
7. Sistem melanjutkan ke foto berikutnya.

Contoh:

```text
Photo 1
 ↓
Photo 2
 ↓
Photo 3
 ↓
Photo 4
 ↓
Complete
```

---

# 26. UC-022 — Retake Foto

**Aktor:** Customer

```text
Capture
  ↓
Preview
  ↓
 ┌───────────┐
 │           │
Retake    Continue
 │           │
 ↓           ↓
Capture   Next Photo
```

Jumlah retake mengikuti konfigurasi session/package.

---

# 27. UC-023 — Memilih Template

**Aktor:** Customer

### Main Flow

1. Semua foto selesai.
2. Sistem mengambil template event.
3. Sistem memfilter template active.
4. Sistem menampilkan template.
5. Customer memilih template.
6. Sistem mengambil konfigurasi template.
7. Sistem melanjutkan proses generate result.

---

# 28. UC-024 — Generate Final Result

**Aktor:** System

### Input

- Photo session.
- Captured photos.
- Template.
- Template version.
- Photo slot configuration.

### Process

```text
Captured Photos
       +
Selected Template
       +
Photo Slot Configuration
       ↓
Crop / Resize
       ↓
Place Photo
       ↓
Apply Frame / Overlay
       ↓
Generate Final Image
       ↓
Save Result
       ↓
Preview
```

### Output

- Final image.
- Result reference.
- Storage reference.
- Session reference.

### Alternative Flow

Jika processing gagal:

```text
Processing
    ↓
Failed
    ↓
Save Error Status
    ↓
Retry
```

---

# 29. UC-025 — Melihat Hasil Foto

**Aktor:** Customer

Customer dapat melihat:

- Final image.
- Preview.
- QR.
- Download button.
- Share option.

---

# 30. UC-026 — Download Hasil Foto

**Aktor:** Customer

### Main Flow

1. Customer membuka result.
2. Customer memilih Download.
3. Sistem memvalidasi akses.
4. Sistem mengambil file result.
5. Sistem mengirim file.
6. Browser melakukan download.

---

# 31. UC-027 — Mengakses Hasil melalui QR

**Aktor:** Customer

### Main Flow

```text
Final Result
    ↓
Generate Result Identifier
    ↓
Generate QR
    ↓
Customer Scan
    ↓
Open Result Page
    ↓
View Result
    ↓
Download / Share
```

---

# 32. UC-028 — Mengelola Gallery

**Aktor:** Tenant Admin

Admin dapat:

- Melihat result.
- Filter berdasarkan event.
- Filter berdasarkan tanggal.
- Melihat session.
- Mengelola retention result.
- Menghapus/arsip result sesuai policy.

---

# 33. UC-029 — Mengelola Customer

**Aktor:** Tenant Admin

Data customer dapat berasal dari session.

Admin dapat:

- Melihat customer.
- Melihat history session.
- Melihat result terkait.
- Melihat informasi customer yang tersedia.

---

# 34. UC-030 — Mengelola Transaction

**Aktor:** Tenant Admin

Admin dapat:

- Melihat transaksi.
- Filter transaksi.
- Melihat detail.
- Melihat status payment.
- Melakukan tindakan sesuai permission.

Status:

```text
Pending
Paid
Failed
Expired
Refunded
```

---

# 35. UC-031 — Melakukan Payment

**Aktor:** Customer / Tenant

### Main Flow

```text
Select Product/Plan
       ↓
Checkout
       ↓
Payment Gateway
       ↓
Payment
       ↓
Verification
       ↓
Paid
       ↓
Activate Subscription/Order
```

### Alternative Flow

Payment gagal:

```text
Payment
   ↓
Failed
   ↓
Transaction Failed
   ↓
Retry
```

---

# 36. UC-032 — Mengirim Notification

**Aktor:** System

System dapat mengirim:

### Tenant

- Registration success.
- Subscription active.
- Payment success.
- Subscription expiring.
- Subscription expired.
- Quota warning.

### Customer

- Session success.
- Photo processing complete.
- Result available.
- Payment success.

---

# 37. UC-033 — Mengelola Media

**Aktor:** System

Media meliputi:

- Template design.
- Template preview.
- Captured photo.
- Final result.
- Business logo.

Database menyimpan metadata/reference file, sedangkan file media disimpan pada storage.

---

# 38. UC-034 — Menjalankan Online Photobooth

**Aktor:** Customer

```text
Open Link
    ↓
Camera Permission
    ↓
Start Session
    ↓
Countdown
    ↓
Capture
    ↓
Retake / Continue
    ↓
Select Template
    ↓
Generate Result
    ↓
Preview
    ↓
Download / Share / QR
```

Customer tidak harus memiliki akun jika event mengizinkan anonymous session.

---

# 39. UC-035 — Menjalankan On-Site Photobooth

**Aktor:** Operator

```text
Operator Login
      ↓
View Assigned Event
      ↓
Open Active Event
      ↓
Open Booth
      ↓
Customer Start
      ↓
Camera
      ↓
Capture
      ↓
Retake / Continue
      ↓
Select Template
      ↓
Generate Result
      ↓
QR / Download / Print
```

Interface on-site menggunakan mode full-screen dan meminimalkan elemen yang tidak diperlukan.

---

# 40. Relasi Antar Use Case

Beberapa use case memiliki hubungan dependency.

```text
UC-035 On-Site Photobooth
        |
        +--> UC-019 Start Photobooth
                  |
                  +--> UC-020 Camera
                  |
                  +--> UC-021 Capture
                            |
                            +--> UC-022 Retake
                  |
                  +--> UC-023 Select Template
                            |
                            +--> UC-024 Generate Result
                                      |
                                      +--> UC-025 View Result
                                      |
                                      +--> UC-026 Download
                                      |
                                      +--> UC-027 QR Result
```

Online:

```text
UC-034 Online Photobooth
        |
        +--> UC-019 Start Photobooth
                  |
                  +--> UC-020 Camera
                  |
                  +--> UC-021 Capture
                  |
                  +--> UC-022 Retake
                  |
                  +--> UC-023 Select Template
                  |
                  +--> UC-024 Generate Result
```

Business setup:

```text
Business Profile
      ↓
Package
      ↓
Template
      ↓
Photo Slot
      ↓
Event
      ↓
Assign Template
      ↓
Assign Operator
      ↓
Photobooth Session
```

---

# 41. Actor Access Summary

| Modul | Super Admin | Tenant Admin | Operator | Customer | Management |
|---|---|---|---|---|---|
| Authentication | ✓ | ✓ | ✓ | Optional | ✓ |
| Tenant | CRUD | - | - | - | View |
| Subscription Plan | CRUD | View | - | - | View |
| Business Profile | - | CRUD | - | - | View |
| User | - | CRUD | - | - | View |
| Package | View | CRUD | - | View | View |
| Event | View | CRUD | View Assigned | - | View |
| Template | View | CRUD | View | Select | View |
| Photo Slot | View | CRUD | View | - | View |
| Photobooth | - | View | Use | Use | - |
| Session | View | View/Manage | Create/View | Create/View Own | View |
| Gallery | View | Manage | View | View Own | View |
| Customer | View | Manage | Limited | Own | View |
| Transaction | View | Manage | View | Own | View |
| Report | View | View | Limited | - | View |

---

# 42. Main Business Flow

```text
Tenant Registration
       ↓
Business Setup
       ↓
Create Package
       ↓
Upload Template
       ↓
Configure Photo Slot
       ↓
Create Event
       ↓
Assign Template
       ↓
Assign Operator
       ↓
Event Active
       ↓
Photobooth Session
       ↓
Capture Photos
       ↓
Select Template
       ↓
Generate Final Result
       ↓
Store Result
       ↓
QR / Download / Share / Print
       ↓
Gallery & Reporting
```

---

# 43. Dasar ERD

Use case ini menjadi dasar untuk ERD dengan entitas utama:

```text
users
tenants
roles
permissions
subscription_plans
tenant_subscriptions
packages
events
event_operators
templates
template_versions
template_photo_slots
photo_sessions
photos
customers
transactions
payments
notifications
media_files
audit_logs
```

Relasi inti:

```text
Tenant
 ├── Users
 ├── Packages
 ├── Events
 ├── Templates
 ├── Customers
 ├── Sessions
 ├── Transactions
 └── Media

Template
 └── Template Versions
       └── Photo Slots

Event
 ├── Package
 ├── Templates
 ├── Operators
 └── Sessions

Photo Session
 ├── Customer
 ├── Event
 ├── Template
 └── Photos

Transaction
 ├── Customer
 ├── Package
 └── Payment
```

---

# 44. Catatan untuk Tahap Berikutnya

Use Case ini menjadi dasar untuk:

1. ERD.
2. LRS.
3. Database Specification.
4. API Specification.
5. Sequence Diagram.
6. Activity Diagram.
7. UI/UX Specification.
8. Technical Specification.
9. Test Case.

Tahap berikutnya yang paling tepat adalah membuat **ERD lengkap**, termasuk:

- seluruh tabel,
- field setiap tabel,
- PK,
- FK,
- cardinality,
- relasi antar tabel,
- aturan tenant isolation,
- relasi template → version → photo slot,
- relasi event → template,
- relasi session → photos,
- relasi transaction → payment.

---

**Dokumen:** Use Case & Use Case Specification  
**Versi:** 1.0  
**Status:** Draft
