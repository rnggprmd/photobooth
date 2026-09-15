import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px]" />
        {/* Subtle grid mesh */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Top Floating Mini Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group text-decoration-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">photo_camera</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">SnapStudio</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                PRO SaaS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight -mt-0.5">
              Precision Booth Ops v2.4
            </p>
          </div>
        </Link>

        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300 font-medium">Core API 99.98%</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">AWS Jakarta S3</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Visual Showcase & Enterprise Highlights (visible on large screens) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-8 pr-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium backdrop-blur-md">
                <span className="material-symbols-outlined text-[16px] text-indigo-400">verified</span>
                Solusi Enterprise Multi-Tenant Terpadu
              </div>
              <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Kelola Seluruh Bisnis{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                  Photobooth
                </span>{' '}
                dalam Satu Kendali.
              </h1>
              <p className="text-slate-400 text-base leading-relaxed max-w-lg">
                Platform all-in-one untuk Studio Owner & Super Admin: manajemen event, live capture kiosk, visual template studio, hingga pengiriman digital instan via QR code.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2.5">
                  <span className="material-symbols-outlined text-[18px]">print</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200">Hardware & DNP DS620</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Sinkronisasi spooling printer foto kilat dengan auto-cutter & indikator sisa kertas real-time.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2.5">
                  <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200">Instan QR Guest Delivery</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Tamu mengunduh strip komposit dan foto digital beresolusi tinggi langsung via browser ponsel.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-2.5">
                  <span className="material-symbols-outlined text-[18px]">crop_free</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200">Visual Frame Studio</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Editor kanvas interaktif dengan drag & drop, snap axis ratio, dan swatch warna latar solid.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-2.5">
                  <span className="material-symbols-outlined text-[18px]">hub</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200">Multi-Tenant Isolation</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Data tiap studio terlindungi independen dengan skema SaaS MRR dan telemetri armada.
                </p>
              </div>
            </div>

            {/* Live Operational Ribbon */}
            <div className="flex items-center gap-4 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                  LM
                </div>
                <div className="w-7 h-7 rounded-full bg-purple-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                  SB
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                  NK
                </div>
              </div>
              <p>
                Dipercaya oleh <span className="font-semibold text-slate-200">18+ Vendor Photobooth</span> terverifikasi dengan lebih dari <span className="font-semibold text-slate-200">14.800+ sesi cetak sukses</span>.
              </p>
            </div>
          </div>

          {/* Right Column: Authentication Card Container */}
          <div className="w-full lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[480px] bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60 backdrop-blur-xl relative">
              <Outlet />
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 border-t border-slate-800/50">
        <p>© 2026 SnapStudio Photobooth Ops. Seluruh hak cipta dilindungi.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="material-symbols-outlined text-[14px] text-emerald-400">lock</span>
            256-Bit TLS Enkripsi
          </span>
          <span>•</span>
          <span className="text-slate-400">Multi-Tenant Architecture</span>
          <span>•</span>
          <span className="text-slate-400">Vite + React + Laravel</span>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
