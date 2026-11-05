import SlipKeputusan from './SlipKeputusan';
import { useState, useEffect } from 'react';

export default function StudentView({ user, onLogout, API_URL }) {
  const [noKP, setNoKP] = useState(user.username || '');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cariKeputusan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch(`${API_URL}?id=${noKP}`);
      const result = await response.json();

      if (result.status === 'success') {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Ralat rangkaian.');
    } finally {
      setLoading(false);
    }
  };

  const getGredColor = (gred) => {
    if (gred?.startsWith('A')) return 'bg-green-500';
    if (gred?.startsWith('B')) return 'bg-teal-500';
    if (gred?.startsWith('C')) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      {/* Header */}
      <div className="max-w-md mx-auto mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Sistem Keputusan</h1>
          <p className="text-xs text-gray-500">Peperiksaan Akhir Tahun 2026</p>
        </div>
        <button
          onClick={onLogout}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Log Keluar
        </button>
      </div>

      <div className="max-w-md mx-auto">
        {!data && !loading && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Semak Keputusan Anda</h2>
            <form onSubmit={cariKeputusan}>
              <label className="block text-sm font-medium text-gray-600 mb-2">No. Kad Pengenalan</label>
              <input
                type="text"
                value={noKP}
                onChange={(e) => setNoKP(e.target.value)}
                placeholder="Contoh: 1001"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none mb-4"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
              >
                Lihat Keputusan
              </button>
            </form>
            {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
          </div>
        )}

        {loading && (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600">Sedang memuatkan...</p>
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {/* Kad Maklumat Pelajar */}
            <div className="bg-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{data.maklumatPelajar.nama}</h2>
                <p className="text-gray-500 text-sm">{data.maklumatPelajar.kelas}</p>
                <div className="mt-2 text-sm text-gray-600">📚 {data.ringkasan.bilanganSubjek} Subjek</div>
              </div>
              <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{data.ringkasan.purataPNG}</p>
                  <p className="text-xs text-gray-500">PNG</p>
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
                    <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getGredColor(subjek.gred)}`}>
                      {subjek.gred}
                    </span>
                  </div>
                ))}
              </div>
            </div>

{/* Butang Cetak PDF */}
<div className="no-print flex justify-center mt-4">
  <button
    onClick={() => window.print()}
    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center gap-2"
  >
    🖨️ Cetak / Muat Turun PDF
  </button>
</div>

{/* Komponen Slip (Tersembunyi di skrin, hanya nampak bila cetak) */}
<div id="slip-keputusan" className="hidden print:block">
  <SlipKeputusan data={data} />
</div>

            <button
              onClick={() => { setData(null); setNoKP(''); }}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition"
            >
              Semak Pelajar Lain
            </button>
          </div>
        )}
      </div>
    </div>
  );
}