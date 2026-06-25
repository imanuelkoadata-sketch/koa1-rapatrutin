import { useState, useEffect } from 'react';

export default function WakilBendahara({ kasKeuangan, setKasKeuangan, kendalainfosWabend, setKendalainfosWabend, handleSimpan }) {
  const mataJemaatList = ['Imanuel Koa', 'Syalom Haususu'];
  const [activeMj, setActiveMj] = useState(mataJemaatList[0]);

  // ==========================================
  // MIGRATION & SAFETY (Mengubah format lama menjadi object Mata Jemaat)
  // ==========================================
  useEffect(() => {
    if (!kasKeuangan) return;
    
    // Deteksi jika ini adalah struktur lama {lalu: 0, terima: 0...}
    if (kasKeuangan.lalu !== undefined || kasKeuangan.terima !== undefined) {
      setKasKeuangan({
        [mataJemaatList[0]]: { lalu: kasKeuangan.lalu || 0, terima: kasKeuangan.terima || 0, keluar: kasKeuangan.keluar || 0, sisa: kasKeuangan.sisa || 0 },
        [mataJemaatList[1]]: { lalu: 0, terima: 0, keluar: 0, sisa: 0 }
      });
    } else {
       // Pastikan setiap mata jemaat punya tempat objeknya
       let updated = false;
       const newKas = { ...kasKeuangan };
       mataJemaatList.forEach(mj => {
          if (!newKas[mj]) {
             newKas[mj] = { lalu: 0, terima: 0, keluar: 0, sisa: 0 };
             updated = true;
          }
       });
       if (updated) setKasKeuangan(newKas);
    }
  }, [kasKeuangan, setKasKeuangan]);

  const activeKas = kasKeuangan?.[activeMj] || { lalu: 0, terima: 0, keluar: 0, sisa: 0 };

  const handleChange = (field, value) => {
    const val = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    const newActiveKas = { ...activeKas, [field]: val };
    newActiveKas.sisa = newActiveKas.lalu + newActiveKas.terima - newActiveKas.keluar;

    setKasKeuangan({ ...kasKeuangan, [activeMj]: newActiveKas });
  };

  const formatRupiah = (angka) => angka === 0 ? '' : angka.toLocaleString('id-ID');

  const ensureObjectList = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map((item, idx) => typeof item === 'string' ? { id: Date.now() + idx, mataJemaat: activeMj, text: item } : item);
  };
  const listKendala = ensureObjectList(kendalainfosWabend);
  const currentKendala = listKendala.filter(k => k.mataJemaat === activeMj);

  const addKendala = () => setKendalainfosWabend([...listKendala, { id: Date.now() + Math.random(), mataJemaat: activeMj, text: '' }]);
  const updateKendala = (id, text) => setKendalainfosWabend(listKendala.map(item => item.id === id ? { ...item, text } : item));
  const removeKendala = (id) => setKendalainfosWabend(listKendala.filter(item => item.id !== id));
  const handleEnterKendala = (e) => { if (e.key === 'Enter') { e.preventDefault(); addKendala(); } };

  return (
    <div className="space-y-8">

      <div className="w-full md:w-1/3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <label className="block text-sm font-bold text-blue-800 mb-2">Pilih Form Mata Jemaat</label>
        <select value={activeMj} onChange={(e) => setActiveMj(e.target.value)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-md focus:ring-blue-500 font-bold text-gray-700">
          {mataJemaatList.map((mj) => <option key={mj} value={mj}>{mj}</option>)}
        </select>
        <p className="text-xs text-blue-600 mt-2">Data keuangan di bawah ini hanya untuk <strong>{activeMj}</strong>.</p>
      </div>

      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Laporan Keuangan Bulanan - {activeMj}</h3>
        
        <div className="space-y-4 max-w-lg">
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Saldo Bulan Lalu (Rp)</label><input type="text" value={formatRupiah(activeKas.lalu)} onChange={(e) => handleChange('lalu', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500" placeholder="0" /></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Penerimaan Bulan Ini (Rp)</label><input type="text" value={formatRupiah(activeKas.terima)} onChange={(e) => handleChange('terima', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500" placeholder="0" /></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Pengeluaran Bulan Ini (Rp)</label><input type="text" value={formatRupiah(activeKas.keluar)} onChange={(e) => handleChange('keluar', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500" placeholder="0" /></div>
          
          <div className="pt-4 border-t border-gray-300 mt-6">
            <label className="block text-sm font-bold text-gray-700 mb-1">Sisa Saldo (Dihitung Otomatis)</label>
            <input type="text" value={`Rp ${activeKas.sisa.toLocaleString('id-ID')}`} readOnly className="w-full px-4 py-3 border border-blue-200 rounded-md bg-blue-50 font-bold text-blue-800 text-lg" placeholder="0" />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Kendala / Informasi Lainnya - {activeMj}</h3>
        <div className="space-y-2">
          {currentKendala.map((kendala, index) => (
            <div key={kendala.id} className="flex items-start gap-2">
              <span className="mt-2 text-sm font-bold text-gray-500 w-6 text-right">{index + 1}.</span>
              <input type="text" value={kendala.text || ''} onChange={(e) => updateKendala(kendala.id, e.target.value)} onKeyDown={handleEnterKendala} placeholder="Ketik kendala..." className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <button onClick={() => removeKendala(kendala.id)} className="text-red-500 mt-1 p-1">Hapus</button>
            </div>
          ))}
          <button onClick={addKendala} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Tambah Kendala</button>
        </div>
      </section>

      <div className="pt-4 flex justify-end">
        <button onClick={handleSimpan} className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-bold shadow-md transition-transform hover:scale-105">
          Simpan Laporan Wak. Bendahara
        </button>
      </div>
    </div>
  );
}