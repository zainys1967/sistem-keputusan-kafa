import { useState, useEffect } from 'react';

export default function GuruSubjekDashboard({ user, API_URL }) {
  const [pelajarList, setPelajarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markahInput, setMarkahInput] = useState({}); // Simpan markah sementara { noKP: markah }
  const [msg, setMsg] = useState('');

  // 1. Tarik Senarai Semua Pelajar
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

  // 2. Fungsi Simpan Markah (Boleh simpan satu-satu atau semua sekaligus)
  const handleSimpan = async (noKP) => {
    const markah = markahInput[noKP];
    if (!markah && markah !== 0) {
      alert("Sila masukkan markah dahulu.");
      return;
    }

    setMsg('Menyimpan...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      
	  // Di bahagian handleSimpan
body: JSON.stringify({
  action: 'simpanMarkah',
  username: user.username,
  noKP: noKP,
  kodSubjek: user.tugasanKhas, // <--- TUKAR INI
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
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h2 className="text-xl font-bold text-orange-800">Dashboard Guru Subjek</h2>
        // Di bahagian Header
<p className="text-sm text-orange-600">
  Subjek Anda: <strong>{user.tugasanKhas}</strong> | Jumlah Pelajar: {pelajarList.length}
</p>
      </div>

      {/* Senarai Pelajar & Input Markah */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📝 Senarai Markah ({user.tugasKhas})</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 rounded-tl-lg">No. KP</th>
                <th className="p-3">Nama Pelajar</th>
                <th className="p-3">Kelas</th>
                <th className="p-3 rounded-tr-lg">Markah</th>
              </tr>
            </thead>
            <tbody>
              {pelajarList.map((p, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{p.noKP}</td>
                  <td className="p-3 font-medium">{p.nama}</td>
                  <td className="p-3 text-sm text-gray-500">{p.kelas}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number" 
                        min="0" max="100"
                        placeholder="0-100"
                        value={markahInput[p.noKP] || ''}
                        onChange={(e) => setMarkahInput({...markahInput, [p.noKP]: e.target.value})}
                        className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      <button 
                        onClick={() => handleSimpan(p.noKP)}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-2 rounded transition"
                      >
                        Simpan
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {msg && <p className="mt-4 text-center text-green-600 font-medium">{msg}</p>}
      </div>
    </div>
  );
}