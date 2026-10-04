import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Camera,
  ChevronDown,
  Monitor,
  Printer,
  SlidersHorizontal,
  Tag,
  HelpCircle,
  Calculator,
  Play,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

type SectionId = 'simulator' | 'dual-capture' | 'templates' | 'fleet' | 'calculator' | 'pricing' | 'faq';

interface NavItem {
  id: SectionId;
  label: string;
  desc: string;
  icon: LucideIcon;
}

// DOM order matters: scroll spy walks this list bottom-up.
const SECTIONS: NavItem[] = [
  { id: 'simulator', label: 'Simulator', desc: 'Coba jepret dan cetak strip', icon: Play },
  { id: 'dual-capture', label: 'Kiosk & Web Booth', desc: 'DSLR di venue atau ponsel tamu', icon: Monitor },
  { id: 'templates', label: 'Template Studio', desc: 'Strip 2x6 dan postcard 4x6', icon: SlidersHorizontal },
  { id: 'fleet', label: 'Konsol Armada', desc: 'Pantau kertas dan antrean cetak', icon: Printer },
  { id: 'calculator', label: 'Kalkulator', desc: 'Hitung omzet dan margin event', icon: Calculator },
  { id: 'pricing', label: 'Paket Harga', desc: 'Mulai Rp 239rb per bulan', icon: Tag },
  { id: 'faq', label: 'FAQ', desc: 'Printer, offline, kamera', icon: HelpCircle },
];

const byId = (id: SectionId) => SECTIONS.find((s) => s.id === id)!;

// Sections reachable only through the "Fitur & Mode" dropdown on desktop.
const FLYOUT_ITEMS = [byId('dual-capture'), byId('fleet')];
const TOP_LINKS = [byId('simulator'), byId('templates'), byId('calculator'), byId('pricing'), byId('faq')];

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500';

export const LandingNavbar: React.FC = () => {
  const { token } = useAuthStore();
  const reduceMotion = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | ''>('');
  const [hovered, setHovered] = useState<string | null>(null);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [flyoutHover, setFlyoutHover] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shotKey, setShotKey] = useState(0);

  const lastScrollY = useRef(0);
  const flyoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flyoutOpenedBy = useRef<'hover' | 'click'>('hover');
  const flyoutWrapRef = useRef<HTMLDivElement>(null);
  const flyoutBtnRef = useRef<HTMLButtonElement>(null);
  const flyoutItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  const spring = reduceMotion
    ? { duration: 0 }
    : ({ type: 'spring', stiffness: 520, damping: 40, mass: 0.6 } as const);

  // Scroll: capsule shape, hide while reading downward, reveal on any upward scroll.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      const delta = y - lastScrollY.current;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 160);
        lastScrollY.current = y;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll spy
  useEffect(() => {
    const onSpy = () => {
      if (window.scrollY < 180) {
        setActiveSection('');
        return;
      }
      const probe = window.scrollY + 220;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && probe >= el.getBoundingClientRect().top + window.scrollY) {
          setActiveSection(SECTIONS[i].id);
          return;
        }
      }
    };
    window.addEventListener('scroll', onSpy, { passive: true });
    onSpy();
    return () => window.removeEventListener('scroll', onSpy);
  }, []);

  // Lock page scroll behind the mobile sheet and move focus into it.
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    if (mobileMenuOpen) {
      const t = setTimeout(() => firstMobileLinkRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Escape + resize
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (flyoutOpen) {
        setFlyoutOpen(false);
        flyoutBtnRef.current?.focus();
      }
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [flyoutOpen, mobileMenuOpen]);

  // Close a click-pinned dropdown when clicking elsewhere.
  useEffect(() => {
    if (!flyoutOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!flyoutWrapRef.current?.contains(e.target as Node)) setFlyoutOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [flyoutOpen]);

  // Smooth jump that accounts for the fixed bar. Going down, the bar hides, so no offset.
  const jumpTo = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      document.body.style.overflow = '';
      const targetTop = el.getBoundingClientRect().top + window.scrollY;
      const offset = targetTop > window.scrollY ? 0 : 76;
      window.scrollTo({ top: targetTop - offset, behavior: reduceMotion ? 'auto' : 'smooth' });
      window.history.replaceState(null, '', `#${id}`);
      setFlyoutOpen(false);
      setMobileMenuOpen(false);
    },
    [reduceMotion]
  );

  // Logo: shutter blink + back to top.
  const fireShutter = () => {
    setShotKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio is optional feedback.
    }
  };

  const openFlyoutByHover = () => {
    if (flyoutTimer.current) clearTimeout(flyoutTimer.current);
    if (!flyoutOpen) flyoutOpenedBy.current = 'hover';
    setFlyoutOpen(true);
  };

  const closeFlyoutByHover = () => {
    if (flyoutOpenedBy.current !== 'hover') return;
    flyoutTimer.current = setTimeout(() => setFlyoutOpen(false), 160);
  };

  // Hover opens it; a click pins it open; a second click closes it.
  const onFlyoutButtonClick = () => {
    if (!flyoutOpen) {
      flyoutOpenedBy.current = 'click';
      setFlyoutOpen(true);
    } else if (flyoutOpenedBy.current === 'hover') {
      flyoutOpenedBy.current = 'click';
    } else {
      setFlyoutOpen(false);
    }
  };

  const onFlyoutButtonKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      flyoutOpenedBy.current = 'click';
      setFlyoutOpen(true);
      setTimeout(() => flyoutItemRefs.current[0]?.focus(), 40);
    }
  };

  const onFlyoutItemKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (index + (e.key === 'ArrowDown' ? 1 : -1) + FLYOUT_ITEMS.length) % FLYOUT_ITEMS.length;
      flyoutItemRefs.current[next]?.focus();
    }
  };

  const flyoutActive = activeSection === 'dual-capture' || activeSection === 'fleet';
  const barVisible = !hidden || flyoutOpen || mobileMenuOpen || reduceMotion;
  const activeLabel = activeSection ? byId(activeSection).label : '';

  // Hover wash slides between items; the amber underline marks where you are on the page.
  const Indicators = ({ id, active }: { id: string; active: boolean }) => (
    <>
      {hovered === id && (
        <motion.span
          layoutId="nav-hover"
          transition={spring}
          className="absolute inset-0 rounded-lg bg-stone-100 -z-10"
          aria-hidden="true"
        />
      )}
      {active && (
        <motion.span
          layoutId="nav-active"
          transition={spring}
          className="absolute left-3 right-3 bottom-1 h-0.5 rounded-full bg-amber-500"
          aria-hidden="true"
        />
      )}
    </>
  );

  return (
    <>
      {/* Bar */}
      <motion.div
        initial={false}
        animate={{ y: barVisible ? '0%' : '-120%' }}
        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 36 }}
        onFocusCapture={() => setHidden(false)}
        className={`fixed top-0 left-0 right-0 z-50 transition-[padding] duration-300 ease-out ${
          scrolled ? 'py-2 px-3 sm:px-6' : 'py-0 px-0'
        }`}
      >
        <header
          className={`mx-auto transition-all duration-300 ease-out relative ${
            scrolled
              ? 'max-w-5xl bg-white border border-stone-200 rounded-xl shadow-[0_12px_32px_-14px_rgba(28,25,23,0.22)] px-3 sm:px-4'
              : 'w-full bg-white border-b border-stone-200/80 px-4 sm:px-6 lg:px-8'
          }`}
        >
          <div className="w-full flex items-center justify-between h-14 sm:h-16 gap-3">
            {/* Brand: shutter blink, then back to top */}
            <button
              type="button"
              onClick={fireShutter}
              aria-label="SnapStudio, kembali ke atas"
              className={`flex items-center gap-2.5 shrink-0 cursor-pointer select-none text-left rounded-lg group ${FOCUS_RING}`}
            >
              <motion.span
                whileHover={reduceMotion ? undefined : { rotate: -8 }}
                whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                transition={spring}
                className="relative w-9 h-9 rounded-lg bg-stone-950 text-white flex items-center justify-center overflow-hidden"
              >
                <Camera className="w-[18px] h-[18px] relative z-0 group-hover:text-amber-400 transition-colors" />
                {shotKey > 0 && !reduceMotion && (
                  <>
                    <motion.span
                      key={`t-${shotKey}`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: [0, 1, 0] }}
                      transition={{ duration: 0.3, times: [0, 0.45, 1], ease: 'easeInOut' }}
                      className="absolute inset-x-0 top-0 h-1/2 bg-amber-400 origin-top z-10"
                      aria-hidden="true"
                    />
                    <motion.span
                      key={`b-${shotKey}`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: [0, 1, 0] }}
                      transition={{ duration: 0.3, times: [0, 0.45, 1], ease: 'easeInOut' }}
                      className="absolute inset-x-0 bottom-0 h-1/2 bg-amber-400 origin-bottom z-10"
                      aria-hidden="true"
                    />
                  </>
                )}
              </motion.span>

              <span className="flex flex-col leading-none">
                <span className="font-heading-xl text-base sm:text-lg font-bold tracking-tight text-stone-950">
                  Snap<span className="text-amber-600">Studio</span>
                </span>
                {/* Mobile subtitle: shows Precision Booth Ops at top, transitions to active section on scroll */}
                <span className="lg:hidden h-3.5 overflow-hidden relative mt-0.5" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    {activeLabel ? (
                      <motion.span
                        key={activeLabel}
                        initial={reduceMotion ? false : { y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={reduceMotion ? undefined : { y: -8, opacity: 0 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="block text-[10px] font-semibold text-amber-700 tracking-tight"
                      >
                        {activeLabel}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="default-sub"
                        initial={reduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={reduceMotion ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="block text-[10px] font-mono text-stone-500 tracking-tight"
                      >
                        Precision Booth Ops
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </span>
            </button>

            {/* Desktop links */}
            <nav
              aria-label="Navigasi halaman"
              className="hidden lg:flex items-center gap-0.5 text-[13px] font-medium relative"
              onMouseLeave={() => setHovered(null)}
            >
              <div
                ref={flyoutWrapRef}
                className="relative"
                onMouseEnter={openFlyoutByHover}
                onMouseLeave={closeFlyoutByHover}
              >
                <button
                  ref={flyoutBtnRef}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={flyoutOpen}
                  aria-controls="nav-flyout"
                  onClick={onFlyoutButtonClick}
                  onKeyDown={onFlyoutButtonKey}
                  onMouseEnter={() => setHovered('flyout')}
                  onFocus={() => setHovered('flyout')}
                  onBlur={() => setHovered(null)}
                  className={`relative isolate px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer select-none transition-colors ${FOCUS_RING} ${
                    flyoutOpen || flyoutActive ? 'text-stone-950' : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  <Indicators id="flyout" active={flyoutActive && !flyoutOpen} />
                  <span>Fitur &amp; Mode</span>
                  <motion.span
                    animate={{ rotate: flyoutOpen ? 180 : 0 }}
                    transition={spring}
                    className="inline-flex"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 ${flyoutOpen ? 'text-amber-600' : 'text-stone-400'}`} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {flyoutOpen && (
                    <motion.div
                      id="nav-flyout"
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: 4, transition: { duration: 0.12 } }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      onMouseLeave={() => setFlyoutHover(null)}
                      className="absolute top-full left-0 mt-2 w-[340px] bg-white border border-stone-200 rounded-xl p-1.5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_12px_28px_-8px_rgba(28,25,23,0.18)] z-50"
                    >
                      {FLYOUT_ITEMS.map((item, i) => {
                        const Icon = item.icon;
                        const isHere = activeSection === item.id;
                        return (
                          <motion.a
                            key={item.id}
                            ref={(el) => {
                              flyoutItemRefs.current[i] = el;
                            }}
                            href={`#${item.id}`}
                            onClick={(e) => jumpTo(e, item.id)}
                            onKeyDown={(e) => onFlyoutItemKey(e, i)}
                            onMouseEnter={() => setFlyoutHover(item.id)}
                            onFocus={() => setFlyoutHover(item.id)}
                            aria-current={isHere ? 'true' : undefined}
                            initial={reduceMotion ? false : { opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: reduceMotion ? 0 : 0.04 * i }}
                            className={`relative isolate flex items-center gap-3 p-2.5 rounded-lg group ${FOCUS_RING}`}
                          >
                            {flyoutHover === item.id && (
                              <motion.span
                                layoutId="flyout-hover"
                                transition={spring}
                                className="absolute inset-0 rounded-lg bg-stone-100 -z-10"
                                aria-hidden="true"
                              />
                            )}
                            <span
                              className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                                isHere
                                  ? 'bg-amber-400 text-stone-950'
                                  : 'bg-stone-100 text-stone-800 group-hover:bg-stone-950 group-hover:text-white'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[13px] font-semibold text-stone-950">{item.label}</span>
                              <span className="block text-xs text-stone-600 mt-0.5">{item.desc}</span>
                            </span>
                          </motion.a>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {TOP_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => jumpTo(e, link.id)}
                    onMouseEnter={() => setHovered(link.id)}
                    onFocus={() => setHovered(link.id)}
                    onBlur={() => setHovered(null)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative isolate px-3 py-2 rounded-lg select-none transition-colors ${FOCUS_RING} ${
                      isActive ? 'text-stone-950' : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    <Indicators id={link.id} active={isActive} />
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {token ? (
                <Link
                  to="/admin"
                  className={`hidden sm:inline-flex items-center min-h-9 px-4 rounded-lg bg-stone-950 text-white text-xs font-bold shadow-[0_3px_0_0_#f59e0b] hover:-translate-y-px hover:shadow-[0_4px_0_0_#f59e0b] active:translate-y-[3px] active:shadow-none transition-all ${FOCUS_RING}`}
                >
                  Konsol Admin
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className={`hidden sm:inline-flex items-center min-h-9 px-3 rounded-lg text-stone-600 hover:text-stone-950 hover:bg-stone-100 text-[13px] font-medium transition-colors ${FOCUS_RING}`}
                  >
                    Masuk
                  </Link>
                  {/* Same pressed-print button as the final CTA: one amber accent, real press feedback. */}
                  <Link
                    to="/auth/register"
                    className={`inline-flex items-center min-h-9 px-3.5 sm:px-4 rounded-lg bg-stone-950 text-white text-xs font-bold shadow-[0_3px_0_0_#f59e0b] hover:-translate-y-px hover:shadow-[0_4px_0_0_#f59e0b] active:translate-y-[3px] active:shadow-none transition-all ${FOCUS_RING}`}
                  >
                    <span className="sm:hidden">Daftar</span>
                    <span className="hidden sm:inline">Buat Akun Studio</span>
                  </Link>
                </>
              )}

              {/* Hamburger morphs into a close mark */}
              <button
                ref={burgerRef}
                type="button"
                onClick={() => setMobileMenuOpen((o) => !o)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav"
                aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
                className={`lg:hidden w-11 h-11 rounded-lg bg-stone-100 hover:bg-stone-200 active:bg-stone-300 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${FOCUS_RING}`}
              >
                <span className="relative w-5 h-3.5 block" aria-hidden="true">
                  <motion.span
                    animate={mobileMenuOpen ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                    transition={spring}
                    className="absolute left-0 top-0 w-5 h-0.5 rounded-full bg-stone-900"
                  />
                  <motion.span
                    animate={mobileMenuOpen ? { opacity: 0, scaleX: 0.2 } : { opacity: 1, scaleX: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.15 }}
                    className="absolute left-0 top-[6px] w-5 h-0.5 rounded-full bg-stone-900"
                  />
                  <motion.span
                    animate={mobileMenuOpen ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
                    transition={spring}
                    className="absolute left-0 top-[12px] w-5 h-0.5 rounded-full bg-stone-900"
                  />
                </span>
              </button>
            </div>
          </div>
        </header>
      </motion.div>

      {/* Mobile sheet, slides out from under the bar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-stone-950/45"
              aria-hidden="true"
            />

            <motion.nav
              id="mobile-nav"
              aria-label="Menu navigasi"
              initial={reduceMotion ? false : { y: '-100%' }}
              animate={{ y: 0 }}
              exit={reduceMotion ? undefined : { y: '-100%', transition: { duration: 0.22, ease: 'easeIn' } }}
              transition={{ type: 'spring', stiffness: 360, damping: 38 }}
              className="relative w-full bg-white border-b border-stone-200 rounded-b-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08)] max-h-[92vh] overflow-y-auto overscroll-contain pt-[76px] pb-4 px-4 sm:px-6"
            >
              <ul className="space-y-1">
                {SECTIONS.map((item, i) => {
                  const Icon = item.icon;
                  const isHere = activeSection === item.id;
                  return (
                    <motion.li
                      key={item.id}
                      initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: reduceMotion ? 0 : 0.08 + i * 0.03 }}
                    >
                      <a
                        ref={i === 0 ? firstMobileLinkRef : undefined}
                        href={`#${item.id}`}
                        onClick={(e) => jumpTo(e, item.id)}
                        aria-current={isHere ? 'true' : undefined}
                        className={`flex items-center gap-3 min-h-12 px-2.5 py-2 rounded-lg transition-colors ${FOCUS_RING} ${
                          isHere ? 'bg-amber-50' : 'hover:bg-stone-100 active:bg-stone-200'
                        }`}
                      >
                        <span
                          className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
                            isHere ? 'bg-amber-400 text-stone-950' : 'bg-stone-100 text-stone-800'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold text-stone-950">{item.label}</span>
                          <span className="block text-xs text-stone-600">{item.desc}</span>
                        </span>
                        {isHere && <span className="text-[11px] font-medium text-amber-700 shrink-0">Di sini</span>}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduceMotion ? 0 : 0.3 }}
                className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-2 gap-2"
              >
                {token ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`col-span-2 min-h-12 rounded-lg bg-stone-950 text-white text-sm font-bold flex items-center justify-center shadow-[0_3px_0_0_#f59e0b] active:translate-y-[3px] active:shadow-none transition-all ${FOCUS_RING}`}
                  >
                    Buka Konsol Admin
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`min-h-12 rounded-lg border border-stone-300 text-stone-900 text-sm font-semibold flex items-center justify-center hover:bg-stone-100 transition-colors ${FOCUS_RING}`}
                    >
                      Masuk
                    </Link>
                    <Link
                      to="/auth/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`min-h-12 rounded-lg bg-stone-950 text-white text-sm font-bold flex items-center justify-center shadow-[0_3px_0_0_#f59e0b] active:translate-y-[3px] active:shadow-none transition-all ${FOCUS_RING}`}
                    >
                      Buat Akun Studio
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
