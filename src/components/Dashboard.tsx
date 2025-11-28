import { useState } from 'react';
import { LogOut, Package, FileText, TrendingUp, Pill } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { StockOverview } from './StockOverview';
import { MedicineManagement } from './MedicineManagement';
import { TransactionForm } from './TransactionForm';
import { Reports } from './Reports';

type Tab = 'overview' | 'medicines' | 'transactions' | 'reports';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { logout } = useAuth();

  const tabs = [
    { id: 'overview' as Tab, label: 'Stok Overview', icon: Package },
    { id: 'medicines' as Tab, label: 'Master Obat', icon: Pill },
    { id: 'transactions' as Tab, label: 'Transaksi', icon: TrendingUp },
    { id: 'reports' as Tab, label: 'Laporan', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Apotek Dokter AQA dan Fitria
                </h1>
                <p className="text-xs text-gray-600">Sistem Manajemen Inventaris</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-1 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <StockOverview />}
            {activeTab === 'medicines' && <MedicineManagement />}
            {activeTab === 'transactions' && <TransactionForm />}
            {activeTab === 'reports' && <Reports />}
          </div>
        </div>
      </div>
    </div>
  );
}
