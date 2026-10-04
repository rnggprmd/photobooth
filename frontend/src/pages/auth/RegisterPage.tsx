import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export const RegisterPage: React.FC = () => {
  const [tenantName, setTenantName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleQuickFillDemo = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    setTenantName(`Aura Wedding Studio ${randomId}`);
    setName('Dimas Pratama');
    setEmail(`owner${randomId}@aurastudio.test`);
    setPassword('password');
    setPasswordConfirmation('password');
    setError(null);
  };

  const handleCategoryPreset = (categoryName: string) => {
    const randomId = Math.floor(100 + Math.random() * 900);
    setTenantName(`${categoryName} ${randomId}`);
    if (!name) setName('Rangga Pramudya');
    if (!email) setEmail(`studio${randomId}@photobooth.test`);
    setPassword('password');
    setPasswordConfirmation('password');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Konfirmasi kata sandi tidak cocok. Harap periksa kembali.');
      return;
    }
    if (!agreeTerms) {
      setError('Harap setujui ketentuan layanan operasional studio.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register({
        tenant_name: tenantName,
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registrasi studio gagal. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="p-3.5 sm:p-5 space-y-2 sm:space-y-2.5"
    >
      {/* 1. Header Row - Clean & Compact */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-none">
            Daftarkan Studio Baru
          </h2>
          <p className="text-[11px] text-stone-500 mt-1">
            Kelola photobooth, kiosk on-site &amp; armada printer.
          </p>
        </div>
        <button
          type="button"
          onClick={handleQuickFillDemo}
          title="Isi otomatis formulir dengan data contoh studio"
          className="text-[10px] font-mono font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded-md border border-stone-200/80 transition-colors cursor-pointer shrink-0"
        >
          Isi Cepat
        </button>
      </div>

      {/* Quick Studio Preset Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar text-[10px]">
        <span className="text-stone-600 text-[10px] shrink-0 font-medium">Format:</span>
        {[
          { label: 'Wedding Kiosk', title: 'Lumina Wedding Kiosk' },
          { label: 'Self-Photo Studio', title: 'Aura Self-Photo' },
          { label: '360 Glamour', title: 'Orbit 360 Event' },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleCategoryPreset(item.title)}
            className="px-2 py-0.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-200/60 transition-colors whitespace-nowrap cursor-pointer text-[10px]"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 2. Error Alert Box */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-1.5 overflow-hidden"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-tight text-[11px]">{error}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Registration Form - Compact Ergonomics */}
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Studio / Tenant Brand Name */}
        <div>
          <label className="block text-[10.5px] sm:text-[11px] font-semibold text-stone-700 mb-0.5">
            Nama Studio / Brand Photobooth
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-stone-400">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              placeholder="Contoh: Lumina Photostudio & Co."
              required
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-stone-50/70 hover:bg-stone-50/40 focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 placeholder:text-stone-400 text-xs transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] font-sans"
            />
          </div>
        </div>

        {/* Owner Name & Business Email - Compact 2-Col on Tablet/Desktop, tight stack on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Owner / Admin Name */}
          <div>
            <label className="block text-[10.5px] sm:text-[11px] font-semibold text-stone-700 mb-0.5">
              Nama Pemilik
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-stone-400">
                <User className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama penanggung jawab"
                required
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-stone-50/70 hover:bg-stone-50/40 focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 placeholder:text-stone-400 text-xs transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] font-sans"
              />
            </div>
          </div>

          {/* Business Email */}
          <div>
            <label className="block text-[10.5px] sm:text-[11px] font-semibold text-stone-700 mb-0.5">
              Email Akun Studio
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@studio.com"
                required
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-stone-50/70 hover:bg-stone-50/40 focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 placeholder:text-stone-400 text-xs transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] font-sans"
              />
            </div>
          </div>
        </div>

        {/* Passwords - Always Side-by-Side 2-Column Grid on Both Mobile & Desktop! */}
        <div className="grid grid-cols-2 gap-2">
          {/* Password */}
          <div>
            <label className="block text-[10.5px] sm:text-[11px] font-semibold text-stone-700 mb-0.5">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-stone-50/70 hover:bg-stone-50/40 focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 placeholder:text-stone-400 text-xs transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[10.5px] sm:text-[11px] font-semibold text-stone-700 mb-0.5">
              Konfirmasi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-stone-50/70 hover:bg-stone-50/40 focus:bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 placeholder:text-stone-400 text-xs transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] font-sans"
              />
            </div>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="flex items-center gap-2 pt-0.5">
          <input
            id="agree-terms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-stone-300 text-stone-900 focus:ring-stone-800 accent-stone-900 cursor-pointer shrink-0"
          />
          <label htmlFor="agree-terms" className="text-[10.5px] text-stone-600 select-none cursor-pointer leading-tight">
            Saya menyetujui ketentuan operasional studio photobooth
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.008 }}
          whileTap={{ scale: loading ? 1 : 0.985 }}
          className="w-full mt-1 py-2 sm:py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-black active:bg-stone-950 text-white font-semibold text-xs sm:text-sm shadow-[0_2px_4px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Memproses Pendaftaran...</span>
            </>
          ) : (
            <span>Daftarkan Akun Studio Baru</span>
          )}
        </motion.button>
      </form>

      {/* 4. Footer & Back to Login */}
      <div className="pt-1.5 border-t border-stone-100 text-center">
        <p className="text-xs text-stone-500">
          Sudah memiliki akun studio?{' '}
          <Link
            to="/auth/login"
            className="font-semibold text-stone-900 hover:text-black underline underline-offset-2 transition-colors"
          >
            Masuk ke Konsol
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
