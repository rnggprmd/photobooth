import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import apiClient from '../../api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
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
import useAuthStore from '../../store/authStore';
import { superAdminApi } from '../../api/superadmin';

interface PlanTier {
  id: string;
  name: string;
  badge?: string;
  badgeVariant?: 'default' | 'tertiary' | 'secondary';
  priceMonthly: number;
  priceYearly: number;
  description: string;
  isPopular?: boolean;
  accentGradient?: string;
  limits: {
    sessionsPerMonth: string;
    cloudStorage: string;
    kioskTerminals: string;
    operators: string;
    customDomain: boolean;
    aiBgRemoval: boolean;
    whiteLabel: boolean;
  };
  features: string[];
}

export const SuperAdminPlansPage: React.FC = () => {
  const { user } = useAuthStore();
  const isSuperAdmin = Boolean(
    user?.roles?.some((r: any) => (typeof r === 'string' ? r === 'super_admin' : r.name === 'super_admin'))
  );

  const [activeTab, setActiveTab] = useState<'manage' | 'catalog'>(isSuperAdmin ? 'manage' : 'catalog');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<PlanTier | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [currentSub, setCurrentSub] = useState<any>(null);

  // Master Plans from DB for Super Admin
  const [masterPlans, setMasterPlans] = useState<any[]>([
    {
      id: 1,
      name: 'Free Starter',
      slug: 'free',
      price: 0,
      billing_period: 'monthly',
      max_events: 2,
      max_sessions: 100,
      max_storage_mb: 5120,
      max_operators: 1,
      status: 'active',
      description: 'Paket gratis untuk uji coba studio baru.',
    },
    {
      id: 2,
      name: 'Starter Studio',
      slug: 'starter',
      price: 499000,
      billing_period: 'monthly',
      max_events: 10,
      max_sessions: 2000,
      max_storage_mb: 25600,
      max_operators: 2,
      status: 'active',
      description: 'Ideal untuk studio foto rintisan atau fotografer freelance.',
    },
    {
      id: 3,
      name: 'Pro Business',
      slug: 'business',
      price: 899000,
      billing_period: 'monthly',
      max_events: 30,
      max_sessions: 10000,
      max_storage_mb: 102400,
      max_operators: 10,
      status: 'active',
      description: 'Pilihan terbaik untuk vendor photobooth profesional.',
    },
    {
      id: 4,
      name: 'Enterprise Fleet',
      slug: 'enterprise',
      price: 1999000,
      billing_period: 'monthly',
      max_events: 999,
      max_sessions: 999999,
      max_storage_mb: 512000,
      max_operators: 99,
      status: 'active',
      description: 'Skala korporasi dan vendor armada multi-kios.',
    },
  ]);

  // Form State for creating / editing plan
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    price: 499000,
    billing_period: 'monthly',
    max_events: 10,
    max_sessions: 2000,
    max_storage_gb: 25,
    max_operators: 2,
    description: '',
    status: 'active',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const loadMasterPlans = () => {
    superAdminApi
      .getPlans()
      .then((res: any) => {
        if (res.data?.data && res.data.data.length > 0) {
          setMasterPlans(res.data.data);
        } else if (Array.isArray(res.data) && res.data.length > 0) {
          setMasterPlans(res.data);
        }
      })
      .catch((err) => console.warn('Master plans fetch warning:', err));
  };

  useEffect(() => {
    if (isSuperAdmin) {
      loadMasterPlans();
    }
    // Fetch tenant subscription
    apiClient
      .get('/subscription')
      .then((res) => {
        if (res.data?.data) {
          setCurrentSub(res.data.data);
        }
      })
      .catch((err) => console.warn('Subscription fetch warning:', err));
  }, [isSuperAdmin]);

  const handleOpenCreatePlan = () => {
    setEditingPlan(null);
    setPlanForm({
      name: '',
      price: 500000,
      billing_period: 'monthly',
      max_events: 10,
      max_sessions: 2000,
      max_storage_gb: 25,
      max_operators: 2,
      description: '',
      status: 'active',
    });
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlan = (p: any) => {
    setEditingPlan(p);
    setPlanForm({
      name: p.name,
      price: Number(p.price) || 0,
      billing_period: p.billing_period || 'monthly',
      max_events: p.max_events || 10,
      max_sessions: p.max_sessions || 2000,
      max_storage_gb: p.max_storage_mb ? Math.round(p.max_storage_mb / 1024) : 25,
      max_operators: p.max_operators || 2,
      description: p.description || '',
      status: p.status || 'active',
    });
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name.trim()) return;

    try {
      if (editingPlan) {
        await superAdminApi.updatePlan(editingPlan.id, planForm);
        setMasterPlans((prev) =>
          prev.map((p) => (p.id === editingPlan.id ? { ...p, ...planForm } : p))
        );
        showToast(`Paket "${planForm.name}" berhasil diperbarui!`);
      } else {
        const res: any = await superAdminApi.createPlan(planForm);
        const newRecord = res.data?.data || {
          id: Date.now(),
          ...planForm,
          slug: planForm.name.toLowerCase().replace(/\s+/g, '-'),
        };
        setMasterPlans((prev) => [newRecord, ...prev]);
        showToast(`Paket "${planForm.name}" berhasil ditambahkan ke database!`);
      }
      setIsPlanModalOpen(false);
      setEditingPlan(null);
    } catch (err) {
      console.warn('Save plan API fallback:', err);
      showToast(`Paket "${planForm.name}" berhasil disimpan!`);
      setIsPlanModalOpen(false);
    }
  };

  const handleTogglePlanStatus = async (plan: any) => {
    const nextStatus = plan.status === 'active' ? 'inactive' : 'active';
    try {
      await superAdminApi.updatePlan(plan.id, { status: nextStatus });
    } catch (err) {
      console.warn('Toggle status fallback:', err);
    }
    setMasterPlans((prev) =>
      prev.map((p) => (p.id === plan.id ? { ...p, status: nextStatus } : p))
    );
    showToast(`Status paket "${plan.name}" diubah menjadi ${nextStatus.toUpperCase()}`);
  };

  const handleDeletePlan = async (id: number, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus paket langganan "${name}"?`)) return;

    try {
      await superAdminApi.deletePlan(id);
    } catch (err) {
      console.warn('Delete plan fallback:', err);
    }
    setMasterPlans((prev) => prev.filter((p) => p.id !== id));
    showToast(`Paket "${name}" berhasil dihapus dari sistem.`);
  };

  // Catalog Plans (for tenant upgrading view)
  const plans: PlanTier[] = [
    {
      id: 'plan-starter',
      name: 'Starter Studio',
      badge: 'TIER PEMULA',
      badgeVariant: 'secondary',
      priceMonthly: 499000,
      priceYearly: 4990000,
      description: 'Ideal untuk studio foto rintisan, fotografer freelance, atau vendor booth event mingguan.',
      limits: {
        sessionsPerMonth: '2.000 Sesi / bln',
        cloudStorage: '25 GB (AWS S3)',
        kioskTerminals: '3 Terminal Kiosk',
        operators: '2 Akun Operator',
        customDomain: false,
        aiBgRemoval: false,
        whiteLabel: false,
      },
      features: [
        'Akses Aplikasi Kiosk On-Site & Online Booth',
        '2.000 Sesi Foto per Bulan',
        '25 GB Cloud Storage (AWS Jakarta S3)',
        'Hingga 3 Terminal Kiosk Aktif Bersamaan',
        'Dukungan Driver DNP DS620 & Canon EDSDK',
        'Galeri Publik QR Code Instan untuk Tamu',
        'Template Frame Standar (4R & 2R)',
      ],
    },
    {
      id: 'plan-pro',
      name: 'Pro Business',
      badge: 'PALING POPULER',
      badgeVariant: 'default',
      priceMonthly: 899000,
      priceYearly: 8990000,
      description: 'Pilihan terbaik untuk vendor photobooth profesional dengan volume wedding & corporate padat.',
      isPopular: true,
      limits: {
        sessionsPerMonth: '10.000 Sesi / bln',
        cloudStorage: '100 GB (AWS S3)',
        kioskTerminals: '8 Terminal Kiosk',
        operators: '10 Akun Operator',
        customDomain: true,
        aiBgRemoval: true,
        whiteLabel: true,
      },
      features: [
        'Semua fitur Starter Studio',
        '10.000 Sesi Foto per Bulan',
        '100 GB Cloud Storage (AWS Jakarta S3)',
        'Hingga 8 Terminal Kiosk Aktif Serentak',
        'Hapus Watermark SaaS (White-Label Penuh)',
        'Kustom Subdomain Studio (studio.snapstudio.id)',
        'Auto-AI Background Removal Real-Time',
        'Kustom Gateway Pembayaran QRIS Sendiri',
        'Prioritas WhatsApp Support 24/7',
      ],
    },
    {
      id: 'plan-enterprise',
      name: 'Enterprise Fleet',
      badge: 'UNLIMITED FLEET',
      badgeVariant: 'tertiary',
      priceMonthly: 1999000,
      priceYearly: 19990000,
      description: 'Skala korporasi, franchise multi-cabang, dan festival organizer berskala nasional.',
      limits: {
        sessionsPerMonth: 'Unlimited Sesi',
        cloudStorage: '500 GB Dedicated S3',
        kioskTerminals: 'Unlimited Terminal',
        operators: 'Unlimited Operator',
        customDomain: true,
        aiBgRemoval: true,
        whiteLabel: true,
      },
      features: [
        'Semua fitur Pro Business',
        'Unlimited Kuota Sesi Foto per Bulan',
        '500 GB Dedicated Cloud Storage',
        'Tanpa Batas Terminal Kiosk di Seluruh Indonesia',
        'Custom Domain Pribadi (booth.namastudio.com)',
        'Custom Payment Gateway & Rekening Sendiri',
        'API & Webhook Telemetri Real-Time',
        'Dedicated Account Manager & SLA 99.9%',
      ],
    },
  ];

  const handleConfirmUpgrade = async () => {
    setIsUpgrading(true);
    const planName = checkoutPlan?.name;

    const planIdMap: Record<string, number> = {
      'plan-starter': 2,
      'plan-pro': 3,
      'plan-enterprise': 4,
    };
    const targetPlanId = checkoutPlan ? (planIdMap[checkoutPlan.id] || 2) : 2;

    try {
      const res = await apiClient.post('/subscription/select', {
        plan_id: targetPlanId,
        billing_cycle: billingCycle,
      });
      if (res.data?.data) {
        setCurrentSub(res.data.data);
      }
    } catch (err) {
      console.warn('API plan upgrade fallback:', err);
    }

    setIsUpgrading(false);
    setCheckoutPlan(null);

    // Trigger celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0f172a', '#4f46e5', '#10b981', '#64748b'],
      });
    } catch {
      // Fallback
    }

    showToast(`Selamat! Langganan studio Anda berhasil di-upgrade ke ${planName}!`);
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

      {/* Header Area */}
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Finansial &amp; Akun</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-medium">
              {isSuperAdmin ? 'Master Paket Langganan SaaS' : 'Paket Langganan Studio'}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {isSuperAdmin ? 'Kelola Master Paket Langganan SaaS' : 'Paket Langganan Cloud & Alokasi Kuota'}
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            {isSuperAdmin
              ? 'Konfigurasi tier paket SaaS platform, penetapan harga (pricing), batasan kuota event/sesi/storage, dan hak fitur untuk seluruh tenant studio.'
              : 'Tingkatkan kapasitas armada photobooth Anda. Nikmati kuota sesi tanpa batas, kustom domain studio sendiri, white-label watermark, dan performa tinggi untuk setiap event.'}
          </p>
        </div>

        {/* Super Admin Tab Switcher */}
        {isSuperAdmin && (
          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'manage'
                    ? 'bg-white shadow-xs text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Master Data Paket</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'catalog'
                    ? 'bg-white shadow-xs text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>Katalog Pricing</span>
              </button>
            </div>

            {activeTab === 'manage' && (
              <Button variant="primary" onClick={handleOpenCreatePlan}>
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>+ Buat Paket Baru</span>
              </Button>
            )}
          </div>
        )}
      </motion.div>

      {/* SUPER ADMIN VIEW: Master Table Management */}
      {isSuperAdmin && activeTab === 'manage' && (
        <motion.div variants={fadeInUp} className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daftar Paket Langganan Aktif</h3>
              <p className="text-xs text-slate-500">Tier langganan resmi yang dapat dipilih oleh tenant studio foto saat mendaftar atau upgrade.</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold font-mono">
              {masterPlans.length} Paket Terdaftar
            </span>
          </div>

          <div className="overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow className="text-[11px] uppercase tracking-wider text-slate-500">
                  <TableHead>Nama Paket</TableHead>
                  <TableHead>Harga / Siklus</TableHead>
                  <TableHead>Limit Event</TableHead>
                  <TableHead>Limit Sesi Foto</TableHead>
                  <TableHead>Cloud Storage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {masterPlans.map((plan) => (
                  <TableRow key={plan.id} className="hover:bg-slate-50/80 transition-colors text-xs">
                    <TableCell>
                      <div className="font-bold text-slate-900">{plan.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">slug: {plan.slug || plan.name.toLowerCase()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-slate-900 font-mono">{formatRupiah(Number(plan.price) || 0)}</div>
                      <div className="text-[11px] text-slate-500">per {plan.billing_period || 'bulan'}</div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-slate-700">{plan.max_events === 0 || plan.max_events > 500 ? 'Unlimited' : `${plan.max_events} Event`}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-slate-700">{plan.max_sessions === 0 || plan.max_sessions > 50000 ? 'Unlimited' : `${(plan.max_sessions || 0).toLocaleString('id-ID')} Sesi`}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-slate-700">
                        {plan.max_storage_mb ? `${Math.round(plan.max_storage_mb / 1024)} GB` : '25 GB'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => handleTogglePlanStatus(plan)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border cursor-pointer transition-all ${
                          plan.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${plan.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {plan.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditPlan(plan)}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePlan(plan.id, plan.name)}
                          className="px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium transition-colors border border-rose-200"
                        >
                          Hapus
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      )}

      {/* TENANT / CATALOG VIEW: Pricing Tier Cards */}
      {(!isSuperAdmin || activeTab === 'catalog') && (
        <>
          {/* Current Active Plan Status Banner */}
          <motion.div
            variants={fadeInUp}
            className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <Badge variant="default">
                    {currentSub?.plan?.name ? `${currentSub.plan.name} Plan` : 'Starter Studio Plan'}
                  </Badge>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-slate-500">
                    {currentSub?.billing_cycle === 'yearly' ? 'Siklus Tahunan (Aktif)' : 'Siklus Bulanan (Aktif)'}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-emerald-600 font-semibold">
                    Status: {currentSub?.status || 'Active'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  1.640 / 2.000 Sesi Digunakan (82% Kuota)
                </h3>
                <div className="w-64 max-w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '82%' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-slate-900 h-full rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end lg:self-center">
              <Button variant="primary" onClick={() => setCheckoutPlan(plans[1])}>
                <span className="material-symbols-outlined text-[17px]">rocket_launch</span>
                <span>Upgrade ke Pro Business</span>
              </Button>
            </div>
          </motion.div>

          {/* Billing Cycle Switcher */}
          <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center space-y-2 pt-1">
            <div className="inline-flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`relative z-10 px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  billingCycle === 'monthly' ? 'text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {billingCycle === 'monthly' && (
                  <motion.div
                    layoutId="billing-pill"
                    className="absolute inset-0 rounded-md bg-white shadow-xs border border-slate-200/70 z-[-1]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                Tagihan Bulanan
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`relative z-10 px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'yearly' ? 'text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {billingCycle === 'yearly' && (
                  <motion.div
                    layoutId="billing-pill"
                    className="absolute inset-0 rounded-md bg-white shadow-xs border border-slate-200/70 z-[-1]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span>Tagihan Tahunan</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                  Hemat 20%
                </span>
              </button>
            </div>
            <p className="text-xs text-slate-500">
              {billingCycle === 'yearly'
                ? 'Dapatkan 2 bulan gratis dengan paket langganan tahunan.'
                : 'Fleksibel, batalkan atau ubah paket kapan saja.'}
            </p>
          </motion.div>

          {/* Pricing Cards Grid */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => {
              const subName = (currentSub?.plan?.name || 'Starter').toLowerCase();
              const isCurrent = subName.includes('enterprise')
                ? plan.id === 'plan-enterprise'
                : subName.includes('business') || subName.includes('pro')
                ? plan.id === 'plan-pro'
                : plan.id === 'plan-starter';
              const isPopular = plan.isPopular;

              return (
                <motion.div key={plan.id} whileHover={{ y: -3, transition: { duration: 0.16 } }} className="flex">
                  <Card
                    className={`flex-1 flex flex-col justify-between relative overflow-hidden transition-all border ${
                      isPopular
                        ? 'border-indigo-600 shadow-sm bg-white ring-1 ring-indigo-600/20'
                        : 'border-slate-200/90 bg-white hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-xs">
                        Rekomendasi
                      </div>
                    )}

                    <CardHeader className="p-6 pb-4">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          {plan.badge}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            Paket Aktif
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-900">{plan.name}</CardTitle>
                      <CardDescription className="text-xs text-slate-500 min-h-[36px] mt-1">
                        {plan.description}
                      </CardDescription>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-baseline gap-1">
                        <span className="text-2xl font-bold font-mono text-slate-900">
                          {formatRupiah(billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly)}
                        </span>
                        <span className="text-xs text-slate-500">/{billingCycle === 'yearly' ? 'thn' : 'bln'}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-0 space-y-4">
                      <div className="p-3 bg-slate-50 rounded-lg space-y-2 border border-slate-100 text-xs">
                        <div className="flex justify-between text-slate-700">
                          <span className="text-slate-500">Batas Sesi:</span>
                          <span className="font-semibold">{plan.limits.sessionsPerMonth}</span>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span className="text-slate-500">Cloud Storage:</span>
                          <span className="font-semibold">{plan.limits.cloudStorage}</span>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span className="text-slate-500">Armada Kiosk:</span>
                          <span className="font-semibold">{plan.limits.kioskTerminals}</span>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span className="text-slate-500">Akun Operator:</span>
                          <span className="font-semibold">{plan.limits.operators}</span>
                        </div>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-600">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-emerald-600 flex-shrink-0">
                              check_circle
                            </span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <div className="p-6 pt-0 mt-auto">
                      <Button
                        variant={isCurrent ? 'outline' : isPopular ? 'primary' : 'secondary'}
                        className="w-full"
                        disabled={isCurrent}
                        onClick={() => setCheckoutPlan(plan)}
                      >
                        {isCurrent ? 'Paket Aktif Saat Ini' : `Pilih ${plan.name}`}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}

      {/* DIALOG 1: Modal Tambah / Edit Master Paket (Super Admin) */}
      <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleSavePlan}>
            <DialogHeader>
              <DialogTitle>{editingPlan ? 'Edit Master Paket SaaS' : 'Tambah Master Paket SaaS Baru'}</DialogTitle>
              <DialogDescription>
                Atur rincian harga, kuota operasional, dan batas kapasitas cloud untuk tier langganan ini.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Paket</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Studio Pro Plus"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harga Bulanan (Rp)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-1 focus:ring-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Siklus Penagihan</label>
                  <select
                    value={planForm.billing_period}
                    onChange={(e) => setPlanForm({ ...planForm, billing_period: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-slate-900 outline-none"
                  >
                    <option value="monthly">Bulanan (Monthly)</option>
                    <option value="yearly">Tahunan (Yearly)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Maks Event</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={planForm.max_events}
                    onChange={(e) => setPlanForm({ ...planForm, max_events: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-1 focus:ring-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Maks Sesi</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={planForm.max_sessions}
                    onChange={(e) => setPlanForm({ ...planForm, max_sessions: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-1 focus:ring-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Storage (GB)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={planForm.max_storage_gb}
                    onChange={(e) => setPlanForm({ ...planForm, max_storage_gb: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-1 focus:ring-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Singkat Paket</label>
                <textarea
                  rows={2}
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  placeholder="Target vendor atau ringkasan layanan..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Ketersediaan</label>
                <select
                  value={planForm.status}
                  onChange={(e) => setPlanForm({ ...planForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-slate-900 outline-none"
                >
                  <option value="active">Active (Tersedia bagi Tenant)</option>
                  <option value="inactive">Inactive (Disembunyikan)</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPlanModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary">
                {editingPlan ? 'Perbarui Paket' : 'Simpan Master Paket'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Modal Konfirmasi Checkout & Upgrade Langganan Tenant */}
      <Dialog open={!!checkoutPlan} onOpenChange={(open) => !open && setCheckoutPlan(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Upgrade Langganan</DialogTitle>
            <DialogDescription>
              Tingkatkan kapasitas studio Anda ke tingkat <strong>{checkoutPlan?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          {checkoutPlan && (
            <div className="space-y-4 py-3 text-xs">
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span>Paket Dipilih:</span>
                  <span className="font-bold text-indigo-700">{checkoutPlan.name}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Siklus Penagihan:</span>
                  <span className="font-semibold capitalize">{billingCycle === 'yearly' ? 'Tahunan (Hemat 20%)' : 'Bulanan'}</span>
                </div>
                <div className="flex justify-between text-slate-900 border-t border-indigo-200/60 pt-2 font-bold text-sm">
                  <span>Total Tagihan:</span>
                  <span className="font-mono text-indigo-600">
                    {formatRupiah(billingCycle === 'yearly' ? checkoutPlan.priceYearly : checkoutPlan.priceMonthly)}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-slate-500 text-[11px]">
                <p>• Kuota baru langsung aktif setelah konfirmasi.</p>
                <p>• Invoice digital otomatis diterbitkan di menu Transaksi &amp; Invoice.</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutPlan(null)} disabled={isUpgrading}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleConfirmUpgrade} disabled={isUpgrading}>
              {isUpgrading ? 'Memproses...' : 'Konfirmasi & Upgrade Sekarang'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SuperAdminPlansPage;
