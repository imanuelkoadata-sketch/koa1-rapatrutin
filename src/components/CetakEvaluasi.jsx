import { useState } from 'react';

export default function CetakEvaluasi({ 
  periodeBulan, // Pastikan ini ada
  mataJemaatList = [], profilMJH, 
  tempatRapat, tanggalRapat, profilGereja, pelayanPA, bacaanPA, temaPA, kehadiranMajelis, pembahasanList, warnaSariList,
  kehadiranWK, kegiatanWilayah, kegiatanMataJemaat, pelaksanaanRapatMJ, agendasMJ, keputusansMJ, kendalainfosWK,
  kehadiranJemaat, realisasiPelayanan, persembahanWasek, pelayananKhusus, kendalainfosWasek, pemimpinKebaktian, bukuAdmin, kendalainfosWasek1,
  kasKeuangan, saldoLaluNatura, penerimaanNatura, pengeluaranNatura, sisaSaldoNatura, kendalainfosWabend, kendalainfosWabend1
}) {
  const [bulanCetak, setBulanCetak] = useState('2026-06');
  const handlePrint = () => window.print();
  const tahunTandaTangan = tanggalRapat ? tanggalRapat.split('-')[0] : new Date().getFullYear();

  const safeRapatMJ = Array.isArray(pelaksanaanRapatMJ) ? pelaksanaanRapatMJ : [];
  const safeAgendas = Array.isArray(agendasMJ) ? agendasMJ : [];
  const safeKeputusans = Array.isArray(keputusansMJ) ? keputusansMJ : [];
  const safeKendalaWK = Array.isArray(kendalainfosWK) ? kendalainfosWK : [];
  const safeKehadiranWK = Array.isArray(kehadiranWK) ? kehadiranWK : [];
  const safeKegiatanWilayah = Array.isArray(kegiatanWilayah) ? kegiatanWilayah : [];
  const safeKegiatanMataJemaat = Array.isArray(kegiatanMataJemaat) ? kegiatanMataJemaat : [];

  const JudulMataJemaat = ({ nama }) => (
    <h6 className="font-bold text-center bg-gray-200 border border-gray-400 border-b-0 p-1 text-[11px] text-gray-800 print:bg-gray-200 print:color-adjust-exact">
      Mata Jemaat: {nama}
    </h6>
  );

  // Helper untuk mengecek ketersediaan data Kendala
  const hasKendalaWK = safeKendalaWK.some(k => k.text?.trim() !== '');
  const hasKendalaWabend = [...(kendalainfosWabend || []), ...(kendalainfosWabend1 || [])].some(k => k.text?.trim() !== '');

  return (
    <div className="flex-1 overflow-y-auto bg-gray-200 p-4 md:p-8 h-full print:p-0 print:bg-white print:overflow-visible">
      
      <style>
        {`
          @media print {
            @page { size: A4 portrait; margin: 10mm; }
            html, body, #root, main, div {
              height: auto !important;
              min-height: 100% !important;
              overflow: visible !important;
            }
            body { 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact; 
              background-color: white !important;
            }
            .break-inside-avoid {
              page-break-inside: avoid;
              break-inside: avoid;
            }
          }
        `}
      </style>

      {/* HEADER KONTROL */}
      <div className="max-w-[210mm] mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Cetak Laporan Evaluasi</h2>
           <p className="text-gray-600 text-sm">Pratinjau dokumen sebelum dicetak ke PDF atau Kertas A4.</p>
        </div>
        <div className="flex gap-4 items-center">
          
          <button onClick={handlePrint} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-bold shadow-md flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Cetak Dokumen
          </button>
        </div>
      </div>

      {/* KERTAS A4 KONTEN UTAMA */}
      <div className="mx-auto bg-white p-8 md:p-10 rounded shadow-lg w-full max-w-[210mm] min-h-[297mm] print:shadow-none print:m-0 print:p-0 print:w-full print:max-w-none print:min-h-0 text-black">
        
        {/* KOP SURAT */}
        <div className="text-center border-b-4 border-double border-gray-800 pb-4 mb-6">
          <h1 className="text-xl font-bold uppercase tracking-wider">{profilGereja?.induk || 'Gereja Masehi Injili di Timor (GMIT)'}</h1>
          <h2 className="text-lg font-bold uppercase">Klasis {profilGereja?.klasis || 'Mollo Barat'}</h2>
          <h2 className="text-lg font-bold uppercase">Majelis Jemaat Wilayah {profilGereja?.jemaat || '-'}</h2>
        </div>

        <div className="text-center mb-8">
          <h3 className="font-bold underline text-lg">NOTULEN RAPAT & EVALUASI BULANAN</h3>
          <p className="text-sm font-medium mt-1">Periode Bulan: {periodeBulan}</p>
        </div>

        <div className="space-y-6 text-[12px] md:text-[13px] text-gray-800 print:text-black leading-snug font-serif">
          
          <section className="break-inside-avoid">
            <h4 className="font-bold border-b border-gray-300 pb-1 mb-2">1. INFORMASI PELAKSANAAN RAPAT</h4>
            <table className="w-full text-left">
              <tbody>
                <tr><td className="w-40 py-0.5 font-medium">Hari / Tanggal</td><td className="w-4">:</td><td>{tanggalRapat || '-'}</td></tr>
                <tr><td className="w-40 py-0.5 font-medium">Tempat Pelaksanaan</td><td className="w-4">:</td><td>{tempatRapat || '-'}</td></tr>
                <tr><td className="w-40 py-0.5 font-medium">Pelayan Ibadah PA</td><td className="w-4">:</td><td>{pelayanPA || '-'}</td></tr>
                <tr><td className="w-40 py-0.5 font-medium">Tema / Bacaan</td><td className="w-4">:</td><td>{temaPA ? `${temaPA} (${bacaanPA})` : bacaanPA || '-'}</td></tr>
                <tr>
                  <td className="w-40 py-0.5 font-medium align-top">Kehadiran Majelis</td>
                  <td className="w-4 align-top">:</td>
                  <td className="py-0.5">
                    {kehadiranMajelis && kehadiranMajelis.filter(m => m.hadir).length > 0 ? (
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                        {kehadiranMajelis.filter(m => m.hadir).map((m, idx) => (
                          <div key={m.id} className="text-[12px] md:text-[13px] leading-snug">
                            {idx + 1}. {m.nama}
                          </div>
                        ))}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="pt-2">
             <h4 className="font-bold border-b border-gray-300 pb-1 mb-2 mt-2 text-sm break-inside-avoid">2. LAPORAN WAKIL KETUA</h4>
             <h5 className="font-bold mb-1 break-inside-avoid">A. Kehadiran Majelis (Bulan Lalu)</h5>
             <div className="grid grid-cols-2 gap-2 mb-4 break-inside-avoid">
               {mataJemaatList.length > 0 ? mataJemaatList.map((mj) => (
                 <div key={mj.id} className="w-full">
                   <JudulMataJemaat nama={mj.nama} />
                   <table className="w-full border-collapse border border-gray-400 text-center text-[10px]">
                     {/* POIN 8: Penambahan Kolom Jumlah (Jml) */}
                     <thead className="bg-gray-100 print:bg-gray-100 print:color-adjust-exact"><tr><th className="border border-gray-400 p-0.5">Tgl</th><th className="border border-gray-400 p-0.5">Pnt</th><th className="border border-gray-400 p-0.5">Dkn</th><th className="border border-gray-400 p-0.5">Pgj</th><th className="border border-gray-400 p-0.5">Kst</th><th className="border border-gray-400 p-0.5 font-extrabold text-blue-800">Jml</th></tr></thead>
                     <tbody>
                       {safeKehadiranWK.filter(item => item.mataJemaat === mj.nama).length > 0 ? (
                         safeKehadiranWK.filter(item => item.mataJemaat === mj.nama).map((item) => (
                           <tr key={`${mj.id}-${item.id}`}><td className="border border-gray-400 p-0.5 truncate max-w-[80px] text-left">{item.nama}</td><td className="border border-gray-400 p-0.5">{item.penatua || '-'}</td><td className="border border-gray-400 p-0.5">{item.diaken || '-'}</td><td className="border border-gray-400 p-0.5">{item.pengajar || '-'}</td><td className="border border-gray-400 p-0.5">{item.koster || '-'}</td><td className="border border-gray-400 p-0.5 font-bold text-blue-800">{item.jumlah || '-'}</td></tr>
                         ))
                       ) : (
                         <tr><td colSpan="6" className="border border-gray-400 p-1 text-center text-gray-400 italic">[-]</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               )) : <div className="text-gray-500 italic text-sm col-span-2">Belum ada data Mata Jemaat di Konfigurasi.</div>}
             </div>

             <h5 className="font-bold mb-1 break-inside-avoid">B. Kegiatan Pelayanan</h5>
             <div className="grid grid-cols-2 gap-2 mb-4 break-inside-avoid">
               {mataJemaatList.map((mj) => (
                 <div key={mj.id} className="w-full">
                   <JudulMataJemaat nama={mj.nama} />
                   <table className="w-full border-collapse border border-gray-400 text-left text-[10px]">
                     <thead className="bg-gray-100 print:bg-gray-100 print:color-adjust-exact text-center"><tr><th className="border border-gray-400 p-0.5 w-16">Tanggal</th><th className="border border-gray-400 p-0.5">Jenis Kegiatan / Program</th><th className="border border-gray-400 p-0.5 w-16">Tkt</th></tr></thead>
                     <tbody>
                       {safeKegiatanWilayah.filter(k => k.kegiatan && k.mataJemaat === mj.nama).map((item) => (<tr key={`wk-${item.id}`}><td className="border border-gray-400 p-0.5 text-center">{item.tanggal}</td><td className="border border-gray-400 p-0.5">{item.kegiatan}</td><td className="border border-gray-400 p-0.5 text-center">Wil</td></tr>))}
                       {safeKegiatanMataJemaat.filter(k => k.kegiatan && k.mataJemaat === mj.nama).map((item) => (<tr key={`mk-${item.id}`}><td className="border border-gray-400 p-0.5 text-center">{item.tanggal}</td><td className="border border-gray-400 p-0.5">{item.kegiatan}</td><td className="border border-gray-400 p-0.5 text-center">MJ</td></tr>))}
                       {!safeKegiatanWilayah.some(k => k.kegiatan && k.mataJemaat === mj.nama) && !safeKegiatanMataJemaat.some(k => k.kegiatan && k.mataJemaat === mj.nama) && (
                         <tr><td colSpan="3" className="border border-gray-400 p-1 text-center text-gray-400 italic">[-]</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               ))}
             </div>
             
             <div className="break-inside-avoid">
                 <div className="grid grid-cols-2 gap-2 mb-2">
                   {mataJemaatList.map((mj) => {
                     const rapatMJ = safeRapatMJ.find(r => r.mataJemaat === mj.nama);
                     const agendaList = safeAgendas.filter(a => a.mataJemaat === mj.nama && a.text);
                     const keputusanList = safeKeputusans.filter(k => k.mataJemaat === mj.nama && k.text);

                     return (
                       <div key={mj.id} className="w-full border p-2">
                         <h5 className="font-bold mb-1 border-b pb-1 text-[11px] text-center">C. Rapat Mata Jemaat ({mj.nama})</h5>
                         {rapatMJ && (rapatMJ.tanggal || agendaList.length > 0) ? (
                           <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                             <li><strong>Tgl:</strong> {rapatMJ.tanggal || '-'}</li>
                             <li><strong>Hadir:</strong> MJH({rapatMJ.mjh||0}) Pnt({rapatMJ.penatua||0}) Dkn({rapatMJ.diaken||0}) Pgj({rapatMJ.pengajar||0}) Kst({rapatMJ.koster||0}) Undgn({rapatMJ.undangan||0})</li>
                             <li><strong>Agenda:</strong> {agendaList.map(a => a.text).join(', ') || '-'}</li>
                             <li><strong>Keputusan:</strong> {keputusanList.map(a => a.text).join(', ') || '-'}</li>
                           </ul>
                         ) : <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-gray-400"><li>[-]</li></ul>}
                       </div>
                     )
                   })}
                 </div>

                 {/* POIN 9: Sembunyikan bagian Kendala WK jika sepenuhnya kosong */}
                 {hasKendalaWK && (
                   <div className="grid grid-cols-2 gap-2 mt-4">
                     {mataJemaatList.map((mj) => {
                       const kendalaList = safeKendalaWK.filter(k => k.mataJemaat === mj.nama && k.text?.trim() !== '');
                       if (kendalaList.length === 0) return null; // Sembunyikan box spesifik jika kosong
                       
                       return (
                         <div key={mj.id} className="w-full border p-2">
                           <h5 className="font-bold mb-1 border-b pb-1 text-[11px] text-center">D. Kendala/Info W. Ketua ({mj.nama})</h5>
                           <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                             {kendalaList.map((k, i) => <li key={`k-${i}`}>{k.text}</li>)}
                           </ul>
                         </div>
                       );
                     })}
                   </div>
                 )}
             </div>
          </section>
          
          <section className="pt-4">
             <h4 className="font-bold border-b border-gray-300 pb-1 mb-2 text-sm break-inside-avoid">3. LAPORAN WAKIL SEKRETARIS & WAKIL SEKRETARIS 1</h4>
             
             <h5 className="font-bold mb-1 break-inside-avoid">A. Kehadiran Jemaat (Bulan Lalu)</h5>
             <div className="grid grid-cols-2 gap-2 mb-4 break-inside-avoid">
               {mataJemaatList.map((mj) => (
                 <div key={mj.id} className="w-full">
                   <JudulMataJemaat nama={mj.nama} />
                   <table className="w-full border-collapse border border-gray-400 text-center text-[10px]">
                     <thead className="bg-gray-100 print:bg-gray-100 print:color-adjust-exact"><tr><th className="border border-gray-400 p-0.5">Kebaktian</th><th className="border border-gray-400 p-0.5">Laki</th><th className="border border-gray-400 p-0.5">Pr</th></tr></thead>
                     <tbody>
                       {Array.isArray(kehadiranJemaat) && kehadiranJemaat.filter(item => item.mataJemaat === mj.nama).length > 0 ? 
                         kehadiranJemaat.filter(item => item.mataJemaat === mj.nama).map((item) => (<tr key={`j-${mj.id}-${item.id}`}><td className="border border-gray-400 p-0.5 truncate max-w-[90px] text-left">{item.nama}</td><td className="border border-gray-400 p-0.5">{item.tidakTercatat ? 'Tdk' : item.laki || '-'}</td><td className="border border-gray-400 p-0.5">{item.tidakTercatat ? 'Tdk' : item.perempuan || '-'}</td></tr>))
                         : <tr><td colSpan="3" className="border border-gray-400 p-1 text-center text-gray-400 italic">[-]</td></tr>
                       }
                     </tbody>
                   </table>
                 </div>
               ))}
             </div>

             <div className="grid grid-cols-2 gap-2 mb-4 break-inside-avoid">
               {mataJemaatList.map((mj) => (
                 <div key={mj.id} className="w-full border p-2">
                   <h5 className="font-bold mb-1 border-b pb-1 text-[11px] text-center">B. Realisasi Kunjungan Rayon ({mj.nama})</h5>
                   <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                     {Array.isArray(realisasiPelayanan) && realisasiPelayanan.filter(r => r.mataJemaat === mj.nama).length > 0 ? 
                       realisasiPelayanan.filter(r => r.mataJemaat === mj.nama).map(r => <li key={`r-${r.id}`}>{r.nama}: {r.realisasi || 0} (Target: {r.target})</li>)
                       : <li className="text-gray-400 list-none">[-]</li>}
                   </ul>
                 </div>
               ))}
             </div>

             <div className="grid grid-cols-2 gap-2 mb-4 break-inside-avoid">
               {mataJemaatList.map((mj) => (
                 <div key={mj.id} className="w-full border p-2">
                   <h5 className="font-bold mb-1 border-b pb-1 text-[11px] text-center">C. Rencana Pelayanan & Pemimpin ({mj.nama})</h5>
                   <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                     {Array.isArray(pelayananKhusus) && pelayananKhusus.filter(p => p.jenis && p.mataJemaat === mj.nama).map(p => <li key={`p-${p.id}`}>{p.jenis} ({p.tanggal})</li>)}
                     {Array.isArray(pemimpinKebaktian) && pemimpinKebaktian.filter(p => p.petugas && p.mataJemaat === mj.nama).map(p => <li key={`pk-${p.id}`}>{p.jadwal}: {p.petugas}</li>)}
                     
                     {(!Array.isArray(pelayananKhusus) || !pelayananKhusus.some(p => p.jenis && p.mataJemaat === mj.nama)) && (!Array.isArray(pemimpinKebaktian) || !pemimpinKebaktian.some(p => p.petugas && p.mataJemaat === mj.nama)) && (
                       <li className="text-gray-400 list-none">[-]</li>
                     )}
                   </ul>
                 </div>
               ))}
             </div>

             <div className="grid grid-cols-2 gap-2 break-inside-avoid">
               {mataJemaatList.map((mj) => {
                 // POIN 9: Mengekstrak array kendala Wasek untuk memvalidasi apakah kosong
                 const wKendala = [...(kendalainfosWasek || []), ...(kendalainfosWasek1 || [])].filter(k => k.mataJemaat === mj.nama && k.text?.trim() !== '');
                 
                 return (
                   <div key={mj.id} className="w-full border p-2">
                     <h5 className="font-bold mb-1 border-b pb-1 text-[11px] text-center">D. Buku Admin & Kendala ({mj.nama})</h5>
                     <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                       {Array.isArray(bukuAdmin) && bukuAdmin.filter(b => b.checked && b.mataJemaat === mj.nama).map(b => <li key={`b-${b.id}`}>{b.label}</li>)}
                     </ul>
                     
                     {/* Hanya render area kendala jika ada isinya */}
                     {wKendala.length > 0 && (
                       <div className="mt-2 pt-2 border-t border-dashed border-gray-300">
                         <p className="font-bold text-[10px]">Kendala:</p>
                         <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                           {wKendala.map((k, i) => <li key={`w-${i}`}>{k.text}</li>)}
                         </ul>
                       </div>
                     )}
                   </div>
                 );
               })}
             </div>
          </section>
          
          <section className="pt-4 break-inside-avoid">
             <h4 className="font-bold border-b border-gray-300 pb-1 mb-2 text-sm">4. LAPORAN WAKIL BENDAHARA (KEUANGAN & NATURA)</h4>
             
             {/* A. UANG TUNAI */}
             <div className="grid grid-cols-2 gap-2 mb-4 break-inside-avoid">
               {mataJemaatList.map((mj) => {
                 const uang = kasKeuangan?.[mj.nama] || null;
                 return (
                   <div key={mj.id} className="w-full bg-gray-50 print:bg-gray-50 print:color-adjust-exact border p-2 rounded">
                      <h5 className="font-bold text-center border-b pb-1 mb-1 text-[11px]">A. Uang Tunai ({mj.nama})</h5>
                      {uang ? (
                        <>
                          <div className="flex justify-between text-[11px]"><span>Saldo Lalu</span> <span>: Rp {uang.lalu?.toLocaleString('id-ID') || 0}</span></div>
                          <div className="flex justify-between text-[11px]"><span>Penerimaan</span> <span>: Rp {uang.terima?.toLocaleString('id-ID') || 0}</span></div>
                          <div className="flex justify-between border-b border-gray-300 pb-0.5 text-[11px]"><span>Pengeluaran</span> <span>: Rp {uang.keluar?.toLocaleString('id-ID') || 0}</span></div>
                          <div className="flex justify-between font-bold pt-0.5 text-[11px]"><span>Sisa Saldo</span> <span>: Rp {uang.sisa?.toLocaleString('id-ID') || 0}</span></div>
                        </>
                      ) : <div className="flex justify-center items-center h-10 text-[11px] text-gray-400 italic">[-]</div>}
                   </div>
                 )
               })}
             </div>

             {/* B. NATURA */}
             <div className="grid grid-cols-2 gap-2 mb-4 break-inside-avoid">
               {mataJemaatList.map((mj) => (
                 <div key={mj.id} className="w-full">
                   <JudulMataJemaat nama={`${mj.nama} (Natura)`} />
                   <table className="w-full border-collapse border border-gray-400 text-center text-[10px]">
                     <thead className="bg-gray-100 print:bg-gray-100 print:color-adjust-exact"><tr><th className="border border-gray-400 p-0.5">Ket</th><th className="border border-gray-400 p-0.5 w-1/2">Barang</th><th className="border border-gray-400 p-0.5">Jml</th></tr></thead>
                     <tbody>
                       {Array.isArray(saldoLaluNatura) && saldoLaluNatura.some(n => n.uraian && n.mataJemaat === mj.nama) ? (
                         <>
                           <tr><td className="border border-gray-400 p-0.5 font-bold text-left">S. Lalu</td><td className="border border-gray-400 p-0.5">{saldoLaluNatura.filter(n=>n.uraian && n.mataJemaat === mj.nama).map(n=>n.uraian).join(', ') || '-'}</td><td className="border border-gray-400 p-0.5">{saldoLaluNatura.filter(n=>n.uraian && n.mataJemaat === mj.nama).map(n=>n.jumlah+' '+n.satuan).join(', ') || '-'}</td></tr>
                           <tr><td className="border border-gray-400 p-0.5 font-bold text-left">Masuk</td><td className="border border-gray-400 p-0.5">{Array.isArray(penerimaanNatura) && penerimaanNatura.filter(n=>n.uraian && n.mataJemaat === mj.nama).map(n=>n.uraian).join(', ') || '-'}</td><td className="border border-gray-400 p-0.5">{Array.isArray(penerimaanNatura) && penerimaanNatura.filter(n=>n.uraian && n.mataJemaat === mj.nama).map(n=>n.jumlah+' '+n.satuan).join(', ') || '-'}</td></tr>
                           <tr><td className="border border-gray-400 p-0.5 font-bold text-left">Keluar</td><td className="border border-gray-400 p-0.5">{Array.isArray(pengeluaranNatura) && pengeluaranNatura.filter(n=>n.uraian && n.mataJemaat === mj.nama).map(n=>n.uraian).join(', ') || '-'}</td><td className="border border-gray-400 p-0.5">{Array.isArray(pengeluaranNatura) && pengeluaranNatura.filter(n=>n.uraian && n.mataJemaat === mj.nama).map(n=>n.jumlah+' '+n.satuan).join(', ') || '-'}</td></tr>
                           <tr><td className="border border-gray-400 p-0.5 font-bold text-left text-blue-800 print:text-black">Sisa</td><td className="border border-gray-400 p-0.5 font-bold">{Array.isArray(sisaSaldoNatura) && sisaSaldoNatura.filter(n=>n.uraian && n.mataJemaat === mj.nama).map(n=>n.uraian).join(', ') || '-'}</td><td className="border border-gray-400 p-0.5 font-bold text-blue-800 print:text-black">{Array.isArray(sisaSaldoNatura) && sisaSaldoNatura.filter(n=>n.uraian && n.mataJemaat === mj.nama).map(n=>n.jumlah+' '+n.satuan).join(', ') || '-'}</td></tr>
                         </>
                       ) : <tr><td colSpan="3" className="border border-gray-400 p-2 text-gray-400 italic">[-]</td></tr>}
                     </tbody>
                   </table>
                 </div>
               ))}
             </div>

             {/* POIN 9: Sembunyikan bagian Kendala Wabend jika sepenuhnya kosong */}
             {hasKendalaWabend && (
               <div className="grid grid-cols-2 gap-2 break-inside-avoid mt-4">
                 {mataJemaatList.map((mj) => {
                   const wBendKendala = [...(kendalainfosWabend || []), ...(kendalainfosWabend1 || [])].filter(k => k.mataJemaat === mj.nama && k.text?.trim() !== '');
                   if (wBendKendala.length === 0) return null; // Sembunyikan box spesifik jika kosong
                   
                   return (
                     <div key={mj.id} className="w-full border p-2">
                       <h5 className="font-bold mb-1 border-b pb-1 text-[11px] text-center">C. Kendala Keuangan & Natura ({mj.nama})</h5>
                       <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                          {wBendKendala.map((k, i) => <li key={`bn-${i}`}>{k.text}</li>)}
                       </ul>
                     </div>
                   );
                 })}
               </div>
             )}
          </section>

          <section className="pt-4 break-inside-avoid">
            <h4 className="font-bold border-b border-gray-300 pb-1 mb-3 text-sm">5. PEMBAHASAN PROGRAM & WARNA SARI</h4>
            
            <div className="mb-4">
              <h5 className="font-bold mb-2">A. Pembahasan Program</h5>
              <ol className="list-decimal pl-5 space-y-3">
                {Array.isArray(pembahasanList) && pembahasanList.map((item, idx) => {
                  // POIN 10: Mapping struktur Judul, Array Rincian, dan Keputusan
                  if (!item.judul && !item.keputusan) return null;
                  return (
                    <li key={`prog-${idx}`}>
                      <strong className="text-gray-900">{item.judul || 'Tanpa Judul'}</strong>
                      
                      {Array.isArray(item.rincianPembahasan) && item.rincianPembahasan.some(r => r.teks?.trim() !== '') && (
                        <ul className="list-disc pl-5 mt-1 mb-1.5 space-y-0.5">
                          {item.rincianPembahasan.filter(r => r.teks?.trim() !== '').map((r) => (
                            <li key={r.id} className="text-gray-700">{r.teks}</li>
                          ))}
                        </ul>
                      )}
                      
                      <div className="mt-1">
                        <strong>Keputusan:</strong> {item.keputusan || '-'}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
            
             <div className="mt-4">
              <h5 className="font-bold mb-2">B. Warna Sari</h5>
              <ol className="list-decimal pl-5 space-y-3">
                {Array.isArray(warnaSariList) && warnaSariList.map((item, idx) => {
                  // POIN 10: Mapping struktur Judul, Array Rincian, dan Keputusan untuk Warna Sari
                  if (!item.judulWarnaSari && !item.keputusan) return null;
                  return (
                    <li key={`war-${idx}`}>
                      <strong className="text-gray-900">{item.judulWarnaSari || 'Tanpa Judul'}</strong>
                      
                      {Array.isArray(item.pembahasanWarnaSari) && item.pembahasanWarnaSari.some(r => r.teks?.trim() !== '') && (
                        <ul className="list-disc pl-5 mt-1 mb-1.5 space-y-0.5">
                          {item.pembahasanWarnaSari.filter(r => r.teks?.trim() !== '').map((r) => (
                            <li key={r.id} className="text-gray-700">{r.teks}</li>
                          ))}
                        </ul>
                      )}
                      
                      <div className="mt-1">
                        <strong>Tindak Lanjut:</strong> {item.keputusan || '-'}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

        </div>

         {/* NAMA PENGURUS OTOMATIS DARI KONFIGURASI */}
         <div className="mt-12 flex justify-between text-center font-serif text-sm md:text-base break-inside-avoid">
          <div>
            <p className="mb-16">Mengetahui,<br/>Ketua Majelis Jemaat</p>
            <p className="font-bold underline uppercase">{profilMJH?.ketua || '[NAMA KETUA MAJELIS]'}</p>
          </div>
          <div>
            <p className="mb-16">{tempatRapat || 'Mollo Barat'}, ........................ {tahunTandaTangan}<br/>Sekretaris Wilayah</p>
            <p className="font-bold underline uppercase">{profilMJH?.sekretaris || '[NAMA SEKRETARIS]'}</p>
          </div>
        </div>

      </div>
    </div>
  );
}