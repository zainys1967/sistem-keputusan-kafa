import { useState } from 'react';

export default function Login({ onLoginSuccess, API_URL }) {
  const [mode, setMode] = useState('staff'); // 'staff' atau 'pelajar'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'login',
          username: username,
          password: password
        })
      });
      const result = await response.json();

      if (result.status === 'success') {
        onLoginSuccess(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Ralat rangkaian. Sila cuba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo & Tajuk */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-700 rounded-full mx-auto flex items-center justify-center text-4xl mb-3 shadow-lg">
            🕌
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Sistem Keputusan</h1>
          <p className="text-gray-500 text-sm">Peperiksaan Akhir Tahun 2026</p>
        </div>

        {/* Kad Login */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          {/* Tab Pilihan */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode('staff')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                mode === 'staff' ? 'bg-white text-green-700 shadow' : 'text-gray-500'
              }`}
            >
              Staff (Guru/Admin)
            </button>
            <button
              onClick={() => setMode('pelajar')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                mode === 'pelajar' ? 'bg-white text-green-700 shadow' : 'text-gray-500'
              }`}
            >
              Pelajar / Waris
            </button>
          </div>

          {mode === 'staff' ? (
            // Borang Login Staff
            <form onSubmit={handleStaffLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Contoh: admin1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Log Masuk'}
              </button>
            </form>
          ) : (
            // Borang Login Pelajar (guna No. KP sahaja)
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Masukkan No. Kad Pengenalan untuk lihat keputusan anda.
              </p>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Contoh: 1001"
              />
              <button
                onClick={() => {
  if (username.trim()) {
    onLoginSuccess({
      username: username,
      peranan: 'Pelajar',
      tugasKhas: '',  // Pastikan ini 'tugasKhas'
      namaPenuh: 'Pelajar'
    });
  }
}}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
              >
                Lihat Keputusan
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          © 2026 Sistem Keputusan Sekolah Agama
        </p>
      </div>
    </div>
  );
}