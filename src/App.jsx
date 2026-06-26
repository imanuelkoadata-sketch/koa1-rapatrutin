import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardContent from './components/DashboardContent';
import LoginAdmin from './components/LoginAdmin';
import LaporanMJH from './components/LaporanMJH';
import DataRapat from './components/DataRapat';
import Konfigurasi from './components/Konfigurasi';
import KalenderPelayanan from './components/KalenderPelayanan';
import Agenda from './components/Agenda';
import CetakEvaluasi from './components/CetakEvaluasi';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('guest'); 
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); 

  const [periodeBulan, setPeriodeBulan] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [catatanKalender, setCatatanKalender] = useState({});

  // --- STATE KONFIGURASI GLOBAL ---
  const [profilGereja, setProfilGereja] = useState({ induk: 'Gereja Masehi Injili di Timor (GMIT)', klasis: 'Mollo Barat', jemaat: 'Imanuel Koa' });
  
  const [profilMJH, setProfilMJH] = useState({ 
    ketua: '', 
    sekretaris: '', 
    bendahara: '',
    pengurusMJ: {} 
  });
  
  const [mataJemaatList, setMataJemaatList] = useState([{ id: 1, nama: 'Imanuel Koa' }, { id: 2, nama: 'Syalom Haususu' }]);
  const [kategoriPelayananList, setKategoriPelayananList] = useState([
    { id: 1, nama: 'Rayon 1', mataJemaat: 'Imanuel Koa' }, { id: 2, nama: 'Rayon 2', mataJemaat: 'Imanuel Koa' },
    { id: 3, nama: 'Bapak GMIT', mataJemaat: 'Imanuel Koa' }, { id: 4, nama: 'Perempuan GMIT', mataJemaat: 'Imanuel Koa' },
    { id: 5, nama: 'Pemuda', mataJemaat: 'Syalom Haususu' }, { id: 6, nama: 'PART', mataJemaat: 'Syalom Haususu' },
  ]);

  // --- STATE FORM LAPORAN ---
  const [tanggalRapat, setTanggalRapat] = useState(periodeBulan + '-01');
  const [tempatRapat, setTempatRapat] = useState('Mollo Barat'); 
  const [pelayanPA, setPelayanPA] = useState('');
  const [bacaanPA, setBacaanPA] = useState('');
  const [temaPA, setTemaPA] = useState('');
  
  const [kehadiranMajelis, setKehadiranMajelis] = useState([]);
  
  const [pembahasanList, setPembahasanList] = useState([{ id: 1, pembahasan: '', keputusan: '' }]);
  const [warnaSariList, setWarnaSariList] = useState([{ id: 2, pembahasan: '', keputusan: '' }]);

  const [kehadiranWK, setKehadiranWK] = useState([]);
  const [kegiatanWilayah, setKegiatanWilayah] = useState([{ id: 1, tanggal: '', kegiatan: '' }]);
  const [kegiatanMataJemaat, setKegiatanMataJemaat] = useState([{ id: 2, tanggal: '', kegiatan: '' }]);
  const [pelaksanaanRapatMJ, setPelaksanaanRapatMJ] = useState({ tanggal: '', mjh: '', penatua: '', diaken: '', pengajar: '', koster: '', undangan: '' });
  const [agendasMJ, setAgendasMJ] = useState(['']);
  const [keputusansMJ, setKeputusansMJ] = useState(['']);
  const [kendalainfosWK, setKendalainfosWK] = useState(['']);

  const [kehadiranJemaat, setKehadiranJemaat] = useState([]);
  const [realisasiPelayanan, setRealisasiPelayanan] = useState([]);
  const [persembahanWasek, setPersembahanWasek] = useState([{ id: 1, tanggal: '', pemberi: '', jenis: '' }]);
  const [pelayananKhusus, setPelayananKhusus] = useState([{ id: 2, tanggal: '', jenis: '' }]);
  const [kendalainfosWasek, setKendalainfosWasek] = useState(['']);
  const [pemimpinKebaktian, setPemimpinKebaktian] = useState([]);
  const [bukuAdmin, setBukuAdmin] = useState([
    { id: 'baptis', label: 'Buku Baptis', checked: false }, { id: 'sidi', label: 'Buku Sidi', checked: false },
    { id: 'nikah', label: 'Buku Nikah', checked: false }, { id: 'kelahiran', label: 'Buku Kelahiran', checked: false },
    { id: 'kematian', label: 'Buku Kematian', checked: false }, { id: 'mimbar', label: 'Buku Pelayanan Mimbar', checked: false },
    { id: 'doa', label: 'Buku Pokok Doa', checked: false }, { id: 'induk', label: 'Buku Induk Jemaat', checked: false },
    { id: 'atestasi', label: 'Buku Atestasi Masuk Keluar', checked: false }, { id: 'anggota_majelis', label: 'Buku Anggota Majelis', checked: false },
  ]);
  const [kendalainfosWasek1, setKendalainfosWasek1] = useState(['']);

  const [kasKeuangan, setKasKeuangan] = useState({ lalu: 0, terima: 0, keluar: 0, sisa: 0 });
  const [saldoLaluNatura, setSaldoLaluNatura] = useState([{ id: 1, uraian: '', jumlah: '', satuan: '' }]);
  const [penerimaanNatura, setPenerimaanNatura] = useState([{ id: 2, uraian: '', jumlah: '', satuan: '' }]);
  const [pengeluaranNatura, setPengeluaranNatura] = useState([{ id: 3, uraian: '', jumlah: '', satuan: '' }]);
  const [sisaSaldoNatura, setSisaSaldoNatura] = useState([{ id: 4, uraian: '', jumlah: '', satuan: '' }]);
  const [kendalainfosWabend, setKendalainfosWabend] = useState(['']);
  const [kendalainfosWabend1, setKendalainfosWabend1] = useState(['']);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const email = user.email;
        if (email === 'mjh@koa.com') setUserRole('admin');
        else if (email === 'wakil@ketua.com') setUserRole('wakil_ketua');
        else if (email === 'sekretaris@koa1.com') setUserRole('sekretaris');
        else if (email === 'wakilsekretaris@koa1.com') setUserRole('wasek');
        else if (email === 'bendahara@koa1.com') setUserRole('bendahara');
        else if (email === 'wakilbendahara@koa1.com') setUserRole('wabend');
        else setUserRole('user');
      } else {
        setCurrentUser(null);
        setUserRole('guest');
      }
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  // Ambil Konfigurasi Master
  useEffect(() => {
    const fetchKonfigurasi = async () => {
      try {
        const docSnap = await getDoc(doc(db, "konfigurasi", "utama"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.profilGereja) setProfilGereja(data.profilGereja);
          if (data.profilMJH) setProfilMJH(data.profilMJH); 
          if (data.mataJemaatList) setMataJemaatList(data.mataJemaatList);
          if (data.kategoriPelayananList) setKategoriPelayananList(data.kategoriPelayananList);
        }
      } catch (error) { console.error(error); }
    };
    fetchKonfigurasi();
  }, []);

  // Ambil Laporan Bulanan
  useEffect(() => {
    const fetchLaporanBulanan = async () => {
      setIsDataLoading(true);
      try {
        const docSnap = await getDoc(doc(db, "laporan_evaluasi", periodeBulan));
        if (docSnap.exists()) {
          const d = docSnap.data();
          setTanggalRapat(d.tanggalRapat || ''); setTempatRapat(d.tempatRapat || '');
          setPelayanPA(d.pelayanPA || ''); setBacaanPA(d.bacaanPA || ''); setTemaPA(d.temaPA || '');
          if (d.kehadiranMajelis) setKehadiranMajelis(d.kehadiranMajelis);
          if (d.pembahasanList) setPembahasanList(d.pembahasanList);
          if (d.warnaSariList) setWarnaSariList(d.warnaSariList);
          if (d.kehadiranWK) setKehadiranWK(d.kehadiranWK);
          if (d.kegiatanWilayah) setKegiatanWilayah(d.kegiatanWilayah);
          if (d.kegiatanMataJemaat) setKegiatanMataJemaat(d.kegiatanMataJemaat);
          if (d.pelaksanaanRapatMJ) setPelaksanaanRapatMJ(d.pelaksanaanRapatMJ);
          if (d.agendasMJ) setAgendasMJ(d.agendasMJ);
          if (d.keputusansMJ) setKeputusansMJ(d.keputusansMJ);
          if (d.kendalainfosWK) setKendalainfosWK(d.kendalainfosWK);
          if (d.kehadiranJemaat) setKehadiranJemaat(d.kehadiranJemaat);
          if (d.realisasiPelayanan) setRealisasiPelayanan(d.realisasiPelayanan); 
          if (d.persembahanWasek) setPersembahanWasek(d.persembahanWasek);
          if (d.pelayananKhusus) setPelayananKhusus(d.pelayananKhusus);
          if (d.kendalainfosWasek) setKendalainfosWasek(d.kendalainfosWasek);
          if (d.pemimpinKebaktian) setPemimpinKebaktian(d.pemimpinKebaktian);
          if (d.bukuAdmin) setBukuAdmin(d.bukuAdmin);
          if (d.kendalainfosWasek1) setKendalainfosWasek1(d.kendalainfosWasek1);
          if (d.kasKeuangan) setKasKeuangan(d.kasKeuangan);
          if (d.saldoLaluNatura) setSaldoLaluNatura(d.saldoLaluNatura);
          if (d.penerimaanNatura) setPenerimaanNatura(d.penerimaanNatura);
          if (d.pengeluaranNatura) setPengeluaranNatura(d.pengeluaranNatura);
          if (d.sisaSaldoNatura) setSisaSaldoNatura(d.sisaSaldoNatura);
          if (d.kendalainfosWabend) setKendalainfosWabend(d.kendalainfosWabend);
          if (d.kendalainfosWabend1) setKendalainfosWabend1(d.kendalainfosWabend1);
        } else {
          // JIKA BULAN BARU BELUM ADA LAPORAN (Reset State)
          setTanggalRapat(periodeBulan + '-01'); setPelayanPA(''); setBacaanPA(''); setTemaPA('');
          setKehadiranMajelis([]); // Akan diisi otomatis dari hook sinkronisasi profilMJH
          setPembahasanList([{ id: 1, pembahasan: '', keputusan: '' }]);
          setWarnaSariList([{ id: 2, pembahasan: '', keputusan: '' }]);
          setKehadiranWK([]);
          setKegiatanWilayah([{ id: 1, tanggal: '', kegiatan: '' }]);
          setKegiatanMataJemaat([{ id: 2, tanggal: '', kegiatan: '' }]);
          setPelaksanaanRapatMJ({ tanggal: '', mjh: '', penatua: '', diaken: '', pengajar: '', koster: '', undangan: '' });
          setAgendasMJ(['']); setKeputusansMJ(['']); setKendalainfosWK(['']); setKehadiranJemaat([]);
          setPersembahanWasek([{ id: 1, tanggal: '', pemberi: '', jenis: '' }]);
          setPelayananKhusus([{ id: 2, tanggal: '', jenis: '' }]); setKendalainfosWasek(['']); setPemimpinKebaktian([]);
          setKendalainfosWasek1(['']); setKasKeuangan({ lalu: 0, terima: 0, keluar: 0, sisa: 0 });
          setSaldoLaluNatura([{ id: 1, uraian: '', jumlah: '', satuan: '' }]); setPenerimaanNatura([{ id: 2, uraian: '', jumlah: '', satuan: '' }]);
          setPengeluaranNatura([{ id: 3, uraian: '', jumlah: '', satuan: '' }]); setSisaSaldoNatura([{ id: 4, uraian: '', jumlah: '', satuan: '' }]);
          setKendalainfosWabend(['']); setKendalainfosWabend1(['']);
          setBukuAdmin(bukuAdmin.map(b => ({ ...b, checked: false })));
          setRealisasiPelayanan(kategoriPelayananList.map(k => ({ ...k, realisasi: '' })));
        }
      } catch (err) { console.error(err); }
      finally { setIsDataLoading(false); }
    };
    
    fetchLaporanBulanan();
  }, [periodeBulan]);

  // HOOK SINKRONISASI PINTAR: Update otomatis jika Konfigurasi berubah, tanpa hapus centang
  useEffect(() => {
    if (!isDataLoading && profilMJH) {
      const names = new Set();
      
      // Masukkan Ketua Majelis
      if (profilMJH.ketua) names.add(profilMJH.ketua);
      
      // Loop semua jabatan Wakil di Mata Jemaat
      if (profilMJH.pengurusMJ) {
        Object.values(profilMJH.pengurusMJ).forEach(mj => {
          if (mj.wakilKetua) names.add(mj.wakilKetua);
          if (mj.wakilSekretaris) names.add(mj.wakilSekretaris);
          if (mj.wakilSekretaris1) names.add(mj.wakilSekretaris1);
          if (mj.wakilBendahara) names.add(mj.wakilBendahara);
          if (mj.wakilBendahara1) names.add(mj.wakilBendahara1);
        });
      }
      
      const uniqueNames = Array.from(names).filter(Boolean); // Hapus jika kosong
      
      if (uniqueNames.length > 0) {
        setKehadiranMajelis(prevKehadiran => {
          const currentNames = prevKehadiran.map(m => m.nama);
          
          // Cek apakah susunan nama sudah sama persis antara Konfigurasi vs Data Saat Ini
          const isSame = uniqueNames.length === currentNames.length && 
                         uniqueNames.every((name, i) => name === currentNames[i]);
                         
          if (isSame) return prevKehadiran; // Jika sudah sama, batalkan update (cegah loop)
          
          // Jika ada perbedaan, perbarui daftar nama sesuai konfigurasi baru
          return uniqueNames.map((nama, index) => {
            // Cari apakah orang ini sudah ada di state sebelumnya
            const existing = prevKehadiran.find(m => m.nama === nama);
            return {
              id: existing ? existing.id : index + 1, // Pertahankan ID lama jika ada
              nama: nama,
              hadir: existing ? existing.hadir : false // Pertahankan status centangnya
            };
          });
        });
      }
    }
  }, [profilMJH, isDataLoading]); // Hapus 'kehadiranMajelis.length' dari kurung ini

  const handleSimpanLaporanBulanan = async () => {
    try {
      const rawData = {
        tanggalRapat, tempatRapat, pelayanPA, bacaanPA, temaPA, kehadiranMajelis, pembahasanList, warnaSariList,
        kehadiranWK, kegiatanWilayah, kegiatanMataJemaat, pelaksanaanRapatMJ, agendasMJ, keputusansMJ, kendalainfosWK,
        kehadiranJemaat, realisasiPelayanan, persembahanWasek, pelayananKhusus, kendalainfosWasek, pemimpinKebaktian, bukuAdmin, kendalainfosWasek1,
        kasKeuangan, saldoLaluNatura, penerimaanNatura, pengeluaranNatura, sisaSaldoNatura, kendalainfosWabend, kendalainfosWabend1
      };
      const cleanData = JSON.parse(JSON.stringify(rawData));
      await setDoc(doc(db, "laporan_evaluasi", periodeBulan), cleanData);
      alert(`Puji Tuhan! Laporan Evaluasi Pelayanan untuk bulan [${periodeBulan}] berhasil aman tersimpan.`);
    } catch (err) { 
      console.error(err);
      alert("Gagal menyimpan data ke server."); 
    }
  };

  if (isAuthChecking) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><p className="text-xl font-bold text-blue-800 animate-pulse">Memuat Sistem...</p></div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800 relative">
      <Sidebar setCurrentView={setCurrentView} userRole={userRole} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} setCurrentView={setCurrentView} userRole={userRole} periodeBulan={periodeBulan} setPeriodeBulan={setPeriodeBulan} />
        {isDataLoading && (<div className="bg-amber-50 text-amber-700 text-xs px-4 py-2 font-bold text-center border-b border-amber-200 animate-pulse print:hidden">Sedang memuat sinkronisasi data dengan server cloud...</div>)}

        {currentView === 'login' && <LoginAdmin setCurrentView={setCurrentView} />}
        {currentView === 'dashboard' && <DashboardContent currentDate={currentDate} setCurrentDate={setCurrentDate} catatanKalender={catatanKalender} pembahasanList={pembahasanList} warnaSariList={warnaSariList} />}
        
        {currentView === 'datarapat' && (
          <DataRapat 
            userRole={userRole} handleSimpan={handleSimpanLaporanBulanan}
            pembahasanList={pembahasanList} setPembahasanList={setPembahasanList} warnaSariList={warnaSariList} setWarnaSariList={setWarnaSariList}
            tanggalRapat={tanggalRapat} setTanggalRapat={setTanggalRapat} tempatRapat={tempatRapat} setTempatRapat={setTempatRapat}
            pelayanPA={pelayanPA} setPelayanPA={setPelayanPA} bacaanPA={bacaanPA} setBacaanPA={setBacaanPA} temaPA={temaPA} setTemaPA={setTemaPA}
            kehadiranMajelis={kehadiranMajelis} setKehadiranMajelis={setKehadiranMajelis}
          />
        )}
        
        {currentView === 'laporan' && (
          <LaporanMJH 
            userRole={userRole} periodeBulan={periodeBulan} handleSimpan={handleSimpanLaporanBulanan} kategoriPelayananList={kategoriPelayananList}
            kehadiranWK={kehadiranWK} setKehadiranWK={setKehadiranWK} kegiatanWilayah={kegiatanWilayah} setKegiatanWilayah={setKegiatanWilayah}
            kegiatanMataJemaat={kegiatanMataJemaat} setKegiatanMataJemaat={setKegiatanMataJemaat} pelaksanaanRapatMJ={pelaksanaanRapatMJ} setPelaksanaanRapatMJ={setPelaksanaanRapatMJ} agendasMJ={agendasMJ} setAgendasMJ={setAgendasMJ} keputusansMJ={keputusansMJ} setKeputusansMJ={setKeputusansMJ} kendalainfosWK={kendalainfosWK} setKendalainfosWK={setKendalainfosWK}
            kehadiranJemaat={kehadiranJemaat} setKehadiranJemaat={setKehadiranJemaat} realisasiPelayanan={realisasiPelayanan} setRealisasiPelayanan={setRealisasiPelayanan} persembahanWasek={persembahanWasek} setPersembahanWasek={setPersembahanWasek} pelayananKhusus={pelayananKhusus} setPelayananKhusus={setPelayananKhusus} kendalainfosWasek={kendalainfosWasek} setKendalainfosWasek={setKendalainfosWasek}
            pemimpinKebaktian={pemimpinKebaktian} setPemimpinKebaktian={setPemimpinKebaktian} bukuAdmin={bukuAdmin} setBukuAdmin={setBukuAdmin} kendalainfosWasek1={kendalainfosWasek1} setKendalainfosWasek1={setKendalainfosWasek1}
            kasKeuangan={kasKeuangan} setKasKeuangan={setKasKeuangan} saldoLaluNatura={saldoLaluNatura} setSaldoLaluNatura={setSaldoLaluNatura} penerimaanNatura={penerimaanNatura} setPenerimaanNatura={setPenerimaanNatura} pengeluaranNatura={pengeluaranNatura} setPengeluaranNatura={setPengeluaranNatura} sisaSaldoNatura={sisaSaldoNatura} setSisaSaldoNatura={setSisaSaldoNatura} kendalainfosWabend={kendalainfosWabend} setKendalainfosWabend={setKendalainfosWabend} kendalainfosWabend1={kendalainfosWabend1} setKendalainfosWabend1={setKendalainfosWabend1}
          />
        )}
        
        {currentView === 'konfigurasi' && userRole === 'admin' && (
          <Konfigurasi 
            profilGereja={profilGereja} setProfilGereja={setProfilGereja} 
            profilMJH={profilMJH} setProfilMJH={setProfilMJH}
            mataJemaatList={mataJemaatList} setMataJemaatList={setMataJemaatList} 
            kategoriPelayananList={kategoriPelayananList} setKategoriPelayananList={setKategoriPelayananList}
          />
        )}
        
        {currentView === 'kalender' && <KalenderPelayanan userRole={userRole} currentDate={currentDate} setCurrentDate={setCurrentDate} catatanKalender={catatanKalender} setCatatanKalender={setCatatanKalender} />}
        {currentView === 'agenda' && userRole !== 'guest' && <Agenda userRole={userRole} periodeBulan={periodeBulan} />}
        
        {currentView === 'cetak' && (
          <CetakEvaluasi 
            mataJemaatList={mataJemaatList} profilMJH={profilMJH}
            periodeBulan={periodeBulan} tempatRapat={tempatRapat} tanggalRapat={tanggalRapat} profilGereja={profilGereja} pelayanPA={pelayanPA} bacaanPA={bacaanPA} temaPA={temaPA} kehadiranMajelis={kehadiranMajelis} pembahasanList={pembahasanList} warnaSariList={warnaSariList}
            kehadiranWK={kehadiranWK} kegiatanWilayah={kegiatanWilayah} kegiatanMataJemaat={kegiatanMataJemaat} pelaksanaanRapatMJ={pelaksanaanRapatMJ} agendasMJ={agendasMJ} keputusansMJ={keputusansMJ} kendalainfosWK={kendalainfosWK}
            kehadiranJemaat={kehadiranJemaat} realisasiPelayanan={realisasiPelayanan} persembahanWasek={persembahanWasek} pelayananKhusus={pelayananKhusus} kendalainfosWasek={kendalainfosWasek} pemimpinKebaktian={pemimpinKebaktian} bukuAdmin={bukuAdmin} kendalainfosWasek1={kendalainfosWasek1}
            kasKeuangan={kasKeuangan} saldoLaluNatura={saldoLaluNatura} penerimaanNatura={penerimaanNatura} pengeluaranNatura={pengeluaranNatura} sisaSaldoNatura={sisaSaldoNatura} kendalainfosWabend={kendalainfosWabend} kendalainfosWabend1={kendalainfosWabend1}
          />
        )}
      </main>
    </div>
  );
}

export default App;