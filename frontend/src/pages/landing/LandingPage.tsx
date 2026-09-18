import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

// Filter Presets for the Live Viewfinder
interface FilterPreset {
  id: string;
  name: string;
  css: string;
  badge: string;
}

const FILTERS: FilterPreset[] = [
  { id: 'normal', name: 'Original Natural', css: 'none', badge: 'Natural' },
  { id: 'vibrant', name: 'Vibrant Pastel', css: 'contrast(1.08) saturate(1.3) brightness(1.05)', badge: 'Populer' },
  { id: 'mono', name: 'Studio Monochrome', css: 'grayscale(1) contrast(1.25) brightness(0.95)', badge: 'B&W' },
  { id: 'warm', name: 'Vintage Warmth', css: 'sepia(0.35) contrast(1.1) saturate(1.15)', badge: 'Warm' },
  { id: 'cyber', name: 'Neon Cyberpunk', css: 'hue-rotate(290deg) saturate(1.4) contrast(1.15)', badge: 'Neon' },
];

// Template Formats for Template Studio
interface TemplateFormat {
  id: '2r' | '4r' | '5r' | 'square';
  title: string;
  subtitle: string;
  slots: number;
  dpiInfo: string;
}

const TEMPLATES: TemplateFormat[] = [
  { id: '2r', title: 'Strip 2x6" (2R)', subtitle: '3 Foto Vertikal • Standard Booth', slots: 3, dpiInfo: '300 DPI (600 x 1800 px)' },
  { id: '4r', title: 'Postcard 4x6" (4R)', subtitle: 'Landscape / 4 Grid Foto', slots: 4, dpiInfo: '300 DPI (1200 x 1800 px)' },
  { id: '5r', title: 'Standard 5x7" (5R)', subtitle: 'Multi Collage 4 Slots', slots: 4, dpiInfo: '300 DPI (1500 x 2100 px)' },
  { id: 'square', title: 'Square 1:1 Polar', subtitle: 'Single Large Focus Frame', slots: 1, dpiInfo: '300 DPI (1200 x 1200 px)' },
];

export const LandingPage: React.FC = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  // Navigation Mobile Drawer
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Hero Simulator Interactive States
  const [activeFilter, setActiveFilter] = useState<FilterPreset>(FILTERS[1]);
  const [frameStep, setFrameStep] = useState(3);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  // Photos used across mockups
  const samplePhotos = [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
  ];

  // Template Studio Interactive States
  const [activeTemplate, setActiveTemplate] = useState<TemplateFormat>(TEMPLATES[0]);
  const [frameBgColor, setFrameBgColor] = useState<string>('#ffffff');
  const [frameText, setFrameText] = useState<string>('NADIA & ARYA WEDDING');
  const [frameSubtext, setFrameSubtext] = useState<string>('08.10.2025 • BOOTHFLOW.LIVE');

  // Pricing Billing Toggle
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Modals
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [solutionModalData, setSolutionModalData] = useState<{ title: string; desc: string; icon: string; items: string[] } | null>(null);

  // Trigger Snap Simulator
  const handleSnap = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    let count = 3;
    setCountdown(count);

    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setCountdown(null);
        setFlashActive(true);
        setTimeout(() => setFlashActive(false), 400);
        setFrameStep((prev) => (prev % 4) + 1);
        setIsCapturing(false);
      }
    }, 700);
  };

  const handleResetSimulator = () => {
    setFrameStep(1);
    setCountdown(null);
    setIsCapturing(false);
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-body-md antialiased selection:bg-brand-indigo-vibrant selection:text-white min-h-screen relative flex flex-col justify-between">
      {/* ================= HEADER NAVBAR (SOLID & MATCHING STITCH DESIGN) ================= */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white border-b border-slate-200 transition-all shadow-sm">
        <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo + Version Pill */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2.5 focus:outline-none rounded-xl group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-indigo-deep via-brand-indigo-vibrant to-accent-coral flex items-center justify-center shadow-md shadow-brand-indigo-vibrant/25 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-white text-[20px]">photo_camera</span>
              </div>
              <div className="flex items-center tracking-tight">
                <span className="font-heading-xl text-xl font-bold text-slate-900">
                  Booth<span className="text-brand-indigo-deep">Flow</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Centered Clean Navigation */}
          <nav className="hidden lg:flex items-center gap-1" id="main-navbar">
            {/* Dropdown 1: Fitur Utama */}
            <div className="relative group">
              <button
                type="button"
                className="nav-btn inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-button-md text-[14px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <span>Fitur Utama</span>
                <span className="material-symbols-outlined text-[15px] transition-transform duration-200 group-hover:rotate-180 text-slate-400">
                  expand_more
                </span>
              </button>
              <div className="dropdown-menu absolute top-full left-0 w-[420px] pt-2 z-50 before:absolute before:-top-2.5 before:left-0 before:right-0 before:h-3 before:content-['']">
                <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xl grid grid-cols-2 gap-2">
                  <a
                    href="#dual-capture"
                    className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2.5 group/item border border-transparent hover:border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-brand-indigo-deep flex items-center justify-center flex-shrink-0 group-hover/item:bg-brand-indigo-vibrant group-hover/item:text-white transition-all">
                      <span className="material-symbols-outlined text-[18px]">devices</span>
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-900 group-hover/item:text-brand-indigo-deep transition-colors">
                        On-Site Kiosk
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Windows &amp; iPad tethering.</p>
                    </div>
                  </a>
                  <a
                    href="#dual-capture"
                    className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2.5 group/item border border-transparent hover:border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-accent-coral flex items-center justify-center flex-shrink-0 group-hover/item:bg-accent-coral group-hover/item:text-white transition-all">
                      <span className="material-symbols-outlined text-[18px]">language</span>
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-900 group-hover/item:text-accent-coral transition-colors">
                        Online Booth
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Web camera tanpa install app.</p>
                    </div>
                  </a>
                  <a
                    href="#template-studio"
                    className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2.5 group/item border border-transparent hover:border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover/item:bg-amber-500 group-hover/item:text-white transition-all">
                      <span className="material-symbols-outlined text-[18px]">dashboard_customize</span>
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-900 group-hover/item:text-amber-600 transition-colors">
                        Frame Studio
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Strip 2R, 4R, 5R 300 DPI.</p>
                    </div>
                  </a>
                  <a
                    href="#enterprise"
                    className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2.5 group/item border border-transparent hover:border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover/item:bg-purple-600 group-hover/item:text-white transition-all">
                      <span className="material-symbols-outlined text-[18px]">hub</span>
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-900 group-hover/item:text-purple-600 transition-colors">
                        Multi-Tenant
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Isolasi DB &amp; telemetri armada.</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Dropdown 2: Solusi */}
            <div className="relative group">
              <button
                type="button"
                className="nav-btn inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-button-md text-[14px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <span>Solusi</span>
                <span className="material-symbols-outlined text-[15px] transition-transform duration-200 group-hover:rotate-180 text-slate-400">
                  expand_more
                </span>
              </button>
              <div className="dropdown-menu absolute top-full left-0 w-60 pt-2 z-50 before:absolute before:-top-2.5 before:left-0 before:right-0 before:h-3 before:content-['']">
                <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-2xl space-y-1">
                  <button
                    type="button"
                    onClick={() =>
                      setSolutionModalData({
                        title: 'Solusi Vendor Wedding',
                        desc: 'Otomatisasi cetak souvenir foto cepat, layout strip nama pengantin, dan QR code instan untuk tamu pesta pernikahan.',
                        icon: 'favorite',
                        items: ['Cetak 8 detik per tamu', 'Tamu bebas pilih filter di kiosk', 'Galeri QR code langsung aktif di smartphone', 'Custom bingkai logo inisial pengantin'],
                      })
                    }
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-accent-coral text-[18px]">favorite</span>
                    <div>
                      <div className="text-[13px] font-medium text-slate-900">Vendor Wedding</div>
                      <div className="text-[11px] text-slate-500">Cetak cepat &amp; QR tamu</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSolutionModalData({
                        title: 'Solusi Brand Activation & Korporat',
                        desc: 'Maksimalkan lead generation, pengumpulan email/WhatsApp sebelum tamu download, dan watermark sponsor di setiap foto.',
                        icon: 'campaign',
                        items: ['Pengumpulan lead & formulir registrasi', 'Watermark sponsor & frame eksklusif kampanye', 'Slideshow proyektor live update', 'Laporan konversi unduhan real-time'],
                      })
                    }
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-brand-indigo-vibrant text-[18px]">campaign</span>
                    <div>
                      <div className="text-[13px] font-medium text-slate-900">Brand Activation</div>
                      <div className="text-[11px] text-slate-500">Lead capture &amp; watermark</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSolutionModalData({
                        title: 'Solusi Kiosk Franchise & Multi-Lokasi',
                        desc: 'Kelola puluhan booth kiosk mandiri di mall, kafe, atau bioskop dari satu dashboard pusat.',
                        icon: 'storefront',
                        items: ['Monitoring sisa roll kertas jarak jauh', 'Integrasi QRIS pembayaran mandiri', 'Pembaruan template serentak via cloud', 'Laporan pendapatan otomatis tiap cabang'],
                      })
                    }
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-amber-500 text-[18px]">storefront</span>
                    <div>
                      <div className="text-[13px] font-medium text-slate-900">Kiosk Franchise</div>
                      <div className="text-[11px] text-slate-500">Fleet monitoring sentral</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <a
              href="#template-studio"
              className="nav-link px-3 py-1.5 rounded-full font-button-md text-[14px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              Template Studio
            </a>
            <a
              href="#pricing"
              className="nav-link px-3 py-1.5 rounded-full font-button-md text-[14px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              Harga Paket
            </a>
            <a
              href="#faq"
              className="nav-link px-3 py-1.5 rounded-full font-button-md text-[14px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              FAQ
            </a>
          </nav>

          {/* Header Right Actions Cluster */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => setDemoModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-button-md text-[13px] font-medium transition-all cursor-pointer border border-slate-200"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px] text-brand-indigo-deep">play_circle</span>
              <span>Live Demo</span>
            </button>

            {token ? (
              <Link
                to="/admin"
                className="inline-flex items-center justify-center bg-brand-indigo-deep hover:bg-brand-indigo-vibrant text-white px-4 h-9 rounded-full text-[13px] font-semibold transition-all shadow-md shadow-brand-indigo-vibrant/25 gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">space_dashboard</span>
                <span>Console Admin</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="inline-flex items-center font-button-md text-[13px] px-3.5 h-9 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-brand-indigo-deep to-brand-indigo-vibrant hover:opacity-95 text-white px-4 h-9 rounded-full font-button-md text-[13px] font-semibold transition-all shadow-md shadow-brand-indigo-vibrant/25 cursor-pointer"
                >
                  Mulai Gratis
                </Link>
              </>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200"
              type="button"
              aria-label="Open Mobile Menu"
            >
              <span className="material-symbols-outlined text-[20px]">
                {mobileNavOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Solid bg-white, no transparency) */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 transition-all space-y-3 shadow-xl">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200 text-sm">
              <a
                href="#hero"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-800 flex items-center gap-2 hover:bg-slate-100 font-medium"
              >
                <span className="material-symbols-outlined text-[18px] text-brand-indigo-vibrant">home</span>
                Beranda
              </a>
              <a
                href="#dual-capture"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-800 flex items-center gap-2 hover:bg-slate-100 font-medium"
              >
                <span className="material-symbols-outlined text-[18px] text-brand-indigo-vibrant">devices</span>
                Dual Capture
              </a>
              <a
                href="#template-studio"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-800 flex items-center gap-2 hover:bg-slate-100 font-medium"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-500">dashboard_customize</span>
                Template Studio
              </a>
              <a
                href="#enterprise"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-800 flex items-center gap-2 hover:bg-slate-100 font-medium"
              >
                <span className="material-symbols-outlined text-[18px] text-purple-600">hub</span>
                Multi-Tenant
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-800 flex items-center gap-2 hover:bg-slate-100 font-medium"
              >
                <span className="material-symbols-outlined text-[18px] text-brand-indigo-vibrant">sell</span>
                Paket Harga
              </a>
              <a
                href="#faq"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-800 flex items-center gap-2 hover:bg-slate-100 font-medium"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-600">help</span>
                FAQ
              </a>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  setDemoModalOpen(true);
                }}
                className="flex-1 h-9 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 border border-slate-200"
              >
                <span className="material-symbols-outlined text-[16px] text-brand-indigo-deep">play_circle</span>
                Live Demo
              </button>
              {token ? (
                <Link
                  to="/admin"
                  className="flex-1 h-9 rounded-full bg-brand-indigo-deep text-white text-xs font-semibold flex items-center justify-center gap-1"
                >
                  Admin Console
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="flex-1 h-9 rounded-full bg-slate-100 text-slate-900 text-xs font-semibold flex items-center justify-center border border-slate-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="flex-1 h-9 rounded-full bg-gradient-to-r from-brand-indigo-deep to-brand-indigo-vibrant text-white text-xs font-semibold flex items-center justify-center"
                  >
                    Mulai Gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>


      {/* ================= MAIN BODY ================= */}
      <main className="w-full pt-16 flex-1">
        {/* 1. HERO SECTION WITH INTERACTIVE VIEWFINDER HUD */}
        <section className="relative w-full pt-14 pb-20 overflow-hidden bg-grid-soft hero-mesh-glow" id="hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Headline Center */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="font-heading-xl text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
                Satu Platform SaaS untuk{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-indigo-deep via-brand-indigo-vibrant to-accent-coral">
                  On-Site &amp; Online
                </span>{' '}
                Photobooth
              </h1>
              <p className="text-slate-600 text-base sm:text-lg mt-5 leading-relaxed">
                Arsitektur cloud terisolasi per tenant untuk vendor event, brand agency, dan operator hardware. Integrasikan kamera browser, kontrol booth on-site sub-detik, dan galeri cloud instan dalam satu ekosistem.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/auth/register"
                  className="px-7 h-12 rounded-full bg-gradient-to-r from-brand-indigo-deep to-brand-indigo-vibrant text-white text-sm sm:text-base font-semibold shadow-lg shadow-brand-indigo-vibrant/30 hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Mulai Uji Coba Gratis</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="px-6 h-12 rounded-full bg-white hover:bg-slate-100 text-slate-800 text-sm sm:text-base font-semibold border border-slate-200/90 shadow-xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-brand-indigo-deep text-[20px]">play_circle</span>
                  <span>Eksplorasi Live Demo</span>
                </button>
              </div>

              {/* Key Metrics Badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-brand-indigo-vibrant text-[18px]">bolt</span>
                  <span>0.4s Cloud Render</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-status-ready text-[18px]">wifi_tethering</span>
                  <span>100% WebRTC Native</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-accent-coral text-[18px]">shield_check</span>
                  <span>SOC2 Isolated Tenant</span>
                </div>
              </div>
            </div>

            {/* Hero Interactive Viewfinder Showcase Card */}
            <div className="max-w-5xl mx-auto relative">
              <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-3 sm:p-5 shadow-2xl shadow-indigo-950/10">
                {/* Window Control Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 px-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <span className="ml-2 font-mono text-xs text-slate-500 font-medium">
                      boothflow-kiosk-live://terminal-01
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-status-ready animate-ping"></span>
                      DSLR Connected (Canon EOS R5)
                    </span>
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[11px]">
                      DNP RX1-HS Ready
                    </span>
                  </div>
                </div>

                {/* Viewfinder & Output Strip Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                  {/* Left: Viewfinder Display (8 cols) */}
                  <div className="lg:col-span-8 relative h-80 sm:h-96 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex flex-col justify-between p-4">
                    {/* Camera Flash Screen */}
                    {flashActive && (
                      <div className="absolute inset-0 bg-white z-40 trigger-flash pointer-events-none" />
                    )}

                    {/* Camera Live Stream Image */}
                    <img
                      alt="Photobooth Live Viewfinder"
                      style={{ filter: activeFilter.css }}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                      src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80"
                    />

                    {/* Top HUD Badges */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-white flex items-center gap-2 border border-white/20 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-accent-coral animate-ping"></span>
                        <span>
                          SMILE! Frame <span className="text-accent-coral font-bold">{frameStep}</span> dari 4
                        </span>
                      </div>
                      <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono text-white/90 border border-white/20 shadow-sm flex items-center gap-1.5">
                        <span className="text-slate-400">Timer:</span>
                        <span className="text-amber-400 font-bold">
                          {countdown !== null ? `0${countdown}s` : '03s Ready'}
                        </span>
                      </div>
                    </div>

                    {/* Center Camera Crosshairs & HUD Focus Box */}
                    <div className="relative z-10 pointer-events-none flex flex-col items-center justify-center self-center my-auto">
                      <div className="w-20 h-20 border-2 border-white/40 rounded-2xl flex items-center justify-center relative">
                        <div className="w-2 h-2 rounded-full bg-accent-coral"></div>
                        <span className="absolute -top-4 text-[9px] font-mono text-white/70 bg-black/40 px-1 rounded">
                          AF-ON
                        </span>
                      </div>
                      <div className="mt-2 text-[10px] font-mono text-white/60 bg-black/40 px-2 py-0.5 rounded">
                        ISO 400 • f/2.8 • 1/125s • 300 DPI
                      </div>
                    </div>

                    {/* Bottom HUD Controls Strip */}
                    <div className="relative z-10 bg-black/75 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between gap-2 border border-white/20">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleResetSimulator}
                          className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition cursor-pointer flex items-center gap-1"
                          type="button"
                          title="Reset Sesi"
                        >
                          <span className="material-symbols-outlined text-[15px]">replay</span>
                          <span>Reset</span>
                        </button>
                        <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-300 font-mono pl-2 border-l border-white/20">
                          <span>Filter:</span>
                          <span className="text-amber-300 font-semibold">{activeFilter.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quick Filter Buttons */}
                        <div className="hidden sm:flex items-center gap-1">
                          {FILTERS.map((f) => (
                            <button
                              key={f.id}
                              onClick={() => setActiveFilter(f)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                                activeFilter.id === f.id
                                  ? 'bg-brand-indigo-vibrant text-white font-bold'
                                  : 'bg-white/10 text-white/70 hover:bg-white/20'
                              }`}
                              type="button"
                            >
                              {f.badge}
                            </button>
                          ))}
                        </div>

                        {/* Snap Demo Trigger Button */}
                        <button
                          onClick={handleSnap}
                          disabled={isCapturing}
                          className="px-4 py-1.5 rounded-full bg-accent-coral hover:bg-rose-600 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-rose-950/40 cursor-pointer disabled:opacity-60"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                          <span>{isCapturing ? 'Menjepret...' : 'Snap Demo'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Realistic Output Photobooth Strip (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="text-center mb-2">
                      <div className="text-xs font-bold text-slate-800">Preview Cetak 2R Strip</div>
                      <div className="text-[10px] text-slate-500">Auto Layout 300 DPI Dye-Sub</div>
                    </div>

                    {/* Physical Photobooth Strip Mockup */}
                    <div className="w-44 bg-white p-2 rounded-xl shadow-lg border border-slate-200/90 flex flex-col gap-1.5">
                      {samplePhotos.slice(0, 3).map((imgUrl, idx) => (
                        <div key={idx} className="h-20 bg-slate-200 rounded overflow-hidden relative shadow-2xs">
                          <img
                            alt={`Photo ${idx + 1}`}
                            style={{ filter: activeFilter.css }}
                            className="w-full h-full object-cover"
                            src={imgUrl}
                          />
                        </div>
                      ))}

                      {/* Strip Footer Branding */}
                      <div className="text-center pt-1.5 pb-0.5 border-t border-slate-100">
                        <div className="font-heading-xl text-[10px] font-bold text-slate-900 tracking-wide">
                          NADIA &amp; ARYA WEDDING
                        </div>
                        <div className="font-mono text-[8px] text-slate-400 mt-0.5">
                          08.10.2025 • BOOTHFLOW.LIVE
                        </div>
                      </div>
                    </div>

                    {/* Floating Guest Instant QR Pill */}
                    <div className="mt-3 w-full bg-white border border-slate-200 rounded-xl p-2 flex items-center gap-2.5 shadow-2xs">
                      <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 text-brand-indigo-deep">
                        <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
                      </div>
                      <div className="text-left overflow-hidden">
                        <div className="text-[11px] font-bold text-slate-800 truncate">UNDUH INSTAN TAMU</div>
                        <p className="text-[9px] text-slate-500 truncate">Scan QR ponsel tanpa install app</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. DUAL CAPTURE ENGINE SECTION */}
        <section className="w-full py-20 bg-white border-y border-slate-200/80" id="dual-capture">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-heading-xl text-2xl sm:text-4xl font-bold text-slate-900">
                Dua Mode Capture Dalam Satu Platform
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Dukungan penuh untuk aktivasi on-site berbasis hardware maupun virtual event online.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: On-Site Booth Mode */}
              <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-8 border border-slate-200 hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-brand-indigo-deep flex items-center justify-center mb-6 shadow-xs">
                    <span className="material-symbols-outlined text-[26px]">devices</span>
                  </div>
                  <h3 className="font-heading-xl text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                    On-Site Kiosk Controller
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Antarmuka fullscreen kiosk untuk iPad, tablet Windows, dan Mini PC. Terintegrasi langsung dengan kamera DSLR/Mirrorless Canon, Sony, dan Nikon serta direct print driver sub-detik.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-status-ready text-[18px]">check_circle</span>
                      <span>Sub-second dye-sublimation print spooling (DNP, Citizen, HiTi)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-status-ready text-[18px]">check_circle</span>
                      <span>Lockdown fullscreen kiosk dengan PIN proteksi operator</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-status-ready text-[18px]">check_circle</span>
                      <span>Telemetri sisa kertas, ribbon, dan overheat kamera realtime</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <Link
                    to="/booth/onsite"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-indigo-deep hover:text-indigo-800 transition-colors"
                  >
                    <span>Uji Coba Mode Kiosk On-Site</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Card 2: Online Web Photobooth */}
              <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-8 border border-slate-200 hover:shadow-xl hover:border-rose-200 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-accent-coral flex items-center justify-center mb-6 shadow-xs">
                    <span className="material-symbols-outlined text-[26px]">language</span>
                  </div>
                  <h3 className="font-heading-xl text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                    Online Web Photobooth
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Tamu cukup mengakses URL microsite via Safari, Chrome, atau Instagram in-app browser. Render bingkai 60 FPS menggunakan WebAssembly tanpa instalasi aplikasi apapun.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-status-ready text-[18px]">check_circle</span>
                      <span>Kompatibel 100% dengan iOS Safari &amp; Android Chrome</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-status-ready text-[18px]">check_circle</span>
                      <span>Filter warna real-time, stiker interaktif &amp; sponsor overlay</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-status-ready text-[18px]">check_circle</span>
                      <span>Koleksi lead (nama, nomor WA/email) sebelum download foto</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <Link
                    to="/booth/online/wedding-demo"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-coral hover:text-rose-700 transition-colors"
                  >
                    <span>Coba Akses Virtual Web Booth</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TEMPLATE & FRAME STUDIO SECTION */}
        <section className="w-full py-20 bg-slate-50" id="template-studio">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-heading-xl text-2xl sm:text-4xl font-bold text-slate-900">
                Template &amp; Frame Studio
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Pilih format cetak standar industri dengan koordinat foto presisi 300 DPI siap pakai.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Selector & Config (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Format &amp; Ukuran Cetak
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => setActiveTemplate(tmpl)}
                        className={`p-3.5 rounded-2xl text-left font-button-md text-xs font-semibold transition-all cursor-pointer ${
                          activeTemplate.id === tmpl.id
                            ? 'bg-brand-indigo-vibrant text-white shadow-md shadow-brand-indigo-vibrant/20'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <div className="font-bold text-sm">{tmpl.title}</div>
                        <div className={`text-[11px] mt-0.5 ${activeTemplate.id === tmpl.id ? 'opacity-90' : 'text-slate-500'}`}>
                          {tmpl.subtitle}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coordinate Info Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-700">
                    <span>Ekspor Master</span>
                    <span className="font-mono text-brand-indigo-deep">{activeTemplate.dpiInfo}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Color Profile</span>
                    <span className="font-mono">sRGB IEC61966-2.1</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Slot Koordinat</span>
                    <span className="font-mono text-emerald-600 font-medium">
                      {activeTemplate.slots} Slot Foto Aktif
                    </span>
                  </div>
                </div>

                {/* Frame Color Theme Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Warna Bingkai Cetak:</label>
                  <div className="flex items-center gap-2">
                    {[
                      { color: '#ffffff', label: 'Putih' },
                      { color: '#090a0f', label: 'Hitam' },
                      { color: '#4f46e5', label: 'Indigo' },
                      { color: '#f43f5e', label: 'Coral' },
                    ].map((col) => (
                      <button
                        key={col.color}
                        type="button"
                        onClick={() => setFrameBgColor(col.color)}
                        style={{ backgroundColor: col.color }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          frameBgColor === col.color ? 'scale-125 border-slate-900 ring-2 ring-indigo-300' : 'border-slate-300'
                        }`}
                        title={col.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Live Frame Text Customizer */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Teks Kustom Frame:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={frameText}
                      onChange={(e) => setFrameText(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-brand-indigo-vibrant"
                      placeholder="Judul Acara / Wedding"
                    />
                    <input
                      type="text"
                      value={frameSubtext}
                      onChange={(e) => setFrameSubtext(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-brand-indigo-vibrant"
                      placeholder="Tanggal & Lokasi"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    to="/admin/templates"
                    className="px-5 h-11 rounded-full bg-brand-indigo-vibrant hover:bg-brand-indigo-deep text-white font-button-md text-xs font-bold transition shadow-sm flex items-center justify-center"
                  >
                    Buka Editor Frame
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDemoModalOpen(true)}
                    className="px-4 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-button-md text-xs font-medium transition cursor-pointer"
                  >
                    Lihat Semua Template
                  </button>
                </div>
              </div>

              {/* Dynamic Live Visual Canvas Showcase (7 cols) */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-100/70 rounded-2xl border border-dashed border-slate-300">
                <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-slate-600">
                  <span className="material-symbols-outlined text-[16px] text-brand-indigo-vibrant">tune</span>
                  <span>
                    Active Preset: <strong className="text-brand-indigo-deep">{activeTemplate.title}</strong>
                  </span>
                </div>

                {/* Render Frame Layout dynamically */}
                {activeTemplate.id === '2r' && (
                  <div
                    style={{ backgroundColor: frameBgColor }}
                    className="w-64 rounded-xl p-3 space-y-2.5 shadow-2xl transition-all duration-300 border border-slate-200"
                  >
                    {[0, 1, 2].map((idx) => (
                      <div key={idx} className="h-24 bg-slate-200 rounded-lg overflow-hidden relative group shadow-2xs">
                        <img
                          alt={`Slot 0${idx + 1}`}
                          className="w-full h-full object-cover"
                          src={samplePhotos[idx]}
                        />
                        <span className="absolute top-1.5 left-1.5 bg-black/60 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                          SLOT 0{idx + 1}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 text-center border-t border-slate-100">
                      <div className={`font-heading-xl text-[11px] font-bold ${frameBgColor === '#090a0f' ? 'text-white' : 'text-slate-800'}`}>
                        {frameText}
                      </div>
                      <div className={`font-mono text-[9px] mt-0.5 ${frameBgColor === '#090a0f' ? 'text-slate-400' : 'text-slate-400'}`}>
                        {frameSubtext}
                      </div>
                    </div>
                  </div>
                )}

                {activeTemplate.id === '4r' && (
                  <div
                    style={{ backgroundColor: frameBgColor }}
                    className="w-80 rounded-xl p-3 shadow-2xl transition-all duration-300 border border-slate-200"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {[0, 1, 2, 3].map((idx) => (
                        <div key={idx} className="h-24 bg-slate-200 rounded-lg overflow-hidden relative shadow-2xs">
                          <img alt={`Slot 0${idx + 1}`} className="w-full h-full object-cover" src={samplePhotos[idx]} />
                          <span className="absolute top-1.5 left-1.5 bg-black/60 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                            SLOT 0{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 text-center border-t border-slate-100 mt-2">
                      <div className={`font-heading-xl text-[12px] font-bold ${frameBgColor === '#090a0f' ? 'text-white' : 'text-slate-800'}`}>
                        {frameText}
                      </div>
                      <div className="font-mono text-[9px] text-slate-400 mt-0.5">{frameSubtext}</div>
                    </div>
                  </div>
                )}

                {activeTemplate.id === '5r' && (
                  <div
                    style={{ backgroundColor: frameBgColor }}
                    className="w-72 rounded-xl p-3 shadow-2xl transition-all duration-300 border border-slate-200"
                  >
                    <div className="h-44 bg-slate-200 rounded-lg overflow-hidden relative shadow-2xs mb-2">
                      <img alt="Feature Slot" className="w-full h-full object-cover" src={samplePhotos[0]} />
                      <span className="absolute top-1.5 left-1.5 bg-black/60 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                        MAIN COVER
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[1, 2, 3].map((idx) => (
                        <div key={idx} className="h-16 bg-slate-200 rounded overflow-hidden relative shadow-2xs">
                          <img alt={`Thumb ${idx}`} className="w-full h-full object-cover" src={samplePhotos[idx]} />
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 text-center border-t border-slate-100 mt-2">
                      <div className={`font-heading-xl text-[11px] font-bold ${frameBgColor === '#090a0f' ? 'text-white' : 'text-slate-800'}`}>
                        {frameText}
                      </div>
                    </div>
                  </div>
                )}

                {activeTemplate.id === 'square' && (
                  <div
                    style={{ backgroundColor: frameBgColor }}
                    className="w-64 rounded-xl p-3 shadow-2xl transition-all duration-300 border border-slate-200"
                  >
                    <div className="w-full aspect-square bg-slate-200 rounded-lg overflow-hidden relative shadow-2xs">
                      <img alt="Square Focus" className="w-full h-full object-cover" src={samplePhotos[0]} />
                      <span className="absolute top-1.5 left-1.5 bg-black/60 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                        1:1 POLAR
                      </span>
                    </div>
                    <div className="pt-3 text-center border-t border-slate-100 mt-2">
                      <div className={`font-heading-xl text-[12px] font-bold ${frameBgColor === '#090a0f' ? 'text-white' : 'text-slate-800'}`}>
                        {frameText}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. MULTI-TENANT ARCHITECTURE CORE */}
        <section className="w-full py-20 bg-white border-y border-slate-200/80" id="enterprise">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-heading-xl text-2xl sm:text-4xl font-bold text-slate-900">
                Multi-Tenant Architecture Tanpa Kompromi
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Didesain khusus untuk operasional vendor skala besar dengan reliabilitas tingkat enterprise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-brand-indigo-deep flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[22px]">database</span>
                </div>
                <h3 className="font-heading-xl text-base font-bold text-slate-900 mb-2">Data Isolation Per Tenant</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Database logis dan cloud bucket foto terisolasi untuk tiap vendor. Enkripsi AES-256 dan token otentikasi independen.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-accent-coral flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[22px]">event_available</span>
                </div>
                <h3 className="font-heading-xl text-base font-bold text-slate-900 mb-2">Event &amp; Package Control</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Atur kuota sesi capture, batasi jumlah cetakan per tamu, dan masa kedaluwarsa tautan galeri cloud secara otomatis.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[22px]">sensors</span>
                </div>
                <h3 className="font-heading-xl text-base font-bold text-slate-900 mb-2">Fleet Telemetry Booth</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pantau puluhan booth di berbagai kota secara langsung: status printer, sisa kertas, suhu mesin, hingga status jaringan.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[22px]">monitoring</span>
                </div>
                <h3 className="font-heading-xl text-base font-bold text-slate-900 mb-2">Analytics &amp; Revenue Hub</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Laporan omzet komprehensif, volume capture mingguan, jumlah unduhan tamu, hingga tingkat konversi promosi sponsor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. PRICING SECTION */}
        <section className="w-full py-20 bg-slate-50" id="pricing">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-heading-xl text-2xl sm:text-4xl font-bold text-slate-900">
                Paket Berlangganan SaaS
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Pilih paket sesuai skala bisnis booth Anda. Upgrade atau batalkan kapan saja.
              </p>

              {/* Billing Toggle */}
              <div className="mt-6 inline-flex items-center gap-2 p-1 rounded-full bg-slate-200/80 border border-slate-300">
                <button
                  type="button"
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    billingPeriod === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Bayar Bulanan
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    billingPeriod === 'yearly'
                      ? 'bg-brand-indigo-deep text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Tahunan</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-900 text-[10px] font-extrabold">
                    Hemat 20%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Tier 1: Free Sandbox */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-heading-xl text-lg font-bold text-slate-900">Free Sandbox</h3>
                  <p className="text-xs text-slate-500 mt-1">Uji coba integrasi fitur</p>
                  <div className="mt-4 mb-6">
                    <span className="font-heading-xl text-3xl font-extrabold text-slate-900">Rp 0</span>
                    <span className="text-xs text-slate-500"> / selamanya</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-status-ready text-[16px]">check</span> 1 Kiosk Booth Simulator
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-status-ready text-[16px]">check</span> 50 Sesi Foto Bulanan
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-status-ready text-[16px]">check</span> Watermark BoothFlow OS
                    </li>
                    <li className="flex items-center gap-2 text-slate-400">
                      <span className="material-symbols-outlined text-[16px]">close</span> Custom Domain CNAME
                    </li>
                  </ul>
                </div>
                <Link
                  to="/auth/register"
                  className="w-full h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-button-md text-xs font-semibold transition flex items-center justify-center"
                >
                  Mulai Sandbox
                </Link>
              </div>

              {/* Tier 2: Starter */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-heading-xl text-lg font-bold text-slate-900">Starter Vendor</h3>
                  <p className="text-xs text-slate-500 mt-1">Untuk vendor wedding baru</p>
                  <div className="mt-4 mb-6">
                    <span className="font-heading-xl text-3xl font-extrabold text-slate-900">
                      {billingPeriod === 'monthly' ? 'Rp 499rb' : 'Rp 399rb'}
                    </span>
                    <span className="text-xs text-slate-500"> / bulan</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-status-ready text-[16px]">check</span> 2 Kiosk Booth Terhubung
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-status-ready text-[16px]">check</span> 1.500 Sesi Foto Bulanan
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-status-ready text-[16px]">check</span> Hapus Watermark BoothFlow
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-status-ready text-[16px]">check</span> Direct Print DNP Driver
                    </li>
                  </ul>
                </div>
                <Link
                  to="/auth/register"
                  className="w-full h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-button-md text-xs font-semibold transition flex items-center justify-center"
                >
                  Pilih Starter
                </Link>
              </div>

              {/* Tier 3: Business Pro (Highlight) */}
              <div className="bg-white rounded-3xl p-6 border-2 border-brand-indigo-vibrant shadow-xl relative flex flex-col justify-between">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-indigo-vibrant text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  Paling Populer
                </div>
                <div>
                  <h3 className="font-heading-xl text-lg font-bold text-slate-900">Business Pro</h3>
                  <p className="text-xs text-slate-500 mt-1">Vendor sibuk &amp; brand activation</p>
                  <div className="mt-4 mb-6">
                    <span className="font-heading-xl text-3xl font-extrabold text-brand-indigo-deep">
                      {billingPeriod === 'monthly' ? 'Rp 1.49jt' : 'Rp 1.19jt'}
                    </span>
                    <span className="text-xs text-slate-500"> / bulan</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-brand-indigo-vibrant text-[16px]">check_circle</span> 8 Kiosk Booth Aktif
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-brand-indigo-vibrant text-[16px]">check_circle</span> Unlimited Foto &amp; Unduhan Tamu
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-brand-indigo-vibrant text-[16px]">check_circle</span> Custom Subdomain Tenant
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-brand-indigo-vibrant text-[16px]">check_circle</span> Lead Capture Formulir &amp; WA
                    </li>
                  </ul>
                </div>
                <Link
                  to="/auth/register"
                  className="w-full h-10 rounded-full bg-brand-indigo-vibrant hover:bg-brand-indigo-deep text-white font-button-md text-xs font-bold transition shadow-md shadow-brand-indigo-vibrant/25 flex items-center justify-center"
                >
                  Uji Coba 14 Hari
                </Link>
              </div>

              {/* Tier 4: Enterprise */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-heading-xl text-lg font-bold text-slate-900">Enterprise</h3>
                  <p className="text-xs text-slate-500 mt-1">Armada multi-kota &amp; franchise</p>
                  <div className="mt-4 mb-6">
                    <span className="font-heading-xl text-3xl font-extrabold text-slate-900">Kustom</span>
                    <span className="text-xs text-slate-500"> / tahunan</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-status-ready text-[16px]">check</span> Unlimited Kiosk &amp; Telemetry
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-status-ready text-[16px]">check</span> Full White-Label Custom CNAME
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-status-ready text-[16px]">check</span> Dedicated Database Cluster
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-status-ready text-[16px]">check</span> SLA Uptime 99.99% &amp; Priority SLA
                    </li>
                  </ul>
                </div>
                <Link
                  to="/auth/register"
                  className="w-full h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-button-md text-xs font-semibold transition flex items-center justify-center"
                >
                  Hubungi Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ ACCORDION */}
        <section className="w-full py-20 bg-white border-t border-slate-200/80" id="faq">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-heading-xl text-2xl sm:text-4xl font-bold text-slate-900">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Semua hal yang perlu Anda ketahui sebelum menggunakan BoothFlow OS.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'Apakah saya memerlukan perangkat keras printer atau kamera khusus?',
                  a: 'Tidak wajib. Untuk Online Booth, Anda hanya memerlukan browser ponsel tamu. Namun untuk On-Site Kiosk profesional, BoothFlow OS mendukung printer dye-sub DNP DS620, Citizen CX-02, HiTi, dan kamera DSLR Canon EOS, Sony Alpha, atau Nikon via protokol USB langsung tanpa software pihak ketiga tambahan.',
                },
                {
                  q: 'Bagaimana cara kerja isolasi multi-tenant data foto tamu?',
                  a: 'Setiap tenant/vendor memiliki partisi ruang penyimpanan terenkripsi tersendiri. Tamu dari Event A tidak akan pernah dapat mengakses galeri Event B. Semua link download di-hash secara dinamis dengan masa berlaku aman sesuai konfigurasi paket Anda.',
                },
                {
                  q: 'Bisakah saya menggunakan domain sendiri (White-Label)?',
                  a: 'Ya, paket Business Pro dan Enterprise mengizinkan Anda menghubungkan domain CNAME sendiri (misal: photobooth.brandanda.id) dengan sertifikat SSL gratis yang diperbarui secara otomatis.',
                },
                {
                  q: 'Apakah sistem tetap bekerja jika koneksi internet di lokasi event lambat?',
                  a: 'Ya! Aplikasi On-Site Kiosk BoothFlow dilengkapi Offline-First Cache Engine. Foto dan cetak lokal tetap berjalan mulus sub-detik, dan antrean foto cloud akan disinkronisasikan secara background begitu koneksi pulih.',
                },
              ].map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden transition-colors">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left font-heading-md text-sm sm:text-base font-semibold text-slate-900 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <span className={`material-symbols-outlined text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-indigo-deep' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full bg-slate-900 text-slate-300 pt-16 pb-12 relative z-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
            <div className="lg:col-span-2 flex flex-col justify-between pr-4 space-y-6">
              <div className="space-y-3">
                <Link to="/" className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-indigo-deep to-accent-coral flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[18px]">photo_camera</span>
                  </div>
                  <span className="font-heading-xl text-lg font-bold tracking-tight text-white">
                    Booth<span className="text-brand-indigo-glow">Flow</span>
                    <span className="text-accent-coral text-xs font-mono ml-1 px-1.5 py-0.5 rounded bg-slate-800">OS</span>
                  </span>
                </Link>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                  Platform SaaS photobooth multi-tenant modern untuk kiosk fisik, online web booth, dan manajemen terpusat tanpa hambatan hardware.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-white font-bold">Multi-Tenant Solutions</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a className="hover:text-white transition-colors" href="#dual-capture">Hardware Operators</a></li>
                <li><a className="hover:text-white transition-colors" href="#dual-capture">Brand Activations</a></li>
                <li><a className="hover:text-white transition-colors" href="#dual-capture">Virtual Experience Pods</a></li>
                <li><a className="hover:text-white transition-colors" href="#enterprise">Franchise Multi-Kiosk</a></li>
                <li><Link className="hover:text-white transition-colors" to="/admin">White-Label Portals</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-white font-bold">Product &amp; Tools</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a className="hover:text-white transition-colors" href="#template-studio">Design Template Studio</a></li>
                <li><button type="button" onClick={() => setDemoModalOpen(true)} className="hover:text-white transition-colors text-left cursor-pointer">Camera SDK &amp; Telemetry</button></li>
                <li><Link className="hover:text-white transition-colors" to="/booth/onsite">Sub-Second Dye-Sub Printing</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/booth/online/wedding-demo">Instant Web Delivery</Link></li>
                <li><a className="hover:text-white transition-colors" href="#pricing">Tier Matrix &amp; Add-ons</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-white font-bold">Navigasi Langsung</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link className="hover:text-white transition-colors text-emerald-400 font-semibold" to="/admin">Masuk ke Console Admin</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/auth/login">Halaman Login</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/auth/register">Pendaftaran Studio Baru</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/booth/onsite">Simulator Onsite Booth</Link></li>
                <li><a className="hover:text-white transition-colors" href="#faq">FAQ &amp; Dokumentasi</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © 2026 BoothFlow Technologies Inc. All rights reserved. Cinematic Photobooth Architecture.
            </p>
            <div className="flex items-center gap-5 text-xs text-slate-400">
              <span className="text-emerald-400 font-mono">Status: Operational</span>
              <span>•</span>
              <span>AES-256 Encryption</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= INTERACTIVE LIVE BOOTH SIMULATOR MODAL ================= */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-30"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-status-ready animate-ping"></div>
                <div>
                  <h3 className="font-heading-md text-base text-slate-900 font-bold">Interactive Booth Simulator</h3>
                  <p className="text-xs text-slate-500">Uji coba interaksi kamera dan trigger flash cetak secara real-time.</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs text-brand-indigo-deep font-mono font-bold border border-slate-200">
                Booth #DEMO-01
              </span>
            </div>

            {/* Viewfinder Screen */}
            <div className="relative w-full h-64 sm:h-72 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {flashActive && (
                <div className="absolute inset-0 bg-white z-40 trigger-flash pointer-events-none" />
              )}
              <img
                alt="Simulator Camera View"
                style={{ filter: activeFilter.css }}
                className="w-full h-full object-cover transition-all duration-300"
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&auto=format&fit=crop&q=80"
              />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white flex items-center gap-1.5 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-accent-coral animate-ping"></span>
                <span>
                  Frame <strong className="text-accent-coral">{frameStep}</strong> / 4
                </span>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono text-brand-indigo-glow border border-white/20">
                FX: <strong className="text-white">{activeFilter.name.toUpperCase()}</strong>
              </div>
            </div>

            {/* Simulator Action Controls */}
            <div className="pt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSnap}
                  disabled={isCapturing}
                  className="h-10 px-5 rounded-full bg-accent-coral hover:bg-rose-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-accent-coral/30 transition-all cursor-pointer disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  <span>{isCapturing ? 'Menjepret...' : 'Jepret (Snap)'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetSimulator}
                  className="h-10 px-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  <span>Reset Sesi</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDemoModalOpen(false);
                    navigate('/booth/onsite');
                  }}
                  className="h-10 px-4 rounded-full bg-indigo-50 hover:bg-indigo-100 text-brand-indigo-deep text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Buka Kiosk Fullscreen</span>
                  <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VENDOR SOLUTION DETAIL MODAL ================= */}
      {solutionModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setSolutionModalData(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-brand-indigo-deep flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">{solutionModalData.icon}</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">{solutionModalData.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {solutionModalData.desc}
            </p>

            <div className="space-y-2 mb-6">
              {solutionModalData.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className="material-symbols-outlined text-status-ready text-[18px]">check_circle</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/auth/register"
                className="flex-1 py-3 rounded-full bg-brand-indigo-vibrant hover:bg-brand-indigo-deep text-white text-center text-xs font-bold transition-all shadow-md shadow-brand-indigo-vibrant/25"
              >
                Mulai Uji Coba Sekarang
              </Link>
              <button
                type="button"
                onClick={() => setSolutionModalData(null)}
                className="px-4 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
