import React from 'react';

export default function DashboardContent({ currentDate, setCurrentDate, catatanKalender, pembahasanList, warnaSariList }) {
  
  const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

  const getCatatan = (tanggal) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(tanggal).padStart(2, '0')}`;
    return catatanKalender[dateKey] || '';
  };

  const keputusanProgram = pembahasanList.filter(item => item.keputusan.trim() !== '');
  const keputusanWarnaSari = warnaSariList.filter(item => item.keputusan.trim() !== '');

  // Cek apakah ada jadwal sama sekali bulan ini
  const hariDenganJadwal = daysArray.filter(tgl => tgl !== null && getCatatan(tgl).trim() !== '');

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="h-48 bg-blue-900 bg-opacity-80 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 overflow-hidden z-0">
            <div className="w-full h-full bg-linear-to-r from-blue-800 to-blue-600 opacity-90"></div>
        </div>
        <div className="relative z-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Selamat Datang</h2>
          <p className="text-blue-100">Sistem Pencatatan Notulen Rapat & Evaluasi Bulanan</p>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold border-b pb-2 mb-4">Info Terkini & Keputusan Rapat</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <h4 className="font-bold text-blue-800 text-sm mb-2">Program Pelayanan:</h4>
               {keputusanProgram.length > 0 ? (
                 <ul className="space-y-1 text-sm text-gray-600 list-disc pl-5">
                   {keputusanProgram.map(p => <li key={p.id}>{p.keputusan}</li>)}
                 </ul>
               ) : <p className="text-sm text-gray-400 italic">Belum ada keputusan program.</p>}
            </div>
            <div>
               <h4 className="font-bold text-blue-800 text-sm mb-2">Tindak Lanjut Warna Sari:</h4>
               {keputusanWarnaSari.length > 0 ? (
                 <ul className="space-y-1 text-sm text-gray-600 list-disc pl-5">
                   {keputusanWarnaSari.map(w => <li key={w.id}>{w.keputusan}</li>)}
                 </ul>
               ) : <p className="text-sm text-gray-400 italic">Belum ada tindak lanjut warna sari.</p>}
            </div>
          </div>
        </div>

        {/* KALENDER READ-ONLY */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          
          <div className="bg-blue-800 p-4 flex items-center justify-between text-white">
            <button onClick={prevMonth} className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm font-bold">&larr; <span className="hidden md:inline">Bulan Lalu</span></button>
            <h2 className="text-lg font-bold uppercase tracking-wider">{namaBulan[month]} {year}</h2>
            <button onClick={nextMonth} className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm font-bold"><span className="hidden md:inline">Bulan Depan</span> &rarr;</button>
          </div>

          {/* TAMPILAN DESKTOP (GRID UTUH) */}
          <div className="hidden md:block">
            <div className="grid grid-cols-7 border-b border-gray-200 bg-blue-50">
              {namaHari.map(hari => <div key={hari} className="py-2 text-center text-sm font-bold text-blue-800 border-r last:border-r-0">{hari}</div>)}
            </div>
            <div className="grid grid-cols-7 bg-gray-200 gap-1px">
              {daysArray.map((tanggal, index) => (
                <div key={index} className={`bg-white p-2 flex flex-col min-h-30 h-auto ${tanggal === null ? 'bg-gray-50' : ''}`}>
                  {tanggal !== null && (
                    <>
                      <span className="text-sm font-bold text-gray-800 mb-1 border-b pb-1">{tanggal}</span>
                      <div style={{ fontFamily: '"Arial Narrow", Arial, sans-serif' }} className="text-[12px] leading-tight text-gray-800 whitespace-pre-wrap">
                        {getCatatan(tanggal)}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* TAMPILAN MOBILE (LIST VIEW HANYA TANGGAL TERISI) */}
          <div className="md:hidden flex flex-col bg-gray-50 p-4 gap-3 max-h-500px overflow-y-auto">
            {hariDenganJadwal.length > 0 ? (
              hariDenganJadwal.map((tanggal, index) => {
                const dayName = namaHari[new Date(year, month, tanggal).getDay()];
                return (
                  <div key={`mob-${index}`} className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex gap-4 items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-lg px-2 py-2 flex flex-col items-center justify-center min-w-3.5rem border border-blue-200">
                      <span className="text-xs font-bold uppercase">{dayName.substring(0,3)}</span>
                      <span className="text-2xl font-bold">{tanggal}</span>
                    </div>
                    <div className="flex-1 text-sm text-gray-700 whitespace-pre-wrap pt-1" style={{ fontFamily: '"Arial Narrow", Arial, sans-serif' }}>
                      {getCatatan(tanggal)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500 italic">
                Belum ada jadwal pelayanan yang tercatat untuk bulan ini.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}