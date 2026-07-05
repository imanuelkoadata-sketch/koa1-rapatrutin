import React from 'react';

export default function WarnaSari({ warnaSariList, setWarnaSariList }) {

  // Mengubah struktur default item untuk mendukung array 'pembahasanWarnaSari'
  const tambahTopik = () => {
    setWarnaSariList([...warnaSariList, { 
      id: Date.now(), 
      judulWarnaSari: '', 
      pembahasanWarnaSari: [{ id: Date.now() + 1, teks: '' }], 
      keputusan: '' 
    }]);
  };

  const hapusTopik = (id) => setWarnaSariList(warnaSariList.filter(item => item.id !== id));
  
  const updateTopik = (id, field, value) => {
    setWarnaSariList(warnaSariList.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // --- Fungsi untuk Rincian Pembahasan Warna Sari Dinamis ---
  const tambahRincian = (topikId) => {
    setWarnaSariList(warnaSariList.map(item => {
      if (item.id === topikId) {
        return { ...item, pembahasanWarnaSari: [...(item.pembahasanWarnaSari || []), { id: Date.now(), teks: '' }] };
      }
      return item;
    }));
  };

  const updateRincian = (topikId, rincianId, teksBaru) => {
    setWarnaSariList(warnaSariList.map(item => {
      if (item.id === topikId) {
        return {
          ...item,
          pembahasanWarnaSari: item.pembahasanWarnaSari.map(r => r.id === rincianId ? { ...r, teks: teksBaru } : r)
        };
      }
      return item;
    }));
  };

  const hapusRincian = (topikId, rincianId) => {
    setWarnaSariList(warnaSariList.map(item => {
      if (item.id === topikId) {
        return {
          ...item,
          pembahasanWarnaSari: item.pembahasanWarnaSari.filter(r => r.id !== rincianId)
        };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-6">
      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Catatan Warna Sari</h3>
        
        <div className="space-y-6">
          {warnaSariList.map((item, index) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-3 bg-white p-4 border rounded-md shadow-sm items-start relative pb-10">
              <span className="font-bold text-gray-400 w-6 mt-2">{index + 1}.</span>
              
              <div className="flex-1 w-full space-y-4">
                {/* 1. INPUT JUDUL WARNA SARI */}
                <div>
                  <label className="block text-xs font-bold text-purple-700 mb-1">Judul Warna Sari</label>
                  <input type="text" value={item.judulWarnaSari || ''} onChange={(e) => updateTopik(item.id, 'judulWarnaSari', e.target.value)} placeholder="Contoh: Laporan Atap Bocor" className="w-full px-3 py-2 border-2 border-purple-100 rounded-md text-sm font-bold focus:border-purple-500" />
                </div>
                
                {/* 2. INPUT PEMBAHASAN WARNA SARI (DINAMIS) */}
                <div className="pl-4 border-l-2 border-gray-200">
                  <label className="block text-xs font-bold text-gray-500 mb-2">Rincian Pembahasan</label>
                  {Array.isArray(item.pembahasanWarnaSari) ? item.pembahasanWarnaSari.map((rincian, rIdx) => (
                    <div key={rincian.id} className="flex gap-2 mb-2">
                       <span className="text-gray-400 text-xs mt-2">-</span>
                       <input type="text" value={rincian.teks} onChange={(e) => updateRincian(item.id, rincian.id, e.target.value)} placeholder="Ketik rincian warna sari..." className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 focus:bg-white" />
                       {item.pembahasanWarnaSari.length > 1 && (
                         <button onClick={() => hapusRincian(item.id, rincian.id)} className="text-red-400 text-xs hover:text-red-600 px-2">Hapus</button>
                       )}
                    </div>
                  )) : null}
                  <button onClick={() => tambahRincian(item.id)} className="text-xs text-purple-500 hover:underline mt-1">+ Tambah Rincian</button>
                </div>

                {/* 3. INPUT KEPUTUSAN */}
                <div>
                  <label className="block text-xs font-bold text-green-700 mb-1">Tindak Lanjut / Keputusan</label>
                  <input type="text" value={item.keputusan} onChange={(e) => updateTopik(item.id, 'keputusan', e.target.value)} placeholder="Hasil tindak lanjut..." className="w-full px-3 py-2 border-2 border-green-100 rounded-md text-sm focus:border-green-500 bg-green-50" />
                </div>
              </div>

              {warnaSariList.length > 1 && (
                <button onClick={() => hapusTopik(item.id)} className="absolute bottom-3 right-4 text-red-500 hover:bg-red-50 px-3 py-1 rounded-md text-xs font-bold">Hapus Topik Ini</button>
              )}
            </div>
          ))}
          <button onClick={tambahTopik} className="mt-4 text-sm text-purple-600 font-bold hover:underline bg-purple-50 px-4 py-2 rounded-md border border-purple-100 block w-full text-center">+ Tambah Catatan Warna Sari Baru</button>
        </div>
      </section>
    </div>
  );
}