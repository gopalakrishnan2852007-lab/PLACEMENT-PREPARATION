import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup, syncUserToFirestore, updateStreakOnLoginFn, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase';
import { LogIn, Sparkles, Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from '../components/Logo';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Validation State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; api?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    setLoading(true);
    try {
      let result;
      if (isSignUp) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      
      await syncUserToFirestore(result.user);
      
      try {
        await updateStreakOnLoginFn();
      } catch (e) {
        console.error("Streak check failed", e);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrors({ api: 'This email is already registered. Please log in.' });
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setErrors({ api: 'Invalid email or password.' });
      } else {
        setErrors({ api: 'Authentication failed. Please check your connection and try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrors({});
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
        setErrors({ api: 'Login cancelled. Please try again.' });
      } else {
        setErrors({ api: 'Failed to sign in with Google. Please crosscheck settings.' });
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
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 bg-blue-600/20 blur-xl rounded-full animate-pulse" />
          <div className="relative w-full h-full bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
            <Logo size={48} />
          </div>
        </div>

        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">PREPTRACKER</h1>
        <p className="text-zinc-400 text-sm mb-8">The ultimate AI placement platform.</p>

        {errors.api && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center"
          >
            {errors.api}
          </motion.div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6 relative z-20">
          <div className="space-y-1 text-left">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: undefined})); }}
                placeholder="Email address"
                className={`w-full bg-zinc-900/50 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors`}
              />
            </div>
            {errors.email && <p className="text-[10px] text-red-400 font-bold ml-2">{errors.email}</p>}
          </div>

          <div className="space-y-1 text-left">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: undefined})); }}
                placeholder="Password"
                className={`w-full bg-zinc-900/50 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors`}
              />
            </div>
            {errors.password && <p className="text-[10px] text-red-400 font-bold ml-2">{errors.password}</p>}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-zinc-900 text-zinc-500 text-[10px] font-bold uppercase tracking-wider rounded-xl">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
          className="google-btn w-full relative z-20"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-5 h-5"
          />
          Google
        </button>

        <div className="mt-8 pt-6 border-t border-white/5 relative z-20 text-sm">
          <span className="text-zinc-500">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </span>
          <button 
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrors({}); }}
            className="ml-2 text-blue-400 hover:text-blue-300 font-bold transition-colors"
          >
            {isSignUp ? "Sign In" : "Create one"}
          </button>
        </div>
      </motion.div>

      <div className="absolute bottom-8 text-zinc-700 text-[10px] uppercase tracking-[0.2em] font-black">
        Built with AI Studio & Firebase
      </div>
    </div>
  );
}
