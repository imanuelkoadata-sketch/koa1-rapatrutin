import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Konfigurasi({ profilGereja, setProfilGereja, profilMJH, setProfilMJH, mataJemaatList, setMataJemaatList, kategoriPelayananList, setKategoriPelayananList }) {
  const [activeTab, setActiveTab] = useState('profil');
  const [isSaving, setIsSaving] = useState(false);
  
  const [activeMjFilter, setActiveMjFilter] = useState('');

  useEffect(() => {
    if (mataJemaatList.length > 0 && !activeMjFilter) {
      setActiveMjFilter(mataJemaatList[0].nama);
    }
  }, [mataJemaatList, activeMjFilter]);
  
  const tambahMataJemaat = () => setMataJemaatList([...mataJemaatList, { id: Date.now(), nama: '' }]);
  const hapusMataJemaat = (id) => setMataJemaatList(mataJemaatList.filter(mj => mj.id !== id));
  
  const updateMataJemaat = (id, value) => {
    const oldName = mataJemaatList.find(m => m.id === id)?.nama;
    if (oldName === activeMjFilter) setActiveMjFilter(value);
    setKategoriPelayananList(kategoriPelayananList.map(k => k.mataJemaat === oldName ? { ...k, mataJemaat: value } : k));
    setMataJemaatList(mataJemaatList.map(mj => mj.id === id ? { ...mj, nama: value } : mj));
  };

  const tambahKategori = () => setKategoriPelayananList([...kategoriPelayananList, { id: Date.now(), nama: '', mataJemaat: activeMjFilter }]);
  const hapusKategori = (id) => setKategoriPelayananList(kategoriPelayananList.filter(k => k.id !== id));
  const updateKategori = (id, field, value) => setKategoriPelayananList(kategoriPelayananList.map(k => k.id === id ? { ...k, [field]: value } : k));

  const handleSimpanKonfigurasi = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "konfigurasi", "utama"), {
        profilGereja: profilGereja,
        profilMJH: profilMJH, // <-- MENYIMPAN DATA PENGURUS KE FIREBASE
        mataJemaatList: mataJemaatList,
        kategoriPelayananList: kategoriPelayananList 
      });
      alert("Puji Tuhan! Konfigurasi berhasil disimpan ke Database.");
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredKategori = kategoriPelayananList.filter(k => k.mataJemaat === activeMjFilter);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 h-full">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-800">Konfigurasi Sistem</h2>
          <p className="text-gray-500">Atur profil gereja, pengurus MJH, daftar mata jemaat, dan master kategori pelayanan di sini.</p>
        </div>

        <div className="flex border-b border-gray-200 bg-white rounded-t-lg shadow-sm overflow-x-auto">
          <button onClick={() => setActiveTab('profil')} className={`whitespace-nowrap py-4 px-6 font-medium text-sm transition-colors border-b-2 ${activeTab === 'profil' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>Profil Gereja</button>
          
          {/* TAB BARU: Pengurus MJH */}
          <button onClick={() => setActiveTab('pengurus')} className={`whitespace-nowrap py-4 px-6 font-medium text-sm transition-colors border-b-2 ${activeTab === 'pengurus' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>Pengurus MJH</button>
          
          <button onClick={() => setActiveTab('rayon')} className={`whitespace-nowrap py-4 px-6 font-medium text-sm transition-colors border-b-2 ${activeTab === 'rayon' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>Rayon & Kategori Pelayanan</button>
        </div>

        <div className="bg-white p-6 rounded-b-lg shadow-sm border border-t-0 border-gray-100">
          
          {activeTab === 'profil' && (
            <div className="space-y-8 animate-fadeIn">
              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Kop Surat / Identitas Laporan</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Gereja Induk (Sinode)</label><input type="text" value={profilGereja.induk} onChange={(e) => setProfilGereja({...profilGereja, induk: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Nama Klasis</label><input type="text" value={profilGereja.klasis} onChange={(e) => setProfilGereja({...profilGereja, klasis: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-1">Majelis Jemaat Wilayah</label><input type="text" value={profilGereja.jemaat} onChange={(e) => setProfilGereja({...profilGereja, jemaat: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Daftar Mata Jemaat</h3>
                <div className="space-y-3 max-w-md">
                  {mataJemaatList.map((mj, index) => (
                    <div key={mj.id} className="flex gap-2">
                      <span className="mt-2 text-sm font-bold text-gray-500">{index + 1}.</span>
                      <input type="text" value={mj.nama} onChange={(e) => updateMataJemaat(mj.id, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
                      {mataJemaatList.length > 1 && (<button onClick={() => hapusMataJemaat(mj.id)} className="text-red-500 hover:bg-red-50 p-2 rounded text-sm font-bold">Hapus</button>)}
                    </div>
                  ))}
                  <button onClick={tambahMataJemaat} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Tambah Mata Jemaat</button>
                </div>
              </section>
            </div>
          )}

          {/* TAB BARU: Form Isian Pengurus MJH */}
          {activeTab === 'pengurus' && (
            <div className="space-y-8 animate-fadeIn">
              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Penandatangan Laporan Evaluasi</h3>
                <p className="text-sm text-gray-500 mb-6">Nama-nama di bawah ini akan otomatis tercetak di bagian bawah (tanda tangan) pada dokumen PDF Laporan Evaluasi.</p>
                <div className="space-y-5 max-w-lg">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Ketua Majelis Jemaat</label>
                    <input type="text" placeholder="Contoh: Pdt. Nama Lengkap, S.Th" value={profilMJH?.ketua || ''} onChange={(e) => setProfilMJH({...profilMJH, ketua: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Sekretaris Wilayah</label>
                    <input type="text" placeholder="Contoh: Pnt. Nama Sekretaris" value={profilMJH?.sekretaris || ''} onChange={(e) => setProfilMJH({...profilMJH, sekretaris: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'rayon' && (
            <div className="space-y-6 animate-fadeIn">
              <section>
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Pengaturan Rayon per Mata Jemaat</h3>
                    <p className="text-xs text-gray-500 mt-1">Pilih mata jemaat untuk melihat atau mengedit daftar rayonnya.</p>
                  </div>
                  <div className="w-full md:w-64">
                    <select 
                      value={activeMjFilter} 
                      onChange={(e) => setActiveMjFilter(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-blue-200 bg-blue-50 text-blue-800 font-bold rounded-md focus:outline-none focus:border-blue-500"
                    >
                      <option value="" disabled>Pilih Mata Jemaat...</option>
                      {mataJemaatList.map(mj => (
                        <option key={mj.id} value={mj.nama}>{mj.nama}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {activeMjFilter ? (
                  <div className="space-y-3">
                    <div className="hidden md:flex gap-2 px-1 text-xs font-bold text-gray-500">
                      <div className="w-8 text-center">No</div>
                      <div className="flex-1">Nama Rayon / Kategori Pelayanan</div>
                      <div className="w-16"></div>
                    </div>

                    {filteredKategori.length > 0 ? (
                      filteredKategori.map((kat, index) => (
                        <div key={kat.id} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-gray-50 md:bg-transparent p-4 md:p-0 rounded border md:border-none">
                          <span className="hidden md:block w-8 text-center text-sm font-bold text-gray-400">{index + 1}.</span>
                          <div className="w-full md:flex-1">
                            <label className="md:hidden text-xs font-bold text-gray-500 mb-1 block">Nama Rayon/Kategori</label>
                            <input type="text" value={kat.nama} onChange={(e) => updateKategori(kat.id, 'nama', e.target.value)} placeholder="Contoh: Rayon 1, PAR..." className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                          </div>
                          <button onClick={() => hapusKategori(kat.id)} className="text-red-500 hover:bg-red-100 p-2 rounded text-sm font-bold shrink-0 self-end md:self-auto">Hapus</button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded border border-dashed border-gray-300">
                        <p className="text-sm text-gray-500">Belum ada daftar rayon untuk mata jemaat ini.</p>
                      </div>
                    )}
                    
                    <button onClick={tambahKategori} className="mt-4 px-4 py-2 bg-gray-100 text-sm text-blue-700 font-bold hover:bg-gray-200 rounded border border-gray-200">
                      + Tambah Rayon di {activeMjFilter}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 italic text-sm">
                    Silakan tambahkan Mata Jemaat di tab Profil terlebih dahulu.
                  </div>
                )}
              </section>
            </div>
          )}

          <div className="pt-6 flex justify-end border-t border-gray-200 mt-8">
            <button 
              onClick={handleSimpanKonfigurasi} disabled={isSaving}
              className={`px-8 py-3 rounded-md font-bold shadow-md text-white transition-all ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'}`}
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi Sistem'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}