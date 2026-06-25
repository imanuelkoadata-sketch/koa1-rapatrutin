import React from 'react';

export default function PembahasanProgram({ pembahasanList, setPembahasanList }) {
  
  const tambahBaris = () => setPembahasanList([...pembahasanList, { id: Date.now(), pembahasan: '', keputusan: '' }]);
  const hapusBaris = (id) => setPembahasanList(pembahasanList.filter(item => item.id !== id));
  const updateBaris = (id, field, value) => {
    setPembahasanList(pembahasanList.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newList = [...pembahasanList];
      newList.splice(index + 1, 0, { id: Date.now() + Math.random(), pembahasan: '', keputusan: '' });
      setPembahasanList(newList);
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Pembahasan Program Pelayanan Bulan Ini</h3>
        
        <div className="space-y-4">
          {pembahasanList.map((item, index) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-3 bg-white p-4 border rounded-md shadow-sm items-start">
              <span className="font-bold text-gray-400 w-6 mt-2">{index + 1}.</span>
              
              <div className="flex-1 w-full space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Pokok Pembahasan</label>
                  <input type="text" value={item.pembahasan} onChange={(e) => updateBaris(item.id, 'pembahasan', e.target.value)} placeholder="Ketik pokok pembahasan..." className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Keputusan</label>
                  <input type="text" value={item.keputusan} onChange={(e) => updateBaris(item.id, 'keputusan', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index)} placeholder="Ketik keputusan lalu tekan Enter..." className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" autoFocus={index === pembahasanList.length - 1 && index > 0} />
                </div>
              </div>

              {pembahasanList.length > 1 && (
                <button onClick={() => hapusBaris(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-md shrink-0 self-start md:self-center">Hapus</button>
              )}
            </div>
          ))}
          <button onClick={tambahBaris} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Tambah Pembahasan Baru</button>
        </div>
      </section>

      <div className="pt-4 flex justify-end">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-bold shadow-md transition-transform hover:scale-105">Simpan Pembahasan</button>
      </div>
    </div>
  );
}