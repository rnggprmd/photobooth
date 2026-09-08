# BUSINESS REQUIREMENTS DOCUMENT (BRD)
## Sistem SaaS Photobooth — On-Site & Online

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
| Versi Dokumen | 1.0 |
| Status | Draft |

## 2. Ringkasan Eksekutif

Photobooth SaaS adalah platform berbasis web yang menyediakan layanan photobooth **on-site** di lokasi event dan **online** melalui browser dalam satu ekosistem.

Sistem menggunakan konsep **SaaS multi-tenant**, sehingga satu platform dapat digunakan oleh banyak bisnis atau penyedia layanan photobooth. Setiap bisnis memiliki workspace/tenant sendiri untuk mengelola brand, paket, event, template, pengguna, transaksi, dan hasil foto tanpa tercampur dengan tenant lain.

Pada mode on-site, sistem digunakan di lokasi event untuk mengambil foto, memilih template/frame, memproses hasil foto, serta menyediakan hasil digital dan, pada pengembangan lanjutan, mencetak foto.

Pada mode online, customer dapat mengakses photobooth melalui browser, menggunakan kamera perangkat, mengambil foto, memilih template, lalu mengunduh atau membagikan hasilnya.

## 3. Latar Belakang

Bisnis photobooth membutuhkan sistem yang mampu mengelola event, paket, template, customer, hasil foto, transaksi, dan operator secara terintegrasi. Pengelolaan yang tersebar pada beberapa aplikasi dapat menyulitkan operasional dan pelaporan.

Kebutuhan photobooth juga berkembang dari penggunaan di lokasi acara menjadi pengalaman online yang dapat diakses dari perangkat pribadi. Karena itu diperlukan satu platform yang mendukung kedua model tersebut sekaligus dan dapat digunakan oleh banyak bisnis melalui SaaS.

## 4. Business Problem

1. Pengelolaan bisnis photobooth belum terpusat.
2. Pengelolaan event dan sesi masih dapat dilakukan secara manual.
3. Paket dan harga belum terintegrasi dengan pemesanan.
4. Template/frame sulit dikelola ketika jumlahnya bertambah.
5. Hasil foto dan data sesi sulit ditelusuri tanpa sistem terstruktur.
6. On-site dan online photobooth sering membutuhkan sistem terpisah.
7. Pemilik bisnis membutuhkan dashboard operasional.
8. Bisnis dengan banyak operator/cabang membutuhkan kontrol akses.
9. Platform untuk banyak bisnis membutuhkan arsitektur multi-tenant.
10. Data antar bisnis harus terisolasi.

## 5. Business Objectives

1. Membangun platform photobooth SaaS yang mendukung on-site dan online.
2. Memusatkan pengelolaan operasional bisnis photobooth.
3. Mempermudah pengelolaan event, paket, template, operator, dan customer.
4. Menyediakan dashboard dan laporan bisnis.
5. Mendukung subscription SaaS.
6. Memungkinkan satu platform melayani banyak tenant.
7. Menjaga keamanan dan isolasi data antar tenant.
8. Menyediakan fondasi yang dapat dikembangkan ke fitur AI, printing, dan integrasi lainnya.

## 6. Target Pengguna

### 6.1 Super Admin
Mengelola seluruh platform SaaS, tenant, subscription plan, dan statistik platform.

### 6.2 Tenant Admin / Business Owner
Mengelola bisnis, event, paket, template, operator, transaksi, dan hasil foto.

### 6.3 Operator
Menjalankan photobooth on-site dan event yang ditugaskan.

### 6.4 Customer
Menggunakan photobooth, mengambil foto, memilih template, dan memperoleh hasil.

## 7. Model SaaS

Setiap bisnis yang mendaftar memiliki tenant sendiri.

Contoh:
- Tenant A — ABC Photobooth
- Tenant B — XYZ Studio
- Tenant C — Wedding Booth

Data tenant meliputi:
- Profil bisnis
- User
- Paket
- Event
- Template
- Session
- Foto
- Transaksi
- Pengaturan

Tenant A tidak boleh mengakses data Tenant B.

### Subscription Plan

Contoh paket:
- **Free** — fitur dan quota dasar.
- **Starter** — event, session, template, dan online photobooth lebih banyak.
- **Business** — operator lebih banyak, branding, reporting.
- **Enterprise** — custom limit, multi-cabang, custom domain, dan dukungan lanjutan.

Nama paket, harga, dan quota final ditentukan kemudian.

## 8. Scope

### 8.1 In Scope

- Authentication dan authorization
- Multi-tenant management
- Tenant/business management
- Subscription SaaS
- Paket photobooth
- Event management
- Customer management
- Operator management
- Template/frame management
- On-site photobooth
- Online photobooth
- Photo session
- Photo result
- Basic photo editing
- Digital gallery
- QR/link hasil foto
- Transaction management
- Payment integration
- Notification
- Dashboard
- Reporting
- Media/file management
- Role dan permission
- System settings

### 8.2 Out of Scope untuk MVP

- Integrasi seluruh kamera profesional
- Advanced AI photo editing
- AI background removal
- AR filter kompleks
- Video booth kompleks
- Integrasi universal seluruh vendor printer
- Inventaris hardware detail
- Accounting enterprise
- Mobile native app
- Marketplace template publik

## 9. Jenis Photobooth

### 9.1 On-Site

Alur:

Event dibuat → Operator ditugaskan → Customer memulai sesi → Kamera aktif → Countdown → Capture → Retake/lanjut → Pilih template → Proses foto → Hasil final → Download/QR → Print jika fitur tersedia.

### 9.2 Online

Alur:

Customer membuka link → Memberikan izin kamera → Memulai sesi → Capture → Retake/lanjut → Pilih template → Proses foto → Hasil final → Download/Share.

## 9.3 Template Desain / Kertas Photobooth

Template desain merupakan file desain yang digunakan sebagai frame/layout hasil photobooth. Template tidak hanya berupa gambar, tetapi memiliki konfigurasi agar hasil foto dapat ditempatkan pada area foto yang telah ditentukan.

Admin/Tenant dapat:

- Upload file desain/template.
- Memberikan nama desain.
- Menentukan ukuran kertas, misalnya 2R, 4R, 5R, atau custom.
- Menentukan orientasi portrait atau landscape.
- Menentukan jumlah dan posisi photo slot.
- Mengatur ukuran area foto.
- Melihat preview desain.
- Mengaktifkan atau menonaktifkan desain.
- Menghapus desain.
- Menentukan desain yang tersedia pada event tertentu.
- Menyediakan beberapa desain dalam satu event agar customer dapat memilih.
- Menyimpan metadata dan konfigurasi desain.

Format file yang didukung dan aturan ukuran/resolusi final ditentukan pada Technical Specification.

### 9.4 Proses Generate Desain

Setelah customer mengambil foto:

```text
Foto Customer
     ↓
Pilih Template
     ↓
Ambil Konfigurasi Photo Slot
     ↓
Place/Crop/Resize Foto
     ↓
Apply Template/Overlay
     ↓
Generate Final Image
     ↓
Preview
     ↓
Download / QR / Share / Print
```

Hasil akhir harus mengikuti ukuran dan orientasi template yang dipilih.

### 9.5 Print / Kertas Fisik

Sistem dapat menyediakan hasil digital sekaligus mendukung pencetakan pada mode on-site.

Informasi yang perlu diperhatikan:

- Ukuran kertas.
- Orientasi.
- Resolusi hasil.
- Layout foto.
- Margin/print area.
- Status proses print.
- Jumlah copy.

Integrasi printer dan protokol hardware tertentu menjadi pengembangan lanjutan dan akan ditentukan pada Technical Specification.

## 10. Business Process

### 10.1 Registrasi Tenant

Register → Verifikasi → Business Profile → Pilih Subscription → Payment jika diperlukan → Tenant Aktif → Dashboard.

### 10.2 Event

Tenant → Create Event → Pilih Paket → Pilih Template → Assign Operator → Event Active → Photobooth Session → Event Completed → Report.

### 10.3 Photo Session

Start Session → Capture → Retake/Continue → Select Template → Process → Preview → Generate Result → Download/QR/Share.

### 10.4 Subscription

Choose Plan → Checkout → Payment → Subscription Active → Usage Tracking → Renewal → Expired/Renewed.

## 11. Business Requirements

| ID | Requirement | Priority |
|---|---|---|
| BR-001 | Sistem menyediakan registrasi dan login. | High |
| BR-002 | Sistem mendukung multi-tenant. | Critical |
| BR-003 | Data setiap tenant harus terisolasi. | Critical |
| BR-004 | Tenant dapat mengelola profil bisnis. | High |
| BR-005 | Tenant dapat memilih subscription plan. | High |
| BR-006 | Sistem mencatat status subscription. | High |
| BR-007 | Tenant dapat mengelola paket photobooth. | High |
| BR-008 | Tenant dapat membuat dan mengelola event. | High |
| BR-009 | Tenant dapat mengelola operator. | High |
| BR-010 | Tenant dapat mengelola template/frame. | High |
| BR-011 | Sistem mendukung on-site photobooth. | Critical |
| BR-012 | Sistem mendukung online photobooth. | Critical |
| BR-013 | Sistem dapat membuat photo session. | Critical |
| BR-014 | Sistem dapat menyimpan hasil foto. | High |
| BR-015 | Sistem menyediakan hasil melalui QR/link. | High |
| BR-016 | Sistem dapat mencatat transaksi. | High |
| BR-017 | Sistem dapat terintegrasi payment gateway. | Medium |
| BR-018 | Sistem menyediakan dashboard tenant. | High |
| BR-019 | Sistem menyediakan laporan. | Medium |
| BR-020 | Sistem menyediakan role dan permission. | High |
| BR-021 | Super Admin dapat mengelola tenant. | High |
| BR-022 | Super Admin dapat mengelola subscription plan. | High |
| BR-023 | Sistem memonitor penggunaan berdasarkan subscription. | High |
| BR-024 | Sistem menyediakan notifikasi. | Medium |
| BR-025 | Sistem menjaga keamanan dan tenant isolation. | Critical |
| BR-026 | Admin/Tenant dapat mengupload desain/template photobooth. | Critical |
| BR-027 | Admin/Tenant dapat mengatur ukuran, orientasi, dan photo slot template. | High |
| BR-028 | Customer dapat memilih template yang tersedia pada event/sesi. | Critical |
| BR-029 | Sistem dapat menempatkan foto ke photo slot dan menghasilkan final image. | Critical |
| BR-030 | Sistem dapat menyediakan hasil yang sesuai ukuran template untuk download/print. | High |

## 12. Business Rules

### Tenant
1. Setiap bisnis memiliki tenant unik.
2. Setiap tenant memiliki owner/admin.
3. Data tenant hanya dapat diakses oleh user yang memiliki akses.
4. Tenant dengan subscription tidak aktif dapat dibatasi sesuai kebijakan.

### User
1. User harus memiliki akun untuk dashboard.
2. User memiliki role.
3. Permission mengikuti role.
4. Operator hanya mengakses event yang ditugaskan jika aturan tersebut diterapkan.

### Event
1. Event dimiliki oleh tenant.
2. Event memiliki periode pelaksanaan.
3. Event dapat memiliki paket dan template.
4. Status event dapat berupa Draft, Scheduled, Active, Completed, atau Cancelled.

### Photo Session
1. Session harus terkait tenant.
2. Session dapat terkait event.
3. Session dapat menghasilkan satu atau lebih foto.
4. Akses foto mengikuti kebijakan privacy tenant.
5. Retention foto dapat mengikuti subscription atau konfigurasi tenant.

### Subscription
1. Tenant hanya menggunakan fitur sesuai plan.
2. Sistem mencatat periode dan status subscription.
3. Quota dapat diterapkan berdasarkan plan.
4. Upgrade/downgrade mengikuti aturan billing.

## 13. Role & Access

| Fitur | Super Admin | Tenant Admin | Operator | Customer |
|---|---:|---:|---:|---:|
| Platform Dashboard | ✓ | - | - | - |
| Tenant Management | ✓ | - | - | - |
| Subscription | ✓ | ✓ | - | - |
| Business Profile | ✓ | ✓ | - | - |
| User Management | ✓ | ✓ | - | - |
| Package | - | ✓ | - | View |
| Event | - | ✓ | ✓ | - |
| Template | - | ✓ | - | View |
| On-site Photobooth | - | ✓ | ✓ | ✓ |
| Online Photobooth | - | ✓ | - | ✓ |
| Photo Session | View | ✓ | ✓ | ✓ |
| Gallery | View | ✓ | ✓ | ✓ |
| Transaction | ✓ | ✓ | View | View |
| Reports | ✓ | ✓ | Limited | - |
| System Settings | ✓ | ✓ | - | - |

## 14. Functional Requirements

### 14.1 Authentication
- Register
- Login/logout
- Forgot/reset password
- Email verification jika diperlukan
- Role-based authorization
- Session management

### 14.2 Tenant Management
Super Admin dapat melihat, membuat, mengaktifkan/menonaktifkan tenant, melihat subscription, dan melihat penggunaan.

### 14.3 Business Profile
Tenant dapat mengatur nama bisnis, logo, deskripsi, kontak, alamat, social media, branding, dan pengaturan photobooth.

### 14.4 Package Management
Tenant dapat membuat, mengubah, mengaktifkan/menonaktifkan paket serta menentukan harga, durasi, jumlah session, template, dan fitur.

### 14.5 Event Management
Tenant dapat membuat event, menentukan tanggal/lokasi/paket/operator/template, melihat status, dan jumlah session.

### 14.6 Template / Design Management

Tenant dapat:

- Upload file desain/frame photobooth.
- Memberi nama desain.
- Menentukan ukuran kertas.
- Menentukan orientasi.
- Menentukan photo slot.
- Mengatur posisi dan ukuran photo slot.
- Melihat preview.
- Mengaktifkan/menonaktifkan desain.
- Menghapus desain.
- Menentukan event yang dapat menggunakan desain.
- Menyediakan beberapa desain untuk dipilih customer.

Setiap template minimal memiliki metadata desain dan konfigurasi photo slot. Detail format file, resolusi, ukuran canvas, dan metode compositing ditentukan pada Technical Specification.

### 14.7 On-Site Photobooth
Fitur:
- Full-screen mode
- Camera access
- Countdown
- Capture
- Retake
- Photo sequence
- Template selection
- Preview
- Generate final image
- QR result
- Download
- Print support sebagai pengembangan

### 14.8 Online Photobooth
Fitur:
- Camera permission
- Camera preview
- Countdown
- Capture
- Retake
- Template selection
- Preview
- Generate result
- Download
- Share
- QR/link result

### 14.9 Photo Session
Data minimal:
- Session ID
- Tenant
- Event
- Customer jika tersedia
- Mode: On-site / Online
- Start/end time
- Selected template
- Status
- Result

### 14.10 Gallery
Customer dapat melihat, download, dan share hasil. Tenant dapat melihat serta memfilter hasil berdasarkan event/tanggal.

### 14.11 Transaction
Data:
- Transaction ID
- Tenant
- Customer
- Package
- Amount
- Payment method
- Payment reference
- Payment status
- Transaction date

Status: Pending, Paid, Failed, Expired, Refunded.

### 14.12 Subscription Billing
Sistem dapat menangani plan selection, checkout, payment, activation, renewal, expiration, upgrade, downgrade, dan quota.

## 15. Dashboard

### Super Admin
- Total tenant
- Active/inactive tenant
- Subscription
- SaaS revenue
- Subscription yang akan expired
- Platform usage
- Tenant growth

### Tenant
- Total/active event
- Total photo session
- Total customer
- Total transaction
- Revenue
- Active package
- Subscription status
- Usage quota

## 16. Notification

Tenant:
- Registrasi berhasil
- Subscription aktif
- Payment berhasil
- Subscription akan berakhir
- Subscription expired
- Quota hampir habis

Customer:
- Session berhasil
- Foto berhasil diproses
- Link hasil tersedia
- Payment berhasil

Channel dapat berupa in-app, email, dan WhatsApp sebagai pengembangan.

## 17. Payment

Payment gateway dapat digunakan untuk:
1. Subscription SaaS.
2. Pembayaran paket photobooth.
3. Pembayaran online photobooth jika model bisnis menerapkannya.

Metode: Virtual Account, QRIS, e-wallet, bank transfer, dan metode lain dari provider.

Provider payment gateway belum ditentukan pada BRD.

## 18. Reporting

### Event Report
Event, tanggal, lokasi, paket, operator, jumlah session.

### Session Report
Session ID, event, mode, waktu, template, status.

### Transaction Report
Transaction ID, customer, paket, amount, payment status, date.

### Business Report
Revenue, event, session, customer growth, dan paket terpopuler.

Export dapat dikembangkan ke PDF dan Excel/CSV.

## 19. Non-Functional Requirements

### Security
- HTTPS
- Secure authentication
- Role/permission
- Tenant isolation
- API protection
- Input validation
- File validation
- Access control untuk media
- Audit log aktivitas penting

### Performance
Dashboard dan API harus responsif. Image processing yang berat sebaiknya dapat diproses melalui background job/asynchronous process.

### Scalability
Arsitektur harus dapat berkembang dari puluhan hingga ratusan/ribuan tenant dengan scaling pada backend, database, storage, dan processing.

### Availability
- Database backup
- Media backup sesuai kebutuhan
- Error logging
- Monitoring
- Recovery mechanism

### Usability
- UI mudah dipahami
- Responsive
- Dashboard mendukung desktop/tablet/mobile
- Photobooth interface sederhana
- Customer flow sesingkat mungkin

## 20. Data & Storage

### Database
Menggunakan **MySQL** untuk:
- Users
- Tenants
- Roles/permissions
- Subscription
- Packages
- Events
- Template metadata
- Sessions
- Transactions
- Notifications
- Configuration

### File Storage
Foto dan media sebaiknya tidak disimpan sebagai binary langsung di MySQL. Gunakan file/object storage.

- Local storage untuk development.
- Object/cloud storage untuk production.

Provider ditentukan pada Technical Specification.

## 21. Gambaran Entitas Database

Entitas utama:
1. Users
2. Tenants
3. Roles
4. Permissions
5. Subscription Plans
6. Tenant Subscriptions
7. Packages
8. Events
9. Event Operators
10. Templates
11. Photo Sessions
12. Photos
13. Customers
14. Transactions
15. Payments
16. Notifications
17. Media Files
18. Audit Logs

ERD, LRS, dan field detail dibuat pada dokumen database specification.

## 22. Tenant Isolation

Setiap data yang bersifat tenant-specific harus memiliki hubungan dengan tenant.

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

User Tenant A tidak boleh membaca, mengubah, atau menghapus data Tenant B.

## 23. MVP

### Platform
- Authentication
- Multi-tenant
- Tenant management
- User/role management
- Subscription plan
- Tenant subscription

### Business
- Business profile
- Package management
- Event management
- Operator management
- Template management

### Photobooth
- On-site photobooth
- Online photobooth
- Camera access
- Countdown
- Capture
- Retake
- Template selection
- Generate result
- Digital download
- QR result

### Dashboard
- Tenant dashboard
- Session statistics
- Event statistics
- Basic transaction data

## 24. Phase 2

- Payment gateway
- Automatic subscription renewal
- Email notification
- Advanced reporting
- PDF/Excel export
- Custom branding
- Custom photobooth URL
- Advanced gallery
- Print integration
- Multiple booth/device management

## 25. Phase 3

- AI photo editing
- AI background removal
- AI effects
- AR filter
- Video booth
- WhatsApp delivery
- Custom domain
- Multi-branch management
- Advanced analytics
- Public template marketplace
- Third-party API

## 26. KPI

### SaaS
- Jumlah tenant terdaftar
- Tenant aktif
- Monthly Recurring Revenue (MRR)
- Customer retention
- Subscription conversion
- Renewal rate

### Photobooth
- Jumlah event
- Jumlah photo session
- Jumlah hasil foto
- Jumlah customer
- Online session
- On-site session

### Operational
- Session success rate
- Photo processing success rate
- System availability
- Average response time
- Error rate

## 27. Risks & Mitigation

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Storage foto membesar | High | Object storage dan retention policy |
| Traffic meningkat | High | Scalable infrastructure |
| Tenant mengakses tenant lain | Critical | Tenant isolation dan authorization |
| Image processing lambat | High | Background job |
| Kamera tidak kompatibel | Medium | Browser Camera API untuk MVP |
| Payment gateway bermasalah | Medium | Status handling dan retry |
| Subscription expired | Medium | Notification dan access control |
| Foto hilang | High | Backup dan storage redundancy |
| Upload file berbahaya | High | File validation/security scanning |
| Downtime | High | Monitoring, backup, recovery |

## 28. Constraints

1. Backend menggunakan Laravel.
2. Frontend menggunakan React.
3. Database menggunakan MySQL.
4. Sistem berbasis web.
5. MVP mendukung on-site dan online.
6. Arsitektur menggunakan multi-tenant SaaS.
7. Hardware kamera profesional bukan requirement utama MVP.
8. Payment gateway belum ditentukan.
9. Cloud/object storage belum ditentukan.
10. Detail deployment ditentukan pada Technical Specification.

## 29. Dependencies

- Payment Gateway
- Email Service
- Object/File Storage
- Cloud/VPS
- Browser Camera API
- QR Code library/service
- Image processing library/service
- Monitoring service

## 30. Technology Direction

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Laravel |
| Database | MySQL |
| API | REST API |
| Authentication | Laravel API Authentication |
| File Storage | TBD |
| Payment Gateway | TBD |
| Email | TBD |
| Deployment | TBD |

Arsitektur utama:

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

Untuk media:

```text
React
  ↓
Laravel API
  ↓
Object/File Storage
```

Detail versi framework, endpoint API, schema database, queue, cache, server, dan deployment dibahas pada Technical Specification.

## 31. Acceptance Criteria Bisnis

MVP dianggap memenuhi kebutuhan apabila:

1. User dapat register dan login.
2. Super Admin dapat mengelola tenant.
3. Tenant dapat mengelola profil bisnis.
4. Tenant dapat membuat paket.
5. Tenant dapat membuat event.
6. Tenant dapat mengelola operator.
7. Tenant dapat mengelola template.
8. Customer dapat menggunakan on-site photobooth.
9. Customer dapat menggunakan online photobooth.
10. Customer dapat capture dan retake.
11. Customer dapat memilih template.
12. Sistem menghasilkan foto final.
13. Customer memperoleh hasil melalui download atau QR/link.
14. Tenant dapat melihat session.
15. Tenant dapat melihat statistik dasar.
16. Data antar tenant tidak dapat saling diakses.
17. Status subscription dapat diketahui.
18. Penggunaan dapat dibatasi berdasarkan subscription jika quota diterapkan.

## 32. Future Business Model

### Subscription
- Monthly
- Yearly

### Usage Based
Biaya berdasarkan session, foto, storage, atau event.

### Hybrid
Subscription + additional usage.

Contoh:

```text
Business Plan
Rp XXX / bulan

Termasuk:
- 10 Event
- 2.000 Session
- 20 GB Storage
- 5 Operator

Additional Usage:
- Extra Storage
- Extra Session
- Extra Operator
```

Harga final belum ditentukan.

## 33. Overall Product Flow

```text
                    SaaS Platform
                          │
              ┌───────────┴───────────┐
              │                       │
            Tenant                 Customer
              │                       │
       Business Setup           Start Session
              │                       │
         Create Event          On-site / Online
              │                       │
        Select Package           Capture Photo
              │                       │
       Select Template         Select Template
              │                       │
              └───────────┬───────────┘
                          │
                    Process Photo
                          │
                     Final Result
                          │
             ┌────────────┼────────────┐
             │            │            │
          Download       QR          Share
```

## 34. Dokumen Turunan

Setelah BRD disetujui, dokumen yang dapat dibuat:

1. PRD
2. Use Case Diagram
3. Use Case Specification
4. Activity Diagram
5. Sequence Diagram
6. ERD
7. LRS
8. Database Specification
9. API Specification
10. Technical Specification
11. UI/UX Specification
12. Test Case
13. Deployment Specification

## 35. Kesimpulan

Photobooth SaaS merupakan platform multi-tenant yang menggabungkan **on-site photobooth dan online photobooth** dalam satu ekosistem.

Konsep SaaS memungkinkan banyak bisnis menggunakan platform yang sama dengan data, pengguna, branding, event, template, transaksi, dan konfigurasi yang terpisah.

MVP berfokus pada fondasi SaaS, pengelolaan bisnis, event, template, photo session, on-site, online, hasil foto, dan dashboard.

Implementasi teknis menggunakan **React sebagai frontend, Laravel sebagai backend/API, dan MySQL sebagai database**. Detail teknis lebih lanjut ditentukan pada Technical Specification.

---

**BRD Version:** 1.0  
**Status:** Draft  
**Backend:** Laravel  
**Frontend:** React  
**Database:** MySQL  
**Architecture:** Multi-Tenant SaaS  
**Photobooth Mode:** On-Site + Online
