import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // <-- Ini sangat penting agar Tailwind berfungsi
import App from './App.jsx'
// Tambahkan di bawah baris import Anda
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    // Jika ada update versi terbaru, Anda bisa memunculkan toast/alert di sini
    console.log("Ada pembaruan aplikasi. Silakan muat ulang.");
  },
  onOfflineReady() {
    console.log("Aplikasi siap digunakan secara offline.");
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)