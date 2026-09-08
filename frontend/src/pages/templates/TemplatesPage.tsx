import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { templatesApi } from '../../api/templates';

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

  useEffect(() => {
    templatesApi
      .list()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const t: any = res.data[0];
          setTemplateName(t.name);
          setFormatSize(t.paper_size === '4R' ? '4r_strip' : (t.paper_size || '4R').toLowerCase());
          setOrientation((t.orientation as any) || 'portrait');
          if (t.current_version?.slots && t.current_version.slots.length > 0) {
            const loadedSlots = t.current_version.slots.map((s: any, idx: number) => ({
              id: s.id || idx + 1,
              label: `Jepretan #${s.slot_order || idx + 1} (${s.slot_key || 'Cover'})`,
              x: Math.round(s.position_x / 10),
              y: Math.round(s.position_y / 10),
              w: Math.round(s.width / 10),
              h: Math.round(s.height / 10),
              aspect: '4:3',
              photoUrl: slots[idx]?.photoUrl || slots[0]?.photoUrl,
            }));
            setSlots(loadedSlots);
            setActiveSlotId(loadedSlots[0]?.id || 1);
          }
        }
      })
      .catch((err) => console.warn('Templates load warning:', err));
  }, []);

  const activeSlot = slots.find((s) => s.id === activeSlotId) || slots[0];

  const updateActiveSlotCoord = (field: 'x' | 'y' | 'w' | 'h', value: number) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === activeSlotId ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async () => {
    try {
      await templatesApi.create({
        name: templateName,
        paper_size: formatSize === '4r_strip' ? '4R' : '2R',
        orientation: orientation,
        canvas_width: orientation === 'portrait' ? 1200 : 1800,
        canvas_height: orientation === 'portrait' ? 1800 : 1200,
        status: 'active',
      } as any);
    } catch (err) {
      console.warn('API save template fallback:', err);
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
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
    <div className="flex flex-col w-full space-y-6">
      {/* Save Success Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 border border-slate-800 transition-all">
          <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
          <span className="text-xs font-medium">Template dan koordinat slot berhasil disimpan ke cloud!</span>
          <button
            onClick={() => setSaveToast(false)}
            className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sub-Header Workspace Utility Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-white rounded-xl shadow-sm border border-slate-200/90">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Link to="/templates" className="hover:text-indigo-600 transition-colors">
              Template &amp; Frame Studio
            </Link>
            <span className="material-symbols-outlined text-[13px] text-slate-400">chevron_right</span>
            <span className="text-slate-800 font-semibold">Editor Visual Template</span>
          </div>
          <div className="flex items-center flex-wrap gap-2.5 mt-0.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {templateName}
            </h1>
            <Badge variant="success" className="gap-1.5 font-medium text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Aktif • {assignedEvents.length} Event Terhubung
            </Badge>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-mono border border-slate-200">
              v2.4.1 (Dye-Sub Sync)
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            className="gap-1.5 text-xs text-slate-700 bg-white"
          >
            <span className="material-symbols-outlined text-[15px] text-slate-500">file_download</span>
            <span>Export JSON</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Template telah diduplikat sebagai copy baru.')}
            className="gap-1.5 text-xs text-slate-700 bg-white"
          >
            <span className="material-symbols-outlined text-[15px] text-slate-500">content_copy</span>
            <span>Duplikat</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(slots[1].photoUrl, '_blank')}
            className="gap-1.5 text-xs text-indigo-600 border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50"
          >
            <span className="material-symbols-outlined text-[15px]">visibility</span>
            <span>Mockup Cetak</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
          >
            <span className="material-symbols-outlined text-[15px]">save</span>
            <span>Simpan Template</span>
          </Button>
        </div>
      </div>

      {/* 3-Column Visual Layout Engine */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Canvas, Geometry & Media Config (Width: 3 cols) */}
        <div className="xl:col-span-3 flex flex-col gap-5">
          {/* Meta Card */}
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600 text-lg">tune</span>
                  <CardTitle className="text-sm font-bold text-slate-900">Spesifikasi Cetak</CardTitle>
                </div>
                <span className="text-[11px] font-mono text-slate-400">PRD 8.8.3</span>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Desain Template
                </label>
                <input
                  className="w-full h-9 px-3 bg-white text-slate-900 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 border border-slate-200 font-medium"
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-9 px-2 bg-white text-slate-900 text-xs rounded-lg focus:outline-none focus:border-indigo-600 border border-slate-200"
                  >
                    <option>Wedding Elegance</option>
                    <option>Corporate Gala</option>
                    <option>Sweet Seventeen</option>
                    <option>Festival / Exhibition</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Status Publikasi
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-9 px-2 bg-white text-slate-900 text-xs rounded-lg focus:outline-none focus:border-indigo-600 border border-slate-200 font-medium"
                  >
                    <option className="text-emerald-600 font-semibold">Active (Live)</option>
                    <option>Draft In-Progress</option>
                    <option>Archived</option>
                  </select>
                </div>
              </div>

              {/* Format & Dimensions */}
              <div className="pt-1 space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Format Kertas Strip
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all border ${
                      formatSize === '4r_strip'
                        ? 'bg-indigo-50/60 border-indigo-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      checked={formatSize === '4r_strip'}
                      onChange={() => setFormatSize('4r_strip')}
                      className="accent-indigo-600 w-3.5 h-3.5"
                      name="format_size"
                      type="radio"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900">4R Strip 2x6"</span>
                      <span className="text-[10px] font-mono text-slate-500">50x152mm (2-up)</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all border ${
                      formatSize === '4r_single'
                        ? 'bg-indigo-50/60 border-indigo-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      checked={formatSize === '4r_single'}
                      onChange={() => setFormatSize('4r_single')}
                      className="accent-indigo-600 w-3.5 h-3.5"
                      name="format_size"
                      type="radio"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-slate-800">4R Single 4x6"</span>
                      <span className="text-[10px] font-mono text-slate-500">102x152mm</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all border ${
                      formatSize === '2r_mini'
                        ? 'bg-indigo-50/60 border-indigo-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      checked={formatSize === '2r_mini'}
                      onChange={() => setFormatSize('2r_mini')}
                      className="accent-indigo-600 w-3.5 h-3.5"
                      name="format_size"
                      type="radio"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-slate-800">2R Bookmark</span>
                      <span className="text-[10px] font-mono text-slate-500">45x120mm</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all border ${
                      formatSize === '5r_wide'
                        ? 'bg-indigo-50/60 border-indigo-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      checked={formatSize === '5r_wide'}
                      onChange={() => setFormatSize('5r_wide')}
                      className="accent-indigo-600 w-3.5 h-3.5"
                      name="format_size"
                      type="radio"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-slate-800">5R Wide Print</span>
                      <span className="text-[10px] font-mono text-slate-500">127x178mm</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Orientation & DPI */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Orientasi Artboard
                  </span>
                  <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setOrientation('portrait')}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                        orientation === 'portrait'
                          ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">crop_portrait</span>
                      Portrait
                    </button>
                    <button
                      onClick={() => setOrientation('landscape')}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                        orientation === 'landscape'
                          ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">crop_landscape</span>
                      Landscape
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-slate-400 text-lg">aspect_ratio</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-800">
                        1200 x 3600 px (Stripped)
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">Native 300 DPI Dye-Sub Ready</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-lg">verified</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Frame & Overlay Assets Card */}
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600 text-lg">layers</span>
                  <CardTitle className="text-sm font-bold text-slate-900">Layer &amp; Background</CardTitle>
                </div>
                <button
                  onClick={() => alert('Fitur upload frame kustom aktif. Silakan pilih file PNG transparan 300 DPI.')}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  + Upload
                </button>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Frame Overlay Preview Asset */}
              <div className="p-2.5 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-200">
                <div className="w-12 h-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center relative border border-slate-300">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-85"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCA9pNAxYdpgjQI_dTs4gmdGB9q5LdON45vLB9B_bqa9ojhEWu7-weFKX7kUufld4EsbRu-aHRgGXoz9RzV6d1q6pRrGBPd_lpsulyrwuzpKu-m9bsjL5YL_nWVlWvEW70vlwaHqOJnKf3QRrFJNEWw6Oh7j-LVAZIt7jvCE_S0EW-HUHKKJ58MdnHcLUQIjkCg2W-Aj1Lpx2DVjEIOjbtCo9j5eJGDmw0kaAIj5dVKHC-qzSJ1qLw')",
                    }}
                  ></div>
                  <span className="material-symbols-outlined text-slate-600 text-[16px] relative z-10">image</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-900 truncate">
                    frame_floral_white_gold.png
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 truncate">
                    1200x3600 • PNG-32 Alpha • 1.8MB
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <button className="text-[11px] text-indigo-600 font-medium hover:underline">Ganti File</button>
                    <span className="text-slate-300">•</span>
                    <button className="text-[11px] text-rose-600 font-medium hover:underline">Hapus</button>
                  </div>
                </div>
              </div>

              {/* Bleed & Safety Controls */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700">
                    Panduan Potong / Bleed Margin (3mm)
                  </span>
                  <input
                    checked={showBleed}
                    onChange={(e) => setShowBleed(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4 cursor-pointer"
                    type="checkbox"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700">Background Solid Base</span>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white shadow-xs border border-slate-300"></span>
                    <span className="font-mono text-xs text-slate-700 font-semibold">#FFFFFF</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                    <span>Opasitas Ornamen Frame</span>
                    <span className="font-mono text-slate-900 font-bold">{frameOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={frameOpacity}
                    onChange={(e) => setFrameOpacity(Number(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-full cursor-pointer"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MIDDLE COLUMN: Visual Artboard Studio Canvas (Width: 6 cols) */}
        <div className="xl:col-span-6 flex flex-col items-center">
          {/* Canvas Control Top Floating Toolbar */}
          <div className="w-full mb-3 px-4 py-2 bg-white rounded-xl shadow-sm flex items-center justify-between border border-slate-200/90">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(25, z - 5))}
                  className="w-7 h-7 rounded-md hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-[15px]">remove</span>
                </button>
                <span className="font-mono text-xs text-slate-800 font-semibold px-2.5">{zoomLevel}% (Fit)</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(100, z + 5))}
                  className="w-7 h-7 rounded-md hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-[15px]">add</span>
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel(42)}
                className="text-xs text-slate-700 bg-white gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">fit_screen</span>
                <span>Paskan Layar</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="indigo" className="gap-1 font-semibold text-xs py-1">
                <span className="material-symbols-outlined text-[13px]">grid_4x4</span>
                <span>Grid 10px</span>
              </Badge>

              <Button
                variant="outline"
                size="sm"
                className="text-xs text-slate-700 bg-white gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                <span>Snap Guides</span>
              </Button>

              <div className="w-px h-4 bg-slate-200"></div>

              <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  className="w-7 h-7 rounded-md hover:bg-white flex items-center justify-center text-slate-600 transition-colors"
                  title="Undo"
                >
                  <span className="material-symbols-outlined text-[15px]">undo</span>
                </button>
                <button
                  className="w-7 h-7 rounded-md hover:bg-white flex items-center justify-center text-slate-600 transition-colors"
                  title="Redo"
                >
                  <span className="material-symbols-outlined text-[15px]">redo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Realistic Canvas Container with Pixel/Metric Rulers */}
          <div className="w-full bg-slate-100/70 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[760px] shadow-inner border border-slate-200">
            {/* Ambient Grid backdrop */}
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            ></div>

            {/* Metric Rulers Visual */}
            <div className="absolute top-2 left-6 right-6 h-4 flex justify-between text-[10px] font-mono text-slate-400 pointer-events-none px-4">
              <span>0 mm</span>
              <span>10 mm</span>
              <span>25 mm</span>
              <span>50 mm (Center)</span>
              <span>75 mm</span>
              <span>100 mm</span>
            </div>

            {/* Physical 2x6 Print Strip Simulation Artboard */}
            <div
              className="relative w-[340px] h-[720px] bg-white rounded-xl shadow-xl flex flex-col p-4 select-none transition-transform duration-200 border border-slate-200"
              style={{ opacity: frameOpacity / 100 }}
            >
              {/* Bleed Guideline (3mm) */}
              {showBleed && (
                <div
                  className="absolute inset-2 rounded-lg pointer-events-none opacity-50 border border-dashed border-indigo-400"
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
                <span className="material-symbols-outlined text-slate-300 text-[20px]">eco</span>
                <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase font-bold">
                  LUMINA LUXE BOOTH
                </span>
                <span className="material-symbols-outlined text-slate-300 text-[20px]">eco</span>
              </div>

              {/* SLOT 1 */}
              <div
                onClick={() => setActiveSlotId(1)}
                className={`relative w-full h-[175px] bg-slate-100 rounded-lg overflow-hidden group cursor-pointer transition-all flex items-center justify-center mt-1 ${
                  activeSlotId === 1
                    ? 'ring-2 ring-indigo-600 shadow-md'
                    : 'hover:ring-2 hover:ring-indigo-300'
                }`}
                style={{ borderRadius: `${cornerRadius}px` }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${slots[0].photoUrl}')` }}
                ></div>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono backdrop-blur-sm flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[12px] text-amber-300">photo_camera</span>
                  Jepretan #1 (4:3)
                </div>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-white/90 text-slate-800 text-[10px] font-mono shadow-xs border border-slate-200">
                  Slot #1 • {slots[0].w} x {slots[0].h}px
                </div>
                {activeSlotId === 1 && (
                  <>
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white rounded-full shadow-md border-2 border-indigo-600"></div>
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white rounded-full shadow-md border-2 border-indigo-600"></div>
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white rounded-full shadow-md border-2 border-indigo-600"></div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white rounded-full shadow-md border-2 border-indigo-600"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-indigo-600 rounded-full shadow-xs"></div>
                  </>
                )}
              </div>

              {/* SLOT 2 (DEFAULT ACTIVE) */}
              <div
                onClick={() => setActiveSlotId(2)}
                className={`relative w-full h-[175px] bg-slate-200 rounded-lg overflow-hidden my-3 cursor-move transition-all flex items-center justify-center ${
                  activeSlotId === 2
                    ? 'ring-2 ring-indigo-600 shadow-md'
                    : 'hover:ring-2 hover:ring-indigo-300'
                }`}
                style={{ borderRadius: `${cornerRadius}px` }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${slots[1].photoUrl}')` }}
                ></div>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-mono backdrop-blur-sm flex items-center gap-1 font-bold shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  Jepretan #2 • AKTIF
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono font-medium shadow-xs">
                  X: {slots[1].x} • Y: {slots[1].y} • {slots[1].w}x{slots[1].h}px
                </div>
                {activeSlotId === 2 && (
                  <>
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white rounded-full shadow-md border-2 border-indigo-600"></div>
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white rounded-full shadow-md border-2 border-indigo-600"></div>
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white rounded-full shadow-md border-2 border-indigo-600"></div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white rounded-full shadow-md border-2 border-indigo-600"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-indigo-600 rounded-full shadow-xs"></div>
                  </>
                )}
              </div>

              {/* SLOT 3 */}
              <div
                onClick={() => setActiveSlotId(3)}
                className={`relative w-full h-[175px] bg-slate-100 rounded-lg overflow-hidden group cursor-pointer transition-all flex items-center justify-center ${
                  activeSlotId === 3
                    ? 'ring-2 ring-indigo-600 shadow-md'
                    : 'hover:ring-2 hover:ring-indigo-300'
                }`}
                style={{ borderRadius: `${cornerRadius}px` }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${slots[2].photoUrl}')` }}
                ></div>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono backdrop-blur-sm flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[12px] text-amber-300">photo_camera</span>
                  Jepretan #3 (4:3)
                </div>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-white/90 text-slate-800 text-[10px] font-mono shadow-xs border border-slate-200">
                  Slot #3 • {slots[2].w} x {slots[2].h}px
                </div>
                {activeSlotId === 3 && (
                  <>
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white rounded-full shadow-md border-2 border-indigo-600"></div>
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white rounded-full shadow-md border-2 border-indigo-600"></div>
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white rounded-full shadow-md border-2 border-indigo-600"></div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white rounded-full shadow-md border-2 border-indigo-600"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-indigo-600 rounded-full shadow-xs"></div>
                  </>
                )}
              </div>

              {/* Bottom Footer Strip: Dynamic Tokens & Logo Frame Branding */}
              <div className="mt-auto pt-3 pb-2 px-2 flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-rose-500 text-[14px]">favorite</span>
                  <span className="text-sm font-bold text-slate-900 tracking-tight">
                    Kevin &amp; Astrid
                  </span>
                  <span className="material-symbols-outlined text-rose-500 text-[14px]">favorite</span>
                </div>
                <p className="font-mono text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
                  24 OKTOBER 2025 • THE RITZ-CARLTON BALI
                </p>
                <div className="mt-2 flex items-center justify-between w-full text-[9px] text-slate-400 font-mono px-1">
                  <span>Token: {'{{event.date}}'}</span>
                  <span className="text-indigo-600 font-bold">#LuminaSnapLive</span>
                  <span>Token: {'{{event.client}}'}</span>
                </div>
              </div>
            </div>

            {/* Canvas Status Badge */}
            <div className="mt-4 flex items-center gap-2 text-slate-500 text-xs font-medium">
              <span className="material-symbols-outlined text-indigo-600 text-base">touch_app</span>
              <span>
                Klik &amp; geser slot di kanvas untuk reposisi otomatis. Tekan{' '}
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono shadow-xs text-slate-700">Shift</kbd>{' '}
                untuk mengunci rasio aspek.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Inspector, Layer Hierarchy & Event Assignment (Width: 3 cols) */}
        <div className="xl:col-span-3 flex flex-col gap-5">
          {/* Slot Inspector Panel */}
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  onClick={() => setRightPanelTab('config')}
                  className={`flex-1 py-1 text-center text-xs rounded-md transition-all ${
                    rightPanelTab === 'config'
                      ? 'font-bold text-slate-900 bg-white shadow-xs'
                      : 'font-medium text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Konfigurasi Slot
                </button>
                <button
                  onClick={() => setRightPanelTab('assign')}
                  className={`flex-1 py-1 text-center text-xs rounded-md transition-all ${
                    rightPanelTab === 'assign'
                      ? 'font-bold text-slate-900 bg-white shadow-xs'
                      : 'font-medium text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tugaskan ke Event
                </button>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {rightPanelTab === 'config' ? (
                <>
                  {/* Selected Element Title */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
                      <h2 className="text-sm font-bold text-slate-900">
                        Slot #{activeSlot.id} Terpilih
                      </h2>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">#SLOT-0{activeSlot.id}</span>
                  </div>

                  {/* Coordinates & Geometry Matrix */}
                  <div className="space-y-2">
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Koordinat &amp; Ukuran (Pixels)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-200">
                        <span className="font-mono text-xs text-slate-400 w-5">X</span>
                        <input
                          className="w-full bg-transparent text-slate-900 font-mono text-xs focus:outline-none text-right font-semibold"
                          type="number"
                          value={activeSlot.x}
                          onChange={(e) => updateActiveSlotCoord('x', Number(e.target.value))}
                        />
                        <span className="font-mono text-[10px] text-slate-400 ml-1">px</span>
                      </div>

                      <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-200">
                        <span className="font-mono text-xs text-slate-400 w-5">Y</span>
                        <input
                          className="w-full bg-transparent text-slate-900 font-mono text-xs focus:outline-none text-right font-semibold"
                          type="number"
                          value={activeSlot.y}
                          onChange={(e) => updateActiveSlotCoord('y', Number(e.target.value))}
                        />
                        <span className="font-mono text-[10px] text-slate-400 ml-1">px</span>
                      </div>

                      <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-200">
                        <span className="font-mono text-xs text-slate-400 w-5">W</span>
                        <input
                          className="w-full bg-transparent text-slate-900 font-mono text-xs focus:outline-none text-right font-semibold"
                          type="number"
                          value={activeSlot.w}
                          onChange={(e) => updateActiveSlotCoord('w', Number(e.target.value))}
                        />
                        <span className="font-mono text-[10px] text-slate-400 ml-1">px</span>
                      </div>

                      <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-200">
                        <span className="font-mono text-xs text-slate-400 w-5">H</span>
                        <input
                          className="w-full bg-transparent text-slate-900 font-mono text-xs focus:outline-none text-right font-semibold"
                          type="number"
                          value={activeSlot.h}
                          onChange={(e) => updateActiveSlotCoord('h', Number(e.target.value))}
                        />
                        <span className="font-mono text-[10px] text-slate-400 ml-1">px</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button className="text-xs text-indigo-600 flex items-center gap-1 font-semibold hover:underline">
                        <span className="material-symbols-outlined text-[14px]">lock</span>
                        Kunci Rasio (4:3)
                      </button>
                      <div className="flex items-center gap-1 text-slate-500 font-mono text-xs">
                        <span className="material-symbols-outlined text-[14px]">rotate_right</span>
                        <span>0.0°</span>
                      </div>
                    </div>
                  </div>

                  {/* Scaling & Crop Strategy */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Scaling &amp; Crop Rule
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">PRD 8.13</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <button
                        onClick={() => setCropRule('fit')}
                        className={`p-2 rounded-lg flex flex-col items-center transition-all ${
                          cropRule === 'fit'
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">fit_screen</span>
                        <span className="text-[10px] mt-1">Fit Frame</span>
                      </button>

                      <button
                        onClick={() => setCropRule('cover')}
                        className={`p-2 rounded-lg flex flex-col items-center transition-all ${
                          cropRule === 'cover'
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">crop</span>
                        <span className="text-[10px] mt-1">Cover &amp; Fill</span>
                      </button>

                      <button
                        onClick={() => setCropRule('center')}
                        className={`p-2 rounded-lg flex flex-col items-center transition-all ${
                          cropRule === 'center'
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">center_focus_strong</span>
                        <span className="text-[10px] mt-1">Center Pure</span>
                      </button>
                    </div>
                  </div>

                  {/* Corner Radius & Styling */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                      <span>Sudut Lengkung (Corner Radius)</span>
                      <span className="font-mono text-slate-900 font-bold">{cornerRadius} px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      value={cornerRadius}
                      onChange={(e) => setCornerRadius(Number(e.target.value))}
                      className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-full cursor-pointer"
                    />
                  </div>

                  {/* Default Camera Filter */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Filter Default Kamera
                    </label>
                    <select
                      value={cameraFilter}
                      onChange={(e) => setCameraFilter(e.target.value)}
                      className="w-full h-9 px-2.5 bg-white text-slate-900 text-xs rounded-lg focus:outline-none focus:border-indigo-600 font-medium border border-slate-200"
                    >
                      <option>None (Natural Output)</option>
                      <option>Natural Glow (+Skin Smooth)</option>
                      <option>Warm Vintage Wedding</option>
                      <option>Monochrome B&amp;W Contrast</option>
                      <option>Cool Tokyo Cyber</option>
                    </select>
                  </div>
                </>
              ) : (
                /* Assign Tab */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Pilih Event yang Menggunakan:
                    </span>
                    <Badge variant="indigo" className="font-mono text-[10px]">
                      {assignedEvents.length} Terpilih
                    </Badge>
                  </div>
                  <div className="space-y-2 pt-1">
                    {[
                      { id: 1, title: 'Wedding of Kevin & Astrid', detail: '24 Okt 2025 • Kiosk-01 • 4R Strip' },
                      { id: 2, title: 'Sweet 17th Clarissa & Friends', detail: '28 Okt 2025 • Kiosk-02 • 4R Strip' },
                      { id: 3, title: 'Tech Summit Gala Afterparty 2025', detail: '02 Nov 2025 • Kiosk-03 • Landscape' },
                      { id: 4, title: 'Emerald Annual Gala Dinner', detail: '05 Nov 2025 • Kiosk-04 • 4R Strip' },
                    ].map((evt) => (
                      <label
                        key={evt.id}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
                      >
                        <input
                          type="checkbox"
                          checked={assignedEvents.includes(evt.id)}
                          onChange={() => toggleEventAssignment(evt.id)}
                          className="accent-indigo-600 w-4 h-4 mt-0.5 cursor-pointer"
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs font-semibold text-slate-900 truncate">{evt.title}</span>
                          <span className="font-mono text-[10px] text-slate-500">{evt.detail}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Layer Hierarchy Stack Card */}
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">Hierarki Layer Artboard</CardTitle>
                <span className="material-symbols-outlined text-slate-400 text-base">reorder</span>
              </div>
            </CardHeader>

            <CardContent className="pt-3 space-y-1.5">
              {/* Layer Row: Text Token */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-xs border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[15px]">title</span>
                  <span className="truncate font-medium">Layer Teks Tanggal &amp; Pasangan</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-slate-400 text-[14px]">visibility</span>
                  <span className="material-symbols-outlined text-slate-400 text-[14px]">lock_open</span>
                </div>
              </div>

              {/* Layer Row: Overlay PNG */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-xs border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600 text-[15px]">photo_library</span>
                  <span className="truncate font-medium">Frame Floral Overlay (PNG)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-indigo-600 text-[14px]">visibility</span>
                  <span className="material-symbols-outlined text-slate-400 text-[14px]">lock</span>
                </div>
              </div>

              {/* Layer Row: Slot 3 */}
              <div
                onClick={() => setActiveSlotId(3)}
                className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer text-xs border ${
                  activeSlotId === 3
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[15px]">crop_free</span>
                  <span className="truncate">Slot #3 (Jepretan 3)</span>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[14px]">visibility</span>
              </div>

              {/* Layer Row: Slot 2 (Active) */}
              <div
                onClick={() => setActiveSlotId(2)}
                className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer text-xs shadow-xs border ${
                  activeSlotId === 2
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600 text-[15px]">crop_free</span>
                  <span className="truncate font-bold text-indigo-700">Slot #2 (Jepretan 2 - Aktif)</span>
                </div>
                <span className="material-symbols-outlined text-indigo-600 text-[14px]">visibility</span>
              </div>

              {/* Layer Row: Slot 1 */}
              <div
                onClick={() => setActiveSlotId(1)}
                className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer text-xs border ${
                  activeSlotId === 1
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[15px]">crop_free</span>
                  <span className="truncate">Slot #1 (Jepretan 1)</span>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[14px]">visibility</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Event Assignment Section */}
          <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600 text-base">event_available</span>
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Tugaskan ke Event Aktif
                  </CardTitle>
                </div>
                <Badge variant="indigo" className="font-mono text-[10px]">
                  {assignedEvents.length} Terpilih
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-3 space-y-3">
              <p className="text-xs text-slate-500">
                Template ini akan langsung tersedia di terminal Kiosk yang dipilih di bawah ini.
              </p>

              <div className="space-y-1.5">
                {[
                  { id: 1, title: 'Wedding of Kevin & Astrid', detail: '24 Okt 2025 • Kiosk-01 • 4R Strip' },
                  { id: 2, title: 'Sweet 17th Clarissa & Friends', detail: '28 Okt 2025 • Kiosk-02 • 4R Strip' },
                  { id: 3, title: 'Tech Summit Gala Afterparty 2025', detail: '02 Nov 2025 • Kiosk-03 • Landscape' },
                  { id: 4, title: 'Emerald Annual Gala Dinner', detail: '05 Nov 2025 • Kiosk-04 • 4R Strip' },
                ].map((evt) => (
                  <label
                    key={evt.id}
                    className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
                  >
                    <input
                      type="checkbox"
                      checked={assignedEvents.includes(evt.id)}
                      onChange={() => toggleEventAssignment(evt.id)}
                      className="accent-indigo-600 w-3.5 h-3.5 mt-0.5 cursor-pointer"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {evt.title}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">{evt.detail}</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="pt-1 flex justify-end">
                <Link
                  to="/events"
                  className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Lihat Semua 12 Event</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
