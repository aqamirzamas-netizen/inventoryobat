import { useState } from 'react';
import { Pill, Syringe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(username, password)) {
      setUsername('');
      setPassword('');
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <Pill className="absolute top-20 left-10 w-32 h-32 text-blue-600 rotate-12" />
        <Syringe className="absolute bottom-20 right-20 w-40 h-40 text-cyan-600 -rotate-45" />
        <Pill className="absolute top-40 right-40 w-24 h-24 text-blue-500 -rotate-12" />
        <Syringe className="absolute bottom-40 left-32 w-28 h-28 text-cyan-500 rotate-45" />
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-500 p-4 rounded-full">
              <Pill className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sistem Manajemen Inventaris
          </h1>
          <p className="text-lg text-gray-600">
            Apotek Dokter AQA dan Fitria
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Masukkan username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Masukkan password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Hubungi administrator jika mengalami kendala</p>
        </div>
      </div>
    </div>
  );
}
