import { useState } from 'react';

export default function LaporanRutin() {
  const mataJemaatList = ['Imanuel Koa', 'Syalom Haususu'];
  const [laporanRutin, setLaporanRutin] = useState([{ id: Date.now(), program: '', uraian: '' }]);

  const tambahBaris = () => setLaporanRutin([...laporanRutin, { id: Date.now(), program: '', uraian: '' }]);
  const hapusBaris = (id) => setLaporanRutin(laporanRutin.filter(item => item.id !== id));
  const updateBaris = (id, field, value) => {
    setLaporanRutin(laporanRutin.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="space-y-6">
      <div className="w-full md:w-1/3">
        <label className="block text-sm font-bold text-gray-700 mb-2">Mata Jemaat</label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 bg-gray-50">
          <option value="">-- Pilih Mata Jemaat --</option>
          {mataJemaatList.map((mj) => <option key={mj} value={mj}>{mj}</option>)}
        </select>
      </div>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Laporan Rutin (Program Tahunan)</h3>
        <div className="space-y-3">
          {laporanRutin.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-2">
              <input type="text" placeholder="Nama Program Pelayanan..." value={item.program} onChange={(e) => updateBaris(item.id, 'program', e.target.value)} className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium" />
              <input type="text" placeholder="Uraian evaluasi program..." value={item.uraian} onChange={(e) => updateBaris(item.id, 'uraian', e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
              {laporanRutin.length > 1 && (<button onClick={() => hapusBaris(item.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-md shrink-0">Hapus</button>)}
            </div>
          ))}
          <button onClick={tambahBaris} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Tambah Program</button>
        </div>
      </section>
      
      <div className="pt-4 flex justify-end">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-bold shadow-md transition-transform hover:scale-105">Simpan Laporan Rutin</button>
      </div>
    </div>
  );
}