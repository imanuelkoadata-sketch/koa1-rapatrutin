import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Sidebar({ setCurrentView, currentView, userRole }) {
  const handleLogout = async () => {
    if(window.confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
      await signOut(auth);
      setCurrentView('dashboard');
    }
  };

  const roleDisplay = () => {
    if (userRole === 'guest') return 'Tamu Publik';
    if (userRole === 'admin') return 'Administrator';
    if (userRole === 'wakil_ketua') return 'Wakil Ketua';
    if (userRole === 'sekretaris') return 'Sekretaris';
    if (userRole === 'wasek') return 'Wakil Sekretaris 1';
    if (userRole === 'bendahara') return 'Bendahara';
    if (userRole === 'wabend') return 'Wakil Bendahara 1';
    return 'Pengguna';
  };

  const getNavClass = (viewName) => {
    return `w-full text-left p-3 rounded-md font-medium transition-colors ${
      currentView === viewName
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
    }`;
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm z-10">
      
      {/* --- HEADER --- */}
      <div className="p-6 border-b border-gray-200 flex flex-col items-center">
        {/* LOGO GAMBAR BARU */}
        <img 
          src="/logo.png" 
          alt="Logo Notulensi" 
          className="w-20 h-20 object-contain mb-2" 
        />
        {/* TEKS DIUBAH MENJADI NOTULENSI RAPAT */}
        <h1 className="text-xl font-bold text-blue-800 text-center leading-tight">Notulensi<br/>Rapat</h1>
        
        <div className={`mt-3 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider text-center ${userRole === 'guest' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'}`}>
          Akses: {roleDisplay()}
        </div>
      </div>

      {/* --- NAVIGASI --- */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <button onClick={() => setCurrentView('dashboard')} className={getNavClass('dashboard')}>Dashboard</button>
        
        {userRole !== 'guest' && (
          <>
            <button onClick={() => setCurrentView('datarapat')} className={getNavClass('datarapat')}>Data Rapat</button>
            <button onClick={() => setCurrentView('laporan')} className={getNavClass('laporan')}>Laporan MJH</button>
            <button onClick={() => setCurrentView('kalender')} className={getNavClass('kalender')}>Kalender Pelayanan</button>
            <button onClick={() => setCurrentView('agenda')} className={getNavClass('agenda')}>Dokumen Agenda</button>
          </>
        )}
        
        <button onClick={() => setCurrentView('cetak')} className={getNavClass('cetak')}>Cetak Evaluasi</button>
        <button onClick={() => setCurrentView('pusattautan')} className={getNavClass('pusattautan')}>Link</button>

        {userRole === 'admin' && (
          <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
            <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Akses Khusus Admin</p>
            <button onClick={() => setCurrentView('konfigurasi')} className={getNavClass('konfigurasi')}>Konfigurasi Sistem</button>
          </div>
        )}
      </nav>

      {/* --- FOOTER LOGIN/LOGOUT --- */}
      <div className="p-4 border-t border-gray-200">
        {userRole === 'guest' ? (
          <button onClick={() => setCurrentView('login')} className="w-full p-3 rounded-md text-white bg-blue-600 font-bold hover:bg-blue-700 transition-colors shadow-sm">Masuk (Login)</button>
        ) : (
          <button onClick={handleLogout} className="w-full p-3 rounded-md text-red-600 bg-red-50 font-bold hover:bg-red-100 transition-colors">Keluar Sistem</button>
        )}
      </div>
      
    </div>
  );
}