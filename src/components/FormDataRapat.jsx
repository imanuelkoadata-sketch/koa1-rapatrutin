import React from 'react';

export default function FormDataRapat({ 
  tanggalRapat, setTanggalRapat, tempatRapat, setTempatRapat,
  pelayanPA, setPelayanPA, bacaanPA, setBacaanPA, temaPA, setTemaPA,
  kehadiranMajelis, setKehadiranMajelis
}) {
  
  const toggleHadir = (id) => {
    setKehadiranMajelis(kehadiranMajelis.map(m => m.id === id ? { ...m, hadir: !m.hadir } : m));
  };

  return (
    <div className="space-y-8">
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-2">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Informasi Rapat Bulanan</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Hari & Tanggal Rapat</label>
            <input type="date" value={tanggalRapat} onChange={(e) => setTanggalRapat(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tempat Pelaksanaan (Nama Jalan / Jemaat)</label>
            <input type="text" placeholder="Contoh: Mollo Barat" value={tempatRapat} onChange={(e) => setTempatRapat(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 border rounded-md shadow-sm space-y-4">
          <h4 className="font-bold text-gray-700 border-b pb-2">Ibadah PA Sebelum Rapat</h4>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Yang Memimpin</label>
            <input type="text" value={pelayanPA} onChange={(e) => setPelayanPA(e.target.value)} placeholder="Nama Pelayan Firman" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Bahan PA (Pembacaan)</label>
            <input type="text" value={bacaanPA} onChange={(e) => setBacaanPA(e.target.value)} placeholder="Contoh: Kejadian 1:1-31" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Tema PA</label>
            <input type="text" value={temaPA} onChange={(e) => setTemaPA(e.target.value)} placeholder="Masukkan tema PA..." className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Kehadiran Penatua / MJH</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {kehadiranMajelis.map((majelis) => (
            <label key={majelis.id} className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${majelis.hadir ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
              <input type="checkbox" checked={majelis.hadir} onChange={() => toggleHadir(majelis.id)} className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className={`text-sm font-medium ${majelis.hadir ? 'text-blue-800' : 'text-gray-600'}`}>{majelis.nama}</span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}