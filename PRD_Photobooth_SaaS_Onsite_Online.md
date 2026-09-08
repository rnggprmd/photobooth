# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Sistem SaaS Photobooth — On-Site & Online

---

## 1. Informasi Dokumen

| Item | Detail |
|---|---|
| Nama Produk | Photobooth SaaS |
| Jenis Sistem | Web Application / SaaS |
| Model Bisnis | Software as a Service (SaaS) |
| Platform | Web |
| Backend | Laravel |
| Frontend | React |
| Database | MySQL |
| Arsitektur | Multi-Tenant SaaS |
| Mode Photobooth | On-Site + Online |
| Versi Dokumen | 1.0 |
| Status | Draft |

---

# 2. Product Overview

Photobooth SaaS adalah platform berbasis web yang memungkinkan penyedia jasa photobooth mengelola bisnis, event, paket, operator, template desain, customer, transaksi, dan hasil foto dalam satu sistem.

Produk mendukung dua mode penggunaan:

1. **On-Site Photobooth** — digunakan langsung di lokasi event menggunakan perangkat photobooth.
2. **Online Photobooth** — digunakan customer melalui browser pada perangkat pribadi.

Sistem menggunakan arsitektur **multi-tenant SaaS**, sehingga banyak bisnis dapat menggunakan platform yang sama dengan data dan konfigurasi yang terisolasi.

Arsitektur produk:

```text
                    PHOTObooth SaaS
                          │
              ┌───────────┴───────────┐
              │                       │
          SaaS Admin              Tenant
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                 Business           Event          Subscription
                    │                 │
             Package/Template      Operator
                                      │
                              Photobooth Session
                                      │
                         ┌────────────┴────────────┐
                         │                         │
                      On-Site                   Online
                         │                         │
                         └────────────┬────────────┘
                                      │
                                Capture Photo
                                      │
                                Select Template
                                      │
                                Process Result
                                      │
                           Download / QR / Share / Print
```

---

# 3. Product Goals

## 3.1 Primary Goals

Produk harus:

1. Menyediakan satu platform untuk on-site dan online photobooth.
2. Memudahkan tenant mengelola bisnis photobooth.
3. Memudahkan pembuatan dan pengelolaan event.
4. Menyediakan pengelolaan template/frame yang fleksibel.
5. Memungkinkan customer mengambil foto dan memperoleh hasil secara digital.
6. Menyediakan dashboard dan laporan dasar.
7. Mendukung model SaaS multi-tenant.
8. Menjaga isolasi data antar tenant.
9. Menyediakan fondasi untuk subscription dan pengembangan fitur lanjutan.

## 3.2 Secondary Goals

- Mendukung penggunaan oleh banyak operator.
- Mendukung berbagai template dan ukuran kertas.
- Mendukung QR/link untuk mengambil hasil.
- Menyiapkan integrasi payment gateway.
- Menyiapkan integrasi printer.
- Menyiapkan pengembangan AI photo editing.

---

# 4. Non-Goals / Out of Scope MVP

Fitur berikut bukan fokus MVP:

- Integrasi seluruh kamera profesional.
- AI background removal.
- Advanced AI photo editing.
- AR filter kompleks.
- Video booth kompleks.
- Integrasi universal semua vendor printer.
- Inventaris hardware detail.
- Accounting enterprise.
- Mobile native application.
- Public template marketplace.

Fitur tersebut dapat masuk Phase 2 atau Phase 3.

---

# 5. Target Users & Personas

## 5.1 Super Admin

**Tujuan:**
Mengelola platform SaaS secara keseluruhan.

**Kebutuhan:**
- Mengelola tenant.
- Mengelola subscription plan.
- Melihat penggunaan platform.
- Melihat statistik platform.
- Mengontrol status tenant.

---

## 5.2 Tenant Admin / Business Owner

**Tujuan:**
Mengelola bisnis photobooth.

**Kebutuhan:**
- Mengelola profil bisnis.
- Membuat paket.
- Membuat event.
- Mengelola operator.
- Mengupload template.
- Melihat session.
- Melihat transaksi.
- Melihat laporan.
- Mengelola subscription.

---

## 5.3 Operator

**Tujuan:**
Menjalankan operasional photobooth di event.

**Kebutuhan:**
- Melihat event yang ditugaskan.
- Menjalankan mode photobooth.
- Memulai session.
- Menggunakan kamera.
- Capture/retake.
- Membantu customer.
- Melihat status session.

---

## 5.4 Customer

**Tujuan:**
Menggunakan photobooth dan mendapatkan hasil foto.

**Kebutuhan:**
- Membuka photobooth.
- Mengizinkan kamera.
- Mengambil foto.
- Retake.
- Memilih template.
- Melihat hasil.
- Download.
- Share/QR.

---

# 6. Product Scope

## 6.1 Platform

- Authentication.
- Authorization.
- Multi-tenant.
- User management.
- Role/permission.
- Subscription plan.
- Tenant subscription.

## 6.2 Business Management

- Business profile.
- Package management.
- Event management.
- Operator management.
- Customer management.

## 6.3 Design Management

- Template management.
- Design upload.
- Photo slot configuration.
- Template preview.
- Template activation.
- Event assignment.

## 6.4 Photobooth

- On-site mode.
- Online mode.
- Camera access.
- Countdown.
- Capture.
- Retake.
- Photo sequence.
- Template selection.
- Photo processing.
- Result generation.
- Digital result.
- QR/link result.

## 6.5 Business Operations

- Transaction.
- Payment.
- Dashboard.
- Reporting.
- Notification.
- Media management.

---

# 7. Role & Permission Matrix

| Modul | Super Admin | Tenant Admin | Operator | Customer |
|---|---:|---:|---:|---:|
| Platform Dashboard | CRUD/View | - | - | - |
| Tenant Management | CRUD | - | - | - |
| Subscription Plan | CRUD | View/Select | - | - |
| Business Profile | View | CRUD | - | - |
| User Management | CRUD | CRUD | - | - |
| Package | View | CRUD | - | View |
| Event | View | CRUD | View | - |
| Template | View | CRUD | View | Select |
| On-Site Photobooth | - | View | Use | Use |
| Online Photobooth | - | View | - | Use |
| Photo Session | View | CRUD/View | Create/View | Create/View |
| Gallery | View | CRUD/View | View | View own result |
| Transaction | View | CRUD/View | View | View own |
| Reports | View | View | Limited | - |
| System Settings | CRUD | CRUD tenant | - | - |

---

# 8. Detailed Functional Requirements

# 8.1 Authentication

## Objective

Menyediakan akses aman bagi pengguna dashboard.

## Features

### Register

Input minimal:

- Name.
- Email.
- Password.
- Business name untuk tenant baru.

### Login

User memasukkan:

- Email.
- Password.

Sistem melakukan:

1. Validasi akun.
2. Validasi status akun.
3. Validasi tenant jika user merupakan tenant user.
4. Membuat authenticated session/token.
5. Redirect sesuai role.

### Forgot Password

- User memasukkan email.
- Sistem mengirim reset link.
- User membuat password baru.

### Logout

User dapat keluar dari sistem.

---

# 8.2 Multi-Tenant Management

Setiap bisnis mempunyai tenant sendiri.

Contoh:

```text
Tenant A
ABC Photobooth

Tenant B
XYZ Studio
```

Semua data tenant-specific harus terisolasi.

Contoh:

```text
Tenant A
├── Users
├── Packages
├── Events
├── Templates
├── Sessions
├── Photos
└── Transactions

Tenant B
├── Users
├── Packages
├── Events
├── Templates
├── Sessions
├── Photos
└── Transactions
```

Tenant A tidak boleh membaca, mengubah, atau menghapus data Tenant B.

---

# 8.3 Business Profile

Tenant Admin dapat mengatur:

- Business name.
- Logo.
- Description.
- Email.
- Phone.
- Address.
- Social media.
- Branding.
- Photobooth settings.

Branding dapat digunakan pada halaman customer jika fitur tersebut diaktifkan.

---

# 8.4 User Management

Tenant Admin dapat:

- Menambahkan user.
- Mengubah user.
- Menonaktifkan user.
- Menghapus user.
- Menentukan role.
- Melihat status user.

Role utama:

- Tenant Admin.
- Operator.
- Management.

---

# 8.5 Subscription Management

## Plan

Contoh:

| Plan | Tujuan |
|---|---|
| Free | Penggunaan dasar |
| Starter | Bisnis kecil |
| Business | Bisnis berkembang |
| Enterprise | Kebutuhan custom |

Harga dan quota final ditentukan kemudian.

## Subscription Data

Minimal:

- Plan.
- Tenant.
- Start date.
- End date.
- Status.
- Billing period.
- Usage.

## Status

- Trial.
- Active.
- Past Due.
- Expired.
- Cancelled.

## Quota

Quota dapat diterapkan pada:

- Event.
- Session.
- Storage.
- Operator.
- Template.
- Customer.

Jika quota tercapai, sistem memberikan peringatan atau membatasi fitur sesuai aturan plan.

---

# 8.6 Package Management

Tenant dapat membuat paket photobooth.

Data paket:

- Package name.
- Description.
- Price.
- Duration.
- Maximum session.
- Available template.
- Features.
- Status.

Contoh:

```text
Package Wedding
Rp 2.500.000

Duration: 4 Hours
Session: 200
Template: 5
Mode: On-Site
```

Tenant dapat:

- Create.
- Read.
- Update.
- Activate/deactivate.
- Delete.

---

# 8.7 Event Management

Tenant Admin dapat membuat event.

Data:

- Event name.
- Description.
- Date.
- Start time.
- End time.
- Location.
- Package.
- Template.
- Operator.
- Status.

Status:

```text
Draft
Scheduled
Active
Completed
Cancelled
```

Event dapat memiliki beberapa template.

Event dapat memiliki satu atau lebih operator.

---

# 8.8 Template / Design Management

Template adalah bagian penting dari produk.

Template digunakan untuk menentukan layout hasil akhir photobooth.

## 8.8.1 Upload Design

Tenant Admin dapat:

1. Membuka Template Management.
2. Klik Add Template.
3. Upload file desain.
4. Mengisi nama.
5. Menentukan ukuran.
6. Menentukan orientasi.
7. Mengatur photo slot.
8. Preview.
9. Save.

## 8.8.2 Template Metadata

Minimal:

- Template ID.
- Tenant ID.
- Template name.
- Design file.
- Preview file jika diperlukan.
- Paper size.
- Orientation.
- Canvas dimension.
- Status.
- Created date.
- Updated date.

## 8.8.3 Paper Size

Sistem harus dapat mendukung:

- 2R.
- 4R.
- 5R.
- Custom.

Ukuran final/resolusi ditentukan pada Technical Specification.

## 8.8.4 Orientation

Pilihan:

- Portrait.
- Landscape.

## 8.8.5 Photo Slot

Photo slot merupakan area pada template yang digunakan untuk menempatkan foto.

Setiap slot minimal memiliki:

- Slot ID.
- Position X.
- Position Y.
- Width.
- Height.
- Rotation jika diperlukan.
- Order.
- Optional crop/mask configuration.

Contoh:

```text
+-------------------------+
|                         |
|      PHOTO SLOT 1       |
|                         |
|-------------------------|
|                         |
|      PHOTO SLOT 2       |
|                         |
|-------------------------|
|       LOGO / FRAME      |
+-------------------------+
```

## 8.8.6 Template Preview

Admin dapat melihat preview sebelum template digunakan.

Preview harus menunjukkan:

- Design.
- Photo slot.
- Canvas.
- Orientation.

## 8.8.7 Template Status

Status minimal:

- Draft.
- Active.
- Inactive.
- Archived.

Customer hanya dapat memilih template yang Active dan tersedia pada event/session.

## 8.8.8 Template Assignment

Tenant dapat menentukan template yang tersedia untuk event.

Contoh:

```text
Event: Wedding A

Templates:
✓ Floral
✓ Elegant
✓ Minimalist
✗ Birthday
```

## 8.8.9 Template Version

Jika desain diubah, sistem sebaiknya dapat menyimpan versi template agar hasil session lama tetap konsisten.

Versioning detail dapat ditentukan pada Technical Specification.

## 8.8.10 Template Delete Rule

Template yang belum digunakan dapat dihapus.

Template yang sudah digunakan pada session sebaiknya tidak langsung dihapus secara permanen. Sistem dapat menggunakan archive/inactive agar hasil lama tetap dapat ditampilkan.

---

# 8.9 On-Site Photobooth

On-site digunakan pada lokasi event.

## Flow

```text
Event Active
    ↓
Operator Open Booth
    ↓
Customer Start
    ↓
Camera Permission
    ↓
Countdown
    ↓
Capture
    ↓
Retake / Continue
    ↓
All Photos Complete
    ↓
Select Template
    ↓
Generate Result
    ↓
Preview
    ↓
QR / Download / Print
```

## Requirements

- Full-screen interface.
- Camera preview.
- Camera permission.
- Countdown.
- Capture.
- Retake.
- Multiple photo sequence.
- Template selection.
- Processing.
- Result preview.
- QR result.
- Download.
- Print support sebagai pengembangan.

Interface harus sederhana agar customer dapat menggunakan photobooth tanpa banyak bantuan operator.

---

# 8.10 Online Photobooth

Online photobooth dapat diakses melalui link.

Flow:

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

Customer tidak harus memiliki akun untuk menggunakan photobooth apabila konfigurasi event mengizinkannya.

---

# 8.11 Camera & Capture

Sistem harus:

- Meminta permission kamera.
- Menampilkan camera preview.
- Menampilkan countdown.
- Mengambil foto.
- Menyimpan hasil capture.
- Menampilkan hasil sementara.
- Memberikan opsi retake.

Jika kamera tidak tersedia:

```text
Camera unavailable
       ↓
Show error
       ↓
Retry permission
```

Sistem tidak boleh menganggap capture berhasil apabila browser tidak memberikan akses kamera.

---

# 8.12 Photo Sequence

Template/event dapat menentukan jumlah foto.

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
Template
↓
Result
```

Customer dapat melakukan retake sesuai aturan session/package.

---

# 8.13 Photo Processing

Setelah semua foto selesai:

1. Sistem membaca template.
2. Sistem membaca photo slot.
3. Sistem mengambil foto session.
4. Foto di-crop/resize sesuai slot.
5. Foto ditempatkan pada slot.
6. Template/frame diterapkan.
7. Sistem menghasilkan final image.
8. Result disimpan.
9. Customer melihat preview.

---

# 8.14 Final Result

Final result harus:

- Sesuai template.
- Sesuai orientation.
- Sesuai canvas.
- Memiliki foto pada slot yang benar.
- Dapat ditampilkan pada browser.
- Dapat didownload.

Output dapat memiliki:

- Digital image.
- Print-ready image jika printing digunakan.

---

# 8.15 QR / Result Link

Setiap result dapat memiliki link/identifier yang dapat digunakan customer untuk mengambil hasil.

Flow:

```text
Final Result
     ↓
Generate Result URL
     ↓
Generate QR
     ↓
Customer Scan
     ↓
Result Gallery
     ↓
Download / Share
```

Akses result harus mengikuti aturan keamanan dan privacy tenant.

---

# 8.16 Gallery

Tenant dapat melihat hasil foto berdasarkan:

- Event.
- Session.
- Date.
- Customer jika tersedia.
- Status.

Customer dapat:

- Melihat hasil.
- Download.
- Share.

Gallery harus membedakan result yang masih aktif dan yang telah melewati retention policy.

---

# 8.17 Customer Management

Customer dapat dibuat secara otomatis ketika melakukan session.

Data minimal:

- Customer ID.
- Name jika diberikan.
- Email jika diberikan.
- Phone jika diberikan.
- Tenant.
- Session history.
- Created date.

Untuk online photobooth, customer information dapat bersifat optional sesuai konfigurasi.

---

# 8.18 Transaction Management

Transaction digunakan untuk pencatatan pembayaran.

Data:

- Transaction ID.
- Tenant.
- Customer.
- Package.
- Amount.
- Payment method.
- Payment reference.
- Payment status.
- Transaction date.

Status:

```text
Pending
Paid
Failed
Expired
Refunded
```

---

# 8.19 Payment

Payment dapat digunakan untuk:

1. Subscription SaaS.
2. Paket photobooth.
3. Online photobooth apabila model bisnis menggunakannya.

Metode dapat mencakup:

- Virtual Account.
- QRIS.
- E-wallet.
- Bank transfer.
- Provider-supported methods.

Provider payment gateway belum ditentukan pada PRD ini.

---

# 8.20 Dashboard

## Super Admin Dashboard

Menampilkan:

- Total tenant.
- Active tenant.
- Inactive tenant.
- Subscription.
- SaaS revenue.
- Tenant growth.
- Platform usage.
- Subscription expiry.

## Tenant Dashboard

Menampilkan:

- Total event.
- Active event.
- Total session.
- Total customer.
- Total transaction.
- Revenue.
- Active package.
- Subscription status.
- Quota usage.

---

# 8.21 Reporting

Report minimal:

## Event Report

- Event.
- Date.
- Location.
- Package.
- Operator.
- Session count.

## Session Report

- Session ID.
- Event.
- Mode.
- Time.
- Template.
- Status.

## Transaction Report

- Transaction ID.
- Customer.
- Package.
- Amount.
- Payment status.
- Date.

## Business Report

- Revenue.
- Event.
- Session.
- Customer growth.
- Popular package.

Export PDF/Excel/CSV dapat dikembangkan pada phase berikutnya.

---

# 8.22 Notification

## Tenant Notification

- Registration success.
- Subscription active.
- Payment success.
- Subscription expiring.
- Subscription expired.
- Quota nearly reached.

## Customer Notification

- Session success.
- Photo processed.
- Result link available.
- Payment success.

Channel:

- In-app.
- Email.
- WhatsApp sebagai pengembangan.

---

# 8.23 Media Management

Media yang dapat disimpan:

- Template design.
- Template preview.
- Captured photo.
- Final result.
- Business logo.

File media tidak disimpan sebagai binary langsung pada MySQL.

Database menyimpan metadata/referensi file.

Storage:

```text
Development
→ Local Storage

Production
→ Object/Cloud Storage
```

---

# 9. Customer Experience

## 9.1 On-Site Customer Experience

Target flow harus sesingkat mungkin:

```text
Start
 ↓
Camera
 ↓
Countdown
 ↓
Capture
 ↓
Retake
 ↓
Template
 ↓
Result
 ↓
QR / Download / Print
```

Customer tidak perlu masuk dashboard.

## 9.2 Online Customer Experience

```text
Open Link
 ↓
Allow Camera
 ↓
Start
 ↓
Capture
 ↓
Retake
 ↓
Template
 ↓
Result
 ↓
Download / Share
```

---

# 10. User Stories

## Tenant

### US-001
Sebagai Tenant Admin, saya ingin membuat event agar dapat mengelola photobooth untuk acara tertentu.

### US-002
Sebagai Tenant Admin, saya ingin membuat paket agar layanan photobooth memiliki harga dan batas penggunaan.

### US-003
Sebagai Tenant Admin, saya ingin mengupload desain agar hasil photobooth memiliki branding sesuai event.

### US-004
Sebagai Tenant Admin, saya ingin mengatur photo slot agar foto customer masuk ke posisi yang tepat.

### US-005
Sebagai Tenant Admin, saya ingin menentukan template untuk event agar customer hanya melihat desain yang tersedia.

### US-006
Sebagai Tenant Admin, saya ingin melihat session agar aktivitas photobooth dapat dipantau.

### US-007
Sebagai Tenant Admin, saya ingin melihat transaksi agar pendapatan dapat dipantau.

## Operator

### US-008
Sebagai Operator, saya ingin melihat event yang ditugaskan agar dapat menjalankan booth.

### US-009
Sebagai Operator, saya ingin memulai session agar customer dapat menggunakan photobooth.

### US-010
Sebagai Operator, saya ingin melakukan capture dan retake agar customer memperoleh hasil yang baik.

## Customer

### US-011
Sebagai Customer, saya ingin menggunakan kamera browser agar dapat mengambil foto.

### US-012
Sebagai Customer, saya ingin melakukan retake agar dapat mengulang foto yang kurang bagus.

### US-013
Sebagai Customer, saya ingin memilih template agar hasil foto sesuai keinginan.

### US-014
Sebagai Customer, saya ingin melihat preview agar dapat memastikan hasil sebelum mengambilnya.

### US-015
Sebagai Customer, saya ingin download hasil agar dapat menyimpan foto.

### US-016
Sebagai Customer, saya ingin mendapatkan hasil melalui QR/link agar mudah mengambil foto dari perangkat lain.

## Super Admin

### US-017
Sebagai Super Admin, saya ingin mengelola tenant agar platform dapat dikontrol.

### US-018
Sebagai Super Admin, saya ingin mengelola subscription plan agar model SaaS dapat dijalankan.

---

# 11. Product Flow

## 11.1 Tenant Onboarding

```text
Register
 ↓
Verification
 ↓
Business Profile
 ↓
Select Plan
 ↓
Payment jika diperlukan
 ↓
Tenant Active
 ↓
Dashboard
```

## 11.2 Business Setup

```text
Business Profile
 ↓
Create Package
 ↓
Upload Template
 ↓
Configure Photo Slot
 ↓
Create Event
 ↓
Assign Operator
 ↓
Select Template
 ↓
Event Active
```

## 11.3 Photobooth Session

```text
Start
 ↓
Camera
 ↓
Countdown
 ↓
Capture
 ↓
Retake / Continue
 ↓
Select Template
 ↓
Process
 ↓
Preview
 ↓
Final Result
 ↓
Download / QR / Share / Print
```

## 11.4 Subscription

```text
Choose Plan
 ↓
Checkout
 ↓
Payment
 ↓
Subscription Active
 ↓
Usage Tracking
 ↓
Renewal
 ↓
Expired / Renewed
```

---

# 12. Template Rendering Rules

Template rendering harus menjaga konsistensi antara desain dan foto.

## Input

- Template.
- Template version.
- Photo session.
- Captured photos.
- Photo slot configuration.

## Processing

```text
Canvas
+
Background
+
Photo Slot
+
Photo
+
Overlay/Frame
+
Optional Elements
=
Final Result
```

Foto harus:

- Di-scale sesuai slot.
- Di-crop sesuai slot jika diperlukan.
- Mempertahankan konfigurasi slot.
- Tidak keluar dari area yang ditentukan.

## Output

- Final image.
- Metadata template.
- Session reference.
- Storage reference.

---

# 13. Business Rules

1. Setiap tenant mempunyai identitas unik.
2. Data tenant harus terisolasi.
3. Event dimiliki oleh tenant.
4. Template dimiliki oleh tenant.
5. Template dapat digunakan pada satu atau beberapa event.
6. Customer hanya dapat memilih template yang tersedia.
7. Template inactive tidak dapat dipilih untuk session baru.
8. Session harus memiliki tenant.
9. Session dapat terkait event.
10. Session dapat menggunakan mode On-site atau Online.
11. Hasil foto harus terkait dengan session.
12. Akses gallery mengikuti privacy policy.
13. Subscription menentukan fitur/quota yang tersedia.
14. Operator hanya dapat mengakses event sesuai assignment/permission.
15. Template yang sudah digunakan sebaiknya diarsipkan daripada dihapus permanen.
16. Hasil session lama harus tetap konsisten walaupun template diperbarui.
17. Photo processing yang berat dapat dijalankan asynchronous.
18. File upload harus divalidasi.
19. Media tenant tidak boleh dapat diakses tenant lain.
20. Payment status harus diverifikasi berdasarkan hasil provider.

---

# 14. Edge Cases

## Camera

- User menolak camera permission.
- Kamera tidak tersedia.
- Kamera sedang digunakan aplikasi lain.
- Browser tidak mendukung camera API.
- Camera disconnect saat session.

## Capture

- Capture gagal.
- Foto corrupt.
- Retake melebihi batas.
- User meninggalkan session.

## Template

- Template inactive.
- Template dihapus saat sedang digunakan.
- Photo slot tidak valid.
- File template corrupt.
- Template terlalu besar.
- Template tidak sesuai ukuran canvas.

## Session

- Session timeout.
- Processing gagal.
- User refresh browser.
- Network terputus.
- Result gagal dibuat.

## Subscription

- Quota habis.
- Subscription expired.
- Payment pending.
- Renewal gagal.

## Storage

- Upload gagal.
- Storage unavailable.
- File tidak ditemukan.
- Result expired berdasarkan retention policy.

---

# 15. Non-Functional Requirements

## 15.1 Security

Sistem harus menyediakan:

- HTTPS.
- Secure authentication.
- Authorization.
- Role/permission.
- Tenant isolation.
- API protection.
- Input validation.
- File validation.
- Media access control.
- Audit log.

## 15.2 Performance

Dashboard dan API harus responsif.

Image processing yang berat sebaiknya menggunakan background job/asynchronous process agar tidak menghambat request utama.

## 15.3 Scalability

Sistem harus dapat dikembangkan dari puluhan menjadi ratusan atau ribuan tenant.

Komponen yang perlu dapat di-scale:

- Backend.
- Database.
- Storage.
- Image processing.

## 15.4 Availability

Sistem membutuhkan:

- Database backup.
- Media backup sesuai kebutuhan.
- Error logging.
- Monitoring.
- Recovery mechanism.

## 15.5 Usability

- Dashboard responsive.
- Photobooth interface sederhana.
- Customer flow singkat.
- Tombol action mudah dipahami.
- Full-screen mode untuk on-site.
- Mendukung desktop/tablet/mobile sesuai kebutuhan.

---

# 16. Data Requirements

## Main Entities

1. Users.
2. Tenants.
3. Roles.
4. Permissions.
5. Subscription Plans.
6. Tenant Subscriptions.
7. Packages.
8. Events.
9. Event Operators.
10. Templates.
11. Template Versions.
12. Template Photo Slots.
13. Photo Sessions.
14. Photos.
15. Customers.
16. Transactions.
17. Payments.
18. Notifications.
19. Media Files.
20. Audit Logs.

Detail field dan relationship dibahas pada Database Specification/ERD.

---

# 17. API/Product Boundary

Frontend menggunakan React dan berkomunikasi dengan Laravel melalui REST API.

```text
React
  ↓
REST API
  ↓
Laravel
  ↓
Business Logic
  ↓
MySQL
```

Contoh domain API:

```text
/auth
/tenants
/users
/subscriptions
/packages
/events
/templates
/sessions
/photos
/customers
/transactions
/payments
/gallery
/notifications
/reports
```

Endpoint detail, request/response JSON, authentication flow, status code, dan validation rules dibahas pada API Specification.

---

# 18. UI/UX Requirements

## Dashboard

Layout umum:

```text
Sidebar
 ├── Dashboard
 ├── Events
 ├── Packages
 ├── Templates
 ├── Sessions
 ├── Customers
 ├── Transactions
 ├── Reports
 ├── Subscription
 └── Settings
```

## Template Management

Target flow:

```text
Templates
 ↓
Add Template
 ↓
Upload Design
 ↓
Template Information
 ↓
Paper Size
 ↓
Orientation
 ↓
Photo Slot Configuration
 ↓
Preview
 ↓
Save
```

## Photobooth

UI harus fokus pada:

- Camera preview.
- Countdown.
- Capture button.
- Retake.
- Progress photo.
- Template selection.
- Result.

Tidak menggunakan elemen dashboard yang tidak diperlukan pada mode photobooth.

---

# 19. MVP Definition

MVP harus mencakup:

## Platform

- Authentication.
- Multi-tenant.
- Tenant management.
- User/role management.
- Subscription plan.
- Tenant subscription.

## Business

- Business profile.
- Package management.
- Event management.
- Operator management.
- Template management.

## Template

- Upload design.
- Template metadata.
- Paper size.
- Orientation.
- Photo slot.
- Preview.
- Active/inactive.
- Event assignment.

## Photobooth

- On-site mode.
- Online mode.
- Camera access.
- Countdown.
- Capture.
- Retake.
- Template selection.
- Generate result.
- Digital download.
- QR result.

## Dashboard

- Tenant dashboard.
- Session statistics.
- Event statistics.
- Basic transaction data.

---

# 20. Phase 2

- Payment gateway.
- Automatic subscription renewal.
- Email notification.
- Advanced reporting.
- PDF/Excel export.
- Custom branding.
- Custom photobooth URL.
- Advanced gallery.
- Print integration.
- Multiple booth/device management.

---

# 21. Phase 3

- AI photo editing.
- AI background removal.
- AI effects.
- AR filter.
- Video booth.
- WhatsApp delivery.
- Custom domain.
- Multi-branch.
- Advanced analytics.
- Public template marketplace.
- Third-party API.

---

# 22. Product Metrics / KPI

## SaaS Metrics

- Total tenant.
- Active tenant.
- MRR.
- Customer retention.
- Subscription conversion.
- Renewal rate.

## Photobooth Metrics

- Total event.
- Total session.
- Total photo.
- Total customer.
- On-site session.
- Online session.

## Operational Metrics

- Session success rate.
- Photo processing success rate.
- System availability.
- Average API response time.
- Error rate.

## Product Usage

Tambahan metric yang dapat digunakan:

- Template usage.
- Popular template.
- Average photos/session.
- Retake rate.
- Result download rate.
- QR access rate.

---

# 23. Acceptance Criteria

## Authentication

- User dapat register.
- User dapat login.
- User dapat logout.
- User dapat reset password.
- Role menentukan akses.

## Tenant

- Super Admin dapat mengelola tenant.
- Tenant hanya dapat mengakses datanya sendiri.
- Tenant dapat mengelola business profile.

## Package

- Tenant dapat membuat package.
- Tenant dapat mengubah package.
- Tenant dapat mengaktifkan/nonaktifkan package.

## Event

- Tenant dapat membuat event.
- Tenant dapat memilih package.
- Tenant dapat memilih template.
- Tenant dapat assign operator.
- Status event dapat berubah.

## Template

- Admin dapat upload desain.
- Admin dapat memberikan nama template.
- Admin dapat menentukan paper size.
- Admin dapat menentukan orientation.
- Admin dapat membuat photo slot.
- Admin dapat melihat preview.
- Admin dapat mengaktifkan/nonaktifkan template.
- Template dapat ditugaskan ke event.
- Customer hanya melihat template yang tersedia.

## On-Site

- Customer dapat memulai session.
- Camera dapat digunakan.
- Countdown berjalan.
- Foto dapat diambil.
- Customer dapat retake.
- Template dapat dipilih.
- Final result dapat dibuat.
- Result dapat di-download/diakses melalui QR.

## Online

- Customer dapat membuka link.
- Customer dapat menggunakan camera.
- Customer dapat capture.
- Customer dapat retake.
- Customer dapat memilih template.
- Final result dapat dibuat.
- Result dapat di-download/share.

## Security

- Tenant tidak dapat mengakses tenant lain.
- Media memiliki access control.
- Role/permission berjalan.
- File upload divalidasi.

---

# 24. Success Criteria

Produk dianggap berhasil apabila:

1. Bisnis dapat membuat tenant.
2. Tenant dapat mengatur bisnisnya.
3. Tenant dapat membuat package.
4. Tenant dapat membuat event.
5. Tenant dapat mengelola operator.
6. Tenant dapat upload dan mengatur template desain.
7. Customer dapat menggunakan on-site photobooth.
8. Customer dapat menggunakan online photobooth.
9. Customer dapat capture dan retake.
10. Customer dapat memilih template.
11. Sistem dapat menghasilkan final image.
12. Customer dapat mengambil hasil melalui download/QR.
13. Tenant dapat memantau session.
14. Tenant dapat melihat statistik dasar.
15. Data antar tenant tetap terisolasi.
16. Subscription dapat dipantau.
17. Sistem dapat menangani kegagalan camera, processing, dan storage dengan pesan yang sesuai.

---

# 25. Risks & Product Mitigation

| Risk | Impact | Product Mitigation |
|---|---|---|
| Storage foto membesar | High | Object storage + retention |
| Traffic meningkat | High | Scalable architecture |
| Tenant data leak | Critical | Tenant isolation |
| Image processing lambat | High | Async/background processing |
| Camera tidak kompatibel | Medium | Browser Camera API |
| Payment gateway error | Medium | Status handling + retry |
| Subscription expired | Medium | Notification + access control |
| Foto hilang | High | Backup + redundancy |
| Upload file berbahaya | High | File validation/security |
| Template tidak sesuai | High | Validation + preview |
| Result gagal dibuat | High | Retry + processing status |

---

# 26. Dependencies

- Browser Camera API.
- Object/File Storage.
- Payment Gateway.
- Email Service.
- QR Code library/service.
- Image processing library/service.
- Cloud/VPS.
- Monitoring service.

Provider dan teknologi spesifik ditentukan pada Technical Specification.

---

# 27. Technology Direction

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Laravel |
| Database | MySQL |
| API | REST API |
| Authentication | Laravel API Authentication |
| File Storage | TBD |
| Image Processing | TBD |
| Payment Gateway | TBD |
| Email | TBD |
| Deployment | TBD |

Arsitektur:

```text
User
 ↓
React Frontend
 ↓
REST API
 ↓
Laravel Backend
 ↓
MySQL
```

Media:

```text
React
 ↓
Laravel API
 ↓
Object/File Storage
```

Detail versi framework, package, endpoint, queue, cache, server, dan deployment dibahas pada Technical Specification.

---

# 28. Product Backlog Prioritas

| Priority | Feature |
|---|---|
| P0 | Authentication |
| P0 | Multi-tenant |
| P0 | Tenant management |
| P0 | Event management |
| P0 | Template management |
| P0 | Photo session |
| P0 | On-site photobooth |
| P0 | Online photobooth |
| P0 | Camera capture |
| P0 | Photo processing |
| P0 | Final result |
| P0 | Download/QR |
| P1 | Package management |
| P1 | Operator management |
| P1 | Gallery |
| P1 | Dashboard |
| P1 | Subscription |
| P1 | Customer management |
| P1 | Transaction |
| P2 | Payment gateway |
| P2 | Printing |
| P2 | Advanced reporting |
| P2 | Custom branding |
| P3 | AI features |
| P3 | WhatsApp |
| P3 | Multi-branch |
| P3 | Marketplace |

---

# 29. Definition of Done

Sebuah feature dianggap selesai apabila:

1. Requirement telah diimplementasikan.
2. UI/UX telah sesuai requirement.
3. API telah tersedia jika diperlukan.
4. Validation telah diterapkan.
5. Authorization telah diterapkan.
6. Tenant isolation telah diverifikasi.
7. Error handling tersedia.
8. Data tersimpan dengan benar.
9. Feature telah diuji.
10. Acceptance criteria terpenuhi.
11. Tidak terdapat bug critical/blocker.
12. Dokumentasi teknis tersedia bila diperlukan.

---

# 30. Derived Documents

PRD ini menjadi dasar untuk:

1. Use Case Diagram.
2. Use Case Specification.
3. Activity Diagram.
4. Sequence Diagram.
5. ERD.
6. LRS.
7. Database Specification.
8. API Specification.
9. Technical Specification.
10. UI/UX Specification.
11. Test Case.
12. Deployment Specification.

---

# 31. Kesimpulan

Photobooth SaaS dirancang sebagai platform multi-tenant yang menggabungkan **on-site photobooth dan online photobooth** dalam satu ekosistem.

Fokus produk adalah menyediakan pengalaman photobooth yang sederhana bagi customer sekaligus menyediakan sistem manajemen yang lengkap bagi bisnis. Tenant dapat mengelola package, event, operator, template desain, session, customer, transaksi, dan hasil foto.

Bagian template menjadi salah satu komponen utama produk. Template tidak hanya berupa file gambar, tetapi memiliki konfigurasi **paper size, orientation, dan photo slot** sehingga sistem dapat menempatkan hasil capture ke layout yang telah ditentukan dan menghasilkan final image yang siap digunakan secara digital maupun untuk pengembangan printing.

Implementasi menggunakan:

```text
React
   ↓
REST API
   ↓
Laravel
   ↓
MySQL
   ↓
Object/File Storage
```

PRD ini menjadi acuan produk sebelum masuk ke tahap **Use Case, ERD/LRS, API Specification, Technical Specification, dan UI/UX Design**.

---

**PRD Version:** 1.0  
**Status:** Draft  
**Backend:** Laravel  
**Frontend:** React  
**Database:** MySQL  
**Architecture:** Multi-Tenant SaaS  
**Photobooth Mode:** On-Site + Online
