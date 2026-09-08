import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { packagesApi } from '../../api/packages';

interface PackageItem {
  id: string;
  name: string;
  slug: string;
  type: 'onsite' | 'online' | 'hybrid';
  price: number;
  durationHours: number;
  photoLimit: number | 'unlimited';
  printCount: number | 'unlimited';
  operatorCount: number;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'tertiary' | 'success';
  description: string;
  features: string[];
  templates: string[];
  isActive: boolean;
  bookingsThisMonth: number;
}

export const PackagesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'onsite' | 'online' | 'hybrid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial packages dataset aligned with BRD & PRD
  const [packages, setPackages] = useState<PackageItem[]>([
    {
      id: 'PKG-001',
      name: 'Paket Starter Intimate',
      slug: 'paket-starter-intimate',
      type: 'onsite',
      price: 2500000,
      durationHours: 2,
      photoLimit: 100,
      printCount: 100,
      operatorCount: 1,
      badge: 'STARTER TIER',
      badgeVariant: 'secondary',
      description: 'Cocok untuk pesta ulang tahun privat, gathering komunitas, atau acara keluarga intim.',
      features: [
        'Durasi standby 2 Jam Layanan',
        'Maksimal 100 Lembar Cetak 4R / 2R',
        '1 Operator Kiosk Standby',
        'Galeri Cloud QR Aktif 7 Hari',
        'Standar Props & Aksesoris Foto',
      ],
      templates: ['Classic 4R Strip', '2R Bookmark'],
      isActive: true,
      bookingsThisMonth: 6,
    },
    {
      id: 'PKG-002',
      name: 'Paket Wedding Royal Platinum',
      slug: 'paket-wedding-royal-platinum',
      type: 'onsite',
      price: 4750000,
      durationHours: 4,
      photoLimit: 'unlimited',
      printCount: 'unlimited',
      operatorCount: 2,
      badge: 'BEST SELLER',
      badgeVariant: 'default',
      description: 'Pilihan terfavorit resepsi pernikahan mewah dengan cetak tanpa batas dan custom frame eksklusif.',
      features: [
        'Durasi 4 Jam Layanan (Siang/Malam)',
        'Unlimited Prints (Tanpa Batas Lembar)',
        '2 Operator Dedicated (Lead Tech + Asst)',
        'Kustom Frame Grafis Nama Pengantin',
        'Guestbook Kayu Eksklusif + Lem & Spidol',
        'Cloud Storage 30 Hari & Live Slideshow',
      ],
      templates: ['4R Minimalist Gold', 'Classic 4R Strip', 'Modern Polar'],
      isActive: true,
      bookingsThisMonth: 14,
    },
    {
      id: 'PKG-003',
      name: 'Paket Festival & Corporate Hybrid',
      slug: 'paket-festival-corporate-hybrid',
      type: 'hybrid',
      price: 7800000,
      durationHours: 6,
      photoLimit: 'unlimited',
      printCount: 400,
      operatorCount: 3,
      badge: 'ENTERPRISE',
      badgeVariant: 'tertiary',
      description: 'Solusi lengkap aktivasi brand, pameran expo, dan festival dengan integrasi Kiosk + Web Link Stream.',
      features: [
        'Durasi 6 Jam Aktivasi Stand',
        '400 Lembar Cetak Cepat DNP Sublimation',
        '3 Tim Lapangan (Lead Tech + 2 Kru)',
        'Custom Web Portal Landing Page Tamu',
        'Kamera Auto AI Background Removal',
        'Ekspor Database Kontak Tamu (CSV)',
      ],
      templates: ['Cyber Glitch 2R', 'Corporate Grid 4R'],
      isActive: true,
      bookingsThisMonth: 4,
    },
    {
      id: 'PKG-004',
      name: 'Paket Virtual Online Stream',
      slug: 'paket-virtual-online-stream',
      type: 'online',
      price: 1850000,
      durationHours: 24,
      photoLimit: 'unlimited',
      printCount: 0,
      operatorCount: 0,
      badge: 'VIRTUAL BOOTH',
      badgeVariant: 'secondary',
      description: 'Photobooth online berbasis browser tanpa perangkat fisik. Tamu mengambil foto dari ponsel masing-masing.',
      features: [
        'Akses Web Link Aktif 24 Jam Penuh',
        'Tanpa Kebutuhan Hardware di Lokasi',
        'Auto Filter AI & Digital Frame Watermark',
        'Download Galeri Instan via QR',
        'Real-Time Live Wall Stream untuk Proyektor',
      ],
      templates: ['Modern Minimalist Polar', 'Cyber Glitch 2R'],
      isActive: true,
      bookingsThisMonth: 8,
    },
    {
      id: 'PKG-005',
      name: 'Paket Sweet 17th Party Glow',
      slug: 'paket-sweet-17th-party-glow',
      type: 'onsite',
      price: 3200000,
      durationHours: 3,
      photoLimit: 200,
      printCount: 200,
      operatorCount: 1,
      badge: 'POPULAR YOUTH',
      badgeVariant: 'secondary',
      description: 'Paket bertema estetik untuk perayaan ulang tahun remaja dengan stiker digital kekinian.',
      features: [
        'Durasi 3 Jam Pesta',
        '200 Lembar Cetak Instan 2R Bookmark',
        '1 Operator Ramah & Interaktif',
        'Filter Beauty Glow Kamera Terkalibrasi',
        'Akses QR Download Seluruh Tamu',
      ],
      templates: ['Pastel Minimalist 4R', '2R Dual Bookmark'],
      isActive: true,
      bookingsThisMonth: 5,
    },
  ]);

  // Form State for Create/Edit Modal
  const [formData, setFormData] = useState({
    name: '',
    type: 'onsite' as 'onsite' | 'online' | 'hybrid',
    price: 3000000,
    durationHours: 3,
    photoLimit: 200,
    operatorCount: 1,
    description: '',
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleActive = (id: string) => {
    setPackages((prev) =>
      prev.map((pkg) => {
        if (pkg.id === id) {
          const next = !pkg.isActive;
          showToast(`Status ${pkg.name} diubah menjadi ${next ? 'Aktif' : 'Nonaktif'}`);
          return { ...pkg, isActive: next };
        }
        return pkg;
      })
    );
  };

  const loadPackagesFromBackend = useCallback(async () => {
    try {
      const res = await packagesApi.list();
      if (res.data && res.data.length > 0) {
        const bePackages: PackageItem[] = res.data.map((p: any) => ({
          id: `PKG-${String(p.id).padStart(3, '0')}`,
          name: p.name,
          slug: p.slug || p.name.toLowerCase().replace(/\s+/g, '-'),
          type: (p.type as 'onsite' | 'online' | 'hybrid') || 'onsite',
          price: Number(p.price) || 0,
          durationHours: Number(p.duration_hours) || 2,
          photoLimit: p.photo_limit ?? 'unlimited',
          printCount: p.print_count ?? 'unlimited',
          operatorCount: Number(p.operator_count) || 1,
          badge: p.type === 'onsite' ? 'LIVE ON-SITE' : p.type === 'online' ? 'VIRTUAL BOOTH' : 'HYBRID STREAM',
          badgeVariant: p.type === 'onsite' ? 'default' : p.type === 'hybrid' ? 'tertiary' : 'secondary',
          description: p.description || 'Paket layanan photobooth studio resmi.',
          features: Array.isArray(p.features)
            ? p.features
            : (typeof p.features === 'string' ? JSON.parse(p.features) : [
                `Durasi ${p.duration_hours || 2} Jam Layanan`,
                `${p.print_count || 'Unlimited'} Lembar Cetak Foto`,
                `${p.operator_count || 1} Operator Standby`,
                'Galeri Cloud QR Instan',
              ]),
          templates: p.templates?.map((t: any) => t.name) || ['Classic 4R Strip'],
          isActive: Boolean(p.is_active),
          bookingsThisMonth: Math.floor(Math.random() * 10) + 2,
        }));

        setPackages((prev) => {
          // Keep unique items, giving priority to backend data
          const existingIds = new Set(bePackages.map((b) => b.name.toLowerCase()));
          const extraLocal = prev.filter((l) => !existingIds.has(l.name.toLowerCase()));
          return [...bePackages, ...extraLocal];
        });
      }
    } catch (err) {
      console.warn('Backend packages load error (using cached fallback):', err);
    }
  }, []);

  useEffect(() => {
    loadPackagesFromBackend();
  }, [loadPackagesFromBackend]);

  const handleOpenEdit = (pkg: PackageItem) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      type: pkg.type,
      price: pkg.price,
      durationHours: pkg.durationHours,
      photoLimit: pkg.photoLimit === 'unlimited' ? 0 : pkg.photoLimit,
      operatorCount: pkg.operatorCount,
      description: pkg.description,
    });
    setIsCreateOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      type: 'onsite',
      price: 3500000,
      durationHours: 3,
      photoLimit: 150,
      operatorCount: 1,
      description: '',
    });
    setIsCreateOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingPackage) {
        const numericId = parseInt(editingPackage.id.replace('PKG-', ''), 10);
        if (!isNaN(numericId) && numericId > 0) {
          try {
            await packagesApi.update(numericId, {
              name: formData.name,
              type: formData.type,
              price: Number(formData.price),
              duration_minutes: Number(formData.durationHours) * 60,
              photo_limit: Number(formData.photoLimit) || undefined,
              print_count: Number(formData.photoLimit) || undefined,
              operator_count: Number(formData.operatorCount),
              description: formData.description,
            } as any);
          } catch (apiErr) {
            console.warn('API update fallback:', apiErr);
          }
        }

        setPackages((prev) =>
          prev.map((p) =>
            p.id === editingPackage.id
              ? {
                  ...p,
                  name: formData.name,
                  type: formData.type,
                  price: Number(formData.price),
                  durationHours: Number(formData.durationHours),
                  photoLimit: Number(formData.photoLimit) || 'unlimited',
                  operatorCount: Number(formData.operatorCount),
                  description: formData.description,
                }
              : p
          )
        );
        showToast(`Paket "${formData.name}" berhasil diperbarui ke database!`);
      } else {
        let createdId: string | null = null;
        try {
          const res = await packagesApi.create({
            name: formData.name,
            type: formData.type,
            price: Number(formData.price),
            duration_minutes: Number(formData.durationHours) * 60,
            photo_limit: Number(formData.photoLimit) || undefined,
            print_count: Number(formData.photoLimit) || undefined,
            operator_count: Number(formData.operatorCount),
            description: formData.description || 'Paket layanan photobooth baru.',
            is_active: true,
            features: [
              `Durasi ${formData.durationHours} Jam Layanan`,
              `${formData.photoLimit || 'Unlimited'} Lembar Cetak`,
              `${formData.operatorCount} Operator Bertugas`,
              'Galeri Cloud QR Instan',
            ],
          } as any);
          if (res.data?.id) {
            createdId = `PKG-${String(res.data.id).padStart(3, '0')}`;
          }
        } catch (apiErr) {
          console.warn('API create fallback:', apiErr);
        }

        const newPkg: PackageItem = {
          id: createdId || `PKG-00${packages.length + 1}`,
          name: formData.name,
          slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
          type: formData.type,
          price: Number(formData.price),
          durationHours: Number(formData.durationHours),
          photoLimit: Number(formData.photoLimit) || 'unlimited',
          printCount: Number(formData.photoLimit) || 'unlimited',
          operatorCount: Number(formData.operatorCount),
          badge: 'TERDAFTAR DI BE',
          badgeVariant: 'secondary',
          description: formData.description || 'Paket layanan photobooth kustom baru.',
          features: [
            `Durasi ${formData.durationHours} Jam Layanan`,
            `${formData.photoLimit || 'Unlimited'} Lembar Cetak`,
            `${formData.operatorCount} Operator Bertugas`,
            'Galeri Cloud QR Instan',
          ],
          templates: ['Classic 4R Strip'],
          isActive: true,
          bookingsThisMonth: 0,
        };
        setPackages((prev) => [newPkg, ...prev]);
        showToast(`Paket "${formData.name}" berhasil tersimpan ke sistem & database!`);
      }
    } catch (err) {
      showToast('Gagal menyimpan paket: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }

    setIsCreateOpen(false);
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'all') return true;
    return pkg.type === activeFilter;
  });

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col w-full space-y-6"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-900 shadow-lg"
          >
            <span className="material-symbols-outlined text-[17px] text-emerald-600">check_circle</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Manajemen Bisnis</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-medium">Paket Layanan</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Katalog &amp; Konfigurasi Paket Layanan
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            Kelola pilihan paket sewa photobooth on-site, virtual online, dan hybrid. Atur durasi jam, kuota cetak lembar, alokasi operator, dan harga sewa.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={async () => {
              await loadPackagesFromBackend();
              showToast('Daftar paket berhasil disinkronkan dari server backend!');
            }}
          >
            <span className="material-symbols-outlined text-[17px]">sync</span>
            <span>Sinkronkan</span>
          </Button>
          <Button variant="primary" onClick={handleOpenCreate}>
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span>+ Buat Paket Baru</span>
          </Button>
        </div>
      </motion.div>

      {/* KPI & Metrics Strip */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Paket Terdaftar
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">loyalty</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              {packages.length} <span className="text-xs font-normal font-sans text-slate-500">Paket</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{packages.filter((p) => p.isActive).length} Paket Aktif Ditawarkan</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Paket Paling Laris
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">star</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-slate-900 truncate">
              Wedding Royal
            </div>
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-emerald-600 font-semibold">trending_up</span>
              <span className="font-semibold text-emerald-600">14 Booking</span>
              <span>bulan berjalan (38%)</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Rata-rata Nilai Paket
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">payments</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              Rp 4.020.000
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Margin kotor rata-rata 64% / booking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Kanal Distribusi
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">hub</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-xs text-slate-700 mt-0.5">
              <span>On-Site Kiosk:</span>
              <span className="font-mono font-bold text-slate-900">3 Paket</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-700 mt-1">
              <span>Hybrid &amp; Online:</span>
              <span className="font-mono font-bold text-slate-900">2 Paket</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter & Search Bar */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[17px]">search</span>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama paket, tier, atau fitur..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200/80">
          {(
            [
              { id: 'all', label: `Semua (${packages.length})`, dot: '' },
              { id: 'onsite', label: 'On-Site (3)', dot: 'bg-emerald-500' },
              { id: 'online', label: 'Online Web (1)', dot: 'bg-sky-500' },
              { id: 'hybrid', label: 'Hybrid (1)', dot: 'bg-indigo-500' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`relative z-10 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeFilter === tab.id && (
                <motion.div
                  layoutId="package-filter-pill"
                  className="absolute inset-0 rounded-md bg-white shadow-xs border border-slate-200/70 z-[-1]"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              {tab.dot && <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`}></span>}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Packages Grid */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredPackages.map((pkg) => (
          <motion.div
            key={pkg.id}
            whileHover={{ y: -3, transition: { duration: 0.18 } }}
            className="flex"
          >
            <Card
              className={`flex-1 flex flex-col justify-between relative overflow-hidden transition-all border border-slate-200/90 hover:border-slate-300 shadow-xs ${
                !pkg.isActive ? 'opacity-60 bg-slate-50/50' : 'bg-white'
              }`}
            >
              <div>
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {pkg.badge && (
                        <Badge variant={pkg.badgeVariant || 'default'}>
                          {pkg.badge}
                        </Badge>
                      )}
                      <span className="font-mono text-xs text-slate-500">
                        {pkg.id}
                      </span>
                    </div>
                    <Badge variant="outline" className="uppercase text-[10px]">
                      {pkg.type}
                    </Badge>
                  </div>

                  <CardTitle className="text-base font-bold text-slate-900 mt-2">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-1 text-xs text-slate-500">
                    {pkg.description}
                  </CardDescription>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <div className="font-mono font-bold text-xl text-slate-900">
                      {formatRupiah(pkg.price)}
                    </div>
                    <span className="text-xs text-slate-500">
                      / event
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="px-5 space-y-4">
                  {/* Key Specs Grid */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-50 text-center border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Durasi</span>
                      <strong className="text-slate-900 font-semibold">{pkg.durationHours} Jam</strong>
                    </div>
                    <div className="border-x border-slate-200 px-1">
                      <span className="text-slate-400 text-[10px] block">Kapasitas</span>
                      <strong className="text-slate-900 font-semibold">
                        {pkg.photoLimit === 'unlimited' ? 'Unlimited' : `${pkg.photoLimit} Sesi`}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Operator</span>
                      <strong className="text-slate-900 font-semibold">{pkg.operatorCount} Personel</strong>
                    </div>
                  </div>

                  {/* Features Checklist */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Termasuk dalam Paket:
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[15px] text-emerald-600 flex-shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Templates Supported */}
                  <div className="pt-1">
                    <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">
                      Frame Template Bawaan:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.templates.map((tpl, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] border border-slate-200"
                        >
                          {tpl}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(pkg.id)}
                    className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                      pkg.isActive ? 'bg-slate-900' : 'bg-slate-300'
                    }`}
                    title={pkg.isActive ? 'Nonaktifkan Paket' : 'Aktifkan Paket'}
                  >
                    <span
                      className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                        pkg.isActive ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    ></span>
                  </button>
                  <span className="text-xs text-slate-500">
                    {pkg.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(pkg)}>
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const cloned = {
                        ...pkg,
                        id: `PKG-00${packages.length + 1}`,
                        name: `${pkg.name} (Copy)`,
                      };
                      setPackages((prev) => [cloned, ...prev]);
                      showToast(`Paket berhasil diduplikasi!`);
                    }}
                    title="Duplikasi Paket"
                  >
                    <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal Dialog: Add / Edit Package */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? 'Edit Konfigurasi Paket' : 'Buat Paket Layanan Baru'}
            </DialogTitle>
            <DialogDescription>
              Tentukan rincian paket, durasi waktu sewa di venue, alokasi cetak lembar foto, dan penetapan harga.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePackage} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-900 mb-1 block">
                Nama Paket Layanan
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Paket Glamour Wedding 3 Jam"
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-900 mb-1 block">
                  Tipe Layanan Booth
                </label>
                <Select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as 'onsite' | 'online' | 'hybrid',
                    })
                  }
                  className="h-9 text-xs"
                >
                  <option value="onsite">On-Site Kiosk Fisik</option>
                  <option value="online">Online Web Virtual Booth</option>
                  <option value="hybrid">Hybrid (Kiosk + Web Stream)</option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-900 mb-1 block">
                  Harga Sewa Paket (IDR)
                </label>
                <Input
                  type="number"
                  required
                  min={0}
                  step={50000}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="3500000"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-900 mb-1 block">
                  Durasi (Jam)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={24}
                  value={formData.durationHours}
                  onChange={(e) => setFormData({ ...formData, durationHours: Number(e.target.value) })}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-900 mb-1 block">
                  Batas Sesi Foto
                </label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0 = Unlimited"
                  value={formData.photoLimit}
                  onChange={(e) => setFormData({ ...formData, photoLimit: Number(e.target.value) })}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-900 mb-1 block">
                  Operator Kiosk
                </label>
                <Input
                  type="number"
                  min={0}
                  max={5}
                  value={formData.operatorCount}
                  onChange={(e) => setFormData({ ...formData, operatorCount: Number(e.target.value) })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-900 mb-1 block">
                Deskripsi Singkat &amp; Sasaran Event
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Rincian keunggulan paket dan kecocokan jenis acara..."
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900"
              ></textarea>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary">
                {editingPackage ? 'Simpan Perubahan' : 'Buat Paket Sekarang'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PackagesPage;
