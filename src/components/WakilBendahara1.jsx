import { useState, useEffect } from 'react';

export default function WakilBendahara1({
  saldoLaluNatura, setSaldoLaluNatura, penerimaanNatura, setPenerimaanNatura,
  pengeluaranNatura, setPengeluaranNatura, sisaSaldoNatura, setSisaSaldoNatura,
  kendalainfosWabend1, setKendalainfosWabend1, handleSimpan
}) {
  const mataJemaatList = ['Imanuel Koa', 'Syalom Haususu'];
  const [activeMj, setActiveMj] = useState(mataJemaatList[0]);

  // ==========================================
  // PENGAMANAN & MIGRASI DATA LAMA
  // ==========================================
  const migrateList = (list) => {
      if (!Array.isArray(list)) return [];
      return list.map(item => !item.mataJemaat ? { ...item, mataJemaat: mataJemaatList[0] } : item);
  };

  const safeSaldoLalu = migrateList(saldoLaluNatura);
  const safeTerima = migrateList(penerimaanNatura);
  const safeKeluar = migrateList(pengeluaranNatura);
  const safeSisa = migrateList(sisaSaldoNatura);

  const ensureObjectList = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map((item, idx) => typeof item === 'string' ? { id: Date.now() + idx, mataJemaat: activeMj, text: item } : item);
  };
  const listKendala = ensureObjectList(kendalainfosWabend1);

  useEffect(() => {
      if (Array.isArray(saldoLaluNatura) && saldoLaluNatura.some(i => !i.mataJemaat)) setSaldoLaluNatura(safeSaldoLalu);
      if (Array.isArray(penerimaanNatura) && penerimaanNatura.some(i => !i.mataJemaat)) setPenerimaanNatura(safeTerima);
      if (Array.isArray(pengeluaranNatura) && pengeluaranNatura.some(i => !i.mataJemaat)) setPengeluaranNatura(safeKeluar);
      if (Array.isArray(sisaSaldoNatura) && sisaSaldoNatura.some(i => !i.mataJemaat)) setSisaSaldoNatura(safeSisa);
  }, []);

  const getEmptyRow = () => ({ id: Date.now() + Math.random(), uraian: '', jumlah: '', satuan: '', mataJemaat: activeMj });
  const tambahBaris = (setList, list) => setList([...list, getEmptyRow()]);
  const hapusBaris = (setList, list, id) => setList(list.filter(item => item.id !== id));
  const updateBaris = (setList, list, id, field, value) => setList(list.map(item => item.id === id ? { ...item, [field]: value } : item));

  const addKendala = () => setKendalainfosWabend1([...listKendala, { id: Date.now() + Math.random(), mataJemaat: activeMj, text: '' }]);
  const updateKendala = (id, text) => setKendalainfosWabend1(listKendala.map(item => item.id === id ? { ...item, text } : item));
  const removeKendala = (id) => setKendalainfosWabend1(listKendala.filter(item => item.id !== id));
  const handleEnterKendala = (e) => { if (e.key === 'Enter') { e.preventDefault(); addKendala(); } };

  // Komponen Helper untuk Tabel Natura
  const RenderNaturaList = ({ title, fullList, setList, theme }) => {
    const currentList = fullList.filter(item => item.mataJemaat === activeMj);
    return (
      <div className={`p-4 rounded-lg border ${theme}`}>
        <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">{title}</h4>
        <div className="space-y-2">
          <div className="hidden md:flex gap-2 mb-1 px-1">
            <div className="w-8 text-center text-xs font-bold text-gray-500">No</div>
            <div className="flex-1 text-xs font-bold text-gray-500">Uraian / Nama Barang</div>
            <div className="w-24 text-xs font-bold text-gray-500">Jumlah</div>
            <div className="w-32 text-xs font-bold text-gray-500">Satuan</div>
            <div className="w-16"></div>
          </div>
          {currentList.map((item, index) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-2 bg-white md:bg-transparent p-3 md:p-0 rounded border md:border-none shadow-sm md:shadow-none">
              <div className="hidden md:flex w-8 items-center justify-center text-sm font-bold text-gray-400">{index + 1}</div>
              <input type="text" placeholder="Cth: Padi, Ayam" value={item.uraian} onChange={(e) => updateBaris(setList, fullList, item.id, 'uraian', e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <div className="flex gap-2">
                <input type="number" placeholder="Jml" value={item.jumlah} onChange={(e) => updateBaris(setList, fullList, item.id, 'jumlah', e.target.value)} className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm" />
                <input type="text" placeholder="Cth: Krg, Ekor" value={item.satuan} onChange={(e) => updateBaris(setList, fullList, item.id, 'satuan', e.target.value)} className="w-28 px-3 py-2 border border-gray-300 rounded-md text-sm" />
                <button onClick={() => hapusBaris(setList, fullList, item.id)} className="w-16 text-red-500 hover:bg-red-100 p-2 rounded-md text-sm shrink-0">Hapus</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => tambahBaris(setList, fullList)} className="mt-3 text-sm text-blue-600 font-bold hover:underline">+ Tambah Barang</button>
      </div>
    );
  };

  return (
    <div className="space-y-10">

      <div className="w-full md:w-1/3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <label className="block text-sm font-bold text-blue-800 mb-2">Pilih Form Mata Jemaat</label>
        <select value={activeMj} onChange={(e) => setActiveMj(e.target.value)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-md focus:ring-blue-500 font-bold text-gray-700">
          {mataJemaatList.map((mj) => <option key={mj} value={mj}>{mj}</option>)}
        </select>
        <p className="text-xs text-blue-600 mt-2">Data barang natura di bawah ini hanya untuk <strong>{activeMj}</strong>.</p>
      </div>

      <section className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Laporan Keuangan (Natura / Barang) - {activeMj}</h3>
        <div className="space-y-6">
          <RenderNaturaList title="1. Saldo Natura Bulan Lalu" fullList={safeSaldoLalu} setList={setSaldoLaluNatura} theme="bg-white border-gray-200" />
          <RenderNaturaList title="2. Pemasukan Natura Bulan Ini" fullList={safeTerima} setList={setPenerimaanNatura} theme="bg-blue-50 border-blue-100" />
          <RenderNaturaList title="3. Pengeluaran Natura Bulan Ini" fullList={safeKeluar} setList={setPengeluaranNatura} theme="bg-red-50 border-red-100" />
          <RenderNaturaList title="4. Saldo Natura Bulan Ini (Sisa)" fullList={safeSisa} setList={setSisaSaldoNatura} theme="bg-green-50 border-green-200 shadow-inner" />
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Kendala / Informasi Lainnya - {activeMj}</h3>
        <div className="space-y-2">
          {listKendala.filter(k => k.mataJemaat === activeMj).map((kendala, index) => (
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
          Simpan Laporan Wak. Bendahara 1
        </button>
      </div>
    </div>
  );
}