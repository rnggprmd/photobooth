import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Printer,
  Camera,
  WifiOff,
  DollarSign,
  HelpCircle,
  ExternalLink,
  Volume2,
  VolumeX,
  RotateCcw,
  Bot,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

interface QuickPrompt {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  query: string;
}

const QUICK_PROMPTS: QuickPrompt[] = [
  { id: 'offline', label: 'Bisa tanpa internet?', icon: WifiOff, query: 'Apakah bisa jalan kalau venue tidak ada sinyal internet?' },
  { id: 'printer', label: 'Printer apa saja didukung?', icon: Printer, query: 'Printer apa saja yang kompatibel dengan SnapStudio?' },
  { id: 'camera', label: 'Kamera Canon & Sony?', icon: Camera, query: 'Apakah kamera Canon EOS dan Sony Alpha bisa terhubung USB?' },
  { id: 'pricing', label: 'Beda Starter vs Pro?', icon: DollarSign, query: 'Apa perbedaan paket Starter Operator dan Studio Pro?' },
  { id: 'domain', label: 'Bisa domain sendiri?', icon: Sparkles, query: 'Bisakah pakai custom domain dan whitelabel studio sendiri?' },
];

// Smart Knowledge Retrieval for Photobooth SaaS
const getBotResponse = (input: string): { text: string; action?: { label: string; href?: string } } => {
  const q = input.toLowerCase();

  // 1. Offline / No Internet / Venue Signal
  if (q.includes('offline') || q.includes('internet') || q.includes('sinyal') || q.includes('koneksi') || q.includes('buffer')) {
    return {
      text: 'Bisa 100%! SnapStudio dirancang khusus untuk venue terpencil seperti ballroom bawah tanah atau pantai tanpa sinyal. Kiosk on-site menggunakan buffer SQLite lokal. Pengambilan foto, overlay frame, dan cetak USB DNP berjalan lancar dengan jeda 0 detik. Begitu kiosk tersambung kembali ke internet, seluruh foto otomatis tersinkron ke cloud.',
      action: {
        label: 'Lihat Arsitektur Dual-Capture',
        href: '#dual-capture',
      },
    };
  }

  // 2. Printer Compatibility
  if (q.includes('printer') || q.includes('dnp') || q.includes('cetak') || q.includes('citizen') || q.includes('hiti') || q.includes('spool')) {
    return {
      text: 'SnapStudio mendukung seluruh printer dye-sublimation standar industri photobooth via Direct Spooling: DNP (DS620, RX1HS, QW410, DS40), Citizen (CX-02, CY-02), dan HiTi (P525L, P720L). Driver native kami mengirim print job langsung tanpa jendela dialog pop-up Windows yang mengganggu antrean tamu.',
      action: {
        label: 'Hitung Biaya Ribbon & Kertas',
        href: '#calculator',
      },
    };
  }

  // 3. Camera Compatibility (Canon, Sony, Nikon)
  if (q.includes('kamera') || q.includes('camera') || q.includes('canon') || q.includes('sony') || q.includes('nikon') || q.includes('dslr') || q.includes('mirrorless') || q.includes('usb') || q.includes('tether')) {
    return {
      text: 'Sangat kompatibel! SnapStudio mendukung tethering USB langsung ke Canon EOS (seri R, Rebel, 5D, 6D, 80D via EDSDK v13), Sony Alpha (A7 series, A6000 series via Sony Camera Remote), Nikon Z, serta webcam resolusi tinggi seperti Logitech Brio 4K. Kiosk menampilkan live view tajam dengan shutter sinkron tanpa delay.',
      action: {
        label: 'Coba Kiosk Simulator',
        href: '#simulator',
      },
    };
  }

  // 4. Pricing / Plans (Starter vs Pro vs Enterprise)
  if (q.includes('harga') || q.includes('paket') || q.includes('biaya') || q.includes('starter') || q.includes('pro') || q.includes('enterprise') || q.includes('beda')) {
    return {
      text: 'Paket SnapStudio berbasis langganan bulanan tanpa potongan per sesi:\n• Starter Operator (Rp 299rb/bln): 1 kiosk on-site aktif, cetak tanpa watermark, galeri QR, 15GB cloud.\n• Studio Pro (Rp 699rb/bln - Paling Favorit): Hingga 5 kiosk aktif bersamaan, direct spooling DNP, integrasi kirim WhatsApp, subdomain studio sendiri, live slideshow panggung, 100GB cloud.\n• Enterprise Agency: Kiosk tanpa batas, whitelabel penuh root domain, kru standby.',
      action: {
        label: 'Lihat Tabel Harga & Perbandingan',
        href: '#pricing',
      },
    };
  }

  // 5. Custom Domain / Whitelabel
  if (q.includes('domain') || q.includes('whitelabel') || q.includes('brand') || q.includes('logo') || q.includes('nama studio')) {
    return {
      text: 'Ya, Anda bisa whitelabel penuh! Di paket Studio Pro Anda mendapatkan subdomain khusus (misal: nama.snapstudio.id), dan di paket Enterprise Anda bisa memakai root domain sendiri (misal: foto.studiosaya.com). Logo, favicon, warna tema, dan pesan WhatsApp dapat disesuaikan sepenuhnya agar brand Anda yang tampil di mata klien dan tamu.',
    };
  }

  // 6. QR Code & Guest Distribution
  if (q.includes('qr') || q.includes('tamu') || q.includes('download') || q.includes('unduh') || q.includes('hp') || q.includes('whatsapp') || q.includes('galeri')) {
    return {
      text: 'Sangat praktis untuk tamu! Begitu sesi foto selesai, layar kiosk menampilkan QR code unik. Tamu cukup scan dengan kamera ponsel (iOS Safari atau Android Chrome) tanpa perlu unduh aplikasi. Galeri mobile responsif akan terbuka instan untuk download foto HD, GIF boomerang, atau share ke Instagram. Di paket Pro, foto juga bisa otomatis terkirim via WhatsApp API!',
    };
  }

  // 7. Free Trial / Uji Coba
  if (q.includes('trial') || q.includes('coba') || q.includes('gratis') || q.includes('daftar') || q.includes('free')) {
    return {
      text: 'Anda bisa mencoba SnapStudio Pro gratis selama 14 hari penuh tanpa perlu memasukkan kartu kredit! Cukup buat akun, unduh launcher kiosk untuk Windows/Mac, dan hubungkan kamera atau printer Anda.',
      action: {
        label: 'Daftar Uji Coba Gratis 14 Hari',
        href: '/auth/register',
      },
    };
  }

  // 8. Template & Frame Design
  if (q.includes('template') || q.includes('frame') || q.includes('strip') || q.includes('ukuran') || q.includes('postcard') || q.includes('format')) {
    return {
      text: 'SnapStudio mendukung semua ukuran cetak photobooth populer: Strip 2x6" (2R, 3-4 foto vertikal), Postcard 4x6" (4R), Polaroid Square, dan Kolase 5R. Anda bisa upload frame PNG transparan beresolusi 300 DPI dari Photoshop atau Canva langsung ke studio template kami.',
      action: {
        label: 'Coba Editor Template Interaktif',
        href: '#templates',
      },
    };
  }

  // Fallback
  return {
    text: 'Pertanyaan Anda sangat menarik! Apakah terkait spesifikasi teknis hardware di lokasi event, integrasi printer DNP, atau setup paket bisnis Anda? Jika butuh konsultasi mendalam atau demo langsung, kru teknis kami siap membantu lewat WhatsApp.',
    action: {
      label: 'Hubungi Kru via WhatsApp',
      href: 'https://wa.me/6281234567890?text=Halo%20SnapStudio,%20saya%20mau%20konsultasi%20fitur',
    },
  };
};

export const LandingChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Halo! Saya asisten operasional SnapStudio. Mau tanya soal kompatibilitas printer DNP, kamera Canon/Sony, mode offline di venue tanpa sinyal, atau rekomendasi paket?',
      timestamp: 'Baru saja',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showTeaser, setShowTeaser] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Soft synth audio pop for chat interactions
  const playPopSound = (freq = 700) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // AudioContext not allowed or not supported
    }
  };

  // Show a teaser badge after 3 seconds on initial landing visit
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTeaser(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isTyping) return;

    playPopSound(880);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate natural realtime thinking & typing delay (450ms - 850ms)
    const thinkingDelay = Math.min(850, Math.max(450, query.length * 15));
    setTimeout(() => {
      const botReply = getBotResponse(query);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply.text,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        action: botReply.action,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      playPopSound(580);
    }, thinkingDelay);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: 'Riwayat obrolan telah direset. Silakan tanyakan hal lain seputar operasional photobooth Anda!',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
        {/* Unread Teaser Balloon */}
        <AnimatePresence>
          {showTeaser && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="mb-3 max-w-[260px] p-3 rounded-2xl bg-stone-950 text-white border border-amber-500/30 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.5)] hidden sm:flex items-start gap-2.5 cursor-pointer relative"
              onClick={() => {
                setIsOpen(true);
                setShowTeaser(false);
                setHasUnread(false);
              }}
            >
              <div className="w-2 h-2 mt-1 rounded-full bg-emerald-400 shrink-0 animate-ping" />
              <div className="flex-1">
                <p className="text-[11px] font-bold text-amber-400 flex items-center justify-between">
                  <span>SnapStudio Ops Bot</span>
                  <span className="text-[9px] text-stone-400 font-mono">ONLINE</span>
                </p>
                <p className="text-[11px] text-stone-200 leading-snug mt-0.5">
                  Ada pertanyaan seputar printer DNP atau kamera? Klik untuk chat instan!
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTeaser(false);
                }}
                className="text-stone-400 hover:text-white p-0.5"
                aria-label="Tutup pesan"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Circle Button */}
        <motion.button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTeaser(false);
            setHasUnread(false);
            playPopSound(isOpen ? 440 : 880);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? 'Tutup chat bot' : 'Buka chat bot operator'}
          className={`relative min-h-12 min-w-12 w-12 h-12 sm:min-h-14 sm:min-w-14 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer shadow-[0_12px_30px_-5px_rgba(0,0,0,0.4)] transition-all ${
            isOpen
              ? 'bg-stone-900 text-white border border-stone-700'
              : 'bg-stone-950 text-white border border-amber-500/40 hover:border-amber-400'
          }`}
        >
          {/* Subtle Rotating Amber Rim when closed */}
          {!isOpen && (
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-400/30 to-amber-600/30 blur-xs -z-10" />
          )}

          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              {/* Online Pulse Dot */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-stone-950 animate-pulse" />
            </div>
          )}

          {/* Unread dot indicator */}
          {!isOpen && hasUnread && (
            <span className="absolute -top-1 -left-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 text-[9px] font-extrabold tracking-tight">
              1
            </span>
          )}
        </motion.button>
      </div>

      {/* Expandable Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="sm:hidden fixed inset-0 bg-stone-950/45 backdrop-blur-xs z-40"
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="fixed bottom-18 right-3 sm:bottom-24 sm:right-6 z-50 w-[360px] sm:w-[400px] max-w-[calc(100vw-1.5rem)] h-[560px] max-h-[82vh] rounded-3xl bg-[#faf9f6] text-stone-950 border border-stone-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden"
            >
            {/* Header: Darkroom Console Style */}
            <div className="p-4 bg-stone-950 text-white border-b border-stone-800 flex items-center justify-between shrink-0 relative overflow-hidden">
              {/* Subtle top amber highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-stone-900 border border-amber-500/40 flex items-center justify-center relative shrink-0 shadow-inner">
                  <Bot className="w-5 h-5 text-amber-400" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-stone-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white tracking-wide">SnapStudio Ops Bot</h3>
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-400/15 border border-amber-400/30 text-[9px] font-mono text-amber-300 font-bold">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 flex items-center gap-1.5 mt-0.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    <span>Kru Teknis Standby • Siap Jawab</span>
                  </p>
                </div>
              </div>

              {/* Utility controls */}
              <div className="flex items-center gap-1 text-stone-400">
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 rounded-lg hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
                  title={soundEnabled ? 'Matikan Suara Audio' : 'Nyalakan Suara Audio'}
                  aria-label="Toggle suara chat"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="p-1.5 rounded-lg hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
                  title="Reset Obrolan"
                  aria-label="Reset chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
                  title="Tutup Chat"
                  aria-label="Tutup jendela chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Chips Rail (Horizontal Scrollable) */}
            <div className="px-3.5 py-2.5 bg-stone-100 border-b border-stone-200/90 overflow-x-auto no-scrollbar shrink-0">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-[10px] font-mono text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1 mr-1">
                  <HelpCircle className="w-3 h-3 text-amber-600" />
                  <span>Saran:</span>
                </span>
                {QUICK_PROMPTS.map((prompt) => {
                  const PromptIcon = prompt.icon;
                  return (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => handleSendMessage(prompt.query)}
                      disabled={isTyping}
                      className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 hover:border-stone-900 text-stone-700 hover:text-stone-950 text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      <PromptIcon className="w-3 h-3 text-stone-500" />
                      <span>{prompt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Feed Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-sans">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                        isBot
                          ? 'bg-white text-stone-900 border border-stone-200/90 rounded-tl-sm'
                          : 'bg-stone-950 text-white border border-stone-900 rounded-tr-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Interactive Deep-link action button if provided */}
                      {msg.action && (
                        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center">
                          {msg.action.href ? (
                            <a
                              href={msg.action.href}
                              onClick={() => {
                                if (msg.action?.href?.startsWith('#')) {
                                  setIsOpen(false);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-stone-950 font-bold text-[11px] hover:bg-amber-300 transition-colors shadow-2xs"
                            >
                              <span>{msg.action.label}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={msg.action.onClick}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-stone-900 text-amber-400 font-bold text-[11px]"
                            >
                              {msg.action.label}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-stone-600 px-1 mt-1">
                      {msg.timestamp}
                    </span>
                  </motion.div>
                );
              })}

              {/* Realistic Realtime Typing Simulation */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 p-3 max-w-[80px] bg-white border border-stone-200 rounded-2xl rounded-tl-sm shadow-2xs"
                >
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" />
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tulis pertanyaan seputar photobooth..."
                disabled={isTyping}
                className="flex-1 min-h-11 px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-950 placeholder-stone-400 text-base sm:text-xs focus:outline-none focus:border-stone-950 focus:bg-white transition-all font-sans"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                aria-label="Kirim pertanyaan"
                className="min-h-11 min-w-11 px-3 rounded-xl bg-stone-950 text-amber-400 hover:bg-stone-900 disabled:opacity-40 disabled:hover:bg-stone-950 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
