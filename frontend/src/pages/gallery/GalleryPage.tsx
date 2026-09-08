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
import { galleryApi } from '../../api/gallery';

interface GalleryPhotoItem {
  id: string;
  sessionId: string;
  guestName: string;
  event: string;
  format: '4R Strip' | '2R Bookmark' | '4R Postcard' | 'Polaroid Grid' | 'Cyber Glitch';
  imageUrl: string;
  qrCodeUrl: string;
  scansCount: number;
  downloadsCount: number;
  takenAt: string;
  fileSize: string;
  aspectRatio: string;
}

export const GalleryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [activePhoto, setActivePhoto] = useState<GalleryPhotoItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Gallery items data
  const [photos, setPhotos] = useState<GalleryPhotoItem[]>([
    {
      id: 'GLR-0982',
      sessionId: '#SES-8821-0492',
      guestName: 'Jessica & Dimas',
      event: 'Wedding of Kevin & Astrid',
      format: '4R Strip',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://lumina.snapstudio.id/results/tok_88210492',
      scansCount: 18,
      downloadsCount: 12,
      takenAt: 'Hari ini, 14:28 WIB',
      fileSize: '3.4 MB',
      aspectRatio: '2:3 (4R Vertical Strip)',
    },
    {
      id: 'GLR-0981',
      sessionId: '#SES-8821-0491',
      guestName: 'Reza Pramana & Dev Team',
      event: 'Tech Summit Afterparty 2026',
      format: 'Cyber Glitch',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://lumina.snapstudio.id/results/tok_88210491',
      scansCount: 42,
      downloadsCount: 38,
      takenAt: 'Hari ini, 14:24 WIB',
      fileSize: '2.8 MB',
      aspectRatio: '1:2 (2R Strip)',
    },
    {
      id: 'GLR-0980',
      sessionId: '#SES-8821-0490',
      guestName: 'Keluarga Bpk. Santoso',
      event: 'Wedding of Kevin & Astrid',
      format: '4R Strip',
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://lumina.snapstudio.id/results/tok_88210490',
      scansCount: 9,
      downloadsCount: 6,
      takenAt: 'Hari ini, 14:19 WIB',
      fileSize: '4.1 MB',
      aspectRatio: '2:3 (4R Vertical Strip)',
    },
    {
      id: 'GLR-0979',
      sessionId: '#SES-8821-0489',
      guestName: 'Michael Gunawan & Squad',
      event: 'Tech Summit Afterparty 2026',
      format: 'Polaroid Grid',
      imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://lumina.snapstudio.id/results/tok_88210489',
      scansCount: 27,
      downloadsCount: 22,
      takenAt: 'Hari ini, 14:15 WIB',
      fileSize: '3.9 MB',
      aspectRatio: '4:5 (Grid 4-Slots)',
    },
    {
      id: 'GLR-0978',
      sessionId: '#SES-8821-0488',
      guestName: 'Bridesmaids Squad',
      event: 'Wedding of Kevin & Astrid',
      format: '2R Bookmark',
      imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=80',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://lumina.snapstudio.id/results/tok_88210488',
      scansCount: 31,
      downloadsCount: 29,
      takenAt: 'Hari ini, 14:11 WIB',
      fileSize: '2.5 MB',
      aspectRatio: '1:3 (Bookmark Cut)',
    },
    {
      id: 'GLR-0977',
      sessionId: '#SES-8821-0485',
      guestName: 'Clara & Besties',
      event: 'Sweet 17th Birthday Clara',
      format: '4R Postcard',
      imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://lumina.snapstudio.id/results/tok_88210485',
      scansCount: 54,
      downloadsCount: 48,
      takenAt: 'Kemarin, 21:30 WIB',
      fileSize: '3.7 MB',
      aspectRatio: '4:6 (Postcard Landscape)',
    },
  ]);

  useEffect(() => {
    galleryApi
      .list()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const bePhotos: GalleryPhotoItem[] = res.data.map((g: any) => ({
            id: `GLR-${String(g.id).padStart(4, '0')}`,
            sessionId: g.photo_session_id ? `#SES-${String(g.photo_session_id).padStart(4, '0')}` : '#SES-8821-0492',
            guestName: g.photo_session?.customer?.name || 'Studio Guest',
            event: g.photo_session?.event?.name || 'Live Photobooth Event',
            format: '4R Strip',
            imageUrl: g.composite_media?.file_path || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
            qrCodeUrl: g.qr_media?.file_path || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${window.location.origin}/results/${g.result_token}`,
            scansCount: 14,
            downloadsCount: 8,
            takenAt: g.created_at ? new Date(g.created_at).toLocaleDateString('id-ID') : 'Hari ini',
            fileSize: '3.4 MB',
            aspectRatio: '2:3 (4R Vertical Strip)',
          }));
          setPhotos((prev) => [...bePhotos, ...prev.slice(bePhotos.length)]);
        }
      })
      .catch((err) => console.warn('Gallery backend load warning:', err));
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredPhotos = photos.filter((photo) => {
    const matchesSearch =
      photo.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.sessionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.event.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedFormat !== 'all' && photo.format !== selectedFormat) return false;
    if (selectedEvent !== 'all' && !photo.event.toLowerCase().includes(selectedEvent.toLowerCase())) {
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
            <span className="text-slate-800 font-medium">Galeri Foto &amp; QR</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Galeri Komposit &amp; Distribusi QR Code
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            Arsip seluruh foto komposit siap cetak dan aset digital beresolusi tinggi. Bagikan tautan galeri publik atau unduh barcode QR untuk scan smartphone tamu.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => showToast('Link portal galeri publik berhasil disalin!')}
          >
            <span className="material-symbols-outlined text-[17px]">share</span>
            <span>Salin Link Galeri</span>
          </Button>
          <Button
            variant="primary"
            onClick={() => showToast('Memulai pengunduhan seluruh file foto (ZIP 148 MB)...')}
          >
            <span className="material-symbols-outlined text-[17px]">folder_zip</span>
            <span>Unduh Semua (ZIP)</span>
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards Strip */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Foto Tersimpan
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">photo_library</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              4.896 <span className="text-xs font-normal font-sans text-slate-500">File</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Kualitas 300 DPI siap cetak
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Scan QR Tamu
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              12.420 <span className="text-xs font-normal font-sans text-slate-500">Scan</span>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>Rata-rata 2.5x scan per sesi</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Penyimpanan Cloud (S3)
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">cloud_queue</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              14.2 <span className="text-xs font-normal font-sans text-slate-500">/ 25 GB</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              56.8% Kuota AWS S3 Jakarta Region
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Tingkat Unduh File
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">cloud_download</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              91.4%
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-2">
              Mayoritas tamu simpan foto di HP
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter Toolbar */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[17px]">search</span>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama tamu, sesi ID, atau event..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="w-44 h-9 text-xs"
          >
            <option value="all">Semua Format</option>
            <option value="4R Strip">4R Strip</option>
            <option value="2R Bookmark">2R Bookmark</option>
            <option value="4R Postcard">4R Postcard</option>
            <option value="Polaroid Grid">Polaroid Grid</option>
            <option value="Cyber Glitch">Cyber Glitch</option>
          </Select>

          <Select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-48 h-9 text-xs"
          >
            <option value="all">Semua Event</option>
            <option value="Kevin">Wedding Kevin &amp; Astrid</option>
            <option value="Tech Summit">Tech Summit Afterparty</option>
            <option value="Clara">Sweet 17th Clara</option>
          </Select>
        </div>
      </motion.div>

      {/* Visual Photos Grid */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {filteredPhotos.map((photo) => (
          <motion.div
            key={photo.id}
            variants={fadeInUp}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.16 }}
          >
            <Card
              className="group overflow-hidden hover:border-slate-300 transition-all border border-slate-200/90 bg-white shadow-xs cursor-pointer flex flex-col justify-between h-full"
              onClick={() => setActivePhoto(photo)}
            >
              {/* Image Preview Thumbnail */}
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                <img
                  src={photo.imageUrl}
                  alt={photo.guestName}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-250"
                />

                {/* Badges on Image */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <Badge variant="default" className="shadow-xs">
                    {photo.format}
                  </Badge>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white font-mono text-[10px] font-semibold">
                    {photo.sessionId}
                  </span>
                </div>

                {/* Hover Overlay Buttons */}
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                  <span className="w-9 h-9 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                  </span>
                  <span className="w-9 h-9 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                  </span>
                </div>
              </div>

              {/* Meta Info */}
              <div className="p-4 space-y-1.5 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">
                    {photo.guestName}
                  </h3>
                  <span className="font-mono text-[11px] text-slate-400 flex-shrink-0">
                    {photo.fileSize}
                  </span>
                </div>

                <p className="text-xs text-slate-500 truncate">
                  {photo.event}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 font-mono text-xs">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-slate-400">qr_code</span>
                    <strong className="text-slate-800">{photo.scansCount}</strong> Scan
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-slate-400">download</span>
                    <strong className="text-slate-800">{photo.downloadsCount}</strong> Unduhan
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">{photo.takenAt.split(',')[0]}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox / QR Code Modal */}
      <Dialog open={Boolean(activePhoto)} onOpenChange={(open) => !open && setActivePhoto(null)}>
        <DialogContent className="max-w-2xl">
          {activePhoto && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{activePhoto.format}</Badge>
                  <span className="font-mono text-xs text-slate-500">
                    {activePhoto.sessionId}
                  </span>
                </div>
                <DialogTitle>{activePhoto.guestName}</DialogTitle>
                <DialogDescription>
                  {activePhoto.event} • Diproses pada {activePhoto.takenAt} ({activePhoto.fileSize})
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 items-center">
                {/* Photo High-Res Preview */}
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100 aspect-[3/4] relative">
                  <img
                    src={activePhoto.imageUrl}
                    alt={activePhoto.guestName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* QR Code Scan Area */}
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
                  <div className="p-3 bg-white rounded-lg shadow-xs border border-slate-200">
                    <img
                      src={activePhoto.qrCodeUrl}
                      alt="QR Code"
                      className="w-40 h-40 object-contain"
                    />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">
                      Scan QR untuk Unduh
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                      Arahkan kamera smartphone ke kode QR untuk membuka galeri digital dan unduh foto resolusi tinggi.
                    </p>
                  </div>

                  <div className="w-full pt-2 flex flex-col gap-2">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => showToast('Foto resolusi penuh berhasil diunduh!')}
                    >
                      <span className="material-symbols-outlined text-[17px]">download</span>
                      <span>Unduh File Resolusi Penuh</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => showToast('Link unduh publik disalin ke clipboard!')}
                    >
                      <span className="material-symbols-outlined text-[17px]">link</span>
                      <span>Salin Tautan Publik</span>
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setActivePhoto(null)}>
                  Tutup Galeri
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default GalleryPage;
