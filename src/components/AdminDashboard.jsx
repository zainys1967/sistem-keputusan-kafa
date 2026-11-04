import { useState, useEffect } from 'react';

export default function AdminDashboard({ user, API_URL }) {
  const [senaraiPengguna, setSenaraiPengguna] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '', password: '', peranan: 'Guru Kelas', tugasKhas: '', namaPenuh: ''
  });
  const [msg, setMsg] = useState('');

  // 1. Tarik Senarai Pengguna bila mula load
  useEffect(() => {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'getSenaraiPengguna' })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') setSenaraiPengguna(data.data);
      setLoading(false);
    });
  }, [API_URL]);

  // 2. Handle perubahan input borang
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Fungsi Tambah Pengguna
  const handleTambah = async (e) => {
    e.preventDefault();
    setMsg('Memproses...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'tambahPengguna', ...formData })
    });
    const result = await response.json();
    setMsg(result.message);
    
    if (result.status === 'success') {
      setFormData({ username: '', password: '', peranan: 'Guru Kelas', tugasKhas: '', namaPenuh: '' }); // Reset borang
      // Refresh senarai (cara mudah: reload page atau fetch semula)
      window.location.reload(); 
    }
  };

  // 4. Fungsi Padam Pengguna
  const handlePadam = async (rowIndex, username) => {
    if (!window.confirm(`Adakah anda pasti mahu padam pengguna '${username}'?`)) return;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'padamPengguna', rowIndex: rowIndex })
    });
    const result = await response.json();
    alert(result.message);
    if (result.status === 'success') window.location.reload();
  };

  if (loading) return <div className="p-6 text-center">Memuatkan data...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h2 className="text-xl font-bold text-purple-800">Dashboard Admin</h2>
        <p className="text-sm text-purple-600">Urus semua pengguna sistem</p>
      </div>

      {/* Borang Tambah Pengguna */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">➕ Tambah Pengguna Baru</h3>
        <form onSubmit={handleTambah} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="username" value={formData.username} onChange={handleChange} placeholder="Username (contoh: ustaz_ali)" className="p-3 border rounded-lg" required />
          <input name="password" type="text" value={formData.password} onChange={handleChange} placeholder="Password" className="p-3 border rounded-lg" required />
          <input name="namaPenuh" value={formData.namaPenuh} onChange={handleChange} placeholder="Nama Penuh" className="p-3 border rounded-lg" required />
          
          <select name="peranan" value={formData.peranan} onChange={handleChange} className="p-3 border rounded-lg">
            <option value="Admin">Admin</option>
            <option value="Guru Kelas">Guru Kelas</option>
            <option value="Guru Subjek">Guru Subjek</option>
            <option value="Pelajar">Pelajar</option>
          </select>

          <input name="tugasKhas" value={formData.tugasKhas} onChange={handleChange} 
            placeholder="Tugasan Khas (Nama Kelas / Kod Subjek / 'Semua')" 
            className="p-3 border rounded-lg md:col-span-2" required />
          
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg md:col-span-2 transition">
            Tambah Pengguna
          </button>
        </form>
        {msg && <p className="mt-4 text-center font-medium text-purple-600">{msg}</p>}
      </div>

      {/* Senarai Pengguna */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📋 Senarai Pengguna ({senaraiPengguna.length})</h3>
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
                    }`}>
                      {u.peranan}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{u.tugasKhas}</td>
                  <td className="p-3">
                    {u.username !== 'admin1' && ( // Elak admin utama padam diri sendiri
                      <button 
                        onClick={() => handlePadam(u.rowIndex, u.username)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Padam
                      </button>
                    )}
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