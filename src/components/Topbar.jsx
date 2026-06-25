import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Topbar({ isMobileMenuOpen, setIsMobileMenuOpen, setCurrentView, userRole, periodeBulan, setPeriodeBulan }) {
  const handleLogout = async () => {
    if(window.confirm("Apakah Anda yakin ingin keluar?")) {
      await signOut(auth);
      setCurrentView('dashboard');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm relative z-20 print:hidden">
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
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-b border-gray-200 md:hidden flex flex-col p-4 space-y-2">
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
          
          {userRole === 'admin' && (
            <div className="pt-2 border-t border-gray-100">
              <button onClick={() => {setCurrentView('konfigurasi'); setIsMobileMenuOpen(false)}} className="block w-full text-left p-2 rounded-md text-blue-600 font-bold">Konfigurasi Sistem</button>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 mt-2">
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