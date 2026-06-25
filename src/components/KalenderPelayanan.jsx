import React from 'react';

export default function KalenderPelayanan({ currentDate, setCurrentDate, catatanKalender, setCatatanKalender, userRole }) {
  const isLocked = userRole !== 'admin';
  const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const year = currentDate.getFullYear(); const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

  const handleCatatanChange = (tanggal, teks) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(tanggal).padStart(2, '0')}`;
    setCatatanKalender(prev => ({ ...prev, [dateKey]: teks }));
  };

  const getCatatan = (tanggal) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(tanggal).padStart(2, '0')}`;
    return catatanKalender[dateKey] || '';
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 h-full flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-4">
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
             <h2 className="text-2xl font-bold text-blue-800">Kalender Pelayanan</h2>
             {isLocked ? (
               <p className="text-red-500 text-sm font-bold flex items-center gap-1 mt-1">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path></svg>
                 Mode Baca Saja (Terkunci)
               </p>
             ) : <p className="text-gray-500 text-sm">Ketik langsung pada tanggal untuk menambahkan jadwal.</p>}
          </div>
          <div className="flex gap-2 self-start md:self-auto">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-bold shadow-sm flex items-center gap-2">Unduh JPG</button>
            {!isLocked && <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-bold shadow-sm">Simpan</button>}
          </div>
        </div>

        <div className="bg-white p-4 border rounded-lg shadow-sm flex items-center justify-between">
          <button onClick={prevMonth} className="px-3 py-2 bg-gray-100 hover:bg-blue-50 rounded text-sm font-bold text-gray-700">&larr; <span className="hidden md:inline">Bulan Lalu</span></button>
          <h2 className="text-lg md:text-xl font-bold text-blue-800 uppercase text-center">{namaBulan[month]} {year}</h2>
          <button onClick={nextMonth} className="px-3 py-2 bg-gray-100 hover:bg-blue-50 rounded text-sm font-bold text-gray-700"><span className="hidden md:inline">Bulan Depan</span> &rarr;</button>
        </div>

        <div className="hidden md:flex bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex-col overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200 bg-blue-50">
            {namaHari.map(hari => <div key={hari} className="py-2 text-center text-sm font-bold text-blue-800 border-r last:border-r-0">{hari}</div>)}
          </div>
          <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-gray-200 gap-[1px]">
            {daysArray.map((tanggal, index) => (
              <div key={index} className={`bg-white p-2 flex flex-col min-h-[140px] transition-colors ${tanggal === null ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                {tanggal !== null && (
                  <>
                    <span className="text-sm font-bold text-gray-800 mb-1 border-b pb-1">{tanggal}</span>
                    <textarea disabled={isLocked} value={getCatatan(tanggal)} onChange={(e) => handleCatatanChange(tanggal, e.target.value)} placeholder="+" style={{ fontFamily: '"Arial Narrow", Arial, sans-serif' }} className="flex-1 w-full text-[12px] leading-tight text-gray-800 bg-transparent resize-none outline-none placeholder-gray-300 focus:placeholder-transparent overflow-y-auto custom-scrollbar disabled:opacity-80" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="md:hidden flex flex-col gap-3 pb-8">
          {daysArray.filter(t => t !== null).map((tanggal) => {
            const isSunday = namaHari[new Date(year, month, tanggal).getDay()] === "Minggu";
            return (
              <div key={`mob-${tanggal}`} className={`bg-white p-3 rounded-lg shadow-sm border ${isSunday ? 'border-red-200' : 'border-gray-200'}`}>
                 <div className={`flex justify-between items-center mb-2 border-b pb-2 ${isSunday ? 'text-red-600' : 'text-gray-800'}`}>
                   <span className="font-bold text-lg">{tanggal}</span>
                   <span className="text-sm font-bold uppercase">{namaHari[new Date(year, month, tanggal).getDay()]}</span>
                 </div>
                 <textarea disabled={isLocked} value={getCatatan(tanggal)} onChange={(e) => handleCatatanChange(tanggal, e.target.value)} placeholder="Ketik jadwal di sini..." style={{ fontFamily: '"Arial Narrow", Arial, sans-serif' }} className="w-full text-sm leading-tight text-gray-700 bg-gray-50 p-2 rounded resize-y min-h-[80px] outline-none border border-transparent disabled:opacity-80" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}