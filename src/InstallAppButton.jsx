import { useState, useEffect } from 'react';

const InstallAppButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Tangkap event sebelum prompt install muncul
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Cegah prompt bawaan browser muncul otomatis
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Tampilkan prompt install kepada pengguna
    deferredPrompt.prompt();

    // Tunggu respons dari pengguna
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Pengguna setuju menginstal aplikasi SIP MJ');
    } else {
      console.log('Pengguna menolak menginstal aplikasi');
    }

    // Reset prompt karena hanya bisa dipanggil sekali
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!isInstallable) return null; // Sembunyikan tombol jika aplikasi sudah diinstal atau tidak didukung

  return (
    <button
      onClick={handleInstallClick}
      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
      Install Aplikasi
    </button>
  );
};

export default InstallAppButton;