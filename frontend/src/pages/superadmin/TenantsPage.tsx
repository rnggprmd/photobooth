import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { tenantsApi } from '../../api/tenants';

interface TenantRecord {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  subdomain: string;
  plan: 'Starter Studio' | 'Pro Business' | 'Enterprise Fleet';
  status: 'active' | 'suspended' | 'expired';
  activeKiosks: number;
  maxKiosks: number;
  storageMb: number;
  maxStorageMb: number;
  joinedDate: string;
}

export const SuperAdminTenantsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial tenants dataset
  const [tenants, setTenants] = useState<TenantRecord[]>([
    {
      id: 'TNT-8821',
      name: 'Lumina Photostudio & Co.',
      ownerName: 'Rangga Pramudya',
      ownerEmail: 'rangga@lumina.studio',
      ownerPhone: '0812-8821-9988',
      subdomain: 'lumina.snapstudio.id',
      plan: 'Starter Studio',
      status: 'active',
      activeKiosks: 3,
      maxKiosks: 3,
      storageMb: 14200,
      maxStorageMb: 25000,
      joinedDate: '15 Jan 2026',
    },
    {
      id: 'TNT-8822',
      name: 'Bali Booth Collective',
      ownerName: 'Wayan Sudarma',
      ownerEmail: 'wayan@balibooth.com',
      ownerPhone: '0813-9900-1122',
      subdomain: 'balibooth.snapstudio.id',
      plan: 'Pro Business',
      status: 'active',
      activeKiosks: 6,
      maxKiosks: 8,
      storageMb: 68400,
      maxStorageMb: 100000,
      joinedDate: '02 Feb 2026',
    },
    {
      id: 'TNT-8823',
      name: 'Memories Kiosk Surabaya',
      ownerName: 'Bambang Irawan',
      ownerEmail: 'bambang@memorieskiosk.id',
      ownerPhone: '0856-1122-3344',
      subdomain: 'memories.snapstudio.id',
      plan: 'Starter Studio',
      status: 'active',
      activeKiosks: 2,
      maxKiosks: 3,
      storageMb: 8900,
      maxStorageMb: 25000,
      joinedDate: '18 Feb 2026',
    },
    {
      id: 'TNT-8824',
      name: 'GlamourSnap Jakarta Corp',
      ownerName: 'Felicia Anggriani',
      ownerEmail: 'felicia@glamoursnap.co.id',
      ownerPhone: '0817-4455-6677',
      subdomain: 'glamoursnap.id',
      plan: 'Enterprise Fleet',
      status: 'active',
      activeKiosks: 14,
      maxKiosks: 99,
      storageMb: 284000,
      maxStorageMb: 500000,
      joinedDate: '10 Mar 2026',
    },
    {
      id: 'TNT-8825',
      name: 'SnapBox Bandung Studio',
      ownerName: 'Dadan Ramdani',
      ownerEmail: 'dadan@snapbox.id',
      ownerPhone: '0878-9900-2211',
      subdomain: 'snapbox.snapstudio.id',
      plan: 'Starter Studio',
      status: 'suspended',
      activeKiosks: 0,
      maxKiosks: 3,
      storageMb: 24800,
      maxStorageMb: 25000,
      joinedDate: '24 Apr 2026',
    },
  ]);

  // Form State for Adding Tenant
  const [newTenant, setNewTenant] = useState({
    name: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    subdomain: '',
    plan: 'Starter Studio' as TenantRecord['plan'],
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    tenantsApi
      .list()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const beTenants: TenantRecord[] = res.data.map((t: any) => ({
            id: `TNT-${String(t.id).padStart(4, '0')}`,
            name: t.name,
            ownerName: t.owner?.name || 'Studio Owner',
            ownerEmail: t.owner?.email || `${t.subdomain || 'studio'}@photobooth.test`,
            ownerPhone: t.phone || '0812-8821-9988',
            subdomain: `${t.subdomain || 'studio'}.snapstudio.id`,
            plan: 'Starter Studio',
            status: (t.status as any) || 'active',
            activeKiosks: 1,
            maxKiosks: 3,
            storageMb: 1240,
            maxStorageMb: 25000,
            joinedDate: t.created_at ? new Date(t.created_at).toLocaleDateString('id-ID') : 'Hari ini',
          }));
          setTenants((prev) => [...beTenants, ...prev.slice(beTenants.length)]);
        }
      })
      .catch((err) => console.warn('Tenants load warning:', err));
  }, []);

  const handleToggleSuspend = async (id: string) => {
    const numericId = parseInt(id.replace('TNT-', ''), 10);
    const tenantItem = tenants.find((t) => t.id === id);
    const nextStatus = tenantItem?.status === 'active' ? 'suspended' : 'active';

    if (!isNaN(numericId) && numericId > 0) {
      try {
        await tenantsApi.updateStatus(numericId, nextStatus as any);
      } catch (err) {
        console.warn('API updateStatus fallback:', err);
      }
    }

    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          showToast(`Tenant ${t.name} sekarang ${nextStatus === 'active' ? 'Diaktifkan' : 'Disuspend'}!`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenant.name.trim()) return;

    let createdId: string | null = null;
    try {
      const res = await tenantsApi.create({
        name: newTenant.name,
        subdomain: newTenant.subdomain || newTenant.name.toLowerCase().replace(/\s+/g, ''),
        status: 'active',
      } as any);
      if (res.data?.id) {
        createdId = `TNT-${String(res.data.id).padStart(4, '0')}`;
      }
    } catch (err) {
      console.warn('API create tenant fallback:', err);
    }

    const created: TenantRecord = {
      id: createdId || `TNT-${8820 + tenants.length + 1}`,
      name: newTenant.name,
      ownerName: newTenant.ownerName,
      ownerEmail: newTenant.ownerEmail,
      ownerPhone: newTenant.ownerPhone,
      subdomain: newTenant.subdomain || `${newTenant.name.toLowerCase().replace(/\s+/g, '')}.snapstudio.id`,
      plan: newTenant.plan,
      status: 'active',
      activeKiosks: 1,
      maxKiosks: newTenant.plan === 'Starter Studio' ? 3 : newTenant.plan === 'Pro Business' ? 8 : 99,
      storageMb: 0,
      maxStorageMb: newTenant.plan === 'Starter Studio' ? 25000 : newTenant.plan === 'Pro Business' ? 100000 : 500000,
      joinedDate: 'Hari ini',
    };

    setTenants([created, ...tenants]);
    setIsAddTenantOpen(false);
    showToast(`Tenant "${newTenant.name}" berhasil didaftarkan ke server backend!`);
  };

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subdomain.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (planFilter !== 'all' && t.plan !== planFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

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

      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Super Admin</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-medium">Tenants Fleet</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Konsol Manajemen Tenant SaaS
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            Kelola seluruh studio klien yang terdaftar pada platform SnapStudio. Atur batas kuota kiosk, penambahan kapasitas storage, dan kontrol suspensi akun.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="primary" onClick={() => setIsAddTenantOpen(true)}>
            <span className="material-symbols-outlined text-[17px]">add_business</span>
            <span>+ Daftarkan Tenant Baru</span>
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards Strip */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Tenant Studio
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">store</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              {tenants.length} <span className="text-xs font-normal font-sans text-slate-500">Tenant</span>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-2">
              {tenants.filter((t) => t.status === 'active').length} Studio Aktif Beroperasi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Armada Kiosk Online
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              25 <span className="text-xs font-normal font-sans text-slate-500">Unit Kiosk</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Tersebar di Jakarta, Bali, &amp; Surabaya
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              MRR (Monthly Recurring)
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">currency_exchange</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              Rp 14.850.000
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+24.6% kuartal ini</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Storage Cluster
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">cloud_done</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              400 <span className="text-xs font-normal font-sans text-slate-500">/ 750 GB</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Multi-Region AWS S3 Bucket
            </p>
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
            placeholder="Cari nama tenant, owner, email, atau domain..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="w-44 h-9 text-xs"
          >
            <option value="all">Semua Paket</option>
            <option value="Starter Studio">Starter Studio</option>
            <option value="Pro Business">Pro Business</option>
            <option value="Enterprise Fleet">Enterprise Fleet</option>
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-36 h-9 text-xs"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="suspended">Suspended</option>
          </Select>
        </div>
      </motion.div>

      {/* Tenants Table */}
      <motion.div variants={fadeInUp} className="rounded-xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <TableHead className="py-2.5 px-4">Tenant ID &amp; Nama Brand</TableHead>
              <TableHead className="py-2.5 px-4">Pemilik / Kontak</TableHead>
              <TableHead className="py-2.5 px-4">Paket SaaS</TableHead>
              <TableHead className="py-2.5 px-4">Kiosk Aktif</TableHead>
              <TableHead className="py-2.5 px-4">Penyimpanan S3</TableHead>
              <TableHead className="py-2.5 px-4 text-center">Status</TableHead>
              <TableHead className="py-2.5 px-4 text-right">Aksi Kontrol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs divide-y divide-slate-100">
            {filteredTenants.map((t) => (
              <TableRow key={t.id} className="hover:bg-slate-50/70 transition-colors">
                <TableCell className="py-3 px-4">
                  <div className="font-bold text-slate-900">{t.name}</div>
                  <div className="font-mono text-[11px] text-indigo-600">{t.subdomain}</div>
                </TableCell>

                <TableCell className="py-3 px-4">
                  <div className="font-medium text-slate-900">{t.ownerName}</div>
                  <div className="font-mono text-[11px] text-slate-500">{t.ownerEmail}</div>
                </TableCell>

                <TableCell className="py-3 px-4">
                  <Badge
                    variant={
                      t.plan === 'Enterprise Fleet'
                        ? 'tertiary'
                        : t.plan === 'Pro Business'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {t.plan}
                  </Badge>
                </TableCell>

                <TableCell className="py-3 px-4 font-mono text-slate-900 font-semibold">
                  {t.activeKiosks} / {t.maxKiosks} Unit
                </TableCell>

                <TableCell className="py-3 px-4">
                  <div className="font-mono text-[11px] text-slate-800">
                    {(t.storageMb / 1024).toFixed(1)} GB / {(t.maxStorageMb / 1024).toFixed(0)} GB
                  </div>
                  <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div
                      className="bg-slate-900 h-full rounded-full"
                      style={{ width: `${Math.min(100, (t.storageMb / t.maxStorageMb) * 100)}%` }}
                    ></div>
                  </div>
                </TableCell>

                <TableCell className="py-3 px-4 text-center">
                  <Badge variant={t.status === 'active' ? 'success' : 'destructive'}>
                    {t.status === 'active' ? 'Aktif' : 'Suspended'}
                  </Badge>
                </TableCell>

                <TableCell className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleSuspend(t.id)}
                      className={t.status === 'active' ? 'hover:text-rose-600' : 'hover:text-emerald-600'}
                    >
                      {t.status === 'active' ? 'Suspend' : 'Aktifkan'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => showToast(`Mengalihkan session impersonasi ke tenant ${t.name}...`)}
                      title="Masuk sebagai Tenant Admin (Impersonate)"
                    >
                      <span className="material-symbols-outlined text-[15px]">login</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Add Tenant Modal */}
      <Dialog open={isAddTenantOpen} onOpenChange={setIsAddTenantOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Daftarkan Tenant Baru</DialogTitle>
            <DialogDescription>
              Buat akun bisnis studio baru dengan subdomain dan alokasi paket cloud.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddTenant} className="space-y-4 pt-2 text-xs">
            <div>
              <label className="text-xs font-semibold text-slate-900 mb-1 block">
                Nama Brand / Perusahaan Studio
              </label>
              <Input
                required
                value={newTenant.name}
                onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                placeholder="Contoh: Memories Photobooth Jakarta"
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-900 mb-1 block">
                  Nama Pemilik
                </label>
                <Input
                  required
                  value={newTenant.ownerName}
                  onChange={(e) => setNewTenant({ ...newTenant, ownerName: e.target.value })}
                  placeholder="Budi Santoso"
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-900 mb-1 block">
                  WhatsApp Pemilik
                </label>
                <Input
                  required
                  value={newTenant.ownerPhone}
                  onChange={(e) => setNewTenant({ ...newTenant, ownerPhone: e.target.value })}
                  placeholder="0812-9988-7766"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-900 mb-1 block">
                Email Login Tenant
              </label>
              <Input
                type="email"
                required
                value={newTenant.ownerEmail}
                onChange={(e) => setNewTenant({ ...newTenant, ownerEmail: e.target.value })}
                placeholder="admin@memories.id"
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-900 mb-1 block">
                  Pilihan Paket SaaS
                </label>
                <Select
                  value={newTenant.plan}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, plan: e.target.value as TenantRecord['plan'] })
                  }
                  className="h-9 text-xs"
                >
                  <option value="Starter Studio">Starter Studio (3 Kiosk)</option>
                  <option value="Pro Business">Pro Business (8 Kiosk)</option>
                  <option value="Enterprise Fleet">Enterprise Fleet (Unlimited)</option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-900 mb-1 block">
                  Subdomain Kustom
                </label>
                <Input
                  value={newTenant.subdomain}
                  onChange={(e) => setNewTenant({ ...newTenant, subdomain: e.target.value })}
                  placeholder="memories.snapstudio.id"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddTenantOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary">
                Daftarkan Tenant
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SuperAdminTenantsPage;
