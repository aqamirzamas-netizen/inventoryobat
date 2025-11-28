import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface StockSettingsModalProps {
  stockId: string;
  onClose: () => void;
}

export function StockSettingsModal({ stockId, onClose }: StockSettingsModalProps) {
  const { stockSettings, medicines, updateStockSettings } = useData();
  const stock = stockSettings.find((s) => s.id === stockId);
  const medicine = medicines.find((m) => m.id === stock?.medicineId);

  const [maxStock, setMaxStock] = useState(stock?.maxStock || 100);
  const [yellowThreshold, setYellowThreshold] = useState(stock?.yellowThreshold || 40);
  const [redThreshold, setRedThreshold] = useState(stock?.redThreshold || 20);

  useEffect(() => {
    if (stock) {
      setMaxStock(stock.maxStock);
      setYellowThreshold(stock.yellowThreshold);
      setRedThreshold(stock.redThreshold);
    }
  }, [stock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stock) {
      updateStockSettings(stockId, maxStock, yellowThreshold, redThreshold);
      onClose();
    }
  };

  if (!stock) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Edit Pengaturan Stok</h3>
            <p className="text-sm text-gray-600 mt-1">{medicine?.name}</p>
            <p className="text-xs text-blue-600 font-semibold mt-1">Lokasi: {stock.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Stok Saat Ini:</span>
            <span className="text-lg font-bold text-blue-700">{stock.currentStock}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stok Maksimum
            </label>
            <input
              type="number"
              value={maxStock}
              onChange={(e) => setMaxStock(Number(e.target.value))}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Batas maksimum stok untuk lokasi {stock.location}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Threshold Kuning (%)
            </label>
            <input
              type="number"
              value={yellowThreshold}
              onChange={(e) => setYellowThreshold(Number(e.target.value))}
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Peringatan kuning muncul jika stok &lt; {yellowThreshold}%
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Threshold Merah (%)
            </label>
            <input
              type="number"
              value={redThreshold}
              onChange={(e) => setRedThreshold(Number(e.target.value))}
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Peringatan merah muncul jika stok &lt; {redThreshold}%
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
