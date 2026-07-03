import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; 

export default function LoginAdmin({ setCurrentView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setCurrentView('dashboard');
    } catch (err) {
      console.error(err);
      setError('Akses Ditolak! Email atau Password salah.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-8 relative z-10 border border-gray-100">
        <div className="text-center mb-8">
          {/* LOGO GAMBAR BARU */}
          <img 
            src="/logo.png" 
            alt="Logo Login" 
            className="w-24 h-24 object-contain mx-auto mb-4" 
          />
          <h1 className="text-2xl font-bold text-gray-800">Login Sistem</h1>
          <p className="text-gray-500 mt-2 text-sm">Masuk untuk mengedit data rapat & evaluasi.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium mb-6 text-center border border-red-200">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Pengguna</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" placeholder="Contoh: mjh@koa.com" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Kata Sandi</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" required />
          </div>
          <button type="submit" disabled={isLoading} className={`w-full text-white font-bold py-3 px-4 rounded-md shadow-md transition-all ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {isLoading ? 'Memeriksa Kredensial...' : 'Masuk ke Sistem'}
          </button>
        </form>
      </div>
    </div>
  );
}