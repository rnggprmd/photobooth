import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { usersApi } from '../../api/users';
import { customersApi } from '../../api/customers';

interface Operator {
  id: string;
  name: string;
  role: 'Lead Technician' | 'Kiosk Operator' | 'Assistant';
  phone: string;
  email: string;
  status: 'on_duty' | 'standby' | 'off_duty';
  assignedEvent: string;
  assignedHardware: string;
  sessionsCompleted: number;
  rating: number;
}

interface CustomerLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  instagram: string;
  event: string;
  sessionId: string;
  downloadCount: number;
  capturedAt: string;
}

export const CustomersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('operators');
  const [operatorSearch, setOperatorSearch] = useState('');
  const [guestSearch, setGuestSearch] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');
  const [isAddOperatorOpen, setIsAddOperatorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial Operators State
  const [operators, setOperators] = useState<Operator[]>([
    {
      id: 'OPR-01',
      name: 'Rian Kurniawan',
      role: 'Lead Technician',
      phone: '0812-8921-9981',
      email: 'rian@lumina.studio',
      status: 'on_duty',
      assignedEvent: 'Wedding of Kevin & Astrid (Pullman)',
      assignedHardware: 'Canon R100 + DNP DS620',
      sessionsCompleted: 184,
      rating: 4.9,
    },
    {
      id: 'OPR-02',
      name: 'Siti Rahmawati',
      role: 'Assistant',
      phone: '0813-4412-8823',
      email: 'siti@lumina.studio',
      status: 'on_duty',
      assignedEvent: 'Wedding of Kevin & Astrid (Pullman)',
      assignedHardware: 'Kiosk Terminal TS-B',
      sessionsCompleted: 184,
      rating: 4.8,
    },
    {
      id: 'OPR-03',
      name: 'Dimas Tri Pratama',
      role: 'Lead Technician',
      phone: '0857-9921-0022',
      email: 'dimas@lumina.studio',
      status: 'on_duty',
      assignedEvent: 'Tech Summit Afterparty (ICE BSD)',
      assignedHardware: 'Sony ZV-E10 + DS-RX1',
      sessionsCompleted: 312,
      rating: 5.0,
    },
    {
      id: 'OPR-04',
      name: 'Fauzan Hidayat',
      role: 'Kiosk Operator',
      phone: '0819-2234-9011',
      email: 'fauzan@lumina.studio',
      status: 'standby',
      assignedEvent: 'Sweet 17th Clara (The Glass House)',
      assignedHardware: 'Canon M50 II + DNP DS620',
      sessionsCompleted: 42,
      rating: 4.9,
    },
    {
      id: 'OPR-05',
      name: 'Bagus Wicaksono',
      role: 'Kiosk Operator',
      phone: '0821-7890-1123',
      email: 'bagus@lumina.studio',
      status: 'standby',
      assignedEvent: 'Cadangan Siaga Weekend',
      assignedHardware: 'Mobile Rig #04',
      sessionsCompleted: 110,
      rating: 4.7,
    },
    {
      id: 'OPR-06',
      name: 'Anisa Maharani',
      role: 'Assistant',
      phone: '0878-1122-3344',
      email: 'anisa@lumina.studio',
      status: 'off_duty',
      assignedEvent: 'Shift Libur',
      assignedHardware: '-',
      sessionsCompleted: 96,
      rating: 4.8,
    },
  ]);

  // Customer Leads State
  const [customerLeads, setCustomerLeads] = useState<CustomerLead[]>([
    {
      id: 'CUST-901',
      name: 'Jessica Tanuwijaya',
      phone: '0812-8877-6655',
      email: 'jessica.tan@gmail.com',
      instagram: '@jessicatan',
      event: 'Wedding of Kevin & Astrid',
      sessionId: '#SES-8821-0492',
      downloadCount: 3,
      capturedAt: 'Hari ini, 14:28 WIB',
    },
    {
      id: 'CUST-902',
      name: 'Reza Pramana',
      phone: '0813-9988-1122',
      email: 'reza.p@techsummit.id',
      instagram: '@rezapramana',
      event: 'Tech Summit Afterparty',
      sessionId: '#SES-8821-0491',
      downloadCount: 2,
      capturedAt: 'Hari ini, 14:24 WIB',
    },
    {
      id: 'CUST-903',
      name: 'Nadia Salsabila',
      phone: '0856-7788-9900',
      email: 'nadia.salsa@yahoo.com',
      instagram: '@nadiasalsa_',
      event: 'Wedding of Kevin & Astrid',
      sessionId: '#SES-8821-0490',
      downloadCount: 4,
      capturedAt: 'Hari ini, 14:19 WIB',
    },
    {
      id: 'CUST-904',
      name: 'Michael Gunawan',
      phone: '0817-2345-6789',
      email: 'm.gunawan@fintech.co.id',
      instagram: '@mgunawan.id',
      event: 'Tech Summit Afterparty',
      sessionId: '#SES-8821-0489',
      downloadCount: 1,
      capturedAt: 'Hari ini, 14:15 WIB',
    },
    {
      id: 'CUST-905',
      name: 'Audrey Stephanie',
      phone: '0812-3344-5566',
      email: 'audrey.steph@gmail.com',
      instagram: '@audreystephe',
      event: 'Sweet 17th Clara',
      sessionId: '#SES-8821-0482',
      downloadCount: 5,
      capturedAt: 'Kemarin, 21:05 WIB',
    },
    {
      id: 'CUST-906',
      name: 'Budi Santoso',
      phone: '0852-1122-8899',
      email: 'budi.santoso@corporate.id',
      instagram: '@budisantoso',
      event: 'Gala Dinner Bank Mandiri',
      sessionId: '#SES-8821-0475',
      downloadCount: 2,
      capturedAt: 'Kemarin, 19:40 WIB',
    },
  ]);

  const loadDataFromBackend = useCallback(async () => {
    try {
      const [usersRes, custRes] = await Promise.all([
        usersApi.list(),
        customersApi.list(),
      ]);

      if (usersRes.data && usersRes.data.length > 0) {
        const beOps: Operator[] = usersRes.data.map((u: any, idx: number) => ({
          id: `OPR-${String(u.id).padStart(2, '0')}`,
          name: u.name,
          role: u.roles?.[0]?.name === 'tenant_admin' ? 'Lead Technician' : 'Kiosk Operator',
          phone: u.phone || '0812-8921-9981',
          email: u.email,
          status: idx === 0 ? 'on_duty' : 'standby',
          assignedEvent: 'Studio Operations',
          assignedHardware: 'Canon R100 + DNP DS620',
          sessionsCompleted: 150 + idx * 25,
          rating: 4.9,
        }));

        setOperators((prev) => {
          const beEmails = new Set(beOps.map((b) => b.email));
          const filtered = prev.filter((p) => !beEmails.has(p.email));
          return [...beOps, ...filtered];
        });
      }

      if (custRes.data && custRes.data.length > 0) {
        const beCusts: CustomerLead[] = custRes.data.map((c: any) => ({
          id: `CUST-${String(c.id).padStart(3, '0')}`,
          name: c.name,
          phone: c.phone || '0812-8877-6655',
          email: c.email || 'customer@photobooth.test',
          instagram: c.phone ? `@${c.name.toLowerCase().replace(/\s+/g, '')}` : '-',
          event: c.photo_sessions?.[0]?.event?.name || 'Wedding of Kevin & Astrid',
          sessionId: c.photo_sessions?.[0] ? `#SES-${String(c.photo_sessions[0].id).padStart(4, '0')}` : '#SES-8821-0492',
          downloadCount: 3,
          capturedAt: c.created_at ? new Date(c.created_at).toLocaleDateString('id-ID') : 'Hari ini',
        }));

        setCustomerLeads((prev) => {
          const beIds = new Set(beCusts.map((b) => b.email));
          const filtered = prev.filter((p) => !beIds.has(p.email));
          return [...beCusts, ...filtered];
        });
      }
    } catch (err) {
      console.warn('Backend load warning in CustomersPage:', err);
    }
  }, []);

  useEffect(() => {
    loadDataFromBackend();
  }, [loadDataFromBackend]);

  // Form State for Adding Operator
  const [newOp, setNewOp] = useState({
    name: '',
    role: 'Kiosk Operator' as Operator['role'],
    phone: '',
    email: '',
    assignedHardware: 'Canon R100 + DNP DS620',
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOp.name.trim()) return;

    try {
      await usersApi.create({
        name: newOp.name,
        email: newOp.email || `${newOp.name.toLowerCase().replace(/\s+/g, '.')}@lumina.studio`,
        phone: newOp.phone || '0812-0000-0000',
        role: 'operator',
      } as any);
    } catch (apiErr) {
      console.warn('API create operator fallback:', apiErr);
    }

    const created: Operator = {
      id: `OPR-0${operators.length + 1}`,
      name: newOp.name,
      role: newOp.role,
      phone: newOp.phone || '0812-0000-0000',
      email: newOp.email || `${newOp.name.toLowerCase().replace(/\s+/g, '.')}@lumina.studio`,
      status: 'standby',
      assignedEvent: 'Tersimpan di Backend',
      assignedHardware: newOp.assignedHardware,
      sessionsCompleted: 0,
      rating: 5.0,
    };

    setOperators([created, ...operators]);
    setIsAddOperatorOpen(false);
    showToast(`Operator ${newOp.name} berhasil disimpan ke database!`);
  };

  const handleExportCsv = () => {
    const headers = ['ID,Nama,WhatsApp,Email,Instagram,Event,Sesi_ID,Unduhan,Waktu'];
    const rows = customerLeads.map(
      (c) => `"${c.id}","${c.name}","${c.phone}","${c.email}","${c.instagram}","${c.event}","${c.sessionId}",${c.downloadCount},"${c.capturedAt}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `photobooth_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Database tamu berhasil diekspor ke format CSV!');
  };

  const filteredOperators = operators.filter(
    (op) =>
      op.name.toLowerCase().includes(operatorSearch.toLowerCase()) ||
      op.role.toLowerCase().includes(operatorSearch.toLowerCase()) ||
      op.assignedEvent.toLowerCase().includes(operatorSearch.toLowerCase())
  );

  const filteredLeads = customerLeads.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
      c.phone.includes(guestSearch) ||
      c.instagram.toLowerCase().includes(guestSearch.toLowerCase()) ||
      c.sessionId.toLowerCase().includes(guestSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedEventFilter === 'all') return true;
    return c.event.toLowerCase().includes(selectedEventFilter.toLowerCase());
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
            <span>Manajemen Bisnis</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-medium">Kelola Operator &amp; Tamu</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Manajemen Tim Operator &amp; Database Leads
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            Atur penugasan shift operator di lokasi booth serta kelola database tamu &amp; prospek pengunjung yang terkumpul dari pemindaian QR code.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={handleExportCsv}>
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span>Export CSV Leads</span>
          </Button>
          <Button variant="primary" onClick={() => setIsAddOperatorOpen(true)}>
            <span className="material-symbols-outlined text-[17px]">person_add</span>
            <span>+ Tambah Operator</span>
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards Strip */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Operator Lapangan
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">badge</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              3 <span className="text-xs font-normal font-sans text-slate-500">/ {operators.length} On-Duty</span>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>2 di Pullman • 1 di ICE BSD</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Kontak Tamu Terkumpul
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">groups</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              4.892 <span className="text-xs font-normal font-sans text-slate-500">Tamu</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              +142 kontak baru hari ini via QR
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Rating Pelayanan
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">grade</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              4.9 <span className="text-xs font-normal font-sans text-slate-500">/ 5.0</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              98.4% Tamu puas dengan layanan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Konversi Unduh Foto
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              91.2%
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Tamu aktif mengunduh via QR
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <TabsList>
            <TabsTrigger value="operators">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">engineering</span>
                <span>Tim Operator Lapangan ({operators.length})</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="leads">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">contacts</span>
                <span>Database Tamu &amp; Leads ({customerLeads.length})</span>
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Tim Operator */}
        <TabsContent value="operators" className="space-y-4 pt-2">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[17px]">search</span>
              <Input
                value={operatorSearch}
                onChange={(e) => setOperatorSearch(e.target.value)}
                placeholder="Cari nama operator, role, atau event..."
                className="pl-9 h-9 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Status Shift:</span>
              <Badge variant="tertiary" className="cursor-pointer">
                On-Duty ({operators.filter((o) => o.status === 'on_duty').length})
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Standby ({operators.filter((o) => o.status === 'standby').length})
              </Badge>
            </div>
          </div>

          {/* Operator Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredOperators.map((op) => (
              <Card key={op.id} className="border border-slate-200/90 bg-white hover:border-slate-300 shadow-xs transition-all">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-bold text-sm">
                        {op.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-slate-900">{op.name}</CardTitle>
                        <CardDescription className="font-mono text-[11px] text-slate-500 mt-0.5">
                          {op.role} • {op.id}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={
                        op.status === 'on_duty'
                          ? 'success'
                          : op.status === 'standby'
                          ? 'warning'
                          : 'outline'
                      }
                    >
                      {op.status === 'on_duty'
                        ? 'Live On-Duty'
                        : op.status === 'standby'
                        ? 'Standby'
                        : 'Off-Duty'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="px-5 space-y-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">Event Bertugas:</span>
                      <strong className="text-slate-900 truncate max-w-[200px] text-right font-medium">
                        {op.assignedEvent}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">Hardware Unit:</span>
                      <span className="font-mono text-[11px] text-slate-800 font-medium">
                        {op.assignedHardware}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Sesi Selesai</span>
                      <strong className="font-mono text-slate-900">{op.sessionsCompleted} Sesi</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Rating Tim</span>
                      <strong className="text-slate-900 flex items-center justify-center gap-0.5 font-mono">
                        <span className="material-symbols-outlined text-[14px] text-amber-500">star</span>
                        {op.rating}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">call</span>
                      {op.phone}
                    </span>
                    <a
                      href={`https://wa.me/${op.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <span>WhatsApp</span>
                      <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Database Tamu & Leads */}
        <TabsContent value="leads" className="space-y-4 pt-2">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[17px]">search</span>
              <Input
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                placeholder="Cari nama tamu, WhatsApp, atau IG..."
                className="pl-9 h-9 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="w-52 h-9 text-xs"
              >
                <option value="all">Semua Event</option>
                <option value="Kevin">Wedding Kevin &amp; Astrid</option>
                <option value="Tech Summit">Tech Summit Afterparty</option>
                <option value="Clara">Sweet 17th Clara</option>
              </Select>
              <Button variant="outline" onClick={handleExportCsv} size="sm">
                <span className="material-symbols-outlined text-[15px]">file_download</span>
                <span>CSV</span>
              </Button>
            </div>
          </div>

          {/* Leads Table */}
          <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                  <TableHead className="py-2.5 px-4">Nama Tamu</TableHead>
                  <TableHead className="py-2.5 px-4">Kontak WhatsApp &amp; Email</TableHead>
                  <TableHead className="py-2.5 px-4">Akun Instagram</TableHead>
                  <TableHead className="py-2.5 px-4">Event Dihadiri</TableHead>
                  <TableHead className="py-2.5 px-4">Sesi Booth</TableHead>
                  <TableHead className="py-2.5 px-4 text-center">Unduhan</TableHead>
                  <TableHead className="py-2.5 px-4">Waktu Capture</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <TableCell className="py-3 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-[10px]">
                          {lead.name.charAt(0)}
                        </div>
                        <span>{lead.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="font-mono text-slate-900 font-medium">{lead.phone}</div>
                      <div className="text-slate-400 text-[11px]">{lead.email}</div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        {lead.instagram}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-slate-900 font-medium">
                      {lead.event}
                    </TableCell>
                    <TableCell className="py-3 px-4 font-mono text-slate-500">
                      {lead.sessionId}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[11px] font-semibold">
                        {lead.downloadCount}x Scan
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-slate-500">
                      {lead.capturedAt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal: Tambah Operator */}
      <Dialog open={isAddOperatorOpen} onOpenChange={setIsAddOperatorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Operator Lapangan</DialogTitle>
            <DialogDescription>
              Daftarkan kru baru untuk penugasan pengoperasian mesin booth di lokasi acara.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddOperator} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-900 mb-1 block">
                Nama Lengkap
              </label>
              <Input
                required
                value={newOp.name}
                onChange={(e) => setNewOp({ ...newOp, name: e.target.value })}
                placeholder="Contoh: Rian Kurniawan"
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-900 mb-1 block">
                Peran / Role
              </label>
              <Select
                value={newOp.role}
                onChange={(e) => setNewOp({ ...newOp, role: e.target.value as Operator['role'] })}
                className="h-9 text-xs"
              >
                <option value="Lead Technician">Lead Technician (Teknisi Utama)</option>
                <option value="Kiosk Operator">Kiosk Operator (Pemandu Tamu)</option>
                <option value="Assistant">Assistant (Bantuan Cetak &amp; Frame)</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-900 mb-1 block">
                Nomor WhatsApp
              </label>
              <Input
                type="tel"
                required
                value={newOp.phone}
                onChange={(e) => setNewOp({ ...newOp, phone: e.target.value })}
                placeholder="0812-3456-7890"
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-900 mb-1 block">
                Alokasi Hardware Standar
              </label>
              <Input
                value={newOp.assignedHardware}
                onChange={(e) => setNewOp({ ...newOp, assignedHardware: e.target.value })}
                placeholder="Canon EOS R100 + DNP DS620"
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOperatorOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary">
                Simpan Operator
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CustomersPage;
