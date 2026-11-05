import React from 'react';

export default function SlipKeputusan({ data }) {
  if (!data) return null;

  const { maklumatPelajar, ringkasan, keputusan } = data;
  const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="bg-white p-8 text-black font-serif" style={{ maxWidth: '210mm', margin: '0 auto' }}>
      {/* Header Sekolah */}
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <div className="text-4xl mb-2">🕌</div>
        <h1 className="text-2xl font-bold uppercase">Madrasah Al-Falah</h1>
        <p className="text-sm">No. 123, Jalan Pendidikan, 43000 Kajang, Selangor</p>
        <p className="text-sm">Tel: 03-1234 5678 | Emel: admin@alfalah.edu.my</p>
        <h2 className="text-xl font-bold mt-4 uppercase underline">Slip Keputusan Peperiksaan Akhir Tahun 2026</h2>
      </div>

      {/* Maklumat Pelajar */}
      <div className="mb-6 text-sm">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-32 font-bold">Nama Pelajar</td>
              <td>: {maklumatPelajar.nama}</td>
              <td className="w-32 font-bold">No. Kad Pengenalan</td>
              <td>: {maklumatPelajar.noKP}</td>
            </tr>
            <tr>
              <td className="font-bold">Kelas</td>
              <td>: {maklumatPelajar.kelas}</td>
              <td className="font-bold">Tahun</td>
              <td>: 2026</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Jadual Keputusan */}
      <table className="w-full border-collapse border border-black text-sm mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-black p-2 w-10">Bil.</th>
            <th className="border border-black p-2 text-left">Mata Pelajaran</th>
            <th className="border border-black p-2 w-20">Markah</th>
            <th className="border border-black p-2 w-20">Gred</th>
            <th className="border border-black p-2 w-20">PNG</th>
          </tr>
        </thead>
        <tbody>
          {keputusan.map((subjek, index) => (
            <tr key={index}>
              <td className="border border-black p-2 text-center">{index + 1}</td>
              <td className="border border-black p-2">{subjek.namaSubjek}</td>
              <td className="border border-black p-2 text-center">{subjek.markah}</td>
              <td className="border border-black p-2 text-center font-bold">{subjek.gred}</td>
              <td className="border border-black p-2 text-center">{Number(subjek.png).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ringkasan Keputusan */}
      <div className="border-2 border-black p-4 mb-8 flex justify-between items-center bg-gray-50">
        <div>
          <p className="font-bold text-lg">Purata Markah: {ringkasan.purataMarkah}%</p>
          <p className="font-bold text-lg">PNG Keseluruhan: {ringkasan.purataPNG}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold uppercase">Keputusan Keseluruhan</p>
          <p className="text-2xl font-bold text-green-700">
            {ringkasan.purataPNG >= 2.00 ? 'LULUS' : 'GAGAL'}
          </p>
        </div>
      </div>

      {/* Ruangan Tandatangan */}
      <div className="flex justify-between mt-12 text-sm">
        <div className="text-center w-1/3">
          <p className="mb-16">_________________________</p>
          <p className="font-bold">Tandatangan Ibu Bapa / Penjaga</p>
          <p>Tarikh: {tarikhCetak}</p>
        </div>
        <div className="text-center w-1/3">
          <p className="mb-16">_________________________</p>
          <p className="font-bold">Tandatangan Guru Besar</p>
          <p>(Ustaz Ahmad Bin Abdullah)</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs mt-8 border-t pt-2 text-gray-500">
        <p>Dokumen ini dijana secara automatik oleh Sistem Keputusan Peperiksaan Digital.</p>
      </div>
    </div>
  );
}