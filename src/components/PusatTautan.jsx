import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Sesuaikan path jika berbeda

const PusatTautan = ({ userRole, mataJemaatList }) => {
  const [links, setLinks] = useState({
    global: { klasis: '', keuangan: '', keuanganKoa1 : '' },
    mj: {}
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data tautan dari Firestore
  useEffect(() => {
    const fetchTautan = async () => {
      try {
        const docRef = doc(db, 'konfigurasi', 'tautan');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setLinks(docSnap.data());
        } else {
          // Inisialisasi struktur awal jika belum ada
          const initialData = { global: { klasis: '', keuangan: '' }, mj: {} };
          mataJemaatList.forEach(mj => {
            initialData.mj[mj.id] = { pendataan: '', warta: '' };
          });
          setLinks(initialData);
        }
      } catch (error) {
        console.error("Gagal mengambil data tautan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTautan();
  }, [mataJemaatList]);

  // Fungsi untuk update state saat Admin mengetik
  const handleGlobalChange = (field, value) => {
    setLinks(prev => ({ ...prev, global: { ...prev.global, [field]: value } }));
  };

  const handleMjChange = (id, field, value) => {
    setLinks(prev => ({
      ...prev,
      mj: {
        ...prev.mj,
        [id]: { ...(prev.mj[id] || {}), [field]: value }
      }
    }));
  };

  // Simpan ke Firestore
  const handleSimpan = async () => {
    try {
      await setDoc(doc(db, 'konfigurasi', 'tautan'), links);
      alert('Puji Tuhan! Tautan berhasil diperbarui.');
      setIsEditing(false);
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert('Gagal menyimpan tautan.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center">
        <div className="text-gray-500 animate-pulse font-medium">Memuat Pusat Tautan...</div>
      </div>
    );
  }

  const isAdmin = userRole === 'admin';

  return (
    /* PERBAIKAN: Pembungkus luar ini mengaktifkan scroll mandiri (h-full overflow-y-auto) */
    <div className="flex-1 w-full h-full overflow-y-auto p-4 md:p-6">
      
      {/* Konten ditengahkan dan dibatasi lebarnya agar tetap rapi */}
      <div className="max-w-6xl mx-auto w-full pb-10">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Pusat Tautan</h2>
          {isAdmin && (
            <button 
              onClick={() => isEditing ? handleSimpan() : setIsEditing(true)}
              className={`px-4 py-2 text-white font-semibold rounded shadow transition-colors ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isEditing ? 'Simpan Perubahan' : 'Edit Tautan'}
            </button>
          )}
        </div>

        {/* --- BAGIAN ATAS: TAUTAN GLOBAL --- */}
<div className="bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-blue-500">
  <h3 className="text-lg font-bold text-gray-700 mb-4">Akses Umum</h3>

  {/* Mengubah md:grid-cols-2 menjadi md:grid-cols-3 agar pas untuk 3 item */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {isEditing ? (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700">Website Klasis</label>
          <input type="url" value={links.global?.klasis || ''} onChange={(e) => handleGlobalChange('klasis', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Download Aplikasi Keuangan</label>
          <input type="url" value={links.global?.keuangan || ''} onChange={(e) => handleGlobalChange('keuangan', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="https://..." />
        </div>
        {/* Kotak Input Baru: Keuangan Jemaat Koa 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Keuangan Jemaat Koa 1</label>
          <input type="url" value={links.global?.keuanganKoa1 || ''} onChange={(e) => handleGlobalChange('keuanganKoa1', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="https://..." />
        </div>
      </>
    ) : (
      <>
        <a href={links.global?.klasis || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold transition">
          🌐 Website Klasis
        </a>
        <a href={links.global?.keuangan || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-semibold transition">
          📱 Download Aplikasi Keuangan
        </a>
        {/* Tombol Baru: Keuangan Jemaat Koa 1 */}
        <a href={links.global?.keuanganKoa1 || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-semibold transition">
          📊 Keuangan Jemaat Koa 1
        </a>
      </>
    )}
  </div>
</div>

        {/* --- BAGIAN BAWAH: TAUTAN MATA JEMAAT --- */}
        <h3 className="text-lg font-bold text-gray-700 mb-4">Tautan Mata Jemaat</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mataJemaatList.map((mj) => (
            <div key={mj.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          
              <h4 className="text-md font-bold text-gray-800 border-b pb-2 mb-4">{mj.nama}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-xs text-gray-500">Link Pendataan</label>
                      <input type="url" value={links.mj?.[mj.id]?.pendataan || ''} onChange={(e) => handleMjChange(mj.id, 'pendataan', e.target.value)} className="mt-1 block w-full rounded text-sm border-gray-300 p-2 border" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Link Warta Jemaat</label>
                      <input type="url" value={links.mj?.[mj.id]?.warta || ''} onChange={(e) => handleMjChange(mj.id, 'warta', e.target.value)} className="mt-1 block w-full rounded text-sm border-gray-300 p-2 border" placeholder="https://..." />
                    </div>
                  </>
                ) : (
                  <>
                    <a href={links.mj?.[mj.id]?.pendataan || '#'} target="_blank" rel="noopener noreferrer" className="text-center p-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded font-medium text-sm transition">
                      📝 Pendataan {mj.nama}
                    </a>
                    <a href={links.mj?.[mj.id]?.warta || '#'} target="_blank" rel="noopener noreferrer" className="text-center p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded font-medium text-sm transition">
                      📰 Warta {mj.nama}
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default PusatTautan;