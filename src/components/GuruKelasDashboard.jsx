import { useState, useEffect } from 'react';

export default function GuruKelasDashboard({ user, API_URL }) {
  const [pelajarList, setPelajarList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Rekod Markah
  const [selectedPelajar, setSelectedPelajar] = useState('');
  const [markah, setMarkah] = useState('');
  const [subjek, setSubjek] = useState('AQ');
  const [msgMarkah, setMsgMarkah] = useState('');

  // State untuk Tambah Pelajar
  const [newPelajar, setNewPelajar] = useState({
    noKP: '', nama: '', kelas: user.tugasanKhas, jantina: 'L', penjaga: ''
  });
  const [msgPelajar, setMsgPelajar] = useState('');

  const senaraiSubjek = [
    { kod: 'AQ', nama: 'Al-Quran' }, { kod: 'HD', nama: 'Hadith' },
    { kod: 'FQ', nama: 'Fiqh' }, { kod: 'SR', nama: 'Sirah' },
    { kod: 'BA', nama: 'Bahasa Arab' }, { kod: 'PI', nama: 'Pendidikan Islam' }
  ];

  // 1. Tarik Senarai Pelajar
  const loadPelajar = () => {
    setLoading(true);
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
  };

  useEffect(() => { loadPelajar(); }, [user.username, API_URL]);

  // 2. Fungsi Simpan Markah
  const handleSimpanMarkah = async (e) => {
    e.preventDefault();
    setMsgMarkah('Menyimpan...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'simpanMarkah', username: user.username, noKP: selectedPelajar, kodSubjek: subjek, markah: markah })
    });
    const result = await response.json();
    setMsgMarkah(result.message);
    setTimeout(() => setMsgMarkah(''), 3000);
  };

  // 3. Fungsi Tambah Pelajar
  const handleTambahPelajar = async (e) => {
    e.preventDefault();
    setMsgPelajar('Memproses...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'tambahPelajar', username: user.username, ...newPelajar })
    });
    const result = await response.json();
    setMsgPelajar(result.message);
    if (result.status === 'success') {
      setNewPelajar({ noKP: '', nama: '', kelas: user.tugasanKhas, jantina: 'L', penjaga: '' });
      loadPelajar(); // Refresh senarai
    }
    setTimeout(() => setMsgPelajar(''), 4000);
  };

  // 4. Fungsi Padam Pelajar
  const handlePadamPelajar = async (noKP, nama) => {
    if (!window.confirm(`Adakah anda pasti mahu memadam pelajar '${nama}' (${noKP})?\n\nAmaran: Rekod keputusan pelajar ini juga akan dipadam.`)) return;
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'padamPelajar', username: user.username, noKP: noKP })
    });
    const result = await response.json();
    alert(result.message);
    if (result.status === 'success') loadPelajar();
  };

  if (loading) return <div className="p-6 text-center">Memuatkan data...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold text-blue-800">Dashboard Guru Kelas</h2>
        <p className="text-sm text-blue-600">Kelas: <strong>{user.tugasanKhas}</strong> | Jumlah Pelajar: {pelajarList.length}</p>
      </div>

      {/* Bahagian 1: Tambah Pelajar Baru */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">➕ Tambah Pelajar Baru</h3>
        <form onSubmit={handleTambahPelajar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="noKP" value={newPelajar.noKP} onChange={(e) => setNewPelajar({...newPelajar, noKP: e.target.value})} placeholder="No. Kad Pengenalan" className="p-3 border rounded-lg" required />
          <input name="nama" value={newPelajar.nama} onChange={(e) => setNewPelajar({...newPelajar, nama: e.target.value})} placeholder="Nama Penuh Pelajar" className="p-3 border rounded-lg" required />
          <select name="jantina" value={newPelajar.jantina} onChange={(e) => setNewPelajar({...newPelajar, jantina: e.target.value})} className="p-3 border rounded-lg">
            <option value="L">Lelaki</option>
            <option value="P">Perempuan</option>
          </select>
          <input name="penjaga" value={newPelajar.penjaga} onChange={(e) => setNewPelajar({...newPelajar, penjaga: e.target.value})} placeholder="Nama Penjaga" className="p-3 border rounded-lg" required />
          <input name="kelas" value={newPelajar.kelas} readOnly className="p-3 border rounded-lg bg-gray-100 text-gray-500 md:col-span-2" />
          
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg md:col-span-2 transition">
            Tambah Pelajar
          </button>
        </form>
        {msgPelajar && <p className={`mt-4 text-center font-medium ${msgPelajar.includes('berjaya') ? 'text-green-600' : 'text-red-600'}`}>{msgPelajar}</p>}
      </div>

      {/* Bahagian 2: Rekod Markah */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📝 Rekod Markah Pelajar</h3>
        <form onSubmit={handleSimpanMarkah} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select value={selectedPelajar} onChange={(e) => setSelectedPelajar(e.target.value)} className="p-3 border rounded-lg md:col-span-1" required>
            <option value="">-- Pilih Pelajar --</option>
            {pelajarList.map((p) => (<option key={p.noKP} value={p.noKP}>{p.nama}</option>))}
          </select>
          <select value={subjek} onChange={(e) => setSubjek(e.target.value)} className="p-3 border rounded-lg md:col-span-1">
            {senaraiSubjek.map((s) => (<option key={s.kod} value={s.kod}>{s.nama}</option>))}
          </select>
          <div className="flex space-x-2 md:col-span-1">
            <input type="number" min="0" max="100" value={markah} onChange={(e) => setMarkah(e.target.value)} placeholder="Markah" className="w-full p-3 border rounded-lg" required />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 rounded-lg transition">Simpan</button>
          </div>
        </form>
        {msgMarkah && <p className="mt-4 text-center text-green-600 font-medium">{msgMarkah}</p>}
      </div>

      {/* Bahagian 3: Senarai Pelajar & Tindakan */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📋 Senarai Pelajar Kelas {user.tugasanKhas}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 rounded-tl-lg">No. KP</th>
                <th className="p-3">Nama Pelajar</th>
                <th className="p-3">Jantina</th>
                <th className="p-3 rounded-tr-lg">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {pelajarList.map((p, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{p.noKP}</td>
                  <td className="p-3 font-medium">{p.nama}</td>
                  <td className="p-3">{p.jantina}</td>
                  <td className="p-3">
                    <button 
                      onClick={() => handlePadamPelajar(p.noKP, p.nama)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium bg-red-50 px-3 py-1 rounded hover:bg-red-100 transition"
                    >
                      🗑️ Padam
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}