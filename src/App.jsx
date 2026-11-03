import { useState } from 'react'

function App() {
  // GANTIKAN URL INI DENGAN URL APPS SCRIPT ANDA
  const API_URL = "https://script.google.com/macros/s/AKfycbxPTaPXaegE9C8Xvx_7X09MWw7I-bSzwEbTAVojpCi4hLDQzzAF_JnNvv0JTh-iQ3U/exec"; 

  const [noKP, setNoKP] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const cariKeputusan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setData(null);

    try {
      // Panggil API Backend
      const response = await fetch(`${API_URL}?id=${noKP}`);
      const result = await response.json();

      if (result.status === 'success') {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Ralat rangkaian. Sila cuba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk tentukan warna badge gred
  const getGredColor = (gred) => {
    if (gred.startsWith('A')) return 'bg-green-500 text-white';
    if (gred.startsWith('B')) return 'bg-teal-500 text-white';
    if (gred.startsWith('C')) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4">
      
      {/* Header */}
      <div className="w-full max-w-md text-center mb-8">
        <div className="w-16 h-16 bg-green-700 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-3">
          🕌
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Sistem Keputusan</h1>
        <p className="text-gray-500 text-sm">Peperiksaan Akhir Tahun 2026</p>
      </div>

      {/* Paparan Utama */}
      <div className="w-full max-w-md">
        
        {/* Jika tiada data, papar borang login */}
        {!data && !loading && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Semak Keputusan Anda</h2>
            <form onSubmit={cariKeputusan}>
              <label className="block text-sm font-medium text-gray-600 mb-2">No. Kad Pengenalan / No. Matrik</label>
              <input 
                type="text" 
                value={noKP}
                onChange={(e) => setNoKP(e.target.value)}
                placeholder="Contoh: 1001"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none mb-4"
                required
              />
              <button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200"
              >
                Lihat Keputusan
              </button>
            </form>
            {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600">Sedang memuatkan data...</p>
          </div>
        )}

        {/* Paparan Keputusan (Dashboard) */}
        {data && (
          <div className="space-y-4">
            {/* Kad Maklumat Pelajar & Purata */}
            <div className="bg-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{data.maklumatPelajar.nama}</h2>
                <p className="text-gray-500 text-sm">{data.maklumatPelajar.kelas}</p>
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <span className="mr-3">📚 {data.ringkasan.bilanganSubjek} Subjek</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{data.ringkasan.purataPNG}</p>
                    <p className="text-xs text-gray-500">PNG</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Senarai Keputusan */}
            <div className="bg-white p-5 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Senarai Mata Pelajaran</h3>
              <div className="space-y-3">
                {data.keputusan.map((subjek, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center">
                      <span className="text-green-600 mr-3 text-lg">📖</span>
                      <div>
                        <p className="font-medium text-gray-800">{subjek.namaSubjek}</p>
                        <p className="text-xs text-gray-400">Markah: {subjek.markah}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGredColor(subjek.gred)}`}>
                      {subjek.gred}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Butang Kembali */}
            <button 
              onClick={() => { setData(null); setNoKP(''); }}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition duration-200"
            >
              Semak Pelajar Lain
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default App