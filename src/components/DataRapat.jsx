import { useState } from 'react';
import FormDataRapat from './FormDataRapat';
import LaporanRutin from './LaporanRutin';
import PembahasanProgram from './PembahasanProgram';
import WarnaSari from './WarnaSari';

export default function DataRapat({ 
  userRole, handleSimpan, // <-- Penambahan props handleSimpan
  pembahasanList, setPembahasanList, warnaSariList, setWarnaSariList,
  tanggalRapat, setTanggalRapat, tempatRapat, setTempatRapat,
  pelayanPA, setPelayanPA, bacaanPA, setBacaanPA, temaPA, setTemaPA,
  kehadiranMajelis, setKehadiranMajelis
}) {
  const [activeTab, setActiveTab] = useState('info');
  const isLocked = userRole !== 'admin'; // Hanya admin utama (MJH) yang bisa edit

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER & TOMBOL SIMPAN */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-800">Manajemen Data Rapat</h2>
            <p className="text-gray-500">Lihat atau isi kelengkapan administratif jalannya rapat di bawah ini.</p>
          </div>
          
          {/* Tombol hanya muncul jika tidak terkunci (Admin) */}
          {!isLocked && (
            <button 
              onClick={handleSimpan} 
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-bold shadow-md transition-transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
              Simpan Seluruh Data Rapat
            </button>
          )}
        </div>

        <div className="md:hidden bg-white p-4 border-b border-gray-200 rounded-t-lg shadow-sm">
          <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-blue-500 font-medium bg-blue-50 text-blue-800">
            <option value="info">Info Rapat & Kehadiran</option><option value="rutin">Laporan Rutin</option><option value="bahas">Pembahasan Program</option><option value="warna">Warna Sari</option>
          </select>
        </div>
        <div className="hidden md:flex overflow-x-auto border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
          {[{ id: 'info', label: 'Info Rapat' }, { id: 'rutin', label: 'Laporan Rutin' }, { id: 'bahas', label: 'Pembahasan' }, { id: 'warna', label: 'Warna Sari' }].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-4 px-6 font-medium text-sm transition-colors border-b-2 ${ activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>{tab.label}</button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-b-lg shadow-sm border border-t-0 border-gray-100">
          {isLocked && (
             <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-200 font-bold flex items-center gap-2">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path></svg>
               Mode Baca Saja: Hanya Administrator Utama (MJH) yang dapat mengubah data jalannya rapat.
             </div>
          )}
          
          <fieldset disabled={isLocked} className="border-none p-0 m-0 min-w-0">
            {activeTab === 'info' && <FormDataRapat tanggalRapat={tanggalRapat} setTanggalRapat={setTanggalRapat} tempatRapat={tempatRapat} setTempatRapat={setTempatRapat} pelayanPA={pelayanPA} setPelayanPA={setPelayanPA} bacaanPA={bacaanPA} setBacaanPA={setBacaanPA} temaPA={temaPA} setTemaPA={setTemaPA} kehadiranMajelis={kehadiranMajelis} setKehadiranMajelis={setKehadiranMajelis} />}
            {activeTab === 'rutin' && <LaporanRutin />}
            {activeTab === 'bahas' && <PembahasanProgram pembahasanList={pembahasanList} setPembahasanList={setPembahasanList} />}
            {activeTab === 'warna' && <WarnaSari warnaSariList={warnaSariList} setWarnaSariList={setWarnaSariList} />}
          </fieldset>
        </div>
      </div>
    </div>
  );
}