import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface SlotData {
  id: number;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  aspect: string;
  photoUrl: string;
}

export const TemplatesPage: React.FC = () => {
  const [templateName, setTemplateName] = useState('Classic 4R Strip - Floral Wedding Elegance');
  const [category, setCategory] = useState('Wedding Elegance');
  const [status, setStatus] = useState('Active (Live)');
  const [formatSize, setFormatSize] = useState('4r_strip');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showBleed, setShowBleed] = useState(true);
  const [frameOpacity, setFrameOpacity] = useState(100);
  const [zoomLevel, setZoomLevel] = useState(42);
  const [activeSlotId, setActiveSlotId] = useState(2);
  const [rightPanelTab, setRightPanelTab] = useState<'config' | 'assign'>('config');
  const [cropRule, setCropRule] = useState<'fit' | 'cover' | 'center'>('cover');
  const [cornerRadius, setCornerRadius] = useState(8);
  const [cameraFilter, setCameraFilter] = useState('Natural Glow (+Skin Smooth)');
  const [saveToast, setSaveToast] = useState(false);

  // Slots Data
  const [slots, setSlots] = useState<SlotData[]>([
    {
      id: 1,
      label: 'Jepretan #1 (4:3)',
      x: 45,
      y: 50,
      w: 510,
      h: 382,
      aspect: '4:3',
      photoUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA37qc17rptl_41zN7g_61ejraRCWvDWPGmjJDax-0fhRVmEkW6xPsF73IMdlZ-IjyRttC9Rxz92h5QnKiFmzuDnLG_Pwb6vRzUIaMDjnvPUN6s7cfaId443W7RuoUJ-0oPevLOU7y6Cfbb-rqM-y-in46NaFWnbB-6H7TNtTZfG1tnee5QjIt9x2h8XXEsIR7LXXM6tau4iaIUhFnCACftM9cGWNvnlxuMqTLDr5ojmTbxpQCyv8o',
    },
    {
      id: 2,
      label: 'Jepretan #2 (Slot Terpilih)',
      x: 45,
      y: 245,
      w: 510,
      h: 382,
      aspect: '4:3',
      photoUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDWH8LVgIs2I1hP0CHn24UCjycBKCEhow73VHkcjERQunltDDxXYvdmDU-dLLNwsDU3EPdIN1zIVofh_4GDgoyUlhcaFhF4HlXePD2JfbUHySRyU7Mz7jWXDdQE8lqWUZ6cuiDfCnyx7aRzjNuCt7zAvpALOapmncj4RfbkWHpMPhryTHsykdPqQ0RlHsoMaUnbpSdty-pK0MZHRjVMqbka1xui5UY7iMZPT2b1ViCdGHOgHx1BAB8',
    },
    {
      id: 3,
      label: 'Jepretan #3 (4:3)',
      x: 45,
      y: 440,
      w: 510,
      h: 382,
      aspect: '4:3',
      photoUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDW9UqySjsFlKuIpRxw3ZdjDIsX63MlZPc5h8bNIZ6aQ9Dd79m9ucOyT6zcuoZLmBLgR3WKSChbBx2Rr_IHGHhXchms6rnSsZlUF4YrYZIq9l3LuHd9IKZ5q1VzIqfsnFulgQ9I2h_3f8_mUT077CFPblpqf14Zj6yfhYXDeSIk3GYPVSwx9j3sGVrV1xTE3MW-GVQ67mZyRX_5PMuBScB0lU-YDh_9fsis5G6M7tV8cHhDQKg8spE',
    },
  ]);

  // Assigned Events state
  const [assignedEvents, setAssignedEvents] = useState<number[]>([1, 2, 4]);

  const toggleEventAssignment = (eventId: number) => {
    setAssignedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const activeSlot = slots.find((s) => s.id === activeSlotId) || slots[0];

  const updateActiveSlotCoord = (field: 'x' | 'y' | 'w' | 'h', value: number) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === activeSlotId ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleExportJson = () => {
    const config = {
      templateName,
      category,
      status,
      formatSize,
      orientation,
      bleed: showBleed ? 3 : 0,
      canvas: { width: 1200, height: 3600, dpi: 300 },
      slots,
      assignedEvents,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template-config-${templateName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Save Success Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md">Template dan koordinat slot berhasil disimpan!</span>
        </div>
      )}

      {/* Sub-Header Workspace Utility Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm mb-space-xl p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <Link to="/templates" className="hover:text-primary transition-colors">
              Template & Frame Studio
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-medium">Editor Visual Template</span>
          </div>
          <div className="flex items-center flex-wrap gap-space-sm mt-0.5">
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight font-semibold">
              {templateName}
            </h1>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Aktif • Terhubung ke {assignedEvents.length} Event
            </div>
            <span className="px-2 py-0.5 rounded-md bg-surface-container-low text-outline text-label-sm font-mono-data border border-surface-container-high">
              v2.4.1 (Sync Ready)
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-space-xs">
          <button
            onClick={handleExportJson}
            className="px-space-sm py-1.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md flex items-center gap-space-2xs border border-surface-container-high shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">file_download</span>
            <span className="font-medium">Export Config JSON</span>
          </button>
          <button
            onClick={() => alert('Template telah diduplikat sebagai copy baru.')}
            className="px-space-sm py-1.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md flex items-center gap-space-2xs border border-surface-container-high shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">content_copy</span>
            <span className="font-medium">Duplikat</span>
          </button>
          <button
            onClick={() => window.open(slots[1].photoUrl, '_blank')}
            className="px-space-sm py-1.5 rounded-xl bg-surface-container-lowest text-primary hover:bg-secondary-container/40 transition-colors font-label-md text-label-md flex items-center gap-space-2xs border border-surface-container-high shadow-sm font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>Mockup Cetak</span>
          </button>
          <button
            onClick={handleSave}
            className="px-space-md py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-all font-label-md text-label-md flex items-center gap-space-2xs shadow-md font-semibold"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>Simpan Template</span>
          </button>
        </div>
      </div>

      {/* 3-Column Visual Layout Engine */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
        {/* LEFT PANEL: Canvas, Geometry & Media Config (Width: 3 cols) */}
        <div className="xl:col-span-3 flex flex-col gap-space-sm">
          {/* Meta Card */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-sm border border-surface-container-high">
            <div className="flex items-center justify-between pb-space-2xs">
              <div className="flex items-center gap-space-2xs">
                <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Spesifikasi Cetak</h2>
              </div>
              <span className="font-mono-data text-label-sm text-outline">PRD 8.8.3</span>
            </div>

            <div className="space-y-space-xs">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-medium">
                  Nama Desain Template
                </label>
                <input
                  className="w-full h-9 px-3 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/20"
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-space-xs">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-medium">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-9 px-2 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:outline-none border border-outline-variant/20"
                  >
                    <option>Wedding Elegance</option>
                    <option>Corporate Gala</option>
                    <option>Sweet Seventeen</option>
                    <option>Festival / Exhibition</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-medium">
                    Status Publikasi
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-9 px-2 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:outline-none font-medium border border-outline-variant/20"
                  >
                    <option className="text-primary">Active (Live)</option>
                    <option>Draft In-Progress</option>
                    <option>Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Format & Dimensions */}
            <div className="pt-space-xs space-y-space-xs">
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Format Kertas Strip
              </label>
              <div className="grid grid-cols-2 gap-space-2xs">
                <label
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors border ${
                    formatSize === '4r_strip'
                      ? 'bg-secondary-container/40 border-primary'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'
                  }`}
                >
                  <input
                    checked={formatSize === '4r_strip'}
                    onChange={() => setFormatSize('4r_strip')}
                    className="accent-primary w-3.5 h-3.5"
                    name="format_size"
                    type="radio"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-medium text-on-surface">4R Strip 2x6"</span>
                    <span className="font-mono-data text-[11px] text-on-surface-variant">50 x 152 mm (2-up)</span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors border ${
                    formatSize === '4r_single'
                      ? 'bg-secondary-container/40 border-primary'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'
                  }`}
                >
                  <input
                    checked={formatSize === '4r_single'}
                    onChange={() => setFormatSize('4r_single')}
                    className="accent-primary w-3.5 h-3.5"
                    name="format_size"
                    type="radio"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">4R Single 4x6"</span>
                    <span className="font-mono-data text-[11px] text-on-surface-variant">102 x 152 mm Postcard</span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors border ${
                    formatSize === '2r_mini'
                      ? 'bg-secondary-container/40 border-primary'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'
                  }`}
                >
                  <input
                    checked={formatSize === '2r_mini'}
                    onChange={() => setFormatSize('2r_mini')}
                    className="accent-primary w-3.5 h-3.5"
                    name="format_size"
                    type="radio"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">2R Mini Bookmark</span>
                    <span className="font-mono-data text-[11px] text-on-surface-variant">45 x 120 mm Single</span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors border ${
                    formatSize === '5r_wide'
                      ? 'bg-secondary-container/40 border-primary'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'
                  }`}
                >
                  <input
                    checked={formatSize === '5r_wide'}
                    onChange={() => setFormatSize('5r_wide')}
                    className="accent-primary w-3.5 h-3.5"
                    name="format_size"
                    type="radio"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">5R Wide Print</span>
                    <span className="font-mono-data text-[11px] text-on-surface-variant">127 x 178 mm Portrait</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Orientation & DPI */}
            <div className="pt-space-xs space-y-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
                  Orientasi Artboard
                </span>
                <div className="inline-flex p-0.5 bg-surface-container-low rounded-lg border border-outline-variant/20">
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`px-2 py-1 rounded-md font-label-sm text-label-sm font-medium flex items-center gap-1 transition-all ${
                      orientation === 'portrait'
                        ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">crop_portrait</span>
                    Portrait
                  </button>
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`px-2 py-1 rounded-md font-label-sm text-label-sm font-medium flex items-center gap-1 transition-all ${
                      orientation === 'landscape'
                        ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">crop_landscape</span>
                    Landscape
                  </button>
                </div>
              </div>

              <div className="p-space-xs bg-surface-container-low rounded-lg flex items-center justify-between border border-outline-variant/20">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-outline text-[18px]">aspect_ratio</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-medium">
                      1200 x 3600 px (Stripped)
                    </span>
                    <span className="font-mono-data text-body-sm text-outline">Native 300 DPI Dye-Sub Ready</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              </div>
            </div>
          </div>

          {/* Frame & Overlay Assets Card */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-sm border border-surface-container-high">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-2xs">
                <span className="material-symbols-outlined text-primary text-[18px]">layers</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Layer & Background</h2>
              </div>
              <button
                onClick={() => alert('Fitur upload frame kustom aktif. Silakan pilih file PNG transparan 300 DPI.')}
                className="font-label-sm text-label-sm text-primary font-medium hover:underline"
              >
                + Upload
              </button>
            </div>

            {/* Frame Overlay Preview Asset */}
            <div className="p-space-xs bg-surface-container-low rounded-xl flex items-center gap-space-xs border border-outline-variant/20">
              <div className="w-12 h-16 bg-surface-container-highest rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCA9pNAxYdpgjQI_dTs4gmdGB9q5LdON45vLB9B_bqa9ojhEWu7-weFKX7kUufld4EsbRu-aHRgGXoz9RzV6d1q6pRrGBPd_lpsulyrwuzpKu-m9bsjL5YL_nWVlWvEW70vlwaHqOJnKf3QRrFJNEWw6Oh7j-LVAZIt7jvCE_S0EW-HUHKKJ58MdnHcLUQIjkCg2W-Aj1Lpx2DVjEIOjbtCo9j5eJGDmw0kaAIj5dVKHC-qzSJ1qLw')",
                  }}
                ></div>
                <span className="material-symbols-outlined text-on-surface-variant text-[16px] relative z-10">image</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-label-md text-label-md text-on-surface truncate font-medium">
                  frame_floral_white_gold.png
                </span>
                <span className="font-mono-data text-body-sm text-outline truncate">
                  1200x3600 • PNG-32 Alpha • 1.8MB
                </span>
                <div className="flex items-center gap-space-xs mt-1">
                  <button className="text-label-sm font-label-sm text-primary hover:underline">Ganti File</button>
                  <span className="text-outline">•</span>
                  <button className="text-label-sm font-label-sm text-error hover:underline">Hapus</button>
                </div>
              </div>
            </div>

            {/* Bleed & Safety Controls */}
            <div className="space-y-space-xs pt-space-2xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Panduan Potong / Bleed Safe Margin (3mm)
                </span>
                <input
                  checked={showBleed}
                  onChange={(e) => setShowBleed(e.target.checked)}
                  className="accent-primary w-4 h-4 cursor-pointer"
                  type="checkbox"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Background Solid Base</span>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm border border-outline-variant/30"></span>
                  <span className="font-mono-data text-body-sm text-on-surface">#FFFFFF</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-body-sm font-body-sm text-outline mb-1">
                  <span>Opasitas Ornamen Frame</span>
                  <span className="font-mono-data text-on-surface">{frameOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={frameOpacity}
                  onChange={(e) => setFrameOpacity(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-full cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Visual Artboard Studio Canvas (Width: 6 cols) */}
        <div className="xl:col-span-6 flex flex-col items-center">
          {/* Canvas Control Top Floating Toolbar */}
          <div className="w-full mb-space-xs px-space-md py-2 bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-between border border-surface-container-high">
            <div className="flex items-center gap-space-xs">
              <div className="inline-flex items-center p-0.5 bg-surface-container-low rounded-xl border border-surface-container-high">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(25, z - 5))}
                  className="w-7 h-7 rounded-lg hover:bg-surface-container-lowest flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="font-mono-data text-body-sm text-on-surface font-medium px-2">{zoomLevel}% (Fit)</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(100, z + 5))}
                  className="w-7 h-7 rounded-lg hover:bg-surface-container-lowest flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>

              <button
                onClick={() => setZoomLevel(42)}
                className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm font-medium flex items-center gap-1 border border-surface-container-high transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[15px]">fit_screen</span>
                <span>Paskan Layar</span>
              </button>
            </div>

            <div className="flex items-center gap-space-xs">
              <button className="px-2.5 py-1.5 rounded-xl bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-[15px]">grid_4x4</span>
                <span>Grid (10px)</span>
              </button>

              <button className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low font-label-sm text-label-sm font-medium flex items-center gap-1 border border-surface-container-high transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[15px]">qr_code_2</span>
                <span>Snap Guides</span>
              </button>

              <div className="w-[1px] h-4 bg-outline-variant"></div>

              <div className="inline-flex items-center p-0.5 bg-surface-container-low rounded-xl border border-surface-container-high">
                <button
                  className="w-7 h-7 rounded-lg hover:bg-surface-container-lowest flex items-center justify-center text-on-surface-variant transition-colors"
                  title="Undo"
                >
                  <span className="material-symbols-outlined text-[16px]">undo</span>
                </button>
                <button
                  className="w-7 h-7 rounded-lg hover:bg-surface-container-lowest flex items-center justify-center text-on-surface-variant transition-colors"
                  title="Redo"
                >
                  <span className="material-symbols-outlined text-[16px]">redo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Realistic Canvas Container with Pixel/Metric Rulers */}
          <div className="w-full bg-surface-container-low rounded-2xl p-space-md flex flex-col items-center justify-center relative overflow-hidden min-h-[760px] shadow-inner border border-outline-variant/30">
            {/* Ambient Grid backdrop */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#777587 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            ></div>

            {/* Metric Rulers Mock Visual */}
            <div className="absolute top-2 left-6 right-6 h-4 flex justify-between text-[9px] font-mono-data text-outline pointer-events-none px-4">
              <span>0 mm</span>
              <span>10 mm</span>
              <span>25 mm</span>
              <span>50 mm (Center)</span>
              <span>75 mm</span>
              <span>100 mm</span>
            </div>

            {/* Physical 2x6 Print Strip Simulation Artboard */}
            <div
              className="relative w-[340px] h-[720px] bg-surface-container-lowest rounded-xl shadow-xl flex flex-col p-4 select-none transition-transform duration-200 border border-outline-variant/30"
              style={{ opacity: frameOpacity / 100 }}
            >
              {/* Bleed Guideline (3mm) */}
              {showBleed && (
                <div
                  className="absolute inset-2 rounded-lg pointer-events-none opacity-40 border border-dashed border-primary"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #4f46e5 50%, rgba(255,255,255,0) 0%), linear-gradient(#4f46e5 50%, rgba(255,255,255,0) 0%)',
                    backgroundPosition: 'top, right',
                    backgroundSize: '8px 1px, 1px 8px',
                    backgroundRepeat: 'repeat-x, repeat-y',
                  }}
                ></div>
              )}

              {/* Header / Top Botanical Frame Motif Decor */}
              <div className="h-10 w-full flex items-center justify-between px-2 pointer-events-none">
                <span className="material-symbols-outlined text-outline-variant text-[22px]">eco</span>
                <span className="font-mono-data text-[10px] tracking-widest text-outline uppercase font-semibold">
                  LUMINA LUXE BOOTH
                </span>
                <span className="material-symbols-outlined text-outline-variant text-[22px]">eco</span>
              </div>

              {/* SLOT 1 */}
              <div
                onClick={() => setActiveSlotId(1)}
                className={`relative w-full h-[175px] bg-surface-container-low rounded-lg overflow-hidden group cursor-pointer transition-all flex items-center justify-center mt-1 ${
                  activeSlotId === 1
                    ? 'ring-2 ring-primary shadow-md'
                    : 'hover:ring-2 hover:ring-primary/40'
                }`}
                style={{ borderRadius: `${cornerRadius}px` }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${slots[0].photoUrl}')` }}
                ></div>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-inverse-surface/80 text-inverse-on-surface text-[10px] font-mono-data backdrop-blur-sm flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[12px] text-tertiary-fixed-dim">photo_camera</span>
                  Jepretan #1 (4:3)
                </div>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-surface-container-lowest/90 text-on-surface text-[10px] font-mono-data shadow-sm">
                  Slot #1 • {slots[0].w} x {slots[0].h}px
                </div>
                {activeSlotId === 1 && (
                  <>
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-surface-container-lowest rounded-full shadow-md border border-primary"></div>
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-surface-container-lowest rounded-full shadow-md border border-primary"></div>
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-surface-container-lowest rounded-full shadow-md border border-primary"></div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-surface-container-lowest rounded-full shadow-md border border-primary"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full shadow-sm"></div>
                  </>
                )}
              </div>

              {/* SLOT 2 (DEFAULT ACTIVE) */}
              <div
                onClick={() => setActiveSlotId(2)}
                className={`relative w-full h-[175px] bg-surface-container-high rounded-lg overflow-hidden my-3 cursor-move transition-all flex items-center justify-center ${
                  activeSlotId === 2
                    ? 'ring-2 ring-primary shadow-md'
                    : 'hover:ring-2 hover:ring-primary/40'
                }`}
                style={{ borderRadius: `${cornerRadius}px` }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${slots[1].photoUrl}')` }}
                ></div>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary-container text-on-primary text-[10px] font-mono-data backdrop-blur-sm flex items-center gap-1 font-semibold shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-surface-bright"></span>
                  Jepretan #2 • AKTIF (Slot Terpilih)
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-primary text-on-primary text-[10px] font-mono-data font-medium shadow-sm">
                  X: {slots[1].x} • Y: {slots[1].y} • {slots[1].w} x {slots[1].h}px
                </div>
                {activeSlotId === 2 && (
                  <>
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-surface-container-lowest rounded-full shadow-md border border-primary"></div>
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-surface-container-lowest rounded-full shadow-md border border-primary"></div>
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-surface-container-lowest rounded-full shadow-md border border-primary"></div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-surface-container-lowest rounded-full shadow-md border border-primary"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full shadow-sm"></div>
                  </>
                )}
              </div>

              {/* SLOT 3 */}
              <div
                onClick={() => setActiveSlotId(3)}
                className={`relative w-full h-[175px] bg-surface-container-low rounded-lg overflow-hidden group cursor-pointer transition-all flex items-center justify-center ${
                  activeSlotId === 3
                    ? 'ring-2 ring-primary shadow-md'
                    : 'hover:ring-2 hover:ring-primary/40'
                }`}
                style={{ borderRadius: `${cornerRadius}px` }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${slots[2].photoUrl}')` }}
                ></div>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-inverse-surface/80 text-inverse-on-surface text-[10px] font-mono-data backdrop-blur-sm flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[12px] text-tertiary-fixed-dim">photo_camera</span>
                  Jepretan #3 (4:3)
                </div>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-surface-container-lowest/90 text-on-surface text-[10px] font-mono-data shadow-sm">
                  Slot #3 • {slots[2].w} x {slots[2].h}px
                </div>
                {activeSlotId === 3 && (
                  <>
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-surface-container-lowest rounded-full shadow-md border border-primary"></div>
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-surface-container-lowest rounded-full shadow-md border border-primary"></div>
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-surface-container-lowest rounded-full shadow-md border border-primary"></div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-surface-container-lowest rounded-full shadow-md border border-primary"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full shadow-sm"></div>
                  </>
                )}
              </div>

              {/* Bottom Footer Strip: Dynamic Tokens & Logo Frame Branding */}
              <div className="mt-auto pt-3 pb-2 px-2 flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-[14px]">favorite</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">
                    Kevin & Astrid
                  </span>
                  <span className="material-symbols-outlined text-primary text-[14px]">favorite</span>
                </div>
                <p className="font-mono-data text-body-sm text-on-surface-variant font-medium tracking-wide uppercase">
                  24 OKTOBER 2025 • THE RITZ-CARLTON BALI
                </p>
                <div className="mt-2 flex items-center justify-between w-full text-[9px] text-outline font-mono-data px-1">
                  <span>Token: {'{{event.date}}'}</span>
                  <span className="text-primary font-semibold">#LuminaSnapLive</span>
                  <span>Token: {'{{event.client}}'}</span>
                </div>
              </div>
            </div>

            {/* Canvas Status Badge */}
            <div className="mt-space-md flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-tertiary text-[16px]">touch_app</span>
              <span>
                Klik & geser slot di kanvas untuk reposisi otomatis. Tekan{' '}
                <kbd className="px-1 py-0.5 bg-surface-container-highest rounded text-[10px] font-mono-data">Shift</kbd>{' '}
                untuk mengunci rasio.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Inspector, Layer Hierarchy & Event Assignment (Width: 3 cols) */}
        <div className="xl:col-span-3 flex flex-col gap-space-sm">
          {/* Slot Inspector Panel */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-sm border border-surface-container-high">
            {/* Tab Selector */}
            <div className="flex items-center p-1 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <button
                onClick={() => setRightPanelTab('config')}
                className={`flex-1 py-1.5 text-center font-label-md text-label-md rounded-lg transition-colors ${
                  rightPanelTab === 'config'
                    ? 'font-semibold text-on-primary bg-primary shadow-sm'
                    : 'font-medium text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Konfigurasi Slot
              </button>
              <button
                onClick={() => setRightPanelTab('assign')}
                className={`flex-1 py-1.5 text-center font-label-md text-label-md rounded-lg transition-colors ${
                  rightPanelTab === 'assign'
                    ? 'font-semibold text-on-primary bg-primary shadow-sm'
                    : 'font-medium text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Tugaskan ke Event
              </button>
            </div>

            {rightPanelTab === 'config' ? (
              <>
                {/* Selected Element Title */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-space-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Slot #{activeSlot.id} Terpilih
                    </h2>
                  </div>
                  <span className="font-mono-data text-label-sm text-outline">Layer ID: #SLOT-0{activeSlot.id}</span>
                </div>

                {/* Coordinates & Geometry Matrix */}
                <div className="space-y-space-xs">
                  <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    Koordinat & Ukuran (Pixels)
                  </span>
                  <div className="grid grid-cols-2 gap-space-2xs">
                    <div className="flex items-center bg-surface-container-low rounded-lg px-2.5 py-1.5 border border-outline-variant/20">
                      <span className="font-mono-data text-body-sm text-outline w-5">X</span>
                      <input
                        className="w-full bg-transparent text-on-surface font-mono-data text-body-md focus:outline-none text-right font-medium"
                        type="number"
                        value={activeSlot.x}
                        onChange={(e) => updateActiveSlotCoord('x', Number(e.target.value))}
                      />
                      <span className="font-mono-data text-[10px] text-outline ml-1">px</span>
                    </div>

                    <div className="flex items-center bg-surface-container-low rounded-lg px-2.5 py-1.5 border border-outline-variant/20">
                      <span className="font-mono-data text-body-sm text-outline w-5">Y</span>
                      <input
                        className="w-full bg-transparent text-on-surface font-mono-data text-body-md focus:outline-none text-right font-medium"
                        type="number"
                        value={activeSlot.y}
                        onChange={(e) => updateActiveSlotCoord('y', Number(e.target.value))}
                      />
                      <span className="font-mono-data text-[10px] text-outline ml-1">px</span>
                    </div>

                    <div className="flex items-center bg-surface-container-low rounded-lg px-2.5 py-1.5 border border-outline-variant/20">
                      <span className="font-mono-data text-body-sm text-outline w-5">W</span>
                      <input
                        className="w-full bg-transparent text-on-surface font-mono-data text-body-md focus:outline-none text-right font-medium"
                        type="number"
                        value={activeSlot.w}
                        onChange={(e) => updateActiveSlotCoord('w', Number(e.target.value))}
                      />
                      <span className="font-mono-data text-[10px] text-outline ml-1">px</span>
                    </div>

                    <div className="flex items-center bg-surface-container-low rounded-lg px-2.5 py-1.5 border border-outline-variant/20">
                      <span className="font-mono-data text-body-sm text-outline w-5">H</span>
                      <input
                        className="w-full bg-transparent text-on-surface font-mono-data text-body-md focus:outline-none text-right font-medium"
                        type="number"
                        value={activeSlot.h}
                        onChange={(e) => updateActiveSlotCoord('h', Number(e.target.value))}
                      />
                      <span className="font-mono-data text-[10px] text-outline ml-1">px</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button className="text-label-sm font-label-sm text-primary flex items-center gap-1 font-medium hover:underline">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                      Kunci Rasio Aspek (4:3)
                    </button>
                    <div className="flex items-center gap-1 text-on-surface-variant font-mono-data text-body-sm">
                      <span className="material-symbols-outlined text-[14px]">rotate_right</span>
                      <span>0.0°</span>
                    </div>
                  </div>
                </div>

                {/* Scaling & Crop Strategy */}
                <div className="space-y-space-xs pt-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                      Scaling & Crop Rule
                    </span>
                    <span className="font-mono-data text-[10px] text-outline">PRD 8.13</span>
                  </div>

                  <div className="grid grid-cols-3 gap-space-2xs text-center">
                    <button
                      onClick={() => setCropRule('fit')}
                      className={`p-2 rounded-lg flex flex-col items-center transition-colors ${
                        cropRule === 'fit'
                          ? 'bg-secondary-container text-on-secondary-fixed-variant font-semibold shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">fit_screen</span>
                      <span className="font-label-sm text-[11px] mt-1">Fit Frame</span>
                    </button>

                    <button
                      onClick={() => setCropRule('cover')}
                      className={`p-2 rounded-lg flex flex-col items-center transition-colors ${
                        cropRule === 'cover'
                          ? 'bg-secondary-container text-on-secondary-fixed-variant font-semibold shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">crop</span>
                      <span className="font-label-sm text-[11px] mt-1">Cover & Fill</span>
                    </button>

                    <button
                      onClick={() => setCropRule('center')}
                      className={`p-2 rounded-lg flex flex-col items-center transition-colors ${
                        cropRule === 'center'
                          ? 'bg-secondary-container text-on-secondary-fixed-variant font-semibold shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
                      <span className="font-label-sm text-[11px] mt-1">Center Pure</span>
                    </button>
                  </div>
                </div>

                {/* Corner Radius & Styling */}
                <div className="space-y-space-xs pt-space-xs">
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <span className="text-on-surface-variant">Sudut Lengkung (Corner Radius)</span>
                    <span className="font-mono-data text-on-surface font-medium">{cornerRadius} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={cornerRadius}
                    onChange={(e) => setCornerRadius(Number(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-full cursor-pointer"
                  />
                </div>

                {/* Default Camera Filter */}
                <div className="space-y-space-xs pt-space-xs">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    Filter Default Kamera
                  </label>
                  <select
                    value={cameraFilter}
                    onChange={(e) => setCameraFilter(e.target.value)}
                    className="w-full h-9 px-2 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg focus:outline-none font-medium border border-outline-variant/20"
                  >
                    <option>None (Natural Output)</option>
                    <option>Natural Glow (+Skin Smooth)</option>
                    <option>Warm Vintage Wedding</option>
                    <option>Monochrome B&W Contrast</option>
                    <option>Cool Tokyo Cyber</option>
                  </select>
                </div>
              </>
            ) : (
              /* Assign Tab */
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    Pilih Event yang Menggunakan Template Ini:
                  </span>
                  <span className="text-primary font-mono-data text-body-sm font-semibold">
                    {assignedEvents.length} Terpilih
                  </span>
                </div>
                <div className="space-y-2 pt-2">
                  {[
                    { id: 1, title: 'Wedding of Kevin & Astrid', detail: '24 Okt 2025 • Kiosk-01 • 4R Strip' },
                    { id: 2, title: 'Sweet 17th Clarissa & Friends', detail: '28 Okt 2025 • Kiosk-02 • 4R Strip' },
                    { id: 3, title: 'Tech Summit Gala Afterparty 2025', detail: '02 Nov 2025 • Kiosk-03 • Landscape Only' },
                    { id: 4, title: 'Emerald Annual Gala Dinner', detail: '05 Nov 2025 • Kiosk-04 • 4R Strip' },
                  ].map((evt) => (
                    <label
                      key={evt.id}
                      className="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/15"
                    >
                      <input
                        type="checkbox"
                        checked={assignedEvents.includes(evt.id)}
                        onChange={() => toggleEventAssignment(evt.id)}
                        className="accent-primary w-4 h-4 mt-0.5 cursor-pointer"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-label-md text-label-md text-on-surface font-medium truncate">{evt.title}</span>
                        <span className="font-mono-data text-[11px] text-outline">{evt.detail}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Layer Hierarchy Stack Card */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-xs border border-surface-container-high">
            <div className="flex items-center justify-between pb-space-2xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Hierarki Layer Artboard</h3>
              <span className="material-symbols-outlined text-outline text-[16px]">reorder</span>
            </div>

            <div className="space-y-1">
              {/* Layer Row: Text Token */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer text-body-sm font-body-sm border border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-[16px]">title</span>
                  <span className="truncate">Layer Teks Tanggal & Pasangan</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-outline text-[14px]">visibility</span>
                  <span className="material-symbols-outlined text-outline text-[14px]">lock_open</span>
                </div>
              </div>

              {/* Layer Row: Overlay PNG */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer text-body-sm font-body-sm border border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[16px]">photo_library</span>
                  <span className="truncate">Frame Floral Overlay (PNG)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[14px]">visibility</span>
                  <span className="material-symbols-outlined text-outline text-[14px]">lock</span>
                </div>
              </div>

              {/* Layer Row: Slot 3 */}
              <div
                onClick={() => setActiveSlotId(3)}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer text-body-sm font-body-sm border border-outline-variant/10 ${
                  activeSlotId === 3
                    ? 'bg-secondary-container text-on-secondary-fixed-variant font-semibold'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-[16px]">crop_free</span>
                  <span className="truncate">Slot #3 (Jepretan 3)</span>
                </div>
                <span className="material-symbols-outlined text-outline text-[14px]">visibility</span>
              </div>

              {/* Layer Row: Slot 2 (Active) */}
              <div
                onClick={() => setActiveSlotId(2)}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer text-body-sm font-body-sm shadow-sm border border-outline-variant/10 ${
                  activeSlotId === 2
                    ? 'bg-secondary-container text-on-secondary-fixed-variant font-semibold'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[16px]">crop_free</span>
                  <span className="truncate font-semibold text-primary">Slot #2 (Jepretan 2 - Aktif)</span>
                </div>
                <span className="material-symbols-outlined text-primary text-[14px]">visibility</span>
              </div>

              {/* Layer Row: Slot 1 */}
              <div
                onClick={() => setActiveSlotId(1)}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer text-body-sm font-body-sm border border-outline-variant/10 ${
                  activeSlotId === 1
                    ? 'bg-secondary-container text-on-secondary-fixed-variant font-semibold'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-[16px]">crop_free</span>
                  <span className="truncate">Slot #1 (Jepretan 1)</span>
                </div>
                <span className="material-symbols-outlined text-outline text-[14px]">visibility</span>
              </div>
            </div>
          </div>

          {/* Quick Event Assignment Section */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-xs border border-surface-container-high">
            <div className="flex items-center justify-between pb-space-2xs">
              <div className="flex items-center gap-space-2xs">
                <span className="material-symbols-outlined text-primary text-[18px]">event_available</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Tugaskan ke Event Aktif
                </h3>
              </div>
              <span className="text-label-sm font-label-sm font-semibold text-primary">
                {assignedEvents.length} Terpilih
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Template ini akan langsung tersedia di terminal Kiosk yang dipilih di bawah ini.
            </p>

            <div className="space-y-space-2xs pt-space-2xs">
              {[
                { id: 1, title: 'Wedding of Kevin & Astrid', detail: '24 Okt 2025 • Kiosk-01 • 4R Strip' },
                { id: 2, title: 'Sweet 17th Clarissa & Friends', detail: '28 Okt 2025 • Kiosk-02 • 4R Strip' },
                { id: 3, title: 'Tech Summit Gala Afterparty 2025', detail: '02 Nov 2025 • Kiosk-03 • Landscape Only' },
                { id: 4, title: 'Emerald Annual Gala Dinner', detail: '05 Nov 2025 • Kiosk-04 • 4R Strip' },
              ].map((evt) => (
                <label
                  key={evt.id}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/15"
                >
                  <input
                    type="checkbox"
                    checked={assignedEvents.includes(evt.id)}
                    onChange={() => toggleEventAssignment(evt.id)}
                    className="accent-primary w-4 h-4 mt-0.5 cursor-pointer"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-label-md text-label-md text-on-surface font-medium truncate">
                      {evt.title}
                    </span>
                    <span className="font-mono-data text-[11px] text-outline">{evt.detail}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                to="/events"
                className="font-label-sm text-label-sm text-primary font-medium hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua 12 Event</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
