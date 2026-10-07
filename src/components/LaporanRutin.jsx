import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; 

export default function LaporanRutin({ laporanRutin, setLaporanRutin, periodeBulan }) {
  const mataJemaatList = ['Imanuel Koa', 'Syalom Haususu'];
  const [activeMj, setActiveMj] = useState(mataJemaatList[0]);
  
  // Baca data langsung dari App.jsx (props)
  const currentList = laporanRutin?.[activeMj] || [];

  const tambahBaris = () => {
    setLaporanRutin(prev => ({
      ...prev,
      [activeMj]: [...(prev[activeMj] || []), { id: Date.now(), program: '', uraian: '' }]
    }));
  };

  const hapusBaris = (id) => {
    setLaporanRutin(prev => ({
      ...prev,
      [activeMj]: prev[activeMj].filter(item => item.id !== id)
    }));
  };

  const updateBaris = (id, field, value) => {
    setLaporanRutin(prev => ({
      ...prev,
      [activeMj]: prev[activeMj].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleSimpan = async () => {
    // Validasi pencegahan error jika periodeBulan belum ter-load
    if (!periodeBulan) {
      alert("Tunggu sebentar, sedang memuat periode laporan...");
      return;
    }

    try {
      const docRef = doc(db, "laporan_evaluasi", periodeBulan); 
      
      // Simpan menggunakan setDoc merge agar tidak menghapus tab/data lain
      await setDoc(docRef, {
        laporanRutin: laporanRutin 
      }, { merge: true });
      
      alert(`Data Laporan Rutin ${activeMj} berhasil disimpan ke Cloud!`);
    } catch (error) {
      console.error("Gagal menyimpan Laporan Rutin:", error);
      alert("Terjadi kesalahan saat menyimpan data ke Firestore.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="w-full md:w-1/3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <label className="block text-sm font-bold text-blue-800 mb-2">Pilih Form Mata Jemaat</label>
        <select 
          value={activeMj} 
          onChange={(e) => setActiveMj(e.target.value)} 
          className="w-full px-3 py-2 border-2 border-blue-300 rounded-md focus:ring-blue-500 font-bold text-gray-700 bg-white"
        >
          {mataJemaatList.map((mj) => <option key={mj} value={mj}>{mj}</option>)}
        </select>
        <p className="text-xs text-blue-600 mt-2">Data laporan di bawah ini hanya untuk <strong>{activeMj}</strong>.</p>
      </div>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Laporan Rutin (Program Tahunan) - {activeMj}</h3>
        <div className="space-y-3">
          {currentList.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-2">
              <input type="text" placeholder="Nama Program Pelayanan..." value={item.program} onChange={(e) => updateBaris(item.id, 'program', e.target.value)} className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium" />
              <input type="text" placeholder="Uraian evaluasi program..." value={item.uraian} onChange={(e) => updateBaris(item.id, 'uraian', e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
              {currentList.length > 1 && (<button onClick={() => hapusBaris(item.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-md shrink-0">Hapus</button>)}
            </div>
          ))}
          <button onClick={tambahBaris} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Tambah Program</button>
        </div>
      </section>
      
      <div className="pt-4 flex justify-end">
        <button onClick={handleSimpan} className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-bold shadow-md transition-transform hover:scale-105">Simpan Laporan Rutin</button>
      </div>
    </div>
  );
}