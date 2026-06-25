import { useEffect, useState } from 'react';

export default function WakilSekretaris({ 
  kategoriPelayananList = [], 
  bulanLaporan, kehadiranJemaat, setKehadiranJemaat, realisasiPelayanan, setRealisasiPelayanan,
  persembahanWasek, setPersembahanWasek, pelayananKhusus, setPelayananKhusus, kendalainfosWasek, setKendalainfosWasek,
  handleSimpan
}) {
  const mataJemaatList = ['Imanuel Koa', 'Syalom Haususu'];
  const [activeMj, setActiveMj] = useState(mataJemaatList[0]);

  const listKehadiran = Array.isArray(kehadiranJemaat) ? kehadiranJemaat : [];
  const listRealisasi = Array.isArray(realisasiPelayanan) ? realisasiPelayanan : [];
  const listPersembahan = Array.isArray(persembahanWasek) ? persembahanWasek : [];
  const listPelayanan = Array.isArray(pelayananKhusus) ? pelayananKhusus : [];

  const ensureObjectList = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map((item, idx) => typeof item === 'string' ? { id: Date.now() + idx, mataJemaat: activeMj, text: item } : item);
  };
  const listKendala = ensureObjectList(kendalainfosWasek);

  // ==========================================
  // AUTO-SYNC "SAPU BERSIH": Sinkronisasi Ketat dengan Konfigurasi
  // ==========================================
  useEffect(() => {
    if (!kategoriPelayananList || kategoriPelayananList.length === 0) return;

    // 1. Buat ulang daftar sesuai persis dengan Konfigurasi Master
    const syncedRealisasi = kategoriPelayananList.map(kat => {
      // Ambil nilai target & realisasi lama jika namanya masih sama
      const existing = listRealisasi.find(r => r.nama === kat.nama && r.mataJemaat === kat.mataJemaat);
      return existing ? existing : {
        id: Date.now() + Math.random(),
        nama: kat.nama,
        target: '',
        realisasi: '',
        mataJemaat: kat.mataJemaat
      };
    });

    // 2. Cek apakah ada "Data Hantu" (ada di form tapi sudah dihapus di konfigurasi)
    const hasGhostData = listRealisasi.some(r => !kategoriPelayananList.find(kat => kat.nama === r.nama && kat.mataJemaat === r.mataJemaat));
    const hasNewData = syncedRealisasi.length !== listRealisasi.length;

    // 3. Hanya perbarui state jika memang ada perubahan susunan
    if (hasGhostData || hasNewData) {
      setRealisasiPelayanan(syncedRealisasi);
    }
  }, [kategoriPelayananList, listRealisasi, setRealisasiPelayanan]);

  // ==========================================
  // FILTER & SORTIR MENURUN
  // ==========================================
  const currentKehadiran = listKehadiran.filter(k => k.mataJemaat === activeMj);
  
  const currentRealisasi = listRealisasi
    .filter(r => r.mataJemaat === activeMj)
    .sort((a, b) => {
      const nameA = a.nama.toLowerCase();
      const nameB = b.nama.toLowerCase();
      const isRayonA = nameA.includes('rayon');
      const isRayonB = nameB.includes('rayon');

      // Rayon diprioritaskan di atas
      if (isRayonA && !isRayonB) return -1;
      if (!isRayonA && isRayonB) return 1;

      // Ekstrak angka agar Rayon 2 tetap di atas Rayon 10
      const numA = parseInt(nameA.match(/\d+/)?.[0] || 0);
      const numB = parseInt(nameB.match(/\d+/)?.[0] || 0);
      
      if (isRayonA && isRayonB && numA !== numB) {
          return numA - numB;
      }

      // Sisanya (Bapak, Pemuda, Perempuan) diurutkan sesuai abjad A-Z
      return a.nama.localeCompare(b.nama);
    });

  const currentPersembahan = listPersembahan.filter(p => p.mataJemaat === activeMj);
  const currentPelayanan = listPelayanan.filter(p => p.mataJemaat === activeMj);
  const currentKendala = listKendala.filter(k => k.mataJemaat === activeMj);

  useEffect(() => {
    if (!bulanLaporan) return;
    if (currentKehadiran.length > 0 && currentKehadiran[0].nama !== '') return;

    const [yearStr, monthStr] = bulanLaporan.split('-');
    let year = parseInt(yearStr);
    let prevMonth = parseInt(monthStr) - 1; 
    if (prevMonth === 0) { prevMonth = 12; year -= 1; }

    const sundays = [];
    let d = new Date(year, prevMonth - 1, 1);
    while (d.getMonth() === prevMonth - 1) {
      if (d.getDay() === 0) sundays.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }

    const autoKehadiran = sundays.map((sun, index) => {
      const tgl = sun.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
      return { id: Date.now() + index + Math.random(), nama: `Minggu ${index + 1} (${tgl})`, laki: '', perempuan: '', tidakTercatat: false, mataJemaat: activeMj };
    });

    const dataMjLain = listKehadiran.filter(k => k.mataJemaat !== activeMj);
    setKehadiranJemaat([...dataMjLain, ...autoKehadiran]);
  }, [bulanLaporan, activeMj]);

  const updateKehadiran = (id, field, value) => {
    setKehadiranJemaat(listKehadiran.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'tidakTercatat' && value === true) { updatedItem.laki = ''; updatedItem.perempuan = ''; }
        return updatedItem;
      }
      return item;
    }));
  };
  const hapusKehadiran = (id) => setKehadiranJemaat(listKehadiran.filter(item => item.id !== id));
  const tambahKehadiran = () => setKehadiranJemaat([...listKehadiran, { id: Date.now(), nama: '', laki: '', perempuan: '', tidakTercatat: false, mataJemaat: activeMj }]);

  const updateRealisasi = (id, field, value) => setRealisasiPelayanan(listRealisasi.map(r => r.id === id ? { ...r, [field]: value } : r));
  
  const updatePersembahan = (id, field, value) => setPersembahanWasek(listPersembahan.map(p => p.id === id ? { ...p, [field]: value } : p));
  const hapusPersembahan = (id) => setPersembahanWasek(listPersembahan.filter(p => p.id !== id));
  const tambahPersembahan = () => setPersembahanWasek([...listPersembahan, { id: Date.now(), tanggal: '', pemberi: '', jenis: '', mataJemaat: activeMj }]);

  const updatePelayanan = (id, field, value) => setPelayananKhusus(listPelayanan.map(p => p.id === id ? { ...p, [field]: value } : p));
  const hapusPelayanan = (id) => setPelayananKhusus(listPelayanan.filter(p => p.id !== id));
  const tambahPelayanan = () => setPelayananKhusus([...listPelayanan, { id: Date.now(), tanggal: '', jenis: '', mataJemaat: activeMj }]);

  const addKendala = () => setKendalainfosWasek([...listKendala, { id: Date.now() + Math.random(), mataJemaat: activeMj, text: '' }]);
  const updateKendala = (id, text) => setKendalainfosWasek(listKendala.map(item => item.id === id ? { ...item, text } : item));
  const removeKendala = (id) => setKendalainfosWasek(listKendala.filter(item => item.id !== id));
  const handleEnterKendala = (e) => { if (e.key === 'Enter') { e.preventDefault(); addKendala(); } };

  return (
    <div className="space-y-10">
      
      <div className="w-full md:w-1/3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <label className="block text-sm font-bold text-blue-800 mb-2">Pilih Form Mata Jemaat</label>
        <select value={activeMj} onChange={(e) => setActiveMj(e.target.value)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-md focus:ring-blue-500 font-bold text-gray-700">
          {mataJemaatList.map((mj) => <option key={mj} value={mj}>{mj}</option>)}
        </select>
        <p className="text-xs text-blue-600 mt-2">Data yang diisi di bawah ini hanya untuk <strong>{activeMj}</strong>.</p>
      </div>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">A. Kehadiran Jemaat (Bulan Lalu) - {activeMj}</h3>
        <div className="space-y-3">
          {currentKehadiran.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-white p-3 border rounded-md shadow-sm">
              <div className="w-full md:w-1/3">
                <label className="block text-xs text-gray-500 mb-1">Nama Kebaktian / Tgl</label>
                <input type="text" value={item.nama} onChange={(e) => updateKehadiran(item.id, 'nama', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium" />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2 w-full">
                <div><label className="block text-xs text-gray-500 mb-1">Laki-laki</label><input type="number" value={item.laki} onChange={(e) => updateKehadiran(item.id, 'laki', e.target.value)} disabled={item.tidakTercatat} className="w-full border p-2 rounded-md text-sm disabled:bg-gray-100 disabled:text-gray-400" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Perempuan</label><input type="number" value={item.perempuan} onChange={(e) => updateKehadiran(item.id, 'perempuan', e.target.value)} disabled={item.tidakTercatat} className="w-full border p-2 rounded-md text-sm disabled:bg-gray-100 disabled:text-gray-400" /></div>
              </div>
              <div className="flex flex-col items-center justify-center shrink-0 w-24">
                <label className="block text-xs text-gray-500 mb-2 cursor-pointer">Tdk Tercatat</label>
                <input type="checkbox" checked={item.tidakTercatat} onChange={(e) => updateKehadiran(item.id, 'tidakTercatat', e.target.checked)} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" />
              </div>
              <button onClick={() => hapusKehadiran(item.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-md shrink-0 mt-4 md:mt-0 self-end md:self-center">Hapus</button>
            </div>
          ))}
          <button onClick={tambahKehadiran} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Tambah Kebaktian</button>
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">B. Realisasi Pelayanan - {activeMj}</h3>
        
        {currentRealisasi.length > 0 ? (
          /* DIUBAH: Menggunakan flex-col agar menurun satu kolom ke bawah */
          <div className="flex flex-col space-y-3">
            {currentRealisasi.map((item) => (
              <div key={item.id} className="flex flex-col xl:flex-row items-start xl:items-center justify-between bg-white p-3 border rounded-md shadow-sm gap-2">
                <p className="font-bold text-sm text-gray-700 w-full xl:w-auto">{item.nama}</p>
                <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
                  <div className="flex items-center gap-1"><label className="text-xs font-medium text-gray-500">Target:</label><input type="number" value={item.target} onChange={(e) => updateRealisasi(item.id, 'target', e.target.value)} placeholder="0" className="w-16 border p-1 rounded text-center text-sm" /></div>
                  <div className="flex items-center gap-1"><label className="text-xs font-medium text-gray-500">Realisasi:</label><input type="number" value={item.realisasi} onChange={(e) => updateRealisasi(item.id, 'realisasi', e.target.value)} placeholder="0" className="w-16 border p-1 rounded text-center text-sm" /></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic p-4 text-center border rounded bg-white">Belum ada daftar rayon untuk mata jemaat ini. Atur di menu Konfigurasi Sistem.</div>
        )}
      </section>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">C. Persembahan Barang (Natura) - {activeMj}</h3>
        <div className="space-y-3">
          {currentPersembahan.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-2">
              <input type="date" value={item.tanggal} onChange={(e) => updatePersembahan(item.id, 'tanggal', e.target.value)} className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500" />
              <input type="text" placeholder="Nama Pemberi..." value={item.pemberi} onChange={(e) => updatePersembahan(item.id, 'pemberi', e.target.value)} className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <input type="text" placeholder="Jenis Persembahan..." value={item.jenis} onChange={(e) => updatePersembahan(item.id, 'jenis', e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <button onClick={() => hapusPersembahan(item.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-md shrink-0">Hapus</button>
            </div>
          ))}
          <button onClick={tambahPersembahan} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Tambah Data</button>
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">D. Rencana Pelayanan Khusus - {activeMj}</h3>
        <div className="space-y-3">
          {currentPelayanan.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-2">
              <input type="date" value={item.tanggal} onChange={(e) => updatePelayanan(item.id, 'tanggal', e.target.value)} className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500" />
              <input type="text" placeholder="Jenis Pelayanan Khusus..." value={item.jenis} onChange={(e) => updatePelayanan(item.id, 'jenis', e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <button onClick={() => hapusPelayanan(item.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-md shrink-0">Hapus</button>
            </div>
          ))}
          <button onClick={tambahPelayanan} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Tambah Rencana</button>
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">E. Kendala / Informasi Lainnya - {activeMj}</h3>
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
          Simpan Laporan Wakil Sekretaris
        </button>
      </div>
    </div>
  );
}