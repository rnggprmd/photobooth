import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Layers, Printer, WifiOff, Globe } from 'lucide-react';

interface FaqItem {
  category: 'all' | 'hardware' | 'offline' | 'brand';
  q: string;
  a: string;
}

const CATEGORIES = [
  { id: 'all' as const, label: 'Semua Pertanyaan', icon: Layers },
  { id: 'hardware' as const, label: 'Printer & Kamera', icon: Printer },
  { id: 'offline' as const, label: 'Buffer & Offline', icon: WifiOff },
  { id: 'brand' as const, label: 'Custom Domain', icon: Globe },
];

const FAQS: FaqItem[] = [
  {
    category: 'offline',
    q: 'Apakah SnapStudio bisa berjalan jika venue pernikahan tidak memiliki koneksi internet?',
    a: 'Bisa. Aplikasi kiosk on-site menyimpan data di buffer SQLite lokal. Kiosk tetap mengambil foto, mencetak strip lewat USB, dan memproses frame tanpa jeda. Semua foto tersinkron ke cloud begitu perangkat kembali online.',
  },
  {
    category: 'hardware',
    q: 'Printer photobooth apa saja yang didukung untuk direct spooling?',
    a: 'Printer dye-sublimation yang umum dipakai di photobooth: DNP (DS620, DS40, RX1HS, QW410), Citizen (CX-02, CY-02), dan HiTi (P525L, P720L). Printer lain yang memakai CUPS atau driver Windows standar juga bisa dipakai.',
  },
  {
    category: 'offline',
    q: 'Bagaimana tamu acara mendownload foto dan GIF mereka?',
    a: 'Setelah sesi selesai, layar kiosk menampilkan QR code. Tamu memindainya dengan kamera ponsel (Safari di iOS atau Chrome di Android), tanpa memasang aplikasi, lalu galeri terbuka di browser dan fotonya bisa disimpan.',
  },
  {
    category: 'hardware',
    q: 'Kamera apa saja yang kompatibel untuk mode Kiosk On-Site?',
    a: 'DSLR dan mirrorless Canon EOS (seri R, Rebel, 5D, 6D, 80D), Sony Alpha (seri A7 dan A6000 lewat tethering USB), Nikon Z, serta webcam kelas atas seperti Logitech Brio 4K.',
  },
  {
    category: 'brand',
    q: 'Bisakah saya memakai domain dan branding studio sendiri?',
    a: 'Bisa di paket Studio Pro dan Enterprise. Arahkan domain sendiri (misalnya foto.namastudio.com), ganti favicon dan logo, sehingga nama SnapStudio tidak muncul di depan klien maupun tamu.',
  },
];

export const LandingFaq: React.FC = () => {
  const [open, setOpen] = useState<string | null>(FAQS[0].q);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hardware' | 'offline' | 'brand'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCat = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="faq" className="w-full py-16 lg:py-24 bg-[#faf9f6] border-b border-stone-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-4 lg:sticky lg:top-28 self-start space-y-4"
        >
          {/* Accent bar + heading */}
          <div className="flex gap-4 items-start">
            <div className="hidden sm:flex flex-col items-center gap-1 pt-1.5 shrink-0">
              <div className="w-[3px] h-8 bg-amber-400 rounded-full" />
              <div className="w-[3px] h-2.5 bg-amber-200 rounded-full" />
            </div>
            <h2 className="font-heading-xl text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-950 leading-[1.1]">
              Yang{' '}
              <span className="relative inline-block">
                <span className="relative z-10">biasanya</span>
                {/* Animated wave underline matching the hero treatment */}
                <svg
                  className="absolute left-0 -bottom-1.5 w-full h-2 text-amber-400 overflow-visible pointer-events-none"
                  viewBox="0 0 80 8"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M 0 4 Q 5 1, 10 4 T 20 4 T 30 4 T 40 4 T 50 4 T 60 4 T 70 4 T 80 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>
              </span>{' '}
              ditanyakan operator booth
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Soal printer, kamera, dan venue tanpa sinyal. Kalau pertanyaan Anda belum ada di sini,
            tanyakan langsung ke tim kami.
          </p>

          {/* Quick Search Input */}
          <div className="relative pt-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik (kamera, printer, offline...)"
              className="w-full min-h-11 pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-base sm:text-xs text-stone-900 placeholder-stone-500 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 font-sans"
            />
          </div>

          <a
            href="https://wa.me/6281234567890?text=Halo%20SnapStudio,%20saya%20mau%20tanya"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center min-h-11 text-xs sm:text-sm font-bold text-stone-950 underline underline-offset-4 decoration-2 decoration-amber-500 hover:decoration-stone-950 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-950"
          >
            Tanya langsung lewat WhatsApp
          </a>
        </motion.div>

        <div className="lg:col-span-8 space-y-4">
          {/* High-End Segmented Console Track for Category Filtering */}
          <div className="w-full overflow-x-auto pb-1.5 no-scrollbar">
            <div className="p-1 sm:p-1.5 bg-stone-100/90 rounded-2xl border border-stone-200/90 inline-flex items-center gap-1 sm:gap-1.5 shadow-inner">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                const count =
                  cat.id === 'all'
                    ? FAQS.length
                    : FAQS.filter((f) => f.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`relative min-h-11 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-2 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 ${
                      isSelected ? 'text-white' : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="faq-active-tab-indicator"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        className="absolute inset-0 bg-stone-950 rounded-xl shadow-sm"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 transition-colors ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                      <span className={isSelected ? 'font-bold' : 'font-medium'}>{cat.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                          isSelected
                            ? 'bg-stone-800 text-amber-300'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="border-t border-stone-200 overflow-hidden rounded-b-xl">
            {filteredFaqs.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-600 space-y-3">
                <p>Tidak ada pertanyaan yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="min-h-11 px-4 rounded-xl bg-stone-950 text-white font-bold cursor-pointer hover:bg-black transition-colors"
                >
                  Tampilkan semua pertanyaan
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq, i) => {
                const isOpen = open === faq.q;
                return (
                  <motion.div
                    key={faq.q}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className={`relative border-b border-stone-200 last:border-b-0 transition-colors ${
                      isOpen ? 'bg-white' : 'hover:bg-stone-50/60'
                    }`}
                  >
                    {/* Left amber indicator line when open */}
                    {isOpen && (
                      <motion.div
                        layoutId="faq-open-indicator"
                        className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-400 rounded-r-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : faq.q)}
                      aria-expanded={isOpen}
                      className="group w-full py-4 sm:py-5 flex items-start gap-4 text-left cursor-pointer focus-visible:outline-none min-h-12 pl-4"
                    >
                      <span className="font-mono text-xs text-stone-400 pt-1 w-6 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`flex-1 text-sm sm:text-base font-bold leading-snug transition-colors ${
                          isOpen ? 'text-stone-950' : 'text-stone-800 group-hover:text-stone-950'
                        }`}
                      >
                        {faq.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                        className={`shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          isOpen ? 'bg-amber-400 text-stone-950' : 'bg-stone-100 text-stone-700 group-hover:bg-stone-200'
                        }`}
                      >
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pl-10 pr-11 pb-5 text-xs sm:text-sm text-stone-700 leading-relaxed max-w-2xl">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
