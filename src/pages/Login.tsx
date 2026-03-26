import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup, syncUserToFirestore, updateStreakOnLoginFn } from '../firebase';
import { LogIn, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from '../components/Logo';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncUserToFirestore(result.user);
      try {
        await updateStreakOnLoginFn();
      } catch (e) {
        console.error("Streak check failed", e);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login cancelled. Please try again.');
      } else {
        setError('Failed to sign in. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass w-full max-w-md p-8 rounded-[2.5rem] relative z-10 text-center"
      >
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-blue-600/20 blur-xl rounded-full animate-pulse" />
          <div className="relative w-full h-full bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
            <Logo size={64} />
          </div>
        </div>

        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">JOBSEEKER</h1>
        <p className="text-zinc-400 text-sm mb-8">The ultimate AI-powered placement preparation platform.</p>

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="google-btn w-full"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="w-5 h-5"
                />
                Continue with Google
              </>
            )}
          </button>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium"
            >
              {error}
            </motion.div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Sparkles size={16} className="text-zinc-500" />
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Premium UI</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <LogIn size={16} className="text-zinc-500" />
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Secure Auth</span>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 text-zinc-700 text-[10px] uppercase tracking-[0.2em] font-black">
        Built with AI Studio & Firebase
      </div>
    </div>
  );
}
