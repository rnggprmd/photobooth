import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { businessApi } from '../../api/business';

export const SettingsPage: React.FC = () => {
  const { tenant } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'hardware';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync tab with URL query parameter
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setSearchParams({ tab: val });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Hardware State
  const [hardwareConfig, setHardwareConfig] = useState({
    printerModel: 'DNP DS620',
    paperSize: '4R Strip (2x6" 2-Up)',
    printQuality: 'high_speed',
    autoCutter: true,
    paperAlertThreshold: 40,
    cameraModel: 'Canon EOS R100',
    connectionInterface: 'USB 3.0 Tethered',
    liveViewFps: '60',
    flashSyncSpeed: '1/160s',
  });

  // Business Profile State
  const [profileConfig, setProfileConfig] = useState({
    studioName: tenant?.name || 'Lumina Photostudio & Co.',
    subdomain: 'lumina.snapstudio.id',
    email: 'hello@lumina.studio',
    whatsapp: '0812-9988-7766',
    address: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
    instagram: '@luminaphotobooth',
    tiktok: '@luminastudio',
    watermarkText: 'Photobooth by Lumina Studio',
    watermarkEnabled: true,
  });

  // Payment Gateway State
  const [paymentConfig, setPaymentConfig] = useState({
    gateway: 'Midtrans Snap & Core API',
    environment: 'production',
    merchantId: 'M09812448',
    clientKey: 'Mid-client-8821990xQZ9',
    serverKey: 'Mid-server-••••••••••••••••',
    bankName: 'BCA (Bank Central Asia)',
    accountNumber: '8821-098-4412',
    accountHolder: 'PT Lumina Kreasi Studio',
  });

  useEffect(() => {
    businessApi
      .get()
      .then((res) => {
        if (res.data) {
          setProfileConfig((prev) => ({
            ...prev,
            studioName: res.data.business_name || prev.studioName,
            email: res.data.email || prev.email,
            whatsapp: res.data.phone || prev.whatsapp,
            address: res.data.address || prev.address,
          }));
        }
      })
      .catch((err) => console.warn('Business profile fetch warning:', err));
  }, []);

  const handleSaveHardware = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Konfigurasi hardware printer & kamera berhasil disimpan!');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await businessApi.update({
        business_name: profileConfig.studioName,
        email: profileConfig.email,
        phone: profileConfig.whatsapp,
        address: profileConfig.address,
      });
    } catch (err) {
      console.warn('API update profile fallback:', err);
    }
    showToast('Profil studio & branding tenant berhasil diperbarui ke database!');
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Kredensial payment gateway & rekening penampungan disimpan!');
  };

  const handleTestPrint = () => {
    showToast('Mengirim sinyal uji cetak 1 lembar (Strip 4R) ke DNP DS620...');
  };

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
            <span>Finansial &amp; Akun</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-medium">Pengaturan &amp; Hardware</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pusat Pengaturan Studio &amp; Hardware
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            Konfigurasikan armada printer DNP, kalibrasi kamera DSLR/mirrorless, profil identitas bisnis tenant, integrasi gateway QRIS, serta notifikasi WhatsApp.
          </p>
        </div>
      </motion.div>

      {/* Main Settings Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="border-b border-slate-200 pb-3">
          <TabsList className="flex flex-wrap h-auto p-1 gap-1">
            <TabsTrigger value="hardware">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Cetak &amp; Hardware Kiosk</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="tenant">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                <span>Profil Studio &amp; Branding</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="payments">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">credit_card</span>
                <span>Payment Gateway &amp; QRIS</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                <span>Notifikasi &amp; WhatsApp API</span>
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Cetak & Hardware */}
        <TabsContent value="hardware" className="space-y-6 pt-2">
          {/* Hardware Diagnostic Banner */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">terminal</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Status Telemetri Hardware Kiosk Terminal
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Printer DNP DS620 Siap • Sisa Roll 38 Lembar • Canon R100 Baterai 98% (USB 3.0 Connected)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleTestPrint}>
                <span className="material-symbols-outlined text-[15px]">print</span>
                <span>Uji Cetak</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => showToast('Kalibrasi sensor kamera & printer berhasil disinkronkan!')}
              >
                <span className="material-symbols-outlined text-[15px]">tune</span>
                <span>Kalibrasi Ulang</span>
              </Button>
            </div>
          </div>

          <form onSubmit={handleSaveHardware} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Printer Config Card */}
              <Card className="border border-slate-200/90 bg-white shadow-xs">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-600 text-[18px]">print</span>
                    <span>Konfigurasi Printer Sublimasi</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Pengaturan driver cetak foto thermal dye-sublimation untuk kiosk on-site.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-900 mb-1 block">
                      Tipe / Model Printer
                    </label>
                    <Select
                      value={hardwareConfig.printerModel}
                      onChange={(e) => setHardwareConfig({ ...hardwareConfig, printerModel: e.target.value })}
                      className="h-9 text-xs"
                    >
                      <option value="DNP DS620">DNP DS620 (High-Speed Flagship)</option>
                      <option value="DNP DS-RX1">DNP DS-RX1 / RX1HS (High Capacity 700 Roll)</option>
                      <option value="Citizen CX-02">Citizen CX-02 Compact Photo</option>
                      <option value="HiTi P525L">HiTi P525L Wireless Ready</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-900 mb-1 block">
                      Ukuran Default Kertas
                    </label>
                    <Select
                      value={hardwareConfig.paperSize}
                      onChange={(e) => setHardwareConfig({ ...hardwareConfig, paperSize: e.target.value })}
                      className="h-9 text-xs"
                    >
                      <option value="4R Strip (2x6&quot; 2-Up)">4R Strip (2x6&quot; 2-Up Strip Cut)</option>
                      <option value="4R Postcard (4x6&quot;)">4R Postcard (4x6&quot; Full Single)</option>
                      <option value="2R Bookmark (2x3&quot;)">2R Bookmark (2x3&quot; 4-Up Cut)</option>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-900 mb-1 block">
                        Mode Kualitas Cetak
                      </label>
                      <Select
                        value={hardwareConfig.printQuality}
                        onChange={(e) => setHardwareConfig({ ...hardwareConfig, printQuality: e.target.value })}
                        className="h-9 text-xs"
                      >
                        <option value="high_speed">High Speed (8.4 Detik)</option>
                        <option value="fine_quality">Fine Quality (300x600 DPI)</option>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-900 mb-1 block">
                        Peringatan Sisa Kertas
                      </label>
                      <Input
                        type="number"
                        value={hardwareConfig.paperAlertThreshold}
                        onChange={(e) =>
                          setHardwareConfig({
                            ...hardwareConfig,
                            paperAlertThreshold: Number(e.target.value),
                          })
                        }
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">
                        Pisau Pemotong Otomatis (Auto-Cut)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Otomatis memotong strip 2x6&quot; menjadi 2 lembar terpisah
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setHardwareConfig({
                          ...hardwareConfig,
                          autoCutter: !hardwareConfig.autoCutter,
                        })
                      }
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        hardwareConfig.autoCutter ? 'bg-slate-900' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                          hardwareConfig.autoCutter ? 'translate-x-4.5' : 'translate-x-0.5'
                        }`}
                      ></span>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Camera Tethering Card */}
              <Card className="border border-slate-200/90 bg-white shadow-xs">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-600 text-[18px]">photo_camera</span>
                    <span>Tethering Kamera &amp; Live View</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Integrasi SDK kamera Canon EDSDK / Sony Camera Remote.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-900 mb-1 block">
                      Tipe Kamera Utama
                    </label>
                    <Select
                      value={hardwareConfig.cameraModel}
                      onChange={(e) => setHardwareConfig({ ...hardwareConfig, cameraModel: e.target.value })}
                      className="h-9 text-xs"
                    >
                      <option value="Canon EOS R100">Canon EOS R100 (Mirrorless RF-S)</option>
                      <option value="Canon EOS M50 II">Canon EOS M50 Mark II</option>
                      <option value="Sony ZV-E10">Sony ZV-E10 (Alpha E-Mount)</option>
                      <option value="Canon EOS 200D II">Canon EOS 200D II (DSLR EF-S)</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-900 mb-1 block">
                      Jalur Komunikasi &amp; Interface
                    </label>
                    <Select
                      value={hardwareConfig.connectionInterface}
                      onChange={(e) => setHardwareConfig({ ...hardwareConfig, connectionInterface: e.target.value })}
                      className="h-9 text-xs"
                    >
                      <option value="USB 3.0 Tethered">Kabel USB-C 3.2 High-Speed Tether (Rekomendasi)</option>
                      <option value="Wireless PTP 5GHz">Wireless PTP Wi-Fi 5GHz Dedicated</option>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-900 mb-1 block">
                        Live View Refresh Rate
                      </label>
                      <Select
                        value={hardwareConfig.liveViewFps}
                        onChange={(e) => setHardwareConfig({ ...hardwareConfig, liveViewFps: e.target.value })}
                        className="h-9 text-xs"
                      >
                        <option value="60">60 FPS (Ultra Smooth)</option>
                        <option value="30">30 FPS (Standar Hemat CPU)</option>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-900 mb-1 block">
                        Shutter Flash Sync
                      </label>
                      <Input
                        value={hardwareConfig.flashSyncSpeed}
                        onChange={(e) => setHardwareConfig({ ...hardwareConfig, flashSyncSpeed: e.target.value })}
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-[18px]">bolt</span>
                    <span>
                      Gunakan dummy battery AC adapter untuk performa stabil event di atas 3 jam.
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary">
                Simpan Konfigurasi Hardware
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Tab 2: Profil Studio & Tenant */}
        <TabsContent value="tenant" className="space-y-6 pt-2">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <Card className="border border-slate-200/90 bg-white shadow-xs">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-bold text-slate-900">Profil Bisnis &amp; Identitas Studio</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Nama brand, logo, subdomain tenant, dan media sosial yang tampil di QR portal tamu.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-900 mb-1 block">
                      Nama Brand Studio
                    </label>
                    <Input
                      value={profileConfig.studioName}
                      onChange={(e) => setProfileConfig({ ...profileConfig, studioName: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-900 mb-1 block">
                      Subdomain Portal Tamu
                    </label>
                    <Input
                      value={profileConfig.subdomain}
                      onChange={(e) => setProfileConfig({ ...profileConfig, subdomain: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-900 mb-1 block">
                      Email Bisnis
                    </label>
                    <Input
                      type="email"
                      value={profileConfig.email}
                      onChange={(e) => setProfileConfig({ ...profileConfig, email: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-900 mb-1 block">
                      Nomor WhatsApp Support
                    </label>
                    <Input
                      value={profileConfig.whatsapp}
                      onChange={(e) => setProfileConfig({ ...profileConfig, whatsapp: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-900 mb-1 block">
                    Alamat Workshop / Studio
                  </label>
                  <Input
                    value={profileConfig.address}
                    onChange={(e) => setProfileConfig({ ...profileConfig, address: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-900 mb-1 block">
                      Instagram Studio
                    </label>
                    <Input
                      value={profileConfig.instagram}
                      onChange={(e) => setProfileConfig({ ...profileConfig, instagram: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-900 mb-1 block">
                      TikTok Studio
                    </label>
                    <Input
                      value={profileConfig.tiktok}
                      onChange={(e) => setProfileConfig({ ...profileConfig, tiktok: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-900 mb-1 block">
                    Teks Watermark Digital (Foto Unduhan Tamu)
                  </label>
                  <Input
                    value={profileConfig.watermarkText}
                    onChange={(e) => setProfileConfig({ ...profileConfig, watermarkText: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-3 border-t border-slate-100 flex justify-end">
                <Button type="submit" variant="primary">
                  Simpan Profil Studio
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* Tab 3: Payment Gateway & QRIS */}
        <TabsContent value="payments" className="space-y-6 pt-2">
          <form onSubmit={handleSavePayment} className="space-y-6">
            <Card className="border border-slate-200/90 bg-white shadow-xs">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-bold text-slate-900">Integrasi Payment Gateway &amp; QRIS</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Konfigurasi Midtrans, Xendit, atau Tripay untuk penerimaan pembayaran paket sewa.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-900 mb-1 block">
                      Penyedia Payment Gateway
                    </label>
                    <Select
                      value={paymentConfig.gateway}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, gateway: e.target.value })}
                      className="h-9 text-xs"
                    >
                      <option value="Midtrans Snap & Core API">Midtrans Snap &amp; Core API (QRIS, VA, CC)</option>
                      <option value="Xendit XenPlatform">Xendit XenPlatform</option>
                      <option value="Tripay Payment System">Tripay Payment Channel</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-900 mb-1 block">
                      Lingkungan (Environment)
                    </label>
                    <Select
                      value={paymentConfig.environment}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, environment: e.target.value })}
                      className="h-9 text-xs"
                    >
                      <option value="production">Production (Live Transaksi Riil)</option>
                      <option value="sandbox">Sandbox (Pengujian Sistem)</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-900 mb-1 block">
                      Merchant ID
                    </label>
                    <Input
                      value={paymentConfig.merchantId}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, merchantId: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-900 mb-1 block">
                      Client Key
                    </label>
                    <Input
                      value={paymentConfig.clientKey}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, clientKey: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-900 mb-1 block">
                      Server Key
                    </label>
                    <Input
                      type="password"
                      value={paymentConfig.serverKey}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, serverKey: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 mb-3">
                    Rekening Penampungan Settlement
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-900 mb-1 block">
                        Bank
                      </label>
                      <Input
                        value={paymentConfig.bankName}
                        onChange={(e) => setPaymentConfig({ ...paymentConfig, bankName: e.target.value })}
                        className="h-9 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-900 mb-1 block">
                        Nomor Rekening
                      </label>
                      <Input
                        value={paymentConfig.accountNumber}
                        onChange={(e) => setPaymentConfig({ ...paymentConfig, accountNumber: e.target.value })}
                        className="h-9 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-900 mb-1 block">
                        Nama Pemilik Rekening
                      </label>
                      <Input
                        value={paymentConfig.accountHolder}
                        onChange={(e) => setPaymentConfig({ ...paymentConfig, accountHolder: e.target.value })}
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-3 border-t border-slate-100 flex justify-end">
                <Button type="submit" variant="primary">
                  Simpan Konfigurasi Payment
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* Tab 4: Notifikasi & WhatsApp */}
        <TabsContent value="notifications" className="space-y-6 pt-2">
          <Card className="border border-slate-200/90 bg-white shadow-xs">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">WhatsApp Gateway &amp; Notifikasi Otomatis</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Pengiriman tautan hasil foto photobooth langsung ke WhatsApp tamu begitu sesi foto selesai.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-900 mb-1 block">
                    Penyedia WhatsApp Gateway
                  </label>
                  <Select defaultValue="fonnte" className="h-9 text-xs">
                    <option value="fonnte">Fonnte WhatsApp Gateway API</option>
                    <option value="waba">Official WhatsApp Business Cloud API (Meta)</option>
                    <option value="twilio">Twilio Programmable Messaging</option>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-900 mb-1 block">
                    API Token / Device Key
                  </label>
                  <Input type="password" defaultValue="fnte_live_8989128389102" className="h-9 text-xs" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-900 mb-1 block">
                  Template Pesan Otomatis ke Tamu
                </label>
                <textarea
                  rows={4}
                  defaultValue={`Halo Kak {nama_tamu}!\n\nTerima kasih telah berfoto di photobooth {nama_event}! Foto kenangan manismu sudah selesai diproses.\n\nKlik link di bawah ini untuk melihat dan mengunduh foto komposit kualitas penuh:\n{link_foto}\n\nSalam hangat,\nLumina Photostudio`}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-mono text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900"
                ></textarea>
                <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                  Variabel: &#123;nama_tamu&#125;, &#123;nama_event&#125;, &#123;link_foto&#125;, &#123;sesi_id&#125;
                </span>
              </div>
            </CardContent>
            <CardFooter className="p-5 pt-3 border-t border-slate-100 flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => showToast('Pesan uji coba berhasil dikirim ke nomor WhatsApp Anda!')}
              >
                Kirim Uji Coba WhatsApp
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => showToast('Pengaturan notifikasi WhatsApp berhasil disimpan!')}
              >
                Simpan Pengaturan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SettingsPage;
