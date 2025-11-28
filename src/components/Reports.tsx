import { useState, useMemo, useRef } from 'react';
import { Download, FileText, Filter, PieChart, Upload } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Location, OutCategory, Transaction } from '../types';
import { exportToCSV, exportToPDF, exportStockOverviewPDF, exportMedicineMasterCSV } from '../lib/export';
import { importMedicineMasterCSV } from '../lib/import';

type Period = 'daily' | 'monthly' | 'yearly' | 'custom';
type ReportType = 'transactions' | 'stock';

interface MedicineOutDetail {
  medicineId: string;
  medicineName: string;
  totalQuantity: number;
}

export function Reports() {
  const { transactions, medicines, stockSettings, getStockWithAlerts, importMedicineData } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reportType, setReportType] = useState<ReportType>('transactions');
  const [period, setPeriod] = useState<Period>('monthly');
  const [location, setLocation] = useState<Location | 'ALL'>('ALL');
  const [category, setCategory] = useState<OutCategory | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const outCategories: OutCategory[] = [
    'DU PAGI TEGUHAN',
    'DG PAGI TEGUHAN',
    'DU SORE TEGUHAN',
    'DG SORE TEGUHAN',
    'DU PAGI JOGOROGO',
    'DG PAGI JOGOROGO',
    'DU SORE JOGOROGO',
    'DG SORE JOGOROGO',
  ];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((trans) => {
      if (location !== 'ALL' && trans.location !== location) return false;
      if (
        category !== 'ALL' &&
        trans.transactionType === 'OUT' &&
        trans.category !== category
      )
        return false;

      const transDate = new Date(trans.transactionDate);
      const now = new Date();

      if (period === 'daily') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const transDateOnly = new Date(
          transDate.getFullYear(),
          transDate.getMonth(),
          transDate.getDate()
        );
        return transDateOnly.getTime() === today.getTime();
      }

      if (period === 'monthly') {
        return (
          transDate.getMonth() === now.getMonth() &&
          transDate.getFullYear() === now.getFullYear()
        );
      }

      if (period === 'yearly') {
        return transDate.getFullYear() === now.getFullYear();
      }

      if (period === 'custom' && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return transDate >= start && transDate <= end;
      }

      return true;
    });
  }, [transactions, location, category, period, startDate, endDate]);

  const stats = useMemo(() => {
    const stockIn = filteredTransactions
      .filter((t) => t.transactionType === 'IN')
      .reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0), 0);

    const stockOut = filteredTransactions
      .filter((t) => t.transactionType === 'OUT')
      .reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0), 0);

    const byCategory: Record<string, number> = {};
    filteredTransactions
      .filter((t) => t.transactionType === 'OUT' && t.category)
      .forEach((t) => {
        const cat = t.category!;
        byCategory[cat] = (byCategory[cat] || 0) + t.items.reduce((s, i) => s + i.quantity, 0);
      });

    // Medicine details for OUT transactions
    const medicineDetails: Record<string, MedicineOutDetail> = {};
    filteredTransactions
      .filter((t) => t.transactionType === 'OUT')
      .forEach((t) => {
        t.items.forEach((item) => {
          const medicine = medicines.find((m) => m.id === item.medicineId);
          if (medicine) {
            if (!medicineDetails[item.medicineId]) {
              medicineDetails[item.medicineId] = {
                medicineId: item.medicineId,
                medicineName: medicine.name,
                totalQuantity: 0,
              };
            }
            medicineDetails[item.medicineId].totalQuantity += item.quantity;
          }
        });
      });

    return { stockIn, stockOut, byCategory, medicineDetails: Object.values(medicineDetails) };
  }, [filteredTransactions, medicines]);

  const handleExportCSV = () => {
    if (reportType === 'transactions') {
      const data = filteredTransactions.map((trans) => ({
        Tanggal: trans.transactionDate,
        Jenis: trans.transactionType === 'IN' ? 'MASUK' : 'KELUAR',
        Lokasi: trans.location,
        Kategori: trans.category || '-',
        'Total Item': trans.items.reduce((sum, item) => sum + item.quantity, 0),
      }));
      exportToCSV(data, `laporan_transaksi_${Date.now()}.csv`);
    } else {
      const stocks = getStockWithAlerts(location === 'ALL' ? undefined : location);
      const data = stocks.map((stock) => ({
        'Nama Obat': stock.medicine.name,
        Lokasi: stock.location,
        'Stok Saat Ini': stock.currentStock,
        'Stok Maksimum': stock.maxStock,
        'Persentase (%)': stock.percentage.toFixed(1),
        Status: stock.alertLevel === 'red' ? 'KRITIS' : stock.alertLevel === 'yellow' ? 'PERHATIAN' : 'AMAN',
      }));
      exportToCSV(data, `laporan_stok_${Date.now()}.csv`);
    }
  };

  const handleExportPDF = () => {
    if (reportType === 'transactions') {
      const data = filteredTransactions.map((trans) => [
        trans.transactionDate,
        trans.transactionType === 'IN' ? 'MASUK' : 'KELUAR',
        trans.location,
        trans.category || '-',
        trans.items.reduce((sum, item) => sum + item.quantity, 0).toString(),
      ]);
      exportToPDF(
        'Laporan Transaksi',
        ['Tanggal', 'Jenis', 'Lokasi', 'Kategori', 'Total Item'],
        data,
        `laporan_transaksi_${Date.now()}.pdf`
      );
    } else {
      const stocks = getStockWithAlerts(location === 'ALL' ? undefined : location);
      const data = stocks.map((stock) => [
        stock.medicine.name,
        stock.location,
        stock.currentStock.toString(),
        stock.maxStock.toString(),
        stock.percentage.toFixed(1) + '%',
        stock.alertLevel === 'red' ? 'KRITIS' : stock.alertLevel === 'yellow' ? 'PERHATIAN' : 'AMAN',
      ]);
      exportToPDF(
        'Laporan Stok',
        ['Nama Obat', 'Lokasi', 'Stok Saat Ini', 'Stok Maksimum', 'Persentase', 'Status'],
        data,
        `laporan_stok_${Date.now()}.pdf`
      );
    }
  };

  const handleExportStockOverviewPDF = () => {
    const stocks = getStockWithAlerts(location === 'ALL' ? undefined : location);
    exportStockOverviewPDF(stocks);
  };

  const handleExportMedicineMaster = () => {
    exportMedicineMasterCSV(medicines, stockSettings);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Hanya file CSV yang diperbolehkan');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = importMedicineMasterCSV(text, medicines, stockSettings);

      if (result.success && result.updatedMedicines && result.updatedStockSettings) {
        importMedicineData(result.updatedMedicines, result.updatedStockSettings);
        alert(result.message);
      } else {
        alert(result.message);
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Laporan & Rekapitulasi</h2>
        <p className="text-gray-600">Analisis data transaksi dan stok</p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-blue-600">
          <Filter className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Filter Laporan</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Laporan
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="transactions">Transaksi</option>
              <option value="stock">Stok</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periode
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="daily">Harian</option>
              <option value="monthly">Bulanan</option>
              <option value="yearly">Tahunan</option>
              <option value="custom">Kustom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as Location | 'ALL')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="ALL">Semua Lokasi</option>
              <option value="TEGUHAN">Teguhan</option>
              <option value="JOGOROGO">Jogorogo</option>
            </select>
          </div>

          {reportType === 'transactions' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OutCategory | 'ALL')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="ALL">Semua Kategori</option>
                {outCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {period === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {reportType === 'transactions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <p className="text-green-600 font-semibold text-sm mb-2">Total Stok Masuk</p>
            <p className="text-4xl font-bold text-green-700">{stats.stockIn}</p>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <p className="text-red-600 font-semibold text-sm mb-2">Total Stok Keluar</p>
            <p className="text-4xl font-bold text-red-700">{stats.stockOut}</p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <p className="text-blue-600 font-semibold text-sm mb-2">Total Transaksi</p>
            <p className="text-4xl font-bold text-blue-700">{filteredTransactions.length}</p>
          </div>
        </div>
      )}

      {reportType === 'transactions' && Object.keys(stats.byCategory).length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Distribusi Per Kategori
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.byCategory).map(([cat, count]) => {
              const maxCount = Math.max(...Object.values(stats.byCategory));
              const percentage = (count / maxCount) * 100;

              return (
                <div key={cat}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{cat}</span>
                    <span className="text-sm font-bold text-gray-800">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {reportType === 'transactions' && stats.medicineDetails.length > 0 && (
        <>
          {/* Pie Charts for DU and DG categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DU Categories Pie Chart */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Diagram Stok Obat Keluar DU
                </h3>
              </div>
              <CategoryPieChart categoryPrefix="DU" transactions={filteredTransactions} />
            </div>

            {/* DG Categories Pie Chart */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Diagram Stok Obat Keluar DG
                </h3>
              </div>
              <CategoryPieChart categoryPrefix="DG" transactions={filteredTransactions} />
            </div>
          </div>

          {/* Medicine-based pie chart and details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Diagram Stok Keluar Per Obat
                </h3>
              </div>
              <PieChartComponent data={stats.medicineDetails} />
            </div>

            {/* Medicine Details Table */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Rincian Stok Keluar
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                        Nama Obat
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                        Jumlah Keluar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.medicineDetails
                      .sort((a, b) => b.totalQuantity - a.totalQuantity)
                      .map((detail) => (
                        <tr key={detail.medicineId} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2 text-sm text-gray-800">{detail.medicineName}</td>
                          <td className="py-3 px-2 text-sm text-right font-semibold text-gray-900">
                            {detail.totalQuantity}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Transaction Details Table */}
      {reportType === 'transactions' && filteredTransactions.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Detail Transaksi - {period === 'daily' ? 'Harian' : period === 'monthly' ? 'Bulanan' : period === 'yearly' ? 'Tahunan' : 'Kustom'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Tanggal</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Jenis</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Lokasi</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Kategori</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Obat</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((trans) =>
                  trans.items.map((item, idx) => {
                    const medicine = medicines.find((m) => m.id === item.medicineId);
                    return (
                      <tr key={`${trans.id}-${idx}`} className="border-b border-gray-100 hover:bg-gray-50">
                        {idx === 0 && (
                          <>
                            <td rowSpan={trans.items.length} className="py-3 px-2 text-sm text-gray-800 border-r border-gray-100">
                              {new Date(trans.transactionDate).toLocaleDateString('id-ID')}
                            </td>
                            <td rowSpan={trans.items.length} className="py-3 px-2 text-sm border-r border-gray-100">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                trans.transactionType === 'IN'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {trans.transactionType === 'IN' ? 'MASUK' : 'KELUAR'}
                              </span>
                            </td>
                            <td rowSpan={trans.items.length} className="py-3 px-2 text-sm text-gray-800 border-r border-gray-100">
                              {trans.location}
                            </td>
                            <td rowSpan={trans.items.length} className="py-3 px-2 text-sm text-gray-800 border-r border-gray-100">
                              {trans.category || '-'}
                            </td>
                          </>
                        )}
                        <td className="py-3 px-2 text-sm text-gray-800">{medicine?.name || 'Unknown'}</td>
                        <td className="py-3 px-2 text-sm text-right font-semibold text-gray-900">
                          {item.quantity}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 text-green-600 mb-4">
          <Download className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Master Data Obat</h3>
        </div>

        <div className="bg-green-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Export Master Obat:</span> Unduh data obat dalam format CSV yang dapat diedit di Excel/Spreadsheet
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Import Master Obat:</span> Unggah file CSV yang sudah diedit untuk memperbarui data obat, stok, dan pengaturan
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={handleExportMedicineMaster}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Master Obat (CSV)</span>
          </button>
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <Upload className="w-4 h-4" />
            <span>Import Master Obat (CSV)</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileImport}
            className="hidden"
          />
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Ekspor Laporan</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            {reportType === 'stock' && (
              <button
                onClick={handleExportStockOverviewPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <FileText className="w-4 h-4" />
                <span>Export Stok Overview PDF</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Export CSV:</span> Format tabel yang dapat dibuka di Excel/Spreadsheet
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Export PDF:</span> Laporan standar untuk arsip dan cetak
          </p>
          {reportType === 'stock' && (
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Export Stok Overview PDF:</span> Laporan stok LENGKAP dengan lampu indikator merah & kuning, tampilan seperti halaman Stok Overview
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Category Pie Chart Component (for DU/DG breakdown)
function CategoryPieChart({ categoryPrefix, transactions }: { categoryPrefix: 'DU' | 'DG'; transactions: Transaction[] }) {
  const { medicines } = useData();
  const categories = categoryPrefix === 'DU'
    ? ['DU PAGI TEGUHAN', 'DU PAGI JOGOROGO', 'DU SORE TEGUHAN', 'DU SORE JOGOROGO']
    : ['DG PAGI TEGUHAN', 'DG PAGI JOGOROGO', 'DG SORE TEGUHAN', 'DG SORE JOGOROGO'];

  const categoryData = categories.map(cat => {
    const total = transactions
      .filter(t => t.transactionType === 'OUT' && t.category === cat)
      .reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0), 0);

    return {
      category: cat,
      total,
    };
  });

  const total = categoryData.reduce((sum, item) => sum + item.total, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Tidak ada data untuk kategori {categoryPrefix}
      </div>
    );
  }

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  let currentAngle = -90;
  const slices = categoryData
    .filter(item => item.total > 0)
    .map((item, index) => {
      const percentage = (item.total / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      return {
        ...item,
        percentage,
        startAngle,
        endAngle,
        color: colors[index % colors.length],
      };
    });

  const createArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(150, 150, 120, endAngle);
    const end = polarToCartesian(150, 150, 120, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', 150, 150,
      'L', start.x, start.y,
      'A', 120, 120, 0, largeArcFlag, 0, end.x, end.y,
      'Z'
    ].join(' ');
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const getMedicineDetailsForCategory = (category: string) => {
    const medicineMap: Record<string, { name: string; total: number }> = {};

    transactions
      .filter(t => t.transactionType === 'OUT' && t.category === category)
      .forEach(t => {
        t.items.forEach(item => {
          const medicine = medicines.find(m => m.id === item.medicineId);
          if (medicine) {
            if (!medicineMap[item.medicineId]) {
              medicineMap[item.medicineId] = { name: medicine.name, total: 0 };
            }
            medicineMap[item.medicineId].total += item.quantity;
          }
        });
      });

    return Object.values(medicineMap).sort((a, b) => b.total - a.total);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {slices.map((slice) => (
            <g key={slice.category}>
              <path
                d={createArc(slice.startAngle, slice.endAngle)}
                fill={slice.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <title>{`${slice.category}: ${slice.total} (${slice.percentage.toFixed(1)}%)`}</title>
              </path>
            </g>
          ))}
        </svg>
      </div>

      <div className="space-y-2">
        {slices.map((slice) => (
          <div key={slice.category} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-gray-700 flex-1">{slice.category}</span>
            <span className="text-gray-900 font-semibold">
              {slice.total} ({slice.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Total {categoryPrefix}:</span>
          <span className="text-lg font-bold text-gray-900">{total}</span>
        </div>
      </div>

      {/* Detail per kategori */}
      <div className="mt-6 space-y-4">
        <h4 className="text-md font-semibold text-gray-800 border-b pb-2">
          Rincian Detail Per Sub-Kategori
        </h4>
        {slices.map((slice) => {
          const details = getMedicineDetailsForCategory(slice.category);
          if (details.length === 0) return null;

          return (
            <div key={slice.category} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <h5 className="text-sm font-semibold text-gray-800">{slice.category}</h5>
              </div>
              <div className="space-y-1">
                {details.map((med, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs pl-5">
                    <span className="text-gray-700">{med.name}</span>
                    <span className="text-gray-900 font-semibold">{med.total}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Pie Chart Component
function PieChartComponent({ data }: { data: MedicineOutDetail[] }) {
  const total = data.reduce((sum, item) => sum + item.totalQuantity, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Tidak ada data
      </div>
    );
  }

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
  ];

  let currentAngle = -90;
  const slices = data.map((item, index) => {
    const percentage = (item.totalQuantity / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
      color: colors[index % colors.length],
    };
  });

  const createArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(150, 150, 120, endAngle);
    const end = polarToCartesian(150, 150, 120, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', 150, 150,
      'L', start.x, start.y,
      'A', 120, 120, 0, largeArcFlag, 0, end.x, end.y,
      'Z'
    ].join(' ');
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {slices.map((slice) => (
            <g key={slice.medicineId}>
              <path
                d={createArc(slice.startAngle, slice.endAngle)}
                fill={slice.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <title>{`${slice.medicineName}: ${slice.totalQuantity} (${slice.percentage.toFixed(1)}%)`}</title>
              </path>
            </g>
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {slices.map((slice) => (
          <div key={slice.medicineId} className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-gray-700 truncate" title={slice.medicineName}>
              {slice.medicineName}
            </span>
            <span className="text-gray-900 font-semibold ml-auto">
              {slice.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
