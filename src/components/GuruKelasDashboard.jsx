import { useState, useEffect } from 'react';

export default function GuruKelasDashboard({ user, API_URL }) {
  const [pelajarList, setPelajarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPelajar, setSelectedPelajar] = useState(null);
  const [markah, setMarkah] = useState('');
  const [subjek, setSubjek] = useState('AQ'); // Default Al-Quran
  const [msg, setMsg] = useState('');

  // Senarai subjek (Boleh ambil dari DB nanti, ini hardcode dulu untuk mudah)
  const senaraiSubjek = [
    { kod: 'AQ', nama: 'Al-Quran' },
    { kod: 'HD', nama: 'Hadith' },
    { kod: 'FQ', nama: 'Fiqh' },
    { kod: 'SR', nama: 'Sirah' },
    { kod: 'BA', nama: 'Bahasa Arab' },
    { kod: 'PI', nama: 'Pendidikan Islam' }
  ];

  // 1. Tarik Senarai Pelajar Bila Mula Load
  useEffect(() => {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'getSenaraiPelajar', username: user.username })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') setPelajarList(data.data);
      setLoading(false);
    });
  }, [user.username, API_URL]);

  // 2. Fungsi Simpan Markah
  const handleSimpan = async (e) => {
    e.preventDefault();
    setMsg('Menyimpan...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'simpanMarkah',
        username: user.username,
        noKP: selectedPelajar,
        kodSubjek: subjek,
        markah: markah
      })
    });
    const result = await response.json();
    setMsg(result.message);
    setTimeout(() => setMsg(''), 3000);
  };

  if (loading) return <div className="p-6 text-center">Memuatkan senarai pelajar...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold text-blue-800">Dashboard Guru Kelas</h2>
        <p className="text-sm text-blue-600">Kelas: <strong>{user.tugasKhas}</strong> | Jumlah Pelajar: {pelajarList.length}</p>
      </div>

      {/* Borang Rekod Markah */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📝 Rekod Markah Pelajar</h3>
        <form onSubmit={handleSimpan} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Pelajar</label>
            <select 
              value={selectedPelajar || ''} 
              onChange={(e) => setSelectedPelajar(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">-- Sila Pilih Pelajar --</option>
              {pelajarList.map((p) => (
                <option key={p.noKP} value={p.noKP}>{p.nama} ({p.noKP})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Subjek</label>
            <select 
              value={subjek} 
              onChange={(e) => setSubjek(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {senaraiSubjek.map((s) => (
                <option key={s.kod} value={s.kod}>{s.nama}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Markah (0-100)</label>
            <input 
              type="number" 
              min="0" max="100"
              value={markah} 
              onChange={(e) => setMarkah(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
            Simpan Markah
          </button>
          
          {msg && <p className="text-center text-green-600 font-medium">{msg}</p>}
        </form>
      </div>

      {/* Senarai Pelajar (View Only buat masa ini) */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📋 Senarai Pelajar Kelas {user.tugasKhas}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 rounded-tl-lg">No. KP</th>
                <th className="p-3">Nama Pelajar</th>
                <th className="p-3 rounded-tr-lg">Kelas</th>
              </tr>
            </thead>
            <tbody>
              {pelajarList.map((p, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{p.noKP}</td>
                  <td className="p-3">{p.nama}</td>
                  <td className="p-3">{p.kelas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}