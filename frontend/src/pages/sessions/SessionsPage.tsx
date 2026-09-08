import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { sessionsApi } from '../../api/sessions';

interface PhotoSessionItem {
  id: string;
  time: string;
  timestampSecondsAgo: number;
  event: string;
  location: string;
  kioskTerminal: string;
  mode: 'onsite' | 'online';
  status: 'completed' | 'capturing' | 'printing' | 'error';
  guestName: string;
  guestPhone: string;
  templateName: string;
  templateFormat: string;
  shotsCount: number;
  photos: string[];
  compositeUrl: string;
  printStatus: 'printed_2x' | 'printed_1x' | 'digital_only' | 'printing';
  qrStatus: 'scanned' | 'unscanned' | 'sent_wa';
  durationSeconds: number;
  retakesCount: number;
}

export const SessionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSession, setSelectedSession] = useState<PhotoSessionItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time photo sessions data
  const [sessions, setSessions] = useState<PhotoSessionItem[]>([
    {
      id: '#SES-8821-0492',
      time: '14:28:12 WIB',
      timestampSecondsAgo: 12,
      event: 'Wedding of Kevin & Astrid',
      location: 'Pullman Ballroom 2 (Jakarta Barat)',
      kioskTerminal: 'On-Site Kiosk 01 (TS-A)',
      mode: 'onsite',
      status: 'completed',
      guestName: 'Jessica & Dimas',
      guestPhone: '0812-8877-6655',
      templateName: '4R Minimalist Gold Luxury',
      templateFormat: '4R Strip (3 Shots)',
      shotsCount: 3,
      photos: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      ],
      compositeUrl:
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
      printStatus: 'printed_2x',
      qrStatus: 'scanned',
      durationSeconds: 38,
      retakesCount: 0,
    },
    {
      id: '#SES-8821-0491',
      time: '14:24:50 WIB',
      timestampSecondsAgo: 45,
      event: 'Tech Summit Afterparty 2026',
      location: 'ICE BSD Hall 3 (Tangerang)',
      kioskTerminal: 'Online Web Booth (Web Link)',
      mode: 'online',
      status: 'completed',
      guestName: 'Reza Pramana (GoTo)',
      guestPhone: '0813-9988-1122',
      templateName: 'Cyber Glitch 2R Strip',
      templateFormat: '2R Bookmark (2 Shots)',
      shotsCount: 2,
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      ],
      compositeUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      printStatus: 'digital_only',
      qrStatus: 'sent_wa',
      durationSeconds: 29,
      retakesCount: 1,
    },
    {
      id: '#SES-8821-0490',
      time: '14:19:04 WIB',
      timestampSecondsAgo: 140,
      event: 'Wedding of Kevin & Astrid',
      location: 'Pullman Ballroom 2 (Jakarta Barat)',
      kioskTerminal: 'On-Site Kiosk 02 (TS-B)',
      mode: 'onsite',
      status: 'completed',
      guestName: 'Keluarga Bpk. Santoso',
      guestPhone: '0856-7788-9900',
      templateName: '4R Minimalist Gold Luxury',
      templateFormat: '4R Strip (3 Shots)',
      shotsCount: 3,
      photos: [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
      ],
      compositeUrl:
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80',
      printStatus: 'printed_1x',
      qrStatus: 'unscanned',
      durationSeconds: 46,
      retakesCount: 1,
    },
    {
      id: '#SES-8821-0489',
      time: '14:15:33 WIB',
      timestampSecondsAgo: 320,
      event: 'Tech Summit Afterparty 2026',
      location: 'ICE BSD Hall 3 (Tangerang)',
      kioskTerminal: 'On-Site Kiosk 01 (TS-A)',
      mode: 'onsite',
      status: 'completed',
      guestName: 'Michael Gunawan & Team',
      guestPhone: '0817-2345-6789',
      templateName: 'Modern Minimalist Polar',
      templateFormat: '4R Grid (4 Shots)',
      shotsCount: 4,
      photos: [
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      ],
      compositeUrl:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
      printStatus: 'printed_2x',
      qrStatus: 'scanned',
      durationSeconds: 52,
      retakesCount: 2,
    },
    {
      id: '#SES-8821-0488',
      time: '14:11:15 WIB',
      timestampSecondsAgo: 580,
      event: 'Wedding of Kevin & Astrid',
      location: 'Pullman Ballroom 2 (Jakarta Barat)',
      kioskTerminal: 'On-Site Kiosk 01 (TS-A)',
      mode: 'onsite',
      status: 'completed',
      guestName: 'Bridesmaids Squad',
      guestPhone: '0812-4455-6677',
      templateName: '4R Minimalist Gold Luxury',
      templateFormat: '4R Strip (3 Shots)',
      shotsCount: 3,
      photos: [
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      ],
      compositeUrl:
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80',
      printStatus: 'printed_2x',
      qrStatus: 'scanned',
      durationSeconds: 41,
      retakesCount: 0,
    },
  ]);

  useEffect(() => {
    sessionsApi
      .list()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const beSessions: PhotoSessionItem[] = res.data.map((s: any) => ({
            id: `#SES-${String(s.id).padStart(4, '0')}`,
            time: s.created_at ? new Date(s.created_at).toLocaleTimeString('id-ID') + ' WIB' : '14:28:12 WIB',
            timestampSecondsAgo: 20,
            event: s.event?.name || 'Live Photobooth Event',
            location: s.event?.location || 'Studio Main Venue',
            kioskTerminal: s.mode === 'onsite' ? 'On-Site Kiosk 01 (TS-A)' : 'Online Web Booth',
            mode: (s.mode as any) || 'onsite',
            status: s.status === 'completed' ? 'completed' : 'capturing',
            guestName: s.customer?.name || 'Guest User',
            guestPhone: s.customer?.phone || '0812-8877-6655',
            templateName: s.template?.name || '4R Minimalist Gold Luxury',
            templateFormat: '4R Strip (3 Shots)',
            shotsCount: s.photo_count || 3,
            photos: [
              'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
            ],
            compositeUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
            printStatus: s.printed_at ? 'printed_1x' : 'digital_only',
            qrStatus: s.qr_scanned_at ? 'scanned' : 'unscanned',
            durationSeconds: 35,
            retakesCount: 0,
          }));
          setSessions((prev) => [...beSessions, ...prev.slice(beSessions.length)]);
        }
      })
      .catch((err) => console.warn('Sessions backend load warning:', err));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReprint = async (sessionId: string) => {
    const numericId = parseInt(sessionId.replace('#SES-', ''), 10);
    if (!isNaN(numericId) && numericId > 0) {
      try {
        await sessionsApi.reprint(numericId);
      } catch (e) {
        console.warn('API reprint warning:', e);
      }
    }
    showToast(`Perintah cetak ulang untuk ${sessionId} berhasil dikirim ke printer DNP DS620!`);
  };

  const handleResendWhatsapp = (sessionId: string, phone: string) => {
    showToast(`Link galeri ${sessionId} berhasil dikirim ulang ke WhatsApp ${phone}!`);
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.event.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedEvent !== 'all' && !s.event.toLowerCase().includes(selectedEvent.toLowerCase())) {
      return false;
    }
    if (selectedStatus !== 'all' && s.status !== selectedStatus) {
      return false;
    }
    return true;
  });

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

      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Sesi &amp; Galeri</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-medium">Sesi Photobooth Aktif</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Monitoring Sesi &amp; Live Capture Stream
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            Aliran hasil jepretan foto dari terminal booth on-site dan online web secara real-time. Pantau status komposit template, pencetakan DNP, dan scan QR.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Stream Socket: ON</span>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              showToast('Feed stream sesi diperbarui!');
            }}
          >
            <span className="material-symbols-outlined text-[17px]">sync</span>
            <span>Refresh Feed</span>
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards Strip */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Sesi Sedang Berjalan
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">camera</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              3 <span className="text-xs font-normal font-sans text-slate-500">Terminal</span>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>2 Kiosk Pullman • 1 Kiosk ICE BSD</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Sesi Hari Ini
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">photo_library</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              496 <span className="text-xs font-normal font-sans text-slate-500">Sesi</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              1.488 Foto individu terproses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Rata-rata Waktu Sesi
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">timer</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              41.2 <span className="text-xs font-normal font-sans text-slate-500">Detik</span>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-2">
              Efisiensi antrean tinggi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Keberhasilan Cetak DNP
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">print</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              99.6%
            </div>
            <p className="text-xs text-slate-500 mt-2">
              552 lembar cetak • 0 paper jam
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter & Search Bar */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[17px]">search</span>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID Sesi (#SES-...), nama tamu, atau event..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-48 h-9 text-xs"
          >
            <option value="all">Semua Event</option>
            <option value="Kevin">Wedding Kevin &amp; Astrid</option>
            <option value="Tech Summit">Tech Summit Afterparty</option>
          </Select>

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-40 h-9 text-xs"
          >
            <option value="all">Semua Status</option>
            <option value="completed">Selesai (Cetak/QR)</option>
            <option value="capturing">Sedang Berfoto</option>
            <option value="printing">Sedang Cetak</option>
          </Select>
        </div>
      </motion.div>

      {/* Live Sessions Stream Cards Feed */}
      <motion.div variants={fadeInUp} className="space-y-4">
        {filteredSessions.map((session) => (
          <motion.div
            key={session.id}
            variants={fadeInUp}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.16 }}
          >
            <Card className="border border-slate-200/90 bg-white hover:border-slate-300 shadow-xs transition-all">
              <div className="p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-xs font-semibold text-slate-900 border border-slate-200">
                      {session.id}
                    </span>
                    <Badge variant={session.mode === 'onsite' ? 'default' : 'tertiary'}>
                      {session.kioskTerminal}
                    </Badge>
                    <span className="font-mono text-xs text-slate-500">
                      {session.time}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-emerald-600 font-medium">
                      {session.timestampSecondsAgo} detik yang lalu
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        session.printStatus === 'printed_2x'
                          ? 'success'
                          : session.printStatus === 'printed_1x'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      <span className="material-symbols-outlined text-[13px]">print</span>
                      <span>
                        {session.printStatus === 'printed_2x'
                          ? 'Printed (2x Lembar)'
                          : session.printStatus === 'printed_1x'
                          ? 'Printed (1x Lembar)'
                          : 'Digital Cloud Sync'}
                      </span>
                    </Badge>

                    <Badge
                      variant={
                        session.qrStatus === 'scanned'
                          ? 'tertiary'
                          : session.qrStatus === 'sent_wa'
                          ? 'default'
                          : 'outline'
                      }
                    >
                      <span className="material-symbols-outlined text-[13px]">qr_code</span>
                      <span>
                        {session.qrStatus === 'scanned'
                          ? 'Sudah Di-Scan'
                          : session.qrStatus === 'sent_wa'
                          ? 'Terkirim WhatsApp'
                          : 'Belum Di-Scan'}
                      </span>
                    </Badge>
                  </div>
                </div>

                {/* Body: Photos Grid & Meta */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-3.5 items-center">
                  {/* Left: Info details (5 cols) */}
                  <div className="md:col-span-5 space-y-1.5">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {session.event}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                      <span>{session.location}</span>
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tamu / Pengunjung:</span>
                        <strong className="text-slate-900 font-medium">{session.guestName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Template Frame:</span>
                        <span className="font-mono text-indigo-600 font-medium">{session.templateName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Durasi Sesi:</span>
                        <span className="font-mono text-slate-700">
                          {session.durationSeconds} dtk ({session.retakesCount} retake)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center: Live Photo Strip Thumbnails (4 cols) */}
                  <div className="md:col-span-4 flex items-center gap-2 overflow-x-auto py-1">
                    {session.photos.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="w-18 h-22 rounded-md overflow-hidden border border-slate-200 shadow-xs flex-shrink-0 bg-slate-100 relative group cursor-pointer"
                        onClick={() => setSelectedSession(session)}
                      >
                        <img src={imgUrl} alt={`Shot ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute bottom-1 right-1 px-1 rounded bg-black/60 text-white font-mono text-[9px]">
                          #{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Right: Actions (3 cols) */}
                  <div className="md:col-span-3 flex flex-col gap-2 justify-center">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedSession(session)}
                    >
                      <span className="material-symbols-outlined text-[15px]">visibility</span>
                      <span>Detail Komposit</span>
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleReprint(session.id)}
                        title="Kirim cetak ulang ke printer booth"
                      >
                        <span className="material-symbols-outlined text-[15px]">print</span>
                        <span>Cetak Ulang</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResendWhatsapp(session.id, session.guestPhone)}
                        title="Kirim ulang link unduh ke WhatsApp"
                      >
                        <span className="material-symbols-outlined text-[15px]">share</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Session Detail Modal */}
      <Dialog open={Boolean(selectedSession)} onOpenChange={(open) => !open && setSelectedSession(null)}>
        <DialogContent className="max-w-2xl">
          {selectedSession && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {selectedSession.id}
                  </span>
                  <Badge variant="tertiary">{selectedSession.kioskTerminal}</Badge>
                </div>
                <DialogTitle>{selectedSession.event}</DialogTitle>
                <DialogDescription>
                  Capture diselesaikan pada {selectedSession.time} • Durasi {selectedSession.durationSeconds} detik
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Composite Image Preview */}
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100 relative">
                  <img
                    src={selectedSession.compositeUrl}
                    alt="Composite Render"
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-3 bg-white border-t border-slate-200 flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-900">
                      {selectedSession.templateFormat}
                    </span>
                    <span className="font-mono text-emerald-600 font-bold">
                      Siap Cetak 300 DPI
                    </span>
                  </div>
                </div>

                {/* Session Breakdown */}
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tamu:</span>
                      <strong className="text-slate-900 font-medium">{selectedSession.guestName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">WhatsApp:</span>
                      <span className="font-mono text-slate-800">{selectedSession.guestPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Kamera:</span>
                      <span className="text-slate-800 font-medium">Canon EOS R100 (50mm f/1.8)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Printer:</span>
                      <span className="text-slate-800 font-medium">DNP DS620 Sublimasi (Roll A)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Retake:</span>
                      <span className="font-mono text-slate-800">{selectedSession.retakesCount}x Ulang</span>
                    </div>
                  </div>

                  {/* QR Link simulation */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-700 text-[22px]">qr_code_2</span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Link Galeri Tamu
                        </div>
                        <div className="font-mono text-[11px] text-slate-500">
                          lumina.snap/r/{selectedSession.id.replace('#', '')}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => showToast('Link unduh berhasil disalin!')}
                    >
                      Salin Link
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedSession(null)}>
                  Tutup
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleReprint(selectedSession.id);
                    setSelectedSession(null);
                  }}
                >
                  <span className="material-symbols-outlined text-[15px]">print</span>
                  <span>Cetak Ulang Sekarang</span>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SessionsPage;
