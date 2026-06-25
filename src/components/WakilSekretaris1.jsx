import { useEffect, useState } from 'react';

export default function WakilSekretaris1({ 
  bulanLaporan, pemimpinKebaktian, setPemimpinKebaktian,
  bukuAdmin, setBukuAdmin, kendalainfosWasek1, setKendalainfosWasek1,
  handleSimpan
}) {
  const mataJemaatList = ['Imanuel Koa', 'Syalom Haususu'];
  const [activeMj, setActiveMj] = useState(mataJemaatList[0]);

  const listPemimpin = Array.isArray(pemimpinKebaktian) ? pemimpinKebaktian : [];
  const listBuku = Array.isArray(bukuAdmin) ? bukuAdmin : [];
  
  const ensureObjectList = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map((item, idx) => typeof item === 'string' ? { id: Date.now() + idx, mataJemaat: activeMj, text: item } : item);
  };
  const listKendala = ensureObjectList(kendalainfosWasek1);

  // ==========================================
  // AUTO-SYNC BUKU ADMIN (ANTI-DOBEL)
  // ==========================================
  useEffect(() => {
    const defaultBooks = [
      { baseId: 'baptis', label: 'Buku Baptis' }, { baseId: 'sidi', label: 'Buku Sidi' },
      { baseId: 'nikah', label: 'Buku Nikah' }, { baseId: 'kelahiran', label: 'Buku Kelahiran' },
      { baseId: 'kematian', label: 'Buku Kematian' }, { baseId: 'mimbar', label: 'Buku Pelayanan Mimbar' },
      { baseId: 'doa', label: 'Buku Pokok Doa' }, { baseId: 'induk', label: 'Buku Induk Jemaat' },
      { baseId: 'atestasi', label: 'Buku Atestasi Masuk Keluar' }, { baseId: 'anggota_majelis', label: 'Buku Anggota Majelis' }
    ];

    let isUpdated = false;
    let syncedBooks = [];

    mataJemaatList.forEach(mj => {
      defaultBooks.forEach(db => {
        const expectedId = `${db.baseId}_${mj.replace(/\s+/g, '')}`;
        // Amankan legacy data lama yang ID-nya masih ID dasar
        const legacyId = db.baseId; 

        let existing = listBuku.find(b => b.id === expectedId || (b.id === legacyId && mj === mataJemaatList[0]));

        if (existing) {
          syncedBooks.push({ ...existing, id: expectedId, mataJemaat: mj, label: db.label });
        } else {
          syncedBooks.push({ id: expectedId, label: db.label, checked: false, mataJemaat: mj });
          isUpdated = true;
        }
      });
    });

    if (isUpdated || syncedBooks.length !== listBuku.length) {
      setBukuAdmin(syncedBooks);
    }
  }, [listBuku, setBukuAdmin]);

  const currentPemimpin = listPemimpin.filter(p => p.mataJemaat === activeMj);
  const currentBuku = listBuku.filter(b => b.mataJemaat === activeMj);
  const currentKendala = listKendala.filter(k => k.mataJemaat === activeMj);

  useEffect(() => {
    if (!bulanLaporan) return;
    if (currentPemimpin.length > 0 && currentPemimpin[0].jadwal !== '') return;
    
    const [yearStr, monthStr] = bulanLaporan.split('-');
    const year = parseInt(yearStr);
    const currMonth = parseInt(monthStr);

    const sundays = [];
    let d = new Date(year, currMonth - 1, 1);
    while (d.getMonth() === currMonth - 1) {
      if (d.getDay() === 0) sundays.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }

    const autoPemimpin = sundays.map((sun, index) => {
      const tgl = sun.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
      return { id: Date.now() + index + Math.random(), jadwal: `Minggu ${index + 1} (${tgl})`, petugas: '', mataJemaat: activeMj };
    });

    const dataMjLain = listPemimpin.filter(p => p.mataJemaat !== activeMj);
    setPemimpinKebaktian([...dataMjLain, ...autoPemimpin]);
  }, [bulanLaporan, activeMj]);

  const updatePemimpin = (id, field, value) => setPemimpinKebaktian(listPemimpin.map(item => item.id === id ? { ...item, [field]: value } : item));
  const hapusPemimpin = (id) => setPemimpinKebaktian(listPemimpin.filter(item => item.id !== id));
  const tambahPemimpin = () => setPemimpinKebaktian([...listPemimpin, { id: Date.now(), jadwal: '', petugas: '', mataJemaat: activeMj }]);

  const toggleBuku = (id) => setBukuAdmin(listBuku.map(buku => buku.id === id ? { ...buku, checked: !buku.checked } : buku));

  const addKendala = () => setKendalainfosWasek1([...listKendala, { id: Date.now() + Math.random(), mataJemaat: activeMj, text: '' }]);
  const updateKendala = (id, text) => setKendalainfosWasek1(listKendala.map(item => item.id === id ? { ...item, text } : item));
  const removeKendala = (id) => setKendalainfosWasek1(listKendala.filter(item => item.id !== id));
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
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">A. Pemimpin Kebaktian (Bulan Ini) - {activeMj}</h3>
        <div className="space-y-3">
          {currentPemimpin.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-2 bg-white p-2 border rounded-md shadow-sm">
              <input type="text" value={item.jadwal} onChange={(e) => updatePemimpin(item.id, 'jadwal', e.target.value)} className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium" />
              <input type="text" placeholder="Nama Petugas Pelayan Firman..." value={item.petugas} onChange={(e) => updatePemimpin(item.id, 'petugas', e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <button onClick={() => hapusPemimpin(item.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-md shrink-0">Hapus</button>
            </div>
          ))}
          <button onClick={tambahPemimpin} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Tambah Jadwal</button>
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-1">B. Buku-buku Administrasi - {activeMj}</h3>
        <p className="text-xs text-gray-500 mb-4 border-b pb-2">Centang kotak untuk buku yang sementara dikerjakan.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentBuku.map((buku) => (
            <label key={buku.id} className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${buku.checked ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
              <input type="checkbox" checked={buku.checked} onChange={() => toggleBuku(buku.id)} className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className={`text-sm font-medium ${buku.checked ? 'text-blue-800' : 'text-gray-700'}`}>{buku.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">C. Kendala / Informasi Lainnya - {activeMj}</h3>
        <div className="space-y-2">
          {currentKendala.map((kendala, index) => (
            <div key={kendala.id} className="flex items-start gap-2">
              <span className="mt-2 text-sm font-bold text-gray-500 w-6 text-right">{index + 1}.</span>
              <input type="text" value={kendala.text || ''} onChange={(e) => updateKendala(kendala.id, e.target.value)} onKeyDown={handleEnterKendala} placeholder="Ketik kendala/informasi lalu tekan Enter..." className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <button onClick={() => removeKendala(kendala.id)} className="text-red-500 mt-1 p-1">Hapus</button>
            </div>
          ))}
          <button onClick={addKendala} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Tambah Kendala</button>
        </div>
      </section>

      <div className="pt-4 flex justify-end">
        <button onClick={handleSimpan} className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-bold shadow-md transition-transform hover:scale-105">
          Simpan Laporan Wasek 1
        </button>
      </div>
    </div>
  );
}