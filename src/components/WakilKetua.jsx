import { useEffect, useState } from 'react';

export default function WakilKetua({ 
  bulanLaporan,
  kehadiranWK, setKehadiranWK,
  kegiatanWilayah, setKegiatanWilayah,
  kegiatanMataJemaat, setKegiatanMataJemaat,
  pelaksanaanRapatMJ, setPelaksanaanRapatMJ,
  agendasMJ, setAgendasMJ,
  keputusansMJ, setKeputusansMJ,
  kendalainfosWK, setKendalainfosWK
}) {
  // MASTER MATA JEMAAT (Jika nanti dari props parent, bisa diubah)
  const mataJemaatList = ['Imanuel Koa', 'Syalom Haususu'];
  
  // STATE BARU: Mengingat pilihan dropdown Mata Jemaat
  const [activeMj, setActiveMj] = useState(mataJemaatList[0]);

  // ==========================================
  // 1. PENGAMANAN STRUKTUR DATA (Mencegah Error)
  // ==========================================
  const listKehadiran = Array.isArray(kehadiranWK) ? kehadiranWK : [];
  const listKegWilayah = Array.isArray(kegiatanWilayah) ? kegiatanWilayah : [];
  const listKegMJ = Array.isArray(kegiatanMataJemaat) ? kegiatanMataJemaat : [];
  const listRapat = Array.isArray(pelaksanaanRapatMJ) ? pelaksanaanRapatMJ : [];

  // Konversi cerdas jika data sebelumnya string biasa menjadi objek
  const ensureObjectList = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map((item, idx) => typeof item === 'string' ? { id: Date.now() + idx, mataJemaat: activeMj, text: item } : item);
  };
  const listAgenda = ensureObjectList(agendasMJ);
  const listKeputusan = ensureObjectList(keputusansMJ);
  const listKendala = ensureObjectList(kendalainfosWK);

  // ==========================================
  // 2. FILTER TAMPILAN SESUAI DROPDOWN AKTIF
  // ==========================================
  const currentKehadiran = listKehadiran.filter(k => k.mataJemaat === activeMj);
  const currentKegWilayah = listKegWilayah.filter(k => k.mataJemaat === activeMj);
  const currentKegMJ = listKegMJ.filter(k => k.mataJemaat === activeMj);
  const currentAgenda = listAgenda.filter(a => a.mataJemaat === activeMj);
  const currentKeputusan = listKeputusan.filter(a => a.mataJemaat === activeMj);
  const currentKendala = listKendala.filter(a => a.mataJemaat === activeMj);
  
  let currentRapat = listRapat.find(r => r.mataJemaat === activeMj) || { mataJemaat: activeMj, tanggal: '', mjh: '', penatua: '', diaken: '', pengajar: '', koster: '', undangan: '' };

  // ==========================================
  // 3. GENERATE OTOMATIS HARI MINGGU
  // ==========================================
  useEffect(() => {
    if (!bulanLaporan) return;
    
    // Jangan timpa jika user sudah mengetik nama kebaktian di Mata Jemaat ini
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
      return { 
        id: Date.now() + index + Math.random(), 
        nama: `Minggu ${index + 1} (${tgl})`, 
        penatua: '', diaken: '', pengajar: '', koster: '', 
        mataJemaat: activeMj // <- PENANDA PENTING
      };
    });

    const dataMjLain = listKehadiran.filter(k => k.mataJemaat !== activeMj);
    setKehadiranWK([...dataMjLain, ...autoKehadiran]);
  }, [bulanLaporan, activeMj]);

  // ==========================================
  // 4. FUNGSI UPDATE DATA (Menyuntikkan Mata Jemaat)
  // ==========================================
  const tambahKehadiran = () => setKehadiranWK([...listKehadiran, { id: Date.now(), nama: '', penatua: '', diaken: '', pengajar: '', koster: '', mataJemaat: activeMj }]);
  const hapusKehadiran = (id) => setKehadiranWK(listKehadiran.filter(item => item.id !== id));
  const updateKehadiran = (id, field, value) => setKehadiranWK(listKehadiran.map(k => k.id === id ? {...k, [field]: value} : k));

  const tambahKegiatanW = () => setKegiatanWilayah([...listKegWilayah, { id: Date.now(), tanggal: '', kegiatan: '', mataJemaat: activeMj }]);
  const hapusKegiatanW = (id) => setKegiatanWilayah(listKegWilayah.filter(item => item.id !== id));
  const updateKegiatanW = (id, field, value) => setKegiatanWilayah(listKegWilayah.map(k => k.id === id ? {...k, [field]: value} : k));

  const tambahKegiatanM = () => setKegiatanMataJemaat([...listKegMJ, { id: Date.now(), tanggal: '', kegiatan: '', mataJemaat: activeMj }]);
  const hapusKegiatanM = (id) => setKegiatanMataJemaat(listKegMJ.filter(item => item.id !== id));
  const updateKegiatanM = (id, field, value) => setKegiatanMataJemaat(listKegMJ.map(k => k.id === id ? {...k, [field]: value} : k));

  const updateRapat = (field, value) => {
    const exists = listRapat.some(r => r.mataJemaat === activeMj);
    if (exists) {
        setPelaksanaanRapatMJ(listRapat.map(r => r.mataJemaat === activeMj ? { ...r, [field]: value } : r));
    } else {
        setPelaksanaanRapatMJ([...listRapat, { ...currentRapat, [field]: value }]);
    }
  };

  const addListObj = (setList, fullList) => setList([...fullList, { id: Date.now() + Math.random(), mataJemaat: activeMj, text: '' }]);
  const updateListObj = (setList, fullList, id, text) => setList(fullList.map(item => item.id === id ? { ...item, text } : item));
  const removeListObj = (setList, fullList, id) => setList(fullList.filter(item => item.id !== id));
  const handleEnter = (e, setList, fullList) => { if (e.key === 'Enter') { e.preventDefault(); addListObj(setList, fullList); } };

  return (
    <div className="space-y-10">
      
      {/* FILTER DROPDOWN: Kunci perubahan layar */}
      <div className="w-full md:w-1/3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <label className="block text-sm font-bold text-blue-800 mb-2">Pilih Form Mata Jemaat</label>
        <select 
          value={activeMj} 
          onChange={(e) => setActiveMj(e.target.value)}
          className="w-full px-3 py-2 border-2 border-blue-300 rounded-md focus:ring-blue-500 font-bold text-gray-700"
        >
          {mataJemaatList.map((mj) => <option key={mj} value={mj}>{mj}</option>)}
        </select>
        <p className="text-xs text-blue-600 mt-2">Data yang diisi di bawah ini hanya akan tersimpan untuk <strong>{activeMj}</strong>.</p>
      </div>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">A. Kehadiran Majelis (Bulan Lalu) - {activeMj}</h3>
        <div className="space-y-3">
          {currentKehadiran.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-white p-3 border rounded-md shadow-sm">
              <div className="w-full md:w-1/3">
                <label className="block text-xs text-gray-500 mb-1">Nama Kebaktian / Tgl</label>
                <input type="text" placeholder="Nama Kebaktian" value={item.nama} onChange={(e) => updateKehadiran(item.id, 'nama', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium" />
              </div>
              <div className="flex-1 grid grid-cols-4 gap-2 w-full mt-2 md:mt-0">
                <div><label className="block text-xs text-gray-500 mb-1">Penatua</label><input type="number" value={item.penatua} onChange={(e) => updateKehadiran(item.id, 'penatua', e.target.value)} className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"/></div>
                <div><label className="block text-xs text-gray-500 mb-1">Diaken</label><input type="number" value={item.diaken} onChange={(e) => updateKehadiran(item.id, 'diaken', e.target.value)} className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"/></div>
                <div><label className="block text-xs text-gray-500 mb-1">Pengajar</label><input type="number" value={item.pengajar} onChange={(e) => updateKehadiran(item.id, 'pengajar', e.target.value)} className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"/></div>
                <div><label className="block text-xs text-gray-500 mb-1">Koster</label><input type="number" value={item.koster} onChange={(e) => updateKehadiran(item.id, 'koster', e.target.value)} className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"/></div>
              </div>
              <button onClick={() => hapusKehadiran(item.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-md shrink-0 mt-4 md:mt-0 self-end md:self-center">Hapus</button>
            </div>
          ))}
          <button onClick={tambahKehadiran} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Tambah Kebaktian Lainnya</button>
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">B. Kegiatan Wilayah / Jemaat - {activeMj}</h3>
        <div className="space-y-3">
          {currentKegWilayah.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-2">
              <input type="date" value={item.tanggal} onChange={(e) => updateKegiatanW(item.id, 'tanggal', e.target.value)} className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500" />
              <input type="text" value={item.kegiatan} onChange={(e) => updateKegiatanW(item.id, 'kegiatan', e.target.value)} placeholder="Jenis Kegiatan / Program Pelayanan..." className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <button onClick={() => hapusKegiatanW(item.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-md shrink-0">Hapus</button>
            </div>
          ))}
          <button onClick={tambahKegiatanW} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Tambah Kegiatan Wilayah</button>
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">C. Kegiatan Mata Jemaat - {activeMj}</h3>
        <div className="space-y-3">
          {currentKegMJ.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-2">
              <input type="date" value={item.tanggal} onChange={(e) => updateKegiatanM(item.id, 'tanggal', e.target.value)} className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500" />
              <input type="text" value={item.kegiatan} onChange={(e) => updateKegiatanM(item.id, 'kegiatan', e.target.value)} placeholder="Jenis Kegiatan / Program Pelayanan..." className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <button onClick={() => hapusKegiatanM(item.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-md shrink-0">Hapus</button>
            </div>
          ))}
          <button onClick={tambahKegiatanM} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Tambah Kegiatan Mata Jemaat</button>
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">D. Pelaksanaan Rapat di {activeMj}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Hari/Tanggal Rapat</label>
            <input type="date" value={currentRapat.tanggal} onChange={(e) => updateRapat('tanggal', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kehadiran (Jumlah)</label>
            <div className="grid grid-cols-3 gap-2">
              <div><label className="text-xs text-gray-500">MJH</label><input type="number" value={currentRapat.mjh} onChange={(e) => updateRapat('mjh', e.target.value)} className="w-full border p-1.5 rounded text-sm"/></div>
              <div><label className="text-xs text-gray-500">Penatua</label><input type="number" value={currentRapat.penatua} onChange={(e) => updateRapat('penatua', e.target.value)} className="w-full border p-1.5 rounded text-sm"/></div>
              <div><label className="text-xs text-gray-500">Diaken</label><input type="number" value={currentRapat.diaken} onChange={(e) => updateRapat('diaken', e.target.value)} className="w-full border p-1.5 rounded text-sm"/></div>
              <div><label className="text-xs text-gray-500">Pengajar</label><input type="number" value={currentRapat.pengajar} onChange={(e) => updateRapat('pengajar', e.target.value)} className="w-full border p-1.5 rounded text-sm"/></div>
              <div><label className="text-xs text-gray-500">Koster</label><input type="number" value={currentRapat.koster} onChange={(e) => updateRapat('koster', e.target.value)} className="w-full border p-1.5 rounded text-sm"/></div>
              <div><label className="text-xs text-gray-500">Undangan</label><input type="number" value={currentRapat.undangan} onChange={(e) => updateRapat('undangan', e.target.value)} className="w-full border p-1.5 rounded text-sm"/></div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Agenda & Keputusan Rapat</label>
          <div className="space-y-4">
            {currentAgenda.map((agenda, index) => {
              // Mencari keputusan yang sebaris berdasarkan urutan (index)
              const keputusan = currentKeputusan[index] || { text: '' };
              
              return (
                <div key={agenda.id} className="flex flex-col md:flex-row items-start gap-3 bg-white p-3 border rounded-md shadow-sm">
                  <span className="mt-2 text-sm font-bold text-gray-500 w-6 text-right">{index + 1}.</span>
                  <div className="flex-1 w-full space-y-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Agenda Pembahasan</label>
                      <input type="text" value={agenda.text || ''} onChange={(e) => updateListObj(setAgendasMJ, listAgenda, agenda.id, e.target.value)} placeholder="Ketik agenda rapat..." className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Keputusan / Hasil</label>
                      <input type="text" value={keputusan.text || ''} onChange={(e) => {
                          if (currentKeputusan[index]) {
                             updateListObj(setKeputusansMJ, listKeputusan, currentKeputusan[index].id, e.target.value);
                          }
                      }} placeholder="Ketik keputusan rapat..." className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                  </div>
                  <button onClick={() => {
                      removeListObj(setAgendasMJ, listAgenda, agenda.id);
                      if (currentKeputusan[index]) removeListObj(setKeputusansMJ, listKeputusan, currentKeputusan[index].id);
                  }} className="text-red-500 hover:bg-red-100 p-2 rounded-md shrink-0 mt-4 md:mt-0">Hapus</button>
                </div>
              );
            })}
            <button onClick={() => {
                // Menambah 1 baris kosong untuk Agenda sekaligus Keputusan
                const newIdA = Date.now() + Math.random();
                const newIdK = Date.now() + Math.random();
                setAgendasMJ([...listAgenda, { id: newIdA, mataJemaat: activeMj, text: '' }]);
                setKeputusansMJ([...listKeputusan, { id: newIdK, mataJemaat: activeMj, text: '' }]);
            }} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Tambah Nomor</button>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">E. Kendala / Informasi Lainnya - {activeMj}</h3>
        <div className="space-y-2">
          {currentKendala.map((kendala, index) => (
            <div key={kendala.id} className="flex items-start gap-2">
              <span className="mt-2 text-sm font-bold text-gray-500 w-6 text-right">{index + 1}.</span>
              <input type="text" value={kendala.text || ''} onChange={(e) => updateListObj(setKendalainfosWK, listKendala, kendala.id, e.target.value)} onKeyDown={(e) => handleEnter(e, setKendalainfosWK, listKendala)} placeholder="Ketik kendala/informasi lalu tekan Enter..." className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <button onClick={() => removeListObj(setKendalainfosWK, listKendala, kendala.id)} className="text-red-500 mt-1 p-1">Hapus</button>
            </div>
          ))}
          <button onClick={() => addListObj(setKendalainfosWK, listKendala)} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Tambah Kendala</button>
        </div>
      </section>

    </div>
  );
}