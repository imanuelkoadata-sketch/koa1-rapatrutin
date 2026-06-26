import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Topbar({ isMobileMenuOpen, setIsMobileMenuOpen, setCurrentView, currentView, userRole, periodeBulan, setPeriodeBulan }) {
  const handleLogout = async () => {
    if(window.confirm("Apakah Anda yakin ingin keluar?")) {
      await signOut(auth);
      setCurrentView('dashboard');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    // PERBAIKAN 1: z-index saya naikkan ke z-50 agar menu tidak tertutup elemen lain di halaman utama
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm relative z-50 print:hidden">
      <div className="flex items-center gap-3">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 bg-gray-100 rounded hover:bg-gray-200">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <h1 className="text-xl font-bold text-blue-800 md:hidden">Sistem Pelayanan</h1>
      </div>

      <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">
        <label className="text-xs font-bold text-blue-800 whitespace-nowrap">Bulan Kerja:</label>
        <input 
          type="month" value={periodeBulan} onChange={(e) => setPeriodeBulan(e.target.value)} 
          className="bg-white border border-blue-300 rounded px-2 py-0.5 text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500" 
        />
      </div>

      {isMobileMenuOpen && (
        /* PERBAIKAN 2: Ditambahkan max-h-[calc(100vh-80px)] dan overflow-y-auto di baris ini */
        <div className="absolute top-full left-0 w-full bg-white shadow-xl border-b border-gray-200 md:hidden flex flex-col p-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
          
          <button onClick={() => {setCurrentView('dashboard'); setIsMobileMenuOpen(false)}} className="block w-full text-left p-2 rounded-md text-gray-700 font-medium">Dashboard</button>
          
          {userRole !== 'guest' && (
            <>
              <button onClick={() => {setCurrentView('datarapat'); setIsMobileMenuOpen(false)}} className="block w-full text-left p-2 rounded-md text-gray-700 font-medium">Data Rapat</button>
              <button onClick={() => {setCurrentView('laporan'); setIsMobileMenuOpen(false)}} className="block w-full text-left p-2 rounded-md text-gray-700 font-medium">Laporan MJH</button>
              <button onClick={() => {setCurrentView('kalender'); setIsMobileMenuOpen(false)}} className="block w-full text-left p-2 rounded-md text-gray-700 font-medium">Kalender Pelayanan</button>
              <button onClick={() => {setCurrentView('agenda'); setIsMobileMenuOpen(false)}} className="block w-full text-left p-2 rounded-md text-gray-700 font-medium">Dokumen Agenda</button>
            </>
          )}
          
          <button onClick={() => {setCurrentView('cetak'); setIsMobileMenuOpen(false)}} className="block w-full text-left p-2 rounded-md text-gray-700 font-medium">Cetak Evaluasi</button>
          
          <button
            onClick={() => {setCurrentView('pusattautan'); setIsMobileMenuOpen(false)}}
            className={`block w-full text-left p-2 rounded-md font-medium transition-colors ${
              currentView === 'pusattautan' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Link
          </button>

          {userRole === 'admin' && (
            <div className="pt-2 border-t border-gray-100">
              <button onClick={() => {setCurrentView('konfigurasi'); setIsMobileMenuOpen(false)}} className="block w-full text-left p-2 rounded-md text-blue-600 font-bold">Konfigurasi Sistem</button>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 mt-2 mb-4">
            {userRole === 'guest' ? (
              <button onClick={() => {setCurrentView('login'); setIsMobileMenuOpen(false)}} className="block w-full text-left p-2 rounded-md text-white bg-blue-600 font-bold text-center">Masuk (Login)</button>
            ) : (
              <button onClick={handleLogout} className="block w-full text-left p-2 rounded-md text-red-600 font-bold bg-red-50 text-center">Keluar Sistem</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}