import { useState, useEffect } from 'react';

export default function AdminDashboard({ user, API_URL }) {
  // State untuk Pengurusan Pengguna
  const [senaraiPengguna, setSenaraiPengguna] = useState([]);
  const [formDataPengguna, setFormDataPengguna] = useState({
    username: '', password: '', peranan: 'Guru Kelas', tugasanKhas: '', namaPenuh: ''
  });
  const [msgPengguna, setMsgPengguna] = useState('');

  // State untuk Pengurusan Pelajar
  const [senaraiPelajar, setSenaraiPelajar] = useState([]);
  const [senaraiKelas, setSenaraiKelas] = useState([]);
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [formDataPelajar, setFormDataPelajar] = useState({
    noKP: '', nama: '', kelas: '', jantina: 'L', penjaga: ''
  });
  const [msgPelajar, setMsgPelajar] = useState('');

  const [loading, setLoading] = useState(true);

  // 1. Tarik Data Awal
  useEffect(() => {
    // Tarik Senarai Pengguna
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'getSenaraiPengguna' })
    })
    .then(res => res.json())
    .then(data => { if (data.status === 'success') setSenaraiPengguna(data.data); });

    // Tarik Senarai Kelas
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'getSenaraiKelas' })
    })
    .then(res => res.json())
    .then(data => { 
      if (data.status === 'success') {
        setSenaraiKelas(data.data);
        if (data.data.length > 0) setFormDataPelajar(prev => ({ ...prev, kelas: data.data[0] }));
      }
    });

    // Tarik Senarai Pelajar
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'getSenaraiPelajar', username: user.username })
    })
    .then(res => res.json())
    .then(data => { 
      if (data.status === 'success') setSenaraiPelajar(data.data);
      setLoading(false);
    });
  }, [user.username, API_URL]);

  // 2. Fungsi Tambah Pengguna
  const handleTambahPengguna = async (e) => {
    e.preventDefault();
    setMsgPengguna('Memproses...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'tambahPengguna', ...formDataPengguna })
    });
    const result = await response.json();
    setMsgPengguna(result.message);
    if (result.status === 'success') {
      setFormDataPengguna({ username: '', password: '', peranan: 'Guru Kelas', tugasanKhas: '', namaPenuh: '' });
      window.location.reload();
    }
    setTimeout(() => setMsgPengguna(''), 4000);
  };

  // 3. Fungsi Padam Pengguna
  const handlePadamPengguna = async (rowIndex, username) => {
    if (!window.confirm(`Padam pengguna '${username}'?`)) return;
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'padamPengguna', rowIndex: rowIndex })
    });
    const result = await response.json();
    alert(result.message);
    if (result.status === 'success') window.location.reload();
  };

  // 4. Fungsi Tambah Pelajar
  const handleTambahPelajar = async (e) => {
    e.preventDefault();
    setMsgPelajar('Memproses...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'tambahPelajar', username: user.username, ...formDataPelajar })
    });
    const result = await response.json();
    setMsgPelajar(result.message);
    if (result.status === 'success') {
      setFormDataPelajar({ noKP: '', nama: '', kelas: formDataPelajar.kelas, jantina: 'L', penjaga: '' });
      // Refresh senarai pelajar
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'getSenaraiPelajar', username: user.username })
      })
      .then(res => res.json())
      .then(data => { if (data.status === 'success') setSenaraiPelajar(data.data); });
    }
    setTimeout(() => setMsgPelajar(''), 4000);
  };

  // 5. Fungsi Padam Pelajar
  const handlePadamPelajar = async (noKP, nama) => {
    if (!window.confirm(`Padam pelajar '${nama}' (${noKP})?\n\nAmaran: Rekod keputusan juga akan dipadam.`)) return;
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'padamPelajar', username: user.username, noKP: noKP })
    });
    const result = await response.json();
    alert(result.message);
    if (result.status === 'success') {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'getSenaraiPelajar', username: user.username })
      })
      .then(res => res.json())
      .then(data => { if (data.status === 'success') setSenaraiPelajar(data.data); });
    }
  };

  // Filter pelajar mengikut kelas
  const pelajarDitapis = filterKelas === 'Semua' 
    ? senaraiPelajar 
    : senaraiPelajar.filter(p => p.kelas === filterKelas);

  if (loading) return <div className="p-6 text-center">Memuatkan data...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h2 className="text-xl font-bold text-purple-800">Dashboard Admin</h2>
        <p className="text-sm text-purple-600">Urus pengguna & pelajar keseluruhan sistem</p>
      </div>

      {/* ========== BAHAGIAN 1: PENGURUSAN PENGGUNA ========== */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">👥 Pengurusan Pengguna</h3>
        
        {/* Borang Tambah Pengguna */}
        <form onSubmit={handleTambahPengguna} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input name="username" value={formDataPengguna.username} onChange={(e) => setFormDataPengguna({...formDataPengguna, username: e.target.value})} placeholder="Username" className="p-3 border rounded-lg" required />
          <input name="password" type="text" value={formDataPengguna.password} onChange={(e) => setFormDataPengguna({...formDataPengguna, password: e.target.value})} placeholder="Password" className="p-3 border rounded-lg" required />
          <input name="namaPenuh" value={formDataPengguna.namaPenuh} onChange={(e) => setFormDataPengguna({...formDataPengguna, namaPenuh: e.target.value})} placeholder="Nama Penuh" className="p-3 border rounded-lg" required />
          <select name="peranan" value={formDataPengguna.peranan} onChange={(e) => setFormDataPengguna({...formDataPengguna, peranan: e.target.value})} className="p-3 border rounded-lg">
            <option value="Admin">Admin</option>
            <option value="Guru Kelas">Guru Kelas</option>
            <option value="Guru Subjek">Guru Subjek</option>
            <option value="Pelajar">Pelajar</option>
          </select>
          <input name="tugasanKhas" value={formDataPengguna.tugasanKhas} onChange={(e) => setFormDataPengguna({...formDataPengguna, tugasanKhas: e.target.value})} placeholder="Tugasan Khas (Nama Kelas / Kod Subjek / 'Semua')" className="p-3 border rounded-lg md:col-span-2" required />
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg md:col-span-2 transition">Tambah Pengguna</button>
        </form>
        {msgPengguna && <p className={`mb-4 text-center font-medium ${msgPengguna.includes('berjaya') ? 'text-green-600' : 'text-red-600'}`}>{msgPengguna}</p>}

        {/* Senarai Pengguna */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Username</th>
                <th className="p-3">Nama Penuh</th>
                <th className="p-3">Peranan</th>
                <th className="p-3">Tugasan Khas</th>
                <th className="p-3">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {senaraiPengguna.map((u, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{u.username}</td>
                  <td className="p-3">{u.namaPenuh}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                      u.peranan === 'Admin' ? 'bg-purple-500' : 
                      u.peranan === 'Guru Kelas' ? 'bg-blue-500' : 
                      u.peranan === 'Guru Subjek' ? 'bg-orange-500' : 'bg-green-500'
                    }`}>{u.peranan}</span>
                  </td>
                  <td className="p-3 text-sm">{u.tugasanKhas}</td>
                  <td className="p-3">
                    {u.username !== 'admin1' && (
                      <button onClick={() => handlePadamPengguna(u.rowIndex, u.username)} className="text-red-500 hover:text-red-700 text-sm font-medium">Padam</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========== BAHAGIAN 2: PENGURUSAN PELAJAR ========== */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">🎓 Pengurusan Pelajar</h3>
        
        {/* Borang Tambah Pelajar */}
        <form onSubmit={handleTambahPelajar} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input name="noKP" value={formDataPelajar.noKP} onChange={(e) => setFormDataPelajar({...formDataPelajar, noKP: e.target.value})} placeholder="No. Kad Pengenalan" className="p-3 border rounded-lg" required />
          <input name="nama" value={formDataPelajar.nama} onChange={(e) => setFormDataPelajar({...formDataPelajar, nama: e.target.value})} placeholder="Nama Penuh Pelajar" className="p-3 border rounded-lg" required />
          <select name="kelas" value={formDataPelajar.kelas} onChange={(e) => setFormDataPelajar({...formDataPelajar, kelas: e.target.value})} className="p-3 border rounded-lg" required>
            <option value="">-- Pilih Kelas --</option>
            {senaraiKelas.map((k, idx) => (<option key={idx} value={k}>{k}</option>))}
          </select>
          <select name="jantina" value={formDataPelajar.jantina} onChange={(e) => setFormDataPelajar({...formDataPelajar, jantina: e.target.value})} className="p-3 border rounded-lg">
            <option value="L">Lelaki</option>
            <option value="P">Perempuan</option>
          </select>
          <input name="penjaga" value={formDataPelajar.penjaga} onChange={(e) => setFormDataPelajar({...formDataPelajar, penjaga: e.target.value})} placeholder="Nama Penjaga" className="p-3 border rounded-lg md:col-span-2" required />
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg md:col-span-2 transition">Tambah Pelajar</button>
        </form>
        {msgPelajar && <p className={`mb-4 text-center font-medium ${msgPelajar.includes('berjaya') ? 'text-green-600' : 'text-red-600'}`}>{msgPelajar}</p>}

        {/* Filter Kelas */}
        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Tapis Mengikut Kelas:</label>
          <select value={filterKelas} onChange={(e) => setFilterKelas(e.target.value)} className="p-2 border rounded-lg">
            <option value="Semua">Semua Kelas</option>
            {senaraiKelas.map((k, idx) => (<option key={idx} value={k}>{k}</option>))}
          </select>
          <span className="text-sm text-gray-500">({pelajarDitapis.length} pelajar)</span>
        </div>

        {/* Senarai Pelajar */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">No. KP</th>
                <th className="p-3">Nama Pelajar</th>
                <th className="p-3">Kelas</th>
                <th className="p-3">Jantina</th>
                <th className="p-3">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {pelajarDitapis.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">Tiada pelajar dalam kelas ini.</td></tr>
              ) : (
                pelajarDitapis.map((p, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-sm">{p.noKP}</td>
                    <td className="p-3 font-medium">{p.nama}</td>
                    <td className="p-3">{p.kelas}</td>
                    <td className="p-3">{p.jantina}</td>
                    <td className="p-3">
                      <button onClick={() => handlePadamPelajar(p.noKP, p.nama)} className="text-red-500 hover:text-red-700 text-sm font-medium bg-red-50 px-3 py-1 rounded hover:bg-red-100 transition">🗑️ Padam</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}