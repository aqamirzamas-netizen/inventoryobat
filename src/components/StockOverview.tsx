import { useState } from 'react';
import { AlertCircle, Search, Settings as SettingsIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Location } from '../types';
import { StockSettingsModal } from './StockSettingsModal';

export function StockOverview() {
  const { getStockWithAlerts } = useData();
  const [selectedLocation, setSelectedLocation] = useState<Location>('TEGUHAN');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStock, setEditingStock] = useState<string | null>(null);

  const stocks = getStockWithAlerts(selectedLocation);
  const filteredStocks = stocks.filter((stock) =>
    stock.medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const alertCounts = {
    red: stocks.filter((s) => s.alertLevel === 'red').length,
    yellow: stocks.filter((s) => s.alertLevel === 'yellow').length,
    green: stocks.filter((s) => s.alertLevel === 'green').length,
  };

  const getAlertColor = (level: 'green' | 'yellow' | 'red') => {
    switch (level) {
      case 'red':
        return 'bg-red-100 border-red-300';
      case 'yellow':
        return 'bg-yellow-100 border-yellow-300';
      case 'green':
        return 'bg-green-100 border-green-300';
    }
  };

  const getAlertDot = (level: 'green' | 'yellow' | 'red') => {
    switch (level) {
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'green':
        return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Stok Overview</h2>
          <p className="text-gray-600">Pantau stok obat dengan sistem peringatan dini</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedLocation('TEGUHAN')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              selectedLocation === 'TEGUHAN'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Teguhan
          </button>
          <button
            onClick={() => setSelectedLocation('JOGOROGO')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              selectedLocation === 'JOGOROGO'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Jogorogo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 font-semibold text-sm">Stok Kritis</p>
              <p className="text-3xl font-bold text-red-700">{alertCounts.red}</p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 font-semibold text-sm">Perlu Perhatian</p>
              <p className="text-3xl font-bold text-yellow-700">{alertCounts.yellow}</p>
            </div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-semibold text-sm">Stok Aman</p>
              <p className="text-3xl font-bold text-green-700">{alertCounts.green}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari nama obat..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Nama Obat
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
                  Stok Saat Ini
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
                  Stok Maksimum
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
                  Persentase
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStocks.map((stock) => (
                <tr
                  key={stock.id}
                  className={`${getAlertColor(stock.alertLevel)} transition hover:opacity-80`}
                >
                  <td className="px-6 py-4">
                    <div className={`w-4 h-4 rounded-full ${getAlertDot(stock.alertLevel)}`}></div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800">{stock.medicine.name}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-800 font-semibold">{stock.currentStock}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-600">{stock.maxStock}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium text-gray-800">
                      {stock.percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setEditingStock(stock.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                    >
                      <SettingsIcon className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStocks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Tidak ada data yang ditemukan</p>
        </div>
      )}

      {editingStock && (
        <StockSettingsModal
          stockId={editingStock}
          onClose={() => setEditingStock(null)}
        />
      )}
    </div>
  );
}
