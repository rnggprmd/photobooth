import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  HelpCircle,
  AlertCircle,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

interface DemoPersona {
  id: string;
  roleName: string;
  email: string;
  desc: string;
}

const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'tenant',
    roleName: 'Studio Owner',
    email: 'tenant@photobooth.test',
    desc: 'Lumina Studio',
  },
  {
    id: 'operator',
    roleName: 'Kru On-Site',
    email: 'operator@photobooth.test',
    desc: 'Kiosk & Cetak',
  },
  {
    id: 'superadmin',
    roleName: 'Super Admin',
    email: 'superadmin@photobooth.test',
    desc: 'Platform Core',
  },
];

type AuthMode = 'credentials' | 'kiosk_pin';

export const LoginPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('credentials');
  const [email, setEmail] = useState('tenant@photobooth.test');
  const [password, setPassword] = useState('password');
  const [kioskPin, setKioskPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

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

    if (authMode === 'kiosk_pin') {
      if (kioskPin === '2026' || kioskPin === '1234' || kioskPin.length >= 4) {
        try {
          await login({ email: 'operator@photobooth.test', password: 'password' });
          navigate('/booth/onsite');
        } catch {
          navigate('/booth/onsite');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('PIN Kiosk tidak valid. Gunakan PIN demo: 2026 atau 1234.');
      }
      return;
    }

    try {
      await login({ email, password });
      navigate('/admin');
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Autentikasi gagal. Periksa kembali email dan kata sandi Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  const checkCapsLock = (e: React.KeyboardEvent) => {
    setCapsLockActive(e.getModifierState('CapsLock'));
  };

  return (
    <div className="p-4 sm:p-5 space-y-3.5">
      {/* 1. Header Row - Clean & Human Typography (No AI badges) */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-stone-950 tracking-tight">
          Masuk ke Konsol
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Akses manajemen photobooth, kiosk on-site &amp; armada printer.
        </p>
      </div>

      {/* 2. Error Alert Box */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 overflow-hidden"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{error}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Credentials Mode */}
      {authMode === 'credentials' && (
        <motion.div
          key="credentials-mode"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Quick Account Switcher (Tactile Segmented Profile Control) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-stone-600">
                Pilih Profil Akses:
              </span>
              <span className="text-[11px] text-stone-500 font-mono">
                Sandi: <strong className="text-stone-800">password</strong>
              </span>
            </div>

            <div className="p-1 rounded-xl bg-stone-100/90 border border-stone-200/80 grid grid-cols-3 gap-1 relative">
              {DEMO_PERSONAS.map((p) => {
                const isSelected = email.toLowerCase() === p.email.toLowerCase();
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPersona(p)}
                    className="relative py-2 px-1 rounded-lg text-center cursor-pointer transition-colors z-10"
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activePersonaPill"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        className="absolute inset-0 bg-white rounded-lg shadow-xs border border-stone-300 -z-10"
                      />
                    )}
                    <span
                      className={`block text-xs font-bold leading-tight transition-colors ${
                        isSelected ? 'text-stone-950' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {p.roleName}
                    </span>
                    <span
                      className={`block text-[10px] mt-0.5 transition-colors ${
                        isSelected ? 'text-amber-800 font-medium' : 'text-stone-400'
                      }`}
                    >
                      {p.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields with Generous, Non-Overlapping Padding */}
          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2.5">
            {/* Email Field */}
            <div>
              <label className="block text-[10.5px] sm:text-[11px] font-semibold text-stone-700 mb-0.5">
                Alamat Email Akun
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@studio.com"
                  required
                  className="w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-lg bg-stone-50/70 hover:bg-stone-50/40 focus:bg-white border border-stone-200 focus:border-stone-950 focus:ring-2 focus:ring-amber-400/25 text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <label className="block text-[11px] font-semibold text-stone-700">
                    Kata Sandi
                  </label>
                  {capsLockActive && (
                    <span className="text-[10px] text-amber-700 font-medium">
                      Caps Lock aktif
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[10px] font-medium text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Lupa sandi?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={checkCapsLock}
                  onKeyUp={checkCapsLock}
                  placeholder="••••••••"
                  required
                  className="w-full pl-8 pr-8 py-1.5 sm:py-2 rounded-lg bg-stone-50/70 hover:bg-stone-50/40 focus:bg-white border border-stone-200 focus:border-stone-950 focus:ring-2 focus:ring-amber-400/25 text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
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
                className="w-3.5 h-3.5 rounded border-stone-300 text-stone-950 focus:ring-amber-400 accent-stone-950 cursor-pointer"
              />
              <label htmlFor="remember-me" className="text-[11px] text-stone-600 select-none cursor-pointer">
                Ingat sesi masuk di perangkat ini
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.008 }}
              whileTap={{ scale: loading ? 1 : 0.985 }}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-stone-950 hover:bg-black active:bg-stone-900 text-white font-semibold text-xs sm:text-sm shadow-[0_4px_14px_-2px_rgba(28,25,23,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Konsol Studio</span>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Switch to Kiosk PIN option */}
          <div className="text-center pt-0.5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('kiosk_pin');
                setError(null);
              }}
              className="text-[11px] text-stone-500 hover:text-stone-950 transition-colors cursor-pointer font-medium hover:underline underline-offset-2 decoration-amber-400"
            >
              Operator lapangan? Masuk dengan PIN Kiosk →
            </button>
          </div>
        </motion.div>
      )}

      {/* 4. Kiosk PIN Mode */}
      {authMode === 'kiosk_pin' && (
        <motion.div
          key="kiosk-pin-mode"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-3.5 py-1"
        >
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-200/80 flex items-center justify-center text-stone-800 shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-stone-900 text-xs block">
                Mode Kru On-Site
              </span>
              <span className="text-[10.5px] text-stone-500">
                Akses cepat stan foto tanpa email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-2 text-center">
                Masukkan PIN Operator (4-Digit)
              </label>

              {/* Interactive 4-Box PIN Display */}
              <div className="flex justify-center gap-2 mb-2">
                {[0, 1, 2, 3].map((idx) => {
                  const digit = kioskPin[idx];
                  const isActive = kioskPin.length === idx;
                  return (
                    <div
                      key={idx}
                      className={`w-10 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg transition-all ${
                        digit
                          ? 'bg-white border-2 border-stone-900 text-stone-900 shadow-2xs'
                          : isActive
                          ? 'bg-white border-2 border-amber-500 shadow-xs ring-2 ring-amber-400/20'
                          : 'bg-stone-50 border border-stone-200 text-stone-300'
                      }`}
                    >
                      {digit ? '●' : ''}
                    </div>
                  );
                })}
              </div>

              {/* Hidden real input for mobile keyboard / typing */}
              <div className="flex justify-center">
                <input
                  type="password"
                  maxLength={4}
                  value={kioskPin}
                  onChange={(e) => setKioskPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ketik 4-digit PIN"
                  autoFocus
                  className="w-48 text-center font-mono text-xs py-1.5 rounded-lg bg-stone-50/70 border border-stone-200 focus:bg-white focus:border-stone-950 focus:ring-1 focus:ring-stone-950 text-stone-900"
                />
              </div>

              <div className="flex justify-center gap-3 mt-2.5">
                {['2026', '1234'].map((demoPin) => (
                  <button
                    key={demoPin}
                    type="button"
                    onClick={() => setKioskPin(demoPin)}
                    className="text-xs text-stone-500 hover:text-stone-950 transition-colors cursor-pointer hover:underline underline-offset-2 decoration-amber-400"
                  >
                    Gunakan PIN <strong className="font-mono">{demoPin}</strong>
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || kioskPin.length < 4}
              whileHover={{ scale: loading ? 1 : 1.008 }}
              whileTap={{ scale: loading ? 1 : 0.985 }}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-950 hover:bg-black text-white font-semibold text-xs sm:text-sm shadow-[0_4px_14px_-2px_rgba(28,25,23,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Membuka Kiosk...</span>
                </>
              ) : (
                <>
                  <span>Buka Antarmuka Stan On-Site</span>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Switch back to credentials */}
          <div className="text-center pt-0.5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('credentials');
                setError(null);
              }}
              className="text-[11px] text-stone-500 hover:text-stone-950 transition-colors cursor-pointer font-medium hover:underline underline-offset-2 decoration-amber-400"
            >
              ← Kembali ke login akun studio
            </button>
          </div>
        </motion.div>
      )}

      {/* 5. Footer & Registration Link */}
      <div className="pt-2 border-t border-stone-100 text-center">
        <p className="text-xs text-stone-500">
          Belum memiliki akun studio?{' '}
          <Link
            to="/auth/register"
            className="font-semibold text-stone-950 hover:text-black underline underline-offset-4 decoration-amber-400 hover:decoration-amber-500 transition-colors"
          >
            Daftarkan Studio Baru
          </Link>
        </p>
      </div>

      {/* 7. Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForgotModal(false)}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm rounded-2xl bg-white border border-stone-200 p-5 shadow-lg space-y-4 z-10"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Bantuan Akses Akun</h3>
                    <p className="text-[11px] text-stone-500">Pemulihan kredensial studio</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-stone-600 leading-relaxed space-y-2 bg-stone-50 p-3 rounded-lg border border-stone-200/80">
                <p>
                  Pada instalasi lokal/demo, semua akun diatur dengan kata sandi seragam:
                </p>
                <div className="font-mono text-center font-bold text-stone-900 bg-white p-1.5 rounded border border-stone-200 text-xs">
                  password
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPassword('password');
                    setShowForgotModal(false);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
                >
                  Isi Sandi Otomatis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
