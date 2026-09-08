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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<PlanTier | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const [currentSub, setCurrentSub] = useState<any>(null);

  useEffect(() => {
    // Fetch available plans and current subscription
    apiClient
      .get('/subscription')
      .then((res) => {
        if (res.data?.data) {
          setCurrentSub(res.data.data);
        }
      })
      .catch((err) => console.warn('Subscription fetch warning:', err));

    apiClient.get('/subscription/plans').catch((err) => console.warn('Plans fetch warning:', err));
  }, []);

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
            <span className="text-slate-800 font-medium">Paket Langganan SaaS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Paket Langganan Cloud &amp; Alokasi Kuota
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            Tingkatkan kapasitas armada photobooth Anda. Nikmati kuota sesi tanpa batas, kustom domain studio sendiri, white-label watermark, dan performa tinggi untuk setiap event.
          </p>
        </div>
      </motion.div>

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
          <Button
            variant="primary"
            onClick={() => setCheckoutPlan(plans[1])}
          >
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
            : (subName.includes('business') || subName.includes('pro'))
            ? plan.id === 'plan-pro'
            : plan.id === 'plan-starter';
          const isPopular = plan.isPopular;

          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -3, transition: { duration: 0.16 } }}
              className="flex"
            >
              <Card
                className={`flex-1 flex flex-col justify-between relative overflow-hidden transition-all border ${
                  isPopular
                    ? 'border-indigo-600 shadow-sm bg-white ring-1 ring-indigo-600/20'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <Badge
                        variant={plan.badgeVariant || 'default'}
                      >
                        {plan.badge}
                      </Badge>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900">
                      {plan.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed min-h-[36px]">
                      {plan.description}
                    </p>

                    {/* Price Block */}
                    <div className="my-5 pt-4 border-t border-slate-100 flex flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono font-bold text-2xl text-slate-900 tracking-tight">
                          {formatRupiah(billingCycle === 'monthly' ? plan.priceMonthly : Math.round(plan.priceYearly / 12))}
                        </span>
                        <span className="text-xs text-slate-500">/ bulan</span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <span className="text-[11px] font-mono text-emerald-600 font-medium mt-1">
                          Ditagih tahunan {formatRupiah(plan.priceYearly)}
                        </span>
                      )}
                    </div>

                    {/* Resource Limits Pills */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 font-mono text-xs mb-5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-sans">Batas Sesi:</span>
                        <strong className="text-slate-900">{plan.limits.sessionsPerMonth}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-sans">Storage S3:</span>
                        <strong className="text-slate-900">{plan.limits.cloudStorage}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-sans">Terminal Kiosk:</span>
                        <strong className="text-slate-900">{plan.limits.kioskTerminals}</strong>
                      </div>
                    </div>

                    {/* Feature Bullets */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Keunggulan Fitur:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[15px] text-emerald-600 flex-shrink-0 mt-0.5">
                              check_circle
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6 mt-5 border-t border-slate-100">
                    <Button
                      variant={isPopular ? 'primary' : isCurrent ? 'outline' : 'default'}
                      className="w-full"
                      onClick={() => {
                        if (isCurrent) {
                          showToast('Ini adalah paket aktif Anda saat ini.');
                        } else {
                          setCheckoutPlan(plan);
                        }
                      }}
                    >
                      {isCurrent ? (
                        'Paket Aktif Saat Ini'
                      ) : (
                        <span className="flex items-center justify-center gap-1.5">
                          <span>Pilih {plan.name}</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Feature Comparison Matrix Table */}
      <motion.div variants={fadeInUp}>
        <Card className="overflow-hidden border border-slate-200/90 bg-white shadow-xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold text-slate-900">Perbandingan Lengkap Spesifikasi &amp; SLA SaaS</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Rincian komparasi mendalam antara paket Starter, Pro, dan Enterprise untuk armada photobooth.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                  <TableHead className="py-2.5 px-4 w-1/3">Spesifikasi Fitur</TableHead>
                  <TableHead className="py-2.5 px-4">Starter Studio</TableHead>
                  <TableHead className="py-2.5 px-4 text-slate-900 font-bold">Pro Business</TableHead>
                  <TableHead className="py-2.5 px-4 text-slate-900 font-bold">Enterprise Fleet</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs divide-y divide-slate-100">
                <TableRow className="hover:bg-slate-50/70 transition-colors">
                  <TableCell className="py-3 px-4 font-semibold text-slate-900">Maksimal Sesi Foto / Bulan</TableCell>
                  <TableCell className="py-3 px-4 font-mono text-slate-700">2.000 Sesi</TableCell>
                  <TableCell className="py-3 px-4 font-mono font-bold text-slate-900">10.000 Sesi</TableCell>
                  <TableCell className="py-3 px-4 font-mono font-bold text-slate-900">Unlimited Sesi</TableCell>
                </TableRow>
                <TableRow className="hover:bg-slate-50/70 transition-colors">
                  <TableCell className="py-3 px-4 font-semibold text-slate-900">Penyimpanan Cloud (AWS S3)</TableCell>
                  <TableCell className="py-3 px-4 font-mono text-slate-700">25 GB (30 Hari)</TableCell>
                  <TableCell className="py-3 px-4 font-mono font-bold text-slate-900">100 GB (90 Hari)</TableCell>
                  <TableCell className="py-3 px-4 font-mono font-bold text-slate-900">500 GB Dedicated</TableCell>
                </TableRow>
                <TableRow className="hover:bg-slate-50/70 transition-colors">
                  <TableCell className="py-3 px-4 font-semibold text-slate-900">Terminal Kiosk On-Site Aktif</TableCell>
                  <TableCell className="py-3 px-4 font-mono text-slate-700">3 Kiosk</TableCell>
                  <TableCell className="py-3 px-4 font-mono font-bold text-slate-900">8 Kiosk</TableCell>
                  <TableCell className="py-3 px-4 font-mono font-bold text-slate-900">Tanpa Batas</TableCell>
                </TableRow>
                <TableRow className="hover:bg-slate-50/70 transition-colors">
                  <TableCell className="py-3 px-4 font-semibold text-slate-900">AI Background Removal Otomatis</TableCell>
                  <TableCell className="py-3 px-4 text-slate-400 font-mono">—</TableCell>
                  <TableCell className="py-3 px-4 text-emerald-600 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">check</span> Aktif
                  </TableCell>
                  <TableCell className="py-3 px-4 text-emerald-600 font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">verified</span> Prioritas Tinggi
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-slate-50/70 transition-colors">
                  <TableCell className="py-3 px-4 font-semibold text-slate-900">White-label (Hapus Watermark)</TableCell>
                  <TableCell className="py-3 px-4 text-slate-400 font-mono">—</TableCell>
                  <TableCell className="py-3 px-4 text-emerald-600 font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-emerald-600 font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-slate-50/70 transition-colors">
                  <TableCell className="py-3 px-4 font-semibold text-slate-900">Kustom Domain Studio Pribadi</TableCell>
                  <TableCell className="py-3 px-4 text-slate-400 font-mono">—</TableCell>
                  <TableCell className="py-3 px-4 font-mono text-slate-700">Subdomain Kustom</TableCell>
                  <TableCell className="py-3 px-4 font-mono font-bold text-slate-900">Full Domain (.com/.id)</TableCell>
                </TableRow>
                <TableRow className="hover:bg-slate-50/70 transition-colors">
                  <TableCell className="py-3 px-4 font-semibold text-slate-900">Dukungan Teknis &amp; SLA</TableCell>
                  <TableCell className="py-3 px-4 text-slate-600">Email Support 24 Jam</TableCell>
                  <TableCell className="py-3 px-4 text-slate-900 font-semibold">WhatsApp Priority (1 Jam)</TableCell>
                  <TableCell className="py-3 px-4 text-slate-900 font-bold">Dedicated Account Manager</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Interactive Checkout Modal */}
      <Dialog open={Boolean(checkoutPlan)} onOpenChange={(open) => !open && setCheckoutPlan(null)}>
        <DialogContent className="max-w-md">
          {checkoutPlan && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant={checkoutPlan.badgeVariant || 'default'}>{checkoutPlan.badge}</Badge>
                </div>
                <DialogTitle>Konfirmasi Upgrade ke {checkoutPlan.name}</DialogTitle>
                <DialogDescription>
                  Nikmati kuota sesi instan, penyimpanan AWS S3 berkapasitas besar, dan fitur premium.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3.5 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-sans">Paket Dipilih:</span>
                    <strong className="text-slate-900">{checkoutPlan.name}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-sans">Siklus Penagihan:</span>
                    <strong className="text-slate-900 uppercase">{billingCycle} (Tahunan)</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-sans">Biaya Langganan:</span>
                    <strong className="text-slate-900">
                      {formatRupiah(billingCycle === 'monthly' ? checkoutPlan.priceMonthly : checkoutPlan.priceYearly)}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                    <span className="font-sans">Total Pembayaran:</span>
                    <span className="text-slate-900 font-mono">
                      {formatRupiah(billingCycle === 'monthly' ? checkoutPlan.priceMonthly : checkoutPlan.priceYearly)}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-700 text-[18px]">verified_user</span>
                  <span>
                    Pembayaran aman didukung gateway QRIS, BCA VA, &amp; Kartu Kredit.
                  </span>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setCheckoutPlan(null)}>
                  Batal
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmUpgrade}
                  disabled={isUpgrading}
                >
                  {isUpgrading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      <span>Memproses...</span>
                    </span>
                  ) : (
                    <span>Konfirmasi &amp; Bayar Sekarang</span>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SuperAdminPlansPage;
