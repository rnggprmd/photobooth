import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ArrowRight } from 'lucide-react';

type Cycle = 'monthly' | 'yearly';

interface Plan {
  id: string;
  name: string;
  forWho: string;
  monthly?: string;
  yearly?: string;
  yearlyTotal?: string;
  perEventEstimate?: string;
  customNote?: string;
  features: string[];
  cta: string;
  to?: string;
  href?: string;
  dark?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Operator',
    forWho: 'Vendor dengan satu booth, atau yang baru mulai.',
    monthly: 'Rp 299.000',
    yearly: 'Rp 239.000',
    yearlyTotal: 'Ditagih tahunan, Rp 2.868.000',
    perEventEstimate: '± Rp 39.000 / event (basis 6 event)',
    features: [
      '1 kiosk on-site aktif',
      'Sesi foto dan cetak tanpa batas',
      'Cetak tanpa watermark SnapStudio',
      'QR galeri untuk ponsel tamu',
      'Penyimpanan cloud 15 GB',
    ],
    cta: 'Pilih Starter',
    to: '/auth/register',
  },
  {
    id: 'pro',
    name: 'Studio Pro',
    forWho: 'Vendor wedding yang menjalankan beberapa booth sekaligus.',
    monthly: 'Rp 699.000',
    yearly: 'Rp 559.000',
    yearlyTotal: 'Ditagih tahunan, Rp 6.708.000',
    perEventEstimate: '± Rp 46.000 / event (basis 12 event)',
    features: [
      'Sampai 5 kiosk berjalan bersamaan',
      'Driver spooling langsung ke DNP dan Citizen',
      'Subdomain studio sendiri',
      'Kirim foto lewat WhatsApp',
      'Live slideshow untuk layar panggung',
      'Penyimpanan cloud 100 GB',
    ],
    cta: 'Mulai Uji Coba Pro Gratis',
    to: '/auth/register',
    dark: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Agency',
    forWho: 'Agency aktivasi brand dan operator booth lintas kota.',
    customNote: 'Harga menyesuaikan jumlah kiosk dan kebutuhan server.',
    features: [
      'Jumlah kiosk tanpa batas',
      'Whitelabel penuh dengan root domain sendiri',
      'Form lead dan survei yang bisa diatur',
      'Penyimpanan cloud khusus',
      'Kru SnapStudio standby di hari event',
    ],
    cta: 'Hubungi lewat WhatsApp',
    href: 'https://wa.me/6281234567890?text=Halo%20SnapStudio,%20saya%20tertarik%20paket%20Enterprise',
  },
];

export const LandingPricing: React.FC = () => {
  const [cycle, setCycle] = useState<Cycle>('monthly');
  const [showComparison, setShowComparison] = useState(false);

  const toggleBtn = (value: Cycle, label: string) => (
    <button
      type="button"
      onClick={() => setCycle(value)}
      aria-pressed={cycle === value}
      className={`relative z-10 min-h-11 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 ${
        cycle === value ? 'text-stone-950' : 'text-stone-600 hover:text-stone-950'
      }`}
    >
      {cycle === value && (
        <motion.span
          layoutId="pricing-cycle-pill"
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          className="absolute inset-0 bg-white rounded-xl shadow-xs"
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );

  return (
    <section id="pricing" className="w-full py-16 lg:py-24 bg-stone-100 border-b border-stone-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: heading stays in view while the plans scroll */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-4 lg:sticky lg:top-28 self-start space-y-4"
        >
          {/* Accent bar + heading block */}
          <div className="flex gap-4 items-start">
            <div className="hidden sm:flex flex-col items-center gap-1 pt-1.5 shrink-0">
              <div className="w-[3px] h-8 bg-amber-400 rounded-full" />
              <div className="w-[3px] h-2.5 bg-amber-200 rounded-full" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-600 block mb-2">
                Paket Berlangganan Studio
              </span>
              <h2 className="font-heading-xl text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-950 leading-[1.1]">
                Harga per bulan. Tidak ada biaya per sesi.
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Jumlah foto dan cetakan tidak dihitung. Yang membedakan paket hanya jumlah kiosk,
            fitur kirim foto, dan dukungan teknis.
          </p>

          <div className="pt-2">
            <div className="inline-flex p-1 bg-stone-200/90 rounded-2xl border border-stone-300/80">
              {toggleBtn('monthly', 'Bulanan')}
              {toggleBtn('yearly', 'Tahunan (Hemat 20%)')}
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <a
              href="#calculator"
              className="block text-xs sm:text-sm font-semibold text-stone-900 underline underline-offset-4 decoration-2 decoration-amber-500 hover:decoration-stone-950 transition-colors w-fit"
            >
              Hitung dulu berapa porsi biayanya di omset Anda
            </a>

            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
              className="min-h-11 text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{showComparison ? 'Sembunyikan Matriks Fitur' : 'Bandingkan Semua Fitur'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showComparison ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* Right: plans stacked as rows, one per product level */}
        <div className="lg:col-span-8 space-y-5">
          {PLANS.map((plan, i) => {
            const price = cycle === 'monthly' ? plan.monthly : plan.yearly;
            const dark = plan.dark;
            return (
              <motion.article
                key={plan.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ x: 6, transition: { duration: 0.18 } }}
                className={`relative overflow-hidden rounded-2xl p-5 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 transition-all ${
                  dark
                    ? 'bg-stone-950 text-white border border-amber-500/35 shadow-[0_22px_45px_-18px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(245,158,11,0.3)]'
                    : 'bg-[#faf9f6] text-stone-950 border border-stone-300/80 shadow-[0_10px_30px_-10px_rgba(28,25,23,0.07),inset_0_1px_0_rgba(255,255,255,1),inset_0_0_0_1px_rgba(0,0,0,0.03)]'
                }`}
              >
                {/* Texture Layer 1: Tactile Noise Grain (Physical Cotton Paper / Anodized Camera Body) */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply select-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                  aria-hidden="true"
                />

                {/* Texture Layer 2: Precision Engineering Grid / Calibration Dots */}
                {dark ? (
                  <>
                    {/* Laser-Etched Darkroom Calibration Grid */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-[0.07]"
                      style={{
                        backgroundImage: `linear-gradient(to right, rgba(245, 158, 11, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(245, 158, 11, 0.5) 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                        maskImage: 'radial-gradient(ellipse 90% 80% at 70% 30%, black 30%, transparent 80%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 70% 30%, black 30%, transparent 80%)',
                      }}
                      aria-hidden="true"
                    />
                    {/* Warm Studio Spotlight Ambient Highlight */}
                    <div
                      className="absolute -top-24 -right-24 w-80 h-80 pointer-events-none rounded-full blur-3xl opacity-25"
                      style={{
                        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.15) 45%, transparent 70%)',
                      }}
                      aria-hidden="true"
                    />
                    {/* Camera Body Metallic Top Chamfer Line */}
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />
                  </>
                ) : (
                  <>
                    {/* Darkroom Enlarger Baseboard Dot Matrix Grid */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-[0.16]"
                      style={{
                        backgroundImage: `radial-gradient(#44403c 1px, transparent 1px)`,
                        backgroundSize: '18px 18px',
                        maskImage: 'radial-gradient(ellipse 85% 75% at 50% 50%, black 40%, transparent 85%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 50%, black 40%, transparent 85%)',
                      }}
                      aria-hidden="true"
                    />
                    {/* Fine-Art Paper Top Light Bevel */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/90 pointer-events-none" />
                  </>
                )}

                {/* Texture Layer 3: Darkroom Proof Registration Crosshairs (Top-Right & Bottom-Left) */}
                <div
                  className={`absolute top-3.5 right-4 font-mono text-[9px] font-bold tracking-widest pointer-events-none select-none flex items-center gap-1.5 ${
                    dark ? 'text-amber-500/40' : 'text-stone-400/60'
                  }`}
                  aria-hidden="true"
                >
                  <span>[+]</span>
                  <span className="hidden sm:inline">REF: {plan.id.toUpperCase()}</span>
                </div>

                <div className="md:col-span-5 flex flex-col justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      {dark && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold text-[10px] uppercase tracking-wide shadow-xs">
                          Favorit
                        </span>
                      )}
                    </div>
                    <p className={`mt-1.5 text-xs leading-relaxed ${dark ? 'text-stone-300' : 'text-stone-600'}`}>
                      {plan.forWho}
                    </p>

                    <div className="mt-4 sm:mt-5">
                      {price ? (
                        <>
                          <motion.div
                            key={`${plan.id}-${cycle}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex items-baseline gap-1.5"
                          >
                            <span
                              className={`font-heading-xl text-3xl font-extrabold tracking-tight ${
                                dark ? 'text-amber-400' : 'text-stone-950'
                              }`}
                            >
                              {price}
                            </span>
                            <span className={`text-xs ${dark ? 'text-stone-300' : 'text-stone-600'}`}>/ bulan</span>
                          </motion.div>
                          <p className={`mt-1 text-[11px] h-4 font-mono ${dark ? 'text-stone-400' : 'text-stone-500'}`}>
                            {cycle === 'yearly' ? plan.yearlyTotal : plan.perEventEstimate}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="font-heading-xl text-3xl font-extrabold tracking-tight">Custom</div>
                          <p className="mt-1 text-[11px] text-stone-600">{plan.customNote}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Desktop CTA (aligned at bottom of left column) */}
                  <div className="hidden md:block pt-6 mt-auto">
                    {plan.to ? (
                      <Link
                        to={plan.to}
                        className={`inline-flex items-center justify-center gap-2 w-full min-h-11 px-4 py-2.5 rounded-xl text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 ${
                          dark
                            ? 'bg-amber-400 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 text-stone-950 font-extrabold hover:bg-amber-300 hover:from-amber-300 hover:to-amber-400 shadow-[0_6px_20px_-3px_rgba(245,158,11,0.5)] focus-visible:outline-amber-400'
                            : 'bg-stone-950 text-white hover:bg-black shadow-sm hover:shadow-md focus-visible:outline-stone-950'
                        }`}
                      >
                        <span>{plan.cta}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <a
                        href={plan.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full min-h-11 px-4 py-2.5 rounded-xl bg-stone-950 text-xs font-bold text-white hover:bg-black shadow-sm hover:shadow-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
                      >
                        <span>{plan.cta}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <ul className={`md:col-span-7 space-y-2.5 text-xs sm:text-sm self-center relative z-10 pt-2 md:pt-0 ${
                  dark ? 'border-t border-stone-800 md:border-t-0' : 'border-t border-stone-200/80 md:border-t-0'
                }`}>
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        className={`w-4 h-4 mt-0.5 shrink-0 ${dark ? 'text-amber-400' : 'text-emerald-700'}`}
                        strokeWidth={3}
                      />
                      <span className={dark ? 'text-stone-100' : 'text-stone-800'}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Mobile CTA */}
                <div className="md:hidden pt-3 relative z-10">
                  {plan.to ? (
                    <Link
                      to={plan.to}
                      className={`inline-flex items-center justify-center gap-2 w-full min-h-11 px-4 py-2.5 rounded-xl text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 ${
                        dark
                          ? 'bg-amber-400 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 text-stone-950 font-extrabold hover:bg-amber-300 hover:from-amber-300 hover:to-amber-400 shadow-[0_6px_20px_-3px_rgba(245,158,11,0.5)] focus-visible:outline-amber-400'
                          : 'bg-stone-950 text-white hover:bg-black shadow-sm hover:shadow-md focus-visible:outline-stone-950'
                      }`}
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <a
                      href={plan.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full min-h-11 px-4 py-2.5 rounded-xl bg-stone-950 text-xs font-bold text-white hover:bg-black shadow-sm hover:shadow-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}

          {/* Interactive Feature Comparison Table Drawer */}
          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs space-y-3"
              >
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Matriks Perbandingan Fitur
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-stone-700">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-900 font-bold">
                        <th className="py-2 pr-3">Fitur Platform</th>
                        <th className="py-2 px-2 text-center">Starter</th>
                        <th className="py-2 px-2 text-center text-amber-700">Studio Pro</th>
                        <th className="py-2 pl-2 text-center">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-[11px]">
                      <tr>
                        <td className="py-2">Jumlah Kiosk Simultan</td>
                        <td className="py-2 text-center">1 Kiosk</td>
                        <td className="py-2 text-center font-bold text-stone-900">5 Kiosk</td>
                        <td className="py-2 text-center">Tanpa Batas</td>
                      </tr>
                      <tr>
                        <td className="py-2">Direct Spooling DNP &amp; Citizen</td>
                        <td className="py-2 text-center">Standard USB</td>
                        <td className="py-2 text-center text-emerald-600 font-bold">✓ Multi-Spool</td>
                        <td className="py-2 text-center text-emerald-600 font-bold">✓ Failover</td>
                      </tr>
                      <tr>
                        <td className="py-2">Kirim Foto via WhatsApp API</td>
                        <td className="py-2 text-center text-stone-400">Scan QR Only</td>
                        <td className="py-2 text-center text-emerald-600 font-bold">✓ Otomatis</td>
                        <td className="py-2 text-center text-emerald-600 font-bold">✓ Custom WA Sender</td>
                      </tr>
                      <tr>
                        <td className="py-2">Custom Subdomain / Root Domain</td>
                        <td className="py-2 text-center text-stone-400">snapstudio.id/slug</td>
                        <td className="py-2 text-center font-bold">nama.snapstudio.id</td>
                        <td className="py-2 text-center font-bold text-amber-700">foto.domainanda.com</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
};

