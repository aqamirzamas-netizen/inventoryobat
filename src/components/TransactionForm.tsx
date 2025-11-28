import { useState } from 'react';
import { Plus, Trash2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Location, TransactionType, OutCategory } from '../types';

interface TransactionItemInput {
  medicineId: string;
  quantity: number;
}

export function TransactionForm() {
  const { medicines, addTransaction } = useData();
  const [transactionType, setTransactionType] = useState<TransactionType>('IN');
  const [location, setLocation] = useState<Location>('TEGUHAN');
  const [category, setCategory] = useState<OutCategory>('DU PAGI TEGUHAN');
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [items, setItems] = useState<TransactionItemInput[]>([
    { medicineId: '', quantity: 1 },
  ]);

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

  const availableCategories = outCategories.filter((cat) =>
    cat.includes(location)
  );

  const handleAddItem = () => {
    setItems([...items, { medicineId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof TransactionItemInput,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validItems = items.filter((item) => item.medicineId && item.quantity > 0);

    if (validItems.length === 0) {
      alert('Tambahkan minimal satu obat dengan quantity > 0');
      return;
    }

    addTransaction(
      transactionType,
      location,
      transactionType === 'OUT' ? category : undefined,
      validItems,
      transactionDate
    );

    setItems([{ medicineId: '', quantity: 1 }]);
    alert('Transaksi berhasil disimpan!');
  };

  const handleTypeChange = (type: TransactionType) => {
    setTransactionType(type);
    if (type === 'OUT' && !availableCategories.includes(category)) {
      setCategory(availableCategories[0]);
    }
  };

  const handleLocationChange = (loc: Location) => {
    setLocation(loc);
    const newAvailableCategories = outCategories.filter((cat) => cat.includes(loc));
    if (transactionType === 'OUT' && !newAvailableCategories.includes(category)) {
      setCategory(newAvailableCategories[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Form Transaksi</h2>
        <p className="text-gray-600">Catat transaksi pemasukan dan pengeluaran obat</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Informasi Transaksi</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Transaksi
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleTypeChange('IN')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                    transactionType === 'IN'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <ArrowDownCircle className="w-5 h-5" />
                  <span>Stok Masuk</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('OUT')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                    transactionType === 'OUT'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <ArrowUpCircle className="w-5 h-5" />
                  <span>Stok Keluar</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Transaksi
              </label>
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleLocationChange('TEGUHAN')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                    location === 'TEGUHAN'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Teguhan
                </button>
                <button
                  type="button"
                  onClick={() => handleLocationChange('JOGOROGO')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                    location === 'JOGOROGO'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Jogorogo
                </button>
              </div>
            </div>

            {transactionType === 'OUT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as OutCategory)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Daftar Obat</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Obat</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nama Obat
                  </label>
                  <select
                    value={item.medicineId}
                    onChange={(e) =>
                      handleItemChange(index, 'medicineId', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    required
                  >
                    <option value="">Pilih Obat</option>
                    {medicines.map((med) => (
                      <option key={med.id} value={med.id}>
                        {med.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-32">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Jumlah
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, 'quantity', Number(e.target.value))
                    }
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    required
                  />
                </div>

                {items.length > 1 && (
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform hover:scale-105"
          >
            Simpan Transaksi
          </button>
        </div>
      </form>
    </div>
  );
}
