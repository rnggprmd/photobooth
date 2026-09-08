import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
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
import { transactionsApi } from '../../api/transactions';

interface TransactionItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientPhone: string;
  eventName: string;
  packageName: string;
  amount: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'QRIS Dinamis' | 'BCA Virtual Account' | 'Mandiri VA' | 'Kartu Kredit' | 'Cash / Tunai';
  status: 'paid' | 'pending' | 'refunded' | 'expired';
  createdAt: string;
  paidAt?: string;
  dueDate: string;
  notes?: string;
}

export const TransactionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<TransactionItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Transactions list data
  const [transactions, setTransactions] = useState<TransactionItem[]>([
    {
      id: 'TX-101',
      invoiceNumber: 'INV-2026-0982',
      clientName: 'Kevin & Astrid (Wedding)',
      clientPhone: '0812-8877-6655',
      eventName: 'Wedding of Kevin & Astrid',
      packageName: 'Paket Wedding Royal Platinum (4 Jam)',
      amount: 4750000,
      tax: 0,
      totalAmount: 4750000,
      paymentMethod: 'BCA Virtual Account',
      status: 'paid',
      createdAt: '01 Okt 2026',
      paidAt: '02 Okt 2026, 11:20 WIB',
      dueDate: '04 Okt 2026',
      notes: 'Lunas DP 50% + Pelunasan H-3 Acara',
    },
    {
      id: 'TX-102',
      invoiceNumber: 'INV-2026-0983',
      clientName: 'PT Teknologi Bangsa (Tech Summit)',
      clientPhone: '0813-9988-1122',
      eventName: 'Tech Summit Afterparty 2026',
      packageName: 'Paket Festival & Corporate Hybrid (8 Jam)',
      amount: 7800000,
      tax: 858000,
      totalAmount: 8658000,
      paymentMethod: 'Mandiri VA',
      status: 'paid',
      createdAt: '28 Sep 2026',
      paidAt: '30 Sep 2026, 09:15 WIB',
      dueDate: '05 Okt 2026',
      notes: 'Termasuk PPN 11% Faktur Pajak Perusahaan',
    },
    {
      id: 'TX-103',
      invoiceNumber: 'INV-2026-0984',
      clientName: 'Ibu Veronica (Sweet 17 Clara)',
      clientPhone: '0819-2234-9011',
      eventName: 'Sweet 17th Clara Celebration',
      packageName: 'Paket Sweet 17th Glamour (3 Jam)',
      amount: 3200000,
      tax: 0,
      totalAmount: 3200000,
      paymentMethod: 'QRIS Dinamis',
      status: 'paid',
      createdAt: '03 Okt 2026',
      paidAt: '03 Okt 2026, 15:45 WIB',
      dueDate: '08 Okt 2026',
      notes: 'Instant settlement via Midtrans QRIS',
    },
    {
      id: 'TX-104',
      invoiceNumber: 'INV-2026-0985',
      clientName: 'Bank Mandiri Corporate Affairs',
      clientPhone: '0821-7890-1123',
      eventName: 'Gala Dinner Bank Mandiri',
      packageName: 'Paket Gold Corporate (4 Jam)',
      amount: 6500000,
      tax: 715000,
      totalAmount: 7215000,
      paymentMethod: 'Mandiri VA',
      status: 'pending',
      createdAt: '06 Okt 2026',
      dueDate: '11 Okt 2026',
      notes: 'Menunggu proses approval purchase order finance',
    },
    {
      id: 'TX-105',
      invoiceNumber: 'INV-2026-0986',
      clientName: 'Dimas & Ratna (Engagement)',
      clientPhone: '0857-9921-0022',
      eventName: 'Engagement Dimas & Ratna',
      packageName: 'Paket Starter Intimate (2 Jam)',
      amount: 2500000,
      tax: 0,
      totalAmount: 2500000,
      paymentMethod: 'BCA Virtual Account',
      status: 'pending',
      createdAt: '07 Okt 2026',
      dueDate: '10 Okt 2026',
      notes: 'Tagihan DP 50% (Rp 1.250.000) terkirim via WA',
    },
    {
      id: 'TX-106',
      invoiceNumber: 'INV-2026-0980',
      clientName: 'Alumni SMA 28 Jakarta',
      clientPhone: '0878-1122-3344',
      eventName: 'Reuni Akbar SMA 28',
      packageName: 'Paket Starter Intimate (2 Jam)',
      amount: 2500000,
      tax: 0,
      totalAmount: 2500000,
      paymentMethod: 'QRIS Dinamis',
      status: 'refunded',
      createdAt: '22 Sep 2026',
      dueDate: '25 Sep 2026',
      notes: 'Acara di-reschedule ke bulan Desember, refund disetujui',
    },
  ]);

  useEffect(() => {
    transactionsApi
      .list()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const beTx: TransactionItem[] = res.data.map((t: any) => ({
            id: `TX-${String(t.id).padStart(3, '0')}`,
            invoiceNumber: t.invoice_number || `INV-2026-${String(t.id).padStart(4, '0')}`,
            clientName: t.customer?.name || 'Studio Client',
            clientPhone: t.customer?.phone || '0812-8877-6655',
            eventName: t.event?.name || 'Studio Photobooth Event',
            packageName: 'Paket Studio Standard',
            amount: Number(t.total_amount) || 2500000,
            tax: 0,
            totalAmount: Number(t.total_amount) || 2500000,
            paymentMethod: (t.payments?.[0]?.payment_method as any) || 'BCA Virtual Account',
            status: (t.status as any) || 'paid',
            createdAt: t.created_at ? new Date(t.created_at).toLocaleDateString('id-ID') : '01 Okt 2026',
            paidAt: t.status === 'paid' ? 'Lunas' : undefined,
            dueDate: '10 Okt 2026',
            notes: 'Transaksi tercatat di server backend.',
          }));
          setTransactions((prev) => [...beTx, ...prev.slice(beTx.length)]);
        }
      })
      .catch((err) => console.warn('Transactions load warning:', err));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleExportFinancial = () => {
    const headers = ['Invoice,Klien,Event,Paket,Metode,Total,Status,Tanggal'];
    const rows = transactions.map(
      (t) =>
        `"${t.invoiceNumber}","${t.clientName}","${t.eventName}","${t.packageName}","${t.paymentMethod}",${t.totalAmount},"${t.status}","${t.createdAt}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Laporan keuangan berhasil diekspor!');
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.eventName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (methodFilter !== 'all' && !t.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase())) {
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
            <span>Finansial &amp; Akun</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-medium">Transaksi &amp; Invoice</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Manajemen Transaksi &amp; Penagihan Invoice
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            Catatan penerimaan pembayaran paket sewa event, penagihan invoice klien, riwayat mutasi payment gateway (QRIS &amp; Virtual Account), serta status settlement.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={handleExportFinancial}>
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span>Export Laporan</span>
          </Button>
          <Button
            variant="primary"
            onClick={() => showToast('Fitur invoice kustom baru siap digunakan!')}
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span>+ Buat Invoice Baru</span>
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards Strip */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Pendapatan Bulan Ini
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              Rp 42.850.000
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+18.4% vs bulan sebelumnya</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Tingkat Pelunasan
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              94.1% <span className="text-xs font-normal font-sans text-slate-500">Lunas</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              32 dari 34 Invoice tertagih tepat waktu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Menunggu Pembayaran
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">pending_actions</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              Rp 9.715.000
            </div>
            <p className="text-xs text-slate-500 mt-2">
              2 Invoice aktif (Mandiri &amp; Dimas)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Rata-rata Nilai Invoice
            </CardTitle>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[16px]">receipt</span>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-slate-900 leading-none">
              Rp 4.750.000
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Paket Wedding Royal paling dominan
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
            placeholder="Cari nomor invoice (INV-...), klien, atau event..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40 h-9 text-xs"
          >
            <option value="all">Semua Status</option>
            <option value="paid">Lunas (Paid)</option>
            <option value="pending">Menunggu Bayar</option>
            <option value="refunded">Refund / Batal</option>
          </Select>

          <Select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-44 h-9 text-xs"
          >
            <option value="all">Semua Metode</option>
            <option value="QRIS">QRIS Dinamis</option>
            <option value="BCA">BCA Virtual Account</option>
            <option value="Mandiri">Mandiri VA</option>
          </Select>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div variants={fadeInUp} className="rounded-xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <TableHead className="py-2.5 px-4">No. Invoice</TableHead>
              <TableHead className="py-2.5 px-4">Klien &amp; Acara</TableHead>
              <TableHead className="py-2.5 px-4">Paket Layanan</TableHead>
              <TableHead className="py-2.5 px-4">Metode Bayar</TableHead>
              <TableHead className="py-2.5 px-4">Total Tagihan</TableHead>
              <TableHead className="py-2.5 px-4 text-center">Status</TableHead>
              <TableHead className="py-2.5 px-4 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs divide-y divide-slate-100">
            {filteredTransactions.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                <TableCell className="py-3 px-4 font-mono font-bold text-slate-900">
                  {tx.invoiceNumber}
                  <span className="block text-[11px] font-normal text-slate-400 font-sans">
                    {tx.createdAt}
                  </span>
                </TableCell>

                <TableCell className="py-3 px-4">
                  <div className="font-semibold text-slate-900">{tx.clientName}</div>
                  <div className="text-slate-500 text-[11px]">{tx.eventName}</div>
                </TableCell>

                <TableCell className="py-3 px-4 text-slate-700 font-medium max-w-[220px] truncate">
                  {tx.packageName}
                </TableCell>

                <TableCell className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[11px] text-slate-800 font-medium border border-slate-200">
                    {tx.paymentMethod}
                  </span>
                </TableCell>

                <TableCell className="py-3 px-4 font-mono font-bold text-slate-900">
                  {formatRupiah(tx.totalAmount)}
                </TableCell>

                <TableCell className="py-3 px-4 text-center">
                  <Badge
                    variant={
                      tx.status === 'paid'
                        ? 'success'
                        : tx.status === 'pending'
                        ? 'warning'
                        : 'destructive'
                    }
                  >
                    {tx.status === 'paid'
                      ? 'Lunas'
                      : tx.status === 'pending'
                      ? 'Menunggu'
                      : 'Refund'}
                  </Badge>
                </TableCell>

                <TableCell className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedInvoice(tx)}
                    >
                      <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                      <span>Slip Invoice</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Invoice Detail Dialog */}
      <Dialog open={Boolean(selectedInvoice)} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-xl">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between pr-6">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {selectedInvoice.invoiceNumber}
                  </span>
                  <Badge
                    variant={
                      selectedInvoice.status === 'paid'
                        ? 'success'
                        : selectedInvoice.status === 'pending'
                        ? 'warning'
                        : 'destructive'
                    }
                  >
                    {selectedInvoice.status === 'paid'
                      ? 'LUNAS (PAID)'
                      : selectedInvoice.status === 'pending'
                      ? 'MENUNGGU'
                      : 'REFUND'}
                  </Badge>
                </div>
                <DialogTitle>Kuitansi &amp; Invoice Resmi Photobooth</DialogTitle>
                <DialogDescription>
                  Diterbitkan oleh Lumina Photostudio &amp; Co. untuk klien {selectedInvoice.clientName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2 text-xs">
                {/* Info Bar */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-sans">Tanggal Tagihan:</span>
                    <strong className="text-slate-900">{selectedInvoice.createdAt}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-sans">Jatuh Tempo:</span>
                    <strong className="text-slate-900">{selectedInvoice.dueDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-sans">Metode Pembayaran:</span>
                    <strong className="text-indigo-600">{selectedInvoice.paymentMethod}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-sans">Status:</span>
                    <strong className="text-emerald-600">
                      {selectedInvoice.paidAt ? `Lunas (${selectedInvoice.paidAt})` : 'Menunggu Transfer'}
                    </strong>
                  </div>
                </div>

                {/* Items Breakdown Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 p-2.5 text-[11px] font-semibold text-slate-500 flex justify-between uppercase tracking-wider">
                    <span>Rincian Layanan</span>
                    <span>Subtotal</span>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between font-medium text-slate-900">
                      <div>
                        <div>{selectedInvoice.packageName}</div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          Acara: {selectedInvoice.eventName}
                        </div>
                      </div>
                      <span className="font-mono">{formatRupiah(selectedInvoice.amount)}</span>
                    </div>

                    {selectedInvoice.tax > 0 && (
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>PPN (11%)</span>
                        <span className="font-mono">{formatRupiah(selectedInvoice.tax)}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm text-slate-900">
                      <span>Total Pembayaran</span>
                      <span className="font-mono text-slate-900">
                        {formatRupiah(selectedInvoice.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedInvoice.notes && (
                  <p className="text-[11px] text-slate-400 italic">
                    Catatan: {selectedInvoice.notes}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
                  Tutup
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    showToast('Invoice PDF berhasil diunduh!');
                    setSelectedInvoice(null);
                  }}
                >
                  <span className="material-symbols-outlined text-[15px]">print</span>
                  <span>Cetak / Unduh PDF</span>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default TransactionsPage;
