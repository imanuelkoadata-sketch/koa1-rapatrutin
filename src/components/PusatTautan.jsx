import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Sesuaikan path jika berbeda

const PusatTautan = ({ userRole, mataJemaatList }) => {
  // State hybrid untuk tautan tetap dan tautan dinamis (customLinks)
  const [links, setLinks] = useState({
    global: { klasis: '', keuangan: '', keuanganKoa1: '' },
    mj: {},
    customLinks: [] // { id, kategori, judul, url }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State khusus Pop-up Modal untuk menambahkan tautan baru saja
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, kategori: 'global', judul: '', url: '' });

  const isAdmin = userRole === 'admin';

  // 1. Ambil data dari Firestore
  useEffect(() => {
    const fetchTautan = async () => {
      try {
        const docRef = doc(db, 'konfigurasi', 'tautan');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLinks({
            global: data.global || { klasis: '', keuangan: '', keuanganKoa1: '' },
            mj: data.mj || {},
            customLinks: data.customLinks || []
          });
        } else {
          const initialData = { global: { klasis: '', keuangan: '', keuanganKoa1: '' }, mj: {}, customLinks: [] };
          mataJemaatList?.forEach(mj => {
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
    
    if (mataJemaatList) {
      fetchTautan();
    }
  }, [mataJemaatList]);

  // 2. Fungsi Perubahan Tautan Bawaan
  const handleGlobalChange = (field, value) => {
    setLinks(prev => ({ ...prev, global: { ...prev.global, [field]: value } }));
  };

  const handleMjChange = (id, field, value) => {
    setLinks(prev => ({
      ...prev,
      mj: { ...prev.mj, [id]: { ...(prev.mj[id] || {}), [field]: value } }
    }));
  };

  // 3. Fungsi Perubahan Tautan Baru secara Bersamaan (In-Place Editing)
  const handleCustomLinkChange = (id, field, value) => {
    setLinks(prev => ({
      ...prev,
      customLinks: prev.customLinks.map(link => 
        link.id === id ? { ...link, [field]: value } : link
      )
    }));
  };

  // 4. Simpan Seluruh Perubahan (Bawaan & Baru) ke Firestore
  const handleSimpanSemua = async () => {
    try {
      await setDoc(doc(db, 'konfigurasi', 'tautan'), links, { merge: true });
      alert('Puji Tuhan! Seluruh perubahan tautan berhasil diperbarui.');
      setIsEditing(false);
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert('Gagal menyimpan perubahan tautan.');
    }
  };

  // 5. Logika Pop-up Modal (Hanya untuk Tambah Baru)
  const handleSubmitModal = async (e) => {
    e.preventDefault();
    const updatedCustomLinks = [...(links.customLinks || [])];
    
    updatedCustomLinks.push({ 
      id: Date.now().toString(), 
      kategori: formData.kategori,
      judul: formData.judul, 
      url: formData.url 
    });

    try {
      const updatedState = { ...links, customLinks: updatedCustomLinks };
      await setDoc(doc(db, 'konfigurasi', 'tautan'), updatedState, { merge: true });
      setLinks(updatedState);
      closeModal();
    } catch (error) {
      console.error("Gagal menambah tautan:", error);
      alert('Gagal menambahkan tautan baru.');
    }
  };

  const handleDeleteCustom = async (id) => {
    if (window.confirm('Yakin ingin menghapus tautan ini?')) {
      const updatedCustomLinks = links.customLinks.filter(link => link.id !== id);
      try {
        const updatedState = { ...links, customLinks: updatedCustomLinks };
        await setDoc(doc(db, 'konfigurasi', 'tautan'), updatedState, { merge: true });
        setLinks(updatedState);
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, kategori: 'global', judul: '', url: '' });
  };

  // Filter pembantu berdasarkan kategori lokasinya
  const globalCustomLinks = links.customLinks?.filter(l => l.kategori === 'global') || [];
  const getMjCustomLinks = (mjId) => links.customLinks?.filter(l => l.kategori === mjId) || [];

  if (isLoading) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center">
        <div className="text-gray-500 animate-pulse font-medium">Memuat Pusat Tautan...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full overflow-y-auto p-4 md:p-6 relative">
      <div className="max-w-6xl mx-auto w-full pb-10">
        
        {/* HEADER UTAMA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-blue-800">Pusat Tautan</h2>
  
          {isAdmin && (
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded shadow transition-colors"
              >
                + Tambah Tautan Baru
              </button>
              <button 
                onClick={() => isEditing ? handleSimpanSemua() : setIsEditing(true)}
                className={`px-4 py-2 text-white font-semibold rounded shadow transition-colors ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isEditing ? 'Simpan Perubahan' : 'Edit Semua Tautan'}
              </button>
            </div>
          )}
        </div>

        {/* --- BAGIAN 1: AKSES UMUM --- */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-blue-500">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Akses Umum</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {isEditing ? (
              <>
                {/* Mode Edit: Tautan Bawaan */}
                <div>
                  <label className="block text-xs font-medium text-gray-500">Website Klasis</label>
                  <input type="url" value={links.global?.klasis || ''} onChange={(e) => handleGlobalChange('klasis', e.target.value)} className="mt-1 block w-full rounded text-sm border-gray-300 p-2 border" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Download Aplikasi Keuangan</label>
                  <input type="url" value={links.global?.keuangan || ''} onChange={(e) => handleGlobalChange('keuangan', e.target.value)} className="mt-1 block w-full rounded text-sm border-gray-300 p-2 border" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Keuangan Jemaat Koa 1</label>
                  <input type="url" value={links.global?.keuanganKoa1 || ''} onChange={(e) => handleGlobalChange('keuanganKoa1', e.target.value)} className="mt-1 block w-full rounded text-sm border-gray-300 p-2 border" />
                </div>

                {/* Mode Edit: Tautan Baru ikut jadi form input bersamaan */}
                {globalCustomLinks.map((link) => (
                  <div key={link.id} className="p-3 bg-gray-50 border border-gray-300 rounded-md space-y-2 text-left relative group">
                    <button type="button" onClick={() => handleDeleteCustom(link.id)} className="absolute top-1 right-2 text-red-500 hover:text-red-700 text-xs font-bold">✕ Hapus</button>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Judul Tautan</label>
                      <input type="text" value={link.judul} onChange={(e) => handleCustomLinkChange(link.id, 'judul', e.target.value)} className="mt-1 block w-full rounded text-xs border-gray-300 p-1.5 border focus:border-blue-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">URL Tujuan</label>
                      <input type="url" value={link.url} onChange={(e) => handleCustomLinkChange(link.id, 'url', e.target.value)} className="mt-1 block w-full rounded text-xs border-gray-300 p-1.5 border focus:border-blue-500 bg-white" />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Mode Tampilan Biasa */}
                <a href={links.global?.klasis || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold transition text-center break-words">🌐 Website Klasis</a>
                <a href={links.global?.keuangan || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-semibold transition text-center break-words">📲 Download Aplikasi Keuangan</a>
                <a href={links.global?.keuanganKoa1 || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-semibold transition text-center break-words">📊 Keuangan Jemaat Koa 1</a>
                
                {globalCustomLinks.map((link) => (
                  <div key={link.id} className="relative group flex flex-col justify-between">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold text-center transition h-full flex items-center justify-center break-words">🔗 {link.judul}</a>
                    {isAdmin && (
                      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded shadow border">
                        <button onClick={() => handleDeleteCustom(link.id)} className="p-1 text-red-600 hover:text-red-800 text-xs" title="Hapus">✕</button>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* --- BAGIAN 2: TAUTAN MATA JEMAAT --- */}
        <h3 className="text-lg font-bold text-gray-700 mb-4">Tautan Mata Jemaat</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {mataJemaatList?.map((mj) => {
            const mjCustomLinks = getMjCustomLinks(mj.id);
            
            return (
              <div key={mj.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-md font-bold text-gray-800 border-b pb-2 mb-4">{mj.nama}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {isEditing ? (
                    <>
                      {/* Mode Edit: Tautan Bawaan Mata Jemaat */}
                      <div>
                        <label className="block text-xs text-gray-500">Link Pendataan</label>
                        <input type="url" value={links.mj?.[mj.id]?.pendataan || ''} onChange={(e) => handleMjChange(mj.id, 'pendataan', e.target.value)} className="mt-1 block w-full rounded text-sm border-gray-300 p-2 border" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">Link Warta Jemaat</label>
                        <input type="url" value={links.mj?.[mj.id]?.warta || ''} onChange={(e) => handleMjChange(mj.id, 'warta', e.target.value)} className="mt-1 block w-full rounded text-sm border-gray-300 p-2 border" />
                      </div>

                      {/* Mode Edit: Tautan Baru di Mata Jemaat ini */}
                      {mjCustomLinks.map((link) => (
                        <div key={link.id} className="p-3 bg-gray-50 border border-gray-300 rounded-md space-y-2 text-left col-span-1 md:col-span-2 relative">
                          <button type="button" onClick={() => handleDeleteCustom(link.id)} className="absolute top-1 right-2 text-red-500 hover:text-red-700 text-xs font-bold">✕ Hapus</button>
                          <div>
                            <label className="block text-xs font-medium text-gray-600">Judul Tautan</label>
                            <input type="text" value={link.judul} onChange={(e) => handleCustomLinkChange(link.id, 'judul', e.target.value)} className="mt-1 block w-full rounded text-xs border-gray-300 p-1.5 border focus:border-blue-500 bg-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600">URL Tujuan</label>
                            <input type="url" value={link.url} onChange={(e) => handleCustomLinkChange(link.id, 'url', e.target.value)} className="mt-1 block w-full rounded text-xs border-gray-300 p-1.5 border focus:border-blue-500 bg-white" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {/* Mode Tampilan Biasa */}
                      <a href={links.mj?.[mj.id]?.pendataan || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded font-medium text-sm transition text-center break-words">📋 Pendataan {mj.nama}</a>
                      <a href={links.mj?.[mj.id]?.warta || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded font-medium text-sm transition text-center break-words">📰 Warta {mj.nama}</a>
                      
                      {mjCustomLinks.map((link) => (
                        <div key={link.id} className="relative group flex flex-col justify-between">
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="block p-3 rounded bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-medium text-sm text-center transition h-full flex items-center justify-center break-words">🔗 {link.judul}</a>
                          {isAdmin && (
                            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded shadow border z-10">
                              <button onClick={() => handleDeleteCustom(link.id)} className="p-1 text-red-600 hover:text-red-800 text-xs" title="Hapus">✕</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* --- POP-UP MODAL (HANYA UNTUK TAMBAH BARU) --- */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Tambah Tautan Baru</h3>
            
            <form onSubmit={handleSubmitModal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Pilih Kategori (Lokasi Tautan)</label>
                <select 
                  value={formData.kategori} 
                  onChange={(e) => setFormData({...formData, kategori: e.target.value})} 
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:border-amber-500 bg-white"
                >
                  <option value="global">Akses Umum</option>
                  {mataJemaatList?.map(mj => (
                    <option key={mj.id} value={mj.id}>{mj.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Judul Tautan</label>
                <input type="text" required value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 p-2 border" placeholder="Contoh: Jadwal Ibadah" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL Tujuan</label>
                <input type="url" required value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 p-2 border" placeholder="https://..." />
              </div>
              
              <div className="flex gap-3 justify-end pt-4 mt-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded">Batal</button>
                <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded shadow">Tambah Tautan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PusatTautan;