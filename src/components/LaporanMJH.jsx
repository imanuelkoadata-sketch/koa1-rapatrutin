import { useState } from 'react';
import WakilKetua from './WakilKetua';
import WakilSekretaris from './WakilSekretaris';
import WakilSekretaris1 from './WakilSekretaris1';
import WakilBendahara from './WakilBendahara';
import WakilBendahara1 from './WakilBendahara1';

export default function LaporanMJH({
  userRole, periodeBulan, handleSimpan, kategoriPelayananList,
  kehadiranWK, setKehadiranWK, kegiatanWilayah, setKegiatanWilayah, kegiatanMataJemaat, setKegiatanMataJemaat, pelaksanaanRapatMJ, setPelaksanaanRapatMJ, agendasMJ, setAgendasMJ, keputusansMJ, setKeputusansMJ, kendalainfosWK, setKendalainfosWK,
  kehadiranJemaat, setKehadiranJemaat, realisasiPelayanan, setRealisasiPelayanan, persembahanWasek, setPersembahanWasek, pelayananKhusus, setPelayananKhusus, kendalainfosWasek, setKendalainfosWasek,
  pemimpinKebaktian, setPemimpinKebaktian, bukuAdmin, setBukuAdmin, kendalainfosWasek1, setKendalainfosWasek1,
  kasKeuangan, setKasKeuangan, saldoLaluNatura, setSaldoLaluNatura, penerimaanNatura, setPenerimaanNatura, pengeluaranNatura, setPengeluaranNatura, sisaSaldoNatura, setSisaSaldoNatura, kendalainfosWabend, setKendalainfosWabend, kendalainfosWabend1, setKendalainfosWabend1
}) {
  const [activeTab, setActiveTab] = useState('wakilKetua');
  
  // STATE BARU: Mengatur apakah formulir terkunci (baca saja) atau terbuka (edit)
  const [isEditing, setIsEditing] = useState(false);

  const canEditWK = userRole === 'admin' || userRole === 'wakil_ketua';
  const canEditWasek = userRole === 'admin' || userRole === 'sekretaris';
  const canEditWasek1 = userRole === 'admin' || userRole === 'wasek';
  const canEditWabend = userRole === 'admin' || userRole === 'bendahara';
  const canEditWabend1 = userRole === 'admin' || userRole === 'wabend';

  // Fungsi khusus: Simpan & Kunci kembali
  const simpanDanKunci = () => {
    handleSimpan();      // Kirim ke Firebase
    setIsEditing(false); // Kunci kembali form
  };

  const renderLockedMsg = (canEdit) => {
    if (!canEdit) {
      return (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-200 font-bold flex items-center gap-2">
          Mode Baca Saja (Terkunci): Anda tidak memiliki hak akses untuk mengedit laporan bidang ini.
        </div>
      );
    }
    
    // Jika Punya Akses tapi belum tekan tombol Edit
    if (!isEditing) {
      return (
        <div className="mb-6 flex justify-between items-center bg-gray-50 border border-gray-300 p-3 rounded-md">
          <span className="text-sm font-medium text-gray-700">Laporan terkunci aman. Tekan tombol edit jika ingin mengubah data.</span>
          <button onClick={() => setIsEditing(true)} className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded shadow-sm">
            Buka Kunci / Edit Laporan
          </button>
        </div>
      );
    }

    // Jika sedang dalam Mode Edit
    return (
      <div className="mb-6 flex justify-between items-center bg-blue-50 border border-blue-300 p-3 rounded-md">
        <span className="text-sm font-medium text-blue-800">Mode Edit Terbuka. Jangan lupa simpan setelah selesai!</span>
        <button onClick={simpanDanKunci} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded shadow-sm">
          Simpan & Kunci Laporan [{periodeBulan}]
        </button>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div>
          <h2 className="text-2xl font-bold text-blue-800">Laporan Evaluasi MJH</h2>
          <p className="text-gray-500">Periode Aktif Kerja: <span className="font-bold underline text-blue-700">{periodeBulan}</span></p>
        </div>

        <div className="md:hidden bg-white p-4 border-b border-gray-200 rounded-t-lg shadow-sm">
          <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-blue-500 font-medium bg-blue-50 text-blue-800">
            <option value="wakilKetua">Wakil Ketua</option><option value="wasek">Wakil Sekretaris</option><option value="wasek1">Wakil Sekretaris 1</option><option value="wabend">Wakil Bendahara</option><option value="wabend1">Wakil Bendahara 1</option>
          </select>
        </div>
        <div className="hidden md:flex overflow-x-auto border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
          {[{ id: 'wakilKetua', label: 'Wakil Ketua' }, { id: 'wasek', label: 'Wakil Sekretaris' }, { id: 'wasek1', label: 'Wakil Sekretaris 1' }, { id: 'wabend', label: 'Wakil Bendahara' }, { id: 'wabend1', label: 'Wakil Bendahara 1' }].map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsEditing(false); }} className={`whitespace-nowrap py-4 px-6 font-medium text-sm transition-colors border-b-2 ${activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>{tab.label}</button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-b-lg shadow-sm border border-t-0 border-gray-100">
          {activeTab === 'wakilKetua' && (
            <>
              {renderLockedMsg(canEditWK)}
              {/* Fieldset baru akan aktif jika canEdit = true DAN isEditing = true */}
              <fieldset disabled={!(canEditWK && isEditing)} className="border-none p-0 m-0 min-w-0">
                <WakilKetua bulanLaporan={periodeBulan} kehadiranWK={kehadiranWK} setKehadiranWK={setKehadiranWK} kegiatanWilayah={kegiatanWilayah} setKegiatanWilayah={setKegiatanWilayah} kegiatanMataJemaat={kegiatanMataJemaat} setKegiatanMataJemaat={setKegiatanMataJemaat} pelaksanaanRapatMJ={pelaksanaanRapatMJ} setPelaksanaanRapatMJ={setPelaksanaanRapatMJ} agendasMJ={agendasMJ} setAgendasMJ={setAgendasMJ} keputusansMJ={keputusansMJ} setKeputusansMJ={setKeputusansMJ} kendalainfosWK={kendalainfosWK} setKendalainfosWK={setKendalainfosWK} />
              </fieldset>
            </>
          )}
          {activeTab === 'wasek' && (
            <>
              {renderLockedMsg(canEditWasek)}
              <fieldset disabled={!(canEditWasek && isEditing)} className="border-none p-0 m-0 min-w-0">
                <WakilSekretaris kategoriPelayananList={kategoriPelayananList} bulanLaporan={periodeBulan} kehadiranJemaat={kehadiranJemaat} setKehadiranJemaat={setKehadiranJemaat} realisasiPelayanan={realisasiPelayanan} setRealisasiPelayanan={setRealisasiPelayanan} persembahanWasek={persembahanWasek} setPersembahanWasek={setPersembahanWasek} pelayananKhusus={pelayananKhusus} setPelayananKhusus={setPelayananKhusus} kendalainfosWasek={kendalainfosWasek} setKendalainfosWasek={setKendalainfosWasek} handleSimpan={simpanDanKunci} />
              </fieldset>
            </>
          )}
          {activeTab === 'wasek1' && (
            <>
              {renderLockedMsg(canEditWasek1)}
              <fieldset disabled={!(canEditWasek1 && isEditing)} className="border-none p-0 m-0 min-w-0">
                <WakilSekretaris1 bulanLaporan={periodeBulan} pemimpinKebaktian={pemimpinKebaktian} setPemimpinKebaktian={setPemimpinKebaktian} bukuAdmin={bukuAdmin} setBukuAdmin={setBukuAdmin} kendalainfosWasek1={kendalainfosWasek1} setKendalainfosWasek1={setKendalainfosWasek1} handleSimpan={simpanDanKunci} />
              </fieldset>
            </>
          )}
          {activeTab === 'wabend' && (
             <>
               {renderLockedMsg(canEditWabend)}
               <fieldset disabled={!(canEditWabend && isEditing)} className="border-none p-0 m-0 min-w-0">
                 <WakilBendahara kasKeuangan={kasKeuangan} setKasKeuangan={setKasKeuangan} kendalainfosWabend={kendalainfosWabend} setKendalainfosWabend={setKendalainfosWabend} handleSimpan={simpanDanKunci} />
               </fieldset>
             </>
          )} 
          {activeTab === 'wabend1' && (
            <>
               {renderLockedMsg(canEditWabend1)}
               <fieldset disabled={!(canEditWabend1 && isEditing)} className="border-none p-0 m-0 min-w-0">
                 <WakilBendahara1 saldoLaluNatura={saldoLaluNatura} setSaldoLaluNatura={setSaldoLaluNatura} penerimaanNatura={penerimaanNatura} setPenerimaanNatura={setPenerimaanNatura} pengeluaranNatura={pengeluaranNatura} setPengeluaranNatura={setPengeluaranNatura} sisaSaldoNatura={sisaSaldoNatura} setSisaSaldoNatura={setSisaSaldoNatura} kendalainfosWabend1={kendalainfosWabend1} setKendalainfosWabend1={setKendalainfosWabend1} handleSimpan={simpanDanKunci} />
               </fieldset>
             </>
          )} 
        </div>

      </div>
    </div>
  );
}