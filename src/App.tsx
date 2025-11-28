import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <DashboardWithLoading />;
}

function DashboardWithLoading() {
  const { isLoading, loadingMessage } = useData();

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-800">Memuat Data</h2>
              <p className="text-gray-600 text-center">{loadingMessage}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
              <p className="text-sm text-gray-500">Mohon tunggu sebentar...</p>
            </div>
          </div>
        </div>
      )}
      <Dashboard />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
