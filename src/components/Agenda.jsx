import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function Agenda({ userRole, periodeBulan }) {
  const isAdmin = userRole === 'admin';
  const [dokumenList, setDokumenList] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "agenda_files"), where("bulan", "==", periodeBulan));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setDokumenList(docs);
    });
    return () => unsubscribe();
  }, [periodeBulan]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File terlalu besar! Maksimal 5MB.");
      return;
    }

    setIsUploading(true);

     const CLOUD_NAME = "dxnczh892"; 
     const UPLOAD_PRESET = "preset_gerejakoa";

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.secure_url) {
        await addDoc(collection(db, "agenda_files"), {
          nama: file.name,
          url: data.secure_url,
          tipe: file.type.includes('pdf') ? 'pdf' : 'word',
          ukuran: (file.size / 1024).toFixed(1) + " KB",
          bulan: periodeBulan,
          tanggalUnggah: new Date().toLocaleDateString('id-ID'),
          createdAt: serverTimestamp()
        });
        alert("Puji Tuhan, dokumen berhasil diunggah!");
      }
    } catch (error) {
      console.error("Gagal unggah:", error);
      alert("Gagal mengunggah dokumen.");
    } finally {
      setIsUploading(false);
      e.target.value = null; 
    }
  };

  const handleHapus = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
      try {
        await deleteDoc(doc(db, "agenda_files", id));
      } catch (error) {
        alert("Gagal menghapus.");
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 h-full relative">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-800">Dokumen Agenda & Lampiran</h2>
            <p className="text-gray-500">Periode Bulan: <span className="font-bold text-blue-600">{periodeBulan}</span></p>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Unggah Dokumen Baru</h3>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <input 
                type="file" 
                onChange={handleUpload}
                disabled={isUploading}
                accept=".pdf,.doc,.docx"
                className="flex-1 w-full p-2 border border-dashed border-gray-400 rounded bg-gray-50 text-sm cursor-pointer" 
              />
              <div className="w-full md:w-auto">
                {isUploading ? (
                   <span className="text-blue-600 font-bold animate-pulse text-sm">Sedang Mengirim...</span>
                ) : (
                  <p className="text-[10px] text-gray-400 italic">Pilih file untuk otomatis mengunggah.</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-gray-800">Arsip Berkas Bulan Ini</h3>
            {!isAdmin && <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">Mode Baca Saja</span>}
          </div>

          <div className="overflow-x-auto">
            {/* PEMBARUAN: Struktur tabel disederhanakan, tombol dipindah ke bawah nama */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-y">
                  <th className="py-3 px-4 font-bold">Informasi Dokumen</th>
                  <th className="py-3 px-4 font-bold w-24 text-right">Ukuran</th>
                </tr>
              </thead>
              <tbody>
                {dokumenList.length > 0 ? (
                  dokumenList.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-start gap-3">
                          <svg className={`w-6 h-6 mt-0.5 shrink-0 ${doc.tipe === 'pdf' ? 'text-red-500' : 'text-blue-500'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z m2 6h8v2H6z m0 3h8v2H6z"></path></svg>
                          <div className="flex flex-col gap-2 w-full">
                            <span className="font-bold text-gray-800 text-sm truncate max-w-[200px] md:max-w-md">{doc.nama}</span>
                            
                            {/* Tombol-tombol diposisikan berderet di bawah nama dokumen */}
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <button onClick={() => setPreviewFile(doc)} className="text-green-700 bg-green-50 px-3 py-1 rounded text-xs font-bold border border-green-200 hover:bg-green-100 transition-colors">Lihat</button>
                              <a href={doc.url} target="_blank" rel="noreferrer" className="inline-block text-blue-700 bg-blue-50 px-3 py-1 rounded text-xs font-bold border border-blue-200 hover:bg-blue-100 transition-colors">Unduh</a>
                              {isAdmin && <button onClick={() => handleHapus(doc.id)} className="text-red-700 bg-red-50 px-3 py-1 rounded text-xs font-bold border border-red-200 hover:bg-red-100 transition-colors">Hapus</button>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-500 align-top pt-5 text-right font-medium">{doc.ukuran}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="2" className="py-12 text-center text-gray-400 italic text-sm">Belum ada dokumen untuk bulan {periodeBulan}.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {previewFile && (
        <div className="fixed inset-0 z-[100] bg-gray-900 bg-opacity-80 flex items-center justify-center p-2 md:p-6">
          <div className="bg-white w-full max-w-5xl h-full flex flex-col rounded-lg overflow-hidden shadow-2xl">
            <div className="bg-blue-800 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-sm truncate pr-4">{previewFile.nama}</h3>
              <button onClick={() => setPreviewFile(null)} className="text-white hover:bg-blue-700 p-1 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="flex-1 bg-gray-200">
              {previewFile.tipe === "word" ? (
                <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewFile.url)}`} width="100%" height="100%" frameBorder="0" title="Word Preview"></iframe>
              ) : (
                <iframe src={`${previewFile.url}#toolbar=0`} width="100%" height="100%" frameBorder="0" title="PDF Preview"></iframe>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}