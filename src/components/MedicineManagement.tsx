import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export function MedicineManagement() {
  const { medicines, addMedicine, updateMedicine, deleteMedicine, stockSettings } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newMedicineName, setNewMedicineName] = useState('');
  const [newTeguhanMax, setNewTeguhanMax] = useState(100);
  const [newJogorogoMax, setNewJogorogoMax] = useState(100);

  const [editName, setEditName] = useState('');

  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addMedicine(newMedicineName, newTeguhanMax, newJogorogoMax);
    setNewMedicineName('');
    setNewTeguhanMax(100);
    setNewJogorogoMax(100);
    setIsAdding(false);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMedicine(editingId, editName);
      setEditingId(null);
      setEditName('');
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus obat "${name}"? Ini akan menghapus semua data stok terkait.`)) {
      deleteMedicine(id);
    }
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const getStockInfo = (medicineId: string) => {
    const teguhan = stockSettings.find(s => s.medicineId === medicineId && s.location === 'TEGUHAN');
    const jogorogo = stockSettings.find(s => s.medicineId === medicineId && s.location === 'JOGOROGO');
    return { teguhan, jogorogo };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Master Data Obat</h2>
          <p className="text-gray-600">Kelola daftar obat dan pengaturan stok maksimum</p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Obat</span>
        </button>
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

      {isAdding && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tambah Obat Baru</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Obat
              </label>
              <input
                type="text"
                value={newMedicineName}
                onChange={(e) => setNewMedicineName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Contoh: PARACETAMOL TAB 500MG"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok Maksimum Teguhan
                </label>
                <input
                  type="number"
                  value={newTeguhanMax}
                  onChange={(e) => setNewTeguhanMax(Number(e.target.value))}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok Maksimum Jogorogo
                </label>
                <input
                  type="number"
                  value={newJogorogoMax}
                  onChange={(e) => setNewJogorogoMax(Number(e.target.value))}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewMedicineName('');
                  setNewTeguhanMax(100);
                  setNewJogorogoMax(100);
                }}
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
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Nama Obat
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
                  Stok Max Teguhan
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
                  Stok Max Jogorogo
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMedicines.map((medicine) => {
                const stockInfo = getStockInfo(medicine.id);
                const isEditing = editingId === medicine.id;

                return (
                  <tr key={medicine.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <form onSubmit={handleEdit}>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            autoFocus
                            required
                          />
                        </form>
                      ) : (
                        <span className="font-medium text-gray-800">{medicine.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-700">{stockInfo.teguhan?.maxStock || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-700">{stockInfo.jogorogo?.maxStock || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleEdit}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition"
                            >
                              Simpan
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditName('');
                              }}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition"
                            >
                              Batal
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(medicine.id, medicine.name)}
                              className="p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(medicine.id, medicine.name)}
                              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredMedicines.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Tidak ada data yang ditemukan</p>
        </div>
      )}
    </div>
  );
}
