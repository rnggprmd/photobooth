import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface DemoPersona {
  id: string;
  roleName: string;
  badge: string;
  email: string;
  desc: string;
  colorClass: {
    border: string;
    bg: string;
    text: string;
    badgeBg: string;
    icon: string;
  };
  icon: string;
}

const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'tenant',
    roleName: 'Tenant Admin',
    badge: 'Studio Owner',
    email: 'tenant@photobooth.test',
    desc: 'Lumina Photostudio • Event, Template & Klien',
    icon: 'storefront',
    colorClass: {
      border: 'border-indigo-500/40 hover:border-indigo-500',
      bg: 'bg-indigo-950/20 hover:bg-indigo-950/40',
      text: 'text-indigo-300',
      badgeBg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      icon: 'text-indigo-400',
    },
  },
  {
    id: 'superadmin',
    roleName: 'Super Admin',
    badge: 'Platform Root',
    email: 'superadmin@photobooth.test',
    desc: 'Platform Console • Billing SaaS & Semua Tenant',
    icon: 'admin_panel_settings',
    colorClass: {
      border: 'border-purple-500/40 hover:border-purple-500',
      bg: 'bg-purple-950/20 hover:bg-purple-950/40',
      text: 'text-purple-300',
      badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      icon: 'text-purple-400',
    },
  },
  {
    id: 'operator',
    roleName: 'Operator Kru',
    badge: 'On-Site Booth',
    email: 'operator@photobooth.test',
    desc: 'Kiosk Booth • Kamera Canon & Printer DNP',
    icon: 'photo_camera',
    colorClass: {
      border: 'border-emerald-500/40 hover:border-emerald-500',
      bg: 'bg-emerald-950/20 hover:bg-emerald-950/40',
      text: 'text-emerald-300',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: 'text-emerald-400',
    },
  },
];

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('tenant@photobooth.test');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSelectPersona = (persona: DemoPersona) => {
    setEmail(persona.email);
    setPassword('password');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      navigate('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Autentikasi gagal. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Greeting */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-1.5 h-4 rounded-full bg-indigo-500" />
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400">
            Autentikasi Aman
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Masuk ke SnapStudio</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Akses konsol operasional photobooth & pemantauan sesi cloud.
        </p>
      </div>

      {/* 1-Click Demo Persona Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-amber-400">bolt</span>
            1-Click Demo Access
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Pass: password</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {DEMO_PERSONAS.map((p) => {
            const isSelected = email.toLowerCase() === p.email.toLowerCase();
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPersona(p)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? `${p.colorClass.border} ${p.colorClass.bg} shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500/30`
                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                      isSelected
                        ? `${p.colorClass.badgeBg}`
                        : 'bg-slate-900 border-slate-800 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{p.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200 leading-tight">
                        {p.roleName}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${p.colorClass.badgeBg}`}
                      >
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono tracking-tight mt-0.5">
                      {p.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <span
                    className={`material-symbols-outlined text-[18px] transition-transform ${
                      isSelected ? 'text-indigo-400 scale-110' : 'text-slate-600 group-hover:text-slate-400'
                    }`}
                  >
                    {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 animate-fadeIn">
          <span className="material-symbols-outlined text-[18px] text-red-400 flex-shrink-0 mt-0.5">
            error
          </span>
          <div className="flex-1 leading-relaxed">{error}</div>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Alamat Email Akun
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400 pointer-events-none">
              mail
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@studio.com"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-sans"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Kata Sandi
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert('Silakan gunakan demo preset kata sandi: "password" untuk pengujian.');
              }}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Lupa sandi?
            </a>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400 pointer-events-none">
              lock
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-sans"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center p-0.5"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-2 pt-0.5">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
          />
          <label htmlFor="remember-me" className="text-xs text-slate-400 select-none cursor-pointer">
            Ingat sesi login di perangkat ini
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Memproses Autentikasi...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Dashboard</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </>
          )}
        </button>
      </form>

      {/* Footer / Registration Link */}
      <div className="pt-4 border-t border-slate-800/80 text-center">
        <p className="text-xs text-slate-400">
          Belum memiliki akun studio?{' '}
          <Link
            to="/auth/register"
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
          >
            Daftarkan Studio Baru
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
